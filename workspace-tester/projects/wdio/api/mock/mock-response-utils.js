import getUserInfo from '../getUserInfo.js';
import aiServiceStatus from '../getAiServiceStatus.js';
import getUserQuota from '../getQuota.js';
import getProjectInfo from '../getProjectInfo.js';
import { compareVersion } from '../../utils/version/version-util.js';

const TrialUserType = 2;
const MockUpUTCTimestamp = '2024-12-27T03:59:10.000+0000';

/**
 * Description: Mock response by api to get user info of a trial user.
 * "extType" field in user info object can be:
 *  Normal = 0,
 *  Precreated = 1,
 *  Trial = 2,
 */
export async function mockTrialUser({ user }) {
    const userInfoObj = await getUserInfo({ credentials: user, userId: user.id });
    userInfoObj.extType = TrialUserType;
    const trialUserMock = await browser.mock(`**/api/users/${user.id}`);
    trialUserMock.respond(userInfoObj);
}

export async function mockQuota({ user, max, remaining }) {
    const userQuotaInfo = await getUserQuota({ credentials: user, userId: user.id });
    if (max) userQuotaInfo.questionQuota.max = max;
    if (remaining) userQuotaInfo.questionQuota.remaining = remaining;
    const quotaMock = await browser.mock(`**/api/users/${user.id}/quota`);
    quotaMock.respond(userQuotaInfo);
    console.log(`Mocked user quota: ${JSON.stringify(userQuotaInfo)}`);
}

export async function mockISAiSearchConfiguration({ user, isAiSearchConfigured = false }) {
    const status = await aiServiceStatus({ credentials: user });
    const aiSearchConfiguredMock = await browser.mock(`**/aiservice/status`);
    status.isAiSearchConfigured = isAiSearchConfigured;
    aiSearchConfiguredMock.respond(status);
}

export async function mockLearningResult({ content, contentId = '', nuggetsId = '' }) {
    const learningMock = await browser.mock('**/api/aiservice/chats/learnings');
    const finalContentId = contentId || '175fd1f0-353a-4788-b176-3fe2bfa1d11d';
    const finalNuggetsId = nuggetsId || '172CFBE8DD6346E5B4C17903F2030D55';
    learningMock.respondOnce({ content, contentId: finalContentId, nuggetsId: finalNuggetsId }, { statusCode: 200 });
}

export async function mockLongLearningResult(contentId = '') {
    return mockLearningResult({
        content:
            'When I ask about the performance of flights, I am specifically interested in the performance of flights that were cancelled.',
        contentId: contentId,
    });
}
export async function mockShortLearningResult() {
    return mockLearningResult({
        content: 'I learned something!',
    });
}

export async function mockLearningNone() {
    const learningMock = await browser.mock('**/api/aiservice/chats/learnings');
    learningMock.respondOnce(async ({ body: rawResponse }) => {
        browser.pause(3000);
        const newLocal = {
            content: 'None',
            nuggetsId: '172CFBE8DD6346E5B4C17903F2030D55',
        };
        return newLocal;
    });
}

export async function mockAmbiguousAndFollowUpResponse(ambiguous, followUp, answerText = null) {
    const chatMock = await browser.mock('**/api/aiservice/chats/dossier');
    chatMock.respondOnce(async ({ body: rawResponse }) => {
        let response = parseRawResponse(rawResponse);
        const newLocal = {
            ...response,
            questionAssessment: {
                reason: ambiguous
                    ? 'This question is ambiguous because the term "performance" is not defined in the table schema. It is unclear which metric should be used to measure the performance of the flights.'
                    : '',
                type: ambiguous ? 'ambiguous' : 'precise',
                rawType: ambiguous ? 'ambiguous' : 'precise',
                followUp,
            },
        };
        if (answerText) {
            newLocal.result = answerText;
            newLocal.manipulations = [];
        }
        return newLocal;
    });
    return chatMock;
}

//use respond instead of respondOnce, to make sure multiple round of dossier call can be handled
//After mock finished, please use browser.mockRestoreAll() to restore the mock
export async function mockAllAmbiguousAndFollowUpResponse(ambiguous, followUp, answerText = null) {
    const chatMock = await browser.mock('**/api/aiservice/chats/dossier');
    chatMock.respond(async ({ body: rawResponse }) => {
        let response = parseRawResponse(rawResponse);
        if (response.questionAssessment) {
            const newLocal = {
                ...response,
                questionAssessment: {
                    reason: ambiguous
                        ? 'This question is ambiguous because the term "performance" is not defined in the table schema. It is unclear which metric should be used to measure the performance of the flights.'
                        : '',
                    type: ambiguous ? 'ambiguous' : 'precise',
                    rawType: ambiguous ? 'ambiguous' : 'precise',
                    followUp,
                },
            };
            if (answerText) {
                newLocal.result = answerText;
                newLocal.manipulations = [];
            }
            return newLocal;
        } else {
            return response;
        }
    });
    return chatMock;
}

export async function mockOpenEndedResponse(followUp, alternatives) {
    const chatMock = await browser.mock('**/api/aiservice/chats/dossier');
    chatMock.respondOnce(async ({ body: rawResponse }) => {
        let response = parseRawResponse(rawResponse);
        const newLocal = {
            ...response,
            questionAssessment: {
                reason: 'Resolved to be open ended',
                type: 'open-ended',
                rawType: 'open-ended',
                followUp,
            },
            result: `I'm still working hard to find out the answer. Please wait a moment...`,
            alternatives: alternatives,
        };
        return newLocal;
    });
    return chatMock;
}

export async function mockAnswerError() {
    const chatMock = await browser.mock('**/api/aiservice/chats/dossier');
    chatMock.respondOnce(async () => {
        return {
            // StatusType.noData
            status: 1102,
        };
    });
    return chatMock;
}

export async function mockAmbiguousAndFollowUpResponseAIBot(ambiguous, followUp, reason, answerText = null) {
    const chatMock = await browser.mock('**/api/aiservice/chats/dossier');
    chatMock.respond(async ({ body: rawResponse }) => {
        let response = parseRawResponse(rawResponse);
        if (response.questionAssessment) {
            const newLocal = {
                ...response,
                questionAssessment: {
                    reason: ambiguous ? reason : '',
                    type: ambiguous ? 'ambiguous' : 'precise',
                    rawType: ambiguous ? 'ambiguous' : 'precise',
                    followUp,
                },
            };
            if (answerText) {
                newLocal.result = answerText;
                newLocal.manipulations = [];
            }
            return newLocal;
        } else {
            return response;
        }
    });
    return chatMock;
}

export async function mockInterpretationContents(result) {
    const chatMock = await browser.mock('**/api/aiservice/chats/interpretation');
    chatMock.respond(async ({ body: rawResponse }) => {
        let response = parseRawResponse(rawResponse);
        const newLocal = {
            ...response,
            interpretedAs: {
                result: result,
                nuggetsCollections: [],
                extras: {},
            },
            components: {
                sql: '\nSELECT `Country@ID`, SUM(`From Coal`) as `Highest CO2 Emissions from Coal` \nFROM `9.3 Custom theme` \nGROUP BY `Country@ID` \nORDER BY `Highest CO2 Emissions from Coal` DESC \nLIMIT 1;\n',
                templates: [
                    {
                        attributes: [
                            {
                                id: '4AE32A4B9346CE0407CE46894D13C4C2',
                                name: 'Country',
                                zoneIds: [],
                            },
                        ],
                        metrics: [
                            {
                                id: '33EF6F8A5143BB89059257A92B68B685',
                                name: 'From Coal',
                                zoneIds: [],
                                sort: 'desc',
                            },
                        ],
                        derivedAttributes: [],
                        derivedMetrics: [],
                        viewFilter: {},
                        metricLimit: {
                            leafExpression: 'From Coal [Highest 1]',
                        },
                        missingNAAFilters: {},
                        subTotals: [],
                        commonFilterInfo: {
                            hasFilter: false,
                            inCanvasSelectors: [],
                            selectedViz: null,
                        },
                    },
                ],
            },
        };
        return newLocal;
    });
}

export async function mockInterpretationError() {
    const chatMock = await browser.mock('**/api/aiservice/chats/interpretation');
    chatMock.respondOnce(async ({ body: rawResponse }) => {
        const newLocal = {
            status: 'error',
        };
        return newLocal;
    });
}

export async function mockAlternativeSuggestionsResponse(alternatives, suggestions) {
    const firstRoundResponse = await browser.mock('**/api/aiservice/chats/alternativeSuggestions');
    firstRoundResponse.respondOnce(async ({ body: rawResponse }) => {
        let response = parseRawResponse(rawResponse);
        const newLocal = {
            ...response,
            alternatives,
        };
        if (suggestions) {
            newLocal.suggestions = suggestions;
        }
        return newLocal;
    });
    return firstRoundResponse;
}

function parseRawResponse(rawResponse) {
    let response;
    try {
        if (typeof rawResponse === 'string') {
            response = JSON.parse(rawResponse);
        } else {
            response = rawResponse;
        }
    } catch (error) {
        console.error('Cannot parse rawResponse:', error);
        response = rawResponse;
    }
    return response;
}

export async function mockAlternativeSuggestionsErrorResponse() {
    const mock = await browser.mock('**/api/aiservice/chats/alternativeSuggestions');
    mock.respondOnce(
        (request) => {
            var responseErr = request.body;
            responseErr = {
                code: 'ERR003',
                message: 'Collaboration server returned error.',
                ticketId: 'befd82e0da40439eaf82141e9fd46078',
            };
            return responseErr;
        },
        { fetchResponse: true }
    );
}

export async function mockAlternativeSuggestionsIgnoreError(alternatives, suggestions) {
    const firstRoundResponse = await browser.mock('**/api/aiservice/chats/alternativeSuggestions');
    firstRoundResponse.respondOnce(async ({ body: rawResponse }) => {
        var newResponse = rawResponse;
        newResponse = {
            status: 0,
            ambiguousPhrase: 'highest',
            category: '4',
            suggestionPrompt: 'Did you mean...?',
            alternatives: alternatives,
            suggestions: suggestions,
        };
        return newResponse;
    });
    return firstRoundResponse;
}

export async function mockChatResult({ answerText }) {
    const chatMock = await browser.mock('**/api/aiservice/chats/dossier');
    chatMock.respond(async ({ body: rawResponse }) => {
        if (rawResponse.status !== 0) {
            return {
                ...rawResponse,
                result: answerText,
                status: 0,
            };
        }
        if (rawResponse.questionAssessment) {
            if (!rawResponse.manipulations || rawResponse.manipulations.length === 0) {
                return {
                    ...rawResponse,
                    result: answerText,
                };
            }
            return {
                ...rawResponse,
                questionAssessment: {},
            };
        }
        const newLocal = {
            ...rawResponse,
            result: answerText,
        };
        return newLocal;
    });
}

//mock bot question count in current cycle > bot level quota for non-saas env
export async function mockQuestionCountInCurrentCycle(askedQuestionsCount) {
    const mock = await browser.mock(`**/chats`);
    mock.respondOnce(
        (request) => {
            var responseObj = request.body;
            if (responseObj.chats[0].questionCountInCurrentCycle) {
                responseObj.chats[0].questionCountInCurrentCycle = askedQuestionsCount;
                console.log(
                    `Mocked the used Question Count to be ${JSON.stringify(
                        responseObj.chats[0].questionCountInCurrentCycle
                    )}`
                );
            }
            return responseObj;
        },
        { fetchResponse: true }
    );
}

//mock nuggetsUsed info, which already saved in MD
export async function mockNuggetsUsedInChats(newNuggetsUsed) {
    const mock = await browser.mock(`**/chats`);
    mock.respondOnce(
        (request) => {
            var responseObj = request.body;
            if (responseObj.chats[0].messages[0].nuggetsUsed) {
                responseObj.chats[0].messages[0].nuggetsUsed = newNuggetsUsed;
                console.log(`Mocked newNuggetsUsed`);
            }
            return responseObj;
        },
        { fetchResponse: true }
    );
}

export async function mockLearningData({ botId, lastDownload = null, total = 0 }) {
    console.log(`Mock learning data, botId: ${botId}, lastDownload: ${lastDownload}, total: ${total}`);
    const mock = await browser.mock(`**/api/telemetry/bots/${botId}/learnings?period=all`);
    mock.respondOnce(
        {
            lastDownload: lastDownload,
            total: total,
        },
        { statusCode: 200 }
    );
}

// mock get learning -> total count
export async function mockLearningTotalCount({ botId, totalCount = 0 }) {
    const mock = await browser.mock(`**/api/telemetry/bots/${botId}/learnings?period=all`);
    mock.respondOnce(
        (request) => {
            var responseObj = request.body;
            responseObj.total = totalCount;
            return responseObj;
        },
        { fetchResponse: true }
    );
}

// mock get telemetry status error, status code = 400
export async function mockTelemetryStatus(statusCode = 200) {
    console.log(`Mock telemetry status ${statusCode}`);
    const mock = await browser.mock(`**/api/telemetry/status`);
    mock.respond(
        {
            message: 'Bad Request',
        },
        { statusCode: statusCode }
    );
}

// mock download learning error, status code = 500, message = internal server error
export async function mockDownloadLearningError(botId) {
    const mock = await browser.mock(`**/api/telemetry/bots/${botId}/learnings?period=all`);
    mock.respondOnce(
        (request) => {
            const acceptHeader = request.headers['accept'] || request.headers['Accept'];
            if (acceptHeader === 'application/octet-stream') {
                return {
                    message: 'Internal Server Error',
                };
            }
        },
        { statusCode: 500 }
    );
}

// mock get bots statics api
// /api/telemetry/bots/$botId/statistics?period=$period
// period = all, last30days, last60days, last90days
// return {"questionCount": 78,"userCount": 1,"effectivenessRatio": 1.0,"interpretationRequestsRatio": 1.0,"definitionsUsedCount": 0}
export async function mockBotStatistics({ botId, period, statistics }) {
    if (!period) {
        period = 'last30days';
    }
    if (!statistics) {
        statistics = {
            questionCount: 78,
            userCount: 1,
            effectivenessRatio: 1.0,
            interpretationRequestsRatio: 1.0,
            definitionsUsedCount: 0,
        };
    }
    const mock = await browser.mock(`**/api/telemetry/bots/${botId}/statistics?period=${period}`);
    mock.respondOnce(
        {
            ...statistics,
        },
        { statusCode: 200 }
    );
}

// mock download bot statistics error, status code = 500, message = internal server error
export async function mockDownloadBotStatisticsError(botId) {
    const mock = await browser.mock(`**/api/telemetry/bots/${botId}/feedback**`);
    mock.respondOnce(
        () => {
            return {
                message: 'Internal Server Error',
            };
        },
        { statusCode: 500 }
    );
}

//General error response
export async function mockErrorResponse(url, method = 'post', statusCode = undefined, newBody = undefined) {
    const mock = await browser.mock(url, { method: method });
    mock.respondOnce(
        (req) => {
            let response = {
                statusCode: req.statusCode,
                body: req.body,
            };
            if (statusCode !== undefined) {
                response.statusCode = statusCode;
            }
            if (newBody !== undefined) {
                response.body = newBody;
            }
            return response;
        },
        { fetchResponse: true }
    );
}
//General error response with abort
export async function mockAbortResponse(url, method = 'post') {
    const mock = await browser.mock(url, { method: method });
    mock.abort('Failed');
}

//General postpone response
export async function postponeResponse(url, method, timeout = 5 * 1000) {
    const mock = await browser.mock(url, { method: method });
    mock.respondOnce(
        async (request) =>
            new Promise((resolve) => {
                console.log(`Postpone the response of ${url}`);
                setTimeout(() => resolve({ statusCode: request.statusCode, body: request.body }), timeout);
            })
    );
}

export default async function setProjectAlias(projects, credentials) {
    const project = await getProjectInfo({ credentials: credentials });
    projects.forEach(({ projectId, alias }) => {
        project.forEach((p) => {
            if (p.id === projectId) {
                console.log(`Original alias for ${projectId}:`, p.alias);
                p.alias = alias;
                console.log(`Updated alias for ${projectId}:`, p.alias);
            }
        });
    });
    const htmlMock = await browser.mock('**/api/projects');
    htmlMock.respond(project);
}

export async function mockSnapshotTimeStamp({ timeStamp = MockUpUTCTimestamp }) {
    console.log(`Mock snapshot timeStamp: ${timeStamp}`);
    const mock = await browser.mock(`**historyList**`, { method: 'get' });
    mock.respondOnce(
        (response) => {
            var responseObj = response.body;
            var responseArray = response.body.historyList;
            responseArray.forEach((element) => {
                element.creationTime = timeStamp;
                // element.startTime = timeStamp;
                element.startTimeUtc = timeStamp;
                let date = new Date(timeStamp);
                date.setHours(date.getHours() + 1); // increase 1 hr to test the sorting
                timeStamp = date.toISOString();
            });
            responseObj.historyList = responseArray;
            return responseObj;
        },
        { fetchResponse: true }
    );
}

export async function mockGetSingleSnapshotResponse({ field = 'creationTime', value = MockUpUTCTimestamp }) {
    console.log(`Mock get single snapshot response, field: ${field}, value: ${value}`);
    const mock = await browser.mock(`**/api/historyList/**??objectType=document_definition&scope=single_user`, {
        method: 'get',
    });
    mock.respond(
        (response) => {
            const responseObj = response.body;
            responseObj[field] && (responseObj[field] = value);
            return responseObj;
        },
        { fetchResponse: true }
    );
}

export async function mockNoRecommendation({ objectId }) {
    console.log(`Mock no recommendation, objectId: ${objectId}`);
    const mock = await browser.mock(`**/api/objects/objectId=${objectId}/recommendations**`, {
        method: 'get',
    });
    mock.respondOnce(
        () => {
            return {
                totalItems: 0,
                result: [],
            };
        },
        { statusCode: 200 }
    );
}

export async function mockSnapshotList(n = 10) {
    console.log(`Mock snapshot list`);
    const mock = await browser.mock(`**/historyList?scope=SINGLE_LIBRARY_USER&targetInfo.objectId=**`, {
        method: 'get',
    });
    mock.respondOnce(
        (response) => {
            var responseObj = response.body;
            var responseArray = response.body.historyList;
            // duplicate the first item for 10 times
            for (let i = 0; i < n; i++) {
                responseArray.push({ ...responseArray[0] });
            }
            responseArray.forEach((element) => {
                element.startTime = MockUpUTCTimestamp;
            });
            responseObj.historyList = responseArray;
            return responseObj;
        },
        { fetchResponse: true }
    );
}

export async function mockSnapshotResult({ snapshotResult = 'failed' }) {
    console.log(`Mock snapshot result, snapshotResult: ${snapshotResult}`);
    const mock = await browser.mock(`**historyList**`, { method: 'get' });
    mock.respondOnce(
        (response) => {
            var responseObj = response.body;
            var responseArray = response.body.historyList;
            responseArray[0].requestStatus = snapshotResult;
            responseObj.historyList = responseArray;
            return responseObj;
        },
        { fetchResponse: true }
    );
}

export async function mockResponseError({ url, method = 'post', statusCode = 500, message = 'Bad Request' }) {
    console.log(`Mock response error, url: ${url}, method: ${method}, statusCode: ${statusCode}, message: ${message}`);
    const mock = await browser.mock(url, { method: method });
    mock.respondOnce(
        () => {
            return {
                message: message,
            };
        },
        { statusCode: statusCode }
    );
}

export async function mockRelatedSuggestion(suggestions) {
    const firstRoundResponse = await browser.mock('**/api/aiservice/chats/recommendations/dossier');
    firstRoundResponse.respondOnce(async ({ body: rawResponse }) => {
        let response = parseRawResponse(rawResponse);
        const newLocal = {
            ...response,
        };
        if (suggestions) {
            newLocal.result.insights = suggestions;
        }
        return newLocal;
    });
    return firstRoundResponse;
}

export async function mockAlertInList(name, userId, userName) {
    console.log(`Mock alert`);
    const mock = await browser.mock(`**/api/subscriptions/query?ignoreAdminPrivileges=true`, { method: 'post' });
    mock.respondOnce(
        (response) => {
            var responseObj = response.body;
            var responseArray = response.body.subscriptions;
            responseArray.push({
                id: 'B37ECF441D4DEB935F29C2839BF72D6F',
                name: name,
                owner: {
                    id: userId,
                    name: userName,
                },
                contents: [{ type: 'report' }],
                alert: true,
            });
            responseObj.subscriptions = responseArray;
            return responseObj;
        },
        { fetchResponse: true }
    );
}

export async function mockSearchServiceNotReady() {
    const mock = await browser.mock('**/api/searches/results?pattern=**', { method: 'get' });
    mock.respondOnce(
        () => {
            return {
                code: 'ERR001',
                iServerCode: -2147202265,
                message:
                    '(The Search Service Index is still being built. Please try again when initial indexing is complete.)',
                ticketId: '251406ecbfa04cccb0cece14539d023d',
            };
        },
        { statusCode: 500 }
    );
}

export async function mockFeatureFlags(featureFlags) {
    const mock = await browser.mock('**/api/v2/configurations/featureFlags', { method: 'get' });
    mock.respondOnce(
        (response) => {
            var responseObj = response.body;
            Object.keys(featureFlags).forEach((flag) => {
                const existingFlag = responseObj.featureFlags.find((item) => item.id === flag);
                if (existingFlag) {
                    existingFlag.enabled = featureFlags[flag];
                } else {
                    responseObj.featureFlags.push({
                        id: flag,
                        tag: flag,
                        enabled: featureFlags[flag],
                        internal: true,
                        status: 0,
                    });
                }
            });
            return responseObj;
        },
        { fetchResponse: true }
    );
}

export async function mockFeatureFlagOfSuppressMissingFontDialog(flag = true) {
    await mockFeatureFlags({
        'features.suppressMissingFontDialog': flag,
    });
}

export async function mockFeatureFlagOfViewFilter(flag = true) {
    await mockFeatureFlags({
        'features.reportInLibrary.viewFilter.enabled': flag,
    });
}

export async function mockServerVersion(option) {
    const mock = await browser.mock('**/api/status', { method: 'get' });
    mock.respond(
        (response) => {
            const responseObj = response.body;
            if (option.iServerVersion) {
                if (option.isForce) {
                    responseObj.iServerVersion = option.iServerVersion;
                } else if (compareVersion(option.iServerVersion, responseObj.iServerVersion) > 0) {
                    responseObj.iServerVersion = option.iServerVersion;
                }
            }
            if (option.webVersion) {
                if (option.isForce) {
                    responseObj.webVersion = option.webVersion;
                } else if (compareVersion(option.webVersion, responseObj.webVersion) > 0) {
                    responseObj.webVersion = option.webVersion;
                }
            }
            return responseObj;
        },
        { fetchResponse: true }
    );
    return mock;
}

export async function mockiServerVersion(version, isForce = false) {
    console.info(`Mock iServer version to ${version}, isForce: ${isForce}`);
    return await mockServerVersion({ iServerVersion: version, isForce });
}
