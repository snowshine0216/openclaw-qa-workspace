import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import resetReportState from '../../../api/reports/resetReportState.js';

const specConfiguration = { ...customCredentials('_interfacelanguage') };
const { credentials } = specConfiguration;

describe('InterfaceLanguage - ReportFilter', () => {
    const tutorialProject = {
        id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
        name: 'MicroStrategy Tutorial',
    };
    const reportI18NDate = {
        id: '235F2BE04AB715A771D9FAB32B60B4B3',
        name: '(AUTO) Report_I18N_Date',
        project: tutorialProject,
    };
    const reportI18NNumber = {
        id: '5B0AEA944499A2332AA121B65B6831FB',
        name: '(AUTO) Report_I18N_Number',
        project: tutorialProject,
    };
    const reportI18NPrompt = {
        id: '97BC34F045AB58311AC0FBADCA971FC1',
        name: '(AUTO) Report_I18N_Prompt',
        project: tutorialProject,
    };

    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1200,
    };

    let { loginPage, dossierPage, libraryPage, reportSummary, promptEditor, reportPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);

        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        await libraryPage.reload();
    });

    afterEach(async () => {});

    it('[TC90417] I18N - Validate date format on report filter summary', async () => {
        await resetReportState({
            credentials: credentials,
            report: reportI18NDate,
        });
        await libraryPage.openDossier(reportI18NDate.name);
        await reportSummary.viewAll();

        // multi attributs
        await since('Date filters, Filter value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getLeafRowValue('报表筛选器', '筛选'))
            .toContain(
                `([Day,DayTime] = [2014-01-02T00:00:00, 2014-01-02T00:00:00] or [2014-01-03T00:00:00, 2014-01-03T00:00:00])`
            );
        // list view
        await since(
            'Date filters, on view filter, 1st Daytime ID value is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportSummary.getLeafRowValue('视图筛选器', 'Daytime ID', 1))
            .toBe(`不在 08/08/2022 11:00:00, 31/08/2022 14:00:00`);
        await since(
            'Date filters, on view filter, Day ID value is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportSummary.getLeafRowValue('视图筛选器', 'Day ID'))
            .toBe(`不在 01/08/2022, 25/08/2022, 26/08/2022, 18/08/2022`);
        // calendar widget - static
        await since(
            'Date filters, on view filter, 2nd Daytime ID value is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportSummary.getLeafRowValue('视图筛选器', 'Daytime ID', 2))
            .toBe(`不介于 17/03/2020 02:15:30 和 04/08/2022 15:30:59 之间`);
        // calendar widget - dynamic
        await since(
            'Date filters, on view filter, 3rd Daytime ID value is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportSummary.getLeafRowValue('视图筛选器', 'Daytime ID', 3))
            .toBe(`不等于 (今天 加 3 天 加 2 个月) 所在周的lundi当前小时 加 3 小时, 当前分钟 减 20 分钟`);
        // in list
        await since(
            'Date filters, on view filter, Daytime value is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportSummary.getLeafRowValue('视图筛选器', 'Daytime'))
            .toBe(`在列表中 2014-01-01T00:00:00, 2014-01-02T00:00:00`);

        await dossierPage.goToLibrary();
    });

    it('[TC90418] I18N - Validate number format on report filter summary', async () => {
        await resetReportState({
            credentials: credentials,
            report: reportI18NNumber,
        });
        await libraryPage.openDossier(reportI18NNumber.name);
        await reportSummary.viewAll();

        // metric value
        await since('Cost filters, Filter value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getLeafRowValue('报表筛选器', 'Cost'))
            .toContain(`不等于 100`);
        // rank
        await since('Profit Margin filters, filter value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getLeafRowValue('报表筛选器', 'Profit Margin', 1))
            .toBe(`[排序]排除顶部 20/ 已在 报表模板 级别聚合`);
        // percentage
        await since('Cost Growth filters,filter value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getLeafRowValue('报表筛选器', 'Cost Growth'))
            .toBe(`[%]不同于 99,99拆分依据: [Category]/ 已在 [Category、Year] 级别聚合`);
        // custom value
        await since(
            'Revenue filters, on view filter, 3rd Daytime ID value is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportSummary.getLeafRowValue('报表筛选器', 'Revenue'))
            .toBe(`等于 Cost + Profit`);
        // view filter, int and floating number
        await since(
            'Year filters, on view filter, filter value is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportSummary.getLeafRowValue('视图筛选器', 'Year'))
            .toBe(`在列表中 2014, 2015`);
        await since(
            'Profit Margin filters, on view filter, filter value is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportSummary.getLeafRowValue('视图筛选器', 'Profit Margin'))
            .toBe(`小于 100000,018`);
        await since(
            'Profit filters, on view filter, filter value is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportSummary.getLeafRowValue('视图筛选器', 'Profit'))
            .toBe(`在 1000, 2000,01, 30000,02`);
        await dossierPage.goToLibrary();
    });

    it('[TC90419] I18N - Validate prompt date and number on report filter summary', async () => {
        await resetReportState({
            credentials: credentials,
            report: reportI18NPrompt,
        });
        await libraryPage.openDossier(reportI18NPrompt.name);
        await promptEditor.waitForEditor();
        await promptEditor.run();
        await reportPage.waitForBlankReportLoading();
        await reportSummary.viewAll();

        // daytime qualification
        await since('DayTime ID filters, Filter value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getLeafRowValue('报表筛选器', 'DayTime ID'))
            .toContain(`等于 13/07/2023 00:00:00`);
        // daytime list value
        await since('DayTime filters, filter value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getLeafRowValue('报表筛选器', 'DayTime'))
            .toBe(`在列表中 2014-01-01T00:00:00, 2014-01-02T00:00:00, 2014-01-03T00:00:00`);
        // number
        await since('Cost filters, filter value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getLeafRowValue('报表筛选器', 'Cost'))
            .toBe(`大于或等于 1000,1`);

        await dossierPage.goToLibrary();
    });
});

export const config = specConfiguration;
