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

describe('ShowDescriptionTooltip_On_Consumption', () => {
    const dossier = {
        id: '53B8235F4CC3278E11A3B3BBEE6D1C11',
        name: '(AUTO) FilterAndICSTooltip',
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

    it('[TC97555_01] Validate filter tooltip for library consumption mode', async () => {

        // Check normal filter tooltip
        await toc.openPageFromTocMenu({ chapterName: 'Filter', pageName: 'Filter' });
        await filterPanel.openFilterPanel();
        since('CategoryWithNormalDes filter description tooltip should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.getDescriptionTooltipText('CategoryWithNormalDes'))
            .toBe('NormalDes: There are 3 forms in Category.');
        since('SubcategoryWithLongDes filter description tooltip should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.getDescriptionTooltipText('SubcategoryWithLongDes'))
            .toBe('LongDes: Subcategory with long long long long long long long long long long long long long long des');
        since('Item filter info icon display should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterInfoIconDisplayed('Item'))
            .toBe(false);
        since('DAForItemWithSpecialDes filter description tooltip should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.getDescriptionTooltipText('DAForItemWithSpecialDes'))
            .toBe("DES: special key words @#&%(*)(@*(&%)($_)(_%)(#)*%)(#&%)(?;'[]\\\\]");
        since('CustomerRegionWithEmptySpaceDes filter info icon display should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterInfoIconDisplayed('CustomerRegionWithEmptySpaceDes'))
            .toBe(false);
        since('DMWithi8nDes filter description tooltip should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.getDescriptionTooltipText('DMWithi8nDes'))
            .toBe('DES: 中文的description');
        since('CostWithXSSDes filter description tooltip should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.getDescriptionTooltipText('CostWithXSSDes'))
            .toBe("DES: <input type=\"text\" name=\"username\" value=\"<script>alert('XSS');</script>\" />");
        since('ProfitWithMultiLineDes filter description tooltip should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.getDescriptionTooltipText('ProfitWithMultiLineDes'))
            .toBe(`Test Description: 1234567890\n2234567890 3234567890 4234567890 4234567890 5234567890\n6234567890\n7234567890\n8234567890\n9234567890\n0234567890\n1234567890\n234567890\n34567890`);
        since('RevenueWithHTMLDes filter description tooltip should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.getDescriptionTooltipText('RevenueWithHTMLDes'))
            .toBe(`<html>\n<p  style="color: red;">\nTest Description\n</p>\n</html>`);
        since('DAForSubcatWithMultiLineDes filter description tooltip should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.getDescriptionTooltipText('DAForSubcatWithMultiLineDes'))
            .toBe(`Des: line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9\nline10`);
    
        await filterPanel.closeFilterPanelByCloseIcon();
    });

    it('[TC97555_02] Validate filter tooltip for library consumption mode', async () => {

        // Check parameter filter tooltip
        await toc.openPageFromTocMenu({ chapterName: 'Parameter Filter', pageName: 'ParameterFilter' });
        await filterPanel.openFilterPanel();
        since('YearParameterWithItselfDes filter description tooltip should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.getDescriptionTooltipText('YearParameterWithItselfDes'))
            .toBe('DES: Year Parameter');
        since('MonthParameterWithoutItselfDes filter info icon display should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterInfoIconDisplayed('MonthParameterWithoutItselfDes'))
            .toBe(false);
        since('CategoryWithNormalDes_WithItselfDes filter description tooltip should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.getDescriptionTooltipText('CategoryWithNormalDes_WithItselfDes'))
            .toBe("DSC: This is desc for category parameter");
        since('SubcategoryWithLongDes_WithoutItselfDes filter info icon display should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterInfoIconDisplayed('SubcategoryWithLongDes_WithoutItselfDes'))
            .toBe(false);
        since('ValueParameterWithoutDes filter info icon display should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterInfoIconDisplayed('ValueParameterWithoutDes'))
            .toBe(false);
        since('ValueParameterWithDes filter description tooltip should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.getDescriptionTooltipText('ValueParameterWithDes'))
            .toBe("DES: This is value parameter");
        await filterPanel.closeFilterPanelByCloseIcon();

        // check report parameter filter tooltip
        await toc.openPageFromTocMenu({ chapterName: 'ReportParameter Filter', pageName: 'ReportParameterFilter' });
        await filterPanel.openFilterPanel();
        since('ValueReportParameterWithDes filter description tooltip should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.getDescriptionTooltipText('ValueReportParameterWithDes'))
            .toBe("this is value report parameter");
        since('ValueReportParameterWithoutDes filter info icon display should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterInfoIconDisplayed('ValueReportParameterWithoutDes'))
            .toBe(false);
        since('ItemReportParameterWithItselfDes filter description tooltip should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.getDescriptionTooltipText('ItemReportParameterWithItselfDes'))
            .toBe("This is Item report parameter");
        since('MonthReportParameterWithoutItselfDes filter info icon display should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterInfoIconDisplayed('MonthReportParameterWithoutItselfDes'))
            .toBe(false);
        since('CategoryWithNormalDes_WithItselfDes filter description tooltip should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.getDescriptionTooltipText('CategoryWithNormalDes_WithItselfDes'))
            .toBe("This is category report parameter");
        since('CategoryWithNormalDes_WithoutItselfDes filter info icon display should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterInfoIconDisplayed('CategoryWithNormalDes_WithoutItselfDes'))
            .toBe(false);
        await filterPanel.closeFilterPanelByCloseIcon();

    });

    it('[TC97624] Validate ICS tooltip for library consumption mode', async () => {

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
        const ItemSelector = InCanvasSelector.createByAriaLable('Item,');
        const Month_renameSelector = InCanvasSelector.createByAriaLable('Month_rename');
        since('CategoryWithNormalDesSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await CategoryWithNormalDesSelector.getICSTargetTooltipText())
            .toBe("CategoryWithNormalDes\nNormalDes: There are 3 forms in Category.");
        since('CustomerRegionWithEmptySpaceDesSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await CustomerRegionWithEmptySpaceDesSelector.getICSTargetTooltipText())
            .toBe("CustomerRegionWithEmptySpaceDes");
        since('DAForItemWithSpecialDesSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await DAForItemWithSpecialDesSelector.isICSTitleTooltipDisplayed())
            .toBe(false);
        since('DAForCategoryWithi18nDesSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await DAForCategoryWithi18nDesSelector.getICSTargetTooltipText())
            .toBe("DAForCategoryWithi18nDes\nDES: 这是分类的描述信息");
        since('DAForSubcatWithMultiLineDesSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await DAForSubcatWithMultiLineDesSelector.getICSTargetTooltipText())
            .toBe("DAForSubcatWithMultiLineDes\nDes: line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9\nline10");
        since('SubcategoryWithLongDesSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await SubcategoryWithLongDesSelector.getICSTargetTooltipText())
            .toBe("SubcategoryWithLongDes\nLongDes: Subcategory with long long long long long long long long long long long long long long des");
        since('DAForMonthWithHTMLDesSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await DAForMonthWithHTMLDesSelector.getICSTargetTooltipText())
            .toBe(`DAForMonthWithHTMLDes\n<html>\n<p style="color: red;">\nTest Description\n</p>\n</html>`);
        since('DAForYearWithXSSDesSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await DAForYearWithXSSDesSelector.getICSTargetTooltipText())
            .toBe("DAForYearWithXSSDes_rename\nDES: <input type=\"text\" name=\"username\" value=\"<script>alert('XSS');</script>\" />");
        since('ItemSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await ItemSelector.getICSTargetTooltipText())
            .toBe("Item");
        since('Month_renameSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await Month_renameSelector.getICSTargetTooltipText())
            .toBe("Month");

        // check special tooltip when hide target bar
        await toc.openPageFromTocMenu({ chapterName: 'Element/Value ICS', pageName: 'ICS- Slider' });
        since('DAForItemWithSpecialDesSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await DAForItemWithSpecialDesSelector.getICSTargetTooltipText())
            .toBe("DAForItemWithSpecialDes\nDES: special key words @#&%(*)(@*(&%)($_)(_%)(#)*%)(#&%)(?;'[]\\\\]");
    
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
            .toBe("YearParameterWithItselfDes\nDES: Year Parameter");
        since('MonthParameterWithoutItselfDesSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await MonthParameterWithoutItselfDesSelector.getICSTargetTooltipText())
            .toBe("MonthParameterWithoutItselfDes_Rename");
        since('ValueParameterWithoutDesSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await ValueParameterWithoutDesSelector.getICSTargetTooltipText(true))
            .toBe("ValueParameterWithoutDes");
        since('ValueParameterWithDesSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await ValueParameterWithDesSelector.getICSTargetTooltipText(true))
            .toBe("ValueParameterWithDes\nDES: This is value parameter");
        since('CategoryWithNormalDes_WithItselfDesSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await CategoryWithNormalDes_WithItselfDesSelector.getICSTargetTooltipText())
            .toBe("CategoryWithNormalDes_WithItselfDes\nDSC: This is desc for category parameter");
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
            .toBe("ValueReportParameterWithDes\nthis is value report parameter");
        since('ValueReportParameterWithoutDesReportSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await ValueReportParameterWithoutDesReportSelector.getICSTargetTooltipText(true))
            .toBe("ValueReportParameterWithoutDes");
        since('ItemReportParameterWithItselfDesReportSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await ItemReportParameterWithItselfDesReportSelector.getICSTargetTooltipText(true))
            .toBe("ItemReportParameterWithItselfDes\nThis is Item report parameter");
        since('MonthReportParameterWithoutItselfDesReportSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await MonthReportParameterWithoutItselfDesReportSelector.getICSTargetTooltipText(true))
            .toBe("MonthReportParameterWithoutItselfDes");
        since('CategoryWithNormalDes_WithItselfDesReportSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await CategoryWithNormalDes_WithItselfDesReportSelector.getICSTargetTooltipText(true))
            .toBe("CategoryWithNormalDes_WithItselfDes\nThis is category report parameter");
        since('CategoryWithNormalDes_WithoutItselfDesReportSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await CategoryWithNormalDes_WithoutItselfDesReportSelector.getICSTargetTooltipText(true))
            .toBe("CategoryWithNormalDes_WithoutItselfDes");
    });

    
    
});
export const config = specConfiguration;
