import { apiSessions } from '../../../../api/getSessions.js';
import restoreSession from '../../../../api/restoreSession.js';
import authentication from '../../../../api/authentication.js';
import urlParser from '../../../../api/urlParser.js';
import logout from '../../../../api/logout.js';
import deleteUserConnections from '../../../../api/deleteUserConnections.js';
import users from '../../../../testData/users.json' assert { type: 'json' };

describe('POST /api/auth/restore API Test', () => {
    const mstrUser = {
        username: browser.options.params.credentials.username,
        password: browser.options.params.credentials.password,
    };

    const standardUser = users['EMM_standard'];

    const baseUrl = urlParser(browser.options.baseUrl);

    let session = null;
    let session_standard = null;

    beforeEach(async () => {
        session_standard = await authentication({ baseUrl, authMode: 1, credentials: standardUser.credentials });
        session = await authentication({ baseUrl, authMode: 1, credentials: mstrUser });
    });

    afterEach(async () => {
        await logout({ baseUrl, session });
    });

    describe('Session Restoration Tests', () => {
        it('[BCSA-2933_1] should return 204 and original session id', async () => {
            console.log('🚀 Restore session API test BCSA-2933_1 is running...');

            const sessionsInfo = await apiSessions({ baseUrl, session, includeConnectionInfo: true });
            await expect(sessionsInfo.userConnections).toBeDefined();
            await expect(sessionsInfo.userConnections.length).toBeGreaterThan(0);

            const originalSessionId = sessionsInfo.userConnections[0].sessionId;
            const base64EncodedServerName = sessionsInfo.userConnections[0].id.split(':')[2];
            const serverName = Buffer.from(base64EncodedServerName, 'base64').toString('utf-8');

            const restoredSession = await restoreSession({
                baseUrl,
                sessionId: originalSessionId,
                server: serverName,
                port: 0,
            });

            const restoredSessionInfo = await apiSessions({ baseUrl, session: restoredSession, includeConnectionInfo: true });
            await expect(restoredSessionInfo.userConnections).toBeDefined();
            await expect(restoredSessionInfo.userConnections.length).toBeGreaterThan(0);
            
            const restoredSessionId = restoredSessionInfo.userConnections[0].sessionId;
            await expect(restoredSessionId).toBe(originalSessionId);

            console.log('✅ Restore session API test BCSA-2933_1 is passed.');
        });

        it('[BCSA-2933_2] should return 401 when session has been deleted', async () => {
            console.log('🚀 Restore session API test BCSA-2933_2 is running...');
            console.log('session_standard:', session_standard);

            const sessionsInfo = await apiSessions({ baseUrl, session: session_standard, includeConnectionInfo: true });
            await expect(sessionsInfo.userConnections).toBeDefined();
            await expect(sessionsInfo.userConnections.length).toBeGreaterThan(0);
            console.log('++++:', sessionsInfo);

            const originalSessionId = sessionsInfo.userConnections[0].sessionId;
            const originalId = sessionsInfo.userConnections[0].id;
            const base64EncodedServerName = sessionsInfo.userConnections[0].id.split(':')[2];
            const serverName = Buffer.from(base64EncodedServerName, 'base64').toString('utf-8');

            const restoredSession = await restoreSession({
                baseUrl,
                sessionId: originalSessionId,
                server: serverName,
                port: 0,
            });

            const restoredSessionInfo = await apiSessions({
                baseUrl,
                session: restoredSession,
                includeConnectionInfo: true,
            });
            await expect(restoredSessionInfo.userConnections).toBeDefined();
            await expect(restoredSessionInfo.userConnections.length).toBeGreaterThan(0);

            const restoredSessionId = restoredSessionInfo.userConnections[0].sessionId;
            await expect(restoredSessionId).toBe(originalSessionId);
            console.log('✅ Restore session API test BCSA-2933_2 is passed.', restoredSessionId);

            // Delete auto user's connection using mstr user's session
            console.log('Deleting user connection with originalId:', originalId);
            await deleteUserConnections(baseUrl, session, originalId);

            // Try to restore the deleted session and expect 401 error
            console.log('Attempting to restore deleted session, expecting 401 error...');
            let errorCaught = false;
            let errorBody = null;
            
            try {
                const restoredSession_second = await restoreSession({
                    baseUrl,
                    sessionId: originalSessionId,
                    server: serverName,
                    port: 0,
                });
                // If no error is thrown, the test should fail
                console.log('❌ Expected 401 error but restore succeeded');
            } catch (error) {
                errorCaught = true;
                // error could be the body object or Error object
                errorBody = error;
                console.log('Received error:', JSON.stringify(error, null, 2));
            }
            
            // Verify that an error was caught
            await expect(errorCaught).toBe(true);
            
            // Check if error contains the expected 401 error information
            const errorString = JSON.stringify(errorBody);
            console.log('Error string for validation:', errorString);
            
            // Verify the error contains ERR009 code (session closed/timed out)
            await expect(errorString).toContain('ERR001');
            await expect(errorBody.message || errorBody.toString()).toContain(
                'It might have been closed by the user or by Administrator, or it has exceeded max idle time.'
            );
            console.log('✅ Correctly received 401 error when restoring deleted session');
            console.log('✅ Restore session API test BCSA-2933_2 is passed.');
        });
    });
});
