import { customCredentials } from '../../../constants/index.js';
import resetReportState from '../../../api/reports/resetReportState.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

const specConfiguration = { ...customCredentials('_reportSummary') };

describe('Library Report Filter Summary - report filter', () => {
    const tutorialProject = {
        id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
        name: 'MicroStrategy Tutorial',
    };
    const reportAttributes = {
        id: '31DCA9E84D57217A88DC0CB0DD8980A0',
        name: '(AUTO) Report_FilterSummary_Attribute',
        project: tutorialProject,
    };
    const reportMetric = {
        id: '9D7060AD4BFE59594F201C8388B03BA8',
        name: '(AUTO) Report_FilterSummary_Metric',
        project: tutorialProject,
    };
    const reportSet = {
        id: '056E2DC843ECB9E1E7F5F48043C79EE6',
        name: '(AUTO) Report_FilterSummary_Set',
        project: tutorialProject,
    };
    const reportGroup = {
        id: 'A5B6F4C14424236EA684E39CEF68AD0C',
        name: '(AUTO) Report_FilterSummary_Group',
        project: tutorialProject,
    };
    const reportNot = {
        id: 'CA2F8347417008319D4AE084DF19850A',
        name: '(AUTO) Report_FilterSummary_NOT',
        project: tutorialProject,
    };
    const reportDate = {
        id: '1060AC94432DDBC4FE6974853FEB48D9',
        name: '(AUTO) Report_FilterSummary_Date',
        project: tutorialProject,
    };
    const reportFilterType = {
        id: 'B835C8A14FEF1AF11E7CF282F5A1D59D',
        name: '(AUTO) Report_FilterSummary_FilterType',
        project: tutorialProject,
    };
    const reportOperators = {
        id: 'A9E15C674EE1B4E4EF7B6C84413B4E90',
        name: '(AUTO) Report_FilterSummary_Operators',
        project: tutorialProject,
    };
    const report0Filter = {
        id: 'CFDC7FEA4E42D530FAE1E38244C5AA62',
        name: '(AUTO) Report_FilterSummary_0Filters',
        project: tutorialProject,
    };
    const report1ReportFilter = {
        id: '7FD281DE4FDC11BCF1F098AB314D2744',
        name: '(AUTO) Report_FilterSummary_1ReportFilters',
        project: tutorialProject,
    };
    const report1ViewFilter = {
        id: '5DBD3B7F4E02A7C65517FA9FFB01C878',
        name: '(AUTO) Report_FilterSummary_1ViewFilters',
        project: tutorialProject,
    };
    const reportSpecialChars = {
        id: 'FBBF5D3349B0A7B932A206B4450A4A96',
        name: '(AUTO) Report_FilterSummary_SpecialChars',
        project: tutorialProject,
    };
    const reportScrollbar = {
        id: 'C0701346414FD254CF867A9F1277EC26',
        name: '(AUTO) Report_FilterSummary_Scrollbar',
        project: tutorialProject,
    };

    const { credentials } = specConfiguration;

    let { dossierPage, libraryPage, reportSummary, promptEditor, reportPage, loginPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
    });
    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC86801] Report filter summary - report with diffrent numbers of filters (0, 1 and N)', async () => {
        // 0 filter
        await resetReportState({
            credentials: credentials,
            report: report0Filter,
        });
        await libraryPage.openDossier(report0Filter.name);
        await reportPage.waitForReportLoading();
        await since('Report with no filter, filter summary panel supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getSummaryBarText())
            .toBe(`FILTERS (0) | No filter selections`);
        await takeScreenshotByElement(reportSummary.getSummaryBar(), 'TC86801', 'FilterSummary_0Filter');
        await dossierPage.goToLibrary();

        // 1 filter : report filter
        await resetReportState({
            credentials: credentials,
            report: report1ReportFilter,
        });
        await libraryPage.openDossier(report1ReportFilter.name);
        await reportPage.waitForReportLoading();
        await since(
            'Report with 1 report filter, filter summary panel supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportSummary.getSummaryBarText())
            .toBe(`REPORT FILTERS  |  Category (in list Books)`);
        await takeScreenshotByElement(reportSummary.getSummaryBar(), 'TC86801', 'FilterSummary_1ReportFilter_viewless');
        await reportSummary.viewAll();
        await takeScreenshotByElement(
            reportSummary.getSummaryPanel(),
            'TC86801',
            'FilterSummary_1ReportFilter_viewAll'
        );
        await dossierPage.goToLibrary();

        // 1 filter : view filter
        await resetReportState({
            credentials: credentials,
            report: report1ViewFilter,
        });
        await libraryPage.openDossier(report1ViewFilter.name);
        await reportPage.waitForReportLoading();
        await since(
            'Report with 1 view filter, filter summary panel supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportSummary.getSummaryBarText())
            .toBe(`VIEW FILTERS  |  Category (in list Books)`);
        await takeScreenshotByElement(reportSummary.getSummaryBar(), 'TC86801', 'FilterSummary_1ViewFilter_viewless');
        await reportSummary.viewAll();
        await takeScreenshotByElement(reportSummary.getSummaryPanel(), 'TC86801', 'FilterSummary_1ViewFilter_viewAll');
    });

    it('[TC86803] Report filter summary - view more and view less', async () => {
        await resetReportState({
            credentials: credentials,
            report: reportGroup,
        });
        await libraryPage.openDossier(reportGroup.name);
        await reportPage.waitForReportLoading();
        await since('By default, filter summary panel present supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.isFilterSummaryPanelPresent())
            .toBe(false);

        //
        await reportSummary.viewAll();
        await since('View all, filter summary panel present supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.isFilterSummaryPanelPresent())
            .toBe(true);

        // view less
        await reportSummary.viewLess();
        await since('View less, filter summary panel present supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.isFilterSummaryPanelPresent())
            .toBe(false);
    });

    it('[TC86804] Report filter summary - filter summary bar', async () => {
        // filter with group
        await resetReportState({
            credentials: credentials,
            report: reportGroup,
        });
        await libraryPage.openDossier(reportGroup.name);
        await reportPage.waitForReportLoading();
        await reportSummary.sleep(500); //wait fitler summary data loaded completely
        await since('open report reportGroup, filter summary supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getSummaryBarText())
            .toContain(
                `REPORT FILTERS  |  NOT  { { NOT  { NOT  Subcategory (in list TV's, Soul / R&B)  AND  { Set of Year filtered by { Region`
            );
        await dossierPage.goToLibrary();

        // filter with attribute
        await resetReportState({
            credentials: credentials,
            report: reportAttributes,
        });
        await libraryPage.openDossier(reportAttributes.name);
        await reportPage.waitForReportLoading();
        await reportSummary.sleep(500); //wait fitler summary data loaded completely
        await since(
            'open report reportAttributes, filter summary supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportSummary.getSummaryBarText())
            .toContain(
                `REPORT FILTERS  |  Region (in list Canada, England, France, Germany, Northwest)  AND  Year (not in list 2014, 2015)`
            );
        await dossierPage.goToLibrary();

        // filter with metric
        await resetReportState({
            credentials: credentials,
            report: reportMetric,
        });
        await libraryPage.openDossier(reportMetric.name);
        await reportPage.waitForReportLoading();
        await reportSummary.sleep(500); //wait fitler summary data loaded completely
        await since('open report reportMetric , filter summary supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getSummaryBarText())
            .toContain(
                `REPORT FILTERS  |  Cost [does not equal 100]  AND  Profit [is not null]  AND  Profit Margin [[Rank]exclude top`
            );
        await dossierPage.goToLibrary();

        // fitler with set
        await resetReportState({
            credentials: credentials,
            report: reportSet,
        });
        await libraryPage.openDossier(reportSet.name);
        await reportPage.waitForReportLoading();
        await reportSummary.sleep(500); //wait fitler summary data loaded completely
        await since('open report reportSet, filter summary supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getSummaryBarText())
            .toContain(
                `REPORT FILTERS  |  { Set of Category filtered by { Subcategory (in list Business, Literature, Sports & Health) } }`
            );
        await dossierPage.goToLibrary();
    });

    it('[TC86807] Report filter summary - filters with special chars', async () => {
        await resetReportState({
            credentials: credentials,
            report: reportSpecialChars,
        });
        await libraryPage.openDossier(reportSpecialChars.name);
        await reportPage.waitForReportLoading();
        await reportSummary.viewAll();

        // check summary
        await since(
            'Special chars on summary, Category DESC value is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportSummary.getReportFilterRowValue('Category DESC'))
            .toBe(`Does not contain ><script>alert('TEST')</script>`);
        await since('Special chars on summary, Customer value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getReportFilterRowValue('Customer'))
            .toBe(`In List Aaby:Alen, Aadland:Constant, Abbott:Delores`);
        await since('Special chars on summary, Item value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getReportFilterRowValue('Item'))
            .toBe(
                `In List 100 Places to Go While Still Young at Heart, Architecture : Form, Space, & Order, Don't Step in the Leadership, Why Weight?, Ageless Body, Timeless Mind, Sharp 25" TV/VCR Combo, 98 Degrees & Rising, L.A. Confidential, 3Com 10/100 CardBus`
            );
        await since(
            'Special chars on summary, Customer Email value is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportSummary.getReportFilterRowValue('Customer Email'))
            .toBe(`Not In List aaaby54@yahoo.demo, aabulencia14@aol.demo, aacuna79@free.demo`);
        await since('Special chars on summary, Cost value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getReportFilterRowValue('Cost'))
            .toBe(`Greater than 100000000`);
    });

    it('[TC82211] Report filter summary - filters with scrollbar', async () => {
        const tolerance = 0.2;
        await resetReportState({
            credentials: credentials,
            report: reportScrollbar,
        });
        await libraryPage.openDossier(reportScrollbar.name);
        await reportPage.waitForReportLoading();
        await reportSummary.viewAll();

        // scroll
        await reportSummary.scrollToBottom();
        await since('Scrollbar on fitler summary, Cost value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getReportFilterRowValue('Cost'))
            .toBe(`[Rank]Exclude Top 30`);
        await since(
            'Scrollbar on fitler summary, Quarter value is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportSummary.getViewFilterRowValue('Quarter'))
            .toBe(`Not In List 2014 Q1, 2014 Q2, 2014 Q4`);
        await since(
            'Scrollbar on fitler summary, Year ID value is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportSummary.getViewFilterRowValue('Year ID'))
            .toBe(`Not In 2001, 2002, 2003`);
        await takeScreenshotByElement(
            reportSummary.getSummarySection('VIEW FILTERS'),
            'TC86801',
            'FilterSummary_Scrollbar',
            {
                tolerance: tolerance,
            }
        );
    });

    it('[TC86781] Report filter summary - report with attribute filters', async () => {
        await resetReportState({
            credentials: credentials,
            report: reportAttributes,
        });
        await libraryPage.openDossier(reportAttributes.name);
        await reportPage.waitForReportLoading();
        await reportSummary.viewAll();

        // check fitler summary
        await since('Attribute filters, Region value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getReportFilterRowValue('Region'))
            .toBe('In List Canada, England, France, Germany, Northwest');
        await since('Attribute filters, Year value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getReportFilterRowValue('Year'))
            .toBe('Not In List 2014, 2015');
        await since('Attribute filters, Quarter ID value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getReportFilterRowValue('Quarter ID'))
            .toBe('Does not equal Year ID');
        await since('Attribute filters, Category ID value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getReportFilterRowValue('Category ID'))
            .toBe('Greater than 1');
        await since(
            'Attribute filters, Subcategory DESC value is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportSummary.getReportFilterRowValue('Subcategory DESC'))
            .toBe('Contains b');
    });

    it('[TC86787] Report filter summary - report with metric filters', async () => {
        await resetReportState({
            credentials: credentials,
            report: reportMetric,
        });
        await libraryPage.openDossier(reportMetric.name);
        await reportPage.waitForReportLoading();
        await reportSummary.viewAll();

        // check report filter
        await since(
            'Metric filters on Report Filter, Cost value is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportSummary.getReportFilterRowValue('Cost'))
            .toBe('Does not equal 100');
        await since(
            'Metric filters on Report Filter, Profit value is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportSummary.getReportFilterRowValue('Profit'))
            .toBe('Is Not Null/ aggregated in Profit level');
        await since(
            'Metric filters on Report Filter, Profit Margin value is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportSummary.getReportFilterRowValue('Profit Margin'))
            .toBe('[Rank]Exclude Top 10/ aggregated in Report Template level');
        await since(
            'Metric filters on Report Filter, Cost Growth value is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportSummary.getReportFilterRowValue('Cost Growth'))
            .toBe('[%]Different from 99Break By: [Category]/ aggregated in [Category, Year] level');
        await since(
            'Metric filters on Report Filter, Revenue value is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportSummary.getReportFilterRowValue('Revenue'))
            .toBe('[Rank]Top CostBreak By: [Category, Subcategory]');
        await since(
            'Metric filters on Report Filter, Average Revenue value is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportSummary.getReportFilterRowValue('Average Revenue'))
            .toBe(
                '[%]Is Not NullBreak By: [Category, Subcategory, Region, Country]/ aggregated in Report Template level'
            );

        // check view filter
        await since(
            'Metric filters on View Filter, Cost value is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportSummary.getViewFilterRowValue('Cost'))
            .toBe('Between 1000 and 2000000');
        await since(
            'Metric filters on View Filter, Profit value is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportSummary.getViewFilterRowValue('Profit'))
            .toBe('In 10000, 20000, 30000');
    });

    it('[TC86794] Report filter summary - report with set filters', async () => {
        await resetReportState({
            credentials: credentials,
            report: reportSet,
        });
        await libraryPage.openDossier(reportSet.name);
        await reportPage.waitForReportLoading();
        await reportSummary.viewAll();

        // Subcategory
        await since('Set filters, Subcategory Set value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getReportFilterSetValue('Subcategory'))
            .toBe('Set of Category filtered by / related by Cost');
        await since('Set filters, Subcategory value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getReportFilterRowValue('Subcategory'))
            .toBe('In List Business, Literature, Sports & Health');
        // Region
        await since('Set filters, Region Set value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getReportFilterSetValue('Subcategory'))
            .toBe('Set of Category filtered by / related by Cost');
        await since('Set filters, Region value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getReportFilterRowValue('Subcategory'))
            .toBe('In List Business, Literature, Sports & Health');
        // Profit + Country DESC
        await since('Set filters, Profit Set value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getReportFilterSetValue('Profit'))
            .toBe('Set of Category filtered by / related by System Default');
        await since('Set filters, Profit value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getReportFilterRowValue('Profit'))
            .toBe('[Rank]Top 50');
        await since('Set filters, Country DESC value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getReportFilterRowValue('Country DESC'))
            .toBe('Does not contain USA');
        // Year
        await since('Set filters, Region Set value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getReportFilterSetValue('Year'))
            .toBe('Set of Year filtered by / related by LU_CATEGORY');
        await since('Set filters, Region value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getReportFilterRowValue('Year'))
            .toBe('In List 2014, 2015');
    });

    it('[TC86795] Report filter summary - report with group filters', async () => {
        const tolerance = 0.2;
        await resetReportState({
            credentials: credentials,
            report: reportGroup,
        });
        await libraryPage.openDossier(reportGroup.name);
        await reportPage.waitForReportLoading();
        await reportSummary.viewAll();

        // report filter
        await since('Group filters, Subcategory value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getReportFilterRowValue('Subcategory'))
            .toBe(`In List TV's, Soul / R&B`);
        await since('Group filters, Region value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getReportFilterRowValue('Region'))
            .toBe('Not In List Canada, Central');
        await since('Group filters, Profit value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getReportFilterRowValue('Profit'))
            .toBe(`Greater than or equal to Last Month's Profit`);
        await takeScreenshotByElement(
            reportSummary.getSummarySection('REPORT FILTERS'),
            'TC86795',
            'FilterSummary_Group_ReportFilter'
        );

        // view filter
        await since(
            'Group filters, on view filter, Cost value is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportSummary.getViewFilterRowValue('Cost'))
            .toBe('[Rank]Exclude Top 1Break By: [Category, Subcategory]');
        await since(
            'Group filters, on view filter, Profit value is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportSummary.getViewFilterRowValue('Profit'))
            .toBe('[Rank]Bottom 100Break By: [Region]');
        await takeScreenshotByElement(
            reportSummary.getSummarySection('VIEW FILTERS'),
            'TC86795',
            'FilterSummary_Group_ViewFilter',
            {
                tolerance: tolerance,
            }
        );
    });

    it('[TC86796] Report filter summary - report with NOT filters ', async () => {
        const tolerance = 0.2;
        await resetReportState({
            credentials: credentials,
            report: reportNot,
        });
        await libraryPage.openDossier(reportNot.name);
        await reportPage.waitForReportLoading();
        await reportSummary.viewAll();

        // check Not
        await since('NOT filters, NOT count supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getNotCount())
            .toBe(8);

        // report filter
        await since('NOT filters, Cost value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getReportFilterRowValue('Cost'))
            .toBe(`Greater than or equal to 100`);
        await since('NOT filters, Year Set value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getReportFilterSetValue('Year'))
            .toBe(`Set of Region filtered by / related by System Default`);
        await since('NOT filters, Year value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getReportFilterRowValue('Year'))
            .toBe('In List 2014');
        await since('NOT filters, Profit Set value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getReportFilterSetValue('Profit'))
            .toBe(`Set of Category filtered by / related by System Default`);
        await since('NOT filters, Profit value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getReportFilterRowValue('Profit'))
            .toBe(`Is Not Null`);
        await takeScreenshotByElement(
            reportSummary.getSummarySection('REPORT FILTERS'),
            'TC86796',
            'FilterSummary_NOT_ReportFilter'
        );

        // view filter
        await since('NOT filters, on view filter, Cost value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getViewFilterRowValue('Cost'))
            .toBe('[Rank]Different from 10000000Break By: [Region]');
        await takeScreenshotByElement(
            reportSummary.getSummarySection('VIEW FILTERS'),
            'TC86796',
            'FilterSummary_NOT_ViewFilter',
            {
                tolerance: tolerance,
            }
        );
    });

    // it('[TC86797] Report filter summary - Report with Date ', async() => {
    //     await resetReportState({
    //         credentials: credentials,
    //         report: reportDate ,
    //     })
    //     await libraryPage.openDossier(reportDate.name);
    //     await reportSummary.viewAll();

    //     // multi attributs
    //     await since('Date filters, Filter value is supposed to be #{expected}, instead we have #{actual}')
    //         .expect(await reportSummary.getReportFilterRowValue('Filter')).toContain(`([Day,DayTime] = [2014-01-02T00:00, 2014-01-02T00:00] or [2014-01-03T00:00, 2014-01-03T00:00])`);
    //     // list view
    //     await since('Date filters, on view filter, 1st Daytime ID value is supposed to be #{expected}, instead we have #{actual}')
    //         .expect(await reportSummary.getViewFilterRowValue('Daytime ID', 1)).toBe(`Not In 08/08/2022 12:00:00 AM, 08/31/2022 12:00:00 AM`);
    //     await since('Date filters, on view filter, Day ID value is supposed to be #{expected}, instead we have #{actual}')
    //         .expect(await reportSummary.getViewFilterRowValue('Day ID')).toBe(`Not In 08/01/2022, 08/25/2022, 08/26/2022, 08/18/2022`);
    //     // calendar widget - static
    //     await since('Date filters, on view filter, 2nd Daytime ID value is supposed to be #{expected}, instead we have #{actual}')
    //         .expect(await reportSummary.getViewFilterRowValue('Daytime ID', 2)).toBe(`Not between 03/17/2020 12:00:00 AM and 08/04/2022 12:00:00 AM`);
    //     // calendar widget - dynamic
    //     await since('Date filters, on view filter, 3rd Daytime ID value is supposed to be #{expected}, instead we have #{actual}')
    //         .expect(await reportSummary.getViewFilterRowValue('Daytime ID', 3)).toBe(`Does not equal Monday of the week of (Today plus 3 days plus 2 months)12:00:00 AM`);
    //     // in list
    //     await since('Date filters, on view filter, Daytime value is supposed to be #{expected}, instead we have #{actual}')
    //         .expect(await reportSummary.getViewFilterRowValue('Daytime')).toBe(`In List 2014-01-01T00:00, 2014-01-02T00:00`);
    // });

    it('[TC86798] Report filter summary - report with different filter types(report,custom expression, etc )', async () => {
        await resetReportState({
            credentials: credentials,
            report: reportFilterType,
        });
        await libraryPage.openDossierNoWait(reportFilterType.name);
        await promptEditor.waitForEditor();
        await promptEditor.run();
        await reportPage.waitForReportLoading();

        await reportSummary.viewAll();

        // multiple attributes
        await since('Filter types, first Filter value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getReportFilterRowValue('Filter', 1))
            .toContain(`(([Region,Category] = [England, Electronics] or [Mid-Atlantic, Books]))`);
        // custom expression
        await since('Filter types, 2nd Filter value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getReportFilterRowValue('Filter', 2))
            .toContain(`({category and cost})`);
        // report as filter
        await since('Filter types, 3rd Filter value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getReportFilterRowValue('Filter', 3))
            .toBe(`{Customer Analysis}`);
        // standalone filter
        await since('Filter types, 4th Filter value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getReportFilterRowValue('Filter', 4))
            .toContain(`((Category = Electronics, Movies, Music))`);
        // prompt
        await since('Filter types, Prompt value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getReportFilterRowValue('Category'))
            .toContain(`In List Books, Electronics, Music`);
        // FFSQL report
        await since('Filter types, 5th Filter value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getReportFilterRowValue('Filter', 5))
            .toBe(`{Category Timeline}`);
    });

    it('[TC86800] Report filter summary - filters with different operators', async () => {
        await resetReportState({
            credentials: credentials,
            report: reportOperators,
        });
        await libraryPage.openDossier(reportOperators.name);
        await reportSummary.viewAll();

        // report filter
        await since('Filter operators, Region DESC value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getReportFilterRowValue('Region DESC'))
            .toBe(`Does not contain test`);
        await since('Filter operators, Category DESC value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getReportFilterRowValue('Category DESC'))
            .toBe(`Begins with m`);
        await since('Filter operators, Year ID value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getReportFilterRowValue('Year ID'))
            .toBe(`Between 1990 and 2030`);
        await since('Filter operators, Cost value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getReportFilterRowValue('Cost'))
            .toBe(`[Rank]Exclude Top 30`);
        await since('Filter operators, Profit value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getReportFilterRowValue('Profit'))
            .toBe(`[%]Bottom 50`);
        await since('Filter operators, Subcategory DESC value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getReportFilterRowValue('Subcategory DESC'))
            .toBe(`Not Like *ab[1~9]`);
        await since('Filter operators, Quarter DESC value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getReportFilterRowValue('Quarter DESC'))
            .toBe(`Is Not Null`);
        await since('Filter operators, Revenue value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getReportFilterRowValue('Revenue'))
            .toBe(`[Rank]Different from 100`);

        // view filter
        await since('Filter operators, Year ID value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getViewFilterRowValue('Year ID'))
            .toBe(`Not In 2001, 2002, 2003`);
        await since('Filter operators, Cost value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getViewFilterRowValue('Cost'))
            .toBe(`[%]Exactly 50Break By: [Quarter]`);
    });
});
export const config = specConfiguration;
