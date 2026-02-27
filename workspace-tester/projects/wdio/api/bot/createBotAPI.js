import { groupLog, groupLogEnd } from '../../config/consoleFormat.js';
import authentication from '../authentication.js';
import logout from '../logout.js';
import urlParser from '../urlParser.js';
import allureReporter from '@wdio/allure-reporter';
import createBotInstanceAPI from './createBot.js';
import saveBotAPI from './saveBot.js';
import updateBotInstanceByNuggetsAPI from './nuggets/updateBotInstanceByNuggetsAPI.js';
import { editBot } from './editBotAPI.js';

/**
 * @param {*} botInfo = {
 *  project:{
 *      id:'B7CA92F04B9FAE8D941C3E9B7E0CD754'
 *  },
 * data:{
 *    "datasets": [
 *      {
 *         "id":"B173577AA1408EB4388534A43BAB5DFE",
 *         "name":"Base Report"
 *       }],
 *       "isBot": true,
 *       "overwrite": true,
 *       "name": "snow_test1",
 *       "description": "",
 *       "folderId": "D3C7D461F69C4610AA6BAA5EF51F4125"
 * }
 * @return botId
 */
export default async function createBotByAPI({ credentials, botInfo }) {
    groupLog('initialize bot instance by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    const instanceObj = await createBotInstanceAPI({ baseUrl, session, botInfo });
    botInfo.instance = instanceObj;
    if (botInfo.nuggets) {
        await updateBotInstanceByNuggetsAPI({ baseUrl, session, data: botInfo });
    }
    if (botInfo.configuration) {
        await editBot({ baseUrl, session, botInfo });
    }
    const botId = await saveBotAPI({ baseUrl, session, botInfo });
    await logout({ baseUrl, session });
    groupLogEnd();
    allureReporter.addStep(`create bot with id=${botId} by credentials=${JSON.stringify(credentials)}`);
    return botId;
}
