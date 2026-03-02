import request from 'request';
import { errorLog, groupLog, successLog, groupLogEnd } from '../../config/consoleFormat.js';
import allureReporter from '@wdio/allure-reporter';

export default async function teamsLogout({ clientId, tenantId, clientSecret, accessToken }) {
    const logoutEndpoint = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/logout`;

    const options = {
        url: logoutEndpoint,
        method: 'POST',
        form: {
            client_id: clientId,
            client_secret: clientSecret,
            post_logout_redirect_uri: 'https://teams.microsoft.com',
            accessToken: accessToken,
        },
        json: true,
    };
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                successLog('Teams API Logout successful.');
                resolve();
            } else {
                const errorMessage = error || body.error_description || 'Authentication failed.';
                console.error(`Authentication failed. Error: ${errorMessage}`);
                reject(errorMessage);
            }
        });
    });
}
