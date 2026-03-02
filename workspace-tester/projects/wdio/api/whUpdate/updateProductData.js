import request from 'request';
import { successLog, errorLog } from '../../config/consoleFormat.js';
import { WH_UPDATE_HOST, ProductSampleData } from '../../constants/snapshot.js';

export async function resetProductsDataByAPI() {
    await deleteAllProductDataByAPI();
    await saveProductDataByAPI(ProductSampleData);
}

export async function saveProductDataByAPI(data) {
    const option = {
        url: WH_UPDATE_HOST + `api/products`,
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
                    successLog(`Save product data in wh is successful.`);
                    resolve();
                } else {
                    errorLog(`Save product data failed. Status code: ${response.statusCode}. Message: ${body.message}`);
                    reject(body.message);
                }
            } else {
                errorLog(`Save product data failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}

export async function deleteAllProductDataByAPI() {
    const option = {
        url: WH_UPDATE_HOST + `api/products`,
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    return new Promise((resolve, reject) => {
        request(option, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    successLog(`Delete product data is successful.`);
                    resolve();
                } else {
                    errorLog(
                        `Delete product data failed. Status code: ${response.statusCode}. Message: ${body.message}`
                    );
                    reject(body.message);
                }
            } else {
                errorLog(`Delete product data failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}

export async function updateProductById({ productId, productData }) {
    const option = {
        url: WH_UPDATE_HOST + `api/product/${productId}`,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        json: productData,
    };

    return new Promise((resolve, reject) => {
        request(option, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    successLog(`Update product data by id=${productId} is successful.`);
                    resolve();
                } else {
                    errorLog(
                        `Update sales data by id=${productId}, ${productData} failed. Status code: ${response.statusCode}. Message: ${body.message}`
                    );
                    reject(body.message);
                }
            } else {
                errorLog(`Update sales data by id=${productId}, ${productData} failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}

export async function getProductsDataByAPI() {
    const option = {
        url: WH_UPDATE_HOST + `api/products`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    return new Promise((resolve, reject) => {
        request(option, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    successLog(`Get products data is successful.`);
                    resolve(JSON.parse(body));
                } else {
                    errorLog(`Get products data failed. Status code: ${response.statusCode}. Message: ${body.message}`);
                    reject(body.message);
                }
            } else {
                errorLog(`Get products data failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
