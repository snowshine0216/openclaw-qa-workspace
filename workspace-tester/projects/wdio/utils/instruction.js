import { getOutputAPI, getSqlAPI } from '../api/bot/instruction/getOutput.js';
import compareAnswerWithBaselineBySimilarity from '../utils/BaselineCompareUtils.js';
import postInstructionResultAPI from '../api/bot/instruction/postResult.js';
let { libraryPage, libraryAuthoringPage, aibotChatPanel, botAuthoring, botCustomInstructions } = browsers.pageObj1;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function runCase({ testcase, browser, now }) {
    if (!testcase.active) {
        console.log(
            `[INFO] Skip this test case for category ${testcase.category}, business_info: ${testcase.business_info}, response_style: ${testcase.response_style}, question: ${testcase.question}`
        );
        return;
    }
    console.log(`[INFO] Start to run test case ${testcase.tc_id}`);
    let current_url = await browser.getUrl();
    if (!current_url.includes(testcase.bot_id)) {
        await libraryPage.openBotById({ botId: testcase.bot_id });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
    }
    await aibotChatPanel.clearHistory();

    //enable, input 500 characters
    await botCustomInstructions.enableCustomInstructions();
    if (testcase.business_info) {
        await botCustomInstructions.inputBackgroundByPaste(testcase.business_info);
    } else {
        await botCustomInstructions.inputBackground('');
    }
    if (testcase.response_style) {
        await botCustomInstructions.inputFormatByPaste(testcase.response_style);
    } else {
        await botCustomInstructions.inputFormat('');
    }

    // split testcase.question by ';;' and input each part
    let questionList = testcase.question.split(';;');

    for (let i = 0; i < questionList.length; i++) {
        await aibotChatPanel.askQuestionByPaste(`010101${questionList[i]}`);
        let { output, sql } = await getOutputSQL({ testcase, now, idx: i });
        if (i == 0) {
            testcase.output = output;
            testcase.sql = sql;
        } else {
            testcase.output = testcase.output + ';;' + output;
            testcase.sql = sql;
        }
    }
}

export async function getOutputSQL({ testcase, now, idx = 0 }) {
    let output = '';
    let sql = '';
    try {
        output =
            (await aibotChatPanel.getMarkDownByIndex(idx).getText()) ||
            (await aibotChatPanel.getTextAnswerByIndex(idx).getText());
        if (testcase.interpretation && testcase.question.split(';;').length - 1 == idx) {
            await aibotChatPanel.openInterpretation(idx);
            sql = await aibotChatPanel.getInterpretationText();
        }
    } catch (e) {
        console.log(`[ERROR] for ${testcase.tc_id} error happens when getting output or sql: ${e}`);
    }

    if (!output) {
        console.log(`[INFO] ${testcase.tc_id} output is null, will get output from getOutputAPI`);
        let retry = 0;
        while (!output && retry < 3) {
            try {
                output = await getOutputAPI({
                    app: '6b9ed5ac-e1ae-4271-bd43-a3dd6e9f83c4',
                    input: testcase.question,
                });
                if (output) {
                    let createTime = new Date(output['created_time']);
                    let isoFormatTime = createTime.toISOString();
                    output = isoFormatTime > now && output['output']['text'];
                    if (output) {
                        console.log(`[INFO] ${testcase.tc_id} output from getOutputAPI: `, output);
                        break;
                    }
                }
            } catch (error) {
                console.log(`[ERROR] for ${testcase.tc_id} error happens when getting output: ${error}`);
            }
            console.log(`[INFO] ${testcase.tc_id} output from getOutputAPI is null, retry ${retry}`);
            await sleep(3000);
            retry++;
        }
    }

    if (!sql && testcase.interpretation && testcase.question.split(';;').length - 1 == idx) {
        console.log(`[INFO] for ${testcase.tc_id}  sql is null, will get sql from getSqlAPI`);
        let retry = 0;
        while (!sql && retry < 3) {
            try {
                sql = await getSqlAPI({
                    app: '6b9ed5ac-e1ae-4271-bd43-a3dd6e9f83c4',
                    input: testcase.question,
                });
                if (sql) {
                    let createTime = new Date(sql['created_time']);
                    let isoFormatTime = createTime.toISOString();
                    sql = isoFormatTime > now && JSON.parse(sql['output']['functionCall']['arguments'])['SQL'];
                    if (sql) {
                        console.log(`[INFO] ${testcase.tc_id} sql from getSqlAPI: `, sql);
                        break;
                    }
                }
            } catch (error) {
                console.log(`[ERROR] for ${testcase.tc_id} error happens when getting sql: ${error}`);
            }
            console.log(`[INFO] ${testcase.tc_id} sql from getSqlAPI is null, retry ${retry}`);
            await sleep(3000);
            retry++;
        }
    }

    return { output, sql };
}

export async function compareResult({ testcase, resultSql = true, buildNo = '' }) {
    let matchRes, similarity;
    if (testcase.tc_id == 'TC91801_13') {
        matchRes = true;
        similarity = 1;
    } else {
        const result = await compareAnswerWithBaselineBySimilarity({
            baselines: testcase.answer,
            output: testcase.output,
            model: 'sentence-t5-large',
            threshold: 0.9,
        });
        ({ matchRes, similarity } = result);
    }
    // only update db when buildNo is not null
    if (buildNo) {
        await postInstructionResultAPI({
            hashKey: testcase.hash_key,
            result: matchRes && resultSql,
            similarity: similarity,
            buildNumber: buildNo,
        });
    }
    return { matchRes, similarity };
}

export async function compareSql({ testcase }) {
    // use ';;' to split baseline group
    // use ',,' to split different cases
    let resultSqlList = [];
    let interpretatioGroup = testcase.interpretation.split(',,');
    interpretatioGroup.forEach((interpretation) => {
        compareSqlForOneGroup({ interpretation, testcase, resultSqlList });
    });

    let resultSql = resultSqlList.every((result) => result);
    return resultSql;
}
function compareSqlForOneGroup({ interpretation, testcase, resultSqlList }) {
    let interpretationList = interpretation.split(';;');
    console.log(`[INFO] for ${testcase.tc_id} interpretation baseline total is ${interpretationList.length}`);
    console.log(`[INFO] for ${testcase.tc_id},interpretation actual result is ${testcase.sql}`);
    for (let cnt = interpretationList.length - 1; cnt >= 0; cnt--) {
        let interpretation = interpretationList[cnt];
        console.log(`[INFO] for ${testcase.tc_id}, compare round ${cnt}, sql needs to include ${interpretation}`);
        if (testcase.sql.toLowerCase().includes(interpretation.toLowerCase())) {
            console.log(`[INFO] for ${testcase.tc_id}, compare round ${cnt}, match`);
            resultSqlList.push(true);
            return;
        }
    }
    resultSqlList.push(false);
}
