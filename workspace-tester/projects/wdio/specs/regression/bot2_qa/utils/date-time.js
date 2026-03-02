/**
 * Date and time utilities
 * Provides functions for date/time formatting and manipulation
 */

/**
 * Format a date/time string to UTC format: YYYY-MM-DD HH:mm:ss
 * @param {string|null} dateTimeStr - The date/time string to format (optional, uses current time if null)
 * @returns {string} Formatted date/time string in UTC
 */
export function formatDateTime(dateTimeStr) {
    const utcDate = dateTimeStr ? new Date(dateTimeStr) : new Date();
    const yyyy = utcDate.getUTCFullYear();
    const mm = String(utcDate.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(utcDate.getUTCDate()).padStart(2, '0');
    const hh = String(utcDate.getUTCHours()).padStart(2, '0');
    const min = String(utcDate.getUTCMinutes()).padStart(2, '0');
    const ss = String(utcDate.getUTCSeconds()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
}
