/*
 * Dump cubes and check their status until all the cube are ready.
 * Step 1: Extract dataset and report IDs
 * Step 2: Dump cubes
 * Step 3: Poll for cube status
 *
 * To run this script, run below command:
 * node <path>/dumpData.js --baseUrl=<libraryUrl>  --username=<login name> --password=<login password> --dataset=dumpListForPremerge.json
 */

import fs from 'fs';
import path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { dumpCubes, getCubeStatus } from '../../api/bot2/enableAIAPI.js'; // Assuming these functions are defined in api.js

function logWithTimestamp(message) {
    console.log(`[${new Date().toISOString()}] ${message}`);
}

// Step 1: Extract dataset and report IDs
async function parseFile(datasetFile) {
    try {
        const dumpList = path.resolve(path.dirname(new URL(import.meta.url).pathname), datasetFile);
        const datasets = JSON.parse(fs.readFileSync(dumpList, 'utf-8'));

        const datasetIds = [];
        const reportIds = [];

        datasets.projects.forEach((project) => {
            project.datasets.forEach((dataset) => datasetIds.push(dataset.id));
            project.reports.forEach((report) => reportIds.push(report.id));
        });

        return { datasets, datasetIds, reportIds };
    } catch (error) {
        console.error(`Error parsing dataset file: ${error.message}`);
        throw new Error('Failed to parse dataset file. Please check the file format.');
    }
}

async function withTimeout(promise, timeoutMs) {
    return Promise.race([
        promise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out')), timeoutMs)),
    ]);
}

async function enableAI(baseUrl, credentials, projectId, cubeIds, type) {
    const timeout = 10 * 60 * 1000; // 10 minutes
    const interval = 10 * 1000; // 10 seconds
    const requestTimeout = 2 * 60 * 1000; // 120 seconds for each API call

    // Step 2: Dump cubes
    logWithTimestamp(`Start dumping ${type}`);
    try {
        await withTimeout(dumpCubes({ baseUrl, credentials, projectId, cubeIds }), requestTimeout);
    } catch (error) {
        console.error(`Error during dumping ${type}: ${error.message}`);
        throw new Error('Failed to dump cubes. Please check the cube IDs.');
    }

    const successfulCubes = [];
    const failedCubes = [];

    // Step 3: Poll for cube status
    for (let elapsed = 0; elapsed <= timeout; elapsed += interval) {
        logWithTimestamp(`----- check status(${elapsed / 1000}s) ----- `);
        const cubeResults = await withTimeout(
            getCubeStatus({ baseUrl, credentials, projectId, cubeIds }),
            requestTimeout
        );
        if (cubeResults.cubes.length === cubeIds.length) {
            const statusGroups = cubeResults.cubes.reduce(
                (acc, cube) => {
                    acc[cube.status] = acc[cube.status] || [];
                    acc[cube.status].push(cube.name);
                    return acc;
                },
                { started: [], pending: [], ready: [], decertified: [] }
            );

            logWithTimestamp(`Status: ${JSON.stringify(statusGroups, null, 2)}`);

            if (cubeResults.cubes.every((cube) => cube.status === 'ready')) {
                logWithTimestamp(`###### ${type} results ######`);
                logWithTimestamp(`Success!`);
                logWithTimestamp(`All ${type} are ready to use!`);
                successfulCubes.push(...cubeIds);
                break;
            }
        } else {
            logWithTimestamp(`Mismatch in cube count. Expected: ${cubeIds.length}, Found: ${cubeResults.cubes.length}`);
            logWithTimestamp(`Waiting for all ${type} to start...`);
        }
        if (elapsed + interval > timeout) {
            logWithTimestamp(`###### ${type} results ######`);
            logWithTimestamp(`Failed! Time out!`);
            logWithTimestamp(`Still not ready after ${timeout / 1000 / 60} minutes.`);
            break;
        }

        await new Promise((resolve) => setTimeout(resolve, interval)); // wait 10s for the next check
    }

    return { successfulCubes, failedCubes };
}

async function main() {
    const argv = yargs(hideBin(process.argv))
        .option('baseUrl', {
            type: 'string',
            demandOption: true,
            describe: 'Environment URL',
        })
        .option('username', {
            type: 'string',
            demandOption: true,
            describe: 'Login username',
        })
        .option('password', {
            type: 'string',
            demandOption: true,
            describe: 'Login password',
        })
        .option('dataset', {
            type: 'string',
            demandOption: true,
            describe: 'Dataset file name',
        })
        .help().argv;

    const { baseUrl, username, password, dataset } = argv;

    if (!/^https?:\/\/.+/.test(baseUrl)) {
        throw new Error('Invalid baseUrl. Please provide a valid URL.');
    }

    const credentials = {
        username: username,
        password: password,
    };

    // Parse the dataset
    const { datasets, datasetIds, reportIds } = await parseFile(dataset);
    const projectId = datasets.projects[0].id;

    // Dump datasets
    logWithTimestamp('Prepare to enable AI...');
    if (datasetIds.length > 0) {
        logWithTimestamp('Datasets:', datasetIds);
        await enableAI(baseUrl, credentials, projectId, datasetIds, 'datasets');
    }
    logWithTimestamp('');
    logWithTimestamp('-----------------------------');
    logWithTimestamp('');

    // Dump reports
    if (reportIds.length > 0) {
        logWithTimestamp('Reports:', reportIds);
        await enableAI(baseUrl, credentials, projectId, reportIds, 'reports');
    }
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
