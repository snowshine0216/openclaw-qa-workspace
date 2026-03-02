import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import { browserWindow } from '../../../../constants/index.js';
import * as gridConstants from '../../../../constants/grid.js';
import { dossier } from '../../../../constants/teams.js';

describe('DossierDS_AttributeLinkAndMapping', () => {
    const attributeLinkDossier = {
        id: '8A1671C1F44FDAC7C4DCD684026A0E6E',
        name: 'Auto_AttributeLinkAndMapping',
        project: {
            id: 'B628A31F11E7BD953EAE0080EF0583BD',
            name: 'New MicroStrategy Tutorial',
        },
    };
    const attributeMapDossier = {
        id: '829E3D4383439570C8FB0DB4B9B9822D',
        name: 'Auto_MapAttribute',
        project: {
            id: 'B628A31F11E7BD953EAE0080EF0583BD',
            name: 'New MicroStrategy Tutorial',
        },
    };
    const attributeMapRegressionDossier = {
        id: '2EA104301B45DD090AD84E96FEB39A8A',
        name: 'Auto_AttributeMapping',
        project: {
            id: 'B628A31F11E7BD953EAE0080EF0583BD',
            name: 'New MicroStrategy Tutorial',
        },
    };
    let {
        datasetPanel,
        libraryPage,
        loginPage,
        dossierAuthoringPage,
        dossierPage,
        dossierMojo,
        datasetsPanel,
        gridAuthoring,
        vizPanelForGrid,
        toolbar,
        editorPanelForGrid,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(gridConstants.gridUser);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC4990] Sanity test on Link Attribute in datasets panel', async () => {
        await libraryPage.editDossierByUrl({
            projectId: attributeLinkDossier.project.id,
            dossierId: attributeLinkDossier.id,
        });
        // Link Attribute
        await datasetPanel.actionOnObjectFromDataset(
            'Day of Week',
            'attribute',
            'airline-sample-data.xls',
            'Link to Other Dataset...'
        );
        await since('The editor shows up with title "Link Attributes", should be #{expected},instead we have #{actual}')
            .expect(await dossierMojo.isMoJoEditorWithTitleDisplayed('Link Attributes'))
            .toBe(true);
        await datasetPanel.linkAttribute('Category');
        await dossierMojo.clickBtnOnMojoEditor('OK');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await takeScreenshotByElement(
            dossierAuthoringPage.getDatasetPanel(),
            'TC4990_1',
            'Link icon shows on linked attributes'
        );
        await since(
            'The grid cell in visualization "Visualization 1" at "3", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 1, 'Visualization 1'))
            .toBe('Books');
        await since(
            'The grid cell in visualization "Visualization 1" at "3", "2" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 2, 'Visualization 1'))
            .toBe('$2,070,816');
        // Unlink Attribute
        await datasetPanel.actionOnObjectFromDataset('Day of Week', 'attribute', 'airline-sample-data.xls', 'Unlink');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await takeScreenshotByElement(
            dossierAuthoringPage.getDatasetPanel(),
            'TC4990_2',
            'Link icon removed after unlinking attribute'
        );
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 1, 'Visualization 1'))
            .toBe('Sunday');
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "2" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 2, 'Visualization 1'))
            .toBe('$29,730,085');
        // Undo/Redo Unlink Attribute
        await dossierAuthoringPage.actionOnToolbar("Undo");
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await takeScreenshotByElement(
            dossierAuthoringPage.getDatasetPanel(),
            'TC4990_3',
            'Link icon shows after undo'
        );
        await since(
            'The grid cell in visualization "Visualization 1" at "3", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 1, 'Visualization 1'))
            .toBe('Books');
        await since(
            'The grid cell in visualization "Visualization 1" at "3", "2" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 2, 'Visualization 1'))
            .toBe('$2,070,816');
        await dossierAuthoringPage.actionOnToolbar("Redo");
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await takeScreenshotByElement(
            dossierAuthoringPage.getDatasetPanel(),
            'TC4990_4',
            'Link icon removed after redo'
        );
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 1, 'Visualization 1'))
            .toBe('Sunday');
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "2" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 2, 'Visualization 1'))
            .toBe('$29,730,085');
    });

    it('[TC4280] Sanity test on Map Attribute in datasets panel', async () => {
        await libraryPage.editDossierByUrl({
            projectId: attributeMapDossier.project.id,
            dossierId: attributeMapDossier.id,
        });
        // Map Attribute ITEM to Item Category
        await datasetPanel.secondaryCMOnObjectFromDataset(
            'ITEM',
            'attribute',
            'Inventory-Sample-Data.xls retail-sample-data.xls (2 tables)',
            'Map Attributes',
            'Item Category'
        );
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await browser.waitUntil(async () => {
            return !(await datasetPanel.isObjectFromDSdisplayed("ITEM", "attribute", "Inventory-Sample-Data.xls retail-sample-data.xls (2 tables)"));
        }, {
            timeout: 10000,
            timeoutMsg: 'expected Attribute ITEM to be displayed after mapping within 10s'
        });
        await since('Attribute "ITEM" should not display on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("ITEM", "attribute", "Inventory-Sample-Data.xls retail-sample-data.xls (2 tables)"))
        .toBe(false);
        await takeScreenshotByElement(
            dossierAuthoringPage.getDatasetPanel(),
            'TC4280_1',
            'Map ITEM to Item Category'
        );
        // Unmap Attribute ITEM Category
        await datasetPanel.unmapAttribute('Item Category', 'attribute', 'Inventory-Sample-Data.xls retail-sample-data.xls (2 tables)');
        await datasetsPanel.clickCancelButton();
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await since('The preview dialog should be closed, user can see the dataset panel again')
            .expect(await dossierAuthoringPage.getDatasetPanel().isDisplayed())
            .toBe(true);
    });

    it('[TC58143] Map Attribute regression test', async () => {
        await libraryPage.editDossierByUrl({
            projectId: attributeMapRegressionDossier.project.id,
            dossierId: attributeMapRegressionDossier.id,
        });
        // Map Attribute Year to Year2 --> Error
        await datasetPanel.secondaryCMOnObjectFromDataset(
            'Year',
            'attribute',
            'airline-sample-data.xls Worldwide-CO2-Emissions.xl... (2 tables)',
            'Map Attributes',
            'Year (2)'
        );
        await since('Map to Year (2) should popup the error dialog')
            .expect(await dossierPage.isMojoErrorPresent())
            .toBe(true);
        await dossierPage.clickMojoErrorButton('OK');
        await since('Click OK button should close the error dialog')
            .expect(await dossierPage.isMojoErrorPresent())
            .toBe(false);
        // Map Year to Country
        await datasetPanel.secondaryCMOnObjectFromDataset(
            'Year',
            'attribute',
            'airline-sample-data.xls Worldwide-CO2-Emissions.xl... (2 tables)',
            'Map Attributes',
            'Country'
        );
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await datasetPanel.waitForElementInvisible(
            datasetsPanel.getObjectFromDataset(
                'Year',
                'attribute',
                'airline-sample-data.xls Worldwide-CO2-Emissions.xl... (2 tables)'
            ),
            { timeout: 5000 }
        );
        await since('The grid cell at row 1, column 1 should have text #{expected}, instead we have #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Visualization 1').getText())
            .toBe('Country');
        await since('The grid cell at row 2, column 1 should have text #{expected}, instead we have #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 1, 'Visualization 1').getText())
            .toBe('2009');
        await since('The grid cell at row 5, column 1 should have text #{expected}, instead we have #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 1, 'Visualization 1').getText())
            .toBe('Afghanistan');
        // The editor panel should not have "attribute" named "Year" on "Rows" section
        await since('The editor panel should not have "attribute" named "Year" on "Rows" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Year', 'attribute', 'Rows').isExisting())
            .toBe(false);
        // The datasets panel should not have "attribute" named "Year" in dataset "airline-sample-data.xls Worldwide-CO2-Emissions.xl... (2 tables)"
        await since(
            'The datasets panel should not have "attribute" named "Year" in dataset "airline-sample-data.xls Worldwide-CO2-Emissions.xl... (2 tables)"'
        )
            .expect(
                await datasetPanel
                    .getObjectFromDataset(
                        'Year',
                        'attribute',
                        'airline-sample-data.xls Worldwide-CO2-Emissions.xl... (2 tables)'
                    )
                    .isExisting()
            )
            .toBe(false);
        // Unmap
        await datasetPanel.unmapAttribute(
            'Country',
            'attribute',
            'airline-sample-data.xls Worldwide-CO2-Emissions.xl... (2 tables)'
        );
        await datasetPanel.actionOnObjectFromPreview('Country', 'airline-sample-data.xls', 'Unmap');
        await datasetPanel.updateDatasetFromPreview();
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        // The datasets panel should have "attribute" named "Country - airline-sample-data.xls" in dataset "airline-sample-data.xls Worldwide-CO2-Emissions.xl... (2 tables)"
        await datasetPanel.waitForElementVisible(
            datasetsPanel.getObjectFromDataset(
                'Country - airline-sample-data.xls',
                'attribute',
                'airline-sample-data.xls Worldwide-CO2-Emissions.xl... (2 tables)'
            ),
            { timeout: 5000 }
        );
        // The grid cell in visualization "Visualization 1" at "1", "1" has text "Country - airline-sample-data.xls"
        await since('The grid cell at row 1, column 1 should have text #{expected}, instead we have #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Visualization 1').getText())
            .toBe('Country - airline-sample-data.xls');
        await since('The grid visualization "Visualization 1" should have 4 rows of data, instead we have #{actual}')
            .expect(await vizPanelForGrid.getAllGridObjectCount('Visualization 1'))
            .toBe(4);
        await since('Undo option on toolbar should be disabled')
            .expect(await toolbar.isButtonDisabled('Undo'))
            .toBe(true);
        await since('Redo option on toolbar should be disabled')
            .expect(await toolbar.isButtonDisabled('Redo'))
            .toBe(true);
    });
});
