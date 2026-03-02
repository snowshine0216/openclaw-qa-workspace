import request from 'request';
import authentication from '../authentication.js';
import urlParser from '../urlParser.js';
import { errorLog, successLog } from '../../config/consoleFormat.js';
// Removed unused JWT generator utilities

// Obtain a session using standard login
export async function getSession(userCredentials) {
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials: userCredentials });
    return session;
}

// Get the current JWT configuration
export async function getJWTConfig({ baseUrl, session }) {
    const options = {
        url: baseUrl + '/api/mstrClients/auth/jwt',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    successLog('get jwt config success');
                    resolve(body);
                } else {
                    errorLog(`get jwt config failed. Status code: ${response.statusCode}. Message: ${body?.message}`);
                    reject(body?.message ?? body);
                }
            } else {
                errorLog(`get jwt config failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}

// Update the JWT configuration
export async function setJWTConfig({ baseUrl, session, jwtConfig }) {
    const options = {
        url: baseUrl + '/api/mstrClients/auth/jwt',
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
        },
        body: JSON.stringify(jwtConfig),
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200 || response.statusCode === 204) {
                    successLog('set jwt config success');
                    resolve({
                        statusCode: response.statusCode,
                        body: body || '',
                    });
                } else {
                    errorLog(`set jwt config failed. Status code: ${response.statusCode}. Message: ${body}`);
                    reject({
                        statusCode: response.statusCode,
                        message: body,
                    });
                }
            } else {
                errorLog(`set jwt config failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}

// Removed unused helper functions and login utilities to keep this module focused on config/session
