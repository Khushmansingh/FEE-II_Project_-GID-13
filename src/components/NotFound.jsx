import { Link } from 'react-router-dom';

export function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 py-16">
            <div className="w-24 h-24 rounded-3xl bg-surface-container flex items-center justify-center text-primary mb-6 shadow-sm">
                <span className="material-symbols-outlined text-6xl">travel_explore</span>
            </div>
            
            <span className="font-label-sm uppercase tracking-wider text-outline font-semibold mb-2">
                Error 404
            </span>
            
            <h1 className="font-headline-lg text-3xl sm:text-4xl font-bold text-on-surface mb-3 tracking-tight">
                Page Not Found
            </h1>
            
            <p className="font-body-md text-base text-on-surface-variant max-w-md mb-8">
                The resource or study guide you were looking for doesn't seem to exist, was moved, or requires different access permissions.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                    to="/browse"
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-on-primary px-5 py-2.5 rounded-xl font-label-md text-sm font-semibold shadow-sm transition-all"
                >
                    <span className="material-symbols-outlined text-lg">search</span>
                    <span>Browse All Notes</span>
                </Link>
                <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface px-5 py-2.5 rounded-xl font-label-md text-sm font-semibold transition-all"
                >
                    <span className="material-symbols-outlined text-lg">space_dashboard</span>
                    <span>Go to Dashboard</span>
                </Link>
            </div>
        </div>
    );
}

export default NotFound;
