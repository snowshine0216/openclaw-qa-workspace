import fs from 'fs';
import path from 'path';
import { FILES, getFilesByPattern } from './test-config.js';
import {
    analyzeImageWithOpenAI,
    extractDifferencesFromAIresponse,
    validateSubjectiveAnswer,
    keyPointAssessment,
} from '../../../../../utils/openAI_bot2validation.js';
import { getValidationDimensionInfoByName, botsFullInfo } from '../../db-manager.js';
import { logger } from '../../logger.js';

/**
 * Validate using response image comparison with baseline
 *
 * @param {string} baselineFolder - Folder containing baseline files
 * @param {string} outputFolder - Folder containing output files
 * @param {string} testCaseName - Test case name for logging
 * @returns {Array} Array of validation dimension objects
 */
export async function validateImageComparison(baselineFolder, outputFolder, testCaseName) {
    logger.debug(`Comparing ${testCaseName} with baseline image at: ${baselineFolder}`);

    let score = 0;
    let reasoning = null;
    let failureCategory = null;

    const baselineFullAnswerImagePath = path.resolve(baselineFolder, FILES.baseline.fullAnswerImage.name);
    const fullAnswerImagePath = path.resolve(outputFolder, FILES.output.fullAnswerImage.name);

    if (!fs.existsSync(baselineFullAnswerImagePath)) {
        logger.error(`Baseline image not found: ${baselineFullAnswerImagePath}`);
        score = 0;
        reasoning = 'Baseline not found';
        failureCategory = 'Baseline not found';
    } else {
        const aiResponseText = await analyzeImageWithOpenAI(baselineFullAnswerImagePath, fullAnswerImagePath);
        const similarityMatch = aiResponseText.match(/Similarity Score:\s*(\d+)%/i);
        if (similarityMatch && !isNaN(parseFloat(similarityMatch[1]))) {
            score = parseFloat(similarityMatch[1]) / 100;
            reasoning = extractDifferencesFromAIresponse(aiResponseText);
            const failureCategoryMatch = aiResponseText.match(/Failure Category:\s*(.+)/i);
            failureCategory =
                failureCategoryMatch && failureCategoryMatch[1] !== 'null' ? failureCategoryMatch[1].trim() : null;
        } else {
            logger.error(`Invalid similarity score format from AI for ${testCaseName}!`);
            score = 0;
            reasoning = 'Failed to compare images due to the AI response is invalid';
            failureCategory = 'Image comparison error';
        }
    }

    const minPassScore = getValidationDimensionInfoByName('Overall Baseline Comparison').minPassScore;

    return [
        {
            name: 'Overall Baseline Comparison',
            score: score,
            reasoning: reasoning,
            failureCategory: failureCategory,
            isPass: score >= minPassScore,
        },
    ];
}

/**
 * Validate using subjective AI analysis
 *
 * @param {string} questionText - The question text
 * @param {string} outputFolder - Folder containing output files
 * @param {string} testCaseName - Test case name for logging
 * @returns {Array} Array of validation dimension objects
 */
export async function validateSubjectiveAnalysis(questionText, outputFolder, testCaseName) {
    logger.debug(`Performing subjective analysis for ${testCaseName}`);

    const fullAnswerImagePath = path.resolve(outputFolder, FILES.output.fullAnswerImage.name);

    const aiResponseText = await validateSubjectiveAnswer(questionText, fullAnswerImagePath);

    const evaluationMatch = aiResponseText.match(/Is the answer reasonable and relevant\?:\s*(Yes|No)/i);
    const evaluation = evaluationMatch?.[1] || 'Unclear';
    const evaluationScore = evaluation.toLowerCase() === 'yes' ? 1 : 0;
    const reasoningMatch = aiResponseText.match(/Reasoning:(.+)/i);
    const reasoning = (reasoningMatch && reasoningMatch[1].trim()) || 'No valid reasoning provided by AI';
    const failureCategoryMatch = aiResponseText.match(/Failure Category:\s*(.+)/i);
    const failureCategory =
        failureCategoryMatch && failureCategoryMatch[1] !== 'null' ? failureCategoryMatch[1].trim() : null;

    const minPassScore = getValidationDimensionInfoByName('Overall Subjective AI Analysis').minPassScore;

    return [
        {
            name: 'Overall Subjective AI Analysis',
            score: evaluationScore,
            reasoning: reasoning,
            failureCategory: failureCategory,
            isPass: evaluationScore >= minPassScore,
        },
    ];
}

/**
 * Validate using key point assessment
 *
 * @param {string} baselineFolder - Folder containing baseline files
 * @param {string} outputFolder - Folder containing output files
 * @param {string} testCaseName - Test case name for logging
 * @param {Object|null} executedBotFullInfo - Full information of the bot that executed this test (optional)
 * @returns {Array} Array of validation dimension objects
 */
export async function validateKeyPoints(baselineFolder, outputFolder, testCaseName, executedBotFullInfo = null) {
    logger.debug(`Performing key point assessment for ${testCaseName}`);

    const keyPointFilePath = path.resolve(baselineFolder, FILES.baseline.keyScorePoints.name);

    if (!fs.existsSync(keyPointFilePath)) {
        logger.error(`Key point file not found: ${keyPointFilePath}`);
        return [
            {
                name: 'Answer Key Points',
                score: 0,
                reasoning: 'Baseline not found',
                failureCategory: 'Baseline not found',
                isPass: false,
            },
        ];
    }

    const answerTextFilePath = path.resolve(outputFolder, FILES.output.answerText.name);
    const gridMarkdownFilePathList = getFilesByPattern(outputFolder, FILES.output.gridMarkdowns.pattern, true);
    const chartImageFilePathList = getFilesByPattern(outputFolder, FILES.output.chartImages.pattern, true);
    const interpretedSqlFilePath = path.resolve(outputFolder, FILES.output.interpretationSql.name);
    const insightTextFilePath = path.resolve(outputFolder, FILES.output.insightText.name);
    const unstructuredDataReferenceFilePath = path.resolve(outputFolder, FILES.output.unstructuredDataReference.name);

    const answerMinPassScore = getValidationDimensionInfoByName('Answer Key Points').minPassScore;
    const sqlStatementMinPassScore = getValidationDimensionInfoByName('SQL Statement Key Points').minPassScore;
    const insightMinPassScore = getValidationDimensionInfoByName('Insight Key Points').minPassScore;
    const unstructuredDataReferenceMinPassScore = getValidationDimensionInfoByName(
        'Unstructured Data Reference Key Points'
    ).minPassScore;

    const aiResponse = await keyPointAssessment({
        baseline: { keyPointFilePath },
        output: {
            answerTextFilePath,
            gridMarkdownFilePathList,
            chartImageFilePathList,
            interpretedSqlFilePath,
            insightTextFilePath,
            unstructuredDataReferenceFilePath,
        },
        minPassScore: {
            answerMinPassScore: answerMinPassScore,
            sqlStatementMinPassScore: sqlStatementMinPassScore,
            insightMinPassScore: insightMinPassScore,
            unstructuredDataReferenceMinPassScore: unstructuredDataReferenceMinPassScore,
        },
        executedBotFullInfo: executedBotFullInfo,
    });

    const finalDimensions = [];

    // Answer dimension (always present)
    const answerScore = parseFloat(aiResponse.answer.score);
    if (isNaN(answerScore)) {
        // Handle case where Answer score is not a valid number - AI Evaluation Error
        logger.error(`Invalid Answer score from AI for ${testCaseName}: ${aiResponse.answer.score}`);
        finalDimensions.push({
            name: 'Answer Key Points',
            score: 0,
            reasoning: `Failed to parse Answer score: ${aiResponse.answer.score}. AI response: ${aiResponse.answer.reasoning}`,
            failureCategory: 'AI Evaluation Error',
            isPass: false,
        });
    } else {
        finalDimensions.push({
            name: 'Answer Key Points',
            score: answerScore,
            reasoning: aiResponse.answer.reasoning,
            failureCategory: aiResponse.answer.failureCategory,
            isPass: answerScore >= answerMinPassScore,
        });
    }

    // SQL Statement dimension (optional)
    const sqlStatementScore = parseFloat(aiResponse.sqlStatement.score);
    if (!isNaN(sqlStatementScore) && sqlStatementScore >= 0) {
        finalDimensions.push({
            name: 'SQL Statement Key Points',
            score: sqlStatementScore,
            reasoning: aiResponse.sqlStatement.reasoning,
            failureCategory: aiResponse.sqlStatement.failureCategory,
            isPass: sqlStatementScore >= sqlStatementMinPassScore,
        });
    }

    // Insight dimension (optional)
    const insightScore = parseFloat(aiResponse.insight.score);
    if (!isNaN(insightScore) && insightScore >= 0) {
        finalDimensions.push({
            name: 'Insight Key Points',
            score: insightScore,
            reasoning: aiResponse.insight.reasoning,
            failureCategory: aiResponse.insight.failureCategory,
            isPass: insightScore >= insightMinPassScore,
        });
    }

    // Unstructured Data Reference dimension (optional)
    const unstructuredDataReferenceScore = parseFloat(aiResponse.unstructuredDataReference.score);
    if (!isNaN(unstructuredDataReferenceScore) && unstructuredDataReferenceScore >= 0) {
        finalDimensions.push({
            name: 'Unstructured Data Reference Key Points',
            score: unstructuredDataReferenceScore,
            reasoning: aiResponse.unstructuredDataReference.reasoning,
            failureCategory: aiResponse.unstructuredDataReference.failureCategory,
            isPass: unstructuredDataReferenceScore >= unstructuredDataReferenceMinPassScore,
        });
    }

    return finalDimensions;
}

/**
 * Calculate aggregate score for a validation method
 *
 * @param {string} methodName - Name of the validation method
 * @param {Array} dimensions - Array of dimension objects with scores
 * @returns {number} Aggregate score (0-1)
 */
export function calculateAggregateScore(methodName, dimensions) {
    if (!dimensions || dimensions.length === 0) {
        logger.warn(`No dimensions found for method ${methodName}, returning 0 as aggregate score`);
        return 0;
    }

    // Single dimension - return its score directly
    if (dimensions.length === 1) {
        return dimensions[0].score;
    }

    // Multiple dimensions
    if (methodName === 'Key Point Assessment') {
        const answerDimension = dimensions.find((d) => d.name === 'Answer Key Points');

        if (!answerDimension) {
            logger.warn(`Answer Key Points dimension not found for ${methodName}, using simple average`);
            return dimensions.reduce((sum, d) => sum + d.score, 0) / dimensions.length;
        }

        // Weighted calculation: Answer = 0.8, others split 0.2
        const answerWeight = 0.8;
        const otherDimensions = dimensions.filter((d) => d.name !== 'Answer Key Points');
        const otherWeight = otherDimensions.length > 0 ? 0.2 / otherDimensions.length : 0;

        let aggregateScore = answerDimension.score * answerWeight;
        otherDimensions.forEach((dimension) => {
            aggregateScore += dimension.score * otherWeight;
        });

        return aggregateScore;
    }

    // Fallback: simple average for unknown methods
    logger.warn(`Unknown validation method ${methodName}, using simple average`);
    return dimensions.reduce((sum, d) => sum + d.score, 0) / dimensions.length;
}

/**
 * Perform all validations for a test case
 * Modifies testCase.validation in place
 *
 * @param {Object} testCase - Test case object
 * @param {string} baselineFolder - Folder containing baseline files
 * @param {string} outputFolder - Folder containing output files
 */
export async function performValidation(testCase, baselineFolder, outputFolder) {
    const { validation } = testCase;

    for (const method of validation.methods) {
        const methodName = method.name;
        logger.debug(`🔎 Validating ${testCase.testCaseName} with method: ${methodName}`);

        let finalDimensions = [];

        if (methodName === 'Response Image Comparison') {
            finalDimensions = await validateImageComparison(baselineFolder, outputFolder, testCase.testCaseName);
        } else if (methodName === 'Subjective Analysis By AI') {
            finalDimensions = await validateSubjectiveAnalysis(testCase.question, outputFolder, testCase.testCaseName);
        } else if (methodName === 'Key Point Assessment') {
            // Assemble executed bot full info if available
            let executedBotFullInfo = null;
            const executedBotId = testCase.execution?.botId;
            if (executedBotId && botsFullInfo) {
                executedBotFullInfo = botsFullInfo.get(executedBotId) || null;
            }
            finalDimensions = await validateKeyPoints(
                baselineFolder,
                outputFolder,
                testCase.testCaseName,
                executedBotFullInfo
            );
        }

        if (finalDimensions.length === 0) {
            logger.error(
                `Error occurs when AI analysis for ${testCase.testCaseName} with method ${methodName}, no dimensions generated.`
            );
            continue;
        }

        method.dimensions = finalDimensions;

        // Calculate aggregate score for the method
        method.aggregateScore = calculateAggregateScore(methodName, finalDimensions);
        logger.debug(`📊 Method aggregate score for ${methodName}: ${method.aggregateScore}`);
    }

    // Calculate overall validation aggregate score (average of all methods)
    const methodsWithScores = validation.methods.filter((m) => m.aggregateScore != null);
    if (methodsWithScores.length > 0) {
        validation.aggregateScore =
            methodsWithScores.reduce((sum, m) => sum + m.aggregateScore, 0) / methodsWithScores.length;
        logger.debug(
            `📊 Overall validation aggregate score for ${testCase.testCaseName}: ${validation.aggregateScore}`
        );
    } else {
        validation.aggregateScore = 0;
        logger.warn(
            `No valid method scores found for ${testCase.testCaseName}, setting validation aggregateScore to 0`
        );
    }
}
