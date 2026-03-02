import request from 'request';
import getUserId from '../getUserId.js';
import { errorLog, successLog } from '../../config/consoleFormat.js';
/**
 * Retrieves system prompts for a specific user session.
 *
 * @param {Object} params - The parameters for the request.
 * @param {string} params.baseUrl - The base URL for the API.
 * @param {Object} params.session - The session object containing authentication details.
 * @param {string} params.session.token - The authentication token for the session.
 * @param {string} params.session.cookie - The session cookie.
 * @param {string} [params.userId] - The user ID for whom to retrieve system prompts. If not provided, it will be fetched using the session.
 * @returns {Promise<Object>} - Resolves with the system prompts data as a parsed JSON object.
 */
export default async function getSystemPrompts({ baseUrl, session, userId }) {
    if (!userId) {
        userId = await getUserId({ baseUrl, session });
    }
    // Validate input parameters
    if (!userId) {
        throw new Error('User id is not provided or can\'t be retrieved from the current session');
    }

    // Build URL with query parameter based on boolean value
    let url = baseUrl + 'api/users/' + userId + '/systemprompts';

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
                        successLog(`Get user system prompt is successful`);
                        resolve(data);
                    } catch (e) {
                        errorLog(`Get user system prompt failed. Error: ${e}`);
                        reject('Response body is not valid JSON: ' + body);
                    }
                } else {
                    errorLog(`Get user system prompt failed. Status code: ${response.statusCode}. Message: ${body}`);
                    reject('Status code: ' + response.statusCode + '. Message: ' + body);
                }
            } else {
                errorLog(`Get user system prompt failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}