/**
 * String utilities
 * Provides functions for string manipulation and comparison
 */

/**
 * Normalize a string by removing spaces, hyphens, underscores and converting to lowercase
 * @param {string} str - The string to normalize
 * @returns {string|null} Normalized string or null if input is not a string
 */
export function normalizeString(str) {
    if (typeof str !== 'string') return null;
    return str.replace(/[\s-_]/g, '').toLowerCase();
}

/**
 * Compare two strings after normalization
 * @param {string} str1 - First string to compare
 * @param {string} str2 - Second string to compare
 * @returns {boolean} True if normalized strings are equal, false otherwise
 */
export function normalizedEqual(str1, str2) {
    const norm1 = normalizeString(str1);
    const norm2 = normalizeString(str2);
    if (norm1 === null || norm2 === null) return false;
    return norm1 === norm2;
}
