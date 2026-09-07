import React, { useState, useEffect } from 'react';
import {
    User,
    Palette,
    Sun,
    Moon,
    Edit3,
    Save,
    X,
    LogOut,
    Trash2,
    GraduationCap,
    Calendar,
} from 'lucide-react';
import { useTheme } from './context/ThemeContext';
import './Profile.css';

const PROFILE_KEY = 'campus-vault-profile';

const DEFAULT_PROFILE = {
    name: 'Student Name',
    email: 'student@university.edu',
    branch: 'Computer Science',
    year: '3rd Year',
    bio: 'Passionate about technology and sharing knowledge with fellow students.',
};

const getInitials = (name) => {
    return name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

const Profile = () => {
    const { theme, setTheme, font, setFont } = useTheme();

    const [profile, setProfile] = useState(() => {
        try {
            const stored = localStorage.getItem(PROFILE_KEY);
            return stored ? JSON.parse(stored) : DEFAULT_PROFILE;
        } catch {
            return DEFAULT_PROFILE;
        }
    });

    const [isEditing, setIsEditing] = useState(false);
    const [draft, setDraft] = useState(profile);

    useEffect(() => {
        try {
            localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
        } catch { /* noop */ }
    }, [profile]);

    const handleSave = () => {
        setProfile(draft);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setDraft(profile);
        setIsEditing(false);
    };

    const updateDraft = (field, value) => {
        setDraft((prev) => ({ ...prev, [field]: value }));
    };

    const FONTS = [
        { id: 'default', label: 'Default', className: '' },
        { id: 'mono', label: 'Mono', className: 'pill-btn-mono' },
        { id: 'serif', label: 'Serif', className: 'pill-btn-serif' },
    ];

    return (
        <main className="layout-container">
            <header className="page-header">
                <h1 className="page-title">Profile</h1>
                <p className="page-description">Manage your account and customise the look of Campus Vault.</p>
            </header>

            <div className="profile-page">
                {/* ── Profile Card ── */}
                <section className="profile-card" aria-labelledby="profile-heading">
                    {!isEditing ? (
                        <>
                            <div className="profile-card-top">
                                <div className="profile-avatar" aria-hidden="true">
                                    {getInitials(profile.name)}
                                </div>
                                <div className="profile-details">
                                    <h2 id="profile-heading" className="profile-name">{profile.name}</h2>
                                    <p className="profile-email">{profile.email}</p>
                                    <div className="profile-badges">
                                        <span className="profile-badge profile-badge-accent">
                                            <GraduationCap size={11} aria-hidden="true" /> {profile.branch}
                                        </span>
                                        <span className="profile-badge">
                                            <Calendar size={11} aria-hidden="true" /> {profile.year}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {profile.bio && <p className="profile-bio">{profile.bio}</p>}
                            <button
                                type="button"
                                className="btn-primary profile-edit-btn"
                                onClick={() => {
                                    setDraft(profile);
                                    setIsEditing(true);
                                }}
                            >
                                <Edit3 size={15} aria-hidden="true" />
                                Edit Profile
                            </button>
                        </>
                    ) : (
                        <div className="edit-form">
                            <h2 id="profile-heading" className="settings-card-title">Edit Profile</h2>
                            <div className="edit-field">
                                <label htmlFor="edit-name">Name</label>
                                <input
                                    id="edit-name"
                                    className="edit-input"
                                    type="text"
                                    value={draft.name}
                                    onChange={(e) => updateDraft('name', e.target.value)}
                                />
                            </div>
                            <div className="edit-field">
                                <label htmlFor="edit-email">Email</label>
                                <input
                                    id="edit-email"
                                    className="edit-input"
                                    type="email"
                                    value={draft.email}
                                    onChange={(e) => updateDraft('email', e.target.value)}
                                />
                            </div>
                            <div className="edit-field">
                                <label htmlFor="edit-branch">Branch</label>
                                <input
                                    id="edit-branch"
                                    className="edit-input"
                                    type="text"
                                    value={draft.branch}
                                    onChange={(e) => updateDraft('branch', e.target.value)}
                                />
                            </div>
                            <div className="edit-field">
                                <label htmlFor="edit-year">Year</label>
                                <input
                                    id="edit-year"
                                    className="edit-input"
                                    type="text"
                                    value={draft.year}
                                    onChange={(e) => updateDraft('year', e.target.value)}
                                />
                            </div>
                            <div className="edit-field">
                                <label htmlFor="edit-bio">Bio</label>
                                <textarea
                                    id="edit-bio"
                                    className="edit-textarea"
                                    value={draft.bio}
                                    onChange={(e) => updateDraft('bio', e.target.value)}
                                />
                            </div>
                            <div className="edit-actions">
                                <button type="button" className="btn-primary" onClick={handleSave}>
                                    <Save size={15} aria-hidden="true" /> Save
                                </button>
                                <button type="button" className="btn-secondary" onClick={handleCancel}>
                                    <X size={15} aria-hidden="true" /> Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </section>

                {/* ── Appearance Settings ── */}
                <section className="settings-card" aria-labelledby="appearance-heading">
                    <div className="settings-card-header">
                        <Palette size={18} className="settings-card-icon" aria-hidden="true" />
                        <h2 id="appearance-heading" className="settings-card-title">Appearance</h2>
                    </div>

                    <div className="setting-row">
                        <div className="setting-label">
                            <span className="setting-label-title">Theme</span>
                            <span className="setting-label-hint">Switch between dark and light mode</span>
                        </div>
                        <div className="toggle-group" role="group" aria-label="Theme toggle">
                            <button
                                type="button"
                                className={`toggle-btn ${theme === 'dark' ? 'toggle-btn-active' : ''}`}
                                onClick={() => setTheme('dark')}
                                aria-pressed={theme === 'dark'}
                            >
                                <Moon size={14} aria-hidden="true" /> Dark
                            </button>
                            <button
                                type="button"
                                className={`toggle-btn ${theme === 'light' ? 'toggle-btn-active' : ''}`}
                                onClick={() => setTheme('light')}
                                aria-pressed={theme === 'light'}
                            >
                                <Sun size={14} aria-hidden="true" /> Light
                            </button>
                        </div>
                    </div>

                    <div className="setting-row">
                        <div className="setting-label">
                            <span className="setting-label-title">Font</span>
                            <span className="setting-label-hint">Choose a typeface for the interface</span>
                        </div>
                        <div className="pill-group" role="group" aria-label="Font selection">
                            {FONTS.map((f) => (
                                <button
                                    key={f.id}
                                    type="button"
                                    className={`pill-btn ${f.className} ${font === f.id ? 'pill-btn-active' : ''}`}
                                    onClick={() => setFont(f.id)}
                                    aria-pressed={font === f.id}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Account ── */}
                <section className="settings-card" aria-labelledby="account-heading">
                    <div className="settings-card-header">
                        <User size={18} className="settings-card-icon" aria-hidden="true" />
                        <h2 id="account-heading" className="settings-card-title">Account</h2>
                    </div>
                    <div className="account-actions">
                        <button type="button" className="account-btn">
                            <LogOut size={15} aria-hidden="true" /> Sign out
                        </button>
                        <button type="button" className="account-btn account-btn-danger">
                            <Trash2 size={15} aria-hidden="true" /> Delete account
                        </button>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default Profile;
