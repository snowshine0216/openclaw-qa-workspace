import setWindowSize from '../../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import { browserWindow } from '../../../../constants/index.js';
import * as dossierTXN from '../../../../constants/dossierTXN.js';
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';
import { Key } from 'webdriverio';
import resetDossierState from '../../../../api/resetDossierState.js';
import InCanvasSelector_Authoring from '../../../../pageObjects/authoring/InCanvasSelector_Authoring.js';

describe('25.10 Dashboard Level Formatting', () => {
    let {
        dossierAuthoringPage,
        baseVisualization,
        dossierPage,
        themePanel,
        htmlContainer,
        viPanelStack,
        toolbar,
        imageContainer,
        inCanvasSelector_Authoring,
        agGrid,
        loginPage,
        libraryPage,
        toc,
        contentsPanel,
        vizPanelForGrid,
        textbox,
    } = browsers.pageObj1;
    const dossier = {
        id: 'B03B1A876A4E0186E56898B7AB2342CA',
        name: 'DashboardFormatting',
        project: {
            id: dossierTXN.dossierTXNProject.id,
            name: dossierTXN.dossierTXNProject.name,
        },
    };
    const dossierConsumption = {
        id: '9D0DA3C9064CAA8325F80FB88AE25968',
        name: 'CustomizableTitleBar-Consumption',
        project: {
            id: dossierTXN.dossierTXNProject.id,
            name: dossierTXN.dossierTXNProject.name,
        },
    };

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await libraryPage.openDefaultApp();
        await loginPage.login(dossierTXN.txnAutoUser);
        await libraryPage.openDossierById({
            projectId: dossierTXN.dossierTXNProject.id,
            dossierId: '9966F2D44F427684BF80C08742BF4A90',
        });
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'RestoreData_ygu_year_category_sls' });
        await agGrid.openContextMenuItemForCellAtPosition(2, 2, 'Delete Row', 'RestoreData_ygu_year_category_sls');
        await agGrid.selectConfirmationPopupOption('Continue');
    });
    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[QAC255_1] Apply 1 line title theme to normal grid', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
        await libraryPage.waitForCurtainDisappear();
        await dossierAuthoringPage.waitForAuthoringPageLoading();

        await contentsPanel.goToPage({ chapterName: 'Grid', pageName: 'Normal' });
        await dossierAuthoringPage.actionOnMenubar('Format');
        await dossierAuthoringPage.actionOnSubmenuNoContinue('Select Theme');
        await themePanel.searchTheme('GridWith1LineTitle');
        await themePanel.applyTheme('GridWith1LineTitle');
        //Check the theme is applied
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('NormalGrid'),
            'QAC255_1_01',
            'NormalGrid Title bar applied theme GridWith1LineTitle'
        );
        await since(
            '1.The grid "NormalGrid" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridContainer('NormalGrid').getCSSProperty('border-top-left-radius')).value
            )
            .toBe('20px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('OnlyButton'),
            'QAC255_1_02',
            'OnlyButton Title bar applied theme GridWith1LineTitle'
        );
        await since(
            '2.The grid "OnlyButton" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridContainer('OnlyButton').getCSSProperty('border-top-left-radius')).value
            )
            .toBe('20px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('2Linetitle+buttons'),
            'QAC255_1_03',
            '2Linetitle+buttons Title bar applied theme GridWith1LineTitle'
        );
        await since(
            '3.The grid "2Linetitle+buttons" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridContainer('2Linetitle+buttons').getCSSProperty('border-top-left-radius')).value
            )
            .toBe('20px');
        await since(
            '4.The grid "DisableTitles" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridContainer('DisableTitles').getCSSProperty('border-top-left-radius')).value
            )
            .toBe('20px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('1LineTitle'),
            'QAC255_1_04',
            '1LineTitle Title bar applied theme GridWith1LineTitle'
        );
        await since(
            '5.The grid "1LineTitle" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridContainer('1LineTitle').getCSSProperty('border-top-left-radius')).value
            )
            .toBe('20px');
        //Go to page ModernGrid
        await contentsPanel.goToPage({ chapterName: 'Grid', pageName: 'ModernGrid' });
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('AllActions'),
            'QAC255_1_05',
            'ModernGrid Title bar applied theme GridWith1LineTitle'
        );
        await since(
            '6.The grid "AllActions" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridContainer('AllActions').getCSSProperty('border-top-left-radius')).value
            )
            .toBe('20px');
    });
    it('[QAC255_2] Apply 2 lines title theme to normal grid', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
        await libraryPage.waitForCurtainDisappear();
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        //Go to page Normal
        await contentsPanel.goToPage({ chapterName: 'Grid', pageName: 'Normal' });
        await dossierAuthoringPage.actionOnMenubar('Format');
        await dossierAuthoringPage.actionOnSubmenuNoContinue('Select Theme');
        await themePanel.searchTheme('GridWithSubtitle');
        await themePanel.applyTheme('GridWithSubtitle');
        //Check the theme is applied
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('NormalGrid'),
            'QAC255_2_01',
            'NormalGrid Title bar applied theme GridWithSubtitle'
        );
        await since(
            '1.The grid "NormalGrid" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridContainer('NormalGrid').getCSSProperty('border-top-left-radius')).value
            )
            .toBe('2px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('OnlyButton'),
            'QAC255_2_02',
            'OnlyButton Title bar applied theme GridWithSubtitle'
        );
        await since(
            '2.The grid "OnlyButton" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridContainer('OnlyButton').getCSSProperty('border-top-left-radius')).value
            )
            .toBe('2px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('2Linetitle+buttons'),
            'QAC255_2_03',
            '2Linetitle+buttons Title bar applied theme GridWithSubtitle'
        );
        await since(
            '3.The grid "2Linetitle+buttons" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridContainer('2Linetitle+buttons').getCSSProperty('border-top-left-radius')).value
            )
            .toBe('2px');
        await since(
            '4.The grid "DisableTitles" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridContainer('DisableTitles').getCSSProperty('border-top-left-radius')).value
            )
            .toBe('2px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('1LineTitle'),
            'QAC255_2_04',
            '1LineTitle Title bar applied theme GridWithSubtitle'
        );
        await since(
            '5.The grid "1LineTitle" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridContainer('1LineTitle').getCSSProperty('border-top-left-radius')).value
            )
            .toBe('2px');
        //Go to page ModernGrid
        await contentsPanel.goToPage({ chapterName: 'Grid', pageName: 'ModernGrid' });
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('AllActions'),
            'QAC255_2_05',
            'AllActions Title bar applied theme GridWithSubtitle'
        );
        await since(
            '6.The grid "AllActions" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridContainer('AllActions').getCSSProperty('border-top-left-radius')).value
            )
            .toBe('2px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('2LineTitles'),
            'QAC255_2_06',
            'AllActions Title bar applied theme GridWithSubtitle'
        );
        await since(
            '7.The grid "2LineTitles" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridContainer('2LineTitles').getCSSProperty('border-top-left-radius')).value
            )
            .toBe('2px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Modern+1Line'),
            'QAC255_2_07',
            'Modern+1Line Title bar applied theme GridWithSubtitle'
        );
        await since(
            '8.The grid "Modern+1Line" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridContainer('Modern+1Line').getCSSProperty('border-top-left-radius')).value
            )
            .toBe('2px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('MultipleCS'),
            'QAC255_2_08',
            'MultipleCS Title bar applied theme GridWithSubtitle'
        );
        await since(
            '9.The grid "MultipleCS" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridContainer('MultipleCS').getCSSProperty('border-top-left-radius')).value
            )
            .toBe('2px');
    });
    it('[QAC255_3] Apply 2 lines+button theme to normal grid', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
        await libraryPage.waitForCurtainDisappear();
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        //Go to page Normal
        await contentsPanel.goToPage({ chapterName: 'Grid', pageName: 'Normal' });
        await dossierAuthoringPage.actionOnMenubar('Format');
        await dossierAuthoringPage.actionOnSubmenuNoContinue('Select Theme');
        await themePanel.searchTheme('GridWithSubtitle+Button');
        await themePanel.applyTheme('GridWithSubtitle+Button');
        //Check the theme is applied
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('NormalGrid'),
            'QAC255_3_01',
            'NormalGrid Title bar applied theme 2 lines+button'
        );
        await since(
            '1.The grid "NormalGrid" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridContainer('NormalGrid').getCSSProperty('border-top-left-radius')).value
            )
            .toBe('40px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('OnlyButton'),
            'QAC255_3_02',
            'OnlyButton Title bar applied theme 2 lines+button'
        );
        await since(
            '2.The grid "OnlyButton" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridContainer('OnlyButton').getCSSProperty('border-top-left-radius')).value
            )
            .toBe('40px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('2Linetitle+buttons'),
            'QAC255_3_03',
            '2Linetitle+buttons Title bar applied theme 2 lines+button'
        );
        await since(
            '3.The grid "2Linetitle+buttons" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridContainer('2Linetitle+buttons').getCSSProperty('border-top-left-radius')).value
            )
            .toBe('40px');
        await since(
            '4.The grid "DisableTitles" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridContainer('DisableTitles').getCSSProperty('border-top-left-radius')).value
            ).toBe('40px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('1LineTitle'),
            'QAC255_3_04',
            '1LineTitle Title bar applied theme 2 lines+button'
        );
        await since(
            '5.The grid "1LineTitle" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridContainer('1LineTitle').getCSSProperty('border-top-left-radius')).value
            )
            .toBe('40px');
        await contentsPanel.goToPage({ chapterName: 'Grid', pageName: 'ModernGrid' });
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('AllActions'),
            'QAC255_3_05',
            'AllActions Title bar applied theme 2 lines+button'
        );
        await since(
            '6.The grid "AllActions" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridContainer('AllActions').getCSSProperty('border-top-left-radius')).value
            )
            .toBe('40px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('2LineTitles'),
            'QAC255_3_06',
            '2LineTitles Title bar applied theme 2 lines+button'
        );
        await since(
            '7.The grid "2LineTitles" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridContainer('2LineTitles').getCSSProperty('border-top-left-radius')).value
            )
            .toBe('40px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Modern+1Line'),
            'QAC255_3_07',
            'Modern+1Line Title bar applied theme 2 lines+button'
        );
        await since(
            '8.The grid "Modern+1Line" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridContainer('Modern+1Line').getCSSProperty('border-top-left-radius')).value
            )
            .toBe('40px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('MultipleCS'),
            'QAC255_3_08',
            'MultipleCS Title bar applied theme 2 lines+button'
        );
        await since(
            '9.The grid "MultipleCS" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridContainer('MultipleCS').getCSSProperty('border-top-left-radius')).value
            )
            .toBe('40px');
    });
    it('[QAC255_4] Apply 2lines+button AG grid theme to grid', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
        await libraryPage.waitForCurtainDisappear();
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        //Go to page Normal
        await contentsPanel.goToPage({ chapterName: 'Grid', pageName: 'Normal' });
        await dossierAuthoringPage.actionOnMenubar('Format');
        await dossierAuthoringPage.actionOnSubmenuNoContinue('Select Theme');
        await themePanel.searchTheme('ModernGrid2Line+Button');
        await themePanel.applyTheme('ModernGrid2Line+Button');
        //Check the theme is applied
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('NormalGrid'),
            'QAC255_4_01',
            'NormalGrid Title bar applied theme 2 lines+button'
        );
        await since(
            '1.The grid "NormalGrid" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridContainer('NormalGrid').getCSSProperty('border-top-left-radius')).value
            )
            .toBe('33px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('OnlyButton'),
            'QAC255_4_02',
            'OnlyButton Title bar applied theme 2 lines+button'
        );
        await since(
            '2.The grid "OnlyButton" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridContainer('OnlyButton').getCSSProperty('border-top-left-radius')).value
            )
            .toBe('33px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('2Linetitle+buttons'),
            'QAC255_4_03',
            '2Linetitle+buttons Title bar applied theme 2 lines+button'
        );
        await since(
            '3.The grid "2Linetitle+buttons" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridContainer('2Linetitle+buttons').getCSSProperty('border-top-left-radius')).value
            )
            .toBe('33px');
        //Go to page ModernGrid
        await contentsPanel.goToPage({ chapterName: 'Grid', pageName: 'ModernGrid' });
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('AllActions'),
            'QAC255_4_05',
            'AllActions Title bar applied theme 2 lines+button'
        );
        await since(
            '4.The grid "AllActions" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridContainer('AllActions').getCSSProperty('border-top-left-radius')).value
            )
            .toBe('33px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('MultipleCS'),
            'QAC255_4_06',
            'MultipleCS Title bar applied theme 2 lines+button'
        );
        await since(
            '5.The grid "MultipleCS" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridContainer('MultipleCS').getCSSProperty('border-top-left-radius')).value
            )
            .toBe('33px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('2LineTitles'),
            'QAC255_4_07',
            '2LineTitles Title bar applied theme 2 lines+button'
        );
        await since(
            '6.The grid "2LineTitles" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridContainer('2LineTitles').getCSSProperty('border-top-left-radius')).value
            )
            .toBe('33px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Insert'),
            'QAC255_4_08',
            'Insert Title bar applied theme 2 lines+button'
        );
        await since(
            '7.The grid "Insert" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('Insert').getCSSProperty('border-top-left-radius')).value)
            .toBe('33px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Modern+1Line'),
            'QAC255_4_09',
            'Modern+1Line Title bar applied theme 2 lines+button'
        );
        await since(
            '8.The grid "Modern+1Line" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridContainer('Modern+1Line').getCSSProperty('border-top-left-radius')).value
            )
            .toBe('33px');
    });
    it('[QAC255_5] Apply 2LineTitles AG grid theme to grid', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
        await libraryPage.waitForCurtainDisappear();
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        //Go to page Normal
        await contentsPanel.goToPage({ chapterName: 'Grid', pageName: 'Normal' });
        await dossierAuthoringPage.actionOnMenubar('Format');
        await dossierAuthoringPage.actionOnSubmenuNoContinue('Select Theme');
        await themePanel.searchTheme('ModernGridWithSubtitle');
        await themePanel.applyTheme('ModernGridWithSubtitle');  
        //Check the theme is applied
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('NormalGrid'),
            'QAC255_5_01',
            'NormalGrid Title bar applied theme ModernGridWithSubtitle'
        );
        await since(
            '1.The grid "NormalGrid" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridContainer('NormalGrid').getCSSProperty('border-top-left-radius')).value
            )
            .toBe('22px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('OnlyButton'),
            'QAC255_5_02',
            'OnlyButton Title bar applied theme ModernGridWithSubtitle'
        );
        await since(
            '2.The grid "OnlyButton" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridContainer('OnlyButton').getCSSProperty('border-top-left-radius')).value
            )
            .toBe('22px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('2Linetitle+buttons'),
            'QAC255_5_03',
            '2Linetitle+buttons Title bar applied theme ModernGridWithSubtitle'
        );
        await since(
            '3.The grid "2Linetitle+buttons" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridContainer('2Linetitle+buttons').getCSSProperty('border-top-left-radius')).value
            )
            .toBe('22px');
        //Go to page ModernGrid
        await contentsPanel.goToPage({ chapterName: 'Grid', pageName: 'ModernGrid' });
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('AllActions'),
            'QAC255_5_04',
            'AllActions Title bar applied theme ModernGridWithSubtitle'
        );
        await since(
            '4.The grid "AllActions" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridContainer('AllActions').getCSSProperty('border-top-left-radius')).value
            )
            .toBe('22px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('MultipleCS'),
            'QAC255_5_05',
            'MultipleCS Title bar applied theme ModernGridWithSubtitle'
        );
        await since(
            '5.The grid "MultipleCS" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridContainer('MultipleCS').getCSSProperty('border-top-left-radius')).value
            )
            .toBe('22px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('2LineTitles'),
            'QAC255_5_06',
            '2LineTitles Title bar applied theme ModernGridWithSubtitle'
        );
        await since(
            '6.The grid "2LineTitles" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridContainer('2LineTitles').getCSSProperty('border-top-left-radius')).value
            )
            .toBe('22px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Insert'),
            'QAC255_5_07',
            'Insert Title bar applied theme ModernGridWithSubtitle'
        );
        await since(
            '7.The grid "Insert" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('Insert').getCSSProperty('border-top-left-radius')).value)
            .toBe('22px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Modern+1Line'),
            'QAC255_5_08',
            'Modern+1Line Title bar applied theme ModernGridWithSubtitle'
        );
        await since(
            '8.The grid "Modern+1Line" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridContainer('Modern+1Line').getCSSProperty('border-top-left-radius')).value
            )
            .toBe('22px');
    });
    it('[QAC255_6] Apply GM theme to GM', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
        await libraryPage.waitForCurtainDisappear();
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        //Go to page GM
        await contentsPanel.goToPage({ chapterName: 'GM', pageName: 'GM' });
        await dossierAuthoringPage.actionOnMenubar('Format');
        await dossierAuthoringPage.actionOnSubmenuNoContinue('Select Theme');
        await themePanel.searchTheme('GMWith1LineTitle');
        await themePanel.applyTheme('GMWith1LineTitle');
        //Check the theme is applied
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Bar'),
            'QAC255_6_01',
            'Bar Title bar applied theme GMWith1LineTitle'
        );
        await since(
            '1.The grid "Bar" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('Bar').getCSSProperty('border-top-left-radius')).value)
            .toBe('21px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Combo'),
            'QAC255_6_02',
            'Combo Title bar applied theme GMWith1LineTitle'
        );
        await since(
            '2.The grid "Combo" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('Combo').getCSSProperty('border-top-left-radius')).value)
            .toBe('21px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Line'),
            'QAC255_6_03',
            'Line Title bar applied theme GMWith1LineTitle'
        );
        await since(
            '3.The grid "Line" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('Line').getCSSProperty('border-top-left-radius')).value)
            .toBe('21px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Bubble'),
            'QAC255_6_04',
            'Bubble Title bar applied theme GMWith1LineTitle'
        );
        await since(
            '4.The grid "Bubble" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('Bubble').getCSSProperty('border-top-left-radius')).value)
            .toBe('21px');
        await since(
            '5.The grid "Pie" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('Pie').getCSSProperty('border-top-left-radius')).value)
            .toBe('21px');
        //Click undo to reset the theme
        await toolbar.clickButtonFromToolbar('Undo');
        await dossierAuthoringPage.actionOnMenubar('Format');
        await dossierAuthoringPage.actionOnSubmenuNoContinue('Select Theme');
        await themePanel.searchTheme('GMWithSubtitle+Button');
        await themePanel.applyTheme('GMWithSubtitle+Button');
        //Check the theme is applied
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Bar'),
            'QAC255_6_05',
            'Bar Title bar applied theme GMWithSubtitle+Button'
        );
        await since(
            '6.The grid "Bar" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('Bar').getCSSProperty('border-top-left-radius')).value)
            .toBe('15px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Combo'),
            'QAC255_6_06',
            'Combo Title bar applied theme GMWithSubtitle+Button'
        );
        await since(
            '7.The grid "Combo" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('Combo').getCSSProperty('border-top-left-radius')).value)
            .toBe('15px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Line'),
            'QAC255_6_07',
            'Line Title bar applied theme GMWithSubtitle+Button'
        );
        await since(
            '8.The grid "Line" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('Line').getCSSProperty('border-top-left-radius')).value)
            .toBe('15px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Bubble'),
            'QAC255_6_08',
            'Bubble Title bar applied theme GMWithSubtitle+Button'
        );
        await since(
            '9.The grid "Bubble" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('Bubble').getCSSProperty('border-top-left-radius')).value)
            .toBe('15px');
        await since(
            '10.The grid "Pie" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('Pie').getCSSProperty('border-top-left-radius')).value)
            .toBe('15px');
    });
    it('[QAC255_7] Apply Map theme to Map', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
        await libraryPage.waitForCurtainDisappear();
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        //Go to page Map
        await contentsPanel.goToPage({ chapterName: 'Map', pageName: 'Map' });
        await libraryPage.sleep(5000); //wait for map viz to load completely
        await dossierAuthoringPage.actionOnMenubar('Format');
        await dossierAuthoringPage.actionOnSubmenuNoContinue('Select Theme');
        await themePanel.searchTheme('MapWith1Line');
        await themePanel.applyTheme('MapWith1Line');

        //Check the theme is applied
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Mapbox'),
            'QAC255_7_01',
            'Mapbox Title bar applied theme MapWith1LineTitle'
        );
        await since('1.1 The grid "Mapbox" is still mapbox, the value is #{expected}, instead it is #{actual}')
            .expect(await (await vizPanelForGrid.GetMapType('Mapbox')).getAttribute('class'))
            .toContain('mapbox');
        await since(
            '1.2 The grid "Mapbox" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('Mapbox').getCSSProperty('border-top-left-radius')).value)
            .toBe('30px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('ESRI'),
            'QAC255_7_03',
            'ESRI Title bar applied theme MapWith1LineTitle'
        );
        await since('2.1 The grid "ESRI" is still ESRI, the value is #{expected}, instead it is #{actual}')
            .expect(await (await vizPanelForGrid.GetMapType('ESRI')).getAttribute('class'))
            .toContain('esri');
        await since(
            '2.2 The grid "ESRI" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('ESRI').getCSSProperty('border-top-left-radius')).value)
            .toBe('20px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Mapbox2'),
            'QAC255_7_05',
            'Mapbox2 Title bar applied theme MapWith1LineTitle'
        );
        await since(
            '3.The grid "Mapbox2" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('Mapbox2').getCSSProperty('border-top-left-radius')).value)
            .toBe('30px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('ESRI2'),
            'QAC255_7_06',
            'ESRI2 Title bar applied theme MapWith1LineTitle'
        );
        await since(
            '4.The grid "ESRI2" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('ESRI2').getCSSProperty('border-top-left-radius')).value)
            .toBe('20px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Mapbox3'),
            'QAC255_7_07',
            'Mapbox3 Title bar applied theme MapWith1LineTitle'
        );
        await since(
            '5.The grid "Mapbox3" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('Mapbox3').getCSSProperty('border-top-left-radius')).value)
            .toBe('30px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('ESRI3'),
            'QAC255_7_08',
            'ESRI3 Title bar applied theme MapWith1LineTitle'
        );
        await since(
            '6.The grid "ESRI3" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('ESRI3').getCSSProperty('border-top-left-radius')).value)
            .toBe('20px');
        //click undo to reset the theme
        await toolbar.clickButtonFromToolbar('Undo');
        await dossierAuthoringPage.actionOnMenubar('Format');
        await dossierAuthoringPage.actionOnSubmenuNoContinue('Select Theme');
        await themePanel.searchTheme('MapWithSubtitle+button');
        await themePanel.applyTheme('MapWithSubtitle+button');
        //Check the theme is applied
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Mapbox'),
            'QAC255_7_09',
            'Mapbox Title bar applied theme MapWithSubtitle+button'
        );
        await since('7.1 The grid "Mapbox" is still mapbox, the value is #{expected}, instead it is #{actual}')
            .expect(await (await vizPanelForGrid.GetMapType('Mapbox')).getAttribute('class'))
            .toContain('mapbox');
        await since(
            '7.2 The grid "Mapbox" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('Mapbox').getCSSProperty('border-top-left-radius')).value)
            .toBe('10px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('ESRI'),
            'QAC255_7_11',
            'ESRI Title bar applied theme MapWithSubtitle+button'
        );
        await since('8.1 The grid "ESRI" is still ESRI, the value is #{expected}, instead it is #{actual}')
            .expect(await (await vizPanelForGrid.GetMapType('ESRI')).getAttribute('class'))
            .toContain('esri');
        await since(
            '8.2 The grid "ESRI" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('ESRI').getCSSProperty('border-top-left-radius')).value)
            .toBe('20px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Mapbox2'),
            'QAC255_7_13',
            'Mapbox2 Title bar applied theme MapWithSubtitle+button'
        );
        await since(
            '9.The grid "Mapbox2" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('Mapbox2').getCSSProperty('border-top-left-radius')).value)
            .toBe('10px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('ESRI2'),
            'QAC255_7_14',
            'ESRI2 Title bar applied theme MapWithSubtitle+button'
        );
        await since(
            '10.The grid "ESRI2" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('ESRI2').getCSSProperty('border-top-left-radius')).value)
            .toBe('20px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Mapbox3'),
            'QAC255_7_15',
            'Mapbox3 Title bar applied theme MapWithSubtitle+button'
        );
        await since(
            '11.The grid "Mapbox3" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('Mapbox3').getCSSProperty('border-top-left-radius')).value)
            .toBe('10px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('ESRI3'),
            'QAC255_7_16',
            'ESRI3 Title bar applied theme MapWithSubtitle+button'
        );
        await since(
            '12.The grid "ESRI3" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('ESRI3').getCSSProperty('border-top-left-radius')).value)
            .toBe('20px');
    });
    it('[QAC255_8] Apply 1 line KPI Theme to KPI', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
        await libraryPage.waitForCurtainDisappear();
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        //Go to page kpi
        await contentsPanel.goToPage({ chapterName: 'KPI', pageName: '2lines+button' });
        await dossierAuthoringPage.actionOnMenubar('Format');
        await dossierAuthoringPage.actionOnSubmenuNoContinue('Select Theme');
        await themePanel.searchTheme('KPIWith1line');
        await themePanel.applyTheme('KPIWith1line');
        //Check the theme is applied
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('KPI'),
            'QAC255_8_01',
            'KPI Title bar applied theme KPIWith1line'
        );
        await since(
            '1.The grid "KPI" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('KPI').getCSSProperty('border-top-left-radius')).value)
            .toBe('18px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('MMKPI'),
            'QAC255_8_02',
            'MMKPI Title bar applied theme KPIWith1line'
        );
        await since(
            '2.The grid "MMKPI" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('MMKPI').getCSSProperty('border-top-left-radius')).value)
            .toBe('28px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('ComparisonKPI'),
            'QAC255_8_03',
            'ComparisonKPI Title bar applied theme KPIWith1line'
        );
        await since(
            '3.The grid "ComparisonKPI" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('ComparisonKPI').getCSSProperty('border-top-left-radius')).value)
            .toBe('8px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Gauge'),
            'QAC255_8_04',
            'Gauge Title bar applied theme KPIWith1line'
        );
        await since(
            '4.The grid "Gauge" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('Gauge').getCSSProperty('border-top-left-radius')).value)
            .toBe('38px');
        await contentsPanel.goToPage({ chapterName: 'KPI', pageName: '1line' });
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('KPI'),
            'QAC255_8_05',
            'KPI Title bar applied theme KPIWith1line'
        );
        await since(
            '5.The grid "KPI" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('KPI').getCSSProperty('border-top-left-radius')).value)
            .toBe('18px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('MMKPI'),
            'QAC255_8_06',
            'MMKPI Title bar applied theme KPIWith1line'
        );
        await since(
            '6.The grid "MMKPI" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('MMKPI').getCSSProperty('border-top-left-radius')).value)
            .toBe('28px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('ComparisonKPI'),
            'QAC255_8_07',
            'ComparisonKPI Title bar applied theme KPIWith1line'
        );
        await since(
            '7.The grid "ComparisonKPI" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('ComparisonKPI').getCSSProperty('border-top-left-radius')).value)
            .toBe('8px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Gauge'),
            'QAC255_8_08',
            'Gauge Title bar applied theme KPIWith1line'
        );
        await since(
            '8.The grid "Gauge" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('Gauge').getCSSProperty('border-top-left-radius')).value)
            .toBe('38px');
    });
    it('[QAC255_9] Apply 2 lines+button KPI Theme to KPI', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
        await libraryPage.waitForCurtainDisappear();
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        //Go to page kpi
        await contentsPanel.goToPage({ chapterName: 'KPI', pageName: '2lines+button' });
        await dossierAuthoringPage.actionOnMenubar('Format');
        await dossierAuthoringPage.actionOnSubmenuNoContinue('Select Theme');
        await themePanel.searchTheme('KPIWithSubtitle+button');
        await themePanel.applyTheme('KPIWithSubtitle+button');
        //Check the theme is applied
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('KPI'),
            'QAC255_9_01',
            'KPI Title bar applied theme KPIWithSubtitle+button'
        );
        await since(
            '1.The grid "KPI" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('KPI').getCSSProperty('border-top-left-radius')).value)
            .toBe('22px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('MMKPI'),
            'QAC255_9_02',
            'MMKPI Title bar applied theme KPIWithSubtitle+button'
        );
        await since(
            '2.The grid "MMKPI" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('MMKPI').getCSSProperty('border-top-left-radius')).value)
            .toBe('2px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('ComparisonKPI'),
            'QAC255_9_03',
            'ComparisonKPI Title bar applied theme KPIWithSubtitle+button'
        );
        await since(
            '3.The grid "ComparisonKPI" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('ComparisonKPI').getCSSProperty('border-top-left-radius')).value)
            .toBe('32px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Gauge'),
            'QAC255_9_04',
            'Gauge Title bar applied theme KPIWithSubtitle+button'
        );
        await since(
            '4.The grid "Gauge" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('Gauge').getCSSProperty('border-top-left-radius')).value)
            .toBe('0px');
        await contentsPanel.goToPage({ chapterName: 'KPI', pageName: '1line' });
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('KPI'),
            'QAC255_9_05',
            'KPI Title bar applied theme KPIWithSubtitle+button'
        );
        await since(
            '5.The grid "KPI" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('KPI').getCSSProperty('border-top-left-radius')).value)
            .toBe('22px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('MMKPI'),
            'QAC255_9_06',
            'MMKPI Title bar applied theme KPIWithSubtitle+button'
        );
        await since(
            '6.The grid "MMKPI" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('MMKPI').getCSSProperty('border-top-left-radius')).value)
            .toBe('2px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('ComparisonKPI'),
            'QAC255_9_07',
            'ComparisonKPI Title bar applied theme KPIWithSubtitle+button'
        );
        await since(
            '7.The grid "ComparisonKPI" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('ComparisonKPI').getCSSProperty('border-top-left-radius')).value)
            .toBe('32px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Gauge'),
            'QAC255_9_08',
            'Gauge Title bar applied theme KPIWithSubtitle+button'
        );
        await since(
            '8.The grid "Gauge" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('Gauge').getCSSProperty('border-top-left-radius')).value)
            .toBe('0px');
    });
    it('[QAC255_10] Apply 1 line heatmap network waterfall Theme', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
        await libraryPage.waitForCurtainDisappear();
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        //Go to page HM+NW+WF
        await contentsPanel.goToPage({ chapterName: 'More', pageName: 'HM+NW+WF' });
        await dossierAuthoringPage.actionOnMenubar('Format');
        await dossierAuthoringPage.actionOnSubmenuNoContinue('Select Theme');
        await themePanel.searchTheme('HM+NW+WF+1line');
        await themePanel.applyTheme('HM+NW+WF+1line');
        //Check the theme is applied
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('HM1Line'),
            'QAC255_10_01',
            'HM1Line Title bar applied theme HM+NW+WF+1line'
        );
        await since(
            '1.The grid "HM1Line" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('HM1Line').getCSSProperty('border-top-left-radius')).value)
            .toBe('11px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Network1Line'),
            'QAC255_10_02',
            'Network1Line Title bar applied theme HM+NW+WF+1line'
        );
        await since(
            '2.The grid "Network1Line" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('Network1Line').getCSSProperty('border-top-left-radius')).value)
            .toBe('19px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('WaterFall1Line'),
            'QAC255_10_03',
            'WaterFall1Line Title bar applied theme HM+NW+WF+1line'
        );
        await since(
            '3.The grid "WaterFall1Line" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('WaterFall1Line').getCSSProperty('border-top-left-radius')).value)
            .toBe('29px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('HM2lines+button'),
            'QAC255_10_04',
            'HM2lines+button Title bar applied theme HM+NW+WF+1line'
        );
        await since(
            '4.The grid "HM2lines+button" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('HM2lines+button').getCSSProperty('border-top-left-radius')).value)
            .toBe('11px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Network2lines+button'),
            'QAC255_10_05',
            'Network2lines+button Title bar applied theme HM+NW+WF+1line'
        );
        await since(
            '5.The grid "Network2lines+button" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('Network2lines+button').getCSSProperty('border-top-left-radius')).value)
            .toBe('19px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('WaterFall2lines+button'),
            'QAC255_10_06',
            'WaterFall2lines+button Title bar applied theme HM+NW+WF+1line'
        );
        await since(
            '6.The grid "WaterFall2lines+button" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('WaterFall2lines+button').getCSSProperty('border-top-left-radius')).value)
            .toBe('29px');
    });
    it('[QAC255_11] Apply 2 lines+button heatmap network waterfall Theme', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
        await libraryPage.waitForCurtainDisappear();
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        //Go to page HM+NW+WF
        await contentsPanel.goToPage({ chapterName: 'More', pageName: 'HM+NW+WF' });
        await dossierAuthoringPage.actionOnMenubar('Format');
        await dossierAuthoringPage.actionOnSubmenuNoContinue('Select Theme');
        await themePanel.searchTheme('HM+NW+WF+2lines+button');
        await themePanel.applyTheme('HM+NW+WF+2lines+button');
        //Check the theme is applied
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('HM1Line'),
            'QAC255_11_01',
            'HM1Line Title bar applied theme HM+NW+WF+2lines+button'
        );
        await since(
            '1.The grid "HM1Line" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('HM1Line').getCSSProperty('border-top-left-radius')).value)
            .toBe('18px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Network1Line'),
            'QAC255_11_02',
            'Network1Line Title bar applied theme HM+NW+WF+Subtitle+button'
        );
        await since(
            '2.The grid "Network1Line" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('Network1Line').getCSSProperty('border-top-left-radius')).value)
            .toBe('28px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('WaterFall1Line'),
            'QAC255_11_03',
            'Waterfall1Line Title bar applied theme HM+NW+WF+Subtitle+button'
        );
        await since(
            '3.The grid "WaterFall1Line" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('WaterFall1Line').getCSSProperty('border-top-left-radius')).value)
            .toBe('38px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('HM2lines+button'),
            'QAC255_11_04',
            'HM2lines+button Title bar applied theme HM+NW+WF+Subtitle+button'
        );
        await since(
            '4.The grid "HM2lines+button" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('HM2lines+button').getCSSProperty('border-top-left-radius')).value)
            .toBe('18px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Network2lines+button'),
            'QAC255_11_05',
            'Network2lines+button Title bar applied theme HM+NW+WF+Subtitle+button'
        );
        await since(
            '5.The grid "Network2lines+button" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('Network2lines+button').getCSSProperty('border-top-left-radius')).value)
            .toBe('28px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('WaterFall2lines+button'),
            'QAC255_11_06',
            'WaterFall2lines+button Title bar applied theme HM+NW+WF+Subtitle+button'
        );
        await since(
            '6.The grid "WaterFall2lines+button" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('WaterFall2lines+button').getCSSProperty('border-top-left-radius')).value)
            .toBe('38px');
    });
    it('[QAC255_12] Apply 1 line Histogram Box Plot theme', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
        await libraryPage.waitForCurtainDisappear();
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        //Go to page Histogram Box Plot
        await contentsPanel.goToPage({ chapterName: 'More', pageName: 'Histogram+BP' });
        await dossierAuthoringPage.actionOnMenubar('Format');
        await dossierAuthoringPage.actionOnSubmenuNoContinue('Select Theme');
        await themePanel.searchTheme('HG+BP+1line');
        await themePanel.applyTheme('HG+BP+1line');
        //Check the theme is applied
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Histogram1line'),
            'QAC255_12_01',
            'Histogram1line Title bar applied theme HG+BP+1line'
        );
        await since(
            '1.The grid "Histogram1line" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('Histogram1line').getCSSProperty('border-top-left-radius')).value)
            .toBe('33px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Box Plot 1line'),
            'QAC255_12_02',
            'Box Plot 1Line Title bar applied theme HG+BP+1line'
        );
        await since(
            '2.The grid "Box Plot 1line" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('Box Plot 1line').getCSSProperty('border-top-left-radius')).value)
            .toBe('12px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Histogram2lines+button'),
            'QAC255_12_03',
            'Histogram2lines+button Title bar applied theme HG+BP+1line'
        );
        await since(
            '3.The grid "Histogram2lines+button" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('Histogram2lines+button').getCSSProperty('border-top-left-radius')).value)
            .toBe('33px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Box Plot 2lines+button'),
            'QAC255_12_04',
            'Box Plot 2lines+button Title bar applied theme HG+BP+1line'
        );
        await since(
            '4.The grid "Box Plot 2lines+button" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('Box Plot 2lines+button').getCSSProperty('border-top-left-radius')).value)
            .toBe('12px');
    });
    it('[QAC255_13] Apply 2 lines+button Histogram Box Plot theme', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
        await libraryPage.waitForCurtainDisappear();
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        //Go to page Histogram Box Plot
        await contentsPanel.goToPage({ chapterName: 'More', pageName: 'Histogram+BP' });
        await dossierAuthoringPage.actionOnMenubar('Format');
        await dossierAuthoringPage.actionOnSubmenuNoContinue('Select Theme');
        await themePanel.searchTheme('HG+BP+2lines+button');
        await themePanel.applyTheme('HG+BP+2lines+button');
        //Check the theme is applied
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Histogram1line'),
            'QAC255_13_01',
            'Histogram1line Title bar applied theme HG+BP+2lines+button'
        );
        await since(
            '1.The grid "Histogram1line" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('Histogram1line').getCSSProperty('border-top-left-radius')).value)
            .toBe('13px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Box Plot 1line'),
            'QAC255_13_02',
            'Box Plot 1line Title bar applied theme HG+BP+2lines+button'
        );
        await since(
            '2.The grid "Box Plot 1line" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('Box Plot 1line').getCSSProperty('border-top-left-radius')).value)
            .toBe('22px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Histogram2lines+button'),
            'QAC255_13_03',
            'Histogram2lines+button Title bar applied theme HG+BP+2lines+button'
        );
        await since(
            '3.The grid "Histogram2lines+button" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('Histogram2lines+button').getCSSProperty('border-top-left-radius')).value)
            .toBe('13px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Box Plot 2lines+button'),
            'QAC255_13_04',
            'Box Plot 2lines+button Title bar applied theme HG+BP+2lines+button'
        );
        await since(
            '4.The grid "Box Plot 2lines+button" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('Box Plot 2lines+button').getCSSProperty('border-top-left-radius')).value)
            .toBe('22px');
    });
    it('[QAC255_14] Apply Sankey and Time Series theme', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
        await libraryPage.waitForCurtainDisappear();
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        //Go to page Sankey and Time Series
        await contentsPanel.goToPage({ chapterName: 'More', pageName: 'Sanky+TS' });
        await dossierAuthoringPage.actionOnMenubar('Format');
        await dossierAuthoringPage.actionOnSubmenuNoContinue('Select Theme');
        await themePanel.searchTheme('Sanky+TS+1line');
        await themePanel.applyTheme('Sanky+TS+1line');
        //Check the theme is applied
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Sankey1line'),
            'QAC255_14_01',
            'Sankey Title bar applied theme sankey+TS+1line'
        );
        await since(
            '1.The grid "Sankey" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('Sankey1line').getCSSProperty('border-top-left-radius')).value)
            .toBe('9px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('TS1line'),
            'QAC255_14_02',
            'TS1line Title bar applied theme sankey+TS+1line'
        );
        await since(
            '2.The grid "TS1line" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('TS1line').getCSSProperty('border-top-left-radius')).value)
            .toBe('40px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Sankey2lines+bn'),
            'QAC255_14_03',
            'Sankey2lines+bn Title bar applied theme sankey+TS+1line'
        );
        await since(
            '3.The grid "Sankey2lines+bn" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('Sankey2lines+bn').getCSSProperty('border-top-left-radius')).value)
            .toBe('9px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('TS2lines+bn'),
            'QAC255_14_04',
            'TS2lines+bn Title bar applied theme sankey+TS+1line'
        );
        await since(
            '4.The grid "TS2lines+bn" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('TS2lines+bn').getCSSProperty('border-top-left-radius')).value)
            .toBe('40px');
    });
    it('[QAC255_15] Apply Sankey and Time Series 2 lines+button theme', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
        await libraryPage.waitForCurtainDisappear();
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        //Go to page Sankey and Time Series
        await contentsPanel.goToPage({ chapterName: 'More', pageName: 'Sanky+TS' });
        await dossierAuthoringPage.actionOnMenubar('Format');
        await dossierAuthoringPage.actionOnSubmenuNoContinue('Select Theme');
        await themePanel.searchTheme('Sanky+TS+2lines+button');
        await themePanel.applyTheme('Sanky+TS+2lines+button');
        //Check the theme is applied
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Sankey1line'),
            'QAC255_15_01',
            'Sankey Title bar applied theme sankey+TS+2lines+button'
        );
        await since(
            '1.The grid "Sankey" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('Sankey1line').getCSSProperty('border-top-left-radius')).value)
            .toBe('29px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('TS1line'),
            'QAC255_15_02',
            'TS1line Title bar applied theme sankey+TS+2lines+button'
        );
        await since(
            '2.The grid "TS1line" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('TS1line').getCSSProperty('border-top-left-radius')).value)
            .toBe('2px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Sankey2lines+bn'),
            'QAC255_15_03',
            'Sankey2lines+bn Title bar applied theme sankey+TS+2lines+button'
        );
        await since(
            '3.The grid "Sankey2lines+bn" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('Sankey2lines+bn').getCSSProperty('border-top-left-radius')).value)
            .toBe('29px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('TS2lines+bn'),
            'QAC255_15_04',
            'TS2lines+bn Title bar applied theme sankey+TS+2lines+button'
        );
        await since(
            '4.The grid "TS2lines+bn" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('TS2lines+bn').getCSSProperty('border-top-left-radius')).value)
            .toBe('2px');
    });
    it('[QAC255_16] Apply Keydriver and NLG Theme', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
        await libraryPage.waitForCurtainDisappear();
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        //Go to page Keydriver and NLG
        await contentsPanel.goToPage({ chapterName: 'Insight+', pageName: 'KD+NLG' });
        await dossierAuthoringPage.actionOnMenubar('Format');
        await dossierAuthoringPage.actionOnSubmenuNoContinue('Select Theme');
        await themePanel.searchTheme('KD1+NLG2');
        await themePanel.applyTheme('KD1+NLG2');
        //Check the theme is applied
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('KeyDriver1'),
            'QAC255_16_01',
            'KeyDriver1 Title bar applied theme KD1+NLG2'
        );
        await since(
            '1.The grid "KeyDriver1" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('KeyDriver1').getCSSProperty('border-top-left-radius')).value)
            .toBe('25px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('NLG1'),
            'QAC255_16_02',
            'NLG1 Title bar applied theme KD1+NLG2'
        );
        await since(
            '2.The grid "NLG1" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('NLG1').getCSSProperty('border-top-left-radius')).value)
            .toBe('15px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('KeyDriver2'),
            'QAC255_16_03',
            'KeyDriver2 Title bar applied theme KD1+NLG2'
        );
        await since(
            '3.The grid "KeyDriver2" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('KeyDriver2').getCSSProperty('border-top-left-radius')).value)
            .toBe('25px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('NLG2'),
            'QAC255_16_04',
            'NLG2 Title bar applied theme KD1+NLG2'
        );
        await since(
            '4.The grid "NLG2" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('NLG2').getCSSProperty('border-top-left-radius')).value)
            .toBe('15px');
    });
    it('[QAC255_17] Apply Keydriver and NLG 2 lines+button Theme', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
        await libraryPage.waitForCurtainDisappear();
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        //Go to page Keydriver and NLG
        await contentsPanel.goToPage({ chapterName: 'Insight+', pageName: 'KD+NLG' });
        await dossierAuthoringPage.actionOnMenubar('Format');
        await dossierAuthoringPage.actionOnSubmenuNoContinue('Select Theme');
        await themePanel.searchTheme('KD2+NLG1');
        await themePanel.applyTheme('KD2+NLG1');
        //Check the theme is applied
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('KeyDriver1'),
            'QAC255_17_01',
            'KeyDriver1 Title bar applied theme KD2+NLG1'
        );
        await since(
            '1.The grid "KeyDriver1" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('KeyDriver1').getCSSProperty('border-top-left-radius')).value)
            .toBe('40px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('NLG1'),
            'QAC255_17_02',
            'NLG1 Title bar applied theme KD2+NLG1'
        );
        await since(
            '2.The grid "NLG1" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('NLG1').getCSSProperty('border-top-left-radius')).value)
            .toBe('33px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('KeyDriver2'),
            'QAC255_17_03',
            'KeyDriver2 Title bar applied theme KD2+NLG1'
        );
        await since(
            '3.The grid "KeyDriver2" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('KeyDriver2').getCSSProperty('border-top-left-radius')).value)
            .toBe('40px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('NLG2'),
            'QAC255_17_04',
            'NLG2 Title bar applied theme KD2+NLG1'
        );
        await since(
            '4.The grid "NLG2" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('NLG2').getCSSProperty('border-top-left-radius')).value)
            .toBe('33px');
    });
    it('[QAC255_18] Apply Forcast + Trend 1 line theme', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
        await libraryPage.waitForCurtainDisappear();
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        //Go to page Forcast + Trend
        await contentsPanel.goToPage({ chapterName: 'Insight+', pageName: 'Forcast+Trend' });
        await dossierAuthoringPage.actionOnMenubar('Format');
        await dossierAuthoringPage.actionOnSubmenuNoContinue('Select Theme');
        await themePanel.searchTheme('AForcastTrendline1');
        await themePanel.applyTheme('AForcastTrendline1');
        //Check the theme is applied
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Forcast1'),
            'QAC255_18_01',
            'Forcast1 Title bar applied theme Forcast1+Trendline1'
        );
        await since(
            '1.The grid "Forcast1" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('Forcast1').getCSSProperty('border-top-left-radius')).value)
            .toBe('11px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Trendline1'),
            'QAC255_18_02',
            'Trendline1 Title bar applied theme Forcast1+Trendline1'
        );
        await since(
            '2.The grid "Trendline1" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('Trendline1').getCSSProperty('border-top-left-radius')).value)
            .toBe('25px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Forcast2'),
            'QAC255_18_03',
            'Forcast2 Title bar applied theme Forcast1+Trendline1'
        );
        await since(
            '3.The grid "Forcast2" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('Forcast2').getCSSProperty('border-top-left-radius')).value)
            .toBe('11px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Trendline2'),
            'QAC255_18_03',
            'Trendline2 Title bar applied theme Forcast1+Trendline1'
        );
        await since(
            '4.The grid "Trendline2" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('Trendline2').getCSSProperty('border-top-left-radius')).value)
            .toBe('25px');
    });
    it('[QAC255_19] Apply Forcast2 + Trendline2 theme', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
        await libraryPage.waitForCurtainDisappear();
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        //Go to page Forcast2 + Trendline2
        await contentsPanel.goToPage({ chapterName: 'Insight+', pageName: 'Forcast+Trend' });
        await dossierAuthoringPage.actionOnMenubar('Format');
        await dossierAuthoringPage.actionOnSubmenuNoContinue('Select Theme');
        await themePanel.searchTheme('AForcastTrendline2');
        await themePanel.applyTheme('AForcastTrendline2');
        //Check the theme is applied
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Forcast1'),
            'QAC255_19_01',
            'Forcast1 Title bar applied theme Forcast2+Trendline2'
        );
        await since(
            '1.The grid "Forcast1" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('Forcast1').getCSSProperty('border-top-left-radius')).value)
            .toBe('31px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Trendline1'),
            'QAC255_19_02',
            'Trendline1 Title bar applied theme Forcast2+Trendline2'
        );
        await since(
            '2.The grid "Trendline1" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('Trendline1').getCSSProperty('border-top-left-radius')).value)
            .toBe('35px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Forcast2'),
            'QAC255_19_03',
            'Forcast2 Title bar applied theme Forcast2+Trendline2'
        );
        await since(
            '3.The grid "Forcast2" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('Forcast2').getCSSProperty('border-top-left-radius')).value)
            .toBe('31px');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Trendline2'),
            'QAC255_19_04',
            'Trendline2 Title bar applied theme Forcast2+Trendline2'
        );
        await since(
            '4.The grid "Trendline2" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('Trendline2').getCSSProperty('border-top-left-radius')).value)
            .toBe('35px');
    });
    it('[QAC255_20] Apply control + field theme', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
        await libraryPage.waitForCurtainDisappear();
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        //Go to page Control + Field
        await contentsPanel.goToPage({ chapterName: 'Component', pageName: 'Control+Field' });
        await dossierAuthoringPage.actionOnMenubar('Format');
        await dossierAuthoringPage.actionOnSubmenuNoContinue('Select Theme');
        await themePanel.applyTheme('control+field');
        //Check the theme is applied
        const Container = htmlContainer.getHTMLNode(0);
        const Container1 = htmlContainer.getHTMLNode(1);
        await since(
            '1.The HTML Container 1 has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await Container.getCSSProperty('border-top-left-radius')).value)
            .toBe('40px');
        await since(
            '2.The HTML Container 2 has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await Container1.getCSSProperty('border-top-left-radius')).value)
            .toBe('40px');
        await since(
            '3.The Control "Year New" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await inCanvasSelector_Authoring.getElementOrValueFilterByTitle('Year New').getCSSProperty('border-top-left-radius')).value)
            .toBe('12px');
        await since(
            '4.The Control "AM" has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await inCanvasSelector_Authoring.getAttrOrMetricSelectorContainerUsingId(1).getCSSProperty('border-top-left-radius')).value)
            .toBe('12px');
        const Text = textbox.getTextNode(0);
        const Text2 = textbox.getTextNode(1);
        await since(
            '5.The Text Box 1 has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await Text.getCSSProperty('border-top-left-radius')).value)
            .toBe('22px');
        await since(
            '6.The Text Box 2 has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await Text2.getCSSProperty('border-top-left-radius')).value)
            .toBe('22px');
        const image1 = await imageContainer.getImageBoxByIndex(0);
        const image2 = await imageContainer.getImageBoxByIndex(1);
        await since(
            '7.The Image Box 1 has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await image1.getCSSProperty('border-top-left-radius')).value)
            .toBe('33px');
        await since(
            '8.The Image Box 2 has style "border-top-left-radius" with value #{expected}, instead it is #{actual}'
        )
            .expect((await image2.getCSSProperty('border-top-left-radius')).value)
            .toBe('33px');
    });
    it('[QAC255_21] Apply panel stack theme', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
        await libraryPage.waitForCurtainDisappear();
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        //Go to page Panel Stack
        await contentsPanel.goToPage({ chapterName: 'Component', pageName: 'PS' });
        await dossierAuthoringPage.actionOnMenubar('Format');
        await dossierAuthoringPage.actionOnSubmenuNoContinue('Select Theme');
        await themePanel.searchTheme('PS1');
        await themePanel.applyTheme('PS1');
        //Check the theme is applied
        await takeScreenshotByElement(
            await dossierAuthoringPage.getDossierView(),
            'QAC255_21_01',
            'Panel Stack applied theme PS1'
        );
        await textbox.navigateLinkByKey('W91C8FCE5216F4B6F9F2C9C8B0A3EA336');
        await dossierPage.waitForInfoWindowLoading();
        await takeScreenshotByElement(
            await viPanelStack.getPanelByID('WF5B87CD08E1D4A37ACBAAEEC2436151C'),
            'QAC255_21_02',
            'Panel Stack Info window applied theme PS1'
        );
        await vizPanelForGrid.clickOnGridElement('2008', 'Visualization 1');
        await dossierPage.waitForInfoWindowLoading();
        await takeScreenshotByElement(
            await viPanelStack.getPanelByID('W98855B9DD568474CBF79B4323F2EBB02'),
            'QAC255_21_03',
            'Panel Stack Info window after selecting grid element applied theme PS1'
        );
    });
    /*it('[QAC255_22] Copy Paste on the same type viz', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
*/
});
