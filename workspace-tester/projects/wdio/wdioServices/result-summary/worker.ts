import type { Services } from '@wdio/types';
import fs from 'fs-extra';
import path from 'path';
import lockfile from 'proper-lockfile';
import { fileURLToPath } from 'url';
import { SevereServiceError } from 'webdriverio';
import parseResult from './generateTestSummary.js';
import collectAutomationResults from './collect-auto-results.js';
import clearUpAllureResultFiles from './refine-allure-files.js';

export interface ServiceOptions {
    outputFilePath?: string;

    testSuite?: string;

    prodcut?: string;

    owner?: string;

    team?: string;

    tcList?: string;

    buildUrl?: string;

    serverName?: string;

    enableTeamsMessage?: boolean;

    postExecutionResults?: string;

    buildNumber?: string;
}

interface FailedExpectationJSON {
    tcDes: string;
    matcherName: string;
    message: string;
    stack: string;
}

interface TestCaseDetailJSON {
    tcName: string;
    passedSteps: number;
    failedSteps: number;
    passedImageCompareSteps: number;
    failedImageCompareSteps: number;
    duration: number;
}

/** record the result of test cases
    * The format of the outputFile should be as follows:
    * ```json
    * [{
    *     specFile: 'relativeToCwd/a.spec.js',
    *     startTime: datestring,
    *     testCases: [
           {
               "tcName": "[TC1001] E2E User Journey",
               "passedSteps": 1,
               "failedSteps": 2,
               "passedImageCompareSteps": 0,
               "failedImageCompareSteps": 1,
               "duration": 28514
           }]
    *     passed: [TC73251],
    *     failed: ["[TC73252]", "[TC73252]", "xxx"],
    *     failedName: ["[TC1001] E2E User Journey"]
    *     failedExpectation: [
           {
               "tcDes": "[TC1001] E2E User Journey",
               "matcherName": "toBe",
               "message": "Expected '(short)' to be 'xxx'.",
               "stack": "    at <Jasmine>\n    at UserContext.<anonymous> (file:///Users/xinhu/Documents/LibraryAutomation/production/src/react/test/wdio/specs/regression/winky/test.spec.js:117:69)\n    at processTicksAndRejections (node:internal/process/task_queues:96:5)"
           }]
    *     pending?: [],
    *     excluded?: [],
    *     finishTime?: datestring,
    * }]
    * ```
*/
interface OutputJSON {
    specFile: string;
    startTime: string;
    testCases?: TestCaseDetailJSON[];
    passedID?: string[];
    failedID?: string[];
    failedName?: string[];
    failedExpectation?: FailedExpectationJSON[];
    pendingID?: string[];
    excludedID?: string[];
    finishTime?: string;
}

/**
 * We expect wdio is running in the root of the project (aka the folder containing package.json and node_modules)
 * By default, whenever we use npm-scripts to run wdio, the current working directory is the root of the project.
 * @see https://docs.npmjs.com/cli/v9/commands/npm-run-script
 */
const DEFAULT_OPTIONS: ServiceOptions & {
    outputFilePath: NonNullable<ServiceOptions['outputFilePath']>;
} = {
    outputFilePath: path.join(process.cwd(), './.test-result/output.json'),
};

const SERVICE_NAME = 'result-summary';

/**
 * This service is used to record the result of the completed test cases for parsing test summary.

 */
export default class TestSummaryWorkerService implements Services.ServiceInstance {
    options: ServiceOptions & {
        outputFilePath: NonNullable<ServiceOptions['outputFilePath']>;
    };

    constructor(serviceOptions: ServiceOptions) {
        this.options = Object.assign(DEFAULT_OPTIONS, serviceOptions);
        this.readOutputFile = this.readOutputFile.bind(this);
    }

    async onPrepare(): Promise<void> {
        // Make sure outputFile is an empty file so that previous content will not impact this run
        fs.ensureFileSync(this.options.outputFilePath);
        fs.writeFileSync(this.options.outputFilePath, '');
    }

    readOutputFile(): OutputJSON[] {
        const { outputFilePath } = this.options;

        let outputJSONArray: OutputJSON[];
        try {
            outputJSONArray = fs.readJSONSync(outputFilePath);
        } catch (error) {
            outputJSONArray = [];
        }

        return outputJSONArray;
    }

    parseOutputResult(): OutputJSON[] {
        const { outputFilePath } = this.options;

        let outputJSONArray: OutputJSON[];
        try {
            outputJSONArray = fs.readJSONSync(outputFilePath);
        } catch (error) {
            outputJSONArray = [];
        }

        return outputJSONArray;
    }

    async before(_: unknown, specFileFileURLs: string[]): Promise<void> {
        const { outputFilePath } = this.options;
        const { readOutputFile } = this;

        /**
         * As of now, this service does not support multi specFiles in one single process yet.
         */
        if (specFileFileURLs.length > 1) {
            throw new SevereServiceError(
                `[${SERVICE_NAME}]: does not support multi specFiles [${specFileFileURLs}] in one single process`
            );
        }

        // normalize the path to relative path to cwd
        const specFileRelativePaths = specFileFileURLs.map((specFile) => {
            const absolutePath = fileURLToPath(specFile);
            // we need to normalize windows-style path \ to posix-style path /
            const relativePath = path.relative(process.cwd(), absolutePath).split(path.sep).join(path.posix.sep);
            return relativePath;
        });

        const outputJSON: Required<OutputJSON> = {
            specFile: specFileRelativePaths[0],
            startTime: '',
            testCases: [],
            passedID: [],
            failedID: [],
            failedName: [],
            failedExpectation: [],
            pendingID: [],
            excludedID: [],
            finishTime: '',
        };

        // instead of using wdio afterTest/after hook, we use jasmine reporter to get more detailed information
        jasmine.getEnv().addReporter({
            async jasmineStarted() {
                // multi processes are using the same output file, so we need to lock it to maintain the integrity
                const release = await lockfile.lock(outputFilePath, { retries: 5 });

                outputJSON.startTime = new Date().toISOString();
                const outputJSONArray = readOutputFile();
                outputJSONArray.push(outputJSON);
                fs.writeJSONSync(outputFilePath, outputJSONArray, { spaces: 2 });

                await release();
            },
            async specDone(result) {
                const { status, description, failedExpectations, passedExpectations, duration } = result;
                const tcIdPattern = /(^\[[^\]]+\])/;
                let [, tcId] = description.match(tcIdPattern) || [];
                tcId = tcId || description;

                if (status === 'passed' || status === 'failed') {
                    // add test case execution result into result jason
                    const testCaseDetailJSON: TestCaseDetailJSON = {
                        tcName: description,
                        passedSteps: passedExpectations.length,
                        failedSteps: failedExpectations.length,
                        passedImageCompareSteps: 0,
                        failedImageCompareSteps: 0,
                        duration: duration as number,
                    };

                    let passedImageCompareNumber = 0;
                    let failedImageCompareNumber = 0;

                    // push passed expectations into result json
                    passedExpectations.forEach((item) => {
                        if (item.matcherName === 'toMatchScreenshot') passedImageCompareNumber++;
                    });
                    failedExpectations.forEach((item) => {
                        if (item.matcherName === 'toMatchScreenshot') failedImageCompareNumber++;
                    });
                    // count passed/failed imagecompare steps and then push it into test case json
                    testCaseDetailJSON.passedImageCompareSteps = passedImageCompareNumber;
                    testCaseDetailJSON.failedImageCompareSteps = failedImageCompareNumber;
                    outputJSON.testCases.push(testCaseDetailJSON);
                }
                // push failed expectations into result json
                failedExpectations.forEach((item) => {
                    const failedExpectationJSON: FailedExpectationJSON = {
                        tcDes: description,
                        matcherName: item.matcherName,
                        message: item.message,
                        stack: item.stack,
                    };
                    outputJSON.failedExpectation.push(failedExpectationJSON);
                });

                // For all status values, see https://github.com/jasmine/jasmine/blob/v5.0.1/src/core/Spec.js#L239
                if (status === 'passed') {
                    outputJSON.passedID.push(tcId);
                } else if (status === 'failed') {
                    outputJSON.failedID.push(tcId);
                    outputJSON.failedName.push(description);
                } else if (status === 'pending') {
                    outputJSON.pendingID.push(tcId);
                } else if (status === 'excluded') {
                    outputJSON.excludedID.push(tcId);
                }
            },
            async jasmineDone() {
                // write output jason to file
                const release = await lockfile.lock(outputFilePath, { retries: 5 });

                outputJSON.finishTime = new Date().toISOString();
                const outputJSONArray: OutputJSON[] = readOutputFile();
                const index = outputJSONArray.findIndex(
                    (entry) => entry.startTime === outputJSON.startTime && entry.specFile === outputJSON.specFile
                );
                outputJSONArray.splice(index, 1, outputJSON);
                fs.writeJSONSync(outputFilePath, outputJSONArray, { spaces: 2 });

                await release();
            },
        });
    }

    async onComplete(): Promise<void> {
        // generate test summary in console
        await parseResult();
        await clearUpAllureResultFiles();
        await collectAutomationResults(this.options).catch((err) => {
            console.log(`[Error] Failed to collect automation results, errors: ${err}`);
        });
    }
}
