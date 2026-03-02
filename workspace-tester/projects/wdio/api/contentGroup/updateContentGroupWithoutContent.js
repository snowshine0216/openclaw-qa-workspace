import request from 'request';
import { errorLog, successLog } from '../../config/consoleFormat.js';

export default async function updateContentGroupWithoutContent({
    baseUrl,
    session,
    contentGroupId,
    updateContentGroupInfo,
}) {
    const options = {
        url: baseUrl + `api/contentGroups/${contentGroupId}`,
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
        },
        json: updateContentGroupInfo,
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    successLog(`Update Content Group '${contentGroupId}' is successful.`);
                    resolve(body);
                } else {
                    errorLog(
                        `Update Content Group '${contentGroupId}' failed. Status code: ${response.statusCode}. Message: ${body.message}`
                    );
                    reject(body.message);
                }
            } else {
                errorLog(`Update Content Group '${contentGroupId}' failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
