import request from 'request';
import authentication from '../authentication.js';
import urlParser from '../urlParser.js';
import { successLog, errorLog } from '../../config/consoleFormat.js';

export async function getSession(credentials) {
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    return session;
}

export default async function getOAuth2Settings({ baseUrl, session }) {
    const options = {
        url: baseUrl + '/api/mstrServices/library/oauth2/settings',
        method: 'GET',
        json: true,
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
                    successLog('get oauth2 settings success');
                    resolve(body);
                } else {
                    const errorMessage = body?.message || body;
                    errorLog(`get oauth2 settings failed. Status code: ${response.statusCode}. Message: ${errorMessage}`);
                    reject(errorMessage);
                }
            } else {
                errorLog(`get oauth2 settings failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}

export async function putOAuth2Settings({ baseUrl, session, body }) {
    const options = {
        url: baseUrl + '/api/mstrServices/library/oauth2/settings',
        method: 'PUT',
        json: true,
        headers: {
            'Content-Type': 'application/json',
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
        },
        body: body,
    };
    const { headers, ...restOptions } = options;
    const safeHeaders = {
        ...headers,
        Cookie: headers && headers.Cookie ? '[REDACTED]' : undefined,
        'X-MSTR-AuthToken': headers && headers['X-MSTR-AuthToken'] ? '[REDACTED]' : undefined,
    };
    const safeOptions = { ...restOptions, headers: safeHeaders };
    console.log('put oauth2 settings request options:', safeOptions);
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200 || response.statusCode === 204) {
                    successLog('put oauth2 settings success');
                    resolve({
                        statusCode: response.statusCode,
                        body: body,
                    });
                } else {
                    reject({
                        statusCode: response.statusCode,
                        message: body,
                    });
                }
            } else {
                errorLog(`put oauth2 settings API call failed with error: ${error}`);
                reject(error);
            }
        });
    });
}