import React from "react";
import { FaExclamationTriangle, FaTimesCircle } from "react-icons/fa";

export function OrderCancelModal({
  isOpen,
  orderId,
  updating,
  onClose,
  onConfirmCancel
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-bg-surface max-w-sm w-full rounded-2xl border border-border-base p-6 space-y-4 shadow-xl">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <FaExclamationTriangle size={22} />
        </div>
        <div className="text-center space-y-1">
          <h3 className="text-base font-bold text-text-base">Cancel Order #{orderId}?</h3>
          <p className="text-xs text-text-muted">
            Are you sure you want to cancel this order? This action will mark the status as CANCELLED in database audit logs.
          </p>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-border-base text-xs font-bold text-text-base hover:bg-bg-base transition cursor-pointer"
          >
            Keep Order
          </button>
          <button
            onClick={onConfirmCancel}
            disabled={updating}
            className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition cursor-pointer disabled:opacity-50"
          >
            {updating ? "Cancelling..." : "Confirm Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function OrderTrackingModal({
  isOpen,
  trackingForm,
  setTrackingForm,
  updating,
  onClose,
  onSaveTracking
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <form onSubmit={onSaveTracking} className="bg-bg-surface max-w-md w-full rounded-2xl border border-border-base p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-text-base">Update Tracking Information</h3>
          <button type="button" onClick={onClose} className="text-text-muted hover:text-text-base cursor-pointer">
            <FaTimesCircle size={16} />
          </button>
        </div>
        <div className="h-px bg-border-base/60" />

        <div className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-text-base block mb-1">Courier Service Name</label>
            <input
              type="text"
              value={trackingForm.courier}
              onChange={(e) => setTrackingForm({ ...trackingForm, courier: e.target.value })}
              placeholder="e.g. BlueDart, Delhivery, FedEx"
              className="w-full px-3 py-2 rounded-xl border border-border-base bg-bg-base text-xs focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="font-bold text-text-base block mb-1">Tracking ID / AWB Number</label>
            <input
              type="text"
              value={trackingForm.trackingId}
              onChange={(e) => setTrackingForm({ ...trackingForm, trackingId: e.target.value })}
              placeholder="e.g. AWB987654321"
              className="w-full px-3 py-2 rounded-xl border border-border-base bg-bg-base text-xs font-mono focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="font-bold text-text-base block mb-1">Tracking Web URL</label>
            <input
              type="url"
              value={trackingForm.trackingUrl}
              onChange={(e) => setTrackingForm({ ...trackingForm, trackingUrl: e.target.value })}
              placeholder="https://track.courier.com/AWB987654321"
              className="w-full px-3 py-2 rounded-xl border border-border-base bg-bg-base text-xs focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-3 border-t border-border-base/60">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-border-base text-xs font-bold text-text-base hover:bg-bg-base transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updating}
            className="flex-1 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-sm hover:opacity-90 transition cursor-pointer disabled:opacity-50"
          >
            {updating ? "Saving..." : "Save Details"}
          </button>
        </div>
      </form>
    </div>
  );
}
