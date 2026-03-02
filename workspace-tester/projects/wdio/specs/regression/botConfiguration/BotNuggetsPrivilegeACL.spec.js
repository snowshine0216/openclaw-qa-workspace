import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { browserWindow } from '../../../constants/index.js';
import { nuggetTestUser, getBotObjectToEdit } from '../../../constants/bot.js';
import * as consts from '../../../constants/bot.js';
import setUserLanguage from '../../../api/setUserLanguage.js';
import deleteNuggetsList from '../../../api/bot/nuggets/deleteNuggetsList.js';
import { createBotByAPI, createNuggetsBulkAPI } from '../../../api/bot/index.js';
import deleteBotList from '../../../api/bot/deleteBot.js';
import { getNuggetObjectInfo } from '../../../constants/nugget.js';
import urlParser, { parseiServerRestHost } from '../../../api/urlParser.js';
import createSessionAPI from '../../../api/server/createSessionAPI.js';
import { createNuggets } from '../../../api/bot/nuggets/createNuggetsRestAPI.js';
import setObjectAcl from '../../../api/manageAccess/setObjectAcl.js';
import waitNuggetReady from '../../../api/bot/nuggets/waitNuggetReady.js';

describe('Nugget ACL & Privilege', () => {
    let { loginPage, libraryPage, botAuthoring } = browsers.pageObj1;
    let nuggetWithNoAcl = 'fake_nuggetWithNoAcl',
        nuggetIdWithNoAcl,
        nuggetWithOnlyBrowseAcl = 'fake_nuggetWithOnlyBrowseAcl',
        nuggetIdWithOnlyBrowseAcl,
        nuggetWithBrowseExecuteAcl = 'fake_nuggetWithBrowseExecuteAcl',
        nuggetIdWithBrowseExecuteAcl,
        nuggetWithBrowseReadAcl = 'fake_nuggetWithBrowseReadAcl',
        nuggetIdWithBrowseReadAcl,
        botWithNoAclNuggetId,
        botWithOnlyBrowseAclNuggetId,
        botWithBrowseReadNuggetId,
        botWithBrowseExecuteNuggetId,
        sessionID,
        nuggetsToDelete,
        nuggetId,
        botId;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await libraryPage.openDefaultApp();
        await loginPage.login(nuggetTestUser);
        let BotToCreate = getBotObjectToEdit({ botName: 'initial', enableSnapshot: false, active: false });
        // deny all acl 0, browse 1, read 4, execute 128
        const nuggetObjWithNoAcl = getNuggetObjectInfo({ nuggetName: 'fake nugget_no acl', rights: 0 });
        const nuggetObjWithOnlyBrowseAcl = getNuggetObjectInfo({ nuggetName: 'fake nugget_only browse', rights: 1 });
        const nuggetObjWithBrowseExecuteAcl = getNuggetObjectInfo({
            nuggetName: 'fake nugget_browse execute',
            rights: 129,
        });
        const nuggetObjWithBrowseReadAcl = getNuggetObjectInfo({ nuggetName: 'fake nugget_browse read', rights: 5 });
        let nuggetObjList = [
            { name: nuggetWithNoAcl, body: nuggetObjWithNoAcl, botId: '' },
            { name: nuggetWithOnlyBrowseAcl, body: nuggetObjWithOnlyBrowseAcl, botId: '' },
            { name: nuggetWithBrowseExecuteAcl, body: nuggetObjWithBrowseExecuteAcl, botId: '' },
            { name: nuggetWithBrowseReadAcl, body: nuggetObjWithBrowseReadAcl, botId: '' },
        ];
        const iServerRest = parseiServerRestHost(browser.options.baseUrl);
        const basicInfo = {
            data: {
                login: nuggetTestUser.username,
                password: nuggetTestUser.password,
                applicationType: 35,
                projectId: BotToCreate.project.id,
            },
        };
        sessionID = await createSessionAPI({ iServerRest, basicInfo });
        // create nuggets
        for (let nugget of nuggetObjList) {
            nuggetsToDelete = await createNuggetsBulkAPI({ iServerRest, sessionID, data: nugget.body });
            let nuggetIds = nuggetsToDelete.map((nugget) => {
                return { id: nugget.did };
            });
            const { id } = nuggetIds.shift();
            BotToCreate.nuggets = {
                nuggets: [{ id: id }],
            };
            BotToCreate.name = nugget.name;
            BotToCreate.data.name = nugget.name;
            nugget.botId = await createBotByAPI({ credentials: consts.mstrUser, botInfo: BotToCreate });
        }
        botWithNoAclNuggetId = nuggetObjList.find((obj) => obj.name === nuggetWithNoAcl).botId;
        botWithOnlyBrowseAclNuggetId = nuggetObjList.find((obj) => obj.name === nuggetWithOnlyBrowseAcl).botId;
        botWithBrowseExecuteNuggetId = nuggetObjList.find((obj) => obj.name === nuggetWithBrowseExecuteAcl).botId;
        botWithBrowseReadNuggetId = nuggetObjList.find((obj) => obj.name === nuggetWithBrowseReadAcl).botId;
        // create valid nugget
        const small_size_file = 'test_nugget_small.xlsx';
        nuggetId = await createNuggets({ credentials: nuggetTestUser, fileName: small_size_file });
        await waitNuggetReady({ credentials: nuggetTestUser, id: nuggetId });
        // create bot
        const botBody = getBotObjectToEdit({
            version: 'v2',
            botName: 'TC95218_02_bot',
            nuggetsIdList: [nuggetId],
        });
        botId = await createBotByAPI({
            credentials: nuggetTestUser,
            botInfo: botBody,
        });
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
    });

    afterAll(async () => {
        await libraryPage.openDefaultApp();
        await deleteBotList({
            credentials: nuggetTestUser,
            botList: [
                botWithNoAclNuggetId,
                botWithOnlyBrowseAclNuggetId,
                botWithBrowseReadNuggetId,
                botWithBrowseExecuteNuggetId,
            ],
        });
        await deleteNuggetsList({
            credentials: nuggetTestUser,
            idList: [
                nuggetId,
                nuggetIdWithNoAcl,
                nuggetIdWithOnlyBrowseAcl,
                nuggetIdWithBrowseExecuteAcl,
                nuggetIdWithBrowseReadAcl,
            ],
        });
    });

    it('[TC95218_01] Check privilege', async () => {
        await libraryPage.switchUser(consts.nuggetWithoutPrivilegeUser);
        await libraryPage.editBotByUrl({ botId: botWithBrowseExecuteNuggetId });
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await botAuthoring.custommizationPanel.scrollToBottom();
        await takeScreenshotByElement(
            await botAuthoring.custommizationPanel.getWarning(),
            'TC95218_01_01',
            'read warning message'
        );
        // remove nugget
        await botAuthoring.custommizationPanel.deleteNuggetItem();
        await takeScreenshotByElement(
            await botAuthoring.custommizationPanel.getWarning(),
            'TC95218_01_02',
            'privilege warning message'
        );
    });

    it('[TC95218_02] Check acl', async () => {
        await libraryPage.switchUser(consts.nuggetWithoutPrivilegeUser);
        // 1. deny all acl
        await libraryPage.editBotByUrl({
            botId: botWithNoAclNuggetId,
        });
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await botAuthoring.custommizationPanel.scrollToBottom();
        await takeScreenshotByElement(
            await botAuthoring.custommizationPanel.getExecuteAclWarning(),
            'TC95218_02_01',
            'execute warning message'
        );
        await takeScreenshotByElement(
            await botAuthoring.custommizationPanel.getWarning(1),
            'TC95218_02_02',
            'read warning message'
        );
        // 2. only browse acl
        await libraryPage.editBotByUrl({
            botId: botWithOnlyBrowseAclNuggetId,
        });
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await botAuthoring.custommizationPanel.scrollToBottom();
        await takeScreenshotByElement(
            await botAuthoring.custommizationPanel.getExecuteAclWarning(),
            'TC95218_02_03',
            'execute warning message'
        );
        await takeScreenshotByElement(
            await botAuthoring.custommizationPanel.getWarning(1),
            'TC95218_02_04',
            'read warning message'
        );
        // 3. default acl: only browse and execute
        await libraryPage.editBotByUrl({
            botId,
        });
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await botAuthoring.custommizationPanel.scrollToBottom();
        await since('Existence of execute waring should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.custommizationPanel.getExecuteAclWarning().isDisplayed())
            .toBe(false);
        await takeScreenshotByElement(
            await botAuthoring.custommizationPanel.getWarning(),
            'TC95218_02_05',
            'read warning message'
        );
        // 4. only browse and read, no execute
        // 4.1 normal case, show execute warning
        // set nugget acl
        await setObjectAcl({
            credentials: nuggetTestUser,
            object: {
                id: nuggetId,
                project: consts.project,
                type: 90,
            },
            acl: [
                {
                    value: 'Custom',
                    id: consts.nuggetWithoutPrivilegeUser.id,
                    name: consts.nuggetWithoutPrivilegeUser.username,
                    rights: 5,
                    denyRights: 128,
                },
            ],
        });
        await libraryPage.openDefaultApp();
        await libraryPage.switchUser(consts.nuggetWithoutPrivilegeUser);
        await libraryPage.editBotByUrl({
            botId,
        });
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await botAuthoring.custommizationPanel.scrollToBottom();
        await takeScreenshotByElement(
            await botAuthoring.custommizationPanel.getExecuteAclWarning(),
            'TC95218_02_06',
            'execute warning message'
        );
        // 4.2 reupload case, no write or privilege, show warning message
        await libraryPage.editBotByUrl({
            botId: botWithBrowseReadNuggetId,
        });
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await botAuthoring.custommizationPanel.scrollToBottom();
        await since('Existence of execute waring should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.custommizationPanel.getExecuteAclWarning().isDisplayed())
            .toBe(false);
        await takeScreenshotByElement(
            await botAuthoring.custommizationPanel.getWarning(),
            'TC95218_02_07',
            'upload warning message'
        );
        // 4.3 reupload case, with write or privilege, no error
        await libraryPage.openDefaultApp();
        await libraryPage.switchUser(consts.nuggetTestUser);
        await libraryPage.editBotByUrl({
            botId: botWithBrowseReadNuggetId,
        });
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await botAuthoring.custommizationPanel.scrollToBottom();
        await since('Existence of warning should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.custommizationPanel.getWarning().isDisplayed())
            .toBe(false);
        await since('Existence of execute waring should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.custommizationPanel.getExecuteAclWarning().isDisplayed())
            .toBe(false);
    });

    it('[TC94095_01] test i18n', async () => {
        // set nugget acl
        await setObjectAcl({
            credentials: nuggetTestUser,
            object: {
                id: nuggetId,
                project: consts.project,
                type: 90,
            },
            acl: [
                {
                    value: 'Custom',
                    id: consts.nuggetTesti18nUser.id,
                    name: consts.nuggetTesti18nUser.username,
                    denyRights: 132,
                },
            ],
        });
        // change user locale to Chinese
        await setUserLanguage({
            baseUrl: urlParser(browser.options.baseUrl),
            userId: consts.nuggetTesti18nUser.id,
            adminCredentials: consts.nuggetTesti18nUser,
            localeId: consts.languageIdMap.ChineseSimplified,
        });
        await libraryPage.switchUser(consts.nuggetTesti18nUser);
        // 1. execute and read message
        await libraryPage.editBotByUrl({
            botId,
        });
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await botAuthoring.custommizationPanel.scrollToBottom();
        await since('No execute acl message in Chinese should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.custommizationPanel.getExecuteAclWarningMessage())
            .toBe(consts.noExecuteAclMessageInChinese);
        await since('No read acl message in Chinese should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.custommizationPanel.getWarningMessage(1))
            .toBe(consts.noReadAclMessageInChinese);
        // 2. privilege message
        await botAuthoring.custommizationPanel.deleteNuggetItem();
        await since('No privielge in Chinese should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.custommizationPanel.getWarningMessage())
            .toBe(consts.noPrivilegeMessageInChinese);
        // 3. reupload message
        await libraryPage.editBotByUrl({
            botId: botWithBrowseReadNuggetId,
        });
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await botAuthoring.custommizationPanel.scrollToBottom();
        await since('No execute acl message in Chinese should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.custommizationPanel.getWarningMessage())
            .toBe(consts.reuploadErrorMessageInChinese);
    });

    // it('[TC] verify nugget name and remove', async () => {
    // // check name
    //     await libraryPage.editBotByUrl({ appId: customAppIdWithNuggets, botId: botWithoutNuggetId });
    //     await botAuthoring.selectBotConfigTabByName('custom-instruction');
    //     // upload nugget which is the same with app level nugget, should use file name + time
    //     await botAuthoring.custommizationPanel.uploadNuggetsFile(small_size_file);
    //     await since('Name of duplicated nugget should be #{expected}, instead we have #{actual}')
    //         .expect(await botAuthoring.custommizationPanel.getNuggetName())
    //         .toContain('test_nugget_small.xlsx 20');
    //     // get nugget id
    //     const nuggetsIdList = getNuggetInBot({
    //         credentials: nuggetTestUser,
    //         id: botWithoutNuggetId,
    //     });
    //     const uploadedNuggetId = nuggetsIdList[1];
    //     // delete nugget from ui, just dis-associate
    //     await botAuthoring.custommizationPanel.deleteNuggetItem();
    //     await botAuthoring.saveBot();
    //     let response = await getNuggetsRestAPI({
    //         credentials: nuggetTestUser,
    //         id: uploadedNuggetId,
    //     });
    //     await since('Nugget is only dis-associate, getNugget api should return #{expected}, instead we have #{actual}')
    //         .expect(await response.statusCode)
    //         .toBe(200);
    //     await aibotChatPanel.goToLibrary();
    // });
});
