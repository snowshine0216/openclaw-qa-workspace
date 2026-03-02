import request from 'request';
import { errorLog, successLog } from '../../../config/consoleFormat.js';

// const libraryVersion = global.buildVersion;

export default async function postInstructionResultAPI({ buildNumber, hashKey, result, similarity }) {
    let updateInfo = {
        hash_key: hashKey,
        result: result,
        similarity: similarity,
        build_no: buildNumber,
        library_version: global.buildVersion,
    };
    const options = {
        url: 'http://10.23.35.208:8074/bot/result',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        json: updateInfo,
    };
    console.log(
        `[INFO] Calling postInstructionResultAPI() to post instruction result data to db, parameters: ${JSON.stringify(
            updateInfo
        )} `
    );

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 204) {
                    successLog(`Update Test Result Success.`);
                    resolve();
                } else {
                    errorLog(`Update Test Result  failed. Status code: ${response.statusCode}.`);
                    reject(body);
                }
            } else {
                errorLog(`Update Test Result ,Request failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
