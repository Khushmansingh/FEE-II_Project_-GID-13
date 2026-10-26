/**
 * Reusable Tabs component
 */
export function Tabs({ tabs = [], activeTab, onTabChange, className = '' }) {
    return (
        <div className={`flex items-center p-1 bg-surface-container-low rounded-xl gap-1 ${className}`} role="tablist">
            {tabs.map(tab => {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        role="tab"
                        aria-selected={isActive}
                        type="button"
                        onClick={() => onTabChange(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-label-md text-sm font-semibold transition-all duration-200 cursor-pointer ${
                            isActive
                                ? 'bg-surface-container-lowest text-primary shadow-sm'
                                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50'
                        }`}
                    >
                        {tab.icon && (
                            <span className="material-symbols-outlined text-base">
                                {tab.icon}
                            </span>
                        )}
                        <span>{tab.label}</span>
                        {tab.count !== undefined && (
                            <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                                isActive ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-surface-container text-outline'
                            }`}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}

export default Tabs;
