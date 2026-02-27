import request from 'request';
import chalk from 'chalk';
import { errorLog, successLog } from '../config/consoleFormat.js';

export default async function getXContentTypeOptions(baseUrl, path, method) {
    const url = baseUrl + path;
    const options = {
        url: url,
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200 || response.statusCode === 302) {
                    if (!response.headers['x-content-type-options']) {
                        errorLog(
                            `Get X-Content-Type-Options value failed. X-Content-Type-Options is not found in the ${url}`
                        );
                        reject(`X-Content-Type-Options is not found in the ${url}`);
                    } else {
                        const xContentTypeOptions = response.headers['x-content-type-options'];
                        successLog(`Get X-Content-Type-Options value ${chalk.blue(xContentTypeOptions)} is successful`);
                        resolve(xContentTypeOptions);
                    }
                } else {
                    errorLog(
                        `Get X-Content-Type-Options value failed. Status code: ${response.statusCode}. Message: ${body}`
                    );
                    reject(body);
                }
            } else {
                errorLog(`Get X-Content-Type-Options value failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
