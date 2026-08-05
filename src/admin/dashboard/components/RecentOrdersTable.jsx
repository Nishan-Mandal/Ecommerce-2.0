import React from 'react';
import { FaShoppingBag, FaArrowRight } from 'react-icons/fa';

const getStatusBadge = (status) => {
  const s = (status || 'PLACED').toUpperCase();
  switch (s) {
    case 'DELIVERED':
      return <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-extrabold text-[10px]">Delivered</span>;
    case 'CANCELLED':
      return <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 font-extrabold text-[10px]">Cancelled</span>;
    case 'SHIPPED':
      return <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-400 font-extrabold text-[10px]">Shipped</span>;
    default:
      return <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 font-extrabold text-[10px]">Placed</span>;
  }
};

/**
 * RecentOrdersTable Component
 * Quick preview table of the top 5 most recent orders on the dashboard.
 */
export default function RecentOrdersTable({ orders = [], onViewAll }) {
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="bg-bg-surface border border-border-base rounded-2xl p-5 shadow-xs flex flex-col h-full">
      <div className="flex items-center justify-between pb-4 border-b border-border-base/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <FaShoppingBag size={14} />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-text-base">Recent Orders</h3>
            <p className="text-[10px] text-text-muted">Latest purchases placed in store</p>
          </div>
        </div>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline cursor-pointer"
          >
            <span>View All</span>
            <FaArrowRight size={10} />
          </button>
        )}
      </div>

      <div className="overflow-x-auto mt-3">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-border-base/50 text-[10px] text-text-muted uppercase font-extrabold tracking-wider">
              <th className="py-2.5 px-3">Order ID</th>
              <th className="py-2.5 px-3">Customer</th>
              <th className="py-2.5 px-3 text-center">Status</th>
              <th className="py-2.5 px-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-base/30 font-semibold">
            {recentOrders.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-8 text-center text-text-muted">
                  No orders placed yet.
                </td>
              </tr>
            ) : (
              recentOrders.map((ord) => {
                const orderIdStr = ord.id ? `#${ord.id.slice(-6).toUpperCase()}` : '#ORDER';
                const customerName = ord.addressInfo?.name || ord.shippingAddress?.fullName || ord.email || 'Customer';
                const rawAmt = ord.totalAmount ?? ord.pricing?.grandTotal ?? ord.amount ?? 0;
                const amt = typeof rawAmt === 'number' ? rawAmt : (parseFloat(String(rawAmt).replace(/[^0-9.]/g, '')) || 0);

                return (
                  <tr key={ord.id} className="hover:bg-bg-base/30 transition-colors">
                    <td className="py-3 px-3 font-mono font-extrabold text-text-base text-xs">{orderIdStr}</td>
                    <td className="py-3 px-3 max-w-[140px] truncate text-text-base" title={customerName}>{customerName}</td>
                    <td className="py-3 px-3 text-center">{getStatusBadge(ord.orderStatus || ord.status)}</td>
                    <td className="py-3 px-3 text-right font-black text-text-base">₹{amt.toLocaleString('en-IN')}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
