import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { snapshotBotUser } from '../../../constants/bot.js';
import { browserWindow } from '../../../constants/index.js';
import authentication from '../../../api/authentication.js';
import urlParser from '../../../api/urlParser.js';
import createSessionAPI from '../../../api/server/createSessionAPI.js';
import bulkReadObjectsAPI from '../../../api/server/bulkReadObjectsAPI.js';
import bulkWriteObjectsAPI from '../../../api/server/bulkWriteObjectsAPI.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { parseiServerRestHost } from '../../../api/urlParser.js';
import fs from 'fs';

// This spec is used to get bot json data

describe('AIbotSnapshotPanel_GetBotData', () => {
    // info used by createSessionAPI
    const basicInfo = {
        data: {
            login: 'auto_ai_snapshot',
            password: '',
            applicationType: 6,
            projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        },
    };

    const basicInfo_normal = {
        data: {
            login: 'auto_snapshot_normal',
            password: '',
            applicationType: 6,
            projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        },
    };

    const basicInfo_cn = {
        data: {
            login: 'auto_ai_snapshot_cn',
            password: '',
            applicationType: 6,
            projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        },
    };

    const basicInfo_de = {
        data: {
            login: 'auto_ai_snapshot_de',
            password: '',
            applicationType: 6,
            projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        },
    };

    let { loginPage, libraryPage, aibotSnapshotsPanel, aibotChatPanel, snapshotDialog } = browsers.pageObj1;
    let sessionID = '';
    // const iServerRest = 'http://mci-ze4yt-dev.hypernow.microstrategy.com:30037';
    const iServerRest = parseiServerRestHost(browser.options.baseUrl);


    beforeAll(async () => {
        await loginPage.login(snapshotBotUser);
        await setWindowSize(browserWindow);
        sessionID = await createSessionAPI({ iServerRest, basicInfo });
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    xit('Save bot data of spec 01 to local json file', async () => {
        // Bot01 in 01_SnapshptSanity
        const botInfo_01 = {
            data: {
                idtypes: [
                    {
                        did: 'DB9CB6205D49422C577094B309CE7F61',
                        tp: 89,
                        pid: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
                    },
                ],
            },
        };

        const bot_data = await bulkReadObjectsAPI({ iServerRest, sessionID, basicInfo, botInfo: botInfo_01 });
        console.log('-------------------------originalBotData---------------------------------------------');
        console.log(bot_data);
        const bot_data_new = {
            save: bot_data.data,
        };
        const jsonString = JSON.stringify(bot_data_new, null, 2);
        const filePath = 'specs/regression/aibotSnapshotsPanel/01_Sanity_Bot01.json';
        fs.writeFileSync(filePath, jsonString);
        console.log('JSON data saved to', filePath);
    });

    xit('Save bot data of spec 02 to local json file', async () => {
        // Bot01 in 02_SnapshotsPanel
        const botInfo_01 = {
            data: {
                idtypes: [
                    {
                        did: '42D45053FB416B4790016693F0F42FBD',
                        tp: 89,
                        pid: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
                    },
                ],
            },
        };

        // Bot02 in 02_SnapshotsPanel
        const botInfo_02 = {
            data: {
                idtypes: [
                    {
                        did: '73219EAF0C428378A725C8B4B6EDB54B',
                        tp: 89,
                        pid: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
                    },
                ],
            },
        };

        const bot_data_01 = await bulkReadObjectsAPI({ iServerRest, sessionID, basicInfo, botInfo: botInfo_01 });
        console.log('-------------------------originalBot01Data---------------------------------------------');
        console.log(bot_data_01);
        const bot_data_new_01 = {
            save: bot_data_01.data,
        };
        const jsonString_01 = JSON.stringify(bot_data_new_01, null, 2);
        const filePath_01 = 'specs/regression/aibotSnapshotsPanel/02_Panel_Bot01.json';
        fs.writeFileSync(filePath_01, jsonString_01);
        console.log('JSON data saved to', filePath_01);

        const bot_data_02 = await bulkReadObjectsAPI({ iServerRest, sessionID, basicInfo, botInfo: botInfo_02 });
        console.log('-------------------------originalBot02Data---------------------------------------------');
        console.log(bot_data_02);
        const bot_data_new_02 = {
            save: bot_data_02.data,
        };
        const jsonString_02 = JSON.stringify(bot_data_new_02, null, 2);
        const filePath_02 = 'specs/regression/aibotSnapshotsPanel/02_Panel_Bot02.json';
        fs.writeFileSync(filePath_02, jsonString_02);
        console.log('JSON data saved to', filePath_02);
    });

    xit('Save bot data of spec 03 to local json file', async () => {
        // Bot01 in 03_CopyDownload
        const botInfo_01 = {
            data: {
                idtypes: [
                    {
                        did: '1290F0ED784FC18701CD7DB99E025F11',
                        tp: 89,
                        pid: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
                    },
                ],
            },
        };

        // Bot02 in 03_CopyDownload
        const botInfo_02 = {
            data: {
                idtypes: [
                    {
                        did: 'BF58FD9FC343E0745F705ABE2B647F7C',
                        tp: 89,
                        pid: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
                    },
                ],
            },
        };
        const bot_data_01 = await bulkReadObjectsAPI({ iServerRest, sessionID, basicInfo, botInfo: botInfo_01 });
        console.log('-------------------------originalBotData---------------------------------------------');
        console.log(bot_data_01);
        const bot_data_new_01 = {
            save: bot_data_01.data,
        };
        const jsonString_01 = JSON.stringify(bot_data_new_01, null, 2);
        const filePath_01 = 'specs/regression/aibotSnapshotsPanel/03_CopyDownload_Bot01.json';
        fs.writeFileSync(filePath_01, jsonString_01);
        console.log('JSON data saved to', filePath_01);

        const bot_data_02 = await bulkReadObjectsAPI({ iServerRest, sessionID, basicInfo, botInfo: botInfo_02 });
        console.log('-------------------------originalBot02Data---------------------------------------------');
        console.log(bot_data_02);
        const bot_data_new_02 = {
            save: bot_data_02.data,
        };
        const jsonString_02 = JSON.stringify(bot_data_new_02, null, 2);
        const filePath_02 = 'specs/regression/aibotSnapshotsPanel/03_CopyDownload_Bot02.json';
        fs.writeFileSync(filePath_02, jsonString_02);
        console.log('JSON data saved to', filePath_02);
    });

    xit('Save bot data of spec 04 to local json file', async () => {
        // Bot01 in 04_SnapshotErrorHandling
        const botInfo_01 = {
            data: {
                idtypes: [
                    {
                        did: 'D935D154ED488DB05A3C07AC3CF4CA2A',
                        tp: 89,
                        pid: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
                    },
                ],
            },
        };

        // Bot02 in 04_SnapshotErrorHandling
        const botInfo_02 = {
            data: {
                idtypes: [
                    {
                        did: '91B48C2BAD42E19388780DA5DE65A72C',
                        tp: 89,
                        pid: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
                    },
                ],
            },
        };
        // Bot03 in 04_SnapshotErrorHandling
        const botInfo_03 = {
            data: {
                idtypes: [
                    {
                        did: '80EFC2054D4FB14F3A324AB3515AEDCE',
                        tp: 89,
                        pid: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
                    },
                ],
            },
        };

        // Bot04 in 04_SnapshotErrorHandling
        const botInfo_04 = {
            data: {
                idtypes: [
                    {
                        did: '19E903D40D4E93F23411B781FBA9DB0C',
                        tp: 89,
                        pid: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
                    },
                ],
            },
        };

        // Bot05 in 04_SnapshotErrorHandling
        const botInfo_05 = {
            data: {
                idtypes: [
                    {
                        did: '9C9A05904D401D4F3955B6865C6D86AC',
                        tp: 89,
                        pid: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
                    },
                ],
            },
        };

        const bot_data_01 = await bulkReadObjectsAPI({ iServerRest, sessionID, basicInfo, botInfo: botInfo_01 });
        console.log('-------------------------originalBot01Data---------------------------------------------');
        console.log(bot_data_01);
        const bot_data_new_01 = {
            save: bot_data_01.data,
        };
        const jsonString_01 = JSON.stringify(bot_data_new_01, null, 2);
        const filePath_01 = 'specs/regression/aibotSnapshotsPanel/04_ErrorHandling_Bot01.json';
        fs.writeFileSync(filePath_01, jsonString_01);
        console.log('JSON data saved to', filePath_01);

        const bot_data_02 = await bulkReadObjectsAPI({ iServerRest, sessionID, basicInfo, botInfo: botInfo_02 });
        console.log('-------------------------originalBot02Data---------------------------------------------');
        console.log(bot_data_02);
        const bot_data_new_02 = {
            save: bot_data_02.data,
        };
        const jsonString_02 = JSON.stringify(bot_data_new_02, null, 2);
        const filePath_02 = 'specs/regression/aibotSnapshotsPanel/04_ErrorHandling_Bot02.json';
        fs.writeFileSync(filePath_02, jsonString_02);
        console.log('JSON data saved to', filePath_02);

        const bot_data_03 = await bulkReadObjectsAPI({ iServerRest, sessionID, basicInfo, botInfo: botInfo_03 });
        console.log('-------------------------originalBot02Data---------------------------------------------');
        console.log(bot_data_03);
        const bot_data_new_03 = {
            save: bot_data_03.data,
        };
        const jsonString_03 = JSON.stringify(bot_data_new_03, null, 2);
        const filePath_03 = 'specs/regression/aibotSnapshotsPanel/04_ErrorHandling_Bot03.json';
        fs.writeFileSync(filePath_03, jsonString_03);
        console.log('JSON data saved to', filePath_03);

        const bot_data_04 = await bulkReadObjectsAPI({ iServerRest, sessionID, basicInfo, botInfo: botInfo_04 });
        console.log('-------------------------originalBot02Data---------------------------------------------');
        console.log(bot_data_04);
        const bot_data_new_04 = {
            save: bot_data_04.data,
        };
        const jsonString_04 = JSON.stringify(bot_data_new_04, null, 2);
        const filePath_04 = 'specs/regression/aibotSnapshotsPanel/04_ErrorHandling_Bot04.json';
        fs.writeFileSync(filePath_04, jsonString_04);
        console.log('JSON data saved to', filePath_04);

        const bot_data_05 = await bulkReadObjectsAPI({ iServerRest, sessionID, basicInfo, botInfo: botInfo_05 });
        console.log('-------------------------originalBot02Data---------------------------------------------');
        console.log(bot_data_05);
        const bot_data_new_05 = {
            save: bot_data_05.data,
        };
        const jsonString_05 = JSON.stringify(bot_data_new_05, null, 2);
        const filePath_05 = 'specs/regression/aibotSnapshotsPanel/04_ErrorHandling_Bot05.json';
        fs.writeFileSync(filePath_05, jsonString_05);
        console.log('JSON data saved to', filePath_05);
    });

    xit('Save bot data of spec 05 to local json file', async () => {
        const botInfo_01 = {
            data: {
                idtypes: [
                    {
                        did: '04655FAD774F181C4025019CABEC118C',
                        tp: 89,
                        pid: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
                    },
                ],
            },
        };
        sessionID = await createSessionAPI({ iServerRest, basicInfo: basicInfo_cn });
        const bot_data = await bulkReadObjectsAPI({
            iServerRest,
            sessionID,
            basicInfo: basicInfo_cn,
            botInfo: botInfo_01,
        });
        console.log('-------------------------originalBotData---------------------------------------------');
        console.log(bot_data);
        const bot_data_new = {
            save: bot_data.data,
        };
        const jsonString = JSON.stringify(bot_data_new, null, 2);
        const filePath = 'specs/regression/aibotSnapshotsPanel/05_I18NChinese_Bot01.json';
        fs.writeFileSync(filePath, jsonString);
        console.log('JSON data saved to', filePath);
    });

    xit('Save bot data of spec 06 to local json file', async () => {
        const botInfo_01 = {
            data: {
                idtypes: [
                    {
                        did: 'DA7BD20D5747648C7CCF83855AF807C6',
                        tp: 89,
                        pid: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
                    },
                ],
            },
        };
        sessionID = await createSessionAPI({ iServerRest, basicInfo: basicInfo_de });
        const bot_data = await bulkReadObjectsAPI({
            iServerRest,
            sessionID,
            basicInfo: basicInfo_de,
            botInfo: botInfo_01,
        });
        console.log('-------------------------originalBotData---------------------------------------------');
        console.log(bot_data);
        const bot_data_new = {
            save: bot_data.data,
        };
        const jsonString = JSON.stringify(bot_data_new, null, 2);
        const filePath = 'specs/regression/aibotSnapshotsPanel/06_I18NGerman_Bot01.json';
        fs.writeFileSync(filePath, jsonString);
        console.log('JSON data saved to', filePath);
    });

    xit('Save bot data of spec 08 to local json file', async () => {
        const botInfo_01 = {
            data: {
                idtypes: [
                    {
                        did: '3DFAFCB076453D295D089789034813A9',
                        tp: 89,
                        pid: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
                    },
                ],
            },
        };
        sessionID = await createSessionAPI({ iServerRest, basicInfo: basicInfo_normal });
        const bot_data = await bulkReadObjectsAPI({
            iServerRest,
            sessionID,
            basicInfo: basicInfo_normal,
            botInfo: botInfo_01,
        });
        console.log('-------------------------originalBotData---------------------------------------------');
        console.log(bot_data);
        const bot_data_new = {
            save: bot_data.data,
        };
        const jsonString = JSON.stringify(bot_data_new, null, 2);
        const filePath = 'specs/regression/aibotSnapshotsPanel/08_Interpretation_Bot01.json';
        fs.writeFileSync(filePath, jsonString);
        console.log('JSON data saved to', filePath);
    });

    xit('Save bot data of spec 09 to local json file', async () => {
        const botInfo_01 = {
            data: {
                idtypes: [
                    {
                        did: '0B65EC04464B2B9410DD07AE23C67C8B',
                        tp: 89,
                        pid: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
                    },
                ],
            },
        };
        sessionID = await createSessionAPI({ iServerRest, basicInfo: basicInfo });
        const bot_data = await bulkReadObjectsAPI({
            iServerRest,
            sessionID,
            basicInfo: basicInfo,
            botInfo: botInfo_01,
        });
        console.log('-------------------------originalBotData---------------------------------------------');
        console.log(bot_data);
        const bot_data_new = {
            save: bot_data.data,
        };
        const jsonString = JSON.stringify(bot_data_new, null, 2);
        const filePath = 'specs/regression/aibotSnapshotsPanel/09_Interpretation_Bot01.json';
        fs.writeFileSync(filePath, jsonString);
        console.log('JSON data saved to', filePath);
    });

    xit('Save bot data of spec 10 to local json file', async () => {
        const botInfo_01 = {
            data: {
                idtypes: [
                    {
                        did: '0881F399FD425ACE5AB4D782C5DBCB54',
                        tp: 89,
                        pid: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
                    },
                ],
            },
        };
        sessionID = await createSessionAPI({ iServerRest, basicInfo: basicInfo });
        const bot_data = await bulkReadObjectsAPI({
            iServerRest,
            sessionID,
            basicInfo: basicInfo,
            botInfo: botInfo_01,
        });
        console.log('-------------------------originalBotData---------------------------------------------');
        console.log(bot_data);
        const bot_data_new = {
            save: bot_data.data,
        };
        const jsonString = JSON.stringify(bot_data_new, null, 2);
        const filePath = 'specs/regression/aibotSnapshotsPanel/10_Topic_Bot01.json';
        fs.writeFileSync(filePath, jsonString);
        console.log('JSON data saved to', filePath);
    });

    xit('Save bot data of spec 12 to local json file', async () => {
        const botInfo_01 = {
            data: {
                idtypes: [
                    {
                        did: 'A58EB9AC10476D1443F3E099266BA9A7',
                        tp: 89,
                        pid: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
                    },
                ],
            },
        };
        sessionID = await createSessionAPI({ iServerRest, basicInfo: basicInfo });
        const bot_data = await bulkReadObjectsAPI({
            iServerRest,
            sessionID,
            basicInfo: basicInfo,
            botInfo: botInfo_01,
        });
        console.log('-------------------------originalBotData---------------------------------------------');
        console.log(bot_data);
        const bot_data_new = {
            save: bot_data.data,
        };
        const jsonString = JSON.stringify(bot_data_new, null, 2);
        const filePath = 'specs/regression/aibotSnapshotsPanel/12_LearningIndcator_Bot01.json';
        fs.writeFileSync(filePath, jsonString);
        console.log('JSON data saved to', filePath);
    });
});
