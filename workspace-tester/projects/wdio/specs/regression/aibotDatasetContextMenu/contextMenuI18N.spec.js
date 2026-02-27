import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { browserWindow } from '../../../constants/index.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { dataI18BotUser } from '../../../constants/bot.js';

describe('AIBot Dataset Settings - i18n', () => {
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
        await loginPage.login(dataI18BotUser);
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC93312_00] number format - Number Format and Rename i18n', async () => {
        await libraryPage.editBotByUrl({ projectId: AttributeForms.project.id, botId: AttributeForms.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(AttributeForms.datasetName);
        await aibotDatasetPanel.rightClickOnDataName('xss');
        await takeScreenshotByElement(
            aibotDatasetPanel.getDataContextMenu(),
            'TC93312_00',
            'Open context menu, metric number format i18n'
        );
    });

    it('[TC93312_01] number format - Number format container in Chinese', async () => {
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
            'TC93312_01',
            'Open number format menu i18n'
        );
    });

    it('[TC93312_02] number format - change number format ', async () => {
        await libraryPage.editBotByUrl({ projectId: AttributeForms.project.id, botId: AttributeForms.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(AttributeForms.datasetName);
        await aibotDatasetPanelContextMenu.changeMetricNumberFormattingToType('分数', 'xss');
        await aibotDatasetPanel.rightClickOnDataName('xss');
        await aibotDatasetPanelContextMenu.hoverOnNumberFormatButton();
        await takeScreenshotByElement(
            aibotDatasetPanelContextMenu.getNumberFormatContainer(),
            'TC93312_02',
            'Change number format with Chinese'
        );
    });

    it('[TC93312_03] rename duplicate name show alert with Chinese', async () => {
        await libraryPage.editBotByUrl({ projectId: AttributeForms.project.id, botId: AttributeForms.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(AttributeForms.datasetName);
        await aibotDatasetPanelContextMenu.rightClickElementByName('metric', 'xss');
        await aibotDatasetPanelContextMenu.getRenameButton().click();
        await aibotDatasetPanelContextMenu.renameElementAndClickOutside('metric', '1');
        await aibotDatasetPanelContextMenu.rightClickElementByName('metric', '% to Total Sessions');
        await aibotDatasetPanelContextMenu.getRenameButton().click();
        await aibotDatasetPanelContextMenu.renameElementAndClickOutside('metric', '1');
        await takeScreenshotByElement(
            aibotDatasetPanel.getDuplicateNameAlertContainer(),
            'TC93312_03',
            'duplicate name alert in Chinese'
        );
    });

    it('[TC93312_04] number format - Number Format and Rename i18n', async () => {
        await libraryPage.editBotByUrl({ projectId: AttributeForms.project.id, botId: AttributeForms.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(AttributeForms.datasetName);
        await aibotDatasetPanel.rightClickOnDataName('User');
        await takeScreenshotByElement(
            aibotDatasetPanel.getDataContextMenu(),
            'TC93312_04',
            'Open context menu, metric number format i18n'
        );
    });

    it('[TC93312_05] number format - Number Format and Rename i18n', async () => {
        await libraryPage.editBotByUrl({ projectId: AttributeForms.project.id, botId: AttributeForms.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(AttributeForms.datasetName);
        await aibotDatasetPanel.rightClickOnDataName('User');
        await aibotDatasetPanelContextMenu.hoverOnAttributeFormsButton();
        await takeScreenshotByElement(
            aibotDatasetPanelContextMenu.getAttributeFormContainer(),
            'TC93312_05',
            'Open context menu, metric number format i18n'
        );
    });
});
