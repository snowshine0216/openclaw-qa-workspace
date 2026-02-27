import authentication from '../../api/authentication.js';
import logout from '../../api/logout.js';
import createBookmark from '../../api/createBookmark.js';
import urlParser from '../../api/urlParser.js';
import createDossierInstance from '../../api/createDossierInstance.js';
import createReportInstance from '../../api/reports/createReportInstance.js';
import bookmarksData from './bookmarks.json' assert { type: 'json' };
import { groupLog, groupLogEnd } from '../../config/consoleFormat.js';

/**
 * Create bookmarks with explicit baseUrl (browser-independent version)
 */
async function createBookmarksStandalone({ bookmarkList, credentials, dossier, type = 'dossier', baseUrl }) {
    groupLog('createBookmarks by api');
    const parsedBaseUrl = urlParser(baseUrl);

    // Map credentials to the format expected by authentication function
    const authCredentials = {
        username: credentials.name,
        password: credentials.pwd,
    };

    const session = await authentication({ baseUrl: parsedBaseUrl, authMode: 1, credentials: authCredentials });
    let dossierInstance = {};
    if (type !== 'report') {
        dossierInstance = await createDossierInstance({ baseUrl: parsedBaseUrl, session, dossier });
    } else {
        dossierInstance = await createReportInstance({ baseUrl: parsedBaseUrl, session, dossier });
    }
    for (const bookmark of bookmarkList) {
        await createBookmark({ baseUrl: parsedBaseUrl, session, dossier, dossierInstance, name: bookmark });
    }
    await logout({ baseUrl: parsedBaseUrl, session });
    groupLogEnd();
}

/**
 * Create bookmarks in batch
 * @param {number} totalBookmarks - Total number of bookmarks to create (default: 100)
 * @param {string} type - Type of content ('dossier' or 'report', default: 'dossier')
 */
export default async function bulkCreateBookmarks(totalBookmarks = 100, type = 'dossier') {
    groupLog(`Creating ${totalBookmarks} bookmarks in batch`);

    const { baseUrl, sender: credentials, bookmarks } = bookmarksData;

    // Calculate how many bookmarks to create per content
    const bookmarksPerContent = Math.floor(totalBookmarks / bookmarks.length);
    const remainder = totalBookmarks % bookmarks.length;

    console.log(`Creating ${bookmarksPerContent} bookmarks per content (${bookmarks.length} contents)`);
    if (remainder > 0) {
        console.log(`${remainder} additional bookmarks will be distributed among the first ${remainder} contents`);
    }

    // Process each content
    for (let i = 0; i < bookmarks.length; i++) {
        const { project, content } = bookmarks[i];

        // Calculate number of bookmarks for this content
        const numBookmarks = bookmarksPerContent + (i < remainder ? 1 : 0);

        if (numBookmarks === 0) continue;

        console.log(`Creating ${numBookmarks} bookmarks for "${content.name}" in project "${project.name}"`);

        // Generate bookmark names for this content
        const bookmarkList = [];
        for (let j = 1; j <= numBookmarks; j++) {
            bookmarkList.push(`Batch_BM_${content.name.replace(/[^a-zA-Z0-9]/g, '_')}_${j}`);
        }

        // Create dossier object
        const dossier = {
            project: {
                id: project.id,
                name: project.name,
            },
            id: content.id,
            name: content.name,
        };

        try {
            // Create bookmarks for this content
            await createBookmarksStandalone({
                bookmarkList,
                credentials,
                dossier,
                type,
                baseUrl,
            });

            console.log(`Successfully created ${numBookmarks} bookmarks for "${content.name}"`);
        } catch (error) {
            console.error(`Failed to create bookmarks for "${content.name}":`, error);
        }
    }

    groupLogEnd();
    console.log(`Batch bookmark creation completed. Total requested: ${totalBookmarks}`);
}

/**
 * Create bookmarks for a specific content only
 * @param {string} contentName - Name of the content to create bookmarks for
 * @param {number} numBookmarks - Number of bookmarks to create for this content
 * @param {string} type - Type of content ('dossier' or 'report', default: 'dossier')
 */
export async function createBookmarksForContent(contentName, numBookmarks = 10, type = 'dossier') {
    groupLog(`Creating ${numBookmarks} bookmarks for content: ${contentName}`);

    const { baseUrl, sender: credentials, bookmarks } = bookmarksData;

    // Find the content
    const contentData = bookmarks.find((item) => item.content.name === contentName);

    if (!contentData) {
        console.error(`Content "${contentName}" not found in bookmarks.json`);
        return;
    }

    const { project, content } = contentData;

    // Generate bookmark names
    const bookmarkList = [];
    for (let i = 1; i <= numBookmarks; i++) {
        bookmarkList.push(`BM_${content.name.replace(/[^a-zA-Z0-9]/g, '_')}_${i}`);
    }

    // Create dossier object
    const dossier = {
        project: {
            id: project.id,
            name: project.name,
        },
        id: content.id,
        name: content.name,
    };

    try {
        await createBookmarksStandalone({
            bookmarkList,
            credentials,
            dossier,
            type,
            baseUrl,
        });

        console.log(`Successfully created ${numBookmarks} bookmarks for "${content.name}"`);
    } catch (error) {
        console.error(`Failed to create bookmarks for "${content.name}":`, error);
    }

    groupLogEnd();
}
