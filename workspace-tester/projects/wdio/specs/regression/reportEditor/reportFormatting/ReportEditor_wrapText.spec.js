import * as reportConstants from '../../../../constants/report.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import { browserWindow } from '../../../../constants/index.js';
import setWindowSize from '../../../../config/setWindowSize.js';

describe('Wrap Text And Metrics Prompt Formatting in report editor', () => {
    let {
        loginPage,
        libraryPage,
        reportToolbar,
        reportTOC,
        newFormatPanelForGrid,
        reportDatasetPanel,
        reportGridView,
        reportFormatPanel,
        baseFormatPanelReact,
        reportPromptEditor,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(reportConstants.reportUser);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
        await libraryPage.handleError();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC86195] Wrap Text in report editor in format panel -> Text & Form', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.TC86195_wrap_text.id,
            projectId: reportConstants.TC86195_wrap_text.project.id,
        });
        await reportToolbar.switchToDesignMode();
        // And I switch to "Format" Panel in Report Editor
        await reportTOC.switchToFormatPanel();

        // When I expand "Spacing" section in Report Editor
        await newFormatPanelForGrid.expandSpacingSection();

        // And I change column size fit to "Fit to Container" under Spacing section in Report Editor
        await reportFormatPanel.clickColumnSizeFitOption('Fit to Container');

        // When I switch to Text format tab in Format Panel in Report Editor
        await newFormatPanelForGrid.switchToTextFormatTab();

        // And I select the grid segment "Rows" "Headers" from the pull down list in Report Editor
        await newFormatPanelForGrid.selectGridSegment('Rows');
        await newFormatPanelForGrid.selectGridColumns('Headers');

        // And I click Wrap text check box in Report Editor
        // await newFormatPanelForGrid.clickCheckBox('Wrap text');
        await newFormatPanelForGrid.enableWrapText();

        // When I switch to "In Report" tab in dataset panel in Report Editor
        // await reportDatasetPanel.switchToInReportTab();

        // And I rename object "Category" to "CategoryCategoryCategoryCategoryCategory CategoryCategoryCategoryCategoryCategory" from In Report tab in Report Editor
        await reportDatasetPanel.renameObjectInReportTab(
            'Category',
            'CategoryCategoryCategoryCategoryCategory CategoryCategoryCategoryCategoryCategory'
        );

        // Then the grid cell at "0", "0" has text "CategoryCategoryCategoryCategoryCategory CategoryCategoryCategoryCategoryCategory"
        await since(
            'After rename Category, The grid cell at "0", "0" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('CategoryCategoryCategoryCategoryCategory CategoryCategoryCategoryCategoryCategory');

        // And the grid cell at "0", "0" has style "white-space" with value "normal"
        await since(
            'After rename Category, The grid cell at "0", "0" should have style "white-space" with value "normal", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 0, 'white-space'))
            .toBe('normal');

        // And I click Wrap text check box in Report Editor
        // await newFormatPanelForGrid.clickCheckBox('Wrap text');
        await newFormatPanelForGrid.disableWrapText();

        // Then the grid cell at "0", "0" has style "white-space" with value "nowrap"
        await since(
            'After disable wrap text, The grid cell at "0", "0" should have style "white-space" with value "nowrap", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 0, 'white-space'))
            .toBe('nowrap');

        // When I switch to "Format" Panel in Report Editor
        await reportTOC.switchToFormatPanel();

        // And I click Wrap text check box in Report Editor
        // await newFormatPanelForGrid.clickCheckBox('Wrap text');
        await newFormatPanelForGrid.enableWrapText();

        // And I switch to "In Report" tab in dataset panel in Report Editor
        // await reportDatasetPanel.switchToInReportTab();

        // And I rename object "Subcategory" to "SubcategorySubcategorySubcategorySubcategory SubcategorySubcategorySubcategorySubcategory" from In Report tab in Report Editor
        await reportDatasetPanel.renameObjectInReportTab(
            'Subcategory',
            'SubcategorySubcategorySubcategorySubcategory SubcategorySubcategorySubcategorySubcategory'
        );

        // Then the grid cell at "0", "1" has text "SubcategorySubcategorySubcategorySubcategory SubcategorySubcategorySubcategorySubcategory"
        await since(
            'After rename Subcategory, The grid cell at "0", "1" should have text "SubcategorySubcategorySubcategorySubcategory SubcategorySubcategorySubcategorySubcategory", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('SubcategorySubcategorySubcategorySubcategory SubcategorySubcategorySubcategorySubcategory');

        // When I switch to "Format" Panel in Report Editor
        await reportTOC.switchToFormatPanel();

        // And I select the grid segment "All Metrics" "Headers" from the pull down list in Report Editor
        await newFormatPanelForGrid.selectGridSegment('All Metrics');
        await newFormatPanelForGrid.selectGridColumns('Headers');

        // When I click Wrap text check box in Report Editor
        // await newFormatPanelForGrid.clickCheckBox('Wrap text');
        await newFormatPanelForGrid.enableWrapText();

        // Then the grid cell at "0", "3" has style "white-space" with value "normal"
        await since(
            'After enable wrap text, The grid cell at "0", "3" should have style "white-space" with value "normal", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos('0', '3', 'white-space'))
            .toBe('normal');

        // When I click Wrap text check box in Report Editor
        // await newFormatPanelForGrid.clickCheckBox('Wrap text');
        await newFormatPanelForGrid.disableWrapText();

        // Then the grid cell at "0", "3" has style "white-space" with value "nowrap"
        await since(
            'After disable wrap text, The grid cell at "0", "3" should have style "white-space" with value "nowrap", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos('0', '3', 'white-space'))
            .toBe('nowrap');
    });

    it('[TC86195_1] Apply format for Metric prompts', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.reportWithMetricPrompt.id,
            projectId: reportConstants.reportWithMetricPrompt.project.id,
        });

        await reportTOC.switchToFormatPanel();
        await newFormatPanelForGrid.switchToTextFormatTab();
        await reportFormatPanel.selectGridSegment('Select Metrics to display on columns', 'Values');
        await newFormatPanelForGrid.selectTextFont(reportConstants.updateFont);
        await since('After update font, the text font option should be #{expected}, instead we have #{actual}')
            .expect(await reportFormatPanel.getFontSelectorValue())
            .toBe(reportConstants.updateFont);
        await reportFormatPanel.clickTextFormatButton('bold');
        await since('After update bold, the text bold option should be #{expected}, instead we have #{actual}')
            .expect(await reportFormatPanel.isTextFormatButtonSelected('bold'))
            .toBe(true);
        await newFormatPanelForGrid.setTextFontSize('12');
        await since('After update font size, the text font size should be #{expected}, instead we have #{actual}')
            .expect(await reportFormatPanel.getFontTextSizeInputValue())
            .toBe('12pt');
        await newFormatPanelForGrid.selectFontAlign('right');
        await since('After update font align, the text font align should be #{expected}, instead we have #{actual}')
            .expect(await reportFormatPanel.isFontAlignButtonSelected('right'))
            .toBe(true);

        // Update Color
        await reportFormatPanel.selectGridSegment('Select Metrics to display on columns', 'Headers');
        await newFormatPanelForGrid.clickFontColorBtn();
        await newFormatPanelForGrid.clickBuiltInColor('#FBDAD9');
        // And I click to close the color picker
        await baseFormatPanelReact.dismissColorPicker();

        await reportToolbar.switchToDesignMode(true);
        await reportPromptEditor.clickApplyButtonInReportPromptEditor();

        await since(
            'After switch to design mode, grid cell at 0, 2 should have color #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos('0', '2', 'color'))
            .toBe('rgba(251,218,217,1)');

        await since(
            'After switch to design mode, grid cell at 1, 2 should have text align-items #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos('1', '2', 'text-align'))
            .toBe('right');

        await since(
            'After switch to design mode, grid cell at 1, 2 should have text font #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos('1', '2', 'font-family'))
            .toBe(reportConstants.updateFontFamily);

        await since(
            'After switch to design mode, grid cell at 1, 2 should have text font size #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos('1', '2', 'font-size'))
            .toBe('16px');

        await since(
            'After switch to design mode, grid cell at 1, 2 should have text font weight #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos('1', '2', 'font-weight'))
            .toBe('700');
    });
});
