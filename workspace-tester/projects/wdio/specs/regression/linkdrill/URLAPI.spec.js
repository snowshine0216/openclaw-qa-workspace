import { customCredentials } from '../../../constants/index.js';

const specConfiguration = { ...customCredentials('_LD') };

describe('URLAPI', () => {
    const rsd = {
        id: 'A8D0A15A4E3F80D731FE889F692EBDAF',
        name: 'Source with relative path',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const { credentials } = specConfiguration;

    let { loginPage, adminPage, dossierPage, libraryPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        // set web url firstly on library admin page
        await adminPage.openAdminPage();
        await adminPage.chooseTab('Library Server');
        await adminPage.inputMicroStrategyWebLink(browsers.params.mstrWebUrl);
        await adminPage.clickSaveButton();
        await adminPage.clickLaunchButton();
        await adminPage.switchToTab(1);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    afterAll(async () => {
        await libraryPage.switchToTab(0);
        await adminPage.inputMicroStrategyWebLink('');
        await adminPage.clickSaveButton();
        await adminPage.switchToTab(1);
    });

    it('[TC78915] validate multiple links to different targets with default one on Library RSD', async () => {
        const baseUrl = browsers.params.mstrWebUrl.split('servlet')[0];
        let target = baseUrl + 'images/balloonpp_red.png';
        // tap link with image relative path .
        await libraryPage.openDossier(rsd.name);
        await dossierPage.waitForDossierLoading();
        await dossierPage.clickTextfieldByTitle('image relative path with .');
        await adminPage.switchToTab(2);
        since('The target url should be #{expected}, instead we have #{actual}')
            .expect(await browser.getUrl())
            .toEqual(target);
        await adminPage.switchToTab(1);
        await dossierPage.closeTab(2);

        // tap link with image relative path ..
        await dossierPage.clickTextfieldByTitle('image relative path with ..');
        await adminPage.switchToTab(2);
        since('The target url should be #{expected}, instead we have #{actual}')
            .expect(await browser.getUrl())
            .toEqual(target);
        await adminPage.switchToTab(1);
        await dossierPage.closeTab(2);

        // tap link with image relative path
        await dossierPage.clickTextfieldByTitle('image relative path');
        await adminPage.switchToTab(2);
        since('The target url should be #{expected}, instead we have #{actual}')
            .expect(await browser.getUrl())
            .toEqual(target);
        await adminPage.switchToTab(1);
        await dossierPage.closeTab(2);

        // tap link with text relative path
        target = baseUrl + 'winky/test.txt';
        await dossierPage.clickTextfieldByTitle('text relative path with ..');
        await adminPage.switchToTab(2);
        since('The target url should be #{expected}, instead we have #{actual}')
            .expect(await browser.getUrl())
            .toEqual(target);
        await adminPage.switchToTab(1);
        await dossierPage.closeTab(2);

        // tap link with excel relative path
        target = baseUrl + 'winky/test.xlsx';
        await dossierPage.clickTextfieldByTitle('excel relative path with ..');
        await adminPage.switchToTab(2);
        since('The target url should be #{expected}, instead we have #{actual}')
            .expect(await browser.getUrl())
            .toEqual(target);
        await adminPage.switchToTab(1);
        await dossierPage.closeTab(2);

        // tap link with pdf relative path
        target = baseUrl + 'winky/test.pdf';
        await dossierPage.clickTextfieldByTitle('pdf relative path with ..');
        await adminPage.switchToTab(2);
        since('The target url should be #{expected}, instead we have #{actual}')
            .expect(await browser.getUrl())
            .toEqual(target);
        await adminPage.switchToTab(1);
        await dossierPage.closeTab(2);
    });

    it('[TC78916] validate multiple links to different targets with default one on Library RSD', async () => {
        // tap link with image relative path .
        await libraryPage.openDossier(rsd.name);
        await dossierPage.waitForDossierLoading();
        await dossierPage.clickTextfieldByTitle('absolutely path');
        await adminPage.switchToTab(2);
        since('The target url should be #{expected}, instead we have #{actual}')
            .expect(await browser.getUrl())
            .toEqual('https://hanw16111-test.labs.microstrategy.com:8443/MicroStrategyUP6/images/balloonpp_red.png');
        await adminPage.switchToTab(1);
        await dossierPage.closeTab(2);
    });
});
export const config = specConfiguration;
