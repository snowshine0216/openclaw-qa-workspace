import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { browserWindow } from '../../../constants/index.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { dataBotUser } from '../../../constants/bot.js';

describe('AIBot Dataset Settings - attrform', () => {
    const AttributeForms = {
        id: '3B5B5C55714F28AD890105A7637D6A94',
        name: 'AttributeForms',
        datasetName: 'attforms',
        project: {
            id: '61ABA574CA453CCCF398879AFE2E825F',
            name: 'Platform Analytics',
        },
    };

    const DarkThemeBot = {
        id: 'BABC69B0114C5532E1DF14A949D6163A',
        name: 'DarkThemeBot',
        dataset1: 'MDX cube',
        dataset2: 'NAA report',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
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

    it('[TC93246_00] attribute format - check basic UI', async () => {
        await libraryPage.editBotByUrl({ projectId: AttributeForms.project.id, botId: AttributeForms.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(AttributeForms.datasetName);
        await aibotDatasetPanel.rightClickOnDataName('User');
        await takeScreenshotByElement(
            aibotDatasetPanel.getDataContextMenu(),
            'TC93246_00',
            'Open context menu, check available attribute forms string and UI'
        );
    });

    it('[TC93246_01] attribute format - check basic UI', async () => {
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
            'TC93246_01',
            'Open attribute menu, check available attribute forms in the list'
        );
    });

    it('[TC93246_02] attribute format - unselected data attribute form not available', async () => {
        await libraryPage.editBotByUrl({ projectId: AttributeForms.project.id, botId: AttributeForms.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(AttributeForms.datasetName);
        await aibotDatasetPanel.rightClickOnDataName('User Status');
        await takeScreenshotByElement(
            aibotDatasetPanel.getDataContextMenu(),
            'TC93246_02_1',
            'unselected attribute, grey out the attribute form menu'
        );
        await aibotDatasetPanelContextMenu.hoverOnAttributeFormsButton();
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC93246_02_2',
            'no attribute form list for unselected attribute while hovering on the attribute form button'
        );
    });

    it('[TC93246_03] attribute format - unselect attribute form', async () => {
        await libraryPage.editBotByUrl({ projectId: AttributeForms.project.id, botId: AttributeForms.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(AttributeForms.datasetName);
        await aibotDatasetPanelContextMenu.changeAttributeFormat('User', 'ID');
        await aibotDatasetPanel.rightClickOnDataName('User');
        await aibotDatasetPanelContextMenu.hoverOnAttributeFormsButton();
        await since('attribute form checked status should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanelContextMenu.isChecked('ID'))
            .toBe(false);
    });

    it('[TC93246_04] attribute format - unselect attribute form cancel ', async () => {
        await libraryPage.editBotByUrl({ projectId: AttributeForms.project.id, botId: AttributeForms.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(AttributeForms.datasetName);
        await aibotDatasetPanelContextMenu.changeAttributeFormat('User Type', 'DESC', true);
        await aibotDatasetPanel.rightClickOnDataName('User Type');
        await aibotDatasetPanelContextMenu.hoverOnAttributeFormsButton();
        await since('attribute form checked status should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanelContextMenu.isChecked('DESC'))
            .toBe(true);
    });

    it('[TC93246_05] attribute format - save change', async () => {
        await libraryPage.editBotByUrl({ projectId: AttributeForms.project.id, botId: AttributeForms.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(AttributeForms.datasetName);
        await aibotDatasetPanelContextMenu.changeAttributeFormat('User', 'Email');
        await aibotDatasetPanelContextMenu.changeAttributeFormat('User', 'Login');
        await botAuthoring.saveBot({});
        await aibotDatasetPanel.waitForTextAppearInDataSetPanel(AttributeForms.datasetName);
        await libraryPage.clickLibraryIcon();
        await libraryPage.editBotByUrl({ projectId: AttributeForms.project.id, botId: AttributeForms.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await aibotDatasetPanel.rightClickOnDataName('User');
        await aibotDatasetPanelContextMenu.hoverOnAttributeFormsButton();
        await since('attribute form checked status should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanelContextMenu.isChecked('Email'))
            .toBe(false);
        await since('attribute form checked status should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanelContextMenu.isChecked('Login'))
            .toBe(false);
        await aibotDatasetPanelContextMenu.changeAttributeFormat('User', 'Email');
        await aibotDatasetPanelContextMenu.changeAttributeFormat('User', 'Login');
        await botAuthoring.saveBot({});
    });

    it('[TC93246_06] attribute format - unselect multiple forms', async () => {
        await libraryPage.editBotByUrl({ projectId: AttributeForms.project.id, botId: AttributeForms.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(AttributeForms.datasetName);
        await aibotDatasetPanelContextMenu.changeAttributeFormat('User', [
            'Picture (Full Size)',
            'Password Expiration Date',
            'Standard Auth Allowed',
        ]);
        await aibotDatasetPanel.rightClickOnDataName('User');
        await aibotDatasetPanelContextMenu.hoverOnAttributeFormsButton();
        await since('Picture (Full Size) form checked status should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanelContextMenu.isChecked('Picture (Full Size)'))
            .toBe(false);
        await since('Standard Auth Allowed form checked status should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanelContextMenu.isChecked('Standard Auth Allowed'))
            .toBe(false);
    });

    it('[TC93246_07] attribute format - select attribute form', async () => {
        await libraryPage.editBotByUrl({ projectId: AttributeForms.project.id, botId: AttributeForms.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(AttributeForms.datasetName);
        await aibotDatasetPanelContextMenu.changeAttributeFormat('User Type', 'ID');
        await aibotDatasetPanel.rightClickOnDataName('User Type');
        await aibotDatasetPanelContextMenu.hoverOnAttributeFormsButton();
        await since('attribute form checked status should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanelContextMenu.isChecked('ID'))
            .toBe(true);
    });

    it('[TC93246_08] attribute format - check basic UI', async () => {
        await libraryPage.editBotByUrl({ projectId: DarkThemeBot.project.id, botId: DarkThemeBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await aibotChatPanel.getAskAboutBtn().click();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getAskAboutPanel());
        await aibotChatPanel.getAskAboutPanelObjectByIndex(1).click();
        await browser.pause(3000);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getStartConversationBtn());
        await takeScreenshotByElement(
            await aibotChatPanel.getAskAboutPanelObjectList(),
            'TC93246_08_01',
            'check attribute form default value in ask about panel'
        );
        await aibotDatasetPanelContextMenu.changeAttributeFormat('Customer', 'Last Name');
        await browser.pause(3000);
        await aibotChatPanel.getAskAboutPanelObjectByIndex(1).click();
        await browser.pause(3000);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getStartConversationBtn());
        await takeScreenshotByElement(
            await aibotChatPanel.getAskAboutPanelObjectList(),
            'TC93246_08_02',
            'check attribute form default value in ask about panel'
        );
    });
});
