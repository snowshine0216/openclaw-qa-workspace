import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';
import * as consts from '../../../constants/visualizations.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { AGGridHoverColor } from '../../../constants/grid.js';
import * as gridConstants from '../../../constants/grid.js';

const specConfiguration = { ...customCredentials('') };
const { credentials } = specConfiguration;

//npm run regression -- --baseUrl=https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --params.credentials.username=tqmsuser params.credentials.password=ddset --spec 'specs/regression/AG-Grid/ColumnUnitFormatting.spec.js'
describe('AG Grid - Column Unit Formatting', () => {
    const tutorialProject = {
        id: 'B628A31F11E7BD953EAE0080EF0583BD',
        name: 'New MicroStrategy Tutorials',
    };
    const CoumnUnitFormatE2E = {
        id: 'DDCC6D29473C6B8E31C2A1BF4CCFE2D2',
        name: 'Column Unit Formatting E2E',
        project: tutorialProject,
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let {
        dossierPage,
        libraryPage,
        formatPanel,
        newFormatPanelForGrid,
        reportGridView,
        reportFormatPanel,
        loginPage,
        agGridVisualization,
        vizPanelForGrid,
        toc,
        contentsPanel,
        baseVisualization,
        datasetPanel,
        dossierAuthoringPage,
        libraryAuthoringPage,
    } = browsers.pageObj1;

    beforeEach(async () => {
        if (!(await loginPage.isLoginPageDisplayed())) {
            await browser.url(new URL('auth/ui/loginPage', browser.options.baseUrl).toString(), 100000);
        }
        await loginPage.login(consts.tqmsUser.credentials);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC97778_01] Column/unit level formatting E2E', async () => {
        const url = browser.options.baseUrl + `app/${tutorialProject.id}/${CoumnUnitFormatE2E.id}/edit`;
        await libraryPage.openDossierByUrl(url.toString());

        await formatPanel.switchToFormatPanel();
        await newFormatPanelForGrid.switchToTextFormatTab();

        // Format Column Set 1 Header
        await formatPanel.switchToFormatPanel();
        await newFormatPanelForGrid.selectGridSegment('Column Set 1');
        await newFormatPanelForGrid.selectGridColumns('Headers');
        await newFormatPanelForGrid.selectTextFont('Oleo Script');
        await newFormatPanelForGrid.setTextFontSize('16');
        await newFormatPanelForGrid.clickFontColorBtn();
        await newFormatPanelForGrid.clickBuiltInColor('#4F60D6');

        await since(
            'After formatting Column Set 1 Headers, the grid cells in ag-grid "Visualization 1" at "0", "2"-"3" should have style "color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellStyleByRows(2, 3, 0, 'color'))
            .toEqual(Array(2).fill('rgba(79,96,214,1)'));

        await since(
            'After formatting Column Set 1 Headers, the grid cells in ag-grid "Visualization 1" at "0", "2"-"3" should have style "font-family" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellStyleByRows(2, 3, 0, 'font-family'))
            .toEqual(Array(2).fill('oleo script'));

        await since(
            'After formatting Column Set 1 Headers, the grid cells in ag-grid "Visualization 1" at "0", "0"-"1" should have style "color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellStyleByRows(0, 1, 0, 'color'))
            .toEqual(Array(2).fill('rgba(53,56,58,1)'));

        await since(
            'After formatting Column Set 1 Headers, the grid cells in ag-grid "Visualization 1" at "0", "0"-"1" should have style "font-family" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellStyleByRows(0, 1, 0, 'font-family'))
            .toEqual(Array(2).fill('open sans'));

        await since(
            'After formatting Column Set 1 Headers, the grid cells in ag-grid "Visualization 1" at "2", "0"-"7" should have style "color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellStyleByRows(0, 7, 2, 'color'))
            .toEqual(Array(8).fill('rgba(53,56,58,1)'));

        await since(
            'After formatting Column Set 1 Headers, the grid cells in ag-grid "Visualization 1" at "3", "0"-"6" should have style "font-family" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellStyleByRows(1, 7, 3, 'font-family'))
            .toEqual(Array(7).fill('open sans'));

        // Format Column Set 1 Value
        await formatPanel.switchToFormatPanel();
        await newFormatPanelForGrid.selectGridColumns('Values');
        await newFormatPanelForGrid.selectTextFont('Noto Sans');
        await newFormatPanelForGrid.setTextFontSize('10');
        await newFormatPanelForGrid.selectFontAlign('left');
        await newFormatPanelForGrid.changeCellsFillColor('#DEDDFF');

        await since(
            'After formatting Column Set 1 Values, the grid cells in ag-grid "Visualization 1" at "2", "2"-"3" should have style "background-color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellStyleByRows(2, 3, 2, 'background-color'))
            .toEqual(Array(2).fill('rgba(222,221,255,1)'));

        await since(
            'After formatting Column Set 1 Values, the grid cells in ag-grid "Visualization 1" at "2", "2"-"3" should have style "font-family" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellStyleByRows(2, 3, 2, 'font-family'))
            .toEqual(Array(2).fill('noto sans'));

        await since(
            'After formatting Column Set 1 Values, the grid cells in ag-grid "Visualization 1" at "0", "2"-"3" should have style "background-color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellStyleByRows(2, 3, 0, 'background-color'))
            .toEqual(Array(2).fill('rgba(255,255,255,1)'));

        await since(
            'After formatting Column Set 1 Values, the grid cells in ag-grid "Visualization 1" at "0", "2"-"3" should have style "font-family" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellStyleByRows(2, 3, 0, 'font-family'))
            .toEqual(Array(2).fill('oleo script'));

        await since(
            'After formatting Column Set 1 Values, the grid cells in ag-grid "Visualization 1" at "2"-"8", "1" should have style "background-color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellStyleByCols(2, 8, 1, 'background-color'))
            .toEqual(Array(7).fill('rgba(255,255,255,1)'));

        await since(
            'After formatting Column Set 1 Values, the grid cells in ag-grid "Visualization 1" at "2"-"8", "1" should have style "font-family" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellStyleByCols(2, 8, 1, 'font-family'))
            .toEqual(Array(7).fill('open sans'));

        await since(
            'After formatting Column Set 1 Values, the grid cells in ag-grid "Visualization 1" at "2"-"8", "5" should have style "background-color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellStyleByCols(2, 8, 5, 'background-color'))
            .toEqual(Array(7).fill('rgba(255,255,255,1)'));

        await since(
            'After formatting Column Set 1 Values, the grid cells in ag-grid "Visualization 1" at "2"-"8", "5" should have style "font-family" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellStyleByCols(2, 8, 5, 'font-family'))
            .toEqual(Array(7).fill('open sans'));

        // Format Cost Header
        await formatPanel.switchToFormatPanel();
        await newFormatPanelForGrid.selectGridSegment('Cost');
        await newFormatPanelForGrid.selectGridColumns('Headers');
        await newFormatPanelForGrid.selectFontStyle('italic');
        await newFormatPanelForGrid.setTextFontSize('12');

        await since(
            'After formatting Cost Headers, the grid cell in ag-grid "Visualization 1" at "0", "2" should have style "font-style" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 2, 'font-style'))
            .toEqual('italic');

        await since(
            'After formatting Cost Headers, the grid cell in ag-grid "Visualization 1" at "0", "2" should have style "font-size" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 2, 'font-size'))
            .toEqual('16px');

        await since(
            'After formatting Cost Headers, the grid cell in ag-grid "Visualization 1" at "0", "3" should have style "font-style" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 3, 'font-style'))
            .toEqual('normal');

        await since(
            'After formatting Cost Headers, the grid cell in ag-grid "Visualization 1" at "0", "3" should have style "font-size" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 3, 'font-size'))
            .toEqual('21.33px');

        await since(
            'After formatting Cost Headers, the grid cell in ag-grid "Visualization 1" at "1", "4" should have style "font-style" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 4, 'font-style'))
            .toEqual('normal');

        await since(
            'After formatting Cost Headers, the grid cell in ag-grid "Visualization 1" at "1", "4" should have style "font-size" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 4, 'font-size'))
            .toEqual('10.67px');

        await since(
            'After formatting Cost Headers, the grid cells in ag-grid "Visualization 1" at "0", "0"-"1" should have style "font-style" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellStyleByRows(0, 1, 0, 'font-style'))
            .toEqual(Array(2).fill('normal'));

        await since(
            'After formatting Cost Headers, the grid cells in ag-grid "Visualization 1" at "2"-"8", "2" should have style "font-size" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellStyleByCols(2, 8, 2, 'font-size'))
            .toEqual(Array(7).fill('13.33px'));

        // Format Profit Value
        await formatPanel.switchToFormatPanel();
        await newFormatPanelForGrid.selectGridSegment('Profit');
        await newFormatPanelForGrid.selectGridColumns('Values');
        await newFormatPanelForGrid.selectFontAlign('right');
        await reportFormatPanel.selectOptionFromBorderStyleDropdown('1 point double', 'bottom');
        await reportFormatPanel.selectOptionFromBorderColorDropdown('#04BA22', 'bottom');
        await reportFormatPanel.closeBorderColorDropdown('bottom');

        await since(
            'After formatting Profit Values, the grid cells in ag-grid "Visualization 1" at "2"-"8", "3" should have style "border-bottom-color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellStyleByCols(2, 8, 3, 'border-bottom-color'))
            .toEqual(Array(7).fill('rgba(4,186,34,1)'));

        await since(
            'After formatting Profit Values, the grid cells in ag-grid "Visualization 1" at "2"-"8", "3" should have style "border-bottom-style" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellStyleByCols(2, 8, 3, 'border-bottom-style'))
            .toEqual(Array(7).fill('double'));

        await since(
            'After formatting Profit Values, the grid cells in ag-grid "Visualization 1" at "2"-"8", "3" should have style "border-bottom-width" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellStyleByCols(2, 8, 3, 'border-bottom-width'))
            .toEqual(Array(7).fill('3px'));

        await since(
            'After formatting Profit Values, the grid cells in ag-grid "Visualization 1" at "2"-"8", "3" should have style "text-align" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellStyleByCols(2, 8, 3, 'text-align'))
            .toEqual(Array(7).fill('right'));

        await since(
            'After formatting Profit Values, the grid cells in ag-grid "Visualization 1" at "2"-"8", "2" should have style "border-bottom-color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellStyleByCols(2, 8, 2, 'border-bottom-color'))
            .toEqual(Array(7).fill('rgba(235,235,235,1)'));

        await since(
            'After formatting Profit Values, the grid cells in ag-grid "Visualization 1" at "2"-"8", "2" should have style "border-bottom-style" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellStyleByCols(2, 8, 2, 'border-bottom-style'))
            .toEqual(Array(7).fill('solid'));

        await since(
            'After formatting Profit Values, the grid cells in ag-grid "Visualization 1" at "2"-"8", "2" should have style "border-bottom-width" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellStyleByCols(2, 8, 2, 'border-bottom-width'))
            .toEqual(Array(7).fill('1px'));

        await since(
            'After formatting Profit Values, the grid cells in ag-grid "Visualization 1" at "2"-"8", "2" should have style "text-align" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellStyleByCols(2, 8, 2, 'text-align'))
            .toEqual(Array(7).fill('left'));

        //Format All Attributes
        await formatPanel.switchToFormatPanel();
        await newFormatPanelForGrid.selectGridSegment('All Attributes');
        await newFormatPanelForGrid.clickFontColorBtn();
        await newFormatPanelForGrid.clickBuiltInColor('#DB6657');

        await since(
            'After formatting All Attributes, the grid cells in ag-grid "Visualization 1" at "0", "0"-"1" should have style "color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellStyleByRows(0, 1, 0, 'color'))
            .toEqual(Array(2).fill('rgba(219,102,87,1)'));

        await since(
            'After formatting All Attributes, the grid cells in ag-grid "Visualization 1" at "0", "2"-"3" should have style "color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellStyleByRows(2, 3, 0, 'color'))
            .toEqual(Array(2).fill('rgba(79,96,214,1)'));

        await since(
            'After formatting All Attributes, the grid cells in ag-grid "Visualization 1" at "0", "4"-"7" should have style "color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellStyleByRows(4, 7, 0, 'color'))
            .toEqual(Array(4).fill('rgba(219,102,87,1)'));

        await since(
            'After formatting All Attributes, the grid cells in ag-grid "Visualization 1" at "1", "4"-"7" should have style "color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellStyleByRows(4, 7, 1, 'color'))
            .toEqual(Array(4).fill('rgba(53,56,58,1)'));

        await since(
            'After formatting All Attributes, the grid cell in ag-grid "Visualization 1" at "2" "0" should have style "color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(2, 0, 'color'))
            .toEqual('rgba(219,102,87,1)');

        await since(
            'After formatting All Attributes, the grid cells in ag-grid "Visualization 1" at "2"-"8", "1" should have style "color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellStyleByCols(2, 8, 1, 'color'))
            .toEqual(Array(7).fill('rgba(219,102,87,1)'));

        //Format Individual Attribute Region
        await formatPanel.switchToFormatPanel();
        await newFormatPanelForGrid.selectGridSegment('Region');
        await newFormatPanelForGrid.selectGridColumns('Headers');
        await newFormatPanelForGrid.clickFontColorBtn();
        await newFormatPanelForGrid.clickBuiltInColor('#16B0FF');
        await newFormatPanelForGrid.selectGridColumns('Elements');
        await newFormatPanelForGrid.clickFontColorBtn();
        await newFormatPanelForGrid.clickBuiltInColor('#AADED7');

        await since(
            'After formatting Attribute Region, the grid cell in ag-grid "Visualization 1" at "0", "1" should have style "color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 1, 'color'))
            .toEqual('rgba(22,176,255,1)');

        await since(
            'After formatting Attribute Region, the grid cells in ag-grid "Visualization 1" at "0", "2"-"3" should have style "color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellStyleByRows(2, 3, 0, 'color'))
            .toEqual(Array(2).fill('rgba(79,96,214,1)'));

        await since(
            'After formatting Attribute Region, the grid cells in ag-grid "Visualization 1" at "0", "4"-"7" should have style "color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellStyleByRows(4, 7, 0, 'color'))
            .toEqual(Array(4).fill('rgba(219,102,87,1)'));

        await since(
            'After formatting Attribute Region, the grid cells in ag-grid "Visualization 1" at "1", "4"-"7" should have style "color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellStyleByRows(4, 7, 1, 'color'))
            .toEqual(Array(4).fill('rgba(53,56,58,1)'));

        await since(
            'After formatting Attribute Region, the grid cell in ag-grid "Visualization 1" at "0", "0" should have style "color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 0, 'color'))
            .toEqual('rgba(219,102,87,1)');

        await since(
            'After formatting Attribute Region, the grid cell in ag-grid "Visualization 1" at "2", "0" should have style "color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(2, 0, 'color'))
            .toEqual('rgba(219,102,87,1)');

        await since(
            'After formatting Attribute Region, the grid cells in ag-grid "Visualization 1" at "2"-"8", "1" should have style "color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellStyleByCols(2, 8, 1, 'color'))
            .toEqual(Array(7).fill('rgba(170,222,215,1)'));
    });

    it('[TC97778_02] DE319997 grid cell hover/select color', async () => {
        // Open dossier in consumption mode
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > Defects > DE319997 Grid Cell Hover Color
        const url = new URL(`app/${AGGridHoverColor.project.id}/${AGGridHoverColor.id}`, browser.options.baseUrl);
        await libraryPage.openDossierByUrl(url.toString());
        // wait for animation
        await browser.pause(2000);
        // switch to page "normal grid" in consumption mode
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Normal Grid' });
        // hover on cell "USA" in row
        await vizPanelForGrid.hoverOnGridElement('USA', 'Normal Grid');
        // check the background color when hovered by screenshot
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Normal Grid'),
            'DE319997_01',
            'Background color of cell in normal grid when hovered'
        );
        // click on cell "USA" in row
        await vizPanelForGrid.clickOnGridElementWithoutLoading('USA', 'Normal Grid');
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Normal Grid'),
            'DE319997_02',
            'Background color of cell in normal grid when selected'
        );
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Compound Grid' });
        // hover on cell "USA" in row
        await vizPanelForGrid.hoverOnGridElement('USA', 'Compound Grid');
        // check the background color when hovered by screenshot
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Compound Grid'),
            'DE319997_03',
            'Background color of cell in compound grid when hovered'
        );
        // click on cell "USA" in row
        await vizPanelForGrid.clickOnGridElementWithoutLoading('USA', 'Compound Grid');
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Compound Grid'),
            'DE319997_04',
            'Background color of cell in compound grid when selected'
        );

        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'AG Grid' });
        // hover on cell "USA" in row
        await agGridVisualization.hoverOnAGGridCell('USA', 'AG Grid');
        // check the background color when hovered by screenshot
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('AG Grid'),
            'DE319997_05',
            'Background color of cell in AG Grid when hovered'
        );
        // click on cell "USA" in row
        await agGridVisualization.clickOnAGGridCell('USA', 'AG Grid');
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('AG Grid'),
            'DE319997_06',
            'Background color of cell in AG Grid when selected'
        );
        // Open the dossier in edit mode
        await libraryPage.editDossierByUrl({
            projectId: AGGridHoverColor.project.id,
            dossierId: AGGridHoverColor.id,
        });
        // switch to "Normal Grid" page
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Normal Grid' });
        // hover on cell "USA" in row
        await vizPanelForGrid.hoverOnGridElement('USA', 'Normal Grid');
        // check the background color when hovered by screenshot
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Normal Grid'),
            'DE319997_07',
            'Background color of cell in normal grid when hovered'
        );
        // click on cell "USA" in row
        await vizPanelForGrid.clickOnGridElementWithoutLoading('USA', 'Normal Grid');
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Normal Grid'),
            'DE319997_08',
            'Background color of cell in normal grid when selected'
        );
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Compound Grid' });
        // hover on cell "USA" in row
        await vizPanelForGrid.hoverOnGridElement('USA', 'Compound Grid');
        // check the background color when hovered by screenshot
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Compound Grid'),
            'DE319997_09',
            'Background color of cell in compound grid when hovered'
        );
        // click on cell "USA" in row
        await vizPanelForGrid.clickOnGridElementWithoutLoading('USA', 'Compound Grid');
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Compound Grid'),
            'DE319997_10',
            'Background color of cell in compound grid when selected'
        );

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'AG Grid' });
        // hover on cell "USA" in row
        await agGridVisualization.hoverOnAGGridCell('USA', 'AG Grid');
        // check the background color when hovered by screenshot
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('AG Grid'),
            'DE319997_11',
            'Background color of cell in AG Grid when hovered'
        );
        // click on cell "USA" in row
        await agGridVisualization.clickOnAGGridCell('USA', 'AG Grid');
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('AG Grid'),
            'DE319997_12',
            'Background color of cell in AG Grid when selected'
        );
    });

    it('[TC97778_03] DE323462 fit content should work when change font size for attribute or metric', async () => {
        // Edit dossier by its ID "755A8D3B614D64690297FB8DA4EAB5B9"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > AGGrid_CreateGrid_TC71081
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridCreate.project.id,
            dossierId: gridConstants.AGGridCreate.id,
        });
        await baseVisualization.changeVizType('Visualization 1', 'Grid', 'Grid (Modern)');

        // Add attribute and metrics to grid
        await datasetPanel.addObjectToVizByDoubleClick('Airline Name', 'attribute', 'Airline Data');
        await datasetPanel.addObjectToVizByDoubleClick('Origin Airport', 'attribute', 'Airline Data');
        await datasetPanel.addObjectToVizByDoubleClick('Flights Delayed', 'metric', 'Airline Data');
        await datasetPanel.addObjectToVizByDoubleClick('Flights Cancelled', 'metric', 'Airline Data');

        // Switch to format panel
        await formatPanel.switchToFormatPanel();
        await newFormatPanelForGrid.switchToTextFormatTab();
        // Change font size for attribute "Origin Airport"
        await newFormatPanelForGrid.selectGridSegment('Origin Airport');
        await newFormatPanelForGrid.setTextFontSize('15');
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'TC97778_03_01',
            'Change font size for attribute "Origin Airport"'
        );
        // Change font size for metric "Flights Cancelled"
        await newFormatPanelForGrid.selectGridSegment('Flights Cancelled');
        await newFormatPanelForGrid.setTextFontSize('30');
        // Take screenshot for grid with font size for attribute "Origin Airport" and metric "Flights Cancelled"
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'TC97778_03_02',
            'Change font size for metric "Flights Cancelled"'
        );

        // check in consumption mode
        await dossierAuthoringPage.actionOnMenubarWithSubmenu('File', 'Save As...');
        await browser.pause(2000);
        await libraryAuthoringPage.saveInMyReport(gridConstants.AGGrid_Column_Unit_Formatting_Consumption.name);

        await resetDossierState({
            credentials: gridConstants.gridUser,
            dossier: gridConstants.AGGrid_Column_Unit_Formatting_Consumption,
        });
        await libraryPage.openDossierById({
            projectId: gridConstants.AGGrid_Column_Unit_Formatting_Consumption.project.id,
            dossierId: gridConstants.AGGrid_Column_Unit_Formatting_Consumption.id,
        });
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'TC97778_03_03',
            'Change font size for attribute "Origin Airport" and metric "Flights Cancelled" should work well in consumption mode'
        );

    });
});
export const config = specConfiguration;
