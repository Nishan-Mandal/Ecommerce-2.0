import React from "react";
import { FaUser, FaCopy } from "react-icons/fa";

export default function OrderCustomerInfoSection({
  customerName,
  customerPhone,
  customerEmail,
  addressType,
  fullStreet,
  city,
  state,
  pincode,
  copyToClipboard
}) {
  return (
    <div className="bg-bg-surface px-3 py-4 rounded-2xl border border-border-base shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-text-base flex items-center gap-2">
          <FaUser className="text-primary" /> Customer Details
        </h2>
        <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase bg-primary/10 text-primary">
          {addressType}
        </span>
      </div>
      <div className="space-y-3 text-xs">
        <div>
          <label className="text-[9.5px] font-bold text-text-muted uppercase tracking-wider block mb-0.5">Name</label>
          <p className="font-bold text-text-base">{customerName}</p>
        </div>

     <div className="grid grid-cols-2 gap-10">
         <div>
          <label className="text-[9.5px] font-bold text-text-muted uppercase tracking-wider block mb-0.5">Contact Phone</label>
          <div className="flex items-center justify-between">
            <p className="font-semibold text-text-base">{customerPhone}</p>
            {customerPhone !== "N/A" && (
              <button
                onClick={() => copyToClipboard(customerPhone, "Phone number copied!")}
                className="text-text-muted hover:text-primary transition p-1 cursor-pointer"
              >
                <FaCopy size={11} />
              </button>
            )}
          </div>
        </div>

        <div>
          <label className="text-[9.5px] font-bold text-text-muted uppercase tracking-wider block mb-0.5">Email</label>
          <p className="font-semibold text-text-base truncate">{customerEmail}</p>
        </div>

     </div>
        <div>
          <label className="text-[9.5px] font-bold text-text-muted uppercase tracking-wider block mb-0.5">Shipping Address</label>
          <div className="p-3 rounded-xl bg-bg-base border border-border-base space-y-1 text-[11px] leading-relaxed">
            <p className="font-semibold text-text-base">{fullStreet}</p>
            <p className="text-text-muted">{city}, {state} - <strong className="text-text-base">{pincode}</strong></p>
            <button
              onClick={() => copyToClipboard(`${fullStreet}, ${city}, ${state} - ${pincode}`, "Full address copied!")}
              className="flex items-center gap-1 text-[10px] font-bold text-primary hover:underline pt-1 cursor-pointer"
            >
              <FaCopy size={9} /> Copy Address
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
