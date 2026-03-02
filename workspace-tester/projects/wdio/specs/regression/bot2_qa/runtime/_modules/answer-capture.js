import os from 'os';
import fs from 'fs';
import path from 'path';
import { saveElementScreenshotLocal } from '../../../../../utils/TakeScreenshot.js';
import { scrollIntoView } from '../../../../../utils/scroll.js';
import { FILES } from './test-config.js';
import { logger } from '../../logger.js';

/**
 * Capture full answer screenshot
 *
 * @param {Object} aibotChatPanel - Page object for chat panel
 * @param {number} answerIndex - Index of the answer
 * @param {string} outputFolder - Folder to save screenshot
 */
export async function captureFullAnswerImage(aibotChatPanel, answerIndex, outputFolder) {
    logger.debug(`Capturing full answer image (answer index: ${answerIndex})`);
    const fullAnswerImagePath = path.resolve(outputFolder, FILES.output.fullAnswerImage.name);
    const fullAnswerEL = await aibotChatPanel.getAnswersByIndex(answerIndex);
    await scrollIntoView(fullAnswerEL, { block: 'start', inline: 'nearest' });
    // Add a 2s pause - in some cases, answer streaming completes but Viz hasn't finished rendering
    await browser.pause(2000);
    await saveElementScreenshotLocal(fullAnswerEL, fullAnswerImagePath);
}

/**
 * Capture answer text
 *
 * @param {Object} aibotChatPanel - Page object for chat panel
 * @param {Object} libraryPage - Page object for library
 * @param {number} answerIndex - Index of the answer
 * @param {string} outputFolder - Folder to save text
 * @param {Object} testCase - Test case object (execution.answerText will be set)
 */
export async function captureAnswerText(aibotChatPanel, libraryPage, answerIndex, outputFolder, testCase) {
    logger.debug(`Capturing answer text (answer index: ${answerIndex})`);
    const answerTextEL = await aibotChatPanel.getAnswerTextByIndex(answerIndex);
    const answerText = await libraryPage.getInnerText(answerTextEL);
    fs.writeFileSync(path.resolve(outputFolder, FILES.output.answerText.name), answerText);
    testCase.execution.answerText = answerText;
}

/**
 * Capture grid markdowns
 *
 * @param {Object} aibotChatPanel - Page object for chat panel
 * @param {number} answerIndex - Index of the answer
 * @param {string} outputFolder - Folder to save markdowns
 * @param {Object} testCase - Test case object (execution.gridMarkdowns will be set)
 */
export async function captureGridMarkdowns(aibotChatPanel, answerIndex, outputFolder, testCase) {
    logger.debug(`Capturing grid markdown (answer index: ${answerIndex})`);
    const gridElementList = await aibotChatPanel.getMultipleGridsByIndex(answerIndex);
    testCase.execution.gridMarkdowns = [];

    for (let i = 0; i < gridElementList.length; i++) {
        const gridMarkdown = await aibotChatPanel.extractAGGridDataToMarkdown(answerIndex, i);
        let outputFileName = null;
        if (gridElementList.length === 1) {
            outputFileName = FILES.output.gridMarkdowns.pattern.replace('{index}', '');
        } else {
            outputFileName = FILES.output.gridMarkdowns.pattern.replace('{index}', i + 1);
        }
        fs.writeFileSync(path.resolve(outputFolder, outputFileName), gridMarkdown);
        testCase.execution.gridMarkdowns.push(gridMarkdown);
    }
}

/**
 * Capture chart images
 *
 * @param {Object} aibotChatPanel - Page object for chat panel
 * @param {number} answerIndex - Index of the answer
 * @param {string} outputFolder - Folder to save images
 * @param {Object} testCase - Test case object (execution.chartImages will be set)
 */
export async function captureChartImages(aibotChatPanel, answerIndex, outputFolder, testCase) {
    logger.debug(`Capturing chart images (answer index: ${answerIndex})`);
    const chartElementList = await aibotChatPanel.getMultipleChartsByIndex(answerIndex);
    testCase.execution.chartImages = [];

    for (let i = 0; i < chartElementList.length; i++) {
        const chartEL = chartElementList[i];
        let outputFileName = null;
        if (chartElementList.length === 1) {
            outputFileName = FILES.output.chartImages.pattern.replace('{index}', '');
        } else {
            outputFileName = FILES.output.chartImages.pattern.replace('{index}', i + 1);
        }
        const chartImagePath = path.resolve(outputFolder, outputFileName);
        await scrollIntoView(chartEL, { block: 'start', inline: 'nearest' });
        await saveElementScreenshotLocal(chartEL, chartImagePath);
        testCase.execution.chartImages.push(chartImagePath);
    }
}

/**
 * Capture insight text
 *
 * @param {Object} aibotChatPanel - Page object for chat panel
 * @param {Object} libraryPage - Page object for library
 * @param {number} answerIndex - Index of the answer
 * @param {string} outputFolder - Folder to save text
 * @param {Object} testCase - Test case object (execution.insightText will be set)
 */
export async function captureInsightText(aibotChatPanel, libraryPage, answerIndex, outputFolder, testCase) {
    logger.debug(`Capturing insight text (answer index: ${answerIndex})`);
    const insightELVisible = await aibotChatPanel.getInsightByIndex(answerIndex).isDisplayed();
    if (insightELVisible) {
        const insightText = await libraryPage.getInnerText(aibotChatPanel.getInsightByIndex(answerIndex));
        fs.writeFileSync(path.resolve(outputFolder, FILES.output.insightText.name), insightText);
        testCase.execution.insightText = insightText;
    }
}

/**
 * Capture unstructured data references
 *
 * @param {Object} aibotChatPanel - Page object for chat panel
 * @param {Object} libraryPage - Page object for library
 * @param {number} answerIndex - Index of the answer
 * @param {string} outputFolder - Folder to save references
 * @param {Object} testCase - Test case object (execution.unstructuredDataReference will be set)
 */
export async function captureUnstructuredDataReferences(
    aibotChatPanel,
    libraryPage,
    answerIndex,
    outputFolder,
    testCase
) {
    logger.debug(`Get unstructured data references (answer index: ${answerIndex})`);
    if (await aibotChatPanel.getUnstructuredDataIndicatorSectionByIndex(answerIndex).isDisplayed()) {
        const allTooltipTexts = [];
        const unstructuredDataReferenceCount = await aibotChatPanel.getUnstructuredDataIndicatorCount(answerIndex);

        for (let i = 0; i < unstructuredDataReferenceCount; i++) {
            await aibotChatPanel.hoverOnUnstructuredDataIndicator(answerIndex, i);
            const tooltipText = await libraryPage.getInnerText(aibotChatPanel.getUnstructuredDataTooltip());
            allTooltipTexts.push(`${i + 1}: ${tooltipText}`);
            logger.debug(`Unstructured Data Reference ${i + 1}: ${tooltipText}`);
        }

        const unstructuredDataReferenceString = allTooltipTexts.join('\n');
        fs.writeFileSync(
            path.resolve(outputFolder, FILES.output.unstructuredDataReference.name),
            unstructuredDataReferenceString
        );
        testCase.execution.unstructuredDataReference = unstructuredDataReferenceString;
    }
}

/**
 * Capture interpretation SQL
 *
 * @param {Object} aibotChatPanel - Page object for chat panel
 * @param {Object} libraryPage - Page object for library
 * @param {number} answerIndex - Index of the answer
 * @param {string} outputFolder - Folder to save SQL
 * @param {Object} testCase - Test case object (execution.interpretationSql will be set)
 */
export async function captureInterpretationSql(aibotChatPanel, libraryPage, answerIndex, outputFolder, testCase) {
    logger.debug(`Get interpretation SQL (answer index: ${answerIndex})`);
    await aibotChatPanel.hoverOnLatestAnswer();

    if (await aibotChatPanel.getInterpretationIconbyIndex(answerIndex).isDisplayed()) {
        logger.debug(`Open interpretation panel`);
        await aibotChatPanel.clickInterpretationbyIndex(answerIndex);

        if (await aibotChatPanel.getInterpretationSwitchBtn(answerIndex).isDisplayed()) {
            logger.debug(`Switching interpretation mode`);
            await aibotChatPanel.clickInterpretationSwitchBtn(answerIndex);
            const interpretationSql = await libraryPage.getInnerText(
                aibotChatPanel.getInterpretationSqlByIndex(answerIndex)
            );
            fs.writeFileSync(path.resolve(outputFolder, FILES.output.interpretationSql.name), interpretationSql);
            testCase.execution.interpretationSql = interpretationSql;
        } else {
            logger.debug(`No interpretation switch button found, skip getting SQL`);
        }

        logger.debug(`Close interpretation panel`);
        await aibotChatPanel.scrollChatPanelToBottom();
        if (await aibotChatPanel.getInterpretationIconbyIndex(answerIndex).isDisplayed()) {
            await aibotChatPanel.clickInterpretationbyIndex(answerIndex);
        }
    }
}

/**
 * Retrieve AI diagnostics if available
 *
 * @param {Object} aibotChatPanel - Page object for chat panel
 * @param {string} botName - Bot name for temp folder
 * @param {number} answerIndex - Index of the answer
 * @param {string} outputFolder - Folder to save diagnostics
 * @param {boolean} hoverFirst - Whether to hover on answer first
 */
export async function retrieveAiDiagnostics(aibotChatPanel, botName, answerIndex, outputFolder, hoverFirst = false) {
    logger.debug(`Retrieving AI diagnostics for answer index ${answerIndex}`);

    if (hoverFirst) {
        await aibotChatPanel.hoverOnLatestAnswer();
        if (
            !(await aibotChatPanel.getAiDiagnosticsButtonByAnswerIndex(answerIndex).isDisplayed()) &&
            (await aibotChatPanel.getToolBarMoreButtonByIndex(answerIndex).isDisplayed())
        ) {
            await aibotChatPanel.clickToolBarMoreButtonByIndex(answerIndex);
        }
    }

    if (await aibotChatPanel.getAiDiagnosticsButtonByAnswerIndex(answerIndex).isDisplayed()) {
        logger.debug(`Trying to retrieve AI diagnostics and save it to ${outputFolder}`);

        // Click the AI diagnostics button to open the dialog
        await aibotChatPanel.clickAiDiagnosticsButtonByAnswerIndex(answerIndex);

        // Create a temporary folder path for downloading the AI diagnostics file
        const tempBasePath = os.tmpdir();
        const uniqueDirName = `${botName}_${Date.now()}`;
        const tempDownloadPath = path.resolve(tempBasePath, uniqueDirName);

        try {
            // Set the download path to the temporary folder
            await browser.cdp('Browser', 'setDownloadBehavior', {
                behavior: 'allow',
                downloadPath: tempDownloadPath,
                eventsEnabled: true,
            });

            // Click export button to download the AI diagnostics file
            await aibotChatPanel.clickAiDiagnosticsDialogExportIcon();
            await browser.pause(1000);

            // Get the json file in the download folder
            const files = fs.readdirSync(tempDownloadPath);
            const fileName = files.find((file) => file.endsWith('.json'));
            if (!fileName) {
                logger.error(`⚠️ No AI diagnostics file found in ${tempDownloadPath}`);
                return;
            }
            const filePath = path.resolve(tempDownloadPath, fileName);

            // Move json file to outputFolder and remove the temporary download folder
            const targetFilePath = path.resolve(outputFolder, FILES.output.aiDiagnostics.name);
            fs.copyFileSync(filePath, targetFilePath);
            logger.debug(`AI diagnostics file saved to: ${targetFilePath}`);
        } finally {
            // Close the AI diagnostics dialog
            if (await aibotChatPanel.getAiDiagnosticsDialogCloseIcon().isDisplayed()) {
                await aibotChatPanel.clickAiDiagnosticsDialogCloseIcon();
            }

            // Reset the download behavior to default
            await browser.cdp('Browser', 'setDownloadBehavior', {
                behavior: 'default',
                eventsEnabled: false,
            });

            // Clean up the temporary download folder
            if (fs.existsSync(tempDownloadPath)) {
                fs.rmSync(tempDownloadPath, { recursive: true, force: true });
            }
        }
    }
}

/**
 * Check for error or clarification in answer
 *
 * @param {Object} aibotChatPanel - Page object for chat panel
 * @param {number} answerIndex - Index of the answer
 * @returns {Object} { hasError: boolean, hasClarification: boolean }
 */
export async function checkAnswerStatus(aibotChatPanel, answerIndex) {
    const hasError = await aibotChatPanel.getErrorMessageByIndex(answerIndex).isDisplayed();
    const hasClarification = await aibotChatPanel.getDidYouMeanPanelByIndex(answerIndex).isDisplayed();

    return {
        hasError,
        hasClarification,
    };
}
