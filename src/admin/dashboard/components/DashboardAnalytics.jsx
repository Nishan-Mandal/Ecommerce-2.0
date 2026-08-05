import React from 'react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  BarChart, Bar
} from 'recharts';
import { FaChartLine, FaTags, FaInfoCircle } from 'react-icons/fa';

/**
 * DashboardAnalytics Component
 * Renders interactive Recharts for Revenue Trends and Category Catalog Breakdown in a balanced 2-column grid.
 * Displays clean empty state placeholders when data is unavailable.
 */
export default function DashboardAnalytics({ orders = [], products = [] }) {
  // 1. Prepare Revenue Trend Data
  const revenueByDateMap = {};
  orders.forEach((ord) => {
    const status = (ord.orderStatus || ord.status || '').toUpperCase();
    if (status === 'CANCELLED' || status === 'REFUNDED' || status === 'PAYMENT_FAILED') return;
    const raw = ord.totalAmount ?? ord.pricing?.grandTotal ?? ord.amount ?? 0;
    const amt = typeof raw === 'number' ? raw : (parseFloat(String(raw).replace(/[^0-9.]/g, '')) || 0);

    const dateKey = ord.date
      ? String(ord.date).slice(0, 6)
      : (ord.createdAt?.toDate ? ord.createdAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recent');

    revenueByDateMap[dateKey] = (revenueByDateMap[dateKey] || 0) + amt;
  });

  const chartData = Object.keys(revenueByDateMap).map((date) => ({
    date,
    revenue: Math.round(revenueByDateMap[date]),
  }));

  // 2. Prepare Category Distribution Data
  const categoryCounts = {};
  products.forEach((prod) => {
    const cat = prod.category || 'Uncategorized';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const barCategoryData = Object.keys(categoryCounts).map((cat) => ({
    category: cat,
    count: categoryCounts[cat],
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">

      {/* 1. Revenue Trend Curve */}
      <div className="bg-bg-surface border border-border-base/60 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between pb-4 border-b border-border-base/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <FaChartLine size={14} />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-text-base">Revenue & Sales Performance</h3>
              <p className="text-[10px] text-text-muted">Total earnings trend across order transactions</p>
            </div>
          </div>
          <span className="text-[9px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 uppercase border border-emerald-500/20">
            ₹ Revenue Curve
          </span>
        </div>

        <div className="h-64 w-full mt-4 flex items-center justify-center">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#888888' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#888888' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                  }}
                  formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-6 space-y-2">
              <div className="w-10 h-10 rounded-full bg-bg-base flex items-center justify-center text-text-muted">
                <FaInfoCircle size={18} />
              </div>
              <p className="text-xs font-bold text-text-base">Not enough revenue data</p>
              <p className="text-[11px] text-text-muted max-w-xs">
                Sales revenue trends will automatically render here as customer orders are placed.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 2. Catalog Category Distribution Bar Chart */}
      <div className="bg-bg-surface border border-border-base/60 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between pb-4 border-b border-border-base/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <FaTags size={14} />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-text-base">Catalog Category Distribution</h3>
              <p className="text-[10px] text-text-muted">Total inventory items grouped per category</p>
            </div>
          </div>
          <span className="text-[9px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-400 uppercase border border-blue-500/20">
            Category Breakdown
          </span>
        </div>

        <div className="h-64 w-full mt-4 flex items-center justify-center">
          {barCategoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barCategoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="category" tick={{ fontSize: 10, fill: '#888888' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#888888' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    fontSize: '11px',
                    fontWeight: 'bold'
                  }}
                  formatter={(val) => [`${val} Products`, 'Inventory']}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-6 space-y-2">
              <div className="w-10 h-10 rounded-full bg-bg-base flex items-center justify-center text-text-muted">
                <FaInfoCircle size={18} />
              </div>
              <p className="text-xs font-bold text-text-base">No category data available</p>
              <p className="text-[11px] text-text-muted max-w-xs">
                Add products to your catalog to see category distribution charts.
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
