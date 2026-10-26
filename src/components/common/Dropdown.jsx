import { useState, useRef, useEffect } from 'react';

/**
 * Reusable Dropdown menu with click-outside detection and ESC handling
 */
export function Dropdown({ trigger, items = [], align = 'right', className = '' }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        function handleKeyDown(e) {
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    return (
        <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
            <div onClick={() => setIsOpen(prev => !prev)} className="cursor-pointer">
                {trigger}
            </div>

            {isOpen && (
                <div
                    className={`absolute z-40 mt-2 w-56 rounded-xl bg-surface-container-lowest shadow-xl border border-surface-variant p-1.5 focus:outline-none animate-in fade-in zoom-in-95 duration-150 ${
                        align === 'right' ? 'right-0' : 'left-0'
                    }`}
                >
                    {items.map((item, index) => {
                        if (item.divider) {
                            return <hr key={`divider-${index}`} className="my-1 border-surface-variant" />;
                        }

                        return (
                            <button
                                key={item.id || item.label || index}
                                type="button"
                                onClick={() => {
                                    item.onClick?.();
                                    setIsOpen(false);
                                }}
                                disabled={item.disabled}
                                className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg font-label-md transition-colors text-left cursor-pointer ${
                                    item.danger
                                        ? 'text-error hover:bg-error-container hover:text-on-error-container'
                                        : 'text-on-surface hover:bg-surface-container-high'
                                } ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {item.icon && (
                                    <span className="material-symbols-outlined text-lg">
                                        {item.icon}
                                    </span>
                                )}
                                <span className="flex-1">{item.label}</span>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Dropdown;
