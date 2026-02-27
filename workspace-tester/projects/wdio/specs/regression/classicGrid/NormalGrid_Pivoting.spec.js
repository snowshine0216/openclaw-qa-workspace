import setWindowSize from '../../../config/setWindowSize.js';
import * as gridConstants from '../../../constants/grid.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

//npm run regression -- --baseUrl=https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --spec 'specs/regression/classicGrid/NormalGrid_Pivoting.spec.js'
describe('Normal Grid Pivoting', () => {
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
        editorPanelForGrid,
        loginPage,
        agGridVisualization,
        editorPanel,
        ngmEditorPanel,
        contentsPanel,
    } = browsers.pageObj1;

    it('[TC2712] Regression tests for simple grid pivoting', async () => {
         // Edit dossier by its ID "CF5F62B411EA5D84D25F0080EFB54A05"
         // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > Convert > AGGrid_ConvertGrid_NG_TC71106
         await libraryPage.editDossierByUrl({
             projectId: gridConstants.AGGridConvert1.project.id,
             dossierId: gridConstants.AGGridConvert1.id,
         });

         await agGridVisualization.clickContainer('2AR_2MC');
         // take screenshot for '2AR_2MC' before pivoting
         await takeScreenshotByElement(
             vizPanelForGrid.getContainer('2AR_2MC'),
             'TC2712_01',
             'Before pivoting - 2AR_2MC'
         );
         // open editor panel
         await editorPanel.switchToEditorPanel();
         // take screenshot for editor panel
         await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
             'TC2712_02',
             'Editor panel before pivoting - 2AR_2MC'
         );
        //  When I swap axis from editor panel
        await ngmEditorPanel.editorPanelShortcutFunction('swap');
        // take screenshot for '2AR_2MC' after pivoting
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('2AR_2MC'),
            'TC2712_03',
            'After pivoting - 2AR_2MC'
        );
        // take screenshot for editor panel after pivoting
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'TC2712_04',
            'Editor panel after pivoting - 2AR_2MC'
        );

        // #Grid 2: 2MR_2AC (2 Metrics in Rows, 2 Attributes in Columns)
        await agGridVisualization.clickContainer('2MR_2AC');
        // take screenshot for '2MR_2AC' before pivoting
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('2MR_2AC'),
            'TC2712_05',
            'Before pivoting - 2MR_2AC'
        );
        // open editor panel
        await editorPanel.switchToEditorPanel();
        // take screenshot for editor panel
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'TC2712_06',
            'Editor panel before pivoting - 2MR_2AC'
        );
        //  When I swap axis from editor panel
        await ngmEditorPanel.editorPanelShortcutFunction('swap');
        // take screenshot for '2MR_2AC' after pivoting
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('2MR_2AC'),
            'TC2712_07',
            'After pivoting - 2MR_2AC'
        );
        // take screenshot for editor panel after pivoting
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'TC2712_08',
            'Editor panel after pivoting - 2MR_2AC'
        );

        // Scenario: Grid 3: 1AR_2A2MC (1 Attribute in Rows, 2 Attributes & 2 Metrics in Columns)
        await agGridVisualization.clickContainer('1AR_2A2MC');
        // take screenshot for '1AR_2A2MC' before pivoting
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('1AR_2A2MC'),
            'TC2712_09',
            'Before pivoting - 1AR_2A2MC'
        );
        // open editor panel
        await editorPanel.switchToEditorPanel();
        // take screenshot for editor panel
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'TC2712_10',
            'Editor panel before pivoting - 1AR_2A2MC'
        );
        //  When I swap axis from editor panel
        await ngmEditorPanel.editorPanelShortcutFunction('swap');
        // take screenshot for '1AR_2A2MC' after pivoting
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('1AR_2A2MC'),
            'TC2712_11',
            'After pivoting - 1AR_2A2MC'
        );
        // take screenshot for editor panel after pivoting
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'TC2712_12',
            'Editor panel after pivoting - 1AR_2A2MC'
        );

        // Scenario: Grid 4: 2A2MR_1AC (2 Attributes & 2 Metrics in Rows, 1 Attribute in Columns)
        await agGridVisualization.clickContainer('2A2MR_1AC');
        // take screenshot for '2A2MR_1AC' before pivoting
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('2A2MR_1AC'),
            'TC2712_13',
            'Before pivoting - 2A2MR_1AC'
        );
        // open editor panel
        await editorPanel.switchToEditorPanel();
        // take screenshot for editor panel
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'TC2712_14',
            'Editor panel before pivoting - 2A2MR_1AC'
        );
        //  When I swap axis from editor panel
        await ngmEditorPanel.editorPanelShortcutFunction('swap');
        // take screenshot for '2A2MR_1AC' after pivoting
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('2A2MR_1AC'),
            'TC2712_15',
            'After pivoting - 2A2MR_1AC'
        );
        // take screenshot for editor panel after pivoting
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'TC2712_16',
            'Editor panel after pivoting - 2A2MR_1AC'
        );

        // Scenario: Grid 5: attributes only in rows  
        // switch to page "Page 2" in chapter "Chapter 1" from contents panel
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Page 2',
        });
        await agGridVisualization.clickContainer('AR-only');
        // take screenshot for 'AR-only' before pivoting
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('AR-only'),
            'TC2712_17',
            'Before pivoting - AR-only'
        );
        // open editor panel
        await editorPanel.switchToEditorPanel();
        // take screenshot for editor panel
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'TC2712_18',
            'Editor panel before pivoting - AR-only'
        );
        //  When I swap axis from editor panel
        await ngmEditorPanel.editorPanelShortcutFunction('swap');
        // take screenshot for 'AR-only' after pivoting
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('AR-only'),
            'TC2712_19',
            'After pivoting - AR-only'
        );
        // take screenshot for editor panel after pivoting
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'TC2712_20',
            'Editor panel after pivoting - AR-only'
        );

        // Scenario: Grid 6: attributes only in columns
        await agGridVisualization.clickContainer('AC-only');
        // take screenshot for 'AC-only' before pivoting
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('AC-only'),
            'TC2712_21',
            'Before pivoting - AC-only'
        );
        // open editor panel
        await editorPanel.switchToEditorPanel();
        // take screenshot for editor panel
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'TC2712_22',
            'Editor panel before pivoting - AC-only'
        );
        //  When I swap axis from editor panel
        await ngmEditorPanel.editorPanelShortcutFunction('swap');
        // take screenshot for 'AC-only' after pivoting
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('AC-only'),
            'TC2712_23',
            'After pivoting - AC-only'
        );
        // take screenshot for editor panel after pivoting
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'TC2712_24',
            'Editor panel after pivoting - AC-only'
        );

        // Scenario: Grid 7 - metrics only in columns
        await agGridVisualization.clickContainer('MC-only');
        // take screenshot for 'MC-only' before pivoting
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('MC-only'),
            'TC2712_25',
            'Before pivoting - MC-only'
        );
        // open editor panel
        await editorPanel.switchToEditorPanel();
        // take screenshot for editor panel
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'TC2712_26',
            'Editor panel before pivoting - MC-only'
        );
        //  When I swap axis from editor panel
        await ngmEditorPanel.editorPanelShortcutFunction('swap');
        // take screenshot for 'MC-only' after pivoting
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('MC-only'),
            'TC2712_27',
            'After pivoting - MC-only'
        );
        // take screenshot for editor panel after pivoting
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'TC2712_28',
            'Editor panel after pivoting - MC-only'
        );

        // Scenario: Grid 8 - metrics only in rows 
        await agGridVisualization.clickContainer('MR-only');
        // take screenshot for 'MR-only' before pivoting
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('MR-only'),
            'TC2712_29',
            'Before pivoting - MR-only'
        );
        // open editor panel
        await editorPanel.switchToEditorPanel();
        // take screenshot for editor panel
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'TC2712_30',
            'Editor panel before pivoting - MR-only'
        );
        //  When I swap axis from editor panel
        await ngmEditorPanel.editorPanelShortcutFunction('swap');
        // take screenshot for 'MR-only' after pivoting
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('MR-only'),
            'TC2712_31',
            'After pivoting - MR-only'
        );
        // take screenshot for editor panel after pivoting
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'TC2712_32',
            'Editor panel after pivoting - MR-only'
        );
   });
});
