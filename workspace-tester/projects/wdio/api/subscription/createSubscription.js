import request from 'request';
import authentication from '../authentication.js';
import logout from '../logout.js';
import urlParser from '../urlParser.js';
import { groupLog, groupLogEnd, successLog, errorLog } from '../../config/consoleFormat.js';
import createBookmark from '../createBookmark.js';
import createDossierInstance from '../createDossierInstance.js';
import { content } from 'googleapis/build/src/apis/content/index.js';

export default async function createSubscriptions({
    credentials,
    dossier,
    bookmarkName = 'snapshot',
    recipient,
    type = 'snapshot',
}) {
    groupLog('create subscription by api');
    // first create bm to get bm id
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    const dossierInstance = await createDossierInstance({ baseUrl, session, dossier });
    let response = await createBookmark({ baseUrl, session, dossier, dossierInstance, name: bookmarkName });
    let bookmarkId = response.id;
    let subscriptionId = await createSubscription({
        baseUrl,
        session,
        dossier,
        bookmarkId,
        credentials, // owner
        recipient: recipient,
        type: type,
    });
    await logout({ baseUrl, session });
    groupLogEnd('end creating subscription by api');
    return subscriptionId;
}

async function createSubscription({
    baseUrl,
    session,
    dossier,
    bookmarkId,
    credentials, // owner
    recipient,
    applicationId = 'C2B2023642F6753A2EF159A75E0CFF29',
    type = 'snapshot',
}) {
    const generateContentConfig = (type) => {
        const contentConfig = {
            mode: 'EMAIL',
            settings: {
                subject: dossier.name + '_api',
                message: '',
            },
        };
        if (type === 'snapshot') {
            contentConfig.settings.sendContentAs = 'library_snapshot';
            contentConfig.settings.exportToPdfSettings = null;
            contentConfig.settings.exportToExcelSettings = null;
            contentConfig.settings.formatType = null;
        } else if (type === 'pdf') {
            contentConfig.settings.sendContentAs = 'pdf';
            contentConfig.settings.exportToPdfSettings = { layout: 'single_page', includeGrid: true };
            contentConfig.settings.formatType = 'PDF';
        } else if (type === 'excel') {
            contentConfig.settings.sendContentAs = 'excel';
            contentConfig.settings.exportToExcelSettings = { includeGrid: true };
            contentConfig.settings.formatType = 'EXCEL';
        } else {
            throw new Error('Invalid type');
        }

        return contentConfig;
    };

    const contentConfig = generateContentConfig(type);
    const optionsForSubscription = {
        url: baseUrl + `api/subscriptions`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-ProjectID': dossier.project.id,
            'X-MSTR-AuthToken': session.token,
            Cookie: session.cookie,
        },
        json: {
            multipleContents: true,
            allowUnsubscribe: true,
            allowDeliveryChanges: false,
            editable: false,
            sendNow: false,
            name: dossier.name + '_api',
            schedules: [
                {
                    id: '3450AE6F4E29E9A6E1075DA93B7062AA', // Books Close
                },
            ],
            contents: [
                {
                    id: dossier.id,
                    type: 'dossier',
                    personalization: {
                        compressed: false,
                        formatMode: 'ALL_PAGES',
                        viewMode: 'BOTH',
                        formatType: contentConfig.settings.formatType,
                        contentModes: ['bookmark'],
                        bookmarkIds: [bookmarkId],
                        exportToPdfSettings: contentConfig.settings.exportToPdfSettings,
                        exportToExcelSettings: contentConfig.settings.exportToExcelSettings,
                    },
                },
            ],
            owner: {
                id: credentials.id,
            },
            recipients: [
                {
                    id: recipient.id,
                    type: 'user',
                },
            ],
            delivery: {
                mode: 'EMAIL',
                email: {
                    subject: contentConfig.settings.subject,
                    message: contentConfig.settings.message,
                    sendContentAs: contentConfig.settings.sendContentAs,
                },
                applicationId: applicationId,
            },
        },
    };

    return new Promise((resolve, reject) => {
        request(optionsForSubscription, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 201) {
                    const subscriptionId = body.id;
                    successLog(
                        `Creating subscription for '${dossier.name}' with ID '${dossier.id}' is successful. messageId: ${subscriptionId}`
                    );
                    resolve(subscriptionId);
                } else {
                    errorLog(
                        `Creating subscription for '${dossier.name}' with ID '${dossier.id}' failed. Status code: ${response.statusCode}. Message: ${body.message}`
                    );
                    reject(body.message);
                }
            } else {
                errorLog(`Creating subscription for '${dossier.name}' with ID '${dossier.id}' failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
