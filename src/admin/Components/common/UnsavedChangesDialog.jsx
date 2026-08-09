import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

/**
 * UnsavedChangesDialog
 *
 * Shown as a modal overlay when the user tries to navigate away from a form
 * with unsaved changes (isDirty === true).
 * Refactored using pure Tailwind CSS classes.
 *
 * Props:
 *  - onStay    {Function}  User wants to stay on the page
 *  - onDiscard {Function}  User confirms leaving — draft will be cleared
 */
export default function UnsavedChangesDialog({ onStay, onDiscard }) {
  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onStay}
        className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm animate-fade-in"
      />

      {/* Modal Dialog */}
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="unsaved-dialog-title"
        aria-describedby="unsaved-dialog-desc"
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-full max-w-md p-7 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-red-500/30 shadow-2xl text-center transition-all animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Warning Icon Badge */}
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center text-2xl">
          <FaExclamationTriangle className="w-7 h-7" />
        </div>

        {/* Title */}
        <h2
          id="unsaved-dialog-title"
          className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2"
        >
          Discard Changes?
        </h2>

        {/* Description */}
        <p
          id="unsaved-dialog-desc"
          className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-7"
        >
          You have unsaved changes. Are you sure you want to leave?<br />
          <span className="text-xs text-slate-400 dark:text-slate-500 mt-1 block">
            Your draft will be discarded and cannot be recovered.
          </span>
        </p>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Stay */}
          <button
            id="unsaved-dialog-stay-btn"
            type="button"
            onClick={onStay}
            autoFocus
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-sm font-semibold transition-all duration-150 cursor-pointer"
          >
            Stay
          </button>

          {/* Discard & Leave */}
          <button
            id="unsaved-dialog-discard-btn"
            type="button"
            onClick={onDiscard}
            className="flex-1 py-2.5 px-4 rounded-xl border-0 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-semibold shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:-translate-y-0.5 transition-all duration-150 cursor-pointer"
          >
            Discard &amp; Leave
          </button>
        </div>
      </div>
    </>
  );
}
