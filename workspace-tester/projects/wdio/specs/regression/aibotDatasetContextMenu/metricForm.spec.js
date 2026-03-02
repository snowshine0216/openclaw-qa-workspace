import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { browserWindow } from '../../../constants/index.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { dataBotUser } from '../../../constants/bot.js';

describe('AIBot Dataset Settings - metricform', () => {
    const AttributeForms = {
        id: '3B5B5C55714F28AD890105A7637D6A94',
        name: 'AttributeForms',
        datasetName: 'attforms',
        project: {
            id: '61ABA574CA453CCCF398879AFE2E825F',
            name: 'Platform Analytics',
        },
    };

    let { loginPage, libraryPage, libraryAuthoringPage, botAuthoring, aibotDatasetPanel, aibotDatasetPanelContextMenu, aibotChatPanel} =
        browsers.pageObj1;
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

    it('[TC93246_00] number format - check that the Number Format option is available.', async () => {
        await libraryPage.editBotByUrl({ projectId: AttributeForms.project.id, botId: AttributeForms.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(AttributeForms.datasetName);
        await aibotDatasetPanel.rightClickOnDataName('xss');
        await takeScreenshotByElement(
            aibotDatasetPanel.getDataContextMenu(),
            'TC93246_00',
            'Open context menu, check UI'
        );
    });

    it('[TC93246_01] number format - check number format context menu default value', async () => {
        await libraryPage.editBotByUrl({ projectId: AttributeForms.project.id, botId: AttributeForms.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(AttributeForms.datasetName);
        await aibotDatasetPanel.rightClickOnDataName('xss');
        await aibotDatasetPanelContextMenu.hoverOnNumberFormatButton();
        await takeScreenshotByElement(
            aibotDatasetPanelContextMenu.getNumberFormatContainer(),
            'TC93246_01',
            'Open number format menu, check default number format - fixed'
        );
    });

    it('[TC93246_02] number format - change number format ', async () => {
        await libraryPage.editBotByUrl({ projectId: AttributeForms.project.id, botId: AttributeForms.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(AttributeForms.datasetName);
        await aibotDatasetPanel.rightClickOnDataName('% to Total Sessions');
        await aibotDatasetPanelContextMenu.hoverOnNumberFormatButton();
        await aibotDatasetPanelContextMenu.switchNumberFormatTypeToCurrency();
        await aibotDatasetPanelContextMenu.getOKButton().waitForClickable();
        await aibotDatasetPanelContextMenu.getOKButton().click();
        await aibotDatasetPanel.rightClickOnDataName('% to Total Sessions');
        await aibotDatasetPanelContextMenu.hoverOnNumberFormatButton();
        await takeScreenshotByElement(
            aibotDatasetPanelContextMenu.getNumberFormatContainer(),
            'TC93246_02',
            'check number format container after changing number format to currency'
        );
    });

    it('[TC93246_03] number format - change to different format ', async () => {
        await libraryPage.editBotByUrl({ projectId: AttributeForms.project.id, botId: AttributeForms.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(AttributeForms.datasetName);
        await aibotDatasetPanelContextMenu.changeMetricNumberFormattingToType('Fixed', 'xss');
        await aibotDatasetPanelContextMenu.changeMetricNumberFormattingToType('Currency', 'xss');
        await aibotDatasetPanelContextMenu.changeMetricNumberFormattingToType('Date', 'xss');
        await aibotDatasetPanelContextMenu.changeMetricNumberFormattingToType('Time', 'xss');
        await aibotDatasetPanelContextMenu.changeMetricNumberFormattingToType('Percentage', 'xss');
        await aibotDatasetPanelContextMenu.changeMetricNumberFormattingToType('Fraction', 'xss');
        await aibotDatasetPanelContextMenu.changeMetricNumberFormattingToType('Scientific', 'xss');
        await aibotDatasetPanelContextMenu.changeMetricNumberFormattingToType('Custom', 'xss');
        await aibotDatasetPanelContextMenu.changeMetricNumberFormattingToType('Special', 'xss');
        await aibotDatasetPanel.rightClickOnDataName('xss');
        await aibotDatasetPanelContextMenu.hoverOnNumberFormatButton();
        await takeScreenshotByElement(
            aibotDatasetPanelContextMenu.getNumberFormatContainer(),
            'TC93246_03',
            'check number format is Special'
        );
    });

    it('[TC93246_04] number format - cancel change', async () => {
        await libraryPage.editBotByUrl({ projectId: AttributeForms.project.id, botId: AttributeForms.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(AttributeForms.datasetName);
        await aibotDatasetPanel.rightClickOnDataName('xss');
        await aibotDatasetPanelContextMenu.hoverOnNumberFormatButton();
        await aibotDatasetPanelContextMenu.switchNumberFormatTypeToCurrency();
        await aibotDatasetPanelContextMenu.getCancelButton().waitForClickable();
        await aibotDatasetPanelContextMenu.getCancelButton().click();
        await aibotDatasetPanel.rightClickOnDataName('xss');
        await aibotDatasetPanelContextMenu.hoverOnNumberFormatButton();
        await takeScreenshotByElement(
            aibotDatasetPanel.getDataContextMenu(),
            'TC93246_04',
            'Open context menu, cancel change check value'
        );
    });

    it('[TC93246_05] number format - check that the Number Format option is available.', async () => {
        await libraryPage.editBotByUrl({ projectId: AttributeForms.project.id, botId: AttributeForms.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(AttributeForms.datasetName);
        await aibotDatasetPanel.checkOrUncheckData('xss');
        await aibotDatasetPanel.rightClickOnDataName('xss');
        await takeScreenshotByElement(
            aibotDatasetPanel.getDataContextMenu(),
            'TC93246_05_1',
            'not available, grey out when data is unselected'
        );
        await aibotDatasetPanelContextMenu.hoverOnNumberFormatButton();
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC93246_05_2',
            'no number format when data is unselected'
        );
    });

    it('[TC93243] number format - save change', async () => {
        await libraryPage.editBotByUrl({ projectId: AttributeForms.project.id, botId: AttributeForms.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(AttributeForms.datasetName);
        await aibotDatasetPanelContextMenu.changeMetricNumberFormattingToType('Date', '% to Total Sessions');
        await botAuthoring.saveBot({});
        await aibotDatasetPanel.waitForTextAppearInDataSetPanel(AttributeForms.datasetName);
        await libraryPage.clickLibraryIcon();
        await libraryPage.editBotByUrl({ projectId: AttributeForms.project.id, botId: AttributeForms.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await aibotDatasetPanel.rightClickOnDataName('% to Total Sessions');
        await aibotDatasetPanelContextMenu.hoverOnNumberFormatButton();
        await takeScreenshotByElement(
            aibotDatasetPanel.getDataContextMenu(),
            'TC93243',
            'Save change number format - Date'
        );
        await aibotDatasetPanelContextMenu.clickOkInNumberFormat();
        await aibotDatasetPanelContextMenu.changeMetricNumberFormattingToType('Percentage', '% to Total Sessions');
        await botAuthoring.saveBot({});
    });
});
