// Ignore SSL certificate errors for development/testing environments
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

import bulkCreateBookmarks from './bulk_create_bm.js';

await bulkCreateBookmarks();
