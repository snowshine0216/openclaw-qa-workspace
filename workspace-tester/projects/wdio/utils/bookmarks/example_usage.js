import bulkCreateBookmarks, { createBookmarksForContent } from './bulk_create_bm.js';

// Example usage:

// 1. Create 100 bookmarks (default) distributed evenly across all contents
// This will create 10 bookmarks per content (10 contents in bookmarks.json)
await bulkCreateBookmarks();

// 2. Create 50 bookmarks distributed evenly across all contents
// This will create 5 bookmarks per content
await bulkCreateBookmarks(50);

// 3. Create 120 bookmarks distributed evenly across all contents
// This will create 12 bookmarks per content
await bulkCreateBookmarks(120);

// 4. Create bookmarks for a specific content only
await createBookmarksForContent('OOTBLibrary', 15);

// 5. Create report bookmarks instead of dossier bookmarks
await bulkCreateBookmarks(100, 'report');
