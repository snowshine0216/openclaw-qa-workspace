import * as gridConstants from '../../../constants/grid.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { browserWindow } from '../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';

describe('Compound Grid Derived Attribute', () => {
    let { loginPage, libraryPage, gridAuthoring, editorPanelForGrid, groupEditor, linkEditor, derivedAttributeEditor } =
        browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(gridConstants.gridTestUser);
        await setWindowSize(browserWindow);
    });
    beforeEach(async () => {
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.CompoundGridDerivedObjects.id,
            projectId: gridConstants.CompoundGridDerivedObjects.project.id,
        });
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
        await libraryPage.handleError();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC62631_02] Group Editor Test', async () => {
        await groupEditor.createGroupsFromEditorPanel({
            attributeName: 'Departure Hour',
            groupElements: [
                ['06:00-07:00', '07:00-08:00'],
                ['08:00-09:00', '09:00-10:00'],
                ['10:00-11:00', '11:00-12:00'],
            ],
        });

        const departureHourGroup = 'Departure Hour(Group)';
        const departureHour = 'Departure Hour';

        const rowObjectTexts = await editorPanelForGrid.getRowObjectTexts();
        await since(
            `The editor panel should have "new derived element" named "${departureHourGroup}" on "Rows" section, instead we have #{actual}`
        )
            .expect(rowObjectTexts.includes(departureHourGroup))
            .toBe(true);
        await since(
            `The editor panel should not have "attribute" named "${departureHour}" on "Rows" section, instead we have #{actual}`
        )
            .expect(rowObjectTexts.includes(departureHour))
            .toBe(false);

        await since(
            `The grid cell in visualization "Visualization 1" at "1", "2" should have text #{expected}, instead we have #{actual}`
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(1, 2, 'Visualization 1'))
            .toBe(departureHourGroup);
        await since(
            'The grid cell in visualization "Visualization 1" at "1", "5" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(1, 5, 'Visualization 1'))
            .toBe('March');
        await since(
            'The grid cell in visualization "Visualization 1" at "3", "3" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 3, 'Visualization 1'))
            .toBe('15');
        await since(
            'The grid cell in visualization "Visualization 1" at "4", "2" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(4, 2, 'Visualization 1'))
            .toBe('17');
        await since(
            'The grid cell in visualization "Visualization 1" at "3", "15" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 15, 'Visualization 1'))
            .toBe('1882');
        await since(
            'The grid cell in visualization "Visualization 1" at "5", "15" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(5, 15, 'Visualization 1'))
            .toBe('4160');

        await since(
            'Grid cell in visualization "Visualization 1" at "6", "16" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(6, 16, 'Visualization 1'))
            .toBe('458.83');
        await since(
            'Grid cell in visualization "Visualization 1" at "3", "2" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 2, 'Visualization 1'))
            .toBe('Group 3');
        await since(
            'Grid cell in visualization "Visualization 1" at "4", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(4, 1, 'Visualization 1'))
            .toBe('Group 2');
        await since(
            'Grid cell in visualization "Visualization 1" at "5", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(5, 1, 'Visualization 1'))
            .toBe('Group 1');
    });

    it('[TC62631_03] Attribute Editor Test', async () => {
        await editorPanelForGrid.createAttribute('Airline Name');
        await derivedAttributeEditor.createDerivedAttribute({
            objectNames: ['Airline Name', 'Origin Airport'],
            derivedAttributeName: 'Airline Airport',
        });
        const rowObjectTexts = await editorPanelForGrid.getRowObjectTexts();
        await since('"Airline Airport" should be in "Rows" section, instead we have #{actual}')
            .expect(rowObjectTexts.includes('Airline Airport'))
            .toBe(true);
        await since('"Airline Name" should be in "Rows" section, instead we have #{actual}')
            .expect(rowObjectTexts.includes('Airline Name'))
            .toBe(true);
        await since('Grid cell at "1", "2" should have text #{expected}, instead we have #{actual}')
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(1, 3, 'Visualization 1'))
            .toBe('Airline Airport');
        await since(
            'Grid cell in visualization "Visualization 1" at "3", "3" should have #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 3, 'Visualization 1'))
            .toBe('BWI');
        await since(
            'Grid cell in visualization "Visualization 1" at "1", "5" should have #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(1, 5, 'Visualization 1'))
            .toBe('February');
        await since(
            'Grid cell in visualization "Visualization 1" at "3", "3" should have #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 4, 'Visualization 1'))
            .toBe('1');
    });

    it('[TC62631_04] Link Editor Test', async () => {
        await editorPanelForGrid.createLink('Airline Name');
        const linkURL = 'http://www.google.com/';
        await linkEditor.createLinkWithDefaultSettings({ linkUrl: linkURL });
        const rowObjectTexts = await editorPanelForGrid.getRowObjectTexts();
        await since(
            'The editor panel should have "derived attribute" named "Airline Name(Link)" on "Rows" section, instead we have #{actual}'
        )
            .expect(rowObjectTexts.includes('Airline Name(Link)'))
            .toBe(true);
        await since(
            'The editor panel should have "attribute" named "Airline Name" on "Rows" section, instead we have #{actual}'
        )
            .expect(rowObjectTexts.includes('Airline Name'))
            .toBe(true);
        await since(
            'The grid cell in visualization "Visualization 1" at "3", "2" has text "AirTran Airways Corporation" with hyperlink #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.selectors.getLinkFromGridCell(3, 2, 'Visualization 1'))
            .toBe(linkURL);
        await editorPanelForGrid.createLink('Month');
        const linkURL2 = 'http://www.amazon.com/';
        await linkEditor.createLinkWithDefaultSettings({ linkUrl: linkURL2 });
        const columnSetObjectTexts = await editorPanelForGrid.getColumnSetObjectTexts('Column Set 1');
        await since(
            'The editor panel should have "derived attribute" named "Month(Link)" on "Column Set 1" section, instead we have #{actual}'
        )
            .expect(columnSetObjectTexts.includes('Month(Link)'))
            .toBe(true);
        await since(
            'The editor panel should have "attribute" named "Month" on "Column Set 1" section, instead we have #{actual}'
        )
            .expect(columnSetObjectTexts.includes('Month'))
            .toBe(true);
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "1" has text "January" with hyperlink #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 1, 'Visualization 1'))
            .toBe('January');
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "1" has hyperlink #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.selectors.getLinkFromGridCell(2, 1, 'Visualization 1'))
            .toBe(linkURL2);
        await since(
            'The grid cell in visualization "Visualization 1" at "1", "3" has text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(1, 3, 'Visualization 1'))
            .toBe('Departure Hour');
        await since(
            'The grid cell in visualization "Visualization 1" at "4", "4" has text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(4, 4, 'Visualization 1'))
            .toBe('1');
        await since(
            'The grid cell in visualization "Visualization 1" at "1", "7" has text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(1, 7, 'Visualization 1'))
            .toBe('April');
        await since(
            'The grid cell in visualization "Visualization 1" at "4", "5" has text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(4, 5, 'Visualization 1'))
            .toBe('4');
    });
});
