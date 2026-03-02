import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { customCredentials } from '../../../constants/index.js';

const specConfiguration = { ...customCredentials('_PS') };

describe('Dossier Panel Stack', () => {
    const dossier = {
        id: 'CB25494E46B7A9545B9717BD9E00C13C',
        name: 'PS Dossier-link',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dossier2 = {
        id: '8441C4694352FC6AC251FCA16D47E914',
        name: 'PS Dossier',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dossier3 = {
        id: '4100BC42496DDD8FF1D2889A3350BB9B',
        name: 'PS Dossier-prompt',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dossier4 = {
        id: 'E9B094D6496FCD5E6D263B87504125A1',
        name: 'PS Dossier-link from text and image',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const { credentials } = specConfiguration;

    let {
        loginPage,
        dossierPage,
        libraryPage,
        promptEditor,
        grid,
        textbox,
        imageContainer,
        lineChart,
        pieChart,
        inCanvasSelector,
        toc,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        await setWindowSize({
            
            width: 1600,
            height: 1200,
        });
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC74080] Validate dossier panel stack switching and rendering in Library Web', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);
        // Switch to Panel 1
        await dossierPage.clickDossierPanelStackSwitchTab('Panel 1');
        await grid.selectGridContextMenuOption({
            title: 'Panel 1',
            headerName: 'Call Center',
            elementName: 'Atlanta',
            firstOption: 'Exclude',
        });
        await since('The first element of Call Center attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Panel 1', headerName: 'Call Center' }))
            .toBe('San Diego');
        // Switch to Panel 2
        await dossierPage.clickDossierPanelStackSwitchTab('Panel 2');
        await since('The element of lineChart is present')
            .expect(
                await lineChart.isElementPresent({
                    vizName: 'Panel 2-2',
                    eleName: 'Electronics',
                })
            )
            .toBe(true);
        await since('Total number of pie slices should be #{expected} but are #{actual}')
            .expect(await pieChart.sliceCount('Panel 2-3-2'))
            .toBe(4);
        // Switch to Panel 2-3-1
        await dossierPage.clickDossierPanelStackSwitchTab('Panel 2-3-1');
        await since('The first element of Quarter attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Panel 2-3-1', headerName: 'Quarter' }))
            .toBe('2014 Q1');
        // Switch to freeform layout chapter
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'freeform layout' });
        // Switch to Panel longname-1
        await dossierPage.clickDossierPanelStackSwitchTab('longname-1');
        await grid.selectGridElement({
            title: 'longname-grid1',
            headerName: 'Category',
            elementName: 'Movies',
        });
        // Switch to Panel longname-2
        await dossierPage.clickDossierPanelStackSwitchTab('longname-2');
        await since(
            'The first element of Profit metric in target grid should be #{expected}, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'longname-grid3', headerName: 'Profit' }))
            .toBe('$17,680');
        // Switch to Panel longname-1
        await dossierPage.clickDossierPanelStackSwitchTab('longname-1');
        await since(
            'The first element of Category attribute in target grid should be #{expected}, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'longname-grid2', headerName: 'Category' }))
            .toBe('Movies');
        // Switch to Panel 20
        await dossierPage.clickDossierPanelStackRightSwitchArrow();
        await dossierPage.clickDossierPanelStackSwitchTab('Panel 20');
        await since(
            'The first element of Profit metric in target grid should be #{expected}, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Profit' }))
            .toBe('$7,503');
        await grid.selectGridElement({
            title: 'longname-grid1',
            headerName: 'Category',
            elementName: 'Music',
        });
        await since(
            'The first element of Profit metric in target grid should be #{expected}, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Profit' }))
            .toBe('$5,540');
        // Switch to Panel longname-1
        await dossierPage.clickDossierPanelStackLeftSwitchArrow();
        await dossierPage.clickDossierPanelStackSwitchTab('longname-1');
        await since(
            'The first element of Category attribute in target grid should be #{expected}, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'longname-grid2', headerName: 'Category' }))
            .toBe('Music');
        // Switch to short name Panel
        await dossierPage.clickDossierPanelStackSwitchTab('.');
        // Switch panel use selector
        await inCanvasSelector.selectItem('shortname-2-1');
        await since('The first element of Profit metic should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'shortname-2-1', headerName: 'Profit' }))
            .toBe('$139,952');
        await inCanvasSelector.selectItem('shortname-2-3');
        await grid.selectGridContextMenuOption({
            title: 'shortname-2-3',
            headerName: 'Year',
            elementName: '2016',
            firstOption: 'Keep Only',
        });
        await since(
            'The first element of Year attribute in target grid should be #{expected}, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'shortname-2-3', headerName: 'Year' }))
            .toBe('2016');
        await inCanvasSelector.selectItem('shortname-2-2');
        await since('The first element of Call Center atribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'shortname-2-2', headerName: 'Call Center' }))
            .toBe('Atlanta');
    });

    it('[TC74081] Validate dossier panel stack with linking in Library Web', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier,
        });
        await resetDossierState({
            credentials: credentials,
            dossier: dossier2,
        });
        await libraryPage.openDossier(dossier.name);
        // Switch to Panel 1
        await dossierPage.clickDossierPanelStackSwitchTab('Panel 1');
        // Link to PS Dossier
        await grid.linkToTargetByGridContextMenu({ title: 'Panel 1', headerName: 'Category', elementName: 'Books' });
        // Validate view filter in target page
        await grid.openViewFilterContainer('target grid-1');
        await since('Attribute value should be passed as view filter in target grid-1')
            .expect(await grid.isViewFilterItemPresent('Clear "Category = Books"'))
            .toBe(true);
        await grid.closeViewFilterContainer('target grid-1');
        await grid.openViewFilterContainer('target grid-2');
        await since('Attribute value should be passed as view filter in target grid-2')
            .expect(await grid.isViewFilterItemPresent('Clear "Category = Books"'))
            .toBe(true);
        await grid.closeViewFilterContainer('target grid-2');
        await dossierPage.clickDossierPanelStackSwitchTab('targetpanel-1-2');
        await grid.openViewFilterContainer('target grid-3');
        await since('Attribute value should be passed as view filter in target grid-3')
            .expect(await grid.isViewFilterItemPresent('Clear "Category = Books"'))
            .toBe(true);
        await grid.closeViewFilterContainer('target grid-3');
        await dossierPage.clickDossierPanelStackSwitchTab('targetpanel-2');
        await grid.openViewFilterContainer('target grid-4');
        await since('Attribute value should be passed as view filter target grid-4')
            .expect(await grid.isViewFilterItemPresent('Clear "Category = Books"'))
            .toBe(true);
        await grid.closeViewFilterContainer('target grid-4');
        // Validate view filter in different page
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'normal layout' });
        await since('Attribute value should not be passed as view filter in different page')
            .expect(await grid.isViewFilterPresent('Visualization 2'))
            .toBe(false);
        await dossierPage.goBackFromDossierLink();
        // Link to PS Dossier-link itself
        await pieChart.linkToTargetByPiechartContextMenu({
            title: 'Pie',
            slice: '2014',
        });
        // Validate view filter in target page
        await grid.openViewFilterContainer('longname-grid1');
        await since('Attribute value should be passed as view filter in target longname-grid1')
            .expect(await grid.isViewFilterItemPresent('Clear "Year = 2014"'))
            .toBe(true);
        await grid.closeViewFilterContainer('longname-grid1');
        await grid.openViewFilterContainer('longname-grid3');
        await since('Attribute value should be passed as view filter in target longname-grid3')
            .expect(await grid.isViewFilterItemPresent('Clear "Year = 2014"'))
            .toBe(true);
        await grid.closeViewFilterContainer('longname-grid3');
        await dossierPage.clickDossierPanelStackSwitchTab('longname-1');
        await grid.openViewFilterContainer('longname-grid2');
        await since('Attribute value should be passed as view filter in target longname-grid2')
            .expect(await grid.isViewFilterItemPresent('Clear "Year = 2014"'))
            .toBe(true);
        await grid.closeViewFilterContainer('longname-grid2');
        // Validate view filter in different page
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'normal layout' });
        await dossierPage.clickDossierPanelStackSwitchTab('Panel 1');
        await since('Attribute value should not be passed as view filter in different page')
            .expect(await grid.isViewFilterPresent('Panel 1'))
            .toBe(false);
        await dossierPage.goBackFromDossierLink();
        // Switch to link page
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'link' });
        // Link to freeform layout page
        await grid.linkToTargetByGridContextMenu({
            title: 'select current dossier',
            headerName: 'Category',
            elementName: 'Electronics',
        });
        // Validate in target page
        await since('Attribute value should not be passed as view filter in target page')
            .expect(await grid.isViewFilterPresent('longname-grid1'))
            .toBe(false);
        await since(
            'The first element of Category atribute should be #{expected} in target longname-grid1, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'longname-grid1', headerName: 'Category' }))
            .toBe('Electronics');
        await since(
            'The first element of Profit metric should be #{expected} in target longname-grid3, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'longname-grid3', headerName: 'Profit' }))
            .toBe('$236,210');
        await dossierPage.clickDossierPanelStackSwitchTab('longname-1');
        await since(
            'The first element of Category atribute should be #{expected} in target longname-grid2, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'longname-grid2', headerName: 'Category' }))
            .toBe('Electronics');
        await dossierPage.clickDossierPanelStackSwitchTab('.');
        await since(
            'The first element of Profit metric should be #{expected} in target shortname-1-2, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'shortname-1-2', headerName: 'Profit' }))
            .toBe('$127,634');
        await since(
            'The first element of Profit Margin metric should be #{expected} in target shortname-2-3, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'shortname-2-3', headerName: 'Profit Margin' }))
            .toBe('17.56%');
        await inCanvasSelector.selectItem('shortname-2-1');
        await since(
            'The first element of Category atribute should be #{expected} in target longname-grid2, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'shortname-2-1', headerName: 'Category' }))
            .toBe('Electronics');
    });

    it('[TC74082] Validate dossier panel stack with prompt in Library Web', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier,
        });
        await resetDossierState({
            credentials: credentials,
            dossier: dossier3,
        });
        await libraryPage.openDossier(dossier.name);
        // Switch to link page
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'link' });
        // Link to PS Dossier-prompt with prompt user
        await grid.linkToTargetByGridContextMenu(
            { title: 'select prompt dossier-prompt user', headerName: 'Quarter', elementName: '2014 Q2' },
            true
        );
        await promptEditor.waitForEditor();
        await since('Prompt user should show prompt window when link to target')
            .expect(await promptEditor.isEditorOpen())
            .toBe(true);
        await promptEditor.run();
        // Validate view filter in target page
        await grid.openViewFilterContainer('grid');
        await since('Attribute value should be passed as view filter target grid')
            .expect(await grid.isViewFilterItemPresent('Clear "Quarter = 2014 Q2"'))
            .toBe(true);
        await grid.closeViewFilterContainer('grid');
        await dossierPage.clickDossierPanelStackSwitchTab('Panel 1-1');
        await grid.openViewFilterContainer('grid2');
        await since('Attribute value should be passed as view filter target grid2')
            .expect(await grid.isViewFilterItemPresent('Clear "Quarter = 2014 Q2"'))
            .toBe(true);
        await grid.closeViewFilterContainer('grid2');
        await dossierPage.clickDossierPanelStackSwitchTab('Panel 1');
        await since('The first element of Cost metric should be #{expected} in target grid, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'grid', headerName: 'Cost' }))
            .toBe('$117,425');
        await grid.openViewFilterContainer('grid');
        await since('Attribute value should be passed as view filter target grid')
            .expect(await grid.isViewFilterItemPresent('Clear "Quarter = 2014 Q2"'))
            .toBe(true);
        await grid.closeViewFilterContainer('grid');
        // Validate in different page
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'freeform layout' });
        await since('The first element of Profit metric should be #{expected} in grid, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'grid', headerName: 'Profit' }))
            .toBe('$569,278');
        await since('Attribute value should not be passed as view filter in different page')
            .expect(await grid.isViewFilterPresent('grid'))
            .toBe(false);
        await dossierPage.goBackFromDossierLink();
        // Link to PS Dossier-prompt with default answer
        await grid.selectGridContextMenuOption({
            title: 'select prompt dossier-default answer',
            headerName: 'Category',
            elementName: 'Books',
            firstOption: 'Exclude',
        });
        await grid.linkToTargetByGridContextMenu({
            title: 'select prompt dossier-default answer',
            headerName: 'Category',
            elementName: 'Electronics',
        });
        await since('Prompt user should not show prompt window when link to target')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        // Validate view filter in target page
        await since('The first element of Profit metric should be #{expected} in grid, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'grid', headerName: 'Profit' }))
            .toBe('$4,289,603');
        await dossierPage.clickDossierPanelStackSwitchTab('Panel 1-2');
        await grid.openViewFilterContainer('grid3');
        await since('Attribute value should be passed as view filter target grid')
            .expect(await grid.isViewFilterItemPresent('Clear "Category = Electronics"'))
            .toBe(true);
        await grid.closeViewFilterContainer('grid3');
        // Validate in different page
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'normal layout' });
        await dossierPage.clickDossierPanelStackSwitchTab('Panel 1');
        await since('The first element of Cost metric should be #{expected} in grid, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'grid', headerName: 'Cost' }))
            .toBe('$2,070,816');
        await since('Attribute value should not be passed as view filter in different page')
            .expect(await grid.isViewFilterPresent('grid'))
            .toBe(false);
        await dossierPage.goBackFromDossierLink();
    });

    it('[TC82766] Validate dossier switch page from text/image in panel stack in Library Web with load chapters on demand setting', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier4,
        });
        await libraryPage.openDossier(dossier4.name);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'normal layout' });

        // Click text link
        await textbox.navigateLink(1);
        await since('The page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual([dossier4.name, 'Chapter 1', 'normal layout']);
        await since('Total number of pie slices should be #{expected} but are #{actual}')
            .expect(await pieChart.sliceCount('Pie'))
            .toBe(3);

        await textbox.navigateLink(0);
        await since('The page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual([dossier4.name, 'Chapter 2', 'freeform layout']);
        await since('The first element of Year should be #{expected} in grid, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'longname-grid1', headerName: 'Year' }))
            .toBe('2014');

        // Click image link
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 2', pageName: 'freeform layout' });
        await imageContainer.navigateLinkInCurrentPage(0);
        await since('The page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual([dossier4.name, 'Chapter 2', 'freeform layout']);
        await since('The first element of Call Center should be #{expected} in grid, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'longname-grid1', headerName: 'Call Center' }))
            .toBe('Atlanta');

        await imageContainer.navigateLinkInCurrentPage(1);
        await since('The page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual([dossier4.name, 'Chapter 1', 'normal layout']);
        await since('Total number of pie slices should be #{expected} but are #{actual}')
            .expect(await pieChart.sliceCount('Pie'))
            .toBe(3);

        // Click viz link
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'normal layout' });
        await pieChart.linkToTargetByPiechartContextMenu({
            title: 'Pie',
            slice: '2016',
        });
        await since('The page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual([dossier4.name, 'Chapter 2', 'freeform layout']);
        await since('The first element of Year should be #{expected} in grid, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'longname-grid1', headerName: 'Year' }))
            .toBe('2016');
        await since('Attribute value should not be passed as view filter in target page')
            .expect(await grid.isViewFilterPresent('longname-grid1'))
            .toBe(false);
    });
});

export const config = specConfiguration;
