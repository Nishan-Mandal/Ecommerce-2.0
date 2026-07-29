import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore";
import { fireDB } from "../../firebase/FirebaseConfig";
import { toast } from "react-toastify";
import { FaExclamationTriangle } from "react-icons/fa";

import OrderDetailHeaderSection from "./sections/OrderDetailHeaderSection";
import OrderFulfillmentSection from "./sections/OrderFulfillmentSection";
import OrderPurchasedItemsSection from "./sections/OrderPurchasedItemsSection";
import OrderHistoryAuditSection from "./sections/OrderHistoryAuditSection";
import OrderCustomerInfoSection from "./sections/OrderCustomerInfoSection";
import OrderPaymentSummarySection from "./sections/OrderPaymentSummarySection";
import OrderLogisticsSection from "./sections/OrderLogisticsSection";
import OrderMetadataSection from "./sections/OrderMetadataSection";
import { OrderCancelModal, OrderTrackingModal } from "./sections/OrderModals";

// Allowed Status Flow
const STATUS_STEPS = [
  "PAYMENT_PENDING",
  "PLACED",
  "CONFIRMED",
  "PACKED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

const STATUS_BADGE_STYLES = {
  PAYMENT_PENDING: "bg-amber-100 text-amber-800 border-amber-200",
  PLACED: "bg-blue-100 text-blue-800 border-blue-200",
  CONFIRMED: "bg-indigo-100 text-indigo-800 border-indigo-200",
  PACKED: "bg-purple-100 text-purple-800 border-purple-200",
  SHIPPED: "bg-cyan-100 text-cyan-800 border-cyan-200",
  OUT_FOR_DELIVERY: "bg-orange-100 text-orange-800 border-orange-200",
  DELIVERED: "bg-emerald-100 text-emerald-800 border-emerald-200",
  CANCELLED: "bg-rose-100 text-rose-800 border-rose-200",
};

const PAYMENT_BADGE_STYLES = {
  Pending: "bg-amber-100 text-amber-700 border-amber-200",
  Success: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Paid: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Failed: "bg-rose-100 text-rose-700 border-rose-200",
  Refunded: "bg-blue-100 text-blue-700 border-blue-200",
};

function formatDate(dateVal) {
  if (!dateVal) return "N/A";
  if (typeof dateVal === "string") return dateVal;
  if (typeof dateVal === "number") return new Date(dateVal).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  if (dateVal?.seconds !== undefined) {
    return new Date(dateVal.seconds * 1000).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  }
  if (dateVal?.toDate && typeof dateVal.toDate === "function") {
    return dateVal.toDate().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  }
  if (dateVal instanceof Date) return dateVal.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  return "N/A";
}

function copyToClipboard(text, label = "Copied to clipboard!") {
  if (!text) return;
  navigator.clipboard.writeText(text);
  toast.success(label);
}

export default function AdminOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);

  // Tracking Edit Form
  const [trackingForm, setTrackingForm] = useState({
    courier: "",
    trackingId: "",
    trackingUrl: "",
  });

  const fetchOrder = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const docRef = doc(fireDB, "orders", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() };
        setOrder(data);
        setTrackingForm({
          courier: data.tracking?.courier || "",
          trackingId: data.tracking?.trackingId || "",
          trackingUrl: data.tracking?.trackingUrl || "",
        });
      } else {
        toast.error("Order not found in database.");
        setOrder(null);
      }
    } catch (err) {
      console.error("Error fetching order detail:", err);
      toast.error("Failed to load order details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleUpdateStatus = async (newStatus) => {
    if (!order) return;
    if (newStatus === "CANCELLED") {
      setShowCancelModal(true);
      return;
    }
    await executeStatusChange(newStatus);
  };

  const executeStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      const docRef = doc(fireDB, "orders", id);
      const now = Timestamp.now();

      const historyEntry = {
        status: newStatus,
        timestamp: now,
        updatedBy: "ADMIN",
      };

      const updatePayload = {
        orderStatus: newStatus,
        status: newStatus,
        updatedAt: now,
        statusHistory: arrayUnion(historyEntry),
      };

      if (newStatus === "DELIVERED") {
        updatePayload.deliveredAt = now;
        updatePayload["payment.status"] = "Success";
      } else if (newStatus === "CANCELLED") {
        updatePayload.cancelledAt = now;
      }

      await updateDoc(docRef, updatePayload);
      toast.success(`Order status updated to ${newStatus}`);
      setShowCancelModal(false);
      fetchOrder();
    } catch (err) {
      console.error("Error updating order status:", err);
      toast.error("Failed to update status.");
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveTracking = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const docRef = doc(fireDB, "orders", id);
      const now = Timestamp.now();
      await updateDoc(docRef, {
        tracking: {
          courier: trackingForm.courier,
          trackingId: trackingForm.trackingId,
          trackingUrl: trackingForm.trackingUrl,
          updatedAt: now,
        },
        updatedAt: now,
      });
      toast.success("Tracking information updated successfully!");
      setShowTrackingModal(false);
      fetchOrder();
    } catch (err) {
      console.error("Error saving tracking:", err);
      toast.error("Failed to update tracking.");
    } finally {
      setUpdating(false);
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="h-10 w-48 bg-border-base/40 animate-pulse rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-40 bg-border-base/40 animate-pulse rounded-2xl" />
            <div className="h-60 bg-border-base/40 animate-pulse rounded-2xl" />
            <div className="h-80 bg-border-base/40 animate-pulse rounded-2xl" />
          </div>
          <div className="space-y-6">
            <div className="h-60 bg-border-base/40 animate-pulse rounded-2xl" />
            <div className="h-40 bg-border-base/40 animate-pulse rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-12 text-center space-y-4 max-w-md mx-auto">
        <FaExclamationTriangle className="text-4xl text-amber-500 mx-auto" />
        <h2 className="text-lg font-bold text-text-base">Order Not Found</h2>
        <p className="text-xs text-text-muted">The requested order ID does not exist or has been deleted.</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-sm hover:opacity-90 transition cursor-pointer"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  // Normalized Fields
  const orderId = order.orderId || order.id || id;
  const currentStatus = order.orderStatus || order.status || "PLACED";
  const sAddr = order.shippingAddress || order.addressInfo || {};

  const customerName = sAddr.fullName || sAddr.name || order.userProfile?.name || "N/A";
  const customerPhone = sAddr.phone || sAddr.phoneNumber || order.userProfile?.phone || "N/A";
  const customerEmail = order.email || order.userEmail || order.userProfile?.email || "N/A";
  const addressType = sAddr.addressType || sAddr.type || "HOME";

  const fullStreet = [sAddr.houseNo, sAddr.buildingName, sAddr.street, sAddr.landmark].filter(Boolean).join(", ") || sAddr.address || "N/A";
  const city = sAddr.city || "N/A";
  const state = sAddr.state || "N/A";
  const pincode = sAddr.pincode || "N/A";

  const productsList = order.products || order.items || order.cart || [];
  const rawSubtotal = order.pricing?.subtotal ?? order.totalAmount ?? 0;
  const subtotal = typeof rawSubtotal === "number" ? rawSubtotal : parseFloat(rawSubtotal) || 0;
  const couponDiscount = Number(order.pricing?.couponDiscount ?? order.coupon?.discountValue ?? 0);
  const shippingCharge = Number(order.pricing?.shippingCharge ?? 40);
  const grandTotal = Number(order.pricing?.grandTotal ?? order.totalAmount ?? (subtotal - couponDiscount + shippingCharge));

  const paymentStatus = order.payment?.status || (currentStatus === "DELIVERED" ? "Success" : "Paid");
  const paymentGateway = order.payment?.gateway || order.paymentMode || order.paymentInfo?.method || "ONLINE";
  const paymentMethod = order.payment?.method || order.paymentMode || "Razorpay / UPI";
  const paymentId = order.payment?.paymentId || order.paymentId || order.id || "N/A";

  const tracking = order.tracking || null;
  const history = Array.isArray(order.statusHistory) ? order.statusHistory : [];
  const currentStepIndex = STATUS_STEPS.indexOf(currentStatus);

  return (
    <div className="p-4 sm:p-6 max-w-8xl mx-auto space-y-6 text-text-base">
      {/* Header Section */}
      <OrderDetailHeaderSection
        orderId={orderId}
        createdAt={order.createdAt || order.date}
        updatedAt={order.updatedAt}
        currentStatus={currentStatus}
        paymentStatus={paymentStatus}
        statusBadgeStyles={STATUS_BADGE_STYLES}
        paymentBadgeStyles={PAYMENT_BADGE_STYLES}
        formatDate={formatDate}
        copyToClipboard={copyToClipboard}
        onBack={() => navigate(-1)}
        onRefresh={fetchOrder}
        onPrint={handlePrintInvoice}
        loading={loading}
      />

      {/* 2-Column Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (70%) */}
        <div className="lg:col-span-2 space-y-6">
          <OrderFulfillmentSection
            currentStatus={currentStatus}
            statusSteps={STATUS_STEPS}
            currentStepIndex={currentStepIndex}
            updating={updating}
            cancelledAt={order.cancelledAt}
            updatedAt={order.updatedAt}
            formatDate={formatDate}
            onUpdateStatus={handleUpdateStatus}
          />
             <OrderPurchasedItemsSection
            productsList={productsList}
          />
           <OrderLogisticsSection
            tracking={tracking}
            onOpenTrackingModal={() => setShowTrackingModal(true)}
          />

       

          <OrderHistoryAuditSection
            history={history}
            currentStatus={currentStatus}
            createdAt={order.createdAt || order.date}
            formatDate={formatDate}
          />
        </div>

        {/* Right Sticky Sidebar (30%) */}
        <div className="space-y-6 lg:sticky lg:top-6">
          <OrderCustomerInfoSection
            customerName={customerName}
            customerPhone={customerPhone}
            customerEmail={customerEmail}
            addressType={addressType}
            fullStreet={fullStreet}
            city={city}
            state={state}
            pincode={pincode}
            copyToClipboard={copyToClipboard}
          />

          <OrderPaymentSummarySection
            subtotal={subtotal}
            couponDiscount={couponDiscount}
            shippingCharge={shippingCharge}
            grandTotal={grandTotal}
            paymentGateway={paymentGateway}
            paymentMethod={paymentMethod}
            paymentId={paymentId}
            copyToClipboard={copyToClipboard}
          />
          {/* <OrderMetadataSection
            userId={order.userId || order.userid}
            itemCount={productsList.length}
          /> */}
        </div>
      </div>

      {/* Modals */}
      <OrderCancelModal
        isOpen={showCancelModal}
        orderId={orderId}
        updating={updating}
        onClose={() => setShowCancelModal(false)}
        onConfirmCancel={() => executeStatusChange("CANCELLED")}
      />

      <OrderTrackingModal
        isOpen={showTrackingModal}
        trackingForm={trackingForm}
        setTrackingForm={setTrackingForm}
        updating={updating}
        onClose={() => setShowTrackingModal(false)}
        onSaveTracking={handleSaveTracking}
      />
    </div>
  );
}
