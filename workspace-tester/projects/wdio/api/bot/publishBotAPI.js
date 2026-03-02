import request from 'request';
import { errorLog, successLog, groupLog, groupLogEnd } from '../../config/consoleFormat.js';
import authentication from '../authentication.js';
import logout from '../logout.js';
import urlParser from '../urlParser.js';
import allureReporter from '@wdio/allure-reporter';

export default async function publishBotByAPI({ credentials, publishInfo }) {
    groupLog('publish bot by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    await publishBot({ baseUrl, session, publishInfo });
    await logout({ baseUrl, session });
    groupLogEnd();
    allureReporter.addStep(`publish bot by api successfully, ${publishInfo}`);
}

async function publishBot({ baseUrl, session, publishInfo }) {
    const options = {
        url: baseUrl + `api/library`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
            'X-MSTR-ProjectID': publishInfo.projectId,
        },
        json: publishInfo,
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 204) {
                    successLog(
                        `Publish bot '${publishInfo.id}' to user ${JSON.stringify(
                            publishInfo.recipients
                        )} is successful`
                    );
                    resolve();
                } else {
                    errorLog(
                        `Publish bot failed by '${JSON.stringify(publishInfo)}'. 
                        Status code: ${response.statusCode}. Message: ${body.message}`
                    );
                    reject();
                }
            } else {
                errorLog(`Publish bot '${JSON.stringify(publishInfo)}' failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
