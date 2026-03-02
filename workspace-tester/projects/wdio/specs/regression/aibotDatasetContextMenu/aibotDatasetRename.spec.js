import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { browserWindow } from '../../../constants/index.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { dataBotUser } from '../../../constants/bot.js';

describe('AIBot Dataset Settings - rename', () => {
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
        await libraryPage.editBotByUrl({ projectId: AttributeForms.project.id, botId: AttributeForms.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        if (aibotDatasetPanel.isDataDisplayed('attribute', 'xss') === true) {
            await aibotDatasetPanelContextMenu.rightClickElementByName('attribute', 'xss');
            await aibotDatasetPanelContextMenu.getRenameButton().click();
            await aibotDatasetPanelContextMenu.renameElementAndPressEnter('attribute', 'User Type');
            await aibotDatasetPanelContextMenu.rightClickElementByName('metric', 'test');
            await aibotDatasetPanelContextMenu.getRenameButton().click();
            await aibotDatasetPanelContextMenu.renameElementAndPressEnter('metric', '% to Total Sessions');
            await botAuthoring.saveBot({});
            await aibotDatasetPanel.waitForTextAppearInDataSetPanel(AttributeForms.datasetName);
        }
        await logoutFromCurrentBrowser();
    });

    it('[TC93244_00] rename attribute - by right click with press enter', async () => {
        await libraryPage.editBotByUrl({ projectId: AttributeForms.project.id, botId: AttributeForms.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(AttributeForms.datasetName);
        await aibotDatasetPanelContextMenu.rightClickElementByName('attribute', 'User');
        await aibotDatasetPanelContextMenu.getRenameButton().click();
        await aibotDatasetPanelContextMenu.renameElementAndPressEnter('attribute', 'User_rename');
        await takeScreenshotByElement(aibotDatasetPanel.getDatasetContainer(), 'TC93244_00', 'Rename attribute');
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('User');
        await takeScreenshotByElement(aibotChatPanel.getAutoCompleteArea(), 'TC93244_00_1', 'check rename result');
    });

    it('[TC93244_01] rename attribute - by right click with click outside', async () => {
        await libraryPage.editBotByUrl({ projectId: AttributeForms.project.id, botId: AttributeForms.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(AttributeForms.datasetName);
        await aibotDatasetPanelContextMenu.rightClickElementByName('attribute', 'User Status');
        await aibotDatasetPanelContextMenu.getRenameButton().click();
        await aibotDatasetPanelContextMenu.renameElementAndClickOutside('attribute', '1');
        await aibotDatasetPanel.hoverOnDataName('1');
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC93244_01',
            'Rename attribute by clicking outside'
        );
    });

    it('[TC93244_02] rename attribute - by double click with tab to rename', async () => {
        await libraryPage.editBotByUrl({ projectId: AttributeForms.project.id, botId: AttributeForms.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(AttributeForms.datasetName);
        await aibotDatasetPanelContextMenu.openRenamingByDoubleClick('attribute', 1);
        await aibotDatasetPanelContextMenu.renameElementAndPressTab('attribute', '|]]p~1·1~#@"');
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC93244_02',
            'Rename attribute by clicking tab with special characters'
        );
    });

    it('[TC93244_03] rename metric - by right click with press tab', async () => {
        await libraryPage.editBotByUrl({ projectId: AttributeForms.project.id, botId: AttributeForms.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(AttributeForms.datasetName);
        await aibotDatasetPanelContextMenu.rightClickElementByName('metric', 'xss');
        await aibotDatasetPanelContextMenu.getRenameButton().click();
        await aibotDatasetPanelContextMenu.renameElementAndPressTab('metric', "<script>alert('XSS')</script>");
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC93244_03',
            'Rename metric by clicking tab with xss'
        );
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('xss');
        await takeScreenshotByElement(
            aibotChatPanel.getAutoCompleteArea(),
            'TC93244_03_1',
            'check rename result xss not exist'
        );
    });

    it('[TC93244_04] rename metric - by double click and click outside + long name', async () => {
        await libraryPage.editBotByUrl({ projectId: AttributeForms.project.id, botId: AttributeForms.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(AttributeForms.datasetName);
        await aibotDatasetPanelContextMenu.openRenamingByDoubleClick('metric', 1);
        await aibotDatasetPanelContextMenu.renameElementAndClickOutside(
            'metric',
            'longlonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglong'
        );
        await aibotDatasetPanel.checkOrUncheckData(
            'longlonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglong'
        );
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC93244_04',
            'Rename metric by clicking tab with long name'
        );
    });

    it('[TC93244_05] rename duplicate name show alert', async () => {
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
            'TC93244_05',
            'duplicate name alert'
        );
    });

    it('[TC93703] rename attribute&metrics - end to end save case', async () => {
        await libraryPage.editBotByUrl({ projectId: AttributeForms.project.id, botId: AttributeForms.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(AttributeForms.datasetName);
        await aibotDatasetPanelContextMenu.rightClickElementByName('attribute', 'User Type');
        await aibotDatasetPanelContextMenu.getRenameButton().click();
        await aibotDatasetPanelContextMenu.renameElementAndPressEnter('attribute', 'xss');
        await aibotDatasetPanelContextMenu.rightClickElementByName('metric', '% to Total Sessions');
        await aibotDatasetPanelContextMenu.getRenameButton().click();
        await aibotDatasetPanelContextMenu.renameElementAndPressEnter('metric', 'test');
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC93703_1',
            'attribute and metric same name'
        );
        await botAuthoring.saveBot({});
        await aibotDatasetPanel.waitForTextAppearInDataSetPanel(AttributeForms.datasetName);
        await libraryPage.clickLibraryIcon();
        await libraryPage.editBotByUrl({ projectId: AttributeForms.project.id, botId: AttributeForms.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await takeScreenshotByElement(aibotDatasetPanel.getDatasetContainer(), 'TC93703_2', 'rename could be save');
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('User');
        await takeScreenshotByElement(aibotChatPanel.getAutoCompleteArea(), 'TC93703_3', 'no user type');
        await aibotDatasetPanelContextMenu.rightClickElementByName('attribute', 'xss');
        await aibotDatasetPanelContextMenu.getRenameButton().click();
        await aibotDatasetPanelContextMenu.renameElementAndPressEnter('attribute', 'User Type');
        await aibotDatasetPanelContextMenu.rightClickElementByName('metric', 'test');
        await aibotDatasetPanelContextMenu.getRenameButton().click();
        await aibotDatasetPanelContextMenu.renameElementAndPressEnter('metric', '% to Total Sessions');
        await botAuthoring.saveBot({});
        await aibotDatasetPanel.waitForTextAppearInDataSetPanel(AttributeForms.datasetName);
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard(' User');
        await takeScreenshotByElement(aibotChatPanel.getAutoCompleteArea(), 'TC93703_4', 'user type exists');
    });
});
