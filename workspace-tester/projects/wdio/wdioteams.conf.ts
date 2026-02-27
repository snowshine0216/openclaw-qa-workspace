// built-in modules
import path from 'path';
import http from 'http';
import https from 'https';

// 3rd party libraries
import yargs from 'yargs';
import deepmerge from 'deepmerge';
import fs from 'fs-extra';
import chalk from 'chalk';
import ci from 'ci-info';

// project internal modules
import pageBuilder from './pageObjects/pageBuilder.js';
import ByTcService from './wdioServices/by-tc/index.js';
import SinceService from './wdioServices/since/index.js';
import SpectreService from './wdioServices/spectre/index.js';
import ResultSummaryService from './wdioServices/result-summary/index.js';
import TeamsAppWorkerService from './wdioServices/teams-app/worker.js';
import selectTc from './scripts/selectTC.js';
import getLogger from './scripts/logger.js';
import getAvailablePort from './utils/getAvailablePort.js';
import * as consts from './constants/index.js';
import { REPORTS_FOR_ALLUER, REPORTS_FOR_VIDEO } from './constants/wdioConfig.js';
import './ca/patch.js';
import { isMac } from './utils/platform-util.js';
import { type Services } from '@wdio/types';
import { teamsApp } from './constants/teams.js';

const logger = getLogger('');
const downloadDirectory = consts.downloadDirectory;
const yargsInstance = yargs();
const argv = await yargsInstance
    .parserConfiguration({ 'strip-dashed': true, 'strip-aliased': true })
    .version(false)
    .wrap(yargsInstance.terminalWidth() - 10)
    // use `npx wdio run ./wdio.conf.ts -h` to see help info
    .options({
        teams: {
            describe: 'Where to use Teams, web or dekstop',
            choices: ['web', 'desktop'],
            default: 'desktop',
        },
        baseUrl: {
            describe: 'WDIO base url',
            demandOption: false,
        },
        specKind: {
            describe: 'What kind of e2e you want to run',
            choices: ['regression', 'demo', 'infra-test', 'regression-hq', 'performance'],
            default: 'regression',
        },
        // Pick test cases or spec files to run.
        featureList: {
            describe: 'Run by feature list, such as "Favorites,Bookmark"',
            type: 'string',
        },
        tcList: {
            describe: 'Run by TC list, such as "TC31543,TC73329"',
            type: 'string',
        },
        xml: {
            describe: 'Run by xml config, such as "specs/regression/config/test.config.xml"',
            type: 'string',
            normalize: true,
        },
        glob: {
            describe: 'Run by specFiles of glob pattern, such as "specs/demo/*/*.spec.js"',
            type: 'string',
        },
        // For custom parameters
        params: {
            describe: 'You can specify custom params such as --params.xx.yy',
        },
        'spectre.enable': {
            type: 'boolean',
            default: true,
        },
        'spectre.url': {
            type: 'string',
            default: 'http://10.23.33.4:3000',
        },
        'spectre.projectName': {
            type: 'string',
            default: ci.isCI ? 'WDIO_CI' : 'WDIO_Dev',
        },
        'spectre.enableDiff': {
            describe: 'whether to enable image comparison',
            type: 'boolean',
            default: true,
        },
        'spectre.tolerance': {
            describe: 'diff tolerance',
            type: 'number',
            default: 0.1,
        },
        'byTC.inputFilePath': {
            describe: 'byTC service inputFilePath parameter',
            type: 'string',
        },
        'byTC.outputFilePath': {
            describe: 'byTC service outputFilePath parameter',
            type: 'string',
        },
        'save2DB.buildNumber': {
            describe: 'Web client buildNumber',
            type: 'string',
            default: '',
        },
        'save2DB.serverName': {
            describe: 'Machine name installing platform',
            type: 'string',
            default: '',
        },
        'save2DB.testSuite': {
            describe: 'Same to jobName, should be the xxx.config.xml file name',
            type: 'string',
            default: '',
        },
        'save2DB.product': {
            describe: 'Product under test',
            type: 'string',
            default: '',
        },
        'save2DB.owner': {
            describe: 'Feature owner, should be aligned to owner in CT.Auto',
            type: 'string',
            default: '',
        },
        'save2DB.team': {
            describe: 'Scrum team in rally project',
            type: 'string',
            default: '',
        },
        'save2DB.postExecutionResults': {
            type: 'string',
            default: '',
            describe: 'The code to post results to DB',
        },
        'save2DB.enableTeamsMessage': {
            type: 'boolean',
            default: false,
            describe: 'Post automation results by teams notification',
        },
        'save2DB.buildUrl': {
            describe: 'Build url of the automation job',
            type: 'string',
            default: 'http://tec-l-1081462.labs.microstrategy.com:8080/',
        },
        addsIn: {
            describe: 'Microsoft Office adds-in, e.g.MSTRPowerPoint/1.0 or MSTRExcel/1.0',
            type: 'string',
            default: '',
        },
    })
    .group(['featureList', 'tcList', 'xml', 'glob'], 'Options to specify specFiles to run')
    .parse(process.argv.slice(2));

const specKind = argv.specKind;
const pickedSpecFiles = pickSpecFilesAndTestcases(argv, specKind);

// Handle environment variables
const { HEADLESS, MAX_INSTANCES, RETRY, MAC_EDGEDRIVER_VERSION, ENABLE_TEST_THIRD_PARTY_COOKIE_PHASEOUT } = process.env;
const headlessOptions = HEADLESS ? ['headless', 'disable-gpu', 'window-size=1200,800'] : [];
const maxInstances = parseInt(MAX_INSTANCES || '1', 10);
const specFileRetries = parseInt(RETRY || '1', 10);
const macEdgeDriverVersion = MAC_EDGEDRIVER_VERSION || '124.0.2478.105';
const enable_test_third_party_cookie_phaseout = ENABLE_TEST_THIRD_PARTY_COOKIE_PHASEOUT
    ? ['test-third-party-cookie-phaseout']
    : [];

// Handle file system
const CURRENT_VERSION_FILE = path.resolve(process.cwd(), 'CurrentVersion.txt');
const CHROME_DRIVER_PORT = await getAvailablePort();

const capabilities =
    argv.teams === 'web'
        ? [
              {
                  browserName: 'chrome',
                  acceptInsecureCerts: true,
                  'goog:chromeOptions': {
                      // more on this site: https://sites.google.com/chromium.org/driver/capabilities
                      args: [
                          ...headlessOptions,
                          ...(argv.addsIn ? [`--user-agent=${argv.addsIn}`] : []),
                          ...enable_test_third_party_cookie_phaseout,
                      ],
                      prefs: {
                          //Automatically accept notifications from collaboration service
                          'profile.managed_default_content_settings.notifications': 1,
                          download: {
                              prompt_for_download: false,
                              directory_upgrade: true,
                              default_directory: downloadDirectory, // Configure Chrome download directory
                          },
                      },
                  },
              },
          ]
        : [
              {
                  browserName: 'msedge',
                  ...(isMac() ? { browserVersion: macEdgeDriverVersion } : {}),
                  acceptInsecureCerts: true,
                  'ms:edgeOptions': {
                      debuggerAddress: `127.0.0.1:9222`,
                  },
              },
          ];

const serviceDriver: Services.ServiceEntry =
    argv.teams === 'web' ? ['chromedriver', { port: CHROME_DRIVER_PORT }] : [TeamsAppWorkerService, {}];

export const DEFAULT_PARAMS = {
    credentials: {
        teamsUsername: 'LeeG@nvy2.onmicrosoft.com',
        teamsPassword: '',
        username: '',
        password: '',
        webServerUsername: 'admin',
        webServerPassword: 'admin',
    },
    loginType: 'default',
    mstrWebUrl: '',
    dbUrl: '',
    browser: {
        browserName: 'chrome',
    },
    teamsAppName: teamsApp,
};

// Same CLI options take priority over this config object, such --waitforTimeout --baseUrl
export const config: WebdriverIO.Config = {
    // local means run tests in nodejs environment, aka e2e modes
    runner: 'local',
    automationProtocol: 'webdriver',
    // --spec specs/demo/specFolder/b.spec.js can override specs property
    specs: pickedSpecFiles || [],
    suites: {
        infra: ['specs/infra-test/specFolder/b.spec.js'],
    },
    maxInstances: maxInstances,
    capabilities: capabilities,

    // ===================
    // Test Configurations
    // ===================
    // Level of logging verbosity: silent| trace | debug | info | warn | error
    logLevel: 'error',
    logLevels: {
        // webdriver: 'info',
        'service/spectre': 'info',
    },

    baseUrl: '',
    // Default timeout for all waitFor* commands.
    waitforTimeout: 5 * 1000,

    connectionRetryTimeout: 2 * 60 * 1000,
    agent: {
        // US515069, some driver don't like many parallel requests
        http: new http.Agent({ keepAlive: true, maxSockets: 10 }),
        https: new https.Agent({ keepAlive: true, maxSockets: 10 }),
    },

    specFileRetries,
    bail: 0, // don't bail; run all tests

    services: [
        serviceDriver,
        [ByTcService, Object.assign({}, argv.byTC)],
        [SinceService, {}],
        [SpectreService, Object.assign({}, argv.spectre)],
        [ResultSummaryService, Object.assign({}, argv.save2DB, { tcList: argv.tcList })],
    ],
    reporters: [
        // [
        //     // 'spec',
        //     // {
        //     //     onlyFailures: false,
        //     //     showPreface: false,
        //     // },
        // ],
        [
            'video',
            {
                outputDir: REPORTS_FOR_VIDEO,
                saveAllVideos: false, // If true, also saves videos for successful test cases
                videoSlowdownMultiplier: 3, // Higher to get slower videos, lower for faster videos [Value 1-100]
            },
        ],
        [
            'allure',
            {
                outputDir: REPORTS_FOR_ALLUER,
                disableWebdriverStepsReporting: true,
                disableWebdriverScreenshotsReporting: true,
                disableMochaHooks: true,
            },
        ],
    ],

    framework: 'jasmine',
    jasmineOpts: {
        defaultTimeoutInterval: 15 * 60 * 1000,
    },

    // =====
    // Hooks for master process
    // including onPrepare, onComplete, onWorkerStart, onWorkerEnd
    // =====
    onPrepare: async function () {
        await fs.emptyDir(REPORTS_FOR_ALLUER);
        await fs.emptyDir(REPORTS_FOR_VIDEO);
    },

    onComplete: async () => {},

    // =====
    // Hooks for worker process
    // including beforeSession, before, after, afterSession
    // =====
    beforeSession: async function () {
        global.browsers = {
            // When we run wdio like `wdio run ./wdio.conf.ts --params.credentials.username=abc`
            // We can access this variable in specFile like `browsers.params.credentials.username`
            params: deepmerge(DEFAULT_PARAMS, argv.params || {}),
            pageObj1: pageBuilder(),
        };
    },
    before: async function () {
        // Add assistant log for better understanding
        const jasmineEnv = jasmine.getEnv();
        jasmineEnv.addReporter({
            suiteStarted(suiteInfo) {
                logger.gray(`👉 ${suiteInfo.description}`);
            },
            specStarted(tc) {
                logger.gray(`👉👇 ${tc.description}`);
            },
            specDone(tc) {
                if (tc.status === 'excluded' || tc.status === 'pending') {
                    logger.gray(`👉🚫 ${tc.description}`);
                } else if (tc.status === 'failed') {
                    logger.gray(`👉❌ ${tc.description}`);
                } else if (tc.status === 'passed') {
                    logger.gray(`👉✅ ${tc.description}`);
                }
            },
        });

        // // Get Library version info
        // global.buildVersion = await browsers.pageObj1.loginPage.getLibraryVersion(
        //     browser.options.baseUrl,
        //     browsers.params.loginType.toLowerCase()
        // );
        // logger.log('Library version is: ' + chalk.blue(global.buildVersion));
        fs.writeFileSync(CURRENT_VERSION_FILE, '1.0');
    },

    // =====
    // Hooks for Jasmine framework execution inside the worker process
    // including beforeCommand, afterCommand, beforeHook, afterHook, beforeSuite, befo1est, afterTest, afterSuite
    // =====
    beforeSuite: async function () {
        if (argv.teams === 'desktop') {
            await browser.pause(10000);
        } else if (argv.teams === 'web') {
            await browser.url('https://teams.microsoft.com');
            await browsers.pageObj1.azureLoginPage.loginToAzure(browsers.params.credentials.teamsUsername);
            await browsers.pageObj1.azureLoginPage.loginWithPassword(browsers.params.credentials.teamsPassword);
            await browsers.pageObj1.azureLoginPage.safeContinueAzureLogin();
            await browser.pause(5000);
            await browser.refresh();
            await browsers.pageObj1.mainTeams.waitForChatView();
            await browsers.pageObj1.mainTeams.switchToAppInSidebar('Teams');
            await browsers.pageObj1.mainTeams.waitForTeamsView();
            console.log('Login to Teams successfully...');
        }
    },
    beforeTest: async function () {},
    afterSuite: async function () {
        if (argv.teams === 'web') {
            await browsers.pageObj1.libraryPage.switchToTab(0);
            await browser.switchToFrame(null);
            await browsers.pageObj1.mainTeams.signOutFromTeams(browsers.params.credentials.teamsUsername);
        }
    },

    autoCompileOpts: {
        autoCompile: true,
        tsNodeOpts: {
            project: './tsconfig.json',
            transpileOnly: true,
        },
    },
};

function pickSpecFilesAndTestcases({ featureList, tcList, xml, glob }, specKind: string): string[] | null {
    // This environment variable is setup by wdio
    // See https://webdriver.io/docs/api/environment/#wdio_worker_id
    // It only makes sense to specify specs in the master process
    const isMasterProcess = !process.env.WDIO_WORKER_ID;
    if (!isMasterProcess) return null;

    const inputJSON = selectTc(
        { featureList, tcList, xml },
        {
            // resolveBaseDir: path.join('specs', specKind), <- Avoid using it, it joins paths with "\" on Windows, causing inconsistency in "globPattern"
            resolveBaseDir: `specs/${specKind}`,
        }
    );

    fs.ensureFileSync('.by-tc/input.json');
    // run by test case level
    if (inputJSON) {
        fs.writeJSONSync('.by-tc/input.json', inputJSON, { spaces: 2 });
        return Object.keys(inputJSON);
    } else {
        // run by spec file level, including --spec, --glob, --suite
        fs.writeFileSync('.by-tc/input.json', '');
        return glob ? [glob] : null;
    }
}
