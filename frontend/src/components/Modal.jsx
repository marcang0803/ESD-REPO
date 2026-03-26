export default function Modal({ isOpen, title, children, onClose, primaryAction, primaryLabel = 'Confirm', secondaryLabel = 'Cancel' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
      <div className="bg-navy-light w-full rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>
        
        <div className="mb-6">
          {children}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-navy border border-navy-light text-white rounded-xl font-semibold hover:bg-navy-light transition-colors"
          >
            {secondaryLabel}
          </button>
          {primaryAction && (
            <button
              onClick={primaryAction}
              className="flex-1 px-4 py-3 bg-cyan text-navy-dark rounded-xl font-semibold hover:bg-cyan-light transition-colors"
            >
              {primaryLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
