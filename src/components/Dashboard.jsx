import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { filesService, LOCATIONS } from '../api/filesService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatBytes, formatDate } from '../utils/formatters';
import Button from './common/Button';
import LoadingSpinner from './common/LoadingSpinner';
import EmptyState from './common/EmptyState';
import ConfirmationModal from './common/ConfirmationModal';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

export function Dashboard() {
    const { user, profile } = useAuth();
    const toast = useToast();

    const [stats, setStats] = useState({
        totalFiles: 0,
        totalDownloads: 0,
        totalStorage: '0 B',
        barData: [],
        pieData: [],
        recentFiles: [],
    });
    const [isLoading, setIsLoading] = useState(true);
    const [deletingFile, setDeletingFile] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        let ignore = false;

        async function fetchMetrics() {
            if (!user) return;
            try {
                const allFiles = await filesService.fetchFiles();
                if (!ignore) {
                    const email = user.email;
                    const username = profile?.name || user.user_metadata?.username || email;

                    const userFiles = allFiles.filter(file => 
                        file.uploader === username || file.uploader === email
                    );

                    let totalDownloads = 0;
                    let totalStorageBytes = 0;
                    const locCounts = {};
                    const locStorage = {};

                    LOCATIONS.forEach(loc => {
                        locCounts[loc.id] = 0;
                        locStorage[loc.id] = 0;
                    });

                    userFiles.forEach(file => {
                        totalDownloads += (file.downloads || 0);
                        totalStorageBytes += (file.size_bytes || 0);
                        if (locCounts[file.location] !== undefined) {
                            locCounts[file.location]++;
                            locStorage[file.location] += (file.size_bytes || 0);
                        }
                    });

                    const barData = LOCATIONS.map(loc => ({
                        name: loc.name,
                        uploads: locCounts[loc.id]
                    }));

                    const pieData = LOCATIONS.map(loc => ({
                        name: loc.name,
                        value: locStorage[loc.id]
                    })).filter(item => item.value > 0);

                    setStats({
                        totalFiles: userFiles.length,
                        totalDownloads,
                        totalStorage: formatBytes(totalStorageBytes),
                        barData,
                        pieData,
                        recentFiles: userFiles.slice(0, 5)
                    });
                }
            } catch (error) {
                if (!ignore) {
                    console.error('Error fetching dashboard data:', error);
                    toast.error('Failed to load dashboard metrics');
                }
            } finally {
                if (!ignore) {
                    setIsLoading(false);
                }
            }
        }

        fetchMetrics();

        return () => {
            ignore = true;
        };
    }, [user, profile, toast]);

    const handleDelete = async () => {
        if (!deletingFile) return;
        setIsDeleting(true);
        try {
            await filesService.deleteFile(deletingFile.id, deletingFile.storage_path);
            toast.success('Resource deleted');
            setStats(prev => ({
                ...prev,
                totalFiles: Math.max(0, prev.totalFiles - 1),
                recentFiles: prev.recentFiles.filter(f => f.id !== deletingFile.id)
            }));
            setDeletingFile(null);
        } catch (err) {
            console.error('Error deleting:', err);
            toast.error('Delete failed: ' + err.message);
        } finally {
            setIsDeleting(false);
        }
    };

    if (isLoading) {
        return <LoadingSpinner fullPage message="Compiling your workspace metrics..." />;
    }

    const displayName = profile?.name || user?.user_metadata?.username || user?.email?.split('@')[0] || 'Scholar';

    return (
        <div className="flex flex-col w-full gap-6 pb-12 animate-in fade-in duration-200">
            {/* Greeting Header */}
            <section className="relative w-full rounded-3xl bg-surface-container-lowest shadow-xs border border-surface-container overflow-hidden p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant w-fit shadow-xs mb-2">
                            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
                            <span className="font-label-sm text-xs font-semibold text-primary">Academic Workspace Active</span>
                        </div>
                        <h1 className="font-headline-lg text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
                            Welcome back, {displayName}
                        </h1>
                        <p className="font-body-md text-sm text-on-surface-variant mt-1 max-w-xl">
                            Track the impact of your shared study materials, view download metrics, and manage your campus contributions.
                        </p>
                    </div>

                    <Link to="/upload" className="flex-shrink-0">
                        <Button variant="primary" icon="add">
                            Upload New Notes
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Top Stat KPI Cards */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-surface-container flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-fixed/40 flex items-center justify-center text-primary flex-shrink-0">
                        <span className="material-symbols-outlined text-2xl">description</span>
                    </div>
                    <div>
                        <span className="text-xs uppercase tracking-wider text-outline font-semibold block">Total Uploads</span>
                        <span className="font-headline-md text-2xl font-bold text-on-surface">{stats.totalFiles}</span>
                    </div>
                </div>

                <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-surface-container flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary-fixed/40 flex items-center justify-center text-secondary flex-shrink-0">
                        <span className="material-symbols-outlined text-2xl">download</span>
                    </div>
                    <div>
                        <span className="text-xs uppercase tracking-wider text-outline font-semibold block">Total Downloads</span>
                        <span className="font-headline-md text-2xl font-bold text-on-surface">{stats.totalDownloads}</span>
                    </div>
                </div>

                <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-surface-container flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-tertiary-fixed/50 flex items-center justify-center text-tertiary flex-shrink-0">
                        <span className="material-symbols-outlined text-2xl">database</span>
                    </div>
                    <div>
                        <span className="text-xs uppercase tracking-wider text-outline font-semibold block">Vault Storage</span>
                        <span className="font-headline-md text-2xl font-bold text-on-surface">{stats.totalStorage}</span>
                    </div>
                </div>
            </section>

            {/* Charts Section */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Bar Chart */}
                <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-surface-container flex flex-col gap-4">
                    <div className="flex items-center justify-between pb-2 border-b border-surface-container">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-xl">bar_chart</span>
                            <h2 className="font-title-md text-base font-bold text-on-surface">Uploads by Course</h2>
                        </div>
                        <span className="text-xs text-outline font-medium">Semester Breakdown</span>
                    </div>
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.barData} margin={{ top: 20, right: 20, left: -20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--outline-variant)" opacity={0.3} />
                                <XAxis dataKey="name" tick={{ fill: 'var(--outline)', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: 'var(--outline)', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <RechartsTooltip 
                                    contentStyle={{ 
                                        backgroundColor: 'var(--surface-container-high)', 
                                        borderColor: 'var(--outline-variant)', 
                                        borderRadius: '12px', 
                                        color: 'var(--on-surface)',
                                        fontSize: '12px'
                                    }}
                                    cursor={{ fill: 'rgba(79, 70, 229, 0.05)' }} 
                                />
                                <Bar dataKey="uploads" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={36} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Storage Distribution Pie */}
                <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-surface-container flex flex-col gap-4">
                    <div className="flex items-center justify-between pb-2 border-b border-surface-container">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-secondary text-xl">pie_chart</span>
                            <h2 className="font-title-md text-base font-bold text-on-surface">Storage Distribution</h2>
                        </div>
                        <span className="text-xs text-outline font-medium">By Course Category</span>
                    </div>
                    <div className="h-[280px] flex justify-center items-center">
                        {stats.pieData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie 
                                        data={stats.pieData} 
                                        innerRadius={65} 
                                        outerRadius={95} 
                                        paddingAngle={4} 
                                        dataKey="value"
                                    >
                                        {stats.pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip 
                                        formatter={(value) => formatBytes(value)}
                                        contentStyle={{ 
                                            backgroundColor: 'var(--surface-container-high)', 
                                            borderColor: 'var(--outline-variant)', 
                                            borderRadius: '12px', 
                                            color: 'var(--on-surface)',
                                            fontSize: '12px'
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-center text-on-surface-variant text-sm">
                                <span className="material-symbols-outlined text-4xl text-outline mb-2">donut_large</span>
                                <p>No uploads recorded yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Recent Uploads Table / List */}
            <section className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-surface-container flex flex-col gap-4">
                <div className="flex items-center justify-between pb-2 border-b border-surface-container">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-xl">folder_open</span>
                        <h2 className="font-title-md text-base font-bold text-on-surface">Your Recent Uploads</h2>
                    </div>
                    <Link to="/profile" className="text-xs text-primary font-semibold hover:underline">
                        View All
                    </Link>
                </div>

                <div className="flex flex-col divide-y divide-surface-container">
                    {stats.recentFiles.length > 0 ? (
                        stats.recentFiles.map(file => {
                            const loc = LOCATIONS.find(l => l.id === file.location);
                            return (
                                <div key={file.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-3.5 gap-3 group">
                                    <div className="flex items-center gap-3.5 min-w-0">
                                        <span className="px-2.5 py-1.5 rounded-lg bg-primary-container text-on-primary font-bold text-xs uppercase flex-shrink-0">
                                            {file.type}
                                        </span>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <Link 
                                                    to={`/notes/${file.id}`}
                                                    className="font-title-md text-sm font-semibold text-on-surface group-hover:text-primary transition-colors truncate"
                                                >
                                                    {file.title}
                                                </Link>
                                                <span className="px-2 py-0.5 rounded-md bg-surface-container text-xs font-semibold text-on-surface flex-shrink-0">
                                                    {loc?.name || file.location}
                                                </span>
                                            </div>
                                            <p className="text-xs text-outline mt-0.5">
                                                {formatBytes(file.size_bytes)} · Uploaded {formatDate(file.date)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container-low text-on-surface text-xs font-semibold">
                                            <span className="material-symbols-outlined text-sm text-secondary">download</span>
                                            {file.downloads || 0}
                                        </span>
                                        <Link to={`/notes/${file.id}`}>
                                            <Button size="sm" variant="ghost" icon="visibility">
                                                View
                                            </Button>
                                        </Link>
                                        <Button 
                                            size="sm" 
                                            variant="ghost" 
                                            icon="delete"
                                            className="text-error hover:bg-error-container"
                                            onClick={() => setDeletingFile(file)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <EmptyState
                            icon="cloud_upload"
                            title="No Resources Uploaded Yet"
                            description="Upload your lecture notes, summaries, or assignments to see your stats here."
                            actionLabel="Upload First Resource"
                            actionIcon="add"
                            onAction={() => window.location.href = '/upload'}
                        />
                    )}
                </div>
            </section>

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={!!deletingFile}
                onClose={() => setDeletingFile(null)}
                onConfirm={handleDelete}
                isConfirming={isDeleting}
                title="Delete Upload?"
                message={`Are you sure you want to delete "${deletingFile?.title}"?`}
            />
        </div>
    );
}

export default Dashboard;
