import resetDossierState from '../../../api/resetDossierState.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_RSD') };

describe('RSD_Text', () => {
    const project = {
        id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
        name: 'MicroStrategy Tutorial',
    };

    const document = {
        id: '9942D86843EB9CABF64A569BA370231F',
        name: 'TextBox with different Color border and Font',
        project,
    };

    const document2 = {
        id: 'E6E29554481958B1AA5D06919091A3AA',
        name: 'document with text box using different alignment',
        project,
    };

    const document3 = {
        id: 'BDBEB34946240734E0D02F8822AFE0FD',
        name: 'TC82225',
        project,
    };
    const document4 = {
        id: '8E4B8EB84D464BED7661D79F26C97482',
        name: 'document with text box on info window and hyperlink-library',
        project,
    };
    const document5 = {
        id: '4C685A04484EB5D4C58A65866CA76550',
        name: 'document with text box on info window',
        project,
    };
    const document6 = {
        id: 'DB5409844E3C5E3CF0E5769765DA11AA',
        name: 'document with Text Box using different gradient Effects',
        project,
    };
    const document7 = {
        id: '5227BDE243922BAFE11F029C80423938',
        name: 'Document with Text Box Conditional format',
        project,
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    const { credentials } = specConfiguration;

    let { loginPage, libraryPage, dossierPage, rsdGrid } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC82223] Validate TextBox with different Color border and Font', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: document,
        });
        await libraryPage.openDossier(document.name);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC82223', 'different Color border and Font');
    });

    it('[TC82224] Validate TextBox using different alignment', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: document2,
        });
        await libraryPage.openDossier(document2.name);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC82224', 'different alignment');
    });

    it('[TC82225] Validate TextBox when data is empty', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: document3,
        });
        await libraryPage.openDossier(document3.name);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC82225', 'when data is empty');
    });

    it('[TC82226] Validate TextBox on info window and hyperlink', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: document4,
        });
        await libraryPage.openDossier(document4.name);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC82226', 'with hyperlink');
        await dossierPage.clickTextfieldByTitle('open in same window');
        let grid = rsdGrid.getRsdGridByKey('K44');
        await since('The first 4 cells of the 3rd row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid.selectCellInOneRow(3, 1, 4))
            .toEqual(['Books', '$510,239', '$650,192', '$681,179']);
        await dossierPage.goBackFromDossierLink();
        await dossierPage.clickTextfieldByTitle('open in different window');
        await dossierPage.switchToTab(1);
        await dossierPage.waitForDossierLoading();
        grid = rsdGrid.getRsdGridByKey('K44');
        await since('The first 4 cells of the 3rd row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid.selectCellInOneRow(3, 1, 4))
            .toEqual(['Books', '$510,239', '$650,192', '$681,179']);
        await dossierPage.closeTab(1);
    });

    it('[TC82227] Validate Info Window from TextBox', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: document5,
        });
        await libraryPage.openDossier(document5.name);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC82227', 'with info window');
        await dossierPage.clickTextfieldByTitle('TEXT');
        const grid = rsdGrid.getRsdGridByKey('W181');
        await grid.clickCell('Central');
        await dossierPage.waitForDossierLoading();
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC82227', 'trigger info window');
    });

    it('[TC82228] Validate TextBox using different gradient Effects', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: document6,
        });
        await libraryPage.openDossier(document6.name);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC82228', 'using different gradient Effects');
    });

    it('[TC82229] Validate TextBox with Conditional format', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: document7,
        });
        await libraryPage.openDossier(document7.name);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC82229', 'with Conditional format');
    });
});

export const config = specConfiguration;
