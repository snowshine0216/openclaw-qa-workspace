import urlParser from './urlParser.js';
import { groupLog, groupLogEnd } from '../config/consoleFormat.js';
import allureReporter from '@wdio/allure-reporter';

export default async function libraryLogoutFromTeams() {
    groupLog('logout current library in teams by api');
    const baseUrl = await browser.execute(() => window.location.href.split('app')[0]);
    // Retrieve the iSession token from the browser context
    const iSession = await browser.execute(() => {
        return window.iSession;
    });

    // If the iSession token is not found, log an error and return
    if (!iSession) {
        console.error('No iSession token found. Cannot log out.');
        groupLogEnd();
        return;
    }

    // Construct the logout URL
    const logoutUrl = `${baseUrl}api/auth/logout`;

    // Log the logout attempt
    allureReporter.addStep(`Attempting to log out library in Teams from: ${logoutUrl}`);

    const result = await browser.execute(
        async (logoutUrl, iSession) => {
            try {
                const response = await fetch(logoutUrl, {
                    headers: {
                        'X-MSTR-AuthToken': iSession,
                        'Content-Type': 'application/json',
                    },
                    method: 'POST',
                    credentials: 'include',
                });
                if (response.ok) {
                    return { status: response.status };
                } else {
                    return { status: response.status, error: await response.text() };
                }
            } catch (error) {
                return { error: error.message };
            }
        },
        logoutUrl,
        iSession
    );
    if (result.status === 204) {
        console.log('Logout successful');
    } else {
        console.error('Logout failed with status:', result.status);
        if (result.error) {
            console.error('Error message:', result.error);
        }
    }

    groupLogEnd();
}
