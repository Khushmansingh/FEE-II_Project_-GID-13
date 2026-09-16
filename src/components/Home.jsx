import React, { useState, useRef } from 'react';
import { supabase } from '../supabaseClient';

const locations = [
    { id: 'fee', name: 'FEE-II' },
    { id: 'opps', name: 'OPPS' },
    { id: 'dbms', name: 'DBMS' },
    { id: 'dis', name: 'Discr' },
];

function Home() {
    const [selectedLocation, setSelectedLocation] = useState('');
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef(null);

    function handleFileChange(event) {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
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
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            setFile(droppedFile);
        }
    }

    async function handleUpload(e) {
        e.preventDefault();
        if (!file || !selectedLocation) return;
        setIsUploading(true);
        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError) throw userError;
            const uploaderName = user?.user_metadata?.username || user?.email || 'Anonymous';

            const fileExt = file.name.split('.').pop();
            const fileName = Date.now() + "_" + Math.random().toString(36).substring(7) + "." + fileExt;
            const filePath = selectedLocation + "/" + fileName;

            const { error: uploadError } = await supabase.storage
                .from('vault_files')
                .upload(filePath, file);
            if (uploadError) throw uploadError;

            const { error: dbError } = await supabase
                .from('files')
                .insert([{
                    name: file.name,
                    size_bytes: file.size,
                    location_id: selectedLocation,
                    storage_path: filePath,
                    uploader: uploaderName
                }]);
            if (dbError) throw dbError;

            alert('File uploaded successfully!');
            setFile(null);
            setSelectedLocation('');
        } catch (error) {
            console.log("Error uploading:", error);
            alert('Error uploading file: ' + error.message);
        } finally {
            setIsUploading(false);
        }
    }

    return (
        <div className="flex flex-col w-full max-w-7xl mx-auto pb-space-xl">
            {/* Header */}
            <div className="flex flex-col gap-1.5 mb-space-lg">
                <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Upload Resource</h1>
                <p className="font-body-md text-body-md text-on-surface-variant">Share your study materials, review sheets, and notes with campus peers.</p>
            </div>

            {/* Upload form */}
            <form className="flex flex-col gap-space-xl max-w-3xl mx-auto w-full" onSubmit={handleUpload}>
                {/* Drop zone */}
                <div 
                    className={`group relative rounded-2xl bg-surface-container-lowest p-space-xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center text-center shadow-sm cursor-pointer ${isDragOver ? 'border-primary bg-primary-fixed/20' : 'border-outline-variant hover:border-primary'}`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <input 
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <div className="w-20 h-20 rounded-full bg-surface-container-low flex items-center justify-center text-primary mb-space-md group-hover:scale-105 transition-transform duration-300">
                        <span className="material-symbols-outlined text-4xl">cloud_upload</span>
                    </div>
                    <h2 className="font-headline-sm text-headline-sm text-on-surface mb-1 font-semibold">
                        {file ? file.name : 'Drop your study materials here'}
                    </h2>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-space-lg">
                        {file ? `${(file.size / 1024).toFixed(1)} KB selected` : 'PDF, DOCX, or any file type'}
                    </p>
                    {!file && (
                        <button 
                            type="button"
                            className="bg-primary hover:bg-primary/90 text-on-primary font-label-md text-label-md px-space-xl py-3 rounded-full shadow-sm transition-all flex items-center gap-2"
                            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                        >
                            <span className="material-symbols-outlined text-xl">add</span>
                            <span>Choose File</span>
                        </button>
                    )}
                    {file && (
                        <button 
                            type="button"
                            className="bg-error-container hover:bg-error text-on-error-container hover:text-on-error font-label-md text-label-md px-space-md py-2 rounded-full shadow-sm transition-all flex items-center gap-2"
                            onClick={(e) => { e.stopPropagation(); setFile(null); }}
                        >
                            <span className="material-symbols-outlined text-lg">close</span>
                            <span>Remove File</span>
                        </button>
                    )}
                </div>

                {/* Document details */}
                <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-lg">
                    <div className="flex items-center justify-between border-b border-surface-container pb-space-sm">
                        <span className="font-title-md text-title-md text-on-surface font-semibold">Document Details</span>
                        <span className="font-label-sm text-label-sm text-outline">Step 2 of 2</span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="font-label-md text-label-md font-semibold text-on-surface">Course / Category</label>
                        <div className="flex items-center bg-surface-container-low p-1 rounded-xl gap-1">
                            {locations.map(loc => (
                                <button 
                                    key={loc.id}
                                    type="button"
                                    className={`flex-1 py-2 text-center rounded-lg font-label-sm text-label-sm transition-all ${selectedLocation === loc.id ? 'font-semibold bg-surface-container-lowest text-primary shadow-sm' : 'font-medium text-on-surface-variant hover:text-on-surface'}`}
                                    onClick={() => setSelectedLocation(loc.id)}
                                >
                                    {loc.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <div className="flex flex-col items-center gap-space-md pt-space-sm">
                    <button 
                        type="submit"
                        disabled={!file || !selectedLocation || isUploading}
                        className="w-full sm:w-auto min-w-[320px] flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-on-primary px-space-xl py-3.5 rounded-full font-label-md text-label-md font-semibold shadow-sm hover:shadow transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="material-symbols-outlined text-lg group-hover:rotate-12 transition-transform">cloud_done</span>
                        <span>{isUploading ? 'Uploading...' : 'Upload & Share'}</span>
                    </button>
                    <p className="font-body-sm text-body-sm text-outline flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-base text-tertiary">lock</span>
                        Shared safely with verified campus community
                    </p>
                </div>
            </form>
        </div>
    );
}

export default Home;
