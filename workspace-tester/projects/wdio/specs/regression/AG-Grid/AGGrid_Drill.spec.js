import { AGGrid_Drill, gridUser } from '../../../constants/grid.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import setWindowSize from '../../../config/setWindowSize.js';

describe('Modern (AG) grid Drilling basic cases', () => {
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    const {
        loginPage,
        libraryPage,
        agGridVisualization,
        baseVisualization,
        contentsPanel,
        dossierAuthoringPage,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(gridUser);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {});

    it('[TC76160_1] Drill in AG Grid, replacing the attribute', async () => {
        await libraryPage.editDossierByUrl({
            projectId: AGGrid_Drill.project.id,
            dossierId: AGGrid_Drill.id,
        });
        await contentsPanel.goToPage({
            chapterName: 'Drill',
            pageName: 'Column Set',
        });
        await agGridVisualization.clickContainer('Visualization 1');
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'AGGrid_Drill_01',
            'AG Grid Drill - Before any drill'
        );
        // 1. Drill on the headers
        // 1.1 Drill on the row axis attribute header
        await agGridVisualization.drillfromAttributeHeader('Country', 'Subcategory', 'Visualization 1');
        await since('The "Country" attribute should be replaced by "Subcategory"')
            .expect(await agGridVisualization.getGroupHeaderCell('Subcategory', 'Visualization 1').isExisting())
            .toBe(true);
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'AGGrid_Drill_02',
            'AG Grid Drill - After drilling on row axis attribute header'
        );
        
        // 2. Drill on one of the row axis attribute elements
        await agGridVisualization.drillfromAttributeElement('Art & Architecture', 'Item', 'Visualization 1');
        await since('The Column set 1 only has 1 column"')
            .expect(await agGridVisualization.getGroupHeaderCell('Item', 'Visualization 1').isExisting())
            .toBe(true);
        

        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'AGGrid_Drill_03',
            'AG Grid Drill - After drilling on row axis attribute element'
        );

        // 3. Drill on one of the column axis attribute elements
        await agGridVisualization.drillfromAttributeHeader('2015', 'Subcategory', 'Visualization 1');
        await since('The Column set 1 only has 1 column"')
            .expect(await agGridVisualization.getGroupHeaderCell('Art & Architecture', 'Visualization 1').isExisting())
            .toBe(true);

        // 4. Select the cells on both row axis and column axis, to prepare the RMC 
        await agGridVisualization.ctrlClick({
            elem: agGridVisualization.getGridCell('Art As Experience')
        });
        await agGridVisualization.ctrlClick({
            elem: agGridVisualization.getGroupHeaderCell('Books')
        });
        await agGridVisualization.ctrlClick({
            elem: agGridVisualization.getGroupHeaderCell('Art & Architecture')
        });
        // 4.1 RMC on the column attribute element, shouldn't show the drill menu
        const cell = await agGridVisualization.getGroupHeaderCell('Books', 'Visualization 1');
        await agGridVisualization.rightMouseClickOnElement(cell);
        await agGridVisualization.sleep(0.5);
        await since('The Drill menu should not appear when the cells from 2 column sets are selected')
            .expect(await agGridVisualization.common.getSecondaryContextMenu('Drill').isExisting())
            .toBe(false);

        // 4.2 Drill from the row axis attribute element
        await agGridVisualization.drillfromAttributeElement('Art As Experience', 'Year', 'Visualization 1');
        await since('The 2016 cell should appear')
            .expect(await agGridVisualization.getGridCell('2016', 'Visualization 1').isExisting())
            .toBe(true);
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'AGGrid_Drill_05',
            'AG Grid Drill - After drilling on row axis attribute element'
        );
        // 4.3 Drill on row axis attribute element and column axis attribute header
        await agGridVisualization.ctrlClick({
            elem: agGridVisualization.getGridCell('2015')
        });
        await agGridVisualization.ctrlClick({
            elem: agGridVisualization.getGroupHeaderCell('Books')
        });
        await agGridVisualization.drillfromAttributeHeader('Books', 'Subcategory', 'Visualization 1');
        await since('The 2016 cell should not appear')
            .expect(await agGridVisualization.getGridCell('2016', 'Visualization 1').isExisting())
            .toBe(false);
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'AGGrid_Drill_06',
            'AG Grid Drill - After drilling on row axis attribute element and column axis attribute header'
        );

        // 5. Clear the drill conditions
        await baseVisualization.hover({ elem: baseVisualization.getContainerByTitle('Visualization 1') });
        await agGridVisualization.openAndClickSubMenuItemForElement(baseVisualization.getViewFilterIcon('Visualization 1'),
            'Clear drill conditions', 'Column Set 1');
        await since('The 2016 cell should appear')
            .expect(await agGridVisualization.getGridCell('2016', 'Visualization 1').isExisting())
            .toBe(true);
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'AGGrid_Drill_07',
            'AG Grid Drill - After clearing all drill conditions'
        );
        await dossierAuthoringPage.closeDossierWithoutSaving();
    })
})