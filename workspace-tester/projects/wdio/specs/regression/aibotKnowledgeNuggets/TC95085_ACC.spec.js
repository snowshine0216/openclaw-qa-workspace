import { browserWindowCustom } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';

describe('TC95085: [ACC] Knowledge Nuggets in AI Bot', () => {
    let { dossierPage, loginPage, aibotChatPanel, libraryPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(browsers.params.credentials);
        await setWindowSize(browserWindowCustom);
    });

    afterAll(async () => {
        await dossierPage.goToLibrary();
    });

    it('Test knowledge nuggets multiple definitions', async () => {
        await libraryPage.openDossier('Knowledge Nuggets Automation Bot');
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.askQuestion(
            'How many customers does Michael, Robert, David have, show me as a bar chart?'
        );
        await aibotChatPanel.openInterpretation();
        await expect(await aibotChatPanel.getNuggetTriggerIcon().getText()).toBe('3');
        await aibotChatPanel.clickNuggetTriggerIcon();

        await expect(await aibotChatPanel.getNuggetsPopoverContent()[0].getText()).toBe('2. Michael Smith');
        await expect(await aibotChatPanel.getNuggetsPopoverContent()[1].getText()).toBe('4. David Martinez');
        await expect(await aibotChatPanel.getNuggetsPopoverContent()[2].getText()).toBe('8. Robert Nguyen');
    });

    it('Test knowledge nuggets used in visualization', async () => {
        await aibotChatPanel.clickNuggetTriggerIcon();
        await aibotChatPanel.hoverOnRectFromBarChart();
        await expect(await aibotChatPanel.getTableRowNameFromTooltip()[0].getText()).toBe('Employee ID');
        await expect(await aibotChatPanel.getTableRowValueFromTooltip()[0].getText()).toBe('2');
        await expect(await aibotChatPanel.getTableRowNameFromTooltip()[1].getText()).toBe('Number of customers');
        await expect(await aibotChatPanel.getTableRowValueFromTooltip()[1].getText()).toBe('129');
    });

    it('Test knowledge nuggets definitions with scroll', async () => {
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.askQuestion('How many customers does Seraphina and Penelope and Victoria have?');
        await aibotChatPanel.openInterpretation();
        await expect(await aibotChatPanel.getNuggetTriggerIcon().getText()).toBe('3');
        await aibotChatPanel.clickNuggetTriggerIcon();

        const nuggetContentLastElement = await aibotChatPanel
            .getNuggetContent()
            .$$(`//div[contains(@class, 'mstr-ai-chatbot-CINuggetsPopoverContent-nugget-right')]`)[2];
        const originalPosition = await nuggetContentLastElement.getLocation('y');
        await nuggetContentLastElement.scrollIntoView();
        await expect(await nuggetContentLastElement.getLocation('y')).toBeLessThan(originalPosition);
    });

    it('Test knowledge nuggets definition see more see less button', async () => {
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.askQuestion('How many customers does Seraphina have?');
        await aibotChatPanel.openInterpretation();
        await expect(await aibotChatPanel.getNuggetTriggerIcon().getText()).toBe('1');
        await aibotChatPanel.clickNuggetTriggerIcon();
        await aibotChatPanel.clickSeeMoreSeeLessButton();
        await expect(await aibotChatPanel.getSeeMoreSeeLessButton().getText()).toBe('See less');
        await aibotChatPanel.clickSeeMoreSeeLessButton();
        await expect(await aibotChatPanel.getSeeMoreSeeLessButton().getText()).toBe('See more');
    });

    it('Test certified knowledge nuggets in ai bot', async () => {
        await dossierPage.goToLibrary();
        await libraryPage.openDossier('Certified knowledge asset bot');
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.askQuestion('Number of Flights from Reagan airport?');
        await aibotChatPanel.openInterpretation();
        await expect(await aibotChatPanel.getNuggetTriggerIcon().getText()).toBe('1');
        await aibotChatPanel.clickNuggetTriggerIcon();
        await expect(await aibotChatPanel.getNuggetsPopoverContentDatasetTitle().getText()).toBe('airport codes');
        await expect(await aibotChatPanel.getNuggetsPopoverContentDefinition().getText()).toBe(
            'DCA is the airport code for Reagan International Airport in Washington DC'
        );
    });
});
