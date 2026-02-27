import fs from 'fs';
import axios from 'axios';

// put your openAI API key here:
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY is not set.');
    process.exit(1);
}

const OPENAI_API_ENDPOINT =
    'https://mstr-ax-openai-eastus2-4d7ma7a3t3go2.openai.azure.com/openai/deployments/gpt-4.1/chat/completions?api-version=2025-01-01-preview';

const ASSIGN_FAILURE_CATEGORY_GUIDELINE_PROMPT = `
Guidelines for Assigning Failure Categories

Below is a list of valid failure category names, each paired with its explanation.
Your task is to select and output only the category name from this list.
Do not add any punctuation, symbols, explanation, or extra text—just write the category name exactly as shown.

1. Answer
    - Answer data not available - No data is returned in the answer
    - Incorrect answer data format - The correct data is returned in the answer, but the format of the answer data is not same as expectation
    - Incorrect answer data - Data is returned in the answer, but it is incorrect
    - Incorrect answer localization - The answer is not localized correctly, such as using the wrong language
    - Answer needs rephrase - The answer typically responds with "Sorry I could not answer your question, please try to rephrase it" or similar wording
    - No suitable bots to answer question - The answer typically responds with "no suitable bots are available to answer the question" or similar wording
    - Answer not related to question - The answer is not relevant to the question asked
    - Incorrect visualization type - A visualization is present but its type does not match what is expected (for example, a table is returned while a bar chart is expected)
    - Visualization not available - No visualization is returned at all, which means there is no chart, table, or any other visual representation
    - Incorrect visualization data format - The correct data is returned in the visualization, but the format of the data is not same as expectation
    - Incorrect visualization data - The visualization type matches what is expected, but the data is incorrect or misleading
    - Incorrect visualization localization - The visualization is not localized correctly, such as using the wrong language
    - Visualization not related to question - The visualization provided does not address or relate to the actual question being asked
    - Other answer failure - Do not meet any of the above answer categories
2. SQL Statement
    - Incorrect SQL statement - The SQL statement returned is incorrect or does not answer the question
    - SQL statement not available - No SQL statement is returned
    - SQL statement not valid - The returned SQL statement is not valid or cannot be executed
    - Other SQL statement failure - Do not meet any of the above SQL statement categories
3. Insight
    - Insight not available - No insight is returned
    - Insight not related to question - The insight is not relevant to the question asked
    - Insight not related to answer - The insight is not relevant to the answer provided
    - Other insight failure - Do not meet any of the above insight categories
4. Unstructured Data Reference
    - Unstructured data reference not available - No unstructured data references were displayed
    - Incorrect unstructured data reference - Unstructured data references were displayed, but they are incorrect
    - Other unstructured data reference failure - Do not meet any of the above unstructured data reference categories
`;

/**
 * Convert image to Base64 format
 * @param {string} imagePath - Path to the image file
 * @returns {string} - Base64 encoded image
 */
function encodeImage(imagePath) {
    if (!fs.existsSync(imagePath)) {
        console.error(`Error: File not found -> ${imagePath}`);
        return null;
    }
    const imageBuffer = fs.readFileSync(imagePath);
    return imageBuffer.toString('base64');
}

/**
 * Send baseline and actual images to openAI to compare the similarity
 * @param {string} imagePath1 - Path to the first image
 * @param {string} imagePath2 - Path to the second image
 * @returns {Promise<string>} - Similarity score and differences
 */

// For objective questions
export async function analyzeImageWithOpenAI(imagePath1, imagePath2) {
    if (!imagePath1 || !imagePath2) {
        console.error('Error: One or both image paths are undefined.');
        return 'Comparison failed.';
    }

    const imageBase64_1 = encodeImage(imagePath1);
    const imageBase64_2 = encodeImage(imagePath2);

    const prompt = `
    You are an AI that compares two images containing chatbot responses. 
    where the first image is the "baseline" image and the second is the "actual" image. 
    These images may include text, charts, and tables. 
    Your task is to compare the baseline image and the actual image based on their overall meaning and key information, not on exact wording or chart colors.

    Specifically, please:
    1. Evaluate the semantic similarity of the visible text. Ignore any differences that appear only in the "Insights" section or commentary that does not affect factual meaning.
    2. If the user's question explicitly requests a specific visual format (e.g., "create a bar chart", "show as a table", "use a pie chart"), then the actual image must include that same chart or table type shown in the baseline. If the required visual is missing, the answer is considered incomplete and must receive a similarity score below 80%. The missing chart or table must be listed as a key difference.  
    However, if the question does not mention a specific chart type, the actual image may use a different visual format from the baseline, as long as it conveys the same core information.
    3. When comparing charts or tables, focus on the type, key values, labels, and trends — ignore differences in styling or layout. Additional rows or columns in the actual image are acceptable as long as they do not contradict the baseline data.
    4. Extra information in the actual response is acceptable and encouraged if it adds non-conflicting detail or context. Providing examples, comparisons, or elaboration does not count as a meaningful difference. If all required facts from the baseline are included and only extended with related context, consider the responses semantically equivalent and assign a high similarity score (≥ 90%).
    5. If the baseline and actual images contain numeric answers to quantitative questions (e.g., totals, percentages, or counts), and the values differ beyond a rounding tolerance (±0.1%), this is a critical mismatch. If the number is central to the answer (e.g., total revenue, number of streams), reduce the similarity score significantly (e.g., < 80%) and list it as a major difference.

    If the similarity score is less than 80%, please follow the guideline below to select only the one category that most accurately describes the issue:
    ${ASSIGN_FAILURE_CATEGORY_GUIDELINE_PROMPT}

    Return your analysis in the following structured format:
    - Similarity Score: [a percentage, e.g., 95%]
    - Differences: [a brief list of key differences in meaning and data, excluding any differences that occur solely in the Insights section; if there are no significant differences outside of the Insights section, return "None"]
    - Failure Category: [the only one category, or "null" (without quotes) if the [Similarity Score] is greater or equal to 80%]

    Do not include any extraneous text.

    `;

    const payload = {
        model: 'gpt-4o',
        messages: [
            {
                role: 'user',
                content: [
                    { type: 'text', text: prompt },
                    { type: 'image_url', image_url: { url: `data:image/png;base64,${imageBase64_1}` } },
                    { type: 'image_url', image_url: { url: `data:image/png;base64,${imageBase64_2}` } },
                ],
            },
        ],
        max_tokens: 1000,
    };

    try {
        // const response = await axios.post("https://api.openai.com/v1/chat/completions", payload, {
        const response = await axios.post(OPENAI_API_ENDPOINT, payload, {
            headers: {
                Authorization: `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        console.log('✅ OpenAI Response:', response.data.choices[0].message.content);
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('❌ Error comparing images with OpenAI:', error.response ? error.response.data : error.message);
        return 'Comparison failed.';
    }
}

/**
 * Extract the "Differences" section from the OpenAI response
 * @param {string} responseText - The response text from OpenAI
 * @returns {string} - The extracted differences section
 */
export function extractDifferencesFromAIresponse(responseText) {
    // get text after "- Differences"
    const regex = /- Differences:\s*([\s\S]*?)(?=\n-|\n*$)/i;
    const match = responseText.match(regex);
    if (match && match[1]) {
        const diffText = match[1].trim();
        return diffText.toLowerCase() === 'none' || diffText === '' ? 'None' : diffText;
    }
    return 'None';
}

/**
 * Validate subjective answer
 * @param {string} question - subjective or self questions
 * @param {string} answerImagePath - output image path
 * @returns {string} - yes or no and reasoning
 */
export async function validateSubjectiveAnswer(question, answerImagePath) {
    const imageBase64 = encodeImage(answerImagePath);

    const prompt = `
    You are an AI that evaluates chatbot responses to subjective or creative questions. 
    The user question may ask for opinions, storytelling, or insights that do not have one correct answer.

    You will be given:
    - A user question.
    - An image of the chatbot's response.

    Your task:
    1. Carefully read and understand the user's question.
    2. Analyze the chatbot's response as shown in the image.
    3. Determine whether the response is reasonable and relevant based on the information that might be available in the dataset the chatbot used. 
        - Do NOT evaluate based on real-world correctness. Only assess the answer for internal consistency and logic based on the dataset alone. Disregard any factual inaccuracies about real-world entities.
        - Assume the chatbot only has access to the data from the dataset.
    4. Do NOT penalize the answer for fictional statistics, exaggerated numbers, or fabricated facts, as long as they make sense within the chatbot's dataset.
    5. Ignore any differences that appear only in sections labeled "Insights" or general commentary not affecting the main intent of the answer.

    If the chatbot interprets a subjective or ambiguous question (e.g., “one-hit wonders”) and provides an explanation using dataset-based metrics like valence, energy, or danceability, this is acceptable as long as:
    - The response clearly attempts to connect the metrics to the user's question.
    - The logic behind the interpretation is explained (even if simplistically or approximately).
    - The answer is plausible based on the dataset, even if it's not a textbook definition.

    **Important**: If the response does any of the following, it should be considered NOT reasonable and relevant:
    - It asks the user to clarify their question (e.g., "Did you mean…?").
    - It apologizes or says it cannot provide an answer.
    - It states that no data is available or something went wrong.

    If the similarity score is less than 80%, please follow the guideline below to select only the one category that most accurately describes the issue:
    ${ASSIGN_FAILURE_CATEGORY_GUIDELINE_PROMPT}

    Return your judgment in this exact format:
    - Is the answer reasonable and relevant?: [Yes/No]
    - Reasoning: [Brief explanation why the answer is or isn't reasonable, in one or two sentences]
    - Failure Category: [the only one category, or "null" (without quotes) if the answer is reasonable]
    `;

    const payload = {
        model: 'gpt-4o',
        messages: [
            {
                role: 'user',
                content: [
                    { type: 'text', text: prompt },
                    { type: 'text', text: `User question: ${question}` },
                    { type: 'image_url', image_url: { url: `data:image/png;base64,${imageBase64}` } },
                ],
            },
        ],
        max_tokens: 1000,
    };

    try {
        const response = await axios.post(OPENAI_API_ENDPOINT, payload, {
            headers: {
                Authorization: `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        console.log('✅ Subjective Validation Response:', response.data.choices[0].message.content);
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('❌ Error validating subjective answer:', error.response ? error.response.data : error.message);
        return 'Validation failed.';
    }
}

/**
 * Save differences section by question into a JSON file
 * @param {Object} differences - differences section for each question
 * @param {string} outputFilePath - The location to save JSON file
 */
export async function saveDifferencesToJson(differences, outputFilePath) {
    const jsonString = JSON.stringify(differences, null, 2);
    fs.writeFileSync(outputFilePath, jsonString, 'utf-8');
    console.log(`✅ JSON file with all differences saved to ${outputFilePath}`);
}

export async function keyPointAssessment({ baseline, output, minPassScore, executedBotFullInfo = null }) {
    const { keyPointFilePath } = baseline;
    const {
        answerTextFilePath,
        gridMarkdownFilePathList,
        chartImageFilePathList,
        interpretedSqlFilePath,
        insightTextFilePath,
        unstructuredDataReferenceFilePath,
    } = output;
    const { answerMinPassScore, sqlStatementMinPassScore, insightMinPassScore, unstructuredDataReferenceMinPassScore } =
        minPassScore;

    if (!fs.existsSync(keyPointFilePath)) {
        console.error('Error: Baseline key points is required for assessing key points.');
        return { error: 'Error: Baseline key points is required for assessing key points.' };
    }
    let keyPointText = fs.readFileSync(keyPointFilePath, 'utf-8').trim();

    if (!fs.existsSync(answerTextFilePath)) {
        console.error('Error: Output answer text is required for assessing key points.');
        return { error: 'Error: Output answer text is required for assessing key points.' };
    }
    let answerText = fs.readFileSync(answerTextFilePath, 'utf-8').trim();

    let gridMarkdowns = null;
    if (Array.isArray(gridMarkdownFilePathList)) {
        gridMarkdowns = gridMarkdownFilePathList
            .filter(fs.existsSync)
            .map((filePath) => fs.readFileSync(filePath, 'utf-8').trim());
    }

    let chartImageEncodedStrings = null;
    if (Array.isArray(chartImageFilePathList)) {
        chartImageEncodedStrings = chartImageFilePathList
            .filter(fs.existsSync)
            .map((filePath) => fs.readFileSync(filePath).toString('base64'));
    }

    let sqlStatement = null;
    if (fs.existsSync(interpretedSqlFilePath)) {
        sqlStatement = fs.readFileSync(interpretedSqlFilePath, 'utf-8').trim();
    }

    let insightText = null;
    if (fs.existsSync(insightTextFilePath)) {
        insightText = fs.readFileSync(insightTextFilePath, 'utf-8').trim();
    }

    let unstructuredDataReference = null;
    if (fs.existsSync(unstructuredDataReferenceFilePath)) {
        unstructuredDataReference = fs.readFileSync(unstructuredDataReferenceFilePath, 'utf-8').trim();
    }

    if (
        !answerMinPassScore ||
        !sqlStatementMinPassScore ||
        !insightMinPassScore ||
        !unstructuredDataReferenceMinPassScore
    ) {
        console.error(
            'Error: Minimum passing scores for answer, SQL statement, insight, and unstructured data reference are required for assessing key points.'
        );
        return {
            error: 'Error: Minimum passing scores for answer, SQL statement, insight, and unstructured data reference are required for assessing key points.',
        };
    }

    const prompt = `You are an expert evaluator analyzing content against baseline key points.

═══════════════════════════════════════════════════════════════
🚨 CRITICAL RULE - READ THIS FIRST 🚨
═══════════════════════════════════════════════════════════════

BEFORE evaluating ANY section, you MUST check if that section exists in the baseline key points.

A section EXISTS in baseline ONLY IF:
✅ The section heading (e.g., "# SQL Statement", "# Insight", "# Unstructured Data Reference") is present in the baseline
✅ AND there is at least one requirement listed under that heading

A section DOES NOT EXIST in baseline if:
❌ The section heading is completely absent from the baseline, OR
❌ The section heading exists but has no requirements underneath (empty section)

**IF A SECTION DOES NOT EXIST IN BASELINE:**
→ score: null (not a number, literally null without quotes)
→ reasoning: "This section is not present in the baseline requirements, evaluation not applicable."
→ failureCategory: null
→ DO NOT evaluate this section further

**IF A SECTION EXISTS IN BASELINE:**
→ Proceed to evaluate using the scoring rules below

This rule applies to: sqlStatement, insight, unstructuredDataReference
(Answer section is always required and will always be evaluated)

═══════════════════════════════════════════════════════════════

EXECUTED BOT INFORMATION:
${
    executedBotFullInfo
        ? `- Bot Name: ${executedBotFullInfo.botName}
- Bot Group: ${executedBotFullInfo.botGroupName}
- Bot Variant: ${executedBotFullInfo.botVariantName}`
        : 'Not provided'
}

MINIMUM PASSING SCORES:
- Answer: ${answerMinPassScore}
- SQL Statement: ${sqlStatementMinPassScore}
- Insight: ${insightMinPassScore}
- Unstructured Data Reference: ${unstructuredDataReferenceMinPassScore}

BASELINE FILTERING (if bot info provided):
- Include key points matching the executed bot's name/group/variant
- Include key points with NO bot-related conditions (universal requirements)
- EXCLUDE key points for different bots

SCORING RULES (ONLY for sections that exist in baseline):

1. Output Missing Check:
   - Baseline has requirements but output missing → score: 0

2. Standard Scoring:
   - Required points (marked MUST):
     * All correct → contribute to minimum passing score
     * Any incorrect → max score 0.5
     * Any missing → score 0
   
   - Optional points (marked MAY/MIGHT/COULD):
     * Only counted when all required points are correct
     * Share remaining score (1 - minimum passing score)

KEY POINT TYPES:
- Required: Marked with MUST (essential)
- Optional: Marked with MAY/MIGHT/COULD (supplementary)

EVALUATION EXAMPLES:

Example 1 - Section NOT in baseline:
Baseline:
"""
# Answer
- MUST include customer count
"""
→ For "insight" section: {"reasoning": "This section is not present in the baseline requirements, evaluation not applicable.", "score": null, "failureCategory": null}
→ For "sqlStatement" section: {"reasoning": "This section is not present in the baseline requirements, evaluation not applicable.", "score": null, "failureCategory": null}

Example 2 - Empty section in baseline:
Baseline:
"""
# Insight

# Answer
- MUST include data
"""
→ For "insight" section: {"reasoning": "This section is not present in the baseline requirements, evaluation not applicable.", "score": null, "failureCategory": null}

Example 3 - Section in baseline but output missing:
Baseline:
"""
# Insight
- MUST provide trend analysis
"""
Output: No insight file provided
→ For "insight" section: {"reasoning": "Required content is missing in output", "score": 0, "failureCategory": "Insight not available"}

Example 4 - Section in baseline with correct output:
Baseline:
"""
# SQL Statement
- MUST use correct table names
- MUST include WHERE clause
"""
Output: Correct SQL provided
→ For "sqlStatement" section: {"reasoning": "All requirements met", "score": 1.0, "failureCategory": null}

FAILURE CATEGORIES (only when score < minimum passing score):
${ASSIGN_FAILURE_CATEGORY_GUIDELINE_PROMPT}

OUTPUT FORMAT (strict JSON):
{
  "answer": {
    "reasoning": "...",
    "score": <number between 0-1>,
    "failureCategory": <category name or null>
  },
  "sqlStatement": {
    "reasoning": "This section is not present in the baseline requirements, evaluation not applicable." OR "evaluation result...",
    "score": null OR <number 0-1>,
    "failureCategory": null OR <category name>
  },
  "insight": {
    "reasoning": "This section is not present in the baseline requirements, evaluation not applicable." OR "evaluation result...",
    "score": null OR <number 0-1>,
    "failureCategory": null OR <category name>
  },
  "unstructuredDataReference": {
    "reasoning": "This section is not present in the baseline requirements, evaluation not applicable." OR "evaluation result...",
    "score": null OR <number 0-1>,
    "failureCategory": null OR <category name>
  }
}

JSON FORMATTING RULES:
1. Return ONLY valid JSON, no extra text
2. Use null (without quotes) for null values
3. Use numbers (no quotes) for score values
4. Escape special characters: " → \\", \\n → \\\\n, \\\\ → \\\\\\\\
5. Keep reasoning concise

🚨 FINAL REMINDER: For sqlStatement, insight, and unstructuredDataReference sections - if the section heading does not exist in the baseline or is empty, ALWAYS return score=null with the exact reasoning "This section is not present in the baseline requirements, evaluation not applicable." DO NOT evaluate or score sections that are not in the baseline, even if output is provided.`;

    const messages = [{ role: 'user', content: [{ type: 'text', text: prompt }] }];

    messages[0].content.push(
        { type: 'text', text: `Baseline Key Points:\n${keyPointText}` },
        ...(executedBotFullInfo
            ? [
                  {
                      type: 'text',
                      text: `Executed Bot Information:\n- Bot Name: ${executedBotFullInfo.botName}\n- Bot Group: ${executedBotFullInfo.botGroupName}\n- Bot Variant: ${executedBotFullInfo.botVariantName}`,
                  },
              ]
            : []),
        { type: 'text', text: `Output Answer Text:\n${answerText}` },
        ...(Array.isArray(gridMarkdowns) && gridMarkdowns.length > 0
            ? gridMarkdowns.map((md, idx) => ({
                  type: 'text',
                  text: `Output Grid Markdown ${gridMarkdowns.length > 1 ? ' #' + (idx + 1) : ''}:\n${md}`,
              }))
            : []),
        ...(Array.isArray(chartImageEncodedStrings) && chartImageEncodedStrings.length > 0
            ? chartImageEncodedStrings.flatMap((img, idx) => [
                  {
                      type: 'text',
                      text: `Output Chart Image ${chartImageEncodedStrings.length > 1 ? ' #' + (idx + 1) : ''}:`,
                  },
                  {
                      type: 'image_url',
                      image_url: { url: `data:image/png;base64,${img}` },
                  },
              ])
            : []),
        ...(sqlStatement ? [{ type: 'text', text: `Output SQL Statement:\n ${sqlStatement}` }] : []),
        ...(insightText ? [{ type: 'text', text: `Output Insight Text:\n ${insightText}` }] : []),
        ...(unstructuredDataReference
            ? [{ type: 'text', text: `Output Unstructured Data Reference:\n ${unstructuredDataReference}` }]
            : [])
    );

    const payload = {
        model: 'gpt-4.1',
        messages,
        max_tokens: 1500,
        temperature: 0.1,
        response_format: { type: 'json_object' },
    };

    try {
        const response = await axios.post(OPENAI_API_ENDPOINT, payload, {
            headers: {
                Authorization: `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        const responseText = response.data.choices[0].message.content.trim();
        console.log('✅ OpenAI Response:', responseText);

        try {
            // Direct parse since we're using JSON mode
            const result = JSON.parse(responseText);

            // Validate structure
            const requiredSections = ['answer', 'sqlStatement', 'insight', 'unstructuredDataReference'];
            for (const section of requiredSections) {
                if (!result[section] || typeof result[section] !== 'object') {
                    console.error(`❌ Invalid JSON structure: missing or invalid "${section}" section`);
                    return { error: 'Invalid response structure from OpenAI' };
                }

                // Validate each section has required fields
                const sectionData = result[section];
                if (!('reasoning' in sectionData) || !('score' in sectionData) || !('failureCategory' in sectionData)) {
                    console.error(`❌ Invalid section "${section}": missing required fields`);
                    return { error: `Invalid "${section}" section structure` };
                }
            }

            return result;
        } catch (parseError) {
            console.error('❌ JSON Parse Error:', parseError.message);
            console.error('❌ Response text:', responseText);

            // Fallback: try to extract JSON from response
            const match = responseText.match(/{[\s\S]*}/);
            if (match && match[0]) {
                try {
                    return JSON.parse(match[0]);
                } catch (e) {
                    console.error('❌ Fallback parse also failed');
                }
            }

            return { error: 'Failed to parse JSON response from OpenAI' };
        }
    } catch (error) {
        console.error('❌ Error calling OpenAI API:', error.response ? error.response.data : error.message);
        return { error: 'API call failed' };
    }
}

export async function summarizeTestExecution(testCases, tagName = null, botFullInfo = null) {
    const testCaseResults = testCases.map((testCase) => {
        // Extract bot information from execution.botId using botFullInfo
        let executedBotInfo = null;
        if (testCase.execution?.botId && botFullInfo) {
            const bot = botFullInfo.get(testCase.execution.botId);
            if (bot) {
                executedBotInfo = {
                    name: bot.botName,
                    groupName: bot.botGroupName,
                    variantName: bot.botVariantName,
                };
            }
        }

        return {
            question: testCase.question,
            executedBotInfo: executedBotInfo,
            validationResults: testCase.validation,
        };
    });
    const testCaseResultsString = JSON.stringify(testCaseResults);

    const prompt = `
        You are provided with a JSON object containing multiple test cases.

        Each test case includes a question and several validation dimensions, with attributes such as score, reasoning, and failureCategory (when applicable).
        The test batch is associated with a Test Tag: ${tagName}, which may indicate a business domain, feature group, or customer name.
        If Test Tag is not null, base your entire evaluation in the context of this tag, and reference the relevant business area or customer scenario when discussing strengths and weaknesses.
        If Test Tag is null, provide only an overall assessment without referring to any specific domain, customer, or scenario.

        Instructions:
        1. Judge whether the general test quality in this batch is likely to meet customer expectations, citing aggregate scores, reasoning patterns, and common failureCategories.
        2. Summarize any consistently notable strengths across the cases; mention only those points that are clearly and repeatedly positive for the batch (and, if applicable, for the tag).
        3. Identify major or frequent issues, especially those associated with failureCategory, and focus on problems most likely to impact customer satisfaction—ensuring your discussion is relevant to the Test Tag where applicable.
        4. Present your findings in a streamlined and well-organized fashion, prioritizing key points. Exclude any extra explanation, context, or details beyond your evaluation.

        Test Case Results:
        ${testCaseResultsString}
    `;

    const payload = {
        model: 'gpt-4o',
        messages: [
            {
                role: 'user',
                content: prompt,
            },
        ],
        max_tokens: 1000,
    };

    try {
        const response = await axios.post(OPENAI_API_ENDPOINT, payload, {
            headers: {
                Authorization: `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        console.log('✅ Summarize Execution Response:', response.data.choices[0].message.content);
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('❌ Error summarize execution:', error.response ? error.response.data : error.message);
        return 'Summarize failed.';
    }
}
