import request from 'request';
import { errorLog, successLog } from '../../config/consoleFormat.js';

/*
This API is to get sessionID.
Paramaters: 
    iServerRest: environment address. e.g. http://mci-ze4yt-dev.hypernow.microstrategy.com:30037
    basicInfo: body data requested by this API. e.g.
    const basicInfo = {
        data: {
            login: 'auto_ai_snapshot',
            password: '',
            applicationType: 6,
            projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
                
        },
    };
*/
export default async function createSessionAPI({ iServerRest, basicInfo }) {
    const options = {
        url: iServerRest + '/api/sessions',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        json: basicInfo.data,
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 201) {
                    const sessionID = body.sessionId;
                    successLog('Get sessionID successfully');
                    resolve(sessionID);
                } else {
                    errorLog(
                        `Fail to get sessionID'. Status code: 
                        ${response.statusCode}. Message: ${body.message}`
                    );
                    reject(body.message);
                }
            } else {
                errorLog(`Fail to get sessionID. Error: ${error}`);
                reject(error);
            }
        });
    });
}
