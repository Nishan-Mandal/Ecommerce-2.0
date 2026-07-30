import React from "react";
import { FaHistory } from "react-icons/fa";

export default function OrderHistoryAuditSection({ history = [], currentStatus, createdAt, formatDate }) {
  return (
    <div className="bg-bg-surface p-6 rounded-2xl border border-border-base shadow-xs space-y-4">
      <h2 className="text-sm font-bold text-text-base flex items-center gap-2">
        <FaHistory className="text-primary" /> Order History Audit Log
      </h2>
      <div className="h-px bg-border-base/60" />

      <div className="space-y-4 relative pl-4 border-l-2 border-primary/20">
        {history.length === 0 ? (
          <div className="flex items-start gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-primary -ml-[21px] mt-1 ring-4 ring-bg-surface" />
            <div>
              <p className="text-xs font-bold text-text-base">{currentStatus}</p>
              <p className="text-[10px] text-text-muted">{formatDate(createdAt)} • Updated by SYSTEM</p>
            </div>
          </div>
        ) : (
          [...history].reverse().map((entry, idx) => (
            <div key={idx} className="flex items-start gap-3 relative">
              <div className="w-2.5 h-2.5 rounded-full bg-primary -ml-[21px] mt-1 ring-4 ring-bg-surface" />
              <div>
                <p className="text-xs font-bold text-text-base">{entry.status}</p>
                <p className="text-[10px] text-text-muted">
                  {formatDate(entry.timestamp)} • Updated by <strong className="text-text-base">{entry.updatedBy || "SYSTEM"}</strong>
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
