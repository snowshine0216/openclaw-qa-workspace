import { browserWindow } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { autoChatInfo } from '../../../constants/bot2.js';
import { deleteBotV2ChatByAPI } from '../../../api/bot2/chatAPI.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { isFileNotEmpty, getFileSize, deleteFile } from '../../../config/folderManagement.js';
import * as bot from '../../../constants/bot2.js';

describe('Bot 2.0 Basic Q&A Workflow', () => {
    const { loginPage, libraryPage, aibotChatPanel, bot2Chat } = browsers.pageObj1;

    const ageGroupBotInfo = {
        botId: 'C18CCEC320F74505915AAB5B53F2D170',
        projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
    };
    const errorMsgBot = {
        id: '289CF2153C58450FBD5A22BF79B63837',
        name: 'AUTO_ErrorMessage',
        projectId: bot.project_applicationTeam.id,
    };

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(autoChatInfo);
        await libraryPage.waitForLibraryLoading();
    });

    afterEach(async () => {
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    async function openBot(projectId, botId) {
        await deleteBotV2ChatByAPI({
            botId: botId,
            projectId: projectId,
            credentials: { username: autoChatInfo.username, password: autoChatInfo.password },
        });
        await libraryPage.openBotById({ projectId, botId });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();
        await aibotChatPanel.disableResearch();
    }

    it('[TC99002_1] test basic q&a', async () => {
        await openBot(autoChatInfo.projectId, autoChatInfo.botId);
        await aibotChatPanel.askQuestionNoWaitViz('show top 5 airline with most flights delayed');
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();

        const expectedKeywords =
            'Southwest Airlines Co;US Airways Inc;United Air Lines Inc;AirTran Airways Corporation;Delta Air Lines Inc';
        await since(`Answer should contain expected keywords: ${expectedKeywords}`)
            .expect(await bot2Chat.verifyAnswerContainsKeywords(expectedKeywords))
            .toBe(true);

        await since('Insights section should be displayed')
            .expect(await aibotChatPanel.isInsightsSectionDisplayed())
            .toBe(true);

        //clear history
        await aibotChatPanel.clearHistory();

        await aibotChatPanel.askQuestion('show top 5 airline with most flights delayed in grid', true);
        await aibotChatPanel.sleep(1000);
        await since('Grid should be displayed')
            .expect(await aibotChatPanel.getAgGrids().length)
            .toBeGreaterThan(0);

        //clear history
        await aibotChatPanel.clearHistory();

        await aibotChatPanel.askQuestion('show top 5 airline with most flights delayed in bar chart', true);
        await since('Bar chart should be displayed')
            .expect(await aibotChatPanel.getVizBubble().isDisplayed())
            .toBe(true);
    });

    it('[TC99002_2] test cancel question', async () => {
        await openBot(autoChatInfo.projectId, autoChatInfo.botId);
        await aibotChatPanel.sendPrompt('show top 5 airline with most flights delayed');
        await since('Loading answer button should be displayed')
            .expect(await aibotChatPanel.getBubbleLoadingIcon().isDisplayed())
            .toBe(true);
        await browser.pause(1000);
        const mock = await browser.mock('**/api/questions/**', { method: 'delete' });
        await aibotChatPanel.clickBot2CancelLoadingAnswerButton();
        await mock.waitForResponse();
        await since('Loading answer button should be hidden')
            .expect(await aibotChatPanel.getBot2CancelLoadingAnswerButton().isDisplayed())
            .toBe(false);

        // verify the question is cancelled
        const calls = mock.calls;
        await expect(calls[0].statusCode).toBe(204);
    });

    it('[TC99002_3] test clear history', async () => {
        await openBot(autoChatInfo.projectId, autoChatInfo.botId);
        await aibotChatPanel.askQuestionNoWaitViz('show top 5 airline with most flights delayed');
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();

        await since('Insights section should be displayed')
            .expect(await aibotChatPanel.isInsightsSectionDisplayed())
            .toBe(true);

        //clear history
        await aibotChatPanel.clearHistory();

        await since('Welcome page bot message should be displayed')
            .expect(await aibotChatPanel.isWelcomePageMessageDisplayed())
            .toBe(true);
        await since('Welcome page greeting title should be displayed')
            .expect(await aibotChatPanel.isWelcomePageGreetingTitleDisplayed())
            .toBe(true);
    });

    it('[TC99002_4] test no strikethrough in Q&A', async () => {
        await openBot(ageGroupBotInfo.projectId, ageGroupBotInfo.botId);
        await aibotChatPanel.askQuestionNoWaitViz(
            'age range별 "Number of new customers"를 그리드로 시각화해줄 수 있나요?'
        );
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();

        const answerElement = await aibotChatPanel.getAnswerTextByIndex(0);
        const answerText = await libraryPage.getInnerText(answerElement);
        console.log(`Answer is: ${answerText}`);
        await since('Answer text should contain tilde').expect(answerText).toContain('~');
        const answerHTML = await answerElement.getHTML();
        await since('No <del> label should be present').expect(answerHTML).not.toContain('<del>');
    });

    it('[TC99002_5] test enable research', async () => {
        await openBot(autoChatInfo.projectId, autoChatInfo.botId);
        const question = 'top 5 airline with most flights delayed';
        const readyText = 'Your report is ready';
        const file = { name: question, fileType: '.pdf' };
        await deleteFile(file);

        // enable research
        await aibotChatPanel.enableResearch();
        await since('Enable research and research should be active')
            .expect(await aibotChatPanel.isResearchEnabled())
            .toBe(true);
        await aibotChatPanel.askQuestionNoWaitViz(question);
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();

        // report section
        await since('Enable research and Report section should be displayed')
            .expect(await aibotChatPanel.getReportSection().isDisplayed())
            .toBe(true);
        await since('Report ready text should be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getReportReadyText())
            .toContain(readyText);
        await since('Download button present should be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getReportDownloadButton().isDisplayed())
            .toBe(true);
        await takeScreenshotByElement(aibotChatPanel.getReportSection(), 'TC99002_5', 'reportSection');

        // download report
        await aibotChatPanel.clickDownloadPDFReport();
        await browser.pause(3000); // wait for download to finish
        await since(`The pdf file for ${file.name} was downloaded`)
            .expect(await isFileNotEmpty(file))
            .toBe(true);
        await since(`The file size should be greater than #{expected}, instead we have #{actual}`)
            .expect(await getFileSize(file))
            .toBeGreaterThan(0);
        await deleteFile(file);
    });

    it('[TC99002_6] test key driver', async () => {
        await openBot(autoChatInfo.projectId, autoChatInfo.botId);
        const question = 'what are the key factors that drives the flights delayed';
        const expectedKeywords = 'Key Drivers Analysis;Key Terms;Executive Summary';

        // disable research first
        await since('Disable research and research should NOT be active')
            .expect(await aibotChatPanel.isResearchEnabled())
            .toBe(false);
        await aibotChatPanel.askQuestionNoWaitViz(question);
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();
        await since('Disable research and Insights section should be displayed')
            .expect(await aibotChatPanel.isInsightsSectionDisplayed())
            .toBe(true);

        // enable research then
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.enableResearch();
        await since('Enable research and research should be active')
            .expect(await aibotChatPanel.isResearchEnabled())
            .toBe(true);
        await aibotChatPanel.askQuestionNoWaitViz(question);
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();
        await since(`Enable research and Answer should contain expected keywords: ${expectedKeywords}`)
            .expect(await bot2Chat.verifyAnswerContainsOneOfKeywords(expectedKeywords))
            .toBe(true);
        await since('Enable research and Insights section should NOT be displayed')
            .expect(await aibotChatPanel.isInsightsSectionDisplayed())
            .toBe(false);
        await since('Enable research and Download button should be displayed')
            .expect(await aibotChatPanel.getReportDownloadButton().isDisplayed())
            .toBe(true);
    });

    it('[TC99002_7] test Forecast', async () => {
        await openBot(autoChatInfo.projectId, autoChatInfo.botId);

        const question =
            'show the trend line for the number of flights delayed for AirTran Airways Corporation in next 3 years';
        const mockGetDataRequest = await browser.mock('**/api/questions/*/answers/data/*');

        await aibotChatPanel.askQuestionAndSend(question);
        await browser.waitUntil(async () => mockGetDataRequest.calls.length > 0 && mockGetDataRequest.calls[0].body, {
            timeout: 60000,
            timeoutMsg: 'no get data request was captured or response is empty',
        });

        const responseBody = mockGetDataRequest.calls[0].body;
        const chartData = responseBody.charts[0];

        // Verify forecastedData exists
        await since('Chart should contain forecastedData').expect(chartData.forecastedData).toBeDefined();

        // Get the forecasted data for "Total Delayed Flights" or the relevant metric
        const forecastedDataKeys = Object.keys(chartData.forecastedData);
        await since('ForecastedData should have at least one metric')
            .expect(forecastedDataKeys.length)
            .toBeGreaterThan(0);

        const firstMetric = forecastedDataKeys[0];
        const forecastedArray = chartData.forecastedData[firstMetric];

        // Verify forecasted data contains 3 years of data (or adjust based on your requirement)
        await since('Forecasted data should contain 3 years of predictions').expect(forecastedArray.length).toBe(3);

        await since('Forecast viz should be displayed')
            .expect(await aibotChatPanel.getVizBubble().isDisplayed())
            .toBe(true);

        mockGetDataRequest.clear();
    });

    it('[TC99002_8] error handling - show details when answer is "something is wrong"', async () => {
        const question = 'list all the call center';
        const keywords = ['error occurred', 'Please try again', 'dataset'];
        const alert_keywords = 'Sorry; could not answer';
        await openBot(errorMsgBot.projectId, errorMsgBot.id);

        // Q&A
        await aibotChatPanel.askQuestionNoWaitViz(question);
        const errorDisplayed = await aibotChatPanel.isErrorAnswerDisplayedByIndex();
        if (errorDisplayed) {
            console.log('Error message is displayed in Q&A');
            await since('Error message present should be #{expected}, instead we have #{actual}')
                .expect(errorDisplayed)
                .toBe(true);
            await takeScreenshotByElement(aibotChatPanel.getErrorByIndex(), 'TC99002_8', 'errorMessageInQ&A');

            await aibotChatPanel.clickShowErrorDetails();
            const errorMessage = await aibotChatPanel.getErrorDetailedMessage();
            console.log(`Error message is: ${errorMessage}`);
            await since('Error message should contain expected keywords')
                .expect(keywords.some((keyword) => errorMessage.includes(keyword)))
                .toBe(true);
        } else {
            console.log('Alert message is displayed in Q&A');
            await since('Alert message contains keywords should be #{expected}, instead we have #{actual}')
                .expect(await bot2Chat.verifyAnswerContainsOneOfKeywords(alert_keywords))
                .toBe(true);
        }
    });
});
