import request from 'request';
import { errorLog, successLog } from '../config/consoleFormat.js';

export default async function deleteInsightKpi({ baseUrl, session, id, projectId }) {
    const options = {
        url: baseUrl + `api/insight/KPIs/${id}`,
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
            'X-MSTR-ProjectID': projectId,
            id,
        },
    };
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 204) {
                    successLog(`Deleting insight KPI '${id}' is successful.`);
                    resolve();
                } else {
                    errorLog(
                        `Deleting insight KPI '${id}' failed. Status code: ${response.statusCode}. Message: ${body}`
                    );
                    reject(body);
                }
            } else {
                errorLog(`Deleting insight KPI '${id}' failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
