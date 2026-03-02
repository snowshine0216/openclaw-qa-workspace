import { dashboardsAutoCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('25.12 page level background color and image', () => {
    const bgImageVerticallyScroll = {
        id: '74FF6EAACA451D8B145BC9B372A0232F',
        name: 'Auto_bg_+vertical scrolling',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const bgColorLockPageSizeDossier = {
        id: '4D171A7871423688B2DF4BB042E5AA4A',
        name: 'Auto_bg color+lock page size',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const imageDeletedDossier = {
        id: '6CF02F4E3F413005F68F9699650C0741',
        name: 'Auto_bg - test delete image',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const browserWindow = {
        width: 1920,
        height: 1080,
    };

    const tutorialProject = 'MicroStrategy Tutorial';

    let {
        loginPage,
        libraryPage,
        dossierCreator,
        dossierAuthoringPage,
        baseContainer,
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

    it('[TC99543_1] set page level background color', async () => {
        await dossierCreator.createNewDossier();
        await dossierCreator.switchProjectByName(tutorialProject);
        await dossierCreator.clickBlankDossierBtn();
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        // sleep to wait icon in format panel to show out
        await browser.pause(3000);
        // Default should white
        let colorPreview = dashboardFormattingPanel.getRootPanelBgColorPreview();
        let backgroundColor = await colorPreview.getCSSProperty('background-color');
        await expect(backgroundColor.value).toBe('rgba(255,255,255,1)');

        // Change the background color to Ruby Red
        await formatPanel.clickPageLevelColorPicker();
        await browser.pause(2000); // wait icon to load in color picker popover
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRC3ColorPickerPopover(),
            'TC99543_1',
            'Page level color picker default state'
        );

        await dashboardFormattingPanel.selectColorByName('Ruby Red ###');
        colorPreview = dashboardFormattingPanel.getRootPanelBgColorPreview();
        const redBackgroundColor = await colorPreview.getCSSProperty('background-color');
        await expect(redBackgroundColor.value).toBe('rgba(193,41,47,1)');
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRC3ColorPickerPopover(),
            'TC99543_1',
            'Page level color should be Ruby Red'
        );
        await takeScreenshotByElement(
            await formatPanel.getFormatDetail(),
            'TC99543_1',
            'Color picker popover position in format panel'
        );
        await dashboardFormattingPanel.closeColorPickerPopover();

        await toolbar.createPanelStack();
        await dossierAuthoringPage.actionOnToolbar('Visualization');
        await newGalleryPanel.selectViz('Grid');
        let vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'TC99543_1', 'Page rendering with red background');

        // reopen page format panel to check the color preview and change color
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await formatPanel.clickPageLevelColorPicker();
        await dashboardFormattingPanel.selectColorByName('Violet ###');
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRootPanelBgColorPicker(),
            'TC99543_1',
            'Page level format panel should be Violet'
        );
        await baseContainer.clickOnContainerTitle('Visualization 1'); // to dismiss color picker popover

        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'TC99543_1', 'Page rendering with Violet color');

        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Page');
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 2' });
        colorPreview = dashboardFormattingPanel.getRootPanelBgColorPreview();
        backgroundColor = await colorPreview.getCSSProperty('background-color');
        await expect(backgroundColor.value).toBe('rgba(255,255,255,1)');

        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Chapter');
        await contentsPanel.goToPage({ chapterName: 'Chapter 2', pageName: 'Page 1' });
        colorPreview = dashboardFormattingPanel.getRootPanelBgColorPreview();
        backgroundColor = await colorPreview.getCSSProperty('background-color');
        await expect(backgroundColor.value).toBe('rgba(255,255,255,1)');

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await browser.pause(1000);
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1' }); // to open format panel and check the color preview
        colorPreview = dashboardFormattingPanel.getRootPanelBgColorPreview();
        backgroundColor = await colorPreview.getCSSProperty('background-color');
        await expect(backgroundColor.value).toBe('rgba(131,79,189,1)');
    });

    it('[TC99543_2] set page background with image', async () => {
        await dossierCreator.createNewDossier();
        await dossierCreator.switchProjectByName(tutorialProject);
        await dossierCreator.clickBlankDossierBtn();
        await toolbar.createPanelStack();
        await dossierAuthoringPage.actionOnToolbar('Visualization');
        await newGalleryPanel.selectViz('Grid');

        // Change to palette mode
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await formatPanel.clickPageLevelColorPicker();
        await dashboardFormattingPanel.clickImageMode();
        await browser.pause(2000); // wait icon to load in color picker popover
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRC3ColorPickerPopover(),
            'TC99543_2',
            'Page level color picker image mode default state'
        );

        const imageUrl =
            'https://images.contentstack.io/v3/assets/bltb564490bc5201f31/bltfca3027a7e89bc13/6787e4768c6f504919511797/strategy_logo_black.svg';
        await dashboardFormattingPanel.setImageBackground(imageUrl);
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRootPanelBgColorPicker(),
            'TC99543_2',
            'Page level background image should be set'
        );
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRC3ColorPickerPopover(),
            'TC99543_2',
            'Page level background color picker popover'
        );
        await baseContainer.clickOnContainerTitle('Visualization 1'); // to dismiss color picker popover
        let vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'TC99543_2', 'Page rendering with background image');

        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Chapter');
        await contentsPanel.goToPage({ chapterName: 'Chapter 2', pageName: 'Page 1' });
        let colorPreview = dashboardFormattingPanel.getRootPanelBgColorPreview();
        let defaultBackgroundColor = await colorPreview.getCSSProperty('background-color');
        await expect(defaultBackgroundColor.value).toBe('rgba(255,255,255,1)');

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await browser.pause(1000);
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1' }); // to open format panel and check the color preview
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRootPanelBgColorPicker(),
            'TC99543_2',
            'Page level background image should be kept'
        );
    });

    it('[TC99543_3] Undo and redo with change chapter and background color', async () => {
        // BCDA-7162 issue 2
        await libraryPage.editDossierByUrl({
            projectId: bgImageVerticallyScroll.project.id,
            dossierId: bgImageVerticallyScroll.id,
        });

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Fill Canvas' });

        await contentsPanel.goToPage({ chapterName: 'Chapter 2', pageName: 'Page 1' });
        await browser.pause(1000);
        await contentsPanel.goToPage({ chapterName: 'Chapter 2', pageName: 'Page 1' }); // to open format panel and check the color preview

        await formatPanel.clickPageLevelColorPicker();
        await dashboardFormattingPanel.clickSwatchesMode();
        await dashboardFormattingPanel.selectColorByName('Ruby Red ###');
        let colorPreview = dashboardFormattingPanel.getRootPanelBgColorPreview();
        let redBackgroundColor = await colorPreview.getCSSProperty('background-color');
        await expect(redBackgroundColor.value).toBe('rgba(193,41,47,1)');

        // undo twice
        await toolbar.clickButtonFromToolbar('Undo');
        await toolbar.clickButtonFromToolbar('Undo');

        // redo twice
        await toolbar.clickButtonFromToolbar('Redo');
        await toolbar.clickButtonFromToolbar('Redo');

        colorPreview = dashboardFormattingPanel.getRootPanelBgColorPreview();
        redBackgroundColor = await colorPreview.getCSSProperty('background-color');
        await expect(redBackgroundColor.value).toBe('rgba(193,41,47,1)');

        const vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(
            await vizPanelContent,
            'TC99543_3',
            'Undo and redo with change chapter and background color'
        );
    });

    it('[TC99543_4] Undo and redo with change chapter and background image', async () => {
        // BCDA-7162
        await libraryPage.editDossierByUrl({
            projectId: bgImageVerticallyScroll.project.id,
            dossierId: bgImageVerticallyScroll.id,
        });

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Fill Canvas' });

        await contentsPanel.goToPage({ chapterName: 'Chapter 2', pageName: 'Page 1' });
        await browser.pause(1000);
        await contentsPanel.goToPage({ chapterName: 'Chapter 2', pageName: 'Page 1' }); // to open format panel and check the color preview

        await formatPanel.clickPageLevelColorPicker();
        await dashboardFormattingPanel.clickImageMode();
        let imageUrl =
            'https://strategyagile.atlassian.net/s/a1kzh2/b/0/3da07e21fd67166c914d222dfd6db51d/_/jira-logo-scaled.png';
        await dashboardFormattingPanel.setImageBackground(imageUrl, 'Stretch');
        let previewImageUrl = await dashboardFormattingPanel.getImagePreviewUrl();
        await expect(previewImageUrl).toContain(imageUrl);

        // undo twice
        await toolbar.clickButtonFromToolbar('Undo');
        await toolbar.clickButtonFromToolbar('Undo');

        // redo twice
        await toolbar.clickButtonFromToolbar('Redo');
        await toolbar.clickButtonFromToolbar('Redo');
        previewImageUrl = await dashboardFormattingPanel.getImagePreviewUrl();
        await expect(previewImageUrl).toContain(imageUrl);

        const vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(
            await vizPanelContent,
            'TC99543_4',
            'Undo and redo with change chapter and background image'
        );
    });

    it('[TC99543_5] X-func: create page in lock page size and switch page', async () => {
        // BCDA-7173
        await libraryPage.editDossierByUrl({
            projectId: bgColorLockPageSizeDossier.project.id,
            dossierId: bgColorLockPageSizeDossier.id,
        });

        await contentsPanel.goToPage({ chapterName: 'Chapter 2', pageName: 'Page 1' });
        await contentsPanel.clickOptionOnChapterMenu('Chapter 2', 'Insert Page');
        await browser.pause(1000);
        await contentsPanel.goToPage({ chapterName: 'Chapter 2', pageName: 'Page 2' }); // to open format panel and check the color preview
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRootPanelBgColorPicker(),
            'TC99543_5',
            'Page level color when creating new page in lock page size dossier'
        );
        let vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(
            await vizPanelContent,
            'TC99543_5',
            'page rendering when creating new page in lock page size dossier'
        );

        // change page 1 background color to red and switch page to check the color
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Fill Canvas' });
        await browser.pause(1000);
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Fill Canvas' });
        await formatPanel.clickPageLevelColorPicker();
        await dashboardFormattingPanel.clickSwatchesMode();
        await dashboardFormattingPanel.selectColorByName('Ruby Red ###');
        let colorPreview = dashboardFormattingPanel.getRootPanelBgColorPreview();
        let redBackgroundColor = await colorPreview.getCSSProperty('background-color');
        await expect(redBackgroundColor.value).toBe('rgba(193,41,47,1)');

        // switch to page 2 and switch page back to check the color preview
        await contentsPanel.goToPage({ chapterName: 'Chapter 2', pageName: 'Page 2' });
        await browser.pause(500);
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Fill Canvas' });
        await browser.pause(1000);
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Fill Canvas' });
        colorPreview = dashboardFormattingPanel.getRootPanelBgColorPreview();
        redBackgroundColor = await colorPreview.getCSSProperty('background-color');
        await expect(redBackgroundColor.value).toBe('rgba(193,41,47,1)');

        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(await vizPanelContent, 'TC99543_5', 'Page rendering should be red');
    });

    it('[TC99543_6] X-func: maximize viz', async () => {
        // BCDA-7207
        await libraryPage.editDossierByUrl({
            projectId: bgImageVerticallyScroll.project.id,
            dossierId: bgImageVerticallyScroll.id,
        });

        await contentsPanel.goToPage({ chapterName: 'Chapter 2', pageName: 'Page 1' });
        await baseContainer.clickOnContainerTitle('Grid');
        await baseContainer.clickMaximizeBtn();
        const vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(
            await vizPanelContent,
            'TC99543_6',
            'Maximized viz panel should not have background image but page color'
        );
    });

    it('[TC99543_7] X-func: image deleted', async () => {
        // BCDA-7132
        await libraryPage.editDossierByUrl({
            projectId: imageDeletedDossier.project.id,
            dossierId: imageDeletedDossier.id,
        });

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRootPanelBgColorPicker(),
            'TC99543_7',
            'Failed to load image preview'
        );
    });
});
