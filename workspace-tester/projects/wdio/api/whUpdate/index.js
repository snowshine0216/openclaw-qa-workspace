/**
 * Details about update WH API, refer to confluence page:
 * https://microstrategy.atlassian.net/wiki/spaces/TPAC/pages/4697139706/Test+Preparation
 */

import { resetCityDataByAPI, saveCityDataByAPI, updateCityById, getCityDataByAPI } from './updateCityData.js';
import { resetSalesDataByAPI, saveSalesDataByAPI, updateSalesById, getSalesDataByAPI } from './updateSalesData.js';
import {
    resetProductsDataByAPI,
    saveProductDataByAPI,
    updateProductById,
    getProductsDataByAPI,
} from './updateProductData.js';
import { replaceCubeDataByAPI, appendCubeDataByAPI } from './updateCube.js';

export {
    resetCityDataByAPI,
    saveCityDataByAPI,
    updateCityById,
    getCityDataByAPI,
    resetSalesDataByAPI,
    saveSalesDataByAPI,
    updateSalesById,
    getSalesDataByAPI,
    resetProductsDataByAPI,
    saveProductDataByAPI,
    updateProductById,
    getProductsDataByAPI,
    replaceCubeDataByAPI,
    appendCubeDataByAPI,
};
