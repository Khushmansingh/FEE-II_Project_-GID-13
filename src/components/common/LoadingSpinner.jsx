/**
 * Consistent loading indicator component
 */
export function LoadingSpinner({
    message = 'Loading...',
    size = 'md',
    fullPage = false,
    className = ''
}) {
    const sizeMap = {
        sm: 'text-xl',
        md: 'text-3xl',
        lg: 'text-5xl'
    };

    const content = (
        <div className={`flex flex-col items-center justify-center gap-3 text-on-surface-variant ${className}`}>
            <span className={`material-symbols-outlined animate-spin text-primary ${sizeMap[size] || sizeMap.md}`}>
                progress_activity
            </span>
            {message && (
                <p className="font-label-md text-sm font-medium tracking-wide">
                    {message}
                </p>
            )}
        </div>
    );

    if (fullPage) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center w-full">
                {content}
            </div>
        );
    }

    return content;
}

export default LoadingSpinner;
