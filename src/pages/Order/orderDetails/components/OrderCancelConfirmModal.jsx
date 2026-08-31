import React, { useState } from "react";
import { FaTimes, FaExclamationTriangle, FaBan } from "react-icons/fa";

const CANCEL_REASONS = [
  "I changed my mind / ordered by mistake",
  "Found a better price elsewhere",
  "Delivery time is too long",
  "Need to change delivery address or phone",
  "Need to change product variant/size",
  "Other reasons",
];

export default function OrderCancelConfirmModal({
  open,
  onClose,
  onConfirm,
  cancelling,
  orderId
}) {
  const [selectedReason, setSelectedReason] = useState(CANCEL_REASONS[0]);
  const [customReason, setCustomReason] = useState("");

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalReason = selectedReason === "Other reasons" && customReason.trim()
      ? customReason.trim()
      : selectedReason;
    onConfirm(finalReason);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-bg-surface border border-border-base rounded-2xl shadow-xl w-full max-w-md overflow-hidden text-xs text-text-base">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-border-base flex items-center justify-between bg-rose-50/50 dark:bg-rose-950/20">
          <div className="flex items-center gap-2.5 text-rose-600 dark:text-rose-400">
            <FaExclamationTriangle size={15} />
            <h3 className="text-sm font-black text-text-base">Cancel Order #{orderId}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={cancelling}
            className="w-7 h-7 rounded-full bg-bg-surface border border-border-base flex items-center justify-center text-text-muted hover:text-text-base transition cursor-pointer"
          >
            <FaTimes size={12} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <p className="text-xs text-text-muted leading-relaxed">
            Are you sure you want to cancel this order? Please select a reason to help us improve:
          </p>

          <div className="space-y-2">
            {CANCEL_REASONS.map((reason) => (
              <label
                key={reason}
                className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                  selectedReason === reason
                    ? "border-primary bg-primary/5 text-text-base font-bold"
                    : "border-border-base/60 bg-bg-base/40 text-text-muted hover:border-border-base"
                }`}
              >
                <input
                  type="radio"
                  name="cancelReason"
                  value={reason}
                  checked={selectedReason === reason}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="accent-primary"
                />
                <span className="text-xs">{reason}</span>
              </label>
            ))}
          </div>

          {selectedReason === "Other reasons" && (
            <div>
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Please describe your reason (optional)..."
                rows={2}
                className="w-full p-2.5 rounded-xl border border-border-base bg-bg-surface text-xs text-text-base focus:border-primary focus:outline-hidden"
              />
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={cancelling}
              className="px-4 py-2 rounded-xl bg-bg-base hover:bg-border-base/50 text-text-base font-bold text-xs transition-colors cursor-pointer"
            >
              Keep Order
            </button>
            <button
              type="submit"
              disabled={cancelling}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-xs cursor-pointer disabled:opacity-50"
            >
              <FaBan size={11} />
              <span>{cancelling ? "Cancelling..." : "Confirm Cancellation"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
