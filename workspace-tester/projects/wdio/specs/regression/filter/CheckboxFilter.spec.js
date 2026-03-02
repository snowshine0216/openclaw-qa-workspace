import resetDossierState from '../../../api/resetDossierState.js';
import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_filter') };

const project = {
    id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
    name: 'MicroStrategy Tutorial',
};
const browserWindow = {
    
    width: 1200,
    height: 1200,
};

describe('Checkbox Filter', () => {
    let { loginPage, filterPanel, libraryPage, checkboxFilter, grid, filterSummary, dossierPage } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(specConfiguration.credentials);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC56114] Validate attribute with special characters in filter panel', async () => {
        const dossier = {
            id: 'C9148E6949957B3815AE68A76249BDB8',
            name: 'filter with special chars',
            project,
        };
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);
        await filterPanel.openFilterPanel();
        await filterPanel.dockFilterPanel();

        // check element with ' can be applied
        await checkboxFilter.openSecondaryPanel('AttrDE102292');
        await checkboxFilter.scrollSecondaryPanelToBottom();
        await checkboxFilter.selectElementByName("a'a");
        await since("Selection for a'a is supposed to be #{expected}, instead we have #{actual}")
            .expect(await checkboxFilter.isElementSelected("a'a"))
            .toBe(true);
        await filterPanel.apply();
        await since('The first element of AttrDE102292 attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'AttrDE102292' }))
            .toBe("a'a");
        await checkboxFilter.openContextMenu('AttrDE102292');
        await checkboxFilter.selectContextMenuOption('AttrDE102292', 'Exclude');
        await filterPanel.apply();
        await since(
            'Change to exclude mode, the first element of AttrDE102292 attribute should be #{expected}, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'AttrDE102292' }))
            .toBe('a,a');

        // check select all
        await checkboxFilter.openContextMenu('AttrDE102292');
        await checkboxFilter.selectContextMenuOption('AttrDE102292', 'Include');
        await checkboxFilter.openSecondaryPanel('AttrDE102292');
        await checkboxFilter.selectAll();
        await filterPanel.apply();
        await since('Select all, filter summary for AttrDE102292 should be #{expected}, while we got #{actual}')
            .expect(await filterSummary.filterItems('AttrDE102292'))
            .toBe('(a,a, a;a, +31)');
    });
});

export const config = specConfiguration;
