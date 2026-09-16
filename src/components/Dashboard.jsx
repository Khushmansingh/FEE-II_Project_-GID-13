import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';


const LOCATIONS = [
    { id: 'fee', name: 'FEE-II' },
    { id: 'opps', name: 'OPPS' },
    { id: 'dbms', name: 'DBMS' },
    { id: 'dis', name: 'Discr' },
];

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

function formatBytes(bytes) {
    if (!+bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function Dashboard() {
    const [stats, setStats] = useState({
        totalFiles: 0,
        totalDownloads: 0,
        totalStorage: '0 B',
        barData: [],
        pieData: [],
        recentFiles: [],
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    async function fetchDashboardData() {
        setIsLoading(true);
        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError) throw userError;
            
            const email = user.email;
            const username = user.user_metadata?.username || email;

            const { data, error } = await supabase
                .from('files')
                .select('*')
                .or(`uploader.eq.${username},uploader.eq.${email}`);

            if (error) throw error;

            let totalDownloads = 0;
            let totalStorageBytes = 0;
            let locCounts = {};
            let locStorage = {};
            
            LOCATIONS.forEach(loc => {
                locCounts[loc.id] = 0;
                locStorage[loc.id] = 0;
            });

            data.forEach(file => {
                totalDownloads += (file.downloads || 0);
                totalStorageBytes += (file.size_bytes || 0);
                if (locCounts[file.location_id] !== undefined) {
                    locCounts[file.location_id]++;
                    locStorage[file.location_id] += (file.size_bytes || 0);
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

            const sortedFiles = [...data].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

            setStats({
                totalFiles: data.length,
                totalDownloads: totalDownloads,
                totalStorage: formatBytes(totalStorageBytes),
                barData,
                pieData,
                recentFiles: sortedFiles
            });

        } catch (error) {
            console.log('Error fetching dashboard data:', error.message);
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh] flex-col gap-4 text-on-surface-variant">
                <span className="material-symbols-outlined animate-spin text-primary text-3xl">progress_activity</span>
                <p className="font-label-md text-label-md">Loading your workspace...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full gap-space-xl">
            <section className="relative w-full rounded-2xl bg-surface-container-lowest shadow-sm overflow-hidden p-space-lg lg:p-space-xl">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <div className="inline-flex items-center gap-2 px-space-sm py-1 rounded-full bg-surface-container text-on-surface-variant w-fit shadow-sm mb-2">
                                <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                                <span className="font-label-sm text-label-sm font-semibold text-primary">Workspace Active</span>
                            </div>
                            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Your Dashboard</h1>
                            <p className="font-body-md text-body-md text-on-surface-variant mt-1">Everything you need for your classes today in one quiet space.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-1 sm:grid-cols-3 gap-gutter">
                <div className="bg-surface-container-lowest rounded-2xl p-space-md lg:p-space-lg shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-fixed/40 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-2xl">description</span>
                    </div>
                    <div>
                        <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold block">Total Uploads</span>
                        <span className="font-headline-md text-headline-md font-bold text-on-surface">{stats.totalFiles}</span>
                    </div>
                </div>
                
                <div className="bg-surface-container-lowest rounded-2xl p-space-md lg:p-space-lg shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary-fixed/40 flex items-center justify-center text-secondary">
                        <span className="material-symbols-outlined text-2xl">download</span>
                    </div>
                    <div>
                        <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold block">Downloads</span>
                        <span className="font-headline-md text-headline-md font-bold text-on-surface">{stats.totalDownloads}</span>
                    </div>
                </div>

                <div className="bg-surface-container-lowest rounded-2xl p-space-md lg:p-space-lg shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-tertiary-fixed/50 flex items-center justify-center text-tertiary">
                        <span className="material-symbols-outlined text-2xl">database</span>
                    </div>
                    <div>
                        <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold block">Storage Used</span>
                        <span className="font-headline-md text-headline-md font-bold text-on-surface">{stats.totalStorage}</span>
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
                <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col gap-4">
                    <div className="flex items-center gap-2 pb-2">
                        <span className="material-symbols-outlined text-primary text-xl">bar_chart</span>
                        <h2 className="font-title-md text-title-md font-bold text-on-surface">Uploads by Category</h2>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--outline-variant)" />
                                <XAxis dataKey="name" tick={{fill: 'var(--outline)'}} axisLine={false} tickLine={false} />
                                <YAxis tick={{fill: 'var(--outline)'}} axisLine={false} tickLine={false} />
                                <RechartsTooltip 
                                    contentStyle={{ backgroundColor: 'var(--surface-container-high)', borderColor: 'var(--outline-variant)', borderRadius: '8px', color: 'var(--on-surface)' }}
                                    cursor={{fill: 'rgba(53, 37, 205, 0.05)'}} 
                                />
                                <Bar dataKey="uploads" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col gap-4">
                    <div className="flex items-center gap-2 pb-2">
                        <span className="material-symbols-outlined text-secondary text-xl">pie_chart</span>
                        <h2 className="font-title-md text-title-md font-bold text-on-surface">Storage Distribution</h2>
                    </div>
                    <div className="h-[300px] flex justify-center items-center">
                        {stats.pieData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie 
                                        data={stats.pieData} 
                                        innerRadius={70} 
                                        outerRadius={100} 
                                        paddingAngle={5} 
                                        dataKey="value"
                                    >
                                        {stats.pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip 
                                        formatter={(value) => formatBytes(value)}
                                        contentStyle={{ backgroundColor: 'var(--surface-container-high)', borderColor: 'var(--outline-variant)', borderRadius: '8px', color: 'var(--on-surface)' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-on-surface-variant">No storage data available.</p>
                        )}
                    </div>
                </div>
            </section>

            <section className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col gap-4">
                <div className="flex items-center justify-between pb-1">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-xl">folder_open</span>
                        <h2 className="font-title-md text-title-md font-bold text-on-surface">Recent Uploads</h2>
                    </div>
                </div>
                
                <div className="flex flex-col divide-y divide-surface-container">
                    {stats.recentFiles.length > 0 ? (
                        stats.recentFiles.map(file => (
                            <div key={file.id} className="flex items-center justify-between py-3.5 gap-4 group">
                                <div className="flex items-center gap-3.5 min-w-0">
                                    <span className="px-2.5 py-1.5 rounded-lg bg-primary-container text-on-primary-container font-label-sm text-label-sm font-bold uppercase">
                                        {file.name.split('.').pop()}
                                    </span>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-title-md text-title-md font-semibold text-on-surface group-hover:text-primary transition-colors truncate">
                                                {file.name}
                                            </h4>
                                            <span className="px-2 py-0.5 rounded-md bg-surface-container-high text-on-surface text-xs font-bold">
                                                {LOCATIONS.find(l => l.id === file.location_id)?.name || 'Unknown'}
                                            </span>
                                        </div>
                                        <p className="text-body-sm text-on-surface-variant text-xs mt-0.5">
                                            {formatBytes(file.size_bytes)} · Uploaded {new Date(file.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface font-label-sm text-label-sm font-semibold flex-shrink-0">
                                    <span className="material-symbols-outlined text-secondary text-sm">download</span>
                                    <span>{file.downloads || 0}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-8 text-center text-on-surface-variant font-body-sm">
                            You haven't uploaded any files yet.
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

export default Dashboard;
