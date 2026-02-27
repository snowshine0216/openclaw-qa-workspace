import setWindowSize from '../../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import { browserWindow } from '../../../../constants/index.js';
import * as dossierTXN from '../../../../constants/dossierTXN.js';
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';
import resetDossierState from '../../../../api/resetDossierState.js';

describe('Dossier SQL Transaction X-func', () => {
    let { dossierPage, loginPage, libraryPage, toc } = browsers.pageObj1;
    const dossierConsumption = {
        id: 'B986C574FB44B61E4427DB9323B6017F',
        name: 'DE332213 26.GO_ABPs_Negociacion',
        project: {
            id: dossierTXN.dossierTXNProject.id,
            name: dossierTXN.dossierTXNProject.name,
        },
    };

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await libraryPage.openDefaultApp();
        await loginPage.login(dossierTXN.txnAutoUser);
        await libraryPage.openDossierById({
            projectId: dossierTXN.dossierTXNProject.id,
            dossierId: dossierConsumption.id,
        });
        await libraryPage.waitForCurtainDisappear();
    });

    beforeEach(async () => {
        //Reset the dashboard
        await resetDossierState({ credentials: dossierTXN.txnAutoUser, dossierConsumption });
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC99394_1] Pencil should show correctly when grid header is right aligned or empty', async () => {
        // BCDA-217
        await toc.openPageFromTocMenu({ chapterName: 'Template', pageName: 'Short column size' });
        const headerRowsShort = await $$('div.ag-header-row.ag-header-row-column');
        const headerColumnShort = headerRowsShort[headerRowsShort.length - 1];
        await takeScreenshotByElement(headerColumnShort, 'TC99394_1_1', 'Grid header short column size');

        await toc.openPageFromTocMenu({ chapterName: 'Template', pageName: 'Right align' });
        const headerRowsRight = await $$('div.ag-header-row.ag-header-row-column');
        const headerRightAlign = headerRowsRight[headerRowsRight.length - 1];
        await takeScreenshotByElement(headerRightAlign, 'TC99394_1_2', 'Grid header right align');
    });
});
