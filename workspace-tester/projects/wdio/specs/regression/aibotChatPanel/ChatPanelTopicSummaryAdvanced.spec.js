//npm run regression -- --baseUrl=https://mci-u6btx-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --params.credentials.username=app --params.credentials.password= --params.credentials.webServerUsername=mstr --params.credentials.webServerPassword= --spec 'specs/regression/aibotChatPanel/ChatPanelTopicSummary.spec.js'
import { browserWindow } from '../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { chatPanelUser, botTopici18NUser, botTopicZHCNUser } from '../../../constants/bot.js';
import compareWithSemanticComparison from '../../../utils/SemanticCompareUtils.js';

describe('AIBotChatPanel Generate Topic Summary Advanced', () => {
    const aibots = {
        bot1: {
            projID: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            id: '2E7BC2CEFF410C01676ED48A4D39AE4B',
            name: 'B02_IntelligenceCube',
        },
        bot2: {
            projID: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            id: 'B30BA8CEC04150BB5161A88F45E75C3A',
            name: 'B03_HR_i18N',
        },
        bot3: {
            projID: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            id: '12F4D8F12D461F0AA2F534B81B5EE4F6',
            name: 'B04_TravelExpense_i18N',
        },
        bot4: {
            projID: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            id: '312A8002954F2009D1E6DCA9468D8E26',
            name: 'B05_NoAttr',
        },
        bot5: {
            projID: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            id: '24FF3A3B5B4801FA901403B50AFBC39B',
            name: 'B06_OneAttr',
        },
        bot6: {
            projID: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            id: '64C5DFB64745CF1743668DA9BC9EEF7A',
            name: 'B07_NoMetric',
        },
        bot7: {
            projID: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            id: '0595C4A02348FAD340798DACC5836AAB',
            name: 'B08_OneMetric',
        },
        bot8: {
            projID: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            id: '467C5B7A0D4BD070F457869C7638223C',
            name: 'B09_RegenerateTopic',
        },
        bot9: {
            projID: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            id: '72459A38754A33D759821898B8155436',
            name: 'B010_RefreshRecommandation',
        },
    };

    let { loginPage, libraryPage, aibotChatPanel, libraryAuthoringPage, botAuthoring } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await logoutFromCurrentBrowser();
        await libraryPage.openDefaultApp();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC93342_3] Check topic summary generation by clicking topic based on an intelligence cube', async () => {
        await loginPage.login(chatPanelUser);
        await libraryPage.openBotById({ projectId: aibots.bot1.projID, botId: aibots.bot1.id });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();

        let elements = await aibotChatPanel.getTopicItemsInChatPanel();
        await expect(elements.length).toBe(3);
        console.log('Topic count is 3 ');
        let topicTitle = await botAuthoring.generalSettings.getTopicsTitleTextByIndex(1);
        let topicDescription = await botAuthoring.generalSettings.getTopicsDescriptionTextByIndex(1);
        let topicText = topicTitle + ': ' + topicDescription;
        console.log('The second topic text is: ' + topicText);

        // click the second topic to generate topic summary
        await aibotChatPanel.clickTopicInAIBotByIndex(1);

        //wait for the topic summary to display
        await aibotChatPanel.waitForTopicAnswerLoading();
        await browser.pause(3000);

        //get the questions and answers from the verifyTopicSummary function
        const [questions, answers] = await aibotChatPanel.verifyUncertainTopicSummary(3);
        console.log('questions are: ' + questions);
        console.log('answers are: ' + answers);

        let model = 'sentence-t5-large';
        let strictness = 'simple';
        let thresholds = [0.8, 0.8, 0.8];
        let inputprompt =
            'Please accurately evaluate the semantic correlation or similarity between the given topic and the generated question, and only return the evaluation score number.';
        let inputprompt2 =
            'Please accurately evaluate the semantic correlation between the given question and the generated answer, and only return the evaluation score number.';

        //iterate the returned questions and answers
        for (let i = 0; i < questions.length && i < answers.length; i++) {
            console.log('questions[' + i + ']: ' + questions[i]);
            let compare_json = await aibotChatPanel.constructJSON('topic', topicText, 'question', questions[i]);

            //call the compareSemantic function to compare the topic with the generated question
            let res = await compareWithSemanticComparison({
                compare_json: compare_json,
                model: model,
                strictness: strictness,
                thresholds: thresholds,
                inputprompt: inputprompt,
            });

            console.log('compare topic is:' + res);
            //expect the returned result to be 'true'
            await expect(res).toBe(true);

            console.log('answers[' + i + ']: ' + answers[i]);
            let compare_json2 = await aibotChatPanel.constructJSON('question', questions[i], 'answer', answers[i]);

            //call the compareSemantic function to compare the generated question with the generated answer
            let res2 = await compareWithSemanticComparison({
                compare_json: compare_json2,
                model: model,
                strictness: strictness,
                thresholds: thresholds,
                inputprompt: inputprompt2,
            });

            console.log('compare topic answer is:' + res2);
            //expect the returned result to be 'true'
            await expect(res2).toBe(true);
        }
    });

    it('[TC93342_4] Check dataset metric object recommendation generation in bot based on an intelligence cube', async () => {
        await loginPage.login(chatPanelUser);
        await libraryPage.openBotById({ projectId: aibots.bot1.projID, botId: aibots.bot1.id });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();

        // open the ask about panel
        await aibotChatPanel.openAskAboutPanel();
        // click the start conversation for metric "Profit" in the Ask about panel
        await aibotChatPanel.clickStartConversationInAskAboutPanel('Profit');

        // wait for the recommendation to display
        await aibotChatPanel.getStartConversationRecommendation().waitForExist({ timeout: 60000 });

        // Check the recommendation count
        let retunedRecommendationTexts = await aibotChatPanel.getAskAboutSuggestedQuestions();
        await expect(retunedRecommendationTexts.length).toBe(3);

        //check the retuned recommendation questions, and make sure each question contains the expected keywords 'profit' in lowercase or uppercase
        retunedRecommendationTexts.forEach((text) => {
            expect(text.toLowerCase()).toContain('profit');
        });
    });

    it('[TC93342_5] Check dataset attribute object recommendation generation in bot based on an intelligence cube', async () => {
        await loginPage.login(chatPanelUser);
        await libraryPage.openBotById({ projectId: aibots.bot1.projID, botId: aibots.bot1.id });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();

        // open the ask about panel
        await aibotChatPanel.openAskAboutPanel();
        // click the start conversation for attribute "Month" in the Ask about panel
        await aibotChatPanel.clickStartConversationInAskAboutPanel('Month');

        // wait for the recommendation to display
        await aibotChatPanel.getStartConversationRecommendation().waitForExist({ timeout: 60000 });

        // Check the recommendation count
        let retunedRecommendationTexts = await aibotChatPanel.getAskAboutSuggestedQuestions();
        await expect(retunedRecommendationTexts.length).toBe(3);

        //check the retuned recommendation questions, and make sure each question contains the expected keywords 'Month' in lowercase or uppercase
        retunedRecommendationTexts.forEach((text) => {
            expect(text.toLowerCase()).toContain('month');
        });
    });

    it('[TC93342_6] Check topic summary generated with language zh_CN by clicking topic', async () => {
        await loginPage.login(botTopici18NUser);
        await libraryPage.openBotById({ projectId: aibots.bot2.projID, botId: aibots.bot2.id });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();

        let elements = await aibotChatPanel.getTopicItemsInChatPanel();
        await expect(elements.length).toBe(3);
        console.log('Topic count is 3 ');
        let topicTitle = await botAuthoring.generalSettings.getTopicsTitleTextByIndex(1);
        let topicDescription = await botAuthoring.generalSettings.getTopicsDescriptionTextByIndex(1);
        let topicText = topicTitle + ': ' + topicDescription;
        console.log('The second topic text is: ' + topicText);

        // click the second topic to generate topic summary
        await aibotChatPanel.clickTopicInAIBotByIndex(1);

        //wait for the topic summary to display
        await aibotChatPanel.waitForTopicAnswerLoading();
        await browser.pause(3000);

        //get the questions and answers from the verifyTopicSummary function
        const [questions, answers] = await aibotChatPanel.verifyTopicSummary(2);
        console.log('questions are: ' + questions);
        console.log('answers are: ' + answers);

        let model = 'paraphrase-multilingual-MiniLM-L12-v2';
        let strictness = 'simple';
        let thresholds = [0.8, 0.8, 0.8];
        let inputprompt =
            'Please accurately evaluate the semantic correlation or similarity between the given topic and the generated question, and only return the evaluation score number.';
        let inputprompt2 =
            'Please accurately evaluate the semantic correlation between the given question and the generated answer, and only return the evaluation score number.';

        //iterate the returned questions and answers
        for (let i = 0; i < questions.length && i < answers.length; i++) {
            console.log('questions[' + i + ']: ' + questions[i]);
            let compare_json = await aibotChatPanel.constructJSON('topic', topicText, 'question', questions[i]);

            //call the compareSemantic function to compare the topic with the generated question
            let res = await compareWithSemanticComparison({
                compare_json: compare_json,
                model: model,
                strictness: strictness,
                thresholds: thresholds,
                inputprompt: inputprompt,
            });

            console.log('compare topic is:' + res);
            console.log(res);
            //expect the returned result to be 'true'
            await expect(res).toBe(true);

            console.log('answers[' + i + ']: ' + answers[i]);
            let compare_json2 = await aibotChatPanel.constructJSON('question', questions[i], 'answer', answers[i]);

            //call the compareSemantic function to compare the generated question with the generated answer
            let res2 = await compareWithSemanticComparison({
                compare_json: compare_json2,
                model: model,
                strictness: strictness,
                thresholds: thresholds,
                inputprompt: inputprompt2,
            });

            console.log('compare topic answer is:' + res2);
            console.log(res2);
            //expect the returned result to be 'true'
            await expect(res2).toBe(true);
        }
    });

    it('[TC93342_7] Check dataset metric object recommendation generation in bot with languange setting zh-CN', async () => {
        await loginPage.login(botTopicZHCNUser);
        await libraryPage.openBotById({ projectId: aibots.bot3.projID, botId: aibots.bot3.id });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();

        // open the ask about panel
        await aibotChatPanel.openAskAboutPanel();
        // click the start conversation for metric "教育" in the Ask about panel
        await aibotChatPanel.clickStartConversationInAskAboutPanel('教育');

        // wait for the recommendation to display
        await aibotChatPanel.getStartConversationRecommendation().waitForExist({ timeout: 60000 });

        // Check the recommendation count
        let retunedRecommendationTexts = await aibotChatPanel.getAskAboutSuggestedQuestions();
        await expect(retunedRecommendationTexts.length).toBe(3);

        //check the retuned recommendation questions, and make sure each question contains the expected keywords '教育'
        retunedRecommendationTexts.forEach((text) => {
            expect(text).toContain('教育');
        });
    });

    it('[TC93342_8] Check dataset attribute object recommendation generation in bot with languange setting zh-CN', async () => {
        await loginPage.login(botTopicZHCNUser);
        await libraryPage.openBotById({ projectId: aibots.bot3.projID, botId: aibots.bot3.id });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();

        // open the ask about panel
        await aibotChatPanel.openAskAboutPanel();
        // click the start conversation for attribute "城市" in the Ask about panel
        await aibotChatPanel.clickStartConversationInAskAboutPanel('城市');

        // wait for the recommendation to display
        await aibotChatPanel.getStartConversationRecommendation().waitForExist({ timeout: 60000 });

        // Check the recommendation count
        let retunedRecommendationTexts = await aibotChatPanel.getAskAboutSuggestedQuestions();
        await expect(retunedRecommendationTexts.length).toBe(3);

        //check the retuned recommendation questions, and make sure each question contains the expected keywords '城市'
        retunedRecommendationTexts.forEach((text) => {
            expect(text).toContain('城市');
        });
    });

    it('[TC93342_9] Check topic summary generation by clicking topic with MTDI cube without attribute', async () => {
        await loginPage.login(chatPanelUser);
        await libraryPage.openBotById({ projectId: aibots.bot4.projID, botId: aibots.bot4.id });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();

        let elements = await aibotChatPanel.getTopicItemsInChatPanel();
        await expect(elements.length).toBe(3);
        console.log('Topic count is 3 ');
        let topicTitle = await botAuthoring.generalSettings.getTopicsTitleTextByIndex(1);
        let topicDescription = await botAuthoring.generalSettings.getTopicsDescriptionTextByIndex(1);
        let topicText = topicTitle + ': ' + topicDescription;
        console.log('The second topic text is: ' + topicText);

        // click the first topic to generate topic summary
        await aibotChatPanel.clickTopicInAIBotByIndex(1);

        //wait for the topic summary to display
        await aibotChatPanel.waitForTopicAnswerLoading();
        await browser.pause(3000);

        //get the questions and answers from the verifyTopicSummary function
        const [questions, answers] = await aibotChatPanel.verifyTopicSummary(1);
        console.log('questions are: ' + questions);
        console.log('answers are: ' + answers);

        let model = 'sentence-t5-large';
        let strictness = 'simple';
        let thresholds = [0.8, 0.8, 0.8];
        let inputprompt =
            'Please accurately evaluate the semantic correlation or similarity between the given topic and the generated question, and only return the evaluation score number.';
        let inputprompt2 =
            'Please accurately evaluate the semantic correlation between the given question and the generated answer, and only return the evaluation score number.';

        //iterate the returned questions and answers
        for (let i = 0; i < questions.length && i < answers.length; i++) {
            console.log('questions[' + i + ']: ' + questions[i]);
            let compare_json = await aibotChatPanel.constructJSON('topic', topicText, 'question', questions[i]);

            //call the compareSemantic function to compare the topic with the generated question
            let res = await compareWithSemanticComparison({
                compare_json: compare_json,
                model: model,
                strictness: strictness,
                thresholds: thresholds,
                inputprompt: inputprompt,
            });

            console.log('compare topic is:' + res);
            console.log(res);
            //expect the returned result to be 'true'
            await expect(res).toBe(true);

            console.log('answers[' + i + ']: ' + answers[i]);
            let compare_json2 = await aibotChatPanel.constructJSON('question', questions[i], 'answer', answers[i]);

            //call the compareSemantic function to compare the generated question with the generated answer
            let res2 = await compareWithSemanticComparison({
                compare_json: compare_json2,
                model: model,
                strictness: strictness,
                thresholds: thresholds,
                inputprompt: inputprompt2,
            });

            console.log('compare topic answer is:' + res2);
            console.log(res2);
            //expect the returned result to be 'true'
            await expect(res2).toBe(true);
        }
    });

    // it('[TC93342_10] Check topic summary generation by clicking topic with MTDI cube with one attribute', async () => {
    //     await loginPage.login(chatPanelUser);
    //     await libraryPage.openBotById({ projectId: aibots.bot5.projID, botId: aibots.bot5.id });
    //     await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
    //     await aibotChatPanel.clearHistory();
    //     await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
    //     await libraryAuthoringPage.waitForCurtainDisappear();

    //     let elements = await aibotChatPanel.getTopicItemsInChatPanel();
    //     await expect(elements.length).toBe(3);
    //     console.log('Topic count is 3 ');
    //     let topicTitle = await botAuthoring.generalSettings.getTopicsTitleTextByIndex(2);
    //     let topicDescription = await botAuthoring.generalSettings.getTopicsDescriptionTextByIndex(2);
    //     let topicText = topicTitle + ': ' + topicDescription;
    //     console.log('The third topic text is: ' + topicText);

    //     // click the third topic to generate topic summary
    //     await aibotChatPanel.clickTopicInAIBotByIndex(2);

    //     //wait for the topic summary to display
    //     await aibotChatPanel.waitForTopicAnswerLoading();
    //     await browser.pause(3000);

    //     //get the questions and answers from the verifyTopicSummary function
    //     const [questions, answers] = await aibotChatPanel.verifyUncertainTopicSummary(3);
    //     console.log('questions are: ' + questions);
    //     console.log('answers are: ' + answers);

    //     let model = 'sentence-t5-large';
    //     let strictness = 'simple';
    //     let thresholds = [0.72, 0.72, 0.72];
    //     let inputprompt =
    //         'Please accurately evaluate the semantic correlation or similarity between the given topic and the generated question, and only return the evaluation score number.';
    //     let inputprompt2 =
    //         'Please accurately evaluate the semantic correlation between the given question and the generated answer, and only return the evaluation score number.';

    //     //iterate the returned questions and answers
    //     for (let i = 0; i < questions.length && i < answers.length; i++) {
    //         console.log('questions[' + i + ']: ' + questions[i]);
    //         let compare_json = await aibotChatPanel.constructJSON('topic', topicText, 'question', questions[i]);

    //         //call the compareSemantic function to compare the topic with the generated question
    //         let res = await compareWithSemanticComparison({
    //             compare_json: compare_json,
    //             model: model,
    //             strictness: strictness,
    //             thresholds: thresholds,
    //             inputprompt: inputprompt,
    //         });

    //         console.log('compare topic is:' + res);
    //         console.log(res);
    //         //expect the returned result to be 'true'
    //         await expect(res).toBe(true);

    //         console.log('answers[' + i + ']: ' + answers[i]);
    //         let compare_json2 = await aibotChatPanel.constructJSON('question', questions[i], 'answer', answers[i]);

    //         //call the compareSemantic function to compare the generated question with the generated answer
    //         let res2 = await compareWithSemanticComparison({
    //             compare_json: compare_json2,
    //             model: model,
    //             strictness: strictness,
    //             thresholds: thresholds,
    //             inputprompt: inputprompt2,
    //         });

    //         console.log('compare topic answer is:' + res2);
    //         console.log(res2);
    //         //expect the returned result to be 'true'
    //         await expect(res2).toBe(true);
    //     }
    // });

    it('[TC93342_11] Check dataset metric object recommendation generation in bot with MTDI cube with one attribute', async () => {
        await loginPage.login(chatPanelUser);
        await libraryPage.openBotById({ projectId: aibots.bot5.projID, botId: aibots.bot5.id });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();

        // open the ask about panel
        await aibotChatPanel.openAskAboutPanel();
        // click the start conversation for metric "TOTAL SALES" in the Ask about panel
        await aibotChatPanel.clickStartConversationInAskAboutPanel('TOTAL SALES');

        // wait for the recommendation to display
        await aibotChatPanel.getStartConversationRecommendation().waitForExist({ timeout: 60000 });

        // Check the recommendation count
        let retunedRecommendationTexts = await aibotChatPanel.getAskAboutSuggestedQuestions();
        await expect(retunedRecommendationTexts.length).toBe(3);

        //check the retuned recommendation questions, and make sure each question contains the expected keywords 'TOTAL SALES' in lowercase or uppercase
        retunedRecommendationTexts.forEach((text) => {
            expect(text.toLowerCase()).toContain('total sales');
        });
    });

    it('[TC93342_12] Check dataset attribute object recommendation generation in bot with MTDI cube with one attribute', async () => {
        await loginPage.login(chatPanelUser);
        await libraryPage.openBotById({ projectId: aibots.bot5.projID, botId: aibots.bot5.id });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();

        // open the ask about panel
        await aibotChatPanel.openAskAboutPanel();
        // click the start conversation for attribute "ITEM" in the Ask about panel
        await aibotChatPanel.clickStartConversationInAskAboutPanel('ITEM');

        // wait for the recommendation to display
        await aibotChatPanel.getStartConversationRecommendation().waitForExist({ timeout: 60000 });

        // Check the recommendation count
        let retunedRecommendationTexts = await aibotChatPanel.getAskAboutSuggestedQuestions();
        await expect(retunedRecommendationTexts.length).toBe(3);

        //check the retuned recommendation questions, and make sure each question contains the expected keywords 'ITEM' in lowercase or uppercase
        retunedRecommendationTexts.forEach((text) => {
            expect(text.toLowerCase()).toContain('item');
        });
    });

    it('[TC93342_13] Check dataset attribute object recommendation generation in bot with Intelligence cube without metric', async () => {
        await loginPage.login(chatPanelUser);
        await libraryPage.openBotById({ projectId: aibots.bot6.projID, botId: aibots.bot6.id });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();

        // open the ask about panel
        await aibotChatPanel.openAskAboutPanel();
        // click the start conversation for attribute "Quarter" in the Ask about panel
        await aibotChatPanel.clickStartConversationInAskAboutPanel('Quarter');

        // wait for the recommendation to display
        await aibotChatPanel.getStartConversationRecommendation().waitForExist({ timeout: 60000 });

        // Check the recommendation count
        let retunedRecommendationTexts = await aibotChatPanel.getAskAboutSuggestedQuestions();
        await expect(retunedRecommendationTexts.length).toBe(3);

        //check the retuned recommendation questions, and make sure each question contains the expected keywords 'Quarter' in lowercase or uppercase
        retunedRecommendationTexts.forEach((text) => {
            expect(text.toLowerCase()).toContain('quarter');
        });
    });

    it('[TC93342_14] Check topic summary generation by clicking topic with Intelligence cube with one metric', async () => {
        await loginPage.login(chatPanelUser);
        await libraryPage.openBotById({ projectId: aibots.bot7.projID, botId: aibots.bot7.id });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();

        let elements = await aibotChatPanel.getTopicItemsInChatPanel();
        await expect(elements.length).toBe(3);
        console.log('Topic count is 3 ');
        let topicTitle = await botAuthoring.generalSettings.getTopicsTitleTextByIndex(0);
        let topicDescription = await botAuthoring.generalSettings.getTopicsDescriptionTextByIndex(0);
        let topicText = topicTitle + ': ' + topicDescription;
        console.log('The first topic text is: ' + topicText);

        // click the first topic to generate topic summary
        await aibotChatPanel.clickTopicInAIBotByIndex(0);

        //wait for the topic summary to display
        await aibotChatPanel.waitForTopicAnswerLoading();
        await browser.pause(3000);

        //get the questions and answers from the verifyTopicSummary function
        const [questions, answers] = await aibotChatPanel.verifyUncertainTopicSummary(3);
        console.log('questions are: ' + questions);
        console.log('answers are: ' + answers);

        let model = 'sentence-t5-large';
        let strictness = 'simple';
        let thresholds = [0.8, 0.8, 0.8];
        let inputprompt =
            'Please accurately evaluate the semantic correlation or similarity between the given topic and the generated question, and only return the evaluation score number.';
        let inputprompt2 =
            'Please accurately evaluate the semantic correlation between the given question and the generated answer, and only return the evaluation score number.';

        //iterate the returned questions and answers
        for (let i = 0; i < questions.length && i < answers.length; i++) {
            console.log('questions[' + i + ']: ' + questions[i]);
            let compare_json = await aibotChatPanel.constructJSON('topic', topicText, 'question', questions[i]);

            //call the compareSemantic function to compare the topic with the generated question
            let res = await compareWithSemanticComparison({
                compare_json: compare_json,
                model: model,
                strictness: strictness,
                thresholds: thresholds,
                inputprompt: inputprompt,
            });

            console.log('compare topic is:' + res);
            console.log(res);
            //expect the returned result to be 'true'
            await expect(res).toBe(true);

            console.log('answers[' + i + ']: ' + answers[i]);
            let compare_json2 = await aibotChatPanel.constructJSON('question', questions[i], 'answer', answers[i]);

            //call the compareSemantic function to compare the generated question with the generated answer
            let res2 = await compareWithSemanticComparison({
                compare_json: compare_json2,
                model: model,
                strictness: strictness,
                thresholds: thresholds,
                inputprompt: inputprompt2,
            });

            console.log('compare topic answer is:' + res2);
            console.log(res2);
            //expect the returned result to be 'true'
            await expect(res2).toBe(true);
        }
    });

    it('[TC93342_15] Check dataset metric object recommendation generation in bot with Intelligence cube with one metric', async () => {
        await loginPage.login(chatPanelUser);
        await libraryPage.openBotById({ projectId: aibots.bot7.projID, botId: aibots.bot7.id });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();

        // open the ask about panel
        await aibotChatPanel.openAskAboutPanel();
        // click the start conversation for metric "Cost" in the Ask about panel
        await aibotChatPanel.clickStartConversationInAskAboutPanel('Cost');

        // wait for the recommendation to display
        await aibotChatPanel.getStartConversationRecommendation().waitForExist({ timeout: 60000 });

        // Check the recommendation count
        let retunedRecommendationTexts = await aibotChatPanel.getAskAboutSuggestedQuestions();
        await expect(retunedRecommendationTexts.length).toBe(3);

        //check the retuned recommendation questions, and make sure each question contains the expected keywords 'Cost' in lowercase or uppercase
        retunedRecommendationTexts.forEach((text) => {
            expect(text.toLowerCase()).toContain('cost');
        });
    });

    it('[TC93342_16] Check dataset attribute object recommendation generation in bot with Intelligence cube with one metric', async () => {
        await loginPage.login(chatPanelUser);
        await libraryPage.openBotById({ projectId: aibots.bot7.projID, botId: aibots.bot7.id });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();

        // open the ask about panel
        await aibotChatPanel.openAskAboutPanel();
        // click the start conversation for attribute "Call Center" in the Ask about panel
        await aibotChatPanel.clickStartConversationInAskAboutPanel('Call Center');

        // wait for the recommendation to display
        await aibotChatPanel.getStartConversationRecommendation().waitForExist({ timeout: 60000 });

        // Check the recommendation count
        let retunedRecommendationTexts = await aibotChatPanel.getAskAboutSuggestedQuestions();
        await expect(retunedRecommendationTexts.length).toBe(3);

        //check the retuned recommendation questions, and make sure each question contains the expected keywords 'Call Center' in lowercase or uppercase
        retunedRecommendationTexts.forEach((text) => {
            expect(text.toLowerCase()).toContain('call center');
        });
    });

    it('[TC93342_17] Regenerate topic and check topic summary generation', async () => {
        await loginPage.login(chatPanelUser);
        await libraryPage.openBotById({ projectId: aibots.bot8.projID, botId: aibots.bot8.id });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();

        // open the General tab
        await botAuthoring.selectBotConfigTabByName('General');
        await since('Auto generated topics should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getTopicsCount())
            .toBe(3);

        // click refresh topic button to refresh the first topic
        await botAuthoring.generalSettings.refreshTopics(0);

        await browser.pause(3000);

        // check if the new topic is duplicated with any old topics
        const newTopicTitle = await botAuthoring.generalSettings.getTopicsTitleTextByIndex(0);
        const newTopicDescription = await botAuthoring.generalSettings.getTopicsDescriptionTextByIndex(0);
        const newTopicString = newTopicTitle + ': ' + newTopicDescription;
        console.log('New topic is: ' + newTopicString);

        let elements = await aibotChatPanel.getTopicItemsInChatPanel();
        await expect(elements.length).toBe(3);
        console.log('Topic count is 3 ');

        // click the first topic to generate topic summary
        await aibotChatPanel.clickTopicInAIBotByIndex(0);

        //wait for the topic summary to display
        await aibotChatPanel.waitForTopicAnswerLoading();
        await browser.pause(3000);

        //get the questions and answers from the verifyTopicSummary function
        const [questions, answers] = await aibotChatPanel.verifyTopicSummary(3);
        console.log('questions are: ' + questions);
        console.log('answers are: ' + answers);

        let model = 'sentence-t5-large';
        let strictness = 'simple';
        let thresholds = [0.8, 0.8, 0.8];
        let inputprompt =
            'Please accurately evaluate the semantic correlation or similarity between the given topic and the generated question, and only return the evaluation score number.';
        let inputprompt2 =
            'Please accurately evaluate the semantic correlation between the given question and the generated answer, and only return the evaluation score number.';

        //iterate the returned questions and answers
        for (let i = 0; i < questions.length && i < answers.length; i++) {
            console.log('questions[' + i + ']: ' + questions[i]);
            let compare_json = await aibotChatPanel.constructJSON('topic', newTopicString, 'question', questions[i]);

            //call the compareSemantic function to compare the topic with the generated question
            let res = await compareWithSemanticComparison({
                compare_json: compare_json,
                model: model,
                strictness: strictness,
                thresholds: thresholds,
                inputprompt: inputprompt,
            });

            console.log('compare topic is:' + res);
            console.log(res);
            //expect the returned result to be 'true'
            await expect(res).toBe(true);

            console.log('answers[' + i + ']: ' + answers[i]);
            let compare_json2 = await aibotChatPanel.constructJSON('question', questions[i], 'answer', answers[i]);

            //call the compareSemantic function to compare the generated question with the generated answer
            let res2 = await compareWithSemanticComparison({
                compare_json: compare_json2,
                model: model,
                strictness: strictness,
                thresholds: thresholds,
                inputprompt: inputprompt2,
            });

            console.log('compare topic answer is:' + res2);
            console.log(res2);
            //expect the returned result to be 'true'
            await expect(res2).toBe(true);
        }
    });

    it('[TC93342_18] Regenerate dataset metric object recommendation', async () => {
        await libraryPage.openDefaultApp();
        await loginPage.login(chatPanelUser);
        //Open bot and clear chat history
        await libraryPage.openBotById({ projectId: aibots.bot9.projID, botId: aibots.bot9.id });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();

        // open the ask about panel
        await aibotChatPanel.openAskAboutPanel();
        // click the start conversation for metric "Cost" in the Ask about panel
        await aibotChatPanel.clickStartConversationInAskAboutPanel('Cost');

        // wait for the recommendation to display
        await aibotChatPanel.getStartConversationRecommendation().waitForExist({ timeout: 60000 });

        // Check the recommendation count
        let retunedRecommendationTexts = await aibotChatPanel.getAskAboutSuggestedQuestions();
        await expect(retunedRecommendationTexts.length).toBe(3);

        //check the retuned recommendation questions, and make sure each question contains the expected keywords 'Cost' in lowercase or uppercase
        retunedRecommendationTexts.forEach((text) => {
            expect(text.toLowerCase()).toContain('cost');
        });

        for (let i = 0; i < 3; i++) {
            console.log('Recommendation question is: ' + retunedRecommendationTexts[i]);
        }

        // click the refresh button to regenerate the recommendation
        await aibotChatPanel.clickRefreshRecommendationIcon();

        await browser.pause(3000);

        // Check the recommendation count again
        let newRetunedRecommendationTexts = await aibotChatPanel.getAskAboutSuggestedQuestions();
        await expect(newRetunedRecommendationTexts.length).toBe(3);

        //check the retuned recommendation questions, and make sure each question contains the expected keywords 'Cost' in lowercase or uppercase
        newRetunedRecommendationTexts.forEach((text) => {
            expect(text.toLowerCase()).toContain('cost');
        });

        for (let i = 0; i < 3; i++) {
            console.log('New Recommendation question is: ' + newRetunedRecommendationTexts[i]);
        }

        //check the new recommendation questions are different from the previous ones
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                await since('New recommendation question should be #{expected}, instead we have #{actual}.')
                    .expect(newRetunedRecommendationTexts[i])
                    .not.toBe(retunedRecommendationTexts[j]);
            }
        }
    });

    it('[TC93342_19] Regenerate dataset attribute object recommendation', async () => {
        await libraryPage.openDefaultApp();
        await loginPage.login(chatPanelUser);
        //Open bot and clear chat history
        await libraryPage.openBotById({ projectId: aibots.bot9.projID, botId: aibots.bot9.id });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();

        // open the ask about panel
        await aibotChatPanel.openAskAboutPanel();
        // click the start conversation for attribute "Call Center" in the Ask about panel
        await aibotChatPanel.clickStartConversationInAskAboutPanel('Call Center');

        // wait for the recommendation to display
        await aibotChatPanel.getStartConversationRecommendation().waitForExist({ timeout: 60000 });

        // Check the recommendation count
        let retunedRecommendationTexts = await aibotChatPanel.getAskAboutSuggestedQuestions();
        await expect(retunedRecommendationTexts.length).toBe(3);

        //check the retuned recommendation questions, and make sure each question contains the expected keywords 'Call Center' in lowercase or uppercase
        retunedRecommendationTexts.forEach((text) => {
            expect(text.toLowerCase()).toContain('call center');
        });

        for (let i = 0; i < 3; i++) {
            console.log('Recommendation question is: ' + retunedRecommendationTexts[i]);
        }

        // click the refresh button to regenerate the recommendation
        await aibotChatPanel.clickRefreshRecommendationIcon();

        await browser.pause(3000);

        // Check the recommendation count again
        let newRetunedRecommendationTexts = await aibotChatPanel.getAskAboutSuggestedQuestions();
        await expect(newRetunedRecommendationTexts.length).toBe(3);

        for (let i = 0; i < 3; i++) {
            console.log('New Recommendation question is: ' + newRetunedRecommendationTexts[i]);
        }

        //check the retuned recommendation questions, and make sure each question contains the expected keywords 'Cost' in lowercase or uppercase
        newRetunedRecommendationTexts.forEach((text) => {
            expect(text.toLowerCase()).toContain('call center');
        });

        //check the new recommendation questions are different from the previous ones
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                await since('New recommendation question should be #{expected}, instead we have #{actual}.')
                    .expect(newRetunedRecommendationTexts[i])
                    .not.toBe(retunedRecommendationTexts[j]);
            }
        }
    });
});
