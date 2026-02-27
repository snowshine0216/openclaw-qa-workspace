import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

const specConfiguration = { ...customCredentials('_selector') };
const { credentials } = specConfiguration;

const tutorialProject = {
    id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
    name: 'MicroStrategy Tutorial',
};

describe('Link Bar Selector', () => {
    const docProperty1 = {
        id: 'E39C75F642BA06A6C292C0808608F2DE',
        name: 'AUTO_Link Bar_all items same width_Exclude_consolidation',
        project: tutorialProject,
    };
    const docProperty2 = {
        id: 'EB7BA84F49A56E3E7C4A1FA3A77CBBB3',
        name: 'AUTO_Link Bar_Allow Multiple_set to specific_element count',
        project: tutorialProject,
    };
    const docProperty3 = {
        id: '0B381C1C4F9AA3D215A5F2860474C6C8',
        name: 'Auto_Link Bar_Show Title_Orientation_automatic update',
        project: tutorialProject,
    };
    const docProperty4 = {
        id: 'FD52D2E14B83D0E3AB2F0495345AC565',
        name: 'AUTO_Link Bar_use last 3_with All_with Total_display form',
        project: tutorialProject,
    };

    const docFormat1 = {
        id: 'CCAFD66244F59A43C52BFEB7B9408796',
        name: 'AUTO_Alignment_Link Bar',
        project: tutorialProject,
    };
    const docFormat2 = {
        id: '62F808D44D0DC18C788D509007A74884',
        name: 'AUTO_Color and Lines_Link Bar',
        project: tutorialProject,
    };
    const docFormat3 = {
        id: 'B426FB574C8482087CC6D5ACA440C476',
        name: 'AUTO_Font_Link Bar',
        project: tutorialProject,
    };
    const docsSourceAndTarget1 = {
        id: '91F2AEA9456C2A2C60823DA3A21B99CA',
        name: 'AUTO_New_Select Attribute_With and Without replace',
        project: tutorialProject,
    };
    const docsSourceAndTarget2 = {
        id: 'CFAC23E64515D70D2C3444A28491417F',
        name: 'AUTO_New_No Target_Dataset as Target_All and partial candidates',
        project: tutorialProject,
    };

    let { loginPage, selector, libraryPage, dossierPage, rsdGrid, rsdPage, toc } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC80351] Library | Link Bar selector - Property', async () => {
        // Exclude, Consolidation
        await resetDossierState({ credentials, dossier: docProperty1 });
        await libraryPage.openUrl(tutorialProject.id, docProperty1.id);
        await selector.linkbar.selectItemByText('Summer');
        await since('Exclude mode: Summer should be excluded')
            .expect(await selector.linkbar.isItemSelectedByText('Summer'))
            .toBe(true);
        await since('Exclude mode: first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Autumn');

        // Make all items the same width
        await takeScreenshotByElement(
            selector.linkbar.getElement(),
            'TC80351',
            'LinkBarSelector_Property_SameWidth_Exclude'
        );

        // Set to specific
        await resetDossierState({ credentials, dossier: docProperty2 });
        await libraryPage.openUrl(tutorialProject.id, docProperty2.id);
        const selectorIns = rsdPage.findSelectorByName('linkBarWithTitle');
        await since('Set to specfic: Selected elements count should be #{expected}, while we get #{actual}')
            .expect(await selectorIns.linkbar.getSeletedItemsCount())
            .toBe(2);

        // Allow multiple selections
        await selectorIns.linkbar.selectItemByText('Northwest');
        await since('Allow multiple selections: Northwest should be selected')
            .expect(await selectorIns.linkbar.isItemSelectedByText('Northwest'))
            .toBe(true);
        await since('Allow multiple selections: Seleted elements count should be #{expected}, while we get #{actual}')
            .expect(await selectorIns.linkbar.getSeletedItemsCount())
            .toBe(3);
        await since('Exclude mode: first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Mid-Atlantic');

        // Show element count
        const title = selectorIns.linkbar.getTitle();
        await since('Show element count: The count displayed on title should be #{expected}, while we get #{actual}')
            .expect(await title.getTitleText())
            .toBe('Region (3 of 9)');

        // Automatically update when there is no data for the current selection
        await resetDossierState({ credentials, dossier: docProperty3 });
        await libraryPage.openUrl(tutorialProject.id, docProperty3.id);
        await toc.openPageFromTocMenu({ chapterName: 'Customize' });
        const verticalSelector = rsdPage.findSelectorByName('customizedCategory');
        await since('Automatically update when there is no data: Music should NOT be existed')
            .expect(await selector.linkbar.isItemExisted('Music'))
            .toBe(false);

        // Orientation: verical, horizontal
        await verticalSelector.linkbar.selectItemByText('Books');
        await since('Vertical and horizontal orientation + show customized title: Books should be selected')
            .expect(await verticalSelector.linkbar.isItemSelectedByText('Books'))
            .toBe(true);
        await since(
            'Vertical and horizontal orientation + show customized title: first grid element should be #{expected}, while we get #{actual}'
        )
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Books');
        await takeScreenshotByElement(
            verticalSelector.linkbar.getElement(),
            'TC80351',
            'LinkBarSelector_Property_Orientation_CustomizedTitle'
        );

        // Show title: default title, customized title
        await toc.openPageFromTocMenu({ chapterName: 'Default' });
        const horizontalSelector = rsdPage.findSelectorByName('defaultCategory');
        await horizontalSelector.linkbar.selectItemByText('Books');
        await since('Vertical and horizontal orientation + show default title: Books should be selected')
            .expect(await horizontalSelector.linkbar.isItemSelectedByText('Books'))
            .toBe(true);

        // Use last N
        await resetDossierState({ credentials, dossier: docProperty4 });
        await libraryPage.openUrl(tutorialProject.id, docProperty4.id);
        await since('Use last N: Selected elements count should be #{expected}, while we get #{actual}')
            .expect(await selector.linkbar.getSeletedItemsCount())
            .toBe(3);
        await since('Use last N: first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Electronics');

        // Multiple display form
        await takeScreenshotByElement(
            selector.linkbar.getElement(),
            'TC80351',
            'LinkBarSelector_Property_useLast3_displayForm'
        );

        // Show total
        await since('Show total: Total should be displayed for selection')
            .expect(await selector.linkbar.isItemExisted('Total'))
            .toBe(true);
        await selector.linkbar.selectItemByText('Total');
        await since('Show total: Total should be selected')
            .expect(await selector.linkbar.isItemSelectedByText('Total'))
            .toBe(true);
        await since('Show total: first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Electronics');

        // Show All
        await since('Show all: All should be displayed for selection')
            .expect(await selector.linkbar.isItemExisted('(All)'))
            .toBe(true);
        await selector.linkbar.selectItemByText('(All)');
        await since('Show all: All should be selected')
            .expect(await selector.linkbar.isItemSelectedByText('(All)'))
            .toBe(true);
        await since('Show all: first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Books');
        await takeScreenshotByElement(selector.linkbar.getElement(), 'TC80351', 'LinkBarSelector_Property_ShowAll');
    });

    it('[TC80352] Library | Link Bar selector - Format', async () => {
        const tolerance = 0.5;
        // Alignment
        await resetDossierState({ credentials, dossier: docFormat1 });
        await libraryPage.openUrl(tutorialProject.id, docFormat1.id);
        await takeScreenshotByElement(
            rsdPage.getDocLayoutViewer(),
            'TC80352',
            'LinkBarSelector_Format_Alignment_initialRendering',
            {
                tolerance: tolerance,
            }
        );
        await selector.linkbar.selectItemByText('Books');
        await since('Alignment left/center/right: Books should be selected')
            .expect(await selector.linkbar.isItemSelectedByText('Books'))
            .toBe(true);
        await since('Alignment left/center/right:  first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('USA');

        // Color and lines
        await resetDossierState({ credentials, dossier: docFormat2 });
        await libraryPage.openUrl(tutorialProject.id, docFormat2.id);
        await selector.linkbar.selectItemByText('Books');
        await since('Color and lines: Books should be selected')
            .expect(await selector.linkbar.isItemSelectedByText('Books'))
            .toBe(true);
        await takeScreenshotByElement(
            rsdPage.getDocLayoutViewer(),
            'TC80352',
            'LinkBarSelector_Format_ColorAndLines_selectElement',
            {
                tolerance: tolerance,
            }
        );

        //  Font
        await resetDossierState({ credentials, dossier: docFormat3 });
        await libraryPage.openUrl(tutorialProject.id, docFormat3.id);
        await selector.linkbar.selectItemByText('Books');
        await since('Font for title and body: Books should be selected')
            .expect(await selector.linkbar.isItemSelectedByText('Books'))
            .toBe(true);
        await since('Font for title and body:  first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Books');
        await takeScreenshotByElement(
            rsdPage.getDocLayoutViewer(),
            'TC80352',
            'LinkBarSelector_Format_Font_selectElement',
            {
                tolerance: tolerance,
            }
        );
    });

    it('[TC80353] Library | Link Bar selector - Source and Target', async () => {
        // With source - select attribute - with replace
        await resetDossierState({ credentials, dossier: docsSourceAndTarget1 });
        await libraryPage.openUrl(tutorialProject.id, docsSourceAndTarget1.id);
        await since('With source - select attribute: Quarter should NOT be displayed on grid')
            .expect(await rsdGrid.isCellDisplayed('Quarter'))
            .toBe(false);
        const selector1 = rsdPage.findSelectorByName('attributeWithReplace');
        await selector1.linkbar.selectItemByText('Quarter');
        await since('With source - select attribute: Quarter should be selected')
            .expect(await selector1.linkbar.isItemSelectedByText('Quarter'))
            .toBe(true);
        await since('With source - select attribute: Quarter should be displayed on grid')
            .expect(await rsdGrid.isCellDisplayed('Quarter'))
            .toBe(true);
        await since('With source - select attribute:  first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCellInRow(3))
            .toBe('2014 Q2');
        // With source - select attribute - no replace
        const selector2 = rsdPage.findSelectorByName('attributeWithoutReplace');
        await selector2.linkbar.selectItemByText('Quarter');
        await selector2.linkbar.sleep(3000); // wait other selector dataset to static rendering
        await since('With source - select attribute: Quarter should be selected')
            .expect(await selector2.linkbar.isItemSelectedByText('Quarter'))
            .toBe(true);
        await since('With source - select attribute: Quarter should still be displayed on grid')
            .expect(await rsdGrid.isCellDisplayed('Quarter'))
            .toBe(true);
        await since('With source - select attribute: Month should NOT be displayed on grid')
            .expect(await rsdGrid.isCellDisplayed('Month'))
            .toBe(false);

        // No target
        await resetDossierState({ credentials, dossier: docsSourceAndTarget2 });
        await libraryPage.openUrl(tutorialProject.id, docsSourceAndTarget2.id);
        const selector3 = rsdPage.findSelectorByName('NoTarget');
        await selector3.linkbar.selectItemByText('Subcategory');
        await since('No target: Subcategory should be selected')
            .expect(await selector3.linkbar.isItemSelectedByText('Subcategory'))
            .toBe(true);
        await since('No target: Subcategory should NOT be displayed on grid')
            .expect(await rsdGrid.isCellDisplayed('Subcategory'))
            .toBe(false);
        await since('No target: first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCellInRow(3))
            .toBe('2014');

        // With target - dataset - partial candidates
        const selector4 = rsdPage.findSelectorByName('partCandidates');
        await since(
            'With target - dataset - partial candidates: Attributes count displayed should be #{expected}, while we get #{actual}'
        )
            .expect((await selector4.linkbar.getLinkListItems()).length)
            .toBe(2);
        await selector4.linkbar.selectItemByText('Subcategory');
        await selector4.linkbar.sleep(5000); // wait other selector dataset to static rendering
        await since('With target - dataset - partial candidates: Subcategory should be selected')
            .expect(await selector4.linkbar.isItemSelectedByText('Subcategory'))
            .toBe(true);
        await since('With target - dataset - partial candidates: Subcategory should be displayed on grid')
            .expect(await rsdGrid.isCellDisplayed('Subcategory'))
            .toBe(true);

        // With target - dataset - all candidates
        const selector5 = rsdPage.findSelectorByName('allCandidates');
        await since(
            'With target - dataset - all candidates: Attributes count displayed should be #{expected}, while we get #{actual}'
        )
            .expect((await selector5.linkbar.getLinkListItems()).length)
            .toBe(4);
        await selector5.linkbar.selectItemByText('Year');
        await selector5.linkbar.sleep(3000); // wait other selector dataset to static rendering
        await since('With target - dataset - all candidates: Quarter should be selected')
            .expect(await selector5.linkbar.isItemSelectedByText('Year'))
            .toBe(true);
        await since('With target - dataset - all candidates: Month should NOT be displayed on grid')
            .expect(await rsdGrid.isCellDisplayed('Subcategory'))
            .toBe(false);
    });

    it('[TC80354] Library | Link Bar selector - Manipulation', async () => {
        await resetDossierState({ credentials, dossier: docsSourceAndTarget1 });
        await libraryPage.openUrl(tutorialProject.id, docsSourceAndTarget1.id);
        const selector = rsdPage.findSelectorByName('attributeWithReplace');

        // select attribute - candidate
        await selector.linkbar.selectItemByText('Quarter');
        await selector.linkbar.sleep(3000); // wait other selector dataset to static rendering
        await since('Manipulation - select attribute - candidate: Quarter should be selected')
            .expect(await selector.linkbar.isItemSelectedByText('Quarter'))
            .toBe(true);
        await since('Manipulation - select attribute - candidate: Quarter should be displayed on grid')
            .expect(await rsdGrid.isCellDisplayed('Quarter'))
            .toBe(true);

        // select attribute - pre-define
        await selector.linkbar.selectItemByText('Category');
        await selector.linkbar.sleep(3000); // wait other selector dataset to static rendering
        await since('Manipulation - select attribute - predefine: Category should be selected')
            .expect(await selector.linkbar.isItemSelectedByText('Category'))
            .toBe(true);
        await since('Manipulation - select attribute - predefine: Category should be displayed on grid')
            .expect(await rsdGrid.isCellDisplayed('Category'))
            .toBe(true);
    });
});
export const config = specConfiguration;
