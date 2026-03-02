import * as consts from '../../../constants/teams.js';
import { mstrUser } from '../../../constants/bot.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetObjectAcl from '../../../api/manageAccess/resetObjectAcl.js';
import compareAnswerWithBaselineBySimilarity from '../../../utils/BaselineCompareUtils.js';
import reinstallApp from '../../../api/teams/reinstallApp.js';

describe('Test follow up questions in Teams', () => {
    let { mainTeams, apps, teamsDesktop, conversation } = browsers.pageObj1;
    const teamsApp = browsers.params.teamsAppName;

    beforeAll(async () => {
        browser.options.baseUrl = browsers.params.standardUrl;
        await reinstallApp([
            { teams: 'e52ecfde-b408-4b36-8b3e-14094f17075f' }, // Auto_Teams
        ]);
        await resetObjectAcl({
            credentials: mstrUser,
            object: {
                id: consts.mstrStockBot.id,
                name: consts.mstrStockBot.name,
                project: consts.mstrStockBot.project,
            },
            acl: [
                {
                    value: 'Full Control',
                    id: consts.botInTeamsUser.id,
                    name: consts.botInTeamsUser.credentials.username,
                },
                {
                    value: 'Full Control',
                    id: consts.autoInTeamsUser.id,
                    name: consts.autoInTeamsUser.credentials.username,
                },
            ],
        });
        await teamsDesktop.switchToActiveWindow();
        await teamsDesktop.switchToTeamsUserIfNeeded(consts.botInTeamsUser.credentials.username);
        await apps.openTeamsApp(teamsApp);
    });

    beforeEach(async () => {
        await teamsDesktop.switchToTeamsUserIfNeeded(consts.botInTeamsUser.credentials.username);
        await mainTeams.switchToChat(teamsApp);
    });

    afterEach(async () => {});

    afterAll(async () => {
        await mainTeams.switchToAppInSidebar(teamsApp);
    });

    it('[TC95621_01] follow up questions to summarize in 1-1 chat', async () => {
        await conversation.switchToTabInChat('Chat');
        await conversation.askQuestionsByWaiting({ question: 'show me mstr stock open price by date in year 2023' });
        await conversation.askQuestionsByWaiting({ question: 'show me mstr stock open price by date in year 2024' });
        await conversation.replyMessageByIndex({ idx: 3 });
        await conversation.askQuestionsByWaiting({ question: 'summary it in 30 words' });
        const actualAnswer1 = await conversation.getLatestReceivedChatMessage().getText();
        const result1 = await compareAnswerWithBaselineBySimilarity({
            baselines: {
                result: `1. The MSTR stock open prices for 2023 were displayed by date, showing daily opening values throughout the year, providing a detailed view of the stock's performance over time.`,
            },
            output: actualAnswer1,
            model: 'sentence-t5-large',
            threshold: 0.8,
        });
        await since(`2. actual answer should inlcude 2023, instead it doesn't`)
            .expect(actualAnswer1.includes('2023'))
            .toBe(true);
        await since(
            `3. Similarity compare is expected to be #{expected} answer is '${actualAnswer1}', instead we have #{actual} and similarity is '${result1.similarity}'`
        )
            .expect(result1.matchRes)
            .toBe(true);
        await conversation.replyMessageByIndex({ idx: 3 });
        await conversation.askQuestionsByWaiting({ question: 'summary it in 30 words' });
        const actualAnswer2 = await conversation.getLatestReceivedChatMessage().getText();
        const result2 = await compareAnswerWithBaselineBySimilarity({
            baselines: {
                result: `4. The MSTR stock open prices for 2024 were displayed by date, showing daily opening values from January to August 2024, providing a clear view of the stock's performance over time.`,
                result1: `Highest open price: $1953 on 2024-03-27. Lowest open price: $450 on 2024-01-23. Significant increase: Late February to March, peaking in late March. Volatility: Substantial fluctuations throughout the year. Notable drop: April, with prices falling below $1300. Recovery: May, with prices reaching up to $1730. Consistent upward trend: January to late March, followed by a decline in April and partial recovery in May. MSTR Stock Bot`,
            },
            output: actualAnswer2,
            model: 'sentence-t5-large',
            threshold: 0.85,
        });
        await since(`5. actual answer should inlcude 2024, instead it doesn't`)
            .expect(actualAnswer2.includes('2024'))
            .toBe(true);
        await since(
            `6. Similarity compare is expected to be #{expected} answer is '${actualAnswer2}' , instead we have #{actual} and similarity is '${result2.similarity}'`
        )
            .expect(result2.matchRes)
            .toBe(true);
    });

    it('[TC95621_02] follow up questions to aggregate in 1-1 chat', async () => {
        await conversation.switchToTabInChat('Chat');
        await conversation.askQuestionsByWaiting({ question: 'show me mstr stock open price by date in year 2023' });
        await conversation.askQuestionsByWaiting({ question: 'show me mstr stock open price by date in year 2024' });
        await conversation.replyMessageByIndex({ idx: 3 });
        await conversation.askQuestionsByWaiting({ question: 'find the highest open price' });
        const actualAnswer1 = await conversation.getLatestReceivedChatMessage().getText();
        const result1 = await compareAnswerWithBaselineBySimilarity({
            baselines: {
                result: `The highest open price is 674.83. MSTR Stock Bot`,
                result2: `The highest open price for MSTR stock in the year 2023 is 674.8300170898. MSTR Stock Bot`,
                result3: `The highest open price is 674.8300170898. MSTR Stock Bot'`,
            },
            output: actualAnswer1,
            model: 'sentence-t5-large',
            threshold: 0.9,
        });
        await since(
            `Similarity compare is expected to be #{expected} answer is '${actualAnswer1}', instead we have #{actual} and similarity is ${result1.similarity}`
        )
            .expect(result1.matchRes)
            .toBe(true);
        await conversation.replyMessageByIndex({ idx: 3 });
        await conversation.askQuestionsByWaiting({ question: 'find the highest open price' });
        const actualAnswer2 = await conversation.getLatestReceivedChatMessage().getText();
        const result2 = await compareAnswerWithBaselineBySimilarity({
            baselines: {
                result: `The highest open price is 1,953.00 .`,
                result2: `The highest open price is 1953 `,
                result3: `The highest open price for MSTR stock in the year 2024 is 1953.`,
            },
            output: actualAnswer2,
            model: 'sentence-t5-large',
            threshold: 0.9,
        });
        await since(
            `Similarity compare is expected to be #{expected} answer is ${actualAnswer2} , instead we have #{actual} and similarity is ${result2.similarity}`
        )
            .expect(result2.matchRes)
            .toBe(true);
    });

    it('[TC95621_03] follow up questions to change viz type in 1-1 chat', async () => {
        await conversation.switchToTabInChat('Chat');
        await conversation.askQuestionsByWaiting({ question: 'show me sales by main category in pie chart' });
        await conversation.replyMessageByIndex({ idx: 1 });
        await conversation.askQuestionsByWaiting({ question: 'use bar chart' });
        const actualAnswer1 = await conversation.getLatestReceivedChatMessage().getText();
        const result1 = await compareAnswerWithBaselineBySimilarity({
            baselines: {
                result: `Sales by Main Category
accessories : 25,350,933.61
women's clothing : 16,893,751.30
men's clothing : 15,423,199.61
tv, audio & cameras : 15,333,371.53
appliances : 15,077,598.63
etc.
Retail Analysis Bot`,
            },
            output: actualAnswer1,
            model: 'sentence-t5-large',
            threshold: 0.9,
        });
        await since(
            `Similarity compare is expected to be #{expected} answer is '${actualAnswer1}', instead we have #{actual} and similarity is ${result1.similarity}`
        )
            .expect(result1.matchRes)
            .toBe(true);
        await conversation.waitForElementVisible(await conversation.getVizImageInLatestMessage());
    });

    it('[TC95621_04] follow up questions to sort in 1-1 chat', async () => {
        await conversation.switchToTabInChat('Chat');
        await conversation.askQuestionsByWaiting({ question: 'show me sales by main category' });
        await conversation.replyMessageByIndex({ idx: 1 });
        await conversation.askQuestionsByWaiting({ question: 'sort it by sales ASC' });
        const actualAnswer1 = await conversation.getLatestReceivedChatMessage().getText();
        const result1 = await compareAnswerWithBaselineBySimilarity({
            baselines: {
                result: `Here are the sales sorted by main category in ascending order:
Casebound: 25.06
Cloth Hardcover: 26.18
Online Fiction - Complete: 28.21
perfect: 28.51
hardcover: 98.15
etc.
Retail Analysis Bot`,
                result1: `Casebound and Cloth Hardcover have the lowest sales, indicating potential areas for improvement. Accessories dominate with $25.35M in sales, followed by Women's Clothing and Men's Clothing. Music and Books categories also show strong performance, with sales over $130M and $144M respectively. Grocery & Gourmet Foods and Kindle Edition are high performers in the digital and consumables categories. Pet Supplies and Industrial Supplies show significant sales, suggesting strong demand in these areas. Home & Kitchen and Sports & Fitness categories have potential for further growth, with sales over $2.7M and $2.5M respectively. Men's Shoes and Appliances are notable, with sales over $12M and $15M respectively. Stores and Paperback categories contribute significantly, with sales over $6.95M and $4.52M respectively. Retail Analysis Bot`,
            },
            output: actualAnswer1,
            model: 'sentence-t5-large',
            threshold: 0.9,
        });
        await since(
            `Similarity compare is expected to be #{expected} answer is '${actualAnswer1}', instead we have #{actual} and similarity is ${result1.similarity}`
        )
            .expect(result1.matchRes)
            .toBe(true);
        await conversation.replyMessageByIndex({ idx: 3 });
        await conversation.askQuestionsByWaiting({ question: 'sort it by sales DESC' });
        const actualAnswer2 = await conversation.getLatestReceivedChatMessage().getText();
        const result2 = await compareAnswerWithBaselineBySimilarity({
            baselines: {
                result: `The sales by main category, sorted in descending order, are as follows:
accessories: 25,350,933.61
women's clothing: 16,893,751.30
men's clothing: 15,423,199.61
tv, audio & cameras: 15,333,371.53
appliances: 15,077,598.63
etc.
Retail Analysis Bot`,
                result1: `Accessories dominate with $25.35M in sales. Women's Clothing and Men's Clothing are strong, with $16.89M and $15.42M respectively. TV, Audio & Cameras and Appliances are also significant, each around $15M. Men's Shoes show notable sales at $12.13M. Stores and Paperback categories contribute over $6.95M and $4.52M respectively. Home & Kitchen, Sports & Fitness, and Kids' Fashion have potential for growth, each around $2.5M. Beauty & Health and Car & Motorbike are niche but profitable, each around $2M. Casebound and Cloth Hardcover have the lowest sales, indicating potential areas for improvement. Focus on top categories for sustained growth and explore strategies to boost sales in emerging segments. Retail Analysis Bot'`,
            },
            output: actualAnswer2,
            model: 'sentence-t5-large',
            threshold: 0.9,
        });
        await since(
            `Similarity compare is expected to be #{expected} answer is '${actualAnswer2}', instead we have #{actual} and similarity is ${result2.similarity}`
        )
            .expect(result2.matchRes)
            .toBe(true);
        await conversation.waitForElementVisible(await conversation.getVizImageInLatestMessage());
        await takeScreenshotByElement(
            conversation.getVizImageInLatestMessage(),
            'TC95621_04_01',
            'viz image sort by sales DESC',
            { tolerance: 0.8 }
        );
    });

    it('[TC95621_05] follow up questions to quote question in group chat', async () => {
        await teamsDesktop.switchToTeamsUserIfNeeded(consts.autoInTeamsUser.credentials.username);
        await mainTeams.switchToChat(consts.testGroupChat3);
        await conversation.askQuestionsByWaiting({
            question: 'show me mstr stock open price by date in year 2023',
            mention: teamsApp,
        });
        await conversation.askQuestionsByWaiting({
            question: 'show me mstr stock close price by date in year 2024',
            mention: teamsApp,
        });
        await conversation.replyMessageByIndex({ idx: 4, isQuestion: true });
        await conversation.askQuestionsByWaiting({ question: 'what about year 2024?', mention: teamsApp });
        const actualAnswer1 = await conversation.getLatestReceivedChatMessage().getText();
        const result1 = await compareAnswerWithBaselineBySimilarity({
            baselines: {
                result: `For the year 2024, the MSTR stock open prices by date are as follows:
2024-01-02: 692.49
2024-01-03: 643.22
2024-01-04: 638.60
2024-01-05: 648.71
2024-01-08: 640.00
etc.
The open prices range from a minimum of 450.00 on 2024-01-23 to a maximum of 1,953.00 on 2024-03-27. The data covers 104 distinct dates from 2024-01-02 to 2024-05-30.
MSTR Stock Bot`,
            },
            output: actualAnswer1,
            model: 'sentence-t5-large',
            threshold: 0.9,
        });
        await since(
            `Similarity compare is expected to be #{expected} answer is '${actualAnswer1}', instead we have #{actual} and similarity is ${result1.similarity}`
        )
            .expect(result1.matchRes)
            .toBe(true);
        await conversation.waitForElementVisible(await conversation.getVizImageInLatestMessage());
        await takeScreenshotByElement(
            conversation.getVizImageInLatestMessage(),
            'TC95621_05_01',
            'mstr open price in 2024',
            { tolerance: 0.4 }
        );
    });

    it('[TC95621_06] follow up questions to change viz template in group chat', async () => {
        await teamsDesktop.switchToTeamsUserIfNeeded(consts.autoInTeamsUser.credentials.username);
        await mainTeams.switchToChat(consts.testGroupChat3);
        await conversation.askQuestionsByWaiting({
            question: 'find the main category with highest sales',
            mention: teamsApp,
        });
        await conversation.askQuestionsByWaiting({
            question: 'find the main category with lowest sales',
            mention: teamsApp,
        });
        await conversation.replyMessageByIndex({ idx: 3 });
        await conversation.askQuestionsByWaiting({
            question: '⁠show me the total cost of this main category',
            mention: teamsApp,
        });
        const actualAnswer1 = await conversation.getLatestReceivedChatMessage().getText();
        const result1 = await compareAnswerWithBaselineBySimilarity({
            baselines: {
                result: `The total cost for the main category with the highest sales is as follows:
Main Category : accessories
Total Cost : 16,946,450.61
Percentage : 100.00%
Retail Analysis Bot`,
                result1: `The total cost of the main category Accessories is $15,418,045.56. Retail Analysis Bot`,
            },
            output: actualAnswer1,
            model: 'sentence-t5-large',
            threshold: 0.9,
        });
        await since(
            `Similarity compare is expected to be #{expected} answer is '${actualAnswer1}', instead we have #{actual} and similarity is ${result1.similarity}`
        )
            .expect(result1.matchRes)
            .toBe(true);
    });

    it('[TC95621_07] follow up questions to re-use context template in group chat', async () => {
        await teamsDesktop.switchToTeamsUserIfNeeded(consts.autoInTeamsUser.credentials.username);
        await mainTeams.switchToChat(consts.testGroupChat3);
        await conversation.askQuestionsByWaiting({
            question: 'find the NBA player scored highest pts per game id',
            mention: teamsApp,
        });
        await conversation.askQuestionsByWaiting({
            question: 'find the NBA player got highest REB',
            mention: teamsApp,
        });
        await conversation.replyMessageByIndex({ idx: 3 });
        await conversation.askQuestionsByWaiting({
            question: 'what is his team abbreviation?',
            mention: teamsApp,
        });
        const actualAnswer1 = await conversation.getLatestReceivedChatMessage().getText();
        const result1 = await compareAnswerWithBaselineBySimilarity({
            baselines: {
                result: `The team abbreviation for the player who scored the highest points per game is:
TEAM ABBREVIATION : LAL
Statistical Information :
TEAM ABBREVIATION has 1 distinct value: LAL.
NBA Games Bot`,
                result1: `His team abbreviation is LAL. NBA Games Bot`,
            },
            output: actualAnswer1,
            model: 'sentence-t5-large',
            threshold: 0.9,
        });
        await since(
            `Similarity compare is expected to be #{expected} answer is '${actualAnswer1}', instead we have #{actual} and similarity is ${result1.similarity}`
        )
            .expect(result1.matchRes)
            .toBe(true);
    });

    it('[TC95621_08] follow up questions to use another bot in group chat', async () => {
        await teamsDesktop.switchToTeamsUserIfNeeded(consts.autoInTeamsUser.credentials.username);
        await mainTeams.switchToChat(consts.testGroupChat3);
        await conversation.askQuestionsByWaiting({
            question: 'find the NBA player scored highest total pts',
            mention: teamsApp,
        });
        await conversation.replyMessageByIndex({ idx: 1 });
        await conversation.askQuestionsByWaiting({
            question: 'what is his salary?',
            mention: teamsApp,
        });
        const actualAnswer1 = await conversation.getLatestReceivedChatMessage().getText();
        const result1 = await compareAnswerWithBaselineBySimilarity({
            baselines: {
                result: `LeBron James' salary is
33,285,709.00 .
NBA Player Salary Bot`,
                result2: `The salary of LeBron James is
3.33E+07 .
NBA Player Salary Bot`,
            },
            output: actualAnswer1,
            model: 'sentence-t5-large',
            threshold: 0.9,
        });
        await since(
            `Similarity compare is expected to be #{expected} answer is '${actualAnswer1}', instead we have #{actual} and similarity is ${result1.similarity}`
        )
            .expect(result1.matchRes)
            .toBe(true);
    });
});
