import React, { useState } from 'react';
import { Upload, FileText, ChevronDown, X, Send } from 'lucide-react';
import { supabase } from '../supabaseClient';
import './Home.css';

// This is the Home page component where users can upload files
function Home(props) {
  // State to store which location the user selected
  const [selectedLocation, setSelectedLocation] = useState('');
  
  // State to store the file the user wants to upload
  const [file, setFile] = useState(null);
  
  // State to show a loading message while uploading
  const [isUploading, setIsUploading] = useState(false);

  // List of locations available in our app
  const locations = [
    { id: 'fee', name: 'FEE-II' },
    { id: 'opps', name: 'OPPS' },
    { id: 'dbms', name: 'DBMS' },
    { id: 'dis', name: 'Discr' }
  ];

  // Function that runs when the user selects a file
  function handleFileChange(event) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  }

  // Function to upload the file to our database
  async function handleUpload() {
    // If no file or location is selected, do nothing
    if (!file || !selectedLocation) return;
    
    // Start the loading state
    setIsUploading(true);

    try {
      // Create a unique name for the file so it doesn't overwrite others
      const fileExt = file.name.split('.').pop();
      const fileName = Date.now() + "_" + Math.random().toString(36).substring(7) + "." + fileExt;
      const filePath = selectedLocation + "/" + fileName;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('vault_files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Save file info to Supabase Database
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

      // Show success message and clear form
      alert('File uploaded successfully!');
      setFile(null);
      setSelectedLocation('');
    } catch (error) {
      // Show error message if something goes wrong
      console.log("Error uploading:", error);
      alert('Error uploading file: ' + error.message);
    } finally {
      // Stop the loading state
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
                {/* Loop through our locations array and create an option for each */}
                {locations.map(function(loc) {
                  return <option key={loc.id} value={loc.id}>{loc.name}</option>;
                })}
              </select>
              <ChevronDown className="select-icon" size={16} />
            </div>
          </label>

          <div className="form-group">
            <span className="form-label">Select a file</span>

            {/* Basic file input */}
            <input
              type="file"
              onChange={handleFileChange}
              style={{ padding: '10px', border: '1px solid var(--border-color)', borderRadius: '4px', width: '100%', marginBottom: '10px', color: 'var(--text-color)' }}
            />

            {/* Show selected file info if a file is chosen */}
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

        {/* Upload button */}
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
