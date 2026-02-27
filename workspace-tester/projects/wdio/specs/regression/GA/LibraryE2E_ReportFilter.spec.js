import { customCredentials } from '../../../constants/index.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import setWindowSize from '../../../config/setWindowSize.js';
import resetReportState from '../../../api/reports/resetReportState.js';

const specConfiguration = { ...customCredentials('_reportFilter') };
const browserWindow = {
    browserInstance: browsers.browser1,
    width: 1600,
    height: 1200,
};

describe('E2E Library Report', () => {
    const tutorialProject = {
        id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
        name: 'MicroStrategy Tutorial',
    };
    const reportViewFilter = {
        id: '6E3051144DB88BFE219943B612D06B17',
        name: '(AUTO) ReportFilter_E2E_ViewFilter',
        project: tutorialProject,
    };
    const reportFilterSummary = {
        id: '3CFE73EB4C7758DFB28E8EA64A9C9017',
        name: '(AUTO) ReportFilter_E2E_FilterSummary',
        project: tutorialProject,
    };

    const { credentials } = specConfiguration;

    let {
        loginPage,
        dossierPage,
        libraryPage,
        reportSummary,
        promptEditor,
        reportFilter,
        attributeFilter,
        metricFilter,
        setFilter,
        reportPage,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(specConfiguration.credentials);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC85477] E2E - Report filter - add attribute filter', async () => {
        await resetReportState({
            credentials: credentials,
            report: reportViewFilter,
        });
        await libraryPage.openDossier(reportViewFilter.name);
        await reportPage.waitForReportLoading();
        await reportFilter.open();

        // add attribute element filter
        await attributeFilter.create();
        // await attributeFilter.clickBasedOn();
        await attributeFilter.selectBasedOnObject('Category');
        await attributeFilter.selectAttributeElements(['Books:images/demo/s1.png']);
        await since('search and select, Element "Books" checked should be "#{expected}" instead it is "#{actual}"')
            .expect(await attributeFilter.attributeElementChecked('Books:images/demo/s1.png'))
            .toBe(true);
        await attributeFilter.toggleViewSelected();
        await since('select in view, element list count should be "#{expected}", instead it is "#{actual}"')
            .expect(await attributeFilter.getElementListCount())
            .toBe(1);
        await since(
            'select in view,toggle view selected, view selected On should be "#{expected}", instead it is "#{actual}"'
        )
            .expect(await attributeFilter.isViewSelectedOn())
            .toBe(true);
        await takeScreenshotByElement(attributeFilter.getDetailedPanel(), 'TC85477', 'ReportFilter_ViewSelected');
        await attributeFilter.done();
        if (libraryPage.isSafari()) {
            await since('select done, report filter summary should be "#{expected}", instead it is "#{actual}"')
                .expect(
                    await reportFilter.filterSummaryText({ expType: 'Attribute Qualification', objectName: 'Category' })
                )
                .toBe('CategoryBooks:images/demo/s1.png');
        } else {
            await since('select done, report filter summary should be "#{expected}", instead it is "#{actual}"')
                .expect(
                    await reportFilter.filterSummaryText({ expType: 'Attribute Qualification', objectName: 'Category' })
                )
                .toBe('Category,Books:images/demo/s1.png');
        }
        // re-open filter panel to check
        await reportFilter.apply();
        await reportFilter.open();
        if (libraryPage.isSafari()) {
            await since('re-open, report filter summary should be "#{expected}", instead it is "#{actual}"')
                .expect(
                    await reportFilter.filterSummaryText({ expType: 'Attribute Qualification', objectName: 'Category' })
                )
                .toBe('CategoryBooks:images/demo/s1.png');
        } else {
            await since('re-open, report filter summary should be "#{expected}", instead it is "#{actual}"')
                .expect(
                    await reportFilter.filterSummaryText({ expType: 'Attribute Qualification', objectName: 'Category' })
                )
                .toBe('Category,Books:images/demo/s1.png');
        }

        await reportFilter.close();
    });

    it('[TC85514] E2E - Report filter - add metric filter', async () => {
        await resetReportState({
            credentials: credentials,
            report: reportViewFilter,
        });
        await libraryPage.openDossier(reportViewFilter.name);
        await reportPage.waitForReportLoading();
        await reportFilter.open();

        // add metric filter
        await metricFilter.create();
        // await metricFilter.clickBasedOn();
        await metricFilter.selectBasedOnObject('Profit');
        // change operator
        await metricFilter.openSelector('Operator');
        await since('change operator, the operators count should be "#{expected}", instead it is "#{actual}"')
            .expect(await metricFilter.getOptionItemsCount())
            .toBe(10);
        await metricFilter.selectOption('Greater than');
        await metricFilter.enterValue('100');
        await since(
            'function by metric value, after enter value, doneButton enable should be "#{actual}" instead it is "#{expected}"'
        )
            .expect(await metricFilter.doneButtonEnabled())
            .toBe(true);
        await takeScreenshotByElement(reportFilter.getDetailedPanel(), 'TC85514', 'ReportFilter_MetricValue');

        // done
        await metricFilter.done();
        if (libraryPage.isSafari()) {
            await since('function by metric value, report filter should be "#{expected}", instead it is "#{actual}"')
                .expect(await reportFilter.filterSummaryText({ expType: 'Metric Qualification', objectName: 'Profit' }))
                .toBe('ProfitOperatorGreater,than');
        } else {
            await since('function by metric value, report filter should be "#{expected}", instead it is "#{actual}"')
                .expect(await reportFilter.filterSummaryText({ expType: 'Metric Qualification', objectName: 'Profit' }))
                .toBe('Profit,Greater,than');
        }

        // re-open
        await reportFilter.apply();
        await reportFilter.open();
        if (libraryPage.isSafari()) {
            await since(
                'function by metric value, re-open, report filter should contain "#{expected}", instead it is "#{actual}"'
            )
                .expect(await reportFilter.filterSummaryText({ expType: 'Metric Qualification', objectName: 'Profit' }))
                .toBe('ProfitOperatorGreater,than');
        } else {
            await since(
                'function by metric value, re-open, report filter should contain "#{expected}", instead it is "#{actual}"'
            )
                .expect(await reportFilter.filterSummaryText({ expType: 'Metric Qualification', objectName: 'Profit' }))
                .toBe('Profit,Greater,than');
        }
        await takeScreenshotByElement(reportFilter.getMainPanel(), 'TC85514', 'ReportFilter_Main');

        await reportFilter.close();
    });

    it('[TC85566] E2E - Report filter - add set filter', async () => {
        await resetReportState({
            credentials: credentials,
            report: reportViewFilter,
        });
        await libraryPage.openDossier(reportViewFilter.name);
        await reportPage.waitForReportLoading();
        await reportFilter.open();

        // set filter
        await reportFilter.selectExpressionContextMenu({ expType: 'Attribute Qualification', objectName: 'Year' });
        await reportFilter.selectContextMenuOption('Create a Set');
        // await setFilter.openSet({ objectName: 'Year', text: '...' });
        await since('related by system default, related by value should be "#{expected}", instead it is "#{actual}"')
            .expect(await setFilter.getSelectedRelatedBy())
            .toBe('System Default');
        await takeScreenshotByElement(setFilter.getSetPopover(), 'TC85566', 'ReportFilter_Set');

        // set of
        await setFilter.openSelector('Set of');
        await since('related by system default, the set of count should be "#{expected}", instead it is "#{actual}"')
            .expect(await setFilter.getOptionItemsCount())
            .toBe(3);
        await setFilter.selectOptions(['Category', 'Region']);
        await since('related by system default, set of value should be "#{expected}", instead it is "#{actual}"')
            .expect(await setFilter.getSelectedSetOf())
            .toBe('Category,Region');
        await setFilter.closeSelector('Set of');
        await setFilter.closeSet(); // to close set window

        // re-open to check
        await reportFilter.apply();
        await reportFilter.open();
        await since('re-open, report filter should be "#{expected}", instead it is "#{actual}"')
            .expect(await setFilter.getSetText({ objectName: 'Year' }))
            .toBe('Category, Region');

        await reportFilter.close();
    });

    it('[TC85562] E2E - Report filter - edit view filter', async () => {
        await resetReportState({
            credentials: credentials,
            report: reportViewFilter,
        });
        await libraryPage.openDossier(reportViewFilter.name);
        await reportPage.waitForReportLoading();
        await reportFilter.open();

        // edit view filter by secondary panel
        await reportFilter.selectExpression({ expType: 'Attribute Qualification', objectName: 'Year' });
        await attributeFilter.selectOperator();
        await attributeFilter.selectAttributeFormOperator('Less than or equal to');
        await since(
            'edit attribute filter, change operator, the selected operator by deafult should be "#{expected}", instead it is "#{actual}"'
        )
            .expect(await attributeFilter.getSelectedOperator())
            .toBe('Less than or equal to');
        await attributeFilter.enterValue('1000');
        await attributeFilter.done();
        if (libraryPage.isSafari()) {
            await since('edit attribute filter, done, report filter should be "#{expected}", instead it is "#{actual}"')
                .expect(
                    await reportFilter.filterSummaryText({ expType: 'Attribute Qualification', objectName: 'Region' })
                )
                .toBe('RegionCentralWeb');
        } else {
            await since('edit attribute filter, done, report filter should be "#{expected}", instead it is "#{actual}"')
                .expect(
                    await reportFilter.filterSummaryText({ expType: 'Attribute Qualification', objectName: 'Region' })
                )
                .toBe('Region,Central,Web');
        }

        // inline edit view filter to delete element
        await reportFilter.inlineDeleteElement({ expType: 'Attribute Qualification', objectName: 'Region' });
        if (libraryPage.isSafari()) {
            await since('delete element, report filter should be "#{expected}", instead it is "#{actual}"')
                .expect(
                    await reportFilter.filterSummaryText({ expType: 'Attribute Qualification', objectName: 'Region' })
                )
                .toBe('RegionWeb');
        } else {
            await since('delete element, report filter should be "#{expected}", instead it is "#{actual}"')
                .expect(
                    await reportFilter.filterSummaryText({ expType: 'Attribute Qualification', objectName: 'Region' })
                )
                .toBe('Region,Web');
        }
        // reopen and check
        await reportFilter.apply();
        await reportPage.waitForReportLoading();
        await reportSummary.viewAll();
        await since('open filter summary, Year ID value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getViewFilterRowValue('Year ID'))
            .toBe('Less than or equal to 1000');
        await since('open filter summary, Region value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getViewFilterRowValue('Region'))
            .toBe('In List Web');
        await since('open filter summary, Cost value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getViewFilterRowValue('Cost'))
            .toBe('Greater than or equal to 1000');
    });

    it('[TC85559] E2E - Report filter - delete view filter', async () => {
        await resetReportState({
            credentials: credentials,
            report: reportViewFilter,
        });
        await libraryPage.openDossier(reportViewFilter.name);
        await reportPage.waitForReportLoading();
        await reportFilter.open();

        await since('Initially, view filter count should be "#{expected}" instead there are "#{actual}"')
            .expect(await reportFilter.getViewFilterCount())
            .toBe(2);

        // delete one filter
        await reportFilter.selectExpressionContextMenu({ expType: 'Attribute Qualification', objectName: 'Region' });
        await reportFilter.selectContextMenuOption('Delete');
        await since('delete attribute filter, view filter count should be "#{expected}" instead there are "#{actual}"')
            .expect(await reportFilter.getViewFilterCount())
            .toBe(1);

        // remove all filter
        await reportFilter.clickSettingIcon();
        await reportFilter.selectSetting('Remove All Filters');
        await since('remove all filter, view filter count should be "#{expected}" instead there are "#{actual}"')
            .expect(await reportFilter.getViewFilterCount())
            .toBe(0);

        // re-open filter panel to check
        await reportFilter.apply();
        await reportFilter.open();
        await since('re-open, view filter count should be "#{expected}" instead there are "#{actual}"')
            .expect(await reportFilter.getViewFilterCount())
            .toBe(0);
        await takeScreenshotByElement(reportFilter.getMainPanel(), 'TC85559', 'ReportFilter_removeAll');
        await reportFilter.close();
    });

    it('[TC85558] E2E - Report filter - filter summary for prompts, drill, report filter, and view filter', async () => {
        await resetReportState({
            credentials: credentials,
            report: reportFilterSummary,
        });
        await libraryPage.openDossierNoWait(reportFilterSummary.name);
        await promptEditor.waitForEditor();
        await promptEditor.run();
        await reportPage.waitForReportLoading();

        await reportSummary.viewAll();

        // check prompt filter
        await since('Report filters, Country value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getReportFilterRowValue('Country'))
            .toBe('In List USA, Spain');

        // check report filter
        await since('Report filters, Revenue value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getReportFilterRowValue('Revenue'))
            .toBe('Between 100 and 100000');
        await since('Report filters, Category value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getReportFilterRowValue('Category'))
            .toBe('In List Books, Music');

        // check view filter
        await since('Report filters, Cost value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getViewFilterRowValue('Cost'))
            .toBe('Greater than or equal to 100');
        await since('Report filters, Year value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getViewFilterRowValue('Year'))
            .toBe('In List 2014, 2015');

        // edit view filter
        await reportSummary.edit({ name: 'Year', isSetFilter: true });
        await since(
            'X-func with filter summary, edit Set, filter panel present is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportFilter.isMainPanelPresent())
            .toBe(true);
        await reportFilter.close();
    });
});
export const config = specConfiguration;
