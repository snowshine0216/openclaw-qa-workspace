import { addBotV2ChatByAPI, deleteBotV2ChatByAPI } from '../../../../../api/bot2/chatAPI.js';
import { scrollIntoView } from '../../../../../utils/scroll.js';
import { logger } from '../../logger.js';

/**
 * Create execution context with encapsulated state
 *
 * @param {Object} pageObjects - Browser page objects (from browsers.pageObj1)
 * @param {Object} botConfig - Bot configuration
 * @param {Object} options - Execution options
 * @returns {Object} Execution context API
 */
export function createExecutionContext(pageObjects, botConfig, options) {
    // Encapsulated state - private to this closure
    let currentChatId = null;
    let currentQueryIndex = -1;
    let currentCredential = null;

    const { libraryPage, dossierPage, listView, listViewAGGrid, aibotChatPanel, botConsumptionFrame } = pageObjects;

    /**
     * Run bot and initialize chat session
     *
     * @param {Object} testCase - Test case object (execution.botExecutionTime will be set)
     */
    async function runBot(testCase) {
        logger.debug(`Go to library page to run bot ${botConfig.name}`);
        await libraryPage.openDefaultApp();
        await libraryPage.waitForLibraryLoading();

        currentChatId = null;
        if (options.createChatBeforeTest) {
            logger.debug(`Create chat for bot: ${botConfig.name}`);
            currentChatId = await addBotV2ChatByAPI({
                botId: botConfig.objectId,
                projectId: botConfig.projectId,
                credentials: currentCredential,
            });
        }

        logger.info(`Run bot: ${botConfig.name}`);
        const startTime = Date.now();
        try {
            if (options.executeBotByName) {
                if (await listView.isListViewModeSelected()) {
                    await listViewAGGrid.clickDossierRow(botConfig.name);
                    await dossierPage.waitForDossierLoading();
                } else {
                    await libraryPage.openBot(botConfig.name);
                }
            } else {
                await libraryPage.openBotByIdAndWait({
                    botId: botConfig.objectId,
                    projectId: botConfig.projectId,
                });
            }
            await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePage());
        } catch (error) {
            throw new Error(`Failed to run bot ${botConfig.name}: ${error.message}`);
        }
        const endTime = Date.now();
        const botExecutionTime = endTime - startTime;
        logger.debug(`The execution time of ${botConfig.name} is: ${botExecutionTime} ms`);
        testCase.execution.botExecutionTime = botExecutionTime;
        currentQueryIndex = -1;
    }

    /**
     * Ask a question and track response time
     *
     * @param {string} question - Question to ask
     * @param {boolean} researchMode - Whether to enable research mode
     * @returns {number} Duration in milliseconds, or -1 if timeout
     */
    async function askQuestion(question, researchMode = false) {
        logger.debug(`Asking question: ${question}`);
        let startTime = 0.0;
        let endTime = 0.0;
        const askQuestionRequestMock = await browser.mock('**/api/questions?conversationId=**', { method: 'POST' });

        try {
            // Toggle research mode if needed
            if (researchMode && !(await aibotChatPanel.isResearchEnabled())) {
                logger.debug(`Enabling research mode for question: ${question}`);
                await aibotChatPanel.enableResearch();
            } else if (!researchMode && (await aibotChatPanel.isResearchEnabled())) {
                logger.debug(`Disabling research mode for question: ${question}`);
                await aibotChatPanel.disableResearch();
            }

            if (!currentChatId) {
                await aibotChatPanel.askQuestionAndSend(question);
                startTime = Date.now();
                currentQueryIndex += 1;

                await browser.waitUntil(() => askQuestionRequestMock.calls.length > 0, {
                    timeout: 30000,
                    timeoutMsg: 'No POST /api/questions request found after ask question.',
                });

                const requestBody = askQuestionRequestMock.calls[0].postData;
                if (requestBody) {
                    try {
                        const parsedRequestBody = JSON.parse(requestBody);
                        currentChatId = parsedRequestBody.bots[0]?.chatId || null;
                        if (!currentChatId) {
                            logger.error('No chatId found in the request body.');
                        } else {
                            logger.debug(`Extracted chatId from request body: ${currentChatId}`);
                        }
                    } catch (error) {
                        logger.error('Failed to parse request body:', error);
                    }
                } else {
                    logger.error('Request body is empty or not found.');
                }
            } else {
                await aibotChatPanel.askQuestionAndSend(question);
                startTime = Date.now();
                currentQueryIndex += 1;
            }
        } finally {
            await askQuestionRequestMock.restore();
        }

        // Wait for answer to start streaming
        await aibotChatPanel.waitForElementStaleness(aibotChatPanel.getBubbleLoadingIcon());
        if (await aibotChatPanel.getBubbleLoadingIcon().isDisplayed()) {
            return -1;
        }
        endTime = Date.now();
        return endTime - startTime;
    }

    /**
     * Wait for answer streaming to complete
     *
     * @param {boolean} researchMode - Whether research mode is enabled
     * @returns {boolean} True if completed successfully, false if timeout
     */
    async function waitForAnswerComplete(researchMode = false) {
        logger.debug(`Waiting for the full answer to be rendered...`);
        await aibotChatPanel.waitForElementStaleness(aibotChatPanel.getDisabledNewChatButton());
        if (await aibotChatPanel.getDisabledNewChatButton().isDisplayed()) {
            return false;
        }

        if (researchMode) {
            // In research mode, wait for extra time to ensure answer is fully rendered
            let previousAnswerText = '';
            let answerText = '';
            const maxWaitMs = libraryPage.DEFAULT_LOADING_TIMEOUT;
            const intervalMs = 3000;
            const startTime = Date.now();

            let answerRendered = false;
            while (!answerRendered && Date.now() - startTime <= maxWaitMs) {
                const currentAnswerIndex = await getAnswerIndex();
                const answerTextEL = await aibotChatPanel.getAnswerTextByIndex(currentAnswerIndex);
                answerText = await libraryPage.getInnerText(answerTextEL);
                if (answerText === previousAnswerText && answerText !== '') {
                    answerRendered = true;
                    break;
                }
                previousAnswerText = answerText;
                await browser.pause(intervalMs);
            }
            return answerRendered;
        }

        return true;
    }

    /**
     * Verify the asked question matches expected
     *
     * @param {string} expectedQuestion - Expected question text
     * @param {string} magicPrefix - Magic prefix for AI diagnostics
     * @returns {Object} { success: boolean, actualQuestion: string, quotedText: string }
     */
    async function verifyQuestion(expectedQuestion, magicPrefix = '') {
        const questionEL = await aibotChatPanel.getQueryByIndex(currentQueryIndex);
        await scrollIntoView(questionEL, { block: 'center', inline: 'center' });
        await browser.pause(2000);

        const actualQueryText = (await aibotChatPanel.getQueryTextByIndex(currentQueryIndex)).trim();
        const actualQueryTextWithoutMagicPrefix = actualQueryText.replace(magicPrefix, '');

        return {
            success: actualQueryTextWithoutMagicPrefix.includes(expectedQuestion),
            actualQuestion: actualQueryTextWithoutMagicPrefix,
            expectedQuestion: expectedQuestion,
        };
    }

    /**
     * Verify quoted answer for follow-up questions
     *
     * @param {string} expectedQuotedText - Expected quoted answer text
     * @returns {Object} { success: boolean, actualQuotedText: string }
     */
    async function verifyQuotedAnswer(expectedQuotedText) {
        const quotedStringEL = await aibotChatPanel.getQuotedMessageByQueryIndex(currentQueryIndex);
        const quotedString = (await libraryPage.getInnerText(quotedStringEL)).trim();

        return {
            success: quotedString.includes(expectedQuotedText),
            actualQuotedText: quotedString,
            expectedQuotedText: expectedQuotedText,
        };
    }

    /**
     * Follow up on a previous answer
     *
     * @param {string} answerText - Answer text to follow up on
     */
    async function followUp(answerText) {
        const quotedAnswerTextIndex = await aibotChatPanel.getIndexByAnswerText(answerText);
        if (quotedAnswerTextIndex < 0) {
            throw new Error(`The prerequisite answer text "${answerText}" is not found in the chat.`);
        }
        logger.debug(`Follow up answer by index: ${quotedAnswerTextIndex}`);
        await aibotChatPanel.followUpByIndex(quotedAnswerTextIndex);
    }

    /**
     * Check if bot page is still active
     *
     * @returns {boolean} True if on bot page
     */
    async function isBotPageActive() {
        if (!(await botConsumptionFrame.getBotNameSegmentInToolbar().isDisplayed())) {
            return false;
        }
        const currentBotName = await botConsumptionFrame.getBotName();
        return currentBotName === botConfig.name;
    }

    /**
     * Delete bot chat if necessary
     */
    async function cleanup() {
        if (!currentChatId) {
            logger.warn(`No chat ID found for bot ${botConfig.name}, skipping deletion.`);
            return;
        }
        if (!options.deleteChatAfterTest) {
            logger.debug(`Skip deleting chat after test for bot ${botConfig.name}.`);
            return;
        }

        try {
            logger.debug(`Deleting chat ID '${currentChatId}' for bot: ${botConfig.name}`);
            await deleteBotV2ChatByAPI({
                chatId: currentChatId,
                botId: botConfig.objectId,
                projectId: botConfig.projectId,
                credentials: currentCredential,
            });
        } catch (error) {
            logger.error(`Failed to delete chat for bot ${botConfig.name}: ${error.message}`);
        } finally {
            currentChatId = null;
        }
    }

    /**
     * Set current credential
     */
    function setCredential(credential) {
        currentCredential = credential;
    }

    /**
     * Get current query index
     */
    function getQueryIndex() {
        return currentQueryIndex;
    }

    /**
     * Get current answer index (always based on actual rendered answers)
     * @returns {Promise<number>} Current answer index
     */
    async function getAnswerIndex() {
        const answers = await aibotChatPanel.getAnswers();
        return answers.length - 1;
    }

    /**
     * Get current chat ID
     */
    function getChatId() {
        return currentChatId;
    }

    // Return public API
    return {
        runBot,
        askQuestion,
        waitForAnswerComplete,
        verifyQuestion,
        verifyQuotedAnswer,
        followUp,
        isBotPageActive,
        cleanup,
        setCredential,
        getQueryIndex,
        getAnswerIndex,
        getChatId,
        // Expose page objects for direct access
        pages: pageObjects,
    };
}
