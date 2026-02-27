import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

const specConfiguration = { ...customCredentials('_selector') };
const { credentials } = specConfiguration;

const tutorialProject = {
    id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
    name: 'MicroStrategy Tutorial',
};
const tolerance = 0.2;

describe('List Box Selector', () => {
    const docProperty1 = {
        id: 'D8CB150344125C541AAC6285538F748E',
        name: 'AUTO_List Box_all item same width_tooltips_all with alias',
        project: tutorialProject,
    };
    const docProperty2 = {
        id: '0ED1826E42158CFAFE90D98E9C8CFFDC',
        name: 'AUTO_list Box_Not Allow Multiple_use last 1',
        project: tutorialProject,
    };
    const docProperty3 = {
        id: '4AB4E99E46028A6591A1E7A37C2E319C',
        name: 'AUTO_List Box_use first4_with Total_Exclude_automatic update',
        project: tutorialProject,
    };
    const docFormat1 = {
        id: '1D1A4CED44EEB2ABC000FEBCBA461B29',
        name: 'AUTO_Alignment_List Box',
        project: tutorialProject,
    };
    const docFormat2 = {
        id: '8C4FB4D246F8B4F8259305B4E1B1CF1D',
        name: 'AUTO_Color and Lines_List Box',
        project: tutorialProject,
    };
    const docFormat3 = {
        id: '543308FE4809F5D3A0190985C6C0E9BD',
        name: 'AUTO_Font_List Box',
        project: tutorialProject,
    };
    const docsSourceAndTarget1 = {
        id: '69352FD3452DEFF11AEBE6A9321AFEA6',
        name: 'AUTO_No Source_Metric Selector',
        project: tutorialProject,
    };
    const docsSourceAndTarget2 = {
        id: 'B328A89242E6B0FDE2D7EA88B1F1C215',
        name: 'AUTO_No Target_Dataset as Target_Viz as Target',
        project: tutorialProject,
    };

    let { loginPage, selector, libraryPage, dossierPage, rsdPage, rsdGrid, toc } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC80355] Library | List Box selector - Property', async () => {
        // Show All
        await resetDossierState({ credentials, dossier: docProperty1 });
        await libraryPage.openUrl(tutorialProject.id, docProperty1.id);
        await since('Show all: please show all should be displayed for selection')
            .expect(await selector.listbox.isItemExisted('please show all'))
            .toBe(true);
        await selector.listbox.selectNthItem(1, 'please show all');
        await since('Show all: please show all should be selected')
            .expect(await selector.listbox.isItemSelected(1, 'please show all'))
            .toBe(true);
        await since('Show all:  first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Central');

        // All item same width
        await takeScreenshotByElement(selector.listbox.getElement(), 'TC80355', 'ListBoxSelector_Property_ShowAll');

        // Use last 1
        await resetDossierState({ credentials, dossier: docProperty2 });
        await libraryPage.openUrl(tutorialProject.id, docProperty2.id);
        await since('Use last 1:  first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Web');

        // Not allow multiple selection
        await selector.listbox.multiSelect(['Central', 'Southeast']);
        await since('Not allow multiple selection: Only Southeast should be selected')
            .expect(await selector.listbox.isItemSelected(6, 'Southeast'))
            .toBe(true);
        await since('Not allow multiple selection: Central should NOT be selected')
            .expect(await selector.listbox.isItemSelected(1, 'Central'))
            .toBe(false);
        await since('Not allow multiple selection:  first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Southeast');

        // Use first 2 (Exclude mode)
        await resetDossierState({ credentials, dossier: docProperty3 });
        await libraryPage.openUrl(tutorialProject.id, docProperty3.id);
        await since('Use first 2  (Exclude mode) : The first 2 elements should be included only')
            .expect(await selector.listbox.isItemSelected(1, 'Central'))
            .toBe(false);

        // Exclude mode
        await selector.listbox.selectNthItem(1, 'Central');
        await since('Exclude mode: The selected element central should be excluded')
            .expect(await selector.listbox.isItemSelected(1, 'Central'))
            .toBe(true);
        await since('Exclude mode: first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Mid-Atlantic');
        await takeScreenshotByElement(selector.listbox.getElement(), 'TC80355', 'ListBoxSelector_Property_Exclude');

        // Show total
        await since('Show total: Total should be displayed for selection')
            .expect(await selector.listbox.isItemExisted('Total'))
            .toBe(true);
        await selector.listbox.selectNthItem(9, 'Total');
        await since('Show total: Total should be selected')
            .expect(await selector.listbox.isItemSelected(9, 'Total'))
            .toBe(true);
    });

    it('[TC80356] Library | List Box selector - Foramt', async () => {
        // Alignment
        await resetDossierState({ credentials, dossier: docFormat1 });
        await libraryPage.openUrl(tutorialProject.id, docFormat1.id);
        await takeScreenshotByElement(
            rsdPage.getDocLayoutViewer(),
            'TC80356',
            'ListBoxSelector_Format_Alignment_initialRendering',
            {
                tolerance: tolerance,
            }
        );
        await selector.listbox.selectNthItem(2, 'Books');
        await since('Alignment left/center/right: Books should be selected')
            .expect(await selector.listbox.isItemSelected(2, 'Books'))
            .toBe(true);
        await since('Exclude mode: first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('USA');

        // Color and lines
        await resetDossierState({ credentials, dossier: docFormat2 });
        await libraryPage.openUrl(tutorialProject.id, docFormat2.id);
        await takeScreenshotByElement(
            rsdPage.getDocLayoutViewer(),
            'TC80356',
            'ListBoxSelector_Format_ColorAndLines_initial rendering',
            {
                tolerance: tolerance,
            }
        );
        await selector.listbox.selectNthItem(2, '2014');
        await since('Color and lines: 2014 should be selected')
            .expect(await selector.listbox.isItemSelected(2, '2014'))
            .toBe(true);

        // Font
        await resetDossierState({ credentials, dossier: docFormat3 });
        await libraryPage.openUrl(tutorialProject.id, docFormat3.id);
        await takeScreenshotByElement(
            rsdPage.getDocLayoutViewer(),
            'TC80356',
            'ListBoxSelector_Format_BodyFont_initialRendering',
            {
                tolerance: tolerance,
            }
        );
        await selector.listbox.selectNthItem(2, 'Books');
        await since('Font for title: Books should be selected')
            .expect(await selector.listbox.isItemSelected(2, 'Books'))
            .toBe(true);
        await since('Color and lines:  first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Electronics');
    });

    it('[TC80357] Library | List Box selector - Source and Target', async () => {
        // with source - attrite element
        await resetDossierState({ credentials, dossier: docsSourceAndTarget1 });
        await libraryPage.openUrl(tutorialProject.id, docsSourceAndTarget1.id);
        const selector1 = rsdPage.findSelectorByName('MetricSelector');
        await selector1.listbox.selectItemByText('Cost');
        await since('With source - select metric: Cost should be selected')
            .expect(await selector1.listbox.isItemTextSelected('Cost'))
            .toBe(true);

        // No source
        await takeScreenshotByElement(
            selector1.listbox.getListTable(),
            'TC80357',
            'ListBoxSelector_sourceAndTarget_noSource_selectMetric'
        );

        // No target
        await resetDossierState({ credentials, dossier: docsSourceAndTarget2 });
        await libraryPage.openUrl(tutorialProject.id, docsSourceAndTarget2.id);
        const selector2 = rsdPage.findSelectorByName('NoTarget');
        await selector2.listbox.selectItemByText('Electronics');
        await since('No target: Electronics should be selected')
            .expect(await selector2.listbox.isItemTextSelected('Electronics'))
            .toBe(true);

        // With target - viz
        const selector3 = rsdPage.findSelectorByName('ObjectAsTarget');
        await selector3.listbox.selectItemByText('Electronics');
        await since('With target - viz: Electronics should be selected')
            .expect(await selector3.listbox.isItemTextSelected('Electronics'))
            .toBe(true);
        await takeScreenshotByElement(
            selector3.listbox.getListTable(),
            'TC80357',
            'ListBoxSelector_sourceAndTarget_targetViz'
        );

        // With target - dataset
        const selector4 = rsdPage.findSelectorByName('DatasetAsTarget');
        await selector4.listbox.selectItemByText('Electronics');
        await since('With target - dataset: Electronics should be the only one displayed on the selector')
            .expect((await selector4.listbox.getListBoxListItems()).length)
            .toBe(1);
        await since('With target - dataset: Electronics should be selected')
            .expect(await selector4.listbox.isItemTextSelected('Electronics'))
            .toBe(true);
        await since('With target - viz: Electronics should be the only one displayed on the selector')
            .expect((await selector3.listbox.getListBoxListItems()).length)
            .toBe(1);
        await since('No target: Electronics should be the only one displayed on the selector')
            .expect((await selector2.listbox.getListBoxListItems()).length)
            .toBe(1);
        await takeScreenshotByElement(
            selector3.listbox.getListTable(),
            'TC80357',
            'ListBoxSelector_sourceAndTarget_targetDataset'
        );
    });

    it('[TC80358] Library | List Box selector - Manipulation', async () => {
        await resetDossierState({ credentials, dossier: docsSourceAndTarget1 });
        await libraryPage.openUrl(tutorialProject.id, docsSourceAndTarget1.id);
        const selector = rsdPage.findSelectorByName('MetricSelector');

        // select element
        await selector.listbox.selectItemByText('Cost');
        await since('Select element: Cost should be selected')
            .expect(await selector.listbox.isItemTextSelected('Cost'))
            .toBe(true);
        await since('Select element: first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCellInRow(3))
            .toBe('Books');

        // select multiple elements
        await selector.listbox.multiSelect(['Profit', 'Cost']);
        await since('Select multiple element: Cost should be selected')
            .expect(await selector.listbox.isItemTextSelected('Cost'))
            .toBe(true);
        await since('Select multiple elements: Selected element count should be #{expected, while we get #{actual}')
            .expect(await selector.listbox.getSeletedItemsCount())
            .toBe(2);
        await takeScreenshotByElement(
            selector.listbox.getElement(),
            'TC80358',
            'ListBoxSelector_manipulation_multiSelect'
        );
    });
});
export const config = specConfiguration;
