import { customCredentials } from '../../../constants/index.js';
import resetReportState from '../../../api/reports/resetReportState.js';

const specConfiguration = { ...customCredentials('_reportSummary') };

describe('Library Report Filter Summary - Drill', () => {
    const tutorialProject = {
        id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
        name: 'MicroStrategy Tutorial',
    };
    const drillAnywhere = {
        id: 'AA41B899466816899B140FABCF0DC8B4',
        name: '(Auto) Report_drill anywhere',
        project: tutorialProject,
    };
    const drillWithin = {
        id: '4043FC2A411A724BFAADB8AFE0A66E87',
        name: '(Auto) Report_drill anywhere_drill within',
        project: tutorialProject,
    };
    const drillOut = {
        id: '04A46D484FD735D37E1713B0F8374516',
        name: '(Auto) Report_drill down only_drill out',
        project: tutorialProject,
    };
    const vra = {
        id: '7D4034FF4F42FBCA70F634BB41FC31A7',
        name: 'Report-drill anywhere',
        project: tutorialProject,
    };

    const { credentials } = specConfiguration;

    let { dossierPage, reportPage, reportGrid, libraryPage, reportSummary, loginPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC86805_01] Report filter summary - Drill manipulation from web - Drill within', async () => {
        await resetReportState({
            credentials: credentials,
            report: drillWithin,
        });
        await libraryPage.openDossier(drillWithin.name);
        await reportPage.waitForReportLoading();
        await since(
            'Report with drill within, filter summary panel supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportSummary.getSummaryBarText())
            .toBe(
                `VIEW FILTERS  |  Set of Country, Year filtered by { Year (in list 2014)  AND  Call Center (in list Atlanta) }`
            );
    });

    it('[TC86805_02] Report filter summary - Drill manipulation from web - Drill out', async () => {
        await resetReportState({
            credentials: credentials,
            report: drillOut,
        });
        await libraryPage.openDossier(drillOut.name);
        await reportPage.waitForReportLoading();
        await since('Report with drill out, filter summary panel supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getSummaryBarText())
            .toBe(`REPORT FILTERS  |  Quarter (in list 2014 Q1)  AND  Call Center (in list Atlanta)`);
    });

    it('[TC86806] Report filter summary - Do Drill manipulation in library - Drill anywhere', async () => {
        await resetReportState({
            credentials: credentials,
            report: drillAnywhere,
        });
        await libraryPage.openDossier(drillAnywhere.name);
        await reportPage.waitForReportLoading();
        await since('Report with no filter, filter summary panel supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getSummaryBarText())
            .toBe(`FILTERS (0) | No filter selections`);

        // Drill winthin - Drill from Call Center Atlanta to Country
        await reportGrid.selectReportGridContextMenuOption({
            headerName: 'Call Center',
            elementName: 'Atlanta',
            firstOption: 'Drill',
            secondOption: 'Country',
        });
        await reportPage.waitForReportLoading();
        await since(
            'Report with drill within, filter summary panel supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportSummary.getSummaryBarText())
            .toBe(
                `VIEW FILTERS  |  Set of Country, Year filtered by { Year (in list 2014)  AND  Call Center (in list Atlanta) }`
            );
        await since('The footer correctly lists should be #{expected} after back from drill, instead we have #{actual}')
            .expect(await reportGrid.getReportFooter().getText())
            .toBe('4 Rows, 1 Columns');

        // Drill out - Drill from Category Books to Subcategory
        await reportGrid.selectReportGridContextMenuOption({
            headerName: 'Category',
            elementName: 'Books',
            firstOption: 'Drill',
            secondOption: 'Subcategory',
        });
        await reportPage.waitForDrillNotificationBox();
        await reportPage.waitForReportLoading();
        await since('Report with drill out, filter summary panel supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getSummaryBarText())
            .toContain(
                `REPORT FILTERS  |  Year (in list 2014)  AND  { Country (in list USA)  AND  Category (in list Books) }`
            );
        await since('The footer correctly lists should be #{expected} after back from drill, instead we have #{actual}')
            .expect(await reportGrid.getReportFooter().getText())
            .toBe('6 Rows, 1 Columns');

        // Back to origin report
        await dossierPage.goBackFromDossierLink();
        await reportPage.waitForReportLoading();
        await since(
            'Report with back from drill, filter summary panel supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportSummary.getSummaryBarText())
            .toBe(
                `VIEW FILTERS  |  Set of Country, Year filtered by { Year (in list 2014)  AND  Call Center (in list Atlanta) }`
            );
        await since('The footer correctly lists should be #{expected} after back from drill, instead we have #{actual}')
            .expect(await reportGrid.getReportFooter().getText())
            .toBe('4 Rows, 1 Columns');
    });
});
export const config = specConfiguration;
