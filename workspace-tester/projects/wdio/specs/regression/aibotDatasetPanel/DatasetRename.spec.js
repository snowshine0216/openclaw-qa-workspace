import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { browserWindow } from '../../../constants/index.js';
import { dataBotUser } from '../../../constants/bot.js';

describe('AIBot Dataset Settings ', () => {
    const TestBot = {
        id: 'E826BC3E644F7016932988B299B5C613',
        name: '08-managed-file-chinese',
        datasetName: '中国南方航空公司航班计划(2018-01-05更新).xls 中国部分机场与所在城市.xlsx (2 tables)',
        existDataset: 'File',
        emptyName: '',
        specialCharacters: '/\\:*?"<>|',
        newName: '12.xd d中文·~@3',
        emptyError: 'The Name cannot be empty.',
        specialCharactersError: `The Name cannot contain the reserved characters '/', '[', ']', '"' and '\\'.`,
        longError: 'The Name cannot exceed the maximum length of 250 characters.',
        longName:
            'qeeoidoadoajdkadakldmakmdklanmdkandkandmaddddddddddddddd12347846812738173291830928130981903      qeeoidoadoajdkadakldmakmdklanmdkandkandmaddddddddddddddd12347846812738173291830928130981903 qeeoidoadoajdkadakldmakmdklanmdkandkandmaddddddddddddddd123478',
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

    it('[TC91646] Rename dataset in AI bot dataset panel', async () => {
        await libraryPage.editBotByUrl({ projectId: TestBot.project.id, botId: TestBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(TestBot.datasetName);
        await aibotDatasetPanel.clickManipulateButtonDisplayed('Rename');
        await aibotDatasetPanel.setName(TestBot.newName);
        await aibotDatasetPanel.waitForDataPanelContainerLoading();
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(TestBot.newName);
    });

    it('[TC92369] Rename dataset in AI bot dataset panel - empty name', async () => {
        await libraryPage.editBotByUrl({ projectId: TestBot.project.id, botId: TestBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(TestBot.datasetName);
        await aibotDatasetPanel.clickManipulateButtonDisplayed('Rename');
        await aibotDatasetPanel.setName(TestBot.emptyName);
        await since('Error message should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.renameErrorMessage())
            .toBe(TestBot.emptyError);
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(TestBot.datasetName);
    });

    it('[TC92370] Rename dataset in AI bot dataset panel - special character name', async () => {
        await libraryPage.editBotByUrl({ projectId: TestBot.project.id, botId: TestBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(TestBot.datasetName);
        await aibotDatasetPanel.clickManipulateButtonDisplayed('Rename');
        await aibotDatasetPanel.setName(TestBot.specialCharacters);
        await since('Error message should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.renameErrorMessage())
            .toBe(TestBot.specialCharactersError);
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(TestBot.datasetName);
    });

    it('[TC92371] Rename dataset in AI bot dataset panel - long name', async () => {
        await libraryPage.editBotByUrl({ projectId: TestBot.project.id, botId: TestBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(TestBot.datasetName);
        await aibotDatasetPanel.clickManipulateButtonDisplayed('Rename');
        await aibotDatasetPanel.setName(TestBot.longName);
        await since('Error message should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.renameErrorMessage())
            .toBe(TestBot.longError);
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(TestBot.datasetName);
    });
});
