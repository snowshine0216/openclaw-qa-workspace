import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

const specConfiguration = { ...customCredentials('_selector') };
const { credentials } = specConfiguration;

const tutorialProject = {
    id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
    name: 'MicroStrategy Tutorial',
};

describe('Dropdown Selector - MultiSelect', () => {
    const docSelectMetric = {
        id: '3D38F2E0446ADB692F0CE780D202FA97',
        name: '(AUTO) Dropdown_MS_SelectMetric',
        project: tutorialProject,
    };
    const docErrorHandling = {
        id: '7470573D4BB935E708F58BAD1DA6CC79',
        name: '(AUTO) Dropdown_MS_NoSourceOrTarget',
        project: tutorialProject,
    };
    const docSelectAttributeElement = {
        id: '585A36DF4218D991877E0A80F6C7A58E',
        name: '(AUTO) Dropdown_MS_SelectAttributeElement_Exclude_First2',
        project: tutorialProject,
    };
    const docDerivedAttribute = {
        id: 'E4005E20462599696A4563A34C53FB16',
        name: '(AUTO) Dropdown_MS_DerivedAttribute_Unset_FitWidth',
        project: tutorialProject,
    };
    const docConsolidationGroup = {
        id: '41A07E3349E87A345F088E815ECC52DE',
        name: '(AUTO) Dropdown_MS_Consolidation&Group',
        project: tutorialProject,
    };
    const docTargetDataset = {
        id: '826B74AC46FFC6A16BBF7C8F92361BCA',
        name: '((AUTO) Dropdown_MS_TargetDataset',
        project: tutorialProject,
    };
    const docTargetSelectorN2N = {
        id: '69A4CBD24FDC28664C8F1FB06C6C9FED',
        name: '(AUTO) Dropdown_MS_TargetSelector_MultiToMulti_UseFirstLast',
        project: tutorialProject,
    };
    const docTargetSelectorN21 = {
        id: 'E89CC285408FF01857E21BA68FA04F4D',
        name: '(AUTO) Dropdown_MS_TargetSelector_MultipleToSingle',
        project: tutorialProject,
    };
    const docXfuncLinkdrill = {
        id: 'EF897EE747110445D22631AE8D028CEE',
        name: '(AUTO) Dropdown_MS_XFunc_LinkDrill',
        project: tutorialProject,
    };
    const docXfuncPanels = {
        id: '44D2DF7E45E9DB8F7FD102BF1C716A58',
        name: '(AUTO) Dropdown_MS_XFunc_FilterPanel&PanelStack',
        project: tutorialProject,
    };
    const docXfuncInfoWindow = {
        id: 'F48DA7B747288D564EB0948961C35310',
        name: '(AUTO) Dropdown_MS_XFunc_InfoWindows',
        project: tutorialProject,
    };

    let { loginPage, selector, libraryPage, dossierPage, rsdPage, toc, rsdGrid } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC80339] Library | Dropdown selector - Multi-Select manipulation on select and cancel', async () => {
        await resetDossierState({ credentials, dossier: docSelectMetric });
        await libraryPage.openUrl(tutorialProject.id, docSelectMetric.id);

        // cancel selection
        await selector.dropdown.openDropdownNoWait();
        await takeScreenshotByElement(
            selector.dropdown.getDropdownList(),
            'TC80339',
            'Dropdown_MultiSelect_Manipulation_UI'
        );
        await selector.dropdown.selectMultiItemByText(['Unit Cost', 'Revenue']);
        await selector.dropdown.clickCancelBtn();
        await since(
            'Multi-select manipulation: Cancel selection, selected items should be #{expected}, while we get #{actual}'
        )
            .expect(await selector.dropdown.getShownSelectedText())
            .toBe('Units Sold, Profit');

        // confirm selection
        await selector.dropdown.openDropdown();
        await selector.dropdown.selectMultiItemByText(['Unit Cost', 'Revenue']);
        await selector.dropdown.clickOKBtn();
        await rsdPage.waitAllToBeLoaded();
        await since(
            'Multi-select manipulation: Confirm selection, selected items should be #{expected}, while we get #{actual}'
        )
            .expect(await selector.dropdown.getShownSelectedText())
            .toBe('Unit Cost, Units Sold, Revenue, Profit');
        await takeScreenshotByElement(
            selector.dropdown.getElement(),
            'TC80339',
            'Dropdown_MultiSelect_Manipulation_select'
        );
    });

    it('[TC80341] Library | Dropdown selector - Multi-Select combine with different selector properties', async () => {
        // use last 5 + exclude
        await resetDossierState({ credentials, dossier: docSelectAttributeElement });
        await libraryPage.openUrl(tutorialProject.id, docSelectAttributeElement.id);
        await since(
            'Multi-select with different properties, selected items should be #{expected}, while we get #{actual}'
        )
            .expect(await selector.dropdown.getShownSelectedText())
            .toBe('Central, Mid-Atlantic, Northeast, Total');
        await since(
            'Multi-select with different properties, first grid element should be #{expected}, while we get #{actual}'
        )
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Northwest');

        // show total
        await selector.dropdown.openDropdownAndMultiSelect(['Total']);
        await rsdPage.waitAllToBeLoaded();
        await since(
            'Multi-select with different properties: select total, selected items should be #{expected}, while we get #{actual}'
        )
            .expect(await selector.dropdown.getShownSelectedText())
            .toBe('Central, Mid-Atlantic, Northeast');
        await since(
            'Multi-select with different properties: total display should be #{expected}, while we get #{actual}'
        )
            .expect(await rsdGrid.isCellDisplayed('Total'))
            .toBe(true);

        // select none
        await selector.dropdown.openDropdownAndMultiSelect(['Central', 'Mid-Atlantic', 'Northeast']);
        await since(
            'Multi-select with different properties: select none, selected items should be #{expected}, while we get #{actual}'
        )
            .expect(await selector.dropdown.getShownSelectedText())
            .toBe('');
    });

    it('[TC80342] Library | Dropdown selector - Multi-Select on derived attribute,consolidation and custom group', async () => {
        // select derived attribute
        await resetDossierState({ credentials, dossier: docDerivedAttribute });
        await libraryPage.openUrl(tutorialProject.id, docDerivedAttribute.id);
        await selector.dropdown.openDropdownAndMultiSelect(['Central@Milwaukee', 'Mid-Atlantic@Charleston']);
        await since('Multi-select on derived attribtue: Selected items should be #{expected}, while we get #{actual}')
            .expect(await selector.dropdown.getShownSelectedText())
            .toBe('Central@Milwaukee, Mid-Atlantic@Charleston');
        await since(
            'Multi-select on derived attribtue, first grid element should be #{expected}, while we get #{actual}'
        )
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Central');

        // select cconsolidaiton (all)
        await resetDossierState({ credentials, dossier: docConsolidationGroup });
        await libraryPage.openUrl(tutorialProject.id, docConsolidationGroup.id);
        await libraryPage.sleep(500);
        await rsdPage.waitAllToBeLoaded();
        const selector1 = await rsdPage.findSelectorByName('consolidationDD');
        const selector2 = await rsdPage.findSelectorByName('customGroupDD');

        await selector1.dropdown.openDropdown();
        await selector1.dropdown.selectMultiItemByText(['(All)']);
        await since('Multi-select on consolidation: select All, Winter should be selected')
            .expect(await selector1.dropdown.isItemSelected('Winter'))
            .toBe(true);
        await selector1.dropdown.clickOKBtn();
        await since('Multi-select on consolidation: select All, Selected items should be selected')
            .expect(await selector1.dropdown.getShownSelectedText())
            .toBe('(All)');

        // select custom group
        await selector2.dropdown.openDropdownAndMultiSelect(['North', 'South']);
        await since(
            'Multi-select on custom group: select All, Selected items should be #{expected}, while we get #{actual}'
        )
            .expect(await selector2.dropdown.getShownSelectedText())
            .toBe('North, Center');
        await since('Multi-select on custom group: element display should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.isCellDisplayed('North'))
            .toBe(true);
    });

    it('[TC80343] Library | Dropdown selector - Multi-Select when select metric', async () => {
        const tolerance = 0.5;
        await resetDossierState({ credentials, dossier: docSelectMetric });
        await libraryPage.openUrl(tutorialProject.id, docSelectMetric.id);

        // single select
        await selector.dropdown.openDropdownAndMultiSelect(['Units Sold']);
        await since('Multi-select when select metric: selected items should be #{expected}, while we get #{actual}')
            .expect(await selector.dropdown.getShownSelectedText())
            .toBe('Profit');

        // multiple selection
        await selector.dropdown.openDropdownAndMultiSelect(['Revenue', 'Sales Rank']);
        await since('Multi-select hen select metric: selected items should be #{expected}, while we get #{actual}')
            .expect(await selector.dropdown.getShownSelectedText())
            .toBe('Revenue, Profit, Sales Rank');

        // select all
        await selector.dropdown.openDropdownAndMultiSelect(['(All)']);
        await rsdPage.waitAllToBeLoaded();
        await since('Multi-select hen select metric: selected items should be #{expected}, while we get #{actual}')
            .expect(await selector.dropdown.getShownSelectedText())
            .toBe('(All)');
        await takeScreenshotByElement(
            rsdPage.getDocLayoutViewer(),
            'TC80343',
            'Dropdown_MultiSelect_SelectMetric_SelectAll',
            {
                tolerance: tolerance,
            }
        );

        // deselect all
        await selector.dropdown.openDropdownAndMultiSelect(['(All)']);
        await rsdPage.waitAllToBeLoaded();
        await takeScreenshotByElement(
            rsdPage.getDocLayoutViewer(),
            'TC80343',
            'Dropdown_MultiSelect_SelectMetric_Deselect',
            {
                tolerance: tolerance,
            }
        );
    });

    it('[TC80344] Library | Dropdown selector - Multi-Select when target to dataset', async () => {
        await resetDossierState({ credentials, dossier: docTargetDataset });
        await libraryPage.openUrl(tutorialProject.id, docTargetDataset.id);

        // select multiple
        await selector.dropdown.openDropdown();
        await since(
            'Multi-select when target dataset: before select, selected items count should be #{expected}, while we get #{actual}'
        )
            .expect(await selector.dropdown.dropdownItemsCount())
            .toBe(9);
        await selector.dropdown.selectMultiItemByText(['Central', 'Mid-Atlantic', 'Web', 'Northeast']);
        await selector.dropdown.clickOKBtn();
        await since('Multi-select when select metric: selected items should be #{expected}, while we get #{actual}')
            .expect(await selector.dropdown.getShownSelectedText())
            .toBe('Northwest, South, Southeast, Southwest');

        // select all
        await selector.dropdown.openDropdown();
        await since(
            'Multi-select when target dataset: after select, selected items count should be #{expected}, while we get #{actual}'
        )
            .expect(await selector.dropdown.dropdownItemsCount())
            .toBe(5);
        await selector.dropdown.selectMultiItemByText(['Alias for All']);
        await selector.dropdown.clickOKBtn();
        await since('Multi-select when select metric: selected items should be #{expected}, while we get #{actual}')
            .expect(await selector.dropdown.getShownSelectedText())
            .toBe('Alias for All');
        await selector.dropdown.openDropdown();
        await since(
            'Multi-select when target dataset: select all, selected items count should be #{expected}, while we get #{actual}'
        )
            .expect(await selector.dropdown.dropdownItemsCount())
            .toBe(9);
    });

    it('[TC80345] Library | Dropdown selector - Multi-Select when target to selector', async () => {
        // multiple to multiple
        await resetDossierState({ credentials, dossier: docTargetSelectorN2N });
        await libraryPage.openUrl(tutorialProject.id, docTargetSelectorN2N.id);
        const source1 = await rsdPage.findSelectorByName('sourceN2N');
        const target1 = await rsdPage.findSelectorByName('targetN2N');
        await since(
            'Target selector with multiple to multiple, before select, selected items should be #{expected}, while we get #{actual}'
        )
            .expect(await source1.dropdown.getShownSelectedText())
            .toBe('2014');
        // -- select source
        await source1.dropdown.openDropdownAndMultiSelect(['2015']);
        await since(
            'Target selector with multiple to multiple: after select source, target selected items should be #{expected}, while we get #{actual}'
        )
            .expect(await target1.dropdown.getShownSelectedText())
            .toBe('(All)');
        // -- select target
        await target1.dropdown.openDropdown();
        await since(
            'Target selector with multiple to multiple: after select source, selected items count should be #{expected}, while we get #{actual}'
        )
            .expect(await target1.dropdown.dropdownItemsCount())
            .toBe(5);
        await target1.dropdown.selectMultiItemByText(['2016 Q1', '2016 Q2']);
        await target1.dropdown.clickOKBtn();
        await since(
            'Target selector with multiple to multiple: after select target, selected items should be #{expected}, while we get #{actual}'
        )
            .expect(await target1.dropdown.getShownSelectedText())
            .toBe('2016 Q3, 2016 Q4');

        // multiple to single
        await resetDossierState({ credentials, dossier: docTargetSelectorN21 });
        await libraryPage.openUrl(tutorialProject.id, docTargetSelectorN21.id);
        const source2 = await rsdPage.findSelectorByName('sourceN21');
        const target2 = await rsdPage.findSelectorByName('targetN21');
        // -- select source
        await source2.dropdown.openDropdownAndMultiSelect(['Central', 'Mid-Atlantic']);
        await since(
            'Target selector with multiple to single: after select source, target selected items should be #{expected}, while we get #{actual}'
        )
            .expect(await target2.dropdown.getShownSelectedText())
            .toBe('(All)');
        // -- select target
        await target2.dropdown.openDropdown();
        await since(
            'Target selector with multiple to signle: after select source, selected items count should be #{expected}, while we get #{actual}'
        )
            .expect(await target2.dropdown.dropdownItemsCount())
            .toBe(7);
        await target2.dropdown.selectItemByText('Milwaukee');
        await since(
            'Target selector with multiple to single: after select target, selected items should be #{expected}, while we get #{actual}'
        )
            .expect(await target2.dropdown.getShownSelectedText())
            .toBe('Milwaukee');
    });

    it('[TC80346] Library | Dropdown selector - Multi-Select error handling when no source or target', async () => {
        await resetDossierState({ credentials, dossier: docErrorHandling });
        await libraryPage.openUrl(tutorialProject.id, docErrorHandling.id);

        const selector1 = await rsdPage.findSelectorByName('noSourceWithTarget');
        const selector2 = await rsdPage.findSelectorByName('noSourceNoTarget');
        const selector3 = await rsdPage.findSelectorByName('withSourceNoTarget');

        // no source, with target
        await selector1.dropdown.openDropdownNoWait();
        await since('Error handling: with target but no source, the dropdown list popup should NOT be present')
            .expect(await selector1.dropdown.isDropdownListPresent())
            .toBe(false);

        // no source, with target
        await selector2.dropdown.openDropdownNoWait();
        await since('Error handling: No target and no source, the dropdown list popup should NOT be present')
            .expect(await selector2.dropdown.isDropdownListPresent())
            .toBe(false);

        // with source, no target
        await selector3.dropdown.openDropdownNoWait();
        await since('Error handling: No target and with source, the dropdown list popup should be present')
            .expect(await selector2.dropdown.isDropdownListPresent())
            .toBe(true);
        await selector3.dropdown.selectMultiItemByText(['Central', 'Northeast']);
        await selector3.dropdown.clickOKBtn();
        await since(
            'Error handling: No target and with source, selected items should be #{expected}, while we get #{actual}'
        )
            .expect(await selector3.dropdown.getShownSelectedText())
            .toBe('Central, Northeast');
        await since('Error handling: first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Central');
        await takeScreenshotByElement(
            selector1.dropdown.getElement(),
            'TC80346',
            'Dropdown_MultiSelect_ErrorHandling_select'
        );
    });

    it('[TC80347] Library | Dropdown selector - Multi-Select Xfunc with filter panel', async () => {
        await resetDossierState({ credentials, dossier: docXfuncPanels });
        await libraryPage.openUrl(tutorialProject.id, docXfuncPanels.id);
        const selector1 = await rsdPage.findSelectorByName('categoryDD');
        const selector2 = await rsdPage.findSelectorByName('subcategoryDD');
        const filterPanel = rsdPage.findFilterPanelByName('filterPanel');

        // select multi elements on filter panel
        await selector1.dropdown.openDropdown();
        await since('X-Func on filter: before select, Selected items should be #{expected}, while we get #{actual}')
            .expect(await selector1.dropdown.getShownSelectedText())
            .toBe('Movies, Music');
        await selector1.dropdown.selectMultiItemByText(['Books', 'Movies']);
        await selector1.dropdown.clickOKBtn();
        await since(
            'X-Func on filter panel: after select, selected items should be #{expected}, while we get #{actual}'
        )
            .expect(await selector1.dropdown.getShownSelectedText())
            .toBe('Books, Music');
        // -- check target selector
        await since(
            'X-Func on filter panel: target selector selected items should be #{expected}, while we get #{actual}'
        )
            .expect(await selector2.dropdown.getShownSelectedText())
            .toBe('Country, Pop');
        await since('X-Func on panel stack: element display should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.isCellDisplayed('Country'))
            .toBe(true);

        // unset filter panel
        await filterPanel.openMenu();
        await filterPanel.clickMenuNthItem(1, 'Unset All Filters');
        await since('X-Func on filter panel, after unset, selected items should be #{expected}, while we get #{actual}')
            .expect(await selector1.dropdown.getShownSelectedText())
            .toBe('Movies, Music');
    });

    it('[TC80348] Library | Dropdown selector - Multi-Select Xfunc with panel stak', async () => {
        await resetDossierState({ credentials, dossier: docXfuncPanels });
        await libraryPage.openUrl(tutorialProject.id, docXfuncPanels.id);
        const selector = await rsdPage.findSelectorByName('subcategoryDD');

        // select multi elements on panel stack
        await selector.dropdown.openDropdown();
        await since(
            'X-Func on panel stack: before action, selected items should be #{expected}, while we get #{actual}'
        )
            .expect(await selector.dropdown.getShownSelectedText())
            .toBe('Drama, Country, Pop');
        await selector.dropdown.selectMultiItemByText(['Action', 'Comedy']);
        await selector.dropdown.clickOKBtn();

        // check target
        await since('X-Func on panel stack: after action, selected items should be #{expected}, while we get #{actual}')
            .expect(await selector.dropdown.getShownSelectedText())
            .toBe('Action, Comedy, Drama, Country, Pop');
        await since('X-Func on panel stack: element display should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.isCellDisplayed('Action'))
            .toBe(true);
    });

    it('[TC80349] Library | Dropdown selector - Multi-Select Xfunc with info-window', async () => {
        const tolerance = 0.7;
        await resetDossierState({ credentials, dossier: docXfuncInfoWindow });
        await libraryPage.openUrl(tutorialProject.id, docXfuncInfoWindow.id);
        const selector = await rsdPage.findSelectorByName('categoryDD');
        const selector2 = await rsdPage.findSelectorByName('regionDD');
        const infoWindow = rsdPage.findPanelStackByName('InfoPanelStack');

        // select multiple selector and OK
        await selector.dropdown.openDropdown();
        await selector.dropdown.selectMultiItemByText(['Books', 'Electronics']);
        await selector.dropdown.clickOKBtn();
        await since('X-Func on information window, confirm multi-select, Information window should appear')
            .expect(await infoWindow.isPanelPresent())
            .toBe(true);
        await takeScreenshotByElement(rsdPage.getDocLayoutViewer(), 'TC80349', 'Dropdown_MultiSelect_InfoWindow_OK', {
            tolerance: tolerance,
        });

        // select multiple selector and cancel
        await selector.dropdown.openDropdown();
        await selector.dropdown.selectMultiItemByText(['Books']);
        await selector.dropdown.clickCancelBtn();
        await since('X-Func on information window, cancel multi-select, Information window should NOT appear')
            .expect(await infoWindow.isPanelPresent())
            .toBe(false);

        // single select - not enable multi-select
        await selector2.dropdown.openDropdown();
        await selector2.dropdown.selectItemByText('Northeast:1');
        await since('X-Func on information window, not enable multi-select, Information window should appear')
            .expect(await infoWindow.isPanelPresent())
            .toBe(true);
        await takeScreenshotByElement(
            rsdPage.getDocLayoutViewer(),
            'TC80349',
            'Dropdown_MultiSelect_InfoWindow_Disabled',
            {
                tolerance: tolerance,
            }
        );
    });

    it('[TC80350] Library | Dropdown selector - Multi-Select Xfunc with link drill', async () => {
        await resetDossierState({ credentials, dossier: docXfuncLinkdrill });
        await libraryPage.openUrl(tutorialProject.id, docXfuncLinkdrill.id);
        const grid = rsdPage.findGridByKey('W171C3466AB364F49BBDDDD192C95E280');

        // link to target with selector passed
        await grid.selectContextMenuOnCell('Category', ['Hyperlink1']);

        // check target selector
        const selector1 = await rsdPage.findSelectorByName('regionDD');
        const selector2 = await rsdPage.findSelectorByName('categoryDD');
        await since('X-Func on link drill: pass selector on region should be #{expected}, while we get #{actual}')
            .expect(await selector1.dropdown.getShownSelectedText())
            .toBe('South:5, Southeast:3, Southwest:7');
        await since('X-Func on link drill: pass selector on category should be #{expected}, while we get #{actual}')
            .expect(await selector2.dropdown.getShownSelectedText())
            .toBe('Movies, Music');
    });
});
export const config = specConfiguration;
