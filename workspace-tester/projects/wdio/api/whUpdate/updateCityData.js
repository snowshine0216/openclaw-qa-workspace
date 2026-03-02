import request from 'request';
import { successLog, errorLog } from '../../config/consoleFormat.js';
import { WH_UPDATE_HOST, CitySampleData } from '../../constants/snapshot.js';

export async function resetCityDataByAPI() {
    await deleteAllCityDataByAPI();
    await saveCityDataByAPI(CitySampleData);
}

export async function saveCityDataByAPI(data) {
    const option = {
        url: WH_UPDATE_HOST + `api/cities`,
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
                    successLog(`Save city data in wh is successful.`);
                    resolve();
                } else {
                    errorLog(`Save city data failed. Status code: ${response.statusCode}. Message: ${body.message}`);
                    reject(body.message);
                }
            } else {
                errorLog(`Save city data failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}

export async function deleteAllCityDataByAPI() {
    const option = {
        url: WH_UPDATE_HOST + `api/cities`,
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    return new Promise((resolve, reject) => {
        request(option, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    successLog(`Delete city data is successful.`);
                    resolve();
                } else {
                    errorLog(`Delete city data failed. Status code: ${response.statusCode}. Message: ${body.message}`);
                    reject(body.message);
                }
            } else {
                errorLog(`Delete city data failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}

export async function updateCityById({ cityId, cityData }) {
    const option = {
        url: WH_UPDATE_HOST + `api/city/${cityId}`,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        json: cityData,
    };

    return new Promise((resolve, reject) => {
        request(option, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    successLog(`Update city data by id=${cityId} is successful.`);
                    resolve();
                } else {
                    errorLog(
                        `Update city data by id=${cityId}, ${cityData} failed. Status code: ${response.statusCode}. Message: ${body.message}`
                    );
                    reject(body.message);
                }
            } else {
                errorLog(`Update city data by id=${cityId}, ${cityData} failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}

export async function getCityDataByAPI() {
    const option = {
        url: WH_UPDATE_HOST + `api/cities`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    return new Promise((resolve, reject) => {
        request(option, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    successLog(`Get city data is successful.`);
                    resolve(JSON.parse(body));
                } else {
                    errorLog(`Get city data failed. Status code: ${response.statusCode}. Message: ${body.message}`);
                    reject(body.message);
                }
            } else {
                errorLog(`Get city data failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
