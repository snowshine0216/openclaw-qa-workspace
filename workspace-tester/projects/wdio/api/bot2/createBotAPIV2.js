import request from 'request';
import { groupLog, groupLogEnd, errorLog, successLog } from '../../config/consoleFormat.js';
import authentication from '../authentication.js';
import logout from '../logout.js';
import urlParser from '../urlParser.js';
import allureReporter from '@wdio/allure-reporter';

/**
 * @param {*} example:
 * {
 *  credentials: { username: 'taliu', password: '' },
 *  aiDatasetCollections: ['F1CDB132A54B94D0CAAAFEADEB44A54D'],
 *  projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
 *  botName: 'auto_bot_custom_instructions_temperature',
 *  folderId: 'D3D656D23E46EDFB14A602B0CC58ADC8',
 *  publishedToUsers: ['B792CD1A4551D286A4A36180C3CB2349'],
 * }
 *
 * @return botId
 */
export default async function createBotByAPIV2({
    credentials,
    aiDatasetCollections,
    projectId,
    folderId,
    botName,
    publishedToUsers = [],
}) {
    groupLog('initialize bot2.0 instance by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });

    try {
        const botId = await createBotV2({ baseUrl, session, aiDatasetCollections, projectId });
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
async function createBotV2({ baseUrl, session, aiDatasetCollections, projectId }) {
    // Construct payload
    const payload = {
        aiDatasetCollections: aiDatasetCollections.map((id) => ({ id })),
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
                    successLog(`Creating bot v2 is successful. Bot ID: ${botId}`);
                    resolve(botId);
                } else {
                    errorLog(`Creating bot v2 failed. Status code: ${response.statusCode}. Message: ${body?.message}`);
                    reject(body?.message);
                }
            } else {
                errorLog(`Creating bot v2 failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}

/**
 * Save bot API call
 * @param {Object} params
 * @param {Object} params.session - Session info
 * @param {String} params.botId - Bot ID to update
 * @param {String} params.botName - New name for the bot
 * @param {String} params.folderId - Target folder ID
 * @param {String} params.projectId - Project ID
 * @returns {Promise<void>}
 */
async function saveBotV2({ session, botId, botName, folderId, projectId }) {
    // Construct operation list for the patch request
    const operationList = [
        {
            op: 'replace',
            path: '/name',
            value: botName,
        },
        {
            op: 'replace',
            path: '/config/general/name',
            value: botName,
        },
        {
            op: 'replace',
            path: '/status',
            value: 'published',
        },
        {
            op: 'replace',
            path: '/folder',
            value: folderId,
        },
    ];

    // Add custom instructions operations if provided
    operationList.push({
        op: 'replace',
        path: '/config/customInstructions/businessInfo',
        value: 'Please format your responses with the following guidelines:\n - Use bullet points to organize information.\n - Apply bold to key information everywhere.\n - Add emoticons at beginning of each of the insights bullets, make it look professional.',
    });

    operationList.push({
        op: 'replace',
        path: '/config/customInstructions/enabled',
        value: true,
    });

    const baseUrl = urlParser(browser.options.baseUrl);
    const options = {
        url: baseUrl + `api/v2/bots/${botId}`,
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
            'X-MSTR-ProjectID': projectId,
        },
        json: { operationList },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 202) {
                    successLog(`Saving bot is successful. Bot ID: ${botId}`);
                    resolve();
                } else {
                    errorLog(`Saving bot failed. Status code: ${response.statusCode}. Message: ${body?.message}`);
                    reject(body?.message);
                }
            } else {
                errorLog(`Saving bot failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}

/**
 * Publish bot API call
 * @param {Object} params
 * @param {Object} params.session - Session info
 * @param {String} params.botId - Bot ID to publish
 * @param {Array} params.publishedToUsers - Array of user IDs to publish to
 * @param {String} params.projectId - Project ID
 * @returns {Promise<void>}
 */
async function publishBotV2({ session, botId, publishedToUsers, projectId }) {
    const baseUrl = urlParser(browser.options.baseUrl);
    const options = {
        url: baseUrl + 'api/dossierPersonalView',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
            'X-MSTR-ProjectID': projectId,
        },
        json: {
            srcId: botId,
            publishedToUsers: publishedToUsers,
            publishAction: 'PUBLISH',
            isInstance: false,
        },
    };

    return new Promise((resolve, reject) => {
        try {
            request(options, (error, response, body) => {
                if (error) {
                    errorLog(`Publishing bot failed. Error: ${error}`);
                    return reject(error);
                }

                if (response.statusCode === 200) {
                    successLog(`Publishing bot is successful. Bot ID: ${botId}`);
                    resolve();
                } else {
                    errorLog(`Publishing bot failed. Status code: ${response.statusCode}. Message: ${body?.message}`);
                    reject(body?.message);
                }
            });
        } catch (err) {
            errorLog(`Error making publish request: ${err}`);
            reject(err);
        }
    });
}

export { saveBotV2, publishBotV2 };
