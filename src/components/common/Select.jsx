/**
 * Reusable Select component
 */
export function Select({
    id,
    label,
    value,
    onChange,
    options = [],
    error,
    helperText,
    required = false,
    disabled = false,
    placeholder = 'Select an option',
    className = '',
    ...props
}) {
    const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
        <div className={`flex flex-col gap-1.5 w-full ${className}`}>
            {label && (
                <label 
                    htmlFor={selectId} 
                    className="font-label-md text-sm font-semibold text-on-surface"
                >
                    {label} {required && <span className="text-error">*</span>}
                </label>
            )}

            <div className="relative flex items-center">
                <select
                    id={selectId}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    required={required}
                    aria-invalid={!!error}
                    className={`w-full py-2.5 pl-3.5 pr-10 bg-surface-container-low rounded-xl font-body-md text-sm text-on-surface appearance-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/30 transition-all outline-none cursor-pointer disabled:opacity-50 ${
                        error ? 'border border-error' : 'border border-transparent'
                    }`}
                    {...props}
                >
                    {placeholder && <option value="" disabled>{placeholder}</option>}
                    {options.map((opt) => (
                        <option key={opt.value ?? opt.id} value={opt.value ?? opt.id}>
                            {opt.label ?? opt.name}
                        </option>
                    ))}
                </select>

                <span className="material-symbols-outlined absolute right-3 text-outline pointer-events-none text-xl">
                    expand_more
                </span>
            </div>

            {error ? (
                <p role="alert" className="font-body-sm text-xs text-error flex items-center gap-1 mt-0.5">
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

export default Select;
