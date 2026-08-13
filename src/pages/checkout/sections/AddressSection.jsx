import React from "react";
import AddressFormModal from "../components/AddressFormModal";

export default function AddressSection({
  addresses, selectedAddressId, addressLoading, addressFormOpen, editingAddress,
  onSelectAddress, onAddAddress, onUpdateAddress, onSetDefault, onOpenForm, onCloseForm, onDelete,
}) {
  return (
    <section className="bg-bg-surface rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-border-base overflow-hidden">
      {/* Section Header */}
      <div className="px-2 py-1  border-b border-border-base flex items-center justify-between bg-bg-surface/50">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="font-bold text-sm  text-text-base">Delivery Address</h2>
          </div>
        </div>
        <button
          onClick={() => onOpenForm(null)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg  text-primary font-bold text-xs "
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add New Address
        </button>
      </div>

      {/* Content */}
      <div className="p-2">
        {addressLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className=" bg-border-base/40 animate-pulse rounded-xl border border-border-base/60" />
            ))}
          </div>
        ) : addresses.length === 0 ? (
          <div className="text-center py-10 px-4 rounded-xl border-2 border-dashed border-border-base bg-bg-base/40">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 text-primary">
              <span className="material-symbols-outlined text-[28px]">location_on</span>
            </div>
            <h3 className="font-bold text-text-base mb-1">No Saved Addresses Found</h3>
            <p className="text-text-muted text-xs mb-5 max-w-xs mx-auto">Please add a shipping address to proceed with order delivery.</p>
            <button
              onClick={() => onOpenForm(null)}
              className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold transition shadow-lg shadow-primary/20 text-xs"
            >
              Add Your First Address
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((addr) => {
              const isSelected = addr.addressId === selectedAddressId;
              return (
                <div
                  key={addr.addressId}
                  onClick={() => onSelectAddress(addr.addressId)}
                  className={`relative group  rounded-xl border-2 py-2 px-3 transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? "border-green-600 dark:border-green-500 bg-green-500/5 shadow-sm"
                      : "border-border-base hover:border-green-500/40 bg-bg-base"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className="mt-1">
                        {isSelected ? (
                          <span className="material-symbols-outlined text-green-600 dark:text-green-400" style={{ fontVariationSettings: "'FILL' 1" }}>
                            radio_button_checked
                          </span>
                        ) : (
                          <span className="material-symbols-outlined text-text-muted opacity-40">
                            radio_button_unchecked
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-bold text-text-base text-base">{addr.fullName}</span>
                          <span className="px-3 py-0.5 rounded-full bg-primary/10 text-primary font-bold text-[10px] uppercase tracking-wider">
                            {addr.addressType || "Home"}
                          </span>
                          {addr.isDefault && (
                            <span className="px-3 py-0.5 rounded-full bg-green-600/10 text-green-600 dark:text-green-400 font-bold text-[10px] uppercase tracking-wider">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-text-muted leading-relaxed max-w-md">
                          {addr.houseNo && `${addr.houseNo}, `}{addr.street}
                          {addr.landmark && `, Near ${addr.landmark}`}
                          {addr.city && `, ${addr.city}`}{addr.state && `, ${addr.state}`} - <span className="font-bold text-text-base">{addr.pincode}</span>
                        </p>
                        <div className="flex items-center gap-2 text-text-base text-xs font-semibold mt-1">
                          <span className="material-symbols-outlined text-[18px] opacity-40">call</span>
                          <span>{addr.phone}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {!addr.isDefault && onSetDefault && (
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); onSetDefault(addr.addressId); }}
                          title="Set as Default Address"
                          className="px-2.5 py-1 rounded-lg border border-border-base text-text-muted hover:text-emerald-600 hover:border-emerald-500/40 text-xs font-medium transition-colors"
                        >
                          Set Default
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onOpenForm(addr); }}
                        title="Edit Address"
                        className="p-1.5 rounded-lg hover:bg-border-base/50 transition-colors text-text-muted hover:text-primary"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onDelete(addr.addressId); }}
                        title="Delete Address"
                        className="p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-colors text-text-muted"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AddressFormModal
        isOpen={addressFormOpen}
        onClose={onCloseForm}
        initialData={editingAddress}
        onSubmit={editingAddress
          ? (data) => onUpdateAddress(editingAddress.addressId, data)
          : onAddAddress}
      />
    </section>
  );
}


