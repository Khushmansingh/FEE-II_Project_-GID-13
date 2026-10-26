import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const addToast = useCallback((message, type = 'info', durationMs = 4000) => {
        const id = Date.now() + Math.random().toString(36).substring(2, 7);
        const newToast = { id, message, type };

        setToasts(prev => [...prev, newToast]);

        if (durationMs > 0) {
            setTimeout(() => {
                removeToast(id);
            }, durationMs);
        }
    }, [removeToast]);

    const toast = {
        success: (msg, duration) => addToast(msg, 'success', duration),
        error: (msg, duration) => addToast(msg, 'error', duration),
        info: (msg, duration) => addToast(msg, 'info', duration)
    };

    return (
        <ToastContext.Provider value={{ toast, addToast, removeToast }}>
            {children}
            {/* Toast Container */}
            <div 
                aria-live="polite"
                aria-atomic="true"
                className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"
            >
                {toasts.map(item => (
                    <div
                        key={item.id}
                        role="alert"
                        className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl shadow-lg border transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 ${
                            item.type === 'success' 
                                ? 'bg-surface-container-lowest text-on-surface border-tertiary-container'
                                : item.type === 'error'
                                ? 'bg-surface-container-lowest text-on-surface border-error'
                                : 'bg-surface-container-lowest text-on-surface border-surface-variant'
                        }`}
                    >
                        <div className="flex items-center gap-2.5 min-w-0">
                            <span className={`material-symbols-outlined text-xl flex-shrink-0 ${
                                item.type === 'success' ? 'text-tertiary' : item.type === 'error' ? 'text-error' : 'text-primary'
                            }`}>
                                {item.type === 'success' ? 'check_circle' : item.type === 'error' ? 'error' : 'info'}
                            </span>
                            <p className="font-body-sm text-sm font-medium leading-snug break-words">
                                {item.message}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => removeToast(item.id)}
                            className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors flex-shrink-0"
                            aria-label="Close notification"
                        >
                            <span className="material-symbols-outlined text-base">close</span>
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context.toast;
}
