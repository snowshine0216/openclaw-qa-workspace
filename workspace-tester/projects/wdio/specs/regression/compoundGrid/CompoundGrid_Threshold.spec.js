import * as gridConstants from '../../../constants/grid.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { browserWindow } from '../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('Compound Grid Threshold Test', () => {
    let { loginPage, libraryPage, gridAuthoring, advancedFilter, thresholdEditor, editorPanelForGrid } =
        browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(gridConstants.gridTestUser);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
        await libraryPage.handleError();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC62631_08] Compound grid threshold test', async () => {
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.CompoundGridFormatting.id,
            projectId: gridConstants.CompoundGridFormatting.project.id,
        });

        await editorPanelForGrid.openAttributeThresholdsEditor('Item Category');
        await thresholdEditor.openNewThresholdCondition();
        await advancedFilter.selectObjectFromBasedOnDropdown('Item Category');
        await advancedFilter.doElementSelectionForAttributeFilter([
            'Action Movies',
            'Alternative Movies',
            'Audio Equipment',
        ]);
        await advancedFilter.clickOnNewQualificationEditorOkButton();
        await thresholdEditor.openFormatPreviewPanelByOrderNumber('1');
        await thresholdEditor.setFillColor('Light Blue');
        await thresholdEditor.clickOnOptionOnTheFontButtonBar('italic');
        await thresholdEditor.clickOnCheckMarkOnFormatPreviewPanel();
        await thresholdEditor.saveAndCloseAdvancedThresholdEditor();

        await takeScreenshotByElement(
            gridAuthoring.getGridContainer(),
            'CompoundGrid_Threshold_01',
            'Create Attribute Threshold',
            {
                tolerance: 0.4,
            }
        );
        await editorPanelForGrid.createThresholdForMetric({
            objectName: 'Cost',
            createFunction: async () => {
                await thresholdEditor.openAndSelectSimpleThresholdColorBand('Orange and Teal');
            },
        });

        await editorPanelForGrid.createThresholdForMetric({
            objectName: 'Revenue',
            createFunction: async () => {
                await thresholdEditor.openAndSelectSimpleThresholdColorBand('Lavender');
            },
        });

        await takeScreenshotByElement(
            gridAuthoring.getGridContainer(),
            'CompoundGrid_Threshold_02',
            'Create Metric Threshold',
            {
                tolerance: 0.4,
            }
        );

        await gridAuthoring.columnSetOperations.reOrderObjectsInColumnSet({
            objectName1: 'Revenue',
            columnSet1: 'Column Set 1',
            objectName2: 'Cost',
            columnSet2: 'Column Set 1',
            desPosition: 'above',
        });

        await takeScreenshotByElement(
            gridAuthoring.getGridContainer(),
            'CompoundGrid_Threshold_03',
            'Reorder Objects',
            {
                tolerance: 0.4,
            }
        );
    });
});
