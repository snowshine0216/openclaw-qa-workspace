import request from 'request';
import { errorLog, successLog, groupLog, groupLogEnd } from '../../config/consoleFormat.js';

const RALLY_BASE_URL = 'https://rally1.rallydev.com/slm/webservice/v2.0';

export async function queryRallyUserByTestCaseId(id) {
    const owner = await queryTestCaseOwnerById(id);
    const { EmailAddress, DisplayName } = await queryRallyUserInfo(owner._ref);
    successLog(`Owner of test case '${id}' is Email: ${EmailAddress} Name: ${DisplayName}`);
    return { email: EmailAddress, owner: DisplayName };
}

async function queryTestCaseOwnerById(id) {
    groupLog(`Query Rally test case by id=${id}`);
    const result = await sendRequestToRally({
        url: `testcases?fetch=FormattedID&search=${id}&queryFormattedIdOnly=true`,
        method: 'GET',
    });
    const testCaseObj = result.QueryResult.Results.shift();
    const testCaseDetails = await sendRequestToRally({ url: testCaseObj._ref, method: 'GET' });
    groupLogEnd();
    return testCaseDetails.TestCase.Owner;
}

async function queryRallyUserInfo(url) {
    groupLog('Query Rally user info');
    const result = await sendRequestToRally({ url, method: 'GET' });
    groupLogEnd();
    return result.User;
}

async function sendRequestToRally({ url, method, data }) {
    let options = {
        url: url.includes(RALLY_BASE_URL) ? url : `${RALLY_BASE_URL}/${url}`,
        method,
        headers: {
            zsessionid: process.env.RALLY_API_KEY,
        },
    };
    if (data) {
        options = { ...options, json: data };
    }

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    successLog(`Rally API '${url}' call is successful`);
                    resolve(JSON.parse(body));
                } else {
                    errorLog(
                        `Rally API '${url}' call failed. Status code: ${response.statusCode}. Message: ${body.message}`
                    );
                    reject(body.message);
                }
            } else {
                errorLog(`Rally API '${url}' call failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}