import request from 'request';
import { errorLog, successLog } from '../config/consoleFormat.js';

export default async function getInsightsKpis({ baseUrl, session }) {
    const options = {
        url: baseUrl + 'api/insight/KPIs',
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
                    const insights = JSON.parse(body);
                    successLog(`Getting insights KPIs is successful. Insights: ${JSON.stringify(insights)}`);
                    resolve(insights);
                } else {
                    errorLog(`Getting insights KPIS failed. Status code: ${response.statusCode}. Message: ${body}`);
                    reject(body);
                }
            } else {
                errorLog(`Getting insights KPIs is failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
