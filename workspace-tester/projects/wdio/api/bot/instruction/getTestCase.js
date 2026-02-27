import request from 'request';
import { errorLog, successLog } from '../../../config/consoleFormat.js';

export default async function getInstructionTestCaseAPI() {
    const options = {
        url: 'http://10.23.35.208:8074/bot/instruction',
        method: 'GET',
        headers: {
            Accept: 'application/json', // accpet JSON format response
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    successLog(`Received Test Case`);
                    try {
                        const data = JSON.parse(body);
                        resolve(data);
                    } catch (parseError) {
                        errorLog(`Error parsing JSON: ${parseError}`);
                        reject(parseError);
                    }
                } else {
                    errorLog(`Request failed. Status code: ${response.statusCode}. Message: ${body}`);
                    reject(body);
                }
            } else {
                errorLog(`Request failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
