import * as gridConstants from '../../../constants/grid.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { browserWindow } from '../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';

describe('Compound Grid Filter Test', () => {
    let { loginPage, libraryPage, gridAuthoring, authoringFilters, inCanvasSelector_Authoring } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(gridConstants.gridTestUser);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
        await libraryPage.handleError();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC62631_07] Compound grid shows additional cell selections when changing a metric selector', async () => {
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.CompoundGridFormatting.id,
            projectId: gridConstants.CompoundGridFormatting.project.id,
        });

        await authoringFilters.createSimpleObjectSelectorWithReplacement({
            objectName: 'Units Available',
            replacementName: 'Units Sold',
        });
        await since('Grid cell at "1", "5" in "Visualization 1" should have #{expected} instead we have #{actual}')
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(1, 5, 'Visualization 1'))
            .toBe('Units Sold');
        await since('Grid cell at "2", "5" in "Visualization 1" should have #{expected} instead we have #{actual}')
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 5, 'Visualization 1'))
            .toBe('20559');

        await inCanvasSelector_Authoring.selectFromLinkBarAttributeMetricSelector('Units Available');
        await since(
            'The grid cell in visualization "Visualization 1" at "1", "5" should have text #{expected} instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(1, 5, 'Visualization 1'))
            .toBe('Units Available');
        await since('Grid cell at "2", "5" in "Visualization 1" should have #{expected} instead we have #{actual}')
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 5, 'Visualization 1'))
            .toBe('59,328');
    });
});
