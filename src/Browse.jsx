import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { filesService, LOCATIONS } from './api/filesService';
import { useAuth } from './context/AuthContext';
import { useToast } from './context/ToastContext';
import { useDebounce } from './hooks/useDebounce';
import { formatBytes, formatDate } from './utils/formatters';
import Button from './components/common/Button';
import Tabs from './components/common/Tabs';
import EmptyState from './components/common/EmptyState';
import LoadingSpinner from './components/common/LoadingSpinner';
import ConfirmationModal from './components/common/ConfirmationModal';
import EditResourceModal from './components/forms/EditResourceModal';

const SORT_OPTIONS = [
    { id: 'recent', label: 'Recently Added' },
    { id: 'popular', label: 'Most Popular' },
    { id: 'az', label: 'Title (A–Z)' },
    { id: 'size', label: 'File Size (Largest)' },
];

export function Browse() {
    const { user, profile } = useAuth();
    const toast = useToast();

    const [notes, setNotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [query, setQuery] = useState('');
    const [locationFilter, setLocationFilter] = useState('all');
    const [sortBy, setSortBy] = useState('recent');
    const [viewMode, setViewMode] = useState('grid');
    const [downloadingId, setDownloadingId] = useState(null);

    // Modal state for Edit & Delete
    const [editingNote, setEditingNote] = useState(null);
    const [deletingNote, setDeletingNote] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Debounce search query by 250ms
    const debouncedQuery = useDebounce(query, 250);

    useEffect(() => {
        let ignore = false;

        async function loadNotes() {
            try {
                const data = await filesService.fetchFiles();
                if (!ignore) {
                    setNotes(data);
                }
            } catch (error) {
                if (!ignore) {
                    console.error('Error fetching notes:', error);
                    toast.error('Failed to load notes: ' + error.message);
                }
            } finally {
                if (!ignore) {
                    setIsLoading(false);
                }
            }
        }

        loadNotes();

        return () => {
            ignore = true;
        };
    }, [toast]);

    const handleDownload = async (note) => {
        setDownloadingId(note.id);
        try {
            const newDownloads = await filesService.downloadFile(note);
            setNotes(prev => prev.map(n => n.id === note.id ? { ...n, downloads: newDownloads } : n));
            toast.success(`Downloaded "${note.title}"`);
        } catch (err) {
            console.error('Error downloading:', err);
            toast.error('Download failed: ' + err.message);
        } finally {
            setDownloadingId(null);
        }
    };

    const handleDelete = async () => {
        if (!deletingNote) return;
        setIsDeleting(true);
        try {
            await filesService.deleteFile(deletingNote.id, deletingNote.storage_path);
            setNotes(prev => prev.filter(n => n.id !== deletingNote.id));
            toast.success('Resource deleted successfully');
            setDeletingNote(null);
        } catch (err) {
            console.error('Delete error:', err);
            toast.error('Delete failed: ' + err.message);
        } finally {
            setIsDeleting(false);
        }
    };

    // Filter & Sort notes
    const filteredNotes = useMemo(() => {
        const q = debouncedQuery.toLowerCase().trim();
        let list = notes.filter(note => {
            const matchesQuery = !q || 
                note.title.toLowerCase().includes(q) || 
                (note.subject && note.subject.toLowerCase().includes(q)) ||
                note.uploader.toLowerCase().includes(q);
            const matchesLocation = locationFilter === 'all' || note.location === locationFilter;
            return matchesQuery && matchesLocation;
        });

        if (sortBy === 'recent') {
            list.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (sortBy === 'popular') {
            list.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
        } else if (sortBy === 'az') {
            list.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortBy === 'size') {
            list.sort((a, b) => (b.size_bytes || 0) - (a.size_bytes || 0));
        }

        return list;
    }, [notes, debouncedQuery, locationFilter, sortBy]);

    const currentUserName = profile?.name || user?.user_metadata?.username || user?.email;

    const viewTabs = [
        { id: 'grid', label: 'Grid', icon: 'grid_view' },
        { id: 'list', label: 'List', icon: 'format_list_bulleted' },
    ];

    return (
        <div className="flex flex-col w-full pb-16 animate-in fade-in duration-200">
            {/* Hero Search Section */}
            <section className="w-full py-6 sm:py-10 mb-6 flex flex-col items-center text-center max-w-3xl mx-auto">
                <span className="px-3.5 py-1 rounded-full bg-primary-fixed/60 text-primary font-label-sm text-xs font-bold tracking-wider uppercase mb-3 shadow-xs">
                    Verified Academic Repository
                </span>
                <h1 className="font-headline-lg text-2xl sm:text-4xl text-on-surface font-extrabold tracking-tight mb-2">
                    Browse Course Notes &amp; Exams
                </h1>
                <p className="font-body-md text-sm sm:text-base text-on-surface-variant mb-6 max-w-xl">
                    Search notes, past question papers, and revision slides shared by students across all semesters.
                </p>

                {/* Search Bar with clear button */}
                <div className="w-full relative flex items-center shadow-xs rounded-2xl bg-surface-container-lowest p-2 border border-surface-container focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary transition-all">
                    <span className="material-symbols-outlined text-outline text-2xl ml-3 mr-2 pointer-events-none">
                        search
                    </span>
                    <input 
                        className="w-full py-2.5 bg-transparent text-on-surface font-body-md placeholder:text-outline focus:outline-none text-sm sm:text-base"
                        placeholder="Search notes by title, topic, or uploader..."
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    {query && (
                        <button 
                            type="button"
                            className="mr-2 p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                            onClick={() => setQuery('')}
                            aria-label="Clear search"
                        >
                            <span className="material-symbols-outlined text-lg">close</span>
                        </button>
                    )}
                </div>

                {/* Category Filter Chips */}
                <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                    <button 
                        type="button"
                        className={`px-4 py-1.5 rounded-full font-label-md text-xs font-semibold transition-all cursor-pointer shadow-xs ${
                            locationFilter === 'all' 
                                ? 'bg-primary text-on-primary ring-2 ring-primary/30' 
                                : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                        }`}
                        onClick={() => setLocationFilter('all')}
                    >
                        All Categories
                    </button>
                    {LOCATIONS.map(loc => (
                        <button 
                            key={loc.id}
                            type="button"
                            className={`px-4 py-1.5 rounded-full font-label-md text-xs font-semibold transition-all cursor-pointer shadow-xs ${
                                locationFilter === loc.id 
                                    ? 'bg-primary text-on-primary ring-2 ring-primary/30' 
                                    : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                            }`}
                            onClick={() => setLocationFilter(loc.id)}
                        >
                            {loc.name}
                        </button>
                    ))}
                </div>
            </section>

            {/* Filter & View Toolbar */}
            <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-3 border-b border-surface-container">
                <div className="flex items-center gap-2">
                    <h2 className="font-title-md text-base font-bold text-on-surface">Resources</h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-xs font-semibold text-outline">
                        {filteredNotes.length} available
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <Tabs tabs={viewTabs} activeTab={viewMode} onTabChange={setViewMode} />

                    <div className="flex items-center bg-surface-container-lowest rounded-xl px-3 py-1.5 shadow-xs border border-surface-container text-on-surface-variant">
                        <span className="text-xs text-outline font-medium mr-1.5 hidden xs:inline">Sort:</span>
                        <select 
                            className="bg-transparent text-xs font-semibold text-on-surface focus:outline-none cursor-pointer"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            {SORT_OPTIONS.map(opt => (
                                <option key={opt.id} value={opt.id}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </section>

            {/* Content Display: Loading, Empty, Grid or List */}
            {isLoading ? (
                <LoadingSpinner fullPage message="Loading academic resources..." />
            ) : filteredNotes.length === 0 ? (
                <EmptyState
                    icon="search_off"
                    title="No matching notes found"
                    description={query ? `No materials found matching "${query}". Try different keywords or select another course.` : 'No study materials in this category yet.'}
                    actionLabel={query ? 'Clear Search' : 'Upload Resource'}
                    actionIcon={query ? 'refresh' : 'cloud_upload'}
                    onAction={() => {
                        if (query) {
                            setQuery('');
                            setLocationFilter('all');
                        } else {
                            window.location.href = '/upload';
                        }
                    }}
                />
            ) : viewMode === 'grid' ? (
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
                    {filteredNotes.map(note => {
                        const isOwner = note.uploader === currentUserName || note.uploader === user?.email;
                        const loc = LOCATIONS.find(l => l.id === note.location);

                        return (
                            <article 
                                key={note.id} 
                                className="group bg-surface-container-lowest rounded-2xl p-5 shadow-xs hover:shadow-lg border border-surface-container hover:border-primary/30 transition-all duration-300 flex flex-col justify-between hover:-translate-y-0.5"
                            >
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <span className="px-2.5 py-1 rounded-full bg-primary-fixed/40 text-primary font-label-sm text-xs font-bold">
                                            {loc?.name || note.location}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            {isOwner && (
                                                <button
                                                    type="button"
                                                    onClick={() => setEditingNote(note)}
                                                    className="p-1 rounded-lg text-outline hover:text-primary hover:bg-surface-container transition-colors"
                                                    title="Edit Resource"
                                                >
                                                    <span className="material-symbols-outlined text-base">edit</span>
                                                </button>
                                            )}
                                            <span className="text-xs font-semibold text-outline px-1.5 py-0.5 bg-surface-container rounded-md">
                                                {note.type}
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <Link 
                                            to={`/notes/${note.id}`}
                                            className="font-title-md text-base font-bold text-on-surface group-hover:text-primary transition-colors leading-snug line-clamp-2 block"
                                        >
                                            {note.title}
                                        </Link>
                                        {note.subject && (
                                            <p className="text-xs text-on-surface-variant font-medium mt-1 truncate">
                                                {note.subject}
                                            </p>
                                        )}
                                        <p className="text-xs text-outline mt-1.5">
                                            Uploaded by {note.uploader} · {formatDate(note.date)}
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-4 mt-4 border-t border-surface-container flex items-center justify-between">
                                    <span className="text-xs text-outline font-medium">
                                        {formatBytes(note.size_bytes)} · {note.downloads} dls
                                    </span>
                                    
                                    <div className="flex items-center gap-2">
                                        <Link to={`/notes/${note.id}`}>
                                            <Button size="sm" variant="outline" icon="visibility">
                                                View
                                            </Button>
                                        </Link>
                                        <Button 
                                            size="sm" 
                                            variant="primary" 
                                            icon="download"
                                            isLoading={downloadingId === note.id}
                                            onClick={() => handleDownload(note)}
                                        >
                                            Download
                                        </Button>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </section>
            ) : (
                <section className="bg-surface-container-lowest rounded-2xl shadow-xs border border-surface-container overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-surface-container bg-surface-container-low/50 text-xs font-semibold text-outline uppercase tracking-wider">
                                    <th className="py-3 px-4">Title &amp; Topic</th>
                                    <th className="py-3 px-4">Category</th>
                                    <th className="py-3 px-4">Size</th>
                                    <th className="py-3 px-4">Uploader</th>
                                    <th className="py-3 px-4">Downloads</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-container text-sm">
                                {filteredNotes.map(note => {
                                    const isOwner = note.uploader === currentUserName || note.uploader === user?.email;
                                    const loc = LOCATIONS.find(l => l.id === note.location);

                                    return (
                                        <tr key={note.id} className="hover:bg-surface-container-low transition-colors">
                                            <td className="py-3.5 px-4">
                                                <Link 
                                                    to={`/notes/${note.id}`}
                                                    className="font-semibold text-on-surface hover:text-primary transition-colors block truncate max-w-xs"
                                                >
                                                    {note.title}
                                                </Link>
                                                {note.subject && (
                                                    <span className="text-xs text-on-surface-variant block truncate max-w-xs">
                                                        {note.subject}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className="px-2 py-0.5 rounded-md bg-surface-container text-xs font-semibold">
                                                    {loc?.name || note.location}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-xs text-outline">
                                                {formatBytes(note.size_bytes)}
                                            </td>
                                            <td className="py-3.5 px-4 text-xs text-on-surface-variant">
                                                {note.uploader}
                                            </td>
                                            <td className="py-3.5 px-4 text-xs font-medium text-on-surface">
                                                {note.downloads}
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link to={`/notes/${note.id}`}>
                                                        <Button size="sm" variant="ghost" icon="visibility">
                                                            Details
                                                        </Button>
                                                    </Link>
                                                    <Button 
                                                        size="sm" 
                                                        variant="primary" 
                                                        icon="download"
                                                        isLoading={downloadingId === note.id}
                                                        onClick={() => handleDownload(note)}
                                                    >
                                                        Download
                                                    </Button>
                                                    {isOwner && (
                                                        <Button 
                                                            size="sm" 
                                                            variant="danger" 
                                                            icon="delete"
                                                            onClick={() => setDeletingNote(note)}
                                                        >
                                                            Delete
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}

            {/* Modals for Edit and Delete */}
            {editingNote && (
                <EditResourceModal
                    isOpen={!!editingNote}
                    onClose={() => setEditingNote(null)}
                    note={editingNote}
                    onSuccess={(updated) => {
                        setNotes(prev => prev.map(n => n.id === updated.id ? {
                            ...n,
                            title: updated.name,
                            subject: updated.subject,
                            location: updated.location_id
                        } : n));
                    }}
                />
            )}

            <ConfirmationModal
                isOpen={!!deletingNote}
                onClose={() => setDeletingNote(null)}
                onConfirm={handleDelete}
                isConfirming={isDeleting}
                title="Delete Resource?"
                message={`Are you sure you want to permanently delete "${deletingNote?.title}"?`}
            />
        </div>
    );
}

export default Browse;