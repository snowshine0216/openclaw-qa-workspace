import setWindowSize from '../../../config/setWindowSize.js';
import * as reportConstants from '../../../constants/report.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { browserWindow } from '../../../constants/index.js';

describe('Report Editor Menubar', () => {
    let {
        loginPage,
        reportPage,
        reportMenubar,
        reportEditorPanel,
        reportDatasetPanel,
        reportFilterPanel,
        reportFormatPanel,
        libraryPage,
        dossierPage,
    } = browsers.pageObj1;

    beforeEach(async () => {
        if (!(await loginPage.isLoginPageDisplayed())) {
            await browser.url(new URL('auth/ui/loginPage', browser.options.baseUrl).toString(), 100000);
        }
        await loginPage.login(reportConstants.reportUser);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC85654] Test report menubar', async () => {
        // Step 1: Create a new report
        await libraryPage.createNewReportByUrl({});

        // Step 2: Open "File" in menubar
        await reportMenubar.clickMenuItem('File');

        // Step 3: Take a screenshot for File dropdown as "Options under File"
        await takeScreenshotByElement(await reportMenubar.getDropdownMenu(), 'TC85654_01', 'Options under File');
        await reportMenubar.clickMenuItem('File');

        // Step 4: Select folder "Schema Objects", "Attributes", "Time" in object list in Report Editor
        await reportDatasetPanel.selectMultipleItemsInObjectList(['Schema Objects', 'Attributes', 'Time']);

        // Step 5: Add the object "Year" to Page-by from Object Browser in Report Editor
        await reportDatasetPanel.addObjectToPageBy('Year');

        // Step 6: Take a screenshot for editor panel
        await takeScreenshotByElement(reportEditorPanel.EditorPanel, 'TC85654_02', 'Editor Panel');

        await reportMenubar.clickMenuItem('View');
        await takeScreenshotByElement(await reportMenubar.getDropdownMenu(), 'TC85654_03', 'Options under View');
        await reportMenubar.clickMenuItem('View');

        // Step 7: Select "Objects Panel" from "View" on report menubar
        await reportMenubar.clickSubMenuItem('View', 'Objects Panel');

        // Step 8: Check the report editor dataset panel is hidden
        await since('The report editor dataset panel exist should be #{expected}, while we get #{actual}')
            .expect(await reportEditorPanel.isDatasetPanelExisting())
            .toBe(false);

        // Step 9: Select "Objects Panel" from "View" on report menubar
        await reportMenubar.clickSubMenuItem('View', 'Objects Panel');

        // Step 10: Check the report editor dataset panel is displayed
        await since('The report editor dataset panel exist should be #{expected}, while we get #{actual}')
            .expect(await reportEditorPanel.isDatasetPanelExisting())
            .toBe(true);

        // Step 11: Select "Editor Panel" from "View" on report menubar
        await reportMenubar.clickSubMenuItem('View', 'Editor Panel');

        // Step 12: Check the report editor editor panel is hidden
        await since('The report editor dataset panel exist should be #{expected}, while we get #{actual}')
            .expect(await reportEditorPanel.isEditorPanelExisting())
            .toBe(false);

        // Step 13: Select "Editor Panel" from "View" on report menubar
        await reportMenubar.clickSubMenuItem('View', 'Editor Panel');

        // Step 14: Check the report editor editor panel is displayed
        await since('The report editor dataset panel exist should be #{expected}, while we get #{actual}')
            .expect(await reportEditorPanel.isEditorPanelExisting())
            .toBe(true);

        // Step 15: Select "Filter Panel" from "View" on report menubar
        await reportMenubar.clickSubMenuItem('View', 'Filter Panel');

        // Step 16: Check the report editor filter panel is hidden
        await since('The report editor filter panel exist should be #{expected}, while we get #{actual}')
            .expect(await reportFilterPanel.isFilterPanelExisting())
            .toBe(false);

        // Step 17: Select "Filter Panel" from "View" on report menubar
        await reportMenubar.clickSubMenuItem('View', 'Filter Panel');

        // Step 18: Check the report editor filter panel is displayed
        await since('The report editor filter panel exist should be #{expected}, while we get #{actual}')
            .expect(await reportFilterPanel.isFilterPanelExisting())
            .toBe(true);

        // Step 19: Select "Format Panel" from "View" on report menubar
        await reportMenubar.clickSubMenuItem('View', 'Format Panel');

        // Step 20: Check the report editor format panel is hidden
        await since('The report editor format panel exist should be #{expected}, while we get #{actual}')
            .expect(await reportFormatPanel.isFormatPanelExisting())
            .toBe(false);

        // Step 21: Select "Format Panel" from "View" on report menubar
        await reportMenubar.clickSubMenuItem('View', 'Format Panel');

        // Step 22: Check the report editor format panel is displayed
        await since('The report editor format panel exist should be #{expected}, while we get #{actual}')
            .expect(await reportFormatPanel.isFormatPanelExisting())
            .toBe(true);

        await reportMenubar.clickMenuItem('Help');
        await takeScreenshotByElement(await reportMenubar.getDropdownMenu(), 'TC85654_04', 'Options under Help');

        // Step 23: Close the report without saving
        await reportMenubar.clickSubMenuItem('File', 'Close');
        await reportPage.confirmCloseWithoutSaving();
    });
});
