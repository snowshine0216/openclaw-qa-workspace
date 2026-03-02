import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import * as gridConstants from '../../../constants/grid.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

const specConfiguration = { ...customCredentials('_sort') };
const { credentials } = specConfiguration;

//npm run regression -- --baseUrl=https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --spec 'specs/regression/classicGrid/NormalGrid_FormatToolBox.spec.js'
describe('Normal Grid Format Tool Box', () => {
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    beforeAll(async () => {
        await loginPage.login(gridConstants.gridUser);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {});

    let {
        libraryPage,
        vizPanelForGrid,
        datasetPanel,
        loginPage,
        formatPanelForGridBase,
        formatPanel,
        formatPanelForGridToolBox,
        baseFormatPanel,
        contentsPanel,
    } = browsers.pageObj1;

    it('[TC24299] Format Tool Box General Settings', async () => {
         // Edit dossier by its ID "B9F6A25111EB238D4B550080EF95F2EA"
         // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > AGGrid_IncrementalFetch
         await libraryPage.editDossierByUrl({
             projectId: gridConstants.AGGridIncrementalFetch.project.id,
             dossierId: gridConstants.AGGridIncrementalFetch.id,
         });

         await datasetPanel.addObjectToVizByDoubleClick('Month', 'attribute', 'retail-sample-data.xls');
         await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'retail-sample-data.xls');
         await vizPanelForGrid.openFormatToolBoxFromColumnHeader('Month','Visualization 1');
         await formatPanelForGridBase.selectTextFont('Oleo Script');
         await formatPanelForGridBase.selectTextFontBold();
         await formatPanelForGridBase.selectTextFontItalic();
         await formatPanelForGridBase.selectTextFontUnderline();
        await formatPanelForGridBase.selectTextFontStrikethrough();
        await formatPanelForGridBase.setTextFontSize('28');
        // When I open the font color menu in the tool box
        await formatPanelForGridBase.selectTextFontColorButton();

        // When I open the color swatch menu
        await formatPanel.selectAdvancedColorSwatchMenu();
        // When I select the built-in color "Plum"
        await formatPanel.selectAdvancedColorBuiltInSwatch('Plum');
    
        // When I select the text alignment "center" in the tool box
        await formatPanelForGridToolBox.selectTextAlign('center');
    
        // When I select the text alignment "right" in the tool box
        await formatPanelForGridToolBox.selectTextAlign('right');
    
        // When I select the text alignment "justify" in the tool box
        await formatPanelForGridToolBox.selectTextAlign('justify');
    
        // When I select the text alignment "left" in the tool box
        await formatPanelForGridToolBox.selectTextAlign('left');
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'TC24299_01',
            'Format Tool Box General Settings'
        );

    });

    it('[TC2702] Format Tool Box Regression Test', async () => {
        // Edit dossier by its ID "FCD08C9872457766C1BB0A8B71E3E9EC"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > Grid > TC2702 RMC ToolBox
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.Grid_Format_ToolBox.project.id,
            dossierId: gridConstants.Grid_Format_ToolBox.id,
        });

        // When I right click on the attribute "Supplier" and select Format from grid visualization "attributes in rows and metrics in columns"
        await vizPanelForGrid.openFormatToolBoxFromColumnHeader('Supplier','attributes in rows and metrics in columns');
        // Then I pause execution for 1 seconds
        await browser.pause(1000);

        // When I change the font size to "12" in the tool box
        await formatPanelForGridBase.setTextFontSize('12');
        // Then I pause execution for 2 seconds
        await browser.pause(2000);
        // Then the grid cell in visualization "attributes in rows and metrics in columns" at "1", "1" has style "font-size" with value "16px"
        await since(
            'Grid cell in visualization "attributes in rows and metrics in columns" at "1", "1" should have font-size with value #{expected} instead we have #{actual}'
        )
            .expect((await vizPanelForGrid.getGridCellByPosition("1", "1", "attributes in rows and metrics in columns").getCSSProperty("font-size")).value)
            .toContain('16px')
        // And the grid cell in visualization "attributes in rows and metrics in columns" at "2", "1" has style "font-size" with value "10.6667px"
        await since(
            'Grid cell in visualization "attributes in rows and metrics in columns" at "2", "1" should have font-size with value #{expected} instead we have #{actual}'
        )
            .expect((await vizPanelForGrid.getGridCellByPosition("2", "1", "attributes in rows and metrics in columns").getCSSProperty("font-size")).value)
            .toContain('10.6667px')
        // And the grid cell in visualization "attributes in rows and metrics in columns" at "2", "3" has style "font-size" with value "10.6667px"
        await since(
            'Grid cell in visualization "attributes in rows and metrics in columns" at "2", "3" should have font-size with value #{expected} instead we have #{actual}'
        )
            .expect((await vizPanelForGrid.getGridCellByPosition("2", "3", "attributes in rows and metrics in columns").getCSSProperty("font-size")).value)
            .toContain('10.6667px')


        // When I right click on the attribute "20th Century Fox" and select Format from grid visualization "attributes in rows and metrics in columns"
        await vizPanelForGrid.openFormatToolBoxFromColumnHeader('20th Century Fox','attributes in rows and metrics in columns');
        // Then I pause execution for 2 seconds
        await browser.pause(2000);
        // When I select bold on the font in the tool box
        await formatPanelForGridBase.selectTextFontBold();
        // Then I pause execution for 2 seconds
        await browser.pause(2000);
        // Then the grid cell in visualization "attributes in rows and metrics in columns" at "1", "1" has style "font-weight" with value "700"
        await since(
            'Grid cell in visualization "attributes in rows and metrics in columns" at "1", "1" should have font-weight with value #{expected} instead we have #{actual}'
        )
            .expect((await vizPanelForGrid.getGridCellByPosition("1", "1", "attributes in rows and metrics in columns").getCSSProperty("font-weight")).value.toString())
            .toBe('700')
        // And the grid cell in visualization "attributes in rows and metrics in columns" at "2", "1" has style "font-weight" with value "700"
        await since(
            'Grid cell in visualization "attributes in rows and metrics in columns" at "2", "1" should have font-weight with value #{expected} instead we have #{actual}'
        )
            .expect((await vizPanelForGrid.getGridCellByPosition("2", "1", "attributes in rows and metrics in columns").getCSSProperty("font-weight")).value.toString())
            .toBe('700');

        // And the grid cell in visualization "attributes in rows and metrics in columns" at "2", "3" has style "font-weight" with value "400"
        await since(
            'Grid cell in visualization "attributes in rows and metrics in columns" at "2", "3" should have font-weight with value #{expected} instead we have #{actual}'
        )
            .expect((await vizPanelForGrid.getGridCellByPosition("2", "3", "attributes in rows and metrics in columns").getCSSProperty("font-weight")).value.toString())
            .toBe('400');

        // When I right click on the attribute "$1,560,568" and select Format from grid visualization "attributes in rows and metrics in columns"
        await vizPanelForGrid.openFormatToolBoxFromColumnHeader('$1,560,568','attributes in rows and metrics in columns');
        // Then I pause execution for 2 seconds
        await browser.pause(2000);
        // When I open the font color menu in the tool box
        await formatPanelForGridBase.selectTextFontColorButton();
        // When I open the color swatch menu
        await formatPanel.selectAdvancedColorSwatchMenu();
        // When I select the built-in color "Red"
        await formatPanel.selectAdvancedColorBuiltInSwatch('Red');
        // Then I pause execution for 2 seconds
        await browser.pause(2000);
        // Then the grid cell in visualization "attributes in rows and metrics in columns" at "1", "1" has style "color" with value "rgba(53, 56, 58, 1)"
        await since(
            'Grid cell in visualization "attributes in rows and metrics in columns" at "1", "1" should have color with value #{expected} instead we have #{actual}'
        )
        .expect(
            (await vizPanelForGrid.getGridCellByPosition('1', '1', 'attributes in rows and metrics in columns').getCSSProperty('color')).value
        )
        .toContain('53,56,58,1');
        // And the grid cell in visualization "attributes in rows and metrics in columns" at "2", "1" has style "color" with value "rgba(53, 56, 58, 1)"
        await since(
            'Grid cell in visualization "attributes in rows and metrics in columns" at "2", "1" should have color with value #{expected} instead we have #{actual}'
        )
        .expect(
            (await vizPanelForGrid.getGridCellByPosition('2', '1', 'attributes in rows and metrics in columns').getCSSProperty('color')).value
        )
        .toContain('53,56,58,1');
        // And the grid cell in visualization "attributes in rows and metrics in columns" at "2", "3" has style "color" with value "rgba(255, 0, 0, 1)"
        
        await since(
            'Grid cell in visualization "attributes in rows and metrics in columns" at "2", "3" should have color with value #{expected} instead we have #{actual}'
        )
        .expect(
            (await vizPanelForGrid.getGridCellByPosition('2', '3', 'attributes in rows and metrics in columns').getCSSProperty('color')).value
        )
        .toContain('255,0,0,1');
        
        // When I right click on the attribute "Supplier" and select Format from grid visualization "attributes in columns and metrics in rows"
        await vizPanelForGrid.openFormatToolBoxFromColumnHeader('Supplier','attributes in columns and metrics in rows');
        // Then I pause execution for 3 seconds
        await browser.pause(3000);
        // When I select the font size "9" in the tool box
        await formatPanelForGridBase.setTextFontSize('9');
        // Then I pause execution for 2 seconds
        await browser.pause(2000);
        // Then the grid cell in visualization "attributes in columns and metrics in rows" at "1", "1" has style "font-size" with value "12px"
        await since(
            'Grid cell in visualization "attributes in columns and metrics in rows" at "1", "1" should have font-size with value #{expected} instead we have #{actual}'
        )
            .expect((await vizPanelForGrid.getGridCellByPosition("1", "1", "attributes in columns and metrics in rows").getCSSProperty("font-size")).value)
            .toContain('12px')
        // And the grid cell in visualization "attributes in columns and metrics in rows" at "2", "1" has style "font-size" with value "12px"
        await since(
            'Grid cell in visualization "attributes in columns and metrics in rows" at "2", "1" should have font-size with value #{expected} instead we have #{actual}'
        )
            .expect((await vizPanelForGrid.getGridCellByPosition("2", "1", "attributes in columns and metrics in rows").getCSSProperty("font-size")).value)
            .toContain('12px')
        // And the grid cell in visualization "attributes in columns and metrics in rows" at "3", "1" has style "font-size" with value "10.6667px"
        await since(
            'Grid cell in visualization "attributes in columns and metrics in rows" at "3", "1" should have font-size with value #{expected} instead we have #{actual}'
        )
            .expect((await vizPanelForGrid.getGridCellByPosition("3", "1", "attributes in columns and metrics in rows").getCSSProperty("font-size")).value)
            .toContain('10.6667px')
        // And the grid cell in visualization "attributes in columns and metrics in rows" at "3", "2" has style "font-size" with value "10.6667px"
        await since(
            'Grid cell in visualization "attributes in columns and metrics in rows" at "3", "2" should have font-size with value #{expected} instead we have #{actual}'
        )
            .expect((await vizPanelForGrid.getGridCellByPosition("3", "2", "attributes in columns and metrics in rows").getCSSProperty("font-size")).value)
            .toContain('10.6667px')

        // When I right click on the attribute "Cost" and select Format from grid visualization "attributes in columns and metrics in rows"
        await vizPanelForGrid.openFormatToolBoxFromColumnHeader('Cost','attributes in columns and metrics in rows');
        // Then I pause execution for 2 seconds
        await browser.pause(2000);
        // When I select italic on the font in the tool box
        await formatPanelForGridBase.selectTextFontItalic();
        // Then I pause execution for 2 seconds
        await browser.pause(2000);
        // Then the grid cell in visualization "attributes in columns and metrics in rows" at "1", "1" has style "font-style" with value "normal"
        await since(
            'Grid cell in visualization "attributes in columns and metrics in rows" at "1", "1" should have font-style with value #{expected} instead we have #{actual}'
        )
            .expect((await vizPanelForGrid.getGridCellByPosition("1", "1", "attributes in columns and metrics in rows").getCSSProperty("font-style")).value)
            .toBe('normal')
        // And the grid cell in visualization "attributes in columns and metrics in rows" at "2", "1" has style "font-style" with value "normal"
        await since(
            'Grid cell in visualization "attributes in columns and metrics in rows" at "2", "1" should have font-style with value #{expected} instead we have #{actual}'
        )
            .expect((await vizPanelForGrid.getGridCellByPosition("2", "1", "attributes in columns and metrics in rows").getCSSProperty("font-style")).value)
            .toBe('normal');
        // And the grid cell in visualization "attributes in columns and metrics in rows" at "3", "1" has style "font-style" with value "italic"
        await since(
            'Grid cell in visualization "attributes in columns and metrics in rows" at "3", "1" should have font-style with value #{expected} instead we have #{actual}'
        )
            .expect((await vizPanelForGrid.getGridCellByPosition("3", "1", "attributes in columns and metrics in rows").getCSSProperty("font-style")).value)
            .toBe('italic');
        // And the grid cell in visualization "attributes in columns and metrics in rows" at "3", "2" has style "font-style" with value "normal"
        await since(
            'Grid cell in visualization "attributes in columns and metrics in rows" at "3", "2" should have font-style with value #{expected} instead we have #{actual}'
        )
            .expect((await vizPanelForGrid.getGridCellByPosition("3", "2", "attributes in columns and metrics in rows").getCSSProperty("font-style")).value)
            .toBe('normal');


        // When I right click on the attribute "$969,712" and select Format from grid visualization "attributes in columns and metrics in rows"
        await vizPanelForGrid.openFormatToolBoxFromColumnHeader('$969,712','attributes in columns and metrics in rows');
        // Then I pause execution for 2 seconds
        await browser.pause(2000);
        // When I select the text alignment "center" in the tool box
        await formatPanelForGridToolBox.selectTextAlign('center');
        // Then I pause execution for 2 seconds
        await browser.pause(2000);
        // Then the grid cell in visualization "attributes in columns and metrics in rows" at "1", "1" has style "text-align" with value "left"
        await since(
            'Grid cell in visualization "attributes in columns and metrics in rows" at "1", "1" should have text-align with value #{expected} instead we have #{actual}'
        )
            .expect((await vizPanelForGrid.getGridCellByPosition("1", "1", "attributes in columns and metrics in rows").getCSSProperty("text-align")).value)
            .toBe('left')
        // And the grid cell in visualization "attributes in columns and metrics in rows" at "2", "1" has style "text-align" with value "left"
        await since(
            'Grid cell in visualization "attributes in columns and metrics in rows" at "2", "1" should have text-align with value #{expected} instead we have #{actual}'
        )
            .expect((await vizPanelForGrid.getGridCellByPosition("2", "1", "attributes in columns and metrics in rows").getCSSProperty("text-align")).value)
            .toBe('left');
        // And the grid cell in visualization "attributes in columns and metrics in rows" at "3", "1" has style "text-align" with value "left"
        await since(
            'Grid cell in visualization "attributes in columns and metrics in rows" at "3", "1" should have text-align with value #{expected} instead we have #{actual}'
        )
            .expect((await vizPanelForGrid.getGridCellByPosition("3", "1", "attributes in columns and metrics in rows").getCSSProperty("text-align")).value)
            .toBe('left');
        // And the grid cell in visualization "attributes in columns and metrics in rows" at "3", "2" has style "text-align" with value "center" 
        await since(
            'Grid cell in visualization "attributes in columns and metrics in rows" at "3", "2" should have text-align with value #{expected} instead we have #{actual}'
        )
            .expect((await vizPanelForGrid.getGridCellByPosition("3", "2", "attributes in columns and metrics in rows").getCSSProperty("text-align")).value)
            .toBe('center');

        // When I right click on the attribute "Supplier" and select Format from grid visualization "attributes in rows and columns and metrics in columns"
        await vizPanelForGrid.openFormatToolBoxFromColumnHeader('Supplier','attributes in rows and columns and metrics in columns');
        // Then I pause execution for 3 seconds
        await browser.pause(3000);
        // When I change the font to "Oleo Script" in the tool box
        await formatPanelForGridBase.selectTextFont('Oleo Script');
        // Then I pause execution for 2 seconds
        await browser.pause(2000);
        // Then the grid cell in visualization "attributes in rows and columns and metrics in columns" at "1", "1" has style "font-family" with value "Oleo Script"
        await since(
            'Grid cell in visualization "attributes in rows and columns and metrics in columns" at "1", "1" should have font-family with value #{expected} instead we have #{actual}'
        )
            .expect((await vizPanelForGrid.getGridCellByPosition("1", "1", "attributes in rows and columns and metrics in columns").getCSSProperty("font-family")).value)
            .toContain('oleo script')
        // And the grid cell in visualization "attributes in rows and columns and metrics in columns" at "2", "1" has style "font-family" with value "Oleo Script"
        await since(
            'Grid cell in visualization "attributes in rows and columns and metrics in columns" at "2", "1" should have font-family with value #{expected} instead we have #{actual}'
        )
            .expect((await vizPanelForGrid.getGridCellByPosition("2", "1", "attributes in rows and columns and metrics in columns").getCSSProperty("font-family")).value)
            .toContain('oleo script');
        // And the grid cell in visualization "attributes in rows and columns and metrics in columns" at "3", "1" has style "font-family" with value "Open Sans"
        await since(
            'Grid cell in visualization "attributes in rows and columns and metrics in columns" at "3", "1" should have font-family with value #{expected} instead we have #{actual}'
        )
            .expect((await vizPanelForGrid.getGridCellByPosition("3", "1", "attributes in rows and columns and metrics in columns").getCSSProperty("font-family")).value)
            .toContain('open sans');
        // And the grid cell in visualization "attributes in rows and columns and metrics in columns" at "3", "2" has style "font-family" with value "Open Sans"
        await since(
            'Grid cell in visualization "attributes in rows and columns and metrics in columns" at "3", "2" should have font-family with value #{expected} instead we have #{actual}'
        )
            .expect((await vizPanelForGrid.getGridCellByPosition("3", "2", "attributes in rows and columns and metrics in columns").getCSSProperty("font-family")).value)
            .toContain('open sans');

        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // When I right click on the attribute "$398,708" and select Format from grid visualization "attributes in rows and columns and metrics in columns"
        await vizPanelForGrid.openFormatToolBoxFromColumnHeader('$398,708','attributes in rows and columns and metrics in columns');
        // Then I pause execution for 2 seconds
        await browser.pause(2000);
        // When I select the text alignment "justify" in the tool box
        await formatPanelForGridToolBox.selectTextAlign('justify');
        // Then I pause execution for 2 seconds
        await browser.pause(2000);
        // Then the grid cell in visualization "attributes in rows and columns and metrics in columns" at "1", "1" has style "text-align" with value "left"
        await since(
            'Grid cell in visualization "attributes in rows and columns and metrics in columns" at "1", "1" should have text-align with value #{expected} instead we have #{actual}'
        )
            .expect((await vizPanelForGrid.getGridCellByPosition("1", "1", "attributes in rows and columns and metrics in columns").getCSSProperty("text-align")).value)
            .toBe('left')
        // And the grid cell in visualization "attributes in rows and columns and metrics in columns" at "2", "1" has style "text-align" with value "left"
        await since(
            'Grid cell in visualization "attributes in rows and columns and metrics in columns" at "2", "1" should have text-align with value #{expected} instead we have #{actual}'
        )
            .expect((await vizPanelForGrid.getGridCellByPosition("2", "1", "attributes in rows and columns and metrics in columns").getCSSProperty("text-align")).value)
            .toBe('left');
        // And the grid cell in visualization "attributes in rows and columns and metrics in columns" at "3", "1" has style "text-align" with value "left"
        await since(
            'Grid cell in visualization "attributes in rows and columns and metrics in columns" at "3", "1" should have text-align with value #{expected} instead we have #{actual}'
        )
            .expect((await vizPanelForGrid.getGridCellByPosition("3", "1", "attributes in rows and columns and metrics in columns").getCSSProperty("text-align")).value)
            .toBe('left');
        // And the grid cell in visualization "attributes in rows and columns and metrics in columns" at "3", "2" has style "text-align" with value "justify"
        await since(
            'Grid cell in visualization "attributes in rows and columns and metrics in columns" at "3", "2" should have text-align with value #{expected} instead we have #{actual}'
        )
            .expect((await vizPanelForGrid.getGridCellByPosition("3", "2", "attributes in rows and columns and metrics in columns").getCSSProperty("text-align")).value)
            .toBe('justify');

        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // When I right click on the attribute "Supplier" and select Format from grid visualization "attributes in rows and columns and metrics in rows"
        await vizPanelForGrid.openFormatToolBoxFromColumnHeader('Supplier','attributes in rows and columns and metrics in rows');
        // When I pause execution for 2 seconds
        await browser.pause(2000);
        // When I select strikethrough on the font in the tool box
        await formatPanelForGridBase.selectTextFontStrikethrough();
        // Then I pause execution for 2 seconds
        await browser.pause(2000);
        // Then the grid cell in visualization "attributes in rows and columns and metrics in rows" at "1", "1" has style "text-decoration-line" with value "line-through"
        await since(
            'Grid cell in visualization "attributes in rows and columns and metrics in rows" at "1", "1" should have text-decoration-line with value #{expected} instead we have #{actual}'
        )
            .expect((await vizPanelForGrid.getGridCellByPosition("1", "1", "attributes in rows and columns and metrics in rows").getCSSProperty("text-decoration-line")).value)
            .toBe('line-through');

        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // When I right click on the attribute "$398,708" and select Format from grid visualization "attributes in rows and columns and metrics in rows"
        await vizPanelForGrid.openFormatToolBoxFromColumnHeader('$398,708','attributes in rows and columns and metrics in rows');
        // Then I pause execution for 3 seconds
        await browser.pause(3000);
        // When I select underline on the font in the tool box
        await formatPanelForGridBase.selectTextFontUnderline();
        // Then I pause execution for 2 seconds
        await browser.pause(2000);
        // Then the grid cell in visualization "attributes in rows and columns and metrics in rows" at "1", "1" has style "text-decoration-line" with value "line-through"
        await since(
            'Grid cell in visualization "attributes in rows and columns and metrics in rows" at "1", "1" should have text-decoration-line with value #{expected} instead we have #{actual}'
        )
            .expect((await vizPanelForGrid.getGridCellByPosition("1", "1", "attributes in rows and columns and metrics in rows").getCSSProperty("text-decoration-line")).value)
            .toBe('line-through');
        // And the grid cell in visualization "attributes in rows and columns and metrics in rows" at "3", "2" has style "text-decoration-line" with value "underline"
        await since(
            'Grid cell in visualization "attributes in rows and columns and metrics in rows" at "3", "2" should have text-decoration-line with value #{expected} instead we have #{actual}'
        )
            .expect((await vizPanelForGrid.getGridCellByPosition("3", "2", "attributes in rows and columns and metrics in rows").getCSSProperty("text-decoration-line")).value)
            .toBe('underline');
    
        // When I switch to chapter "FreeForm" from contents panel
        await contentsPanel.goToPage({ chapterName: 'FreeForm', pageName: 'Page 1' });
        // Then I pause execution for 3 seconds
        await browser.pause(3000);

        // When I right click on the attribute "Supplier" and select Format from grid visualization "attributes in rows and metrics in columns"
        await vizPanelForGrid.openFormatToolBoxFromColumnHeader('Supplier','attributes in rows and metrics in columns');
        // Then I pause execution for 1 seconds
        await browser.pause(1000);

        // When I change the font size to "12" in the tool box
        await formatPanelForGridBase.setTextFontSize('12');
        // Then I pause execution for 2 seconds
        await browser.pause(2000);
        // Then the grid cell in visualization "attributes in rows and metrics in columns" at "1", "1" has style "font-size" with value "16px"
        await since(
            'Grid cell in visualization "attributes in rows and metrics in columns" at "1", "1" should have font-size with value #{expected} instead we have #{actual}'
        )
            .expect((await vizPanelForGrid.getGridCellByPosition("1", "1", "attributes in rows and metrics in columns").getCSSProperty("font-size")).value)
            .toContain('16px')
        // And the grid cell in visualization "attributes in rows and metrics in columns" at "2", "1" has style "font-size" with value "10.6667px"
        await since(
            'Grid cell in visualization "attributes in rows and metrics in columns" at "2", "1" should have font-size with value #{expected} instead we have #{actual}'
        )
            .expect((await vizPanelForGrid.getGridCellByPosition("2", "1", "attributes in rows and metrics in columns").getCSSProperty("font-size")).value)
            .toContain('10.6667px')
        // And the grid cell in visualization "attributes in rows and metrics in columns" at "2", "3" has style "font-size" with value "10.6667px"
        await since(
            'Grid cell in visualization "attributes in rows and metrics in columns" at "2", "3" should have font-size with value #{expected} instead we have #{actual}'
        )
            .expect((await vizPanelForGrid.getGridCellByPosition("2", "3", "attributes in rows and metrics in columns").getCSSProperty("font-size")).value)
            .toContain('10.6667px')


        // When I right click on the attribute "20th Century Fox" and select Format from grid visualization "attributes in rows and metrics in columns"
        await vizPanelForGrid.openFormatToolBoxFromColumnHeader('20th Century Fox','attributes in rows and metrics in columns');
        // Then I pause execution for 2 seconds
        await browser.pause(2000);
        // When I select bold on the font in the tool box
        await formatPanelForGridBase.selectTextFontBold();
        // Then I pause execution for 2 seconds
        await browser.pause(2000);
        // Then the grid cell in visualization "attributes in rows and metrics in columns" at "1", "1" has style "font-weight" with value "700"
        await since(
            'Grid cell in visualization "attributes in rows and metrics in columns" at "1", "1" should have font-weight with value #{expected} instead we have #{actual}'
        )
            .expect((await vizPanelForGrid.getGridCellByPosition("1", "1", "attributes in rows and metrics in columns").getCSSProperty("font-weight")).value.toString())
            .toBe('700')
        // And the grid cell in visualization "attributes in rows and metrics in columns" at "2", "1" has style "font-weight" with value "700"
        await since(
            'Grid cell in visualization "attributes in rows and metrics in columns" at "2", "1" should have font-weight with value #{expected} instead we have #{actual}'
        )
            .expect((await vizPanelForGrid.getGridCellByPosition("2", "1", "attributes in rows and metrics in columns").getCSSProperty("font-weight")).value.toString())
            .toBe('700');

        // And the grid cell in visualization "attributes in rows and metrics in columns" at "2", "3" has style "font-weight" with value "400"
        await since(
            'Grid cell in visualization "attributes in rows and metrics in columns" at "2", "3" should have font-weight with value #{expected} instead we have #{actual}'
        )
            .expect((await vizPanelForGrid.getGridCellByPosition("2", "3", "attributes in rows and metrics in columns").getCSSProperty("font-weight")).value.toString())
            .toBe('400');

        // When I right click on the attribute "$1,560,568" and select Format from grid visualization "attributes in rows and metrics in columns"
        await vizPanelForGrid.openFormatToolBoxFromColumnHeader('$1,560,568','attributes in rows and metrics in columns');
        // Then I pause execution for 2 seconds
        await browser.pause(2000);
        // When I open the font color menu in the tool box
        await formatPanelForGridBase.selectTextFontColorButton();
        // When I open the color swatch menu
        await formatPanel.selectAdvancedColorSwatchMenu();
        // When I select the built-in color "Red"
        await formatPanel.selectAdvancedColorBuiltInSwatch('Red');
        // Then I pause execution for 2 seconds
        await browser.pause(2000);
        // Then the grid cell in visualization "attributes in rows and metrics in columns" at "1", "1" has style "color" with value "rgba(53, 56, 58, 1)"
        await since(
            'Grid cell in visualization "attributes in rows and metrics in columns" at "1", "1" should have color with value #{expected} instead we have #{actual}'
        )
        .expect(
            (await vizPanelForGrid.getGridCellByPosition('1', '1', 'attributes in rows and metrics in columns').getCSSProperty('color')).value
        )
        .toContain('53,56,58,1');
        // And the grid cell in visualization "attributes in rows and metrics in columns" at "2", "1" has style "color" with value "rgba(53, 56, 58, 1)"
        await since(
            'Grid cell in visualization "attributes in rows and metrics in columns" at "2", "1" should have color with value #{expected} instead we have #{actual}'
        )
        .expect(
            (await vizPanelForGrid.getGridCellByPosition('2', '1', 'attributes in rows and metrics in columns').getCSSProperty('color')).value
        )
        .toContain('53,56,58,1');
        // And the grid cell in visualization "attributes in rows and metrics in columns" at "2", "3" has style "color" with value "rgba(255, 0, 0, 1)"
        
        await since(
            'Grid cell in visualization "attributes in rows and metrics in columns" at "2", "3" should have color with value #{expected} instead we have #{actual}'
        )
        .expect(
            (await vizPanelForGrid.getGridCellByPosition('2', '3', 'attributes in rows and metrics in columns').getCSSProperty('color')).value
        )
        .toContain('255,0,0,1');
        
        // When I right click on the attribute "Supplier" and select Format from grid visualization "attributes in columns and metrics in rows"
        await vizPanelForGrid.openFormatToolBoxFromColumnHeader('Supplier','attributes in columns and metrics in rows');
        // Then I pause execution for 3 seconds
        await browser.pause(3000);
        // When I select the font size "9" in the tool box
        await formatPanelForGridBase.setTextFontSize('9');
        // Then I pause execution for 2 seconds
        await browser.pause(2000);
        // Then the grid cell in visualization "attributes in columns and metrics in rows" at "1", "1" has style "font-size" with value "12px"
        await since(
            'Grid cell in visualization "attributes in columns and metrics in rows" at "1", "1" should have font-size with value #{expected} instead we have #{actual}'
        )
            .expect((await vizPanelForGrid.getGridCellByPosition("1", "1", "attributes in columns and metrics in rows").getCSSProperty("font-size")).value)
            .toContain('12px')
        // And the grid cell in visualization "attributes in columns and metrics in rows" at "2", "1" has style "font-size" with value "12px"
        await since(
            'Grid cell in visualization "attributes in columns and metrics in rows" at "2", "1" should have font-size with value #{expected} instead we have #{actual}'
        )
            .expect((await vizPanelForGrid.getGridCellByPosition("2", "1", "attributes in columns and metrics in rows").getCSSProperty("font-size")).value)
            .toContain('12px')
        // And the grid cell in visualization "attributes in columns and metrics in rows" at "3", "1" has style "font-size" with value "10.6667px"
        await since(
            'Grid cell in visualization "attributes in columns and metrics in rows" at "3", "1" should have font-size with value #{expected} instead we have #{actual}'
        )
            .expect((await vizPanelForGrid.getGridCellByPosition("3", "1", "attributes in columns and metrics in rows").getCSSProperty("font-size")).value)
            .toContain('10.6667px')
        // And the grid cell in visualization "attributes in columns and metrics in rows" at "3", "2" has style "font-size" with value "10.6667px"
        await since(
            'Grid cell in visualization "attributes in columns and metrics in rows" at "3", "2" should have font-size with value #{expected} instead we have #{actual}'
        )
            .expect((await vizPanelForGrid.getGridCellByPosition("3", "2", "attributes in columns and metrics in rows").getCSSProperty("font-size")).value)
            .toContain('10.6667px')

        // When I right click on the attribute "Cost" and select Format from grid visualization "attributes in columns and metrics in rows"
        await vizPanelForGrid.openFormatToolBoxFromColumnHeader('Cost','attributes in columns and metrics in rows');
        // Then I pause execution for 2 seconds
        await browser.pause(2000);
        // When I select italic on the font in the tool box
        await formatPanelForGridBase.selectTextFontItalic();
        // Then I pause execution for 2 seconds
        await browser.pause(2000);
        // Then the grid cell in visualization "attributes in columns and metrics in rows" at "1", "1" has style "font-style" with value "normal"
        await since(
            'Grid cell in visualization "attributes in columns and metrics in rows" at "1", "1" should have font-style with value #{expected} instead we have #{actual}'
        )
            .expect((await vizPanelForGrid.getGridCellByPosition("1", "1", "attributes in columns and metrics in rows").getCSSProperty("font-style")).value)
            .toBe('normal')
        // And the grid cell in visualization "attributes in columns and metrics in rows" at "2", "1" has style "font-style" with value "normal"
        await since(
            'Grid cell in visualization "attributes in columns and metrics in rows" at "2", "1" should have font-style with value #{expected} instead we have #{actual}'
        )
            .expect((await vizPanelForGrid.getGridCellByPosition("2", "1", "attributes in columns and metrics in rows").getCSSProperty("font-style")).value)
            .toBe('normal');
        // And the grid cell in visualization "attributes in columns and metrics in rows" at "3", "1" has style "font-style" with value "italic"
        await since(
            'Grid cell in visualization "attributes in columns and metrics in rows" at "3", "1" should have font-style with value #{expected} instead we have #{actual}'
        )
            .expect((await vizPanelForGrid.getGridCellByPosition("3", "1", "attributes in columns and metrics in rows").getCSSProperty("font-style")).value)
            .toBe('italic');
        // And the grid cell in visualization "attributes in columns and metrics in rows" at "3", "2" has style "font-style" with value "normal"
        await since(
            'Grid cell in visualization "attributes in columns and metrics in rows" at "3", "2" should have font-style with value #{expected} instead we have #{actual}'
        )
            .expect((await vizPanelForGrid.getGridCellByPosition("3", "2", "attributes in columns and metrics in rows").getCSSProperty("font-style")).value)
            .toBe('normal');


        // When I right click on the attribute "$969,712" and select Format from grid visualization "attributes in columns and metrics in rows"
        await vizPanelForGrid.openFormatToolBoxFromColumnHeader('$969,712','attributes in columns and metrics in rows');
        // Then I pause execution for 2 seconds
        await browser.pause(2000);
        // When I select the text alignment "center" in the tool box
        await formatPanelForGridToolBox.selectTextAlign('center');
        // Then I pause execution for 2 seconds
        await browser.pause(2000);
        // Then the grid cell in visualization "attributes in columns and metrics in rows" at "1", "1" has style "text-align" with value "left"
        await since(
            'Grid cell in visualization "attributes in columns and metrics in rows" at "1", "1" should have text-align with value #{expected} instead we have #{actual}'
        )
            .expect((await vizPanelForGrid.getGridCellByPosition("1", "1", "attributes in columns and metrics in rows").getCSSProperty("text-align")).value)
            .toBe('left')
        // And the grid cell in visualization "attributes in columns and metrics in rows" at "2", "1" has style "text-align" with value "left"
        await since(
            'Grid cell in visualization "attributes in columns and metrics in rows" at "2", "1" should have text-align with value #{expected} instead we have #{actual}'
        )
            .expect((await vizPanelForGrid.getGridCellByPosition("2", "1", "attributes in columns and metrics in rows").getCSSProperty("text-align")).value)
            .toBe('left');
        // And the grid cell in visualization "attributes in columns and metrics in rows" at "3", "1" has style "text-align" with value "left"
        await since(
            'Grid cell in visualization "attributes in columns and metrics in rows" at "3", "1" should have text-align with value #{expected} instead we have #{actual}'
        )
            .expect((await vizPanelForGrid.getGridCellByPosition("3", "1", "attributes in columns and metrics in rows").getCSSProperty("text-align")).value)
            .toBe('left');
        // And the grid cell in visualization "attributes in columns and metrics in rows" at "3", "2" has style "text-align" with value "center" 
        await since(
            'Grid cell in visualization "attributes in columns and metrics in rows" at "3", "2" should have text-align with value #{expected} instead we have #{actual}'
        )
            .expect((await vizPanelForGrid.getGridCellByPosition("3", "2", "attributes in columns and metrics in rows").getCSSProperty("text-align")).value)
            .toBe('center');

        // When I right click on the attribute "Supplier" and select Format from grid visualization "attributes in rows and columns and metrics in columns"
        await vizPanelForGrid.openFormatToolBoxFromColumnHeader('Supplier','attributes in rows and columns and metrics in columns');
        // Then I pause execution for 3 seconds
        await browser.pause(3000);
        // When I change the font to "Oleo Script" in the tool box
        await formatPanelForGridBase.selectTextFont('Oleo Script');
        // Then I pause execution for 2 seconds
        await browser.pause(2000);
        // Then the grid cell in visualization "attributes in rows and columns and metrics in columns" at "1", "1" has style "font-family" with value "Oleo Script"
        await since(
            'Grid cell in visualization "attributes in rows and columns and metrics in columns" at "1", "1" should have font-family with value #{expected} instead we have #{actual}'
        )
            .expect((await vizPanelForGrid.getGridCellByPosition("1", "1", "attributes in rows and columns and metrics in columns").getCSSProperty("font-family")).value)
            .toContain('oleo script')
        // And the grid cell in visualization "attributes in rows and columns and metrics in columns" at "2", "1" has style "font-family" with value "Oleo Script"
        await since(
            'Grid cell in visualization "attributes in rows and columns and metrics in columns" at "2", "1" should have font-family with value #{expected} instead we have #{actual}'
        )
            .expect((await vizPanelForGrid.getGridCellByPosition("2", "1", "attributes in rows and columns and metrics in columns").getCSSProperty("font-family")).value)
            .toContain('oleo script');
        // And the grid cell in visualization "attributes in rows and columns and metrics in columns" at "3", "1" has style "font-family" with value "Open Sans"
        await since(
            'Grid cell in visualization "attributes in rows and columns and metrics in columns" at "3", "1" should have font-family with value #{expected} instead we have #{actual}'
        )
            .expect((await vizPanelForGrid.getGridCellByPosition("3", "1", "attributes in rows and columns and metrics in columns").getCSSProperty("font-family")).value)
            .toContain('open sans');
        // And the grid cell in visualization "attributes in rows and columns and metrics in columns" at "3", "2" has style "font-family" with value "Open Sans"
        await since(
            'Grid cell in visualization "attributes in rows and columns and metrics in columns" at "3", "2" should have font-family with value #{expected} instead we have #{actual}'
        )
            .expect((await vizPanelForGrid.getGridCellByPosition("3", "2", "attributes in rows and columns and metrics in columns").getCSSProperty("font-family")).value)
            .toContain('open sans');

        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // When I right click on the attribute "$398,708" and select Format from grid visualization "attributes in rows and columns and metrics in columns"
        await vizPanelForGrid.openFormatToolBoxFromColumnHeader('$398,708','attributes in rows and columns and metrics in columns');
        // Then I pause execution for 2 seconds
        await browser.pause(2000);
        // When I select the text alignment "justify" in the tool box
        await formatPanelForGridToolBox.selectTextAlign('justify');
        // Then I pause execution for 2 seconds
        await browser.pause(2000);
        // Then the grid cell in visualization "attributes in rows and columns and metrics in columns" at "1", "1" has style "text-align" with value "left"
        await since(
            'Grid cell in visualization "attributes in rows and columns and metrics in columns" at "1", "1" should have text-align with value #{expected} instead we have #{actual}'
        )
            .expect((await vizPanelForGrid.getGridCellByPosition("1", "1", "attributes in rows and columns and metrics in columns").getCSSProperty("text-align")).value)
            .toBe('left')
        // And the grid cell in visualization "attributes in rows and columns and metrics in columns" at "2", "1" has style "text-align" with value "left"
        await since(
            'Grid cell in visualization "attributes in rows and columns and metrics in columns" at "2", "1" should have text-align with value #{expected} instead we have #{actual}'
        )
            .expect((await vizPanelForGrid.getGridCellByPosition("2", "1", "attributes in rows and columns and metrics in columns").getCSSProperty("text-align")).value)
            .toBe('left');
        // And the grid cell in visualization "attributes in rows and columns and metrics in columns" at "3", "1" has style "text-align" with value "left"
        await since(
            'Grid cell in visualization "attributes in rows and columns and metrics in columns" at "3", "1" should have text-align with value #{expected} instead we have #{actual}'
        )
            .expect((await vizPanelForGrid.getGridCellByPosition("3", "1", "attributes in rows and columns and metrics in columns").getCSSProperty("text-align")).value)
            .toBe('left');
        // And the grid cell in visualization "attributes in rows and columns and metrics in columns" at "3", "2" has style "text-align" with value "justify"
        await since(
            'Grid cell in visualization "attributes in rows and columns and metrics in columns" at "3", "2" should have text-align with value #{expected} instead we have #{actual}'
        )
            .expect((await vizPanelForGrid.getGridCellByPosition("3", "2", "attributes in rows and columns and metrics in columns").getCSSProperty("text-align")).value)
            .toBe('justify');

        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // When I right click on the attribute "Supplier" and select Format from grid visualization "attributes in rows and columns and metrics in rows"
        await vizPanelForGrid.openFormatToolBoxFromColumnHeader('Supplier','attributes in rows and columns and metrics in rows');
        // When I pause execution for 2 seconds
        await browser.pause(2000);
        // When I select strikethrough on the font in the tool box
        await formatPanelForGridBase.selectTextFontStrikethrough();
        // Then I pause execution for 2 seconds
        await browser.pause(2000);
        // Then the grid cell in visualization "attributes in rows and columns and metrics in rows" at "1", "1" has style "text-decoration-line" with value "line-through"
        await since(
            'Grid cell in visualization "attributes in rows and columns and metrics in rows" at "1", "1" should have text-decoration-line with value #{expected} instead we have #{actual}'
        )
            .expect((await vizPanelForGrid.getGridCellByPosition("1", "1", "attributes in rows and columns and metrics in rows").getCSSProperty("text-decoration-line")).value)
            .toBe('line-through');

        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // When I right click on the attribute "$398,708" and select Format from grid visualization "attributes in rows and columns and metrics in rows"
        await vizPanelForGrid.openFormatToolBoxFromColumnHeader('$398,708','attributes in rows and columns and metrics in rows');
        // Then I pause execution for 3 seconds
        await browser.pause(3000);
        // When I select underline on the font in the tool box
        await formatPanelForGridBase.selectTextFontUnderline();
        // Then I pause execution for 2 seconds
        await browser.pause(2000);
        // Then the grid cell in visualization "attributes in rows and columns and metrics in rows" at "1", "1" has style "text-decoration-line" with value "line-through"
        await since(
            'Grid cell in visualization "attributes in rows and columns and metrics in rows" at "1", "1" should have text-decoration-line with value #{expected} instead we have #{actual}'
        )
            .expect((await vizPanelForGrid.getGridCellByPosition("1", "1", "attributes in rows and columns and metrics in rows").getCSSProperty("text-decoration-line")).value)
            .toBe('line-through');
        // And the grid cell in visualization "attributes in rows and columns and metrics in rows" at "3", "2" has style "text-decoration-line" with value "underline"
        await since(
            'Grid cell in visualization "attributes in rows and columns and metrics in rows" at "3", "2" should have text-decoration-line with value #{expected} instead we have #{actual}'
        )
            .expect((await vizPanelForGrid.getGridCellByPosition("3", "2", "attributes in rows and columns and metrics in rows").getCSSProperty("text-decoration-line")).value)
            .toBe('underline');
   });
});
