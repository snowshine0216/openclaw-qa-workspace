import authentication from './../authentication.js';
import logout from './../logout.js';
import urlParser from './../urlParser.js';
import { groupLog, groupLogEnd } from '../../config/consoleFormat.js';
import copyObject from './copyObject.js';

export default async function copyObjects({ credentials, objectList }) {
    groupLog('copyObjects by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    for (const object of objectList) {
        await copyObject({ baseUrl, session, object });
    }
    await logout({ baseUrl, session });
    groupLogEnd();
}
