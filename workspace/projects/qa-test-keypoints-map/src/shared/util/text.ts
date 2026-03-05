export function normalizeSectionTitle(rawTitle: string): string {
  return rawTitle.replace(/^\d+\.\s+/, '').trim();
}

export function slugify(input: string): string {
  const slug = input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'item';
}

export function escapeTableCell(value: string): string {
  return value.replace(/\|/g, '\\|').replace(/\n/g, '<br>').trim();
}

export function normalizeCell(value: string): string {
  return value.replace(/<br\s*\/?>/gi, '\n').trim();
}
