import { useState, useRef } from 'react';
import { Upload, FileText, ChevronDown, X, Send, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient';
import './Home.css';

const Home = () => {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const locations = [
    { id: 'fee', name: 'FEE-II' },
    { id: 'opps', name: 'OPPS' },
    { id: 'dbms', name: 'DBMS' },
    { id: 'dis', name: 'Discr' }
  ];

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUpload = async () => {
    if (!file || !selectedLocation) return;
    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${selectedLocation}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('vault_files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from('files')
        .insert([
          {
            name: file.name,
            size_bytes: file.size,
            location_id: selectedLocation,
            storage_path: filePath
          }
        ]);

      if (dbError) throw dbError;

      alert('File uploaded successfully!');
      setFile(null);
      setSelectedLocation('');
    } catch (error) {
      alert('Error uploading file: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className="layout-container">
      <header className="page-header">
        <h1 className="page-title">Campus Vault</h1>
        <p className="page-description">Upload and share academic resources securely.</p>
      </header>

      <section className="card" aria-labelledby="upload-heading">
        <div className="card-header">
          <Upload size={18} className="text-white" aria-hidden="true" />
          <h2 id="upload-heading" className="card-title">Upload Document</h2>
        </div>

        <div className="card-body">
          <label className="form-group">
            <span className="form-label">Campus Location</span>
            <div className="select-wrapper">
              <select
                className="form-select"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                required
              >
                <option value="" disabled>Select a location...</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </select>
              <ChevronDown className="select-icon" size={16} aria-hidden="true" />
            </div>
          </label>

          <div className="form-group">
            <span className="form-label" id="file-upload-label">Selected file</span>

            {!file ? (
              <div
                className={`dropzone ${isDragging ? 'active' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                aria-labelledby="file-upload-label"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  aria-hidden="true"
                  tabIndex={-1}
                />
                <Upload className="dropzone-icon" size={24} aria-hidden="true" />
                <p className="dropzone-text">Click to upload or drag and drop</p>
                <p className="dropzone-hint">PDF, DOCX, or PPTX (max. 50MB)</p>
              </div>
            ) : (
              <div className="file-preview">
                <FileText size={18} className="text-muted" aria-hidden="true" />
                <div className="file-preview-info">
                  <span className="file-preview-name" title={file.name}>{file.name}</span>
                  <span className="file-preview-size">{formatFileSize(file.size)}</span>
                </div>
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                  aria-label="Remove file"
                >
                  <X size={16} aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          className="btn-primary"
          disabled={!file || !selectedLocation || isUploading}
          onClick={handleUpload}
        >
          {isUploading ? (
            <>
              <Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
              Uploading...
            </>
          ) : (
            <>
              <Send size={16} />
              Upload to Vault
            </>
          )}
        </button>
      </section>
    </main>
  );
};

export default Home;
