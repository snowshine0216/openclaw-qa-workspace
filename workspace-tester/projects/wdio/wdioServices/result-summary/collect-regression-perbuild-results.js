import yargs from 'yargs';
import path from 'path';
import fs from 'fs-extra';
import request from 'request';
import { postTeamsNotificationToRegressionChanel } from './collect-auto-results.js';

const argv = await yargs()
    .parserConfiguration({ 'strip-dashed': true, 'strip-aliased': true })
    .options({
        buildUrl: {
            describe: 'ai bot multi job build url',
            demandOption: true,
            type: 'string',
        },
        buildNumber: {
            describe: 'server build number',
            demandOption: true,
            type: 'string',
        },
    })
    .parse(process.argv.slice(2));

async function collectRegressionPerBuildResults() {
    const testSuites = await scanSpecConfigToGetAllBotTestSuites();
    const filter = {
        buildNumber: argv.buildNumber,
        product: 'Library Web Tanzu',
        testSuites,
    };
    const results = await queryRegressionPerBuildResultsByFilter(filter);
    await postTeamsNotificationToRegressionChanel(results, argv);
}

async function scanSpecConfigToGetAllBotTestSuites() {
    return new Promise((resolve, reject) => {
        const testSuites = [];
        const specConfigFolder = path.resolve(process.cwd(), 'specs', 'regression', 'config');
        if (!fs.existsSync(specConfigFolder)) {
            reject(`[ERROR] Spec config folder not exists at ${specConfigFolder}`);
        }
        const files = fs.readdirSync(specConfigFolder);
        for (const file of files) {
            if (!file.endsWith('.config.xml')) {
                continue;
            }
            const regex = /Bot|AutoAnswer_E2E|AutoAnswer_AIContext|ThumbDownRestAPI/g;
            const match = file.match(regex);
            if (!match) continue;
            const testSuiteName = file.replace(/.config.xml/g, '');
            testSuites.push(testSuiteName);
        }
        resolve(testSuites);
    });
}

async function queryRegressionPerBuildResultsByFilter(filter) {
    const options = {
        url: 'http://ctc-android2.labs.microstrategy.com:8088/api/v3/container',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        json: filter,
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                console.info(`[INFO] Query automation data successfully. filter=${JSON.stringify(filter)}`);
                resolve(body);
            } else {
                console.error(`[ERROR] Failed to query automation data by filter=${JSON.stringify(filter)}`);
                console.error(`[ERROR] Error: ${error}; Status Code: ${response.statusCode}`);
                reject(error);
            }
        });
    });
}

await collectRegressionPerBuildResults();
