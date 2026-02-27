import request from 'request';
import { errorLog, groupLog, successLog, groupLogEnd } from '../../config/consoleFormat.js';
import urlParser from '../urlParser.js';
import allureReporter from '@wdio/allure-reporter';

export default async function teamsLogin({ clientId, tenantId, clientSecret }) {
    const scope = 'https://graph.microsoft.com/.default';
    const tokenEndpoint = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

    const options = {
        url: tokenEndpoint,
        method: 'POST',
        form: {
            grant_type: 'client_credentials',
            client_id: clientId,
            client_secret: clientSecret,
            scope: scope,
        },
        json: true,
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                const accessToken = body.access_token;
                successLog(`Get Access Token succeeded. statusCode: ${response.statusCode}`);
                resolve(accessToken);
            } else {
                const errorMessage = error || body.error_description || 'Authentication failed.';
                console.error(`Authentication failed. Error: ${errorMessage}`);
                reject(errorMessage);
            }
        });
    });
}
