import request from 'request';
import { successLog, errorLog } from '../../config/consoleFormat.js';
import { WH_UPDATE_HOST, SalesSampleData } from '../../constants/snapshot.js';

export async function resetSalesDataByAPI() {
    await deleteAllSalesDataByAPI();
    await saveSalesDataByAPI(SalesSampleData);
}

export async function saveSalesDataByAPI(data) {
    const option = {
        url: WH_UPDATE_HOST + `api/sales`,
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
                    successLog(`Save sales data in wh is successful.`);
                    resolve();
                } else {
                    errorLog(`Save sales data failed. Status code: ${response.statusCode}. Message: ${body.message}`);
                    reject(body.message);
                }
            } else {
                errorLog(`Save sales data failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}

export async function deleteAllSalesDataByAPI() {
    const option = {
        url: WH_UPDATE_HOST + `api/sales`,
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    return new Promise((resolve, reject) => {
        request(option, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    successLog(`Delete sales data is successful.`);
                    resolve();
                } else {
                    errorLog(`Delete sales data failed. Status code: ${response.statusCode}. Message: ${body.message}`);
                    reject(body.message);
                }
            } else {
                errorLog(`Delete sales data failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}

export async function updateSalesById({ salesId, salesData }) {
    const option = {
        url: WH_UPDATE_HOST + `api/sale/${salesId}`,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        json: salesData,
    };

    return new Promise((resolve, reject) => {
        request(option, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    successLog(`Update sales data by id=${salesId} is successful.`);
                    resolve();
                } else {
                    errorLog(
                        `Update sales data by id=${salesId}, ${salesData} failed. Status code: ${response.statusCode}. Message: ${body.message}`
                    );
                    reject(body.message);
                }
            } else {
                errorLog(`Update sales data by id=${salesId}, ${salesData} failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}

export async function getSalesDataByAPI() {
    const option = {
        url: WH_UPDATE_HOST + `api/sales`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    return new Promise((resolve, reject) => {
        request(option, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    successLog(`Get sales data is successful.`);
                    resolve(JSON.parse(body));
                } else {
                    errorLog(`Get sales data failed. Status code: ${response.statusCode}. Message: ${body.message}`);
                    reject(body.message);
                }
            } else {
                errorLog(`Get sales data failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
