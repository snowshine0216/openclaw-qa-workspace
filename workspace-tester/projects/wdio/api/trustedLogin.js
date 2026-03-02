import request from 'request';
import { errorLog, successLog } from '../config/consoleFormat.js';

/**
 * Performs a trusted login using the specified baseUrl and headers.
 * Returns an object containing the authentication token and session cookie.
 * 
 * @param {Object} param0 - The login parameters.
 * @param {Object} param0.baseUrl - The base URL for the API.
 * @param {Object} param0.headers - Additional headers for the request.
 * @returns {Promise<{token: string, cookie: string}>} - Resolves with auth token and cookie.
 */
export default async function trustedLogin({ baseUrl, headers }) {
    // initialize the jsession value from set cookie header once and use it across every other requests;
    let jsessionCookie = null;
    let authToken = null;

    const cookieJar = request.jar();
    const url = baseUrl + 'api/auth/login';

    const options = {
        url,
        method: 'POST',
        jar: cookieJar,
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            ...headers,
        },
        form: {
            loginMode: 64,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                try {
                    jsessionCookie = cookieJar.getCookieString(url);
                    if (response.statusCode === 204) {
                        authToken = response.headers['x-mstr-authtoken'];
                        successLog(`Login in with trusted mode is successful`);
                        resolve({ token: authToken, cookie: jsessionCookie });
                    } else {
                        errorLog(
                            `Login in with trusted mode failed. Status code: ${
                                response.statusCode
                            }. Message: ${body}`
                        );
                        reject(body);
                    }
                } catch (err) {
                    errorLog(`Login in with trusted mode failed. Try & Catch Error: ${err}`);
                    reject(error);
                }
            } else {
                errorLog(`Authentication failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
