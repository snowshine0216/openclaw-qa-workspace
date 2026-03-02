import request from 'request';
import { errorLog, successLog } from '../../config/consoleFormat.js';

export default async function deleteDataModelFavorites({ baseUrl, session, values }) {
    const options = {
        url: baseUrl + 'api/library/dataModels/favorites',
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
        },
        json: {
            operationList: [
                {
                    op: 'removeElements',
                    path: '/itemKeys',
                    value: values,
                },
            ],
        },
    };
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 204) {
                    successLog(`Deleting data model favorites '${values}' is successful.`);
                    resolve();
                } else {
                    errorLog(
                        `Deleting data model favorites '${values}' is failed. Status code: ${response.statusCode}. Message: ${body}`
                    );
                    reject(body);
                }
            } else {
                errorLog(`Deleting data model favorites '${values}' failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
