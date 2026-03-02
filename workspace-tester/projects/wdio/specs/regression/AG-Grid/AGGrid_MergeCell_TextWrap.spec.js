import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import * as gridConstants from '../../../constants/grid.js';
import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';

describe('AGGrid_MergeCell_TextWrap', () => {
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let {
        loginPage,
        dossierPage,
        libraryPage,
        agGridVisualization,
        toc,
        newFormatPanelForGrid,
        baseFormatPanelReact,
        reportFormatPanel,
        editorPanel,
        formatPanel,
        contentsPanel,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(gridConstants.gridUser);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC99372_1] Merge cell for row header and wrap text in authoring mode', async () => {
        // Open the dossier
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGrid_Wrap_MergeCell.project.id,
            dossierId: gridConstants.AGGrid_Wrap_MergeCell.id,
        });
        await contentsPanel.goToPage({ chapterName: 'Wrap', pageName: 'MergeCell_TTTT' });

        //The container "MergeCell_TTTT" should be selected
        await agGridVisualization.clickOnContainerTitle('MergeCell_TTTT');
        await takeScreenshotByElement(
            agGridVisualization.getContainer('MergeCell_TTTT'),
            'TC99372_1_1',
            'Merge Row headers and wrap entire grid'
        );

        await editorPanel.switchToEditorPanel();
        await formatPanel.switchToFormatPanel();
        await baseFormatPanelReact.switchToGeneralSettingsTab();
        await newFormatPanelForGrid.expandLayoutSection();

        await since('Merge repetitive cells in Row headers should be enabled, instead we have #{actual}')
            .expect(await reportFormatPanel.getCheckedCheckbox('Row headers', 'Merge repetitive cells').isDisplayed())
            .toBe(true);

        await baseFormatPanelReact.switchSection('Text and Form');
        // Uncheck "Wrap text" for "Entire Grid"
        await newFormatPanelForGrid.disableWrapText();
        await takeScreenshotByElement(
            agGridVisualization.getContainer('MergeCell_TTTT'),
            'TC99372_1_2',
            'Merge Row headers and unwrap entire grid'
        );
        await baseFormatPanelReact.changeSegmentControl('Entire Grid', 'Column Headers');
        await newFormatPanelForGrid.enableWrapText();
        await takeScreenshotByElement(
            agGridVisualization.getContainer('MergeCell_TTTT'),
            'TC99372_1_3',
            'Merge Row headers and wrap column headers only'
        );
        await newFormatPanelForGrid.disableWrapText();

        await baseFormatPanelReact.changeSegmentControl('Column Headers', 'Row Headers');
        await newFormatPanelForGrid.enableWrapText();
        await takeScreenshotByElement(
            agGridVisualization.getContainer('MergeCell_TTTT'),
            'TC99372_1_4',
            'Merge Row headers and wrap row headers only'
        );
        await newFormatPanelForGrid.disableWrapText();

        await baseFormatPanelReact.changeSegmentControl('Row Headers', 'Values');
        await newFormatPanelForGrid.enableWrapText();
        await takeScreenshotByElement(
            agGridVisualization.getContainer('MergeCell_TTTT'),
            'TC99372_1_5',
            'Merge Row headers and wrap values only'
        );
        await newFormatPanelForGrid.disableWrapText();

        await baseFormatPanelReact.switchToGeneralSettingsTab();
        // Uncheck "Merge repetitive cells" for "Row headers"
        await reportFormatPanel.clickCheckBoxForOption('Row headers', 'Merge repetitive cells');
        await takeScreenshotByElement(
            agGridVisualization.getContainer('MergeCell_TTTT'),
            'TC99372_1_6',
            'Unmerge Row headers and unwrap entire grid'
        );
        await baseFormatPanelReact.switchSection('Text and Form');
        await newFormatPanelForGrid.enableWrapText();
        await takeScreenshotByElement(
            agGridVisualization.getContainer('MergeCell_TTTT'),
            'TC99372_1_7',
            'Unmerge Row headers and wrap valuses only'
        );
        await newFormatPanelForGrid.disableWrapText();

        await baseFormatPanelReact.changeSegmentControl('Values', 'Row Headers');
        await newFormatPanelForGrid.enableWrapText();
        await takeScreenshotByElement(
            agGridVisualization.getContainer('MergeCell_TTTT'),
            'TC99372_1_8',
            'Unmerge Row headers and wrap row headers only'
        );
        await newFormatPanelForGrid.disableWrapText();

        await baseFormatPanelReact.changeSegmentControl('Row Headers', 'Column Headers');
        await newFormatPanelForGrid.enableWrapText();
        await takeScreenshotByElement(
            agGridVisualization.getContainer('MergeCell_TTTT'),
            'TC99372_1_9',
            'Unmerge Row headers and wrap column headers only'
        );
        await newFormatPanelForGrid.disableWrapText();

        await baseFormatPanelReact.changeSegmentControl('Column Headers', 'Entire Grid');
        await newFormatPanelForGrid.enableWrapText();
        await takeScreenshotByElement(
            agGridVisualization.getContainer('MergeCell_TTTT'),
            'TC99372_1_10',
            'Unmerge Row headers and wrap entire grid'
        );
    });

    it('[TC99372_2] Merge cell for row header and wrap text in consumption mode', async () => {
        await resetDossierState({
            credentials: gridConstants.gridUser,
            dossier: gridConstants.AGGrid_Wrap_MergeCell,
        });
        await libraryPage.openDossierById({
            projectId: gridConstants.AGGrid_Wrap_MergeCell.project.id,
            dossierId: gridConstants.AGGrid_Wrap_MergeCell.id,
        });
        await toc.openPageFromTocMenu({ chapterName: 'Wrap', pageName: 'MergeCell_TTTT' });
        await dossierPage.hidePageIndicator();
        await takeScreenshotByElement(
            agGridVisualization.getContainer('MergeCell_TTTT'),
            'TC99372_2_1',
            'Merge cell for row header and wrap text for entire grid'
        );

        await toc.openPageFromTocMenu({ chapterName: 'Wrap', pageName: 'UnmergeCell_TTTT' });
        await dossierPage.hidePageIndicator();
        await takeScreenshotByElement(
            agGridVisualization.getContainer('UnmergeCell_TTTT'),
            'TC99372_2_2',
            'Unmerge cell for row header and wrap text for entire grid'
        );

        await toc.openPageFromTocMenu({ chapterName: 'Wrap', pageName: 'MergeCell_FFFF' });
        await dossierPage.hidePageIndicator();
        await takeScreenshotByElement(
            agGridVisualization.getContainer('MergeCell_FFFF'),
            'TC99372_2_3',
            'Merge cell for row header and unwrap text for entire grid'
        );

        await toc.openPageFromTocMenu({ chapterName: 'Wrap', pageName: 'UnmergeCell_FFFF' });
        await dossierPage.hidePageIndicator();
        await takeScreenshotByElement(
            agGridVisualization.getContainer('UnmergeCell_FFFF'),
            'TC99372_2_4',
            'Unmerge cell for row header and unwrap text for entire grid'
        );

        await toc.openPageFromTocMenu({ chapterName: 'Wrap', pageName: 'MergeCell_FTFF' });
        await dossierPage.hidePageIndicator();
        await takeScreenshotByElement(
            agGridVisualization.getContainer('MergeCell_FTFF'),
            'TC99372_2_5',
            'Merge cell for row header and wrap text for column headers only'
        );

        await toc.openPageFromTocMenu({ chapterName: 'Wrap', pageName: 'UnmergeCell_FTFF' });
        await dossierPage.hidePageIndicator();
        await takeScreenshotByElement(
            agGridVisualization.getContainer('UnmergeCell_FTFF'),
            'TC99372_2_6',
            'Unmerge cell for row header and wrap text for column headers only'
        );

        await toc.openPageFromTocMenu({ chapterName: 'Wrap', pageName: 'MergeCell_FFTF' });
        await dossierPage.hidePageIndicator();
        await takeScreenshotByElement(
            agGridVisualization.getContainer('MergeCell_FFTF'),
            'TC99372_2_7',
            'Merge cell for row header and wrap text for row headers only'
        );

        await toc.openPageFromTocMenu({ chapterName: 'Wrap', pageName: 'UnmergeCell_FFTF' });
        await dossierPage.hidePageIndicator();
        await takeScreenshotByElement(
            agGridVisualization.getContainer('UnmergeCell_FFTF'),
            'TC99372_2_8',
            'Unmerge cell for row header and wrap text for row headers only'
        );

        await toc.openPageFromTocMenu({ chapterName: 'Wrap', pageName: 'MergeCell_FFFT' });
        await dossierPage.hidePageIndicator();
        await takeScreenshotByElement(
            agGridVisualization.getContainer('MergeCell_FFFT'),
            'TC99372_2_9',
            'Merge cell for row header and wrap text for values only'
        );

        await toc.openPageFromTocMenu({ chapterName: 'Wrap', pageName: 'UnmergeCell_FFFT' });
        await dossierPage.hidePageIndicator();
        await takeScreenshotByElement(
            agGridVisualization.getContainer('UnmergeCell_FFFT'),
            'TC99372_2_10',
            'Unmerge cell for row header and wrap text for values only'
        );
    });

    it('[BCIN-5338]The column context menu cannot work well after do manipulation on aggrid', async () => {
        // Precondition: Open dashboard with setting "Merge repetitive cells" for Row headers unchecked
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGrid_ReCreate.project.id,
            dossierId: gridConstants.AGGrid_ReCreate.id,
        });
        // Go to page 'Hide Column'
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Hide Column' });

        //  Hide Column for "Day of Week"
        await agGridVisualization.openContextMenuItemForHeader('Day of Week', 'Hide Column', 'AG Grid');
        // Take screenshot after hiding the column
        await takeScreenshotByElement(
            agGridVisualization.getContainer('AG Grid'),
            'BCIN-5338_01',
            'AG Grid after hiding column "Day of Week"'
        );
        // Click on the context menu of another column and select option "Unhide All Columns"
        await agGridVisualization.openContextMenuItemForHeader('Airline Name', 'Unhide All Columns', 'AG Grid');
        await takeScreenshotByElement(
            agGridVisualization.getContainer('AG Grid'),
            'BCIN-5338_02',
            'AG Grid after unhiding column "Day of Week"'
        );

        // Pin column "Day of Week" to left
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Day of Week',
            'Pin Column',
            'to the Left',
            'AG Grid'
        );
        await takeScreenshotByElement(
            agGridVisualization.getContainer('AG Grid'),
            'BCIN-5338_03',
            'AG Grid after pinning column "Day of Week" to left'
        );
        // Pin column "Day of Week" to right
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Day of Week',
            'Pin Column',
            'to the Right',
            'AG Grid'
        );
        await takeScreenshotByElement(
            agGridVisualization.getContainer('AG Grid'),
            'BCIN-5338_04',
            'AG Grid after pinning column "Day of Week" to right'
        );
        // Unpin column "Day of Week"
        await agGridVisualization.openContextMenuItemForHeader('Day of Week', 'Unpin All Columns', 'AG Grid');
        await takeScreenshotByElement(
            agGridVisualization.getContainer('AG Grid'),
            'BCIN-5338_05',
            'AG Grid after unpinning column "Day of Week"'
        );

        // Lock row header
        await editorPanel.switchToEditorPanel();
        await formatPanel.switchToFormatPanel();
        await newFormatPanelForGrid.expandLayoutSection();
        await newFormatPanelForGrid.clickCheckBox('Lock headers');
        // Sort by 'Year'
        await agGridVisualization.openContextMenuItemForHeader('Year', 'Sort Descending', 'AG Grid');
        await takeScreenshotByElement(
            agGridVisualization.getContainer('AG Grid'),
            'BCIN-5338_06',
            'AG Grid after locking row header and sorting by "Year" descending'
        );
        // Unlock row header
        await newFormatPanelForGrid.clickCheckBox('Lock headers');
        await agGridVisualization.openContextMenuItemForHeader('Year', 'Sort Ascending', 'AG Grid');
        await takeScreenshotByElement(
            agGridVisualization.getContainer('AG Grid'),
            'BCIN-5338_07',
            'AG Grid after unlocking row header and sorting by "Year" ascending'
        );
    });

    it('[BCIN-5689_01]Support wrap in outline compact mode', async () => {
        // compact mode: support column headers(already supported), values wrap text, not support row headers wrap text
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGrid_Wrap_MergeCell.project.id,
            dossierId: gridConstants.AGGrid_Wrap_MergeCell.id,
        });
        await contentsPanel.goToPage({ chapterName: 'Wrap', pageName: 'Outline Compact' });
        await agGridVisualization.clickOnContainerTitle('Visualization 1');
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'BCIN-5689_01_1',
            'Wrap Column header and value in outline compact mode'
        );
        // switch to format panel to show the wrap text setting
        await editorPanel.switchToEditorPanel();
        await formatPanel.switchToFormatPanel();
        await baseFormatPanelReact.switchSection('Text and Form');
        await since('The wrap text setting for Entire Grid should not be present')
            .expect(await newFormatPanelForGrid.getCheckBox('Wrap text').isExisting())
            .toBe(false);
        await baseFormatPanelReact.changeSegmentControl('Entire Grid', 'Column Headers');
        await newFormatPanelForGrid.disableWrapText();
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'BCIN-5689_01_2',
            'Unwrap Column header and wrap value in outline compact mode'
        );
        await baseFormatPanelReact.changeSegmentControl('Column Headers', 'Row Headers');
        await since('The wrap text setting for Row Headers should not be present')
            .expect(await newFormatPanelForGrid.getCheckBox('Wrap text').isExisting())
            .toBe(false);
        await baseFormatPanelReact.changeSegmentControl('Row Headers', 'Values');
        await newFormatPanelForGrid.disableWrapText();
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'BCIN-5689_01_3',
            'Unwrap Column header and value in outline compact mode'
        );
    });

    it('[BCIN-5689_02]Support wrap in outline standard mode', async () => {
        // standard mode: support column headers(already supported), values and row headers wrap text
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGrid_Wrap_MergeCell.project.id,
            dossierId: gridConstants.AGGrid_Wrap_MergeCell.id,
        });
        await contentsPanel.goToPage({ chapterName: 'Wrap', pageName: 'Outline Standard' });
        await agGridVisualization.clickOnContainerTitle('Visualization 1');
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'BCIN-5689_02_1',
            'Wrap Entire Grid in outline standard mode'
        );
        // switch to format panel to show the wrap text setting
        await editorPanel.switchToEditorPanel();
        await formatPanel.switchToFormatPanel();
        await baseFormatPanelReact.switchSection('Text and Form');
        await since('The wrap text setting for Entire Grid should be present')
            .expect(await newFormatPanelForGrid.getCheckBox('Wrap text').isExisting())
            .toBe(true);
        await baseFormatPanelReact.changeSegmentControl('Entire Grid', 'Column Headers');
        await newFormatPanelForGrid.disableWrapText();
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'BCIN-5689_02_2',
            'Unwrap Column header and wrap Row Headers and Values in outline standard mode'
        );
        await baseFormatPanelReact.changeSegmentControl('Column Headers', 'Row Headers');
        await newFormatPanelForGrid.disableWrapText();
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'BCIN-5689_02_3',
            'Unwrap Column header, Row Headers and wrap Values in outline standard mode'
        );
        await baseFormatPanelReact.changeSegmentControl('Row Headers', 'Values');
        await newFormatPanelForGrid.disableWrapText();
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'BCIN-5689_02_4',
            'Unwrap Column header, Row Headers and Values in outline standard mode'
        );
    });
});
