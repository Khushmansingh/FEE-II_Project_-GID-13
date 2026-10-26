import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { profileService } from '../api/profileService';
import { filesService, LOCATIONS } from '../api/filesService';
import { formatBytes, formatDate } from '../utils/formatters';
import { validateRequired } from '../utils/validators';
import Input from './common/Input';
import Button from './common/Button';
import Tabs from './common/Tabs';
import EmptyState from './common/EmptyState';
import LoadingSpinner from './common/LoadingSpinner';

function ProfileForm({ profile, user, onSave, isSaving }) {
    const [name, setName] = useState(() => profile?.name || user?.user_metadata?.username || user?.email?.split('@')[0] || '');
    const [branch, setBranch] = useState(() => profile?.branch || 'Computer Science & Engineering');
    const [year, setYear] = useState(() => profile?.year || '3rd Year (Sem 3)');
    const [bio, setBio] = useState(() => profile?.bio || 'Exploring web development and computer networks.');
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        const nameErr = validateRequired(name, 'Full Name');
        if (nameErr) {
            setErrors({ name: nameErr });
            return;
        }
        onSave({ name, branch, year, bio });
    };

    return (
        <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 shadow-sm border border-surface-container max-w-2xl">
            <div className="mb-6">
                <h2 className="font-title-md text-lg font-bold text-on-surface">Edit Academic Information</h2>
                <p className="font-body-sm text-sm text-on-surface-variant">
                    Your campus profile is displayed to peers when they view notes you have contributed.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                    label="Full Name / Display Name"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                    }}
                    placeholder="e.g. Khushman Singh"
                    required
                    error={errors.name}
                    icon="person"
                />

                <Input
                    label="Email Address"
                    value={user?.email || ''}
                    disabled
                    helperText="Email cannot be changed directly"
                    icon="alternate_email"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                        label="Branch / Major"
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        placeholder="e.g. CSE / IT"
                        icon="school"
                    />
                    <Input
                        label="Academic Year / Sem"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        placeholder="e.g. 3rd Year (Sem 3)"
                        icon="calendar_today"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="font-label-md text-sm font-semibold text-on-surface">
                        Academic Bio / Notes Philosophy
                    </label>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={3}
                        placeholder="Write a short line about your subjects or academic interests..."
                        className="w-full py-2.5 px-3.5 bg-surface-container-low rounded-xl font-body-md text-sm text-on-surface placeholder:text-outline focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/30 transition-all outline-none border border-transparent resize-none"
                    />
                </div>

                <div className="flex justify-end pt-3 border-t border-surface-container mt-2">
                    <Button
                        type="submit"
                        variant="primary"
                        isLoading={isSaving}
                        icon="save"
                    >
                        Save Profile
                    </Button>
                </div>
            </form>
        </div>
    );
}

export function Profile() {
    const { user, profile, refreshProfile } = useAuth();
    const toast = useToast();

    const [activeTab, setActiveTab] = useState('profile');
    const [isSaving, setIsSaving] = useState(false);
    const [myFiles, setMyFiles] = useState([]);
    const [isLoadingFiles, setIsLoadingFiles] = useState(false);

    useEffect(() => {
        let ignore = false;

        async function fetchUserFiles() {
            if (!user || activeTab !== 'uploads') return;
            setIsLoadingFiles(true);
            try {
                const allFiles = await filesService.fetchFiles();
                if (!ignore) {
                    const email = user.email;
                    const uname = profile?.name || user.user_metadata?.username || email;
                    const filtered = allFiles.filter(f => f.uploader === uname || f.uploader === email);
                    setMyFiles(filtered);
                }
            } catch (err) {
                if (!ignore) {
                    console.error('Error loading user files:', err);
                }
            } finally {
                if (!ignore) {
                    setIsLoadingFiles(false);
                }
            }
        }

        fetchUserFiles();

        return () => {
            ignore = true;
        };
    }, [activeTab, user, profile]);

    const handleSaveProfile = async ({ name, branch, year, bio }) => {
        setIsSaving(true);
        try {
            await profileService.upsertProfile({
                email: user.email,
                name: name.trim(),
                branch: branch.trim(),
                year: year.trim(),
                bio: bio.trim()
            });
            await refreshProfile(user);
            toast.success('Profile updated successfully!');
        } catch (err) {
            console.error('Failed to update profile:', err);
            toast.error('Failed to update profile: ' + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const tabs = [
        { id: 'profile', label: 'Academic Profile', icon: 'badge' },
        { id: 'uploads', label: 'My Uploads', icon: 'folder_shared', count: myFiles.length || undefined }
    ];

    const currentName = profile?.name || user?.user_metadata?.username || user?.email?.split('@')[0] || 'Student';

    return (
        <div className="flex flex-col w-full max-w-5xl mx-auto gap-6 pb-12">
            {/* Profile Hero Header */}
            <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-sm border border-surface-container flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="w-20 h-20 rounded-2xl bg-primary text-on-primary flex items-center justify-center font-bold text-3xl shadow-md shadow-primary/20 flex-shrink-0">
                        {currentName[0].toUpperCase()}
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="font-headline-md text-2xl font-bold text-on-surface">
                                {currentName}
                            </h1>
                            <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-xs font-semibold">
                                Verified
                            </span>
                        </div>
                        <p className="font-body-sm text-sm text-on-surface-variant">
                            {user?.email} · {profile?.branch || 'Computer Science & Engineering'}
                        </p>
                    </div>
                </div>

                <div className="flex sm:flex-col sm:items-end justify-between border-t sm:border-t-0 pt-4 sm:pt-0 border-surface-container">
                    <span className="text-xs uppercase tracking-wider text-outline font-semibold">
                        Academic Standing
                    </span>
                    <span className="font-title-md text-sm font-bold text-primary">
                        {profile?.year || '3rd Year (Sem 3)'}
                    </span>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex justify-start">
                <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            </div>

            {/* Tab 1: Profile Form (Keyed by profile?.email to automatically reinitialize if profile changes) */}
            {activeTab === 'profile' && (
                <ProfileForm
                    key={user?.email}
                    profile={profile}
                    user={user}
                    onSave={handleSaveProfile}
                    isSaving={isSaving}
                />
            )}

            {/* Tab 2: User's Uploads */}
            {activeTab === 'uploads' && (
                <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container">
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-surface-container">
                        <div>
                            <h2 className="font-title-md text-lg font-bold text-on-surface">Your Uploaded Materials</h2>
                            <p className="font-body-sm text-sm text-on-surface-variant">Resources shared by your account</p>
                        </div>
                        <Link to="/upload">
                            <Button size="sm" icon="add">Upload New</Button>
                        </Link>
                    </div>

                    {isLoadingFiles ? (
                        <LoadingSpinner message="Fetching your uploads..." />
                    ) : myFiles.length === 0 ? (
                        <EmptyState
                            icon="folder_open"
                            title="No Uploads Yet"
                            description="You haven't uploaded any study materials yet. Share your first lecture notes with classmates!"
                            actionLabel="Upload Resource"
                            actionIcon="cloud_upload"
                            onAction={() => window.location.href = '/upload'}
                        />
                    ) : (
                        <div className="flex flex-col divide-y divide-surface-container">
                            {myFiles.map(file => {
                                const loc = LOCATIONS.find(l => l.id === file.location);
                                return (
                                    <div key={file.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group">
                                        <div className="flex items-start gap-3 min-w-0">
                                            <div className="w-10 h-10 rounded-xl bg-primary-fixed/40 text-primary flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                                                {file.type}
                                            </div>
                                            <div className="min-w-0">
                                                <Link 
                                                    to={`/notes/${file.id}`}
                                                    className="font-title-md text-sm font-semibold text-on-surface hover:text-primary transition-colors truncate block"
                                                >
                                                    {file.title}
                                                </Link>
                                                <div className="flex flex-wrap items-center gap-2 text-xs text-on-surface-variant mt-1">
                                                    <span className="px-2 py-0.5 rounded-md bg-surface-container font-medium">
                                                        {loc?.name || file.location}
                                                    </span>
                                                    <span>{formatBytes(file.size_bytes)}</span>
                                                    <span>·</span>
                                                    <span>{file.downloads} downloads</span>
                                                    <span>·</span>
                                                    <span>{formatDate(file.date)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                                            <Link to={`/notes/${file.id}`}>
                                                <Button size="sm" variant="outline" icon="visibility">
                                                    View Details
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Profile;
