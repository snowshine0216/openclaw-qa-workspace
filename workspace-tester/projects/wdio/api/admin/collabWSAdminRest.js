import authentication from '../authentication.js';
import logout from '../logout.js';
import urlParser from '../urlParser.js';
import getCommonConfigs from './getCommonConfigs.js';
import getDevConfigs from './getDevConfigs.js';
import putCommonConfigs from './putCommonConfigs.js';
import putDevConfigs from './putDevConfigs.js';
import { groupLog, groupLogEnd } from '../../config/consoleFormat.js';

// get CommonConfigs
export async function collabGetCommonConfigs(credentials) {
    groupLog('collabGetCommonConfigs by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    let body = await getCommonConfigs({ baseUrl, session });
    await logout({ baseUrl, session });
    groupLogEnd();
    console.log(body);
    return body;
}

export async function collabGetDevConfigs(credentials) {
    groupLog('collabGetDevConfigs by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    let body = await getDevConfigs({ baseUrl, session });
    await logout({ baseUrl, session });
    groupLogEnd();
    console.log(body);
    return body;
}

export async function collabPutCommonConfigs(credentials, configInfo) {
    groupLog('collabPutCommonConfigs by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    let body = await putCommonConfigs({ baseUrl, session, configInfo });
    await logout({ baseUrl, session });
    groupLogEnd();
    console.log(body);
    return body;
}

export async function collabPutDevConfigs(credentials, configInfo) {
    groupLog('collabPutDevConfigs by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    let body = await putDevConfigs({ baseUrl, session, configInfo });
    await logout({ baseUrl, session });
    groupLogEnd();
    console.log(body);
    return body;
}
