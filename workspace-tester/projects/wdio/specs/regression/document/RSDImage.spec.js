import resetDossierState from '../../../api/resetDossierState.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_RSD') };

describe('RSD_Image', () => {
    const project = {
        id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
        name: 'MicroStrategy Tutorial',
    };

    const document = {
        id: '8488EA944590E5E2147D9DB82C7C3288',
        name: 'RSD image Dossier-to-RSD',
        project,
    };

    const document2 = {
        id: '5968566D47D16BB24F544FA34273E98A',
        name: 'RSD image position & size',
        project,
    };

    const document3 = {
        id: '8CD302584B128C6DCD3BA6B5361B31F8',
        name: 'RSD image source',
        project,
    };

    const document4 = {
        id: '7347DF864B140DAF86CD58BB5D702091',
        name: 'RSD image set as not visible',
        project,
    };

    const document5 = {
        id: '292878564DD59037CE0CCCB3DF2465BC',
        name: 'RSD image link',
        project,
    };

    const document6 = {
        id: '33DBC14F41EE7C15BB2EF487795245D2',
        name: 'RSD image in grid column',
        project,
    };

    const document7 = {
        id: '0211CECC474B8348CC8FA5B9BD9771F6',
        name: 'RSD image in grid row',
        project,
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    const { credentials } = specConfiguration;

    let { loginPage, libraryPage, dossierPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC82241] Validate Image functionality of document by converting a dossier image to RSD', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: document,
        });
        await libraryPage.openDossier(document.name);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC82241', 'converting a dossier image to RSD');
    });

    it('[TC82242] Validate Image functionality of document with different position and size', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: document2,
        });
        await libraryPage.openDossier(document2.name);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC82242', 'different position and size');
    });

    it('[TC82243] Validate Image functionality with different image source', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: document3,
        });
        await libraryPage.openDossier(document3.name);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC82243', 'different image source');
    });

    it('[TC82244] Validate Image functionality of document using image not visible option', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: document4,
        });
        await libraryPage.openDossier(document4.name);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC82244', 'with image not visible option');
    });

    it('[TC82245] Validate Image functionality of document for different links in same and different tab', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: document5,
        });
        await libraryPage.openDossier(document5.name);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC82245_01', 'different links');
        await dossierPage.clickImageLinkByTitle('Image1');
        await dossierPage.switchToTab(1);
        await libraryPage.sleep(2000); // await for page load
        await since('The linkurl should be #{expected}, instead we get #{actual}')
            .expect(await browser.getUrl())
            .toMatch('bing.com');
        await dossierPage.closeTab(1);
        await dossierPage.clickImageLinkByTitle('Image2');
        await dossierPage.switchToTab(1);
        await dossierPage.waitForDossierLoading();
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC82245_02', 'Image with Special Characters');
        await since('The image with special characters should be #{expected}, instead we get #{actual}')
            .expect(await dossierPage.isImagePresent('!@#$%^&*(){}|:\\"<>\\?,./;[]\\\\|'))
            .toEqual(true);
        await dossierPage.closeTab(1);
        await dossierPage.clickImageLinkByTitle('Image3');
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC82245_03', 'Image with Special Characters');
        await since('The image with special characters should be #{expected}, instead we get #{actual}')
            .expect(await dossierPage.isImagePresent('!@#$%^&*(){}|:\\"<>\\?,./;[]\\\\|'))
            .toEqual(true);
        await dossierPage.goBackFromDossierLink();
    });

    it('[TC82246] Validate Image functionality of document using image as attribute display in grid column', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: document6,
        });
        await libraryPage.openDossier(document6.name);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC82246', 'image as attribute display in grid column');
    });

    it('[TC82247] Validate Image functionality of document using image as attribute display in grid row', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: document7,
        });
        await libraryPage.openDossier(document7.name);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC82247', 'image as attribute display in grid row');
    });
});

export const config = specConfiguration;
