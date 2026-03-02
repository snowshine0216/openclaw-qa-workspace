import request from 'request';
import { errorLog, successLog } from '../../config/consoleFormat.js';

export default async function createContentGroupWithoutContent({ baseUrl, session, contentGroupInfo }) {
    const options = {
        url: baseUrl + `api/contentGroups`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
        },
        json: contentGroupInfo,
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 201) {
                    successLog(`Creating Content Group '${contentGroupInfo.name}' is successful. id = '${body.id}'`);
                    resolve(body.id);
                } else {
                    errorLog(
                        `Creating Content Group '${contentGroupInfo.name}' failed. Status code: ${response.statusCode}. Message: ${body.message}`
                    );
                    reject(body.message);
                }
            } else {
                errorLog(`Creating Content Group '${contentGroupInfo.name}' failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
