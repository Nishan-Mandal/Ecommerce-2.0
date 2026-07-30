import { useState, useEffect, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { doc, onSnapshot } from "firebase/firestore";
import { fireDB } from "../../firebase/FirebaseConfig";
import { clearCart } from "../../redux/cartSlice.jsx";
import { paymentService } from "../../services/payment/paymentService";
import { userService } from "../../services/user/userService";
import useAuth from "../auth/useAuth";

/**
 * Checkout State Machine Stages:
 *  idle -> loading -> ready -> submitting -> payment_modal -> processing -> success | error
 */
export function useCheckout() {
  const { user } = useAuth();
  const cart = useSelector((s) => s.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Address State
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [addressLoading, setAddressLoading] = useState(true);
  const [addressFormOpen, setAddressFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  // Coupon State
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState("ONLINE");

  // Checkout Flow State
  const [stage, setStage] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [placedOrderId, setPlacedOrderId] = useState(null);

  const unsubscribeRef = useRef(null);

  // Derived calculations (display only)
  const subtotal = cart.reduce((acc, item) => acc + Number(item.price || 0) * item.quantity, 0);
  const productDiscount = cart.reduce(
    (acc, item) => acc + (Number(item.originalPrice || item.price || 0) - Number(item.price || 0)) * item.quantity,
    0
  );
  const couponDiscount = appliedCoupon?.discountAmount || 0;
  const shippingCharge = 0;
  const estimatedTotal = Math.max(0, subtotal - couponDiscount + shippingCharge);
  const selectedAddress = addresses.find((a) => a.addressId === selectedAddressId) || null;

  // Load Addresses
  const loadAddresses = useCallback(async () => {
    const uid = user?.user?.uid || user?.uid;
    if (!uid) {
      setAddressLoading(false);
      return;
    }
    setAddressLoading(true);
    try {
      const addrs = await userService.getAddresses(uid);
      setAddresses(addrs);
      if (addrs.length > 0) {
        const defaultAddr = addrs.find((a) => a.isDefault) || addrs[0];
        setSelectedAddressId(defaultAddr.addressId);
      } else {
        // Auto prompt to add address if no addresses exist
        setAddressFormOpen(true);
      }
    } catch (err) {
      console.error("Error loading addresses:", err);
    } finally {
      setAddressLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  const handleAddAddress = useCallback(async (formData) => {
    const uid = user?.user?.uid || user?.uid;
    if (!uid) return;
    const newAddr = await userService.addAddress(uid, formData);
    setAddresses((prev) => [...prev, newAddr]);
    setSelectedAddressId(newAddr.addressId);
    setAddressFormOpen(false);
    toast.success("Address saved!");
  }, [user]);

  const handleUpdateAddress = useCallback(async (addressId, formData) => {
    const uid = user?.user?.uid || user?.uid;
    if (!uid) return;
    const updated = await userService.updateAddress(uid, addressId, formData);
    setAddresses((prev) => prev.map((a) => (a.addressId === addressId ? updated : a)));
    setAddressFormOpen(false);
    setEditingAddress(null);
    toast.success("Address updated!");
  }, [user]);

  const handleDeleteAddress = useCallback(async (addressId) => {
    const uid = user?.user?.uid || user?.uid;
    if (!uid) return;
    await userService.deleteAddress(uid, addressId);
    setAddresses((prev) => {
      const updated = prev.filter((a) => a.addressId !== addressId);
      if (updated.length === 0) setAddressFormOpen(true);
      return updated;
    });
    if (selectedAddressId === addressId) {
      const remaining = addresses.filter((a) => a.addressId !== addressId);
      setSelectedAddressId(remaining[0]?.addressId || null);
    }
    toast.success("Address removed.");
  }, [user, selectedAddressId, addresses]);

  const openEditAddress = useCallback((address) => {
    setEditingAddress(address);
    setAddressFormOpen(true);
  }, []);

  const closeAddressForm = useCallback(() => {
    setAddressFormOpen(false);
    setEditingAddress(null);
  }, []);

  // Coupon Actions
  const handleApplyCoupon = useCallback(async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code.");
      return;
    }
    setCouponLoading(true);
    setCouponError("");
    try {
      const res = await paymentService.validateCoupon(couponCode.trim(), subtotal);
      if (res?.valid) {
        setAppliedCoupon({ code: res.code, type: res.type, discountValue: res.discountValue, discountAmount: res.discountAmount });
        setCouponError("");
        toast.success(`Coupon "${res.code}" applied! You save ₹${Number(res.discountAmount).toFixed(2)}`);
      } else {
        const errorMsg = res?.message || "Invalid or expired coupon code.";
        setCouponError(errorMsg);
        toast.error(errorMsg);
        setAppliedCoupon(null);
      }
    } catch (err) {
      const errorMsg = err?.message || "Invalid or expired coupon code.";
      setCouponError(errorMsg);
      toast.error(errorMsg);
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  }, [couponCode, subtotal]);

  const handleRemoveCoupon = useCallback(() => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  }, []);

  // Firestore Order Listener
  const listenForOrderPlaced = useCallback((orderId) => {
    setPlacedOrderId(orderId);
    setStage("processing");
    const orderRef = doc(fireDB, "orders", orderId);
    const unsub = onSnapshot(orderRef, (snap) => {
      if (!snap.exists()) return;
      const data = snap.data();
      if (data.orderStatus === "PLACED") {
        if (unsubscribeRef.current) unsubscribeRef.current();
        dispatch(clearCart());
        setStage("success");
        toast.success("Order confirmed!");
        navigate("/profile?tab=orders");
      } else if (data.orderStatus === "PAYMENT_FAILED") {
        if (unsubscribeRef.current) unsubscribeRef.current();
        setStage("error");
        setErrorMessage("Payment failed. Please try again.");
        toast.error("Payment failed. Please try again.");
      }
    }, (err) => {
      console.error("Order listener error:", err);
    });
    unsubscribeRef.current = unsub;
    setTimeout(() => {
      if (unsubscribeRef.current) unsubscribeRef.current();
    }, 180000);
  }, [dispatch, navigate]);

  useEffect(() => {
    return () => { if (unsubscribeRef.current) unsubscribeRef.current(); };
  }, []);

  // Main Checkout Submit
  const handleProceedToPayment = useCallback(async () => {
    if (cart.length === 0) { toast.error("Your cart is empty."); return; }
    if (!selectedAddress) { toast.error("Please select a shipping address."); return; }
    setStage("submitting");
    setErrorMessage("");
    try {
      const itemsPayload = cart.map((item) => ({
        productId: item.id || item.productId || "custom_item",
        variantId: item.selectedVariant
          ? item.selectedVariant.variantId || item.selectedVariant.sku || item.selectedVariant.id || null
          : null,
        quantity: item.quantity,
        title: item.title || item.productName || "Product Item",
        price: item.price,
        originalPrice: item.originalPrice || item.price,
        imageUrl: item.imageUrl || item.image || item.productImage || (Array.isArray(item.images) ? item.images[0] : null) || "",
        image: item.imageUrl || item.image || item.productImage || (Array.isArray(item.images) ? item.images[0] : null) || "",
        productImage: item.imageUrl || item.image || item.productImage || (Array.isArray(item.images) ? item.images[0] : null) || "",
      }));

      if (paymentMethod === "ONLINE") {
        const payOrder = await paymentService.createPaymentOrder({
          items: itemsPayload,
          shippingAddress: selectedAddress,
          couponCode: appliedCoupon?.code || "",
        });
        setStage("payment_modal");
        const result = await paymentService.openRazorpayCheckout({
          paymentId: payOrder.paymentId,
          gatewayOrderId: payOrder.gatewayOrderId,
          amount: payOrder.amount,
          currency: payOrder.currency,
          keyId: payOrder.keyId,
          userProfile: { name: selectedAddress.fullName, phone: selectedAddress.phone, email: user?.user?.email },
          onSuccess: async (razorpayResponse) => {
            setStage("processing");
            try {
              // Instant client-side verification
              await paymentService.verifyPayment({
                razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                razorpay_order_id: razorpayResponse.razorpay_order_id,
                razorpay_signature: razorpayResponse.razorpay_signature,
                orderId: payOrder.orderId,
              });
              dispatch(clearCart());
              setStage("success");
              toast.success("Order placed successfully!");
              navigate("/profile?tab=orders");
            } catch (vErr) {
              console.error("Client verify error:", vErr);
              // Fallback to Firestore order status listener with 5s timeout
              listenForOrderPlaced(payOrder.orderId);
              setTimeout(() => {
                dispatch(clearCart());
                toast.info("Payment completed. Redirecting to your orders...");
                navigate("/profile?tab=orders");
              }, 5000);
            }
          },
          onFailure: (errMsg) => {
            setStage("error");
            setErrorMessage(errMsg || "Payment cancelled or failed.");
            toast.error(errMsg || "Payment cancelled.");
          },
        });
        if (!result.success && result.cancelled) setStage("ready");
      } else {
        const { orderService } = await import("../../services/order/orderService");
        const { Timestamp } = await import("firebase/firestore");
        await orderService.createOrder({
          items: cart,
          addressInfo: {
            name: selectedAddress.fullName,
            address: [selectedAddress.houseNo, selectedAddress.street].filter(Boolean).join(", "),
            pincode: selectedAddress.pincode,
            phoneNumber: selectedAddress.phone,
          },
          date: Timestamp.now(),
          edDate: new Date(new Date().setDate(new Date().getDate() + 7)),
          email: user?.user?.email,
          userid: user?.user?.uid,
          status: "Order Placed",
          totalAmount: estimatedTotal + 40,
          paymentMode: "Cash On Delivery",
          isCustom: false,
          paymentId: null,
        });
        dispatch(clearCart());
        toast.success("Order placed! Cash on Delivery.");
        navigate("/profile?tab=orders");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      const msg = err?.message || "Something went wrong. Please try again.";
      setStage("error");
      setErrorMessage(msg);
      toast.error(msg);
    }
  }, [cart, selectedAddress, paymentMethod, appliedCoupon, user, estimatedTotal, listenForOrderPlaced, dispatch, navigate]);

  const handleRetry = useCallback(() => { setStage("ready"); setErrorMessage(""); }, []);

  return {
    addresses, selectedAddressId, selectedAddress, addressLoading, addressFormOpen, editingAddress,
    couponCode, appliedCoupon, couponLoading, couponError,
    paymentMethod, stage, errorMessage, placedOrderId, cart,
    subtotal, productDiscount, couponDiscount, shippingCharge, estimatedTotal,
    setSelectedAddressId, setAddressFormOpen, setCouponCode, setPaymentMethod,
    handleAddAddress, handleUpdateAddress, handleDeleteAddress, openEditAddress, closeAddressForm,
    handleApplyCoupon, handleRemoveCoupon, handleProceedToPayment, handleRetry,
  };
}
