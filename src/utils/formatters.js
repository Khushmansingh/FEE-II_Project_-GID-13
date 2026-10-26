/**
 * Formats byte size into human-readable string (e.g., 2.4 MB)
 * @param {number|string} bytes 
 * @returns {string}
 */
export function formatBytes(bytes) {
    if (!+bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Formats ISO date string into readable local date
 * @param {string} isoString 
 * @returns {string}
 */
export function formatDate(isoString) {
    if (!isoString) return 'Unknown date';
    try {
        return new Date(isoString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch {
        return 'Invalid date';
    }
}

/**
 * Returns clean uppercase file extension or 'FILE'
 * @param {string} filename 
 * @returns {string}
 */
export function getFileExtension(filename) {
    if (!filename || typeof filename !== 'string') return 'FILE';
    const parts = filename.split('.');
    return parts.length > 1 ? parts.pop().toUpperCase() : 'FILE';
}
