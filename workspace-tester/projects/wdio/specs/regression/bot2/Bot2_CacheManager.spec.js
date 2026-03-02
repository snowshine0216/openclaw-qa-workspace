import { browserWindow } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import * as bot from '../../../constants/bot2.js';
import { clearBotV2HistoryByAPI, deleteBotV2ChatByAPI } from '../../../api/bot2/chatAPI.js';
import { deleteBotCache, disableBotCache, enableBotFullCache } from '../../../api/bot2/botCacheAPI.js';

describe('Bot 2.0 Cache Manager', () => {
    const { loginPage, libraryPage, aibotChatPanel, botAuthoring, cacheManager, bot2Chat } = browsers.pageObj1;

    const cache_bot = {
        id: '3A74131C97BA4496949AFBC56C375ACD',
        name: 'AUTO_BOT_Cache',
        projectId: bot.project_applicationTeam.id,
    };
    const question1 = 'what is the number of flights by year';
    const question1_1 = 'show the number of flights by year';
    const question2 = 'what is the number of flights by airline name';
    const expectedKeywords1 = '2009;2010;2011';

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(bot.cacheUser);
        await libraryPage.waitForLibraryLoading();

        // delete bot chat history
        await deleteBotV2ChatByAPI({
            botId: cache_bot.id,
            projectId: cache_bot.projectId,
            credentials: { username: bot.cacheUser.username, password: bot.cacheUser.password },
        });
    });

    beforeEach(async () => {
        // delete bot cache
        await deleteBotCache({
            botId: cache_bot.id,
            projectId: cache_bot.projectId,
            credentials: { username: bot.cacheUser.username, password: bot.cacheUser.password },
        });

        // disable bot cache
        await disableBotCache({
            botId: cache_bot.id,
            projectId: cache_bot.projectId,
            credentials: { username: bot.cacheUser.username, password: bot.cacheUser.password },
        });

        await libraryPage.editBotByUrl({ projectId: cache_bot.projectId, botId: cache_bot.id });
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();
    });

    afterEach(async () => {
        // delete bot chat history
        await deleteBotV2ChatByAPI({
            botId: cache_bot.id,
            projectId: cache_bot.projectId,
            credentials: { username: bot.cacheUser.username, password: bot.cacheUser.password },
        });
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    async function prepareCacheBuckets(questionGroup, bucketCount = questionGroup.length) {
        // turn on full cache setting to generate cache bucket
        await enableBotFullCache({
            botId: cache_bot.id,
            projectId: cache_bot.projectId,
            credentials: { username: bot.cacheUser.username, password: bot.cacheUser.password },
        });
        await libraryPage.editBotByUrl({ projectId: cache_bot.projectId, botId: cache_bot.id });

        // Q&A to generate cache
        for (const question of questionGroup) {
            await aibotChatPanel.askQuestion(question, true);
        }

        // open cache manager to check
        await botAuthoring.openCacheManager();
        await since(`cache buckets count should be #{expected}, instead we have #{actual}`)
            .expect(await cacheManager.getCachingBucketsCount())
            .toBe(bucketCount);
        await cacheManager.closeCacheManager();
    }

    it('[TC99027_01] cache manager - turn on full cache ', async () => {
        // GUI when cache off
        await botAuthoring.openCacheManager();
        await takeScreenshotByElement(
            cacheManager.getCacheManagerPage(),
            'TC99027_01',
            'Bot2_CacheManager_CacheManagerPage'
        );
        await cacheManager.openCacheSettings();
        await since(`cache setting dialogue present should be #{expected}, instead we have #{actual}`)
            .expect(await cacheManager.isCacheSettingsDialogDisplayed())
            .toBe(true);
        await takeScreenshotByElement(
            cacheManager.getCacheSettingsDialog(),
            'TC99027_01',
            'Bot2_CacheManager_CacheSettingsDialog'
        );

        // turn on full cache setting
        await cacheManager.selectCachingMode('Full Caching');
        await cacheManager.closeCacheManager();

        //Q&A to generate buckets
        await aibotChatPanel.askQuestion(question1, true);
        await since(`Answer should contain expected keywords: ${expectedKeywords1}`)
            .expect(await bot2Chat.verifyAnswerContainsKeywords(expectedKeywords1))
            .toBe(true);
        await since(`Q&A and the hit cache icon present should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.getAnswerWithoutCacheButton(0).isDisplayed())
            .toBe(false);
        // open cache manager to check cache status
        await botAuthoring.openCacheManager();
        await since(`cache buckets count should be #{expected}, instead we have #{actual}`)
            .expect(await cacheManager.getCachingBucketsCount())
            .toBe(1);
        await cacheManager.closeCacheManager();

        // Q&A to hit cache
        await aibotChatPanel.askQuestion(question1, true);
        await since(`Ask again and hit cache icon present should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.getAnswerWithoutCacheButton(1).isDisplayed())
            .toBe(true);
        // Regenerate without cache
        await aibotChatPanel.clickAnswerWithoutCacheButtonByIndex(1);
        await since(`Regenerate answer and the hit cache icon present should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.getAnswerWithoutCacheButton(2).isDisplayed())
            .toBe(false);
        // open cache manager to check cache status
        await botAuthoring.openCacheManager();
        await since(`hit cache and buckets count should be #{expected}, instead we have #{actual}`)
            .expect(await cacheManager.getCachingBucketsCount())
            .toBe(1);

        // delete cache
        await cacheManager.openCacheSettings();
        await cacheManager.deleteCaches();
        await since(`delete cache and buckets count should be #{expected}, instead we have #{actual}`)
            .expect(await cacheManager.getCachingBucketsCount())
            .toBe(0);
        await cacheManager.closeCacheManager();
    });

    it('[TC99027_02] cache manager - turn on existing only cache ', async () => {
        await prepareCacheBuckets([question1]);

        await aibotChatPanel.clearHistory();

        // Change mode to Existing Only
        await botAuthoring.openCacheManager();
        await cacheManager.openCacheSettings();
        await cacheManager.selectCachingMode('Existing Only');
        await cacheManager.closeCacheManager();

        // Q&A to hit cache
        await aibotChatPanel.askQuestion(question1, true);
        await aibotChatPanel.hoverOnChatAnswer(0);
        await since(`Ask again and hit cache icon present should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.getAnswerWithoutCacheButton(0).isDisplayed())
            .toBe(true);

        // Q&A, no new cache bucket
        await aibotChatPanel.askQuestion(question2, true);
        await aibotChatPanel.hoverOnChatAnswer(1);
        await since(`Ask new question and hit cache icon present should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.getAnswerWithoutCacheButton(1).isDisplayed())
            .toBe(false);

        // open cache manager to check cache status
        await botAuthoring.openCacheManager();
        await since(`cache buckets count should be #{expected}, instead we have #{actual}`)
            .expect(await cacheManager.getCachingBucketsCount())
            .toBe(1);
        await cacheManager.closeCacheManager();
    });

    it('[TC99027_03] cache manager - bucket list management ', async () => {
        await prepareCacheBuckets([question1, question2]);

        // pin cache
        await cacheManager.openCacheManager();
        await cacheManager.openBucketContextMenu(0);
        await takeScreenshotByElement(
            cacheManager.getBucketContextMenuContainer(),
            'TC99027_03',
            'Bot2_CacheManager_BucketContextMenu'
        );
        await cacheManager.selectBucketContextMenuOption('Pin');
        await since(`bucket pin count should be #{expected}, instead we have #{actual}`)
            .expect(await cacheManager.getBucketPinCount())
            .toBe(1);

        // regenerate interpretations
        await cacheManager.openBucketContextMenu(0);
        await cacheManager.selectBucketContextMenuOption('Regenerate Interpretations');
        await cacheManager.waitForToastGone();
        await since(`regenerate interpretation and buckets count should be #{expected}, instead we have #{actual}`)
            .expect(await cacheManager.getCachingBucketsCount())
            .toBe(2);

        // merge into
        await cacheManager.openBucketContextMenu(0);
        await cacheManager.selectBucketContextMenuOption('Merge into', 0);
        await since(`merge and cache buckets count should be #{expected}, instead we have #{actual}`)
            .expect(await cacheManager.getCachingBucketsCount())
            .toBe(1);

        // delete
        await cacheManager.openBucketContextMenu(0);
        await cacheManager.selectBucketContextMenuOption('Delete');
        await since(`delete and cache buckets count should be #{expected}, instead we have #{actual}`)
            .expect(await cacheManager.getCachingBucketsCount())
            .toBe(0);
        await cacheManager.closeCacheManager();
    });

    it('[TC99027_04] cache manager - question list management ', async () => {
        await prepareCacheBuckets([question1, question2, question1_1], 2);
        await cacheManager.openCacheManager();
        const bucketCount = await cacheManager.getCachingBucketsCount();

        // create new bucket
        await cacheManager.openBucketByName(question1);
        const questionCount = await cacheManager.getQuestionListCount();
        await cacheManager.openQuestionContextMenu(questionCount - 1);
        await takeScreenshotByElement(
            cacheManager.getQuestionContextMenu(),
            'TC99027_04',
            'Bot2_CacheManager_QuestionContextMenu'
        );
        await cacheManager.selectQuestionContextMenuOption('Move to', 'Create New Bucket');
        await since(`Create new bucket and question list count should be #{expected}, instead we have #{actual}`)
            .expect(await cacheManager.getQuestionListCount())
            .toBe(questionCount - 1);
        await since(`Create new bucket and cache buckets count should be #{expected}, instead we have #{actual}`)
            .expect(await cacheManager.getCachingBucketsCount())
            .toBe(bucketCount + 1);

        // move to other buckets
        await cacheManager.openQuestionContextMenu(0);
        await cacheManager.selectQuestionContextMenuOption('Move to', 0);
        await since(`Move to other bucket and question list count should be #{expected}, instead we have #{actual}`)
            .expect(await cacheManager.getQuestionListCount())
            .toBe(0);
        await since(`Move to other bucket and cache buckets count should be #{expected}, instead we have #{actual}`)
            .expect(await cacheManager.getCachingBucketsCount())
            .toBe(bucketCount);

        // delete question
        await cacheManager.openBucketByIndex(0);
        await cacheManager.openQuestionContextMenu(0);
        await cacheManager.selectQuestionContextMenuOption('Delete');
        await since(`Delete question and question list count should be #{expected}, instead we have #{actual}`)
            .expect(await cacheManager.getQuestionListCount())
            .toBe(0);
        await since(`Delete question and cache buckets count should be #{expected}, instead we have #{actual}`)
            .expect(await cacheManager.getCachingBucketsCount())
            .toBe(bucketCount - 1);

        // expand question to load answer
        await cacheManager.openBucketByIndex(0);
        await cacheManager.expandQuestion(0);
        await since(`The answer loaded should be #{expected}, instead we have #{actual}`)
            .expect(await cacheManager.getQuestionAnswerPanel().isDisplayed())
            .toBe(true);

        // show columns
        await cacheManager.expandColumns();
        await cacheManager.selectColumnByName('User');
        await since(`The answer loaded should be #{expected}, instead we have #{actual}`)
            .expect(await cacheManager.isColumnCheckedByName('User'))
            .toBe(true);
        await takeScreenshotByElement(cacheManager.getColumnContainer(), 'TC99027_04', 'Bot2_CacheManager_Columns');
        await cacheManager.collapseColumns();

        await cacheManager.closeCacheManager();
    });

    it('[TC99027_05] cache manager - view sql ', async () => {
        await prepareCacheBuckets([question1]);

        // open bucket question
        await cacheManager.openCacheManager();
        await cacheManager.openBucketByIndex(0);
        await takeScreenshotByElement(
            cacheManager.getQuestionDetailsPanel(),
            'TC99027_05',
            'Bot2_CacheManager_QuestionDetails'
        );

        // view sql
        await cacheManager.openViewSQL();
        await since(`SQL dialogue present should be #{expected}, instead we have #{actual}`)
            .expect(await cacheManager.getSQLDialog().isDisplayed())
            .toBe(true);
        await takeScreenshotByElement(cacheManager.getSQLDialog(), 'TC99027_05', 'Bot2_CacheManager_SQLDialogue');

        // verify sql
        await cacheManager.verifySQL();
        await since(`Verify SQL and output should be #{expected}, instead we have #{actual}`)
            .expect(await cacheManager.getSQLOutPutText())
            .toContain('2009');

        // save sql
        await cacheManager.getSaveSQLBtn();
        await cacheManager.closeViewSQL();
        await cacheManager.closeCacheManager();
    });

    it('[TC99027_06] cache manager - search buckets', async () => {
        await prepareCacheBuckets([question1, question2]);
        await cacheManager.openCacheManager();

        // search with different keywords
        await cacheManager.searchBuckets('flight');
        await since(`Search flight and result count should be #{expected}, instead we have #{actual}`)
            .expect(await cacheManager.getCachingBucketsCount())
            .toBe(2);

        await cacheManager.searchBuckets('airline');
        await since(`Search airline and result count should be #{expected}, instead we have #{actual}`)
            .expect(await cacheManager.getCachingBucketsCount())
            .toBe(1);

        await cacheManager.searchBuckets('100');
        await since(`Search 100 and result count should be #{expected}, instead we have #{actual}`)
            .expect(await cacheManager.getCachingBucketsCount())
            .toBe(0);

        await cacheManager.searchBuckets('air & name');
        await since(`Search air & name and result count should be #{expected}, instead we have #{actual}`)
            .expect(await cacheManager.getCachingBucketsCount())
            .toBe(0);
        await cacheManager.clearSearch();

        // search and re-open
        await cacheManager.closeCacheManager();
        await cacheManager.openCacheManager();
        await since(
            `Re-open cache manager and search airline result count should be #{expected}, instead we have #{actual}`
        )
            .expect(await cacheManager.getCachingBucketsCount())
            .toBe(2);
        await cacheManager.searchBuckets('airline');
        await cacheManager.closeCacheManager();
        await cacheManager.openCacheManager();
        await since(`Re-open cache manager and result count should be #{expected}, instead we have #{actual}`)
            .expect(await cacheManager.getCachingBucketsCount())
            .toBe(2);
        await cacheManager.closeCacheManager();
    });
});
