import React from "react";

const WarningModal = ({
  isOpen,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  mode = "light",
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-2xl shadow-2xl p-6 transition-all duration-200 border"
        style={{
          backgroundColor: mode === 'dark' ? 'rgb(46, 49, 55)' : '#ffffff',
          color: mode === 'dark' ? 'white' : '#111827',
          borderColor: mode === 'dark' ? 'rgb(75, 85, 99)' : '#e5e7eb'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Warning Icon */}
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 rounded-full flex items-center justify-center"
               style={{ backgroundColor: mode === 'dark' ? 'rgba(254, 240, 138, 0.1)' : 'rgb(254, 240, 138)' }}>
            <span className="text-3xl">⚠️</span>
          </div>
        </div>

        {/* Message Header */}
        <h2 className="text-xl font-bold text-center" style={{ color: mode === 'dark' ? 'white' : '#1f2937' }}>
          Warning
        </h2>

        {/* Message Content */}
        <p className="mt-3 text-center text-sm font-medium" style={{ color: mode === 'dark' ? 'rgb(156, 163, 175)' : '#4b5563' }}>
          {message}
        </p>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-3 text-sm">
          <button
            onClick={onCancel}
            className="rounded-lg border px-4 py-2 font-semibold transition hover:bg-gray-50 dark:hover:bg-slate-800"
            style={{
              borderColor: mode === 'dark' ? 'rgb(75, 85, 99)' : '#d1d5db',
              backgroundColor: mode === 'dark' ? 'rgb(30, 41, 59)' : '#ffffff',
              color: mode === 'dark' ? 'white' : '#374151'
            }}
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 transition shadow-md hover:shadow-red-500/10 active:scale-[0.98]"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WarningModal;
