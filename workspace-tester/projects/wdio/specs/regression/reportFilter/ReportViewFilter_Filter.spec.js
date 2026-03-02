import { customCredentials } from '../../../constants/index.js';
import resetReportState from '../../../api/reports/resetReportState.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_reportFilter') };

describe('Library Report View Filter - Filters', () => {
    const tutorialProject = {
        id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
        name: 'MicroStrategy Tutorial',
    };
    const report1Filter = {
        id: '482043D0420A53EB8DDA5B9B4E6371A0',
        name: '(AUTO) ReportFilter_ViewFilter_1Filter',
        project: tutorialProject,
    };
    const report2Filter = {
        id: '2ACA08F541F4DB52C2B54AAC87146BB2',
        name: '(AUTO) ReportFilter_ViewFilter_2Filter',
        project: tutorialProject,
    };
    const reportAttribute = {
        id: 'F9308BF44132E3769827C7929E68A7A7',
        name: '(AUTO) Report_ViewFilter_Attribute',
        project: tutorialProject,
    };
    const reportMetric = {
        id: 'B8DE8C624499EA8A503AB498A4F47BAE',
        name: '(AUTO) Report_ViewFilter_Metric',
        project: tutorialProject,
    };
    const reportSet = {
        id: 'F15486654AFCC99F7A0FAA80025AF0F9',
        name: '(AUTO) Report_ViewFilter_Set',
        project: tutorialProject,
    };
    const reportI18NAtt = {
        id: '9FE1D9E240AE01280CED20B4FD5FDC6D',
        name: '(AUTO) Report_ViewFilter_I18N_Attribute',
        project: tutorialProject,
    };
    const reportI18NMetric = {
        id: '80BE604345F5ED9900461C87C19027B3',
        name: '(AUTO) Report_ViewFilter_I18N_Metric',
        project: tutorialProject,
    };

    const { credentials } = specConfiguration;

    let {
        dossierPage,
        libraryPage,
        reportFilter,
        attributeFilter,
        metricFilter,
        setFilter,
        reportPage,
        userAccount,
        loginPage,
    } = browsers.pageObj1;

    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1200,
    };

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        await dossierPage.reload();
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC87516] Report filter - attribute filter - qualify on elements: search and select', async () => {
        await resetReportState({
            credentials: credentials,
            report: report1Filter,
        });
        await libraryPage.openDossier(report1Filter.name);
        await reportPage.waitForReportLoading();
        await reportFilter.open();
        await attributeFilter.create();
        await takeScreenshotByElement(attributeFilter.getDetailedPanel(), 'TC87516', 'ReportFilter_ElementList_New');

        // await attributeFilter.clickBasedOn();
        await attributeFilter.selectBasedOnObject('Category');
        await since('before search, element list count should be "#{expected}", instead it is "#{actual}"')
            .expect(await attributeFilter.getElementListCount())
            .toBe(4);
        await takeScreenshotByElement(attributeFilter.getDetailedPanel(), 'TC87516', 'ReportFilter_ElementList_Base');

        // search but no results
        await attributeFilter.attributeSearch('bat');
        await since('search with no results, result text should be "#{expected}", instead it is "#{actual}"')
            .expect(await attributeFilter.searchLoadingText())
            .toBe('No elements matching bat.');
        await takeScreenshotByElement(
            attributeFilter.getDetailedPanel(),
            'TC87516',
            'ReportFilter_ElementList_Search_NoResults'
        );
        await since(
            'search with no results, view selected button enable is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await attributeFilter.viewSelectedButtnEnabled())
            .toBe(false);
        await attributeFilter.clearAttributeSearch();
        await since('clear search, search box should be "#{expected}", instead it is "#{actual}"')
            .expect(await attributeFilter.searchText())
            .toBe('');
        await since('clear search, element list count should be "#{expected}", instead it is "#{actual}"')
            .expect(await attributeFilter.getElementListCount())
            .toBe(4);

        // search and select
        await attributeFilter.attributeSearch('m');
        await since('after search, element list count should be "#{expected}", instead it is "#{actual}"')
            .expect(await attributeFilter.getElementListCount())
            .toBe(2);
        await since('before select, Done button enable is supposed to be #{expected}, instead we have #{actual}')
            .expect(await attributeFilter.doneButtonEnabled())
            .toBe(false);
        await attributeFilter.selectAttributeElement('Movies:images/demo/s3.png');
        await since('after select, Done button enable is supposed to be #{expected}, instead we have #{actual}')
            .expect(await attributeFilter.doneButtonEnabled())
            .toBe(true);

        // view selected
        await attributeFilter.toggleViewSelected();
        await since('select in view, element list count should be "#{expected}", instead it is "#{actual}"')
            .expect(await attributeFilter.getElementListCount())
            .toBe(1);
        await takeScreenshotByElement(
            attributeFilter.getDetailedPanel(),
            'TC87516',
            'ReportFilter_ElementList_ViewSelected'
        );

        await attributeFilter.cancel();
        await reportFilter.close();
    });

    it('[TC87517] Report filter - attribute filter - qualify on elements: select in view, clear all', async () => {
        await resetReportState({
            credentials: credentials,
            report: report1Filter,
        });
        await libraryPage.openDossier(report1Filter.name);
        await reportPage.waitForReportLoading();
        await reportFilter.open();
        await attributeFilter.create();
        // await attributeFilter.clickBasedOn();

        await attributeFilter.selectBasedOnObject('Subcategory');
        await since('before search, element list count should be "#{expected}", instead it is "#{actual}"')
            .expect(await attributeFilter.getElementListCount())
            .toBe(8);

        // select in view without scrolldown
        await attributeFilter.selectInView();
        await since('select in view, Done button enable is supposed to be #{expected}, instead we have #{actual}')
            .expect(await attributeFilter.doneButtonEnabled())
            .toBe(true);
        await attributeFilter.toggleViewSelected();
        await since('select in view, element list count should be "#{expected}", instead it is "#{actual}"')
            .expect(await attributeFilter.getElementListCount())
            .toBe(5);
        await since(
            'select in view,toggle view selected, view selected On should be "#{expected}", instead it is "#{actual}"'
        )
            .expect(await attributeFilter.isViewSelectedOn())
            .toBe(true);
        await attributeFilter.toggleViewSelected();

        // select in view again when scroll down to bottm
        await attributeFilter.scrollListToBottom();
        await attributeFilter.selectInView();
        await attributeFilter.toggleViewSelected();
        await since(
            'scrolldown and select in view aagain, element list count should be "#{expected}", instead it is "#{actual}"'
        )
            .expect(await attributeFilter.getElementListCount())
            .toBeGreaterThan(5);
        await takeScreenshotByElement(attributeFilter.getDetailedPanel(), 'TC87517', 'ReportFilter_ElementList_Scroll');

        // clear all
        await attributeFilter.clearAll();
        await since('clear all, view selected On should be "#{expected}", instead it is "#{actual}"')
            .expect(await attributeFilter.isViewSelectedOn())
            .toBe(false);
        await since('clear all, Done button enable is supposed to be #{expected}, instead we have #{actual}')
            .expect(await attributeFilter.doneButtonEnabled())
            .toBe(false);

        await attributeFilter.cancel();
        await reportFilter.close();
    });

    it('[TC87518] Report filter - attribute filter - qualify on elements: In list', async () => {
        await resetReportState({
            credentials: credentials,
            report: report1Filter,
        });
        await libraryPage.openDossier(report1Filter.name);
        await reportPage.waitForReportLoading();
        await reportFilter.open();
        await attributeFilter.create();
        // await attributeFilter.clickBasedOn();
        await attributeFilter.selectBasedOnObject('Region');

        // select element directly
        await since('In list, By defualt in list selected is supposed to be #{expected}, instead we have #{actual}')
            .expect(await attributeFilter.isAttributeListOperatorSelected('In list'))
            .toBe(true);
        await attributeFilter.selectAttributeElements(['Central', 'Northeast', 'Northwest']);
        await attributeFilter.toggleViewSelected();
        await since('In list, element list count should be "#{expected}", instead it is "#{actual}"')
            .expect(await attributeFilter.getElementListCount())
            .toBe(3);

        // done
        await attributeFilter.done();
        await since('In list, after done, report filter summary should be "#{expected}", instead it is "#{actual}"')
            .expect(await reportFilter.filterSummaryText({ expType: 'Attribute Qualification', objectName: 'Region' }))
            .toBe('Region,Central,Northeast,Northwest');

        // apply and re-open to check
        await reportFilter.apply();
        await reportFilter.open();
        await since(
            'In list, apply and reopen, report filter summary should be "#{expected}", instead it is "#{actual}"'
        )
            .expect(await reportFilter.filterSummaryText({ expType: 'Attribute Qualification', objectName: 'Region' }))
            .toBe('Region,Central,Northeast,Northwest');

        await reportFilter.close();
    });

    it('[TC87519] Report filter - attribute filter - qualify on elements: Not In list', async () => {
        await resetReportState({
            credentials: credentials,
            report: report1Filter,
        });
        await libraryPage.openDossier(report1Filter.name);
        await reportPage.waitForReportLoading();
        await reportFilter.open();
        await attributeFilter.create();
        // await attributeFilter.clickBasedOn();
        await attributeFilter.selectBasedOnObject('Region');

        // select elements
        await attributeFilter.selectAttributeListOperator('Not in list');
        await since('Not In list, not in list selected is supposed to be #{expected}, instead we have #{actual}')
            .expect(await attributeFilter.isAttributeListOperatorSelected('Not in list'))
            .toBe(true);
        await attributeFilter.selectAttributeElements(['Central', 'Northeast', 'Northwest']);
        await takeScreenshotByElement(
            attributeFilter.getDetailedPanel(),
            'TC87519',
            'ReportFilter_ElementList_NotInList1'
        );
        await attributeFilter.toggleViewSelected();
        await since('Not In list, element list count should be "#{expected}", instead it is "#{actual}"')
            .expect(await attributeFilter.getElementListCount())
            .toBe(3);

        // done
        await attributeFilter.done();
        await since('Not In list, after done, report filter summary should be "#{expected}", instead it is "#{actual}"')
            .expect(await reportFilter.filterSummaryText({ expType: 'Attribute Qualification', objectName: 'Region' }))
            .toBe('Region,Central,Northeast,Northwest');

        // apply and re-open to check
        await reportFilter.apply();
        await reportFilter.open();
        await since(
            'Not In list,apply and reopen, report filter summary should be "#{expected}", instead it is "#{actual}"'
        )
            .expect(await reportFilter.filterSummaryText({ expType: 'Attribute Qualification', objectName: 'Region' }))
            .toBe('Region,Central,Northeast,Northwest');
        await takeScreenshotByElement(reportFilter.getMainPanel(), 'TC87519', 'ReportFilter_ElementList_NotInList2');

        await reportFilter.close();
    });

    it('[TC87521] Report filter - attribute filter - qualify on attribute form', async () => {
        await resetReportState({
            credentials: credentials,
            report: report1Filter,
        });
        await libraryPage.openDossier(report1Filter.name);
        await reportPage.waitForReportLoading();
        await reportFilter.open();
        await attributeFilter.create();
        // await attributeFilter.clickBasedOn();
        await attributeFilter.selectBasedOnObject('Category');

        // select attribute form - ID
        await since('By default, the default qualify on element should be "#{expected}", instead it is "#{actual}"')
            .expect(await attributeFilter.getSelectedForm())
            .toBe('Elements');
        await attributeFilter.clickQualifyOn();
        await since(
            'Select attribute form, the attribute form count should be "#{expected}", instead it is "#{actual}"'
        )
            .expect(await attributeFilter.getAttributeOptionCount())
            .toBe(3);
        await attributeFilter.selectAttributeFormOption('Image');
        await since(
            'Select attribute form, the selected qualify on element should be "#{expected}", instead it is "#{actual}"'
        )
            .expect(await attributeFilter.getSelectedForm())
            .toBe('Image');
        await attributeFilter.enterValue('/tbd');
        await takeScreenshotByElement(reportFilter.getDetailedPanel(), 'TC87521', 'ReportFilter_AttributeForm_Details');
        await attributeFilter.done();
        await since('Select attribute form, report filter should be "#{expected}", instead it is "#{actual}"')
            .expect(
                await reportFilter.filterSummaryText({ expType: 'Attribute Qualification', objectName: 'Category' })
            )
            .toBe('Category@,Image,Equals');

        // change attribut form
        await reportFilter.selectExpression({ expType: 'Attribute Qualification', objectName: 'Category' });
        await attributeFilter.clickQualifyOn();
        await attributeFilter.selectAttributeFormOption('DESC');
        await since(
            'Change attribute form, the selected qualify on element should be "#{expected}", instead it is "#{actual}"'
        )
            .expect(await attributeFilter.getSelectedForm())
            .toBe('DESC');

        // change operators
        await attributeFilter.selectOperator();
        await since(
            'change operator, the operators count should be greater than "#{expected}", instead it is "#{actual}"'
        )
            .expect(await attributeFilter.getAttributeOptionCount())
            .toBeGreaterThan(20);
        await attributeFilter.selectAttributeFormOperator('Greater than');
        await since('Chnage operator, the selected operator should be "#{expected}", instead it is "#{actual}"')
            .expect(await attributeFilter.getSelectedOperator())
            .toBe('Greater than');
        await attributeFilter.enterValue('/tbd');

        // apply and re-open to check
        await reportFilter.apply();
        await reportFilter.open();
        await since('Change form and operator, report filter should be "#{expected}", instead it is "#{actual}"')
            .expect(
                await reportFilter.filterSummaryText({ expType: 'Attribute Qualification', objectName: 'Category' })
            )
            .toBe('Category@,DESC,Greater,than');

        await reportFilter.close();
    });

    it('[TC87613] Report filter - metric filter - function by metric value', async () => {
        await resetReportState({
            credentials: credentials,
            report: report1Filter,
        });
        await libraryPage.openDossier(report1Filter.name);
        await reportPage.waitForReportLoading();
        await reportFilter.open();
        await metricFilter.create();
        // await metricFilter.clickBasedOn();
        await metricFilter.selectBasedOnObject('Profit');

        // Function by metric value
        await since(
            'function by metric value, the default funciton by value should be "#{expected}", instead it is "#{actual}"'
        )
            .expect(await metricFilter.getSelectedFunction())
            .toBe('Metric Value');
        await since(
            'function by metric value, the default operator value should be "#{expected}", instead it is "#{actual}"'
        )
            .expect(await metricFilter.getSelectedOperator())
            .toBe('Equals');
        await since(
            'function by metric value, before enter value, doneButton enable should be "#{actual}" instead it is "#{expected}"'
        )
            .expect(await metricFilter.doneButtonEnabled())
            .toBe(false);

        // change operator
        await metricFilter.openSelector('Operator');
        await since('change operator, the operators count should be "#{expected}", instead it is "#{actual}"')
            .expect(await metricFilter.getOptionItemsCount())
            .toBe(10);
        await metricFilter.selectOption('Does not equal');
        await metricFilter.enterValue('100');
        await since(
            'function by metric value, after enter value, doneButton enable should be "#{actual}" instead it is "#{expected}"'
        )
            .expect(await metricFilter.doneButtonEnabled())
            .toBe(true);
        await takeScreenshotByElement(reportFilter.getDetailedPanel(), 'TC87613', 'ReportFilter_MetricValue_Details');

        // apply
        await metricFilter.done();
        await since('function by metric value, report filter should be "#{expected}", instead it is "#{actual}"')
            .expect(await reportFilter.filterSummaryText({ expType: 'Metric Qualification', objectName: 'Profit' }))
            .toBe('Profit,Does,not,equal');
        await reportFilter.apply();
        await reportFilter.open();
        await since(
            'function by metric value, re-open, report filter should be "#{expected}", instead it is "#{actual}"'
        )
            .expect(await reportFilter.filterSummaryText({ expType: 'Metric Qualification', objectName: 'Profit' }))
            .toBe('Profit,Does,not,equal');
        await takeScreenshotByElement(reportFilter.getMainPanel(), 'TC87613', 'ReportFilter_MetricValue_Main');

        await reportFilter.close();
    });

    it('[TC87614] Report filter - metric filter - function by rank', async () => {
        await resetReportState({
            credentials: credentials,
            report: report1Filter,
        });
        await libraryPage.openDossier(report1Filter.name);
        await reportPage.waitForReportLoading();
        await reportFilter.open();
        await metricFilter.create();
        // await metricFilter.clickBasedOn();
        await metricFilter.selectBasedOnObject('Profit');

        // function by rank
        await metricFilter.openSelector('Function');
        await since('function by rank, the Function count should be "#{expected}", instead it is "#{actual}"')
            .expect(await metricFilter.getOptionItemsCount())
            .toBe(3);
        await takeScreenshotByElement(reportFilter.getDetailedPanel(), 'TC87614', 'ReportFilter_MetricValue_Details');
        await metricFilter.selectOption('Rank');
        await since('function by rank, the default operator value should be "#{expected}", instead it is "#{actual}"')
            .expect(await metricFilter.getSelectedOperator())
            .toBe('Exactly');

        // break by
        await metricFilter.openSelector('Break By');
        await since('function by rank, the Break by count should be "#{expected}", instead it is "#{actual}"')
            .expect(await metricFilter.getOptionItemsCount())
            .toBe(6);
        await metricFilter.selectOptions(['Category', 'Quarter']);
        await metricFilter.closeSelector('Break By');
        await since('break by rank, the default operator value should be "#{expected}", instead it is "#{actual}"')
            .expect(await metricFilter.getSelectedBreakBy())
            .toBe('Category,Quarter,');
        // enter value
        await metricFilter.enterValue('100');

        // apply
        await metricFilter.done();
        await since('function by rank, report filter should be "#{expected}", instead it is "#{actual}"')
            .expect(await reportFilter.filterSummaryText({ expType: 'Metric Qualification', objectName: 'Profit' }))
            .toBe('Profit,Exactly');
        await reportFilter.apply();
        await reportFilter.open();
        await since('function by rank, re-open, report filter should be "#{expected}", instead it is "#{actual}"')
            .expect(await reportFilter.filterSummaryText({ expType: 'Metric Qualification', objectName: 'Profit' }))
            .toBe('Profit,Exactly');
        await takeScreenshotByElement(reportFilter.getMainPanel(), 'TC87614', 'ReportFilter_MetricValue_Main');

        await reportFilter.close();
    });

    it('[TC87615] Report filter - metric filter - function by percentage', async () => {
        await resetReportState({
            credentials: credentials,
            report: report1Filter,
        });
        await libraryPage.openDossier(report1Filter.name);
        await reportPage.waitForReportLoading();
        await reportFilter.open();
        await metricFilter.create();
        // await metricFilter.clickBasedOn();
        await metricFilter.selectBasedOnObject('Profit');

        // function by percentage
        await metricFilter.openSelector('Function');
        await takeScreenshotByElement(
            metricFilter.getOpenedSelectionList(),
            'TC87615',
            'ReportFilter_Percentage_Function'
        );
        await metricFilter.selectOption('Percentage');
        await since(
            'function by percentage, the default operator value should be "#{expected}", instead it is "#{actual}"'
        )
            .expect(await metricFilter.getSelectedOperator())
            .toBe('Exactly');

        // operator
        await metricFilter.openSelector('Operator');
        await since('cfunction by rank,  the operators count should be "#{expected}", instead it is "#{actual}"')
            .expect(await metricFilter.getOptionItemsCount())
            .toBe(10);
        await metricFilter.selectOption('Top');

        // break by
        await metricFilter.openSelector('Break By');
        await since('function by percentage, the Break by count should be "#{expected}", instead it is "#{actual}"')
            .expect(await metricFilter.getOptionItemsCount())
            .toBe(6);
        await metricFilter.selectOption('Category');
        await metricFilter.closeSelector('Break By');
        await since('function by percentage, break by value should be "#{expected}", instead it is "#{actual}"')
            .expect(await metricFilter.getSelectedBreakBy())
            .toBe('Category,');
        // enter value
        await metricFilter.enterValue('50');
        await takeScreenshotByElement(reportFilter.getDetailedPanel(), 'TC87615', 'ReportFilter_Percentage_Details');

        // apply
        await metricFilter.done();
        await since('function by percentage, report filter should be "#{expected}", instead it is "#{actual}"')
            .expect(await reportFilter.filterSummaryText({ expType: 'Metric Qualification', objectName: 'Profit' }))
            .toBe('Profit,Top,%');
        await reportFilter.apply();
        await reportFilter.open();
        await since('function by percentage, re-open, report filter should be "#{expected}", instead it is "#{actual}"')
            .expect(await reportFilter.filterSummaryText({ expType: 'Metric Qualification', objectName: 'Profit' }))
            .toBe('Profit,Top,%');
        await takeScreenshotByElement(reportFilter.getMainPanel(), 'TC87615', 'ReportFilter_Percentage_Main');

        await reportFilter.close();
    });

    it('[TC87624] Report filter - set filter - related by system default', async () => {
        await resetReportState({
            credentials: credentials,
            report: report2Filter,
        });
        await libraryPage.openDossier(report2Filter.name);
        await reportPage.waitForReportLoading();
        await reportFilter.open();

        // set filter
        await reportFilter.selectExpressionContextMenu({ expType: 'Attribute Qualification', objectName: 'Category' });
        await reportFilter.selectContextMenuOption('Create a Set');
        // await setFilter.openSet({ objectName: 'Category', text: '...', index: 1 });
        await since('related by system default, related by value should be "#{expected}", instead it is "#{actual}"')
            .expect(await setFilter.getSelectedRelatedBy())
            .toBe('System Default');
        await takeScreenshotByElement(setFilter.getSetPopover(), 'TC87624', 'ReportFilter_Set_Initial');

        // set of
        await setFilter.openSelector('Set of');
        await since('related by system default, the set of count should be "#{expected}", instead it is "#{actual}"')
            .expect(await setFilter.getOptionItemsCount())
            .toBe(6);
        await setFilter.selectOptions(['Region', 'Quarter']);
        await takeScreenshotByElement(setFilter.getOpenedSelectionList(), 'TC87624', 'ReportFilter_Set_SetOf');
        await since('related by system default, set of value should be "#{expected}", instead it is "#{actual}"')
            .expect(await setFilter.getSelectedSetOf())
            .toBe('Region,Quarter');
        await setFilter.closeSelector('Set of');

        // re-open to check
        await setFilter.clickFilterHeader();
        await reportFilter.apply();
        await reportFilter.open();
        await since('re-open, report filter should be "#{expected}", instead it is "#{actual}"')
            .expect(await setFilter.getSetText({ objectName: 'Category', index: 1 }))
            .toBe('Region, Quarter');
        await takeScreenshotByElement(reportFilter.getMainPanel(), 'TC87624', 'ReportFilter_Set_Main');

        await reportFilter.close();
    });

    it('[TC87625] Report filter - set filter - set filter when related by metric', async () => {
        await resetReportState({
            credentials: credentials,
            report: report2Filter,
        });
        await libraryPage.openDossier(report2Filter.name);
        await reportPage.waitForReportLoading();
        await reportFilter.open();

        // set filter
        await reportFilter.selectExpressionContextMenu({ expType: 'Metric Qualification', objectName: 'Cost' });
        await reportFilter.selectContextMenuOption('Create a Set');
        // await setFilter.openSet({ objectName: 'Cost', text: '...' });

        // set of
        await setFilter.openSelector('Set of');
        await setFilter.selectOption('Region');
        await since('related by metric, set of value should be “#{expected}", instead it is "#{actual}"')
            .expect(await setFilter.getSelectedSetOf())
            .toBe('Region');
        await setFilter.closeSelector('Set of');

        // related by
        await setFilter.openSelector('Related by');
        await takeScreenshotByElement(setFilter.getOpenedSelectionList(), 'TC87625', 'ReportFilter_Set_RelatedBy');
        await since('related by metric, the related by count should be "#{expected}", instead it is "#{actual}"')
            .expect(await setFilter.getOptionItemsCount())
            .toBe(2);
        await setFilter.selectOption('Select a Metric');
        await since(
            'related by metric, select a metric, related by value should be "#{expected}", instead it is "#{actual}"'
        )
            .expect(await setFilter.getSelectedRelatedBy())
            .toBe('Select an object');
        await takeScreenshotByElement(setFilter.getSetPopover(), 'TC87625', 'ReportFilter_Set_selectAMetric');
        // screenshot
        await setFilter.openSelector('Related by'); // to select a metric
        await since('related by metric, the metric count should be "#{expected}", instead it is "#{actual}"')
            .expect(await setFilter.getOptionItemsCount())
            .toBe(3);
        await setFilter.selectOption('Profit');
        await since('related by metric, related by value should be "#{expected}", instead it is "#{actual}"')
            .expect(await setFilter.getSelectedRelatedBy())
            .toBe('Profit');
        await takeScreenshotByElement(setFilter.getSetPopover(), 'TC87625', 'ReportFilter_Set_Popup');

        // re-open to check
        await setFilter.clickFilterHeader();
        await since('related by metric, re-open, report filter should be "#{expected}", instead it is "#{actual}"')
            .expect(await setFilter.getSetText({ objectName: 'Cost' }))
            .toBe('Year');
        await reportFilter.apply();
    });

    it('[TC87690] Report filter - edit filter - edit attribute filter', async () => {
        await resetReportState({
            credentials: credentials,
            report: reportAttribute,
        });
        await libraryPage.openDossier(reportAttribute.name);
        await reportPage.waitForReportLoading();
        await reportFilter.open();

        // check filters
        await since('edit attribute filter, Region, report filter should be "#{expected}", instead it is "#{actual}"')
            .expect(await reportFilter.filterSummaryText({ expType: 'Attribute Qualification', objectName: 'Region' }))
            .toBe('Region@,DESC,Like');
        await since('edit attribute filter, Brand, report filter should be "#{expected}", instead it is "#{actual}"')
            .expect(await reportFilter.filterSummaryText({ expType: 'Attribute Qualification', objectName: 'Brand' }))
            .toBe('Brand@,DESC,Is,Not,Null');
        await since(
            'edit attribute filter, Category DESC, report filter should be "#{expected}", instead it is "#{actual}"'
        )
            .expect(
                await reportFilter.filterSummaryText({
                    expType: 'Attribute Qualification',
                    objectName: 'Category',
                    index: 1,
                })
            )
            .toBe('Category@,DESC,Equals,Category,(DESC)');
        await since(
            'edit attribute filter, Category ID, report filter should be "#{expected}", instead it is "#{actual}"'
        )
            .expect(
                await reportFilter.filterSummaryText({
                    expType: 'Attribute Qualification',
                    objectName: 'Category',
                    index: 2,
                })
            )
            .toBe('Category@,ID,In,1.0,,2.0,,3.0,,4.0');
        await since(
            'edit attribute filter, Subcategory, report filter should be "#{expected}", instead it is "#{actual}"'
        )
            .expect(
                await reportFilter.filterSummaryText({ expType: 'Attribute Qualification', objectName: 'Subcategory' })
            )
            .toBe('Subcategory@,ID,Between,AND');

        // edit filter
        await reportFilter.selectExpression({ expType: 'Attribute Qualification', objectName: 'Region' });
        await takeScreenshotByElement(reportFilter.getDetailedPanel(), 'TC87690', 'ReportFilter_EditAttrubute_Details');
        await attributeFilter.clickQualifyOn();
        await attributeFilter.selectAttributeFormOption('ID');
        await since(
            'edit attribute filter, the selected qualify on element should be "#{expected}", instead it is "#{actual}"'
        )
            .expect(await attributeFilter.getSelectedForm())
            .toBe('ID');
        await since(
            'edit attribute filter, the selected operator by deafult should be "#{expected}", instead it is "#{actual}"'
        )
            .expect(await attributeFilter.getSelectedOperator())
            .toBe('Equals');
        await attributeFilter.selectOperator();
        await attributeFilter.selectAttributeFormOperator('Less than or equal to');
        await since(
            'edit attribute filter, change operator, the selected operator by deafult should be "#{expected}", instead it is "#{actual}"'
        )
            .expect(await attributeFilter.getSelectedOperator())
            .toBe('Less than or equal to');
        await attributeFilter.enterValue('1000');
        await attributeFilter.done();
        await since('dit attribute filter, done, report filter should be "#{expected}", instead it is "#{actual}"')
            .expect(await reportFilter.filterSummaryText({ expType: 'Attribute Qualification', objectName: 'Region' }))
            .toBe('Region@,ID,Less,than,or,equal,to');

        // reopen and check
        await reportFilter.apply();
        await reportFilter.open();
        await since('dit attribute filter, re-open, report filter should be "#{expected}", instead it is "#{actual}"')
            .expect(await reportFilter.filterSummaryText({ expType: 'Attribute Qualification', objectName: 'Region' }))
            .toBe('Region@,ID,Less,than,or,equal,to');
        await takeScreenshotByElement(reportFilter.getMainPanel(), 'TC87690', 'ReportFilter_Edit_Main');
        await reportFilter.close();
    });

    it('[TC87691] Report filter - edit filter - edit metric filter', async () => {
        await resetReportState({
            credentials: credentials,
            report: reportMetric,
        });
        await libraryPage.openDossier(reportMetric.name);
        await reportPage.waitForReportLoading();
        await reportFilter.open();

        // check filters
        await since('edit metric filter, Cost, report filter should be "#{expected}", instead it is "#{actual}"')
            .expect(await reportFilter.filterSummaryText({ expType: 'Metric Qualification', objectName: 'Cost' }))
            .toBe('Cost,not_in');
        await since('edit metric filter, Revenue, report filter should be "#{expected}", instead it is "#{actual}"')
            .expect(await reportFilter.filterSummaryText({ expType: 'Metric Qualification', objectName: 'Revenue' }))
            .toBe('Revenue,Greater,than,or,equal,to,Average,Revenue');
        await since(
            'edit metric filter, Profit Margin, report filter should be "#{expected}", instead it is "#{actual}"'
        )
            .expect(
                await reportFilter.filterSummaryText({ expType: 'Metric Qualification', objectName: 'Profit Margin' })
            )
            .toBe('Profit,Margin,Between,AND');
        await since('edit metric filter, Profit, report filter should be "#{expected}", instead it is "#{actual}"')
            .expect(await reportFilter.filterSummaryText({ expType: 'Metric Qualification', objectName: 'Profit' }))
            .toBe('Profit,Greater,than');

        // edit filter
        await reportFilter.selectExpression({ expType: 'Metric Qualification', objectName: 'Profit Margin' });
        await takeScreenshotByElement(reportFilter.getDetailedPanel(), 'TC87691', 'ReportFilter_EditMetric_Details');
        await metricFilter.openSelector('Function');
        await metricFilter.selectOption('Rank');
        await since(
            'edit metric filter, the selected funciton by value should be "#{expected}", instead it is "#{actual}"'
        )
            .expect(await metricFilter.getSelectedFunction())
            .toBe('Rank');
        await since('edit metric filter, the operator value should be "#{expected}", instead it is "#{actual}"')
            .expect(await metricFilter.getSelectedOperator())
            .toBe('Between');
        await metricFilter.openSelector('Operator');
        await metricFilter.selectOption('Bottom');
        await since(
            'edit metric filter, change operator, the operator value should be "#{expected}", instead it is "#{actual}"'
        )
            .expect(await metricFilter.getSelectedOperator())
            .toBe('Bottom');
        await metricFilter.openSelector('Break By');
        await metricFilter.selectOptions(['Category', 'Year']);
        await metricFilter.closeSelector('Break By');
        await since('edit metric filter,  the break by value should be "#{expected}", instead it is "#{actual}"')
            .expect(await metricFilter.getSelectedBreakBy())
            .toBe('Category,Year,');
        await metricFilter.enterValue('50');
        // done
        await metricFilter.done();
        await since('edit metric filter, done, report filter should be "#{expected}", instead it is "#{actual}"')
            .expect(
                await reportFilter.filterSummaryText({ expType: 'Metric Qualification', objectName: 'Profit Margin' })
            )
            .toBe('Profit,Margin,Bottom');

        // reopen and check
        await reportFilter.apply();
        await reportFilter.open();
        await since('edit metric filter, re-open, report filter should be "#{expected}", instead it is "#{actual}"')
            .expect(
                await reportFilter.filterSummaryText({ expType: 'Metric Qualification', objectName: 'Profit Margin' })
            )
            .toBe('Profit,Margin,Bottom');
        await takeScreenshotByElement(reportFilter.getMainPanel(), 'TC87691', 'ReportFilter_EditMetric_Main');

        await reportFilter.close();
    });

    it('[TC87692] Report filter - edit filter - edit set filter', async () => {
        await resetReportState({
            credentials: credentials,
            report: reportSet,
        });
        await libraryPage.openDossier(reportSet.name);
        await reportPage.waitForReportLoading();
        await reportFilter.open();

        // check filters
        await since('edit set filter, Category report filter should be "#{expected}", instead it is "#{actual}"')
            .expect(await setFilter.getSetText({ objectName: 'Category' }))
            .toBe('Quarter');
        await since('edit set filter, Profit report filter should be "#{expected}", instead it is "#{actual}"')
            .expect(await setFilter.getSetText({ objectName: 'Profit' }))
            .toBe('Year, Region');

        // edit filter
        await setFilter.openSet({ objectName: 'Category', text: 'Quarter' });
        await takeScreenshotByElement(setFilter.getSetPopover(), 'TC87692', 'ReportFilter_EditSet_Main_Initial');
        await setFilter.openSelector('Set of');
        await setFilter.selectOptions(['Brand', 'Quarter']);
        await since('edit set filter, set of value should be “#{expected}", instead it is "#{actual}"')
            .expect(await setFilter.getSelectedSetOf())
            .toBe('Brand');
        await setFilter.closeSelector('Set of');
        await since('edit set filter, related by value should be "#{expected}", instead it is "#{actual}"')
            .expect(await setFilter.getSelectedRelatedBy())
            .toBe('Profit');
        await setFilter.clickFilterHeader();

        // re-open to check
        await since('related by metric, re-open, report filter should be "#{expected}", instead it is "#{actual}"')
            .expect(await setFilter.getSetText({ objectName: 'Category' }))
            .toBe('Brand');
        await reportFilter.apply();
        await reportFilter.open();
        await since('edit metric filter, re-open, report filter should be "#{expected}", instead it is "#{actual}"')
            .expect(await setFilter.getSetText({ objectName: 'Category' }))
            .toBe('Brand');
        await takeScreenshotByElement(reportFilter.getMainPanel(), 'TC87692', 'ReportFilter_EditSet_Main_apply');

        await reportFilter.close();
    });

    it('[TC87879] Report filter - edit filter - inline edit filter', async () => {
        await resetReportState({
            credentials: credentials,
            report: report2Filter,
        });
        await libraryPage.openDossier(report2Filter.name);
        await reportPage.waitForReportLoading();
        await reportFilter.open();

        // inline edit dropdown and input box
        await reportFilter.inlineChangeOperator({ expType: 'Metric Qualification', objectName: 'Cost' }, 'Less than');
        await reportFilter.inlineEnterValue({ expType: 'Metric Qualification', objectName: 'Cost' }, '800');
        await since('inline edit, report filter should be "#{expected}", instead it is "#{actual}"')
            .expect(await reportFilter.filterSummaryText({ expType: 'Metric Qualification', objectName: 'Cost' }))
            .toBe('Cost,Less,than');

        // delete attribute element
        await reportFilter.inlineDeleteElement({ expType: 'Attribute Qualification', objectName: 'Category' });
        await since('delete element, report filter should be "#{expected}", instead it is "#{actual}"')
            .expect(
                await reportFilter.filterSummaryText({ expType: 'Attribute Qualification', objectName: 'Category' })
            )
            .toBe('Category,Electronics');

        // inline edit aggegration filter
        await reportFilter.inlineEnterValue({ expType: 'Metric Qualification', objectName: 'Profit' }, '800');
        await since('inline edit aggregation filter, report filter should be "#{expected}", instead it is "#{actual}"')
            .expect(await reportFilter.filterSummaryText({ expType: 'Metric Qualification', objectName: 'Profit' }))
            .toBe('Profit,Equals');

        // reopen and check
        await reportFilter.apply();
        await reportFilter.open();
        await since('re-open, report filter Cost should be "#{expected}", instead it is "#{actual}"')
            .expect(await reportFilter.filterSummaryText({ expType: 'Metric Qualification', objectName: 'Cost' }))
            .toBe('Cost,Less,than');
        await since('re-open, report filter Category should be "#{expected}", instead it is "#{actual}"')
            .expect(
                await reportFilter.filterSummaryText({ expType: 'Attribute Qualification', objectName: 'Category' })
            )
            .toBe('Category,Electronics');
        await takeScreenshotByElement(reportFilter.getMainPanel(), 'TC87879', 'ReportFilter_inlineEdit');

        await reportFilter.close();
    });

    it('[TC90698] Report filter - I18N - Attribute', async () => {
        const credentials = customCredentials('_interfaceLanguage').credentials;

        //Logout and login using account nee_au
        await userAccount.openUserAccountMenu();
        await userAccount.logout();
        await loginPage.login(credentials);

        //reset
        await resetReportState({
            credentials: credentials,
            report: reportI18NAtt,
        });

        // check I18N
        await libraryPage.openDossier(reportI18NAtt.name);
        await reportPage.waitForReportLoading();
        await reportFilter.open();
        await since('attribute filter I18N, Region filter should be "#{expected}", instead it is "#{actual}"')
            .expect(await reportFilter.filterSummaryText({ expType: '实体限定条件', objectName: 'Region' }))
            .toBe('Region@,DESC,类似于');
        await since('attribute filter I18N, Brand filter should be "#{expected}", instead it is "#{actual}"')
            .expect(await reportFilter.filterSummaryText({ expType: '实体限定条件', objectName: 'Brand' }))
            .toBe('Brand@,DESC,非空');
        await since('attribute filter I18N, Category filter should be "#{expected}", instead it is "#{actual}"')
            .expect(await reportFilter.filterSummaryText({ expType: '实体限定条件', objectName: 'Category' }))
            .toBe('Category@,ID,在,1.0,,2.0,,3.0,,4.0');
        await since('attribute filter I18N, Subcategory filter should be "#{expected}", instead it is "#{actual}"')
            .expect(await reportFilter.filterSummaryText({ expType: '实体限定条件', objectName: 'Subcategory' }))
            .toBe('Subcategory,Art,&,Architecture,Business');

        await takeScreenshotByElement(reportFilter.getMainPanel(), 'TC90698', 'ReportFilter_I18N_Attribute');
        await reportFilter.close();
    });

    it('[TC90699] Report filter - I18N - Metric', async () => {
        const credentials = customCredentials('_interfaceLanguage').credentials;

        //Logout and login using account nee_au
        await userAccount.openUserAccountMenu();
        await userAccount.logout();
        await loginPage.login(credentials);

        //reset
        await resetReportState({
            credentials: credentials,
            report: reportI18NMetric,
        });

        // check I18N
        await libraryPage.openDossier(reportI18NMetric.name);
        await reportPage.waitForReportLoading();
        await reportFilter.open();
        await since('metric filter I18N, Revenue filter should be "#{expected}", instead it is "#{actual}"')
            .expect(await reportFilter.filterSummaryText({ expType: '度量限定条件', objectName: 'Revenue' }))
            .toBe('Revenue,大于等于,Average,Revenue');
        await since('metric filter I18N, Profit Margin filter should be "#{expected}", instead it is "#{actual}"')
            .expect(await reportFilter.filterSummaryText({ expType: '度量限定条件', objectName: 'Profit Margin' }))
            .toBe('Profit,Margin,介于,%,和,%');
        await since('metric filter I18N, Profit Margin value 1 should be "#{expected}", instead it is "#{actual}"')
            .expect(await reportFilter.filterSummaryBoxValue({ expType: '度量限定条件', objectName: 'Profit Margin' }))
            .toBe('13,33;99,0');
        await since('metric filter I18N, Profit filter value should be "#{expected}", instead it is "#{actual}"')
            .expect(await reportFilter.filterSummaryBoxValue({ expType: '度量限定条件', objectName: 'Profit' }))
            .toBe('188,88');
        await since('metric filter I18N, Cost filter should be "#{expected}", instead it is "#{actual}"')
            .expect(await reportFilter.filterSummaryText({ expType: '度量限定条件', objectName: 'Cost' }))
            .toBe('Cost,not_in');
        await since('metric filter I18N, Cost filter value should be "#{expected}", instead it is "#{actual}"')
            .expect(await reportFilter.filterSummaryBoxValue({ expType: '度量限定条件', objectName: 'Cost' }))
            .toBe('100,200,300');

        await reportFilter.close();
    });
});

export const config = specConfiguration;
