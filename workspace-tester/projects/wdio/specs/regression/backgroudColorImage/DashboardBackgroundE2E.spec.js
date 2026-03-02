import { dashboardsAutoCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

// npm run regression -- --baseUrl=https://mci-u6btx-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --spec 'specs/regression/backgroudColorImage/DashboardBackgroundE2E.spec.js'
describe('25.12 background color and image E2E', () => {
    const tutorialProject = {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    };

    const e2eDossier = {
        id: '98DB3BDE264442CED8D99DB42A2E2C40',
        name: 'Background_Color_Image_E2E',
        project: tutorialProject,
    };

    const e2eDossierSaveAs = {
        id: '0F7E444BE54402E0E4BFBAA79A4EC9C7',
        name: 'Background_Color_Image_E2E_SaveAs',
        project: tutorialProject,
    };

    const browserWindow = {
        width: 1920,
        height: 1080,
    };

    let {
        loginPage,
        libraryPage,
        dossierPage,
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
        baseFormatPanel,
        tocMenu,
        toc,
        tocContentsPanel,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(dashboardsAutoCredentials);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[QAC-471_1] Set dashboard background to URL image at dashboard level', async () => {
        const url = browser.options.baseUrl + `app/${tutorialProject.id}/${e2eDossier.id}/edit`;
        await libraryPage.openDossierByUrl(url.toString());
        await browser.pause(2000);
        
        await dashboardFormattingPanel.open();
        // sleep to wait card/flat/preview image to show out
        await browser.pause(5000);

        // Change the background color to image
        await dashboardFormattingPanel.clickRootPanelBgColorPicker();
        await dashboardFormattingPanel.clickImageMode();

        let imageUrl =
            'https://strategyagile.atlassian.net/s/a1kzh2/b/0/3da07e21fd67166c914d222dfd6db51d/_/jira-logo-scaled.png';
        await dashboardFormattingPanel.setImageBackground(imageUrl, 'Stretch');
        const previewImageUrl = await dashboardFormattingPanel.getImagePreviewUrl();
        await expect(previewImageUrl).toContain(imageUrl);
        // take screenshot of the dashboard formatting properties dialog with image preview
        await takeScreenshotByElement(
            await libraryAuthoringPage.getDashboardFormattingPopUp(),
            'QAC-471_1',
            'Check the preview'
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
            'QAC-471_2',
            'Page level format panel should show the background image'
        );

        let vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-471_3', 'Chapter 1 Page 1 rendering with background image');
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 2' });
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-471_4', 'Chapter 1 Page 2 rendering with background image');
        await contentsPanel.goToPage({ chapterName: 'Chapter 2', pageName: 'Page 1' });
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-471_5', 'Chapter 2 Page 1 rendering with background image');
        await contentsPanel.goToPage({ chapterName: 'Chapter 2', pageName: 'Page 2' });
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-471_6', 'Chapter 2 Page 2 rendering with background image');
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1' });
       
        await dossierAuthoringPage.actionOnMenubarWithSubmenu('File', 'Save As...');
        await browser.pause(2000);
        await libraryAuthoringPage.saveInMyReport('Background_Color_Image_E2E_SaveAs');
    });

    it('[QAC-471_2] Set specific page background to relative path image', async () => {
        const url = browser.options.baseUrl + `app/${tutorialProject.id}/${e2eDossierSaveAs.id}/edit`;
        await libraryPage.openDossierByUrl(url.toString());
        await browser.pause(2000);
        
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await formatPanel.clickPageLevelColorPicker();
        await dashboardFormattingPanel.clickImageMode();
        await browser.pause(2000); // wait icon to load in color picker popover
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRC3ColorPickerPopover(),
            'QAC-471_7',
            'Page level color picker image mode default state'
        );
            
        const imageUrl = './Images/airport/Madrid.jpg';
        await dashboardFormattingPanel.setImageBackground(imageUrl);
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRootPanelBgColorPicker(),
            'QAC-471_8',
            'Page level background image should be set'
        );
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRC3ColorPickerPopover(),
            'QAC-471_9',
            'Page level background color picker popover'
        );

        await baseFormatPanel.switchToFormatPanelByClickingOnIcon(); // to dismiss color picker popover
        let vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-471_10', 'Chapter 1 Page 1 rendering with page level relative path background image');
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 2' });
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-471_11', 'Chapter 1 Page 2 rendering with dashboard level background image');
        await contentsPanel.goToPage({ chapterName: 'Chapter 2', pageName: 'Page 1' });
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-471_12', 'Chapter 2 Page 1 rendering with dashboard level background image');
        await contentsPanel.goToPage({ chapterName: 'Chapter 2', pageName: 'Page 2' });
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-471_13', 'Chapter 2 Page 2 rendering with dashboard level background image');

        await libraryAuthoringPage.simpleSaveDashboard();
    });

    it('[QAC-471_3] Set specific page background to color', async () => {
        const url = browser.options.baseUrl + `app/${tutorialProject.id}/${e2eDossierSaveAs.id}/edit`;
        await libraryPage.openDossierByUrl(url.toString());
        await browser.pause(2000);

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 2' });
        await contentsPanel.rightClickPage({ chapterName: 'Chapter 1', pageName: 'Page 2' });

        // sleep to wait icon in format panel to show out
        // Default should white
        await formatPanel.clickPageLevelColorPicker();
        await browser.pause(2000); // wait icon to load in color picker popover
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRC3ColorPickerPopover(),
            'QAC-471_14',
            'Page level color picker image mode default state'
        );

        await dashboardFormattingPanel.clickSwatchesMode();
        await browser.pause(2000); // wait icon to load in color picker popover
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRC3ColorPickerPopover(),
            'QAC-471_15',
            'Page level color picker default state'
        );

        await dashboardFormattingPanel.selectColorByName('Ruby Red ###');
        let colorPreview = dashboardFormattingPanel.getRootPanelBgColorPreview();
        colorPreview = dashboardFormattingPanel.getRootPanelBgColorPreview();
        const redBackgroundColor = await colorPreview.getCSSProperty('background-color');
        await expect(redBackgroundColor.value).toBe('rgba(193,41,47,1)');
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRC3ColorPickerPopover(),
            'QAC-471_16',
            'Page level color should be Ruby Red'
        );

        await takeScreenshotByElement(
            await formatPanel.getFormatDetail(),
            'QAC-471_17',
            'Color picker popover position in format panel'
        );

        await baseFormatPanel.switchToFormatPanelByClickingOnIcon(); // to dismiss color picker popover
        let vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-471_18', 'Chapter 1 Page 2 rendering with page level relative path background image');
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-471_19', 'Chapter 1 Page 1 rendering with dashboard level background image');
        await contentsPanel.goToPage({ chapterName: 'Chapter 2', pageName: 'Page 1' });
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-471_20', 'Chapter 2 Page 1 rendering with dashboard level background image');
        await contentsPanel.goToPage({ chapterName: 'Chapter 2', pageName: 'Page 2' });
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-471_21', 'Chapter 2 Page 2 rendering with dashboard level background image');
        await libraryAuthoringPage.simpleSaveDashboard();
    });

    it('[QAC-471_4] Insert new page and chapter', async () => {
        const url = browser.options.baseUrl + `app/${tutorialProject.id}/${e2eDossierSaveAs.id}/edit`;
        await libraryPage.openDossierByUrl(url.toString());
        await browser.pause(2000);
        // create a new page and check the background image
        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Page');
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 3' });
        await contentsPanel.rightClickPage({ chapterName: 'Chapter 1', pageName: 'Page 3' });

        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRootPanelBgColorPicker(),
            'QAC-471_22',
            'Format panel of the new page should show the dashboard level background image'
        ); 

        let vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-471_23', 'New page should show the dashboard level background image');

        // create a new chapter and check the background color
        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Chapter');
        await contentsPanel.goToPage({ chapterName: 'Chapter 3', pageName: 'Page 1' });
        await contentsPanel.rightClickPage({ chapterName: 'Chapter 3', pageName: 'Page 1' });

        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRootPanelBgColorPicker(),
            'QAC-471_24',
            'Format panel of the new chapter page should show the dashboard level background image'
        );

        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-471_25', 'New chapter should show the dashboard level background image');
        await libraryAuthoringPage.simpleSaveDashboard();

    });

    it('[QAC-471_5] Duplicate pages and chapters', async () => {
        const url = browser.options.baseUrl + `app/${tutorialProject.id}/${e2eDossierSaveAs.id}/edit`;
        await libraryPage.openDossierByUrl(url.toString());
        await browser.pause(2000);

        // duplicate a chapter and check the background image for each page
        await tocMenu.duplicateChapter("Chapter 1");
        await browser.pause(2000);
        await contentsPanel.goToPage({ chapterName: 'Chapter 1 copy', pageName: 'Page 1' });
        await contentsPanel.rightClickPage({ chapterName: 'Chapter 1 copy', pageName: 'Page 1' });
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRootPanelBgColorPicker(),
            'QAC-471_26',
            'Format panel of the page 1 in duplicated chapter 1 copy should show the page level background image'
        ); 
        let vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-471_27', 'The duplicated page 1 in duplicated chapter 1 copy should show the page level background image');

        await baseFormatPanel.switchToFormatPanelByClickingOnIcon(); // to dismiss color picker popover
        await contentsPanel.goToPage({ chapterName: 'Chapter 1 copy', pageName: 'Page 2' });
        await contentsPanel.rightClickPage({ chapterName: 'Chapter 1 copy', pageName: 'Page 2' });
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRootPanelBgColorPicker(),
            'QAC-471_28',
            'Format panel of the page 2 in duplicated chapter 1 copy should show the page level background color'
        ); 
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-471_29', 'The duplicated page 2 in duplicated chapter 1 copy should show the page level background color');

        await baseFormatPanel.switchToFormatPanelByClickingOnIcon(); // to dismiss color picker popover
        await contentsPanel.goToPage({ chapterName: 'Chapter 1 copy', pageName: 'Page 3' });
        await contentsPanel.rightClickPage({ chapterName: 'Chapter 1 copy', pageName: 'Page 3' });
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRootPanelBgColorPicker(),
            'QAC-471_30',
            'Format panel of the page 3 in duplicated chapter 1 copy should show the dashboard level background image'
        ); 
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-471_31', 'The duplicated page 3 in duplicated chapter 1 copy should show the dashboard level background image');

        // duplicate pages and check the background image/color
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await tocMenu.duplicatePage("Page 1");
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1 copy' });
        await contentsPanel.rightClickPage({ chapterName: 'Chapter 1', pageName: 'Page 1 copy' });
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRootPanelBgColorPicker(),
            'QAC-471_32',
            'Format panel of the duplicated page 1 copy should show the page level background image'
        ); 
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-471_33', 'The duplicated page 1 copy should show the page level background image');
        
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon(); // to dismiss color picker popover
        await tocMenu.duplicatePage("Page 2");
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 2 copy' });
        await contentsPanel.rightClickPage({ chapterName: 'Chapter 1', pageName: 'Page 2 copy' });
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRootPanelBgColorPicker(),
            'QAC-471_34',
            'Format panel of the duplicated page 2 copy should show the page level background color'
        ); 
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-471_35', 'The duplicated page 2 copy should show the page level background color');

        await baseFormatPanel.switchToFormatPanelByClickingOnIcon(); // to dismiss color picker popover
        await tocMenu.duplicatePage("Page 3");
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 3 copy' });
        await contentsPanel.rightClickPage({ chapterName: 'Chapter 1', pageName: 'Page 3 copy' });
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRootPanelBgColorPicker(),
            'QAC-471_36',
            'Format panel of the duplicated page 3 copy should show the dashboard level background image'
        ); 
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-471_37', 'The duplicated page 3 copy should show the dashboard level background image');

        await libraryAuthoringPage.simpleSaveDashboard();
    });

    it('[QAC-471_6] Delete pages and chatpers, then Undo/Redo', async () => {
        const url = browser.options.baseUrl + `app/${tutorialProject.id}/${e2eDossierSaveAs.id}/edit`;
        await libraryPage.openDossierByUrl(url.toString());
        await browser.pause(2000);

        // delete a chapter and undo, then check the background image/color for each page
        console.log(await contentsPanel.getChapterCount());
        await since(`The dashboard should have #{expected} chapters, instead it has #{actual}`)
            .expect(await contentsPanel.getChapterCount())
            .toBe(4);
        await contentsPanel.clickOptionOnChapterMenu('Chapter 1 copy ', 'Delete');
        await browser.pause(2000);
        console.log(await contentsPanel.getChapterCount());
        await since(`The dashboard should have #{expected} chapters, instead it has #{actual}`)
            .expect(await contentsPanel.getChapterCount())
            .toBe(3);
        let vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-471_38', 'After deleting Chapter 1 copy');
        await toolbar.clickButtonFromToolbar('Undo');
        console.log(await contentsPanel.getChapterCount());
        await since(`The dashboard should have #{expected} chapters, instead it has #{actual}`)
            .expect(await contentsPanel.getChapterCount())
            .toBe(4);

        await contentsPanel.goToPage({ chapterName: 'Chapter 1 copy', pageName: 'Page 1' });
        await contentsPanel.rightClickPage({ chapterName: 'Chapter 1 copy', pageName: 'Page 1' });
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRootPanelBgColorPicker(),
            'QAC-471_39',
            'Format panel of the page 1 in duplicated chapter 1 copy should show the page level background image'
        ); 
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-471_40', 'The duplicated page 1 in duplicated chapter 1 copy should show the page level background image');

        await baseFormatPanel.switchToFormatPanelByClickingOnIcon(); // to dismiss color picker popover
        await contentsPanel.goToPage({ chapterName: 'Chapter 1 copy', pageName: 'Page 2' });
        await contentsPanel.rightClickPage({ chapterName: 'Chapter 1 copy', pageName: 'Page 2' });
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRootPanelBgColorPicker(),
            'QAC-471_41',
            'Format panel of the page 2 in duplicated chapter 1 copy should show the page level background color'
        ); 
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-471_42', 'The duplicated page 2 in duplicated chapter 1 copy should show the page level background color');

        await baseFormatPanel.switchToFormatPanelByClickingOnIcon(); // to dismiss color picker popover
        await contentsPanel.goToPage({ chapterName: 'Chapter 1 copy', pageName: 'Page 3' });
        await contentsPanel.rightClickPage({ chapterName: 'Chapter 1 copy', pageName: 'Page 3' });
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRootPanelBgColorPicker(),
            'QAC-471_43',
            'Format panel of the page 3 in duplicated chapter 1 copy should show the dashboard level background image'
        ); 
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-471_44', 'The duplicated page 3 in duplicated chapter 1 copy should show the dashboard level background image');

        // delete a page and undo, then check the background image/color
        console.log(await contentsPanel.getPagesCount());
        await since(`The dashboard should have #{expected} chapters, instead it has #{actual}`)
            .expect(await contentsPanel.getPagesCount())
            .toBe(12);
        await contentsPanel.goToPage({ chapterName: 'Chapter 1 copy', pageName: 'Page 1' });
        await tocContentsPanel.contextMenuOnPage('Page 1', 'Chapter 1 copy ', 'Delete');
        console.log(await contentsPanel.getPagesCount());
        await since(`The dashboard should have #{expected} chapters, instead it has #{actual}`)
            .expect(await contentsPanel.getPagesCount())
            .toBe(11);
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-471_45', 'After deleting Page 1 in Chapter 1 copy');

        await toolbar.clickButtonFromToolbar('Undo');
        console.log(await contentsPanel.getPagesCount());
        await since(`The dashboard should have #{expected} chapters, instead it has #{actual}`)
            .expect(await contentsPanel.getPagesCount())
            .toBe(12);

        await contentsPanel.goToPage({ chapterName: 'Chapter 1 copy', pageName: 'Page 1' });
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRootPanelBgColorPicker(),
            'QAC-471_46',
            'Format panel of the page 1 in duplicated chapter 1 copy should show the page level background image'
        ); 
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-471_47', 'The duplicated page 1 in duplicated chapter 1 copy should show the page level background image');

        await contentsPanel.goToPage({ chapterName: 'Chapter 1 copy', pageName: 'Page 2' });
        await tocContentsPanel.contextMenuOnPage('Page 2', 'Chapter 1 copy ', 'Delete');
        console.log(await contentsPanel.getPagesCount());
        await since(`The dashboard should have #{expected} chapters, instead it has #{actual}`)
            .expect(await contentsPanel.getPagesCount())
            .toBe(11);
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-471_48', 'After deleting Page 2 in Chapter 1 copy');
        await toolbar.clickButtonFromToolbar('Undo');
        console.log(await contentsPanel.getPagesCount());
        await since(`The dashboard should have #{expected} chapters, instead it has #{actual}`)
            .expect(await contentsPanel.getPagesCount())
            .toBe(12);
        await contentsPanel.goToPage({ chapterName: 'Chapter 1 copy', pageName: 'Page 2' });
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRootPanelBgColorPicker(),
            'QAC-471_49',
            'Format panel of the page 2 in duplicated chapter 1 copy should show the page level background color'
        ); 
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-471_50', 'The duplicated page 2 in duplicated chapter 1 copy should show the page level background color');

        await contentsPanel.goToPage({ chapterName: 'Chapter 1 copy', pageName: 'Page 3' });
        await tocContentsPanel.contextMenuOnPage('Page 3', 'Chapter 1 copy ', 'Delete');
        console.log(await contentsPanel.getPagesCount());
        await since(`The dashboard should have #{expected} chapters, instead it has #{actual}`)
            .expect(await contentsPanel.getPagesCount())
            .toBe(11);
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-471_51', 'After deleting Page 3 in Chapter 1 copy');
        await toolbar.clickButtonFromToolbar('Undo');
        console.log(await contentsPanel.getPagesCount());
        await since(`The dashboard should have #{expected} chapters, instead it has #{actual}`)
            .expect(await contentsPanel.getPagesCount())
            .toBe(12);
        await contentsPanel.goToPage({ chapterName: 'Chapter 1 copy', pageName: 'Page 3' });
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getRootPanelBgColorPicker(),
            'QAC-471_52',
            'Format panel of the page 3 in duplicated chapter 1 copy should show the dashboard level background image'
        ); 
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-471_53', 'The duplicated page 3 in duplicated chapter 1 copy should show the dashboard level background image');
    });

    it('[QAC-471_7] Library Consumption', async () => {
        const url = browser.options.baseUrl + `app/${tutorialProject.id}/${e2eDossierSaveAs.id}`;
        await libraryPage.openDossierByUrl(url.toString());
        await dossierPage.resetDossierIfPossible();

        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await browser.pause(2000);
        await takeScreenshotByElement(dossierPage.getDossierView(),  'QAC-471_54', 'Chapter 1 Page 1 in consumption mode');
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1 copy' });
        await browser.pause(2000);
        await takeScreenshotByElement(dossierPage.getDossierView(),  'QAC-471_55', 'Chapter 1 Page 1 copy in consumption mode');
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 2' });
        await browser.pause(2000);
        await takeScreenshotByElement(dossierPage.getDossierView(),  'QAC-471_56', 'Chapter 1 Page 2 in consumption mode');
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 2 copy' });
        await browser.pause(2000);
        await takeScreenshotByElement(dossierPage.getDossierView(),  'QAC-471_57', 'Chapter 1 Page 2 copy in consumption mode');
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 3' });
        await browser.pause(2000);
        await takeScreenshotByElement(dossierPage.getDossierView(),  'QAC-471_58', 'Chapter 1 Page 3 in consumption mode');
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 3 copy' });
        await browser.pause(2000);
        await takeScreenshotByElement(dossierPage.getDossierView(),  'QAC-471_59', 'Chapter 1 Page 3 copy in consumption mode');

        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1 copy', pageName: 'Page 1' });
        await browser.pause(2000);
        await takeScreenshotByElement(dossierPage.getDossierView(),  'QAC-471_60', 'Chapter 1 copy Page 1 in consumption mode');
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1 copy', pageName: 'Page 2' });
        await browser.pause(2000);
        await takeScreenshotByElement(dossierPage.getDossierView(),  'QAC-471_61', 'Chapter 1 copy Page 2 in consumption mode');
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1 copy', pageName: 'Page 3' });
        await browser.pause(2000);
        await takeScreenshotByElement(dossierPage.getDossierView(),  'QAC-471_62', 'Chapter 1 copy Page 3 in consumption mode');
    });

});
