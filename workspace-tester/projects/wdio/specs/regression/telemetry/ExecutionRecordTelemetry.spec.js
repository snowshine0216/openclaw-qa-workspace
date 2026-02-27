import setWindowSize from '../../../config/setWindowSize.js';
import { browserWindow } from '../../../constants/index.js';
import * as telemetryInfo from '../../../constants/telemetry.js';
import * as customApp from '../../../constants/customApp/customAppBody.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';

describe('Test executions record', () => {
    let { loginPage, telemetry, libraryPage, dossierPage, promptEditor } = browsers.pageObj1;
    let customAppId = '';

    beforeAll(async () => {
        await loginPage.login(telemetryInfo.telemetryUser);
        await setWindowSize(browserWindow);
    });

    afterAll(async () => {
        if (customAppId) {
            await deleteCustomAppList({
                credentials: telemetryInfo.telemetryUser,
                customAppIdList: [customAppId],
            });
        }

        await logoutFromCurrentBrowser();
    });

    it('[TC84925_01] Test successful dossier execution', async () => {
        // Execute dossier
        await libraryPage.openDossier(telemetryInfo.selectorDashboard.name);
        await dossierPage.goToLibrary();
        let record = await telemetry.getExecutionRecord();

        await since('Dossier successful execution, STATUS_ID is defined but it should not be')
            .expect(record.STATUS_ID)
            .not.toBeDefined();
    });

    it('[TC84925_02] Test failed dossier execution', async () => {
        await libraryPage.openDossierNoWait(telemetryInfo.failedDashBoard.name);
        await dossierPage.waitForLibraryLoading();
        await dossierPage.dismissError();
        let record = await telemetry.getExecutionRecord();

        await since('Dossier user execution, STATUS_ID should be #{expected}, instead we have #{actual}')
            .expect(record.STATUS_ID)
            .toEqual(-1);
    });

    // todo: this test is not working as expected
    it('[TC84925_03] Test aborted dossier execution', async () => {
        await libraryPage.openDossierNoWait(telemetryInfo.autoAdoptionDashBoard.name);
        await libraryPage.sleep(2000);

        // Go back to Library Home before dossier finishes executing
        await browser.back();
        await libraryPage.waitForLibraryLoading();
        let record = await telemetry.getExecutionRecord();

        await since('Dossier user execution, STATUS_ID should be #{expected}, instead we have #{actual}')
            .expect(record.STATUS_ID)
            .toEqual(-1);
    });

    it('[TC84926_01] Test prompted case', async () => {
        await libraryPage.openDossier(telemetryInfo.selectorDashboard.name);
        let record = await telemetry.getExecutionRecord();
        await since('Dossier without prompt, PROMPTIND should be #{expected}, instead we have #{actual}')
            .expect(record.PROMPTIND)
            .toEqual(0);
        await dossierPage.goToLibrary();

        await libraryPage.openDossier(telemetryInfo.promptDashBoard.name);
        await promptEditor.waitForEditor();
        record = await telemetry.getExecutionRecord();
        await since('Dossier without prompt, PROMPTIND should be #{expected}, instead we have #{actual}')
            .expect(record.PROMPTIND)
            .toEqual(1);
        await browser.back();
    });

    it('[TC84926_02] Test cached case', async () => {
        // Test dossier not cached
        await libraryPage.openDossier(telemetryInfo.noCachedDashBoard.name);
        let record = await telemetry.getExecutionRecord();
        await since('Execute a fresh Dossier, CACHEIND should be #{expected}, instead we have #{actual}')
            .expect(record.CACHEIND)
            .toEqual(0);
        await dossierPage.goToLibrary();

        // Test dossier cached
        // Execute the dossier once to generate a cache
        await libraryPage.openDossier(telemetryInfo.selectorDashboard.name);
        await dossierPage.goToLibrary();
        await libraryPage.openDossier(telemetryInfo.selectorDashboard.name);
        record = await telemetry.getExecutionRecord();
        await since('Execute a cached Dossier, CACHEIND should be #{expected}, instead we have #{actual}')
            .expect(record.CACHEIND)
            .toEqual(1);
    });

    it('[TC84926_03] Test custom app', async () => {
        // create custom app
        let libraryHomeBody = customApp.getCustomAppBody({
            version: 'v1',
            name: 'autoLibraryHomeUserPreference',
        });
        customAppId = await createCustomApp({
            credentials: telemetryInfo.telemetryUser,
            customAppInfo: libraryHomeBody,
        });

        await libraryPage.openCustomAppById({ id: customAppId });
        await libraryPage.openDossier(telemetryInfo.selectorDashboard.name);
        let record = await telemetry.getExecutionRecord();
        await since('Execute a fresh Dossier, CACHEIND should be #{expected}, instead we have #{actual}')
            .expect(record.CUSTOMID)
            .toEqual(customAppId);
    });
});
