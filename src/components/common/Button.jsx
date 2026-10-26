/**
 * Reusable Button component with accessible states and variant styling
 */
export function Button({
    children,
    type = 'button',
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled = false,
    icon = null,
    className = '',
    onClick,
    ...props
}) {
    const baseClasses = "inline-flex items-center justify-center font-label-md font-semibold rounded-xl transition-all duration-200 select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 disabled:cursor-not-allowed";

    const variantClasses = {
        primary: "bg-primary hover:bg-primary/90 text-on-primary shadow-sm hover:shadow active:scale-[0.98]",
        secondary: "bg-secondary-container hover:bg-secondary text-on-secondary shadow-sm active:scale-[0.98]",
        outline: "bg-transparent border border-outline-variant hover:border-outline text-on-surface hover:bg-surface-container active:scale-[0.98]",
        ghost: "bg-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container",
        danger: "bg-error hover:bg-error/90 text-on-error shadow-sm active:scale-[0.98]"
    };

    const sizeClasses = {
        sm: "px-3 py-1.5 text-xs gap-1.5",
        md: "px-4 py-2.5 text-sm gap-2",
        lg: "px-6 py-3.5 text-base gap-2.5"
    };

    return (
        <button
            type={type}
            disabled={disabled || isLoading}
            onClick={onClick}
            className={`${baseClasses} ${variantClasses[variant] || variantClasses.primary} ${sizeClasses[size] || sizeClasses.md} ${className}`}
            {...props}
        >
            {isLoading ? (
                <>
                    <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                    <span>Processing...</span>
                </>
            ) : (
                <>
                    {icon && <span className="material-symbols-outlined text-lg">{icon}</span>}
                    {children}
                </>
            )}
        </button>
    );
}

export default Button;
