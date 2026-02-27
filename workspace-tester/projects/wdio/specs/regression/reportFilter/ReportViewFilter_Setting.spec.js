import { customCredentials } from '../../../constants/index.js';
import resetReportState from '../../../api/reports/resetReportState.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_reportFilter') };

describe('Library Report View Filter - Setting', () => {
    const tutorialProject = {
        id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
        name: 'MicroStrategy Tutorial',
    };
    const reportSetting = {
        id: '367C92A648BA16263FACE880455103F7',
        name: '(AUTO) Report_ViewFilter_Setting',
        project: tutorialProject,
    };
    const reportSettingAgg = {
        id: 'E3FF27794200546062791E87E4420DB0',
        name: '(AUTO) ReportFilter_ViewFilter_SettingAggregation',
        project: tutorialProject,
    };
    const reportPin = {
        id: '244E8103432A05EAEC81068989CC49C0',
        name: '(AUTO) Report_ViewFilter_Pin',
        project: tutorialProject,
    };
    const reportLargeList = {
        id: 'A68CCBBB415387D3944414AF40AF4E29',
        name: '(AUTO) Report_ViewFilter_LargeList',
        project: tutorialProject,
    };
    const report1Filter = {
        id: '482043D0420A53EB8DDA5B9B4E6371A0',
        name: '(AUTO) ReportFilter_ViewFilter_1Filter',
        project: tutorialProject,
    };

    const { credentials } = specConfiguration;
    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1200,
    };

    let {
        dossierPage,
        libraryPage,
        reportSummary,
        reportFilter,
        attributeFilter,
        metricFilter,
        reportPage,
        loginPage,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(specConfiguration.credentials);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC87787] Report filter - setting -  use as aggregation filter', async () => {
        await resetReportState({
            credentials: credentials,
            report: reportSetting,
        });
        await libraryPage.openDossier(reportSetting.name);
        await reportPage.waitForReportLoading();
        await reportFilter.open();

        await since('Initially, view limit count should be "#{expected}" instead there are "#{actual}"')
            .expect(await reportFilter.getViewFilterCount())
            .toBe(5);
        await since('Initially,  metric limit count should be "#{expected}" instead there are "#{actual}"')
            .expect(await reportFilter.getAggregationFilterCount())
            .toBe(0);
        await since('Initially, group count should be "#{expected}" groups instead there are "#{actual}"')
            .expect(await reportFilter.getExpressionGroupCount())
            .toBe(3);

        // when there is more than 2 filter in one group
        await reportFilter.selectExpressionContextMenu({ expType: 'Metric Qualification', objectName: 'Profit' });
        await takeScreenshotByElement(reportFilter.getContextMenu(), 'TC87787', 'ReportFilter_Setting_Menu', {
            tolerance: 3,
        });
        await reportFilter.selectContextMenuOption('Use As Aggregation Filter');
        await since(
            'Move when ther is more than 2 filter in one group,  metric limit count should be "#{expected}" instead there are "#{actual}"'
        )
            .expect(await reportFilter.getAggregationFilterCount())
            .toBe(1);
        await since(
            'Move when ther is more than 2 filter in one group,  view limit count should be "#{expected}" instead there are "#{actual}"'
        )
            .expect(await reportFilter.getViewFilterCount())
            .toBe(4);
        await since(
            'Move when ther is more than 2 filter in one group,  group count should be "#{expected}" groups instead there are "#{actual}"'
        )
            .expect(await reportFilter.getExpressionGroupCount())
            .toBe(3);

        //  when there is only 2 filter in one gorup
        await reportFilter.selectExpressionContextMenu({ expType: 'Metric Qualification', objectName: 'Cost' });
        await reportFilter.selectContextMenuOption('Use As Aggregation Filter');
        await since(
            'Move when there only 2 filter in one group,  metric limit count should be "#{expected}" instead there are "#{actual}"'
        )
            .expect(await reportFilter.getAggregationFilterCount())
            .toBe(2);
        await since(
            'Move when there only  2 filter in one group,  view limit count should be "#{expected}" instead there are "#{actual}"'
        )
            .expect(await reportFilter.getViewFilterCount())
            .toBe(3);
        await since(
            'Move when there only  2 filter in one group,  group count should be "#{expected}" groups instead there are "#{actual}"'
        )
            .expect(await reportFilter.getExpressionGroupCount())
            .toBe(2);
        await since(
            'Move when there only  2 filter in one group,  Done button enable is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportFilter.applyButtonEnabled())
            .toBe(true);
        await takeScreenshotByElement(reportFilter.getMainPanel(), 'TC87787', 'ReportFilter_Setting_Qualificaiton');

        // when set has multiple filters
        await reportFilter.selectExpressionContextMenu({
            expType: 'Metric Qualification',
            objectName: 'Profit Margin',
        });
        await reportFilter.selectContextMenuOption('Use As Aggregation Filter');
        await since(
            'Move when set has multiple filters, metric limit count should be "#{expected}" instead there are "#{actual}"'
        )
            .expect(await reportFilter.getAggregationFilterCount())
            .toBe(3);
        await since(
            'Move when set has multiple filters, view limit count should be "#{expected}" instead there are "#{actual}"'
        )
            .expect(await reportFilter.getViewFilterCount())
            .toBe(2);
        await since(
            'Move when set has multiple filters, group count should be "#{expected}" groups instead there are "#{actual}"'
        )
            .expect(await reportFilter.getExpressionGroupCount())
            .toBe(1);
        await since(
            'Move when set has multiple filters, Done button enable is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportFilter.applyButtonEnabled())
            .toBe(true);

        // when set has only 1 filter
        await reportFilter.selectExpressionContextMenu({ expType: 'Metric Qualification', objectName: 'Revenue' });
        await reportFilter.selectContextMenuOption('Use As Aggregation Filter');
        await since(
            'Move when set has 1 filters, metric limit count should be "#{expected}" instead there are "#{actual}"'
        )
            .expect(await reportFilter.getAggregationFilterCount())
            .toBe(4);
        await since(
            'Move when set has 1 filters, view limit count should be "#{expected}" instead there are "#{actual}"'
        )
            .expect(await reportFilter.getViewFilterCount())
            .toBe(2);
        await since(
            'Move when set has 1 filters, group count should be "#{expected}" groups instead there are "#{actual}"'
        )
            .expect(await reportFilter.getExpressionGroupCount())
            .toBe(1);
        await since(
            'Move when set has 1 filters, Done button enable is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportFilter.applyButtonEnabled())
            .toBe(false);
        await takeScreenshotByElement(reportFilter.getMainPanel(), 'TC87787', 'ReportFilter_Setting_Set');

        // remove empty expression
        await since(
            'Move when set has 1 filters, Empty expression present is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportFilter.isExpressionPresent({ expType: 'New Qualification', objectName: 'EMPTY' }))
            .toBe(true);
        await reportFilter.selectExpressionContextMenu({ expType: 'Set Qualification', objectName: 'Year' });
        await reportFilter.selectContextMenuOption('Delete');
        await since('Remove empty expression, view limit count should be "#{expected}" instead there are "#{actual}"')
            .expect(await reportFilter.getViewFilterCount())
            .toBe(1);
        await since(
            'Remove empty expression, Done button enable is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportFilter.applyButtonEnabled())
            .toBe(true);

        // apply
        await reportFilter.apply();
        await reportFilter.open();
        await since('re-open, metric limit count should be "#{expected}" instead there are "#{actual}"')
            .expect(await reportFilter.getAggregationFilterCount())
            .toBe(4);
        await since('re-open, view limit count should be "#{expected}" instead there are "#{actual}"')
            .expect(await reportFilter.getViewFilterCount())
            .toBe(1);
        await takeScreenshotByElement(reportFilter.getMainPanel(), 'TC87787', 'ReportFilter_Setting_Apply');

        await reportFilter.close();
    });

    it('[TC87788] Report filter - setting -  use as view filter', async () => {
        await resetReportState({
            credentials: credentials,
            report: reportSettingAgg,
        });
        await libraryPage.openDossier(reportSettingAgg.name);
        await reportPage.waitForReportLoading();
        await reportFilter.open();

        await since('Initially, view limit count should be "#{expected}" instead there are "#{actual}"')
            .expect(await reportFilter.getViewFilterCount())
            .toBe(0);
        await since('Initially,  metric limit count should be "#{expected}" instead there are "#{actual}"')
            .expect(await reportFilter.getAggregationFilterCount())
            .toBe(3);

        // use as view filter 1
        await reportFilter.selectExpressionContextMenu({
            expType: 'Metric Qualification',
            objectName: 'Profit Margin',
        });
        await reportFilter.selectContextMenuOption('Use As View Filter');
        await since('use as view filter 1 ,  metric limit count should be "#{expected}" instead there are "#{actual}"')
            .expect(await reportFilter.getAggregationFilterCount())
            .toBe(2);
        await since('use as view filter 1 ,  view limit count should be "#{expected}" instead there are "#{actual}"')
            .expect(await reportFilter.getViewFilterCount())
            .toBe(1);
        await since(
            'use as view filter 1 ,  Done button enable is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportFilter.applyButtonEnabled())
            .toBe(true);

        // use as view filter 2
        await reportFilter.selectExpressionContextMenu({ expType: 'Metric Qualification', objectName: 'Cost' });
        await reportFilter.selectContextMenuOption('Use As View Filter');
        await since('use as view filter 2,  metric limit count should be "#{expected}" instead there are "#{actual}"')
            .expect(await reportFilter.getAggregationFilterCount())
            .toBe(1);
        await since('use as view filter 2,  view limit count should be "#{expected}" instead there are "#{actual}"')
            .expect(await reportFilter.getViewFilterCount())
            .toBe(2);

        // use as view filter 3
        await reportFilter.selectExpressionContextMenu({ expType: 'Metric Qualification', objectName: 'Profit' });
        await reportFilter.selectContextMenuOption('Use As View Filter');
        await since('use as view filter 2,  metric limit count should be "#{expected}" instead there are "#{actual}"')
            .expect(await reportFilter.getAggregationFilterCount())
            .toBe(0);
        await since('use as view filter 2,  view limit count should be "#{expected}" instead there are "#{actual}"')
            .expect(await reportFilter.getViewFilterCount())
            .toBe(3);
        await takeScreenshotByElement(reportFilter.getMainPanel(), 'TC87788', 'ReportFilter_Setting_ViewFilter');

        // change group
        await reportFilter.groupFilter(1);
        await since('change group, group link present should be "#{expected}" groups instead there are "#{actual}"')
            .expect(await reportFilter.isGroupLinkPresent(1))
            .toBe(false);
        await since('change group, group count should be "#{expected}" groups instead there are "#{actual}"')
            .expect(await reportFilter.getExpressionGroupCount())
            .toBe(2);
        await since(
            'change group, group action link count should be "#{expected}" groups instead there are "#{actual}"'
        )
            .expect(await reportFilter.getGroupActionLinkCount())
            .toBe(1);
        await reportFilter.openGroupOperator(1);
        await reportFilter.selectGroupOperator('OR');
        await since('change group, operator display should be "#{expected}" instead it is "#{actual}"')
            .expect(await reportFilter.getOperatorText(1))
            .toBe('OR');

        // move back to aggregation filter

        // apply
        await reportFilter.apply();
        await reportFilter.open();
        await since(
            'Move when there only 2 filter in one group,  metric limit count should be "#{expected}" instead there are "#{actual}"'
        )
            .expect(await reportFilter.getAggregationFilterCount())
            .toBe(0);
        await since(
            'Move when there only  2 filter in one group,  view limit count should be "#{expected}" instead there are "#{actual}"'
        )
            .expect(await reportFilter.getViewFilterCount())
            .toBe(3);
        await takeScreenshotByElement(reportFilter.getMainPanel(), 'TC87788', 'ReportFilter_Setting_ViewFilter_Apply');

        await reportFilter.close();
    });

    it('[TC87789] Report filter - setting - advanced', async () => {
        await resetReportState({
            credentials: credentials,
            report: reportSetting,
        });
        await libraryPage.openDossier(reportSetting.name);
        await reportPage.waitForReportLoading();
        await reportFilter.open();

        // advanced in set filter
        await reportFilter.selectExpressionContextMenu({ expType: 'Set Qualification', objectName: 'Year' });
        await reportFilter.selectContextMenuOption('Advanced');
        await since('advanced on set filter, Advanced checked should be "#{expected}" instead there are "#{actual}"')
            .expect(await reportFilter.isAdvancedChecked())
            .toBe(true);
        await reportFilter.clickAdvancedCheckbox();

        // advanced on metric filter
        await reportFilter.selectExpressionContextMenu({ expType: 'Metric Qualification', objectName: 'Profit' });
        await since('advanced on metric filter, Advanced present should be "#{expected}" instead there are "#{actual}"')
            .expect(await reportFilter.isContextMenuOptionPresent('Advanced'))
            .toBe(false);
        await reportFilter.clickFilterHeader(); // to close advanced context
        await reportFilter.selectExpression({ expType: 'Metric Qualification', objectName: 'Profit' });
        await metricFilter.clickAdvancedOptionButton();
        await since(
            'advanced on metric filter, Advanced checkbox selected should be "#{expected}" instead there are "#{actual}"'
        )
            .expect(await metricFilter.isAdvancedOptionChecked())
            .toBe(false);
        await metricFilter.clickAdvancedOptionCheckbox();
        await since(
            'advanced on metric filter, after select, Advanced checkbox selected should be "#{expected}" instead there are "#{actual}"'
        )
            .expect(await metricFilter.isAdvancedOptionChecked())
            .toBe(true);
        await takeScreenshotByElement(
            reportFilter.getDetailedPanel(),
            'TC87789',
            'ReportFilter_Setting_Advanced_Metric'
        );

        await metricFilter.done();

        // apply
        await reportFilter.apply();
        await reportFilter.open();
        await reportFilter.selectExpression({ expType: 'Metric Qualification', objectName: 'Profit' });
        await metricFilter.clickAdvancedOptionButton();
        await since(
            're-open, metric filter, Advanced checkbox selected should be "#{expected}" instead there are "#{actual}"'
        )
            .expect(await metricFilter.isAdvancedOptionChecked())
            .toBe(true);
        await reportFilter.selectExpressionContextMenu({ expType: 'Set Qualification', objectName: 'Year' });
        await reportFilter.selectContextMenuOption('Advanced');
        await since('re-open, set filter, Advanced checked should be "#{expected}" instead there are "#{actual}"')
            .expect(await reportFilter.isAdvancedChecked())
            .toBe(false);
        await reportFilter.clickFilterHeader(); // to close context

        await reportFilter.close();
    });

    it('[TC87790] Report filter - setting - delete', async () => {
        await resetReportState({
            credentials: credentials,
            report: reportSetting,
        });
        await libraryPage.openDossier(reportSetting.name);
        await reportPage.waitForReportLoading();
        await reportFilter.open();

        await since('Initially, view filter count should be "#{expected}" instead there are "#{actual}"')
            .expect(await reportFilter.getViewFilterCount())
            .toBe(5);
        await since('Initially, group count should be "#{expected}" groups instead there are "#{actual}"')
            .expect(await reportFilter.getExpressionGroupCount())
            .toBe(3);

        // delete standalone metric filter
        await reportFilter.selectExpressionContextMenu({ expType: 'Metric Qualification', objectName: 'Cost' });
        await reportFilter.selectContextMenuOption('Delete');
        await since('delete metric filter, view filter count should be "#{expected}" instead there are "#{actual}"')
            .expect(await reportFilter.getViewFilterCount())
            .toBe(4);
        await since('delete metric filter, group count should be "#{expected}" groups instead there are "#{actual}"')
            .expect(await reportFilter.getExpressionGroupCount())
            .toBe(3);

        // delete standalone attribute filter
        await reportFilter.selectExpressionContextMenu({ expType: 'Attribute Qualification', objectName: 'Category' });
        await reportFilter.selectContextMenuOption('Delete');
        await since('delete attribute filter, view filter count should be "#{expected}" instead there are "#{actual}"')
            .expect(await reportFilter.getViewFilterCount())
            .toBe(3);
        await since('delete attribute filter, group count should be "#{expected}" groups instead there are "#{actual}"')
            .expect(await reportFilter.getExpressionGroupCount())
            .toBe(2);

        // delete filter under set
        await reportFilter.selectExpressionContextMenu({ expType: 'Metric Qualification', objectName: 'Revenue' });
        await reportFilter.selectContextMenuOption('Delete');
        await since('delete filter under set, view filter count should be "#{expected}" instead there are "#{actual}"')
            .expect(await reportFilter.getViewFilterCount())
            .toBe(2);
        await since('elete filter under set, group count should be "#{expected}" groups instead there are "#{actual}"')
            .expect(await reportFilter.getExpressionGroupCount())
            .toBe(1);

        // delete set filter
        await reportFilter.selectExpressionContextMenu({ expType: 'Set Qualification', objectName: 'Year' });
        await reportFilter.selectContextMenuOption('Delete');
        await since('delete set filter, view filter count should be "#{expected}" instead there are "#{actual}"')
            .expect(await reportFilter.getViewFilterCount())
            .toBe(1);

        // re-open
        await reportFilter.apply();
        await reportFilter.open();
        await since('delete metric filter, view filter count should be "#{expected}" instead there are "#{actual}"')
            .expect(await reportFilter.getViewFilterCount())
            .toBe(1);
        await takeScreenshotByElement(reportFilter.getMainPanel(), 'TC87790', 'ReportFilter_Setting_Delete');

        await reportFilter.close();
    });

    it('[TC87791] Report filter - setting - add qualificaiton', async () => {
        await resetReportState({
            credentials: credentials,
            report: reportSetting,
        });
        await libraryPage.openDossier(reportSetting.name);
        await reportPage.waitForReportLoading();
        await reportFilter.open();

        await since('Initially, view filter count should be "#{expected}" instead there are "#{actual}"')
            .expect(await reportFilter.getViewFilterCount())
            .toBe(5);
        await since('Initially, group count should be "#{expected}" groups instead there are "#{actual}"')
            .expect(await reportFilter.getExpressionGroupCount())
            .toBe(3);

        // add qulificaiton
        await reportFilter.selectExpressionContextMenu({ expType: 'Set Qualification', objectName: 'Year' });
        await reportFilter.selectContextMenuOption('Add Qualification');
        await takeScreenshotByElement(
            reportFilter.getMainPanel(),
            'TC87791',
            'ReportFilter_Setting_addQualification_initial'
        );

        // await attributeFilter.clickBasedOn();
        await attributeFilter.selectBasedOnObject('Region');
        await attributeFilter.selectAttributeElements(['Central', 'Northeast']);
        await attributeFilter.done();
        await since('add qulificaiton, view filter count should be "#{expected}" instead there are "#{actual}"')
            .expect(await reportFilter.getViewFilterCount())
            .toBe(6);
        await since('add qulificaiton, group count should be "#{expected}" groups instead there are "#{actual}"')
            .expect(await reportFilter.getExpressionGroupCount())
            .toBe(3);

        // check qualification filter
        await reportFilter.selectExpressionContextMenu({ expType: 'Metric Qualification', objectName: 'Profit' });
        await since(
            'qualificaiton filter,  Add Qualification present should be "#{expected}" instead there are "#{actual}"'
        )
            .expect(await reportFilter.isContextMenuOptionPresent('Add Qualification'))
            .toBe(false);
        await reportFilter.clickFilterHeader(); // to close context menu

        // re-open
        await reportFilter.apply();
        await reportFilter.open();
        await since('are-open, view filter count should be "#{expected}" instead there are "#{actual}"')
            .expect(await reportFilter.getViewFilterCount())
            .toBe(6);
        await takeScreenshotByElement(
            reportFilter.getMainPanel(),
            'TC87791',
            'ReportFilter_Setting_AddQualification_apply'
        );

        await reportFilter.close();
    });

    it('[TC87792] Report filter - setting - remove set', async () => {
        await resetReportState({
            credentials: credentials,
            report: reportSetting,
        });
        await libraryPage.openDossier(reportSetting.name);
        await reportPage.waitForReportLoading();
        await reportFilter.open();

        await since('Initially, view filter count should be "#{expected}" instead there are "#{actual}"')
            .expect(await reportFilter.getViewFilterCount())
            .toBe(5);
        await since('Initially, set expression present is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportFilter.isExpressionPresent({ expType: 'Set Qualification', objectName: 'Year' }))
            .toBe(true);

        // remove set
        await reportFilter.selectExpressionContextMenu({ expType: 'Set Qualification', objectName: 'Year' });
        await takeScreenshotByElement(reportFilter.getContextMenu(), 'TC87792', 'ReportFilter_Setting_RemoveSet', {
            tolerance: 5,
        });
        await reportFilter.selectContextMenuOption('Remove Set');
        await since('remove set, group count should be "#{expected}" groups instead there are "#{actual}"')
            .expect(await reportFilter.getExpressionGroupCount())
            .toBe(3);
        await since('remove set, view filter count should be "#{expected}" instead there are "#{actual}"')
            .expect(await reportFilter.getViewFilterCount())
            .toBe(5);

        // check qualification filter
        await reportFilter.selectExpressionContextMenu({
            expType: 'Metric Qualification',
            objectName: 'Profit Margin',
        });
        await since('qualificaiton filter,  Remove Set present should be "#{expected}" instead there are "#{actual}"')
            .expect(await reportFilter.isContextMenuOptionPresent('Remove Set'))
            .toBe(false);
        await reportFilter.clickFilterHeader(); // to close context menu

        // re-open
        await reportFilter.apply();
        await reportFilter.open();
        await takeScreenshotByElement(reportFilter.getMainPanel(), 'TC87792', 'ReportFilter_Setting_RemoveSet_Apply');

        await reportFilter.close();
    });

    it('[TC87793] Report filter - setting - remove all filters', async () => {
        await resetReportState({
            credentials: credentials,
            report: reportSetting,
        });
        await resetReportState({
            credentials: credentials,
            report: reportSettingAgg,
        });

        // remove all view filter
        await libraryPage.openDossier(reportSetting.name);
        await reportPage.waitForReportLoading();
        await reportFilter.open();
        await since('Initially, view filter count should be "#{expected}" instead there are "#{actual}"')
            .expect(await reportFilter.getViewFilterCount())
            .toBe(5);
        //-- remove all filter
        await reportFilter.clickSettingIcon();
        await reportFilter.selectSetting('Remove All Filters');
        await since('remove all filter, view filter count should be "#{expected}" instead there are "#{actual}"')
            .expect(await reportFilter.getViewFilterCount())
            .toBe(0);
        //-- re-open
        await reportFilter.apply();
        await reportFilter.open();
        await since('remove all filter, apply, view filter count should be "#{expected}" instead there are "#{actual}"')
            .expect(await reportFilter.getViewFilterCount())
            .toBe(0);

        await reportFilter.close();
        await dossierPage.goToLibrary();

        // remove all aggregation filter
        await libraryPage.openDossier(reportSettingAgg.name);
        await reportPage.waitForReportLoading();
        await reportFilter.open();
        await since('Initially,  metric limit count should be "#{expected}" instead there are "#{actual}"')
            .expect(await reportFilter.getAggregationFilterCount())
            .toBe(3);
        // -- remove all filter
        await reportFilter.clickSettingIcon();
        await reportFilter.selectSetting('Remove All Filters');
        await since('remove all filter again, view filter count should be "#{expected}" instead there are "#{actual}"')
            .expect(await reportFilter.getAggregationFilterCount())
            .toBe(0);
        // re-open
        await reportFilter.apply();
        await reportFilter.open();
        await since('re-open again, filter count should be "#{expected}" instead there are "#{actual}"')
            .expect(await reportFilter.getAggregationFilterCount())
            .toBe(0);
        await takeScreenshotByElement(reportFilter.getMainPanel(), 'TC87793', 'ReportFilter_Setting_RemoveAll');

        await reportFilter.close();
    });

    it('[TC87794] Report filter - setting - hide filter summary', async () => {
        await resetReportState({
            credentials: credentials,
            report: reportSetting,
        });
        await libraryPage.openDossier(reportSetting.name);
        await reportPage.waitForReportLoading();
        await reportFilter.open();
        await since('initially, filter summary bar present should be "#{expected}" instead there are "#{actual}"')
            .expect(await reportSummary.isSummaryBarPresent())
            .toBe(true);

        // hide filter summary
        await reportFilter.clickSettingIcon();
        await takeScreenshotByElement(
            reportFilter.getFilterMenu(),
            'TC87794',
            'ReportFilter_Setting_HideFilterSummary'
        );
        await reportFilter.selectSetting('Hide Filter Summary');
        await since(
            'hide filter summary, filter summary bar present should be "#{expected}" instead there are "#{actual}"'
        )
            .expect(await reportSummary.isSummaryBarPresent())
            .toBe(false);
        await reportFilter.close();
        // -- re-open dossier to check
        await dossierPage.goToLibrary();
        await libraryPage.openDossier(reportSetting.name);
        await reportPage.waitForReportLoading();
        await since(
            'hide filter summary, after reopen, filter summary bar present should be "#{expected}" instead there are "#{actual}"'
        )
            .expect(await reportSummary.isSummaryBarPresent())
            .toBe(false);

        // show filter summary
        await reportFilter.open();
        await reportFilter.clickSettingIcon();
        await reportFilter.selectSetting('Show Filter Summary');
        await since(
            'show filter summary, filter summary bar present should be "#{expected}" instead there are "#{actual}"'
        )
            .expect(await reportSummary.isSummaryBarPresent())
            .toBe(true);

        await reportFilter.close();
    });

    it('[TC87875] Report filter - setting - edit', async () => {
        await resetReportState({
            credentials: credentials,
            report: reportSetting,
        });
        await libraryPage.openDossier(reportSetting.name);
        await reportPage.waitForReportLoading();
        await reportFilter.open();

        // edit metric
        await reportFilter.selectExpressionContextMenu({ expType: 'Metric Qualification', objectName: 'Profit' });
        await reportFilter.selectContextMenuOption('Edit');
        await since('edit metric, detailed panel present is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportFilter.isDetailedPanelPresent())
            .toBe(true);
        await since('edit metric, based on text is supposed to be #{expected}, instead we have #{actual}')
            .expect(await metricFilter.getBaseOnText())
            .toBe('Profit');

        // edit attribute
        await reportFilter.selectExpressionContextMenu({ expType: 'Attribute Qualification', objectName: 'Category' });
        await reportFilter.selectContextMenuOption('Edit');
        await since('edit attribute, detailed panel present is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportFilter.isDetailedPanelPresent())
            .toBe(true);
        await since('edit attribute, based on text is supposed to be #{expected}, instead we have #{actual}')
            .expect(await metricFilter.getBaseOnText())
            .toBe('Category');
        await takeScreenshotByElement(reportFilter.getDetailedPanel(), 'TC87875', 'ReportFilter_Setting_Edit');

        // no edit in set
        await reportFilter.selectExpressionContextMenu({ expType: 'Set Qualification', objectName: 'Year' });
        await since('eo edit in set,  Edit present is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportFilter.isContextMenuOptionPresent('Edit'))
            .toBe(false);

        await reportFilter.close();
    });

    it('[TC87876] Report filter - setting - setting for empty expression', async () => {
        await resetReportState({
            credentials: credentials,
            report: report1Filter,
        });
        await libraryPage.openDossier(report1Filter.name);
        await reportPage.waitForReportLoading();
        await reportFilter.open();

        // empty expression
        await attributeFilter.create();

        // check setting menu
        await reportFilter.selectExpressionContextMenu({ expType: 'New Qualification', objectName: 'EMPTY' });
        await since('empty expression,  Edit present is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportFilter.isContextMenuOptionPresent('Edit'))
            .toBe(true);
        await since('empty expression,  Create a Set present is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportFilter.isContextMenuOptionPresent('Create a Set'))
            .toBe(false);
        await takeScreenshotByElement(reportFilter.getContextMenu(), 'TC87876', 'ReportFilter_Setting_EMPTY');

        // edit
        await reportFilter.selectContextMenuOption('Edit');
        await since(
            'empty expression,  detailed panel present is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportFilter.isDetailedPanelPresent())
            .toBe(true);

        // delete
        await since(
            'empty expression, before delete, add button active is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await attributeFilter.isNewEnabled())
            .toBe(false);
        await reportFilter.selectExpressionContextMenu({ expType: 'New Qualification', objectName: 'EMPTY' });
        await reportFilter.selectContextMenuOption('Delete');
        await since(
            'empty expression, after delete, add button active is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await attributeFilter.isNewEnabled())
            .toBe(true);

        await reportFilter.close();
    });

    it('[TC87795] Report filter - setting - pin and unpin filter panel', async () => {
        await resetReportState({
            credentials: credentials,
            report: reportPin,
        });
        await libraryPage.openDossier(reportPin.name);
        await reportPage.waitForReportLoading();
        await reportFilter.open();

        // pin filter panel
        await reportFilter.pin();
        await since('pin, filter panel docked should be "#{expected}" instead there are "#{actual}"')
            .expect(await reportFilter.isPanelDocked())
            .toBe(true);
        await since('pin, view filter count should be "#{expected}" instead there are "#{actual}"')
            .expect(await reportFilter.getViewFilterCount())
            .toBe(5);
        await since('pin, group count should be "#{expected}" groups instead there are "#{actual}"')
            .expect(await reportFilter.getExpressionGroupCount())
            .toBe(3);
        await takeScreenshotByElement(reportFilter.getMainPanel(), 'TC87795', 'ReportFilter_Setting_Pin');

        // made some change
        await reportFilter.selectExpressionContextMenu({ expType: 'Metric Qualification', objectName: 'Cost' });
        await reportFilter.selectContextMenuOption('Delete');
        await reportFilter.apply();
        await since('made some change, view filter count should be "#{expected}" instead there are "#{actual}"')
            .expect(await reportFilter.getViewFilterCount())
            .toBe(4);

        // re-open to check
        await reportFilter.close();
        await reportFilter.open();
        await since('re-open, filter panel docked should be "#{expected}" instead there are "#{actual}"')
            .expect(await reportFilter.isPanelDocked())
            .toBe(true);
        await since('re-open, view filter count should be "#{expected}" instead there are "#{actual}"')
            .expect(await reportFilter.getViewFilterCount())
            .toBe(4);

        // switch to unpin
        await reportFilter.unpin();
        await since('unpin, filter panel docked should be "#{expected}" instead there are "#{actual}"')
            .expect(await reportFilter.isPanelDocked())
            .toBe(false);
        await since('unpin, view filter count should be "#{expected}" instead there are "#{actual}"')
            .expect(await reportFilter.getViewFilterCount())
            .toBe(4);
        await takeScreenshotByElement(reportFilter.getMainPanel(), 'TC87795', 'ReportFilter_Setting_Unpin');

        await reportFilter.close();
    });

    it('[TC87877] Report filter - pin - new and edit filter', async () => {
        await resetReportState({
            credentials: credentials,
            report: reportPin,
        });
        await libraryPage.openDossier(reportPin.name);
        await reportPage.waitForReportLoading();
        await reportFilter.open();

        // pin filter panel
        await reportFilter.pin();
        await since('pin, filter panel docked should be "#{expected}" instead there are "#{actual}"')
            .expect(await reportFilter.isPanelDocked())
            .toBe(true);
        await since('made some change, view filter count should be "#{expected}" instead there are "#{actual}"')
            .expect(await reportFilter.getViewFilterCount())
            .toBe(5);

        // new filter
        await attributeFilter.create();
        // await attributeFilter.clickBasedOn();
        await attributeFilter.selectBasedOnObject('Region');
        await attributeFilter.selectAttributeElements(['Central']);
        await attributeFilter.done();
        await since('new filter, view filter count should be "#{expected}" instead there are "#{actual}"')
            .expect(await reportFilter.getViewFilterCount())
            .toBe(6);

        // edit filter
        await reportFilter.selectExpressionContextMenu({ expType: 'Metric Qualification', objectName: 'Profit' });
        await reportFilter.selectContextMenuOption('Delete');
        await reportFilter.selectExpressionContextMenu({ expType: 'Metric Qualification', objectName: 'Cost' });
        await reportFilter.selectContextMenuOption('Delete');
        await since('edit filter, view filter count should be "#{expected}" instead there are "#{actual}"')
            .expect(await reportFilter.getViewFilterCount())
            .toBe(4);

        // apply and switch to pin
        await reportFilter.apply();
        await since('apply, view filter count should be "#{expected}" instead there are "#{actual}"')
            .expect(await reportFilter.getViewFilterCount())
            .toBe(4);
        await takeScreenshotByElement(reportFilter.getMainPanel(), 'TC87877', 'ReportFilter_Setting_PinApply');

        await reportFilter.unpin();
        await since('apply, view filter count should be "#{expected}" instead there are "#{actual}"')
            .expect(await reportFilter.getViewFilterCount())
            .toBe(4);
        await reportFilter.close();
    });

    it('[TC87878] Report filter - pin - large filters (under pin and unpin)', async () => {
        await resetReportState({
            credentials: credentials,
            report: reportLargeList,
        });
        await libraryPage.openDossier(reportLargeList.name);
        await reportPage.waitForReportLoading();
        await reportFilter.open();

        // unpin - collapse section
        await reportFilter.clickViewFilterArrow(); // collapse
        await since('large filters, view filter collapse is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportFilter.isViewFilterCollapsed())
            .toBe(true);
        await reportFilter.clickViewFilterArrow(); // expand
        await since('large filters, view filter collapse is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportFilter.isViewFilterCollapsed())
            .toBe(false);

        // scrollbar
        await reportFilter.scrollToBottom();
        await reportFilter.pin();
        await takeScreenshotByElement(reportFilter.getMainPanel(), 'TC87878', 'ReportFilter_LargeFilter_Scroll');

        // pin - drag width
        const width1 = await reportFilter.getPanelWidth();
        await reportFilter.dragFilterWidth();
        const width2 = await reportFilter.getPanelWidth();
        await since(
            'drag filter , filter panel width supposed to be greater than #{expected}, instead we have #{actual}'
        )
            .expect(width2)
            .toBeGreaterThan(width1);
        await since('drag filter , view filter count should be "#{expected}" instead there are "#{actual}"')
            .expect(await reportFilter.getViewFilterCount())
            .toBe(6);
        await takeScreenshotByElement(reportFilter.getMainPanel(), 'TC87878', 'ReportFilter_LargeFilter_Drag');

        // unpin
        await reportFilter.unpin();
        await since(
            'drag filter ,after unpin,  filter panel width supposed to be less than #{expected}, instead we have #{actual}'
        )
            .expect(await reportFilter.getPanelWidth())
            .toBeLessThan(width2);
        await reportFilter.close();
    });
});

export const config = specConfiguration;
