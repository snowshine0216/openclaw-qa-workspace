import { browserWindow } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';

// npm run regression -- --spec=specs/regression/bot2/Bot2_GuestMode_QA.spec.js --baseUrl=https://tec-l-1280162.labs.microstrategy.com/MicroStrategyLibrary/
describe('Bot 2.0 Guest mode Q&A', () => {
    let {
        loginPage,
        onboardingTutorial,
        libraryPage,
        aibotChatPanel,
        bot2Chat,
        userAccount,
    } = browsers.pageObj1;

    const project = {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    };

    const airlineBot = {
        id: '32E91BD177BA4F03A539AE5B7D7AD0C1',
        name: 'bot2_auto_chat',
        project: project
    };

    const universalBot = {
        id: '7285545C79DE49CCA8287B45589856BA',
        name: 'Auto_UniversalBot',
        project: project
    };

    const unstructureOnlyBot = {
        id: '7EBA39BA625E4CA49487618F3A4D7781',
        name: 'AUTO_Unstructure_Only',
        project: project
    };

    const unstructureMixedBot = {
        id: '2527C2DC15EB4CB1A24501FE48738224',
        name: 'AUTO_Unstructure_Mixed',
        project: project
    };

    const Questions = {
        airline1: "Which Airline Name has the highest Flights Cancelled?",
        airline2: "Show me Number of flights by year in bar chart",
        universal1: "List all category",
        universal2: "List the top 3 airline name with the highest total delayed time",
        unstructureOnly1: "Where is the headquarter of MicroStrategy",
        unstructureOnly2: "Who is responsible for choosing the attorney if I am sponsored by MicroStrategy for a nonimmigrant visa?",
        unstructureMixed1: "How many vacation day does Rujun Dai have?",
    };

    const expectedKeywords = {
        airline1: "Southwest Airlines Co.",
        airline2: "year",
        universal1: "Books; Music",
        universal2: "Southwest Airlines Co.; United Air Lines",
        unstructureOnly1: "headquarters",
        unstructureOnly2: "MicroStrategy; attorney",
        unstructureMixed1: "Rujun Dai",
    };

    beforeAll(async () => {
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        await loginPage.loginAsGuest();
        await onboardingTutorial.skip();
        await libraryPage.waitForLibraryLoading();
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
        await userAccount.clickAccountButton();
        await userAccount.getLogoutButton().click();
    });
    
    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC99383_1] Guest mode Q&A - single bot (MTDI)', async () => {
        await onboardingTutorial.skip();
        await libraryPage.openBot(airlineBot.name);
        await since('The greeting title on landing page should be #{expected}, but got: #{actual}')
            .expect(await aibotChatPanel.getWelcomePageGreetingTitle().getText())
            .toBe('Hi, Public / Guest!');

        // Ask question 1
        await aibotChatPanel.askQuestionNoWaitViz(Questions.airline1);
        // await aibotChatPanel.askQuestion(Questions.airline1, true);
        await since(`Airline bot answer 1 should contain expected keywords: ${expectedKeywords.airline1}`)
            .expect(await bot2Chat.verifyAnswerContainsKeywords(expectedKeywords.airline1))
            .toBe(true);
        // Ask question 2
        await aibotChatPanel.askQuestionNoWaitViz(Questions.airline2);
        // await aibotChatPanel.askQuestion(Questions.airline2, true);
        await since(`Airline bot answer 2 should contain expected keywords: ${expectedKeywords.airline2}`)
            .expect(await bot2Chat.verifyAnswerContainsKeywords(expectedKeywords.airline2))
            .toBe(true);
        // Add to snapshot
        await aibotChatPanel.hoverOnLatestAnswer();
        await aibotChatPanel.takeSnapshot();
        await aibotChatPanel.hoverOnLatestAnswer();
        await since('Snapshot button(unpin) should be displayed')
            .expect(await aibotChatPanel.isSnapshotButtonUnpinDisplayed())
            .toBe(true);
    });

    it('[TC99383_2] Guest mode Q&A - universal bot', async () => {
        await onboardingTutorial.skip();
        await libraryPage.openBot(universalBot.name);
        await since('The greeting title on landing page should be #{expected}, but got: #{actual}')
            .expect(await aibotChatPanel.getWelcomePageGreetingTitle().getText())
            .toBe('Hi, Public / Guest!');
            
        // Ask question 1
        await aibotChatPanel.askQuestionNoWaitViz(Questions.universal1);
        await since(`Universal bot answer 1 should contain expected keywords: ${expectedKeywords.universal1}`)
            .expect(await bot2Chat.verifyAnswerContainsKeywords(expectedKeywords.universal1))
            .toBe(true);
        // Ask question 2
        await aibotChatPanel.askQuestionNoWaitViz(Questions.universal2);
        await since(`Universal bot answer 2 should contain expected keywords: ${expectedKeywords.universal2}`)
            .expect(await bot2Chat.verifyAnswerContainsKeywords(expectedKeywords.universal2))
            .toBe(true);
    });

    it('[TC99383_3] Guest mode Q&A - unstructure only bot', async () => {
        await onboardingTutorial.skip();
        await libraryPage.openBot(unstructureOnlyBot.name);
        await since('The greeting title on landing page should be #{expected}, but got: #{actual}')
            .expect(await aibotChatPanel.getWelcomePageGreetingTitle().getText())
            .toBe('Hi, Public / Guest!');
            
        // Ask question 1
        await aibotChatPanel.askQuestionNoWaitViz(Questions.unstructureOnly1);
        await since(`Unstructure only bot answer 1 should contain expected keywords: ${expectedKeywords.unstructureOnly1}`)
            .expect(await bot2Chat.verifyAnswerContainsKeywords(expectedKeywords.unstructureOnly1))
            .toBe(true);
        // Clear history
        await aibotChatPanel.clearHistory();
        await since('The greeting title on landing page should be #{expected}, but got: #{actual}')
            .expect(await aibotChatPanel.getWelcomePageGreetingTitle().getText())
            .toBe('Hi, Public / Guest!');
        // Ask question 2
        await aibotChatPanel.askQuestionNoWaitViz(Questions.unstructureOnly2);
        await since(`Unstructure only bot answer 2 should contain expected keywords: ${expectedKeywords.unstructureOnly2}`)
            .expect(await bot2Chat.verifyAnswerContainsKeywords(expectedKeywords.unstructureOnly2))
            .toBe(true);
    });

    it('[TC99383_4] Guest mode Q&A - unstructure and structure mixed bot', async () => {
        await onboardingTutorial.skip();
        await libraryPage.openBot(unstructureMixedBot.name);
        await since('The greeting title on landing page should be #{expected}, but got: #{actual}')
            .expect(await aibotChatPanel.getWelcomePageGreetingTitle().getText())
            .toBe('Hi, Public / Guest!');
            
        // Ask question 1
        await aibotChatPanel.askQuestionNoWaitViz(Questions.unstructureMixed1);
        await since(`Unstructure and structure mixed bot answer 1 should contain expected keywords: ${expectedKeywords.unstructureMixed1}`)
            .expect(await bot2Chat.verifyAnswerContainsKeywords(expectedKeywords.unstructureMixed1))
            .toBe(true);
    });
});
