import fs from 'fs-extra';
import path from 'path';
import getLogger from '../../scripts/logger.js';
import chalk from 'chalk';

/**
 * Interface for representing a JSON object describing a failed expectation. it contains
 * tcDes: test case name stands for this failed step belonging to which test case
 * matcherName: it presents the failed step type (assertion/image compare/error)
 * message: presents the error msg shown in details summary
 * stack: call stacks shown in details summary
 * rerunIndex: which run this error shows
 *
 */
interface FailedExpectationJSON {
    tcDes: string;
    matcherName: string;
    message: string;
    stack: string;
    rerunIndex: number;
}

/**
 * Interface for representing a JSON object reading from .test-result/output.json file
 */
interface OutputJSON {
    specFile: string;
    startTime: string;
    passedID?: string[];
    failedID?: string[];
    failedName?: string[];
    failedExpectation?: FailedExpectationJSON[];
    pendingID?: string[];
    excludedID?: string[];
    finishTime?: string;
}

/**
 * Interface for representing a JSON object consolidating test result summary
 */
interface SummaryJSON {
    specFile: string;
    passed?: Set<string>;
    failed?: Set<string>;
    failedName?: Set<string>;
    failedExpectation?: FailedExpectationJSON[];
    pending?: Set<string>;
    excluded?: Set<string>;
    total?: Set<string>;
}

const outputFilePath = path.join(process.cwd(), './.test-result/output.json');
const logger = getLogger('');

function readOutputFile(): OutputJSON[] {
    let outputJSONArray: OutputJSON[];
    try {
        outputJSONArray = fs.readJSONSync(outputFilePath);
    } catch (error) {
        outputJSONArray = [];
    }

    return outputJSONArray;
}

export default function parseResult(): void {
    const summaryJSONArray: SummaryJSON[] = [];

    try {
        // read output json file first and then create summary json objects by spec files
        const outputJSONArray = readOutputFile();
        const uniqueSpecsSet = new Set<string>();
        outputJSONArray.forEach((item) => uniqueSpecsSet.add(item.specFile));
        uniqueSpecsSet.forEach((specName) => {
            const summaryJSON: SummaryJSON = {
                specFile: '',
                passed: new Set(),
                failed: new Set(),
                failedName: new Set(),
                failedExpectation: [],
                pending: new Set(),
                excluded: new Set(),
                total: new Set(),
            };
            summaryJSON.specFile = specName;
            summaryJSONArray.push(summaryJSON);
        });

        // loop in outputjson array to push result into summary json by spec file
        summaryJSONArray.forEach((summary) => {
            // runtime indicates the total run times for test cases in spec files
            let runtime = 0;
            outputJSONArray.forEach((output) => {
                if (output.specFile === summary.specFile) {
                    runtime++;
                    output.passedID.forEach((item) => {
                        summary.passed.add(item);
                        summary.total.add(item);
                    });
                    output.failedID.forEach((item) => {
                        summary.failed.add(item);
                        summary.total.add(item);
                    });
                    output.failedName.forEach((item) => {
                        summary.failedName.add(item);
                    });
                    output.failedExpectation.forEach((item) => {
                        const failedExpectationJSON: FailedExpectationJSON = {
                            tcDes: item.tcDes,
                            matcherName: item.matcherName,
                            message: item.message,
                            stack: item.stack,
                            rerunIndex: runtime,
                        };
                        summary.failedExpectation.push(failedExpectationJSON);
                    });
                    output.pendingID.forEach((item) => {
                        summary.pending.add(item);
                        summary.total.add(item);
                    });
                    output.excludedID.forEach((item) => {
                        summary.excluded.add(item);
                        summary.total.add(item);
                    });
                }
            });
        });
        // fillout passed test cases in failed/excluded test cases list due to re-run by tc
        summaryJSONArray.forEach((item) => item.passed.forEach((passedItem) => item.excluded.delete(passedItem)));
        summaryJSONArray.forEach((item) => item.passed.forEach((passedItem) => item.failed.delete(passedItem)));
    } catch (error) {
        console.log(error);
    }
    let totalTCCount = 0;
    let failedSpecCount = 0;
    let failedTCCount = 0;
    let passedTCCount = 0;
    let blockedTCCount = 0;
    let skippedTCCount = 0;

    //count different level of test cases
    summaryJSONArray.forEach((item) => {
        if (item.failed.size > 0) {
            failedSpecCount++;
            failedTCCount += item.failed.size;
            blockedTCCount += item.pending.size;
        }
        passedTCCount += item.passed.size;
        totalTCCount += item.total.size;
        skippedTCCount += item.excluded.size;
    });

    // start to print the result summary in console
    logger.info('\n\n');
    logger.info('****************************** Test Result Summary ******************************');
    console.log(
        'Run ' +
            summaryJSONArray.length +
            ' Spec Files, ' +
            `${chalk.bold.green(summaryJSONArray.length - failedSpecCount + ' passed, ')}` +
            `${chalk.bold.red(failedSpecCount + ' failed.')}`
    );
    console.log(
        'Run ' +
            totalTCCount +
            ' test cases, ' +
            `${chalk.bold.green(passedTCCount + ' passed, ')}` +
            `${chalk.bold.red(failedTCCount + ' failed, ')}` +
            `${chalk.bold.yellow(blockedTCCount + ' blocked, ')}` +
            `${chalk.bold.grey(skippedTCCount + ' skipped.')}`
    );
    if (failedSpecCount > 0) {
        logger.info('\n' + '============================== Failed Summary ==============================');
        logger.error('Failed Spec Files:');
    }
    summaryJSONArray.forEach((item) => {
        if (item.failed.size > 0) {
            console.log(item.specFile.split('/').slice(-2).join('/') + '(' + item.failed.size + ' failed)');
            item.failed.forEach((failedItem) => {
                console.log('- ' + failedItem.replace(/\[(.*?)\]/, '$1'));
            });
        }
    });

    if (failedSpecCount > 0) {
        logger.error('\n' + 'Failed test cases:');
    }
    const failedTCList = [];
    summaryJSONArray.forEach((item) => {
        item.failed.forEach((failedItem) => {
            failedTCList.push(failedItem.replace(/\[(.*?)\]/, '$1'));
        });
    });
    console.log(failedTCList.join(','));

    if (failedSpecCount > 0) {
        logger.info('\n' + '------------------------------ Failed Detail ------------------------------');
    }
    summaryJSONArray.forEach((item) => {
        if (item.failed.size > 0) {
            console.log(item.specFile + '(' + item.failed.size + ' failed)');
        }
        item.failed.forEach((failedItem) => {
            let runtime = 0;
            item.failedExpectation.forEach((failedDes, index) => {
                if (failedDes.tcDes.includes(failedItem)) {
                    if (runtime == 0) {
                        logger.warn('  ' + failedDes.tcDes + ':');
                    }
                    if (failedDes.rerunIndex != runtime) {
                        runtime++;
                        logger.error('    ✗ run_' + runtime);
                    }
                    logger.error('      - Failed:' + failedDes.message);
                    if (failedDes.stack) {
                        logger.gray('    ' + failedDes.stack.replace(/\n/g, '\n    '));
                    }
                }
            });
        });
    });
}

// parseResult();
