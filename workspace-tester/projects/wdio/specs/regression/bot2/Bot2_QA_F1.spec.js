import { browserWindow } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import * as bot from '../../../constants/bot2.js';
import { saveElementScreenshotLocal, cleanFileInFolder } from '../../../utils/TakeScreenshot.js';
import { analyzeImageWithOpenAI, extractDifferencesFromAIresponse, saveDifferencesToJson, validateSubjectiveAnswer } from '../../../utils/openAI_bot2validation.js';
import { scrollIntoView } from '../../../utils/scroll.js';
import path from 'path';
import { fileURLToPath } from 'url';
import allureReporter from '@wdio/allure-reporter';
import fs from 'fs';
import { addBotV2ChatByAPI, deleteBotV2ChatByAPI } from '../../../api/bot2/chatAPI.js';

// increase the default timeout for running test
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1800000; // 30 minutes

// npm run regression -- --spec=specs/regression/bot2/Bot2_QA_F1.spec.js --baseUrl=https://tec-l-1280162.labs.microstrategy.com/MicroStrategyLibrary/
describe('Bot 2.0 Q&A validation for F1 bot', () => {
    let { loginPage, libraryPage, botConsumptionFrame, aibotChatPanel, botAuthoring, historyPanel } = browsers.pageObj1;
    let chatId;

    const aibot = {
        id: 'E01FCB5A95C14538AB1962C6C7E72E01',
        name: 'AUTO_QA_F1',
        projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
    };

    const questions = [
        { text: 'How many points did driver ID "1" score in race ID "19"?', type: 'objective'},
        { text: 'How about in race 55?', type: 'objective'},
        { text: 'Comparing nationality and number of race wins, display in table', type: 'objective'},
        { text: 'Change to a bar graph?', type: 'objective'},
        { text: 'Who are the top 5 drivers by wins? Give me their names', type: 'objective'},
        { text: "Tell me some information from each of the top 5 racers' wikipedia pages", type: 'objective'},
        { text: 'In which race did Russian racers score the most points?', type: 'objective'},
        { text: 'What about American racers?', type: 'objective', followUpFrom: 6},
        { text: 'Which country, on average points, produces the best racers?', type: 'objective'},
        { text: 'Rank the years based on the total points of the racers born in that year', type: 'objective'},
        { text: 'Did any racer score more than 0 points in every race they participated in?', type: 'objective'},
        { text: 'Did any driver that participated in every race have points greater than 0?', type: 'objective'},
        { text: 'What are the coolest things that you can tell me about this dataset?', type: 'subjective'},
        { text: 'Which 2 racers are the closest in competition?', type: 'subjective'},
        { text: 'Which young racer is the most successful?', type: 'subjective'},
        // { text: 'Which driver over the age of 40 scored the most points?', type: 'objective'},
        { text: 'Which drivers do you think I should follow?', type: 'subjective'},
        { text: "How does winning a race typically affect a racer's standing in the championship points leaderboard?", type: 'subjective'},
    ];
    
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const baselineImageFolder = path.resolve(__dirname, '../../../bot2_baselineImage/F1');
    const actualImageFolder = path.resolve(__dirname, '../../../bot2_outputImage/F1');
    const differencesByQuestion = {};

    beforeAll(async () => {
        // clean the output image folder
        await cleanFileInFolder(actualImageFolder);
        await setWindowSize(browserWindow);
        await loginPage.login(bot.botUser2);
        await libraryPage.waitForLibraryLoading();
        chatId = await addBotV2ChatByAPI({
            credentials: bot.botUser2,
            projectId: aibot.projectId,
            botId: aibot.id,
        });
        await libraryPage.openBot(aibot.name);
        await botConsumptionFrame.clickEditButton();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePage());
        await botAuthoring.generalSettings.turnOffEnableSuggestion();
        await since('Enable suggestion should be off')
            .expect(await botAuthoring.generalSettings.isEnableSuggestionSwitchOn())
            .toBe(false);
        }
    );

    questions.forEach((questionObj, i) => {
        const { text, type ,followUpFrom} = questionObj;
        const paddedIndex = (i + 1).toString().padStart(2, '0');
        it(`Q${paddedIndex}: ${text}`, async () => {
            console.log(`\n🔎 Processing Question ${i + 1}: ${text}`);

            // ask questions with magic key
            const debugQuestion = `X7Vw50KfC2KdPzGY: ${text}`;

            if (typeof followUpFrom === 'number') {
                await aibotChatPanel.followUpByIndex(followUpFrom);
                await browser.pause(500);
            }
            await aibotChatPanel.askQuestionAndSend(debugQuestion);
            // capture the timestamp after ask question until the answer starts streaming to track Q&A performance
            const startTime = Date.now();

            // verify the question asked
            let questionEL = await aibotChatPanel.getQueryByIndex(i);
            await scrollIntoView(questionEL, { block: 'center', inline: 'center' });
            await browser.pause(2000);
            let actualQueryText = await aibotChatPanel.getQueryTextByIndex(i);
            // remove the ** for auto-complete question before verfication
            let expectedQueryText = debugQuestion.replace(/\*\*(.*?)\*\*/g, '$1');
            await since(`The question sent for Q${i + 1} should be #{expected}, while we get #{actual}`)
                .expect(actualQueryText)
                .toContain(expectedQueryText);

            await aibotChatPanel.waitForElementStaleness(aibotChatPanel.getBubbleLoadingIcon());
            const endTime = Date.now();
            // calculate the Q&A duration
            const durationMs = endTime - startTime;
            const durationSec = (durationMs / 1000).toFixed(2);
            console.log(`\n⏰ Q&A process time for Question ${i + 1}: ${durationSec} seconds`);

            // make sure the full answer is rendered, capture the answer screenshot
            await aibotChatPanel.waitForElementStaleness(aibotChatPanel.getDisabledNewChatButton());
            let screenshotFileName = `Q${i + 1}_actual.png`;
            let screenshotPath = path.resolve(actualImageFolder, screenshotFileName);
            let answerEL = await aibotChatPanel.getAnswersByIndex(i);
            await scrollIntoView(answerEL, { block: 'start', inline: 'nearest' });
            // Add a 2s here. In some cases, the answer streaming completes, but the Viz hasn’t finished rendering yet (retry)
            await browser.pause(2000)
            await saveElementScreenshotLocal(answerEL, screenshotPath);

            // attach actual image to allure report
            allureReporter.addAttachment(
                `Q${i + 1}_actual.png`,
                fs.readFileSync(screenshotPath), 
                'image/png'
            );

            // log Q&A time duration to allure report
            allureReporter.addStep(`⏰ Q${i + 1} Response Time: ${durationSec} seconds`);
            
            if (type === 'objective') {
                // define baseline
                let baselineFileName = `Q${i + 1}.png`;
                let baselineFilePath = path.resolve(baselineImageFolder, baselineFileName);
                console.log(`Comparing Q${i + 1} with baseline image at: ${baselineFilePath}`);

                // attach baseline image to allure report for objective questions
                allureReporter.addAttachment(
                    `Q${i + 1}_baseline.png`,
                    fs.readFileSync(baselineFilePath),
                    'image/png'
                );

                // use openAI to compare answer with baseline, extract the similarity score
                let aiResponseText = await analyzeImageWithOpenAI(baselineFilePath, screenshotPath);
                let similarityMatch = aiResponseText.match(/Similarity Score:\s*(\d+)%/i);
                let similarityScore = similarityMatch ? parseFloat(similarityMatch[1]) / 100 : 0;

                // extract the details
                let differencesText = extractDifferencesFromAIresponse(aiResponseText);
                differencesByQuestion[`Q${i + 1}`] = {
                    question: text,
                    type: "Objective",
                    similarity: similarityScore,
                    differences: differencesText
                };

                // log validation summary to allure report
                allureReporter.addStep(
                    `👉 Q${i + 1} [${type.toUpperCase()}] Validation Summary: similarity ${similarityScore.toFixed(2)} ${similarityScore >= 0.85 ? '✅ PASS' : '❌ FAIL'}`
                );

                allureReporter.addStep(
                    `🔎 Differences: ${differencesText || 'N/A'}`
                );

                // Pass test if similarity is >= 0.80
                await since(`Chatbot response similarity for Q${i + 1} should be >= 0.80, but got #{actual}`)
                .expect(similarityScore)
                .toBeGreaterThanOrEqual(0.80);
            } else {
                // use openAI to validate if the subjective answer is relevant to the question
                let validationRes = await validateSubjectiveAnswer(text, screenshotPath);
                let isReasonableMatch = validationRes.match(/Is the answer reasonable and relevant\?:\s*(Yes|No)/i);
                let isReasonable = isReasonableMatch && isReasonableMatch[1].toLowerCase() === 'yes';

                // AI returns Yes meaning the answer is reasonable
                await since(`Subjective answer for Q${i + 1} should be reasonable`)
                .expect(isReasonable)
                .toBe(true);

                // extract the details
                differencesByQuestion[`Q${i + 1}`] = { 
                    question: text,
                    type: "Subjective",
                    evaluation: isReasonableMatch?.[1] || "Unclear",
                    reasoning: validationRes 
                };
                // log validation summary to allure report
                allureReporter.addStep(`
                    Q${i + 1} [${type.toUpperCase()}] Validation Summary: ${isReasonableMatch?.[1] || 'Unclear'}`
                );
                allureReporter.addStep(`
                    Reasoning: ${validationRes}`
                );
            }
        });
    });

    afterAll(async () => {
        let outputJsonPath = path.resolve(process.cwd(), 'reports', 'bot2_F1_validation.json');
        await saveDifferencesToJson(differencesByQuestion, outputJsonPath);

        const keepChat = process.env.KEEP_CHAT === 'true';
        if (!keepChat && chatId) {
            await deleteBotV2ChatByAPI({
                credentials: bot.botUser2,
                projectId: aibot.projectId,
                botId: aibot.id,
                chatId: chatId,
            });
        } else {
            console.log('Chat will be kept (KEEP_CHAT=true). Skipping deletion.');
        }
    });
});
