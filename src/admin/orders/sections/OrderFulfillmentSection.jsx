import React from "react";
import { FaClock, FaTimesCircle, FaCheckCircle } from "react-icons/fa";

export default function OrderFulfillmentSection({
  currentStatus,
  statusSteps,
  currentStepIndex,
  updating,
  cancelledAt,
  updatedAt,
  formatDate,
  onUpdateStatus
}) {
  return (
    <div className="bg-bg-surface px-3 py-4  rounded-2xl border border-border-base shadow-xs space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-sm font-bold text-text-base flex items-center gap-2">
          <FaClock className="text-primary" /> Order Fulfillment Status
        </h2>
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-text-muted">Update Status:</label>
          <select
            value={currentStatus}
            onChange={(e) => onUpdateStatus(e.target.value)}
            disabled={updating}
            className="px-3 py-1.5 text-xs font-bold rounded-xl border border-border-base bg-bg-base text-text-base focus:ring-2 focus:ring-primary/30 cursor-pointer"
          >
            {statusSteps.map((step) => (
              <option key={step} value={step}>
                {step}
              </option>
            ))}
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
      </div>

      <div className=" bg-border-base/60" />

      {/* Horizontal Timeline Tracker */}
      {currentStatus === "CANCELLED" ? (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
          <FaTimesCircle size={16} /> This order was CANCELLED on {formatDate(cancelledAt || updatedAt)}.
        </div>
      ) : (
        <div className="overflow-x-auto pb-2">
          <div className="flex items-center min-w-[650px] py-2">
            {statusSteps.map((step, idx) => {
              const isCompleted = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div
                  key={step}
                  className="relative flex flex-col items-center flex-1"
                >
                  {/* Connecting Line */}
                  {idx < statusSteps.length - 1 && (
                    <div className="absolute top-4 left-1/2 w-full h-[2px] -z-0">
                      <div className="ml-4 h-full bg-border-base rounded-full">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${isCompleted ? "w-full bg-emerald-500" : "w-0"
                            }`}
                        />
                      </div>
                    </div>
                  )}

                  {/* Circle */}
                  <div
                    className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${isCurrent
                        ? "bg-primary text-white ring-4 ring-primary/20 scale-110 shadow-md"
                        : isCompleted
                          ? "bg-emerald-500 text-white"
                          : "bg-border-base text-text-muted"
                      }`}
                  >
                    {isCompleted ? <FaCheckCircle size={12} /> : idx + 1}
                  </div>

                  {/* Label */}
                  <span
                    className={`text-[9px] font-bold mt-2 text-center uppercase tracking-tight max-w-[80px] leading-tight ${isCurrent
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
