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
        id: '693E72434C3941A56CEC3DAA06BAA8C7',
        name: '(AUTO) FilterAndICSTooltip_E2E',
        project: tutorialProject,
    };

    let { libraryPage, toc, dossierPage, loginPage, filterPanel, } = browsers.pageObj1;

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

    it('[TC97555_03] Validate filter tooltip for library consumption mode', async () => {

        // Check normal filter tooltip
        await toc.openPageFromTocMenu({ chapterName: 'Filter', pageName: 'Filter' });
        await filterPanel.openFilterPanel();
        since('CategoryWithNormalDes filter description tooltip should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.getDescriptionTooltipText('CategoryWithNormalDes'))
            .toBe('NormalDes: There are 3 forms in Category.');
        since('Item filter info icon display should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterInfoIconDisplayed('Item'))
            .toBe(false);
        await filterPanel.closeFilterPanelByCloseIcon();

        // Check parameter filter tooltip
        await toc.openPageFromTocMenu({ chapterName: 'Parameter Filter', pageName: 'ParameterFilter' });
        await filterPanel.openFilterPanel();
        since('YearParameterWithItselfDes filter description tooltip should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.getDescriptionTooltipText('YearParameterWithItselfDes'))
            .toBe('DES: Year Parameter');
        since('MonthParameterWithoutItselfDes filter info icon display should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterInfoIconDisplayed('MonthParameterWithoutItselfDes'))
            .toBe(false);
        await filterPanel.closeFilterPanelByCloseIcon();

        // check report parameter filter tooltip
        await toc.openPageFromTocMenu({ chapterName: 'ReportParameter Filter', pageName: 'ReportParameterFilter' });
        await filterPanel.openFilterPanel();
        since('ValueReportParameterWithDes filter description tooltip should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.getDescriptionTooltipText('ValueReportParameterWithDes'))
            .toBe('this is value report parameter');
        since(
            'ValueReportParameterWithoutDes filter info icon display should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.isFilterInfoIconDisplayed('ValueReportParameterWithoutDes'))
            .toBe(false);
        await filterPanel.closeFilterPanelByCloseIcon();

        // Check ics tooltip
        await toc.openPageFromTocMenu({ chapterName: 'Element/Value ICS', pageName: 'ICS- CheckBox' });
        const CategoryWithNormalDesSelector = InCanvasSelector.createByAriaLable('CategoryWithNormalDes');
        // item ICS
        const ItemSelector = InCanvasSelector.createByAriaLable('Item,');
        since('CategoryWithNormalDesSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await CategoryWithNormalDesSelector.getICSTargetTooltipText())
            .toBe('CategoryWithNormalDes\nNormalDes: There are 3 forms in Category.');
        since('ItemSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await ItemSelector.getICSTargetTooltipText())
            .toBe('Item');

        // check parameter ICS
        await toc.openPageFromTocMenu({ chapterName: 'Parameter ICS', pageName: 'ParameterICS' });
        const YearParameterWithItselfDesSelector = InCanvasSelector.createByAriaLable('YearParameterWithItselfDes');
        const MonthParameterWithoutItselfDesSelector = InCanvasSelector.createByAriaLable(
            'MonthParameterWithoutItselfDes'
        );
        since('YearParameterWithItselfDesSelector ICS target tooltip should be #{expected}, instead we have #{actual}')
            .expect(await YearParameterWithItselfDesSelector.getICSTargetTooltipText())
            .toBe('YearParameterWithItselfDes\nDES: Year Parameter');
        since(
            'MonthParameterWithoutItselfDesSelector ICS target tooltip should be #{expected}, instead we have #{actual}'
        )
            .expect(await MonthParameterWithoutItselfDesSelector.getICSTargetTooltipText())
            .toBe('MonthParameterWithoutItselfDes_Rename');

        // check report parameter ICS
        await toc.openPageFromTocMenu({ chapterName: 'ReportParameter ICS', pageName: 'ReportParameterICS' });
        const ValueReportParameterWithDesReportSelector =
            InCanvasSelector.createByAriaLable('ValueReportParameterWithDes');
        const ValueReportParameterWithoutDesReportSelector = InCanvasSelector.createByAriaLable(
            'ValueReportParameterWithoutDes'
        );
        since(
            'ValueReportParameterWithDesReportSelector ICS target tooltip should be #{expected}, instead we have #{actual}'
        )
            .expect(await ValueReportParameterWithDesReportSelector.getICSTargetTooltipText(true))
            .toBe('ValueReportParameterWithDes\nthis is value report parameter');
        since(
            'ValueReportParameterWithoutDesReportSelector ICS target tooltip should be #{expected}, instead we have #{actual}'
        )
            .expect(await ValueReportParameterWithoutDesReportSelector.getICSTargetTooltipText(true))
            .toBe('ValueReportParameterWithoutDes');
    });
});
export const config = specConfiguration;
