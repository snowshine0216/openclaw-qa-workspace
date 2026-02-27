import { customCredentials } from '../../../constants/index.js';
import resetReportState from '../../../api/reports/resetReportState.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_reportFilter') };

describe('Library Report View Filter - Group', () => {
    const tutorialProject = {
        id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
        name: 'MicroStrategy Tutorial',
    };

    const reportGroup = {
        id: '26F521634BF0D161A3D12A87161A762B',
        name: '(AUTO) Report_ViewFilter_GroupQualification',
        project: tutorialProject,
    };
    const reportSet = {
        id: '058B9D914829B3963C1D84B81371CFE5',
        name: '(AUTO) Report_ViewFilter_GroupSet',
        project: tutorialProject,
    };
    const reportNFilters = {
        id: 'B83853B3461F64AFF14CAAB372A3E2CE',
        name: '(AUTO) Report_ViewFilter_NFilters',
        project: tutorialProject,
    };
    const reportAggragation = {
        id: '0311025745B224567227ABAC8F363FB9',
        name: '(AUTO) ReportFilter_ViewFilter_GroupAggregation',
        project: tutorialProject,
    };
    const report0Filter = {
        id: 'E29E6F61478E1153A30AA2A152137E41',
        name: '(AUTO) Report_ViewFilter_0Filter',
        project: tutorialProject,
    };
    const reportDay = {
        id: 'B1ED83AA4927B921022AD5B7CBBA6512',
        name: '(AUTO) Report_ViewFilter_Date',
        project: tutorialProject,
    };
    const reportDayTime = {
        id: '1CCDE36D415C6D7E1C9AF5BA803AA3BA',
        name: '(AUTO) Report_ViewFilter_DateTime',
        project: tutorialProject,
    };

    const { credentials } = specConfiguration;

    let {
        dossierPage,
        libraryPage,
        reportSummary,
        reportFilter,
        attributeFilter,
        metricFilter,
        reportPage,
        userAccount,
        loginPage,
        reportDatetime,
        customInputbox,
    } = browsers.pageObj1;

    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1200,
    };

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(specConfiguration.credentials);
    });
    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC87760] Report fitler - group - group qualificaiton filter', async () => {
        await resetReportState({
            credentials: credentials,
            report: reportGroup,
        });
        await libraryPage.openDossier(reportGroup.name);
        await reportPage.waitForReportLoading();
        await reportFilter.open();

        // check group state
        await since(
            'group qualificaiton filter, group count should be "#{expected}" groups instead there are "#{actual}"'
        )
            .expect(await reportFilter.getExpressionGroupCount())
            .toBe(2);
        await since(
            'group qualificaiton filter, group action link count should be "#{expected}" groups instead there are "#{actual}"'
        )
            .expect(await reportFilter.getGroupActionLinkCount())
            .toBe(3);
        await since(
            'group qualificaiton filter, ungroup link present should be "#{expected}" groups instead there are "#{actual}"'
        )
            .expect(await reportFilter.isUngroupLinkPresent(1))
            .toBe(true);
        await since(
            'Bgroup qualificaiton filter, group link present should be "#{expected}" groups instead there are "#{actual}"'
        )
            .expect(await reportFilter.isGroupLinkPresent(2))
            .toBe(true);
        await takeScreenshotByElement(
            reportFilter.getMainPanel(),
            'TC87760',
            'ReportFilter_Group_Qualificaiton_Initial'
        );

        // ungroup qualificatio filter
        await reportFilter.ungroupFilter(1);
        await since(
            'after ungroup qualificaiton filter, ungroup link present should be "#{expected}" groups instead there are "#{actual}"'
        )
            .expect(await reportFilter.isUngroupLinkPresent())
            .toBe(false);
        await since(
            'after ungroup qualificaiton filter, group count should be "#{expected}" groups instead there are "#{actual}"'
        )
            .expect(await reportFilter.getExpressionGroupCount())
            .toBe(1);
        await since(
            'after ungroup qualificaiton filter, group action link count should be "#{expected}" groups instead there are "#{actual}"'
        )
            .expect(await reportFilter.getGroupActionLinkCount())
            .toBe(3);

        // group filter
        await reportFilter.groupFilter(2);
        await reportFilter.groupFilter(3);
        await since(
            'after group qualificaiton filter, group link present should be "#{expected}" groups instead there are "#{actual}"'
        )
            .expect(await reportFilter.isGroupLinkPresent(2))
            .toBe(false);
        await since(
            'after group qualificaiton filter, group count should be "#{expected}" groups instead there are "#{actual}"'
        )
            .expect(await reportFilter.getExpressionGroupCount())
            .toBe(3);
        await since(
            'after group qualificaiton filter, group action link count should be "#{expected}" groups instead there are "#{actual}"'
        )
            .expect(await reportFilter.getGroupActionLinkCount())
            .toBe(2);

        await reportFilter.apply();
        await reportFilter.open();
        await since(
            'after group qualificaiton filter, reopen, group count should be "#{expected}" groups instead there are "#{actual}"'
        )
            .expect(await reportFilter.getExpressionGroupCount())
            .toBe(3);
        await takeScreenshotByElement(reportFilter.getMainPanel(), 'TC87760', 'ReportFilter_Group_Qualificaiton');

        await reportFilter.close();
    });

    it('[TC87761] Report fitler - group - group set filter', async () => {
        await resetReportState({
            credentials: credentials,
            report: reportSet,
        });
        await libraryPage.openDossier(reportSet.name);
        await reportPage.waitForReportLoading();
        await reportFilter.open();

        // check group state
        await since('group set filter, group count should be "#{expected}" groups instead there are "#{actual}"')
            .expect(await reportFilter.getExpressionGroupCount())
            .toBe(3);
        await since(
            'group set filter, group action link count should be "#{expected}" groups instead there are "#{actual}"'
        )
            .expect(await reportFilter.getGroupActionLinkCount())
            .toBe(1);
        await since(
            'group set filter, ungroup link present should be "#{expected}" groups instead there are "#{actual}"'
        )
            .expect(await reportFilter.isUngroupLinkPresent())
            .toBe(true);
        await takeScreenshotByElement(reportFilter.getMainPanel(), 'TC87761', 'ReportFilter_Group_Set_Initial');

        // ungroup set filter
        await reportFilter.ungroupFilter(1);
        await since(
            'after ungroup set filter, ungroup link present should be "#{expected}" groups instead there are "#{actual}"'
        )
            .expect(await reportFilter.isUngroupLinkPresent())
            .toBe(false);
        await since(
            'after ungroup set filter, group count should be "#{expected}" groups instead there are "#{actual}"'
        )
            .expect(await reportFilter.getExpressionGroupCount())
            .toBe(2);
        await since(
            'after ungroup set filter, group action link count should be "#{expected}" groups instead there are "#{actual}"'
        )
            .expect(await reportFilter.getGroupActionLinkCount())
            .toBe(2);

        // group filter
        await reportFilter.groupFilter(2);
        await since(
            'after group set filter, group link present should be "#{expected}" groups instead there are "#{actual}"'
        )
            .expect(await reportFilter.isGroupLinkPresent())
            .toBe(false);
        await since('after group set filter, group count should be "#{expected}" groups instead there are "#{actual}"')
            .expect(await reportFilter.getExpressionGroupCount())
            .toBe(3);
        await since(
            'after group set filter, group action link count should be "#{expected}" groups instead there are "#{actual}"'
        )
            .expect(await reportFilter.getGroupActionLinkCount())
            .toBe(1);

        await reportFilter.apply();
        await reportFilter.open();
        await since(
            'after group set filter, reopen, group count should be "#{expected}" groups instead there are "#{actual}"'
        )
            .expect(await reportFilter.getExpressionGroupCount())
            .toBe(3);
        await takeScreenshotByElement(reportFilter.getMainPanel(), 'TC87761', 'ReportFilter_Group_Set_End');

        await reportFilter.close();
    });

    it('[TC87762] Report filter - group -  change group relationship( And, Or, Not)', async () => {
        await resetReportState({
            credentials: credentials,
            report: reportNFilters,
        });
        await libraryPage.openDossier(reportNFilters.name);
        await reportPage.waitForReportLoading();
        await reportFilter.open();

        // check relationship
        await since('group relationship, AND count should be "#{expected}" groups instead there are "#{actual}"')
            .expect(await reportFilter.getGroupOperatorCount('AND'))
            .toBe(1);
        await since('group relationship, OR count should be "#{expected}" groups instead there are "#{actual}"')
            .expect(await reportFilter.getGroupOperatorCount('OR'))
            .toBe(1);
        await since('group relationship, 1 operator display should be "#{expected}" instead it is "#{actual}"')
            .expect(await reportFilter.getOperatorText(1))
            .toBe('OR');
        await since('group relationship, 2 operator display should be "#{expected}" instead it is "#{actual}"')
            .expect(await reportFilter.getOperatorText(2))
            .toBe('AND');
        await takeScreenshotByElement(
            reportFilter.getMainPanel(),
            'TC87762',
            'ReportFilter_Group_Relationship_Initial'
        );

        // change relationship - AND
        await reportFilter.openGroupOperator(1);
        await since(
            'group relationship, group dropdown item count should be "#{expected}" groups instead there are "#{actual}"'
        )
            .expect(await reportFilter.getGroupOperatorItemCount())
            .toBe(2);
        await reportFilter.selectGroupOperator('AND');
        await since('change group operator to AND, operator display should be "#{expected}" instead it is "#{actual}"')
            .expect(await reportFilter.getOperatorText(1))
            .toBe('AND');
        await since(
            'change group operator to AND,, AND count should be "#{expected}" groups instead there are "#{actual}"'
        )
            .expect(await reportFilter.getGroupOperatorCount('AND'))
            .toBe(2);

        // change relationship - OR
        await reportFilter.openGroupOperator(2);
        await reportFilter.selectGroupOperator('OR');
        await since('change group operator to OR, operator display should be "#{expected}" instead it is "#{actual}"')
            .expect(await reportFilter.getOperatorText(2))
            .toBe('OR');
        await since(
            'change group operator to OR, OR count should be "#{expected}" groups instead there are "#{actual}"'
        )
            .expect(await reportFilter.getGroupOperatorCount('OR'))
            .toBe(1);

        // apply
        await reportFilter.apply();
        await reportFilter.open();
        await since(
            'change group operator reopen, group operator should be "#{expected}" groups instead there are "#{actual}"'
        )
            .expect(await reportFilter.getOperatorText(1))
            .toBe('AND');
        await takeScreenshotByElement(reportFilter.getMainPanel(), 'TC87762', 'ReportFilter_Group_Relationship');

        await reportFilter.close();
    });

    it('[TC87763] Report filter - group - NOT a single filter', async () => {
        await resetReportState({
            credentials: credentials,
            report: reportNFilters,
        });
        await libraryPage.openDossier(reportNFilters.name);
        await reportPage.waitForReportLoading();
        await reportFilter.open();

        // check not
        await since('NOT a single filter, NOT count should be "#{expected}" groups instead there are "#{actual}"')
            .expect(await reportFilter.getNOTCount())
            .toBe(1);

        // NOT a attribute filter
        await reportFilter.selectExpressionContextMenu({ expType: 'Attribute Qualification', objectName: 'Region' });
        await reportFilter.selectContextMenuOption('NOT');
        await since(
            'NOT a single attribute filter, NOT count should be "#{expected}" groups instead there are "#{actual}"'
        )
            .expect(await reportFilter.getNOTCount())
            .toBe(2);

        // remove NOT for metric filter
        await reportFilter.selectExpressionContextMenu({ expType: 'Metric Qualification', objectName: 'Profit' });
        await reportFilter.selectContextMenuOption('NOT');
        await since(
            'remove NOT from metric filter, NOT count should be "#{expected}" groups instead there are "#{actual}"'
        )
            .expect(await reportFilter.getNOTCount())
            .toBe(1);

        // NOT a set filter
        await reportFilter.selectExpressionContextMenu({ expType: 'Set Qualification', objectName: 'Year' });
        await takeScreenshotByElement(reportFilter.getContextMenu(), 'TC87763', 'ReportFilter_NOT_Set', {
            tolerance: 5,
        });
        await reportFilter.selectContextMenuOption('NOT');
        await since('NOT a set filter, NOT count should be "#{expected}" groups instead there are "#{actual}"')
            .expect(await reportFilter.getNOTCount())
            .toBe(2);

        // apply
        await reportFilter.apply();
        await reportFilter.open();
        await since('re-open, NOT count should be "#{expected}" groups instead there are "#{actual}"')
            .expect(await reportFilter.getNOTCount())
            .toBe(2);
        await takeScreenshotByElement(reportFilter.getMainPanel(), 'TC87763', 'ReportFilter_NOT_Single');

        await reportFilter.close();
    });

    it('[TC87764] Report filter - group - NOT a group filter', async () => {
        await resetReportState({
            credentials: credentials,
            report: reportNFilters,
        });
        await libraryPage.openDossier(reportNFilters.name);
        await reportPage.waitForReportLoading();
        await reportFilter.open();

        // check not
        await since('NOT a single filter, NOT count should be "#{expected}" groups instead there are "#{actual}"')
            .expect(await reportFilter.getNOTCount())
            .toBe(1);

        // NOT group filter
        await reportFilter.NOTGroupFilter(1);
        await since('NOT a goup filter, NOT count should be "#{expected}" groups instead there are "#{actual}"')
            .expect(await reportFilter.getNOTCount())
            .toBe(2);
        await reportFilter.NOTGroupFilter(2);
        await since('NOT a goup filter, NOT count should be "#{expected}" groups instead there are "#{actual}"')
            .expect(await reportFilter.getNOTCount())
            .toBe(3);
        // take Screenshot

        // remove NOT for a group filter
        await reportFilter.NOTGroupFilter(2);
        await since('NOT a goup filter, NOT count should be "#{expected}" groups instead there are "#{actual}"')
            .expect(await reportFilter.getNOTCount())
            .toBe(2);

        // apply
        await reportFilter.apply();
        await reportFilter.open();
        await since('re-open, NOT count should be "#{expected}" groups instead there are "#{actual}"')
            .expect(await reportFilter.getNOTCount())
            .toBe(2);
        await takeScreenshotByElement(reportFilter.getMainPanel(), 'TC87764', 'ReportFilter_NOT_Group');

        await reportFilter.close();
    });

    it('[TC87765] Report filter - group - group for aggregation filter', async () => {
        await resetReportState({
            credentials: credentials,
            report: reportAggragation,
        });
        await libraryPage.openDossier(reportAggragation.name);
        await reportPage.waitForReportLoading();
        await reportFilter.open();

        //   check no group
        await since(
            'group in aggregation filter, NOT count should be "#{expected}" groups instead there are "#{actual}"'
        )
            .expect(await reportFilter.getNOTCount())
            .toBe(1);
        await since(
            'group in aggregation filter, group count should be "#{expected}" groups instead there are "#{actual}"'
        )
            .expect(await reportFilter.getExpressionGroupCount())
            .toBe(1);
        await since(
            'group in aggregation filter, metric limit count should be "#{expected}" groups instead there are "#{actual}"'
        )
            .expect(await reportFilter.getAggregationFilterCount())
            .toBe(4);

        // NOT a aggregation filter
        await reportFilter.selectExpressionContextMenu({
            expType: 'Metric Qualification',
            objectName: 'Profit Margin',
        });
        await reportFilter.selectContextMenuOption('NOT');
        await since('not a aggregation filter, NOT count should be "#{expected}" groups instead there are "#{actual}"')
            .expect(await reportFilter.getNOTCount())
            .toBe(2);
        await takeScreenshotByElement(reportFilter.getMainPanel(), 'TC87765', 'ReportFilter_NOT_Aggregation');

        // move to view filter
        await reportFilter.selectExpressionContextMenu({
            expType: 'Metric Qualification',
            objectName: 'Profit Margin',
        });
        await reportFilter.selectContextMenuOption('Use As View Filter');
        await reportFilter.sleep(500); // wait GUI static render
        await since(
            'move aggregation filter to view filter, metric limit count should be "#{expected}" instead there are "#{actual}"'
        )
            .expect(await reportFilter.getAggregationFilterCount())
            .toBe(3);
        await since(
            'move aggregation filter to view filter, NOT count should be "#{expected}" groups instead there are "#{actual}"'
        )
            .expect(await reportFilter.getNOTCount())
            .toBe(1);

        // apply
        await reportFilter.apply();
        await reportFilter.open();
        await since('re-open, metric limit count should be "#{expected}" groups instead there are "#{actual}"')
            .expect(await reportFilter.getAggregationFilterCount())
            .toBe(3);
        await since('re-open, NOT count should be "#{expected}" groups instead there are "#{actual}"')
            .expect(await reportFilter.getNOTCount())
            .toBe(1);
        await takeScreenshotByElement(reportFilter.getMainPanel(), 'TC87765', 'ReportFilter_NOT_Aggregation_Apply');

        await reportFilter.close();
    });

    it('[TC87866] Report filter - filter panel - filter panel render under 0,1, N filter', async () => {
        await resetReportState({
            credentials: credentials,
            report: report0Filter,
        });
        await libraryPage.openDossier(report0Filter.name);
        await reportPage.waitForReportLoading();
        await reportFilter.open();

        // 0 filter
        await since('0 filter, filter present should be "#{expected}" groups instead there are "#{actual}"')
            .expect(
                await reportFilter.isExpressionPresent({ expType: 'New Qualification', objectName: 'EMPTY', index: 0 })
            )
            .toBe(false);
        await takeScreenshotByElement(reportFilter.getMainPanel(), 'TC87866', 'FilterPanel_0Filter');

        // 1 view filter
        await attributeFilter.create();
        // await attributeFilter.clickBasedOn();
        await attributeFilter.selectBasedOnObject('Year');
        await since('1 filter, element list count should be "#{expected}", instead it is "#{actual}"')
            .expect(await attributeFilter.getElementListCount())
            .toBe(1);
        await attributeFilter.selectAttributeElements(['2014']);
        await attributeFilter.done();
        await since('1 filter, view filter count should be "#{expected}" instead there are "#{actual}"')
            .expect(await reportFilter.getViewFilterCount())
            .toBe(1);
        await since('1 filter, report filter summary should be "#{expected}", instead it is "#{actual}"')
            .expect(await reportFilter.filterSummaryText({ expType: 'Attribute Qualification', objectName: 'Year' }))
            .toBe('Year,2014');
        await takeScreenshotByElement(reportFilter.getMainPanel(), 'TC87866', 'FilterPanel_1ViewFilter');
        //-- remove all filter
        await reportFilter.clickSettingIcon();
        await reportFilter.selectSetting('Remove All Filters');
        await since('remove all filter, view filter count should be "#{expected}" instead there are "#{actual}"')
            .expect(await reportFilter.getViewFilterCount())
            .toBe(0);

        // 1 aggregation filter
        await metricFilter.create();
        // await metricFilter.clickBasedOn();
        await metricFilter.selectBasedOnObject('Profit');
        await metricFilter.enterValue('50');
        await metricFilter.done();
        await since('1 aggregation filter, view filter count should be "#{expected}" instead there are "#{actual}"')
            .expect(await reportFilter.getViewFilterCount())
            .toBe(0);
        await since(
            '1 aggregation filter, aggregation filter count should be "#{expected}" instead there are "#{actual}"'
        )
            .expect(await reportFilter.getAggregationFilterCount())
            .toBe(1);
        await takeScreenshotByElement(reportFilter.getMainPanel(), 'TC87866', 'FilterPanel_1AggregationFilter');
        await reportFilter.close();
    });

    it('[TC87867] Report filter -  filter panel - filter panel interact with filter summary', async () => {
        await resetReportState({
            credentials: credentials,
            report: reportNFilters,
        });
        await libraryPage.openDossier(reportNFilters.name);
        await reportPage.waitForReportLoading();
        await reportSummary.viewAll();

        // check filter summary
        await since('X-func with filter summary, Region value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getViewFilterRowValue('Region'))
            .toBe('In List Central');
        await since('X-func with filter summary,Category DESC is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getViewFilterRowValue('Category DESC'))
            .toBe('Is Not Null');
        await since('X-func with filter summary, Profit value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getViewFilterRowValue('Profit'))
            .toBe('[%]Different from 55Break By: [Category]');
        await since('X-func with filter summary, Cost value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getViewFilterRowValue('Cost'))
            .toBe('Greater than 1000');

        // edit metric filter
        await reportSummary.edit({ name: 'Cost' });
        await since(
            'X-func with filter summary, edit, filter panel present is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportFilter.isMainPanelPresent())
            .toBe(true);
        await since(
            'X-func with filter summary, edit, detailed panel present is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportFilter.isDetailedPanelPresent())
            .toBe(true);
        await since(
            'X-func with filter summary, edit, based on text is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await metricFilter.getBaseOnText())
            .toBe('Cost');
        await takeScreenshotByElement(reportFilter.getDetailedPanel(), 'TC87867', 'FilterPanel_XFunc');
        await reportFilter.close();

        // edit attribute filter
        await reportSummary.viewAll();
        await reportSummary.edit({ name: 'Region' });
        await since(
            'X-func with filter summary, edit Region, filter panel present is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportFilter.isMainPanelPresent())
            .toBe(true);
        await since(
            'X-func with filter summary, edit Region, detailed panel present is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportFilter.isDetailedPanelPresent())
            .toBe(true);
        await since(
            'X-func with filter summary, edit Region, based on text is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await metricFilter.getBaseOnText())
            .toBe('Region');
        await reportFilter.close();

        // edit set filter
        await reportSummary.viewAll();
        await reportSummary.edit({ name: 'Category DESC', isSetFilter: true });
        await since(
            'X-func with filter summary, edit Set, filter panel present is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportFilter.isMainPanelPresent())
            .toBe(true);
        await since(
            'X-func with filter summary, edit CSet, detailed panel present is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportFilter.isDetailedPanelPresent())
            .toBe(false);
        await reportFilter.close();
    });

    it('[TC87873] Report filter -  filter panel - apply filter with valid and invalid filter', async () => {
        await resetReportState({
            credentials: credentials,
            report: reportNFilters,
        });
        await libraryPage.openDossier(reportNFilters.name);
        await reportPage.waitForReportLoading();

        // invalid number
        await reportFilter.open();
        await reportFilter.inlineEnterValue({ expType: 'Metric Qualification', objectName: 'Profit' }, 'abc');
        await since(
            'invalid number, invalid input, Done button enable is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportFilter.applyButtonEnabled())
            .toBe(false);
        await reportFilter.inlineEnterValue({ expType: 'Metric Qualification', objectName: 'Profit' }, '10');
        await since(
            'invalid number, valid input, Done button enable is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportFilter.applyButtonEnabled())
            .toBe(true);

        // invalid string
        await reportFilter.inlineChangeOperator(
            { expType: 'Attribute Qualification', objectName: 'Category' },
            'Contains'
        );
        await since(
            'invalid string, invalid input, Done button enable is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportFilter.applyButtonEnabled())
            .toBe(false);
        await reportFilter.inlineEnterValue({ expType: 'Attribute Qualification', objectName: 'Category' }, 'ab');
        await since(
            'invalid string, valid input, Done button enable is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportFilter.applyButtonEnabled())
            .toBe(true);

        // invalid operator
        await reportFilter.inlineChangeOperator(
            { expType: 'Attribute Qualification', objectName: 'Category' },
            'Between'
        );
        await since(
            'invalid operator, invalid input, Done button enable is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportFilter.applyButtonEnabled())
            .toBe(false);
        await takeScreenshotByElement(reportFilter.getMainPanel(), 'TC87873', 'FilterPanel_Invalid1');
        await reportFilter.inlineChangeOperator({ expType: 'Attribute Qualification', objectName: 'Category' }, 'Like');
        await since(
            'invalid operator, valid input, Done button enable is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportFilter.applyButtonEnabled())
            .toBe(true);

        // invalid filter expression
        await reportFilter.inlineDeleteElement({ expType: 'Attribute Qualification', objectName: 'Region' });
        await since(
            'invalid filter expression, Done button enable is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportFilter.applyButtonEnabled())
            .toBe(false);
        await takeScreenshotByElement(reportFilter.getMainPanel(), 'TC87873', 'FilterPanel_Invalid2');

        await reportFilter.close();
    });

    it('[TC88129] Report filter - date - select static day', async () => {
        const tolerance = 0.2;
        await resetReportState({
            credentials: credentials,
            report: reportDay,
        });
        await libraryPage.openDossier(reportDay.name);
        await reportPage.waitForReportLoading();
        await reportFilter.open();

        // check date value
        await since('Day 1, report filter should be "#{expected}", instead it is "#{actual}"')
            .expect(
                await reportFilter.filterSummaryText({
                    expType: 'Attribute Qualification',
                    objectName: 'Day',
                    index: 1,
                })
            )
            .toBe('Day@,ID,Not,In,08/01/2022,,08/25/2022');
        await since('Day 2, report filter should be "#{expected}", instead it is "#{actual}"')
            .expect(
                await reportFilter.filterSummaryBoxValue({
                    expType: 'Attribute Qualification',
                    objectName: 'Day',
                    index: 2,
                })
            )
            .toBe('02/24/2023');
        await since('Day 3, report filter should be "#{expected}", instead it is "#{actual}"')
            .expect(
                await reportFilter.filterSummaryBoxValue({
                    expType: 'Attribute Qualification',
                    objectName: 'Day',
                    index: 3,
                })
            )
            .toBe('Monday of the week of (Today plus 2 days plus 5 months)');

        // change fixed date
        await reportFilter.selectExpression({ expType: 'Attribute Qualification', objectName: 'Day', index: 2 });
        await reportDatetime.openDatePicker();
        await takeScreenshotByElement(reportDatetime.getDateTimePicker(), 'TC88129', 'reprotDay_static_Initial', {
            tolerance: tolerance,
        });
        await reportDatetime.clickNextYear(2);
        await reportDatetime.clickLastMonth(1);
        await takeScreenshotByElement(reportDatetime.getDateTimePicker(), 'TC88129', 'reprotDay_static_change');
        await reportDatetime.selectDay(10);
        await since('Day 2, after change, report filter should be "#{expected}", instead it is "#{actual}"')
            .expect(
                await reportFilter.filterSummaryBoxValue({
                    expType: 'Attribute Qualification',
                    objectName: 'Day',
                    index: 2,
                })
            )
            .toBe('01/10/2025');

        // apply
        await reportFilter.apply();
        await reportFilter.open();
        await since('Day 2, apply and re-open, report filter should be "#{expected}", instead it is "#{actual}"')
            .expect(
                await reportFilter.filterSummaryBoxValue({
                    expType: 'Attribute Qualification',
                    objectName: 'Day',
                    index: 2,
                })
            )
            .toBe('01/10/2025');

        await reportFilter.close();
    });

    it('[TC88130] Report filter - date - select dynamic day', async () => {
        const tolerance = 0.2;
        await resetReportState({
            credentials: credentials,
            report: reportDay,
        });
        await libraryPage.openDossier(reportDay.name);
        await reportPage.waitForReportLoading();
        await reportFilter.open();

        // check date value
        await since('Dynamic day, report filter should be "#{expected}", instead it is "#{actual}"')
            .expect(
                await reportFilter.filterSummaryBoxValue({
                    expType: 'Attribute Qualification',
                    objectName: 'Day',
                    index: 3,
                })
            )
            .toBe('Monday of the week of (Today plus 2 days plus 5 months)');

        // switch between static and dynamic day
        await reportFilter.selectExpression({ expType: 'Attribute Qualification', objectName: 'Day', index: 3 });
        await reportDatetime.openDatePicker();
        await reportDatetime.switchToStaticDate();
        await since(
            'Switch to static date, the dynamic picker button present should be "#{expected}", instead it is "#{actual}"'
        )
            .expect(await reportDatetime.isDynamicDatePickerPresent())
            .toBe(false);
        await reportDatetime.switchToDynamicDate();
        await takeScreenshotByElement(reportDatetime.getDateTimePicker(), 'TC88130', 'reprotDay_dynamic_Initial', {
            tolerance: tolerance,
        });

        // change dynamic date
        await since(
            'Before change dynamic day, the adjustment area present should be "#{expected}", instead it is "#{actual}"'
        )
            .expect(await reportDatetime.isAdjustmentAreaPresent())
            .toBe(true);
        await reportDatetime.clickExcludeWeekendButton();
        await reportDatetime.clickAdjustmentBtn();
        await since(
            'After change dynamic day, the adjustment area present should be "#{expected}", instead it is "#{actual}"'
        )
            .expect(await reportDatetime.isAdjustmentAreaPresent())
            .toBe(false);
        await takeScreenshotByElement(reportDatetime.getDateTimePicker(), 'TC88130', 'reprotDay_dynamic_change', {
            tolerance: tolerance,
        });
        await reportDatetime.commitDynamicDate();
        await since('Change dynamic day, report filter should be "#{expected}", instead it is "#{actual}"')
            .expect(
                await reportFilter.filterSummaryBoxValue({
                    expType: 'Attribute Qualification',
                    objectName: 'Day',
                    index: 3,
                })
            )
            .toBe('Today plus 2 days plus 5 months');
        await reportDatetime.done();
        // apply
        await reportFilter.apply();
        await reportFilter.open();
        await since('Change dynamic day and apply, report filter should be "#{expected}", instead it is "#{actual}"')
            .expect(
                await reportFilter.filterSummaryBoxValue({
                    expType: 'Attribute Qualification',
                    objectName: 'Day',
                    index: 3,
                })
            )
            .toBe('Today plus 2 days plus 5 months');
        await takeScreenshotByElement(reportFilter.getMainPanel(), 'TC88130', 'reprotDay_static_main');

        await reportFilter.close();
    });

    it('[TC88134] Report filter - date - select static hour', async () => {
        await resetReportState({
            credentials: credentials,
            report: reportDayTime,
        });
        await libraryPage.openDossier(reportDayTime.name);
        await reportPage.waitForReportLoading();
        await reportFilter.open();

        // check daytime value
        await since('Daytime 1, report filter should be "#{expected}", instead it is "#{actual}"')
            .expect(
                await reportFilter.filterSummaryText({
                    expType: 'Attribute Qualification',
                    objectName: 'Daytime',
                    index: 1,
                })
            )
            .toBe('Daytime@,ID,Not,In,08/08/2022,12:00:00,AM,,08/31/2022,12:00:00,AM');
        await since('Daytime 2, report filter should be "#{expected}", instead it is "#{actual}"')
            .expect(
                await reportFilter.filterSummaryBoxValue({
                    expType: 'Attribute Qualification',
                    objectName: 'Daytime',
                    index: 2,
                })
            )
            .toBe('03/17/2020;12:00:00');
        await since('Daytime 3, report filter should be "#{expected}", instead it is "#{actual}"')
            .expect(
                await reportFilter.filterSummaryBoxValue({
                    expType: 'Attribute Qualification',
                    objectName: 'Daytime',
                    index: 3,
                })
            )
            .toBe(
                'Monday of the week of (Today plus 3 days plus 2 months);Current Hour plus 1 hour, Current Minute minus 10 minutes'
            );

        // change dynamic date
        await reportFilter.selectExpression({ expType: 'Attribute Qualification', objectName: 'Daytime', index: 2 });
        await reportDatetime.openTimePicker();
        await takeScreenshotByElement(reportDatetime.getDateTimePicker(), 'TC88134', 'reprotTime_static_Initial');
        await reportDatetime.selectHour(1);
        await reportDatetime.selectMinute(2);
        await reportDatetime.selectSecond(3);
        await takeScreenshotByElement(reportDatetime.getDateTimePicker(), 'TC88134', 'reprotTime_static_Change');
        await reportDatetime.commitTimeChange();
        await since('Change daytime, report filter should be "#{expected}", instead it is "#{actual}"')
            .expect(await reportDatetime.getTimeValue())
            .toBe('1:02:03');
        await takeScreenshotByElement(reportFilter.getDetailedPanel(), 'TC88134', 'reprotTime_static_details');
        await reportDatetime.done();
        await takeScreenshotByElement(reportFilter.getMainPanel(), 'TC88134', 'reprotTime_static_main');

        // apply
        await reportFilter.apply();
        await reportPage.waitForReportLoading();
        await reportSummary.viewAll();
        await since(
            'Change daytime, open filter summary, Daytime value is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportSummary.getViewFilterRowValue('Daytime ID', 2))
            .toBe('Less than 03/17/2020 1:02:03 AM');
    });

    it('[TC88135] Report filter - date - select dynamic hour', async () => {
        const tolerance = 0.4;
        await resetReportState({
            credentials: credentials,
            report: reportDayTime,
        });
        await libraryPage.openDossier(reportDayTime.name);
        await reportPage.waitForReportLoading();
        await reportFilter.open();

        // check daytime value
        await since('Daytime 3, report filter should be "#{expected}", instead it is "#{actual}"')
            .expect(
                await reportFilter.filterSummaryBoxValue({
                    expType: 'Attribute Qualification',
                    objectName: 'Daytime',
                    index: 3,
                })
            )
            .toBe(
                'Monday of the week of (Today plus 3 days plus 2 months);Current Hour plus 1 hour, Current Minute minus 10 minutes'
            );

        // change dynamic date
        await reportFilter.selectExpression({ expType: 'Attribute Qualification', objectName: 'Daytime', index: 3 });
        await reportDatetime.openTimePicker();
        await takeScreenshotByElement(reportDatetime.getDateTimePicker(), 'TC88135', 'reprotTime_dynamic_Initial', {
            tolerance: tolerance,
        });
        await reportDatetime.inputDynamicHour(3);
        await reportDatetime.inputDynamicMinute(30);
        await takeScreenshotByElement(reportDatetime.getDateTimePicker(), 'TC88135', 'reprotTime_dynamic_change', {
            tolerance: tolerance,
        });
        await reportDatetime.commitTimeChange();
        await since('Change dynamic time, report filter should be "#{expected}", instead it is "#{actual}"')
            .expect(await reportDatetime.getTimeValue())
            .toBe('Current Hour plus 3 hours, Current Minute minus 30 minutes');
        await takeScreenshotByElement(reportFilter.getDetailedPanel(), 'TC88135', 'reprotTime_dynamic_details');
        await reportDatetime.done();

        // apply
        await reportFilter.apply();
        await reportPage.waitForReportLoading();
        await reportSummary.viewAll();
        await since(
            'Change dynamic time, open filter summary, Daytime value is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportSummary.getViewFilterRowValue('Daytime ID', 3))
            .toBe(
                'Does not equal Monday of the week of (Today plus 3 days plus 2 months)Current Hour plus 3 hours, Current Minute minus 30 minutes'
            );
    });

    it('[TC88136] Report filter - operator - list of values for In/Not in', async () => {
        await resetReportState({
            credentials: credentials,
            report: reportDay,
        });
        await libraryPage.openDossier(reportDay.name);
        await reportPage.waitForReportLoading();
        await reportFilter.open();

        // check summary
        await since('Day 1, report filter should be "#{expected}", instead it is "#{actual}"')
            .expect(
                await reportFilter.filterSummaryText({
                    expType: 'Attribute Qualification',
                    objectName: 'Day',
                    index: 1,
                })
            )
            .toBe('Day@,ID,Not,In,08/01/2022,,08/25/2022');

        // initial state
        await reportFilter.selectExpression({ expType: 'Attribute Qualification', objectName: 'Day', index: 1 });
        await since('Initially, validation text should contain "#{expected}", instead it is "#{actual}"')
            .expect(await customInputbox.getValidationText())
            .toContain('You can type or copy-paste values separated by commas');
        await takeScreenshotByElement(customInputbox.getCustomContainer(), 'TC88136', 'listOfValue_initial');

        // input invalid value
        await customInputbox.inputListOfValue('123');
        await since('input invalid vaue, done button present should be "#{expected}", instead it is "#{actual}"')
            .expect(await customInputbox.doneButtonEnabled())
            .toBe(false);
        await since('input invalid vaue, validation text should be "#{expected}", instead it is "#{actual}"')
            .expect(await customInputbox.getValidationText())
            .toContain('Require Validation');
        await takeScreenshotByElement(customInputbox.getCustomContainer(), 'TC88136', 'listOfValue_invalidValue');
        await customInputbox.validate();
        await since('input invalid vaue, validate, validation text should be "#{expected}", instead it is "#{actual}"')
            .expect(await customInputbox.getValidationText())
            .toContain('Value must be in the format');
        await takeScreenshotByElement(
            customInputbox.getCustomContainer(),
            'TC88136',
            'listOfValue_invalidValue_validate'
        );

        // clear
        await customInputbox.clear();
        await since('clear, validation text should contain "#{expected}", instead it is "#{actual}"')
            .expect(await customInputbox.getValidationText())
            .toContain('You can type or copy-paste values separated by commas');
        await takeScreenshotByElement(customInputbox.getCustomContainer(), 'TC88136', 'listOfValue_invalidValue_clear');

        // input valid value
        await customInputbox.inputListOfValue('08/01/2022');
        await customInputbox.validate();
        await since('input valid vaue, done button present should be "#{expected}", instead it is "#{actual}"')
            .expect(await customInputbox.doneButtonEnabled())
            .toBe(true);
        await takeScreenshotByElement(customInputbox.getCustomContainer(), 'TC88136', 'listOfValue_validValue');

        // click export
        await customInputbox.exportFile();

        // done
        await customInputbox.done();
        await since('Day 1, report filter should be "#{expected}", instead it is "#{actual}"')
            .expect(
                await reportFilter.filterSummaryText({
                    expType: 'Attribute Qualification',
                    objectName: 'Day',
                    index: 1,
                })
            )
            .toBe('Day@,ID,Not,In,08/01/2022');
        await takeScreenshotByElement(reportFilter.getMainPanel(), 'TC88136', 'listOfValue_done');

        // apply
        await reportFilter.apply();
        await reportPage.waitForReportLoading();
        await reportSummary.viewAll();
        await since(
            'Change list of value, open filter summary, Day value is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportSummary.getViewFilterRowValue('Day ID', 1))
            .toBe('Not In 08/01/2022');
    });

    it('[TC87874] Report filter -  filter panel - user without priviledge is not able to see filter panel', async () => {
        const credentials = customCredentials('_reportFilter_noPriviledge').credentials;

        await userAccount.openUserAccountMenu();
        await userAccount.logout();

        // re-login with limited priviledge
        await loginPage.login(credentials);
        await libraryPage.openDossier(reportNFilters.name);
        await reportPage.waitForReportLoading();

        // check filter icon
        await since(
            'user without view filter privieldge, filter panel present is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportFilter.getFilterIcon().isDisplayed())
            .toBe(false);
    });
});

export const config = specConfiguration;
