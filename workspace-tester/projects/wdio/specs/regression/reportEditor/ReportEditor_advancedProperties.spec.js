import resetReportState from '../../../api/reports/resetReportState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import * as reportConstants from '../../../constants/report.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';

describe('Report Editor Advanced Properties', () => {
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let { dossierPage, libraryPage, reportPage, reportMenubar, advancedReportProperties, loginPage } =
        browsers.pageObj1;

    beforeEach(async () => {
        if (!(await loginPage.isLoginPageDisplayed())) {
            await browser.url(new URL('auth/ui/loginPage', browser.options.baseUrl).toString(), 100000);
        }
        await loginPage.login(reportConstants.reportUser);
        await setWindowSize(browserWindow);
        await resetReportState({
            credentials: reportConstants.reportUser,
            report: reportConstants.NormalReportForAdvancedProperty,
        });
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC85446_01] Test advanced properties in normal report', async () => {
        // Step 1: Open report "NormalReport"
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.NormalReportForAdvancedProperty.id,
            projectId: reportConstants.NormalReportForAdvancedProperty.project.id,
        });

        // Step 2: Select "Report Properties" under "File"
        await reportMenubar.clickSubMenuItem('File', 'Report Properties');

        // Step 3: Check the report properties window should open correctly
        await advancedReportProperties.isReportPropertiesWindowPresent();

        // Step 4: Switch to "Advanced Properties" tab
        await advancedReportProperties.selectReportPropertyType('Advanced Properties');

        // Step 5: Check the properties values
        await advancedReportProperties.checkPropertyValuePulldownList(
            'Cartesian Join Governing',
            'Use Inherited Value'
        );
        await advancedReportProperties.checkPropertyValueDetails('Cartesian Join Governing', 'backward compatibility');

        // Step 6: take screenshot for advanced properties dialog
        await takeScreenshotByElement(
            advancedReportProperties.ReportPropertiesGrid,
            'TC85446_01',
            'Default advanced properties dialog for normal report'
        );

        // Step 7: Set the properties values
        await advancedReportProperties.selectPropertyValuePulldownList('Cartesian Join Governing', 'In-Memory queries');

        // Step 8: Click "Done" button to save properties change
        await advancedReportProperties.clickDoneCancelButton('Done');

        // Step 9: Reopen "Report Properties" under "File"
        await reportMenubar.clickSubMenuItem('File', 'Report Properties');

        // Step 10: Switch to "Advanced Properties" tab
        await advancedReportProperties.selectReportPropertyType('Advanced Properties');

        // Step 11: Check the properties values should be changed
        await advancedReportProperties.checkPropertyValuePulldownList(
            'Cartesian Join Governing',
            'Execute cartesian join'
        );

        // Step 12: Click "Cancel" button to dismiss properties dailog
        await advancedReportProperties.clickDoneCancelButton('Cancel');

        // Step 13: Close the report
        await reportPage.closeReportAuthoringWithoutSave();
    });

    it('[TC85446_02] Test advanced properties in subset report', async () => {
        // Step 1: Open report "SubsetReportForAdvancedProperty"
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.SubsetReportForAdvancedProperty.id,
            projectId: reportConstants.SubsetReportForAdvancedProperty.project.id,
        });

        // Step 2: Select "Report Properties" under "File"
        await reportMenubar.clickSubMenuItem('File', 'Report Properties');

        // Step 3: Check the report properties window should open correctly
        await advancedReportProperties.isReportPropertiesWindowPresent();

        // Step 4: Switch to "Advanced Properties" tab
        await advancedReportProperties.selectReportPropertyType('Advanced Properties');

        // Step 5: Check the properties values
        await advancedReportProperties.checkPropertyValuePulldownList(
            'Cartesian Join Governing',
            'Use Inherited Value'
        );
        await advancedReportProperties.checkPropertyValueDetails('Cartesian Join Governing', 'backward compatibility');

        // Step 6: take screenshot for advanced properties dialog
        await takeScreenshotByElement(
            advancedReportProperties.ReportPropertiesGrid,
            'TC85446_02',
            'Default advanced properties dialog for normal report'
        );

        // Step 7: Set the properties values
        await advancedReportProperties.selectPropertyValuePulldownList('Cartesian Join Governing', 'In-Memory queries');

        // Step 8: Click "Done" button to save properties change
        await advancedReportProperties.clickDoneCancelButton('Done');

        // Step 9: Reopen "Report Properties" under "File"
        await reportMenubar.clickSubMenuItem('File', 'Report Properties');

        // Step 10: Switch to "Advanced Properties" tab
        await advancedReportProperties.selectReportPropertyType('Advanced Properties');

        // Step 11: Check the properties values should be changed
        await advancedReportProperties.checkPropertyValuePulldownList(
            'Cartesian Join Governing',
            'Execute cartesian join'
        );

        // Step 12: Click "Cancel" button to dismiss properties dailog
        await advancedReportProperties.clickDoneCancelButton('Cancel');

        // Step 13: Close the report
        await reportPage.closeReportAuthoringWithoutSave();
    });

    it('[TC85446_03] Test calculation in normal report', async () => {
        // Step 1: Open report NormalReportForAdvancedProperty
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.NormalReportForAdvancedProperty.id,
            projectId: reportConstants.NormalReportForAdvancedProperty.project.id,
        });

        // Step 2: Select "Report Properties" under "File"
        await reportMenubar.clickSubMenuItem('File', 'Report Properties');

        // Step 3: Check the report properties window should open correctly
        await since('The report properties window should be present')
            .expect(await advancedReportProperties.isReportPropertiesWindowPresent())
            .toBe(true);

        // // Step 4: Switch to "Calculation" tab
        await advancedReportProperties.selectReportPropertyType('Calculation');

        // Step 5: Take a screenshot for properties dialog as "Default calculation tab for normal report"
        await takeScreenshotByElement(
            advancedReportProperties.CalculationContainer,
            'TC85446_03',
            'Default calculation tab for normal report'
        );

        // Step 6: Change the Default evaluation order dropdown to "...(formerly known as 6.x order)"
        await advancedReportProperties.clickDefaultEvaluationOrder();
        await advancedReportProperties.selectDefaultEvaluationOrder('ORDER_6X');

        // // Step 7: Check the checkbox of "Use default evaluation order"
        // await advancedReportProperties.updateSchemaOptionCheckbox('Use default evaluation order', 'checked');

        // Step 8: Change the order of "Seasons" to "1", check the order of "Seasons" is "1"
        await advancedReportProperties.clickEvaluationOrder('Seasons');
        await advancedReportProperties.selectFromEvaluationOrderList('1');
        await since('The order of "Seasons" should be "1"')
            .expect(await advancedReportProperties.checkEvaluationOrder('Seasons', '1'))
            .toBe(true);

        // Step 9: Reset Orders for evaluation order, check the order of "Seasons" is "Default"
        await advancedReportProperties.resetOrders();
        await since('The order of "Seasons" should be "Default"')
            .expect(await advancedReportProperties.checkEvaluationOrder('Seasons', 'Default'))
            .toBe(true);

        // // Step 10: Uncheck the checkbox of "Use default evaluation order", check the checkbox is unchecked
        // await advancedReportProperties.updateSchemaOptionCheckbox('Use default evaluation order', 'unchecked');

        // // Step 11: Change the order of various metrics
        // await advancedReportProperties.clickEvaluationOrder('CostSmartCompoundMetric');
        // await advancedReportProperties.selectFromEvaluationOrderList('1');
        // await advancedReportProperties.clickEvaluationOrder('Seasons');
        // await advancedReportProperties.selectFromEvaluationOrderList('1');
        // await advancedReportProperties.clickEvaluationOrder('Cost <= 3000000');
        // await advancedReportProperties.selectFromEvaluationOrderList('3');

        // // Step 12: Take a screenshot for properties dialog as "Changed calculation tab for normal report"
        // await takeScreenshotByElement(
        //     advancedReportProperties.ReportPropertiesGrid,
        //     'TC85446_03',
        //     'Changed calculation tab for normal report'
        // );

        // Step 13: Click "Evaluate in View" for "CostSmartCompoundMetric"
        await advancedReportProperties.switchEvaluationTable('CostSmartCompoundMetric', 'view');

        // Step 14: Take a screenshot for properties dialog as "Evaluated calculation tab for normal report"
        await takeScreenshotByElement(
            advancedReportProperties.CalculationContainer,
            'TC85446_03',
            'Click evaluated in view in calculation tab for normal report'
        );

        // Step 15: Change the order of various metrics
        await advancedReportProperties.clickEvaluationOrder('Metric Limit');
        await advancedReportProperties.selectFromEvaluationOrderList('1');
        await advancedReportProperties.clickEvaluationOrder('CostRank');
        await advancedReportProperties.selectFromEvaluationOrderList('2');
        await advancedReportProperties.clickEvaluationOrder('CostSmartCompoundMetric');
        await advancedReportProperties.selectFromEvaluationOrderList('1');
        await advancedReportProperties.clickEvaluationOrder('Total');
        await advancedReportProperties.selectFromEvaluationOrderList('4');

        // Step 16: Take a screenshot for properties dialog as "Metric changed in calculation tab for normal report"
        await takeScreenshotByElement(
            advancedReportProperties.CalculationContainer,
            'TC85446_03',
            'Metric changed in calculation tab for normal report'
        );

        // Step 17: Click "Done"
        await advancedReportProperties.clickDoneCancelButton('Done');

        // Step 18: Reopen the Report Properties
        await reportMenubar.clickSubMenuItem('File', 'Report Properties');

        // Step 19: Take a screenshot for properties dialog as "Reopened calculation tab for normal report"
        await takeScreenshotByElement(
            advancedReportProperties.CalculationContainer,
            'TC85446_03',
            'Reopened calculation tab for normal report'
        );

        // Step 20: Click "Cancel" button to dismiss properties dialog
        await advancedReportProperties.clickDoneCancelButton('Cancel');

        // Step 21: Close the "_NormalReport" without saving
        await reportPage.closeReportAuthoringWithoutSave();
    });

    it('[TC85446_04] Test calculation in subset report', async () => {
        // Step 1: Open report NormalReportForAdvancedProperty
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.SubsetReportForAdvancedProperty.id,
            projectId: reportConstants.SubsetReportForAdvancedProperty.project.id,
        });

        // Step 2: Select "Report Properties" under "File"
        await reportMenubar.clickSubMenuItem('File', 'Report Properties');

        // Step 3: Check the report properties window should open correctly
        await since('The report properties window should be present')
            .expect(await advancedReportProperties.isReportPropertiesWindowPresent())
            .toBe(true);

        // // Step 4: Switch to "Calculation" tab
        await advancedReportProperties.selectReportPropertyType('Calculation');

        // Step 5: Take a screenshot for properties dialog as "Default calculation tab for normal report"
        await takeScreenshotByElement(
            advancedReportProperties.ReportPropertiesGrid,
            'TC85446_04',
            'Default calculation tab for subset report'
        );

        // Step 6: Change the Default evaluation order dropdown to "...(formerly known as 9.x order)"
        await advancedReportProperties.clickDefaultEvaluationOrder();
        await advancedReportProperties.selectDefaultEvaluationOrder('ORDER_9X');

        // Step 7: Change the order of "Average" to "1", the order of "Region" to "1"
        await advancedReportProperties.clickEvaluationOrder('Average');
        await advancedReportProperties.selectFromEvaluationOrderList('1');
        await advancedReportProperties.clickEvaluationOrder('Region');
        await advancedReportProperties.selectFromEvaluationOrderList('1');
        await since('The order of "Region" should be "1"')
            .expect(await advancedReportProperties.checkEvaluationOrder('Region', '1'))
            .toBe(true);
        await since('The order of "Average" should be "2"')
            .expect(await advancedReportProperties.checkEvaluationOrder('Average', '2'))
            .toBe(true);

        // Step 8: Click "Done"
        await advancedReportProperties.clickDoneCancelButton('Done');

        // Step 9: Reopen the Report Properties
        await reportMenubar.clickSubMenuItem('File', 'Report Properties');

        // Step 10: Take a screenshot for properties dialog as "Reopened calculation tab for subset report"
        await takeScreenshotByElement(
            advancedReportProperties.ReportPropertiesGrid,
            'TC85446_04',
            'Reopened calculation tab for subset report'
        );

        // Step 11: Click "Cancel" button to dismiss properties dialog
        await advancedReportProperties.clickDoneCancelButton('Cancel');

        // Step 12: Close the "_SubsetReport" without saving
        await reportPage.closeReportAuthoringWithoutSave();
    });

    it('[TC85446_05] Test prompt properties in normal report', async () => {
        // Step 1: Edit report PromptReport1ForAdvancedProperty
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.PromptReport1ForAdvancedProperty.id,
            projectId: reportConstants.PromptReport1ForAdvancedProperty.project.id,
        });

        // Step 2: Open "File" -> "Report Properties" in menubar
        await reportMenubar.clickSubMenuItem('File', 'Report Properties');

        // Step 3: Switch to "Prompt" tab
        await advancedReportProperties.selectReportPropertyType('Prompt');

        // Step 4: Take a screenshot for properties dialog as "Default prompt tab for normal report"
        await takeScreenshotByElement(
            advancedReportProperties.PromptContainer,
            'TC85446_05',
            'Default prompt tab for normal report'
        );

        // Step 5: Drag and drop prompt index 2 vertically to y 150 in evaluation table
        await advancedReportProperties.dragAndDropPrompt(2, 150);

        // Step 6: Take a screenshot for properties dialog as "Changed prompt tab for normal report"
        await takeScreenshotByElement(
            advancedReportProperties.PromptContainer,
            'TC85446_05',
            'Changed prompt tab for normal report'
        );

        // Step 7: Click "Done"
        await advancedReportProperties.clickDoneCancelButton('Done');

        // Step 8: Reopen the Report Properties and switch to "Prompt" tab
        await reportMenubar.clickSubMenuItem('File', 'Report Properties');
        await advancedReportProperties.selectReportPropertyType('Prompt');

        // Step 9: Take a screenshot for properties dialog as "Reopened prompt tab for normal report"
        await takeScreenshotByElement(
            advancedReportProperties.PromptContainer,
            'TC85446_05',
            'Reopen prompt tab for normal report'
        );

        // Step 10: Click "Cancel" button to dismiss properties dialog
        await advancedReportProperties.clickDoneCancelButton('Cancel');

        // Step 11: Close the report without saving
        await reportPage.closeReportAuthoringWithoutSave();
    });

    it('[TC85446_06] Test prompt properties in prompt in prompt report', async () => {
        // Step 1: Edit report PromptReport2ForAdvancedProperty
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.PromptReport2ForAdvancedProperty.id,
            projectId: reportConstants.PromptReport2ForAdvancedProperty.project.id,
        });

        // Step 2: Open "File" -> "Report Properties" in menubar
        await reportMenubar.clickSubMenuItem('File', 'Report Properties');

        // Step 3: Switch to "Prompt" tab
        await advancedReportProperties.selectReportPropertyType('Prompt');

        // Step 4: Take a screenshot for properties dialog as "Default prompt tab for normal report"
        await takeScreenshotByElement(
            advancedReportProperties.PromptContainer,
            'TC85446_06',
            'Default prompt tab for prompt in prompt report'
        );

        // Step 5: Drag and drop prompt index 0 vertically to y 150 in evaluation table
        await advancedReportProperties.dragAndDropPrompt(0, 50);

        // Step 6: Take a screenshot for properties dialog as "Changed prompt tab for normal report"
        await takeScreenshotByElement(
            advancedReportProperties.PromptContainer,
            'TC85446_06',
            'Changed prompt tab for prompt in prompt report'
        );

        // Step 7: Click "Done"
        await advancedReportProperties.clickDoneCancelButton('Done');

        // Step 8: Reopen the Report Properties and switch to "Prompt" tab
        await reportMenubar.clickSubMenuItem('File', 'Report Properties');
        await advancedReportProperties.selectReportPropertyType('Prompt');

        // Step 9: Take a screenshot for properties dialog as "Reopened prompt tab for normal report"
        await takeScreenshotByElement(
            advancedReportProperties.PromptContainer,
            'TC85446_06',
            'Reopen prompt tab for prompt in prompt report'
        );

        // Step 10: Click "Cancel" button to dismiss properties dialog
        await advancedReportProperties.clickDoneCancelButton('Cancel');

        // Step 11: Close the report without saving
        await reportPage.closeReportAuthoringWithoutSave();
    });

    //DE304795 - [ALL] Workstation - copy values from vldb settings gives only [object Object] and not the value
    xit('[TC85446_07] Copy VLDB settings in report advanced properties dialog', async () => {
        // Step 1: Open report "NormalReport"
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.NormalReportForAdvancedProperty.id,
            projectId: reportConstants.NormalReportForAdvancedProperty.project.id,
        });

        // Step 2: Select "Report Properties" under "File"
        await reportMenubar.clickSubMenuItem('File', 'Report Properties');

        // Step 3: Switch to "Advanced Properties" tab
        await advancedReportProperties.selectReportPropertyType('Advanced Properties');

        // Step 4: Check the copied preview SQL for "Cartesian Join Governing" property
        await advancedReportProperties.typeInSearchBox('Cartesian');
        await advancedReportProperties.copyPreviewSQLForPropertySetting('Cartesian Join Governing');
        await since('The copied value should be #{expected}, while we got #{actual}')
            .expect(await advancedReportProperties.getClipboardText())
            .toBe('OBSOLETE - Keep backward compatibility with MicroStrategy 2019.');

        // Step 5: Click "Cancel" button to dismiss properties dailog
        await advancedReportProperties.clickDoneCancelButton('Cancel');

        // Step 6: Close the report
        await reportPage.closeReportAuthoringWithoutSave();
    });

    it('[TC85446_08] Modify report caching settings', async () => {
        const cachingSetting = 'Caching';
        // Step 1: Open report "NormalReport"
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.NormalReportForAdvancedProperty.id,
            projectId: reportConstants.NormalReportForAdvancedProperty.project.id,
        });

        // Step 2: Modify and check caching settings
        await reportMenubar.clickSubMenuItem('File', 'Report Properties');
        await advancedReportProperties.selectReportPropertyType('Advanced Properties');
        await advancedReportProperties.typeInSearchBox(cachingSetting);
        await advancedReportProperties.modifyPropertySettingsPicker(cachingSetting, 'Disable');
        await advancedReportProperties.clickDoneCancelButton('Done');

        await reportMenubar.clickSubMenuItem('File', 'Report Properties');
        await advancedReportProperties.selectReportPropertyType('Advanced Properties');
        await advancedReportProperties.typeInSearchBox(cachingSetting);
        await since('1. The report caching setting should be #{expected}, while we got #{actual}')
            .expect(await advancedReportProperties.getPropertySettingDetailsByName(cachingSetting))
            .toBe('Disable');
        await advancedReportProperties.modifyPropertySettingsPicker(cachingSetting, 'Enable');
        await advancedReportProperties.clickDoneCancelButton('Done');
        await reportMenubar.clickSubMenuItem('File', 'Report Properties');
        await advancedReportProperties.selectReportPropertyType('Advanced Properties');
        await advancedReportProperties.typeInSearchBox(cachingSetting);
        await since('2. The report caching setting should be #{expected}, while we got #{actual}')
            .expect(await advancedReportProperties.getPropertySettingDetailsByName(cachingSetting))
            .toBe('Enable');
        await advancedReportProperties.modifyPropertySettingsPicker(cachingSetting, 'Use Default Inherited Value');
        await advancedReportProperties.clickDoneCancelButton('Done');
        await reportMenubar.clickSubMenuItem('File', 'Report Properties');
        await advancedReportProperties.selectReportPropertyType('Advanced Properties');
        await advancedReportProperties.typeInSearchBox(cachingSetting);
        await since('3. The report caching setting should be #{expected}, while we got #{actual}')
            .expect(await advancedReportProperties.getPropertySettingDetailsByName(cachingSetting))
            .toBe('Use Inherited Value - Project Level');

        // Step 3: Click "Cancel" button to dismiss properties dailog
        await advancedReportProperties.clickDoneCancelButton('Cancel');

        // Step 4: Close the report
        await reportPage.closeReportAuthoringWithoutSave();
    });

    it('[TC85446_09] Modify incremental fetch settings', async () => {
        const incrementalFetchSetting = 'Incremental Fetch';
        const rowPerPageSetting = 'Rows per Page';
        // Step 1: Open report "NormalReport"
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.NormalReportForAdvancedProperty.id,
            projectId: reportConstants.NormalReportForAdvancedProperty.project.id,
        });

        // Step 2: Modify and check incremental fetch settings
        await reportMenubar.clickSubMenuItem('File', 'Report Properties');
        await advancedReportProperties.selectReportPropertyType('Advanced Properties');
        await advancedReportProperties.typeInSearchBox(incrementalFetchSetting);
        await since('1. The report incremental fetch setting should be by default #{expected}, while we got #{actual}')
            .expect(await advancedReportProperties.getPropertySettingDetailsByName(incrementalFetchSetting))
            .toBe('Enable');
        await since(
            '2. The report incremental fetch row per page should be by default #{expected}, while we got #{actual}'
        )
            .expect(await advancedReportProperties.getPropertySettingDetailsByName(rowPerPageSetting))
            .toBe('100');
        await advancedReportProperties.modifyPropertySettingsPicker(incrementalFetchSetting, 'Disable');
        await advancedReportProperties.clickDoneCancelButton('Done');

        await reportMenubar.clickSubMenuItem('File', 'Report Properties');
        await advancedReportProperties.selectReportPropertyType('Advanced Properties');
        await advancedReportProperties.typeInSearchBox(incrementalFetchSetting);
        await since('2. The report incremental fetch setting should be #{expected}, while we got #{actual}')
            .expect(await advancedReportProperties.getPropertySettingDetailsByName(incrementalFetchSetting))
            .toBe('Disable');
        await advancedReportProperties.modifyPropertySettingsPicker(incrementalFetchSetting, 'Enable');
        await advancedReportProperties.modifyPropertySettingsInput(rowPerPageSetting, 500);
        await advancedReportProperties.clickDoneCancelButton('Done');

        await reportMenubar.clickSubMenuItem('File', 'Report Properties');
        await advancedReportProperties.selectReportPropertyType('Advanced Properties');
        await advancedReportProperties.typeInSearchBox(incrementalFetchSetting);
        await since('3. The report incremental fetch setting should be #{expected}, while we got #{actual}')
            .expect(await advancedReportProperties.getPropertySettingDetailsByName(incrementalFetchSetting))
            .toBe('Enable');
        await since(
            '4. The report incremental fetch row per page should be by default #{expected}, while we got #{actual}'
        )
            .expect(await advancedReportProperties.getPropertySettingDetailsByName(rowPerPageSetting))
            .toBe('100500');

        // Step 3: Click "Cancel" button to dismiss properties dailog
        await advancedReportProperties.clickDoneCancelButton('Cancel');

        // Step 4: Close the report
        await reportPage.closeReportAuthoringWithoutSave();
    });
});
