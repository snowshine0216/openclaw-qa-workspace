import users from '../../../../testData/users.json' assert { type: 'json' };
/*
Test environment: EMM team server
Environment URL: https://tec-l-1028813.labs.microstrategy.com:8093/MicroStrategyLibrary
Tomcat, Pingfederate

Run in Local: npm run regression -- --baseUrl=https://tec-l-1028813.labs.microstrategy.com:8093/MicroStrategyLibrary/ --xml=specs/regression/config/Authentication_TrustPing.config.xml --params.loginType=trusted
*/

describe('Trust PingFederate', () => {
    const user1 = users['EMM_trusted_pingFederate'];

    const RSD = {
        name: 'BaseRSD',
    };

    let libraryPage, pingFederateLoginPage, infoWindow, biwebRsdEditablePage;

    beforeEach(async () => {
        ({ libraryPage, pingFederateLoginPage, infoWindow, biwebRsdEditablePage } = browsers.pageObj1);
    });

    it('[TC84535] Trust mode - Seamless login - library to web', async () => {
        await pingFederateLoginPage.login(user1.credentials.username, user1.credentials.password);
        await libraryPage.waitForLibraryLoading();
        await libraryPage.openDossierInfoWindow(RSD.name);
        await since('The presence of edit button is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await infoWindow.isEditIconPresent())
            .toBe(true);
        await infoWindow.clickEditButton();
        await libraryPage.switchToTab(1);
        await biwebRsdEditablePage.waitForRsdLoad();
        let mstrUrl = await libraryPage.currentURL();
        await since('MSTR Web Url').expect(mstrUrl.endsWith('servlet/mstrWeb')).toBe(true);
        await since('Current RSD should be #{expected}, but we get #{actual}')
            .expect(await biwebRsdEditablePage.getDocName())
            .toBe(RSD.name);
        await since('Seamless account should be #{expected}, but we get #{actual}')
            .expect(await biwebRsdEditablePage.getAccountName())
            .toBe('desparzaClient');
    });
});
