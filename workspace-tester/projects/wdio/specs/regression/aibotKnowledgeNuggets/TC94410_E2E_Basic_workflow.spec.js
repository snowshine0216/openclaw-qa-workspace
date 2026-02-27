import { browserWindowCustom } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';

describe('TC94410: [E2E] Basic workflow of Knowledge Nuggets in AI Bot', () => {
    let { dossierPage, loginPage, aibotChatPanel, libraryPage } = browsers.pageObj1;

    const loginCredentials = {
        analyst_user: {
            username: 'tester_analyst',
            password: 'newman1#',
        },
        business_user: {
            username: 'tester_user',
            password: 'newman1#',
        },
    };

    beforeAll(async () => {
        await loginPage.login(loginCredentials.analyst_user);
        await setWindowSize(browserWindowCustom);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('Analyst user', async () => {
        await libraryPage.openDossier('Knowledge Nuggets Automation Bot');
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.askQuestion('How many customers does Michael have?');

        await aibotChatPanel.openInterpretation();
        await aibotChatPanel.clickNuggetTriggerIcon();

        await expect(await aibotChatPanel.getNuggetsPopoverContentDatasetTitle().getText()).toBe(
            'Employee data new 2024-09-17T10:56:41'
        );
        await expect(await aibotChatPanel.getNuggetsPopoverContentDefinition().getText()).toBe('2. Michael Smith');
    });

    it('Business user', async () => {
        await logoutFromCurrentBrowser();
        await libraryPage.openDefaultApp();
        await loginPage.login(loginCredentials.business_user);
        await libraryPage.openDossier('Knowledge Nuggets Automation Bot');
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.askQuestion('How many customers does Michael have?');

        await aibotChatPanel.openInterpretation();
        await aibotChatPanel.clickNuggetTriggerIcon();

        await expect(await aibotChatPanel.getNuggetsPopoverContentDatasetTitle().isDisplayed()).toBe(false);
        await expect(await aibotChatPanel.getNuggetsPopoverContentDefinition().getText()).toBe('2. Michael Smith');
    });
});
