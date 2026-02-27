import request from 'request';
import authentication from './authentication.js';
import logout from './logout.js';
import urlParser from './urlParser.js';
import { groupLog, groupLogEnd, errorLog, successLog } from '../config/consoleFormat.js';

export default async function republishCube({ credentials, cube }) {
    groupLog('republishCube by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    await republishCubeAPI({ baseUrl, session, cube });
    await browser.pause(2000);
    await logout({ baseUrl, session });
    groupLogEnd();
}

async function republishCubeAPI({ baseUrl, session, cube }) {
    const options = {
        url: baseUrl + `api/cubes/${cube.id}`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
            'X-MSTR-ProjectID': cube.project.id,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 202) {
                    successLog(`Republish cube with ID '${cube.id}' successfully.`);
                    resolve(body);
                } else {
                    errorLog(
                        `Republish cube with ID '${cube.id} failed. Status code: ${response.statusCode}. Message: ${body}`
                    );
                    reject(body);
                }
            } else {
                errorLog(`Republish cube with ID '${cube.id}' failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
