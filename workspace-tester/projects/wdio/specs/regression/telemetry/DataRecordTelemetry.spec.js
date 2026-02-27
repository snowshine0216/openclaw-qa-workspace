import { browserWindow } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import * as telemetryInfo from '../../../constants/telemetry.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';

describe(' Test telemetry data recorded for different scenarios', () => {
    let { telemetry, libraryPage, dossierPage, loginPage, paDb, grid } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(telemetryInfo.telemetryUser);
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        await libraryPage.openDefaultApp();
        await libraryPage.switchUser(telemetryInfo.telemetryUser);
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    async function getRowNumber(type = 'Execution') {
        let record;
        if (type === 'Execution') {
            record = await telemetry.getExecutionRecord();
        } else {
            record = await telemetry.getManipulationRecord();
        }
        let jobId = record.JOBID;
        let rowNumber = await paDb.queryTelemetry(telemetryInfo.paDBUrl, { jobId });
        return rowNumber;
    }

    it('[TC84924_01] Test data recorded after clicking on Library Home button', async () => {
        // Prepare expected data in tab 1
        await libraryPage.openDossier(telemetryInfo.callCenterManagementDashboard.name);

        // Click on the Home button to go back to Library Home
        await dossierPage.goToLibrary();
        let rowNumber = await getRowNumber();
        let result = rowNumber >= 1;

        await since(
            'After click on libary Home Button, User Execution count for ' +
                telemetryInfo.callCenterManagementDashboard.name +
                ' should be #{expected}, instead we have #{actual}'
        )
            .expect(result)
            .toBeTruthy();
    });

    it('[TC84924_02] Test data recorded after pressing back button', async () => {
        await libraryPage.openDossier(telemetryInfo.callCenterManagementDashboard.name);

        // Click the browser back button to go to Library Home
        await browser.back();
        await libraryPage.waitForLibraryLoading();

        let rowNumber = await getRowNumber();
        let result = rowNumber >= 1;

        await since(
            'After pressing back button, User Execution count for ' +
                telemetryInfo.callCenterManagementDashboard.name +
                ' should be #{expected}, instead we have #{actual}'
        )
            .expect(result)
            .toBeTruthy();
    });

    it('[TC84924_03] Test data recorded after open dossier from URL', async () => {
        await libraryPage.openDossier(telemetryInfo.callCenterManagementDashboard.name);
        let record = await telemetry.getExecutionRecord();
        let jobId = record.JOBID;

        await libraryPage.openUrl(
            telemetryInfo.callCenterManagementDashboard.project.id,
            telemetryInfo.callCenterManagementDashboard.id
        );
        await dossierPage.waitForDossierLoading();

        let rowNumber = await paDb.queryTelemetry(telemetryInfo.paDBUrl, { jobId });
        let result = rowNumber >= 1;

        await since(
            'After open dashboard from url, User Execution count for ' +
                telemetryInfo.callCenterManagementDashboard.name +
                ' should be #{expected}, instead we have #{actual}'
        )
            .expect(result)
            .toBeTruthy();
    });

    // fail currently
    it('[TC84924_04] Test data recorded after close tab', async () => {
        await libraryPage.switchToNewWindowWithUrl(browser.options.baseUrl);
        await libraryPage.waitForLibraryLoading();
        await libraryPage.openDossier(telemetryInfo.callCenterManagementDashboard.name);
        let jobId = (await telemetry.getExecutionRecord()).JOBID;

        // Close the new tab
        await telemetry.closeTabByScript(1);
        await libraryPage.switchToNewWindowWithUrl(browser.options.baseUrl);
        let rowNumber = await paDb.queryTelemetry(telemetryInfo.paDBUrl, { jobId });

        await since(
            'After close tab, User Execution count for ' +
                telemetryInfo.callCenterManagementDashboard.name +
                ' should be #{expected}, instead we have #{actual}'
        )
            .expect(rowNumber)
            .toEqual(1);
    });

    it('[TC84924_05] Test data recorded after refresh page', async () => {
        await libraryPage.openDossier(telemetryInfo.callCenterManagementDashboard.name);
        let jobId = (await telemetry.getExecutionRecord()).JOBID;

        // Refresh browser page
        await browser.refresh();
        await dossierPage.waitForDossierLoading();

        let rowNumber = await paDb.queryTelemetry(telemetryInfo.paDBUrl, { jobId });
        let result = rowNumber >= 1;
        await since(
            'After close tab, User Execution count for ' +
                telemetryInfo.callCenterManagementDashboard.name +
                ' should be #{expected}, instead we have #{actual}'
        )
            .expect(result)
            .toBeTruthy();
    });

    it('[TC84924_06] Test data recorded after hitting enter in address bar', async () => {
        let url = libraryPage.formUrl(
            telemetryInfo.callCenterManagementDashboard.project.id,
            telemetryInfo.callCenterManagementDashboard.id,
            ''
        );
        await libraryPage.switchToNewWindowWithUrl(url);
        await dossierPage.waitForDossierLoading();

        let jobId = (await telemetry.getExecutionRecord()).JOBID;

        // Navigate to same dossier in address bar
        await browser.url(url);
        await dossierPage.waitForDossierLoading();

        let rowNumber = await paDb.queryTelemetry(telemetryInfo.paDBUrl, { jobId });
        let result = rowNumber >= 1;
        await since(
            'User Execution count for ' +
                telemetryInfo.callCenterManagementDashboard.name +
                'should be #{expected}, instead we have #{actual}'
        )
            .expect(result)
            .toBeTruthy();

        // Close tab 2
        await telemetry.closeTabByScript(1);
    });

    it('[TC84924_07] Test data recorded after session timeout and login', async () => {
        await libraryPage.openDossier(telemetryInfo.selectorDashboard.name);
        let jobId = (await telemetry.getExecutionRecord()).JOBID;

        // Expire user session
        await telemetry.deleteSession();

        // Try to perform a manipulation to force login screen to appear
        await grid.selectGridContextMenuOption({
            title: 'Visualization 1',
            headerName: 'Category',
            firstOption: 'Sort Ascending',
        });

        // Login after timeout
        await loginPage.login(telemetryInfo.telemetryUser);
        let rowNumber = await paDb.queryTelemetry(telemetryInfo.paDBUrl, { jobId });
        let result = rowNumber >= 1;
        await since(
            'User Execution count for ' +
                telemetryInfo.selectorDashboard.name +
                ' should be #{expected}, instead we have #{actual}'
        )
            .expect(result)
            .toBeTruthy();
    });

    it('[TC84927_01] Test multiple execution', async () => {
        let url = libraryPage.formUrl(
            telemetryInfo.callCenterManagementDashboard.project.id,
            telemetryInfo.callCenterManagementDashboard.id,
            ''
        );
        await libraryPage.switchToNewWindowWithUrl(url);
        await dossierPage.waitForDossierLoading();
        let jobId1 = (await telemetry.getExecutionRecord()).JOBID;
        // 3. Open dossier2 in tab3
        url = libraryPage.formUrl(
            telemetryInfo.errorAnalysisDashboard.project.id,
            telemetryInfo.errorAnalysisDashboard.id,
            ''
        );
        await libraryPage.switchToNewWindowWithUrl(url);
        await dossierPage.waitForDossierLoading();
        let jobId2 = (await telemetry.getExecutionRecord()).JOBID;
        // 4. Close tab2&tab3
        await telemetry.closeTabByScript(1);
        await telemetry.closeTabByScript(1);
        // 5. Check the data send to PA thruogh Telemery_Live
        await browser.refresh();
        await libraryPage.waitForLibraryLoading();
        let rowCnt1 = await paDb.queryTelemetry(telemetryInfo.paDBUrl, {
            jobId: jobId1,
            objectId: telemetryInfo.callCenterManagementDashboard.id,
        });

        let rowCnt2 = await paDb.queryTelemetry(telemetryInfo.paDBUrl, {
            jobId: jobId2,
            objectId: telemetryInfo.errorAnalysisDashboard.id,
        });

        await since(
            `User Execution count for ${telemetryInfo.callCenterManagementDashboard.name} should be #{expected}, instead we have #{actual}`
        )
            .expect(rowCnt1)
            .toEqual(2);
        await since(
            `User Execution count for ${telemetryInfo.errorAnalysisDashboard.name} should be #{expected}, instead we have #{actual}`
        )
            .expect(rowCnt2)
            .toEqual(3);
    });

    it('[TC84927_02] Test short/long time execution', async () => {
        await libraryPage.openDefaultApp();
        await libraryPage.openDossier(telemetryInfo.callCenterManagementDashboard.name);
        let jobId1 = (await telemetry.getExecutionRecord()).JOBID;
        // 3. Wait for a long time
        // As for we have timeout=5min for dossier viewing, we don't need to wait that long
        // use 6min to simulate a waiting time for 1h
        const longTime = 1; //6 * 30 * 1000; // min * s * ms
        await dossierPage.sleep(longTime);
        // 4. Back to Home, after long time wait
        await dossierPage.goToLibrary();
        // 5. Open dossier3 in tab 2
        await libraryPage.openDossier(telemetryInfo.errorAnalysisDashboard.name);
        let jobId2 = (await telemetry.getExecutionRecord()).JOBID;
        // 6. Back to Home, as soon as it finishes rendering
        await dossierPage.goToLibrary();
        // 7. Check the data send to PA
        let rowCnt1 = await paDb.queryTelemetry(telemetryInfo.paDBUrl, {
            jobId: jobId1,
            objectId: telemetryInfo.callCenterManagementDashboard.id,
        });
        let rowCnt2 = await paDb.queryTelemetry(telemetryInfo.paDBUrl, {
            jobId: jobId2,
            objectId: telemetryInfo.errorAnalysisDashboard.id,
        });
        await since(
            `User Execution count for ${telemetryInfo.callCenterManagementDashboard.name} should be #{expected}, instead we have #{actual}`
        )
            .expect(rowCnt1)
            .toEqual(1);
        await since(
            `User Execution count for ${telemetryInfo.errorAnalysisDashboard.name} should be #{expected}, instead we have #{actual}`
        )
            .expect(rowCnt2)
            .toEqual(1);
    });
});
