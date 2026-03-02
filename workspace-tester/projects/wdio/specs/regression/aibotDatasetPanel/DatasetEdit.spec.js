import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { browserWindow } from '../../../constants/index.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { dataBotUser } from '../../../constants/bot.js';

describe('AIBot Dataset Settings ', () => {
    const TestBot = {
        id: 'E826BC3E644F7016932988B299B5C613',
        name: '08-managed-file-chinese',
        datasetName: '中国南方航空公司航班计划(2018-01-05更新).xls 中国部分机场与所在城市.xlsx (2 tables)',
        sampleFile: 'Airline Sample Data',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    let { loginPage, libraryPage, libraryAuthoringPage, botAuthoring, aibotDatasetPanel, aibotChatPanel } =
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

    it('[TC92409] Edit dataset in AI bot dataset panel - cancel and update', async () => {
        await libraryPage.editBotByUrl({ projectId: TestBot.project.id, botId: TestBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await aibotDatasetPanel.clickManipulateButtonDisplayed('Edit Dataset');
        await aibotDatasetPanel.waitForEditPageLoading();
        await aibotDatasetPanel.clickMojoPageButton('Cancel');
        await aibotDatasetPanel.clickManipulateButtonDisplayed('Edit Dataset');
        await aibotDatasetPanel.waitForEditPageLoading();
        await aibotDatasetPanel.clickMojoPageButton('Update Dataset');
        await aibotDatasetPanel.waitForEditPageClose();
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('所在城市');
        await aibotDatasetPanel.checkOrUncheckData('所在城市');
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC92409',
            'Check dataset is not changed after canceling edit.'
        );
    });

    it('[TC92381] Edit dataset in AI bot dataset panel - cancel and update', async () => {
        await libraryPage.editBotByUrl({ projectId: TestBot.project.id, botId: TestBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await aibotDatasetPanel.clickManipulateButtonDisplayed('Edit Dataset');
        await aibotDatasetPanel.waitForEditPageLoading();
        await aibotDatasetPanel.clickButtonInEditPage();
        await aibotDatasetPanel.chooseDataType('Sample Files');
        await aibotDatasetPanel.waitForFileSamplePageLoading();
        // await since('The dataset panel file sample page show should be #{expected}, instead we have #{actual}')
        //     .expect(await aibotDatasetPanel.isFileSamplePageDisplayed())
        //     .toBe(true);
        await aibotDatasetPanel.chooseFileInNewDI(TestBot.sampleFile);
        await aibotDatasetPanel.clickMojoPageButton('Import');
        await aibotDatasetPanel.waitForNewDIPageLoading();
        await aibotDatasetPanel.clickMojoPageButton('Update');
        await aibotDatasetPanel.waitForEditPageClose();
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('所在城市');
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC92381',
            'Check dataset is not changed after canceling edit.'
        );
    });
});
