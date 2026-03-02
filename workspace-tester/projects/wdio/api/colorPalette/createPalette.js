import request from 'request';
import { errorLog, groupLog, successLog, groupLogEnd } from '../../config/consoleFormat.js';
import authentication from '../authentication.js';
import logout from '../logout.js';
import urlParser from '../urlParser.js';

export default async function createColorPalette({ credentials, colorPaletteInfo }) {
    groupLog('create color palette by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    let colorPaletteId = await createColorPaletteAPI({ baseUrl, session, colorPaletteInfo });
    await logout({ baseUrl, session });
    groupLogEnd();
    return colorPaletteId;
}

async function createColorPaletteAPI({ baseUrl, session, colorPaletteInfo }) {
    const options = {
        url: baseUrl + `api/palettes`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
        },
        json: colorPaletteInfo,
    };
    let colorPaletteId;

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 201) {
                    colorPaletteId = response.body['id'];
                    console.log(response.body['id']);
                    successLog(`Creating Color Palette is successful. id = '${colorPaletteId}'`);
                    resolve(colorPaletteId);
                } else {
                    errorLog(
                        `Creating Color Palette failed. Status code: ${response.statusCode}. Message: ${body.message}`
                    );
                    reject(body.message);
                }
            } else {
                errorLog(`Creating Color Palette failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
