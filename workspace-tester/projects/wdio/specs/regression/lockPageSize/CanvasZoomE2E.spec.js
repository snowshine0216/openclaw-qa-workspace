import { lockPageSizeCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import resetDossierState from '../../../api/resetDossierState.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('26.01 Improved Dashboard Authoring Zoom & Fit Options E2E', () => {
    const dossier = {
        id: 'FD6F22007F4A9052E45DA5AA4464CDCA',
        name: 'CanvasZoomE2E',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const browserWindow = {
        width: 1920,
        height: 1080,
    };

    const browserWindow1 = {
        width: 1024,
        height: 768,
    };

    const browserWindow2 = {
        width: 768,
        height: 1024,
    };

    let {
        libraryPage,
        loginPage,
        dossierEditorUtility,
        dossierAuthoringPage,
        dossierPage,
        contentsPanel,
        grid,
        toolbar,
        baseContainer,
        vizPanelForGrid,
        tocMenu,
        toc,
        tocContentsPanel,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(lockPageSizeCredentials);
        await setWindowSize(browserWindow);
    });

    // Container manipluations: maximize, restore ,move, resize, group, and other manipulations
    it('[QAC-487_1] Container manipluations: maximize, restore ,move, resize, group, and other manipulations', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Info window' });
        await dossierAuthoringPage.changeViewModeTo('75%');
        let vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-487_1_1', 'Set zoom level to 75%');

        await grid.maximizeContainer('Visualization 1');
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-487_1_2', 'Maximize visualization at zoom level to 75%');
        await grid.restoreContainer('Visualization 1');
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-487_1_3', 'Restore visualization at zoom level to 75%');

        await baseContainer.clickContainer("Text 3");
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-487_1_4', 'Trigger info window from Text 3');
        await baseContainer.clickContainer("Text 2");
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-487_1_5', 'Trigger info window from Text 2');

        await baseContainer.clickContainer("Visualization 4");
        await vizPanelForGrid.sortDescending("Year", "Visualization 4");
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-487_1_6', 'Sort Visualization 4');

        await baseContainer.moveContainerByPosition('Text 2', 'Selector 1 Selector 1 Selector 1 Selector 1 Selector 1', 'Left');
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-487_1_7', 'Move AM selector to the right of Text 2');
    });

    it('[QAC-487_2] Resize browser windows', async () => {
        await setWindowSize(browserWindow1);
        let vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-487_2_1', 'Resize browser window to 1024x768');

        await setWindowSize(browserWindow2);
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-487_2_2', 'Resize browser window to 768x1024');
    });


    it('[QAC-487_3] Insert pages/chapters', async () => {
        await setWindowSize(browserWindow);
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Grids' });
        await dossierAuthoringPage.changeViewModeTo('50%');
        let vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-487_3_1', 'Set zoom level to 50%');

        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Page');
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-487_3_2', 'Insert a new page at zoom level 50%');

        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Chapter');
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-487_3_3', 'Insert a new chapter at zoom level 50%');

        await dossierAuthoringPage.changeViewModeTo('75%');
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-487_3_4', 'Set zoom level to 75%');
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 2' });
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-487_3_5', 'Check page 2 after setting zoom level to 75%');
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Grids' });
        await browser.pause(2000);
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-487_3_6', 'check page Grid after setting zoom level to 75%');

        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Page');
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-487_3_7', 'Insert a new page at zoom level 75%');

        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Chapter');
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-487_3_8', 'Insert a new chapter at zoom level 75%');
    });

    it('[QAC-487_4] Duplicate', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });

        await dossierAuthoringPage.changeViewModeTo('125%');
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Pies' });
        let vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-487_4_1', 'Chapter 1 Page Pies after setting zoom level to 125%');

        await contentsPanel.rightClickPage({ chapterName: 'Chapter 1', pageName: 'Pies' });
        await contentsPanel.clickOptionAfterOpenMenu("Duplicate Page");
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Pies copy' });
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-487_4_2', 'Chapter 1 Page Pies copy at zoom level 125%');

        await tocMenu.duplicateChapter("Chapter 1");
        await contentsPanel.goToPage({ chapterName: 'Chapter 1 copy', pageName: 'Pies copy' });
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-487_4_3', 'Chapter 1 copy Page Pies copy at zoom level 125%');
        await contentsPanel.goToPage({ chapterName: 'Chapter 1 copy', pageName: 'Pies' });
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-487_4_4', 'Chapter 1 copy Page Pies at zoom level 125%');
    });

    it('[QAC-487_5] Delete and Undo', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });

        await dossierAuthoringPage.changeViewModeTo('75%');
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Info window' });
        console.log(await contentsPanel.getPagesCount());
        await since(`The dashboard should have #{expected} chapters, instead it has #{actual}`)
            .expect(await contentsPanel.getPagesCount())
            .toBe(21);
        let vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-487_5_1', 'Set zoom level to 75%');
        await tocContentsPanel.contextMenuOnPage('Info window', 'Chapter 1', 'Delete');
        console.log(await contentsPanel.getPagesCount());
        await since(`The dashboard should have #{expected} chapters, instead it has #{actual}`)
            .expect(await contentsPanel.getPagesCount())
            .toBe(20);
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-471_5_2', 'After deleting Page Info window');

        await toolbar.clickButtonFromToolbar('Undo');
        console.log(await contentsPanel.getPagesCount());
        await since(`The dashboard should have #{expected} chapters, instead it has #{actual}`)
            .expect(await contentsPanel.getPagesCount())
            .toBe(21);
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-471_5_3', 'Undo deleting Page Info window');

        await toolbar.clickButtonFromToolbar('Add Chapter');
        console.log(await contentsPanel.getChapterCount());
        await since(`The dashboard should have #{expected} chapters, instead it has #{actual}`)
            .expect(await contentsPanel.getChapterCount())
            .toBe(2);
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-471_5_4', 'After adding a new Chapter');
        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Delete');
        await browser.pause(2000);
        console.log(await contentsPanel.getChapterCount());
        await since(`The dashboard should have #{expected} chapters, instead it has #{actual}`)
            .expect(await contentsPanel.getChapterCount())
            .toBe(1);
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-471_5_5', 'After deleting Chapter 1');
        await toolbar.clickButtonFromToolbar('Undo');
        console.log(await contentsPanel.getChapterCount());
        await since(`The dashboard should have #{expected} chapters, instead it has #{actual}`)
            .expect(await contentsPanel.getChapterCount())
            .toBe(2);

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Info window' });
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-471_5_6', 'Page Info window After undo deleting Chapter 1');

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'freeform layout' });
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-471_5_7', 'Page freeform layout After undo deleting Chapter 1');
    });

    it('[QAC-487_6] switch layout', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });

        await dossierAuthoringPage.changeViewModeTo('75%');
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Info window' });
        let vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-471_6_1', 'Before switching Page Info window to Freeform layout');
        await dossierAuthoringPage.actionOnToolbar(
            `<b>Convert to Free-form Layout</b><br >Objects on the page can be independently positioned, sized, and layered.`
        );
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-471_6_2', 'After switching Page Info window to Freeform layout');

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'freeform layout' });
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-471_6_3', 'Before switching Page freeform layout to Automatic layout');
        await dossierAuthoringPage.actionOnToolbar(
            `<b>Convert to Automatic Layout</b><br >Objects automatically fill the entire canvas and can be repositioned around each other.`
        );
        vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-471_6_4', 'After switching Page freeform layout to Automatic layout');
    });

    it('[QAC-487_7] Canvas rendering after changing zoom level in responsive preview', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
        await dossierAuthoringPage.changeViewModeTo('75%');
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Info window' });
        await toolbar.clickButtonFromToolbar('Responsive Preview');
        let vizPanelContent = dossierEditorUtility.getVIVizPanel();
        await takeScreenshotByElement(vizPanelContent, 'QAC-487_7_1', 'Page Info window in Responsive preview at zoom level 75%');
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'freeform layout' });
        await takeScreenshotByElement(vizPanelContent, 'QAC-487_7_2', 'Page freeform layout in Responsive preview at zoom level 75%');
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'KPIs' });
        await takeScreenshotByElement(vizPanelContent, 'QAC-487_7_3', 'Page KPIs in Responsive preview at zoom level 75%');
    });

    it('[QAC-487_8] Canvas rendering in Library Consumption mode', async () => {
        const url = browser.options.baseUrl + `app/${dossier.project.id}/${dossier.id}`;
        await libraryPage.openDossierByUrl(url.toString());
        await dossierPage.resetDossierIfPossible();

        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Info window' });
        await browser.pause(2000);
        await takeScreenshotByElement(dossierPage.getDossierView(),  'QAC-487_8_1', 'Chapter 1 Page Info window in library consumption mode');
   
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'freeform layout' });
        await browser.pause(2000);
        await takeScreenshotByElement(dossierPage.getDossierView(),  'QAC-487_8_2', 'Chapter 1 Page freeform layout in consumption mode');
    });
   
});
