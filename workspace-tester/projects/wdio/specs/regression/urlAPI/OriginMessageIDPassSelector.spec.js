import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { customCredentials } from '../../../constants/index.js';
import CheckBox from '../../../pageObjects/selector/CheckBox.js';
import InCanvasSelector from '../../../pageObjects/selector/InCanvasSelector.js';
import MetricQualification from '../../../pageObjects/selector/MetricQualification.js';
import Dropdown from '../../../pageObjects/selector/Dropdown.js';
import Calendar from '../../../pageObjects/selector/Calendar.js';

const specConfiguration = { ...customCredentials('_urlapi') };

describe('Url API_ OriginMessageID pass Selector', () => {
    const sourceToPassSelector = {
        id: '176262E34DED628E41EAA8B95306D9DA',
        name: 'Source to pass selectors',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const sourceToPassPrompt = {
        id: 'FA344E0D4AFC4AF91C126AA99E47E9A2',
        name: 'Source_RWD with Fact Prompt',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const { credentials } = specConfiguration;

    let {
        loginPage,
        dossierPage,
        libraryPage,
        promptObject,
        filterSummary,
        filterSummaryBar,
        filterPanel,
        checkboxFilter,
        infoWindow,
        promptEditor,
        grid,
        inCanvasSelector,
        reset,
        toc,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);
        await setWindowSize({
            width: 1000,
            height: 800,
        });
    });

    afterEach(async () => {
        await browser.url(browser.options.baseUrl);
        await dossierPage.waitForDossierLoading();
    });

    it('[TC94178_01] Url API_ OriginMessageID pass Selector', async () => {
        // do links
        await libraryPage.openDossier(sourceToPassSelector.name);
        await dossierPage.waitForDossierLoading();
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 2', pageName: 'URL Links' });

        // pass selector by ID and check selector values
        await dossierPage.clickTextfieldByTitle('Pass selector by ID');
        await dossierPage.switchToTab(1);
        let costSelector = InCanvasSelector.createByAriaLable('Cost');
        let costMQ = new MetricQualification(costSelector);
        since ('Cost selector value after pass selector by ID should be #{expected}, while we get #{actual} ')
            .expect(await costMQ.getMQExpression())
            .toBe('Between 500000 And 700000');
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Element filter' });
        let yearSelector = InCanvasSelector.createByAriaLable('Year');
        let yearCheckbox = new CheckBox(yearSelector);
        since('Year selector value after pass selector by ID should be #{expected}, while we get #{actual} ')
            .expect(await yearCheckbox.getSelectedItemsText())
            .toEqual(['(All)', '2014', '2015', '2016']);
        let categorySelector = InCanvasSelector.createByAriaLable('Category');
        let categoryDropDown = new Dropdown(categorySelector);
        since('Category selector value after pass selector by ID should be #{expected}, while we get #{actual} ')
            .expect(await categoryDropDown.getShownSelectedText())
            .toBe('2');
        let calendarSelector = InCanvasSelector.createByAriaLable('From');
        let calendar = new Calendar(calendarSelector);
        since('Calendar selector value after pass selector by ID should be #{expected}, while we get #{actual} ')
            .expect(await calendar.getFromDate())
            .toBe('1/1/2014');
        since('Calendar selector value after pass selector by ID should be #{expected}, while we get #{actual} ')
            .expect(await calendar.getToDate())
            .toBe('12/31/2016');
        await dossierPage.closeCurrentTab();
        await dossierPage.switchToTab(0);

        // pass selector by Name -matched and check selector values
        await dossierPage.clickTextfieldByTitle('Pass selector by Name - matched');
        await dossierPage.switchToTab(1);
        costSelector = InCanvasSelector.createByAriaLable('Cost');
        costMQ = new MetricQualification(costSelector);
        since ('Cost selector value after pass selector by Name - matched should be #{expected}, while we get #{actual} ')
            .expect(await costMQ.getMQExpression())
            .toBe('Between 500000 And 700000');
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Element filter' });
        yearSelector = InCanvasSelector.createByAriaLable('Year');
        yearCheckbox = new CheckBox(yearSelector);
        since('Year selector value after pass selector by Name - matched should be #{expected}, while we get #{actual} ')
            .expect(await yearCheckbox.getSelectedItemsText())
            .toEqual(['(All)', '2014', '2015', '2016']);
        categorySelector = InCanvasSelector.createByAriaLable('Category');
        categoryDropDown = new Dropdown(categorySelector);
        since('Category selector value after pass selector by Name - matched should be #{expected}, while we get #{actual} ')
            .expect(await categoryDropDown.getShownSelectedText())
            .toBe('2');
        calendarSelector = InCanvasSelector.createByAriaLable('From');
        calendar = new Calendar(calendarSelector);
        since('Calendar selector value after pass selector by Name - matched should be #{expected}, while we get #{actual} ')
            .expect(await calendar.getFromDate())
            .toBe('1/1/2014');
        since('Calendar selector value after pass selector by Name - matched should be #{expected}, while we get #{actual} ')
            .expect(await calendar.getToDate())
            .toBe('12/31/2016');
        await dossierPage.closeCurrentTab();
        await dossierPage.switchToTab(0);

        // pass selector not carry over and check selector values
        await dossierPage.clickTextfieldByTitle('Pass selector - not carry over ');
        await dossierPage.switchToTab(1);
        costSelector = InCanvasSelector.createByAriaLable('Cost');
        costMQ = new MetricQualification(costSelector);
        since ('Cost selector value after pass selector - not carry over should be #{expected}, while we get #{actual} ')
            .expect(await costMQ.getMQExpression())
            .toBe('Is Not Null');
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Element filter' });
        yearSelector = InCanvasSelector.createByAriaLable('Year');
        yearCheckbox = new CheckBox(yearSelector);
        since('Year selector value after pass selector - not carry over should be #{expected}, while we get #{actual} ')
            .expect(await yearCheckbox.getSelectedItemsText())
            .toEqual(['2014']);
        categorySelector = InCanvasSelector.createByAriaLable('Category');
        categoryDropDown = new Dropdown(categorySelector);
        since('Category selector value after pass selector - not carry over should be #{expected}, while we get #{actual} ')
            .expect(await categoryDropDown.getShownSelectedText())
            .toBe('1');
        calendarSelector = InCanvasSelector.createByAriaLable('From');
        calendar = new Calendar(calendarSelector);
        since('Calendar selector value after pass selector - not carry over should be #{expected}, while we get #{actual} ')
            .expect(await calendar.getFromDate())
            .toBe('1/14/2014');
        since('Calendar selector value after pass selector - not carry over should be #{expected}, while we get #{actual} ')
            .expect(await calendar.getToDate())
            .toBe('12/31/2016');
        await dossierPage.closeCurrentTab();
        await dossierPage.switchToTab(0);

        // pass selector by Name - not matched and check selector values
        await dossierPage.clickTextfieldByTitle('Pass selector by Name - not matched ');
        await dossierPage.switchToTab(1);
        costSelector = InCanvasSelector.createByAriaLable('Cost');
        costMQ = new MetricQualification(costSelector);
        since ('Cost selector value after pass selector by Name - not matched should be #{expected}, while we get #{actual} ')
            .expect(await costMQ.getMQExpression())
            .toBe('Is Not Null');
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Element filter' });
        yearSelector = InCanvasSelector.createByAriaLable('Year');
        yearCheckbox = new CheckBox(yearSelector);
        since('Year selector value after pass selector by Name - not matched should be #{expected}, while we get #{actual} ')
            .expect(await yearCheckbox.getSelectedItemsText())
            .toEqual(['2014']);
        categorySelector = InCanvasSelector.createByAriaLable('Category');
        categoryDropDown = new Dropdown(categorySelector);
        since('Category selector value after pass selector by Name - not matched should be #{expected}, while we get #{actual} ')
            .expect(await categoryDropDown.getShownSelectedText())
            .toBe('1');
        calendarSelector = InCanvasSelector.createByAriaLable('From');
        calendar = new Calendar(calendarSelector);
        since('Calendar selector value after pass selector by Name - not matched should be #{expected}, while we get #{actual} ')
            .expect(await calendar.getFromDate())
            .toBe('1/14/2014');
        since('Calendar selector value after pass selector by Name - not matched should be #{expected}, while we get #{actual} ')
            .expect(await calendar.getToDate())
            .toBe('12/31/2016');
        await dossierPage.closeCurrentTab();
        await dossierPage.switchToTab(0);
    });

    it('[TC94178_02] Url API_ OriginMessageID pass prompt', async () => {
        // do links
        await libraryPage.openDossier(sourceToPassPrompt.name);
        await dossierPage.waitForDossierLoading();
        
        // pass prompt with originMessageID + no promptAnswerMode + same tab and check target prompt answers
        await dossierPage.clickTextfieldByTitle('OriginMessageID + no promptAnswerMode + same tab');
        since('total prompts should be #{expected}, while we get #{actual}')
            .expect(await promptObject.getPromptsNumber())
            .toBe(3);
        await promptEditor.toggleViewSummary();
        since('first object prompt answer should be #{expected}, while we get #{actual}')
            .expect(await promptEditor.checkListSummaryByIndex(0))
            .toEqual('Call Center');
        since('second object prompt answer should be #{expected}, while we get #{actual}')
            .expect(await promptEditor.checkListSummaryByIndex(1))
            .toEqual('Cost, Revenue');
        since('third object prompt answer should be #{expected}, while we get #{actual}')
            .expect(await promptEditor.checkListSummaryByIndex(2))
            .toEqual('Quarter=Q3 Filter');
        await promptEditor.cancelEditor();

        // pass prompt with originMessageID + promptAnswerMode = 2 + new tab and check target prompt answers  --- empty
        await dossierPage.clickTextfieldByTitle('OriginMessageID + promptAnswerMode = 2 + new tab');
        await dossierPage.switchToTab(1);
        await dossierPage.waitForPageLoadByTitle('Target_Dashboard with Multiple Object Prompts_2Panels');
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        since('first object prompt answer should be #{expected}, while we get #{actual}')
            .expect(await promptEditor.checkEmptySummaryByIndex(0))
            .toEqual('No Selection');
        since('second object prompt answer should be #{expected}, while we get #{actual}')
            .expect(await promptEditor.checkEmptySummaryByIndex(1))
            .toEqual('No Selection');
        since('fourth object prompt answer should be #{expected}, while we get #{actual}')
            .expect(await promptEditor.checkListSummaryByIndex(3))
            .toEqual('Revenue');
        await promptEditor.cancelEditor();
        await dossierPage.closeCurrentTab();
        await dossierPage.switchToTab(0);

        // pass prompt with OriginMessageID + promptAnswerMode = 1 + same tab and check values -- default one
        await dossierPage.clickTextfieldByTitle('OriginMessageID + promptAnswerMode = 1 + same tab');
        await dossierPage.waitForPageLoadByTitle('Target_Dashboard with Multiple Object Prompts_2Panels');
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        since('first object prompt answer should be #{expected}, while we get #{actual}')
            .expect(await promptEditor.checkListSummaryByIndex(0))
            .toEqual('Call Center');
        since('second object prompt answer should be #{expected}, while we get #{actual}')
            .expect(await promptEditor.checkListSummaryByIndex(1))
            .toEqual('Cost, Revenue');
        since('third object prompt answer should be #{expected}, while we get #{actual}')
            .expect(await promptEditor.checkListSummaryByIndex(2))
            .toEqual('Quarter=Q3 Filter');
        since('fourth object prompt answer should be #{expected}, while we get #{actual}')
            .expect(await promptEditor.checkListSummaryByIndex(3))
            .toEqual('Revenue');
        await promptEditor.cancelEditor();
        await dossierPage.goBackFromDossierLink();

        // pass prompt with OriginMessageID + promptAnswerMode = 0 + new tab and check values  -- no pass
        await dossierPage.clickTextfieldByTitle('OriginMessageID + promptAnswerMode = 0 + new tab');
        await dossierPage.switchToTab(1);
        since('total prompts should be #{expected}, while we get #{actual}')
            .expect(await promptObject.getPromptsNumber())
            .toBe(4);
        await promptEditor.toggleViewSummary();
        since('first object prompt answer should be #{expected}, while we get #{actual}')
            .expect(await promptEditor.checkListSummaryByIndex(0))
            .toEqual('Call Center');
        since('second object prompt answer should be #{expected}, while we get #{actual}')
            .expect(await promptEditor.checkListSummaryByIndex(1))
            .toEqual('Cost, Revenue');
        since('third object prompt answer should be #{expected}, while we get #{actual}')
            .expect(await promptEditor.checkListSummaryByIndex(2))
            .toEqual('Quarter=Q3 Filter');
        since('fourth object prompt answer should be #{expected}, while we get #{actual}')
            .expect(await promptEditor.checkListSummaryByIndex(3))
            .toEqual('Cost');
        await promptEditor.cancelEditor();
        await dossierPage.closeCurrentTab();
        await dossierPage.switchToTab(0);
    });


    
});

export const config = specConfiguration;
