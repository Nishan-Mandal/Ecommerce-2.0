import React from "react";
import { FaClock, FaTimesCircle, FaCheckCircle } from "react-icons/fa";

export default function OrderFulfillmentSection({
  currentStatus,
  paymentStatus,
  statusSteps,
  currentStepIndex,
  updating,
  cancelledAt,
  updatedAt,
  formatDate,
  onUpdateStatus
}) {
  const isPaidOrAdvanced =
    currentStepIndex >= 2 ||
    ["CONFIRMED", "PROCESSING", "PACKED", "SHIPPED", "IN_TRANSIT", "OUT_FOR_DELIVERY", "DELIVERED"].includes(currentStatus) ||
    String(paymentStatus || "").toUpperCase().includes("PAID") ||
    String(paymentStatus || "").toUpperCase().includes("SUCCESS");

  return (
    <div className="bg-bg-surface p-5 rounded-2xl border border-border-base shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-base/70">
        <div>
          <h2 className="text-sm font-black text-text-base flex items-center gap-2">
            <FaClock className="text-primary" /> Order Fulfillment Status
          </h2>
          <p className="text-[10px] text-text-muted mt-0.5">
            Update order lifecycle status or view current progress.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-text-muted shrink-0">Update Status:</label>
          <select
            value={currentStatus}
            onChange={(e) => onUpdateStatus(e.target.value)}
            disabled={updating || currentStatus === "CANCELLED" || currentStatus === "DELIVERED"}
            className="px-3.5 py-1.5 text-xs font-extrabold rounded-xl border border-border-base bg-bg-base text-text-base focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-2xs disabled:opacity-60"
          >
            {statusSteps
              .filter((step, idx) => {
                // Prevent reverting paid/confirmed orders back to PAYMENT_PENDING (0) or PLACED (1)
                if (isPaidOrAdvanced && (step === "PAYMENT_PENDING" || step === "PLACED")) return false;
                return true;
              })
              .map((step) => (
                <option key={step} value={step}>
                  {step.replace(/_/g, " ")}
                </option>
              ))}
            {currentStatus !== "DELIVERED" && <option value="CANCELLED">CANCELLED</option>}
          </select>
        </div>
      </div>

      {/* Timeline Stepper */}
      {currentStatus === "CANCELLED" ? (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-black flex items-center gap-2.5">
          <FaTimesCircle size={18} className="shrink-0 text-rose-500" />
          <span>This order was CANCELLED on {formatDate(cancelledAt || updatedAt)}.</span>
        </div>
      ) : (
        <div className="overflow-x-auto pb-2">
          <div className="flex items-center min-w-[650px] py-3 px-2">
            {statusSteps.map((step, idx) => {
              const isCompleted = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div key={step} className="relative flex flex-col items-center flex-1">
                  {/* Connecting Bar Line */}
                  {idx < statusSteps.length - 1 && (
                    <div className="absolute top-4 left-1/2 w-full h-[3px] -z-0">
                      <div className="ml-4 h-full bg-border-base/60 rounded-full">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isCompleted ? "w-full bg-emerald-500" : "w-0"
                          }`}
                        />
                      </div>
                    </div>
                  )}

                  {/* Step Circle Icon */}
                  <div
                    className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                      isCurrent
                        ? "bg-primary text-white ring-4 ring-primary/20 scale-110 shadow-md"
                        : isCompleted
                        ? "bg-emerald-500 text-white shadow-xs"
                        : "bg-border-base/60 text-text-muted"
                    }`}
                  >
                    {isCompleted ? <FaCheckCircle size={14} /> : idx + 1}
                  </div>

                  {/* Step Title Label */}
                  <span
                    className={`text-[9.5px] font-black mt-2.5 text-center uppercase tracking-tight max-w-[85px] leading-tight ${
                      isCurrent
                        ? "text-primary"
                        : isCompleted
                        ? "text-text-base"
                        : "text-text-muted/60"
                    }`}
                  >
                    {step.replace(/_/g, " ")}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
