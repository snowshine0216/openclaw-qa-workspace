import request from 'request';
import authentication from '../authentication.js';
import logout from '../logout.js';
import urlParser from '../urlParser.js';
import { errorLog, groupLog, groupLogEnd, successLog } from '../../config/consoleFormat.js';

export default async function botV2RestAPI({
    baseUrl = urlParser(browser.options.baseUrl),
    group,
    credentials,
    params,
}) {
    groupLog(`${group} by api`);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    const body = await sendAPIRequest({ group, baseUrl, session, params });
    await logout({ baseUrl, session });
    groupLogEnd();
    return body;
}

export async function sendAPIRequest({ group, baseUrl, session, params }) {
    const { options, projectId } = params;
    const optionsWithHeaders = {
        ...options,
        url: baseUrl + options.url,
        method: options.method ?? 'GET',
        headers: {
            ...options.headers,
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
            'X-MSTR-ProjectID': projectId,
        },
        json: params.json,
    };
    return new Promise((resolve, reject) => {
        request(optionsWithHeaders, (error, response, body) => {
            if (!error) {
                if (response.statusCode < 300) {
                    successLog(`${group} is successful: ${options.url}`);
                    resolve(body);
                } else {
                    errorLog(`${group} is failed. Status code: ${response.statusCode}. Message: ${response.body}`);
                    reject(body.message);
                }
            } else {
                errorLog(`${group} is failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
