import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

const specConfiguration = { ...customCredentials('_selector') };
const { credentials } = specConfiguration;

describe('Library Selector - Button Bar Selector', () => {
    const tutorialProject = {
        id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
        name: 'MicroStrategy Tutorial',
    };
    const docProperty1 = {
        id: 'E0870AB642320BB302496A8F87D0F623',
        name: 'AUTO_ButtonBar_automatic update_exclude',
        project: tutorialProject,
    };
    const docProperty2 = {
        id: '00B13C7D496C485CB9D2A9B6F69ED186',
        name: 'AUTO_ButtonBar_multi selection_all items same width',
        project: tutorialProject,
    };
    const docProperty3 = {
        id: 'D6EDBE4F444D2148AAB025B1DAD57DC7',
        name: 'AUTO_ButtonBar_orientation_show title',
        project: tutorialProject,
    };
    const docProperty4 = {
        id: '7A5D08A04DE68E0D9957CB82DFE76605',
        name: 'AUTO_ButtonBar_set to specific_2ndAnd3rd',
        project: tutorialProject,
    };
    const docProperty5 = {
        id: '60A74DCC460620728DFCFA813FE95E73',
        name: 'AUTO_ButtonBar_use first 3_show All_show Total',
        project: tutorialProject,
    };
    const docFormat1 = {
        id: '5B1D58D846ADC8760AAF889E643906FA',
        name: 'AUTO_Alignment_ButtonBar',
        project: tutorialProject,
    };
    const docFormat2 = {
        id: 'F2469D5B4B370FC6E9BA148BE5D556B6',
        name: 'AUTO_BodyFont_ButtonBar',
        project: tutorialProject,
    };
    const docFormat3 = {
        id: 'EBC1418A492591633EF29A9A7E7AE2C5',
        name: 'AUTO_TitleFont_ButtonBar',
        project: tutorialProject,
    };
    const docFormat4 = {
        id: 'BAA7BACA4218A3EC82183AB9BABBF892',
        name: 'AUTO_ColorAndLines_ButtonBar',
        project: tutorialProject,
    };
    const docsSourceAndTarget1 = {
        id: 'F68D44644BBE88C59FAD21B4B3D17639',
        name: 'AUTO_ButtonBar_no source_attribute element',
        project: tutorialProject,
    };
    const docsSourceAndTarget2 = {
        id: '53C3DA3945085297E3871B8D37FA4620',
        name: 'AUTO_ButtonBar_No Target_Dataset as Target_Grid as Target',
        project: tutorialProject,
    };

    let { loginPage, selector, libraryPage, dossierPage, rsdPage, toc, rsdGrid } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC80312] Library | Button bar selector - Property', async () => {
        // Automatically update when there is no data for the current selection
        await resetDossierState({ credentials, dossier: docProperty1 });
        await libraryPage.openUrl(tutorialProject.id, docProperty1.id);
        await since('Automatically update when there is no data: Northest should NOT be existed')
            .expect(await selector.buttonbar.isItemExisted('Northeast'))
            .toBe(false);

        // Exclude
        await selector.buttonbar.selectNthItem(2, 'Mid-Atlantic');
        await since('Exclude mode: Mid-Atlantic should be excluded')
            .expect(await selector.buttonbar.isItemSelected(2, 'Mid-Atlantic'))
            .toBe(true);
        await since('Allow multiple selections:first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Central');

        await takeScreenshotByElement(
            selector.buttonbar.getElement(),
            'TC80312',
            'ButtonBarSelector_Property_Exclude_AutoUpdate'
        );

        await dossierPage.goToLibrary();

        // Allow multiple selections
        await resetDossierState({ credentials, dossier: docProperty2 });
        await libraryPage.openUrl(tutorialProject.id, docProperty2.id);
        await selector.buttonbar.selectNthItem(2, 'Northwest');
        await since('Allow multiple selections: Northwest should be selected')
            .expect(await selector.buttonbar.isItemSelected(2, 'Northwest'))
            .toBe(true);
        await since('Allow multiple selections: Seleted elements count should be #{expected}, while we get #{actual}')
            .expect(await selector.buttonbar.getSeletedItemsCount())
            .toBe(2);
        await since('Allow multiple selections:first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Northwest');

        // Make all items the same width
        await takeScreenshotByElement(
            selector.buttonbar.getElement(),
            'TC80312',
            'ButtonBarSelector_Property_SameWidth_MultiSelect'
        );
        await dossierPage.goToLibrary();

        // Orientation: verical, horizontal
        await resetDossierState({ credentials, dossier: docProperty3 });
        await libraryPage.openUrl(tutorialProject.id, docProperty3.id);
        await toc.openPageFromTocMenu({ chapterName: 'Customize' });
        const verticalSelector1 = rsdPage.findSelectorByName('customizedCategory');
        await verticalSelector1.buttonbar.selectNthItem(2, 'Books');
        await since('Vertical and horizontal orientation + show customized title: Books should be selected')
            .expect(await verticalSelector1.buttonbar.isItemSelected(2, 'Books'))
            .toBe(true);

        // Show title: default title, customized title
        await toc.openPageFromTocMenu({ chapterName: 'Default' });
        const verticalSelector2 = rsdPage.findSelectorByName('defaultRegion');
        await verticalSelector2.buttonbar.selectNthItem(2, 'Central');
        await since('Vertical and horizontal orientation + show default title: Central should be selected')
            .expect(await verticalSelector2.buttonbar.isItemSelected(2, 'Central'))
            .toBe(true);
        await dossierPage.goToLibrary();

        // Set to specific
        await resetDossierState({ credentials, dossier: docProperty4 });
        await libraryPage.openUrl(tutorialProject.id, docProperty4.id);
        await since('Set to specfic: Selected elements count should be #{expected}, while we get #{actual}')
            .expect(await selector.buttonbar.getSeletedItemsCount())
            .toBe(2);
        await since('WSet to specfic: first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Mid-Atlantic');
        await takeScreenshotByElement(
            selector.buttonbar.getElement(),
            'TC80312',
            'ButtonBarSelector_Property_SetToSpecific_2&3'
        );
        await dossierPage.goToLibrary();

        // // Use first N
        await resetDossierState({ credentials, dossier: docProperty5 });
        await libraryPage.openUrl(tutorialProject.id, docProperty5.id);
        await since('Use first N: Selected elements count should be #{expected}, while we get #{actual}')
            .expect(await selector.buttonbar.getSeletedItemsCount())
            .toBe(3);

        // Show total
        await since('Show total: Total should be displayed for selection')
            .expect(await selector.buttonbar.isItemExisted('Total'))
            .toBe(true);
        await selector.buttonbar.selectNthItem(6, 'Total');
        await since('Show total: Total should be selected')
            .expect(await selector.buttonbar.isItemSelected(6, 'Total'))
            .toBe(true);
        await takeScreenshotByElement(
            selector.buttonbar.getElement(),
            'TC80312',
            'ButtonBarSelector_Property_ShowTotal'
        );

        // Show All
        await since('Show all: All should be displayed for selection')
            .expect(await selector.buttonbar.isItemExisted('All'))
            .toBe(true);
        await selector.buttonbar.selectNthItem(1, 'All');
        await since('Show all: All should be selected')
            .expect(await selector.buttonbar.isItemSelected(1, 'All'))
            .toBe(true);
    });

    it('[TC80320] Library | Button bar selector - Foramt', async () => {
        // Alignment
        await resetDossierState({ credentials, dossier: docFormat1 });
        await libraryPage.openUrl(tutorialProject.id, docFormat1.id);
        await takeScreenshotByElement(
            rsdPage.getDocLayoutViewer(),
            'TC80320',
            'ButtonBarSelector_Format_Alignment_initialRendering'
        );
        await selector.buttonbar.selectNthItem(2, 'Books');
        await since('Alignment left/center/right: Books should be selected')
            .expect(await selector.buttonbar.isItemSelected(2, 'Books'))
            .toBe(true);

        // Title font
        await resetDossierState({ credentials, dossier: docFormat2 });
        await libraryPage.openUrl(tutorialProject.id, docFormat2.id);
        await takeScreenshotByElement(
            rsdPage.getDocLayoutViewer(),
            'TC80320',
            'ButtonBarSelector_Format_BodyFont_initialRendering'
        );
        await selector.buttonbar.selectNthItem(2, 'Books');
        await since('Font for title: Books should be selected')
            .expect(await selector.buttonbar.isItemSelected(2, 'Books'))
            .toBe(true);

        // Body font
        await resetDossierState({ credentials, dossier: docFormat3 });
        await libraryPage.openUrl(tutorialProject.id, docFormat3.id);
        await takeScreenshotByElement(
            rsdPage.getDocLayoutViewer(),
            'TC80320',
            'ButtonBarSelector_Format_TitleFont_initialRendering'
        );
        await selector.buttonbar.selectNthItem(2, 'Books');
        await since('Font for body: Books should be selected')
            .expect(await selector.buttonbar.isItemSelected(2, 'Books'))
            .toBe(true);

        // Color and lines
        await resetDossierState({ credentials, dossier: docFormat4 });
        await libraryPage.openUrl(tutorialProject.id, docFormat4.id);
        await takeScreenshotByElement(
            rsdPage.getDocLayoutViewer(),
            'TC80320',
            'ButtonBarSelector_Format_ColorAndLines_initial rendering'
        );
        await selector.buttonbar.selectNthItem(2, 'Books');
        await since('Color and lines: Books should be selected')
            .expect(await selector.buttonbar.isItemSelected(2, 'Books'))
            .toBe(true);
    });

    it('[TC80321] Library | Button bar selector - Source and Target', async () => {
        // with source - attrite element
        await resetDossierState({ credentials, dossier: docsSourceAndTarget1 });
        await libraryPage.openUrl(tutorialProject.id, docsSourceAndTarget1.id);
        const selector1 = rsdPage.findSelectorByName('categoryElement');
        await selector1.buttonbar.selectItemByText('Electronics');
        await since('With source - attribute element: Electronics should be selected')
            .expect(await selector1.buttonbar.isItemTextSelected('Electronics'))
            .toBe(true);

        // No target
        await resetDossierState({ credentials, dossier: docsSourceAndTarget2 });
        await libraryPage.openUrl(tutorialProject.id, docsSourceAndTarget2.id);
        const selector2 = rsdPage.findSelectorByName('NoTarget');
        await selector2.buttonbar.selectItemByText('Electronics');
        await since('No target: Electronics should be selected')
            .expect(await selector2.buttonbar.isItemTextSelected('Electronics'))
            .toBe(true);
        await takeScreenshotByElement(
            selector2.buttonbar.getListTable(),
            'TC80321',
            'ButtonBarSelector_sourceAndTarget_noTarget'
        );

        // With target - grid
        const selector3 = rsdPage.findSelectorByName('ObjectAsTarget');
        await selector3.buttonbar.selectItemByText('Electronics');
        await since('With target - grid: Electronics should be selected')
            .expect(await selector3.buttonbar.isItemTextSelected('Electronics'))
            .toBe(true);

        // With target - dataset
        const selector4 = rsdPage.findSelectorByName('DatasetAsTarget');
        await selector4.buttonbar.selectItemByText('Electronics');
        await since('With target - dataset: Electronics should be the only one displayed on the selector')
            .expect((await selector4.buttonbar.getButtonbarItems()).length)
            .toBe(1);
        await since('With target - dataselt: Electronics should be selected')
            .expect(await selector4.buttonbar.isItemTextSelected('Electronics'))
            .toBe(true);
        await since('With target - grid: Electronics should be the only one displayed on the selector')
            .expect((await selector3.buttonbar.getButtonbarItems()).length)
            .toBe(1);
        await since('No target: Electronics should be the only one displayed on the selector')
            .expect((await selector2.buttonbar.getButtonbarItems()).length)
            .toBe(1);
        await takeScreenshotByElement(
            selector2.buttonbar.getListTable(),
            'TC80321',
            'ButtonBarSelector_sourceAndTarget_targetDataset'
        );
    });

    it('[TC80322] Library | Button bar selector - Manipulation', async () => {
        await resetDossierState({ credentials, dossier: docsSourceAndTarget1 });
        await libraryPage.openUrl(tutorialProject.id, docsSourceAndTarget1.id);
        const selector = rsdPage.findSelectorByName('categoryElement');

        // select element
        await selector.buttonbar.selectItemByText('Electronics');
        await since('Select element: Electronics should be selected')
            .expect(await selector.buttonbar.isItemTextSelected('Electronics'))
            .toBe(true);

        // deselect element
        await selector.buttonbar.selectItemByText('Electronics');
        await since('Deselect element: Electronics should be deselected')
            .expect(await selector.buttonbar.isItemTextSelected('Electronics'))
            .toBe(false);

        // select multiple elements
        await selector.buttonbar.multiSelectNth(['Books', 'Electronics']);
        await since('Select multiple element: Electronics should be selected')
            .expect(await selector.buttonbar.isItemTextSelected('Electronics'))
            .toBe(true);
        await since('Select multiple elements: Selected element count should be #{expected, while we get #{actual}')
            .expect(await selector.buttonbar.getSeletedItemsCount())
            .toBe(2);
    });
});
export const config = specConfiguration;
