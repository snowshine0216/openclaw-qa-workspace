import request from 'request';
import authentication from './authentication.js';
import urlParser from './urlParser.js';

export async function getSessions(userCredentials, includeConnectionInfo = false) {
    // Validate input parameters
    if (!userCredentials || !userCredentials.username) {
        throw new Error('Valid user credentials are required');
    }

    // Convert includeConnectionInfo to boolean (API treats non-boolean as false)
    const includeConnections = Boolean(includeConnectionInfo);

    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials: userCredentials });
    const sessionsInfo = await apiSessions({ baseUrl, session, includeConnectionInfo: includeConnections });
    return sessionsInfo;
}

export async function apiSessions({ baseUrl, session, includeConnectionInfo = false }) {
    // Build URL with query parameter based on boolean value
    let url = baseUrl + 'api/sessions';
    if (includeConnectionInfo) {
        url += '?includeConnectionInfo=true';
    }

    const options = {
        url: url,
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
                    try {
                        const data = JSON.parse(body);
                        resolve(data);
                    } catch (e) {
                        reject('Response body is not valid JSON: ' + body);
                    }
                } else {
                    reject('Status code: ' + response.statusCode + '. Message: ' + body);
                }
            } else {
                reject(error);
            }
        });
    });
}
