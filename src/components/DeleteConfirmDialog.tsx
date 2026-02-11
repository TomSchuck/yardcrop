"use client";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  listingName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmDialog({
  isOpen,
  listingName,
  onConfirm,
  onCancel,
}: DeleteConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-charcoal/50"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="relative bg-soft-white rounded-lg shadow-xl max-w-sm w-full p-6">
        <h3 className="text-lg font-bold text-charcoal mb-2">Delete Listing?</h3>
        <p className="text-warm-gray mb-6">
          Are you sure you want to delete &quot;{listingName}&quot;? This action cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-border rounded-lg text-charcoal font-medium hover:bg-cream transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-error-red text-white rounded-lg font-medium hover:bg-error-red/90 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
