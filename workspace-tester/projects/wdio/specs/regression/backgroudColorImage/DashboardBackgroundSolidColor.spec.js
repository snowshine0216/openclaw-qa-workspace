import { dashboardsAutoCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('25.12 dashboard level background solid color', () => {
    // const dossier = {
    //     id: 'EED0D836794A24C67AA5BAB9CC4081E3',
    //     name: 'Auto_Radius',
    //     project: {
    //         id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
    //         name: 'MicroStrategy Tutorial',
    //     },
    // };

    const browserWindow = {
        width: 1920,
        height: 1080,
    };

    const tutorialProject = 'MicroStrategy Tutorial';

    let {
        loginPage,
        dossierCreator,
        libraryAuthoringPage,
        dossierAuthoringPage,
        toolbar,
        contentsPanel,
        formatPanel,
        dossierEditorUtility,
        baseFormatPanelReact,
        dashboardFormattingPanel,
        newGalleryPanel,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(dashboardsAutoCredentials);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await baseFormatPanelReact.dismissColorPicker();
        await dashboardFormattingPanel.close();
        await dossierAuthoringPage.goToLibrary();
        const notSave = dossierAuthoringPage.getDoNotSaveButton();
        if (await notSave.isExisting()) {
            await dossierAuthoringPage.notSaveDossier();
        }
    });

    it('[TC99540_1] set dashboard background to solid color by default grid mode', async () => {
        await dossierCreator.createNewDossier();
        await dossierCreator.switchProjectByName(tutorialProject);
        await dossierCreator.clickBlankDossierBtn();
        await dashboardFormattingPanel.open();
        // sleep to wait card/flat/preview image to show out
        await browser.pause(10000);

        // Default should white
        const colorPreview = dashboardFormattingPanel.getRootPanelBgColorPreview();
        const defaultBackgroundColor = await colorPreview.getCSSProperty('background-color');
        await expect(defaultBackgroundColor.value).toBe('rgba(255,255,255,1)');

        // Change the background color to Ruby Red
        await dashboardFormattingPanel.clickRootPanelBgColorPicker();
        await dashboardFormattingPanel.selectColorByName('Ruby Red ###');
        const redBackgroundColor = await colorPreview.getCSSProperty('background-color');
        await expect(redBackgroundColor.value).toBe('rgba(193,41,47,1)');
        await takeScreenshotByElement(
            await libraryAuthoringPage.getDashboardFormattingPopUp(),
            'TC99540_1',
            'Background color picker popover and preview after selecting red color'
        );
        await dashboardFormattingPanel.closeColorPickerPopover();
        await dashboardFormattingPanel.clickOkButton();

        // open page format panel to check if the color is applied
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        // sleep to wait image to show out
        await browser.pause(3000);
        // get page level color preview element and check the color
        const pageColorPreview = formatPanel.getPageLevelColorPreview();
        const backgroundColor = await pageColorPreview.getCSSProperty('background-color');
        await expect(backgroundColor.value).toBe('rgba(193,41,47,1)');
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRootPanelBgColorPicker(),
            'TC99540_1',
            'Page level format panel should be Ruby Red'
        );

        let vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'TC99540_1', 'Page rendering with Ruby Red background');

        // create a new page and check the background color
        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Page');
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 2' });
        let newPageColorPreview = formatPanel.getPageLevelColorPreview();
        let newPageBackgroundColor = await newPageColorPreview.getCSSProperty('background-color');
        await expect(newPageBackgroundColor.value).toBe('rgba(193,41,47,1)');
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'TC99540_1', 'Create new page should be Ruby Red');

        // create a new chapter and check the background color
        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Chapter');
        await contentsPanel.goToPage({ chapterName: 'Chapter 2', pageName: 'Page 1' });
        newPageColorPreview = formatPanel.getPageLevelColorPreview();
        newPageBackgroundColor = await newPageColorPreview.getCSSProperty('background-color');
        await expect(newPageBackgroundColor.value).toBe('rgba(193,41,47,1)');
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'TC99540_1', 'New chapter should be Ruby Red');
    });

    it('[TC99540_2] set dashboard background color by palette mode', async () => {
        await dossierCreator.createNewDossier();
        await dossierCreator.switchProjectByName(tutorialProject);
        await dossierCreator.clickBlankDossierBtn();
        await dashboardFormattingPanel.open();
        // sleep to wait card/flat/preview image to show out
        await browser.pause(5000);

        // Change to palette mode
        await dashboardFormattingPanel.clickRootPanelBgColorPicker();
        await dashboardFormattingPanel.clickPaletteMode();
        // set color by saturation and hue slider
        await dashboardFormattingPanel.clickColorSaturationArea(90, 10);
        await dashboardFormattingPanel.clickAddToFavorite();
        await dashboardFormattingPanel.clickHueSlider(20);
        await dashboardFormattingPanel.clickColorSaturationArea(80, 30);
        await dashboardFormattingPanel.clickAddToFavorite();
        await takeScreenshotByElement(
            await libraryAuthoringPage.getDashboardFormattingPopUp(),
            'TC99540_2',
            'Set palette color by saturation and hue slider'
        );

        // set color by rgb value
        await dashboardFormattingPanel.setColorByRGB('rgb(225, 189, 29)');
        await dashboardFormattingPanel.clickAddToFavorite();
        await takeScreenshotByElement(
            await libraryAuthoringPage.getDashboardFormattingPopUp(),
            'TC99540_2',
            'Set palette color by RGB input'
        );
        // set color by Hex
        await dashboardFormattingPanel.setColorByHex('#cded15ff');
        await dashboardFormattingPanel.clickAddToFavorite();
        await takeScreenshotByElement(
            await libraryAuthoringPage.getDashboardFormattingPopUp(),
            'TC99540_2',
            'Set palette color by Hex input'
        );
        await dashboardFormattingPanel.closeColorPickerPopover();
        await dashboardFormattingPanel.clickOkButton();

        // open page format panel to check if the color is applied
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        // sleep to wait image to show out
        await browser.pause(3000);
        // get page level color preview element and check the color
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRootPanelBgColorPicker(),
            'TC99540_2',
            'Page level format panel preview'
        );

        await toolbar.createPanelStack();
        await dossierAuthoringPage.actionOnToolbar('Visualization');
        await newGalleryPanel.selectViz('Grid');
        let vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'TC99540_2', 'Page rendering with palette background');

        // create a new page and check the background color
        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Page');
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 2' });
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRootPanelBgColorPicker(),
            'TC99540_2',
            'New Page level format panel preview'
        );
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'TC99540_2', 'New page rendering with palette background');

        // create a new chapter and check the background color
        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Chapter');
        await contentsPanel.goToPage({ chapterName: 'Chapter 2', pageName: 'Page 1' });
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRootPanelBgColorPicker(),
            'TC99540_2',
            'New chapter level format panel preview'
        );
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'TC99540_2', 'New chapter rendering with palette background');

        // reopen color picker to check the palette settings
        await dashboardFormattingPanel.open();
        await dashboardFormattingPanel.clickRootPanelBgColorPicker();
        await takeScreenshotByElement(
            await libraryAuthoringPage.getDashboardFormattingPopUp(),
            'TC99540_2',
            'Reopen dashboard level color picker to check the palette settings'
        );

        await dashboardFormattingPanel.clickPaletteMode();
        // set color by saturation and hue slider
        await dashboardFormattingPanel.clickHueSlider(70);
        await dashboardFormattingPanel.clickColorSaturationArea(80, 10);
        await dashboardFormattingPanel.clickAddToFavorite();
        await takeScreenshotByElement(
            await libraryAuthoringPage.getDashboardFormattingPopUp(),
            'TC99540_2',
            'Set another palette color by saturation and hue slider'
        );
        await dashboardFormattingPanel.closeColorPickerPopover();
        await dashboardFormattingPanel.clickOkButton();

        await contentsPanel.goToPage({ chapterName: 'Chapter 2', pageName: 'Page 1' });
        await browser.pause(1000);
        await contentsPanel.goToPage({ chapterName: 'Chapter 2', pageName: 'Page 1' }); // to open page format panel
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRootPanelBgColorPicker(),
            'TC99540_2',
            'Check  page level format panel preview after changing palette color'
        );
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(
            vizPanelContent,
            'TC99540_2',
            'Check chapter rendering after changing palette color'
        );

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await browser.pause(1000);
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1' }); // to open page format panel
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRootPanelBgColorPicker(),
            'TC99540_2',
            'Change page to after changing palette color'
        );
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(
            vizPanelContent,
            'TC99540_2',
            'Change to another chapter page to after changing palette color'
        );
    });
});
