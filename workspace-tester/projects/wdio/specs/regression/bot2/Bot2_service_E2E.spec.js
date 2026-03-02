import { browserWindow } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import createBotByAPIV2 from '../../../api/bot2/createBotAPIV2.js';
import * as bot from '../../../constants/bot2.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import fs from 'fs';
import allureReporter from '@wdio/allure-reporter';

const __datafile = 'specs/regression/bot2/Bot2_service_E2E_Data.json';
console.log('__datafile', __datafile);
var fileData;
try {
    fileData = fs.readFileSync(__datafile, 'utf8');
} catch (err) {
    console.error('readFileSync Error:', err);
}
const cases = JSON.parse(fileData);

describe('Bot 2.0 E2E Workflow', () => {
    let {
        loginPage,
        libraryPage,
        libraryAuthoringPage,
        botAuthoring,
        botConsumptionFrame,
        aibotChatPanel,
        adc,
        datasetsPanel,
        aibotDatasetPanel,
        bot2Chat
    } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(bot.botUser);
        await libraryPage.waitForLibraryLoading();
    });

    beforeEach(async () => {
        await libraryPage.openDefaultApp();
        await libraryPage.waitForLibraryLoading();
    });

    afterEach(async () => {
        // TODO: delete bot and ADC by api
    });

    afterAll(async () => {});

    for (const test of cases) {
        it(`[Bot2_E2E_${test.case_id}] E2E Workflow on ADC and Bot2.0 - Dataset( ${test.dataset})`, async () => {
            const test_object_info = {
                dataset: test.dataset,
                ds_rename_init: test.rename_bject,
                ds_DM_metric: test.metric_for_DM,
                question: test.question,
                bot_name: 'BOT_AUTO_' + `${test.dataset}` + '_' + Date.now(),
                adc_name: 'ADC_AUTO_' + `${test.dataset}` + '_' + Date.now(),
                ds_rename_new: `${test.rename_bject}` + '_Alias',
                ds_DM_newMetric: 'Sum ' + `(${test.metric_for_DM})`,
                question1: test.question1,
                expect1: test.expected_keyword1,
                question2: test.question2,
                expect2: test.expected_keyword2
            };
            allureReporter.addStep(`[TestObjectInfo] DATASET: ${test_object_info.dataset}`);

            // Step 1: Create ADC
            allureReporter.addStep(`[Step1] Create ADC: ${test_object_info.adc_name}`);
            await libraryAuthoringPage.clickNewDossierIcon();
            await since('The create ADC option present should be #{expected}, instead we have #{actual}')
                .expect(await libraryAuthoringPage.isCreateADCOptionPresent())
                .toBe(true);
            await libraryAuthoringPage.clickNewADCButton();
            await libraryAuthoringPage.selectProjectAndDataset(bot.project.name, test_object_info.dataset);
            await adc.save(test_object_info.adc_name);

            // Step 2: Create Bot
            allureReporter.addStep(`[Step2] Create Bot: ${test_object_info.bot_name}`);
            await libraryPage.clickLibraryIcon();
            await libraryAuthoringPage.clickNewDossierIcon();
            await since('The create bot option present should be #{expected}, instead we have #{actual}')
                .expect(await libraryAuthoringPage.isCreateBotOptionPresent())
                .toBe(true);
            await libraryAuthoringPage.clickNewBot2Button();
            await libraryAuthoringPage.selectProjectAndADCAndDataset(bot.project.name, test_object_info.adc_name);
            await botAuthoring.saveBotWithName(test_object_info.bot_name);

            // Step 3: Open Bot to Ask Questions
            allureReporter.addStep(`[Step3] Open Bot: ${test_object_info.bot_name}`);
            await libraryPage.clickLibraryIcon();
            await libraryPage.openSortMenu();
            await libraryPage.selectSortOption('Date Added');
            await libraryPage.waitForLibraryLoading();
            await libraryPage.openBot(test_object_info.bot_name);
            await aibotChatPanel.waitForRecommendationSkeletonDisappear();

            // Step 4: Ask First Question
            allureReporter.addStep(`[Step4] Ask First Question: ${test_object_info.question1}`);
            await aibotChatPanel.askQuestionNoWaitViz(test_object_info.question1);
            await aibotChatPanel.waitForRecommendationSkeletonDisappear();
            if (test_object_info.bot_name.includes('subset_DM') || test_object_info.bot_name.includes('subset_smart_metric')) {
                await since(`Answer should contain one of the expected keywords: ${test_object_info.expect1}`)
                    .expect(await bot2Chat.verifyAnswerContainsOneOfKeywords(test_object_info.expect1))
                    .toBe(true);
            } else {
                await since(`Answer should contain expected keywords:${test_object_info.expect1}`)
                    .expect(await bot2Chat.verifyAnswerContainsKeywords(test_object_info.expect1))
                    .toBe(true);
            }

            // Step 5: Clear History
            allureReporter.addStep(`[Step5] Clear History`);
            await aibotChatPanel.createNewChat();
            await aibotChatPanel.waitForRecommendationSkeletonDisappear();
            await since('Clear history, welcome page present should be #{expected}, while we get #{actual}')
                .expect(await aibotChatPanel.isWelcomePageTitleDisplayed())
                .toBe(true);

            // Step 6: Ask Second Question
            allureReporter.addStep(`[Step6] Ask Second Question: ${test_object_info.question2}`);
            await aibotChatPanel.askQuestionNoWaitViz(test_object_info.question2);
            await aibotChatPanel.waitForRecommendationSkeletonDisappear();
            if (test_object_info.bot_name.includes('subset_DM') || test_object_info.bot_name.includes('subset_smart_metric')) {
                await since(`Answer should contain one of the expected keywords: ${test_object_info.expect2}`)
                    .expect(await bot2Chat.verifyAnswerContainsOneOfKeywords(test_object_info.expect2))
                    .toBe(true);
            } else {
                await since(`Answer should contain expected keywords:${test_object_info.expect2}`)
                    .expect(await bot2Chat.verifyAnswerContainsKeywords(test_object_info.expect2))
                    .toBe(true);
            }

            // Step 7: Update Dataset
            allureReporter.addStep(`[Step7] Update Dataset: ${test_object_info.dataset}`);
            await botConsumptionFrame.clickEditButton();
            await botAuthoring.selectBotConfigTabByName('Data');
            await aibotDatasetPanel.clickUpdateDatasetButton();
            await since('Update dataset from Bot, ADC page present should be #{expected}, instead we have #{actual}')
                .expect(await adc.isADCToolbarPresent())
                .toBe(true);

            // Step 8: Rename Attribute/Metric
            allureReporter.addStep(`[Step8] Rename Attribute/Metric: ${test_object_info.ds_rename_init}`);
            await datasetsPanel.renameObject(test_object_info.ds_rename_init, test_object_info.ds_rename_new);
            await since('Renamed, new name present should be #{expected}, instead we have #{actual}')
                .expect(await datasetsPanel.isAttributeMetricDisplayed(test_object_info.ds_rename_new))
                .toBe(true);

            // Step 9: Create Derived Metric
            allureReporter.addStep(`[Step9] Create Derived Metric: ${test_object_info.ds_DM_metric}`);
            const initDMCount = await datasetsPanel.getElementCountByType('DM');
            await datasetsPanel.rightClickAttributeMetricByName(test_object_info.ds_DM_metric);
            await datasetsPanel.actionOnMenuSubmenu('Aggregate By', 'Sum');
            await since('Create DM, derived metric element count should be #{expected}, instead we have #{actual}')
                .expect(await datasetsPanel.getElementCountByType('DM'))
                .toBe(initDMCount + 1);

            // Save ADC and Check Changes
            await adc.saveChanges();
            await aibotChatPanel.waitForRecommendationSkeletonDisappear();
            await botAuthoring.selectBotConfigTabByName('Data');
            await aibotDatasetPanel.toggleShowDescription();
            await since(
                `Element ${test_object_info.ds_rename_new} present on dataset panel should be #{expected}, while we get #{actual}`
            )
                .expect(await aibotDatasetPanel.isDatasetElementDisplayed(test_object_info.ds_rename_new))
                .toBe(true);
            await since(
                `Element ${test_object_info.ds_DM_newMetric} present on dataset panel should be #{expected}, while we get #{actual}`
            )
                .expect(await aibotDatasetPanel.isDatasetElementDisplayed(test_object_info.ds_DM_newMetric))
                .toBe(true);

            // Step 10: Verify Suggestions
            allureReporter.addStep(`[Step10] Check Related Suggestion`);
            await aibotChatPanel.createNewChat();
            await aibotChatPanel.waitForRecommendationSkeletonDisappear();
            await since('Related suggestions generated should be #{expected}, while we get #{actual}')
                .expect(await aibotChatPanel.isRecommendationByIndexDisplayed(0))
                .toBe(true);
        });
    }
});
