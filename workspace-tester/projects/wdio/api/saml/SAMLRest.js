import request from 'request';
import authentication from '../authentication.js';
import urlParser from '../urlParser.js';
import { errorLog, successLog } from '../../config/consoleFormat.js';

const SP_METADATA_URL = '/api/mstrClients/auth/saml/spmetadata';
const SP_CONFIG_URL = '/api/mstrClients/auth/saml/mstrSamlConfig';
const REGISTRATIONS_URL = '/api/mstrClients/auth/saml/registrations';
const REGISTRATION_SP_CONFIG_URL = '/api/mstrClients/auth/saml/registrations/#id';

// Helper function to make HTTP requests
const makeRequest = ({ url, method, session, body = null, successCodes = [200] }) => {
    const options = {
        url,
        method,
        headers: {
            'Content-Type': 'application/json',
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
        },
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    return new Promise((resolve, reject) => {
        request(options, (error, response, responseBody) => {
            if (error) {
                errorLog(`Request failed. Error: ${error}`);
                reject(error);
                return;
            }

            if (successCodes.includes(response.statusCode)) {
                resolve({
                    statusCode: response.statusCode,
                    body: responseBody || '',
                });
            } else {
                errorLog(`Request failed. Status code: ${response.statusCode}. Message: ${responseBody}`);
                reject({
                    statusCode: response.statusCode,
                    message: responseBody,
                });
            }
        });
    });
};

// Obtain a session using standard login
export async function getSession(userCredentials) {
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials: userCredentials });
    return session;
}

// Get the Server Level SAML configuration
export async function getServerLevelSAMLConfig({ baseUrl, session }) {
    successLog('Getting server level SAML config');
    return makeRequest({
        url: baseUrl + SP_CONFIG_URL,
        method: 'GET',
        session,
    });
}

// Update the Server Level SAML configuration
export async function setServerLevelSAMLConfig({ baseUrl, session, samlConfig }) {
    successLog('Setting server level SAML config');
    return makeRequest({
        url: baseUrl + SP_METADATA_URL,
        method: 'PUT',
        session,
        body: samlConfig,
        successCodes: [200, 204],
    });
}

// Create the App Level SAML configuration
export async function createAppLevelSAMLConfig({ baseUrl, session, samlConfig }) {
    successLog('Creating app level SAML config');
    return makeRequest({
        url: baseUrl + REGISTRATIONS_URL,
        method: 'POST',
        session,
        body: samlConfig,
        successCodes: [200, 204],
    });
}

// Get the App Level SAML configuration
export async function getAppLevelSAMLConfig({ baseUrl, session, id }) {
    successLog('Getting app level SAML config');
    return makeRequest({
        url: baseUrl + REGISTRATION_SP_CONFIG_URL.replace('#id', id),
        method: 'GET',
        session,
    });
}

// Update the App Level SAML configuration
export async function updateAppLevelSAMLConfig({ baseUrl, session, id, samlConfig }) {
    successLog('Updating app level SAML config');
    return makeRequest({
        url: baseUrl + REGISTRATION_SP_CONFIG_URL.replace('#id', id),
        method: 'PUT',
        session,
        body: samlConfig,
        successCodes: [200, 204],
    });
}

// Delete the App Level SAML configuration
export async function deleteAppLevelSAMLConfig({ baseUrl, session, id }) {
    successLog('Deleting app level SAML config');
    return makeRequest({
        url: baseUrl + REGISTRATION_SP_CONFIG_URL.replace('#id', id),
        method: 'DELETE',
        session,
        successCodes: [200, 204],
    });
}
