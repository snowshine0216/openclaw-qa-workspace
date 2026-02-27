import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

const specConfiguration = { ...customCredentials('_selector') };
const { credentials } = specConfiguration;
const tolerance = 0.6;

const tutorialProject = {
    id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
    name: 'MicroStrategy Tutorial',
};

describe('Checkbox Selector', () => {
    const docProperty1 = {
        id: 'A5D6C0BD4DC4728B109A3BAE324BF5FC',
        name: 'AUTO_Check Box_All items same width_Exclude',
        project: tutorialProject,
    };
    const docProperty2 = {
        id: '234B18A54873A7E659EA7BB95231A842',
        name: 'AUTO_Check Box_Automatic update_Element Count',
        project: tutorialProject,
    };
    const docProperty3 = {
        id: '1FC2FDC5441416C075A6FE9CBC07241A',
        name: 'AUTO_Check Box_Allow Multiple_Sxet to specific',
        project: tutorialProject,
    };
    const docProperty4 = {
        id: '77B7E86B40FE10D711D4319FD6EB92EE',
        name: 'AUTO_Check Box_Show Title_Orientation_Alias for all',
        project: tutorialProject,
    };
    const docProperty5 = {
        id: '5A23850F41EA8EBA9F4AF2A799A7A23A',
        name: 'AUTO_Check Box_Fit to content_Show title',
        project: tutorialProject,
    };
    const docFormat1 = {
        id: 'D85F6FE14C0A69FDA914F2855E8F13F8',
        name: 'AUTO_Alignment_Check Box',
        project: tutorialProject,
    };
    const docFormat2 = {
        id: '4ED002564D9B1167C144258B87E23E70',
        name: 'AUTO_Border_Check Box',
        project: tutorialProject,
    };
    const docFormat3 = {
        id: '78F30BDC4BA067E07E08609C4DF138D4',
        name: 'AUTO_ont_Check Box',
        project: tutorialProject,
    };
    const docsSourceAndTarget1 = {
        id: '93171B2E47418D7678AD8EBBF6EC1158',
        name: 'AUTO_No Source_Select Attribute Element',
        project: tutorialProject,
    };
    const docsSourceAndTarget2 = {
        id: 'C8E3D8AE4BB99DFDB5A838B3E650665D',
        name: 'AUTO_No Target_Dataset as Target_GridAndGraph as Target',
        project: tutorialProject,
    };
    const docAllWithGridGraph = {
        id: '17F061A3444DDEA1852E87BB84E60A2B',
        name: 'Checkbox_All with Grid and Graph',
        project: tutorialProject,
    };

    let { loginPage, selector, libraryPage, dossierPage, rsdPage, toc, rsdGrid } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC80327] Library | Validate Checkbox selector - Property', async () => {
        // Exclude
        await resetDossierState({ credentials, dossier: docProperty1 });
        await libraryPage.openUrl(tutorialProject.id, docProperty1.id);
        await selector.checkbox.clickItems(['Northwest']);
        await since('Exclude mode: Northwest, South should be excluded')
            .expect(await selector.checkbox.isItemsChecked(['Northwest', 'South']))
            .toBe(true);
        await since('Exclude mode: first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Web');

        // Make all items the same width
        await takeScreenshotByElement(
            selector.checkbox.getElement(),
            'TC80327',
            'CheckboxSelector_Property_SameWidth_Exclude'
        );

        // Automatically update when there is no data for the current selection
        await resetDossierState({ credentials, dossier: docProperty2 });
        await libraryPage.openUrl(tutorialProject.id, docProperty2.id);
        await since('Automatically update when there is no data: Northest should NOT be existed')
            .expect(await selector.checkbox.isItemExisted('Northest'))
            .toBe(false);

        // Show element count
        const title = await selector.checkbox.getTitle();
        await selector.checkbox.clickItems(['Mid-Atlantic']);
        await since('Automatically updatte: Mid-Atlantic should be excluded')
            .expect(await selector.checkbox.isItemsChecked(['Mid-Atlantic']))
            .toBe(true);
        await since('Show element count: The count displayed on title should be #{expected}, while we get #{actual}')
            .expect(await title.getTitleText())
            .toBe('Region (4 of 7)');
        await since('Show element count: first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Central');
        await takeScreenshotByElement(
            selector.checkbox.getElement(),
            'TC80327',
            'CheckboxSelector_Property_AutoUpdate_ShowElementCount'
        );

        // Set to specific
        await resetDossierState({ credentials, dossier: docProperty3 });
        await libraryPage.openUrl(tutorialProject.id, docProperty3.id);
        await since('Set to specific: Seleted elements count should be #{expected}, while we get #{actual}')
            .expect(await selector.checkbox.getSelectedItemsCount())
            .toBe(2);

        // Allow multiple selections
        await selector.checkbox.clickItems(['Central']);
        await since('Allow multiple selections: Central should be selected')
            .expect(await selector.checkbox.isItemsChecked(['Central']))
            .toBe(true);
        await since('Allow multiple selections: Seleted elements count should be #{expected}, while we get #{actual}')
            .expect(await selector.checkbox.getSelectedItemsCount())
            .toBe(3);

        // Orientation: verical, horizontal
        await resetDossierState({ credentials, dossier: docProperty4 });
        await libraryPage.openUrl(tutorialProject.id, docProperty4.id);
        await toc.openPageFromTocMenu({ chapterName: 'Customized' });
        const verticalSelector1 = rsdPage.findSelectorByName('customizedCategory');
        await verticalSelector1.checkbox.clickItems(['Books']);
        await since('Vertical and horizontal orientation + show customized title: Books should be selected')
            .expect(await verticalSelector1.checkbox.isItemsChecked(['Books', 'Music']))
            .toBe(true);
        await since(
            'Vertical and horizontal orientation + show customized title: first grid element should be #{expected}, while we get #{actual}'
        )
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Books');
        await takeScreenshotByElement(
            verticalSelector1.checkbox.getListTable(),
            'TC80327',
            'CheckboxSelector_Property_Orientation_CustomizedTitle'
        );

        // Show all with alias
        await toc.openPageFromTocMenu({ chapterName: 'Default' });
        const verticalSelector2 = rsdPage.findSelectorByName('defaultRegion');
        await since('Show all with alias: CustomizedAll should be displayed for selection')
            .expect(await verticalSelector2.checkbox.isItemExisted('CustomizedAll'))
            .toBe(true);
        await verticalSelector2.checkbox.clickItems(['CustomizedAll']);
        await since('Show all with alias: Option for all should be selected')
            .expect(await verticalSelector2.checkbox.isItemsChecked(['CustomizedAll']))
            .toBe(true);
        await takeScreenshotByElement(
            verticalSelector2.checkbox.getListTable(),
            'TC80327',
            'CheckboxSelector_Property_ShowAllwithAlias'
        );

        // Show title: default title, customized title
        await verticalSelector2.checkbox.clickItems(['Central']);
        await since('Vertical and horizontal orientation + show default title: Central should NOT be selected')
            .expect(await verticalSelector2.checkbox.isItemsChecked(['Central']))
            .toBe(false);
    });

    it('[TC80328] Library | Checkbox selector - Foramt', async () => {
        // Alignment
        await resetDossierState({ credentials, dossier: docFormat1 });
        await libraryPage.openUrl(tutorialProject.id, docFormat1.id);
        await takeScreenshotByElement(
            rsdPage.getDocLayoutViewer(),
            'TC80328',
            'CheckboxSelector_Format_Alignment_initialRendering',
            {
                tolerance: tolerance,
            }
        );
        await selector.checkbox.clickItems(['Books']);
        await since('Alignment left/center/right: Books should be selected')
            .expect(await selector.checkbox.isItemsChecked(['Books']))
            .toBe(true);
        await since('Alignment left/center/right: first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('USA');

        // Color and lines
        await resetDossierState({ credentials, dossier: docFormat2 });
        await libraryPage.openUrl(tutorialProject.id, docFormat2.id);
        await takeScreenshotByElement(
            rsdPage.getDocLayoutViewer(),
            'TC80328',
            'CheckboxSelector_Format_ColorAndLines_initialRendering',
            {
                tolerance: tolerance,
            }
        );
        await selector.checkbox.clickItems(['Books']);
        await since('Color and lines: Books should be selected')
            .expect(await selector.checkbox.isItemsChecked(['Books']))
            .toBe(true);
        await since('Color and lines: first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Books');

        // Font
        await resetDossierState({ credentials, dossier: docFormat3 });
        await libraryPage.openUrl(tutorialProject.id, docFormat3.id);
        await takeScreenshotByElement(
            rsdPage.getDocLayoutViewer(),
            'TC80328',
            'CheckboxSelector_Format_Font_initialRendering',
            {
                tolerance: tolerance,
            }
        );
        await selector.checkbox.clickItems(['Books']);
        await since('Font for tile/body: Books should be selected')
            .expect(await selector.checkbox.isItemsChecked(['Books']))
            .toBe(true);
        await since('Font for tile/body:first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Books');
    });

    it('[TC80329] Library | Checkbox selector - Source and Target', async () => {
        // with source - attrite element
        await resetDossierState({ credentials, dossier: docsSourceAndTarget1 });
        await libraryPage.openUrl(tutorialProject.id, docsSourceAndTarget1.id);
        const selector1 = rsdPage.findSelectorByName('categoryElement');
        await selector1.checkbox.clickItems(['Electronics']);
        await since('With source - select attribute element: Electronics should be selected')
            .expect(await selector1.checkbox.isItemsChecked(['Electronics']))
            .toBe(true);

        // // No target
        await resetDossierState({ credentials, dossier: docsSourceAndTarget2 });
        await libraryPage.openUrl(tutorialProject.id, docsSourceAndTarget2.id);
        const selector2 = rsdPage.findSelectorByName('NoTarget');
        await selector2.checkbox.clickItems(['Electronics']);
        await since('No target: Electronics should be selected')
            .expect(await selector2.checkbox.isItemsChecked(['Electronics']))
            .toBe(true);

        // With target - grid and Graph
        const selector3 = rsdPage.findSelectorByName('ObjectAsTarget');
        await selector3.checkbox.clickItems(['Electronics']);
        await rsdPage.waitAllToBeLoaded();
        await since('With target - grid and graph: Electronics should be selected')
            .expect(await selector3.checkbox.isItemsChecked(['Electronics']))
            .toBe(true);
        await since('SWith target - grid and graph: element display should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.isCellDisplayed('Electronics'))
            .toBe(true);

        // With target - dataset
        const selector4 = rsdPage.findSelectorByName('DatasetAsTarget');
        await selector4.checkbox.clickItems(['Electronics']);
        await since('With target - dataselt: Electronics should be selected')
            .expect(await selector4.checkbox.isItemsChecked(['Electronics']))
            .toBe(true);
        await since('With target - dataset: Electronics should be the only one displayed on the selector #{actual}')
            .expect((await selector4.checkbox.getChecklistItems()).length)
            .toBe(1);
        await since('With target - grid and graph: Total item count should be #{expected, while we get #{actual}')
            .expect((await selector3.checkbox.getChecklistItems()).length)
            .toBe(1);
        await since('No target: Electronics should be the only one displayed on the selector')
            .expect((await selector2.checkbox.getChecklistItems()).length)
            .toBe(1);
        await takeScreenshotByElement(
            selector3.checkbox.getListTable(),
            'TC80329',
            'CheckboxSelector_sourceAndTarget_targetDataset'
        );
    });

    it('[TC80330] Library | Checkbox selector - Manipulation', async () => {
        await resetDossierState({ credentials, dossier: docsSourceAndTarget1 });
        await libraryPage.openUrl(tutorialProject.id, docsSourceAndTarget1.id);
        const selector = rsdPage.findSelectorByName('categoryElement');

        // select element
        await selector.checkbox.clickItems(['Electronics']);
        await since('Select element: Electronics should be selected')
            .expect(await selector.checkbox.isItemsChecked(['Electronics']))
            .toBe(true);
        await since('Select element: element display should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.isCellDisplayed('Electronics'))
            .toBe(true);

        // deselect elements
        await selector.checkbox.clickItems(['Electronics']);
        await rsdPage.waitAllToBeLoaded();
        await since('Deselect element: Electronics should be deselected')
            .expect(await selector.checkbox.isItemsChecked(['Electronics']))
            .toBe(false);

        // select multiple elements
        await selector.checkbox.clickItems(['Electronics', 'Movies']);
        await since('Select multiple elements: Electronics, Movies should be selected')
            .expect(await selector.checkbox.isItemsChecked(['Electronics', 'Movies']))
            .toBe(true);
        await since('Select multiple elements: Selected element count should be #{expected}, while we get #{actual}')
            .expect(await selector.checkbox.getSelectedItemsCount())
            .toBe(3);
        await since('Select multiple elements: element display should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.isCellDisplayed('Electronics'))
            .toBe(true);
    });

    it('[TC80331] Library | Checkbox selector - Check and unchecking all selections', async () => {
        await resetDossierState({ credentials, dossier: docAllWithGridGraph });
        await libraryPage.openUrl(tutorialProject.id, docAllWithGridGraph.id);

        // Check all items
        await selector.checkbox.clickItemByText('(All)');
        await since('Select all, All should be selected')
            .expect(await selector.checkbox.isItemsChecked(['(All)']))
            .toBe(true);
        await since('Select multiple elements: element display should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.isCellDisplayed('Electronics'))
            .toBe(true);

        // Uncheck all items
        await selector.checkbox.clickItemByText('(All)');
        await since('Unselect all, All should NOT be selected')
            .expect(await selector.checkbox.isItemsChecked(['(All)']))
            .toBe(false);

        // check 'Electronics'
        await selector.checkbox.clickItemByText('Electronics');
        await since('Select element, Electronics should be selected')
            .expect(await selector.checkbox.isItemsChecked(['Electronics']))
            .toBe(true);
        await since('Select multiple elements: element display should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.isCellDisplayed('Electronics'))
            .toBe(true);
    });

    it('[TC80332] Library | Checkbox selector - Property fit to content with show title enabled', async () => {
        await resetDossierState({ credentials, dossier: docProperty5 });
        await libraryPage.openUrl(tutorialProject.id, docProperty5.id);
        const selector1 = rsdPage.findSelectorByName('fixedSelector');
        await since('Select element on subcategory, checkbox item count should be #{expected}, while we get #{actual}')
            .expect(await selector1.checkbox.getSelectedItemsCount())
            .toBe(19);

        // select element to filter checkbox
        await selector.dropdown.openDropdownAndMultiSelect(['Electronics', 'Books']);
        await since('Filter element on Category, selected items should be #{expected}, while we get #{actual}')
            .expect(await selector.dropdown.getShownSelectedText())
            .toBe('Movies');
        await since(
            'select element to filter checkbox, checkbox item count should be #{expected}, while we get #{actual}'
        )
            .expect(await selector1.checkbox.getSelectedItemsCount())
            .toBe(7);

        // select checkox
        await selector1.checkbox.clickItems(['Action', 'Comedy', 'Drama']);
        await since('Select element on subcategory, Action should NOT be selected')
            .expect(await selector1.checkbox.isItemsChecked(['Action']))
            .toBe(false);
        await since('Select element on subcategory, checkbox item count should be #{expected}, while we get #{actual}')
            .expect(await selector1.checkbox.getSelectedItemsCount())
            .toBe(3);
    });
});
export const config = specConfiguration;
