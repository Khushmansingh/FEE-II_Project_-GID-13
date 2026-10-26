/**
 * Validation utilities for Campus Vault forms
 */

export function validateEmail(email) {
    if (!email || !email.trim()) {
        return 'Email address is required.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
        return 'Please enter a valid email address.';
    }
    return '';
}

export function validatePassword(password, isSignUp = false) {
    if (!password) {
        return 'Password is required.';
    }
    if (password.length < 6) {
        return 'Password must be at least 6 characters long.';
    }
    if (isSignUp && password.length < 8) {
        return 'For stronger security, choose a password of 8+ characters.';
    }
    return '';
}

export function validateUsername(username) {
    if (!username || !username.trim()) {
        return 'Username is required.';
    }
    if (username.trim().length < 3) {
        return 'Username must be at least 3 characters.';
    }
    if (!/^[a-zA-Z0-9_.-]+$/.test(username.trim())) {
        return 'Username can only contain letters, numbers, dots, and underscores.';
    }
    return '';
}

export function validateFileUpload(file) {
    if (!file) {
        return 'Please select a document to upload.';
    }
    const maxSizeBytes = 25 * 1024 * 1024; // 25 MB
    if (file.size > maxSizeBytes) {
        return 'File size exceeds maximum allowed limit of 25MB.';
    }
    return '';
}

export function validateRequired(value, fieldName = 'This field') {
    if (!value || (typeof value === 'string' && !value.trim())) {
        return `${fieldName} is required.`;
    }
    return '';
}
