import type { Services } from '@wdio/types';
import { SevereServiceError } from 'webdriverio';
import fs from 'fs-extra';
import path from 'path';
import lockfile from 'proper-lockfile';
import { fileURLToPath } from 'url';
import getLogger from '@wdio/logger';

const Logger = getLogger('service/by-tc');
const isMasterProcess = !process.env.WDIO_WORKER_ID;

export interface ServiceOptions {
    /**
     * specify which test cases to run for the first time
     *
     * The format of the inputFile should be as follows:
     * ```json
     * {
     *   "relativeToCwd/a.spec.js": "ALL",
     *   "relativeToCwd/b.spec.js": ["TC58007", "TC58009"]
     * }
     * ```
     * */
    inputFilePath?: string;

    /**
     * record the result of test cases and determine which failed test cases to run
     *
     * The format of the outputFile should be as follows:
     * ```json
     * [{
     *     specFile: 'relativeToCwd/a.spec.js',
     *     startTime: datestring,
     *     passed?: [],
     *     failed?: ["[TC73252]", "[TC73252]", "xxx"],
     *     pending?: [],
     *     excluded?: [],
     *     finishTime?: datestring,
     * }]
     * ```
     */
    outputFilePath?: string;
}

interface InputJSON {
    [specFile: string]: string | string[];
}

interface OutputJSON {
    specFile: string;
    startTime: string;
    passed?: string[];
    failed?: string[];
    pending?: string[];
    excluded?: string[];
    finishTime?: string;
}

/**
 * We expect wdio is running in the root of the project (aka the folder containing package.json)
 * By default, whenever we use npm-scripts to run wdio, the current working directory is the root of the project.
 * @see https://docs.npmjs.com/cli/v9/commands/npm-run-script
 */
const DEFAULT_OPTIONS: Required<ServiceOptions> = {
    inputFilePath: path.join(process.cwd(), './.by-tc/input.json'),
    outputFilePath: path.join(process.cwd(), './.by-tc/output.json'),
};

const RUN_ALL_TCS = '*';
const SERVICE_NAME = 'by-tc';

/**
 * This service is used to run specific test cases firstly and only retry failed test cases.
 * Both inputFile and outputFile are used to determine which test cases to run.
 * The inputFile is used to determine which test cases to run firstly
 * while the outputFile is used to record the result of the completed test cases.
 *
 * This service will not determine which specFile to run for it is implemented by wdio specFileRetries.
 * For the first run, we need to pass in --spec to wdio to specify which specFile to run.
 * For the retry run, wdio specFileRetry would take care of it.
 *
 * ## Rules about which test cases to run:
 *
 * 1. The outputFile take priority over the inputFile.
 * 2. If the entry in the inputFile/outputFile says "ALL", it will run all test cases in that file.
 * 3. Otherwise it will run the specified test cases in the array.
 * 4. If there are multiple entries for the same file in the outputFile, it will use the last entry as they are ordered by time.
 * 5. If there is no entry for the specified file in the outputFile, then it will use inputFile to determine.
 * 6. If there is no entry for the specified file in the inputFile, then it will run all test cases in that file.
 *
 * As per the rule 6, it is possible to pass in an empty inputFile.
 *
 * ## Note:
 *
 * For a single specFile, there will be 2 occasions of writing content to the outputFile.
 * The first is before the specFile is to run, the second is after the specFile is completed.
 * If the second write is not successful, this entry will be seen as invalid and will be ignored.
 */
export default class ByTcWorkerService implements Services.ServiceInstance {
    options: Required<ServiceOptions>;

    constructor(serviceOptions: ServiceOptions = {}) {
        this.options = Object.assign(DEFAULT_OPTIONS, serviceOptions) as Required<ServiceOptions>;
        this.options.inputFilePath = path.resolve(this.options.inputFilePath);
        this.options.outputFilePath = path.resolve(this.options.outputFilePath);

        if (isMasterProcess) Logger.debug('options:', this.options);

        this.readInputFile = this.readInputFile.bind(this);
        this.readOutputFile = this.readOutputFile.bind(this);
    }

    async onPrepare(): Promise<void> {
        fs.ensureFileSync(this.options.inputFilePath);

        // Make sure outputFile is an empty file so that previous content will not impact this run
        fs.ensureFileSync(this.options.outputFilePath);
        fs.writeFileSync(this.options.outputFilePath, '');
    }

    readInputFile(): InputJSON {
        const { inputFilePath } = this.options;

        let inputJSON: InputJSON;
        try {
            inputJSON = fs.readJSONSync(inputFilePath);
        } catch (error) {
            inputJSON = {};
        }

        return inputJSON;
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

    async before(_: unknown, specFileFileURLs: string[]): Promise<void> {
        const { outputFilePath } = this.options;
        const { readOutputFile } = this;

        const inputJSON = this.readInputFile();
        const outputJSONArray = this.readOutputFile();

        // As of now, this service does not support multi specFiles in one single process yet.
        if (specFileFileURLs.length > 1) {
            throw new SevereServiceError(
                `[${SERVICE_NAME}]: does not support multi specFiles "${specFileFileURLs}" in one single process`
            );
        }

        // Normalize the path to relative path to cwd
        const specFileRelativePaths = specFileFileURLs.map((specFile) => {
            const absolutePath = fileURLToPath(specFile);
            // We need to normalize windows-style path \ to posix-style path /
            const relativePath = path.relative(process.cwd(), absolutePath).split(path.sep).join(path.posix.sep);
            return relativePath;
        });

        // Get all test cases that need to run
        const TCsNeededToRun = specFileRelativePaths
            .map((relativePath) => {
                const initInput = inputJSON[relativePath];
                const latestResultForThisSpecFile = outputJSONArray
                    .filter((entry) => entry.specFile === relativePath && !!entry.finishTime)
                    .reverse()[0];

                let needToRun: string | string[];
                if (latestResultForThisSpecFile?.failed && latestResultForThisSpecFile.failed.length > 0) {
                    needToRun = latestResultForThisSpecFile.failed;
                } else if (initInput) {
                    needToRun = initInput;
                } else {
                    needToRun = RUN_ALL_TCS;
                }

                Logger.info(`Spec File: ${relativePath} needs to run: ${needToRun}`);

                return needToRun;
            })
            .flat();

        Logger.debug(`Current Spec File: ${specFileRelativePaths.join(',')}`);
        Logger.debug(`TCs needed to run: ${TCsNeededToRun.join(',')}`);

        // Determine which test cases to run
        jasmine.getEnv().configure({
            specFilter: (spec) => {
                if (TCsNeededToRun.includes(RUN_ALL_TCS)) {
                    return true;
                }

                const tcDesc = spec.description;
                return TCsNeededToRun.some((tcIdOrTcDesc) => {
                    const isTcId = tcIdOrTcDesc.startsWith('[') && tcIdOrTcDesc.endsWith(']');
                    if (isTcId) {
                        return tcDesc.startsWith(tcIdOrTcDesc);
                    } else {
                        return tcDesc === tcIdOrTcDesc;
                    }
                });
            },
        });

        const outputJSON: Required<OutputJSON> = {
            specFile: specFileRelativePaths[0],
            startTime: '',
            passed: [],
            failed: [],
            pending: [],
            excluded: [],
            finishTime: '',
        };

        // Track the status of each test case and write it into the output File.
        // Instead of using wdio afterTest/after hook
        // we use jasmine custom reporter to get more detailed information
        jasmine.getEnv().addReporter({
            async jasmineStarted() {
                // Since multi processes are using the same output file
                // we need to lock it to maintain the integrity
                const release = await lockfile.lock(outputFilePath, { retries: 5 });

                const outputJSONArray = readOutputFile();
                outputJSON.startTime = new Date().toISOString();
                outputJSONArray.push(outputJSON);
                fs.writeJSONSync(outputFilePath, outputJSONArray, { spaces: 2 });

                await release();
            },
            async specDone(result) {
                const { status, description } = result;
                // to match pattern such as [TC1234]
                const tcIdPattern = /(^\[[^\]]+\])/;
                let [, tcId] = description.match(tcIdPattern) || [];
                tcId = tcId || description;

                Logger.debug(`The status of test case: ${tcId} is ${status}`);

                // For all status values, see https://github.com/jasmine/jasmine/blob/v5.0.1/src/core/Spec.js#L239
                if (status === 'passed') {
                    outputJSON.passed.push(tcId);
                } else if (status === 'failed') {
                    outputJSON.failed.push(tcId);
                } else if (status === 'pending') {
                    outputJSON.pending.push(tcId);
                } else if (status === 'excluded') {
                    outputJSON.excluded.push(tcId);
                }
            },
            async jasmineDone() {
                const release = await lockfile.lock(outputFilePath, { retries: 5 });

                const outputJSONArray = readOutputFile();
                outputJSON.finishTime = new Date().toISOString();
                const index = outputJSONArray.findIndex(
                    (entry) => entry.startTime === outputJSON.startTime && entry.specFile === outputJSON.specFile
                );
                outputJSONArray.splice(index, 1, outputJSON);
                fs.writeJSONSync(outputFilePath, outputJSONArray, { spaces: 2 });

                await release();
            },
        });
    }
}
