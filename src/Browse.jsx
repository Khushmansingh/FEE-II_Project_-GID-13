import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const LOCATIONS = [
    { id: 'fee', name: 'FEE-II' },
    { id: 'opps', name: 'OPPS' },
    { id: 'dbms', name: 'DBMS' },
    { id: 'dis', name: 'Discr' },
];

const SORT_OPTIONS = [
    { id: 'recent', label: 'Recently Added' },
    { id: 'popular', label: 'Most Popular' },
    { id: 'az', label: 'Title A–Z' },
];

function formatBytes(bytes) {
    if (!+bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function Browse() {
    const [notes, setNotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [query, setQuery] = useState('');
    const [locationFilter, setLocationFilter] = useState('all');
    const [sortBy, setSortBy] = useState('recent');

    useEffect(() => {
        fetchNotes();
    }, []);

    async function fetchNotes() {
        setIsLoading(true);
        try {
            const { data, error } = await supabase.from('files').select('*');
            if (error) throw error;
            setNotes(data.map(file => ({
                id: file.id,
                title: file.name,
                location: file.location_id,
                date: file.created_at,
                downloads: file.downloads || 0,
                uploader: file.uploader || 'Anonymous',
                type: file.name.split('.').pop().toUpperCase(),
                size_bytes: file.size_bytes,
                storage_path: file.storage_path
            })));
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
            setNotes(notes.map(n => n.id === note.id ? { ...n, downloads: n.downloads + 1 } : n));
        } catch (err) {
            alert('Error downloading: ' + err.message);
        }
    }

    let filteredNotes = notes.filter(note => {
        const matchesQuery = note.title.toLowerCase().includes(query.toLowerCase());
        const matchesLocation = locationFilter === 'all' || note.location === locationFilter;
        return matchesQuery && matchesLocation;
    });

    if (sortBy === 'recent') {
        filteredNotes.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'popular') {
        filteredNotes.sort((a, b) => b.downloads - a.downloads);
    } else if (sortBy === 'az') {
        filteredNotes.sort((a, b) => a.title.localeCompare(b.title));
    }

    return (
        <div className="flex flex-col w-full">
            {/* Hero search section */}
            <section className="w-full py-space-xl mb-space-lg flex flex-col items-center text-center max-w-3xl mx-auto">
                <span className="px-3 py-1 rounded-full bg-primary-fixed/60 text-primary font-label-sm text-label-sm font-semibold tracking-wide mb-3">CAMPUS VAULT REPOSITORY</span>
                <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight mb-2">Find verified notes &amp; course resources</h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant mb-space-lg max-w-xl">Curated lecture notes, midterms, and study guides shared by your peers.</p>
                
                <div className="w-full relative flex items-center shadow-sm rounded-2xl bg-surface-container-lowest p-2 border border-surface-container">
                    <span className="material-symbols-outlined text-outline text-2xl ml-3 mr-2 pointer-events-none">search</span>
                    <input 
                        className="w-full py-3 bg-transparent text-on-surface font-body-lg placeholder:text-outline focus:outline-none"
                        placeholder="Search notes by title..."
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    {query && (
                        <button 
                            type="button"
                            className="mr-2 p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
                            onClick={() => setQuery('')}
                        >
                            <span className="material-symbols-outlined text-lg">close</span>
                        </button>
                    )}
                </div>

                {/* Filter chips */}
                <div className="flex flex-wrap items-center justify-center gap-2 mt-space-md">
                    <button 
                        type="button"
                        className={`px-4 py-2 rounded-full font-label-sm font-semibold transition-all shadow-sm ${locationFilter === 'all' ? 'bg-on-surface text-surface' : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface hover:bg-surface-container'}`}
                        onClick={() => setLocationFilter('all')}
                    >
                        All
                    </button>
                    {LOCATIONS.map(loc => (
                        <button 
                            key={loc.id}
                            type="button"
                            className={`px-4 py-2 rounded-full font-label-sm font-medium transition-all shadow-sm ${locationFilter === loc.id ? 'bg-on-surface text-surface font-semibold' : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface hover:bg-surface-container'}`}
                            onClick={() => setLocationFilter(loc.id)}
                        >
                            {loc.name}
                        </button>
                    ))}
                </div>
            </section>

            {/* Controls bar */}
            <section className="flex items-center justify-between mb-space-md pb-2 border-b border-surface-container">
                <div className="flex items-center gap-2">
                    <h2 className="font-title-md text-title-md font-semibold text-on-surface">Results</h2>
                    <span className="text-outline text-body-sm">· {filteredNotes.length} items</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center bg-surface-container-lowest rounded-xl px-3 py-1.5 shadow-sm text-on-surface-variant">
                        <span className="font-label-sm text-outline mr-1.5">Sort:</span>
                        <select 
                            className="bg-transparent font-label-sm font-semibold text-on-surface focus:outline-none cursor-pointer"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            {SORT_OPTIONS.map(opt => (
                                <option key={opt.id} value={opt.id}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </section>

            {/* Cards grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg w-full mb-space-xl">
                {isLoading ? (
                    <div className="col-span-full flex justify-center items-center py-16">
                        <span className="material-symbols-outlined text-primary text-3xl animate-spin">progress_activity</span>
                    </div>
                ) : filteredNotes.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-16 text-on-surface-variant">
                        <span className="material-symbols-outlined text-4xl mb-2 text-outline">search_off</span>
                        <p className="font-title-md text-title-md font-semibold">No notes found</p>
                        <p className="font-body-sm text-body-sm text-outline">Try a different search or category.</p>
                    </div>
                ) : (
                    filteredNotes.map(note => (
                        <article key={note.id} className="group bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <span className="px-2.5 py-1 rounded-full bg-surface-container-low text-on-surface-variant font-label-sm font-semibold text-[11px]">
                                        {LOCATIONS.find(l => l.id === note.location)?.name || 'Unknown'}
                                    </span>
                                    <span className="material-symbols-outlined text-outline text-lg hover:text-primary transition-colors cursor-pointer">bookmark</span>
                                </div>
                                <div>
                                    <h3 className="font-title-md text-title-md font-bold text-on-surface group-hover:text-primary transition-colors leading-snug mb-1 truncate">{note.title}</h3>
                                    <p className="font-body-sm text-on-surface-variant line-clamp-2">Uploaded by {note.uploader}</p>
                                </div>
                            </div>
                            <div className="pt-space-md mt-space-md border-t border-surface-container flex items-center justify-between">
                                <span className="font-label-sm text-[11px] text-outline">{note.type} · {formatBytes(note.size_bytes)} · {note.downloads} downloads</span>
                                <div className="flex items-center gap-1.5">
                                    <button 
                                        type="button"
                                        className="bg-primary hover:bg-primary-container text-on-primary px-3 py-1.5 rounded-xl font-label-sm font-semibold flex items-center gap-1 transition-all"
                                        onClick={() => handleDownload(note)}
                                    >
                                        <span className="material-symbols-outlined text-sm">download</span>Download
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))
                )}
            </section>
        </div>
    );
}

export default Browse;