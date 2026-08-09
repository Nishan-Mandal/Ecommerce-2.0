import React from 'react';
import { FaFileAlt } from 'react-icons/fa';

/**
 * Formats a timestamp into a human-readable "Today at 2:35 PM" style string.
 */
function formatDraftTime(timestamp) {
  if (!timestamp) return null;
  const date = new Date(timestamp);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  const timeStr = date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  if (isToday) return `Today at ${timeStr}`;
  if (isYesterday) return `Yesterday at ${timeStr}`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) + ` at ${timeStr}`;
}

/**
 * DraftRecoveryDialog
 *
 * Shown when a saved draft is detected on opening the Add Product form.
 * Refactored using pure Tailwind CSS classes.
 *
 * Props:
 *  - formName   {string}   e.g. "Product" — used in the dialog copy
 *  - draftMeta  {Object}   { updatedAt: timestamp }
 *  - onRestore  {Function} Called when user chooses "Continue Editing"
 *  - onDiscard  {Function} Called when user chooses "Discard Draft"
 */
export default function DraftRecoveryDialog({ formName = 'Product', draftMeta, onRestore, onDiscard }) {
  const timeLabel = formatDraftTime(draftMeta?.updatedAt);

  return (
    <div
      role="alert"
      aria-live="polite"
      className="flex items-center justify-between flex-wrap gap-3.5 p-4 sm:px-5 rounded-xl bg-amber-500/10 dark:bg-amber-500/10 border border-amber-500/30 dark:border-amber-500/40 backdrop-blur-md transition-all shadow-sm"
    >
      {/* Icon + Copy */}
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-amber-500/20 text-amber-500 shrink-0 mt-0.5">
          <FaFileAlt className="w-4 h-4" />
        </div>
        <div>
          <p className="font-bold text-sm text-amber-500 dark:text-amber-400 tracking-wide">
            Unsaved Draft Found
          </p>
          <p className="text-xs sm:text-sm text-amber-600/90 dark:text-amber-300/90 mt-0.5">
            You have an unfinished {formName} draft.
          </p>
          {timeLabel && (
            <p className="text-xs text-amber-600/75 dark:text-amber-400/75 mt-1">
              Last edited: <strong className="font-semibold text-amber-600 dark:text-amber-300">{timeLabel}</strong>
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5 shrink-0 ml-auto sm:ml-0">
        {/* Discard */}
        <button
          id="draft-recovery-discard-btn"
          type="button"
          onClick={onDiscard}
          className="px-4 py-2 rounded-lg border border-amber-500/30 hover:border-amber-500/60 bg-transparent hover:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer"
        >
          Discard Draft
        </button>

        {/* Continue Editing */}
        <button
          id="draft-recovery-continue-btn"
          type="button"
          onClick={onRestore}
          className="px-4 py-2 rounded-lg border-0 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs sm:text-sm font-semibold shadow-md hover:shadow-amber-500/25 hover:-translate-y-0.5 transition-all duration-150 cursor-pointer"
        >
          Continue Editing
        </button>
      </div>
    </div>
  );
}
