import { dashboardsAutoCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('25.12 dashboard level background image', () => {
    const dossier = {
        id: '704EE42971415C138ECEFCBDBDA0B11A',
        name: 'Auto_bg_name_decode',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const bgImageVerticallyScroll = {
        id: '74FF6EAACA451D8B145BC9B372A0232F',
        name: 'Auto_bg_+vertical scrolling',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const browserWindow = {
        width: 1920,
        height: 1080,
    };

    const browserTallWindow = {
        width: 800,
        height: 1200,
    };

    const tutorialProject = 'MicroStrategy Tutorial';

    let {
        loginPage,
        libraryPage,
        dossierCreator,
        libraryAuthoringPage,
        dossierAuthoringPage,
        toolbar,
        contentsPanel,
        dossierEditorUtility,
        baseFormatPanelReact,
        dashboardFormattingPanel,
        newGalleryPanel,
        formatPanel,
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

    it('[TC99541_1] set dashboard background to URL image', async () => {
        await dossierCreator.createNewDossier();
        await dossierCreator.switchProjectByName(tutorialProject);
        await dossierCreator.clickBlankDossierBtn();
        await dashboardFormattingPanel.open();
        // sleep to wait card/flat/preview image to show out
        await browser.pause(5000);

        // Change the background color to image
        await dashboardFormattingPanel.clickRootPanelBgColorPicker();
        await dashboardFormattingPanel.clickImageMode();
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRC3ColorPickerPopover(), // image URL field should not be null
            'TC99541_1',
            'Default image mode popover'
        );
        // check OK button is disabled when no image is selected
        const isOkButtonEnabled = await dashboardFormattingPanel.isImageOkButtonEnabled();
        await expect(isOkButtonEnabled).toBe(false);
        // select an image and check the image preview is correct
        let imageUrl =
            'https://strategyagile.atlassian.net/s/a1kzh2/b/0/3da07e21fd67166c914d222dfd6db51d/_/jira-logo-scaled.png';
        await dashboardFormattingPanel.setImageBackground(imageUrl, 'Stretch');
        const previewImageUrl = await dashboardFormattingPanel.getImagePreviewUrl();
        await expect(previewImageUrl).toContain(imageUrl);
        // take screenshot of the image preview
        await takeScreenshotByElement(
            await libraryAuthoringPage.getDashboardFormattingPopUp(),
            'TC99541_1',
            'Click OK button to apply the background image and check the preview'
        );
        // click OK button to apply the background image
        await dashboardFormattingPanel.closeColorPickerPopover();
        await dashboardFormattingPanel.clickOkButton();

        // open page format panel to check if the bg image is applied
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        // sleep to wait image to show out
        await browser.pause(3000);
        // get page level background preview element and check the image is applied
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRootPanelBgColorPicker(),
            'TC99541_1',
            'Page level format panel should show the background image'
        );

        let vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'TC99541_1', 'Page rendering with background image');
        // create a new page and check the background image
        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Page');
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 2' });
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRootPanelBgColorPicker(),
            'TC99541_1',
            'Format panel of the new page should show the background image'
        );

        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'TC99541_1', 'Create new page should show the background image');

        // create a new chapter and check the background color
        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Chapter');
        await contentsPanel.goToPage({ chapterName: 'Chapter 2', pageName: 'Page 1' });
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRootPanelBgColorPicker(),
            'TC99541_1',
            'Format panel of the new chapter page should show the background image'
        );
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'TC99541_1', 'New chapter should show the background image');
    });

    it('[TC99541_2] set dashboard background to relative path image', async () => {
        await dossierCreator.createNewDossier();
        await dossierCreator.switchProjectByName(tutorialProject);
        await dossierCreator.clickBlankDossierBtn();
        await dashboardFormattingPanel.open();
        // sleep to wait card/flat/preview image to show out
        await browser.pause(5000);

        // Change the background color to Ruby Red
        await dashboardFormattingPanel.clickRootPanelBgColorPicker();
        await dashboardFormattingPanel.clickImageMode();
        // select an image and check the image preview is correct
        let imageUrl = './Images/0.gif';
        const image0GifPreviewUrl = '/0.gif';
        await dashboardFormattingPanel.setImageBackground(imageUrl, 'Stretch');
        let previewImageUrl = await dashboardFormattingPanel.getImagePreviewUrl();
        await expect(previewImageUrl).toContain(image0GifPreviewUrl);
        // take screenshot of the image preview
        await takeScreenshotByElement(
            await libraryAuthoringPage.getDashboardFormattingPopUp(),
            'TC99541_2',
            'Click OK button to apply the background image and check the preview'
        );

        imageUrl = 'images/serv_ctr_repair_blue.png';
        const imageServCtrRepairBluePreviewUrl = '/serv_ctr_repair_blue.png';
        await dashboardFormattingPanel.setImageBackground(imageUrl, 'Fill Canvas');
        previewImageUrl = await dashboardFormattingPanel.getImagePreviewUrl();
        await expect(previewImageUrl).toContain(imageServCtrRepairBluePreviewUrl);

        imageUrl = '/images/0.gif';
        await dashboardFormattingPanel.setImageBackground(imageUrl);
        previewImageUrl = await dashboardFormattingPanel.getImagePreviewUrl();
        await expect(previewImageUrl).toContain(image0GifPreviewUrl);

        imageUrl = '../images/serv_ctr_repair_blue.png';
        await dashboardFormattingPanel.setImageBackground(imageUrl);
        previewImageUrl = await dashboardFormattingPanel.getImagePreviewUrl();
        await expect(previewImageUrl).toContain(imageServCtrRepairBluePreviewUrl);

        imageUrl = 'Images\\0.gif';
        await dashboardFormattingPanel.setImageBackground(imageUrl);
        previewImageUrl = await dashboardFormattingPanel.getImagePreviewUrl();
        await expect(previewImageUrl).toContain(image0GifPreviewUrl);

        imageUrl = '.\\Images\\serv_ctr_repair_blue.png';
        await dashboardFormattingPanel.setImageBackground(imageUrl);
        previewImageUrl = await dashboardFormattingPanel.getImagePreviewUrl();
        await expect(previewImageUrl).toContain(imageServCtrRepairBluePreviewUrl);

        imageUrl = '..\\Images\\0.gif';
        await dashboardFormattingPanel.setImageBackground(imageUrl);
        // wait for invalid URL dialog to appear and verify it exists
        await dashboardFormattingPanel.waitForInvalidUrlDialog();
        let hasError = await dashboardFormattingPanel.isInvalidUrlDialogVisible();
        await expect(hasError).toBe(true);
        await dashboardFormattingPanel.closeInvalidUrlDialog();

        imageUrl = '\\Images\\serv_ctr_repair_blue.png';
        await dashboardFormattingPanel.setImageBackground(imageUrl);
        // wait for invalid URL dialog to appear and verify it exists
        await dashboardFormattingPanel.waitForInvalidUrlDialog();
        hasError = await dashboardFormattingPanel.isInvalidUrlDialogVisible();
        await expect(hasError).toBe(true);
        await dashboardFormattingPanel.closeInvalidUrlDialog();

        previewImageUrl = await dashboardFormattingPanel.getImagePreviewUrl(); // preview image URL should still be the previous valid image
        await expect(previewImageUrl).toContain(imageServCtrRepairBluePreviewUrl);

        // click OK button to apply the background image
        await dashboardFormattingPanel.closeColorPickerPopover();
        await dashboardFormattingPanel.clickOkButton();

        // open page format panel to check if the bg image is applied
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        // sleep to wait image to show out
        await browser.pause(3000);
        // get page level background preview element and check the image is applied
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRootPanelBgColorPicker(),
            'TC99541_2',
            'Page level format panel should show the background image'
        );

        let vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'TC99541_2', 'Page rendering with background image');
        // create a new page and check the background image
        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Page');
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 2' });
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRootPanelBgColorPicker(),
            'TC99541_2',
            'Format panel of the new page should show the background image'
        );
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'TC99541_2', 'Create new page should show the background image');

        // create a new chapter and check the background color
        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Chapter');
        await browser.pause(1000);
        await contentsPanel.goToPage({ chapterName: 'Chapter 2', pageName: 'Page 1' });
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRootPanelBgColorPicker(),
            'TC99541_2',
            'Format panel of the new chapter page should show the background image'
        );
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'TC99541_2', 'New chapter should show the background image');

        // Set with absolute URL path
        await dashboardFormattingPanel.open();
        await dashboardFormattingPanel.clickRootPanelBgColorPicker();
        await dashboardFormattingPanel.clickImageMode();
        // select an image and check the image preview is correct
        imageUrl = 'https://mci-o2fz9-dev.hypernow.microstrategy.com/MicroStrategyLibrary/images/1.gif';
        await dashboardFormattingPanel.setImageBackground(imageUrl, 'Stretch');
        previewImageUrl = await dashboardFormattingPanel.getDashboardLevelImagePreviewUrl();
        await expect(previewImageUrl).toContain('1.gif');
        await takeScreenshotByElement(
            await libraryAuthoringPage.getDashboardFormattingPopUp(),
            'TC99541_2',
            'Absolute URL path'
        );
        // click OK button to apply the background image
        await dashboardFormattingPanel.closeColorPickerPopover();
        await dashboardFormattingPanel.clickOkButton();

        await contentsPanel.goToPage({ chapterName: 'Chapter 2', pageName: 'Page 1' });
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRootPanelBgColorPicker(),
            'TC99541_2',
            'Format panel should show the changed background image'
        );
        await toolbar.createPanelStack();
        await dossierAuthoringPage.actionOnToolbar('Visualization');
        await newGalleryPanel.selectViz('Grid');
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'TC99541_2', 'Should show the updated background image');

        // open page format panel to check if the bg image is applied
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await browser.pause(1000);
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1' }); // to open format panel and check the color preview
        // get page level background preview element and check the image is applied
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRootPanelBgColorPicker(),
            'TC99541_2',
            'Change page, the format panel should show the changed background image'
        );
        await dossierAuthoringPage.actionOnToolbar('Visualization');
        await newGalleryPanel.selectViz('Grid');
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(
            vizPanelContent,
            'TC99541_2',
            'Change page, the page should show the changed background image'
        );
    });

    it('[TC99541_3] image name should be decoded after reopening', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await dashboardFormattingPanel.open();
        await dashboardFormattingPanel.clickRootPanelBgColorPicker();
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRC3ColorPickerPopover(),
            'TC99541_3',
            'After reopening, the image name should be decoded and show correctly in dashboard level'
        );

        await dashboardFormattingPanel.closeColorPickerPopover();
        await dashboardFormattingPanel.close();

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1' }); // to open format panel and check the color preview
        await formatPanel.clickPageLevelColorPicker();
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRC3ColorPickerPopover(),
            'TC99541_3',
            'After reopening, the image name should be decoded and show correctly in page level'
        );
    });

    it('[TC99541_4] image background and vertical scrolling in wide window', async () => {
        //BCDA-7124: When open/duplicate page, it will show error 'Cannot read properties of undefined (reading 'children')'
        await libraryPage.editDossierByUrl({
            projectId: bgImageVerticallyScroll.project.id,
            dossierId: bgImageVerticallyScroll.id,
        });

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Fill Canvas' });
        let vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(
            await vizPanelContent,
            'TC99541_4',
            'Wide window size with Fill Canvas background image mode'
        );

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Freeform + vertical scroll' });
        await browser.pause(1000);
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Freeform + vertical scroll' }); // to open format panel and check the color preview
        await takeScreenshotByElement(
            await formatPanel.getFormatDetail(),
            'TC99541_4',
            'Freeform layout and enable vertical scrolling'
        );

        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(
            await vizPanelContent,
            'TC99541_4',
            'Wide window size with Stretch background image mode'
        );

        // scroll to the bottom of the page using keyboard arrow down and take screenshot
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await vizPanelContent.click();
        await browser.pause(200);
        for (let i = 0; i < 20; i++) {
            await browser.keys('ArrowDown');
        }
        await browser.pause(500);
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(
            await vizPanelContent,
            'TC99541_4',
            'Page display with background image stretch mode after scroll to bottom'
        );
    });

    it('[TC99541_5] Fill Canvas and Stretch image display in tall window', async () => {
        await libraryPage.editDossierByUrl({
            projectId: bgImageVerticallyScroll.project.id,
            dossierId: bgImageVerticallyScroll.id,
        });

        await setWindowSize(browserTallWindow);
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Fill Canvas' });
        let vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(
            await vizPanelContent,
            'TC99541_5',
            'Tall window size with Fill Canvas background image mode'
        );

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Freeform + vertical scroll' });
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(
            await vizPanelContent,
            'TC99541_5',
            'Tall window size with Stretch background image mode'
        );
    });

    it('[TC99541_6] Set background image from embedded to URL', async () => {
        // BCDA-7161
        await libraryPage.editDossierByUrl({
            projectId: bgImageVerticallyScroll.project.id,
            dossierId: bgImageVerticallyScroll.id,
        });

        await dashboardFormattingPanel.open();
        // Change the embedded background image to URL image
        await dashboardFormattingPanel.clickRootPanelBgColorPicker();
        await dashboardFormattingPanel.clickImageMode();
        let imageUrl =
            'https://strategyagile.atlassian.net/s/a1kzh2/b/0/3da07e21fd67166c914d222dfd6db51d/_/jira-logo-scaled.png';
        await dashboardFormattingPanel.setImageBackground(imageUrl, 'Stretch');
        const previewImageUrl = await dashboardFormattingPanel.getImagePreviewUrl();
        await expect(previewImageUrl).toContain(imageUrl);

        await dashboardFormattingPanel.closeColorPickerPopover();
        await dashboardFormattingPanel.clickOkButton();

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Fill Canvas' });
        await browser.pause(1000);
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Fill Canvas' });
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRootPanelBgColorPicker(),
            'TC99541_6',
            'Format panel preview should show the new background image'
        );

        let vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(
            await vizPanelContent,
            'TC99541_6',
            'Page rendering should show the new background image'
        );

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Freeform + vertical scroll' });
        await browser.pause(1000);
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Freeform + vertical scroll' });
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRootPanelBgColorPicker(),
            'TC99541_6',
            'Next page format panel preview should show the new background image'
        );
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(
            await vizPanelContent,
            'TC99541_6',
            'Next page rendering should show the new background image'
        );

        await contentsPanel.goToPage({ chapterName: 'Chapter 2', pageName: 'Page 1' });
        await browser.pause(1000);
        await contentsPanel.goToPage({ chapterName: 'Chapter 2', pageName: 'Page 1' });
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRootPanelBgColorPicker(),
            'TC99541_6',
            'Another chapter format panel preview should show the new background image'
        );
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(
            await vizPanelContent,
            'TC99541_6',
            'Another chapter rendering should show the new background image'
        );
    });
});
