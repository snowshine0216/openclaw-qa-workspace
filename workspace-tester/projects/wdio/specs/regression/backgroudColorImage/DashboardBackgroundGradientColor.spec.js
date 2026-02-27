import { dashboardsAutoCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('25.12 dashboard level background gradient color', () => {
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

    it('[TC99542_1] set dashboard level gradient color by saturation and hue slider, inverse and rotate', async () => {
        await dossierCreator.createNewDossier();
        await dossierCreator.switchProjectByName(tutorialProject);
        await dossierCreator.clickBlankDossierBtn();
        await dashboardFormattingPanel.open();
        // sleep to wait card/flat/preview image to show out
        await browser.pause(5000);

        // Change the background color to gradient color
        await dashboardFormattingPanel.clickRootPanelBgColorPicker();
        await dashboardFormattingPanel.clickGradientMode();
        // set color by saturation and hue slider
        await dashboardFormattingPanel.clickGradientStartButton();
        await dashboardFormattingPanel.clickColorSaturationArea(80, 20);
        await dashboardFormattingPanel.clickGradientEndButton();
        await dashboardFormattingPanel.clickHueSlider(10);
        await dashboardFormattingPanel.clickColorSaturationArea(70, 30);
        await takeScreenshotByElement(
            await libraryAuthoringPage.getDashboardFormattingPopUp(),
            'TC99542_1',
            'Set bg color to gradient - left red to right brown'
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
            'TC99542_1',
            'Page level format panel preview'
        );

        await toolbar.createPanelStack();
        await dossierAuthoringPage.actionOnToolbar('Visualization');
        await newGalleryPanel.selectViz('Grid');
        let vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'TC99542_1', 'Page rendering with gradient background');

        // create a new page and check the background color
        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Page');
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 2' });
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRootPanelBgColorPicker(),
            'TC99542_1',
            'New Page level format panel preview'
        );
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'TC99542_1', 'New page rendering with gradient background');

        // create a new chapter and check the background color
        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Chapter');
        await contentsPanel.goToPage({ chapterName: 'Chapter 2', pageName: 'Page 1' });
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRootPanelBgColorPicker(),
            'TC99542_1',
            'New chapter level format panel preview'
        );
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'TC99542_1', 'New chapter rendering with gradient background');

        // inverse Gradient
        await dashboardFormattingPanel.open();
        await dashboardFormattingPanel.clickRootPanelBgColorPicker();
        await dashboardFormattingPanel.clickGradientMode();
        await dashboardFormattingPanel.inverseGradient();
        await takeScreenshotByElement(
            await libraryAuthoringPage.getDashboardFormattingPopUp(),
            'TC99542_1',
            'Inverse gradient - left brown to right red'
        );
        await dashboardFormattingPanel.closeColorPickerPopover();
        await dashboardFormattingPanel.clickOkButton();

        await contentsPanel.goToPage({ chapterName: 'Chapter 2', pageName: 'Page 1' });
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRootPanelBgColorPicker(),
            'TC99542_1',
            'New chapter level format panel preview after Inverse gradient'
        );
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(
            vizPanelContent,
            'TC99542_1',
            'New chapter rendering with gradient background after Inverse gradient'
        );

        // rotate Gradient
        await dashboardFormattingPanel.open();
        await dashboardFormattingPanel.clickRootPanelBgColorPicker();
        await dashboardFormattingPanel.clickGradientMode();
        await dashboardFormattingPanel.rotateGradient();
        await takeScreenshotByElement(
            await libraryAuthoringPage.getDashboardFormattingPopUp(),
            'TC99542_1',
            'Rotate gradient - top brown to bottom red'
        );
        await dashboardFormattingPanel.closeColorPickerPopover();
        await dashboardFormattingPanel.clickOkButton();

        await contentsPanel.goToPage({ chapterName: 'Chapter 2', pageName: 'Page 1' });
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRootPanelBgColorPicker(),
            'TC99542_1',
            'New chapter level format panel preview after Rotate gradient'
        );
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(
            vizPanelContent,
            'TC99542_1',
            'New chapter rendering with gradient background after Rotate gradient'
        );

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await browser.pause(1000);
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1' }); // open page format panel
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRootPanelBgColorPicker(),
            'TC99542_1',
            'Chapter 1 page 1 format panel preview after Rotate gradient'
        );
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(
            vizPanelContent,
            'TC99542_1',
            'Chapter 1 page 1 rendering with gradient background after Rotate gradient'
        );
    });

    it('[TC99542_2] set dashboard level gradient color by Hex and RGB', async () => {
        await dossierCreator.createNewDossier();
        await dossierCreator.switchProjectByName(tutorialProject);
        await dossierCreator.clickBlankDossierBtn();
        await dashboardFormattingPanel.open();
        // sleep to wait card/flat/preview image to show out
        await browser.pause(5000);

        // Change the background color to gradient color
        await dashboardFormattingPanel.clickRootPanelBgColorPicker();
        await dashboardFormattingPanel.clickGradientMode();
        // set color by rgb value
        await dashboardFormattingPanel.setGradientStartColor('rgb(239, 192, 21)');
        await dashboardFormattingPanel.setGradientEndColor('rgb(44, 206, 68)');
        await dashboardFormattingPanel.clickGradientMode();
        await takeScreenshotByElement(
            await libraryAuthoringPage.getDashboardFormattingPopUp(),
            'TC99542_2',
            'Set gradient bg color by rgb value'
        );
        // set color by Hex
        await dashboardFormattingPanel.setGradientStartColor('#201C1C');
        await dashboardFormattingPanel.setGradientEndColor('#302ED5');
        await dashboardFormattingPanel.clickGradientMode();
        await takeScreenshotByElement(
            await libraryAuthoringPage.getDashboardFormattingPopUp(),
            'TC99542_2',
            'Set gradient bg color by Hex value'
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
            'TC99542_2',
            'Page level format panel preview'
        );

        let vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'TC99542_2', 'Page rendering with gradient background');

        // create a new page and check the background color
        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Page');
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 2' });
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRootPanelBgColorPicker(),
            'TC99542_2',
            'New Page level format panel preview'
        );
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'TC99542_2', 'New page rendering with gradient background');

        // create a new chapter and check the background color
        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Chapter');
        await contentsPanel.goToPage({ chapterName: 'Chapter 2', pageName: 'Page 1' });
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRootPanelBgColorPicker(),
            'TC99542_2',
            'New chapter level format panel preview'
        );
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'TC99542_2', 'New chapter rendering with gradient background');
    });

    it('[TC99542_3] set dashboard level to gradient color then to solid', async () => {
        await dossierCreator.createNewDossier();
        await dossierCreator.switchProjectByName(tutorialProject);
        await dossierCreator.clickBlankDossierBtn();
        await dashboardFormattingPanel.open();

        // Change the background to gradient color
        await dashboardFormattingPanel.clickRootPanelBgColorPicker();
        await dashboardFormattingPanel.clickGradientMode();
        // set color by rgb value
        await dashboardFormattingPanel.setGradientStartColor('rgb(239, 192, 21)');
        await dashboardFormattingPanel.setGradientEndColor('rgb(44, 206, 68)');
        await dashboardFormattingPanel.clickGradientMode();
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRootPanelBgColorPicker(),
            'TC99542_3',
            'Set gradient bg color by rgb value'
        );
        // set to solid color in palette mode
        await dashboardFormattingPanel.clickPaletteMode();
        await dashboardFormattingPanel.setColorByRGB('rgb(255, 255, 29)');
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRootPanelBgColorPicker(),
            'TC99542_3',
            'Background preview should be solid color'
        );

        // set to image
        await dashboardFormattingPanel.clickImageMode();
        let imageUrl = './Images/0.gif';
        await dashboardFormattingPanel.setImageBackground(imageUrl, 'Stretch');
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRootPanelBgColorPicker(),
            'TC99542_3',
            'Background preview should be image'
        );

        await dashboardFormattingPanel.clickGradientMode();
        // set color by rgb value
        await dashboardFormattingPanel.setGradientStartColor('rgb(239, 192, 21)');
        await dashboardFormattingPanel.setGradientEndColor('rgb(44, 206, 68)');
        await dashboardFormattingPanel.clickGradientMode();
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRootPanelBgColorPicker(),
            'TC99542_3',
            'Background preview should be gradient color'
        );
        await dashboardFormattingPanel.closeColorPickerPopover();
        await dashboardFormattingPanel.clickOkButton();

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1' }); // open page format panel
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRootPanelBgColorPicker(),
            'TC99542_3',
            'Chapter 1 page 1 format panel preview after Rotate gradient'
        );
        const vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(
            vizPanelContent,
            'TC99542_3',
            'Chapter 1 page 1 rendering with gradient background'
        );
    });
});
