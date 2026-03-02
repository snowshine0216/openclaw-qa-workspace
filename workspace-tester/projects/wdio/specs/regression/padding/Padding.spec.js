import { dashboardsAutoCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('25.09 padding', () => {
    const dossier = {
        id: '9110806064488F2E449ADA90574B4910',
        name: 'Auto_Padding',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dossierLockPageSize = {
        id: 'ED72FF666244BB3D3AFD05B07D00C65E',
        name: 'Auto_Padding_Lock Page size_FitView_1920*1080',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dossierLockPageSizeFillView = {
        id: 'D176D3EBD9499D88FAFF90875B747D52',
        name: 'Auto_Padding_Lock Page size_FillView_1920*1080',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const browserWindow = {
        width: 1920,
        height: 1080,
    };

    const browserWindow2 = {
        width: 1720,
        height: 1080,
    };

    const browserWindow3 = {
        width: 2020,
        height: 1080,
    };

    let {
        libraryPage,
        loginPage,
        dossierPage,
        contentsPanel,
        dossierAuthoringPage,
        newGalleryPanel,
        toolbar,
        formatPanel,
        toc,
        layerPanel,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(dashboardsAutoCredentials);
        await setWindowSize(browserWindow);
    });

    it('[TC99563_1] page padding', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });

        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Page');
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await browser.pause(2000); // wait button image loaded out

        let input = await formatPanel.getPaddingInput();
        let value = await input.getValue();
        await expect(value).toBe('');
        await takeScreenshotByElement(
            formatPanel.getFormatDetail(),
            'TC99563_1',
            'Format panel with default empty padding'
        );

        await dossierAuthoringPage.actionOnToolbar('Visualization');
        await newGalleryPanel.selectViz('Grid');
        let allPanels = await dossierAuthoringPage.getAllPanels();
        let currentPanel = allPanels[allPanels.length - 1];
        await takeScreenshotByElement(currentPanel, 'TC99563_1', 'Default empty padding');

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await formatPanel.setPaddingValue(20);
        await takeScreenshotByElement(currentPanel, 'TC99563_1', 'Set page padding to 20');

        await toolbar.clickButtonFromToolbar('Undo');
        value = await input.getValue();
        await expect(value).toBe('');

        await toolbar.clickButtonFromToolbar('Redo');
        value = await input.getValue();
        await expect(value).toBe('20');

        // change to manual layout
        await toolbar.clickToggleManualModeBtn();
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await formatPanel.setPaddingValue(40);
        await takeScreenshotByElement(currentPanel, 'TC99563_1', 'Free form layout set page padding to 40');

        // change to auto layout
        await toolbar.clickToggleManualModeBtn();
        await takeScreenshotByElement(currentPanel, 'TC99563_1', 'Back to Auto layout with page padding to 40');
    });

    it('[TC99563_2] panel padding in panel stack', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });

        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Page');
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await toolbar.createPanelStack();
        await layerPanel.clickOnContainerFromLayersPanel('Panel 1');
        let input = await formatPanel.getPaddingInput();
        let value = await input.getValue();
        await expect(value).toBe('');

        await dossierAuthoringPage.actionOnToolbar('Visualization');
        await newGalleryPanel.selectViz('Grid');
        let allPanels = await dossierAuthoringPage.getAllPanels();
        let currentPanel = allPanels[allPanels.length - 1];
        await takeScreenshotByElement(currentPanel, 'TC99563_2', 'Panel with default empty padding in panel stack');

        await layerPanel.clickOnContainerFromLayersPanel('Panel 1');
        await formatPanel.setPaddingValue(51); // maximum is 50
        value = await input.getValue();
        await expect(value).toBe('50');
        await takeScreenshotByElement(currentPanel, 'TC99563_2', 'Set panel padding to 50');

        await toolbar.clickButtonFromToolbar('Undo');
        value = await input.getValue();
        await expect(value).toBe('');

        await toolbar.clickButtonFromToolbar('Redo');
        value = await input.getValue();
        await expect(value).toBe('50');

        // change to manual layout
        await formatPanel.clickFreeFormLayout();
        const exists = await formatPanel.getPaddingInput().isExisting();
        await expect(exists).toBe(false);

        // change to auto layout
        await formatPanel.clickAutoLayout();
        value = await input.getValue();
        await expect(value).toBe('50');
        await takeScreenshotByElement(currentPanel, 'TC99563_2', 'Back to Auto layout with panel padding with 50');
    });

    it('[TC99563_3] panel padding in information window', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });

        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Page');
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await toolbar.createInfoWindow();
        await layerPanel.clickOnContainerFromLayersPanel('Panel 1');
        let input = await formatPanel.getPaddingInput();
        let value = await input.getValue();
        await expect(value).toBe('');

        await dossierAuthoringPage.actionOnToolbar('Visualization');
        await newGalleryPanel.selectViz('Grid');
        await layerPanel.clickOnContainerFromLayersPanel('Panel 1');
        let allPanels = await dossierAuthoringPage.getAllPanels();
        let currentPanel = allPanels[allPanels.length - 1];
        await takeScreenshotByElement(currentPanel, 'TC99563_3', 'Panel with default empty padding in info window');

        await layerPanel.clickOnContainerFromLayersPanel('Panel 1');
        await formatPanel.setPaddingValue(1); // minimum is 2
        value = await input.getValue();
        await expect(value).toBe('2');
        await takeScreenshotByElement(currentPanel, 'TC99563_3', 'Set padding to 4');

        await formatPanel.setPaddingValue('5;');
        value = await input.getValue();
        await expect(value).toBe('5');
        await takeScreenshotByElement(formatPanel.getFormatDetail(), 'TC99563_3', 'Input ; in padding');
    });

    it('[TC99563_4] Existing page, panel stack and info window padding', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Existing page - empty padding' }); // also cover DE329720
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Existing page - empty padding' });
        let input = await formatPanel.getPaddingInput();
        let value = await input.getValue();
        await expect(value).toBe('');

        await layerPanel.clickOnContainerFromLayersPanel('Panel Stack 1');
        await layerPanel.clickOnContainerFromLayersPanel('Panel 1');
        value = await input.getValue();
        await expect(value).toBe('');
        let allPanels = await dossierAuthoringPage.getAllPanels();
        let currentPanel = allPanels[allPanels.length - 1];
        await takeScreenshotByElement(currentPanel, 'TC99563_4', 'Existing empty padding');

        await layerPanel.clickOnContainerFromLayersPanel('Information Window');
        await layerPanel.clickOnContainerFromLayersPanel('IW Panel 1');
        value = await input.getValue();
        await expect(value).toBe('');
        allPanels = await dossierAuthoringPage.getAllPanels();
        currentPanel = allPanels[allPanels.length - 1];
        await takeScreenshotByElement(currentPanel, 'TC99563_4', 'Info window empty padding');

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Existing page - with padding' });
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Existing page - with padding' });
        value = await input.getValue();
        await expect(value).toBe('20');
        await formatPanel.setPaddingValue('');
        value = await input.getValue();
        await expect(value).toBe('20'); // not able to set empty

        await layerPanel.clickOnContainerFromLayersPanel('Panel Stack 1');
        await layerPanel.clickOnContainerFromLayersPanel('Panel 1');
        value = await input.getValue();
        await expect(value).toBe('40');
        allPanels = await dossierAuthoringPage.getAllPanels();
        currentPanel = allPanels[allPanels.length - 1];
        await takeScreenshotByElement(currentPanel, 'TC99563_4', 'Existing padding 20 and 40');

        await layerPanel.clickOnContainerFromLayersPanel('Information Window');
        await layerPanel.clickOnContainerFromLayersPanel('IW Panel 1');
        value = await input.getValue();
        await expect(value).toBe('30');
        allPanels = await dossierAuthoringPage.getAllPanels();
        currentPanel = allPanels[allPanels.length - 1];
        await takeScreenshotByElement(currentPanel, 'TC99563_4', 'Info window with padding');

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Freeform layout' });
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Freeform layout' });
        // sleep for 3 seconds to make sure the focus highlight show on viz bar before taking screenshot
        await browser.pause(3000);
        allPanels = await dossierAuthoringPage.getAllPanels();
        currentPanel = allPanels[allPanels.length - 1];
        await takeScreenshotByElement(currentPanel, 'TC99563_4', 'Page free form layout padding 45');
        await dossierAuthoringPage.goToLibrary();
        await dossierAuthoringPage.notSaveDossier();
    });

    it('[TC99563_5] X-func with lock page size fit view', async () => {
        const url = browser.options.baseUrl + `app/${dossierLockPageSize.project.id}/${dossierLockPageSize.id}`;
        await libraryPage.openDossierByUrl(url.toString());
        await dossierPage.resetDossierIfPossible();

        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Existing page - empty padding' });
        await browser.pause(2000);
        await takeScreenshotByElement(dossierPage.getDossierView(), 'TC99563_5', 'Empty Padding and lock page size');

        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Existing page - with padding' });
        await browser.pause(2000);
        await takeScreenshotByElement(dossierPage.getDossierView(), 'TC99563_5', 'With Padding and lock page size');

        await setWindowSize(browserWindow2);
        await browser.pause(2000);
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
            'TC99563_5',
            'lock page size with bottom more blank area'
        );

        await setWindowSize(browserWindow3);
        await browser.pause(2000);
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
            'TC99563_5',
            'lock page size with left and right more blank area'
        );
    });

    it('[TC99563_6] X-func with lock page size fill view', async () => {
        const url =
            browser.options.baseUrl + `app/${dossierLockPageSizeFillView.project.id}/${dossierLockPageSizeFillView.id}`;
        await libraryPage.openDossierByUrl(url.toString());
        await dossierPage.resetDossierIfPossible();

        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Existing page - empty padding' });
        await browser.pause(2000);
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
            'TC99563_6',
            'Empty Padding for lock page size fill view'
        );

        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Existing page - with padding' });
        await browser.pause(2000);
        await takeScreenshotByElement(dossierPage.getDossierView(), 'TC99563_6', 'Lock page size fill view padding');

        await setWindowSize(browserWindow2);
        await browser.pause(2000);
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
            'TC99563_6',
            'lock page size fill view with horizontal not enough width'
        );

        await setWindowSize(browserWindow3);
        await browser.pause(2000);
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
            'TC99563_6',
            'lock page size fill view with vertical not enough height'
        );

        const pageView = await dossierPage.getDossierView();
        await dossierAuthoringPage.waitForElementVisible(pageView);
        await pageView.click();
        await browser.pause(200);
        for (let i = 0; i < 4; i++) {
            await browser.keys('ArrowDown');
        }
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
            'TC99563_6',
            'lock page size fill view scroll to bottom'
        );
    });
});
