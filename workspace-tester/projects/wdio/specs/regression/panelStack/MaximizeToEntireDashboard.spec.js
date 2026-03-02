import { dashboardsAutoCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import deleteObjectByNames from '../../../api/folderManagement/deleteObjectByNames.js';

describe('26.02 Maximize visualization to entire dashboard', () => {
    const maximizeDossier = {
        id: '3A74007E2744486F885F25BE9016CC77',
        name: 'Panel maximize04',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const maximizeToCurrentPanelDossier = {
        id: '5E476AA5F743438C0E499BB3ECB40A4C',
        name: 'Panel stack maximize01',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    const narrow720BrowserWindow = {
        width: 720,
        height: 1200,
    };

    const responsiveBrowserWindow = {
        width: 500,
        height: 1200,
    };

    let {
        libraryPage,
        dossierCreator,
        loginPage,
        libraryAuthoringPage,
        dossierPage,
        contentsPanel,
        toc,
        toolbar,
        dossierAuthoringPage,
        dossierEditorUtility,
        vizPanelForGrid,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(dashboardsAutoCredentials);
        await setWindowSize(browserWindow);
    });

    const tutorialProject = 'MicroStrategy Tutorial';

    it('[BCDA-7522_1] Maximize visualization to entire dashboard setting', async () => {
        await dossierCreator.createNewDossier();
        await dossierCreator.switchProjectByName(tutorialProject);
        await dossierCreator.clickBlankDossierBtn();
        await dossierAuthoringPage.checkNotShowAgain();
        await libraryAuthoringPage.openFileMenu();
        await libraryAuthoringPage.openDashboardPropertiesMenu();
        let maximizeVizOption = await libraryAuthoringPage.getMaximizeVisualizationRow();
        await takeScreenshotByElement(
            maximizeVizOption,
            'BCDA-7522_1_01',
            'Maximize visualization option in Dashboard Properties'
        );

        await libraryAuthoringPage.clickMaximizeVisualizationSelectColumn();
        let maximizeVizOptionList = await libraryAuthoringPage.getMaximizeVisualizationDropdownList();
        await takeScreenshotByElement(maximizeVizOptionList, 'BCDA-7522_1_02', 'Maximize visualization option list');
        await libraryAuthoringPage.clickMaximizeVisualizationOption('Maximize to entire dashboard');
        await takeScreenshotByElement(
            maximizeVizOption,
            'BCDA-7522_1_03',
            'Set maximize visualization to entire dashboard'
        );

        await libraryAuthoringPage.clickDashboardPropertiesOkButton();

        await toolbar.createPanelStack();
        await dossierAuthoringPage.saveAndOpen();
        const newDossierName = 'BCDA-7522_Maximize_Viz_to_Entire_Dashboard' + Math.random(1000);
        await dossierAuthoringPage.inputDossierNameAndSave(newDossierName);
        await dossierPage.waitForDossierLoading();
        await dossierAuthoringPage.closeSavedSuccessfullyToast();

        await dossierAuthoringPage.hoverOnPanelStack();
        await dossierAuthoringPage.clickMaxRestoreBtn();

        let dossierViewContainer = await dossierPage.getDossierView();
        await takeScreenshotByElement(dossierViewContainer, 'BCDA-7522_1_04', 'Maximize viz to entire dashboard');

        await dossierAuthoringPage.clickMaxRestoreBtn();
        await takeScreenshotByElement(dossierViewContainer, 'BCDA-7522_1_05', 'Restore viz from entire dashboard');
        await dossierPage.goToLibrary();

        await deleteObjectByNames({
            credentials: dashboardsAutoCredentials,
            projectId: maximizeDossier.project.id,
            parentFolderId: 'D3C7D461F69C4610AA6BAA5EF51F4125',
            names: [newDossierName],
        });
    });

    it('[BCDA-7522_2] Change maximize viz setting and maximize, redo, undo under authoring', async () => {
        await libraryPage.editDossierByUrl({
            projectId: maximizeDossier.project.id,
            dossierId: maximizeDossier.id,
        });

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await dossierAuthoringPage.hoverOnVisualizationByLabel('Visualization 1 in ps');
        await dossierAuthoringPage.clickMaxRestoreBtn();
        let vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'BCDA-7522_2_01', 'Maximize viz to entire dashboard');

        await libraryAuthoringPage.openFileMenu();
        await libraryAuthoringPage.openDashboardPropertiesMenu();
        await libraryAuthoringPage.selectMaximizeVisualizationCurrentPanel();
        await libraryAuthoringPage.clickDashboardPropertiesOkButton();
        await takeScreenshotByElement(vizPanelContent, 'BCDA-7522_2_02', 'Change setting will restore maximized viz');

        await toolbar.clickButtonFromToolbar('Undo');
        await takeScreenshotByElement(vizPanelContent, 'BCDA-7522_2_03', 'Undo - maximize to current panel');
        await dossierAuthoringPage.hoverOnVisualizationByLabel('Visualization 1 in PS 2');
        await dossierAuthoringPage.clickMaxRestoreBtn();

        await libraryAuthoringPage.openFileMenu();
        await libraryAuthoringPage.openDashboardPropertiesMenu();
        await libraryAuthoringPage.selectMaximizeVisualizationEntireDashboard();
        await libraryAuthoringPage.clickDashboardPropertiesOkButton();
        await takeScreenshotByElement(vizPanelContent, 'BCDA-7522_2_04', 'Change setting will restore maximized viz');

        await toolbar.clickButtonFromToolbar('Undo');
        await takeScreenshotByElement(vizPanelContent, 'BCDA-7522_2_05', 'Undo - maximize ps1 to entire dashboard');

        await toolbar.clickButtonFromToolbar('Undo');
        await takeScreenshotByElement(vizPanelContent, 'BCDA-7522_2_06', 'Undo - maximize to ps2 entire dashboard');

        await toolbar.clickButtonFromToolbar('Undo');
        await takeScreenshotByElement(vizPanelContent, 'BCDA-7522_2_07', 'Undo - all restore');

        await dossierAuthoringPage.hoverOnVisualizationByLabel('Viz in nested ps');
        await dossierAuthoringPage.clickMaxRestoreBtn();
        await takeScreenshotByElement(
            vizPanelContent,
            'BCDA-7522_2_08',
            'Maximize viz in nested ps to entire dashboard'
        );

        await libraryAuthoringPage.openFileMenu();
        await libraryAuthoringPage.openDashboardPropertiesMenu();
        await libraryAuthoringPage.selectMaximizeVisualizationCurrentPanel();
        await libraryAuthoringPage.clickDashboardPropertiesOkButton();
        await takeScreenshotByElement(vizPanelContent, 'BCDA-7522_2_09', 'Change setting will restore maximized viz');

        await dossierAuthoringPage.hoverOnVisualizationByLabel('Viz in nested ps');
        const isMaxRestoreBtnExisting = await (await dossierAuthoringPage.getMaxRestoreBtn()).isDisplayed();
        await expect(isMaxRestoreBtnExisting).toBe(false);

        await dossierAuthoringPage.goToLibrary();
        await dossierAuthoringPage.notSaveDossier();
    });

    it('[BCDA-7522_3] Maximize viz and manipulations', async () => {
        let url = browser.options.baseUrl + `app/${maximizeDossier.project.id}/${maximizeDossier.id}`;
        await libraryPage.openDossierByUrl(url.toString());
        await dossierPage.resetDossierIfPossible();

        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Single panel stack - 3 viz' });
        await dossierAuthoringPage.hoverOnVisualizationByLabel('Visualization 1');
        await dossierAuthoringPage.clickMaxRestoreBtn();
        let dossierViewContainer = await dossierPage.getDossierView();
        await takeScreenshotByElement(dossierViewContainer, 'BCDA-7522_3_01', 'Maximize viz 1 to entire dashboard');

        await vizPanelForGrid.keepOnlyElements('Books', 'Visualization 1');
        await dossierAuthoringPage.clickMaxRestoreBtn();
        await takeScreenshotByElement(dossierViewContainer, 'BCDA-7522_3_02', 'Restore after keep only elements');
    });

    it('[BCDA-7522_4] Single viz in panel on the page and iw', async () => {
        let url = browser.options.baseUrl + `app/${maximizeDossier.project.id}/${maximizeDossier.id}`;
        await libraryPage.openDossierByUrl(url.toString());
        await dossierPage.resetDossierIfPossible();

        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Single panel stack - 1 viz' });
        await dossierAuthoringPage.hoverOnVisualizationByLabel('Visualization 1');
        let isMaxRestoreBtnExisting = await (await dossierAuthoringPage.getMaxRestoreBtn()).isDisplayed();
        await expect(isMaxRestoreBtnExisting).toBe(false);

        await vizPanelForGrid.clickOnGridElement('Central', 'Visualization 1');
        await vizPanelForGrid.waitForInfoWindowSpinnerGone();
        await vizPanelForGrid.clickOnGridElement('Jan 2015', 'Vis in info window');
        isMaxRestoreBtnExisting = await (await dossierAuthoringPage.getMaxRestoreBtn()).isDisplayed();
        await expect(isMaxRestoreBtnExisting).toBe(false);
    });

    it('[BCDA-7522_5] Freeform layout and iw', async () => {
        let url = browser.options.baseUrl + `app/${maximizeDossier.project.id}/${maximizeDossier.id}`;
        await libraryPage.openDossierByUrl(url.toString());
        await dossierPage.resetDossierIfPossible();

        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Freeform layout + iw' });
        await dossierAuthoringPage.hoverOnVisualizationByLabel('Target iw');
        await dossierAuthoringPage.clickMaxRestoreBtn();

        await vizPanelForGrid.clickOnGridElement('Art As Experience', 'Target iw');
        await vizPanelForGrid.waitForInfoWindowSpinnerGone();

        await vizPanelForGrid.clickOnGridElement('Books', 'Visualization 1');
        let isMaxRestoreBtnExisting = await (await dossierAuthoringPage.getMaxRestoreBtn()).isDisplayed();
        await expect(isMaxRestoreBtnExisting).toBe(true);
        await dossierAuthoringPage.clickMaxRestoreBtn();
        let dossierViewContainer = await dossierPage.getDossierView();
        await takeScreenshotByElement(dossierViewContainer, 'BCDA-7522_5_01', 'Maximize info window viz');

        await vizPanelForGrid.clickOnGridElement('Art As Experience', 'Target iw'); // dismiss info window
        await dossierAuthoringPage.hoverOnVisualizationByLabel('Target iw');
        await dossierAuthoringPage.clickMaxRestoreBtn();
        await takeScreenshotByElement(dossierViewContainer, 'BCDA-7522_5_02', 'Restore viz from entire dashboard');

        await dossierAuthoringPage.hoverOnVisualizationByLabel('Visualization 3');
        await dossierAuthoringPage.clickMaxRestoreBtn();
        await takeScreenshotByElement(dossierViewContainer, 'BCDA-7522_5_03', 'Maximize freeform layout panel viz');

        await dossierAuthoringPage.clickMaxRestoreBtn();
        await takeScreenshotByElement(
            dossierViewContainer,
            'BCDA-7522_5_04',
            'Restore panel viz from entire dashboard'
        );

        // no maximize button in group viz in panel stack
        await dossierAuthoringPage.hoverOnVisualizationByLabel('Visualization 1 in group');
        isMaxRestoreBtnExisting = await (await dossierAuthoringPage.getMaxRestoreBtn()).isDisplayed();
        await expect(isMaxRestoreBtnExisting).toBe(false);
    });

    it('[BCDA-7522_6] Resize window', async () => {
        let url = browser.options.baseUrl + `app/${maximizeDossier.project.id}/${maximizeDossier.id}`;
        await libraryPage.openDossierByUrl(url.toString());
        await dossierPage.resetDossierIfPossible();

        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Nested panel stack + radius shadow' });
        await dossierAuthoringPage.clickTitleMaxRestoreBtn();
        await dossierPage.goToLibrary();

        await libraryPage.openDossierByUrl(url.toString());
        let dossierViewContainer = await dossierPage.getDossierView();
        await takeScreenshotByElement(
            dossierViewContainer,
            'BCDA-7522_6_01',
            'Close and reopen dossier with maximized viz'
        );

        await setWindowSize(narrow720BrowserWindow);
        dossierViewContainer = await dossierPage.getDossierView();
        await takeScreenshotByElement(dossierViewContainer, 'BCDA-7522_6_02', 'Narrow window');

        await setWindowSize(responsiveBrowserWindow);
        dossierViewContainer = await dossierPage.getDossierView();
        await takeScreenshotByElement(dossierViewContainer, 'BCDA-7522_6_03', 'Responsive');

        await dossierAuthoringPage.clickTitleMaxRestoreBtn();
        await takeScreenshotByElement(dossierViewContainer, 'BCDA-7522_6_04', 'Restore under responsive');

        await dossierAuthoringPage.clickTitleMaxRestoreBtn();
        await takeScreenshotByElement(dossierViewContainer, 'BCDA-7522_6_05', 'Maximize under responsive');
        await setWindowSize(browserWindow);
        await takeScreenshotByElement(dossierViewContainer, 'BCDA-7522_6_06', 'Back to normal window');

        await dossierAuthoringPage.clickTitleMaxRestoreBtn();
        await takeScreenshotByElement(dossierViewContainer, 'BCDA-7522_6_07', 'Restore under normal window');
    });

    it('[BCDA-7522_7] Change setting after maximize under consumption', async () => {
        // BCDA-8029
        await resetDossierState({
            credentials: dashboardsAutoCredentials,
            maximizeToCurrentPanelDossier,
        });
        // set to maximize to current panel firstly
        await libraryPage.editDossierByUrl({
            projectId: maximizeToCurrentPanelDossier.project.id,
            dossierId: maximizeToCurrentPanelDossier.id,
        });

        await libraryAuthoringPage.openFileMenu();
        await libraryAuthoringPage.openDashboardPropertiesMenu();
        await libraryAuthoringPage.selectMaximizeVisualizationCurrentPanel();
        await libraryAuthoringPage.clickDashboardPropertiesOkButton();
        await dossierAuthoringPage.saveAndOpen();
        await dossierPage.waitForDossierLoading();

        // maximize 2 viz in 2 panel stack
        await dossierAuthoringPage.hoverOnVisualizationByLabel('Viz in PS 1');
        await dossierAuthoringPage.clickMaxRestoreBtn();

        await dossierAuthoringPage.hoverOnVisualizationByLabel('Viz in PS 2');
        await dossierAuthoringPage.clickMaxRestoreBtn();
        await dossierPage.goToLibrary();

        // change setting to maximize to entire dashboard
        await libraryPage.editDossierByUrl({
            projectId: maximizeToCurrentPanelDossier.project.id,
            dossierId: maximizeToCurrentPanelDossier.id,
        });

        await libraryAuthoringPage.openFileMenu();
        await libraryAuthoringPage.openDashboardPropertiesMenu();
        await libraryAuthoringPage.selectMaximizeVisualizationEntireDashboard();
        await libraryAuthoringPage.clickDashboardPropertiesOkButton();
        await dossierAuthoringPage.saveAndOpen();
        await dossierPage.waitForDossierLoading();

        // back to consumption mode
        let dossierViewContainer = await dossierPage.getDossierView();
        await takeScreenshotByElement(
            dossierViewContainer,
            'BCDA-7522_7_01',
            'Change setting after maximize under consumption'
        );

        await dossierAuthoringPage.clickMaxRestoreBtn();
        await takeScreenshotByElement(
            dossierViewContainer,
            'BCDA-7522_7_02',
            'Restore 1 viz from entire dashboard after changing setting'
        );

        await dossierAuthoringPage.clickMaxRestoreBtn();
        await takeScreenshotByElement(dossierViewContainer, 'BCDA-7522_7_03', 'Restore another viz');
    });
});
