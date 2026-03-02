import logout from './logout.js';
import getSessionFromCurrentBrowser from '../utils/getSessionFromCurrentBrowser.js';
import urlParser from './urlParser.js';
import { groupLog, groupLogEnd } from '../config/consoleFormat.js';
import allureReporter from '@wdio/allure-reporter';

export default async function logoutFromCurrentBrowser() {
    groupLog('logout current browser session by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await getSessionFromCurrentBrowser();
    await logout({ baseUrl, session });
    allureReporter.addStep(`logoutFromCurrentBrowser`);
    groupLogEnd();
}
