import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PRIVILEGE_URL = `**/api/sessions/privileges`;
const RESPONSE_JSON_DIR = path.join(__dirname, 'responseJson');

// Pure function to read JSON file
function readJsonFile(filename) {
    const filePath = path.join(RESPONSE_JSON_DIR, filename);
    return fs.readFileSync(filePath, 'utf8');
}

// Pure function to create response handler
function createResponseHandler(jsonContent) {
    return () => {
        // const responseObj = response.body;
        return JSON.parse(jsonContent);
    };
}

// Higher-order function to create mock privilege functions
function createMockPrivilegeFunction(jsonFilename, description) {
    return async function mockPrivilege() {
        console.log(`Mock ${description}`);
        const jsonContent = readJsonFile(jsonFilename);
        const mock = await browser.mock(PRIVILEGE_URL, { method: 'get' });
        mock.respondOnce(createResponseHandler(jsonContent), { fetchResponse: true });
    };
}

// Create specific mock functions using the higher-order function
export const mockNoWebViewHistoryListPrivilege = createMockPrivilegeFunction(
    'noWebViewHistoryList.json',
    'no web view history list privilege'
);

// only has add to history list privilege in Tutorial
export const mockNoWebAddToHistoryListToOtherP = createMockPrivilegeFunction(
    'noWebAddToHistoryListToOtherP.json',
    'no web add to history list to other privilege'
);
