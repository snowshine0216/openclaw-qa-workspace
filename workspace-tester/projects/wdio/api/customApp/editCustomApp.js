import request from 'request';
import { errorLog, groupLog, successLog, groupLogEnd } from '../../config/consoleFormat.js';
import authentication from '../authentication.js';
import logout from '../logout.js';
import { getCustomAppById } from './getCustomApps.js';
import urlParser from '../urlParser.js';
import allureReporter from '@wdio/allure-reporter';

export default async function editCustomApp({ credentials, id, homeScreen, nugget = [] }) {
    groupLog('edit custom app by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    const customAppObj = await getCustomAppById({ baseUrl, session, id });
    if (homeScreen) {
        customAppObj.homeScreen = homeScreen;
    }
    customAppObj.applicationNuggets = nugget;
    await editCustomAppAPI({ baseUrl, session, customAppInfo: customAppObj });
    await logout({ baseUrl, session });
    groupLogEnd();
    allureReporter.addStep(`edit custom app id='${id}' by credentials=${credentials}`);
}

async function editCustomAppAPI({ baseUrl, session, customAppInfo }) {
    const options = {
        url: baseUrl + `api/v2/applications/${customAppInfo.id}`,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
        },
        json: customAppInfo,
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 204) {
                    successLog(`Editing CustomApp '${customAppInfo.name}' is successful. id = '${customAppInfo.id}'`);
                    resolve();
                } else {
                    errorLog(
                        `Editing CustomApp '${customAppInfo.name}' by id = '${customAppInfo.id}' failed. Status code: ${response.statusCode}. Message: ${body.message}`
                    );
                    reject();
                }
            } else {
                errorLog(
                    `Editing CustomApp '${customAppInfo.name}' by id = '${customAppInfo.id}' failed. Error: ${error}`
                );
                reject(error);
            }
        });
    });
}
