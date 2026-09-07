import React, { useState, useMemo, useEffect } from 'react';
import { Search, LayoutGrid, List, FileText, Download, SlidersHorizontal, X, Loader2 } from 'lucide-react';
import { supabase } from './supabaseClient';
import './Browse.css';

const LOCATIONS = [
    { id: 'fee', name: 'FEE-II' },
    { id: 'opps', name: 'OPPS' },
    { id: 'dbms', name: 'DBMS' },
    { id: 'dis', name: 'Discr' },
];

const SORT_OPTIONS = [
    { id: 'recent', label: 'Most recent' },
    { id: 'popular', label: 'Most downloaded' },
    { id: 'az', label: 'Title A–Z' },
];

const Browse = () => {
    const [notes, setNotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [query, setQuery] = useState('');
    const [locationFilter, setLocationFilter] = useState('all');
    const [sortBy, setSortBy] = useState('recent');
    const [view, setView] = useState('grid');

    useEffect(() => {
        fetchNotes();
    }, []);

    const formatFileSize = (bytes) => {
        if (!bytes) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const fetchNotes = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase.from('files').select('*');
            if (error) throw error;
            
            const mappedData = data.map(file => ({
                id: file.id,
                title: file.name,
                location: file.location_id,
                date: file.created_at,
                downloads: file.downloads || 0,
                subject: file.subject || 'General',
                uploader: file.uploader || 'Anonymous',
                type: file.file_type || file.name.split('.').pop().toUpperCase(),
                size: formatFileSize(file.size_bytes),
                storage_path: file.storage_path
            }));

            setNotes(mappedData);
        } catch (error) {
            console.error('Error fetching notes:', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = async (note) => {
        try {
            const { data, error } = await supabase.storage
                .from('vault_files')
                .createSignedUrl(note.storage_path, 60 * 60);

            if (error) throw error;
            
            // Trigger download
            const link = document.createElement('a');
            link.href = data.signedUrl;
            link.download = note.title;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Increment downloads
            await supabase.from('files').update({ downloads: note.downloads + 1 }).eq('id', note.id);
            setNotes(prev => prev.map(n => n.id === note.id ? {...n, downloads: n.downloads + 1} : n));
        } catch (err) {
            alert('Error downloading: ' + err.message);
        }
    };

    const filteredNotes = useMemo(() => {
        let results = notes.filter((note) => {
            const matchesQuery = note.title.toLowerCase().includes(query.trim().toLowerCase());
            const matchesLocation = locationFilter === 'all' || note.location === locationFilter;
            return matchesQuery && matchesLocation;
        });

        if (sortBy === 'recent') {
            results = [...results].sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (sortBy === 'popular') {
            results = [...results].sort((a, b) => b.downloads - a.downloads);
        } else if (sortBy === 'az') {
            results = [...results].sort((a, b) => a.title.localeCompare(b.title));
        }

        return results;
    }, [notes, query, locationFilter, sortBy]);

    const activeLocationName = LOCATIONS.find((loc) => loc.id === locationFilter)?.name;

    return (
        <main className="layout-container">
            <header className="page-header">
                <h1 className="page-title">Browse Notes</h1>
                <p className="page-description">Search and filter notes shared across campus.</p>
            </header>

            <section className="browse-controls" aria-label="Search and filter notes">
                <div className="search-bar">
                    <Search size={16} className="search-icon" aria-hidden="true" />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search by title..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        aria-label="Search notes by title"
                    />
                    {query && (
                        <button
                            type="button"
                            className="btn-ghost search-clear"
                            onClick={() => setQuery('')}
                            aria-label="Clear search"
                        >
                            <X size={14} aria-hidden="true" />
                        </button>
                    )}
                </div>

                <div className="filter-row">
                    <div className="chip-group" role="group" aria-label="Filter by campus location">
                        <button
                            type="button"
                            className={`chip ${locationFilter === 'all' ? 'chip-active' : ''}`}
                            onClick={() => setLocationFilter('all')}
                        >
                            All
                        </button>
                        {LOCATIONS.map((loc) => (
                            <button
                                key={loc.id}
                                type="button"
                                className={`chip ${locationFilter === loc.id ? 'chip-active' : ''}`}
                                onClick={() => setLocationFilter(loc.id)}
                            >
                                {loc.name}
                            </button>
                        ))}
                    </div>

                    <div className="filter-actions">
                        <div className="select-wrapper sort-select-wrapper">
                            <SlidersHorizontal size={14} className="sort-icon" aria-hidden="true" />
                            <select
                                className="form-select sort-select"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                aria-label="Sort notes"
                            >
                                {SORT_OPTIONS.map((opt) => (
                                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="view-toggle" role="group" aria-label="Toggle view">
                            <button
                                type="button"
                                className={`view-toggle-btn ${view === 'grid' ? 'view-toggle-active' : ''}`}
                                onClick={() => setView('grid')}
                                aria-label="Grid view"
                                aria-pressed={view === 'grid'}
                            >
                                <LayoutGrid size={16} aria-hidden="true" />
                            </button>
                            <button
                                type="button"
                                className={`view-toggle-btn ${view === 'list' ? 'view-toggle-active' : ''}`}
                                onClick={() => setView('list')}
                                aria-label="List view"
                                aria-pressed={view === 'list'}
                            >
                                <List size={16} aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section aria-label="Note results">
                <p className="results-count">
                    {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'}
                    {locationFilter !== 'all' ? ` in ${activeLocationName}` : ''}
                </p>

                {isLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
                        <Loader2 size={32} className="text-muted" style={{ animation: 'spin 1s linear infinite' }} />
                    </div>
                ) : filteredNotes.length === 0 ? (
                    <div className="empty-state">
                        <FileText size={28} className="text-muted" aria-hidden="true" />
                        {notes.length === 0 ? (
                            <>
                                <p className="empty-state-title">No notes uploaded yet</p>
                                <p className="empty-state-hint">Notes uploaded to the database will appear here automatically.</p>
                            </>
                        ) : (
                            <>
                                <p className="empty-state-title">No notes match your search</p>
                                <p className="empty-state-hint">Try a different keyword or clear the location filter.</p>
                            </>
                        )}
                    </div>
                ) : (
                    <div className={view === 'grid' ? 'notes-grid' : 'notes-list'}>
                        {filteredNotes.map((note) => (
                            <article key={note.id} className={view === 'grid' ? 'note-card' : 'note-row'}>
                                <div className="note-icon">
                                    <FileText size={18} aria-hidden="true" />
                                </div>
                                <div className="note-info">
                                    <h3 className="note-title" title={note.title}>{note.title}</h3>
                                    <div className="note-meta">
                                        <span className="note-tag">{note.subject}</span>
                                        <span className="note-meta-dot">•</span>
                                        <span>{note.uploader}</span>
                                        <span className="note-meta-dot">•</span>
                                        <span>{note.type} · {note.size}</span>
                                    </div>
                                </div>
                                <div className="note-stats">
                                    <span className="note-downloads">
                                        <Download size={13} aria-hidden="true" /> {note.downloads}
                                    </span>
                                    <button 
                                        type="button" 
                                        className="btn-ghost note-download-btn" 
                                        aria-label={`Download ${note.title}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDownload(note);
                                        }}
                                    >
                                        <Download size={16} aria-hidden="true" />
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
};

export default Browse;