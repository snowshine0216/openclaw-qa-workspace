import request from 'request';
import { errorLog, successLog, groupLog, groupLogEnd } from '../config/consoleFormat.js';
import authentication from './authentication.js';
import logout from './logout.js';
import urlParser from './urlParser.js';

export default async function removeDBRole({ credentials, project, dbrid, sql }) {
    groupLog('removeDBRole by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    const first_message = await DICreateEMMAReportInstance({ baseUrl, session, project });
    const second_mesage = await qBuilderRemoveOrDuplicateRI({
        baseUrl,
        session,
        project,
        msgid: first_message.MESSAGE_ID,
    });
    const msgid = second_mesage.MESSAGE_ID;
    const tbid = await DICreateEMMASourceTable({ baseUrl, session, project, msgid });
    await qBuilderSetDBRole({ baseUrl, session, project, msgid, dbrid, tbid: tbid.TBID });
    await qBuilderGetReportXDADefinition({
        baseUrl,
        session,
        project,
        msgid,
        tbid: tbid.TBID,
        browsetype: 256,
        bindingflag: 0,
        previewflag: 0,
    });
    await qBuilderEditFreeFormSQL({ baseUrl, session, project, msgid, tbid: tbid.TBID, sql });
    await qBuilderGetReportXDADefinition({
        baseUrl,
        session,
        project,
        msgid,
        tbid: tbid.TBID,
        browsetype: 5,
        bindingflag: 15,
        previewflag: 3,
    });
    await logout({ baseUrl, session });
    groupLogEnd();
}

async function DICreateEMMAReportInstance({ baseUrl, session, project }) {
    const url = baseUrl + 'servlet/taskProc';
    const options = {
        url: url,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-MSTR-ProjectID': project.id,
            'X-MSTR-AuthToken': session.token,
            Cookie: session.cookie,
            'X-Requested-With': 'XMLHttpRequest',
        },
        form: {
            taskId: 'DICreateEMMAReportInstance',
            taskEnv: 'xhr',
            taskContentType: 'json',
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode == 200) {
                    const bodyInfo = JSON.parse(body);
                    successLog(`DICreateEMMAReportInstance is successful. Message id is ${bodyInfo.msgid}`);
                    resolve({ MESSAGE_ID: bodyInfo.msgid });
                } else {
                    errorLog(`DICreateEMMAReportInstance failed. status code: ${response.statusCode}`);
                    errorLog(`DICreateEMMAReportInstance failed. message: ${body}`);
                    reject(body.message);
                }
            } else {
                errorLog(`DICreateEMMAReportInstance failed.`);
                reject(error);
            }
        });
    });
}

async function qBuilderRemoveOrDuplicateRI({ baseUrl, session, project, msgid }) {
    const url = baseUrl + 'servlet/taskProc';
    const options = {
        url: url,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-MSTR-ProjectID': project.id,
            'X-MSTR-AuthToken': session.token,
            Cookie: session.cookie,
            'X-Requested-With': 'XMLHttpRequest',
        },
        form: {
            taskId: 'qBuilder.RemoveOrDuplicateRI',
            msgid: msgid,
            messageID: msgid,
            taskEnv: 'xhr',
            taskContentType: 'json',
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode == 200) {
                    const bodyInfo = JSON.parse(body);
                    successLog(`qBuilderRemoveOrDuplicateRI is successful. Message id is ${bodyInfo.msgid}`);
                    resolve({ MESSAGE_ID: bodyInfo.msgid });
                } else {
                    errorLog(`qBuilderRemoveOrDuplicateRI failed. status code: ${response.statusCode}`);
                    errorLog(`qBuilderRemoveOrDuplicateRI failed. message: ${body}`);
                    reject(body.message);
                }
            } else {
                errorLog(`qBuilderRemoveOrDuplicateRI failed.`);
                reject(error);
            }
        });
    });
}

async function DICreateEMMASourceTable({ baseUrl, session, project, msgid }) {
    const url = baseUrl + 'servlet/taskProc';
    const options = {
        url: url,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-MSTR-ProjectID': project.id,
            'X-MSTR-AuthToken': session.token,
            Cookie: session.cookie,
            'X-Requested-With': 'XMLHttpRequest',
        },
        form: {
            taskId: 'DICreateEMMASourceTable',
            xt: 304,
            dict: 131073,
            msgid: msgid,
            taskEnv: 'xhr',
            taskContentType: 'json',
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode == 200) {
                    const bodyInfo = JSON.parse(body);
                    successLog(`DICreateEMMASourceTable is successful. Table id is ${bodyInfo.tbid}`);
                    resolve({ TBID: bodyInfo.tbid });
                } else {
                    errorLog(`DICreateEMMASourceTable failed. status code: ${response.statusCode}`);
                    errorLog(`DICreateEMMASourceTable failed. message: ${body}`);
                    reject(body.message);
                }
            } else {
                errorLog(`DICreateEMMASourceTable failed.`);
                reject(error);
            }
        });
    });
}

async function qBuilderSetDBRole({ baseUrl, session, project, msgid, dbrid, tbid }) {
    const url = baseUrl + 'servlet/taskProc';
    const options = {
        url: url,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-MSTR-ProjectID': project.id,
            'X-MSTR-AuthToken': session.token,
            Cookie: session.cookie,
            'X-Requested-With': 'XMLHttpRequest',
        },
        form: {
            taskId: 'qBuilder.SetDBRole',
            dbrid: dbrid,
            tbid: tbid,
            msgid: msgid,
            taskEnv: 'xhr',
            taskContentType: 'json',
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode == 200) {
                    const bodyInfo = JSON.parse(body);
                    successLog(`qBuilderSetDBRole is successful. Message id is ${bodyInfo.msgid}`);
                    resolve({ MESSAGE_ID: bodyInfo.msgid });
                } else {
                    errorLog(`qBuilderSetDBRole failed. status code: ${response.statusCode}`);
                    errorLog(`qBuilderSetDBRole failed. message: ${response.headers['X-MSTR-TaskFailureMsg']}`);
                    reject(body.message);
                }
            } else {
                errorLog(`qBuilderSetDBRole failed.`);
                reject(error);
            }
        });
    });
}

async function qBuilderGetReportXDADefinition({
    baseUrl,
    session,
    project,
    msgid,
    tbid,
    browsetype,
    bindingflag,
    previewflag,
}) {
    const url = baseUrl + 'servlet/taskProc';
    const options = {
        url: url,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-MSTR-ProjectID': project.id,
            'X-MSTR-AuthToken': session.token,
            Cookie: session.cookie,
            'X-Requested-With': 'XMLHttpRequest',
        },
        form: {
            taskId: 'qBuilder.GetReportXDADefinition',
            browsetype: browsetype,
            bindingflag: bindingflag,
            previewflag: previewflag,
            tableID: tbid,
            msgid: msgid,
            taskEnv: 'xhr',
            taskContentType: 'json',
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode == 200) {
                    successLog(`qBuilder.GetReportXDADefinition is successful. `);
                    resolve(response);
                } else {
                    console.log(response);
                    errorLog(`qBuilder.GetReportXDADefinition failed. status code: ${response.statusCode}`);
                    errorLog(`qBuilder.GetReportXDADefinition failed. message: ${body}`);
                    reject(body.message);
                }
            } else {
                errorLog(`qBuilder.GetReportXDADefinition failed.`);
                reject(error);
            }
        });
    });
}

async function qBuilderEditFreeFormSQL({ baseUrl, session, project, msgid, tbid, sql }) {
    const url = baseUrl + 'servlet/taskProc';
    const options = {
        url: url,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-MSTR-ProjectID': project.id,
            'X-MSTR-AuthToken': session.token,
            Cookie: session.cookie,
            'X-Requested-With': 'XMLHttpRequest',
        },
        form: {
            taskId: 'qBuilder.EditFreeFormSQL',
            exp: sql,
            tbid: tbid,
            msgid: msgid,
            taskEnv: 'xhr',
            taskContentType: 'json',
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode == 200) {
                    successLog(`qBuilderEditFreeFormSQL is successful. `);
                    resolve(response);
                } else {
                    errorLog(`executeSQL failed. status code: ${response.statusCode}`);
                    errorLog(`executeSQL failed. message: ${body}`);
                    reject(body.message);
                }
            } else {
                errorLog(`executeSQL failed.`);
                reject(error);
            }
        });
    });
}
