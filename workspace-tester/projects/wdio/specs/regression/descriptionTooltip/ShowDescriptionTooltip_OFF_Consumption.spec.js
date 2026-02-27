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

describe('ShowDescriptionTooltip_OFF_Consumption', () => {
    const dossier = {
        id: 'C2430BD741D5803E516252B60C034BC5',
        name: '(AUTO) FilterAndICSTooltip_OFF',
        project: tutorialProject,
    };

    let { libraryPage, toc, dossierPage, inCanvasSelector, grid, loginPage, filterPanel, checkboxFilter } = browsers.pageObj1;

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
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC97698] Validate filter tooltip for library consumption mode when description setting is off', async () => {

        // Check normal filter tooltip
        await toc.openPageFromTocMenu({ chapterName: 'Filter', pageName: 'Filter' });
        await filterPanel.openFilterPanel();
        since('CategoryWithNormalDes filter description tooltip should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterInfoIconDisplayed('CategoryWithNormalDes'))
            .toBe(false);
        since('Item filter info icon display should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterInfoIconDisplayed('Item'))
            .toBe(false);
    
        await filterPanel.closeFilterPanel();

        // Check parameter filter tooltip
        await toc.openPageFromTocMenu({ chapterName: 'Parameter Filter', pageName: 'ParameterFilter' });
        await filterPanel.openFilterPanel();
        since('YearParameterWithItselfDes filter description tooltip should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterInfoIconDisplayed('YearParameterWithItselfDes'))
            .toBe(false);
        since('MonthParameterWithoutItselfDes filter info icon display should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterInfoIconDisplayed('MonthParameterWithoutItselfDes'))
            .toBe(false);
        since('CategoryWithNormalDes_WithItselfDes filter description tooltip should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterInfoIconDisplayed('CategoryWithNormalDes_WithItselfDes'))
            .toBe(false);
        since('SubcategoryWithLongDes_WithoutItselfDes filter info icon display should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterInfoIconDisplayed('SubcategoryWithLongDes_WithoutItselfDes'))
            .toBe(false);
        since('ValueParameterWithoutDes filter info icon display should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterInfoIconDisplayed('ValueParameterWithoutDes'))
            .toBe(false);
        since('ValueParameterWithDes filter description tooltip should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterInfoIconDisplayed('ValueParameterWithDes'))
            .toBe(false);
        await filterPanel.closeFilterPanel();

        // check report parameter filter tooltip
        await toc.openPageFromTocMenu({ chapterName: 'ReportParameter Filter', pageName: 'ReportParameterFilter' });
        await filterPanel.openFilterPanel();
        since('ValueReportParameterWithDes filter description tooltip should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterInfoIconDisplayed('ValueReportParameterWithDes'))
            .toBe(false);
        since('ValueReportParameterWithoutDes filter info icon display should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterInfoIconDisplayed('ValueReportParameterWithoutDes'))
            .toBe(false);
        since('ItemReportParameterWithItselfDes filter description tooltip should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterInfoIconDisplayed('ItemReportParameterWithItselfDes'))
            .toBe(false);
        since('MonthReportParameterWithoutItselfDes filter info icon display should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterInfoIconDisplayed('MonthReportParameterWithoutItselfDes'))
            .toBe(false);
        since('CategoryWithNormalDes_WithItselfDes filter description tooltip should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterInfoIconDisplayed('CategoryWithNormalDes_WithItselfDes'))
            .toBe(false);
        since('CategoryWithNormalDes_WithoutItselfDes filter info icon display should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterInfoIconDisplayed('CategoryWithNormalDes_WithoutItselfDes'))
            .toBe(false);
        await filterPanel.closeFilterPanel();

    });

    
    it('[TC97699] Validate ICS tooltip for library consumption mode when description setting is off', async () => {

        // Check parameter filter tooltip
        await toc.openPageFromTocMenu({ chapterName: 'Element/Value ICS', pageName: 'ICS- CheckBox' });
        const CategoryWithNormalDesSelector = InCanvasSelector.createByAriaLable('CategoryWithNormalDes');
        const CustomerRegionWithEmptySpaceDesSelector = InCanvasSelector.createByAriaLable('CustomerRegionWithEmptySpaceDes');
        const DAForItemWithSpecialDesSelector = InCanvasSelector.createByAriaLable('DAForItemWithSpecialDes');
        const DAForCategoryWithi18nDesSelector = InCanvasSelector.createByAriaLable('DAForCategoryWithi18nDes');
        const DAForSubcatWithMultiLineDesSelector = InCanvasSelector.createByAriaLable('DAForSubcatWithMultiLineDes');
        const SubcategoryWithLongDesSelector = InCanvasSelector.createByAriaLable('SubcategoryWithLongDes');
        const DAForMonthWithHTMLDesSelector = InCanvasSelector.createByAriaLable('DAForMonthWithHTMLDes');
        const DAForYearWithXSSDesSelector = InCanvasSelector.createByAriaLable('DAForYearWithXSSDes');
        // item ICS
        const ItemSelector = InCanvasSelector.createByAriaLable('100 Places to Go While Still Young at Heart');
        const Month_renameSelector = InCanvasSelector.createByAriaLable('Month_rename');
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

        // check special tooltip when hide target bar
        await toc.openPageFromTocMenu({ chapterName: 'Element/Value ICS', pageName: 'ICS- Slider' });
        since('DAForItemWithSpecialDesSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await DAForItemWithSpecialDesSelector.getICSTargetTooltipText())
            .toBe("DAForItemWithSpecialDes_rename\nName in Dataset: DAForItemWithSpecialDes");
    
        // check parameter ICS 
        await toc.openPageFromTocMenu({ chapterName: 'Parameter ICS', pageName: 'ParameterICS' });
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
            .expect(await ValueParameterWithoutDesSelector.getICSTargetTooltipText(true))
            .toBe("ValueParameterWithoutDes");
        since('ValueParameterWithDesSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await ValueParameterWithDesSelector.getICSTargetTooltipText(true))
            .toBe("ValueParameterWithDes");
        since('CategoryWithNormalDes_WithItselfDesSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await CategoryWithNormalDes_WithItselfDesSelector.getICSTargetTooltipText())
            .toBe("CategoryWithNormalDes_WithItselfDes");
        since('SubcategoryWithLongDes_WithoutItselfDesSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await SubcategoryWithLongDes_WithoutItselfDesSelector.getICSTargetTooltipText())
            .toBe("SubcategoryWithLongDes_WithoutItselfDes");

        // check report parameter ICS
        await toc.openPageFromTocMenu({ chapterName: 'ReportParameter ICS', pageName: 'ReportParameterICS' });
        const ValueReportParameterWithDesReportSelector = InCanvasSelector.createByAriaLable('ValueReportParameterWithDes');
        const ValueReportParameterWithoutDesReportSelector = InCanvasSelector.createByAriaLable('ValueReportParameterWithoutDes');
        const ItemReportParameterWithItselfDesReportSelector = InCanvasSelector.createByAriaLable('ItemReportParameterWithItselfDes');
        const MonthReportParameterWithoutItselfDesReportSelector = InCanvasSelector.createByAriaLable('MonthReportParameterWithoutItselfDes');
        const CategoryWithNormalDes_WithItselfDesReportSelector = InCanvasSelector.createByAriaLable('CategoryWithNormalDes_WithItselfDes');
        const CategoryWithNormalDes_WithoutItselfDesReportSelector = InCanvasSelector.createByAriaLable('CategoryWithNormalDes_WithoutItselfDes');
        since('ValueReportParameterWithDesReportSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await ValueReportParameterWithDesReportSelector.getICSTargetTooltipText(true))
            .toBe("ValueReportParameterWithDes");
        since('ValueReportParameterWithoutDesReportSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await ValueReportParameterWithoutDesReportSelector.getICSTargetTooltipText(true))
            .toBe("ValueReportParameterWithoutDes");
        since('ItemReportParameterWithItselfDesReportSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await ItemReportParameterWithItselfDesReportSelector.getICSTargetTooltipText(true))
            .toBe("ItemReportParameterWithItselfDes");
        since('MonthReportParameterWithoutItselfDesReportSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await MonthReportParameterWithoutItselfDesReportSelector.getICSTargetTooltipText(true))
            .toBe("MonthReportParameterWithoutItselfDes");
        since('CategoryWithNormalDes_WithItselfDesReportSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await CategoryWithNormalDes_WithItselfDesReportSelector.getICSTargetTooltipText(true))
            .toBe("CategoryWithNormalDes_WithItselfDes");
        since('CategoryWithNormalDes_WithoutItselfDesReportSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await CategoryWithNormalDes_WithoutItselfDesReportSelector.getICSTargetTooltipText(true))
            .toBe("CategoryWithNormalDes_WithoutItselfDes");
        
    });

    
    
});
export const config = specConfiguration;
