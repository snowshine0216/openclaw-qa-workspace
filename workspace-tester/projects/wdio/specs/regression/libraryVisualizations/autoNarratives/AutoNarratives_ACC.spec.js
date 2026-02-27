import { browserWindowCustom } from '../../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import resetDossierState from '../../../../api/resetDossierState.js';
import * as consts from '../../../../constants/visualizations.js';
import { Key } from 'webdriverio';
import InCanvasSelector from '../../../../pageObjects/selector/InCanvasSelector.js';

describe('AutoNarratives_ACC', () => {
    const testObjectInfo = {
        project: {
            id: '235853DC4B79DABCE8C6FFB26B7D8DC3',
            name: 'MicroStrategy Tutorial Project',
        },
        NLG: {
            id: '878D710E5F40D8F7C3F878A0D8D2711E',
            name: 'NLG_Acc',
        },
        testName: 'AutoNarratives_ACC',
    };

    let {
        loginPage,
        libraryPage,
        dossierPage,
        vizGallery,
        contentsPanel,
        dossierEditorUtility,
        dossierAuthoringPage,
        filterPanel,
        toc,
        checkboxFilter,
        pieChart,
        grid,
        textbox,
        autoNarratives,
        visualizationPanel,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(consts.autoUser.credentials);
        await loginPage.disableTutorial();
        await setWindowSize(browserWindowCustom);
        // await libraryPage.openDebugMode(consts.codeCoverage.vizDebugBundles);
    });

    afterEach(async () => {
        // await libraryPage.collectLineCoverageInfo(consts.codeCoverage.vizOutputFolder, testObjectInfo.testName);
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC96065_1] ACC [Library Web] Copy NLG to text box', async () => {
        // Open dashboard in edit mode
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });
        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 1',
            pageName: 'Text',
        });
        //copy summary to Textbox
        await autoNarratives.clickNlgCopyBtn('NLG');
        const clipboardText = await browser.execute(() => navigator.clipboard.readText());
        console.log('Clipboard Text:', clipboardText);
        await since('Clipboard should contain copied NLG text').expect(clipboardText).toBeTruthy();
        await since('Clipboard text should contain expected content').expect(clipboardText).toContain('2009');
    });

    it('[TC96065_2] ACC [Library Web] Check Editor panel in dashboard library.', async () => {
        // Open dashboard in edit mode
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'AddNLG',
        });
        await vizGallery.clickOnInsertVI();
        await vizGallery.clickOnVizCategory('Insight');
        await vizGallery.clickOnViz('Auto Narratives');
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC96065_2', '00_AddNLG');
        await visualizationPanel.takeScreenshotBySelectedViz('TC96065_2', '01_AddNLG');
        await autoNarratives.hoverOnInstructionIcon();
        await since('Instruction tooltip should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getTextFromDisplayedTooltip())
            .toContain(
                'Use @ to select specific visualizations you would like Auto Narratives to summarize, or choose to summarize the entire page. Additionally, describe the desired format for the narrative, such as bullet points, paragraphs, and color highlights (e.g., positive trends in green, negative trends in red).'
            );
        await dossierAuthoringPage.clickTopLeftCorner();
        await autoNarratives.clickEmptySummary(0);
        //check Auto Refresh option
        await autoNarratives.hoverOnAutoRefreshInfo();
        await since('Auto refresh tooltip should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getTextFromDisplayedTooltip())
            .toContain('Check Auto Refresh to automatically update summary content in consumption.');
        await autoNarratives.clickAutoRefresh();
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC96065_2', '03_DisableAutoRefresh');
        //undo
        await dossierAuthoringPage.actionOnToolbar('Undo');
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC96065_2', '04_EnableAutoRefresh');
        await autoNarratives.checkEmptySummary('TC96065_2', '05_EmptySummary');
        await autoNarratives.setInstructionOnly('Summarize @');
        await autoNarratives.checkSuggestionsPopup('TC96065_2', '06_ListVisualizations');
        await autoNarratives.setInstructionOnly(['Summarize @', Key.ArrowDown]);
        await visualizationPanel.takeScreenshotBySelectedViz('TC96065_2', '07_Highlight_Grid');
        await autoNarratives.setInstructionOnly(['Summarize @', Key.ArrowDown, Key.ArrowDown]);
        await visualizationPanel.takeScreenshotBySelectedViz('TC96065_2', '08_Highlight_Bar');
        // //Try to save dashboard without click [Generate]
        // await autoNarratives.setInstructionOnly([
        //     'Summarize @',
        //     Key.Tab,
        //     'and highlight top 1 airline by average delay time',
        // ]);
        // await dossierAuthoringPage.getSaveDossierButton().click();
        // await autoNarratives.checkPopupDialog('TC96065_2', '09_Popup_Dialog');
        // await autoNarratives.clickCancelButton();
        // await autoNarratives.clickGenerate();
        // await autoNarratives.waitForNlgReady();
        // await since('NLG targeting bar should contain #{expected}, while we get #{actual}')
        //     .expect(await autoNarratives.getSummaryTextByIndex())
        //     .toContain('Delta Air Lines Inc');
        await autoNarratives.setInstructionOnly('highlight top 1 airline by average delay time @');
        await autoNarratives.clickSuggenstedItemByName('Grid');
        await autoNarratives.clickGenerate();
        await autoNarratives.waitForNlgReady();
        await since('NLG targeting Grid should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('Mesa Airlines Inc');
    });

    it('[TC96065_3] ACC [Library Web] Trigger refresh in dashboard library.', async () => {
        // Open dashboard in consumption mode
        await libraryPage.openUrl(testObjectInfo.project.id, testObjectInfo.NLG.id);
        await dossierPage.resetDossierIfPossible();
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Refresh' });
        await autoNarratives.checkDisclaimRefreshDisplay('TC96065_3', '00_DisplayRefreshIcon');
        await since('Page refresh summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByVizTitle('NLG'))
            .toContain('Comair Inc.');
        // Change selection in ICS filter
        const selector = InCanvasSelector.createByAriaLable('Airline Name');
        // select item
        await selector.selectItem('Comair Inc.');
        await autoNarratives.checkDisclaimRefreshDisplay('TC96065_3', '01_DisplayRefreshWithDataChanged');
        await autoNarratives.clickRefreshIcon(2);
        await since('Page refresh summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByVizTitle('NLG'))
            .toContain('Expressjet Airlines Inc.');
        //Change View filter
        await dossierPage.resetDossierIfPossible();
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Refresh' });
        await pieChart.exclude({ title: 'TargetPie', slice: 'Comair Inc. (3.72%)' });
        await autoNarratives.checkDisclaimRefreshDisplay('TC96065_3', '02_DisplayRefreshWithDataChanged');
        await autoNarratives.clickRefreshIcon(2);
        await since('Page refresh summary text title should contains #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByVizTitle('NLG'))
            .toContain('Expressjet Airlines Inc.');
        //Change selection in Filter panel
        await dossierPage.resetDossierIfPossible();
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Refresh' });
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Airline Name');
        await checkboxFilter.selectElementByName('Comair Inc.');
        await filterPanel.apply();
        await autoNarratives.checkDisclaimRefreshDisplay('TC96065_3', '03_DisplayRefreshWithDataChanged');
        await autoNarratives.clickRefreshIcon(2);
        await since('Page 1 summary text title should contains #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByVizTitle('NLG'))
            .toContain('Expressjet Airlines Inc.');

        //Change selection from source visualization
        await dossierPage.resetDossierIfPossible();
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Refresh' });
        await grid.selectGridElement({
            title: 'SourceGrid',
            headerName: 'Airline Name',
            elementName: 'AirTran Airways Corporation',
            agGrid: false,
        });
        await autoNarratives.checkDisclaimRefreshDisplay('TC96065_3', '04_DisplayRefreshWithDataChanged');
        await autoNarratives.clickRefreshIcon(2);

        await since('Page 1 summary text title should contains #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByVizTitle('NLG'))
            .toContain('AirTran Airways Corporation');
    });

    it('[TC96065_4] ACC [Library Web] Trigger auto refresh in dashboard library.', async () => {
        // Open dashboard in consumption mode
        await libraryPage.openUrl(testObjectInfo.project.id, testObjectInfo.NLG.id);
        await dossierPage.resetDossierIfPossible();
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'AutoRefresh' });
        await autoNarratives.checkDisclaimRefreshDisplay('TC96065_4', '00_DisplayRefreshIcon');
        await since('Page refresh summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByVizTitle('NLG'))
            .toContain('Comair Inc.');
        //Change selection in ICS filter
        const selector = InCanvasSelector.createByAriaLable('Airline Name');
        // select item
        await selector.selectItem('Comair Inc.');
        await autoNarratives.checkDisclaimRefreshDisplay('TC96065_4', '01_DisplayRefreshIcon');
        await since('Page refresh summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByVizTitle('NLG'))
            .toContain('Expressjet Airlines Inc.');
        //Change View filter
        await dossierPage.resetDossierIfPossible();
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'AutoRefresh' });
        await pieChart.exclude({ title: 'TargetPie', slice: 'Comair Inc. (3.72%)' });
        await autoNarratives.checkDisclaimRefreshDisplay('TC96065_4', '02_DisplayRefreshIcon');
        await since('Page refresh summary text title should contains #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByVizTitle('NLG'))
            .toContain('Expressjet Airlines Inc.');
        //Change selection in Filter panel
        await dossierPage.resetDossierIfPossible();
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'AutoRefresh' });
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Airline Name');
        await checkboxFilter.selectElementByName('Comair Inc.');
        await filterPanel.apply();
        await autoNarratives.checkDisclaimRefreshDisplay('TC96065_4', '03_DisplayRefreshIcon');
        await since('Page 1 summary text title should contains #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByVizTitle('NLG'))
            .toContain('Expressjet Airlines Inc.');

        //Change selection from source visualization
        await dossierPage.resetDossierIfPossible();
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'AutoRefresh' });
        await grid.selectGridElement({
            title: 'SourceGrid',
            headerName: 'Airline Name',
            elementName: 'AirTran Airways Corporation',
            agGrid: false,
        });
        await autoNarratives.checkDisclaimRefreshDisplay('TC96065_4', '04_DisplayRefreshIcon');
        await since('Page 1 summary text title should contains #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByVizTitle('NLG'))
            .toContain('AirTran Airways Corporation');
    });

    it('[TC96065_5] ACC [Library Web] Data cut message', async () => {
        // Open dashboard in consumption mode
        await libraryPage.openUrl(testObjectInfo.project.id, testObjectInfo.NLG.id);
        await dossierPage.resetDossierIfPossible();
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'DataCut' });
        await autoNarratives.checkDisclaimRefreshDisplay('TC96065_5', '00_DisplayRefreshIcon');
        await autoNarratives.hoverOnDataCutInfoIcon();
        await since('Data cut tooltip should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getDataCutInfoTooltipText())
            .toContain(
                'The narrative is generated from a subset of the data due to high volume and may not fully reflect the entire dataset.'
            );
    });
});
