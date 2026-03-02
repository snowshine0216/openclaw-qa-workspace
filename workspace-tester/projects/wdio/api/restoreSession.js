import request from 'request';
import { errorLog, successLog } from '../config/consoleFormat.js';

export default async function restoreSession({ baseUrl, sessionId, server, port }) {
    let jsessionCookie = null;
    let authToken = null;

    const url = baseUrl + 'api/auth/restore';
    const cookieJar = request.jar();

    const options = {
        url: url,
        method: 'POST',
        jar: cookieJar,
        headers: {
            'Content-Type': 'application/json'
        },
        json: {
            sessionId: sessionId,
            server: server,
            port: port
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 204) {
                    successLog(
                        `Restoring session '${sessionId}' on server '${server}' and port '${port}' is successful.`
                    );
                    jsessionCookie = cookieJar.getCookieString(url);
                    authToken = response.headers['x-mstr-authtoken'];
                    resolve({ token: authToken, cookie: jsessionCookie });
                } else {
                    errorLog(
                        `Restoring session '${sessionId}' on server '${server}' and port '${port}' failed. Status code: ${
                            response.statusCode
                        }. Message: ${JSON.stringify(body)}`
                    );
                    reject(body);
                }
            } else {
                errorLog(
                    `Restoring session '${sessionId}' on server '${server}' and port '${port}' failed. Error: ${JSON.stringify(
                        error
                    )}`
                );
                reject(error);
            }
        });
    });
}
