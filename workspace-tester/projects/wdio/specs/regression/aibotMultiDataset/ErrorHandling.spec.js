import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { browserWindow } from '../../../constants/index.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { dataBotUser } from '../../../constants/bot.js';

describe('Mulitiple Datasets - error', () => {
    const UnselectAllBot = {
        id: '67A9DAA4A3452DD12EB282B5E933D3ED',
        name: 'UnselectAll',
        dataset1: 'unpublish report',
        dataset2: 'deactive cache report',
        dataset3: 'Clipboard',
        tooltipText: 'No content. Add content to the dataset to use the bot.',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const UnsupportedBot = {
        id: 'D42909FF10412DE2A72D6D897DB99DC9',
        name: 'unsupported dataset',
        dataset1: 'MDX cube',
        dataset2: '5-1- predefined list of object',
        dataset3: '4-1 metrics qualification prompt',
        dataset4: '3-1 element list prompt',
        dataset5: '1-1 prompt - attribute qualitification',
        dataset6: '2-1 prompt - hierarchy',
        tooltipText: 'Prompted report is not supported in bot.',
        tooltipText2: 'Unsupported dataset. Replace the current dataset to use the bot.',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const PartiallySupported = {
        id: 'ED207B245E4C8F307D3B97AD65F64A9A',
        name: 'PartiallySupported',
        dataset1: 'FlatViewNewDataModel',
        dataset2: 'Delete Report',
        newDataset: 'Clipboard',
        tooltipText: 'Prompted report is not supported in bot.',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    let { loginPage, libraryPage, libraryAuthoringPage, botAuthoring, aibotDatasetPanel } = browsers.pageObj1;
    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(dataBotUser);
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC96408] Verify error handling on dataset panel with multiple datasets - unselected all', async () => {
        await libraryPage.editBotByUrl({ projectId: UnselectAllBot.project.id, botId: UnselectAllBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('Error icon displays should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.isErrorIconDisplayed())
            .toBe(false);
        await since('Panel Error icon displays should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.isPanelErrorIconDisplayed())
            .toBe(true);
        await aibotDatasetPanel.hoverPanelErrorIcon();
        await since('Error tooltip displays should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.panelTooltipText())
            .toBe(UnselectAllBot.tooltipText);
        await aibotDatasetPanel.checkOrUncheckData('Customer');
        await since('Panel Error icon displays should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.isPanelErrorIconDisplayed())
            .toBe(false);
    });

    it('[TC96409] Verify error handling on dataset panel with multiple datasets - prompt report', async () => {
        await libraryPage.editBotByUrl({ projectId: UnsupportedBot.project.id, botId: UnsupportedBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText(1))
            .toBe(UnsupportedBot.dataset2);
        await since('Panel Error icon displays should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.isPanelErrorIconDisplayed())
            .toBe(true);
        await aibotDatasetPanel.closeDataset(UnsupportedBot.dataset1);
        await aibotDatasetPanel.closeDataset(UnsupportedBot.dataset2);
        await aibotDatasetPanel.closeDataset(UnsupportedBot.dataset3);
        await aibotDatasetPanel.closeDataset(UnsupportedBot.dataset4);
        await aibotDatasetPanel.closeDataset(UnsupportedBot.dataset5);
        await takeScreenshotByElement(
            aibotDatasetPanel.getDataPanelContainer(),
            'TC96409-01',
            'Verify error icon displays in data set panel'
        );
        await takeScreenshotByElement(
            aibotDatasetPanel.getAdvancedContainer(),
            'TC96409-02',
            'Check dataset panel basic UI components - advanced unavailable'
        );
        await aibotDatasetPanel.hoverErrorIconForDataset(UnsupportedBot.dataset1);
        await since('Error tooltip displays should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.tooltipTextForDataset(UnsupportedBot.dataset1))
            .toBe(UnsupportedBot.tooltipText2);
        await aibotDatasetPanel.hoverErrorIconForDataset(UnsupportedBot.dataset2);
        await since('Error tooltip displays should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.tooltipTextForDataset(UnsupportedBot.dataset2))
            .toBe(UnsupportedBot.tooltipText);
        await aibotDatasetPanel.hoverErrorIconForDataset(UnsupportedBot.dataset3);
        await since('Error tooltip displays should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.tooltipTextForDataset(UnsupportedBot.dataset3))
            .toBe(UnsupportedBot.tooltipText);
        await aibotDatasetPanel.hoverErrorIconForDataset(UnsupportedBot.dataset4);
        await since('Error tooltip displays should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.tooltipTextForDataset(UnsupportedBot.dataset4))
            .toBe(UnsupportedBot.tooltipText);
        await aibotDatasetPanel.hoverErrorIconForDataset(UnsupportedBot.dataset5);
        await since('Error tooltip displays should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.tooltipTextForDataset(UnsupportedBot.dataset5))
            .toBe(UnsupportedBot.tooltipText);
        await aibotDatasetPanel.hoverErrorIconForDataset(UnsupportedBot.dataset6);
        await since('Error tooltip displays should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.tooltipTextForDataset(UnsupportedBot.dataset6))
            .toBe(UnsupportedBot.tooltipText);
    });

    it('[TC96410] Verify error handling on dataset panel with multiple datasets - partially supported', async () => {
        await libraryPage.editBotByUrl({ projectId: PartiallySupported.project.id, botId: PartiallySupported.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('Panel Error icon displays should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.isPanelErrorIconDisplayed())
            .toBe(true);
        await takeScreenshotByElement(
            aibotDatasetPanel.getDataPanelContainer(),
            'TC96410-01',
            'Verify error icon displays in data set panel'
        );
        await takeScreenshotByElement(
            aibotDatasetPanel.getAdvancedContainer(),
            'TC96410-02',
            'Check dataset panel basic UI components - advanced unavailable'
        );
        await aibotDatasetPanel.clickOneDatasetManipuButton(PartiallySupported.dataset2, 'Delete');
        await aibotDatasetPanel.waitForCoverSpinnerDismiss();
        await since('Panel Error icon displays should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.isPanelErrorIconDisplayed())
            .toBe(false);
        await takeScreenshotByElement(
            aibotDatasetPanel.getDataPanelContainer(),
            'TC96410-03',
            'Verify no error icon displays in data set panel'
        );
    });

    it('[TC96411] Verify error handling on dataset panel with multiple datasets - partially supported-replace', async () => {
        await libraryPage.editBotByUrl({ projectId: PartiallySupported.project.id, botId: PartiallySupported.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('Panel Error icon displays should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.isPanelErrorIconDisplayed())
            .toBe(true);
        await aibotDatasetPanel.clickOneDatasetManipuButton(PartiallySupported.dataset2, 'Replace Dataset');
        await aibotDatasetPanel.waitForReplacePageLoading();
        await aibotDatasetPanel.searchInReplaceDialog(PartiallySupported.newDataset);
        await aibotDatasetPanel.waitForReplacePageLoading();
        await aibotDatasetPanel.clickOnDatasetInSearch(PartiallySupported.newDataset);
        await aibotDatasetPanel.waitForReplacePageLoading();
        await aibotDatasetPanel.clickReplacePageButton('Replace');
        await libraryAuthoringPage.waitForCurtainDisappear();
        await aibotDatasetPanel.waitForCoverSpinnerDismiss();
        await aibotDatasetPanel.waitForTextAppearInDataSetPanel(PartiallySupported.newDataset);
        await takeScreenshotByElement(
            aibotDatasetPanel.getDataPanelContainer(),
            'TC96411',
            'Check dataset is updated, no warning'
        );
        await since('Panel Error icon displays should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.isPanelErrorIconDisplayed())
            .toBe(false);
    });
});
