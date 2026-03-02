import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { browserWindow } from '../../../constants/index.js';
import { nuggetTestUser, getBotObjectToEdit, nuggetsUIStringLabels } from '../../../constants/bot.js';
import { createBotByAPI, deleteBotList } from '../../../api/bot/index.js';
import { mockISAiSearchConfiguration } from '../../../api/mock/mock-response-utils.js';

describe('AI Bot Nuggets Upload', () => {
    let { loginPage, libraryPage, botAuthoring } = browsers.pageObj1;
    let botId;
    const botIdsToDelete = [];
    const botName = 'TC93236 Test Bot RAG';
    const BotToCreate = getBotObjectToEdit({ botName });
    const small_size_file = 'test_nugget_small.xlsx';
    const large_size_file = 'test_nugget_large.xlsx';
    const encryted_file = 'test_nugget_encrypt.xlsx';
    const long_name_file = 'longnamefileTest_long_long_long_long_long_long_long_long_long.xlsx';

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await libraryPage.openDefaultApp();
        await loginPage.login(nuggetTestUser);
    });

    beforeEach(async () => {
        botId = await createBotByAPI({ credentials: nuggetTestUser, botInfo: BotToCreate });
        botIdsToDelete.push(botId);
    });

    afterEach(async () => {
        if (await botAuthoring.custommizationPanel.getNuggetsItem().isExisting()) {
            console.log('begin delete nugget');
            await botAuthoring.custommizationPanel.deleteNuggetItem();
            await botAuthoring.saveBot({});
            console.log('end delete nugget');
        }
        await browser.mockClearAll();
        await deleteBotList({
            credentials: nuggetTestUser,
            botList: [...botIdsToDelete],
            projectId: BotToCreate.project.id,
        });
        botIdsToDelete.length = 0;
    });

    afterAll(async () => {
        // await deleteNuggetsBulkAPI({ iServerRest, sessionID, nuggets: nuggetsToDelete });
        // await logoutFromCurrentBrowser();
        await libraryPage.openDefaultApp();
    });

    it('[TC93236_01] Upload File And Re-edit bot', async () => {
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId });
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await botAuthoring.custommizationPanel.uploadNuggetsFile(small_size_file);
        await botAuthoring.custommizationPanel.fakeNuggetNameInUI();
        await takeScreenshotByElement(
            await botAuthoring.custommizationPanel.getNuggetsItem(),
            'TC93236_01',
            'Upload small size file',
            { tolerance: 0.18 }
        );
        await botAuthoring.saveBot({});
        await botAuthoring.exitBotAuthoring();
        // wait 1 min and check upload time
        await libraryPage.sleep(60000);
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId });
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await botAuthoring.custommizationPanel.fakeNuggetNameInUI();
        await takeScreenshotByElement(
            await botAuthoring.custommizationPanel.getNuggetsItem(),
            'TC93236_01',
            'Re-edit bot',
            { tolerance: 0.18 }
        );
        await botAuthoring.custommizationPanel.deleteNuggetItem();
        await botAuthoring.saveBot({});
        await botAuthoring.exitBotAuthoring();
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId });
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await takeScreenshotByElement(
            await botAuthoring.custommizationPanel.getKnowledgeSection(),
            'TC93236_01',
            'Remove Bot',
            { tolerance: 0.18 }
        );
    });

    it('[TC93236_02] Upload Large size file', async () => {
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId });
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await botAuthoring.custommizationPanel.uploadNuggetsFileWorkaroundNoWait({ fileName: large_size_file });
        await takeScreenshotByElement(
            await botAuthoring.custommizationPanel.getNuggetsItem(),
            'TC93236_02',
            'Upload large size file',
            { tolerance: 0.18 }
        );
        // after switch  tab, error message will gone
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await takeScreenshotByElement(
            await botAuthoring.custommizationPanel.getNuggetsItem(),
            'TC93236_02',
            'Switch tab and back to customization tab',
            { tolerance: 0.18 }
        );
        await botAuthoring.saveBot({});
        await botAuthoring.exitBotAuthoring();
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId });
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await takeScreenshotByElement(
            await botAuthoring.custommizationPanel.getKnowledgeSection(),
            'TC93236_02',
            'Re-edit Bot',
            { tolerance: 0.18 }
        );
    });

    it('[TC93236_03] Upload Failure Check', async () => {
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId });
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await botAuthoring.custommizationPanel.upLoadNuggetsFileError(encryted_file);
        await botAuthoring.custommizationPanel.fakeNuggetNameInUI();
        await takeScreenshotByElement(
            await botAuthoring.custommizationPanel.getNuggetsItem(),
            'TC93236_03',
            'Index File Error',
            { tolerance: 1.3 }
        );
        // switch tab - existing defect
        await botAuthoring.custommizationPanel.triggerProgressErrorTooltip(0);
        await since('Tooltip of progress error icon should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.custommizationPanel.getTooltipFullText())
            .toContain(nuggetsUIStringLabels.nuggetProgressErrorTooltipText);
        await botAuthoring.saveBot({});
        await botAuthoring.exitBotAuthoring();
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId });
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await botAuthoring.custommizationPanel.fakeNuggetNameInUI();
        await takeScreenshotByElement(
            await botAuthoring.custommizationPanel.getNuggetsItem(),
            'TC93236_03',
            'Re-edit Bot',
            { tolerance: 0.18 }
        );
        await botAuthoring.custommizationPanel.deleteNuggetItem();
        await botAuthoring.custommizationPanel.uploadNuggetsFile(small_size_file);
        await botAuthoring.custommizationPanel.fakeNuggetNameInUI();
        await takeScreenshotByElement(
            await botAuthoring.custommizationPanel.getNuggetsItem(),
            'TC93236_03',
            'Replace small size file',
            { tolerance: 0.18 }
        );
        await botAuthoring.saveBot({});
        await botAuthoring.exitBotAuthoring();
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId });
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await botAuthoring.custommizationPanel.fakeNuggetNameInUI();
        await takeScreenshotByElement(
            await botAuthoring.custommizationPanel.getNuggetsItem(),
            'TC93236_03',
            'Re-edit bot after replace file',
            { tolerance: 0.18 }
        );
    });

    it('[TC93236_04] Upload long file name', async () => {
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId });
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await botAuthoring.custommizationPanel.uploadNuggetsFile(long_name_file);
        await takeScreenshotByElement(
            await botAuthoring.custommizationPanel.getNuggetsItem(),
            'TC93236_04',
            'Upload long file name',
            { tolerance: 0.18 }
        );
        await botAuthoring.custommizationPanel.hoverOnNuggetTitle();
        let text = await botAuthoring.custommizationPanel.getTooltipFullText();
        let tooltip = long_name_file.split('.')[0];
        await since('Tooltip of nugget title should be #{expected}, instead we have #{actual}')
            .expect(text)
            .toContain(tooltip);
        // // add remove nugget steps
        // await botAuthoring.custommizationPanel.deleteNuggetItem();
        // await botAuthoring.saveBot({});
    });

    it('[TC93236_05] Check when aiSearchService is down and no nuggets', async () => {
        await mockISAiSearchConfiguration({ user: nuggetTestUser });
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId });
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await takeScreenshotByElement(
            await botAuthoring.custommizationPanel.getKnowledgeSection(),
            'TC93236_05',
            'aiSearchService down no nuggets',
            { tolerance: 0.18 }
        );
        await botAuthoring.custommizationPanel.hoverOnMissingFileWarningIcon();
        await since('Tooltip of missing file warning icon should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.custommizationPanel.getTooltipFullText())
            .toBe(nuggetsUIStringLabels.disableNuggetTooltipText);
    });

    it('[TC93236_06] Check when aiSearchService is down and has nuggets', async () => {
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId });
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await botAuthoring.custommizationPanel.uploadNuggetsFile(small_size_file);
        await botAuthoring.saveBot({});
        await mockISAiSearchConfiguration({ user: nuggetTestUser });
        await browser.refresh();
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await botAuthoring.custommizationPanel.fakeNuggetNameInUI();
        await takeScreenshotByElement(
            await botAuthoring.custommizationPanel.getNuggetsItem(),
            'TC93236_06',
            'aiSearchService down has nuggets',
            { tolerance: 0.18 }
        );
        await mockISAiSearchConfiguration({ user: nuggetTestUser, isAiSearchConfigured: true });
        await browser.refresh();
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        // await botAuthoring.custommizationPanel.deleteNuggetItem();
        // await botAuthoring.saveBot({});
    });

    it('[TC93236_07] Check upload file with name duplicated ', async () => {
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId });
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await botAuthoring.custommizationPanel.uploadNuggetsFile(small_size_file);
        await botAuthoring.custommizationPanel.deleteNuggetItem();
        await botAuthoring.custommizationPanel.uploadNuggetsFile(small_size_file);
        // assert the file name shown becomes object name:
        let nuggetTitle = await botAuthoring.custommizationPanel.getNuggetName().getText();
        console.log(nuggetTitle);
        // assert the nugget Title shown becomes object name in this pattern: test_nugget_small 2024-03-30T06:16:28
        // use regular expression to match the pattern
        await since('Nugget title should match the pattern')
            .expect(nuggetTitle)
            .toMatch(/test_nugget_small \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
        // await botAuthoring.custommizationPanel.deleteNuggetItem();
        // await botAuthoring.saveBot({});
    });
});
