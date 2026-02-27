import resetDossierState from '../../../api/resetDossierState.js';
import { customCredentials } from '../../../constants/index.js';
import { addMonthsAndDays, getStringOfDate, getStringOfDayTime, getToday } from '../../../utils/DateUtil.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

const specConfiguration = { ...customCredentials('_selector') };
const { credentials } = specConfiguration;
const tolerance = 0.2;

const tutorialProject = {
    id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
    name: 'MicroStrategy Tutorial',
};

describe('Calendar Selector', () => {
    const docProperty1 = {
        id: '492E05F241B7B68BAC403C957B1CFF51',
        name: 'AUTO_exclude_Calendar selector',
        project: tutorialProject,
    };
    const docProperty2 = {
        id: '8F2E61664AD2AD8E1D31B180B68D4369',
        name: 'AUTO_Show Title_Calendar selector',
        project: tutorialProject,
    };
    const docFormat1 = {
        id: 'BC0964344FC106F656F0D2ACB3D91836',
        name: 'AUTO_Alignment_Calendar selector',
        project: tutorialProject,
    };
    const docFormat2 = {
        id: '4A3FC0734A7019F9211E10A073FA5122',
        name: 'AUTO_Color and Lines_Effects_Calendar selector',
        project: tutorialProject,
    };
    const docFormat3 = {
        id: '1ABEA5FA48B951EE5C08139CFB84B66A',
        name: 'AUTO_Font_Calendar selector',
        project: tutorialProject,
    };
    const docsSourceAndTarget1 = {
        id: 'C23C63F1420956EBB3262EBDB7043EA4',
        name: 'AUTO_Calendar selector_without source_with source',
        project: tutorialProject,
    };
    const docsSourceAndTarget2 = {
        id: '1C14FD2D452BF88132300C84A2B92F97',
        name: 'AUTO_Calendar selector_without target_grid and graph as Target',
        project: tutorialProject,
    };
    const docsSourceAndTarget3 = {
        id: 'E833A40B40C42AF57602A9857F65CEDF',
        name: 'AUTO_Calendar selector_dayTime',
        project: tutorialProject,
    };

    let { loginPage, selector, libraryPage, dossierPage, rsdPage, toc, rsdGrid } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC80323] Library | Validate Calendar selector - Property', async () => {
        // Exclude
        await resetDossierState({ credentials, dossier: docProperty1 });
        await libraryPage.openUrl(tutorialProject.id, docProperty1.id);
        await selector.calendar.openFromCalendar();
        await selector.calendar.selectDate('2014', 'Jan', '1');
        await since('Exclude mode: From date should be #{expected}, while we get #{actual}')
            .expect(getStringOfDate(await selector.calendar.getFromDate()))
            .toBe(getStringOfDate('1/1/2014'));
        await takeScreenshotByElement(
            selector.calendar.getElement(),
            'TC80323',
            'CalenarSelector_Property_Exclude_From20140101'
        );
        await selector.calendar.openToCalendar();
        await selector.calendar.selectDate('2016', 'Dec', '15');
        await since('Exclude mode: To date should be #{expected}, while we get #{actual}')
            .expect(getStringOfDate(await selector.calendar.getToDate()))
            .toBe(getStringOfDate('12/15/2016'));
        await since('Exclude mode: first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('12/16/2016');
        await dossierPage.goToLibrary();

        // Show title
        await resetDossierState({ credentials, dossier: docProperty2 });
        await libraryPage.openUrl(tutorialProject.id, docProperty2.id);
        await selector.calendar.openFromCalendar();
        await selector.calendar.selectDate('2014', 'Jan', '20');
        await since('Show title: From date should be #{expected}, while we get #{actual}')
            .expect(getStringOfDate(await selector.calendar.getFromDate()))
            .toBe(getStringOfDate('1/20/2014'));
        await since('Show title: first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('1/20/2014');
        await takeScreenshotByElement(
            selector.calendar.getElement(),
            'TC80323',
            'CalenarSelector_Property_Exclude_From20140120'
        );
    });

    it('[TC80324] Library | Calendar selector - Foramt', async () => {
        // Alignment
        await resetDossierState({ credentials, dossier: docFormat1 });
        await libraryPage.openUrl(tutorialProject.id, docFormat1.id);
        await selector.calendar.openFromCalendar();
        await selector.calendar.selectDate('2014', 'Jan', '20');
        await since('Alignment left/center/right: From date should be #{expected}, while we get #{actual}')
            .expect(getStringOfDate(await selector.calendar.getFromDate()))
            .toBe(getStringOfDate('1/20/2014'));
        await since('Alignment left/center/right: first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('1/20/2014');
        await takeScreenshotByElement(
            rsdPage.getDocLayoutViewer(),
            'TC80324',
            'CalenarSelector_Format_Alignment_From20140120',
            {
                tolerance: tolerance,
            }
        );
        await dossierPage.goToLibrary();

        // Effects
        await resetDossierState({ credentials, dossier: docFormat2 });
        await libraryPage.openUrl(tutorialProject.id, docFormat2.id);
        await takeScreenshotByElement(
            rsdPage.getDocLayoutViewer(),
            'TC80324',
            'CalendarSelector_Format_ColorAndLines_Effects_initialRendering',
            {
                tolerance: tolerance,
            }
        );

        // Color and lines
        await selector.calendar.openToCalendar();
        await selector.calendar.selectDate('2016', 'Dec', '15');
        await since('Color and Lines + Effects: To date should be #{expected}, while we get #{actual}')
            .expect(getStringOfDate(await selector.calendar.getToDate()))
            .toBe(getStringOfDate('12/15/2016'));
        await since('Color and Lines + Effects: first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('11/30/2016');
        await dossierPage.goToLibrary();

        // Font
        await resetDossierState({ credentials, dossier: docFormat3 });
        await libraryPage.openUrl(tutorialProject.id, docFormat3.id);
        await takeScreenshotByElement(
            rsdPage.getDocLayoutViewer(),
            'TC80324',
            'CalenarSelector_Format_Font_initialRendering',
            {
                tolerance: tolerance,
            }
        );
        await selector.calendar.openToCalendar();
        await selector.calendar.selectDate('2016', 'Dec', '15');
        await since('Font: To date should be #{expected}, while we get #{actual}')
            .expect(getStringOfDate(await selector.calendar.getToDate()))
            .toBe(getStringOfDate('12/15/2016'));
        await since('Font: first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('11/30/2016');
    });

    it('[TC80325] Library | Calendar selector - Source and Target', async () => {
        // Day source - select attribute qualification
        await resetDossierState({ credentials, dossier: docsSourceAndTarget1 });
        await libraryPage.openUrl(tutorialProject.id, docsSourceAndTarget1.id);
        const selector1 = rsdPage.findSelectorByName('CalendarSelectorWithSource');
        await selector1.calendar.openToCalendar();
        await selector1.calendar.selectDate('2016', 'Dec', '15');
        await since(
            'Day source - select atttribute qualification: To date should be #{expected}, while we get #{actual}'
        )
            .expect(getStringOfDate(await selector1.calendar.getToDate()))
            .toBe(getStringOfDate('12/15/2016'));
        await dossierPage.goToLibrary();

        // Daytime source
        await resetDossierState({ credentials, dossier: docsSourceAndTarget3 });
        await libraryPage.openUrl(tutorialProject.id, docsSourceAndTarget3.id);
        await selector.calendar.openToCalendar();
        await selector.calendar.selectDayTime('2014', 'Jun', '10', '10', '20', '20');
        await selector.calendar.clickDynamicCalendarButton('OK');
        await since(
            'Daytime source - select atttribute qualification: To date should be #{expected}, while we get #{actual}'
        )
            .expect(getStringOfDayTime(await selector.calendar.getToDate()))
            .toBe(getStringOfDayTime('6/10/2014 10:20:20'));
        await dossierPage.goToLibrary();

        // No target
        await resetDossierState({ credentials, dossier: docsSourceAndTarget2 });
        await libraryPage.openUrl(tutorialProject.id, docsSourceAndTarget2.id);
        const selector2 = rsdPage.findSelectorByName('NoTarget');
        await selector2.calendar.openFromCalendar();
        await selector2.calendar.selectDate('2014', 'Jan', '15');
        await since('No target: From date should be #{expected}, while we get #{actual}')
            .expect(getStringOfDate(await selector2.calendar.getFromDate()))
            .toBe(getStringOfDate('01/15/2014'));

        // With target - grid
        const selector3 = rsdPage.findSelectorByName('AsTarget');
        await selector3.calendar.openFromCalendar();
        await selector3.calendar.selectDate('2014', 'Jan', '15');
        await since('With target - grid: From date should be #{expected}, while we get #{actual}')
            .expect(getStringOfDate(await selector3.calendar.getFromDate()))
            .toBe(getStringOfDate('01/15/2014'));
        await since('With target - grid: first grid element should be #{expected}, while we get #{actual}')
            .expect(getStringOfDate(await rsdGrid.getFirstGridCell()))
            .toBe('01/15/2014');
    });

    it('[TC80326] Library | Calendar selector - Manipulation', async () => {
        await resetDossierState({ credentials, dossier: docsSourceAndTarget1 });
        await libraryPage.openUrl(tutorialProject.id, docsSourceAndTarget1.id);
        const selector = rsdPage.findSelectorByName('CalendarSelectorWithSource');

        // Select date from calendar widget
        await selector.calendar.openFromCalendar();
        await selector.calendar.selectDate('2014', 'Jan', '1');
        await since('Select date from calendar widget: From date should be #{expected}, while we get #{actual}')
            .expect(getStringOfDate(await selector.calendar.getFromDate()))
            .toBe(getStringOfDate('1/1/2014'));
        await since(
            'Select date from calendar widget: first grid element should be #{expected}, while we get #{actual}'
        )
            .expect(getStringOfDate(await rsdGrid.getFirstGridCell()))
            .toBe('01/01/2014');
        await selector.calendar.openToCalendar();
        await selector.calendar.selectDate('2014', 'Jan', '15');
        await since('Select date from calendar widget: To date should be #{expected}, while we get #{actual} ')
            .expect(getStringOfDate(await selector.calendar.getToDate()))
            .toBe(getStringOfDate('1/15/2014'));
        await since('Select To date from calendar widget: date display should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.isCellDisplayed('1/15/2014'))
            .toBe(true);

        // Manully input date
        const dateToput = '1/10/2014';
        await selector.calendar.inputDate('from', dateToput);
        await rsdPage.waitAllToBeLoaded();
        await since('Input date directly: From date should be #{expected}, while we get #{actual} ')
            .expect(getStringOfDate(await selector.calendar.getFromDate()))
            .toBe(getStringOfDate(dateToput));
        await since('Input date directly: first grid element should be #{expected}, while we get #{actual}')
            .expect(getStringOfDate(await rsdGrid.getFirstGridCell()))
            .toBe('01/10/2014');

        // Select dynamic date
        await selector.calendar.openToCalendar();
        await selector.calendar.clickDynamicDateCheckBox();
        await selector.calendar.selectDynamicDayDropdownItem(1, 'plus'); // dynamic day +2
        await selector.calendar.clickDynamicDayStepperNext(2);
        await selector.calendar.selectDynamicMonthDropdownItem(2, 'minus'); // dynamic month -(+2-1)=-1
        await selector.calendar.clickDynamicMonthStepperNext(2);
        await selector.calendar.clickDynamicMonthStepperPrev(1);
        await selector.calendar.clickDynamicCalendarButton('OK');
        const expectedDate = getStringOfDate(addMonthsAndDays(-1, 2, getToday()));
        await since('Select dynamic date: To date should be #{expected}, while we get #{actual} ')
            .expect(getStringOfDate(await selector.calendar.getToDate()))
            .toBe(expectedDate);
    });
});
export const config = specConfiguration;
