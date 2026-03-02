import request from 'request';
import { errorLog, successLog } from '../../config/consoleFormat.js';

export default async function updateContent({ baseUrl, session, contentGroupId, contentInfo }) {
    const options = {
        url: baseUrl + `api/contentGroups/${contentGroupId}/contents`,
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
        },
        json: contentInfo,
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 204) {
                    successLog(`Update Content '${contentGroupId}' is successful.`);
                    resolve(body);
                } else {
                    errorLog(
                        `Update Content '${contentGroupId}' failed. Status code: ${response.statusCode}. Message: ${body.message}`
                    );
                    reject(body.message);
                }
            } else {
                errorLog(`Update Content '${contentGroupId}' failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
