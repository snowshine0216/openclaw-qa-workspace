import request from 'request';
import authentication from '../authentication.js';
import urlParser from '../urlParser.js';
import { successLog, errorLog } from '../../config/consoleFormat.js';

export async function getSession(credentials) {
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    return session;
}

export default async function getMCPSettings({ baseUrl, session }) {
    const options = {
        url: baseUrl + '/api/mstrServices/library/mcp/settings',
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
                    successLog('get mcp settings success');
                    resolve(body);
                } else {
                    const errorMessage = body?.message || body;
                    errorLog(`get mcp settings failed. Status code: ${response.statusCode}. Message: ${errorMessage}`);
                    reject(errorMessage);
                }
            } else {
                errorLog(`get mcp settings failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}

export async function putMCPSettings({ baseUrl, session, body }) {
    const options = {
        url: baseUrl + '/api/mstrServices/library/mcp/settings',
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
    console.log('put mcp settings request options:', safeOptions);
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200 || response.statusCode === 204) {
                    successLog('put mcp settings success');
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
                errorLog(`put mcp settings API call failed with error: ${error}`);
                reject(error);
            }
        });
    });
}
