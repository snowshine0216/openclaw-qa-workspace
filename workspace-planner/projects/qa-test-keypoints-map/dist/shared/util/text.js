export function normalizeSectionTitle(rawTitle) {
    return rawTitle.replace(/^\d+\.\s+/, '').trim();
}
export function slugify(input) {
    const slug = input
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    return slug || 'item';
}
export function escapeTableCell(value) {
    return value.replace(/\|/g, '\\|').replace(/\n/g, '<br>').trim();
}
export function normalizeCell(value) {
    return value.replace(/<br\s*\/?>/gi, '\n').trim();
}
//# sourceMappingURL=text.js.map