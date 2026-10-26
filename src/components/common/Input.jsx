/**
 * Reusable controlled Input component with validation error and label
 */
export function Input({
    id,
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    error,
    helperText,
    icon,
    rightAction,
    required = false,
    disabled = false,
    className = '',
    ...props
}) {
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
        <div className={`flex flex-col gap-1.5 w-full ${className}`}>
            {label && (
                <div className="flex items-center justify-between">
                    <label 
                        htmlFor={inputId} 
                        className="font-label-md text-sm font-semibold text-on-surface"
                    >
                        {label} {required && <span className="text-error">*</span>}
                    </label>
                </div>
            )}
            
            <div className="relative flex items-center">
                {icon && (
                    <span className="material-symbols-outlined absolute left-3.5 text-outline text-lg pointer-events-none">
                        {icon}
                    </span>
                )}
                
                <input
                    id={inputId}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${inputId}-error` : undefined}
                    className={`w-full py-2.5 bg-surface-container-low rounded-xl font-body-md text-sm text-on-surface placeholder:text-outline focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/30 transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
                        icon ? 'pl-10' : 'pl-3.5'
                    } ${rightAction ? 'pr-11' : 'pr-3.5'} ${
                        error ? 'border border-error focus:ring-error/20' : 'border border-transparent'
                    }`}
                    {...props}
                />

                {rightAction && (
                    <div className="absolute right-3 flex items-center">
                        {rightAction}
                    </div>
                )}
            </div>

            {error ? (
                <p id={`${inputId}-error`} role="alert" className="font-body-sm text-xs text-error flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-sm">error</span>
                    {error}
                </p>
            ) : helperText ? (
                <p className="font-body-sm text-xs text-outline mt-0.5">
                    {helperText}
                </p>
            ) : null}
        </div>
    );
}

export default Input;
