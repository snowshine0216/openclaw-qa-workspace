import { lockPageSizeCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import resetDossierState from '../../../api/resetDossierState.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import {
    ConsumptionViewOptions,
    OptimizedForOptions,
} from '../../../pageObjects/authoring/DashboardFormattingPanel.js';

describe('26.01 lock page size view mode in authoring', () => {
    const dossier = {
        id: '00F3D6F28E427DC6D0DE3287BB2BF7D1',
        name: 'Auto_Zoom level for lock-page-size',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const browserWindow = {
        width: 1920,
        height: 1080,
    };

    const narrowBrowserWindow = {
        width: 1000,
        height: 1080,
    };

    const tutorialProject = 'MicroStrategy Tutorial';

    let {
        libraryPage,
        loginPage,
        dossierCreator,
        dossierEditorUtility,
        newGalleryPanel,
        libraryAuthoringPage,
        dossierAuthoringPage,
        contentsPanel,
        dossierTextField,
        formatPanel,
        toolbar,
        dashboardFormattingPanel,
        baseContainer,
        layerPanel,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(lockPageSizeCredentials);
        await setWindowSize(browserWindow);
    });

    it('[TC99180_5] New blank dashboard and change Optimized For option', async () => {
        await dossierCreator.createNewDossier();
        await dossierCreator.switchProjectByName(tutorialProject);
        await dossierCreator.clickBlankDossierBtn();
        await dossierAuthoringPage.checkNotShowAgain();
        await dossierAuthoringPage.actionOnToolbar('Visualization');
        await newGalleryPanel.selectViz('Grid');
        await browser.pause(2000); // wait for gird highlighted

        // default page view when lock page size is not enabled by default
        let vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'TC99180_5_1', 'Default blank dashboard page');

        await dashboardFormattingPanel.open();
        await browser.pause(2000); // wait for icon loaded out in format panel
        // take screenshot of the default setttings
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getDashboardFormattingPopUp(),
            'TC99180_5_2',
            'Default zoom level in new blank dashboard with lock page size disabled'
        );
        // open 'Optimized for' dropdown
        await dashboardFormattingPanel.clickLockPageSizeCheckBox();
        await dashboardFormattingPanel.openOptimizedForDropDown();
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getPopupList(),
            'TC99180_5_3',
            'Optimized for dropdown options'
        );

        await dashboardFormattingPanel.selectOptimizedForOption(OptimizedForOptions.SCREEN_4_3);
        await dashboardFormattingPanel.clickOkButton();

        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'TC99180_5_4', 'Screen 4:3 (1024x768)');

        await dashboardFormattingPanel.open();
        await dashboardFormattingPanel.openOptimizedForDropDown();
        await dashboardFormattingPanel.selectOptimizedForOption(OptimizedForOptions.IPAD_PRO_11);
        await dashboardFormattingPanel.clickOkButton();
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'TC99180_5_5', 'iPad Pro 11 inch (1210*701))');

        await dashboardFormattingPanel.open();
        await dashboardFormattingPanel.openOptimizedForDropDown();
        await dashboardFormattingPanel.selectOptimizedForOption(OptimizedForOptions.CUSTOM);
        await dashboardFormattingPanel.setCustomPageSize('700', '800');
        await dashboardFormattingPanel.clickOkButton();
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'TC99180_5_6', 'Custom size (700x800)');
    });

    it('[TC99180_6] Consumption option in dashboard formatting panel', async () => {
        await resetDossierState({
            credentials: lockPageSizeCredentials,
            dossier,
        });

        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1' });

        await dashboardFormattingPanel.open();
        await dashboardFormattingPanel.openConsumptionViewDropDown();
        await dashboardFormattingPanel.selectConsumptionViewOption(ConsumptionViewOptions.FILL_THE_VIEW);
        await dashboardFormattingPanel.clickOkButton();
        let viewMode = await dossierAuthoringPage.getCurrentChangeViewModeText();
        await expect(viewMode).toBe('Fit to View');
        await dossierAuthoringPage.saveAndOpen();
        let vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'TC99180_6_1', 'Fill the view');

        await libraryAuthoringPage.editDossierFromLibrary();
        await dashboardFormattingPanel.open();
        await dashboardFormattingPanel.openConsumptionViewDropDown();
        await dashboardFormattingPanel.selectConsumptionViewOption(ConsumptionViewOptions.ZOOM_TO_100_PERCENTAGE);
        await dashboardFormattingPanel.clickOkButton();
        viewMode = await dossierAuthoringPage.getCurrentChangeViewModeText();
        await expect(viewMode).toBe('Fit to View');
        await dossierAuthoringPage.saveAndOpen();
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'TC99180_6_2', 'Zoom to 100%');

        await libraryAuthoringPage.editDossierFromLibrary();
        await dashboardFormattingPanel.open();
        await dashboardFormattingPanel.openConsumptionViewDropDown();
        await dashboardFormattingPanel.selectConsumptionViewOption(ConsumptionViewOptions.FIT_TO_VIEW);
        await dashboardFormattingPanel.clickOkButton();
        viewMode = await dossierAuthoringPage.getCurrentChangeViewModeText();
        await expect(viewMode).toBe('Fit to View');
        await dossierAuthoringPage.saveAndOpen();
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'TC99180_6_3', 'Fit to view');
    });

    it('[TC99180_7] Change view mode under authoring', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Grids' });

        let viewMode = await dossierAuthoringPage.getCurrentChangeViewModeText();
        await expect(viewMode).toBe('Fit to View'); // when opening, it should be 'Fit to View'
        let vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(
            dossierAuthoringPage.getChangeViewModeButton(),
            'TC99180_7_1',
            'Authoring view mode button'
        );
        await takeScreenshotByElement(vizPanelContent, 'TC99180_7_2', 'Authoring page view in Fit to View mode');

        await dossierAuthoringPage.clickChangeViewModeButton();
        // take screenshot of the dropdown options
        await takeScreenshotByElement(
            await dossierAuthoringPage.getViewModeDropDownList(),
            'TC99180_7_3',
            'Authoring view mode dropdown options'
        );
        await dossierAuthoringPage.clickChangeViewModeButton(); // close dropdown
        // assert drop down closed
        const isDropDownDisplayed = await dossierAuthoringPage.getViewModeDropDownList().isDisplayed();
        await expect(isDropDownDisplayed).toBe(false);

        // change to different view modes one by one
        await dossierAuthoringPage.changeViewModeTo('100%');
        viewMode = await dossierAuthoringPage.getCurrentChangeViewModeText();
        await expect(viewMode).toBe('100%');
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'TC99180_7_4', 'Authoring page view in 100% mode');

        await dossierAuthoringPage.changeViewModeTo('Fill the View');
        viewMode = await dossierAuthoringPage.getCurrentChangeViewModeText();
        await expect(viewMode).toBe('Fill the View');
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'TC99180_7_5', 'Authoring page view in Fill to View mode');

        await dossierAuthoringPage.changeViewModeTo('150%');
        viewMode = await dossierAuthoringPage.getCurrentChangeViewModeText();
        await expect(viewMode).toBe('150%');
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'TC99180_7_6', 'Authoring page view in 150% mode');

        await dossierAuthoringPage.changeViewModeTo('50%');
        viewMode = await dossierAuthoringPage.getCurrentChangeViewModeText();
        await expect(viewMode).toBe('50%');
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'TC99180_7_7', 'Authoring page view in 50% mode');

        await dossierAuthoringPage.changeViewModeTo('200%');
        viewMode = await dossierAuthoringPage.getCurrentChangeViewModeText();
        await expect(viewMode).toBe('200%');
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'TC99180_7_8', 'Authoring page view in 200% mode');

        await dossierAuthoringPage.changeViewModeTo('25%');
        viewMode = await dossierAuthoringPage.getCurrentChangeViewModeText();
        await expect(viewMode).toBe('25%');
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'TC99180_7_9', 'Authoring page view in 25% mode');
    });

    it('[TC99180_8] Lock page size x-func of info window, group', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Info window' });
        await dossierTextField.clickTextFieldByTextContent('Target info window');
        let vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'TC99180_8_1', 'Info window opened when fit to view');

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Group X Y' });
        await dossierTextField.clickRichTextBoxByAriaLabel('Hello ');
        await formatPanel.switchToTitleAndContainerTab();
        let positionXInput = await formatPanel.getPositionXInput();
        await expect(await positionXInput.getValue()).toBe('6%');

        let positionYInput = await formatPanel.getPositionYInput();
        await expect(await positionYInput.getValue()).toBe('35%');

        let sizeWidthInput = await formatPanel.getSizeWidthInput();
        await expect(await sizeWidthInput.getValue()).toBe('9.22%');

        let sizeHeightInput = await formatPanel.getSizeHeightInput();
        await expect(await sizeHeightInput.getValue()).toBe('10.57%');

        // set X to 20%
        await formatPanel.setPositionXValue('20');
        // assert Y, width and height not changed
        positionYInput = await formatPanel.getPositionYInput();
        sizeWidthInput = await formatPanel.getSizeWidthInput();
        sizeHeightInput = await formatPanel.getSizeHeightInput();
        await expect(await positionYInput.getValue()).toBe('35%');
        await expect(await sizeWidthInput.getValue()).toBe('9.22%');
        await expect(await sizeHeightInput.getValue()).toBe('10.57%');

        // set Y to 20%
        await formatPanel.setPositionYValue('20');
        // assert width and height not changed
        positionXInput = await formatPanel.getPositionXInput();
        sizeWidthInput = await formatPanel.getSizeWidthInput();
        sizeHeightInput = await formatPanel.getSizeHeightInput();
        await expect(await positionXInput.getValue()).toBe('20%');
        await expect(await sizeWidthInput.getValue()).toBe('9.22%');
        await expect(await sizeHeightInput.getValue()).toBe('10.57%');

        // set Width to 25%
        await formatPanel.setSizeWidthValue('25');
        // assert height not changed
        positionXInput = await formatPanel.getPositionXInput();
        positionYInput = await formatPanel.getPositionYInput();
        sizeHeightInput = await formatPanel.getSizeHeightInput();
        await expect(await positionXInput.getValue()).toBe('20%');
        await expect(await positionYInput.getValue()).toBe('20%');
        await expect(await sizeHeightInput.getValue()).toBe('10.57%');

        // set Height to 30%
        await formatPanel.setSizeHeightValue('30');
        // assert X,Y,Width not changed
        positionXInput = await formatPanel.getPositionXInput();
        positionYInput = await formatPanel.getPositionYInput();
        sizeWidthInput = await formatPanel.getSizeWidthInput();
        await expect(await positionXInput.getValue()).toBe('20%');
        await expect(await positionYInput.getValue()).toBe('20%');
        await expect(await sizeWidthInput.getValue()).toBe('25%');

        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'TC99180_8_2', 'Changed position and size of group');
    });

    it('[TC99180_9] Lock page size x-func of responsive preview', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
        await toolbar.clickButtonFromToolbar('Responsive Preview');
        let vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'TC99180_9_1', 'Responsive preview');

        await takeScreenshotByElement(
            dossierAuthoringPage.getChangeViewModeButton(),
            'TC99180_9_2',
            'Authoring view mode button should be disabled'
        );
        await dossierAuthoringPage.clickChangeViewModeButton();
        // assert drop down not opened
        const isDropDownDisplayed = await dossierAuthoringPage.getViewModeDropDownList().isDisplayed();
        await expect(isDropDownDisplayed).toBe(false);
    });

    it('[TC99180_10] Lock page size x-func with insert and copy components', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'freeform layout' });
        await toolbar.createPanelStack();
        await layerPanel.clickOnContainerFromLayersPanel('Panel Stack 1');
        await formatPanel.switchToTitleAndContainerTab();

        let positionXInput = await formatPanel.getPositionXInput();
        console.log('Position X after insert panel stack:', await positionXInput.getValue());
        // can not use screenshot here, because position is not stable when insert or copy
        await since(`when insert panel stack, position X should be less than 40`)
            .expect(parseFloat(await positionXInput.getValue()))
            .toBeLessThan(40);

        let positionYInput = await formatPanel.getPositionYInput();
        await since(`when insert panel stack, position Y should be less than 40`)
            .expect(parseFloat(await positionYInput.getValue()))
            .toBeLessThan(40);

        let sizeWidthInput = await formatPanel.getSizeWidthInput();
        await since(`when insert panel stack, size width should be less than 60`)
            .expect(parseFloat(await sizeWidthInput.getValue()))
            .toBeLessThan(60);

        let sizeHeightInput = await formatPanel.getSizeHeightInput();
        console.log('Height after insert panel stack:', await sizeHeightInput.getValue());
        await since(`when insert panel stack, size height should be less than 60`)
            .expect(parseFloat(await sizeHeightInput.getValue()))
            .toBeLessThan(60);

        let maxX = parseFloat(await positionXInput.getValue()) + parseFloat(await sizeWidthInput.getValue());
        let maxY = parseFloat(await positionYInput.getValue()) + parseFloat(await sizeHeightInput.getValue());
        await since(`when insert panel stack, max X should be less than 100`).expect(maxX).toBeLessThan(100);
        await since(`when insert panel stack, max Y should be less than 100`).expect(maxY).toBeLessThan(100);

        // copy visualization in auto layout to freeform layout
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Info window' });
        await baseContainer.openContextMenu('Visualization 2');
        await baseContainer.selectContextMenuOption('Copy to');
        await baseContainer.selectSecondaryContextMenuOption('freeform layout');
        await formatPanel.switchToFormatPanel();
        await formatPanel.switchToTitleAndContainerTab();

        positionXInput = await formatPanel.getPositionXInput();
        console.log('Position X after copy from auto layout:', await positionXInput.getValue());
        await since(`when copy visualization, position X should be less than 50`)
            .expect(parseFloat(await positionXInput.getValue()))
            .toBeLessThan(50);

        positionYInput = await formatPanel.getPositionYInput();
        await since(`when copy visualization, position Y should be less than 60`)
            .expect(parseFloat(await positionYInput.getValue()))
            .toBeLessThan(60);

        sizeWidthInput = await formatPanel.getSizeWidthInput();
        console.log('Size width after copy in freeform layout:', await sizeWidthInput.getValue());
        await since(`when copy visualization, size width should be less than 50`)
            .expect(parseFloat(await sizeWidthInput.getValue()))
            .toBeLessThan(50);

        sizeHeightInput = await formatPanel.getSizeHeightInput();
        console.log('Height after copy from manual layout:', await sizeHeightInput.getValue());
        await since(`when copy visualization, size height should be less than 40`)
            .expect(parseFloat(await sizeHeightInput.getValue()))
            .toBeLessThan(40);
        maxX = parseFloat(await positionXInput.getValue()) + parseFloat(await sizeWidthInput.getValue());
        maxY = parseFloat(await positionYInput.getValue()) + parseFloat(await sizeHeightInput.getValue());
        await since(`when copy visualization, max X should be less than 100`).expect(maxX).toBeLessThan(100);
        await since(`when copy visualization, max Y should be less than 100`).expect(maxY).toBeLessThan(100);

        // copy visualization in freeform layout to freeform layout
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'freeform layout copy' });
        await baseContainer.openContextMenu('Visualization 4');
        await baseContainer.selectContextMenuOption('Copy to');
        await baseContainer.selectSecondaryContextMenuOption('freeform layout');
        await formatPanel.switchToFormatPanel();
        await formatPanel.switchToTitleAndContainerTab();

        positionXInput = await formatPanel.getPositionXInput();
        console.log('Position X after copy in freeform layout:', await positionXInput.getValue());
        await since(`when copy from freeform layout, position X should be less than 10`)
            .expect(parseFloat(await positionXInput.getValue()))
            .toBeLessThan(10);

        positionYInput = await formatPanel.getPositionYInput();
        await since(`when copy from freeform layout, position Y should be less than 30`)
            .expect(parseFloat(await positionYInput.getValue()))
            .toBeLessThan(30);

        sizeWidthInput = await formatPanel.getSizeWidthInput();
        await since(`when copy from freeform layout, size width should be less than 50`)
            .expect(parseFloat(await sizeWidthInput.getValue()))
            .toBeLessThan(50);

        sizeHeightInput = await formatPanel.getSizeHeightInput();
        console.log('Height after copy from freeform layout: ', await sizeHeightInput.getValue());
        await since(`when copy from freeform layout, size height should be less than 70`)
            .expect(parseFloat(await sizeHeightInput.getValue()))
            .toBeLessThan(70);
        maxX = parseFloat(await positionXInput.getValue()) + parseFloat(await sizeWidthInput.getValue());
        maxY = parseFloat(await positionYInput.getValue()) + parseFloat(await sizeHeightInput.getValue());
        await since(`when copy from freeform layout, max X should be less than 100`).expect(maxX).toBeLessThan(100);
        await since(`when copy from freeform layout, max Y should be less than 100`).expect(maxY).toBeLessThan(100);
    });

    it('[TC99180_11] Change page size under authoring', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'freeform layout' });
        // take screenshot of the page size button
        await takeScreenshotByElement(
            dossierAuthoringPage.getPageSizeButton(),
            'TC99180_11_1',
            'Authoring page size button'
        );
        await dossierAuthoringPage.changeViewModeTo('75%');

        await dossierAuthoringPage.clickPageSizeButton();
        // take screenshot of the page size button when opened
        await takeScreenshotByElement(
            dossierAuthoringPage.getPageSizeButton(),
            'TC99180_11_2',
            'Authoring page size button when focused'
        );
        // take screenshot of the dropdown options
        await takeScreenshotByElement(
            await dossierAuthoringPage.getPageSizeMenu(),
            'TC99180_11_3',
            'Authoring page size dropdown options'
        );
        await dossierAuthoringPage.clickPageSizeButton(); // close dropdown
        // assert drop down closed
        const isDropDownDisplayed = await dossierAuthoringPage.getPageSizeMenu().isDisplayed();
        await expect(isDropDownDisplayed).toBe(false);

        // unlock page size, change view mode setting will disappear
        await dossierAuthoringPage.clickPageSizeButton();
        await dossierAuthoringPage.selectPageSize(OptimizedForOptions.CUSTOM_IN_PAGE_SIZE);
        await dashboardFormattingPanel.clickLockPageSizeCheckBox();
        await dashboardFormattingPanel.clickOkButton();
        let isChangeViewModeButtonDisplayed = await dossierAuthoringPage.getChangeViewModeButton().isExisting();
        await expect(isChangeViewModeButtonDisplayed).toBe(false);

        await dossierAuthoringPage.clickPageSizeButton();
        // take screenshot of the dropdown options, should be Automatic selected
        await takeScreenshotByElement(
            await dossierAuthoringPage.getPageSizeMenu(),
            'TC99180_11_4',
            'Automatic should be selected'
        );
        await dossierAuthoringPage.selectPageSize(OptimizedForOptions.SCREEN_4_3);
        isChangeViewModeButtonDisplayed = await dossierAuthoringPage.getChangeViewModeButton().isExisting();
        await expect(isChangeViewModeButtonDisplayed).toBe(true);
        // assert change view mode is 75%
        let viewMode = await dossierAuthoringPage.getCurrentChangeViewModeText();
        await expect(viewMode).toBe('75%');
        // take screenshot of the page view
        let vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'TC99180_11_5', 'Authoring Screen 4:3 page view');

        // change page size to iPad Pro 11 inch
        await dossierAuthoringPage.clickPageSizeButton();
        await dossierAuthoringPage.selectPageSize(OptimizedForOptions.CUSTOM_IN_PAGE_SIZE);
        await dashboardFormattingPanel.openOptimizedForDropDown();
        await dashboardFormattingPanel.selectOptimizedForOption(OptimizedForOptions.IPAD_IPAD_AIR_11);
        await dashboardFormattingPanel.clickOkButton();
        // take screenshot of the page view
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'TC99180_11_6', 'Authoring iPad Air 11 page view');

        await dossierAuthoringPage.clickPageSizeButton();
        // take screenshot of the dropdown options, iPad & iPad Air 11-in. selected
        await takeScreenshotByElement(
            await dossierAuthoringPage.getPageSizeMenu(),
            'TC99180_11_7',
            'iPad & iPad Air 11-in. selected'
        );
        await dossierAuthoringPage.selectPageSize(OptimizedForOptions.WIDESCREEN);
        // take screenshot of the page view
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'TC99180_11_8', 'Authoring widescreen page view');

        await dossierAuthoringPage.clickPageSizeButton();
        // take screenshot of the dropdown options, iPad & iPad Air 11-in. should be gone
        await takeScreenshotByElement(
            await dossierAuthoringPage.getPageSizeMenu(),
            'TC99180_11_9',
            'Widescreen selected and iPad and iPad Air 11-in. option gone'
        );

        // set custome size
        await dossierAuthoringPage.selectPageSize(OptimizedForOptions.CUSTOM_IN_PAGE_SIZE);
        await dashboardFormattingPanel.openOptimizedForDropDown();
        await dashboardFormattingPanel.selectOptimizedForOption(OptimizedForOptions.CUSTOM);
        await dashboardFormattingPanel.setCustomPageSize('900', '1500');
        await dashboardFormattingPanel.clickOkButton();
        // take screenshot of the page view
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'TC99180_11_10', 'Authoring custom 900 X 1500 page view');

        await dossierAuthoringPage.clickPageSizeButton();
        // take screenshot of the dropdown options, Custom (900 X 1500) selected
        await takeScreenshotByElement(
            await dossierAuthoringPage.getPageSizeMenu(),
            'TC99180_11_11',
            'Custom (900 X 1500) selected'
        );
    });

    it('[TC99180_12] Narrow window - page size setting collapsed to more options', async () => {
        await dossierCreator.createNewDossier();
        await dossierCreator.switchProjectByName(tutorialProject);
        await dossierCreator.clickBlankDossierBtn();
        await dossierAuthoringPage.checkNotShowAgain();
        await dossierAuthoringPage.actionOnToolbar('Visualization');
        await newGalleryPanel.selectViz('Grid');

        let isChangeViewModeButtonDisplayed = await dossierAuthoringPage.getChangeViewModeButton().isExisting();
        await expect(isChangeViewModeButtonDisplayed).toBe(false);
        await dossierAuthoringPage.clickPageSizeButton();
        // take screenshot of the page size button when opened
        await takeScreenshotByElement(
            await dossierAuthoringPage.getPageSizeMenu(),
            'TC99180_12_1',
            'Automatic selected in page size menu when create blank dashboard'
        );
        await dossierAuthoringPage.clickPageSizeButton();

        await setWindowSize(narrowBrowserWindow);
        // check page size button hidden by assertion
        await expect(await dossierAuthoringPage.getPageSizeButton().isDisplayed()).toBe(false);

        await dossierAuthoringPage.actionOnToolbar('More');
        await takeScreenshotByElement(
            await dossierAuthoringPage.getPageSizeItemInMoreOptions(),
            'TC99180_12_2',
            'Page size option in more options menu'
        );

        await dossierAuthoringPage.clickPageSizeFromMoreOptions();
        // take screenshot of the page size button when opened
        await takeScreenshotByElement(
            await dossierAuthoringPage.getPageSizeItemInMoreOptions(),
            'TC99180_12_3',
            'Page size button focus status when opened'
        );

        await takeScreenshotByElement(await dossierAuthoringPage.getPageSizeMenu(), 'TC99180_12_4', 'Page size menu');

        await setWindowSize(browserWindow);
        await expect(await dossierAuthoringPage.getPageSizeButton().isDisplayed()).toBe(true);
        await takeScreenshotByElement(
            await dossierAuthoringPage.getPageSizeButton(),
            'TC99180_12_5',
            'Page size button showed when resize window to larger'
        );

        await setWindowSize(narrowBrowserWindow);
        await dossierAuthoringPage.actionOnToolbar('More');
        await dossierAuthoringPage.clickPageSizeFromMoreOptions();
        await dossierAuthoringPage.selectPageSize(OptimizedForOptions.SCREEN_4_3);
        // take page view screenshot
        let vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(
            vizPanelContent,
            'TC99180_12_6',
            'Page 4:3 view after set page size in narrow window'
        );

        await dossierAuthoringPage.actionOnToolbar('More');
        await dossierAuthoringPage.clickPageSizeFromMoreOptions();
        await takeScreenshotByElement(
            await dossierAuthoringPage.getPageSizeMenu(),
            'TC99180_12_7',
            'Screen 4:3 selected'
        );

        await dossierAuthoringPage.selectPageSize(OptimizedForOptions.CUSTOM_IN_PAGE_SIZE);
        await dashboardFormattingPanel.openOptimizedForDropDown();
        await dashboardFormattingPanel.selectOptimizedForOption(OptimizedForOptions.IPAD_MINI);
        await dashboardFormattingPanel.clickOkButton();
        await dossierAuthoringPage.actionOnToolbar('More');
        await dossierAuthoringPage.clickPageSizeFromMoreOptions();
        await takeScreenshotByElement(
            await dossierAuthoringPage.getPageSizeMenu(),
            'TC99180_12_8',
            'iPad Mini selected'
        );
    });
});
