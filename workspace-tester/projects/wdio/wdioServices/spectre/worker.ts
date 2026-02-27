import type { Services, Capabilities } from '@wdio/types';
import { SevereServiceError } from 'webdriverio';
import fetch, { FormData, File } from 'node-fetch';
import chalk from 'chalk';
import getLogger from '@wdio/logger';
import allureReporter from '@wdio/allure-reporter';
import getCustomizedLogger from '../../scripts/logger.js';
import { Status } from 'allure-js-commons';
import fs from 'fs-extra';
import { getWindowSize } from '../../config/setWindowSize.js';

const Logger = getLogger('service/spectre');
const isMasterProcess = !process.env.WDIO_WORKER_ID;

export interface ServiceOptions {
    /** Whether to enable this service, default to true */
    enable: boolean;
    /** The spectre service base URL, such as http://10.23.33.4:3000 */
    url: string;
    /** The project name on spectre service */
    projectName: string;
    /** Whether to enable image comparison, default to true */
    enableDiff: boolean;
    /** The toleration on the difference with baseline*/
    tolerance: number;
    /** Selected color theme, default is empty, it will add suffix to screenshot name if any */
    theme: string;
}

const DEFAULT_OPTIONS = {
    enable: true,
    enableDiff: true,
    tolerance: 0.1,
    theme: '',
};

type InitResponse = {
    id: number;
    sequential_id: number;
    url: string;
};

type AddTestResponse = {
    name: string;
    pass: boolean;
    url: string;
    diff: number;
};

type AddTestRequestOptions = {
    name: string;
    browser: string;
    size: string;
    screenShot: string;
    diffThreshold?: string;
    sourceUrl?: string;
    fuzzLevel?: string;
    highlightColour?: string;
};

type CompareScreenshotOptions = {
    /** The wdio element to take screenshot of, take the whole screen of browser if ignored */
    element?: WebdriverIO.Element;
    /** The wdio browser in case there are multiple browser instances in one specFile */
    browser?: WebdriverIO.Browser;
    /** the toleration on the difference with baseline */
    tolerance?: number;
};

type CompareImageOptions = {
    /** The wdio browser in case there are multiple browser instances in one specFile */
    browser?: WebdriverIO.Browser;
    /** the toleration on the difference with baseline */
    tolerance?: number;
};

export type FnCompareScreenshot = (name: string, opts: CompareScreenshotOptions) => Promise<Partial<AddTestResponse>>;

export type FnCompareImageWithBaseline = (
    image: string,
    imageName: string,
    opts: CompareImageOptions
) => Promise<Partial<AddTestResponse>>;

/**
 * The data structure for saving screenshot is
 *      http://${server}/projects/${projectName}/suites/${suiteName}/runs/${RunId}
 *          - ${screenshotName}
 *          - ${screenshotName}
 * Example: http://10.23.33.4:3000/projects/library-e2e-post-ci/suites/e2e-favorites
 */
export default class SpectreWorkerService implements Services.ServiceInstance {
    options: ServiceOptions;

    constructor(serviceOptions: ServiceOptions) {
        this.options = Object.assign(DEFAULT_OPTIONS, serviceOptions);
        if (isMasterProcess) Logger.debug('options:', this.options);
        // spectre options couldn't be shared in different projects, so for CI, we need to reassign the default tolerance value otherwise it will use 0
        if (this.options.projectName == 'WDIO_CI') {
            this.options.tolerance = 0.1;
        }
    }

    /** init session with spectre service */
    async initSession(suiteName: string): Promise<InitResponse> {
        const { url, projectName } = this.options;
        const params = new URLSearchParams();
        params.append('project', projectName);
        params.append('suite', suiteName);

        const response = await fetch(`${url}/runs`, { method: 'POST', body: params });
        if (response.status !== 200) {
            const txt = await response.text();
            throw new SevereServiceError(`${url}/runs returns response code: ${response.status} ${txt}`);
        }
        const data = (await response.json()) as InitResponse;
        return data;
    }

    /** compare image with baseline */
    async compareWithBaseline(
        suiteName: string,
        runId: string,
        options: AddTestRequestOptions
    ): Promise<AddTestResponse> {
        const { url, projectName, theme } = this.options;
        const pngFileBlob = Buffer.from(options.screenShot, 'base64');
        const pngFile = new File([pngFileBlob], options.name, { type: 'image/png' });
        if (theme) {
            options.name = `${options.name} - ${theme}`;
        }
        const formData = new FormData();
        formData.set('test[project]', projectName);
        formData.set('test[suite]', suiteName);
        formData.set('test[run_id]', runId);

        formData.set('test[name]', options.name);
        formData.set('test[browser]', options.browser);
        formData.set('test[size]', options.size);
        formData.set('test[screenshot]', pngFile);
        formData.set('test[diff_threshold]', options.diffThreshold || '');
        formData.set('test[source_url]', options.sourceUrl || '');
        formData.set('test[fuzz_level]', options.fuzzLevel || '');
        formData.set('test[highlight_colour]', options.highlightColour || '');

        const response = await fetch(`${url}/tests`, { method: 'POST', body: formData });
        const data = (await response.json()) as AddTestResponse;
        // convert relative URL path to absolute URL path
        data.url = new URL(data.url, url).toString();

        return data;
    }

    /**
     * 1. Add a custom jasmine matcher `toMatchBaseline` to customize the failure message
     * 2. Add a custom jasmine matcher `toMatchImageSnapshot` to customize the failure message and generate the image compare infomation into the allure report
     * 3. Add a custom wdio command to take screenshot of full screen or a element, and compare it with the baseline in spectre server
     *
     * You can use like this
     * ```javascript
     *     await expect(browser.compareScreenshot("screenShotName")).toMatchBaseline();
     * ```
     * For toMatchImageSnapshot, can use like this
     * ```javascript
     *     await expect({ result: result, tolerance: tolerance }).toMatchImageSnapshot();;
     * ```
     */
    async before(_: unknown, specFileFileURLs: string[]): Promise<void> {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const that = this;

        // Setup a custom matcher to customize failure message.
        // There is no better way to do this as far as I know.
        // According to @wdio/jasmine-framework, the `expect` we use is jasmineEnv.expectAsync(), we'd better to use async matchers
        beforeAll(() => {
            jasmine.addAsyncMatchers({
                toMatchBaseline() {
                    return {
                        compare(actual: { name: string; pass: boolean; url: string }) {
                            if (that.options.enableDiff === false) {
                                return Promise.resolve({
                                    pass: true,
                                });
                            }
                            const { name, pass, url } = actual;
                            allureReporter.addStep(
                                `Compare screenshot "${name}" with baseline `,
                                {
                                    name: `image compare of ${name} `,
                                    type: 'text/html',
                                    content: `<a href="${url}">${url}</a>`,
                                },
                                pass ? Status.PASSED : Status.FAILED
                            );
                            return Promise.resolve({
                                pass,
                                message: `Screenshot "${name}" doesn't match the baseline. Visit ${url} for details.`,
                            });
                        },
                    };
                },
                toMatchImageSnapshot() {
                    return {
                        compare: function (result) {
                            const checkResult = result.result;
                            let defaultTolerance = 0.5;
                            if (result.tolerance) {
                                defaultTolerance = result.tolerance;
                            }
                            const pass = Number(checkResult.misMatchPercentage) < Number(defaultTolerance);
                            if (!pass) {
                                const actualImage = fs.readFileSync(checkResult.folders.actual);
                                const expectedImage = fs.readFileSync(checkResult.folders.baseline);
                                const differenceImage = fs.readFileSync(checkResult.folders.diff);
                                allureReporter.startStep(
                                    `Compare ${checkResult.fileName} fail, the misMatchPercentage is ${checkResult.misMatchPercentage}`
                                );
                                allureReporter.addAttachment('diff', differenceImage, 'image/png');
                                allureReporter.addAttachment('actual', actualImage, 'image/png');
                                allureReporter.addAttachment('expected', expectedImage, 'image/png');
                                allureReporter.endStep(Status.FAILED);
                            } else {
                                allureReporter.startStep(
                                    `Compare ${checkResult.fileName} pass, the misMatchPercentage is ${checkResult.misMatchPercentage}`
                                );
                                allureReporter.endStep(Status.PASSED);
                            }

                            return Promise.resolve({
                                pass,
                                message: `Expected to have matched image at ${checkResult.folders.actual}, but there was a difference of ${checkResult.misMatchPercentage}%. 
                                Difference can be viewed at ${checkResult.folders.diff}. Original can be viewed at ${checkResult.folders.baseline}`,
                            });
                        },
                    };
                },
            });
        });

        // In most cases, there should be only one specFile in one wdio worker process.
        const jasmineEnv = jasmine.getEnv();
        const suiteNames = jasmineEnv
            .topSuite()
            .children.map((suite) => suite.description)
            .join('|');

        if (!suiteNames) {
            throw new SevereServiceError(`"${specFileFileURLs}" does not contain any describe/suite`);
        }

        let sessionInfo: InitResponse;
        if (this.options.enable) {
            sessionInfo = await this.initSession(suiteNames);
            Logger.debug('Current suiteName: ' + suiteNames);
            Logger.debug('Current runId of this suite: ', sessionInfo.sequential_id);
        }

        const compareScreenshot: FnCompareScreenshot = async function compareScreenshot(screenshotName, opts = {}) {
            if (that.options.enable === false)
                return {
                    pass: true,
                    name: screenshotName,
                    url: '',
                };

            const browserInstance = opts.browser || browser;
            const { HEADLESS} = process.env;
            const browserName = (browserInstance.capabilities as Capabilities.DesiredCapabilities).browserName;
            let spectreBrowserName = browserName;
            if (browserName === 'chrome' && HEADLESS) {
                spectreBrowserName = "chrome-headless-shell";
            }
            const tolerance = opts.tolerance || that.options.tolerance;
            const windowSize = await getWindowSize();
            
            
            const base64Image = opts.element
                ? await browserInstance.takeElementScreenshot(opts.element.elementId)
                : await browserInstance.takeScreenshot();

            const result = await that.compareWithBaseline(suiteNames, String(sessionInfo.id), {
                name: screenshotName,
                screenShot: base64Image,
                browser: `${process.platform} ${spectreBrowserName}`,
                size: `${windowSize.width}*${windowSize.height}px`,
                diffThreshold: '' + tolerance,
            });
            const { name, url, pass, diff } = result;
            Logger.debug(
                `Image comparison of "${screenshotName}" is ${pass ? 'passed' : 'failed'}, the difference is ${diff}`
            );

            return { name, url, pass, diff };
        };

        browser.addCommand('compareScreenshot', compareScreenshot);

        const compareImageWithBaseline: FnCompareImageWithBaseline = async function compareWithBaseline(
            image,
            imageName,
            opts = {}
        ) {
            const browserInstance = opts.browser || browser;
            const browserName = (browserInstance.capabilities as Capabilities.DesiredCapabilities).browserName;
            const tolerance = opts.tolerance || that.options.tolerance;
            const { width, height } = await browserInstance.getWindowSize();
            const result = await that.compareWithBaseline(suiteNames, String(sessionInfo.id), {
                name: imageName,
                screenShot: image,
                browser: `${process.platform} ${browserName}`,
                size: `${width}*${height}px`,
                diffThreshold: '' + tolerance,
            });
            const { name, url, pass, diff } = result;
            Logger.debug(
                `Image comparison of "${imageName}" is ${pass ? 'passed' : 'failed'}, the difference is ${diff}`
            );

            return { name, url, pass, diff };
        };

        browser.addCommand('compareImageWithBaseline', compareImageWithBaseline);
    }


    async onComplete(): Promise<void> {
        // view more details for spectre server
        if (this.options.enable) {
            const customizedLogger = getCustomizedLogger('');
            const projectURL = `${this.options.url}/projects?project=${encodeURIComponent(this.options.projectName)}`;
            customizedLogger.info('\n' + '\n' + ` Visit Spectre Server: ${chalk.green(projectURL)} for more`);
        }
    }
}
