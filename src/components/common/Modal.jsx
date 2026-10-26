import { useEffect } from 'react';

/**
 * Accessible Modal dialog component
 * Supports ESC to close, backdrop click, body scroll locking, and accessible roles
 */
export function Modal({
    isOpen,
    onClose,
    title,
    description,
    children,
    maxWidth = 'max-w-md',
}) {
    useEffect(() => {
        if (!isOpen) return;

        function handleKeyDown(e) {
            if (e.key === 'Escape') {
                onClose();
            }
        }

        // Lock background scrolling
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = originalOverflow;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "modal-title" : undefined}
            aria-describedby={description ? "modal-description" : undefined}
        >
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal Card */}
            <div 
                className={`relative w-full ${maxWidth} bg-surface-container-lowest text-on-surface rounded-2xl shadow-2xl p-6 z-10 border border-surface-variant animate-in zoom-in-95 duration-200`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between gap-4 pb-3 border-b border-surface-container">
                    <div>
                        {title && (
                            <h3 id="modal-title" className="font-title-md text-lg font-bold text-on-surface">
                                {title}
                            </h3>
                        )}
                        {description && (
                            <p id="modal-description" className="font-body-sm text-sm text-on-surface-variant mt-0.5">
                                {description}
                            </p>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
                        aria-label="Close dialog"
                    >
                        <span className="material-symbols-outlined text-xl">close</span>
                    </button>
                </div>

                {/* Content */}
                <div className="py-4">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Modal;
