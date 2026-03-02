import request from 'request';
import { errorLog, successLog } from '../../config/consoleFormat.js';

export default async function getDataModelFavorites({ baseUrl, session }) {
    const options = {
        url: baseUrl + 'api/library/dataModels/favorites',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': session.token,
            Cookie: session.cookie,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    const groupArrays = JSON.parse(body);
                    successLog(`Getting data model favorites is successful. Groups: ${JSON.stringify(groupArrays)}`);
                    resolve(groupArrays);
                } else {
                    errorLog(
                        `Getting data model favorites is failed. Status code: ${response.statusCode}. Message: ${body}`
                    );
                    reject(body);
                }
            } else {
                errorLog(`Getting data model favorites is failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
