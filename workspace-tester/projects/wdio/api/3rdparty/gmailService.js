import fs from 'fs';
import readline from 'readline';
import { google } from 'googleapis';
import cheerio from 'cheerio';
import _ from 'lodash';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';

// If modifying these scopes, delete token.json.
const SCOPES = ['https://mail.google.com/'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let emailMsgIds = [];

let userEmailMap = {};

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
async function authorize(credentials, token) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    const token_path = path.join(__dirname, 'tokens', token);
    // Check if we have previously stored a token.
    fs.readFile(token_path, (err, token) => {
        if (err) return getNewToken(oAuth2Client, token_path, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        return oAuth2Client;
    });

    oAuth2Client.setCredentials(JSON.parse(fs.readFileSync(token_path)));
    return oAuth2Client;
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, token_path, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(token_path, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', token_path);
            });
            callback(oAuth2Client);
        });
    });
}

function readCredentials(credentials) {
    const credentialPath = path.join(__dirname, 'credentials', credentials);

    return new Promise((resolve, reject) => {
        //If file exists, return
        if (fs.existsSync(credentialPath)) {
            resolve(JSON.parse(fs.readFileSync(credentialPath)));
            return;
        }

        const localUrl = `http://10.199.56.59/store/${credentials}.base64`;

        http.get(localUrl, (response) => {
            let data = '';

            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                // Decode the base64 string to binary data
                const credentialData = Buffer.from(data, 'base64');

                // Write the credential data to a file
                fs.writeFile(credentialPath, credentialData, (err) => {
                    if (err) throw err;
                    resolve(JSON.parse(credentialData.toString()));
                });
            });
        }).on('error', (e) => {
            console.error(`Got error: ${e.message}`);
            reject(e);
        });
    });
}

async function clearAllEmails(credentials, token) {
    const credential = await readCredentials(credentials);
    let gmail;

    if (!emailMsgIds || emailMsgIds.length === 0) {
        return Promise.resolve('No email ids in cache.');
    }

    return authorize(credential, token)
        .then((auth) => {
            gmail = google.gmail({ version: 'v1', auth });
            return new Promise((resolve, reject) => {
                gmail.users.messages.batchDelete(
                    {
                        userId: 'me',
                        resource: {
                            ids: emailMsgIds,
                        },
                    },
                    (err, res) => {
                        if (err) {
                            return reject(err);
                        }
                        emailMsgIds = [];
                        return resolve('clear successfully');
                    }
                );
            });
        })
        .catch((err) => {
            console.log(err);
        });
}

async function getAllMessages(credentials, token) {
    const credential = await readCredentials(credentials);
    let gmail;
    return authorize(credential, token)
        .then((auth) => {
            gmail = google.gmail({ version: 'v1', auth });
            return new Promise((resolve, reject) => {
                gmail.users.messages.list(
                    {
                        userId: 'me',
                        maxResults: 500,
                        q: 'from:*@microstrategy.com',
                    },
                    (err, res) => {
                        if (err) {
                            return reject(err);
                        }
                        const messages = res.data.messages;
                        if (!messages) {
                            return resolve([]);
                        }
                        //clear current messageIds
                        emailMsgIds = [];
                        let messageIds = [];
                        messages.forEach((message) => {
                            emailMsgIds.push(message.id);
                            messageIds.push(message.id);
                        });
                        return resolve(messageIds);
                    }
                );
            });
        })
        .then((messageIds) => {
            let idPromiseList = [];
            messageIds.map((messageId) => {
                idPromiseList.push(
                    new Promise((resolve, reject) => {
                        gmail.users.messages.get(
                            {
                                userId: 'me',
                                id: messageId,
                            },
                            (err, res) => {
                                if (err) {
                                    return reject(err);
                                }
                                let date = _.find(res.data.payload.headers, (header) => header.name === 'Date').value;
                                let timestamp = res.data.internalDate;
                                let message = res.data.payload.body.data;
                                if (message === undefined) {
                                    return resolve();
                                }
                                let result = Buffer.from(message, 'base64').toString();

                                let $ = cheerio.load(result);
                                let recipient = $('#recipient').text().trim().slice(4, -1);
                                let finalBody = {
                                    recipient: recipient,
                                    inviteContent: $('#inviteContent').text(),
                                    senderFullName: $('#senderFullName').text(),
                                    inviteMessage: $('#inviteMessage').text(),
                                    browserLink: $('#browserLink').attr('href'),
                                    appLink: $('#appLink').attr('href'),
                                    memberAddedContent: $('#memberAddedContent').text(),
                                    mentionContent: $('#mentionContent').text(),
                                    mentionMessage: $('#mentionMessage').text(),
                                    date: date,
                                    timestamp: timestamp,
                                };
                                userEmailMap[recipient] = (userEmailMap[recipient] || []).concat(finalBody);
                                let customizedEmailRecipient = parseRecipientFromContent($);
                                if (customizedEmailRecipient) {
                                    userEmailMap[customizedEmailRecipient] = (
                                        userEmailMap[customizedEmailRecipient] || []
                                    ).concat(finalBody);
                                }
                                resolve();
                            }
                        );
                    })
                );
            });
            return Promise.all(idPromiseList);
        })
        .then(() => {
            _.forEach(userEmailMap, (value, key) => {
                value.sort((a, b) => b.timestamp - a.timestamp);
            });
        })
        .catch((err) => {
            console.log(err);
            return Promise.resolve();
        });
}

function parseRecipientFromContent($) {
    let currentContent = $('#inviteContent').text() || $('#memberAddedContent').text() || $('#mentionContent').text();
    let startIndex = currentContent.indexOf('Hi, ');
    let endIndex = currentContent.indexOf('!');
    return currentContent.substring(startIndex + 4, endIndex);
}

export class GmailService {
    static refresh(credentials = 'credentials.json', token = 'token.json') {
        return getAllMessages.call(this, credentials, token);
    }

    static clearAll(credentials = 'credentials.json', token = 'token.json') {
        userEmailMap = {};
        return clearAllEmails.call(this, credentials, token);
    }

    static getUserEmailMap() {
        return userEmailMap;
    }
}
