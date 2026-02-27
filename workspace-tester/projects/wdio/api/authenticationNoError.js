import authentication from './authentication.js';
import { errorLog } from '../config/consoleFormat.js';
import chalk from 'chalk';

export default async function authenticationNoError({ baseUrl, authMode, credentials }) {
    try {
        return await authentication({ baseUrl, authMode, credentials });
    } catch (err) {
        errorLog(
            `Authentication skipped for ${chalk.blue(credentials.username)}. Reason: ${err}`
        );

        return {
            token: null,
            cookie: null,
            skipped: true,
        };
    }
}
