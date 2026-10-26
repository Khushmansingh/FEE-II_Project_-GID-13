import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { filesService, LOCATIONS } from '../api/filesService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatBytes, formatDate } from '../utils/formatters';
import Button from './common/Button';
import LoadingSpinner from './common/LoadingSpinner';
import EmptyState from './common/EmptyState';
import ConfirmationModal from './common/ConfirmationModal';
import EditResourceModal from './forms/EditResourceModal';

export function ResourceDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, profile } = useAuth();
    const toast = useToast();

    const [note, setNote] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        let ignore = false;

        async function fetchDetail() {
            try {
                const data = await filesService.fetchFileById(id);
                if (!ignore) {
                    setNote(data);
                }
            } catch (err) {
                if (!ignore) {
                    console.error('Failed to load note:', err);
                    toast.error('Could not load note details');
                }
            } finally {
                if (!ignore) {
                    setIsLoading(false);
                }
            }
        }

        fetchDetail();

        return () => {
            ignore = true;
        };
    }, [id, toast]);

    const handleDownload = async () => {
        if (!note) return;
        setIsDownloading(true);
        try {
            const updatedDownloads = await filesService.downloadFile(note);
            setNote(prev => ({ ...prev, downloads: updatedDownloads }));
            toast.success(`Downloading ${note.title}`);
        } catch (err) {
            console.error('Download error:', err);
            toast.error('Download failed: ' + err.message);
        } finally {
            setIsDownloading(false);
        }
    };

    const handleDelete = async () => {
        if (!note) return;
        setIsDeleting(true);
        try {
            await filesService.deleteFile(note.id, note.storage_path);
            toast.success('Resource deleted successfully');
            setShowDeleteModal(false);
            navigate('/browse');
        } catch (err) {
            console.error('Delete error:', err);
            toast.error('Failed to delete resource: ' + err.message);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCopyShareLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            toast.info('Share link copied to clipboard!');
        } catch {
            toast.error('Could not copy link to clipboard');
        }
    };

    if (isLoading) {
        return <LoadingSpinner fullPage message="Fetching resource details..." />;
    }

    if (!note) {
        return (
            <EmptyState
                icon="folder_off"
                title="Resource Not Found"
                description="This resource could not be found or may have been deleted."
                actionLabel="Back to Browse"
                actionIcon="arrow_back"
                onAction={() => navigate('/browse')}
            />
        );
    }

    const currentUserName = profile?.name || user?.user_metadata?.username || user?.email;
    const isOwner = note.uploader === currentUserName || note.uploader === user?.email;
    const locationObj = LOCATIONS.find(l => l.id === note.location);

    return (
        <div className="flex flex-col w-full max-w-4xl mx-auto gap-6 pb-12 animate-in fade-in duration-200">
            {/* Top Navigation */}
            <div className="flex items-center justify-between">
                <Link
                    to="/browse"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-colors"
                >
                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                    <span>Back to Browse</span>
                </Link>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        icon="share"
                        onClick={handleCopyShareLink}
                    >
                        Share
                    </Button>

                    {isOwner && (
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                icon="edit"
                                onClick={() => setShowEditModal(true)}
                            >
                                Edit
                            </Button>
                            <Button
                                variant="danger"
                                size="sm"
                                icon="delete"
                                onClick={() => setShowDeleteModal(true)}
                            >
                                Delete
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* Document Header Card */}
            <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-sm border border-surface-container flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-primary-fixed/40 text-primary flex items-center justify-center font-bold text-xl flex-shrink-0">
                        {note.type}
                    </div>
                    <div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="px-3 py-1 rounded-full bg-primary-container text-on-primary font-label-sm text-xs font-semibold">
                                {locationObj?.name || note.location}
                            </span>
                            {note.subject && (
                                <span className="px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-xs font-medium">
                                    {note.subject}
                                </span>
                            )}
                        </div>
                        <h1 className="font-headline-md text-2xl sm:text-3xl font-bold text-on-surface tracking-tight break-words">
                            {note.title}
                        </h1>
                        <p className="font-body-sm text-sm text-on-surface-variant mt-1">
                            Shared by <span className="font-semibold text-on-surface">{note.uploader}</span> · {formatDate(note.date)}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:items-end gap-2 flex-shrink-0">
                    <Button
                        variant="primary"
                        size="lg"
                        icon="download"
                        isLoading={isDownloading}
                        onClick={handleDownload}
                        className="w-full sm:w-auto"
                    >
                        Download Resource
                    </Button>
                    <span className="text-xs text-outline text-center sm:text-right">
                        {note.downloads} total downloads
                    </span>
                </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-surface-container">
                    <span className="text-xs uppercase tracking-wider text-outline font-semibold block mb-1">
                        Course Code
                    </span>
                    <span className="font-title-md text-base font-bold text-on-surface">
                        {locationObj?.name || 'General'}
                    </span>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                        {locationObj?.description || 'Study Material'}
                    </p>
                </div>

                <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-surface-container">
                    <span className="text-xs uppercase tracking-wider text-outline font-semibold block mb-1">
                        File Size
                    </span>
                    <span className="font-title-md text-base font-bold text-on-surface">
                        {formatBytes(note.size_bytes)}
                    </span>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                        Format: {note.type}
                    </p>
                </div>

                <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-surface-container">
                    <span className="text-xs uppercase tracking-wider text-outline font-semibold block mb-1">
                        Verification
                    </span>
                    <div className="flex items-center gap-1.5 text-tertiary font-bold text-sm">
                        <span className="material-symbols-outlined text-lg">verified</span>
                        <span>Campus Peer Verified</span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                        Available to campus network
                    </p>
                </div>
            </div>

            {/* Modals */}
            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                isConfirming={isDeleting}
                title="Delete Resource?"
                message={`Are you sure you want to permanently delete "${note.title}"? This cannot be undone.`}
                confirmText="Yes, Delete"
            />

            <EditResourceModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                note={note}
                onSuccess={(updated) => {
                    setNote(prev => ({
                        ...prev,
                        title: updated.name,
                        subject: updated.subject,
                        location: updated.location_id
                    }));
                }}
            />
        </div>
    );
}

export default ResourceDetail;
