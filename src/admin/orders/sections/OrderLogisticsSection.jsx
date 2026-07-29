import React from "react";
import { FaTruck, FaEdit, FaExternalLinkAlt } from "react-icons/fa";

export default function OrderLogisticsSection({ tracking, onOpenTrackingModal }) {
  return (
    <div className="bg-bg-surface p-6 rounded-2xl border border-border-base shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-text-base flex items-center gap-2">
          <FaTruck className="text-primary" /> Logistics & Tracking
        </h2>
        <button
          onClick={onOpenTrackingModal}
          className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
        >
          <FaEdit size={10} /> Edit
        </button>
      </div>
      <div className="h-px bg-border-base/60" />

      {tracking?.trackingId ? (
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-text-muted">Courier:</span>
            <span className="font-bold text-text-base">{tracking.courier || "Standard Delivery"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Tracking ID:</span>
            <span className="font-mono font-bold text-text-base">{tracking.trackingId}</span>
          </div>
          {tracking.trackingUrl && (
            <a
              href={tracking.trackingUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline pt-1"
            >
              Track Package Shipment <FaExternalLinkAlt size={9} />
            </a>
          )}
        </div>
      ) : (
        <div className="p-4 rounded-xl border border-dashed border-border-base text-center bg-bg-base/40 space-y-2">
          <p className="text-xs text-text-muted">Tracking information not available.</p>
          <button
            onClick={onOpenTrackingModal}
            className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition cursor-pointer"
          >
            + Add Tracking ID
          </button>
        </div>
      )}
    </div>
  );
}
