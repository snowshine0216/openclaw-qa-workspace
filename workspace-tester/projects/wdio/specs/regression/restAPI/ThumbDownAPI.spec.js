import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { chatPanelUser, conEduProId } from '../../../constants/bot.js';
import {
    askQuestionAPI,
    getChatIdAPI,
    thumbDownAPI,
    authentication,
    createBotInstanceAPI,
    saveBotAPI,
    deleteBotList,
    clearHistoryAPI,
} from '../../../api/bot/index.js';
import * as consts from '../../../constants/bot.js';

describe('Thumb down rest api test', () => {
    let { libraryPage } = browsers.pageObj1;
    let botId;
    let bodyParse;
    let chatId = '';
    let messageId = '';
    const baseUrl = browser.options.baseUrl;
    const botInfo = consts.thumbDownNewBot;

    beforeEach(async () => {
        const session = await authentication({
            baseUrl: baseUrl,
            authMode: 1,
            credentials: chatPanelUser,
        });
        const instanceObj = await createBotInstanceAPI({
            baseUrl: baseUrl,
            session,
            botInfo: botInfo,
        });
        botInfo.instance = instanceObj;
        botId = await saveBotAPI({ baseUrl: baseUrl, session, botInfo: botInfo });
        bodyParse = await getChatIdAPI({
            baseUrl: browser.options.baseUrl,
            session: session,
            botId: botId,
            botInfo: consts.thumbDownNewBot,
        });
        chatId = bodyParse.id;
        messageId = await askQuestionAPI({
            baseUrl: browser.options.baseUrl,
            session: session,
            messageInfo: consts.thumbDownMessageInfo,
            chatId: chatId,
            botInfo: consts.thumbDownNewBot,
        });
    });

    afterEach(async () => {
        const session = await authentication({
            baseUrl: baseUrl,
            authMode: 1,
            credentials: chatPanelUser,
        });
        let clearHistoryResult = '';
        clearHistoryResult = await clearHistoryAPI({
            baseUrl: browser.options.baseUrl,
            session: session,
            chatId: chatId,
            botInfo: consts.thumbDownNewBot,
        });
        await since('Clear history is expected to be #{expected}, instead we have #{actual}')
            .expect(clearHistoryResult)
            .toBe(204);
        await libraryPage.openDefaultApp();
        await deleteBotList({
            credentials: chatPanelUser,
            botList: [botId],
            projectId: conEduProId,
        });
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC95101_1] Thumb down rest api normal', async () => {
        let thumbDownResult = '';
        let thumbDownMessage;
        const session = await authentication({
            baseUrl: baseUrl,
            authMode: 1,
            credentials: chatPanelUser,
        });
        thumbDownResult = await thumbDownAPI({
            baseUrl: browser.options.baseUrl,
            session: session,
            chatId: chatId,
            msgId: messageId,
            botInfo: consts.thumbDownNewBot,
            op: 'replace',
            path: '/thumbDown',
            value: true,
        });
        await since('thumb down true expected to be #{expected}, instead we have #{actual}')
            .expect(thumbDownResult)
            .toBe(200);
        bodyParse = await getChatIdAPI({
            baseUrl: browser.options.baseUrl,
            session: session,
            botId: botId,
            botInfo: consts.thumbDownNewBot,
        });
        thumbDownMessage = bodyParse.chats[0].messages[0].thumbDown;
        await since('thumb down true get thumbdown is expected to be #{expected}, instead we have #{actual}')
            .expect(thumbDownMessage)
            .toBe(true);
        thumbDownResult = await thumbDownAPI({
            baseUrl: browser.options.baseUrl,
            session: session,
            chatId: chatId,
            msgId: messageId,
            botInfo: consts.thumbDownNewBot,
            op: 'replace',
            path: '/thumbDown',
            value: false,
        });
        await since('thumb down false is expected to be #{expected}, instead we have #{actual}')
            .expect(thumbDownResult)
            .toBe(200);
        bodyParse = await getChatIdAPI({
            baseUrl: browser.options.baseUrl,
            session: session,
            botId: botId,
            botInfo: consts.thumbDownNewBot,
        });
        thumbDownMessage = bodyParse.chats[0].messages[0].thumbDown;
        await since('thumb down false get thumbdown is expected to be #{expected}, instead we have #{actual}')
            .expect(thumbDownMessage)
            .toBe(false);
    });

    it('[TC95101_2] Thumb down rest api null', async () => {
        let thumbDownResult = '';
        const session = await authentication({
            baseUrl: baseUrl,
            authMode: 1,
            credentials: chatPanelUser,
        });
        try {
            thumbDownResult = await thumbDownAPI({
                baseUrl: browser.options.baseUrl,
                session: session,
                chatId: chatId,
                msgId: messageId,
                botInfo: consts.thumbDownNewBot,
                path: '/thumbDown',
                value: true,
            });
            await since('thumb down op null success expected to be #{expected}, instead we have #{actual}')
                .expect(thumbDownResult === 200)
                .toBe(false);
        } catch (error) {
            await since('thumb down op null expected to be #{expected}, instead we have #{actual}')
                .expect(error)
                .toBe(400);
        }

        try {
            thumbDownResult = await thumbDownAPI({
                baseUrl: browser.options.baseUrl,
                session: session,
                chatId: chatId,
                msgId: messageId,
                botInfo: consts.thumbDownNewBot,
                op: 'replace',
                value: false,
            });
            await since('thumb down path null success expected to be #{expected}, instead we have #{actual}')
                .expect(thumbDownResult === 200)
                .toBe(false);
        } catch (error) {
            await since('thumb down path null is expected to be #{expected}, instead we have #{actual}')
                .expect(error)
                .toBe(500);
        }
        try {
            thumbDownResult = await thumbDownAPI({
                baseUrl: browser.options.baseUrl,
                session: session,
                chatId: chatId,
                msgId: messageId,
                botInfo: consts.thumbDownNewBot,
                op: 'replace',
                path: '/thumbDown',
            });
            await since('thumb down value null success expected to be #{expected}, instead we have #{actual}')
                .expect(thumbDownResult === 200)
                .toBe(false);
        } catch (error) {
            await since('thumb down value null is expected to be #{expected}, instead we have #{actual}')
                .expect(error)
                .toBe(500);
        }
    });

    it('[TC95101_3] Thumb down rest api special characters', async () => {
        let thumbDownResult = '';
        const session = await authentication({
            baseUrl: baseUrl,
            authMode: 1,
            credentials: chatPanelUser,
        });
        try {
            thumbDownResult = await thumbDownAPI({
                baseUrl: browser.options.baseUrl,
                session: session,
                chatId: chatId,
                msgId: messageId,
                botInfo: consts.thumbDownNewBot,
                op: '#$%😏',
                path: '/thumbDown',
                value: true,
            });
            await since('thumb down op special success expected to be #{expected}, instead we have #{actual}')
                .expect(thumbDownResult === 200)
                .toBe(false);
        } catch (error) {
            await since('thumb down op special characters expected to be #{expected}, instead we have #{actual}')
                .expect(error)
                .toBe(400);
        }

        try {
            thumbDownResult = await thumbDownAPI({
                baseUrl: browser.options.baseUrl,
                session: session,
                chatId: chatId,
                msgId: messageId,
                botInfo: consts.thumbDownNewBot,
                op: 'replace',
                path: '#$%😏',
                value: true,
            });
            await since('thumb down path special success expected to be #{expected}, instead we have #{actual}')
                .expect(thumbDownResult === 200)
                .toBe(false);
        } catch (error) {
            await since('thumb down path special characters is expected to be #{expected}, instead we have #{actual}')
                .expect(error)
                .toBe(400);
        }
        try {
            thumbDownResult = await thumbDownAPI({
                baseUrl: browser.options.baseUrl,
                session: session,
                chatId: chatId,
                msgId: messageId,
                botInfo: consts.thumbDownNewBot,
                op: 'replace',
                path: '/thumbDown',
                value: '#$%😏',
            });
            await since('thumb down value special success expected to be #{expected}, instead we have #{actual}')
                .expect(thumbDownResult === 200)
                .toBe(false);
        } catch (error) {
            await since('thumb down value special characters is expected to be #{expected}, instead we have #{actual}')
                .expect(error)
                .toBe(500);
        }
        try {
            thumbDownResult = await thumbDownAPI({
                baseUrl: browser.options.baseUrl,
                session: session,
                chatId: chatId,
                msgId: messageId,
                botInfo: consts.thumbDownNewBot,
                op: 'replace',
                path: '/thumbDown',
                value: 7,
            });
            await since('thumb down value number success expected to be #{expected}, instead we have #{actual}')
                .expect(thumbDownResult === 200)
                .toBe(false);
        } catch (error) {
            await since('thumb down value number is expected to be #{expected}, instead we have #{actual}')
                .expect(error)
                .toBe(500);
        }
    });

    it('[TC95101_4] Thumb down rest api op, path and value combination', async () => {
        let thumbDownResult = '';
        const session = await authentication({
            baseUrl: baseUrl,
            authMode: 1,
            credentials: chatPanelUser,
        });
        try {
            thumbDownResult = await thumbDownAPI({
                baseUrl: browser.options.baseUrl,
                session: session,
                chatId: chatId,
                msgId: messageId,
                botInfo: consts.thumbDownNewBot,
                op: 'add',
                path: '/thumbDown',
                value: true,
            });
            await since('thumb down add true success expected to be #{expected}, instead we have #{actual}')
                .expect(thumbDownResult === 200)
                .toBe(true);
        } catch (error) {
            await since('thumb down add true is expected to be #{expected}, instead we have #{actual}')
                .expect(error)
                .toBe(500);
        }
        try {
            thumbDownResult = await thumbDownAPI({
                baseUrl: browser.options.baseUrl,
                session: session,
                chatId: chatId,
                msgId: messageId,
                botInfo: consts.thumbDownNewBot,
                op: 'remove',
                path: '/thumbDown',
                value: true,
            });
            await since('thumb down remove true success expected to be #{expected}, instead we have #{actual}')
                .expect(thumbDownResult === 200)
                .toBe(false);
        } catch (error) {
            await since('thumb down remove true is expected to be #{expected}, instead we have #{actual}')
                .expect(error)
                .toBe(500);
        }
        try {
            thumbDownResult = await thumbDownAPI({
                baseUrl: browser.options.baseUrl,
                session: session,
                chatId: chatId,
                msgId: messageId,
                botInfo: consts.thumbDownNewBot,
                op: 'incr',
                path: '/thumbDown',
                value: true,
            });
            await since('thumb down incr true success expected to be #{expected}, instead we have #{actual}')
                .expect(thumbDownResult === 200)
                .toBe(false);
        } catch (error) {
            await since('thumb down incr true is expected to be #{expected}, instead we have #{actual}')
                .expect(error)
                .toBe(500);
        }
        try {
            thumbDownResult = await thumbDownAPI({
                baseUrl: browser.options.baseUrl,
                session: session,
                chatId: chatId,
                msgId: messageId,
                botInfo: consts.thumbDownNewBot,
                op: 'removeElement',
                path: '/thumbDown',
                value: true,
            });
            await since('thumb down removeElement true success expected to be #{expected}, instead we have #{actual}')
                .expect(thumbDownResult === 200)
                .toBe(false);
        } catch (error) {
            await since('thumb down removeElement true is expected to be #{expected}, instead we have #{actual}')
                .expect(error)
                .toBe(500);
        }
        try {
            thumbDownResult = await thumbDownAPI({
                baseUrl: browser.options.baseUrl,
                session: session,
                chatId: chatId,
                msgId: messageId,
                botInfo: consts.thumbDownNewBot,
                op: 'addElement',
                path: '/thumbDown',
                value: true,
            });
            await since('thumb down addElement true success expected to be #{expected}, instead we have #{actual}')
                .expect(thumbDownResult === 200)
                .toBe(false);
        } catch (error) {
            await since('thumb down addElement true is expected to be #{expected}, instead we have #{actual}')
                .expect(error)
                .toBe(500);
        }
        try {
            thumbDownResult = await thumbDownAPI({
                baseUrl: browser.options.baseUrl,
                session: session,
                chatId: chatId,
                msgId: messageId,
                botInfo: consts.thumbDownNewBot,
                op: 'removeElements',
                path: '/thumbDown',
                value: false,
            });
            await since('thumb down removeElements true success expected to be #{expected}, instead we have #{actual}')
                .expect(thumbDownResult === 200)
                .toBe(false);
        } catch (error) {
            await since('thumb down removeElements true is expected to be #{expected}, instead we have #{actual}')
                .expect(error)
                .toBe(500);
        }
        try {
            thumbDownResult = await thumbDownAPI({
                baseUrl: browser.options.baseUrl,
                session: session,
                chatId: chatId,
                msgId: messageId,
                botInfo: consts.thumbDownNewBot,
                op: 'addElements',
                path: '/thumbDown',
                value: true,
            });
            await since('thumb down addElements true success expected to be #{expected}, instead we have #{actual}')
                .expect(thumbDownResult === 200)
                .toBe(false);
        } catch (error) {
            await since('thumb down addElements true is expected to be #{expected}, instead we have #{actual}')
                .expect(error)
                .toBe(500);
        }
        try {
            thumbDownResult = await thumbDownAPI({
                baseUrl: browser.options.baseUrl,
                session: session,
                chatId: chatId,
                msgId: messageId,
                botInfo: consts.thumbDownNewBot,
                op: 'add',
                path: '/thumbDown',
                value: true,
            });
            await since('thumb down add false success expected to be #{expected}, instead we have #{actual}')
                .expect(thumbDownResult === 200)
                .toBe(true);
        } catch (error) {
            await since('thumb down add false is expected to be #{expected}, instead we have #{actual}')
                .expect(error)
                .toBe(500);
        }
        try {
            thumbDownResult = await thumbDownAPI({
                baseUrl: browser.options.baseUrl,
                session: session,
                chatId: chatId,
                msgId: messageId,
                botInfo: consts.thumbDownNewBot,
                op: 'remove',
                path: '/thumbDown',
                value: false,
            });
            await since('thumb down remove false success expected to be #{expected}, instead we have #{actual}')
                .expect(thumbDownResult === 200)
                .toBe(false);
        } catch (error) {
            await since('thumb down remove false is expected to be #{expected}, instead we have #{actual}')
                .expect(error)
                .toBe(500);
        }
        try {
            thumbDownResult = await thumbDownAPI({
                baseUrl: browser.options.baseUrl,
                session: session,
                chatId: chatId,
                msgId: messageId,
                botInfo: consts.thumbDownNewBot,
                op: 'incr',
                path: '/thumbDown',
                value: false,
            });
            await since('thumb down incr false success expected to be #{expected}, instead we have #{actual}')
                .expect(thumbDownResult === 200)
                .toBe(false);
        } catch (error) {
            await since('thumb down incr false is expected to be #{expected}, instead we have #{actual}')
                .expect(error)
                .toBe(500);
        }
        try {
            thumbDownResult = await thumbDownAPI({
                baseUrl: browser.options.baseUrl,
                session: session,
                chatId: chatId,
                msgId: messageId,
                botInfo: consts.thumbDownNewBot,
                op: 'removeElement',
                path: '/thumbDown',
                value: false,
            });
            await since('thumb down removeElement false success expected to be #{expected}, instead we have #{actual}')
                .expect(thumbDownResult === 200)
                .toBe(false);
        } catch (error) {
            await since('thumb down removeElement false is expected to be #{expected}, instead we have #{actual}')
                .expect(error)
                .toBe(500);
        }
        try {
            thumbDownResult = await thumbDownAPI({
                baseUrl: browser.options.baseUrl,
                session: session,
                chatId: chatId,
                msgId: messageId,
                botInfo: consts.thumbDownNewBot,
                op: 'addElement',
                path: '/thumbDown',
                value: false,
            });
            await since('thumb down addElement false success expected to be #{expected}, instead we have #{actual}')
                .expect(thumbDownResult === 200)
                .toBe(false);
        } catch (error) {
            await since('thumb down addElement false is expected to be #{expected}, instead we have #{actual}')
                .expect(error)
                .toBe(500);
        }
        try {
            thumbDownResult = await thumbDownAPI({
                baseUrl: browser.options.baseUrl,
                session: session,
                chatId: chatId,
                msgId: messageId,
                botInfo: consts.thumbDownNewBot,
                op: 'removeElements',
                path: '/thumbDown',
                value: false,
            });
            await since('thumb down removeElements false success expected to be #{expected}, instead we have #{actual}')
                .expect(thumbDownResult === 200)
                .toBe(false);
        } catch (error) {
            await since('thumb down removeElements false is expected to be #{expected}, instead we have #{actual}')
                .expect(error)
                .toBe(500);
        }
        try {
            thumbDownResult = await thumbDownAPI({
                baseUrl: browser.options.baseUrl,
                session: session,
                chatId: chatId,
                msgId: messageId,
                botInfo: consts.thumbDownNewBot,
                op: 'addElements',
                path: '/thumbDown',
                value: false,
            });
            await since('thumb down addElements false success expected to be #{expected}, instead we have #{actual}')
                .expect(thumbDownResult === 200)
                .toBe(false);
        } catch (error) {
            await since('thumb down addElements false is expected to be #{expected}, instead we have #{actual}')
                .expect(error)
                .toBe(500);
        }
    });
});
