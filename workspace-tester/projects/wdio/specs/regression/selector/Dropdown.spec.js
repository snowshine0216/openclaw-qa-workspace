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

describe('Dropdown Selector', () => {
    const docProperty1 = {
        id: 'A4600E4A436F0C9805E13E8BE5672AD5',
        name: 'AUTO_Drop Down_auto update_ use last_Element count_show all',
        project: tutorialProject,
    };
    const docProperty2 = {
        id: 'BC1F5ECD4D67569C2D566091EE436C15',
        name: 'AUTO_Drop Down_show total_Exclude_DisplayForm',
        project: tutorialProject,
    };
    const docFormat1 = {
        id: 'AB9AF0B548710C6BE33384A72E7783DA',
        name: 'AUTO_Alignment_Drop Down',
        project: tutorialProject,
    };
    const docFormat2 = {
        id: '469997C74D6977AC96B17D9ED18CBE45',
        name: 'AUTO_Border_Drop Down',
        project: tutorialProject,
    };
    const docFormat3 = {
        id: 'F698EAE24A4D499FE0E1EEA20C50705B',
        name: 'AUTO_Font_Drop shadow_Drop Down',
        project: tutorialProject,
    };
    const docsSourceAndTarget1 = {
        id: 'F9C95D914D12A0B5153A4298E952A6A5',
        name: 'AUTO_New_No Source_Select metric_Select attribute',
        project: tutorialProject,
    };
    const docsSourceAndTarget2 = {
        id: '988F95E64F1328E25574CB82558EDB9B',
        name: 'AUTO_New_Selector as Target_Dataset as Target_Graph as Target',
        project: tutorialProject,
    };
    const documentDropdownScroll = {
        id: 'DCAD34F14488A11B4E76CAB4FB2F3958',
        name: 'AUTO_Dropdown_Inside and outside scrollbar',
        project: tutorialProject,
    };
    const documentDropdownSearch = {
        id: 'BE3BE12845EAB3AC0FFF548BAE0DE66B',
        name: 'AUTO_Dropdown_Quick search with number and string',
        project: tutorialProject,
    };

    let { loginPage, selector, libraryPage, dossierPage, rsdPage, toc, rsdGrid } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC80333] Library | Dropdown selector - Property', async () => {
        // Use last 1
        await resetDossierState({ credentials, dossier: docProperty1 });
        await libraryPage.openUrl(tutorialProject.id, docProperty1.id);
        await since('Use last : Selected elements should be #{expected}, while we get #{actual}')
            .expect(await selector.dropdown.getShownSelectedText())
            .toBe('Web');

        // Show element count
        const title = selector.dropdown.getTitle();
        await since('Show element count: The title should be #{expected}, while we get #{actual}')
            .expect(await title.getTitleText())
            .toBe('Hello World (5)');
        await since('Allow multiple selections: first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Web');

        // Automatically update when there is no data
        await selector.dropdown.openDropdown();
        await since(
            'Automatically update when there is no data: Dropdown item count should be #{expected}, while we get #{actual}'
        )
            .expect(await selector.dropdown.dropdownItemsCount())
            .toBe(6);
        await since('Automatically update when there is no data: Sourthest should NOT be existed')
            .expect(await selector.dropdown.isItemExisted('Sourthest'))
            .toBe(false);

        // Show option for all
        await since('Show option for All: Show option for All should be displayed')
            .expect(await selector.dropdown.isItemExisted('Show option for All'))
            .toBe(true);
        await selector.dropdown.selectNthItem(1, 'Show option for All');
        await since('Show option for All:  first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Central');
        await takeScreenshotByElement(selector.dropdown.getElement(), 'TC80333', 'DropdownSelector_Property_ShowAll');

        // Display form
        await resetDossierState({ credentials, dossier: docProperty2 });
        await libraryPage.openUrl(tutorialProject.id, docProperty2.id);
        await since('Display form : Selected elements should be #{expected}, while we get #{actual}')
            .expect(await selector.dropdown.getShownSelectedText())
            .toBe('2==Mid-Atlantic');

        // Exclude
        await since('Display form :  first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Northwest');
        await takeScreenshotByElement(
            selector.dropdown.getElement(),
            'TC80333',
            'DropdownSelector_Property_Exclude_DisplayForm'
        );

        // Show total
        await selector.dropdown.openDropdown();
        await since('Show option for Total: Total should be displayed')
            .expect(await selector.dropdown.isItemExisted('Total'))
            .toBe(true);
        await selector.dropdown.selectNthItem(5, 'Total');
        await since('Show option for Total: first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Mid-Atlantic');
    });

    it('[TC80334] Library | Dropdown selector - Foramt', async () => {
        // Alignment
        await resetDossierState({ credentials, dossier: docFormat1 });
        await libraryPage.openUrl(tutorialProject.id, docFormat1.id);
        await selector.dropdown.openDropdown();
        await takeScreenshotByElement(
            rsdPage.getDocLayoutViewer(),
            'TC80334',
            'DropdownSelector_Format_Alignment_initialRendering',
            {
                tolerance: tolerance,
            }
        );
        await selector.dropdown.selectNthItem(2, 'Books');
        await since('Alignment left/center/right: Selected elements should be #{expected}, while we get #{actual}')
            .expect(await selector.dropdown.getShownSelectedText())
            .toBe('Books');
        await since('Alignment left/center/right:  first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Books');

        // Color and lines
        await resetDossierState({ credentials, dossier: docFormat2 });
        await libraryPage.openUrl(tutorialProject.id, docFormat2.id);
        await takeScreenshotByElement(
            rsdPage.getDocLayoutViewer(),
            'TC80334',
            'DropdownSelector_Format_ColorAndLines_initial rendering'
        );
        await selector.dropdown.openDropdown();
        await selector.dropdown.selectNthItem(2, 'Books');
        await since('Color and lines: Selected elements should be #{expected}, while we get #{actual}')
            .expect(await selector.dropdown.getShownSelectedText())
            .toBe('Books');
        await takeScreenshotByElement(
            rsdPage.getDocLayoutViewer(),
            'TC80334',
            'DropdownSelector_Format_ColorAndLines_selectElement'
        );

        // Font
        await resetDossierState({ credentials, dossier: docFormat3 });
        await libraryPage.openUrl(tutorialProject.id, docFormat3.id);
        await takeScreenshotByElement(
            rsdPage.getDocLayoutViewer(),
            'TC80334',
            'DropdownSelector_Format_Font_initialRendering'
        );
        await selector.dropdown.openDropdown();
        await selector.dropdown.selectNthItem(2, 'Cost');
        await since('Font: Selected elements should be #{expected}, while we get #{actual}')
            .expect(await selector.dropdown.getShownSelectedText())
            .toBe('Cost');
        await since('Font:  first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Mid-Atlantic');
    });

    it('[TC80335] Library | Dropdown selector - Source and Target', async () => {
        await resetDossierState({ credentials, dossier: docsSourceAndTarget1 });
        await libraryPage.openUrl(tutorialProject.id, docsSourceAndTarget1.id);

        // No source
        const selector1 = await rsdPage.findSelectorByName('SelectAttribute');
        await since('No source:  first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('2014');

        // with source - select attribute
        await selector1.dropdown.openDropdown();
        await selector1.dropdown.selectItemByText('Month');
        await selector1.dropdown.sleep(3000); // wait dataset to be refreshed
        await since('With source - select attribute: Selected elements should be #{expected}, while we get #{actual}')
            .expect(await selector1.dropdown.getShownSelectedText())
            .toBe('Month');

        await selector1.dropdown.openDropdown();
        await selector1.dropdown.selectItemByText('Quarter');
        await selector1.dropdown.sleep(3000); // wait dataset to be refreshed
        await since('With source - select attribute: Selected elements should be #{expected}, while we get #{actual}')
            .expect(await selector1.dropdown.getShownSelectedText())
            .toBe('Quarter');
        await since(
            'With source - select attribute:   first grid element should be #{expected}, while we get #{actual}'
        )
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('2014');

        // Targeted by other selector: Filtered by dataset
        await resetDossierState({ credentials, dossier: docsSourceAndTarget2 });
        await libraryPage.openUrl(tutorialProject.id, docsSourceAndTarget2.id);
        const selector2 = await rsdPage.findSelectorByName('SelectorAsTarget');
        await selector2.dropdown.openDropdown();
        await since(
            'Filtered by dataset: Subcategory dropdown item count should be #{expected}, while we get #{actual}'
        )
            .expect(await selector2.dropdown.dropdownItemsCount())
            .toBe(5);

        await selector2.dropdown.closeDropdown();

        await selector.listbox.selectItemByText('(All)');
        await selector.listbox.sleep(3000); // wait dataset to be refreshed

        await selector2.dropdown.openDropdown();
        await since(
            'Filtered by dataset: After reset to All, Subcategory dropdown item count should be #{expected}, while we get #{actual}'
        )
            .expect(await selector2.dropdown.dropdownItemsCount())
            .toBe(13);
        await selector2.dropdown.selectItemByText('2014 Q1');
        await selector.listbox.sleep(1000); // wait dataset to be refreshed

        // Target to selector
        const selector3 = await rsdPage.findSelectorByName('GraphAsTarget');
        await selector3.dropdown.openDropdown();
        await since('Filtered by selector: Item dropdown list count should be #{expected}, while we get #{actual}')
            .expect(await selector3.dropdown.dropdownItemsCount())
            .toBe(4);
    });

    it('[TC80336] Library | Dropdown selector - Manipulation', async () => {
        await resetDossierState({ credentials, dossier: docsSourceAndTarget2 });
        await libraryPage.openUrl(tutorialProject.id, docsSourceAndTarget2.id);

        // select
        const selector = await rsdPage.findSelectorByName('GraphAsTarget');
        await selector.dropdown.openDropdown();
        await selector.dropdown.selectItemByText('Apr 2014');
        await selector.dropdown.sleep(3000);
        await since('Select element: Selected elements should be #{expected}, while we get #{actual}')
            .expect(await selector.dropdown.getShownSelectedText())
            .toBe('Apr 2014');
        await takeScreenshotByElement(
            selector.dropdown.getElement(),
            'TC80336',
            'DropdownSelector_Manipulation_select'
        );
    });

    it('[TC80337] Library | Dropdown selector - Select elements using the numeric keyboard', async () => {
        if (browser.isIE) {
            await since("[IE] Please check manually, this browser currently can't achieve compatible keyboard event")
                .expect(true)
                .toBe(false);
        } else {
            await resetDossierState({ credentials, dossier: documentDropdownSearch });
            await libraryPage.openUrl(tutorialProject.id, documentDropdownSearch.id);
            await rsdPage.waitAllToBeLoaded();
            const selector1 = rsdPage.findSelectorByName('yearDD');
            await selector1.dropdown.openDropdown();

            // Type '2'
            await rsdPage.typeKeyboard(['Numpad2']);
            await since('Search element by 2: Selected elements should be #{expected}, while we get #{actual}')
                // .expect(await selector1.dropdown.getShownSelectedText()).toBe('2014'); // Defect specific on Libary
                .expect(await selector1.dropdown.getShownSelectedText())
                .toBe('(All)');

            // Type '2016'
            await selector1.typeKeyboard(['Numpad2', 'Numpad0', 'Numpad1', 'Numpad6']);
            await since('Search element by 2016: Selected elements should be #{expected}, while we get #{actual}')
                // .expect(await selector1.dropdown.getShownSelectedText()).toBe('2016');// Defect specific on Libarys
                .expect(await selector1.dropdown.getShownSelectedText())
                .toBe('(All)');
            await selector1.dropdown.selectNthItem(4, '2016');

            // Type 'bo'
            const selector2 = rsdPage.findSelectorByName('categoryDD');
            await selector2.dropdown.openDropdown();
            await selector2.typeKeyboard(['bo']);
            await since('Select element by bo: Selected elements should be #{expected}, while we get #{actual}')
                .expect(await selector2.dropdown.getShownSelectedText())
                .toBe('Books');
        }
    });

    it('[TC80338] Library | Dropdown selector - Scroll inside and outside of dropdown selector', async () => {
        await resetDossierState({ credentials, dossier: documentDropdownScroll });
        await libraryPage.openUrl(tutorialProject.id, documentDropdownScroll.id);
        await rsdPage.waitAllToBeLoaded();

        // Open Subcategory Selector dropdown
        await selector.dropdown.openDropdown();
        // Scroll the dropdown
        await selector.dropdown.scrollDropdown(200);
        await takeScreenshotByElement(
            selector.dropdown.getDropdownList(),
            'TC80338',
            'Dropdown_ScrollInsideDropdown_1'
        );
        // Scroll outside the dropdown
        await rsdPage.scrollOnPage(100);
        // Scroll the dropdown
        await selector.dropdown.scrollDropdown(100);
        await takeScreenshotByElement(
            selector.dropdown.getDropdownList(),
            'TC80338',
            'Dropdown_ScrollInsideDropdown_2'
        );
    });
});
export const config = specConfiguration;
