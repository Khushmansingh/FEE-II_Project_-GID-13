import Button from './Button';

/**
 * Reusable empty state display
 */
export function EmptyState({
    icon = 'search_off',
    title = 'No records found',
    description = 'There are no items matching your criteria at this moment.',
    actionLabel,
    onAction,
    actionIcon,
    className = ''
}) {
    return (
        <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
            <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center text-outline mb-4">
                <span className="material-symbols-outlined text-4xl">{icon}</span>
            </div>
            <h3 className="font-title-md text-lg font-bold text-on-surface mb-1">
                {title}
            </h3>
            <p className="font-body-sm text-sm text-on-surface-variant max-w-sm mb-6">
                {description}
            </p>
            {actionLabel && onAction && (
                <Button
                    type="button"
                    variant="primary"
                    onClick={onAction}
                    icon={actionIcon}
                >
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}

export default EmptyState;
