import * as gridConstants from '../../../constants/grid.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { FONTS } from '../../../pageObjects/common/FontPicker.js';
import { mockFeatureFlagOfSuppressMissingFontDialog } from '../../../api/mock/mock-response-utils.js';

describe('Monotype font test', () => {
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let {
        loginPage,
        libraryPage,
        newFormatPanelForGrid,
        libraryAuthoringPage,
        baseFormatPanelReact,
        baseFormatPanel,
        editorPanelForGrid,
        formatPanelForGridToolBox,
        thresholdEditor,
        advancedFilter,
        reportGridView,
        vizPanelForGrid,
        datasetPanel,
        baseVisualization,
        agGridVisualization,
        loadingDialog,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(gridConstants.gridUser);
        await setWindowSize(browserWindow);
    });

    it('[TC99424_01] Missing font dialog should pop up when enter authoring mode for a dashboard using monotype font', async () => {
        await mockFeatureFlagOfSuppressMissingFontDialog(false);
        // Edit dossier by its ID "C6568284CD442BFEDD48FB9C844EF0DD"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > Monotype in Grid Automation
        await libraryPage.editDossierByUrlwithMissingFont({
            projectId: gridConstants.Monotype_Dashboard.project.id,
            dossierId: gridConstants.Monotype_Dashboard.id,
        });
        // take screenshot of the missing font dialog
        await takeScreenshotByElement(libraryPage.getMissingFontPopup(), 'TC99424_01_01', 'Missing font dialog');
        // dismiss the missing font popup
        await libraryPage.dismissMissingFontPopup();
        // take screenshot of Visualization 1
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'TC99424_01_02',
            'Visualization 1 with fallback font'
        );
    });

    it('[TC99424_02] Missing font dialog should not pop up when feature flag is on', async () => {
        await mockFeatureFlagOfSuppressMissingFontDialog(true);
        await libraryPage.editDossierByUrlwithMissingFont({
            projectId: gridConstants.Monotype_Dashboard.project.id,
            dossierId: gridConstants.Monotype_Dashboard.id,
        });
        await since('The missing font dialog should not be displayed')
            .expect(await libraryPage.getMissingFontPopup().isExisting())
            .toBe(false);
    });

    it('[TC99424_03] Missing font dialog should not pop up when editing a dashboard without monotype font', async () => {
        await mockFeatureFlagOfSuppressMissingFontDialog(false);
        // Edit dossier by its ID "20C7746E39430C6FED851BB5D1512D4E"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > 25.07 Empty Dashboard
        await libraryPage.editDossierByUrlwithMissingFont({
            projectId: gridConstants.Not_Monotype_Dashboard.project.id,
            dossierId: gridConstants.Not_Monotype_Dashboard.id,
        });
        // check that the missing font dialog is not displayed
        await since('The missing font dialog should not be displayed')
            .expect(await libraryPage.getMissingFontPopup().isExisting())
            .toBe(false);
    });

    it('[TC99424_04] Missing font warning in format panel font picker', async () => {
        // Edit dossier by its ID "C6568284CD442BFEDD48FB9C844EF0DD"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > Monotype in Grid Automation
        await libraryPage.editDossierByUrlwithMissingFont({
            projectId: gridConstants.Monotype_Dashboard.project.id,
            dossierId: gridConstants.Monotype_Dashboard.id,
        });
        // dismiss the missing font popup
        await libraryPage.dismissMissingFontPopup();
        // check the font pick in the format panel
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        await baseFormatPanelReact.switchSection('Text and Form');
        await since(`Selected font should be #{expected}, instead we have #{actual}`)
            .expect(await newFormatPanelForGrid.fontPicker.getCurrentSelectedFont())
            .toBe(FONTS.Batang);
        await newFormatPanelForGrid.fontPicker.openFontPicker();
        await browser.pause(2000);
        await takeScreenshotByElement(
            newFormatPanelForGrid.fontPicker.getFontPickerDropdown(),
            'TC99424_04_01',
            'Font Picker'
        );
        await newFormatPanelForGrid.fontPicker.clickWarningIcon();
        await since(`Missing font tooltip should be shown in format panel font picker`)
            .expect(await newFormatPanelForGrid.fontPicker.getMissingFontTooltip().isDisplayed())
            .toBe(true);
        // take screenshot of the font warning tooltip
        await takeScreenshotByElement(
            newFormatPanelForGrid.fontPicker.getMissingFontTooltip(),
            'TC99424_04_02',
            'Missing font warning tooltip in format panel'
        );
    });

    it('[TC99424_05] Missing font warning in threshold font picker', async () => {
        // Edit dossier by its ID "C6568284CD442BFEDD48FB9C844EF0DD"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > Monotype in Grid Automation
        await libraryPage.editDossierByUrlwithMissingFont({
            projectId: gridConstants.Monotype_Dashboard.project.id,
            dossierId: gridConstants.Monotype_Dashboard.id,
        });
        // dismiss the missing font popup
        await libraryPage.dismissMissingFontPopup();
        // check the font pick in the threshold editor
        await agGridVisualization.openMenuItem('Flights Cancelled', 'Edit Thresholds...', 'Visualization 1');
        await thresholdEditor.openFormatPreviewPanelByOrderNumber('1');
        // open the font picker in the threshold editor
        await thresholdEditor.openFontFamilyDropdownMenu();
        // take screenshot of the font picker in the threshold editor
        await takeScreenshotByElement(
            thresholdEditor.getFontSelectorDropdown(),
            'TC99424_05_01',
            'Font Picker in Threshold Editor'
        );
        await thresholdEditor.fontPicker.clickWarningIcon();
        await since(`Missing font tooltip should be shown in threshold font picker`)
            .expect(await thresholdEditor.fontPicker.getMissingFontTooltip().isDisplayed())
            .toBe(true);
        await takeScreenshotByElement(
            thresholdEditor.fontPicker.getMissingFontTooltip(),
            'TC99424_05_02',
            'Missing font warning tooltip in threshold editor'
        );
        await thresholdEditor.closeThresholdEditor();
    });

    it('[TC99424_06] Missing font warning in format toolbox font picker', async () => {
        // Edit dossier by its ID "C6568284CD442BFEDD48FB9C844EF0DD"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > Monotype in Grid Automation
        await libraryPage.editDossierByUrlwithMissingFont({
            projectId: gridConstants.Monotype_Dashboard.project.id,
            dossierId: gridConstants.Monotype_Dashboard.id,
        });
        // dismiss the missing font popup
        await libraryPage.dismissMissingFontPopup();
        // Check the font pick in format tool box
        // select visualization 1
        await vizPanelForGrid.selectVizContainer('Visualization 1');
        // open the format tool box
        await vizPanelForGrid.openFormatToolBoxFromVisualizationTitle('Visualization 1');
        await formatPanelForGridToolBox.fontPicker.openFontPicker();
        // take screenshot of the font picker in the format toolbox
        await takeScreenshotByElement(
            formatPanelForGridToolBox.fontPicker.getFontPickerDropdown(),
            'TC99424_06_01',
            'Font Picker in Format Toolbox'
        );
        await formatPanelForGridToolBox.fontPicker.clickWarningIcon();
        await since(`Missing font tooltip should be shown in format toolbox font picker`)
            .expect(await formatPanelForGridToolBox.fontPicker.getMissingFontTooltip().isDisplayed())
            .toBe(true);
        await takeScreenshotByElement(
            formatPanelForGridToolBox.fontPicker.getMissingFontTooltip(),
            'TC99424_06_02',
            'Missing font warning tooltip in format toolbox'
        );
    });

    it('[TC99424_07] Missing font warning in dashboard formatting properties font picker', async () => {
        // Edit dossier by its ID "C6568284CD442BFEDD48FB9C844EF0DD"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > Monotype in Grid Automation
        await libraryPage.editDossierByUrlwithMissingFont({
            projectId: gridConstants.Monotype_Dashboard.project.id,
            dossierId: gridConstants.Monotype_Dashboard.id,
        });
        // dismiss the missing font popup
        await libraryPage.dismissMissingFontPopup();
        // check the font pick in dashboard formatting
        await libraryAuthoringPage.openDashboardFormatting();
        // wait 5s for the rendering
        await browser.pause(5000);
        await baseFormatPanel.openFontPickerForAllFonts();
        // take screenshot of dashboard formatting properties
        await browser.pause(2000);
        await takeScreenshotByElement(
            libraryAuthoringPage.getDashboardFormattingPopUp(),
            'TC99424_07_01',
            'Dashboard Formatting Font Picker for All Fonts'
        );
        await baseFormatPanel.openFontPickerForTitle();
        await browser.pause(2000);
        // take screenshot of dashboard formatting properties
        await takeScreenshotByElement(
            libraryAuthoringPage.getDashboardFormattingPopUp(),
            'TC99424_07_02',
            'Dashboard Formatting Font Picker for Title'
        );
    });

    it('[TC99424_08] Change to OOTB font in format panel', async () => {
        await mockFeatureFlagOfSuppressMissingFontDialog(false);
        // Edit dossier by its ID "C6568284CD442BFEDD48FB9C844EF0DD"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > Monotype in Grid Automation
        await libraryPage.editDossierByUrlwithMissingFont({
            projectId: gridConstants.Monotype_Dashboard.project.id,
            dossierId: gridConstants.Monotype_Dashboard.id,
        });
        // dismiss the missing font popup
        await libraryPage.dismissMissingFontPopup();
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        await baseFormatPanelReact.switchSection('Text and Form');
        await newFormatPanelForGrid.fontPicker.selectFontByName(FONTS.Roboto);
        await newFormatPanelForGrid.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await since(`Selected font should be #{expected}, instead we have #{actual}`)
            .expect(await newFormatPanelForGrid.fontPicker.getCurrentSelectedFont())
            .toBe(FONTS.Roboto);
        const fontFamily = await agGridVisualization.getGridCellStyleByPos(1, 1, 'font-family');
        await since(`Cell font should be #{expected}, instead we have #{actual}`)
            .expect(fontFamily)
            .toContain(FONTS.Roboto.toLowerCase());
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'TC99424_08_01',
            'Set to font Roboto'
        );
    });
});
