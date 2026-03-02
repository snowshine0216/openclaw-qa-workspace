import * as reportConstants from '../../../../constants/report.js';
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import { browserWindow } from '../../../../constants/index.js';

describe('Report Editor Thresholds in Workstation', () => {
    let {
        loginPage,
        libraryPage,
        reportToolbar,
        reportGridView,
        reportTOC,
        reportEditorPanel,
        reportDatasetPanel,
        thresholdEditor,
        advancedFilter,
        reportPageBy,
        baseContainer,
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

    it('[TC85267_1] Report editor thresholds TC85267 Case 1 in workstation', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.ReportThreshold1.id,
            projectId: reportConstants.ReportThreshold1.project.id,
        });
        await reportToolbar.switchToDesignMode();
        // Then the grid cell at "5", "1" has image "globe-showing-americas-on-white-keyboard-picture-id163942994"
        await since(
            'The grid cell at "5", "1" should have image "globe-showing-americas-on-white-keyboard-picture-id163942994", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellImgSrcByPos(5, 1))
            .toContain('globe-showing-americas-on-white-keyboard-picture-id163942994');
    });

    it('[TC85267_2] Report editor thresholds TC85267 Case 2', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.ReportThreshold2.id,
            projectId: reportConstants.ReportThreshold2.project.id,
        });
        await reportToolbar.switchToDesignMode();
        // And the grid cell at "1", "1" has text "$343,320"
        await since(
            'After switch to design mode, The grid cell at "1", "1" should have text "$343,320", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('$343,320');

        // And the grid cell at "1", "1" has style "background-color" with value "rgba(0,128,0,1)"
        await since(
            'After switch to design mode, The grid cell at "1", "1" should have background-color "rgba(0,128,0,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 1, 'background-color'))
            .toBe('rgba(0,128,0,1)');

        // And the grid cell at "1", "1" has style "color" with value "rgba(255,255,255,1)"
        await since(
            'After switch to design mode, The grid cell at "1", "1" should have color "rgba(255,255,255,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 1, 'color'))
            .toBe('rgba(255,255,255,1)');

        // And the grid cell at "1", "1" has style "font-style" with value "italic"
        await since(
            'After switch to design mode, The grid cell at "1", "1" should have font-style "italic", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 1, 'font-style'))
            .toBe('italic');

        // And the grid cell at "1", "1" has style "font-weight" with value "700"
        await since(
            'After switch to design mode, The grid cell at "1", "1" should have font-weight "700", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 1, 'font-weight'))
            .toBe('700');

        // And the grid cell at "1", "1" has style "border-color" with value "rgba(0,0,255,1)"
        await since(
            'After switch to design mode, The grid cell at "1", "1" should have border-color "rgba(0,0,255,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 1, 'border-color'))
            .toBe('rgba(0,0,255,1)');

        // And the grid cell at "1", "1" has style "border-style" with value "solid"
        await since(
            'After switch to design mode, The grid cell at "1", "1" should have border-style "solid", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 1, 'border-style'))
            .toBe('solid');

        // And the grid cell at "1", "4" has text "●"
        await since(
            'After switch to design mode, The grid cell at "1", "4" should have text "●", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 4))
            .toBe('●');

        // And the grid cell at "1", "4" has style "background-color" with value "rgba(255,255,255,1)"
        await since(
            'After switch to design mode, The grid cell at "1", "4" should have background-color "rgba(255,255,255,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 4, 'background-color'))
            .toBe('rgba(255,255,255,1)');

        // And the grid cell at "1", "4" has style "color" with value "rgba(0,128,0,1)"
        await since(
            'After switch to design mode, The grid cell at "1", "4" should have color "rgba(0,128,0,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 4, 'color'))
            .toBe('rgba(0,128,0,1)');

        // And the grid cell at "3", "0" has text "Movies"
        await since(
            'After switch to design mode, The grid cell at "3", "0" should have text "Movies", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(3, 0))
            .toBe('Movies');

        // And the grid cell at "3", "0" has style "font-weight" with value "700"
        await since(
            'After switch to design mode, The grid cell at "3", "0" should have font-weight "700", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(3, 0, 'font-weight'))
            .toBe('700');

        // And the grid cell at "3", "0" has style "background-color" with value "rgba(255,255,255,1)"
        await since(
            'After switch to design mode, The grid cell at "3", "0" should have background-color "rgba(255,255,255,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(3, 0, 'background-color'))
            .toBe('rgba(255,255,255,1)');

        // And the grid cell at "3", "0" has style "color" with value "rgba(153,51,102,1)"
        await since(
            'After switch to design mode, The grid cell at "3", "0" should have color "rgba(153,51,102,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(3, 0, 'color'))
            .toBe('rgba(153,51,102,1)');

        // And the grid cell at "4", "4" has text "●"
        await since(
            'After switch to design mode, The grid cell at "4", "4" should have text "●", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(4, 4))
            .toBe('●');

        // And the grid cell at "4", "4" has style "background-color" with value "rgba(255,255,255,1)"
        await since(
            'After switch to design mode, The grid cell at "4", "4" should have background-color "rgba(255,255,255,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(4, 4, 'background-color'))
            .toBe('rgba(255,255,255,1)');

        // And the grid cell at "4", "4" has style "color" with value "rgba(255,0,0,1)"
        await since(
            'After switch to design mode, The grid cell at "4", "4" should have color "rgba(255,0,0,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(4, 4, 'color'))
            .toBe('rgba(255,0,0,1)');

        // And the grid cell at "5", "4" has text "154.3%"
        await since(
            'After switch to design mode, The grid cell at "5", "4" should have text "154.3%", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(5, 4))
            .toBe('154.3%');

        // And the grid cell at "5", "4" has style "font-weight" with value "700"
        await since(
            'After switch to design mode, The grid cell at "5", "4" should have style "font-weight" with value "700", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(5, 4, 'font-weight'))
            .toBe('700');

        // And the grid cell at "5", "4" has style "background-color" with value "rgba(255,234,114,1)"
        await since(
            'After switch to design mode, The grid cell at "5", "4" should have style "background-color" with value "rgba(255,234,114,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(5, 4, 'background-color'))
            .toBe('rgba(255,234,114,1)');

        // When I switch to "Editor" Panel in Report Editor
        await reportTOC.switchToEditorPanel();

        // clear thresholds for Revenue
        await reportGridView.hideAllThresholds('Revenue');
        await takeScreenshotByElement(
            reportGridView.getVisualizationViewPort('Visualization 1'),
            'TC85267_2',
            'After hide all thresholds for Revenue'
        );

        await reportGridView.showAllThresholds('Revenue');
        await takeScreenshotByElement(
            reportGridView.getVisualizationViewPort('Visualization 1'),
            'TC85267_2',
            'After show all thresholds for Revenue'
        );

        // When I clear Thresholds from the "metric" named "Revenue" in "Metrics" dropzone in Editor Panel
        // await reportEditorPanel.openObjectContextMenu('Metrics', 'metric', 'Revenue');
        // await reportDatasetPanel.clickObjectContextMenuItem('Clear Thresholds');
        await reportEditorPanel.clearThresholdForMetricInMetricsDropZone('Revenue');

        // And the grid cell at "3", "1" has text "$527,286"
        await since(
            'After clear Thresholds for Revenue, The grid cell at "3", "1" should have text "$527,286", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(3, 1))
            .toBe('$527,286');

        // And the grid cell at "3", "1" has style "background-color" with value "rgba(255,255,255,1)"
        await since(
            'After clear Thresholds for Revenue, The grid cell at "3", "1" should have style "background-color" with value "rgba(255,255,255,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(3, 1, 'background-color'))
            .toBe('rgba(255,255,255,1)');

        // And the grid cell at "3", "1" has style "color" with value "rgba(0,0,0,1)"
        await since(
            'After clear Thresholds for Revenue, The grid cell at "3", "1" should have style "color" with value "rgba(0,0,0,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(3, 1, 'color'))
            .toBe('rgba(0,0,0,1)');

        // And the grid cell at "3", "1" has style "font-style" with value "normal"
        await since(
            'After clear Thresholds for Revenue, The grid cell at "3", "1" should have style "font-style" with value "normal", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(3, 1, 'font-style'))
            .toBe('normal');

        // And the grid cell at "3", "1" has style "font-weight" with value "400"
        await since(
            'After clear Thresholds for Revenue, The grid cell at "3", "1" should have style "font-weight" with value "400", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(3, 1, 'font-weight'))
            .toBe('400');

        // And the grid cell at "2", "4" has text "●"
        await since(
            'After clear Thresholds for Revenue, The grid cell at "2", "4" should have text "●", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 4))
            .toBe('●');

        // And the grid cell at "2", "4" has style "background-color" with value "rgba(255,255,255,1)"
        await since(
            'After clear Thresholds for Revenue, The grid cell at "2", "4" should have background-color with value "rgba(255,255,255,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(2, 4, 'background-color'))
            .toBe('rgba(255,255,255,1)');

        // And the grid cell at "2", "4" has style "color" with value "rgba(255,0,0,1)"
        await since(
            'After clear Thresholds for Revenue, The grid cell at "2", "4" should have color with value "rgba(255,0,0,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(2, 4, 'color'))
            .toBe('rgba(255,0,0,1)');

        // And the grid cell at "4", "0" has text "Music"
        await since(
            'After clear Thresholds for Revenue, The grid cell at "4", "0" should have text "Music", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(4, 0))
            .toBe('Music');

        // And the grid cell at "4", "0" has style "font-weight" with value "700"
        await since(
            'After clear Thresholds for Revenue, The grid cell at "4", "0" should have font-weight with value "700", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(4, 0, 'font-weight'))
            .toBe('700');

        // And the grid cell at "4", "0" has style "background-color" with value "rgba(255,255,255,1)"
        await since(
            'After clear Thresholds for Revenue, The grid cell at "4", "0" should have background-color with value "rgba(255,255,255,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(4, 0, 'background-color'))
            .toBe('rgba(255,255,255,1)');

        // And the grid cell at "4", "0" has style "color" with value "rgba(153,51,102,1)"
        await since(
            'After clear Thresholds for Revenue, The grid cell at "4", "0" should have color with value "rgba(153,51,102,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(4, 0, 'color'))
            .toBe('rgba(153,51,102,1)');

        // And I open thresholds editor from the "metric" "Revenue" in "Metrics" dropzone in Editor Panel
        // await reportEditorPanel.openObjectContextMenu('Metrics', 'metric', 'Revenue');
        // await reportDatasetPanel.clickObjectContextMenuItem('Thresholds Editor');
        await reportEditorPanel.openThresholdInDropZoneForMetric('Revenue');

        // And I switch the simple threshold type from "Color-based" to "Image-based" in simple threshold editor
        await thresholdEditor.switchSimpleThresholdsTypeI18N('Image-based');

        // And I open the image band drop down menu
        await thresholdEditor.openSimpleThresholdImageBandDropDownMenu();

        // And I select the image band "Rounded Push Pin" in simple threshold editor
        await thresholdEditor.selectSimpleThresholdImageBand('Rounded Push Pin');

        // And I select the Based on metric "Revenue" in simple threshold editor
        await thresholdEditor.selectSimpleThresholdBasedOnObject('Revenue');

        // And I change the Based on option to "Lowest" in simple threshold editor
        await thresholdEditor.selectSimpleThresholdBasedOnOption('Lowest');

        // And I save and close Simple Thresholds Editor
        await thresholdEditor.saveAndCloseSimThresholdEditor();

        // And the grid cell at "1", "1" has image "/images/quickThresholdImgs/roundedpp_yellow.png"
        await since(
            'After set Image-based threshold for Revenue, The grid cell at "1", "1" should have image "/images/quickThresholdImgs/roundedpp_yellow.png", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellImgSrcByPos(1, 1))
            .toContain('/images/quickThresholdImgs/roundedpp_yellow.png');

        // And the grid cell at "1", "1" has style "background-color" with value "rgba(255,255,255,1)"
        await since(
            'After set Image-based threshold for Revenue, The grid cell at "1", "1" should have style "background-color" with value "rgba(255,255,255,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 1, 'background-color'))
            .toBe('rgba(255,255,255,1)');

        // And the grid cell at "2", "1" has image "/images/quickThresholdImgs/roundedpp_green.png"
        await since(
            'After set Image-based threshold for Revenue, The grid cell at "2", "1" should have image "/images/quickThresholdImgs/roundedpp_green.png", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellImgSrcByPos(2, 1))
            .toContain('/images/quickThresholdImgs/roundedpp_green.png');

        // And the grid cell at "2", "1" has style "background-color" with value "rgba(255,255,255,1)"
        await since(
            'After set Image-based threshold for Revenue, The grid cell at "2", "1" should have style "background-color" with value "rgba(255,255,255,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(2, 1, 'background-color'))
            .toBe('rgba(255,255,255,1)');

        // And the grid cell at "3", "4" has text "●"
        await since(
            'After set Image-based threshold for Revenue, The grid cell at "3", "4" should have text "●", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(3, 4))
            .toBe('●');

        // And the grid cell at "3", "4" has style "background-color" with value "rgba(255,255,255,1)"
        await since(
            'After set Image-based threshold for Revenue, The grid cell at "3", "4" should have style "background-color" with value "rgba(255,255,255,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(3, 4, 'background-color'))
            .toBe('rgba(255,255,255,1)');

        // And the grid cell at "3", "4" has style "color" with value "rgba(0,128,0,1)"
        await since(
            'After set Image-based threshold for Revenue, The grid cell at "3", "4" should have style "color" with value "rgba(0,128,0,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(3, 4, 'color'))
            .toBe('rgba(0,128,0,1)');
        // And the grid cell at "4", "0" has text "Music"
        await since('The grid cell at "4", "0" should have text "Music", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(4, 0))
            .toBe('Music');

        // And the grid cell at "4", "0" has style "font-weight" with value "700"
        await since(
            'After set Image-based threshold for Revenue, The grid cell at "4", "0" should have style "font-weight" with value "700", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(4, 0, 'font-weight'))
            .toBe('700');

        // And the grid cell at "4", "0" has style "background-color" with value "rgba(255,255,255,1)"
        await since(
            'After set Image-based threshold for Revenue, The grid cell at "4", "0" should have style "background-color" with value "rgba(255,255,255,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(4, 0, 'background-color'))
            .toBe('rgba(255,255,255,1)');

        // And the grid cell at "4", "0" has style "color" with value "rgba(153,51,102,1)"
        await since(
            'After set Image-based threshold for Revenue, The grid cell at "4", "0" should have style "color" with value "rgba(153,51,102,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(4, 0, 'color'))
            .toBe('rgba(153,51,102,1)');

        // When I remove the "attribute" "Category" in "rows" dropzone from Editor Panel in Report Editor
        await reportEditorPanel.removeObjectInDropzone('rows', 'attribute', 'Category');

        // When I switch to "In Report" tab in dataset panel in Report Editor
        // await reportDatasetPanel.switchToInReportTab();

        // And I add the object "Category" to Rows from In Report tab in Report Editor
        await reportDatasetPanel.addObjectToRows('Category');
        await takeScreenshotByElement(
            reportGridView.getVisualizationViewPort('Visualization 1'),
            'TC85267_2',
            'After add Category to Rows'
        );

        // When I click on container "Visualization 1" to select it
        await baseContainer.clickContainerByScript('Visualization 1');

        // When I remove object "Trend" from grid view in Report Editor
        await reportGridView.openGridColumnHeaderContextMenu('Trend');
        await reportGridView.clickContextMenuOption('Remove');

        // When I switch to "In Report" tab in dataset panel in Report Editor
        // await reportDatasetPanel.switchToInReportTab();

        // And I add the object "Trend" to Columns from In Report tab in Report Editor
        await reportDatasetPanel.openObjectContextMenu('Trend');
        await reportDatasetPanel.clickObjectContextMenuItem('Add to Columns');
        await takeScreenshotByElement(
            reportGridView.getVisualizationViewPort('Visualization 1'),
            'TC85267_2',
            'After add Trend to Columns'
        );

        // When I open thresholds editor to edit the "2" metric in "Metrics" dropzone in Editor Panel
        await reportEditorPanel.openObjectContextMenuByIndex('Metrics', 2);
        await reportDatasetPanel.clickObjectContextMenuItem('Edit Thresholds...');

        // When I switch from advanced threshold editor to simple threshold editor and clear the thresholds in Report Editor
        await reportEditorPanel.switchAdvToSimThresholdWithClear();

        // When I switch from simple threshold editor to advanced threshold editor and apply the thresholds in threshold editor
        await thresholdEditor.switchSimToAdvThresholdWithApply();

        // And I save and close Advanced Thresholds Editor
        await thresholdEditor.saveAndCloseAdvancedThresholdEditor();
        await takeScreenshotByElement(
            reportGridView.getVisualizationViewPort('Visualization 1'),
            'TC85267_2',
            'After witch simple threshold to advanced'
        );

        // When I switch to "All" tab in dataset panel in Report Editor
        // await reportDatasetPanel.switchToAllTab();
        await reportDatasetPanel.selectMultipleItemsInObjectList(['Schema Objects', 'Attributes', 'Products']);

        // And I add the object "Subcategory" to Rows from Object Browser in Report Editor
        await reportDatasetPanel.addObjectToRows('Subcategory');

        // Then "attribute" object "Subcategory" should be added to "Rows" dropzone in Editor Panel
        await since(
            'After add Subcategory to Rows, The current selection for Rows dropzone "Subcategory" is expected to be present, instead we have #{actual}'
        )
            .expect(await reportEditorPanel.getObjectInDropzone('Rows', 'attribute', 'Subcategory'))
            .toBeTruthy();

        // And I drag header cell "Category" to page by
        await reportPageBy.moveGridHeaderToPageBy('Category');

        // When I open thresholds editor from the "attribute" "Subcategory" in "rows" dropzone in Editor Panel
        // await reportEditorPanel.openObjectContextMenu('Rows', 'attribute', 'Subcategory');
        // await reportDatasetPanel.clickObjectContextMenuItem('Threshold...');
        await reportEditorPanel.openThresholdInDropZoneForAttribute('Subcategory');

        // And I click New Threshold button to open the new threshold condition editor in advanced threshold editor
        await thresholdEditor.openNewThresholdCondition();

        // And I choose attribute "Category" as object from Based On dropdown
        await advancedFilter.selectObjectFromBasedOnDropdown('Category');

        // And I select elements "Movies" from the element list in the Advanced Threshold Editor
        await advancedFilter.doElementSelectionForAttributeFilter(['Movies']);

        // Then I click OK Button on New Qualification editor
        await advancedFilter.clickOnNewQualificationEditorOkButton();

        // When I select secondary option "Formatting" for threshold condition with index number "1"
        await thresholdEditor.selectSecondaryOptionInMenuForThresholdConditions('Formatting', 1);
        // And I set fill color to "Violet" in the format preview panel
        await thresholdEditor.setFillColor('Violet');

        // And I click check mark on Format Preview panel
        await thresholdEditor.clickOnCheckMarkOnFormatPreviewPanel();

        // And I save and close Advanced Thresholds Editor
        await thresholdEditor.saveAndCloseAdvancedThresholdEditor();
        await takeScreenshotByElement(
            reportGridView.getVisualizationViewPort('Visualization 1'),
            'TC85267_3',
            'After update threshold for Subcategory',
            {
                tolerance: 0.15,
            }
        );
        await takeScreenshotByElement(
            reportGridView.getVisualizationViewPort('Visualization 1'),
            'TC85267_4',
            'After select element "Movies" from Page by selector "Category"',
            {
                tolerance: 0.15,
            }
        );
    });
});
