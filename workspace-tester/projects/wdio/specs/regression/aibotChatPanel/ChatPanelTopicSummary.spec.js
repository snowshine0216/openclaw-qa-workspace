//npm run regression -- --baseUrl=https://mci-u6btx-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --params.credentials.username=app --params.credentials.password= --params.credentials.webServerUsername=mstr --params.credentials.webServerPassword= --spec 'specs/regression/aibotChatPanel/ChatPanelTopicSummary.spec.js'
import { browserWindow } from '../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { chatPanelUser, conEduProId, botChnUser } from '../../../constants/bot.js';
import compareWithSemanticComparison from '../../../utils/SemanticCompareUtils.js';

describe('AIBotChatPanel Generate Topic Summary', () => {
    const aibots = {
        bot1: {
            id: 'E3D1B3EA7143116763A002B04CBB0BA4',
            name: 'B01_AirlineSample',
        }
    };

    let { loginPage, libraryPage, aibotChatPanel, libraryAuthoringPage, botAuthoring } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await libraryPage.openDefaultApp();
        await loginPage.login(chatPanelUser);
        //Edit bot and clear chat history
        await libraryPage.openBotById({ projectId: conEduProId, botId: aibots.bot1.id });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();        
    });

    // it('[TC93342_1] Check topic summary generation by clicking topic', async () => {        

    //     let elements = await aibotChatPanel.getTopicItemsInChatPanel();
    //     await expect(elements.length).toBe(3);
    //     console.log("Topic count is 3 ");

    //     // save 3 topics' title and description
    //     const topicsTitle = [];
    //     const topicsDescription = [];
    //     for (let i = 0; i < 3; i++) {
    //         topicsTitle.push(await botAuthoring.generalSettings.getTopicsTitleTextByIndex(i));
    //         topicsDescription.push(await botAuthoring.generalSettings.getTopicsDescriptionTextByIndex(i));
    //     }
    //     let topictext = topicsTitle[1]+": "+topicsDescription[1];
    //     console.log("Topic text is: "+topictext);

    //     // click the second topic to generate topic summary
    //     await aibotChatPanel.clickTopicInAIBotByIndex(1);

    //     //wait for the topic summary to display
    //     await aibotChatPanel.waitForTopicAnswerLoading();
    //     await browser.pause(2000);       

    //     //get the questions and answers from the verifyTopicSummary function
    //     const [questions,answers] = await aibotChatPanel.verifyTopicSummary(3);      

    //     let model = "sentence-t5-large";
    //     let strictness = 'simple';
    //     let thresholds = [0.8, 0.8, 0.8];
    //     let inputprompt = "Please accurately evaluate the semantic correlation or similarity between the given topic and the generated question, and only return the evaluation score number.";
    //     let inputprompt2 = "Please accurately evaluate the semantic correlation between the given question and the generated answer, and only return the evaluation score number.";
        
        
    //     //iterate the returned questions and answers
    //     for (let i = 0; i < questions.length && i<answers.length; i++) {
    //         let compare_json = await aibotChatPanel.constructJSON("topic", topictext, "question", questions[i]);

    //         //call the compareSemantic function to compare the topic with the generated question
    //         let res = await compareWithSemanticComparison({compare_json: compare_json, model:model, strictness:strictness, thresholds:thresholds, inputprompt:inputprompt});
    //         //expect the returned result to be 'true'
    //         await expect(res).toBe(true);    
              
    //         let compare_json2= await aibotChatPanel.constructJSON("question", questions[i], "answer", answers[i]);
              
    //         //call the compareSemantic function to compare the generated question with the generated answer
    //         let res2 = await compareWithSemanticComparison({compare_json: compare_json2, model:model, strictness:strictness, thresholds:thresholds, inputprompt:inputprompt2});
    //         //expect the returned result to be 'true'
    //         await expect(res2).toBe(true);
    //     }         
    // });

    it('[TC93342_2] Check dataset metric and attribute object recommendation generation in bot', async () => {
        // open the ask about panel
        await aibotChatPanel.openAskAboutPanel();
        // click the start conversation for metric "On-Time" in the Ask about panel
        await aibotChatPanel.clickStartConversationInAskAboutPanel("On-Time");

        // wait for the recommendation to display
        await aibotChatPanel.getStartConversationRecommendation().waitForExist({ timeout: 60000});

        // Check the recommendation count
        let metricRecommendations = await aibotChatPanel.getAskAboutSuggestedQuestions();
        await expect(metricRecommendations.length).toBe(3); 
        
        //check the retuned recommendation questions, and make sure each question contains the expected keywords 'time' in lowercase or uppercase
        metricRecommendations.forEach((text) => {
            expect(text.toLowerCase()).toContain("time");
        });
        
        // click the start conversation for attribute "Month" in the Ask about panel
        await aibotChatPanel.clickStartConversationInAskAboutPanel("Month");

        // wait for the recommendation to display
        await aibotChatPanel.getStartConversationRecommendation().waitForExist({ timeout: 60000});

        // Check the recommendation count
        let attributeRecommendations = await aibotChatPanel.getAskAboutSuggestedQuestions();
        await expect(attributeRecommendations.length).toBe(3); 
        
         //check the retuned recommendation questions, and make sure each question contains the expected keywords 'Month' in lowercase or uppercase
        attributeRecommendations.forEach((text) => {
            expect(text.toLowerCase()).toContain("month");
    });
        
    });
});
