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

describe('ShowDescriptionTooltip_On_DifferentTemplate', () => {
    const dossierWithOnlyMetric = {
        id: 'CA56C4D84885E6614B867EA6C2C0F866',
        name: '(AUTO) FilterAndICSTooltip_DSWithOnlyMetric',
        project: tutorialProject,
    };

    const dossierWithOnlyAttribute = {
        id: '116364C344D715B0ABE123BA61970BE1',
        name: '(AUTO) FilterAndICSTooltip_DSWithOnlyAttr',
        project: tutorialProject,
    };

    const dossierWithAttrAndDashboardParameter = {
        id: 'B340BC0C48E87E23EE1BF48B0E52A068',
        name: '(AUTO) FilterAndICSTooltip_DSWithAttr+DashboardParameter',
        project: tutorialProject,
    };

    const dossierWithMetricAndReportParameter = {
        id: 'B3BB836E48A421B5B94165A6343EC0D2',
        name: '(AUTO) FilterAndICSTooltip_DSWithMetric+ReportParameter',
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

    it('[TC97706_01] Validate description tooltip for different template_only metric', async () => {
        // open dossier with only metric
        await resetDossierState({
            credentials: credentials,
            dossier: dossierWithOnlyMetric,
        });
        await libraryPage.openDossier(dossierWithOnlyMetric.name);

        // Check filter tooltip on consumption mode
        await filterPanel.openFilterPanel();
        since('RevenueWithHTMLDes filter description tooltip should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.getDescriptionTooltipText('RevenueWithHTMLDes'))
            .toBe(`<html>\n<p  style="color: red;">\nTest Description\n</p>\n</html>`);
        since('Discount filter info icon display should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterInfoIconDisplayed('Discount'))
            .toBe(false);

        await filterPanel.closeFilterPanelByCloseIcon();

        // check ICS tooltip on consumption mode
        const DiscountSelector = InCanvasSelector.createByAriaLable('Discount');
        const RevenueWithHTMLDesSelector = InCanvasSelector.createByAriaLable('RevenueWithHTMLDes');
        since('DiscountSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await DiscountSelector.getICSTargetTooltipText())
            .toBe('Discount');
        since('RevenueWithHTMLDesSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await RevenueWithHTMLDesSelector.getICSTargetTooltipText())
            .toBe(`RevenueWithHTMLDes\n<html>    \n<p style="color: red;">    \nTest Description    \n</p>    \n</html>`);

        // check filter tooltip on authoring mode
        await libraryAuthoringPage.editDossierFromLibrary();
        await authoringFilters.switchToFilterPanel();
        since('RevenueWithHTMLDes filter description tooltip should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.getDescriptionTooltipText('RevenueWithHTMLDes'))
            .toBe('<html>    \n<p style="color: red;">    \nTest Description    \n</p>    \n</html>');
        since('Discount filter info icon display should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.isFilterInfoIconDisplayed('Discount'))
            .toBe(false);

        // check ICS tooltip on authoring mode
        since('DiscountSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await DiscountSelector.getICSTargetTooltipText())
            .toBe('Discount');
        since('RevenueWithHTMLDesSelector ICS target tooltip should be #{expected}, instead we have #{actual}') 
            .expect(await RevenueWithHTMLDesSelector.getICSTargetTooltipText())
            .toBe(`RevenueWithHTMLDes\n<html>    \n<p style="color: red;">    \nTest Description    \n</p>    \n</html>`);
        await contentsPanel.dossierAuthoringPage.clickCloseDossierButton();
        

    });

    it('[TC97706_02] Validate description tooltip for different template_only attribute', async () => {
        // open dossier with only metric
        await resetDossierState({
            credentials: credentials,
            dossier: dossierWithOnlyAttribute,
        });
        await libraryPage.openDossier(dossierWithOnlyAttribute.name);

        // Check filter tooltip on consumption mode
        await filterPanel.openFilterPanel();
        since('CategoryWithNormalDes filter description tooltip should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.getDescriptionTooltipText('CategoryWithNormalDes'))
            .toBe('NormalDes: There are 3 forms in Category.');
        since('Year filter info icon display should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterInfoIconDisplayed('Year'))
            .toBe(false);
    
        await filterPanel.closeFilterPanelByCloseIcon();

        // check ICS tooltip on consumption mode
        const YearSelector = InCanvasSelector.createByAriaLable('Year');
        const CategoryWithNormalDesSelector = InCanvasSelector.createByAriaLable('CategoryWithNormalDes');
        since('Year ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await YearSelector.getICSTargetTooltipText())
            .toBe('Year');
        since('CategoryWithNormalDesSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await CategoryWithNormalDesSelector.getICSTargetTooltipText())
            .toBe('CategoryWithNormalDes\nNormalDes: There are 3 forms in Category.');

        // check filter tooltip on authoring mode
        await libraryAuthoringPage.editDossierFromLibrary();
        await authoringFilters.switchToFilterPanel();
        since('CategoryWithNormalDes filter description tooltip should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.getDescriptionTooltipText('CategoryWithNormalDes'))
            .toBe('NormalDes: There are 3 forms in Category.');
        since('Year filter info icon display should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.isFilterInfoIconDisplayed('Year'))
            .toBe(false);

        // check ICS tooltip on authoring mode
        since('YearSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await YearSelector.getICSTargetTooltipText())
            .toBe('Year');
        since('CategoryWithNormalDesSelector ICS target tooltip should be #{expected}, instead we have #{actual}') 
            .expect(await CategoryWithNormalDesSelector.getICSTargetTooltipText())
            .toBe('CategoryWithNormalDes\nNormalDes: There are 3 forms in Category.');
        await contentsPanel.dossierAuthoringPage.clickCloseDossierButton();
        

    });

    it('[TC97706_03] Validate description tooltip for different template_attribute + dashboard parameter', async () => {
        // open dossier with only metric
        await resetDossierState({
            credentials: credentials,
            dossier: dossierWithAttrAndDashboardParameter,
        });
        await libraryPage.openDossier(dossierWithAttrAndDashboardParameter.name);

        // Check filter tooltip on consumption mode
        await filterPanel.openFilterPanel();
        since('CategoryWithNormalDes filter description tooltip should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.getDescriptionTooltipText('CategoryWithNormalDes'))
            .toBe('NormalDes: There are 3 forms in Category.');
        since('Year filter info icon display should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterInfoIconDisplayed('Year'))
            .toBe(false);
        since('YearParameter filter description tooltip should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.getDescriptionTooltipText('YearParameter'))
            .toBe('This is year document parameter');
        since('CategoryWithNormalDesParameter filter info icon display should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterInfoIconDisplayed('CategoryWithNormalDesParameter'))
            .toBe(false);

        await filterPanel.closeFilterPanelByCloseIcon();

        // check ICS tooltip on consumption mode
        const YearSelector = InCanvasSelector.createByAriaLable('Year');
        const CategoryWithNormalDesSelector = InCanvasSelector.createByAriaLable('CategoryWithNormalDes');
        const YearParameterSelector = InCanvasSelector.createByAriaLable('YearParameter');
        const CategoryWithNormalDesParameterSelector = InCanvasSelector.createByAriaLable('CategoryWithNormalDesParameter');
        since('Year ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await YearSelector.getICSTargetTooltipText())
            .toBe('Year');
        since('CategoryWithNormalDesSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await CategoryWithNormalDesSelector.getICSTargetTooltipText())
            .toBe('CategoryWithNormalDes\nNormalDes: There are 3 forms in Category.');
        since('YearParameterSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await YearParameterSelector.getICSTargetTooltipText())
            .toBe('YearParameter\nThis is year document parameter');
        since('CategoryWithNormalDesParameterSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await CategoryWithNormalDesParameterSelector.getICSTargetTooltipText())
            .toBe('CategoryWithNormalDesParameter');

        // check filter tooltip on authoring mode
        await libraryAuthoringPage.editDossierFromLibrary();
        await authoringFilters.switchToFilterPanel();
        since('CategoryWithNormalDes filter description tooltip in authoring should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.getDescriptionTooltipText('CategoryWithNormalDes'))
            .toBe('NormalDes: There are 3 forms in Category.');
        since('Year filter info icon display in authoring should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.isFilterInfoIconDisplayed('Year'))
            .toBe(false);
        since('YearParameter filter description tooltip in authoring should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.getDescriptionTooltipText('YearParameter'))
            .toBe('This is year document parameter');
        since('CategoryWithNormalDesParameter filter info icon display in authoring should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.isFilterInfoIconDisplayed('CategoryWithNormalDesParameter'))
            .toBe(false);

        // check ICS tooltip on authoring mode
        since('YearSelector ICS target tooltip in authoring should be #{expected}, instead we have #{actual}')
            .expect(await YearSelector.getICSTargetTooltipText())
            .toBe('Year');
        since('CategoryWithNormalDesSelector ICS target tooltip in authoring should be #{expected}, instead we have #{actual}') 
            .expect(await CategoryWithNormalDesSelector.getICSTargetTooltipText())
            .toBe('CategoryWithNormalDes\nNormalDes: There are 3 forms in Category.');
        since('YearParameterSelector ICS target tooltip in authoring should be #{expected}, instead we have #{actual}')
            .expect(await YearParameterSelector.getICSTargetTooltipText())
            .toBe('YearParameter\nThis is year document parameter');
        since('CategoryWithNormalDesParameterSelector ICS target tooltip in authoring should be #{expected}, instead we have #{actual}')
            .expect(await CategoryWithNormalDesParameterSelector.getICSTargetTooltipText())
            .toBe('CategoryWithNormalDesParameter');
        await contentsPanel.dossierAuthoringPage.clickCloseDossierButton();

        

    });
    
    it('[TC97706_04] Validate description tooltip for different template_metric + report parameter', async () => {
        // open dossier with only metric
        await resetDossierState({
            credentials: credentials,
            dossier: dossierWithMetricAndReportParameter,
        });
        await libraryPage.openDossier(dossierWithMetricAndReportParameter.name);

        // Check filter tooltip on consumption mode
        await filterPanel.openFilterPanel();
        since('RevenueWithHTMLDes filter description tooltip should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.getDescriptionTooltipText('RevenueWithHTMLDes'))
            .toBe(`<html>\n<p  style="color: red;">\nTest Description\n</p>\n</html>`);
        since('Discount filter info icon display should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterInfoIconDisplayed('Discount'))
            .toBe(false);
        since('ReportParameterWithDes filter description tooltip should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.getDescriptionTooltipText('ReportParameterWithDes'))
            .toBe('This is report parameter with des');
        since('ReportParameterWithoutDes filter info icon display should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterInfoIconDisplayed('ReportParameterWithoutDes'))
            .toBe(false);

        await filterPanel.closeFilterPanelByCloseIcon();

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
            .toBe(`RevenueWithHTMLDes\n<html>    \n<p style="color: red;">    \nTest Description    \n</p>    \n</html>`);
        since('ReportParameterWithDesSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await ReportParameterWithDesSelector.getICSTargetTooltipText())
            .toBe('ReportParameterWithDes\nThis is report parameter with des');
        since('ReportParameterWithoutDesSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await ReportParameterWithoutDesSelector.getICSTargetTooltipText())
            .toBe('ReportParameterWithoutDes');

        // check filter tooltip on authoring mode
        await libraryAuthoringPage.editDossierFromLibrary();
        await authoringFilters.switchToFilterPanel();
        since('RevenueWithHTMLDes filter description tooltip on authoring should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.getDescriptionTooltipText('RevenueWithHTMLDes'))
            .toBe('<html>    \n<p style="color: red;">    \nTest Description    \n</p>    \n</html>');
        since('Discount filter info icon display on authoring should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.isFilterInfoIconDisplayed('Discount'))
            .toBe(false);
        since('ReportParameterWithDes filter description tooltip on authoring should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.getDescriptionTooltipText('ReportParameterWithDes'))
            .toBe('This is report parameter with des');
        since('ReportParameterWithoutDes filter info icon display on authoring should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.isFilterInfoIconDisplayed('ReportParameterWithoutDes'))
            .toBe(false);

        // check ICS tooltip on authoring mode
        since('DiscountSelector ICS target tooltip on authoring should be #{expected}, instead we have #{actual}')
            .expect(await DiscountSelector.getICSTargetTooltipText())
            .toBe('Discount');
        since('RevenueWithHTMLDesSelector ICS target tooltip on authoring should be #{expected}, instead we have #{actual}') 
            .expect(await RevenueWithHTMLDesSelector.getICSTargetTooltipText())
            .toBe(`RevenueWithHTMLDes\n<html>    \n<p style="color: red;">    \nTest Description    \n</p>    \n</html>`);
        since('ReportParameterWithDesSelector ICS target tooltip on authoring should be #{expected}, instead we have #{actual}')
            .expect(await ReportParameterWithDesSelector.getICSTargetTooltipText())
            .toBe('ReportParameterWithDes\nThis is report parameter with des');
        since('ReportParameterWithoutDesSelector ICS target tooltip on authoring should be #{expected}, instead we have #{actual}')
            .expect(await ReportParameterWithoutDesSelector.getICSTargetTooltipText())
            .toBe('ReportParameterWithoutDes');
        await contentsPanel.dossierAuthoringPage.clickCloseDossierButton();

        

    });
    
    
});
export const config = specConfiguration;
