import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { filesService, LOCATIONS } from '../api/filesService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { validateFileUpload, validateRequired } from '../utils/validators';
import { formatBytes } from '../utils/formatters';
import Button from './common/Button';
import Input from './common/Input';

export function Home() {
    const navigate = useNavigate();
    const { user, profile } = useAuth();
    const toast = useToast();

    const [selectedLocation, setSelectedLocation] = useState('');
    const [subject, setSubject] = useState('');
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const [errors, setErrors] = useState({});
    const fileInputRef = useRef(null);

    function handleFileChange(event) {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            const err = validateFileUpload(selectedFile);
            if (err) {
                toast.error(err);
                return;
            }
            setFile(selectedFile);
            setErrors(prev => ({ ...prev, file: '' }));
        }
    }

    function handleDragOver(e) {
        e.preventDefault();
        setIsDragOver(true);
    }

    function handleDragLeave(e) {
        e.preventDefault();
        setIsDragOver(false);
    }

    function handleDrop(e) {
        e.preventDefault();
        setIsDragOver(false);
        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) {
            const err = validateFileUpload(droppedFile);
            if (err) {
                toast.error(err);
                return;
            }
            setFile(droppedFile);
            setErrors(prev => ({ ...prev, file: '' }));
        }
    }

    async function handleUpload(e) {
        e.preventDefault();

        const newErrors = {};
        if (!file) newErrors.file = 'Please select a file to upload.';
        const locErr = validateRequired(selectedLocation, 'Course category');
        if (locErr) newErrors.location = locErr;

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            toast.error('Please complete all required fields.');
            return;
        }

        setIsUploading(true);
        try {
            const uploaderName = profile?.name || user?.user_metadata?.username || user?.email || 'Anonymous';

            const uploadedFile = await filesService.uploadFile({
                file,
                locationId: selectedLocation,
                subject: subject.trim(),
                uploader: uploaderName
            });

            toast.success(`"${file.name}" uploaded successfully!`);
            setFile(null);
            setSelectedLocation('');
            setSubject('');
            setErrors({});

            // Navigate to browse or uploaded resource
            if (uploadedFile?.id) {
                navigate(`/notes/${uploadedFile.id}`);
            } else {
                navigate('/browse');
            }
        } catch (error) {
            console.error('Error uploading:', error);
            toast.error('Error uploading file: ' + (error.message || 'Server error'));
        } finally {
            setIsUploading(false);
        }
    }

    return (
        <div className="flex flex-col w-full max-w-4xl mx-auto pb-12 animate-in fade-in duration-200">
            {/* Header */}
            <div className="flex flex-col gap-1.5 mb-8 text-center sm:text-left">
                <span className="font-label-sm uppercase tracking-wider text-primary font-bold text-xs">
                    Contribution Hub
                </span>
                <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
                    Upload Academic Resource
                </h1>
                <p className="font-body-md text-sm text-on-surface-variant max-w-xl">
                    Share your verified study materials, lecture summaries, and handwritten notes with the campus community.
                </p>
            </div>

            {/* Upload form */}
            <form className="flex flex-col gap-6" onSubmit={handleUpload}>
                {/* Drop zone */}
                <div 
                    className={`group relative rounded-3xl bg-surface-container-lowest p-8 sm:p-12 border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center text-center shadow-xs cursor-pointer ${
                        isDragOver 
                            ? 'border-primary bg-primary-fixed/20 scale-[1.01]' 
                            : errors.file
                            ? 'border-error bg-error-container/10'
                            : 'border-outline-variant hover:border-primary hover:bg-surface-container-lowest/80'
                    }`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            fileInputRef.current?.click();
                        }
                    }}
                    aria-label="Upload file area"
                >
                    <input 
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept=".pdf,.docx,.doc,.pptx,.ppt,.txt,.png,.jpg,.jpeg"
                    />

                    <div className="w-18 h-18 rounded-2xl bg-surface-container flex items-center justify-center text-primary mb-4 group-hover:scale-105 transition-transform duration-200">
                        <span className="material-symbols-outlined text-4xl">
                            {file ? 'description' : 'cloud_upload'}
                        </span>
                    </div>

                    <h2 className="font-title-md text-lg text-on-surface font-bold mb-1">
                        {file ? file.name : 'Drag & drop study materials here'}
                    </h2>

                    <p className="font-body-sm text-sm text-on-surface-variant mb-6">
                        {file 
                            ? `${formatBytes(file.size)} selected` 
                            : 'Supported formats: PDF, DOCX, PPTX, or Images (Max 25MB)'
                        }
                    </p>

                    {!file ? (
                        <Button 
                            type="button"
                            variant="primary"
                            icon="add"
                            onClick={(e) => { 
                                e.stopPropagation(); 
                                fileInputRef.current?.click(); 
                            }}
                        >
                            Choose From Computer
                        </Button>
                    ) : (
                        <Button 
                            type="button"
                            variant="danger"
                            size="sm"
                            icon="close"
                            onClick={(e) => { 
                                e.stopPropagation(); 
                                setFile(null); 
                            }}
                        >
                            Remove Selected File
                        </Button>
                    )}

                    {errors.file && (
                        <p className="text-xs text-error font-medium mt-3 flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">error</span>
                            {errors.file}
                        </p>
                    )}
                </div>

                {/* Document details card */}
                <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-xs border border-surface-container flex flex-col gap-5">
                    <div className="flex items-center justify-between pb-3 border-b border-surface-container">
                        <span className="font-title-md text-base font-bold text-on-surface">
                            Document Metadata
                        </span>
                        <span className="font-label-sm text-xs text-outline font-semibold">
                            Step 2 of 2
                        </span>
                    </div>

                    {/* Course Selection */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <label className="font-label-md text-sm font-semibold text-on-surface">
                                Target Course / Subject <span className="text-error">*</span>
                            </label>
                            {errors.location && (
                                <span className="text-xs text-error font-medium">{errors.location}</span>
                            )}
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {LOCATIONS.map(loc => {
                                const isSelected = selectedLocation === loc.id;
                                return (
                                    <button 
                                        key={loc.id}
                                        type="button"
                                        className={`py-3 px-3 text-center rounded-xl font-label-md text-xs sm:text-sm font-semibold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                                            isSelected 
                                                ? 'bg-primary-container text-on-primary ring-2 ring-primary shadow-sm' 
                                                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                                        }`}
                                        onClick={() => {
                                            setSelectedLocation(loc.id);
                                            setErrors(prev => ({ ...prev, location: '' }));
                                        }}
                                    >
                                        <span>{loc.name}</span>
                                        <span className="text-[10px] font-normal opacity-80 truncate max-w-full">
                                            {loc.description}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Subject / Chapter description */}
                    <Input
                        label="Topic or Chapter Name"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="e.g. Unit 3: React Router & Context API Lecture Slides"
                        helperText="Helps students find your notes faster in search"
                        icon="topic"
                    />
                </div>

                {/* Submit button */}
                <div className="flex flex-col items-center gap-3 pt-2">
                    <Button 
                        type="submit"
                        variant="primary"
                        size="lg"
                        disabled={!file || !selectedLocation || isUploading}
                        isLoading={isUploading}
                        icon="cloud_done"
                        className="w-full sm:w-auto min-w-[280px]"
                    >
                        Upload &amp; Share Resource
                    </Button>
                    <p className="font-body-sm text-xs text-outline flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm text-tertiary">lock</span>
                        <span>Saved to secure campus vault storage</span>
                    </p>
                </div>
            </form>
        </div>
    );
}

export default Home;
