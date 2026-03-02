import resetDossierState from '../../../api/resetDossierState.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import InCanvasSelector from '../../../pageObjects/selector/InCanvasSelector.js';
import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';


const specConfiguration = { ...customCredentials('_tooltip') };
const { credentials } = specConfiguration;
const tutorialProject = {
    id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
    name: 'MicroStrategy Tutorial',
};
const tolerance = 0.2;
const browserWindow = {
    
    width: 1600,
    height: 1200,
};

describe('ShowDescriptionTooltip_OFF_DifferentTemplate', () => {
    const dossierWithOnlyMetric = {
        id: '878C099A41D350B6DBBBE5877B29A569',
        name: '(AUTO) FilterAndICSTooltip_DSWithOnlyMetric_OFF',
        project: tutorialProject,
    };

    const dossierWithOnlyAttribute = {
        id: '116364C344D715B0ABE123BA61970BE1',
        name: '(AUTO) FilterAndICSTooltip_DSWithOnlyAttr_OFF',
        project: tutorialProject,
    };

    const dossierWithAttrAndDashboardParameter = {
        id: 'D8D4BA7647B910E6C0EC4B947D8605D6',
        name: '(AUTO) FilterAndICSTooltip_DSWithAttr+DashboardParameter_OFF',
        project: tutorialProject,
    };

    const dossierWithMetricAndReportParameter = {
        id: '96769FE44DF045CF991E16998E0FD9BD',
        name: '(AUTO) FilterAndICSTooltip_DSWithMetric+ReportParameter_OFF',
        project: tutorialProject,
    };


    let { libraryPage, toc, dossierPage, libraryAuthoringPage, authoringFilters, loginPage, filterPanel, contentsPanel } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC97711_01] Validate description tooltip for different template when description is off_only metric', async () => {
        // open dossier with only metric
        await resetDossierState({
            credentials: credentials,
            dossier: dossierWithOnlyMetric,
        });
        await libraryPage.openDossier(dossierWithOnlyMetric.name);

        // Check filter tooltip on consumption mode
        await filterPanel.openFilterPanel();
        since('RevenueWithHTMLDes filter description tooltip should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterInfoIconDisplayed('RevenueWithHTMLDes'))
            .toBe(false);
        since('Discount filter info icon display should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterInfoIconDisplayed('Discount'))
            .toBe(false);
    
        await filterPanel.closeFilterPanel();

        // check ICS tooltip on consumption mode
        const DiscountSelector = InCanvasSelector.createByAriaLable('Discount');
        const RevenueWithHTMLDesSelector = InCanvasSelector.createByAriaLable('RevenueWithHTMLDes');
        since('DiscountSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await DiscountSelector.getICSTargetTooltipText())
            .toBe('Discount');
        since('RevenueWithHTMLDesSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await RevenueWithHTMLDesSelector.getICSTargetTooltipText())
            .toBe('RevenueWithHTMLDes');

        // check filter tooltip on authoring mode
        await libraryAuthoringPage.editDossierFromLibrary();
        await authoringFilters.switchToFilterPanel();
        since('RevenueWithHTMLDes filter description tooltip should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.isFilterInfoIconDisplayed('RevenueWithHTMLDes'))
            .toBe(false);
        since('Discount filter info icon display should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.isFilterInfoIconDisplayed('Discount'))
            .toBe(false);

        // check ICS tooltip on authoring mode
        since('DiscountSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await DiscountSelector.getICSTargetTooltipText())
            .toBe('Discount');
        since('RevenueWithHTMLDesSelector ICS target tooltip should be #{expected}, instead we have #{actual}') 
            .expect(await RevenueWithHTMLDesSelector.getICSTargetTooltipText())
            .toBe('RevenueWithHTMLDes');
        await contentsPanel.dossierAuthoringPage.clickCloseDossierButton();
        

    });

    it('[TC97711_02] Validate description tooltip for different template when description is off_only attribute', async () => {
        // open dossier with only metric
        await resetDossierState({
            credentials: credentials,
            dossier: dossierWithOnlyAttribute,
        });
        await libraryPage.openDossier(dossierWithOnlyAttribute.name);

        // Check filter tooltip on consumption mode
        await filterPanel.openFilterPanel();
        since('CategoryWithNormalDes filter description tooltip should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterInfoIconDisplayed('CategoryWithNormalDes'))
            .toBe(false);
        since('Year filter info icon display should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterInfoIconDisplayed('Year'))
            .toBe(false);
    
        await filterPanel.closeFilterPanel();

        // check ICS tooltip on consumption mode
        const YearSelector = InCanvasSelector.createByAriaLable('Year');
        const CategoryWithNormalDesSelector = InCanvasSelector.createByAriaLable('CategoryWithNormalDes');
        since('Year ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await YearSelector.getICSTargetTooltipText())
            .toBe('Year');
        since('CategoryWithNormalDesSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await CategoryWithNormalDesSelector.getICSTargetTooltipText())
            .toBe('CategoryWithNormalDes');

        // check filter tooltip on authoring mode
        await libraryAuthoringPage.editDossierFromLibrary();
        await authoringFilters.switchToFilterPanel();
        since('CategoryWithNormalDes filter description tooltip should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.isFilterInfoIconDisplayed('CategoryWithNormalDes'))
            .toBe(false);
        since('Year filter info icon display should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.isFilterInfoIconDisplayed('Year'))
            .toBe(false);

        // check ICS tooltip on authoring mode
        since('YearSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await YearSelector.getICSTargetTooltipText())
            .toBe('Year');
        since('CategoryWithNormalDesSelector ICS target tooltip should be #{expected}, instead we have #{actual}') 
            .expect(await CategoryWithNormalDesSelector.getICSTargetTooltipText())
            .toBe('CategoryWithNormalDes');
        await contentsPanel.dossierAuthoringPage.clickCloseDossierButton();
        

    });

    it('[TC97711_03] Validate description tooltip for different template when description is off + dashboard parameter', async () => {
        // open dossier with only metric
        await resetDossierState({
            credentials: credentials,
            dossier: dossierWithAttrAndDashboardParameter,
        });
        await libraryPage.openDossier(dossierWithAttrAndDashboardParameter.name);

        // Check filter tooltip on consumption mode
        await filterPanel.openFilterPanel();
        since('CategoryWithNormalDes filter description tooltip should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterInfoIconDisplayed('CategoryWithNormalDes'))
            .toBe(false);
        since('Year filter info icon display should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterInfoIconDisplayed('Year'))
            .toBe(false);
        since('YearParameter filter description tooltip should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterInfoIconDisplayed('YearParameter'))
            .toBe(false);
        since('CategoryWithNormalDesParameter filter info icon display should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterInfoIconDisplayed('CategoryWithNormalDesParameter'))
            .toBe(false);
    
        await filterPanel.closeFilterPanel();

        // check ICS tooltip on consumption mode
        const YearSelector = InCanvasSelector.createByAriaLable('Year');
        const CategoryWithNormalDesSelector = InCanvasSelector.createByAriaLable('CategoryWithNormalDes');
        const YearParameterSelector = InCanvasSelector.createByAriaLable('YearParameter');
        const CategoryWithNormalDesParameterSelector = InCanvasSelector.createByAriaLable('CategoryWithNormalDesParameter');
        since('Year ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await YearSelector.getICSTargetTooltipText())
            .toBe('Year\nName in Dataset: Year1');
        since('CategoryWithNormalDesSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await CategoryWithNormalDesSelector.getICSTargetTooltipText())
            .toBe('CategoryWithNormalDes');
        since('YearParameterSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await YearParameterSelector.getICSTargetTooltipText())
            .toBe('YearParameter2');
        since('CategoryWithNormalDesParameterSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await CategoryWithNormalDesParameterSelector.getICSTargetTooltipText())
            .toBe('CategoryWithNormalDesParameter');

        // check filter tooltip on authoring mode
        await libraryAuthoringPage.editDossierFromLibrary();
        await authoringFilters.switchToFilterPanel();
        since('CategoryWithNormalDes filter description tooltip in authoring should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.isFilterInfoIconDisplayed('CategoryWithNormalDes'))
            .toBe(false);
        since('Year filter info icon display in authoring should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.isFilterInfoIconDisplayed('Year'))
            .toBe(false);
        since('YearParameter filter description tooltip in authoring should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.isFilterInfoIconDisplayed('YearParameter'))
            .toBe(false);
        since('CategoryWithNormalDesParameter filter info icon display in authoring should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.isFilterInfoIconDisplayed('CategoryWithNormalDesParameter'))
            .toBe(false);

        // check ICS tooltip on authoring mode
        since('YearSelector ICS target tooltip in authoring should be #{expected}, instead we have #{actual}')
            .expect(await YearSelector.getICSTargetTooltipText())
            .toBe(`Year\nName in Dataset: Year1`);
        since('CategoryWithNormalDesSelector ICS target tooltip in authoring should be #{expected}, instead we have #{actual}') 
            .expect(await CategoryWithNormalDesSelector.getICSTargetTooltipText())
            .toBe('CategoryWithNormalDes');
        since('YearParameterSelector ICS target tooltip in authoring should be #{expected}, instead we have #{actual}')
            .expect(await YearParameterSelector.getICSTargetTooltipText())
            .toBe('YearParameter2');
        since('CategoryWithNormalDesParameterSelector ICS target tooltip in authoring should be #{expected}, instead we have #{actual}')
            .expect(await CategoryWithNormalDesParameterSelector.getICSTargetTooltipText())
            .toBe('CategoryWithNormalDesParameter');
        await contentsPanel.dossierAuthoringPage.clickCloseDossierButton();

        

    });
    
    it('[TC97711_04] Validate description tooltip for different template when description is off_metric + report parameter', async () => {
        // open dossier with only metric
        await resetDossierState({
            credentials: credentials,
            dossier: dossierWithMetricAndReportParameter,
        });
        await libraryPage.openDossier(dossierWithMetricAndReportParameter.name);

        // Check filter tooltip on consumption mode
        await filterPanel.openFilterPanel();
        since('RevenueWithHTMLDes filter description tooltip should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterInfoIconDisplayed('RevenueWithHTMLDes'))
            .toBe(false);
        since('Discount filter info icon display should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterInfoIconDisplayed('Discount'))
            .toBe(false);
        since('ReportParameterWithDes filter description tooltip should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterInfoIconDisplayed('ReportParameterWithDes'))
            .toBe(false);
        since('ReportParameterWithoutDes filter info icon display should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterInfoIconDisplayed('ReportParameterWithoutDes'))
            .toBe(false);
    
        await filterPanel.closeFilterPanel();

        // check ICS tooltip on consumption mode
        const DiscountSelector = InCanvasSelector.createByAriaLable('Discount');
        const RevenueWithHTMLDesSelector = InCanvasSelector.createByAriaLable('RevenueWithHTMLDes');
        const ReportParameterWithDesSelector = InCanvasSelector.createByAriaLable('ReportParameterWithDes');
        const ReportParameterWithoutDesSelector = InCanvasSelector.createByAriaLable('ReportParameterWithoutDes');
        since('DiscountSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await DiscountSelector.getICSTargetTooltipText())
            .toBe('Discount');
        since('RevenueWithHTMLDesSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await RevenueWithHTMLDesSelector.getICSTargetTooltipText())
            .toBe(`RevenueWithHTMLDes`);
        since('ReportParameterWithDesSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await ReportParameterWithDesSelector.getICSTargetTooltipText())
            .toBe('ReportParameterWithDes');
        since('ReportParameterWithoutDesSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await ReportParameterWithoutDesSelector.getICSTargetTooltipText())
            .toBe('ReportParameterWithoutDes');

        // check filter tooltip on authoring mode
        await libraryAuthoringPage.editDossierFromLibrary();
        await authoringFilters.switchToFilterPanel();
        since('RevenueWithHTMLDes filter description tooltip on authoring should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.isFilterInfoIconDisplayed('RevenueWithHTMLDes'))
            .toBe(false);
        since('Discount filter info icon display on authoring should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.isFilterInfoIconDisplayed('Discount'))
            .toBe(false);
        since('ReportParameterWithDes filter description tooltip on authoring should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.isFilterInfoIconDisplayed('ReportParameterWithDes'))
            .toBe(false);
        since('ReportParameterWithoutDes filter info icon display on authoring should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.isFilterInfoIconDisplayed('ReportParameterWithoutDes'))
            .toBe(false);

        // check ICS tooltip on authoring mode
        since('DiscountSelector ICS target tooltip on authoring should be #{expected}, instead we have #{actual}')
            .expect(await DiscountSelector.getICSTargetTooltipText())
            .toBe('Discount');
        since('RevenueWithHTMLDesSelector ICS target tooltip on authoring should be #{expected}, instead we have #{actual}') 
            .expect(await RevenueWithHTMLDesSelector.getICSTargetTooltipText())
            .toBe(`RevenueWithHTMLDes`);
        since('ReportParameterWithDesSelector ICS target tooltip on authoring should be #{expected}, instead we have #{actual}')
            .expect(await ReportParameterWithDesSelector.getICSTargetTooltipText())
            .toBe('ReportParameterWithDes');
        since('ReportParameterWithoutDesSelector ICS target tooltip on authoring should be #{expected}, instead we have #{actual}')
            .expect(await ReportParameterWithoutDesSelector.getICSTargetTooltipText())
            .toBe('ReportParameterWithoutDes');
        await contentsPanel.dossierAuthoringPage.clickCloseDossierButton();

        

    });
    
    
});
export const config = specConfiguration;
