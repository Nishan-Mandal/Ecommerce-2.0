
export default function DescriptionTab({ description, specifications }) {
  return (
    <div className="space-y-8 py-6">
      {/* Description */}
      {description && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">About this product</h3>
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">{description}</p>
        </div>
      )}
      {!description && (!specifications || specifications.length === 0) && (
        <p className="text-gray-400 italic text-sm">No details available.</p>
      )}
    </div>
  );
}