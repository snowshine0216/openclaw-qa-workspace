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

describe('ShowDescriptionTooltip_OFF_Authoring', () => {
    const dossier = {
        id: 'C2430BD741D5803E516252B60C034BC5',
        name: '(AUTO) FilterAndICSTooltip_OFF',
        project: tutorialProject,
    };

    let { libraryPage, dossierPage, contentsPanel, authoringFilters, loginPage, filterPanel, libraryAuthoringPage, } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);
        await libraryAuthoringPage.editDossierFromLibrary();
        
    });

    afterEach(async () => {
        await contentsPanel.dossierAuthoringPage.clickCloseDossierButton();
        await dossierPage.goToLibrary();
    });

    it('[TC97689]  Validate filter tooltip for library authoring mode when description setting is off', async () => {

        // Check normal filter tooltip
        await contentsPanel.goToPage({ chapterName: 'Filter', pageName: 'Filter' });
        await authoringFilters.switchToFilterPanel();
        since('CategoryWithNormalDes filter description tooltip should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.isFilterInfoIconDisplayed('CategoryWithNormalDes'))
            .toBe(false);
        since('Item filter info icon display should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.isFilterInfoIconDisplayed('Item'))
            .toBe(false);

        // refresh dashboard and check the info icon
        await contentsPanel.dossierAuthoringPage.refreshDossier();
        since('CategoryWithNormalDes filter info icon display after refresh should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.isFilterInfoIconDisplayed('CategoryWithNormalDes'))
            .toBe(false);
        
        // check parameter filter tooltip
        await contentsPanel.goToPage({ chapterName: 'Parameter Filter', pageName: 'ParameterFilter' });
        since('YearParameterWithItselfDes filter description tooltip should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.isFilterInfoIconDisplayed('YearParameterWithItselfDes'))
            .toBe(false);
        since('MonthParameterWithoutItselfDes filter info icon display should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.isFilterInfoIconDisplayed('MonthParameterWithoutItselfDes'))
            .toBe(false);
        since('ValueParameterWithoutDes filter info icon display should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.isFilterInfoIconDisplayed('ValueParameterWithoutDes'))
            .toBe(false);
        since('ValueParameterWithDes filter description tooltip should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.isFilterInfoIconDisplayed('ValueParameterWithDes'))
            .toBe(false);  
        
        // check report parameter filter tooltip
        await contentsPanel.goToPage({ chapterName: 'ReportParameter Filter', pageName: 'ReportParameterFilter' });
        since('ValueReportParameterWithDes filter description tooltip should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.isFilterInfoIconDisplayed('ValueReportParameterWithDes'))
            .toBe(false);
        since('ValueReportParameterWithoutDes filter info icon display should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.isFilterInfoIconDisplayed('ValueReportParameterWithoutDes'))
            .toBe(false);
        since('ItemReportParameterWithItselfDes filter description tooltip should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.isFilterInfoIconDisplayed('ItemReportParameterWithItselfDes'))
            .toBe(false);
        since('MonthReportParameterWithoutItselfDes filter info icon display should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.isFilterInfoIconDisplayed('MonthReportParameterWithoutItselfDes'))
            .toBe(false);
        since('CategoryWithNormalDes_WithItselfDes filter description tooltip should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.isFilterInfoIconDisplayed('CategoryWithNormalDes_WithItselfDes'))
            .toBe(false);
        since('CategoryWithNormalDes_WithoutItselfDes filter info icon display should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.isFilterInfoIconDisplayed('CategoryWithNormalDes_WithoutItselfDes'))
            .toBe(false);
        
    });

    it('[TC97690]  Validate ICS tooltip for library authoring mode when description setting is off', async () => {

        // Check parameter filter tooltip
        await contentsPanel.goToPage({ chapterName: 'Element/Value ICS', pageName: 'ICS- CheckBox' });
        const CategoryWithNormalDesSelector = InCanvasSelector.createByAriaLable('CategoryWithNormalDes');
        const CustomerRegionWithEmptySpaceDesSelector = InCanvasSelector.createByAriaLable('CustomerRegionWithEmptySpaceDes');
        const DAForItemWithSpecialDesSelector = InCanvasSelector.createByAriaLable('DAForItemWithSpecialDes');
        const DAForCategoryWithi18nDesSelector = InCanvasSelector.createByAriaLable('DAForCategoryWithi18nDes');
        const DAForSubcatWithMultiLineDesSelector = InCanvasSelector.createByAriaLable('DAForSubcatWithMultiLineDes');
        const SubcategoryWithLongDesSelector = InCanvasSelector.createByAriaLable('SubcategoryWithLongDes');
        const DAForMonthWithHTMLDesSelector = InCanvasSelector.createByAriaLable('DAForMonthWithHTMLDes');
        const DAForYearWithXSSDesSelector = InCanvasSelector.createByAriaLable('DAForYearWithXSSDes');
        const Month_renameSelector = InCanvasSelector.createByAriaLable('Month_rename');
        // item ICS
        const ItemSelector = InCanvasSelector.createByAriaLable('100 Places to Go While Still Young at Heart');

        since('CategoryWithNormalDesSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await CategoryWithNormalDesSelector.getICSTargetTooltipText())
            .toBe("CategoryWithNormalDes");
        since('DAForYearWithXSSDesSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await DAForYearWithXSSDesSelector.getICSTargetTooltipText())
            .toBe("DAForYearWithXSSDes\nName in Dataset: DAForYearWithXSSDes_rename");
        since('ItemSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await ItemSelector.getICSTargetTooltipText())
            .toBe("Item");
        since('Month_renameSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await Month_renameSelector.getICSTargetTooltipText())
            .toBe("Month_rename\nName in Dataset: Month");

        // check tooltip with different ICS style 
        // slider ICS
        await contentsPanel.goToPage({ chapterName: 'Element/Value ICS', pageName: 'ICS- Slider' });
        const Item_RenameSelector = InCanvasSelector.createByAriaLable("Item_Rename");
        since('DAForItemWithSpecialDesSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await DAForItemWithSpecialDesSelector.getICSTargetTooltipText())
            .toBe("DAForItemWithSpecialDes_rename\nName in Dataset: DAForItemWithSpecialDes");
        since('Item_RenameSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await Item_RenameSelector.getICSTitleTooltipText())
            .toBe("Item_Rename\nName in Dataset: Item");
        
        
        // check parameter ICS 
        await contentsPanel.goToPage({ chapterName: 'Parameter ICS', pageName: 'ParameterICS' });
        const YearParameterWithItselfDesSelector = InCanvasSelector.createByAriaLable('YearParameterWithItselfDes');
        const MonthParameterWithoutItselfDesSelector = InCanvasSelector.createByAriaLable('MonthParameterWithoutItselfDes');
        const ValueParameterWithoutDesSelector = InCanvasSelector.createByAriaLable('ValueParameterWithoutDes');
        const ValueParameterWithDesSelector = InCanvasSelector.createByAriaLable('ValueParameterWithDes');
        const CategoryWithNormalDes_WithItselfDesSelector = InCanvasSelector.createByAriaLable('CategoryWithNormalDes_WithItselfDes');
        const SubcategoryWithLongDes_WithoutItselfDesSelector = InCanvasSelector.createByAriaLable('SubcategoryWithLongDes_WithoutItselfDes');
        since('YearParameterWithItselfDesSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await YearParameterWithItselfDesSelector.getICSTargetTooltipText())
            .toBe("YearParameterWithItselfDes");
        since('MonthParameterWithoutItselfDesSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await MonthParameterWithoutItselfDesSelector.getICSTargetTooltipText())
            .toBe("MonthParameterWithoutItselfDes_Rename");
        since('ValueParameterWithoutDesSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await ValueParameterWithoutDesSelector.getICSTargetTooltipText())
            .toBe("ValueParameterWithoutDes");
        since('ValueParameterWithDesSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await ValueParameterWithDesSelector.getICSTargetTooltipText())
            .toBe("ValueParameterWithDes");
        since('CategoryWithNormalDes_WithItselfDesSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await CategoryWithNormalDes_WithItselfDesSelector.getICSTargetTooltipText())
            .toBe("CategoryWithNormalDes_WithItselfDes");
        since('SubcategoryWithLongDes_WithoutItselfDesSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await SubcategoryWithLongDes_WithoutItselfDesSelector.getICSTargetTooltipText())
            .toBe("SubcategoryWithLongDes_WithoutItselfDes");
        
        // check report parameter ICS
        await contentsPanel.goToPage({ chapterName: 'ReportParameter ICS', pageName: 'ReportParameterICS' });
        const ValueReportParameterWithDesReportSelector = InCanvasSelector.createByAriaLable('ValueReportParameterWithDes');
        const ValueReportParameterWithoutDesReportSelector = InCanvasSelector.createByAriaLable('ValueReportParameterWithoutDes');
        const ItemReportParameterWithItselfDesReportSelector = InCanvasSelector.createByAriaLable('ItemReportParameterWithItselfDes');
        const MonthReportParameterWithoutItselfDesReportSelector = InCanvasSelector.createByAriaLable('MonthReportParameterWithoutItselfDes');
        const CategoryWithNormalDes_WithItselfDesReportSelector = InCanvasSelector.createByAriaLable('CategoryWithNormalDes_WithItselfDes');
        const CategoryWithNormalDes_WithoutItselfDesReportSelector = InCanvasSelector.createByAriaLable('CategoryWithNormalDes_WithoutItselfDes');
        since('ValueReportParameterWithDesReportSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await ValueReportParameterWithDesReportSelector.getICSTargetTooltipText())
            .toBe("ValueReportParameterWithDes");
        since('ValueReportParameterWithoutDesReportSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await ValueReportParameterWithoutDesReportSelector.getICSTargetTooltipText())
            .toBe("ValueReportParameterWithoutDes");
        since('ItemReportParameterWithItselfDesReportSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await ItemReportParameterWithItselfDesReportSelector.getICSTargetTooltipText())
            .toBe("ItemReportParameterWithItselfDes");
        since('MonthReportParameterWithoutItselfDesReportSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await MonthReportParameterWithoutItselfDesReportSelector.getICSTargetTooltipText())
            .toBe("MonthReportParameterWithoutItselfDes");
        since('CategoryWithNormalDes_WithItselfDesReportSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await CategoryWithNormalDes_WithItselfDesReportSelector.getICSTargetTooltipText())
            .toBe("CategoryWithNormalDes_WithItselfDes");
        since('CategoryWithNormalDes_WithoutItselfDesReportSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await CategoryWithNormalDes_WithoutItselfDesReportSelector.getICSTargetTooltipText())
            .toBe("CategoryWithNormalDes_WithoutItselfDes");
        
    });

    
    
});
export const config = specConfiguration;
