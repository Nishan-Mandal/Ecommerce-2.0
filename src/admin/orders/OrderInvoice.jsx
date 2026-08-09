import React, { useRef, useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { doc, getDoc } from "firebase/firestore";
import { fireDB } from "../../firebase/FirebaseConfig";
import { configureService } from "../../services/configure/configureService";
import { FaPrint, FaArrowLeft } from "react-icons/fa";

/**
 * OrderInvoice Component
 * Printable Tax Invoice with dynamic company info from db/config and accurate item price fallbacks.
 */
const OrderInvoice = ({ orderData: propOrder }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const invoiceRef = useRef(null);

  const [order, setOrder] = useState(propOrder || null);
  const [siteConfig, setSiteConfig] = useState(null);
  const [loading, setLoading] = useState(!propOrder && Boolean(id));
  const [error, setError] = useState(null);

  // Fetch Order and Site Config
  useEffect(() => {
    const loadInvoiceData = async () => {
      try {
        setLoading(true);

        // Fetch site config from db
        try {
          const cfg = await configureService.getSiteConfig();
          if (cfg) setSiteConfig(cfg);
        } catch (cfgErr) {
          console.error("Error fetching site config for invoice:", cfgErr);
        }

        // Fetch order from DB if not passed as prop
        if (!propOrder && id) {
          const docRef = doc(fireDB, "orders", id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setOrder({ id: docSnap.id, ...docSnap.data() });
          } else {
            setError("Order details not found in database.");
          }
        }
      } catch (err) {
        console.error("Error loading invoice data:", err);
        setError("Failed to load order for invoice.");
      } finally {
        setLoading(false);
      }
    };

    loadInvoiceData();
  }, [id, propOrder]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] ">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-text-muted">Generating Tax Invoice...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center space-y-4">
        <h2 className="text-xl font-bold text-text-base">{error || "Invoice Not Found"}</h2>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-xs hover:bg-primary-hover transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Dynamic Company Details from DB/Config
  const storeName = siteConfig?.companyName?.trim() || "Ecommerce Store";
  const storeTagline = siteConfig?.companyTagline || "";
  const storeLogo = siteConfig?.companyLogo || "";
  const storeAddressObj = siteConfig?.address || {};
  const storeAddress = [
    storeAddressObj.line1,
    storeAddressObj.line2,
    storeAddressObj.city,
    storeAddressObj.state,
    storeAddressObj.pincode
  ].filter(Boolean).join(", ") || "Main Street, City Hub";

  const rawPhoneObj = siteConfig?.phones?.[0];
  const storePhone = typeof rawPhoneObj === "object" && rawPhoneObj !== null
    ? (rawPhoneObj.number || rawPhoneObj.phone || "")
    : String(rawPhoneObj || "");

  const rawEmailObj = siteConfig?.emails?.[0];
  const storeEmail = typeof rawEmailObj === "object" && rawEmailObj !== null
    ? (rawEmailObj.email || "")
    : String(rawEmailObj || "");

  const website = "www.needmate.com";

  // Map order data safely
  const orderId = order.orderId || order.docId || order.id || id || "N/A";
  const invoiceNumber = order.invoiceNumber || `INV-${String(orderId).replace("#", "").slice(-8).toUpperCase()}`;

  const rawDate = order.createdAt || order.date;
  let formattedDate = "N/A";
  let formattedTime = "N/A";
  if (rawDate) {
    const d = rawDate.seconds ? new Date(rawDate.seconds * 1000) : new Date(rawDate);
    if (!isNaN(d.getTime())) {
      formattedDate = d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
      formattedTime = d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    }
  }

  const sAddr = order.shippingAddress || {};
  const aInfo = order.addressInfo || {};

  const customerName = aInfo.name || aInfo.fullName || sAddr.fullName || order.userProfile?.name || "Customer Name";
  const customerEmail = order.email || order.userEmail || order.userProfile?.email || "N/A";
  const customerPhone = aInfo.phoneNumber || aInfo.phone || sAddr.phone || order.userProfile?.phone || "N/A";
  const fullAddress = aInfo.address || [sAddr.houseNo, sAddr.street, sAddr.landmark, sAddr.city, sAddr.state].filter(Boolean).join(", ") || "N/A";
  const pincode = aInfo.pincode || sAddr.pincode || "N/A";

  const productsList = order.products || order.items || order.cart || [];
  const isCustom = Boolean(order.isCustom);

  const subtotal = Number(order.pricing?.subtotal ?? order.subtotal ?? order.totalAmount ?? 0);
  const couponDiscount = Number(order.pricing?.couponDiscount ?? order.couponDiscount ?? 0);
  const shippingCharge = Number(order.pricing?.shippingCharge ?? order.shippingCharge ?? 0);
  const grandTotal = Number(order.pricing?.grandTotal ?? order.totalAmount ?? order.amount ?? 0);

  const paymentMode = order.paymentMode || order.paymentInfo?.method || order.payment?.gateway || "Online Payment";
  const paymentId = order.paymentId || order.payment?.paymentId || order.gatewayOrderId || "N/A";
  const paymentStatus = order.paymentStatus || (order.orderStatus === "DELIVERED" ? "PAID" : "PAID");

  return (
    <div className="max-w-4xl mx-auto p-1 sm:p-2 space-y-2">
      {/* Top Action Toolbar (Hidden during print) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-bg-surface rounded-2xl border border-border-base shadow-xs print:hidden">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-bg-base hover:bg-bg-base/80 border border-border-base text-text-base text-xs font-bold transition cursor-pointer"
        >
          <FaArrowLeft size={11} />
          <span>Back to Order</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-black shadow-md hover:bg-primary-hover transition active:scale-95 cursor-pointer"
          >
            <FaPrint size={13} />
            <span>Print Invoice</span>
          </button>
        </div>
      </div>

      {/* Printable Invoice Container */}
      <div
        ref={invoiceRef}
        id="invoice-printable-area"
        className="bg-white text-gray-900 p-8 rounded-2xl border border-gray-200 shadow-xl font-sans print:shadow-none print:border-none print:p-0 print:m-0 print:w-full print:max-w-none"
      >
        {/* Print CSS Rules */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @media print {
              body {
                background: white !important;
                color: black !important;
                margin: 0 !important;
                padding: 0 !important;
              }
              body * {
                visibility: hidden !important;
              }
              #invoice-printable-area, #invoice-printable-area * {
                visibility: visible !important;
              }
              #invoice-printable-area {
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                box-shadow: none !important;
                border: none !important;
                padding: 20px !important;
                margin: 0 !important;
              }
              .print\\:hidden {
                display: none !important;
              }
            }
          `
        }} />

        {/* HEADER SECTION */}
        <header className="pb-6 mb-6 border-b-2 border-gray-900">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                {storeLogo && (
                  <img src={storeLogo} alt={storeName} className="h-8 object-contain" />
                )}
                <h1 className="text-2xl font-black tracking-wider text-gray-900 uppercase">
                  TAX INVOICE
                </h1>
              </div>
              <p className="text-sm font-extrabold text-gray-900">{storeName}</p>
              {storeTagline && <p className="text-xs italic text-gray-600">{storeTagline}</p>}
              <p className="text-xs text-gray-500 mt-0.5">{storeAddress}</p>
              {(storePhone || storeEmail) && (
                <p className="text-[11px] text-gray-500">
                  {storePhone && <span>Tel: {storePhone} </span>}
                  {storeEmail && <span>| Email: {storeEmail}</span>}
                </p>
              )}
              <p className="text-xs text-gray-500 font-mono mt-0.5">{website}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right space-y-1 text-xs">
                <div>
                  <span className="text-gray-500 uppercase tracking-wider text-[10px] block font-bold">Invoice No.</span>
                  <span className="font-mono font-black text-sm text-gray-900">{invoiceNumber}</span>
                </div>
                <div>
                  <span className="text-gray-500 uppercase tracking-wider text-[10px] block font-bold">Order Reference</span>
                  <span className="font-mono font-bold text-xs text-gray-800">#{orderId}</span>
                </div>
                <div className="text-[11px] text-gray-600 font-medium">
                  Date: <span className="font-bold text-gray-900">{formattedDate}</span> ({formattedTime})
                </div>
              </div>

              {/* QR Code */}
              <div className="p-1.5 border border-gray-300 rounded-lg bg-white shrink-0">
                <QRCodeSVG
                  value={JSON.stringify({
                    invoice: invoiceNumber,
                    order: orderId,
                    date: formattedDate,
                    amount: grandTotal,
                    status: paymentStatus,
                    seller: storeName
                  })}
                  size={72}
                  level={"H"}
                  includeMargin={false}
                />
              </div>
            </div>
          </div>
        </header>

        {/* ADDRESSES & SELLER SECTION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-xs p-4 bg-gray-50 border border-gray-200 rounded-xl">
          {/* Billed & Shipped To */}
          <div className="space-y-1">
            <h3 className="font-black text-gray-900 uppercase tracking-wider text-[10px]">
              Customer Details (Billed & Shipped To):
            </h3>
            <p className="font-extrabold text-sm text-gray-900">{customerName}</p>
            <p className="text-gray-700">{fullAddress}</p>
            <p className="font-bold text-gray-800">Pincode: {pincode}</p>
            <p className="text-gray-600">Phone: {customerPhone}</p>
            <p className="text-gray-600">Email: {customerEmail}</p>
          </div>

          {/* Payment Info */}
          <div className="space-y-1.5 sm:border-l sm:border-gray-200 sm:pl-4">
            <h3 className="font-black text-gray-900 uppercase tracking-wider text-[10px]">
              Payment & Logistics Info:
            </h3>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Mode:</span>
              <span className="font-bold text-gray-900 uppercase">{paymentMode}</span>
            </div>
            {paymentId && (
              <div className="flex justify-between">
                <span className="text-gray-600">Payment ID:</span>
                <span className="font-mono font-bold text-gray-900 text-[11px] truncate max-w-[160px]">{paymentId}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Status:</span>
              <span className="font-black text-emerald-700 uppercase">{paymentStatus}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Order Status:</span>
              <span className="font-black text-blue-700 uppercase">{order.orderStatus || "CONFIRMED"}</span>
            </div>
          </div>
        </div>

        {/* PRODUCTS DETAILS TABLE */}
        <div className="mb-6 border border-gray-300 rounded-lg overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300 text-gray-700 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-3 w-12 text-center border-r border-gray-300">#</th>
                <th className="p-3 border-r border-gray-300">Item Description</th>
                <th className="p-3 w-16 text-center border-r border-gray-300">Qty</th>
                <th className="p-3 w-28 text-right border-r border-gray-300">Unit Price</th>
                <th className="p-3 w-28 text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-800">
              {isCustom ? (
                <tr className="h-10">
                  <td className="p-3 text-center border-r border-gray-300 font-bold">1</td>
                  <td className="p-3 border-r border-gray-300">
                    <p className="font-extrabold text-gray-900">{order.itemInfo?.selectedDrawingType || "Custom Drawing Artwork"}</p>
                    <p className="text-[10px] text-gray-500">Sheet: {order.itemInfo?.selectedSheetType || "Standard"}</p>
                  </td>
                  <td className="p-3 text-center border-r border-gray-300 font-bold">1</td>
                  <td className="p-3 text-right border-r border-gray-300 font-mono">₹{grandTotal.toLocaleString("en-IN")}</td>
                  <td className="p-3 text-right font-black font-mono">₹{grandTotal.toLocaleString("en-IN")}</td>
                </tr>
              ) : productsList.length === 0 ? (
                <tr className="h-10">
                  <td colSpan="5" className="p-4 text-center text-gray-500 italic">
                    No itemized product details available.
                  </td>
                </tr>
              ) : (
                productsList.map((item, idx) => {
                  const itemTitle = item.title || item.productName || item.name || "Product Item";
                  const itemQty = Number(item.quantity || item.qty || 1);

                  // Extract unit price with full property fallbacks
                  let rawPrice = Number(
                    item.price ??
                    item.sellingPrice ??
                    item.unitPrice ??
                    item.offerPrice ??
                    item.discountPrice ??
                    item.salePrice ??
                    item.finalPrice ??
                    item.productPrice ??
                    item.priceAtPurchase ??
                    item.originalPrice ??
                    item.mrp ??
                    0
                  );

                  let itemTotal = Number(item.totalPrice ?? item.total ?? item.amount ?? (rawPrice * itemQty));

                  // Calculate fallback price if price is 0 but itemTotal/subtotal exists
                  if (!rawPrice && itemTotal) {
                    rawPrice = itemTotal / itemQty;
                  } else if (!rawPrice && subtotal) {
                    rawPrice = subtotal / (productsList.length || 1);
                    itemTotal = rawPrice * itemQty;
                  } else if (!rawPrice && grandTotal) {
                    rawPrice = grandTotal / (productsList.length || 1);
                    itemTotal = rawPrice * itemQty;
                  } else if (!itemTotal && rawPrice) {
                    itemTotal = rawPrice * itemQty;
                  }

                  const variant = item.variantName || (
                    item.selectedVariant && typeof item.selectedVariant === "object"
                      ? Object.entries(item.selectedVariant).map(([k, v]) => `${k}: ${v}`).join(" | ")
                      : (typeof item.selectedVariant === "string" ? item.selectedVariant : "")
                  );

                  return (
                    <tr key={idx} className="h-10">
                      <td className="p-3 text-center border-r border-gray-300 font-bold">{idx + 1}</td>
                      <td className="p-3 border-r border-gray-300">
                        <p className="font-bold text-gray-900">{itemTitle}</p>
                        {Boolean(variant) && (
                          <p className="text-[10px] text-gray-500 font-medium">{String(variant)}</p>
                        )}
                      </td>
                      <td className="p-3 text-center border-r border-gray-300 font-bold">{itemQty}</td>
                      <td className="p-3 text-right border-r border-gray-300 font-mono">₹{rawPrice.toLocaleString("en-IN")}</td>
                      <td className="p-3 text-right font-black font-mono">₹{itemTotal.toLocaleString("en-IN")}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* FINANCIAL SUMMARY & SIGNATURE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end pt-2">
          {/* Notes & Terms */}
          <div className="text-xs text-gray-600 space-y-1">
            <p className="font-bold text-gray-800">Terms & Conditions:</p>
            <p className="text-[10.5px]">1. Goods once sold are covered under {storeName} returns and refund policy.</p>
            <p className="text-[10.5px]">2. All prices are in Indian Rupees (INR) including applicable GST taxes.</p>
            <p className="text-[10.5px] italic mt-2 text-gray-500">This is a computer-generated tax invoice requiring no physical signature.</p>
          </div>

          {/* Subtotal, Discounts & Grand Total */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-gray-200">
              <span className="text-gray-600 font-medium">Subtotal:</span>
              <span className="font-mono font-bold text-gray-900">₹{(subtotal || grandTotal).toLocaleString("en-IN")}</span>
            </div>

            {couponDiscount > 0 && (
              <div className="flex justify-between py-1 border-b border-gray-200 text-emerald-700">
                <span className="font-medium">Coupon Savings:</span>
                <span className="font-mono font-bold">-₹{couponDiscount.toLocaleString("en-IN")}</span>
              </div>
            )}

            <div className="flex justify-between py-1 border-b border-gray-200">
              <span className="text-gray-600 font-medium">Shipping Charge:</span>
              <span className="font-mono font-bold text-gray-900">{shippingCharge === 0 ? "FREE" : `₹${shippingCharge}`}</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-900 text-white rounded-xl font-black text-sm">
              <span>GRAND TOTAL:</span>
              <span className="font-mono text-base">₹{grandTotal.toLocaleString("en-IN")}</span>
            </div>

            {/* Signature Box */}
            <div className="pt-6 text-center">
              <div className="w-44 border-b border-gray-900 mx-auto pb-1">
                <p className="font-serif italic text-sm text-gray-800 font-bold">Authorized Signatory</p>
              </div>
              <p className="text-xs font-bold text-gray-900 mt-1">{storeName}</p>
            </div>
          </div>
        </div>

        {/* GLOBAL FOOTER */}
        <footer className="text-center mt-8 pt-4 border-t border-gray-200 text-[10px] text-gray-500">
          Thank you for shopping with {storeName}! Visit <span className="font-mono font-bold">{website}</span> for support.
        </footer>
      </div>
    </div>
  );
};

export default OrderInvoice;
