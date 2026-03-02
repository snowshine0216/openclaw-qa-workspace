import request from 'request';
import { errorLog, successLog, groupLog, groupLogEnd } from '../../config/consoleFormat.js';
import authentication from '../authentication.js';
import createBotInstance from './createBotInstance.js';
import saveBotAPI from './saveBot.js';
import logout from '../logout.js';
import urlParser from '../urlParser.js';
import allureReporter from '@wdio/allure-reporter';

export default async function editBotAPI({ credentials, botInfo }) {
    groupLog('initialize bot instance by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    const instance = await createBotInstance({ baseUrl, session, bot: botInfo });
    botInfo.instance = instance;
    await editBot({ baseUrl, session, botInfo });
    await saveBotAPI({ baseUrl, session, botInfo, isCreateNew: false });
    await logout({ baseUrl, session });
    groupLogEnd();
    allureReporter.addStep(`Edit bot with id=${botInfo.instance.id} by credentials=${JSON.stringify(credentials)}`);
}

async function getBotInfo({ baseUrl, session, botInfo }) {
    const options = {
        url: baseUrl + `api/dossiers/${botInfo.instance.id}/instances/${botInfo.instance.instanceId}`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
            'X-MSTR-ProjectID': botInfo.project.id,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    const responseObject = JSON.parse(body);
                    successLog(`Get Bot info of id = '${botInfo.instance.id}' is successful`);
                    resolve({ aibotInfo: responseObject.aibotInfo, datasets: responseObject.datasets });
                } else {
                    errorLog(
                        `Get Bot info of id =${botInfo.instance.id} failed.
                        Status code: ${response.statusCode}. Message: ${body.message}`
                    );
                    reject();
                }
            } else {
                errorLog(`Get Bot info with '${JSON.stringify(botInfo.instance)}' failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}

export async function editBot({ baseUrl, session, botInfo }) {
    const options = {
        url: baseUrl + `api/bots/${botInfo.instance.id}/instances/${botInfo.instance.instanceId}/configuration`,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
            'X-MSTR-ProjectID': botInfo.project.id,
        },
        json: botInfo.configuration,
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 204) {
                    successLog(
                        `Editing bot instance by configuration '${JSON.stringify(botInfo.configuration)}' is successful`
                    );
                    resolve();
                } else {
                    errorLog(
                        `Editing bot instance failed by '${JSON.stringify(botInfo.configuration)}'. 
                        Status code: ${response.statusCode}. Message: ${body.message}`
                    );
                    reject();
                }
            } else {
                errorLog(
                    `Editing bot instance by configuration '${JSON.stringify(
                        botInfo.configuration
                    )}' failed. Error: ${error}`
                );
                reject(error);
            }
        });
    });
}
