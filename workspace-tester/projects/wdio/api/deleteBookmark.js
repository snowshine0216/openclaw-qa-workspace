import request from 'request';
import { errorLog, successLog } from '../config/consoleFormat.js';

export default async function deleteBookmark({ baseUrl, session, bookmark, shortcut }) {
    const options = {
        url: baseUrl + `api/bookmarks/${bookmark.id}`,
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
            'X-MSTR-ProjectID': shortcut.project.id,
        },
        json: {
            shortcutId: shortcut.id,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 204) {
                    successLog(`Deleting bookmark '${bookmark.name}' with ID '${bookmark.id}' is successful.`);
                    //resolve(bookmark.id);
                    setTimeout(() => {
                        resolve(body);
                    }, 2000);
                } else {
                    const errorMessage = typeof body === 'object' ? JSON.stringify(body) : body;
                    errorLog(
                        `Deleting bookmark '${bookmark.name}' with ID '${bookmark.id}' failed. Status code: ${response.statusCode}. Message: ${errorMessage}`
                    );
                    reject(body);
                }
            } else {
                errorLog(`Deleting bookmark '${bookmark.name}' with ID '${bookmark.id}' failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
