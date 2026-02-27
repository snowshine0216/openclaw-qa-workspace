import request from 'request';
import urlParser from './urlParser.js';
import authentication from './authentication.js';
import logout from './logout.js';
import { errorLog, successLog, groupLog, groupLogEnd } from '../config/consoleFormat.js';

export default async function getUserGroupByName({ credentials, nameBeginsList }) {
    groupLog('Delete user groups by name Begins by API');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    try {
        for (const nameBegins of nameBeginsList) {
            const groups = await getUsergroups({ baseUrl, session, nameBegins });
            if (groups.length > 0) {
                return true;
                // const groupId = groups[0].id;
                // await deleteUsergroup({ baseUrl, session, groupId });
            } else {
                successLog(`No user group found with the name prefix: ${nameBegins}.`);
                return false;
            }
        }
    } catch (error) {
        errorLog(`Error occurred: ${error}`);
    }
    await logout({ baseUrl, session });
    groupLogEnd();
}

export async function getUsergroups({ baseUrl, session, nameBegins }) {
    const options = {
        url: `${baseUrl}api/usergroups?nameBegins=${encodeURIComponent(nameBegins)}&offset=0&limit=-1`,
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
                    const groupArrays = JSON.parse(body);
                    successLog(
                        `Getting user groups for name prefix "${nameBegins}" is successful. Groups: ${JSON.stringify(
                            groupArrays
                        )}`
                    );
                    resolve(groupArrays);
                } else {
                    errorLog(
                        `Getting user groups for name prefix "${nameBegins}" failed. Status code: ${response.statusCode}. Message: ${body}`
                    );
                    reject(body);
                }
            } else {
                errorLog(`Getting user groups for name prefix "${nameBegins}" failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
