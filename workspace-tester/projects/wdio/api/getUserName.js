import request from 'request';
import { errorLog, successLog } from '../config/consoleFormat.js';
import urlParser from './urlParser.js';

export default async function getUserNameById({ token, userId }) {
    const baseUrl = urlParser(browser.options.baseUrl);
    const options = {
        url: `${baseUrl}api/users/${userId}`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': token,
        },
    };

    return new Promise((resolve) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    const userInfo = JSON.parse(body);
                    const username = userInfo.username;
                    successLog(`Get username by userId='${userId}' success: ${username}`);
                    resolve(username);
                } else {
                    errorLog(`Failed to get username. Status: ${response.statusCode}, Message: ${body}`);
                    resolve(new Error(body));
                }
            } else {
                errorLog(`Error in request: ${error}`);
                resolve(error);
            }
        });
    });
}
