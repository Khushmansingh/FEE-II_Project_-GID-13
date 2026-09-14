import React, { useState, useEffect } from 'react';
import { Search, LayoutGrid, List, FileText, Download, SlidersHorizontal, X } from 'lucide-react';
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
function Browse(props) {
    const [notes, setNotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [query, setQuery] = useState('');
    const [locationFilter, setLocationFilter] = useState('all');
    const [sortBy, setSortBy] = useState('recent');
    const [view, setView] = useState('grid');
    useEffect(() => {
        fetchNotes();
    }, []);
    async function fetchNotes() {
        setIsLoading(true);
        try {
            const { data, error } = await supabase.from('files').select('*');
            if (error) throw error;
            const mappedData = data.map(function (file) {
                return {
                    id: file.id,
                    title: file.name,
                    location: file.location_id,
                    date: file.created_at,
                    downloads: file.downloads || 0,
                    subject: file.subject || 'General',
                    uploader: file.uploader || 'Anonymous',
                    type: file.file_type || file.name.split('.').pop().toUpperCase(),
                    size: file.size_bytes + " Bytes",
                    storage_path: file.storage_path
                };
            });
            setNotes(mappedData);
        } catch (error) {
            console.log('Error fetching notes:', error.message);
        } finally {
            setIsLoading(false);
        }
    }
    async function handleDownload(note) {
        try {
            const { data, error } = await supabase.storage
                .from('vault_files')
                .download(note.storage_path);
            if (error) throw error;
            const url = URL.createObjectURL(data);
            const link = document.createElement('a');
            link.href = url;
            link.download = note.title;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            await supabase.from('files').update({ downloads: note.downloads + 1 }).eq('id', note.id);
            setNotes(notes.map(function (n) {
                if (n.id === note.id) {
                    return { ...n, downloads: n.downloads + 1 };
                }
                return n;
            }));
        } catch (err) {
            alert('Error downloading: ' + err.message);
        }
    }
    let filteredNotes = notes.filter(function (note) {
        let matchesQuery = note.title.toLowerCase().includes(query.toLowerCase());
        let matchesLocation = false;
        if (locationFilter === 'all') {
            matchesLocation = true;
        } else if (note.location === locationFilter) {
            matchesLocation = true;
        }
        return matchesQuery && matchesLocation;
    });
    if (sortBy === 'recent') {
        filteredNotes.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'popular') {
        filteredNotes.sort((a, b) => b.downloads - a.downloads);
    } else if (sortBy === 'az') {
        filteredNotes.sort((a, b) => a.title.localeCompare(b.title));
    }
    let activeLocationName = "";
    for (let i = 0; i < LOCATIONS.length; i++) {
        if (LOCATIONS[i].id === locationFilter) {
            activeLocationName = LOCATIONS[i].name;
        }
    }
    return (
        <main className="layout-container">
            <header className="page-header">
                <h1 className="page-title">Browse Notes</h1>
                <p className="page-description">Search and filter notes shared across campus.</p>
            </header>
            <section className="browse-controls">
                <div className="search-bar">
                    <Search size={16} className="search-icon" />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search by title..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    {query ? (
                        <button
                            type="button"
                            className="btn-ghost search-clear"
                            onClick={() => setQuery('')}
                        >
                            <X size={14} />
                        </button>
                    ) : null}
                </div>
                <div className="filter-row">
                    <div className="chip-group">
                        <button
                            type="button"
                            className={`chip ${locationFilter === 'all' ? 'chip-active' : ''}`}
                            onClick={() => setLocationFilter('all')}
                        >
                            All
                        </button>
                        {LOCATIONS.map(function (loc) {
                            return (
                                <button
                                    key={loc.id}
                                    type="button"
                                    className={`chip ${locationFilter === loc.id ? 'chip-active' : ''}`}
                                    onClick={() => setLocationFilter(loc.id)}
                                >
                                    {loc.name}
                                </button>
                            );
                        })}
                    </div>
                    <div className="filter-actions">
                        <div className="select-wrapper sort-select-wrapper">
                            <SlidersHorizontal size={14} className="sort-icon" />
                            <select
                                className="form-select sort-select"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                {SORT_OPTIONS.map(function (opt) {
                                    return <option key={opt.id} value={opt.id}>{opt.label}</option>;
                                })}
                            </select>
                        </div>
                        <div className="view-toggle">
                            <button
                                type="button"
                                className={`view-toggle-btn ${view === 'grid' ? 'view-toggle-active' : ''}`}
                                onClick={() => setView('grid')}
                            >
                                <LayoutGrid size={16} />
                            </button>
                            <button
                                type="button"
                                className={`view-toggle-btn ${view === 'list' ? 'view-toggle-active' : ''}`}
                                onClick={() => setView('list')}
                            >
                                <List size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            <section>
                <p className="results-count">
                    {filteredNotes.length} notes
                    {locationFilter !== 'all' ? ` in ${activeLocationName}` : ''}
                </p>
                {isLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
                        Loading...
                    </div>
                ) : filteredNotes.length === 0 ? (
                    <div className="empty-state">
                        <FileText size={28} className="text-muted" />
                        <p className="empty-state-title">No notes found</p>
                        <p className="empty-state-hint">Try a different search or location.</p>
                    </div>
                ) : (
                    <div className={view === 'grid' ? 'notes-grid' : 'notes-list'}>
                        {filteredNotes.map(function (note) {
                            return (
                                <article key={note.id} className={view === 'grid' ? 'note-card' : 'note-row'}>
                                    <div className="note-icon">
                                        <FileText size={18} />
                                    </div>
                                    <div className="note-info">
                                        <h3 className="note-title">{note.title}</h3>
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
                                            <Download size={13} /> {note.downloads}
                                        </span>
                                        <button
                                            type="button"
                                            className="btn-ghost note-download-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDownload(note);
                                            }}
                                        >
                                            <Download size={16} />
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>
        </main>
    );
}
export default Browse;