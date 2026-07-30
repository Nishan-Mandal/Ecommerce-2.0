import React, { useState, useEffect, useCallback } from "react";
import { FaHome, FaBriefcase, FaMapPin, FaPlus, FaEdit, FaTrash, FaCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { userService } from "../../../services/user/userService";
import AddressFormModal from "../../checkout/components/AddressFormModal";

const TYPE_ICONS = {
  HOME: <FaHome size={12} />,
  OFFICE: <FaBriefcase size={12} />,
  WORK: <FaBriefcase size={12} />,
  OTHER: <FaMapPin size={12} />,
};

export default function AddressTab({ profile }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const uid = profile?.uid || profile?.docId;

  const loadAddresses = useCallback(async () => {
    if (!uid) return;
    setLoading(true);
    try {
      const addrs = await userService.getAddresses(uid);
      setAddresses(addrs);
    } catch (err) {
      console.error("Error loading addresses in AddressTab:", err);
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  const handleAdd = async (formData) => {
    if (!uid) {
      toast.error("User ID not found.");
      return;
    }
    try {
      const newAddr = await userService.addAddress(uid, formData);
      setAddresses((prev) => [...prev, newAddr]);
      setModalOpen(false);
      toast.success("Address added successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add address.");
    }
  };

  const handleUpdate = async (addressId, formData) => {
    if (!uid) return;
    try {
      const updated = await userService.updateAddress(uid, addressId, formData);
      setAddresses((prev) => prev.map((a) => (a.addressId === addressId ? updated : a)));
      setModalOpen(false);
      setEditingAddress(null);
      toast.success("Address updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update address.");
    }
  };

  const handleDelete = async (addressId) => {
    if (!uid) return;
    try {
      await userService.deleteAddress(uid, addressId);
      setAddresses((prev) => prev.filter((a) => a.addressId !== addressId));
      toast.success("Address removed.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete address.");
    }
  };

  return (
    <div className="space-y-5">
      {/* Header & Add Button */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-sm font-bold text-text-base">Delivery Addresses</h3>
          <p className="text-[10px] text-text-muted mt-0.5">Manage your saved shipping addresses for faster checkout</p>
        </div>
        <button
          onClick={() => {
            setEditingAddress(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-sm transition-all hover:bg-primary-hover active:scale-95"
        >
          <FaPlus size={10} />
          Add New Address
        </button>
      </div>

      <div className="h-px bg-border-base/60" />

      {/* Address List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 bg-border-base animate-pulse rounded-xl" />
          ))}
        </div>
      ) : addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-border-base rounded-2xl text-center bg-bg-base/40">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
            <FaMapPin size={20} />
          </div>
          <p className="text-sm font-bold text-text-base mb-1">No Saved Addresses</p>
          <p className="text-xs text-text-muted max-w-xs mb-4">Add your shipping address so you can use it seamlessly during checkout.</p>
          <button
            onClick={() => {
              setEditingAddress(null);
              setModalOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-sm hover:bg-primary-hover transition-all"
          >
            <FaPlus size={11} />
            Add Address Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {addresses.map((addr) => (
            <div
              key={addr.addressId}
              className="relative p-4 rounded-xl border border-border-base bg-bg-base hover:border-primary/50 transition-all shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-xs text-text-base">{addr.fullName}</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-primary/10 text-primary">
                    {TYPE_ICONS[addr.addressType] || TYPE_ICONS.OTHER}
                    {addr.addressType || "HOME"}
                  </span>
                  {addr.isDefault && (
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                      <FaCheckCircle size={8} /> Default
                    </span>
                  )}
                </div>
                <p className="text-xs text-text-muted leading-relaxed">
                  {addr.houseNo && `${addr.houseNo}, `}
                  {addr.street}
                  {addr.landmark && `, Near ${addr.landmark}`}
                  {addr.city && `, ${addr.city}`}
                  {addr.state && `, ${addr.state}`} - <span className="font-bold text-text-base">{addr.pincode}</span>
                </p>
                <p className="text-[11px] font-semibold text-text-muted">Phone: {addr.phone}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-border-base/40">
                <button
                  onClick={() => {
                    setEditingAddress(addr);
                    setModalOpen(true);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border-base text-text-muted hover:text-primary hover:border-primary transition text-xs font-semibold"
                >
                  <FaEdit size={11} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(addr.addressId)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border-base text-text-muted hover:text-red-500 hover:border-red-300 transition text-xs font-semibold"
                >
                  <FaTrash size={10} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Address Form Modal for Add/Edit */}
      <AddressFormModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingAddress(null);
        }}
        initialData={editingAddress}
        onSubmit={editingAddress ? (data) => handleUpdate(editingAddress.addressId, data) : handleAdd}
      />
    </div>
  );
}
