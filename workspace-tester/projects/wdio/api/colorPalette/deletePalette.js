import request from 'request';
import { errorLog, groupLog, successLog, groupLogEnd } from '../../config/consoleFormat.js';
import authentication from '../authentication.js';
import logout from '../logout.js';
import urlParser from '../urlParser.js';

export default async function deleteColorPaletteList({ credentials, paletteIdList }) {
    let paletteId;
    for (paletteId of paletteIdList) {
        await deleteColorPalette({ credentials, paletteId });
    }
}

export async function deleteColorPalette({ credentials, paletteId }) {
    groupLog('delete color palette by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    await deleteColorPaletteAPI({ baseUrl, session, paletteId });
    await logout({ baseUrl, session });
    groupLogEnd();
}

export async function deleteColorPaletteAPI({ baseUrl, session, paletteId }) {
    const options = {
        url: baseUrl + `api/objects/${paletteId}?type=71`,
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 204) {
                    successLog(`delete ColorPalette is successful. id = '${paletteId}'`);
                    resolve(body);
                } else {
                    errorLog(
                        `delete ColorPalette failed. Status code: ${response.statusCode}. Message: ${body.message}`
                    );
                    reject(body.message);
                }
            } else {
                errorLog(`delete ColorPalette '${paletteId}' failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
