import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getAllSnapshotsURL = `**/api/v2/historyList?scope=SINGLE_LIBRARY_USER**`;
const mockCreationTime = [
    '2025-01-01T00:00:00.000+0000',
    '2025-01-02T00:00:00.000+0000',
    '2025-01-03T00:00:00.000+0000',
    '2025-01-04T00:00:00.000+0000',
    '2025-01-05T00:00:00.000+0000',
    '2025-01-06T00:00:00.000+0000',
    '2025-01-07T00:00:00.000+0000',
    '2025-01-08T00:00:00.000+0000',
    '2025-01-09T00:00:00.000+0000',
    '2025-01-10T00:00:00.000+0000',
];

export async function mockEmptySnapshotsBladeResult() {
    // mock the results in snapshots blade
    console.log(`Mock empty snapshot result in snapshots blade`);
    const mock = await browser.mock(getAllSnapshotsURL, { method: 'get' });
    mock.respondOnce(
        (response) => {
            var responseObj = response.body;
            responseObj.historyList = [];
            return responseObj;
        },
        { fetchResponse: true }
    );
}

export async function mockSnapshotsBladeResult() {
    // mock the results in snapshots blade
    console.log(`Mock snapshot result in snapshots blade`);
    const mock = await browser.mock(getAllSnapshotsURL, { method: 'get' });
    mock.respondOnce(
        (response) => {
            var responseObj = response.body;
            var responseArray = response.body.historyList;

            // Read JSON files from responseJson directory and add them into responseArray
            const responseJsonDir = path.join(__dirname, 'responseJson');
            const jsonFiles = ['errorSnapshot.json', 'runningSnapshot.json', 'waitingSnapshot.json'];

            responseArray.forEach((item, index) => {
                item.creationTime = mockCreationTime[index];
            });

            jsonFiles.forEach((fileName) => {
                try {
                    const filePath = path.join(responseJsonDir, fileName);
                    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                    responseArray.push(jsonData);
                } catch (error) {
                    console.error(`Error reading ${fileName}:`, error);
                }
            });

            responseObj.historyList = responseArray;
            return responseObj;
        },
        { fetchResponse: true }
    );
}

export async function mockSnapshotsTime() {
    // mock the time of snapshots
    console.log(`Mock snapshot time in snapshots blade`);
    const mock = await browser.mock(getAllSnapshotsURL, { method: 'get' });
    mock.respondOnce(
        (response) => {
            var responseObj = response.body;
            var responseArray = response.body.historyList;
            responseArray.forEach((item, index) => {
                item.creationTime = mockCreationTime[index];
            });
            return responseObj;
        },
        { fetchResponse: true }
    );
}
