import botV2RestAPI, { sendAPIRequest } from './botV2API.js';
import urlParser from '../urlParser.js';
import authentication from '../authentication.js';
import logout from '../logout.js';

export async function dumpCubes({ baseUrl, credentials, projectId, cubeObjects }) {
    const params = {
        projectId,
        options: {
            url: `api/cubes/dumpcubes`,
            method: 'POST',
        },
        json: {
            cubeObjects: cubeObjects,
        },
    };
    await botV2RestAPI({ baseUrl, group: 'Dump bot v2 cubes', credentials, params });
}

export async function getCubeStatus({ baseUrl, credentials, projectId, cubeIds }) {
    const params = {
        projectId,
        options: {
            url: `api/v2/bots/cubes/status`,
            method: 'POST',
        },
        json: {
            cubeIds: cubeIds,
        },
    };
    return await botV2RestAPI({ baseUrl, group: 'Get bot v2 cubes results', credentials, params });
}

export async function enableAI({ baseUrl, credentials, projectId, cubeObjects, timeout = 10 * 60 * 1000 }) {
    const interval = 10 * 1000; // 10 seconds
    const requestTimeout = 2 * 60 * 1000; // 120 seconds for each API call

    // Step 2: Dump cubes
    logWithTimestamp(`Start dumping cubes...`);
    try {
        await withTimeout(dumpCubes({ baseUrl, credentials, projectId, cubeObjects }), requestTimeout);
    } catch (error) {
        console.error(`Error during dumping cubes: ${error.message}`);
        throw new Error('Failed to dump cubes. Please check the cube IDs.');
    }

    const successfulCubes = [];
    const failedCubes = [];
    const cubeIds = cubeObjects.map((cube) => cube.cubeId);

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
                logWithTimestamp(`###### cube results ######`);
                logWithTimestamp(`Success!`);
                logWithTimestamp(`All cubes are ready to use!`);
                successfulCubes.push(...cubeIds);
                break;
            }
        } else {
            logWithTimestamp(`Mismatch in cube count. Expected: ${cubeIds.length}, Found: ${cubeResults.cubes.length}`);
            logWithTimestamp(`Waiting for all cubes to start...`);
        }
        if (elapsed + interval > timeout) {
            logWithTimestamp(`###### cube results ######`);
            logWithTimestamp(`Failed! Time out!`);
            logWithTimestamp(`Still not ready after ${timeout / 1000 / 60} minutes.`);
            break;
        }

        await new Promise((resolve) => setTimeout(resolve, interval));
    }

    return { successfulCubes, failedCubes };
}

function logWithTimestamp(message) {
    console.log(`[${new Date().toISOString()}] ${message}`);
}

async function withTimeout(promise, timeoutMs) {
    return Promise.race([
        promise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out')), timeoutMs)),
    ]);
}

async function updatePropertySet({ baseUrl, session, projectId, objectId }) {
    const params = {
        projectId,
        options: {
            url: `api/objects/${objectId}/type/3/propertySets`,
            method: 'PUT',
        },
        json: [
            {
                id: '70A27C6E239911D5BF2200B0D02A21E0',
                properties: [
                    {
                        id: 16,
                        value: 0,
                    },
                ],
            },
        ],
    };
    await sendAPIRequest({ baseUrl, group: `Disable for AI (objectId: ${objectId})`, session, params });
}

export async function disableAI({ credentials, projectId, objectIds }) {
    console.log('Disable for AI by api:');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    await Promise.all(objectIds.map((objectId) => updatePropertySet({ baseUrl, session, projectId, objectId })));
    await logout({ baseUrl, session });
}
