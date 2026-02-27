import { dashboardsAutoCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { ContentsPanelMenuOptions } from '../../../pageObjects/dossierEditor/ContentsPanel.js';
import deleteObjectByNames from '../../../api/folderManagement/deleteObjectByNames.js';

describe('26.02 dashboard horizontal TOC under consumption', () => {
    const browserWindow = {
        width: 1920,
        height: 1080,
    };

    const narrowBrowserWindow = {
        width: 1280,
        height: 720,
    };

    const narrow720BrowserWindow = {
        width: 720,
        height: 720,
    };

    const responsiveBrowserWindow = {
        width: 500,
        height: 720,
    };

    const shortBrowserWindow = {
        width: 1280,
        height: 520,
    };

    const tutorialProject = 'MicroStrategy Tutorial';

    const horizontalTOC1ChapterMPagesLongName = {
        id: '520C01AAA741CB50A0C69FABB6162EDA',
        name: 'Horizontal TOC_Top_1Chapter9Pages_long name',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const horizontalTOC9ChaptersEach1Page = {
        id: 'FF99C89E2A4C252C09A2E99AFA03B6F8',
        name: 'Horizontal TOC_Top_9ChaptersEach1Page',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const horizontalTOCBottomMChapterMPages = {
        id: '54F06DC1F14DFE6F2C912699F5BA39A9',
        name: 'Horizontal TOC - Bottom_multiCMultiP',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const horizontalTOCTopMChapterMPages = {
        id: '58A2E73F314FDF5F912571B83A8DB4C0',
        name: 'Horizontal TOC - Top_multiCMultiP',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    let {
        loginPage,
        libraryPage,
        dossierCreator,
        libraryAuthoringPage,
        dossierAuthoringPage,
        toc,
        contentsPanel,
        dossierPage,
        filterPanel,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(dashboardsAutoCredentials);
        await setWindowSize(browserWindow);
    });

    it('[BCDA-3070_1] New Create to Apply to Consumption Mode of Top/Bottom Tab View', async () => {
        await dossierCreator.createNewDossier();
        await dossierCreator.switchProjectByName(tutorialProject);
        await dossierCreator.clickBlankDossierBtn();
        await dossierAuthoringPage.checkNotShowAgain();
        await contentsPanel.openContentsPanelSettings();
        const contentsPanelSettingsMenu = await contentsPanel.getContentsPanelSettingsMenu();
        await browser.pause(3000); // wait icon loaded
        await takeScreenshotByElement(contentsPanelSettingsMenu, 'BCDA-3070_1_01', 'Contents panel settings menu');

        // change to top tab view and apply to consumption mode
        await contentsPanel.clickContentsPanelMenuOption(ContentsPanelMenuOptions.APPLY_TO_CONSUMPTION);
        await contentsPanel.openContentsPanelSettings();
        await contentsPanel.clickContentsPanelMenuOption(ContentsPanelMenuOptions.TAB_VIEW_TOP);

        await dossierAuthoringPage.saveAndOpen();
        const newDossierName = 'BCDA-3070_Consumption_Horizontal_TOC' + Math.random(1000);
        await dossierAuthoringPage.inputDossierNameAndSave(newDossierName);
        await dossierPage.waitForDossierLoading();
        //await dossierAuthoringPage.closeSavedSuccessfullyToast();
        await toc.openMenuNoCheck();
        let horizontalTOCBar = await toc.getConsumptionHorizontalTOCBar();
        await takeScreenshotByElement(horizontalTOCBar, 'BCDA-3070_1_02', 'Consumption Tab View - Top');

        // change to bottom tab view
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await contentsPanel.clickHorizontalTOCMenuButton();
        await contentsPanel.clickContentsPanelMenuOption(ContentsPanelMenuOptions.TAB_VIEW_BOTTOM);
        await dossierAuthoringPage.saveAndOpen();
        //await dossierAuthoringPage.closeSavedSuccessfullyToast();
        await browser.pause(6000); // wait page tooltip disappear
        let dossierViewContainer = await dossierPage.getDossierView();
        await takeScreenshotByElement(dossierViewContainer, 'BCDA-3070_1_03', 'Consumption Tab View - Bottom');
        await dossierPage.goToLibrary();

        await deleteObjectByNames({
            credentials: dashboardsAutoCredentials,
            projectId: horizontalTOC1ChapterMPagesLongName.project.id,
            parentFolderId: 'D3C7D461F69C4610AA6BAA5EF51F4125',
            names: [newDossierName],
        });
    });

    it('[BCDA-3070_2] Top Tab View One Chapter with left and right arrows', async () => {
        let url =
            browser.options.baseUrl +
            `app/${horizontalTOC1ChapterMPagesLongName.project.id}/${horizontalTOC1ChapterMPagesLongName.id}`;
        await libraryPage.openDossierByUrl(url.toString());
        await dossierPage.resetDossierIfPossible();
        await toc.openMenuNoCheck();
        let horizontalTOCBar = await toc.getConsumptionHorizontalTOCBar();
        await takeScreenshotByElement(horizontalTOCBar, 'BCDA-3070_2_01', 'Top TOC - 1 chapter and 9 pages long name');

        await setWindowSize(narrowBrowserWindow);
        horizontalTOCBar = await toc.getConsumptionHorizontalTOCBar();
        await takeScreenshotByElement(horizontalTOCBar, 'BCDA-3070_2_02', 'Top TOC when narrow browser');

        await toc.clickRightArrow();
        horizontalTOCBar = await toc.getConsumptionHorizontalTOCBar();
        await takeScreenshotByElement(horizontalTOCBar, 'BCDA-3070_2_03', 'Top TOC - click right arrow');

        await toc.clickHorizontalTocMenu('Page 9 long long long long long long name');
        horizontalTOCBar = await toc.getConsumptionHorizontalTOCBar();
        await takeScreenshotByElement(horizontalTOCBar, 'BCDA-3070_2_04', 'Top TOC - click long page name');

        await toc.clickLeftArrow();
        horizontalTOCBar = await toc.getConsumptionHorizontalTOCBar();
        await takeScreenshotByElement(horizontalTOCBar, 'BCDA-3070_2_05', 'Top TOC - click left arrow');

        await toc.clickHorizontalTocMenu('1');
        await browser.pause(3000); // wait page tooltip disappear
        let dossierViewContainer = await dossierPage.getDossierView();
        await takeScreenshotByElement(dossierViewContainer, 'BCDA-3070_2_06', 'Top TOC - click short page name');
    });

    it('[BCDA-3070_3] Multiple Chapters Tab View', async () => {
        let url =
            browser.options.baseUrl +
            `app/${horizontalTOCBottomMChapterMPages.project.id}/${horizontalTOCBottomMChapterMPages.id}`;
        await libraryPage.openDossierByUrl(url.toString());
        await dossierPage.resetDossierIfPossible();
        await toc.openMenuNoCheck();
        let horizontalTOCBar = await toc.getConsumptionHorizontalTOCBar();
        await takeScreenshotByElement(
            horizontalTOCBar,
            'BCDA-3070_3_02',
            'Bottom TOC - Multiple chapters multiple pages'
        );

        await toc.hoverHorizontalTocMenu('1');
        let horizontalTocMenu = await toc.getHorizontalTocMenuContent();
        await takeScreenshotByElement(horizontalTocMenu, 'BCDA-3070_3_03', 'Bottom TOC - hover chapter to show menu');

        await toc.clickPageInHorizontalTocMenu('Page 1');
        await browser.pause(3000);

        await toc.clickHorizontalTocMenu('1');
        await toc.hoverPageInHorizontalTocMenu('Page 2 long 1 long 2 long  3 name long long long name end');
        // tooltip did not show in automation
        horizontalTocMenu = await toc.getHorizontalTocMenuContent();
        await takeScreenshotByElement(
            horizontalTocMenu,
            'BCDA-3070_3_04',
            'Bottom TOC - hover on long page name in menu'
        );

        await toc.hoverHorizontalTocMenu('Chapter 3 Chapter 3 Chapter 3 Chapter 3 Chapter 3 Chapter 3');
        horizontalTOCBar = await toc.getConsumptionHorizontalTOCBar();
        await takeScreenshotByElement(horizontalTOCBar, 'BCDA-3070_3_05', 'Bottom TOC - hover on long chapter name');
        await toc.clickHorizontalTocMenu('Chapter 3 Chapter 3 Chapter 3 Chapter 3 Chapter 3 Chapter 3');

        await toc.hoverHorizontalTocMenu('Chapter 2 long long long name');
        await browser.pause(1000);
        horizontalTocMenu = await toc.getHorizontalTocMenuContent();
        await takeScreenshotByElement(
            horizontalTocMenu,
            'BCDA-3070_3_06',
            'Bottom TOC - hover on long chapter name to show menu'
        );

        await setWindowSize(narrow720BrowserWindow);
        // wait for TOC resize
        await browser.pause(2000);
        horizontalTOCBar = await toc.getConsumptionHorizontalTOCBar();
        await takeScreenshotByElement(horizontalTOCBar, 'BCDA-3070_3_07', 'Bottom TOC when narrow browser');

        await setWindowSize(responsiveBrowserWindow);
        let responsiveTOC = await toc.getMobileTOC();
        await takeScreenshotByElement(responsiveTOC, 'BCDA-3070_3_08', 'Responsive TOC');

        await setWindowSize(browserWindow);
        await toc.openMenuNoCheck();
        horizontalTOCBar = await toc.getConsumptionHorizontalTOCBar();
        await takeScreenshotByElement(horizontalTOCBar, 'BCDA-3070_3_09', 'Back to wide browser');
    });

    it('[BCDA-3070_4] Horizontal TOC xfunc with filter summary', async () => {
        let url =
            browser.options.baseUrl +
            `app/${horizontalTOC9ChaptersEach1Page.project.id}/${horizontalTOC9ChaptersEach1Page.id}`;
        await libraryPage.openDossierByUrl(url.toString());
        await dossierPage.resetDossierIfPossible();
        await toc.openMenuNoCheck();
        let dossierViewContainer = await dossierPage.getDossierView();
        await takeScreenshotByElement(
            dossierViewContainer,
            'BCDA-3070_4_01',
            'Horizontal TOC xfunc with filter summary'
        );
        await filterPanel.openFilterPanel();
        let filterPanelContent = filterPanel.getFilterPanelWrapper();
        await takeScreenshotByElement(filterPanelContent, 'BCDA-3070_4_02', 'Horizontal TOC xfunc with filter panel');
        await dossierPage.goToLibrary();
    });

    it('[BCDA-3070_5] Horizontal TOC popover can scroll', async () => {
        await setWindowSize(shortBrowserWindow);
        let url =
            browser.options.baseUrl +
            `app/${horizontalTOCBottomMChapterMPages.project.id}/${horizontalTOCBottomMChapterMPages.id}`;
        await libraryPage.openDossierByUrl(url.toString());
        await dossierPage.resetDossierIfPossible();
        await toc.openMenuNoCheck();
        await toc.hoverHorizontalTocMenu('Many pages');
        let horizontalTocMenu = await toc.getHorizontalTocMenuContent();
        await takeScreenshotByElement(horizontalTocMenu, 'BCDA-3070_5_01', 'Bottom horizontal TOC popover can scroll');
        await dossierPage.goToLibrary();

        url =
            browser.options.baseUrl +
            `app/${horizontalTOCTopMChapterMPages.project.id}/${horizontalTOCTopMChapterMPages.id}`;
        await libraryPage.openDossierByUrl(url.toString());
        await dossierPage.resetDossierIfPossible();
        await toc.hoverHorizontalTocMenu('Many pages');
        horizontalTocMenu = await toc.getHorizontalTocMenuContent();
        await takeScreenshotByElement(horizontalTocMenu, 'BCDA-3070_5_02', 'Top horizontal TOC popover can scroll');
    });

    it('[BCDA-3070_6] Dock Horizontal TOC', async () => {
        let url =
            browser.options.baseUrl +
            `app/${horizontalTOCTopMChapterMPages.project.id}/${horizontalTOCTopMChapterMPages.id}`;
        await libraryPage.openDossierByUrl(url.toString());
        await dossierPage.resetDossierIfPossible();
        let isHorizontalTOCBarDisplayed = await toc.getConsumptionHorizontalTOCBar().isDisplayed();
        await expect(isHorizontalTOCBarDisplayed).toBe(true);

        await toc.openMenuNoCheck();
        isHorizontalTOCBarDisplayed = await toc.getConsumptionHorizontalTOCBar().isDisplayed();
        await expect(isHorizontalTOCBarDisplayed).toBe(false);
        await dossierPage.goToLibrary();

        await libraryPage.openDossierByUrl(url.toString());
        isHorizontalTOCBarDisplayed = await toc.getConsumptionHorizontalTOCBar().isDisplayed();
        await expect(isHorizontalTOCBarDisplayed).toBe(true);
    });

    it('[BCDA-3070_7] Dock filter panel', async () => {
        let url =
            browser.options.baseUrl +
            `app/${horizontalTOCTopMChapterMPages.project.id}/${horizontalTOCTopMChapterMPages.id}`;
        await libraryPage.openDossierByUrl(url.toString());
        await dossierPage.resetDossierIfPossible();

        let horizontalTOCBar = await toc.getConsumptionHorizontalTOCBar();
        await takeScreenshotByElement(horizontalTOCBar, 'BCDA-3070_7_01', 'Default filter panel docked');

        await filterPanel.undockFilterPanel();
        await filterPanel.closeFilterPanel();
        horizontalTOCBar = await toc.getConsumptionHorizontalTOCBar();
        await takeScreenshotByElement(horizontalTOCBar, 'BCDA-3070_7_02', 'Undocked filter panel');

        await filterPanel.openFilterPanel();
        await filterPanel.dockFilterPanel();
        horizontalTOCBar = await toc.getConsumptionHorizontalTOCBar();
        await takeScreenshotByElement(horizontalTOCBar, 'BCDA-3070_7_03', 'Docked filter panel');
    });
});
