import request from 'request';
import { errorLog, successLog, infoLog, groupLog, groupLogEnd } from './../../../config/consoleFormat.js';
import FormData from 'form-data';
import fs from 'fs';
import authentication from './../../authentication.js';
import path from 'path';
import logout from './../../logout.js';
import getRelativePath from './../../../utils/file-helper.js';
import urlParser from './../../urlParser.js';

export default async function createNuggetsRestAPI({ baseUrl, credentials, fileName }) {
    groupLog('Create nugget by api');
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    const nugget = await createNuggets({ baseUrl, session, fileName });
    await logout({ baseUrl, session });
    groupLogEnd();
    return nugget;
}

export async function createNuggets({ credentials, fileName }) {
    groupLog('create nugget by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    const file = await getRelativePath(fileName);
    if (!fileName.endsWith('.xlsx')) {
        throw new Error(`File '${fileName}' is not a valid file. Please provide a valid .xlsx file!!!`);
    }
    if (!fs.existsSync(file)) {
        throw new Error(`File '${file}' does not exist!!!`);
    }
    const binary = fs.readFileSync(file);
    const stats = fs.statSync(file);
    const formData = new FormData();
    formData.append('fileName', fileName);
    formData.append('fileSize', stats.size);
    formData.append('fileType', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    formData.append('file', binary);
    const options = {
        url: baseUrl + `api/nuggets`,
        method: 'POST',
        headers: {
            'Content-Type': `multipart/form-data;boundary=${formData.getBoundary()}`,
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
        },
        body: formData,
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    const nugget = JSON.parse(body);
                    successLog(
                        `Creating nuggets by Rest API via file = '${fileName}' is successful, id = ${nugget.id}`
                    );
                    console.log(nugget);
                    resolve(nugget.id);
                } else {
                    errorLog(
                        `Creating nuggets by Rest API failed by file = '${fileName}'.
                        Status code: ${response.statusCode}. Message: ${body.message}`
                    );
                    reject(body.message);
                }
            } else {
                errorLog(`Creating nuggets by Rest API file = '${fileName}' failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}

export async function uploadUnstructuredData({ credentials, projectId, folderId, fileUrl, fileName }) {
    groupLog('upload unstructured data to folder by API');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });

    const response = await fetch(fileUrl);
    if (!response.ok) {
        throw new Error(`Failed to download file from URL: ${fileUrl}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const binary = Buffer.from(arrayBuffer);
    if (!fileName) {
        fileName = path.basename(new URL(fileUrl).pathname);
    } else if (!path.extname(fileName)) {
        fileName += path.extname(new URL(fileUrl).pathname);
    }
    const fileExtension = path.extname(fileName).toLowerCase();

    const stats = {
        size: binary.length,
    };

    let fileType;
    switch (fileExtension) {
        case '.pdf':
            fileType = 0;
            break;
        case '.docx':
            fileType = 1;
            break;
        case '.html':
            fileType = 2;
            break;
        case '.md':
            fileType = 3;
            break;
        case '.txt':
            fileType = 4;
            break;
        case '.eml':
            fileType = 5;
            break;
        default:
            throw new Error(`Unsupported file type: ${fileExtension}`);
    }

    const formData = new FormData();
    formData.append('folderId', folderId);
    formData.append('fileName', fileName);
    formData.append('fileSize', stats.size);
    formData.append('fileType', fileType.toString());
    formData.append('file', binary);

    const options = {
        url: `${baseUrl}api/nuggets?type=unstructuredData`,
        method: 'POST',
        headers: {
            'Content-Type': `multipart/form-data;boundary=${formData.getBoundary()}`,
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
            'X-MSTR-ProjectId': projectId,
        },
        body: formData,
    };

    try {
        return new Promise((resolve, reject) => {
            request(options, (error, response, body) => {
                if (error) {
                    console.error('Error uploading file:', error);
                    reject(error);
                } else if (response.statusCode !== 200) {
                    console.error(`Failed to upload file. Status: ${response.statusCode}, Message: ${body}`);
                    reject(new Error(`Failed to upload file. Status: ${response.statusCode}, Message: ${body}`));
                } else {
                    const uploadResponse = JSON.parse(body);
                    console.log('File uploaded successfully:', uploadResponse);
                    resolve(uploadResponse);
                }
            });
        }).finally(async () => {
            await logout({ baseUrl, session });
            groupLogEnd();
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
}

export async function getNuggetsStatus({ session, nuggets }) {
    infoLog('Get nuggets status by API');

    const baseUrl = urlParser(browser.options.baseUrl);
    const options = {
        url: `${baseUrl}api/nuggets/status/query`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
            'X-MSTR-ProjectID': nuggets[0].projectId,
        },
        json: {
            nuggets: nuggets,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    successLog(`Getting nuggets status is successful.`);
                    const responseBody = body.nuggets || [];
                    resolve(responseBody);
                } else {
                    errorLog(`Failed to get nuggets status. Status code: ${response.statusCode}, Message: ${body}`);
                    reject(body);
                }
            } else {
                errorLog(`Error getting nuggets status: ${error}`);
                reject(error);
            }
        });
    });
}

export async function waitForNuggetReady({ credentials, nuggets, timeout = 600000, interval = 10000 }) {
    groupLog('Wait for nuggets to be ready by API');

    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    const startTime = Date.now();
    try {
        while (Date.now() - startTime < timeout) {
            const status = await getNuggetsStatus({ session, nuggets });
            const readyNuggets = status.filter((nugget) => nugget.status === 'ready');

            if (readyNuggets.length === nuggets.length) {
                successLog(`All nuggets are ready.`);
                return readyNuggets;
            }

            console.log(`Waiting for nuggets to be ready... (${readyNuggets.length}/${nuggets.length})`);
            await new Promise((resolve) => setTimeout(resolve, interval));
        }
    } finally {
        await logout({ baseUrl, session });
        groupLogEnd();
    }

    errorLog(`Timeout waiting for nuggets to be ready.`);
    throw new Error('Timeout waiting for nuggets to be ready.');
}
