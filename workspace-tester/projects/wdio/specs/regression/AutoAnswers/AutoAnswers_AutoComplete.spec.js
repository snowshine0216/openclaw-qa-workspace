import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { autoAnswerUser } from '../../../constants/autoAnswer.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('Auto Complete for Auto Anwsers', () => {
    const project = {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    };
    const autoComplete = {
        id: 'AE68421C354E733E9A463EA172BB7EC5',
        name: 'AutoAnswers_AutoComplete',
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
            dossier: autoComplete,
        });
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    afterAll(async () => {});

    /** all dataset attribute are able to be appeared in auto complete list */
    it('[TC95929_01] Auto complete in Auto Answers - normal attribute', async () => {
        await libraryPage.openDossier(autoComplete.name);

        // open AI assistant
        await toc.openPageFromTocMenu({ chapterName: 'Normal', pageName: 'Page 1' });
        await aiAssistant.openAndPin();

        // attribute used in current page
        await aiAssistant.input('airline');
        await since('Input airline, auto complete popup present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isSuggestionPresent())
            .toBe(true);
        await since('Input airline, auto complete suggestion count should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getSuggestionCount())
            .toBe(1);
        // add a screenshot for suggestion list
        await takeScreenshotByElement(aiAssistant.getSuggestionPopup(), 'Auto Complete Suggestion List');

        // attribute not used in current page, but used in other pages
        await aiAssistant.input('airport');
        await since('Input airport, auto complete popup present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isSuggestionPresent())
            .toBe(true);
        await since('Input airport, auto complete suggestion count should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getSuggestionCount())
            .toBe(1);
        await since('Input airport, suggest texts should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getSuggetionListTexts())
            .toEqual(['Origin Airport']);

        // attribute not used in this dossier
        await aiAssistant.input('month');
        await since('Input month, auto complete popup present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isSuggestionPresent())
            .toBe(true);
        await since('Input month, auto complete suggestion count should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getSuggestionCount())
            .toBe(1);
        await since('Input month, suggest texts should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getSuggetionListTexts())
            .toEqual(['Month']);
    });

    /** only metric used in current page is able to be appeared in auto complete list */
    it('[TC95929_02] Auto complete in Auto Answers - normal metric', async () => {
        await libraryPage.openDossier(autoComplete.name);

        // open AI assistant
        await toc.openPageFromTocMenu({ chapterName: 'Normal', pageName: 'Page 2' });
        await aiAssistant.openAndPin();

        // metric used in current page
        await aiAssistant.input('flight');
        await since('Input flight, auto complete popup present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isSuggestionPresent())
            .toBe(true);
        await since('Input flight, auto complete suggestion count should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getSuggestionCount())
            .toBe(3);
        await since('Input flight, suggest texts should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getSuggetionListTexts())
            .toEqual(['Number of Flights', 'Flights Delayed', 'Flights Cancelled']);

        // metric not used in current page, but used in other pages
        await aiAssistant.input('delayed');
        await since('Input delayed, auto complete popup present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isSuggestionPresent())
            .toBe(true);

        // metric not used in this dossier
        await aiAssistant.input('avg');
        await since('Input avg, auto complete popup present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isSuggestionPresent())
            .toBe(true);
    });

    /** always show the attribute and metric alias if there is */
    it('[TC95929_03] Auto complete in Auto Answers - attribute and metric with alias', async () => {
        await libraryPage.openDossier(autoComplete.name);

        // open AI assistant
        await toc.openPageFromTocMenu({ chapterName: 'Others', pageName: 'Alias' });
        await aiAssistant.openAndPin();

        // attribute with viz level alias
        await aiAssistant.input('year');
        await since('Input year, auto complete suggestion count should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getSuggestionCount())
            .toBe(4);
        await since(
            'Input year, Year - viz alias appears in suggestion list should be #{expected}, while we get #{actual}'
        )
            .expect(await aiAssistant.isTextInSuggestionList('Year - viz alias'))
            .toBe(true);

        // metric with viz level alias
        await aiAssistant.input('avg');
        await since('Input avg, auto complete suggestion count should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getSuggestionCount())
            .toBe(1);
        await since(
            'Input avg,  Avg Delay (min) - viz alias appears in suggestion list should be #{expected}, while we get #{actual}'
        )
            .expect(await aiAssistant.isTextInSuggestionList('Avg Delay (min) - viz alias'))
            .toBe(true);

        // attribute with dataset level alias
        await aiAssistant.input('week');
        await since('Input week, auto complete suggestion count should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getSuggestionCount())
            .toBe(1);
        await since(
            'Input avg,  Day of Week - dataset alias appears in suggestion list should be #{expected}, while we get #{actual}'
        )
            .expect(await aiAssistant.isTextInSuggestionList('Day of Week - dataset alias'))
            .toBe(true);
    });

    /** derived attribute/metric are the same with normal attribute/mertric */
    it('[TC95929_04] Auto complete in Auto Answers - derived attribut and metric', async () => {
        await libraryPage.openDossier(autoComplete.name);

        // open AI assistant
        await toc.openPageFromTocMenu({ chapterName: 'Others', pageName: 'Derived' });
        await aiAssistant.openAndPin();

        // new attribute
        await aiAssistant.input('year');
        await since('Input year, auto complete suggestion count should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getSuggestionCount())
            .toBe(4);
        await since('Input year, Year(Link) appears in suggestion list should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isTextInSuggestionList('Year(Link)'))
            .toBe(true);

        // new attribute link
        await since('Input year, Year(New) appears in suggestion list should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isTextInSuggestionList('Year(New)'))
            .toBe(true);

        // attribute convert to metric
        await since('Input year, Count(Year) appears in suggestion list should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isTextInSuggestionList('Count(Year)'))
            .toBe(true);

        // new metric
        await aiAssistant.input('on-Time');
        await since('Input on-Time, auto complete suggestion count should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getSuggestionCount())
            .toBe(3);
        await since('Input year, on-Time(New) appears in suggestion list should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isTextInSuggestionList('On-Time(New)'))
            .toBe(true);

        // metric conver to attribtue
        await since(
            'Input year, on-Time(Attribute) appears in suggestion list should be #{expected}, while we get #{actual}'
        )
            .expect(await aiAssistant.isTextInSuggestionList('On-Time(Attribute)'))
            .toBe(true);
    });

    it('[TC95929_05] Auto complete in Auto Answers - auto complete list order ', async () => {
        await libraryPage.openDossier(autoComplete.name);

        // open AI assistant
        await toc.openPageFromTocMenu({ chapterName: 'Normal', pageName: 'Page 2' });
        await aiAssistant.openAndPin();

        // attribute
        await aiAssistant.input('air');
        await since('Input air, auto complete suggestion count should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getSuggestionCount())
            .toBe(2);

        // metric
        await aiAssistant.input('flight');
        await since('Input flight, auto complete suggestion count should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getSuggestionCount())
            .toBe(3);
        await since('Input flight, suggest texts should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getSuggetionListTexts())
            .toEqual(['Number of Flights', 'Flights Delayed', 'Flights Cancelled']);

        // attribute and metric
        await toc.openPageFromTocMenu({ chapterName: 'Others', pageName: 'Derived' });
        await aiAssistant.waitForAIReady();
        await aiAssistant.input('year');
        await since('Input year, auto complete suggestion count should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getSuggestionCount())
            .toBe(4);
        await since('Input year, suggest texts should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getSuggetionListTexts())
            .toEqual(['Count(Year)', 'Year(New)', 'Year(Link)', 'Year']);
    });
});
