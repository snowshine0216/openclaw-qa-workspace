import request from 'request';
import { errorLog, groupLog, successLog, groupLogEnd } from '../../config/consoleFormat.js';
import authentication from '../authentication.js';
import logout from '../logout.js';
import urlParser from '../urlParser.js';

export default async function editLibraryEmbedding({ credentials, embeddingInfo }) {
    groupLog('edit library embedding settings by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    await editLibraryEmbeddingAPI({ baseUrl, session, embeddingInfo });
    await logout({ baseUrl, session });
    groupLogEnd();
}

async function editLibraryEmbeddingAPI({ baseUrl, session, embeddingInfo }) {
    const options = {
        url: baseUrl + `api/mstrServices/library/security`,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
        },
        json: embeddingInfo,
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 204) {
                    successLog(`Update Library Embedding is successful. requestbody = '${embeddingInfo}'`);
                    resolve(body);
                } else {
                    errorLog(
                        `Update Library Embedding failed. Status code: ${response.statusCode}. Message: ${body.message}`
                    );
                    reject(body.message);
                }
            } else {
                errorLog(`Update Library Embedding failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
