import request from 'request';
import { errorLog, successLog } from '../config/consoleFormat.js';

export default async function getBookmarks({ baseUrl, session, shortcut }) {
    const options = {
        url: baseUrl + `api/shortcuts/${shortcut.id}/bookmarks`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': session.token,
            'X-MSTR-ProjectID': shortcut.project.id,
            Cookie: session.cookie,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    const bookmarkArrays = JSON.parse(body);
                    successLog(
                        `Getting bookmarks for shortcut '${shortcut.id}' is successful. Bookmarks: ${JSON.stringify(
                            bookmarkArrays
                        )}`
                    );
                    resolve(bookmarkArrays);
                } else {
                    errorLog(
                        `Getting bookmarks for shortcut '${shortcut.id}' failed. Status code: ${response.statusCode}. Message: ${body}`
                    );
                    reject(body);
                }
            } else {
                errorLog(`Getting bookmarks for shortcut '${shortcut.id}' failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
