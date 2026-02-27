import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import * as consts from '../../../constants/bot.js';
import { runCase, compareResult, compareSql } from '../../../utils/instruction.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('AI Bot Custom Instructions For Response', () => {
    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1200,
    };

    let { loginPage, botVisualizations, aibotChatPanel } = browsers.pageObj1;
    let testcases = browsers.params.instructionTestCases;
    let buildNo = browsers.params.platformBuildNo;

    let now = new Date();
    // current time minus 10 hours
    // now.setHours(now.getHours() - 8);
    now = now.toISOString();

    let tc01 = testcases.filter((testcase) => testcase.tc_id == 'TC91801_01' && testcase.active);
    let tc02 = testcases.filter((testcase) => testcase.tc_id == 'TC91801_02' && testcase.active);
    let tc04 = testcases.filter((testcase) => testcase.tc_id == 'TC91801_04' && testcase.active);
    let tc08 = testcases.filter((testcase) => testcase.tc_id == 'TC91801_08' && testcase.active);
    let tc10 = testcases.filter((testcase) => testcase.tc_id == 'TC91801_10' && testcase.active);
    let tcInterpretation = testcases.filter((testcase) => testcase.interpretation && testcase.active);
    let tcOthers = testcases.filter(
        (testcase) =>
            !testcase.interpretation &&
            testcase.tc_id != 'TC91801_01' &&
            testcase.tc_id != 'TC91801_02' &&
            testcase.tc_id != 'TC91801_04' &&
            testcase.tc_id != 'TC91801_08' &&
            testcase.tc_id != 'TC91801_10' &&
            testcase.active
    );

    console.log(`[INFO] now is ${now}`);

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(consts.appUser.credentials);
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    tcInterpretation.forEach((testcase) => {
        it(`[${testcase.tc_id}] check custom instruction response for category ${testcase.category}`, async () => {
            await runCase({ testcase, browser, now });
            let resultSql = await compareSql({ testcase });

            await since(`when business_info is: ${testcase.business_info}, response_style is: ${testcase.response_style} for question: ${testcase.question} in bot: ${testcase.bot_name},
            the actual sql is: ${testcase.sql}, the expect result is: ${testcase.interpretation}`)
                .expect(resultSql)
                .toBe(true);

            let { matchRes } = await compareResult({ testcase, resultSql, buildNo });
            await since(`when business_info is: ${testcase.business_info}, response_style is: ${testcase.response_style} for question: ${testcase.question} in bot: ${testcase.bot_name},
            the actual output is: ${testcase.output}, the expect result is: ${matchRes}`)
                .expect(matchRes)
                .toBe(true);
        });
    });

    tcOthers.forEach((testcase) => {
        it(`[${testcase.tc_id}] check custom instruction response for category ${testcase.category}`, async () => {
            await runCase({ testcase, browser, now });
            if (testcase.tc_id == 'TC91801_13') {
                let vizResult = await botVisualizations.isLineChartInBotExist();
                await since(
                    `when business_info is: ${testcase.business_info}, response_style is: ${testcase.response_style} for question: ${testcase.question} in bot: ${testcase.bot_name}, the line chart should be shown`
                )
                    .expect(vizResult)
                    .toBe(true);
                await compareResult({ testcase: testcase, resultSql: vizResult, buildNo: buildNo });
            } else if (testcase.tc_id == 'TC91801_33') {
                await takeScreenshotByElement(aibotChatPanel.getVizAnswerByIndex(), 'TC91801_33', 'checkcluster bar'); // needs enhancing later
                let { matchRes } = await compareResult({ testcase: testcase, buildNo: buildNo });
                await since(`when business_info is: ${testcase.business_info}, response_style is: ${testcase.response_style} for question: ${testcase.question} in bot: ${testcase.bot_name},
                the actual output is: ${testcase.output}, the expect result is: ${matchRes}`)
                    .expect(matchRes)
                    .toBe(true);
            } else {
                let { matchRes } = await compareResult({ testcase: testcase, buildNo: buildNo });
                await since(`when business_info is: ${testcase.business_info}, response_style is: ${testcase.response_style} for question: ${testcase.question} in bot: ${testcase.bot_name},
                the actual output is: ${testcase.output}, the expect result is: ${matchRes}`)
                    .expect(matchRes)
                    .toBe(true);
            }
        });
    });

    it(`[${tc01[0].tc_id}] check custom instruction response for category ${tc01[0].category}`, async () => {
        await runCase({ testcase: tc01[0], browser, now });

        let resultSummary =
            tc01[0].output.includes('Middle age group') &&
            tc01[0].output.includes('Young age group') &&
            tc01[0].output.includes('Old age group');
        await since(
            `for ${tc01[0].tc_id}, the output should have keyword Middle age group, Young age group, Old age group, instead we have: ${tc01[0].output}`
        )
            .expect(resultSummary)
            .toBe(true);

        let { matchRes } = await compareResult({ testcase: tc01[0], resultSummary, buildNo });
        await since(`when business_info is: ${tc01[0].business_info}, response_style is: ${tc01[0].response_style} for question: ${tc01[0].question} in bot: ${tc01[0].bot_name},
            the actual output is: ${tc01[0].output}, the expect result is: ${matchRes}`)
            .expect(matchRes)
            .toBe(true);
    });

    it(`[${tc02[0].tc_id}] check custom instruction response for category ${tc02[0].category}`, async () => {
        await runCase({ testcase: tc02[0], browser, now });

        let resultSummary = !(
            tc02[0].output.includes('- Back end Developer') || tc02[0].output.includes('- Project Engineer')
        );
        await since(
            `for ${tc02[0].tc_id}, the output should not have keyword Back end Developer, Project Engineer, instead we have: ${tc02[0].output}`
        )
            .expect(resultSummary)
            .toBe(true);

        let { matchRes } = await compareResult({ testcase: tc02[0], resultSql: resultSummary, buildNo: buildNo });
        await since(`when business_info is: ${tc02[0].business_info}, response_style is: ${tc02[0].response_style} for question: ${tc02[0].question} in bot: ${tc02[0].bot_name},
            the actual output is: ${tc02[0].output}, the expect result is: ${matchRes}`)
            .expect(matchRes)
            .toBe(true);
    });

    it(`[${tc04[0].tc_id}] check custom instruction response for category ${tc04[0].category}`, async () => {
        await runCase({ testcase: tc04[0], browser, now });

        let resultSummary = tc04[0].output.includes('PhD') && tc04[0].output.includes('$163,568');

        await since(
            `for ${tc04[0].tc_id}, the output should have keyword Phd and number should have US Dollar symobol , instead we have: ${tc04[0].output}`
        )
            .expect(resultSummary)
            .toBe(true);

        let { matchRes } = await compareResult({ testcase: tc04[0], resultSql: resultSummary, buildNo: buildNo });
        await since(`when business_info is: ${tc04[0].business_info}, response_style is: ${tc04[0].response_style} for question: ${tc04[0].question} in bot: ${tc04[0].bot_name},
            the actual output is: ${tc04[0].output}, the expect result is: ${matchRes}`)
            .expect(matchRes)
            .toBe(true);
    });

    it(`[${tc08[0].tc_id}] check custom instruction response for category ${tc08[0].category}`, async () => {
        await runCase({ testcase: tc08[0], browser, now });

        let resultSummary = tc08[0].output.includes('SEM');
        await since(
            `for ${tc08[0].tc_id}, the output should have keyword SEM, and shouldn't show Software Engineer Manager, instead we have: ${tc08[0].output}`
        )
            .expect(resultSummary)
            .toBe(true);

        let { matchRes } = await compareResult({ testcase: tc08[0], resultSummary, buildNo });
        await since(`when business_info is: ${tc08[0].business_info}, response_style is: ${tc08[0].response_style} for question: ${tc08[0].question} in bot: ${tc08[0].bot_name},
            the actual output is: ${tc08[0].output}, the expect result is: ${matchRes}`)
            .expect(matchRes)
            .toBe(true);
    });

    it(`[${tc10[0].tc_id}] check custom instruction response for category ${tc10[0].category}`, async () => {
        await runCase({ testcase: tc10[0], browser, now });

        let resultSummary = tc10[0].output.includes('CA') && !tc10[0].output.includes(' Canada');

        await since(
            `for ${tc10[0].tc_id}, the output should have keyword CA, and shouldn't show Canada, instead we have: ${tc10[0].output}`
        )
            .expect(resultSummary)
            .toBe(true);

        let { matchRes } = await compareResult({ testcase: tc10[0], resultSummary, buildNo });
        await since(`when business_info is: ${tc10[0].business_info}, response_style is: ${tc10[0].response_style} for question: ${tc10[0].question} in bot: ${tc10[0].bot_name},
            the actual output is: ${tc10[0].output}, the expect result is: ${matchRes}`)
            .expect(matchRes)
            .toBe(true);
    });
});
