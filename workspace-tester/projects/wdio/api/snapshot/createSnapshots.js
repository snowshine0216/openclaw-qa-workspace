import request from 'request';
import authentication from '../authentication.js';
import logout from '../logout.js';
import urlParser from '../urlParser.js';
import answerPrompt from '.././answerPrompt.js';
import getPrompts from '.././getPrompts.js';
import getReportPrompts from '.././reports/getReportPrompts.js';
import answerReportPrompt from '.././reports/answerReportPrompt.js';
import _ from 'lodash';
import { groupLog, groupLogEnd, successLog, errorLog } from '../../config/consoleFormat.js';

export default async function createSnapshots({ credentials, dossiers, type = 'dossier' }) {
    groupLog('create snapshot by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    let messageIds = [];
    let prompts = [];
    for (const dossier of dossiers) {
        try {
            if (type !== 'report') {
                prompts = await getPrompts({ baseUrl, session, dossier });
            } else if (type === 'report') {
                prompts = await getReportPrompts({ baseUrl, session, dossier });
            }
            const messageId = await createSnapshotStep1({ baseUrl, session, dossier });
            if (!_.isEmpty(prompts)) {
                if (type !== 'report') {
                    await answerPrompt({ baseUrl, session, dossier, dossierInstance: { id: messageId } });
                } else if (type === 'report') {
                    await answerReportPrompt({ baseUrl, session, dossier, dossierInstance: { id: messageId } });
                }
            }
            await createSnapshotStep2({ baseUrl, session, dossier, messageId });
            messageIds.push(messageId);
        } catch (error) {
            errorLog(`Error create snapshot for dossier '${dossier.name}': ${error}`);
        }
    }
    await logout({ baseUrl, session });
    groupLogEnd();
    return messageIds;
}

async function createSnapshotStep1({ baseUrl, session, dossier: report }) {
    const optionsForSnapshot = {
        url: baseUrl + `api/historyList`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-ProjectID': report.project.id,
            'X-MSTR-AuthToken': session.token,
            Cookie: session.cookie,
        },
        json: {
            id: report.id,
            type: report.type,
        },
    };

    return new Promise((resolve, reject) => {
        request(optionsForSnapshot, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    const messageId = body.messageId;
                    successLog(
                        `Creating snapshot step1 for '${report.name}' with ID '${report.id}' is successful. messageId: ${messageId}`
                    );
                    resolve(messageId);
                } else {
                    errorLog(
                        `Creating snapshot step1 for '${report.name}' with ID '${report.id}' failed. Status code: ${response.statusCode}. Message: ${body.message}`
                    );
                    reject(body.message);
                }
            } else {
                errorLog(`Creating snapshot step1 for '${report.name}' with ID '${report.id}' failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}

async function createSnapshotStep2({ baseUrl, session, dossier: report, messageId }) {
    const optionsForSnapshot = {
        url: baseUrl + `api/historyList`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-ProjectID': report.project.id,
            'X-MSTR-AuthToken': session.token,
            Cookie: session.cookie,
        },
        json: {
            id: report.id,
            type: report.type,
            msgId: messageId,
        },
    };

    return new Promise((resolve, reject) => {
        request(optionsForSnapshot, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    const messageId = body.messageId;
                    successLog(
                        `Creating snapshot for '${report.name}' with ID '${report.id}' is successful. messageId: ${messageId}`
                    );
                    resolve(messageId);
                } else {
                    errorLog(
                        `Creating snapshot for '${report.name}' with ID '${report.id}' failed. Status code: ${response.statusCode}. Message: ${body.message}`
                    );
                    reject(body.message);
                }
            } else {
                errorLog(`Creating snapshot for '${report.name}' with ID '${report.id}' failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
