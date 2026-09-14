import React, { useState } from 'react';
import { Upload, FileText, ChevronDown, X, Send } from 'lucide-react';
import { supabase } from '../supabaseClient';
import './Home.css';
function Home(props) {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const locations = [
    { id: 'fee', name: 'FEE-II' },
    { id: 'opps', name: 'OPPS' },
    { id: 'dbms', name: 'DBMS' },
    { id: 'dis', name: 'Discr' }
  ];
  function handleFileChange(event) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  }
  async function handleUpload() {
    if (!file || !selectedLocation) return;
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = Date.now() + "_" + Math.random().toString(36).substring(7) + "." + fileExt;
      const filePath = selectedLocation + "/" + fileName;
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
      console.log("Error uploading:", error);
      alert('Error uploading file: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  }
  return (
    <main className="layout-container">
      <header className="page-header">
        <h1 className="page-title">Campus Vault</h1>
        <p className="page-description">Upload and share academic resources securely.</p>
      </header>
      <section className="card">
        <div className="card-header">
          <Upload size={18} className="text-white" />
          <h2 className="card-title">Upload Document</h2>
        </div>
        <div className="card-body">
          <label className="form-group">
            <span className="form-label">Campus Location</span>
            <div className="select-wrapper">
              <select
                className="form-select"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="" disabled>Select a location...</option>
                {locations.map(function (loc) {
                  return <option key={loc.id} value={loc.id}>{loc.name}</option>;
                })}
              </select>
              <ChevronDown className="select-icon" size={16} />
            </div>
          </label>
          <div className="form-group">
            <span className="form-label">Select a file</span>
            <input
              type="file"
              onChange={handleFileChange}
              style={{ padding: '10px', border: '1px solid var(--border-color)', borderRadius: '4px', width: '100%', marginBottom: '10px', color: 'var(--text-color)' }}
            />
            {file ? (
              <div className="file-preview">
                <FileText size={18} className="text-muted" />
                <div className="file-preview-info">
                  <span className="file-preview-name">{file.name}</span>
                  <span className="file-preview-size">{file.size} Bytes</span>
                </div>
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => setFile(null)}
                >
                  <X size={16} />
                </button>
              </div>
            ) : null}
          </div>
        </div>
        <button
          type="button"
          className="btn-primary"
          disabled={!file || !selectedLocation || isUploading}
          onClick={handleUpload}
        >
          {isUploading ? (
            "Uploading..."
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
}
export default Home;
