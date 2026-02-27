import request from 'request';
import urlParser from './../../urlParser.js';
import authentication from './../../authentication.js';
import { errorLog, successLog } from '../../../config/consoleFormat.js';

export default async function getNuggetInBot({ credentials, botId, projectId = 'B7CA92F04B9FAE8D941C3E9B7E0CD754' }) {
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    const options = {
        url: baseUrl + `api/bots/${botId}/nuggets`,
        method: 'GET',
        headers: {
            'X-MSTR-AuthToken': session.token,
            'X-MSTR-ProjectID': projectId,
            Cookie: session.cookie,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    let jsonObj = JSON.parse(body);
                    const nuggetsList = jsonObj.nuggets.map(nugget => nugget.id);
                    successLog(`Get nugget in bot '${botId}' is successful. Nugget list is ${nuggetsList}`);
                    resolve(nuggetsList);
                } else {
                    errorLog(
                        `Get nugget in bot '${botId}' failed. Status code: ${response.statusCode}. Message: ${body.message}. SubMessage: ${body.subErrors.message}`
                    );
                    reject(body.message);
                }
            } else {
                errorLog(`Get nugget in bot '${botId}' failed.`);
                reject(error);
            }
        });
    });
}