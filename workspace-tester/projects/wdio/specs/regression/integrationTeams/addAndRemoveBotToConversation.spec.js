import * as consts from '../../../constants/teams.js';
import editLibraryEmbedding from '../../../api/admin/libraryEmbedding.js';
import * as post from '../../../constants/customApp/customAppCustomizedEmail.js';

describe('Add and remove app to conversation in Teams', () => {
    let { conversation, apps, mainTeams, teamsDesktop } = browsers.pageObj1;

    beforeAll(async () => {
        browser.options.baseUrl = browsers.params.standardUrl;
        await editLibraryEmbedding({ credentials: consts.mstrUser.credentials, embeddingInfo: post.security });
        await editLibraryEmbedding({ credentials: consts.mstrUser.credentials, embeddingInfo: post.all_security });
        await teamsDesktop.switchToActiveWindow();
        if (!(await teamsDesktop.checkCurrentTeamsUser('bot@nvy2.onmicrosoft.com'))) {
            await teamsDesktop.switchToTeamsUser('bot');
        }
    });

    it('[TC95764_01] Add bot from Get Bots', async () => {
        await mainTeams.switchToChat(consts.testGroupChat4);
        await conversation.removeBot({ conversation: consts.testGroupChat4 });
        await conversation.switchToTabInChat('Chat');
        await since('1 Remove bot from group chat, message should be #{expected}, instead we have #{actual}')
            .expect(await conversation.getLatestControlMessage())
            .toBe('bot removed Library from the chat.');
        await conversation.sleep(1000);
        await conversation.getInputBox().setValue('@');
        await conversation.sleep(1000);
        await conversation.getInputBox().addValue('L');
        await conversation.sleep(1000);
        await since('2 Bot has been removed, suggested list should be #{expected}, instead we have #{actual}')
            .expect(await conversation.getSearchedBotInSuggestions(consts.teamsApp).isDisplayed())
            .toBe(false);
        await conversation.getPostMessageButtonInChat().click();
        await apps.addBotToAConversation({ conversationName: consts.testGroupChat4 });
    });

    it('[TC95764_02] Add bot from Apps', async () => {
        await mainTeams.switchToChat(consts.testGroupChat4);
        let timestamp = await conversation.getTimestampOfLastControlMessage();
        const isRemoved = await conversation.removeBot({ conversation: consts.testGroupChat4 });
        await conversation.switchToTabInChat('Chat');
        if (isRemoved) await conversation.waitForNewControlMessageArrival({ timestamp });
        timestamp = await conversation.getTimestampOfLastControlMessage();
        await apps.addBotToAConversation({ conversationName: consts.testGroupChat4 });
        await conversation.waitForNewControlMessageArrival({ timestamp });
        await since('Add bot from apps to chat, message should be #{expected}, instead we have #{actual}')
            .expect(await conversation.getLatestControlMessage())
            .toBe('bot added Library here.');
    });
});
