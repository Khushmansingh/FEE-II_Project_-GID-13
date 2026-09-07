import { useState, useEffect } from 'react';
import { Folder, FileText, ChevronRight, Download, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient';
import './Home.css';

const SeeFiles = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);

  const locations = [
    { id: 'fee', name: 'FEE-II' },
    { id: 'opps', name: 'OPPS' },
    { id: 'dbms', name: 'DBMS' },
    { id: 'dis', name: 'Discr' }
  ];

  useEffect(() => {
    const fetchFiles = async () => {
      setIsLoadingFiles(true);
      setSelectedFile(null);
      try {
        const { data, error } = await supabase
          .from('files')
          .select('*')
          .eq('location_id', selectedLocation)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setFiles(data);
      } catch (error) {
        console.error('Error fetching files:', error.message);
      } finally {
        setIsLoadingFiles(false);
      }
    };

    if (selectedLocation) {
      fetchFiles();
    }
  }, [selectedLocation]);

  const handleDownload = async () => {
    if (!selectedFile) return;
    try {
      const { data, error } = await supabase.storage
        .from('vault_files')
        .createSignedUrl(selectedFile.storage_path, 60 * 60); // 1 hour valid

      if (error) throw error;

      const link = document.createElement('a');
      link.href = data.signedUrl;
      link.download = selectedFile.name;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert('Error downloading file: ' + error.message);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const renderLocations = () => (
    <section className="card">
      <div className="card-header">
        <Folder size={18} className="text-white" />
        <h2 className="card-title">Select Location</h2>
      </div>
      <div className="card-body">
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {locations.map(loc => (
            <li
              key={loc.id}
              onClick={() => {
                setSelectedLocation(loc.id);
                setSelectedFile(null);
              }}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '1rem',
                borderBottom: '1px solid var(--border-color, #2f334d)',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                backgroundColor: 'var(--card-bg, #1a1b26)',
                borderRadius: '6px',
                marginBottom: '0.5rem'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-color, #24283b)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--card-bg, #1a1b26)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Folder size={20} color="var(--primary-color, #7aa2f7)" />
                <span style={{ color: 'var(--text-color, #fff)', fontSize: '1rem', fontWeight: 500 }}>{loc.name}</span>
              </div>
              <ChevronRight size={18} color="var(--text-muted, #8e95b3)" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );

  const renderFiles = () => {
    const locationName = locations.find(l => l.id === selectedLocation)?.name;

    return (
      <section className="card">
        <div className="card-header" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button
            onClick={() => { setSelectedLocation(null); setSelectedFile(null); }}
            className="btn-ghost"
            style={{ padding: '0.25rem' }}
          >
            <ChevronRight size={18} style={{ transform: 'rotate(180deg)' }} />
          </button>
          <Folder size={18} className="text-white" />
          <h2 className="card-title">{locationName} Files</h2>
        </div>
        <div className="card-body">
          {isLoadingFiles ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
              <Loader2 size={24} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
            </div>
          ) : files.length === 0 ? (
            <p style={{ color: 'var(--text-muted, #8e95b3)', textAlign: 'center', padding: '2rem 0' }}>No files found in this location.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {files.map(f => (
                <li
                  key={f.id}
                  onClick={() => setSelectedFile(f)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    borderBottom: '1px solid var(--border-color, #2f334d)',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    backgroundColor: selectedFile?.id === f.id ? 'var(--bg-color, #24283b)' : 'var(--card-bg, #1a1b26)',
                    borderRadius: '6px',
                    marginBottom: '0.5rem'
                  }}
                  onMouseEnter={(e) => { if (selectedFile?.id !== f.id) e.currentTarget.style.backgroundColor = 'var(--bg-color, #24283b)'; }}
                  onMouseLeave={(e) => { if (selectedFile?.id !== f.id) e.currentTarget.style.backgroundColor = 'var(--card-bg, #1a1b26)'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <FileText size={20} color="var(--primary-color, #7aa2f7)" />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ color: 'var(--text-color, #fff)', fontSize: '1rem', fontWeight: 500 }}>{f.name}</span>
                      <span style={{ color: 'var(--text-muted, #8e95b3)', fontSize: '0.8rem' }}>{formatFileSize(f.size_bytes)} • {formatDate(f.created_at)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    );
  };

  const renderFilePreview = () => {
    if (!selectedFile) return null;

    return (
      <section className="card" style={{ marginTop: '2rem' }}>
        <div className="card-header">
          <FileText size={18} className="text-white" />
          <h2 className="card-title">File Details</h2>
        </div>
        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 1rem' }}>
          <FileText size={64} color="var(--primary-color, #7aa2f7)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ color: 'var(--text-color, #fff)', marginBottom: '0.5rem' }}>{selectedFile.name}</h3>
          <p style={{ color: 'var(--text-muted, #8e95b3)', marginBottom: '2rem' }}>Size: {formatFileSize(selectedFile.size_bytes)} | Uploaded: {formatDate(selectedFile.created_at)}</p>
          <button onClick={handleDownload} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', alignSelf: 'center' }}>
            <Download size={16} />
            Download File
          </button>
        </div>
      </section>
    );
  };

  return (
    <main className="layout-container">
      <header className="page-header">
        <h1 className="page-title">Browse Files</h1>
        <p className="page-description">Find and download academic resources.</p>
      </header>

      {!selectedLocation ? renderLocations() : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {renderFiles()}
          {renderFilePreview()}
        </div>
      )}
    </main>
  );
};

export default SeeFiles;
