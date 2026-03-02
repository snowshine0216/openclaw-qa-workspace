import request from 'request';
import { successLog, errorLog } from '../../config/consoleFormat.js';
import { WH_UPDATE_HOST } from '../../constants/snapshot.js';

export async function replaceCubeDataByAPI(data) {
    const option = {
        url: WH_UPDATE_HOST + `api/cube/reset`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        json: data,
    };

    return new Promise((resolve, reject) => {
        request(option, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    successLog(`Reset cube data is successful.`);
                    resolve();
                } else {
                    errorLog(`Reset cube data failed. Status code: ${response.statusCode}. Message: ${body.message}`);
                    reject(body.message);
                }
            } else {
                errorLog(`Reset cube data failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}

export async function appendCubeDataByAPI(data) {
    const option = {
        url: WH_UPDATE_HOST + `api/cube/append`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        json: data,
    };

    return new Promise((resolve, reject) => {
        request(option, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    successLog(`Append cube data is successful.`);
                    resolve();
                } else {
                    errorLog(`Append cube data failed. Status code: ${response.statusCode}. Message: ${body.message}`);
                    reject(body.message);
                }
            } else {
                errorLog(`Append cube data failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
