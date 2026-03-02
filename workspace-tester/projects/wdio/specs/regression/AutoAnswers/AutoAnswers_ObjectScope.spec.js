import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { autoAnswerUser } from '../../../constants/autoAnswer.js';

describe('Object Scope for Auto Anwsers', () => {
    const project = {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    };
    const objectScope = {
        id: '0C4A7CD30D496B514CACCB8C086F6BEF',
        name: 'AutoAnswers_ObjectScope',
        project,
    };
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    const { loginPage, dossierPage, libraryPage, toc, aiAssistant, interpretation } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(autoAnswerUser);
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        await resetDossierState({
            credentials: autoAnswerUser,
            dossier: objectScope,
        });
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    afterAll(async () => {});

    it('[TC95328_01] Object scope in Auto Answers - send question with attribute', async () => {
        await libraryPage.openDossier(objectScope.name);

        // open AI assistant
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await aiAssistant.openAndPin();

        // attribute in current page
        await aiAssistant.sendQuestionWithTextAndObject([
            { content: 'list all the', type: 'text' },
            { content: 'Airline Name', type: 'object' },
        ]);
        await since(
            'send question with attribute in current page,keywords contains should be #{expected}, while we get #{actual}'
        )
            .expect(await aiAssistant.isAnswerContainsOneOfKeywords(['Southwest Airlines Co.']))
            .toBe(true);

        // attribute not in current page
        await aiAssistant.sendQuestionWithTextAndObject([
            { content: 'how many types of ', type: 'text' },
            { content: 'Origin Airport', type: 'object' },
        ]);
        await since(
            'send question with attribute not in current page,keywords contains should be #{expected}, while we get #{actual}'
        )
            .expect(await aiAssistant.isAnswerContainsOneOfKeywords(['3']))
            .toBe(true);

        // attribute in filter panel
        await aiAssistant.inputAndSendQuestion('show the Year attribute');
        await since(
            'send question with attribute in current page,keywords contains should be #{expected}, while we get #{actual}'
        )
            .expect(await aiAssistant.isAnswerContainsOneOfKeywords(['only one', '2011']))
            .toBe(true);
    });

    it('[TC95328_02] Object scope in Auto Answers - send question with metric', async () => {
        await libraryPage.openDossier(objectScope.name);

        // open AI assistant
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 2', pageName: 'Page 1' });
        await aiAssistant.openAndPin();

        // metric in filter panel
        await aiAssistant.inputAndSendQuestion('show the On-Time for Year 2010');
        // random missing thousand seperator due to aiservice issue DE299726
        await since(
            'send question with metric in filter panel,keywords contains should be #{expected}, while we get #{actual}'
        )
            .expect(await aiAssistant.isAnswerContainsOneOfKeywords(['151,360.00', '151360', '151,360']))
            .toBe(true);

        // metric in element value selector

        await aiAssistant.inputAndSendQuestion('show the total Number of Flights');
        await since(
            'send question with metric in value selector,keywords contains should be #{expected}, while we get #{actual}'
        )
            .expect(await aiAssistant.isAnswerContainsOneOfKeywords(['473,435', '473435']))
            .toBe(true);

        // metric in metric selector
        await aiAssistant.inputAndSendQuestion('how many Flights Cancelled for US Airways Inc.');
        await since(
            'send question with metric in metric selector,keywords contains should be #{expected}, while we get #{actual}'
        )
            .expect(await aiAssistant.isAnswerContainsOneOfKeywords(['1,594', '1594']))
            .toBe(true);

        // metric in current page
        await aiAssistant.inputAndSendQuestion('show the averge Avg Delay (min) in Year 2011');
        await since(
            'send question with metric in current page,keywords contains should be #{expected}, while we get #{actual}'
        )
            .expect(await aiAssistant.isAnswerContainsOneOfKeywords(['31.93']))
            .toBe(true);

        // attribute not in current page
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await aiAssistant.waitForAIReady();
        await aiAssistant.inputAndSendQuestion('show the number of Flights Delayed for Southwest Airlines Co.');
        await since(
            'send question with metric not in current page,keywords contains should be #{expected}, while we get #{actual}'
        )
            .expect(await aiAssistant.isAnswerContainsOneOfKeywords(['2,617', '2617']))
            .toBe(true);
    });

    it('[TC95328_03] Object scope in Auto Answers - send question with alias and derived ', async () => {
        await libraryPage.openDossier(objectScope.name);

        // open AI assistant
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 3', pageName: 'Page 1' });
        await aiAssistant.openAndPin();

        // attribute alias in current page
        await aiAssistant.inputAndSendQuestion('show all the Year(Alias) ');
        await since(
            'send question with attribute alias,keywords contains should be #{expected}, while we get #{actual}'
        )
            .expect(await aiAssistant.isAnswerContainsOneOfKeywords(['only one', '2011']))
            .toBe(true);

        // metric alias in current page
        await aiAssistant.inputAndSendQuestion('how many Flights Cancelled(Alias) in Year(Alias) 2011');
        await since('send question with metric alias,keywords contains should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isAnswerContainsOneOfKeywords(['982']))
            .toBe(true);

        // derived metric in current page
        await aiAssistant.inputAndSendQuestion('show the On-Time(New)  in Year(Alias) 2011');
        await since('send question with derived metric,keywords contains should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isAnswerContainsOneOfKeywords(['11,222', '11222']))
            .toBe(true);
    });
});
