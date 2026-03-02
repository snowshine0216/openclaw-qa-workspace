import request from 'request';
import { errorLog, successLog } from '../../config/consoleFormat.js';

/**
 * Create OIDC configuration if missing
 * @param {Object} params - Parameters object
 * @param {string} params.baseUrl - Base URL for the API
 * @param {Object} params.session - Session object with token and cookie
 * @param {Object} params.config - OIDC configuration object to create
 * @returns {Promise<Object>} Created OIDC configuration object
 */
export async function createOIDCConfig({ baseUrl, session, config }) {
    return new Promise((resolve, reject) => {
        request(
            {
                url: `${baseUrl}api/mstrClients/auth/oidc/iams`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-MSTR-AuthToken': session.token,
                    Cookie: session.cookie,
                },
                body: JSON.stringify(config),
            },
            (error, response, body) => {
                if (!error) {
                    if (response.statusCode === 200 || response.statusCode === 201) {
                        successLog('OIDC config created successfully');
                        resolve(JSON.parse(body));
                    } else {
                        errorLog(`Failed to create OIDC config. Status: ${response.statusCode}. Message: ${body}`);
                        reject({ statusCode: response.statusCode, message: body });
                    }
                } else {
                    errorLog(`Error creating OIDC config: ${error}`);
                    reject(error);
                }
            }
        );
    });
}

/**
 * Get OIDC configuration by config ID
 * @param {Object} params - Parameters object
 * @param {string} params.baseUrl - Base URL for the API
 * @param {Object} params.session - Session object with token and cookie
 * @param {string} params.configId - OIDC configuration ID
 * @returns {Promise<Object>} OIDC configuration object
 */
export async function getOIDCConfig({ baseUrl, session, configId }) {
    const options = {
        url: `${baseUrl}api/mstrClients/auth/oidc/iams/${configId}`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': session.token,
            Cookie: session.cookie,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    const config = JSON.parse(body);
                    successLog('OIDC config retrieved successfully');
                    resolve(config);
                } else {
                    errorLog(`Failed to get OIDC config. Status: ${response.statusCode}. Message: ${body}`);
                    reject({ statusCode: response.statusCode, message: body });
                }
            } else {
                errorLog(`Error getting OIDC config: ${error}`);
                reject(error);
            }
        });
    });
}

/**
 * Update OIDC configuration
 * @param {Object} params - Parameters object
 * @param {string} params.baseUrl - Base URL for the API
 * @param {Object} params.session - Session object with token and cookie
 * @param {string} params.configId - OIDC configuration ID
 * @param {Object} params.config - OIDC configuration object to update
 * @returns {Promise<boolean>} True if update successful
 */
export async function updateOIDCConfig({ baseUrl, session, configId, config }) {
    const options = {
        url: `${baseUrl}api/mstrClients/auth/oidc/iams/${configId}`,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': session.token,
            Cookie: session.cookie,
        },
        body: JSON.stringify(config),
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200 || response.statusCode === 204) {
                    successLog('OIDC config updated successfully');
                    resolve(true);
                } else {
                    errorLog(`Failed to update OIDC config. Status: ${response.statusCode}. Message: ${body}`);
                    reject({ statusCode: response.statusCode, message: body });
                }
            } else {
                errorLog(`Error updating OIDC config: ${error}`);
                reject(error);
            }
        });
    });
}

/**
 * Delete OIDC configuration by config ID
 * @param {Object} params - Parameters object
 * @param {string} params.baseUrl - Base URL for the API
 * @param {Object} params.session - Session object with token and cookie
 * @param {string} params.configId - OIDC configuration ID
 * @returns {Promise<boolean>} True if deletion successful
 */
export async function deleteOIDCConfig({ baseUrl, session, configId }) {
    const options = {
        url: `${baseUrl}api/mstrClients/auth/oidc/iams/${configId}`,
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': session.token,
            Cookie: session.cookie,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200 || response.statusCode === 204) {
                    successLog('OIDC config deleted successfully');
                    resolve(true);
                } else {
                    errorLog(`Failed to delete OIDC config. Status: ${response.statusCode}. Message: ${body}`);
                    reject({ statusCode: response.statusCode, message: body });
                }
            } else {
                errorLog(`Error deleting OIDC config: ${error}`);
                reject(error);
            }
        });
    });
}
