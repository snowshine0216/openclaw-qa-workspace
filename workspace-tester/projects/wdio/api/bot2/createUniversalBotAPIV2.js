import request from 'request';
import { groupLog, groupLogEnd, errorLog, successLog } from '../../config/consoleFormat.js';
import authentication from '../authentication.js';
import logout from '../logout.js';
import urlParser from '../urlParser.js';
import allureReporter from '@wdio/allure-reporter';
import { saveBotV2, publishBotV2 } from './createBotAPIV2.js';

/**
 * @param {*} example:
 * {
 *  credentials: { username: '', password: '' },
 *  subBots: ['F1CDB132A54B94D0CAAAFEADEB44A54D'],
 *  projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
 *  botName: 'auto_bot_custom_instructions_temperature',
 *  folderId: 'D3D656D23E46EDFB14A602B0CC58ADC8',
 *  publishedToUsers: ['B792CD1A4551D286A4A36180C3CB2349'],
 * }
 *
 * @return botId
 */
export default async function createUniversalBotByAPIV2({
    credentials,
    subBots,
    projectId,
    folderId,
    botName,
    publishedToUsers = [],
}) {
    groupLog('initialize bot2.0 instance by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });

    try {
        const botId = await createBotV2({ baseUrl, session, subBots, projectId });
        allureReporter.addStep(`create bot with id=${botId} by credentials=${JSON.stringify(credentials)}`);
        if (folderId) {
            await saveBotV2({ session, botId, botName, folderId, projectId });
        }
        if (publishedToUsers && publishedToUsers.length > 0) {
            await publishBotV2({ session, botId, publishedToUsers, projectId });
            successLog('publish bot successfully');
        }
        return botId;
    } finally {
        await logout({ baseUrl, session });
        groupLogEnd();
    }
}

/**
 * Save bot API call
 * @param {Object} params
 * @param {String} params.baseUrl - Base URL
 * @param {Object} params.session - Session info
 * @param {Array} params.aiDatasetCollections - Array of dataset collection IDs
 * @param {String} params.projectId - Project ID
 * @returns {Promise<String>} Bot ID
 */
async function createBotV2({ baseUrl, session, subBots, projectId }) {
    // Construct payload
    const payload = {
        subBots: subBots.map((id) => ({ id })),
    };

    const options = {
        url: baseUrl + 'api/v2/bots',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
            'X-MSTR-ProjectID': projectId,
        },
        json: payload,
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 201 || response.statusCode === 200) {
                    const botId = body.id;
                    successLog(`Creating universal bot is successful. Bot ID: ${botId}`);
                    resolve(botId);
                } else {
                    errorLog(
                        `Creating universal bot failed. Status code: ${response.statusCode}. Message: ${body?.message}`
                    );
                    reject(body?.message);
                }
            } else {
                errorLog(`Creating universal bot failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
