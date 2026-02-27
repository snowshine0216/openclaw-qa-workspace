import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { browserWindow } from '../../../constants/index.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { dataBotUser } from '../../../constants/bot.js';

describe('AIBot Dataset Settings ', () => {
    const StandaloneBot = {
        id: '102F91FAD14545989E56CCBB57B4ABAB',
        name: '28-2-Standalone-OLAP-datatime&derived metrics',
        datasetName: 'OLAP',
        dataPanelTtile: 'Manage access to data to answer questions',
        noMatchMessage: 'No Matched Content',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const ManagedBot = {
        id: '5618377A8345C4B892486494460995F3',
        name: '07-managed-clipboard',
        datasetName: 'automation dataset',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    let { loginPage, libraryPage, libraryAuthoringPage, botAuthoring, aibotDatasetPanel, aibotChatPanel, adminPage } =
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

    it('[TC92410] check dataset panel basic UI components', async () => {
        await libraryPage.editBotByUrl({ projectId: StandaloneBot.project.id, botId: StandaloneBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(StandaloneBot.datasetName);
        await since('The dataset panel message should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetPanelTitle().getText())
            .toBe(StandaloneBot.dataPanelTtile);
        await since('The dataset panel should have search is #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.isSearchPresent())
            .toBe(true);
        await takeScreenshotByElement(
            aibotDatasetPanel.getSearchContainer(),
            'TC92410',
            'Check dataset panel basic UI components'
        );
    });

    it('[TC92340] check dataset panel menu buttons with standalone dataset', async () => {
        await libraryPage.editBotByUrl({ projectId: StandaloneBot.project.id, botId: StandaloneBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(StandaloneBot.datasetName);
        await aibotDatasetPanel.openMenu();
        await takeScreenshotByElement(
            aibotDatasetPanel.getMenuContainer(),
            'TC92340',
            'Check dataset panel menu with Standalone OLAP dataset'
        );
    });

    it('[TC92341] Check dataset panel menu buttons with managed dataset', async () => {
        await libraryPage.editBotByUrl({ projectId: ManagedBot.project.id, botId: ManagedBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(ManagedBot.datasetName);
        await aibotDatasetPanel.openMenu();
        await takeScreenshotByElement(
            aibotDatasetPanel.getMenuContainer(),
            'TC92341',
            'Check dataset panel menu with Managed Clipboard dataset'
        );
    });

    it('[TC91648] Search data-attribute/metrics and dataset in search box in dataset panel', async () => {
        await libraryPage.editBotByUrl({ projectId: StandaloneBot.project.id, botId: StandaloneBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC91648-01',
            'Check dataset panel UI and data icon.'
        );
        await aibotDatasetPanel.inputSearchText('a');
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC91648-02',
            'Check dataset panel search result'
        );
        await since('The dataset clear search icon displays should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.isClearSearchIconDisplayed())
            .toBe(true);
        await aibotDatasetPanel.inputSearchText('123/`');
        await since('The dataset panel show error message is #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getNoContentMessage().getText())
            .toBe(StandaloneBot.noMatchMessage);
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await botAuthoring.selectBotConfigTabByName('Data');
        await takeScreenshotByElement(
            aibotDatasetPanel.getSearchContainer(),
            'TC91648-03',
            'No search history after switching tabs'
        );
    });

    it('[TC91643] Verify select/unselect attribute/metrics in data panel', async () => {
        await libraryPage.editBotByUrl({ projectId: ManagedBot.project.id, botId: ManagedBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        if (aibotDatasetPanel.isDataChecked('Subcategory') === true) {
            await aibotDatasetPanel.checkOrUncheckData('Subcategory');
            await aibotDatasetPanel.checkOrUncheckData('Year');
            await aibotDatasetPanel.checkOrUncheckData('Unit Cost');
        }
        await aibotDatasetPanel.checkOrUncheckData('Subcategory');
        await aibotDatasetPanel.checkOrUncheckData('Year');
        await aibotDatasetPanel.checkOrUncheckData('Unit Cost');
        await libraryAuthoringPage.waitForCurtainDisappear();
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('Su');
        await takeScreenshotByElement(aibotChatPanel.getAutoCompleteArea(), 'TC91643-01', 'Check unselect result');
        await botAuthoring.saveBot({});
        await aibotDatasetPanel.waitForTextAppearInDataSetPanel(ManagedBot.datasetName);
        await libraryPage.clickLibraryIcon();
        await libraryPage.editBotByUrl({ projectId: ManagedBot.project.id, botId: ManagedBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC91643-02',
            'Check dataset panel select/unselect attribute/metrics'
        );
        await aibotDatasetPanel.checkOrUncheckData('Subcategory');
        await aibotDatasetPanel.checkOrUncheckData('Year');
        await aibotDatasetPanel.checkOrUncheckData('Unit Cost');
        await botAuthoring.saveBot({});
        await libraryAuthoringPage.waitForCurtainDisappear();
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC91643-03',
            'Check dataset panel select/unselect attribute/metrics'
        );
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('Su');
        await takeScreenshotByElement(aibotChatPanel.getAutoCompleteArea(), 'TC91643-04', 'Check unselect result');
    });

    it('[TC92176] Verify select All attribute/metrics in data panel', async () => {
        await libraryPage.editBotByUrl({ projectId: StandaloneBot.project.id, botId: StandaloneBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('All displays should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getSelectBox('Check All').isDisplayed())
            .toBe(true);
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC92176-01',
            'Check dataset panel original status'
        );
        await aibotDatasetPanel.checkOrUncheckData('Check All');
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC92176-02',
            'Check dataset panel select All'
        );
    });

    it('[TC92177] Verify unselect All attribute/metrics in data panel', async () => {
        await libraryPage.editBotByUrl({ projectId: StandaloneBot.project.id, botId: StandaloneBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await aibotDatasetPanel.checkOrUncheckData('Check All');
        await aibotDatasetPanel.checkOrUncheckData('Check All');
        await since('The dataset panel show error message should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.isErrorIconDisplayed())
            .toBe(false);
        await since('The dataset panel show error message should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.isPanelErrorIconDisplayed())
            .toBe(true);
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC92177',
            'Check dataset panel unselect All'
        );
    });
});
