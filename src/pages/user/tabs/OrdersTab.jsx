import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FaShoppingBag, FaSearch, FaCheckCircle, 
  FaExclamationCircle, FaTimesCircle, FaTruck, FaClock, FaImage 
} from "react-icons/fa";
import Pagination from "../../../components/common/Pagination";

function formatDate(dateVal) {
  if (!dateVal) return "N/A";
  if (typeof dateVal === "string") return dateVal;
  if (typeof dateVal === "number") return new Date(dateVal).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  if (dateVal?.seconds !== undefined) {
    return new Date(dateVal.seconds * 1000).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }
  if (dateVal?.toDate && typeof dateVal.toDate === "function") {
    return dateVal.toDate().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }
  if (dateVal instanceof Date) return dateVal.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  return "N/A";
}

function renderStatusBadge(statusRaw, paymentStatRaw) {
  const status = (statusRaw || "").toUpperCase();
  const payStat = (paymentStatRaw || "").toUpperCase();

  if (status === "PAYMENT_FAILED" || payStat === "FAILED") {
    return (
      <span className="flex items-center gap-1.5 text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-wider">
        <FaExclamationCircle className="text-rose-600" size={11} />
        <span>PAYMENT_FAILED</span>
      </span>
    );
  }

  if (status === "PAYMENT_PENDING" || payStat === "PENDING") {
    return (
      <span className="flex items-center gap-1.5 text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-wider">
        <FaClock className="text-purple-600" size={11} />
        <span>PAYMENT_PENDING</span>
      </span>
    );
  }

  if (status === "CANCELLED") {
    return (
      <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        <FaTimesCircle className="text-gray-500" size={11} />
        <span>CANCELLED</span>
      </span>
    );
  }

  if (status === "DELIVERED") {
    return (
      <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
        <FaCheckCircle className="text-emerald-600" size={11} />
        <span>DELIVERED</span>
      </span>
    );
  }

  if (status === "SHIPPED") {
    return (
      <span className="flex items-center gap-1.5 text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-wider">
        <FaTruck className="text-rose-600" size={11} />
        <span>SHIPPED</span>
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1.5 text-[10px] font-black text-primary uppercase tracking-wider">
      <FaCheckCircle className="text-primary" size={11} />
      <span>{status || "PLACED"}</span>
    </span>
  );
}

function getOrderItems(o) {
  if (Array.isArray(o.products) && o.products.length > 0) return o.products;
  if (Array.isArray(o.items) && o.items.length > 0) return o.items;
  if (Array.isArray(o.cart) && o.cart.length > 0) return o.cart;
  return [];
}

export default function OrdersTab({ orders = [] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const filteredOrders = orders.filter((o) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const orderId = (o.id || o.orderId || o.paymentId || "").toLowerCase();
    const items = getOrderItems(o);
    const itemTitles = items.map((i) => (i.productName || i.title || i.name || "").toLowerCase()).join(" ");
    return orderId.includes(q) || itemTitles.includes(q);
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredOrders.length]);

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-2 text-center">
        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
          <FaShoppingBag size={18} />
        </div>
        <h4 className="text-xs font-extrabold text-text-base">No orders placed yet</h4>
        <p className="text-[11px] text-text-muted max-w-xs">
          When you purchase products, your complete order details and status tracking will appear here.
        </p>
      </div>
    );
  }

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-3.5 text-xs">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1.5 border-b border-border-base/50">
        <div>
          <h2 className="text-base font-extrabold text-text-base tracking-tight">My Orders</h2>
          <p className="text-[10px] text-text-muted mt-0.5">{orders.length} total orders recorded</p>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-60">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-[11px]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your orders..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-border-base/70 bg-bg-base/60 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-text-muted/60"
            />
          </div>
        </div>
      </div>

      {/* Orders List View */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="py-8 text-center text-text-muted text-xs">
            No orders matching "{searchQuery}"
          </div>
        ) : (
          paginatedOrders.map((o, idx) => {
            const items = getOrderItems(o);
            const rawAmt = o.totalAmount ?? o.pricing?.grandTotal ?? o.amount ?? 0;
            const totalAmt = typeof rawAmt === 'number' ? rawAmt : (parseFloat(String(rawAmt).replace(/[^0-9.]/g, '')) || 0);
            const orderIdDisplay = o.id || o.orderId || o.paymentId || "R0pgC" + idx;
            const gatewayDisplay = (o.paymentMode || o.paymentInfo?.method || o.payment?.gateway || "RAZORPAY").toUpperCase();

            // Render first product item or main info
            const firstItem = items[0] || {};
            const itemImg = firstItem.productImage || firstItem.imageUrl || firstItem.images?.[0] || "";
            const itemTitle = firstItem.productName || firstItem.title || firstItem.name || "Product Order Item";
            const itemQty = Number(firstItem.quantity || firstItem.qty || 1) || 1;
            const pid = firstItem.productId || firstItem.id || "";

            return (
              <div
                key={o.id || o.orderId || idx}
                className="bg-bg-surface rounded-xl border border-border-base/70 p-3 sm:p-3.5 shadow-2xs hover:shadow-xs transition-all duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Left Product Image & Title Info */}
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary/5 border border-primary/10 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                      {itemImg ? (
                        <img src={itemImg} alt={itemTitle} className="w-full h-full object-contain rounded-lg" />
                      ) : (
                        <FaImage size={16} className="text-primary/40" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1 space-y-0.5">
                      {pid ? (
                        <Link to={`/productdetails/${pid}`} className="font-extrabold text-xs sm:text-sm text-text-base hover:text-primary transition-colors line-clamp-1">
                          {itemTitle}
                        </Link>
                      ) : (
                        <h4 className="font-extrabold text-xs sm:text-sm text-text-base line-clamp-1">{itemTitle}</h4>
                      )}

                      <p className="text-[10px] text-text-muted font-medium">
                        Qty: {itemQty} • <span className="font-mono text-text-muted">Order ID: <strong className="font-bold text-text-base">{orderIdDisplay}</strong></span>
                      </p>

                      <p className="text-[10px] text-text-muted">
                        Ordered on <strong className="font-semibold text-text-base">{formatDate(o.date || o.createdAt)}</strong> • <span className="uppercase font-bold tracking-wider text-[9px] text-text-muted">{gatewayDisplay}</span>
                      </p>
                    </div>
                  </div>

                  {/* Right Price & Status Badge */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1.5 border-t sm:border-t-0 pt-2 sm:pt-0 border-border-base/40 shrink-0">
                    <span className="text-base sm:text-lg font-black text-text-base">
                      ₹{Math.round(totalAmt).toLocaleString("en-IN")}
                    </span>

                    <div>
                      {renderStatusBadge(o.orderStatus || o.status, o.paymentStatus || o.payment?.status)}
                    </div>
                  </div>
                </div>

                {/* Additional Items Preview inside order if multiple products exist */}
                {items.length > 1 && (
                  <div className="mt-2 pt-2 border-t border-border-base/40 flex items-center gap-1.5 overflow-x-auto">
                    <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider shrink-0">+ {items.length - 1} more:</span>
                    {items.slice(1).map((extra, eIdx) => (
                      <span key={eIdx} className="px-2 py-0.5 rounded-md bg-bg-base border border-border-base/50 text-[9px] font-bold text-text-base truncate max-w-[120px]">
                        {extra.productName || extra.title || "Item"}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Universal Pagination */}
      <Pagination
        currentPage={currentPage}
        totalItems={filteredOrders.length}
        pageSize={pageSize}
        pageSizeOptions={[5, 10, 20]}
        onPageChange={setCurrentPage}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setCurrentPage(1);
        }}
      />
    </div>
  );
}
