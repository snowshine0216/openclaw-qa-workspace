import getAppInstallationId from './getAppInstallationId.js';
import removeApp from './removeApp.js';
import addApp from './addApp.js';
import teamsLogin from './teamsLogin.js';
import teamsLogout from './teamsLogout.js';

export default async function reinstallApp(conversationList) {
    const accessToken = await teamsLogin({
        clientId: browsers.params.clientId,
        tenantId: browsers.params.tenantId,
        clientSecret: browsers.params.clientSecret,
    });
    for (let item of conversationList) {
        let [key, value] = Object.entries(item)[0];
        let appInstallationId = await getAppInstallationId({
            accessToken,
            conversationId: value,
            appName: 'Library',
            type: key,
        });
        console.log('appInstallationId is ' + appInstallationId);
        await removeApp({ accessToken, conversationId: value, appInstallationId, type: key });
        await addApp({
            accessToken,
            conversationId: value,
            appCatalogId: 'fcdd1fd3-322a-45b5-bf51-4ade170f155d',
            type: key,
        });
    }
    await teamsLogout({
        clientId: browsers.params.clientId,
        tenantId: browsers.params.tenantId,
        clientSecret: browsers.params.clientSecret,
        accessToken: accessToken,
    });
}
