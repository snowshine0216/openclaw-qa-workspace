import request from 'request';
import { errorLog, successLog } from '../../../config/consoleFormat.js';

const DBAPI_HOST = 'http://10.23.35.208:8074/bot';

export async function getOutputAPI({ app, input }) {
    const options = {
        url: `${DBAPI_HOST}/output`,
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            app: app,
            input: input,
        }),
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    successLog(`Received output successfully`);
                    try {
                        const data = JSON.parse(body);
                        resolve(data);
                    } catch (parseError) {
                        errorLog(`Error parsing JSON: ${parseError}`);
                        reject(parseError);
                    }
                } else {
                    errorLog(`Request failed. Status code: ${response.statusCode}. Message: ${body}`);
                    reject(body);
                }
            } else {
                errorLog(`Request failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
export async function getSqlAPI({ app, input }) {
    const options = {
        url: `${DBAPI_HOST}/sql`,
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            app: app,
            input: input,
        }),
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    successLog(`Received sql successfully`);
                    try {
                        const data = JSON.parse(body);
                        resolve(data);
                    } catch (parseError) {
                        errorLog(`Error parsing JSON: ${parseError}`);
                        reject(parseError);
                    }
                } else {
                    errorLog(`Request failed. Status code: ${response.statusCode}. Message: ${body}`);
                    reject(body);
                }
            } else {
                errorLog(`Request failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}