import resetDossierState from '../../../api/resetDossierState.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_RSD') };

describe('RSD_Threshold', () => {
    const project = {
        id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
        name: 'MicroStrategy Tutorial',
    };

    const document = {
        id: '18E26D7A4C6557F8B850F5B44109E7C9',
        name: 'Document with simple thresholding',
        project,
    };

    const document2 = {
        id: '833491E84475903F8B187B9E89CC52FB',
        name: 'Document with simple thresholding_threshold off',
        project,
    };

    const document3 = {
        id: '319EE9394EB382CC0B104BB0A2423703',
        name: 'Document with complex thresholding_threshold off',
        project,
    };

    const document4 = {
        id: '70AED45C4B579B102CA75FAB417D70AE',
        name: 'TC6783 Doc',
        project,
    };

    const document5 = {
        id: '1C52EFF646ADA6791A56669A413A7328',
        name: 'TC6783 Doc 2',
        project,
    };

    const document6 = {
        id: '17B271794EA3D97889C1A88A697518C9',
        name: 'TC6974 Doc',
        project,
    };

    const document7 = {
        id: '9E5754BB4134392951F370B10F8FB3FF',
        name: 'TC6974 Doc_row header not merged',
        project,
    };

    const document8 = {
        id: '2A00F4AE42051D07269DBF891BD85A12',
        name: 'DE189270',
        project,
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    const { credentials } = specConfiguration;

    let { loginPage, libraryPage, transactionPage, dossierPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC82259] Validate Simple Threshold on Documents with Threshold on', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: document,
        });
        await libraryPage.openDossier(document.name);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC82259', 'Simple Threshold');
    });

    it('[TC82260] Validate Simple Threshold on Documents with Threshold off', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: document2,
        });
        await libraryPage.openDossier(document2.name);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC82260', 'Simple Threshold-off');
    });

    it('[TC82261] Validate Complex Threshold on Documents with Threshold off', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: document3,
        });
        await libraryPage.openDossier(document3.name);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC82261', 'Complex Threshold-off', { tolerance: 0.4 });
    });

    it('[TC82262] Validate Threshold on attribute column applies correctly for Document', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: document4,
        });
        await resetDossierState({
            credentials: credentials,
            dossier: document5,
        });
        await libraryPage.openDossier(document4.name);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC82262_01', 'Threshold on attribute column');
        await dossierPage.goToLibrary();
        await libraryPage.openDossier(document5.name);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC82262_02', 'Threshold on attribute column');
    });

    it('[TC82263] Validate Threshold format displays correctly in merged and unmerged rows for documents', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: document6,
        });
        await resetDossierState({
            credentials: credentials,
            dossier: document7,
        });
        await libraryPage.openDossier(document6.name);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC82263_01', 'merged rows');
        await dossierPage.goToLibrary();
        await libraryPage.openDossier(document7.name);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC82263_02', 'unmerged rows');
    });

    it('[TC82263_02] Validate image in grid threshold displays correctly', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: document8,
        });
        await libraryPage.openDossier(document8.name);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC82263_03', 'DE189270-image in gird threshold');
        await transactionPage.groupBy.changeGroupBy('Oct 2016');
        await dossierPage.waitForDossierLoading();
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC82263_04', 'DE189270-change group by ');
    });
});

export const config = specConfiguration;
