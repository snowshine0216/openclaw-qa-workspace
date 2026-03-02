import path from 'path';
import fs from 'fs-extra';
import request from 'request';
import getServerBuildByName from './getServerBuildByName.js';
import { queryRallyUserByTestCaseId } from '../../utils/rally/rallyUtils.js';
const CURRENT_VERSION_FILE = path.resolve(process.cwd(), 'CurrentVersion.txt');
const PremergeSanityCISuffix = '-.-ai-chatbot-sanity-test';
const PrermgeRegressionCISuffix = '-.-ai-chatbot-regression-test';
// Channel: ENG - Engineering > Alerts Library Validation
const ACAutomationWebhookUrl =
    'https://microstrategy.webhook.office.com/webhookb2/aeafc291-de0c-44f1-ba77-c8854d1353ca@901c038b-4638-4259-b115-c1753c7735aa/IncomingWebhook/79a08503f2e441f6b92dac45c830c4a2/56f852fa-265a-4f48-9620-eaff30c9b61e/V2NULMcwQCI5ccJqms4jhLDu1L6WpWj617e6BZoKK-SFQ1';
const TeamsWebHookUrlOfPremergeChannel = ACAutomationWebhookUrl;
const TeamsWebHookUrlOfRegressionChannel = ACAutomationWebhookUrl;
const TeamsWebHookUrlOfCTCAIService = 'https://prod-185.westus.logic.azure.com:443/workflows/6542aa86fa0f4f23bc0747de6b377ec2/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=GMSieRX_rH8v_PUaefTEgYBPREMCI2M5eAQZAiApbcQ';
const RESULT_STATUS = {
    pass: 'PASS',
    fail: 'FAIL',
};

export default async function collectAutomationResults(options) {
    const clientBuild = fs.readFileSync(CURRENT_VERSION_FILE).toString();
    // const options = {
    //     buildNumber: '',
    //     serverName: 'vi106-2',
    //     postExecutionResults: 'newman1#',
    //     testSuite: 'test wdio',
    //     product: 'Library Web',
    //     team: 'Applications CTC ',
    //     owner: 'Xu,Bin',
    //     enableTeamsMessage: true,
    //     outputFilePath:
    //         '/Users/bxu/Desktop/Jason/Projects/Automation/mstr-kiai/web-dossier/tests/wdio/.test-result/output.json',
    //     buildUrl: 'https://jenkins.internal.microstrategy.com/job/web-dossier-.-m2021-.-ai-chatbot-sanity-test/65/',
    //     ciTag: 'jenkins-ai-chatbot-.-m2021-.-stage-0-schedule-update-489',
    // };

    let serverBuild = options.buildNumber === '' ? '' : options.buildNumber;
    if (!serverBuild) {
        if (!options.serverName && process.env.serverName) {
            options.serverName = process.env.serverName;
        }
        serverBuild = await getServerBuildByName(options.serverName).catch((error) => {
            console.log(`[ERROR] Failed to get server build by ${options.serverName}!!!, error: ${error}`);
        });
    }

    if (String(options.postExecutionResults).trim() !== 'newman1#' || options.tcList || serverBuild === '0.0') {
        console.log(`${'-'.repeat(100)}`);
        console.log(`[INFO] Skip calling collectAutomationResults()`);
        console.log(`   postExecutionResults=${options.postExecutionResults}`);
        console.log(`   tcList=${options.tcList}`);
        console.log(`   serverBuild=${serverBuild}`);
        console.log(`   ciTag=${options.ciTag}`);
        console.log(`${'-'.repeat(100)}`);
        return;
    }
    const result = await getAutomationResult(options);
    result.serverBuild = serverBuild;
    result.buildNumber = clientBuild;
    console.log(`[INFO] Automation data: ${JSON.stringify(result)}`);
    if (options.buildUrl.includes(PremergeSanityCISuffix) && options.enableTeamsMessage) {
        if (!options.ciTag.includes('schedule-update')) {
            console.log(`[INFO] Engineer branch tests, skip post premerge e2e results to Teams channel.`);
            return;
        }
        console.log(`[INFO] Post premerge e2e results to Teams channel <PreMerge for ai-chatbot>.`);
        await postTeamsNotificationToPremergeChanel(result, options);
        return;
    }
    if (options.buildUrl.includes(PrermgeRegressionCISuffix) && options.enableTeamsMessage) {
        console.log(`[INFO] Premerge RegressionCI, skip post premerge e2e results to Teams channel.`);
        return;
    }
    console.log(
        `[INFO] Calling collectAutomationResults() to post automation data to db, parameters: ${JSON.stringify(
            options
        )} `
    );
    if (options.testSuite === 'Bot2_Backend_E2E') {
        await postTeamsNotificationForAIService(result, options);
    }
    await postResultToCTAutomationDB(result);
}

function getRallyTcIdFromTestName(testName) {
    const regex = /TC\d+/;
    const match = testName.match(regex);
    return match ? match[0] : '';
}

function pickTestCaseNameFromSpec(testResults) {
    const pickedFailedCases = testResults.filter((item) => !item.result);
    if (pickedFailedCases.length > 0) {
        return pickedFailedCases.slice(-1).shift().testCaseName;
    } else {
        return testResults.slice(-1).shift().testCaseName;
    }
}

function getMentionUsersItem({ email, owner }) {
    return {
        type: 'mention',
        text: `<at>${owner}</at>`,
        mentioned: {
            id: `${email}`,
            name: `${owner}`,
        },
    };
}

function getTestCaseResultItem({ owner, testCase, url, result }) {
    const isPassed = result === RESULT_STATUS.pass;
    const resultColor = isPassed ? 'Good' : 'Attention';
    const ownerTemplate = isPassed ? '' : `<at>${owner}</at>`;
    return {
        type: 'Container',
        items: [
            {
                type: 'ColumnSet',
                columns: [
                    {
                        type: 'Column',
                        width: 'auto',
                        items: [
                            {
                                type: 'TextBlock',
                                text: `- [${testCase}](${url})`,
                                wrap: true,
                            },
                        ],
                    },
                    {
                        type: 'Column',
                        width: 'auto',
                        items: [
                            {
                                type: 'RichTextBlock',
                                inlines: [
                                    {
                                        type: 'TextRun',
                                        text: `${result}`,
                                        color: `${resultColor}`,
                                    },
                                ],
                                spacing: 'None',
                                horizontalAlignment: 'Center',
                            },
                        ],
                    },
                    {
                        type: 'Column',
                        width: 'stretch',
                        items: [
                            {
                                type: 'TextBlock',
                                text: ownerTemplate,
                                wrap: true,
                            },
                        ],
                    },
                ],
            },
        ],
    };
}

async function getAutomationResult(options) {
    return new Promise((resolve, reject) => {
        const resultData = {
            testSuitName: options.testSuite.replace(/.config/g, '').replace(/.xml/g, ''),
            product: options.product,
            team: options.team,
            owner: options.owner,
            testResults: [],
        };

        if (!fs.existsSync(options.outputFilePath)) {
            reject('Result file not exists!');
        }
        const resultString = fs.readFileSync(options.outputFilePath);
        const obj = JSON.parse(resultString);
        if (!obj || obj.length === 0) {
            reject('Result file is empty!');
        }

        const resultMap = new Map();
        for (let i = 0; i < obj.length; i++) {
            const specObj = obj[i];
            for (let k = 0; k < specObj.testCases.length; k++) {
                const testCaseObj = specObj.testCases[k];
                const elapsedTime = Number(testCaseObj.duration) / 1000;
                const status = testCaseObj.failedSteps === 0;
                const item = {
                    testCaseName: testCaseObj.tcName,
                    passedStep: testCaseObj.passedSteps,
                    failedStep: testCaseObj.failedSteps,
                    passedScreenshotComp: testCaseObj.passedImageCompareSteps,
                    failedScreenshotComp: testCaseObj.failedImageCompareSteps,
                    elapsedTime: elapsedTime.toFixed(1),
                    result: status,
                };
                resultMap.set(item.testCaseName, item);
            }
        }
        resultData.testResults = Array.from(resultMap.values());
        resolve(resultData);
    });
}

async function postResultToCTAutomationDB(resultObject) {
    const options = {
        url: 'http://ctc-android2.labs.microstrategy.com:8088/api/v1/saveAutoData',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        json: resultObject,
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                console.info(`[INFO] Post automation data to CT DB successfully.`);
                resolve(body);
            } else {
                console.error(`Failed to Post automation data to CT DB.`);
                console.error(`Error: ${error}; Status Code: ${response.statusCode}`);
                reject(error);
            }
        });
    });
}

async function postTeamsNotificationToPremergeChanel(resultObject, _options) {
    let totalOfPass = 0;
    let totalOfFail = 0;
    const resultItems = [];
    const mentionUserMap = new Map();
    const ccUsers = [
        { email: 'qiuxu@microstrategy.com', owner: 'Xu, Qiuchen' },
        { email: 'mizhu@microstrategy.com', owner: 'Zhu, Mingzhi' },
    ];
    ccUsers.forEach((user) => {
        mentionUserMap.set(user.email, getMentionUsersItem(user));
    });
    for (let i = 0; i < resultObject.testResults.length; i++) {
        const resultItem = resultObject.testResults[i];
        const tcName = resultItem.testCaseName;
        const rallyTc = getRallyTcIdFromTestName(tcName);
        const { owner, email } = await queryRallyUserByTestCaseId(rallyTc);
        let result = RESULT_STATUS.fail;
        if (resultItem.failedStep === 0 && resultItem.elapsedTime > 0) {
            totalOfPass++;
            result = RESULT_STATUS.pass;
        } else {
            totalOfFail++;
            result = RESULT_STATUS.fail;
            if (!mentionUserMap.has(email)) {
                mentionUserMap.set(email, getMentionUsersItem({ email, owner }));
            }
            const item = getTestCaseResultItem({
                owner,
                testCase: tcName,
                result,
                url: `${_options.buildUrl}allure/`,
            });
            resultItems.push(item);
        }
    }
    const message = {
        type: 'message',
        attachmentLayout: 'builder.AttachmentLayout.list',
        attachments: [
            {
                contentType: 'application/vnd.microsoft.card.adaptive',
                content: {
                    $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
                    type: 'AdaptiveCard',
                    version: '1.3',
                    msteams: {
                        width: 'Full',
                        entities: [...mentionUserMap.values()],
                    },
                    body: [
                        {
                            type: 'RichTextBlock',
                            inlines: [
                                {
                                    type: 'TextRun',
                                    text: `WDIO AI-Chatbot Premerge End to End Test Result Summary`,
                                    weight: 'Bolder',
                                },
                            ],
                        },
                        {
                            type: 'RichTextBlock',
                            inlines: [
                                {
                                    type: 'TextRun',
                                    text: 'Pass: ',
                                },
                                {
                                    type: 'TextRun',
                                    color: 'Good',
                                    text: ` ${totalOfPass}`,
                                },
                                {
                                    type: 'TextRun',
                                    text: '   Fail:',
                                },
                                {
                                    type: 'TextRun',
                                    color: 'Attention',
                                    text: ` ${totalOfFail}`,
                                },
                                {
                                    type: 'TextRun',
                                    text: '   Total:',
                                },
                                {
                                    type: 'TextRun',
                                    text: ` ${totalOfPass + totalOfFail}`,
                                },
                            ],
                        },
                        ...resultItems,
                        {
                            type: 'Container',
                            items: [
                                {
                                    type: 'TextBlock',
                                    text: `[View CI Job](${_options.buildUrl}consoleFull)`,
                                    wrap: true,
                                },
                                {
                                    type: 'TextBlock',
                                    text: `CC <at>Min Yan</at> <at>Yanping Tong</at> <at>Yin Xue</at> <at>Bin (Jason) Xu</at>`,
                                    wrap: true,
                                },
                            ],
                        },
                    ],
                },
            },
        ],
    };

    const options = {
        url: TeamsWebHookUrlOfPremergeChannel,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        json: message,
    };
    await postToTeamsWebHook(options);
}

/**
 *
 * @param {Map} resultObject
 * @param {*} _options
 */
export async function postTeamsNotificationToRegressionChanel(resultObject, _options) {
    let totalOfPass = 0;
    let totalOfFail = 0;
    let totalOfTestsPass = 0;
    let totalOfTestsFail = 0;
    const resultItems = [];
    const mentionUserMap = new Map();
    const ccUsers = [
        { email: 'qiuxu@microstrategy.com', owner: 'Xu, Qiuchen' },
        { email: 'mizhu@microstrategy.com', owner: 'Zhu, Mingzhi' },
    ];
    ccUsers.forEach((user) => {
        mentionUserMap.set(user.email, getMentionUsersItem(user));
    });
    for (const [tsName, testSuiteObj] of Object.entries(resultObject)) {
        let tsTotalOfPass = 0;
        let tsTotalOfFail = 0;
        for (const resultItem of testSuiteObj.testResults) {
            if (resultItem.failedStep === 0 && resultItem.elapsedTime > 0) {
                tsTotalOfPass++;
                totalOfTestsPass++;
                resultItem.result = true;
            } else {
                tsTotalOfFail++;
                totalOfTestsFail++;
                resultItem.result = false;
            }
        }
        const tcName = pickTestCaseNameFromSpec(testSuiteObj.testResults);
        const rallyTc = getRallyTcIdFromTestName(tcName);
        const { owner, email } = await queryRallyUserByTestCaseId(rallyTc);
        let result = RESULT_STATUS.fail;
        if (tsTotalOfFail === 0 && tsTotalOfPass + tsTotalOfFail > 0) {
            totalOfPass++;
            result = RESULT_STATUS.pass;
        } else {
            totalOfFail++;
            result = RESULT_STATUS.fail;
            if (!mentionUserMap.has(email)) {
                mentionUserMap.set(email, getMentionUsersItem({ email, owner }));
            }
            const item = getTestCaseResultItem({
                owner,
                testCase: tsName,
                result,
                url: _options.buildUrl,
                details: { totalOfPass: tsTotalOfPass, totalOfFail: tsTotalOfFail },
            });
            resultItems.push(item);
        }
    }
    const message = {
        type: 'message',
        attachmentLayout: 'builder.AttachmentLayout.list',
        attachments: [
            {
                contentType: 'application/vnd.microsoft.card.adaptive',
                content: {
                    $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
                    type: 'AdaptiveCard',
                    version: '1.3',
                    msteams: {
                        width: 'Full',
                        entities: [...mentionUserMap.values()],
                    },
                    body: [
                        {
                            type: 'RichTextBlock',
                            inlines: [
                                {
                                    type: 'TextRun',
                                    text: `WDIO AI-Chatbot Regression Perbuild Test Result Summary`,
                                    weight: 'Bolder',
                                },
                            ],
                        },
                        {
                            type: 'RichTextBlock',
                            inlines: [
                                {
                                    type: 'TextRun',
                                    text: 'Server Build: ',
                                    weight: 'Bolder',
                                },
                                {
                                    type: 'TextRun',
                                    text: _options.buildNumber,
                                },
                            ],
                        },
                        {
                            type: 'RichTextBlock',
                            inlines: [
                                {
                                    type: 'TextRun',
                                    text: 'Jobs: ',
                                    weight: 'Bolder',
                                },
                                {
                                    type: 'TextRun',
                                    text: 'Pass: ',
                                },
                                {
                                    type: 'TextRun',
                                    color: 'Good',
                                    text: ` ${totalOfPass}`,
                                },
                                {
                                    type: 'TextRun',
                                    text: '   Fail:',
                                },
                                {
                                    type: 'TextRun',
                                    color: 'Attention',
                                    text: ` ${totalOfFail}`,
                                },
                                {
                                    type: 'TextRun',
                                    text: '   Total:',
                                },
                                {
                                    type: 'TextRun',
                                    text: ` ${totalOfPass + totalOfFail}`,
                                },
                            ],
                        },
                        ...resultItems,
                        {
                            type: 'RichTextBlock',
                            inlines: [
                                {
                                    type: 'TextRun',
                                    text: 'Tests: ',
                                    weight: 'Bolder',
                                },
                                {
                                    type: 'TextRun',
                                    text: 'Pass: ',
                                },
                                {
                                    type: 'TextRun',
                                    color: 'Good',
                                    text: ` ${totalOfTestsPass}`,
                                },
                                {
                                    type: 'TextRun',
                                    text: '   Fail:',
                                },
                                {
                                    type: 'TextRun',
                                    color: 'Attention',
                                    text: ` ${totalOfTestsFail}`,
                                },
                                {
                                    type: 'TextRun',
                                    text: '   Total:',
                                },
                                {
                                    type: 'TextRun',
                                    text: ` ${totalOfTestsPass + totalOfTestsFail}`,
                                },
                            ],
                        },
                        {
                            type: 'Container',
                            items: [
                                {
                                    type: 'TextBlock',
                                    text: `[View CI Job](${_options.buildUrl}consoleFull)`,
                                    wrap: true,
                                },
                                {
                                    type: 'TextBlock',
                                    text: `CC <at>Min Yan</at> <at>Yin Xue</at> <at>Bin (Jason) Xu</at> <at>Yanping Tong</at> <at>Zhu Lingping</at> <at>Dong Qingling</at>`,
                                    wrap: true,
                                },
                            ],
                        },
                    ],
                },
            },
        ],
    };

    const options = {
        url: TeamsWebHookUrlOfRegressionChannel,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        json: message,
    };
    await postToTeamsWebHook(options);
}
export async function postTeamsNotificationForAIService(resultObject, _options) {
    let totalOfPass = 0;
    let totalOfFail = 0;
    const mentionUserMap = new Map();
    const ccUsers = [
        { email: 'shxu@microstrategy.com', owner: 'Xu, Shushu' },
        { email: 'xqiao@microstrategy.com', owner: 'Qiao, Xinshu' },
        { email: 'qichen@microstrategy.com', owner: 'Chen, Qiuhong' },
    ];
    ccUsers.forEach((user) => {
        mentionUserMap.set(user.email, getMentionUsersItem(user));
    });

    for (const resultItem of resultObject.testResults) {
        if (resultItem.failedStep === 0 && resultItem.elapsedTime > 0) {
            totalOfPass++;
            resultItem.result = true;
        } else {
            totalOfFail++;
            resultItem.result = false;
        }
    }
    const message = {
        type: 'message',
        attachmentLayout: 'builder.AttachmentLayout.list',
        attachments: [
            {
                contentType: 'application/vnd.microsoft.card.adaptive',
                content: {
                    $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
                    type: 'AdaptiveCard',
                    version: '1.3',
                    msteams: {
                        width: 'Full',
                        entities: [...mentionUserMap.values()],
                    },
                    body: [
                        {
                            type: 'RichTextBlock',
                            inlines: [
                                {
                                    type: 'TextRun',
                                    text: `WDIO AI2-Backend Regression Perbuild Test Result Summary`,
                                    weight: 'Bolder',
                                },
                            ],
                        },
                        {
                            type: 'RichTextBlock',
                            inlines: [
                                {
                                    type: 'TextRun',
                                    text: 'Server Build: ',
                                    weight: 'Bolder',
                                },
                                {
                                    type: 'TextRun',
                                    text: _options.buildNumber,
                                },
                            ],
                        },
                        {
                            type: 'RichTextBlock',
                            inlines: [
                                {
                                    type: 'TextRun',
                                    text: 'Jobs: ',
                                    weight: 'Bolder',
                                },
                                {
                                    type: 'TextRun',
                                    text: 'Pass: ',
                                },
                                {
                                    type: 'TextRun',
                                    color: 'Good',
                                    text: ` ${totalOfPass}`,
                                },
                                {
                                    type: 'TextRun',
                                    text: '   Fail:',
                                },
                                {
                                    type: 'TextRun',
                                    color: 'Attention',
                                    text: ` ${totalOfFail}`,
                                },
                                {
                                    type: 'TextRun',
                                    text: '   Total:',
                                },
                                {
                                    type: 'TextRun',
                                    text: ` ${totalOfPass + totalOfFail}`,
                                },
                            ],
                        },
                        {
                            type: 'Container',
                            items: [
                                {
                                    type: 'TextBlock',
                                    text: `[View CI Job](${_options.buildUrl}/allure)`,
                                    wrap: true,
                                },
                                {
                                    type: 'TextBlock',
                                    text: `CC ${[...mentionUserMap.values()].map((e) => e.text).join(' ')}`,
                                    wrap: true,
                                },
                            ],
                        },
                    ],
                },
            },
        ],
    };
    console.log(
        `[INFO] PostTeamsNotificationForAIService message: ${JSON.stringify(message)} to Teams channel <CTC AI Service>.`
    );
    const options = {
        url: TeamsWebHookUrlOfCTCAIService,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        json: message,
    };
    await postToTeamsWebHook(options);
}
async function postToTeamsWebHook(options) {
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error && (response.statusCode == 200 || response.statusCode == 202)) {
                console.info(`[INFO] Send teams notification successfully.`);
                resolve(body);
            } else {
                console.error(`Failed to send teams notification.`);
                console.error(`Error: ${error}; Status Code: ${response.statusCode}`);
                reject(error);
            }
        });
    });
}
