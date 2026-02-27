import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';

const specConfiguration = { ...customCredentials('_linking') };

describe('Dossier Linking', () => {
    const tutorialProject = {
        id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
        name: 'MicroStrategy Tutorial',
    };

    const sourceAndTargetDossier = {
        id: '30242B41498FA03A2E2AE49338576103',
        name: '(AUTO) DossierLinking_Source and Target',
        project: tutorialProject,
    };
    const MDXRADossier = {
        id: '0F141A47455DCA26C2EF4CACAC767BF3',
        name: '(AUTO) DossierLinking_MDX RA',
        project: tutorialProject,
    };
    const errorHandlingDossier = {
        id: '7FDDA5BA4B80E9FB9E0A95BA7F203E2E',
        name: '(AUTO) DossierLinking_Error Handling',
        project: tutorialProject,
    };
    const specialCharsDossier = {
        id: '33BFC9B343D42D96A02EB794A35AB04C',
        name: '(AUTO) DossierLinking_Special Chars',
        project: tutorialProject,
    };
    const loadChapterOnDemand = {
        id: '4873BBFF422EDFE58CF6A68199D8377D',
        name: '(AUTO) DossierLinking - Load chapter on demand',
        project: tutorialProject,
    };
    const loadPageOnDemand = {
        id: '6114D3734A173B67E91C49A4A2059F67',
        name: '(AUTO) DossierLinking - Load page on demand',
        project: tutorialProject,
    };

    const { credentials } = specConfiguration;

    let { dossierPage, toc, libraryPage, grid, textbox, imageContainer, pieChart, loginPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC58908_01] Verify dossier linking on Text - Link to Page ', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: sourceAndTargetDossier,
        });
        await libraryPage.openDossier(sourceAndTargetDossier.name);

        // text - link to URL
        await toc.openPageFromTocMenu({ chapterName: 'Text/Image', pageName: 'Text' });
        await textbox.navigateLink(0);
        await since('Link to Page from Text, back icon should NOT be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(false);
        await dossierPage.closeTab(1);

        // text- link to Page
        await toc.openPageFromTocMenu({ chapterName: 'Text/Image', pageName: 'Text' });
        await textbox.navigateLink(1);
        await since('Link to Page from Text, back icon should NOT be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(false);
        await since('Link to Page from Text, target page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['(AUTO) DossierLinking_Source and Target', 'Viz', 'grid']);
    });

    // split case to avoid jasmine.DEFAULT_TIMEOUT_INTERVAL timeout issue
    it('[TC58908_02] Verify dossier linking on Text - Link to File', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: sourceAndTargetDossier,
        });
        await libraryPage.openDossier(sourceAndTargetDossier.name);

        // text - link to File - this dossier
        await toc.openPageFromTocMenu({ chapterName: 'Text/Image', pageName: 'Text' });
        await textbox.navigateLink(3);
        await since('Link to itself(File) from Text, back icon should be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(true);
        await since('Link to itself(File) from Text, target page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['(AUTO) DossierLinking_Source and Target', 'Text/Image', 'Text']);
        await dossierPage.goBackFromDossierLink();
        await since(
            'Link to itself(File) from Text, Back to source shortcut state, the source page should be #{expected}, instead we have #{actual}'
        )
            .expect(await dossierPage.title())
            .toEqual(['(AUTO) DossierLinking_Source and Target', 'Text/Image', 'Text']);

        // text - link to File - other dossier
        await toc.openPageFromTocMenu({ chapterName: 'Text/Image', pageName: 'Text' });
        await textbox.navigateLink(2);
        await since('Link to other dossier from Text, back icon should be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(true);
        await since('Link to other dossier from Text, target page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['Target_dossier', 'Chapter 1', 'Grid']);
        await dossierPage.goBackFromDossierLink();
        await since(
            'Link to other dossier from Text,Back to source shortcut state, the source page should be #{expected}, instead we have #{actual}'
        )
            .expect(await dossierPage.title())
            .toEqual(['(AUTO) DossierLinking_Source and Target', 'Text/Image', 'Text']);
    });

    it('[TC58909] Verify dossier linking on Image', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: sourceAndTargetDossier,
        });
        await libraryPage.openDossier(sourceAndTargetDossier.name);

        // // image - link to Page
        await toc.openPageFromTocMenu({ chapterName: 'Text/Image', pageName: 'Image' });
        await imageContainer.navigateLinkInCurrentPage(0);
        await since('Link to this page from Image, back icon should not be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(false);
        await since('Link to this Page from Image, target page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['(AUTO) DossierLinking_Source and Target', 'Viz', 'grid']);

        // image - link to file self
        await toc.openPageFromTocMenu({ chapterName: 'Text/Image', pageName: 'Image' });
        await imageContainer.navigateLinkInCurrentPage(2);
        await since('Link to file itself from Image, back icon should be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(true);
        await since('Link to this itself from Image, target page should be #{expected}, instead of #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['(AUTO) DossierLinking_Source and Target', 'Text/Image', 'Text']);
        await dossierPage.goBackFromDossierLink();
        await since('Back to source shortcut state, the source page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['(AUTO) DossierLinking_Source and Target', 'Text/Image', 'Image']);

        // image - link to file others
        await imageContainer.navigateLinkInCurrentPage(1);
        await since('Link to file others from Image, back icon should be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(true);
        await since('Link to this itself from Image, target page should be #{expected}, instead of #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['Target_dossier', 'Chapter 1', 'Grid']);
        await dossierPage.goBackFromDossierLink();
        await since('Back to source shortcut state, the source page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['(AUTO) DossierLinking_Source and Target', 'Text/Image', 'Image']);
    });

    it('[TC58910] Verify dossier linking on Grid', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: sourceAndTargetDossier,
        });
        await libraryPage.openDossier(sourceAndTargetDossier.name);

        // grid - link to this dossier
        await toc.openPageFromTocMenu({ chapterName: 'Viz', pageName: 'grid' });
        await grid.linkToTargetByGridContextMenu({
            title: 'link to this dossier',
            headerName: 'Category',
            elementName: 'Books',
        });
        await since('Link to this dossier from Grid, back icon should NOT be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(false);
        await since('Link to this dossier from Grid, target page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['(AUTO) DossierLinking_Source and Target', 'Viz', 'line chart']);

        // grid - link to another dossier - this dossier
        await toc.openPageFromTocMenu({ chapterName: 'Viz', pageName: 'grid' });
        await grid.linkToTargetByGridContextMenu({ title: 'link to another dossier - itself', headerName: 'Category' });
        await since('Link to another dossier -> itself from Grid, back icon should be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(true);
        await since(
            'Link to another dossier -> itself from Grid, target page should be #{expected}, instead we have #{actual}'
        )
            .expect(await dossierPage.title())
            .toEqual(['(AUTO) DossierLinking_Source and Target', 'Viz', 'pie chart']);
        await dossierPage.goBackFromDossierLink();
        await since('Back to source shortcut state, the source page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['(AUTO) DossierLinking_Source and Target', 'Viz', 'grid']);

        // grid - link to another dossier - other dossier
        await grid.linkToTargetByGridContextMenu({ title: 'link to another dossier - others', headerName: 'Year' });
        await since('Link to another dossier -> others from Grid, back icon should be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(true);
        await since(
            'Link to another dossier -> others from Grid, target page should be #{expected}, instead we have #{actual}'
        )
            .expect(await dossierPage.title())
            .toEqual(['Target_dossier', 'Chapter 1', 'Grid']);
        await dossierPage.goBackFromDossierLink();
        await since('Back to source shortcut state, the source page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['(AUTO) DossierLinking_Source and Target', 'Viz', 'grid']);
    });

    it('[TC58911] Verify dossier linking on Viz', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: sourceAndTargetDossier,
        });
        await libraryPage.openDossier(sourceAndTargetDossier.name);

        // viz - link to this dossier
        await toc.openPageFromTocMenu({ chapterName: 'Viz', pageName: 'pie chart' });
        await pieChart.linkToTargetByPiechartContextMenu({
            title: 'link to this dossier',
            slice: 'Books',
        });
        await since('Link to this dossier from Pie Chart, back icon should not be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(false);
        await since('Link to this dossier from Pie Chart, target page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['(AUTO) DossierLinking_Source and Target', 'Viz', 'grid']);

        // viz - link to another dossier - this dossier
        await toc.openPageFromTocMenu({ chapterName: 'Viz', pageName: 'pie chart' });
        await pieChart.linkToTargetByPiechartContextMenu({
            title: 'link to another dossier - itself',
            slice: 'Books',
        });
        await since('Link to another dossier -> itself from Pie Chart, back icon should be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(true);
        await since(
            'Link to another dossier -> itself from Pie Chart, target page should be #{expected}, instead we have #{actual}'
        )
            .expect(await dossierPage.title())
            .toEqual(['(AUTO) DossierLinking_Source and Target', 'Viz', 'line chart']);
        await dossierPage.goBackFromDossierLink();
        await since('Back to source shortcut state, the source page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['(AUTO) DossierLinking_Source and Target', 'Viz', 'pie chart']);

        // viz - link to another dossier - other
        await pieChart.linkToTargetByPiechartContextMenu({
            title: 'link to another dossier - other',
            slice: 'Books',
        });
        await since('Link to another dossier -> other from Pie Chart, back icon should be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(true);
        await since(
            'Link to another dossier -> other from Pie Chart, target page should be #{expected}, instead we have #{actual}'
        )
            .expect(await dossierPage.title())
            .toEqual(['Target_dossier', 'Chapter 1', 'Grid']);
        await dossierPage.goBackFromDossierLink();
        await since('Back to source shortcut state, the source page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['(AUTO) DossierLinking_Source and Target', 'Viz', 'pie chart']);
    });

    it('[TC58912] Verify dossier linking on MDX RA ', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: MDXRADossier,
        });
        await libraryPage.openDossier(MDXRADossier.name);

        // MDX RA Dossier use branch as filter for parent node
        await toc.openPageFromTocMenu({ chapterName: 'Source' });
        await grid.linkToTargetByGridContextMenuForRA({
            title: 'Visualization 1',
            headerName: 'Accounts',
            elementName: 'Balance Sheet',
            secondOption: 'Use branch as filter',
        });
        await since('Link from MDX RA Dossier with use branch as filter, branch can be passed as view filter')
            .expect(await grid.isViewFilterPresent('Visualization 1'))
            .toBe(true);

        // MDX RA Dossier use element as filter for parent node
        await toc.openPageFromTocMenu({ chapterName: 'Source' });
        await grid.linkToTargetByGridContextMenuForRA({
            title: 'Visualization 1',
            headerName: 'Accounts',
            elementName: 'Balance Sheet',
            secondOption: 'Use element as filter',
        });
        await since('Link from MDX RA Dossier with use element as filter, element can be passed as view filter')
            .expect(await grid.isViewFilterPresent('Visualization 1'))
            .toBe(true);

        // MDX RA Dossier link from leaf node
        await toc.openPageFromTocMenu({ chapterName: 'Source' });
        await grid.linkToTargetByGridContextMenu({
            title: 'Visualization 1',
            headerName: 'Accounts',
            elementName: 'Partner Capital',
        });
        await since('Link tp target from MDX RA leaf node, leaf can be passed as view filter')
            .expect(await grid.isViewFilterPresent('Visualization 1'))
            .toBe(true);
    });

    it('[TC58913] Verify dossier multiple links and backs work as expected', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: sourceAndTargetDossier,
        });
        await libraryPage.openDossier(sourceAndTargetDossier.name);

        // Link to itself: link #1
        await toc.openPageFromTocMenu({ chapterName: 'Viz', pageName: 'grid' });
        await grid.linkToTargetByGridContextMenu({ title: 'link to another dossier - itself', headerName: 'Category' });
        await since('Link to itself 1st time, back icon should be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(true);
        await since('Link to itself 1st time, target page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['(AUTO) DossierLinking_Source and Target', 'Viz', 'pie chart']);

        // Link to itself: link #2
        await pieChart.linkToTargetByPiechartContextMenu({
            title: 'link to another dossier - itself',
            slice: 'Books',
        });
        await since('Link to itself 1st time, back icon should be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(true);
        await since('Link to itself 1st time, target page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['(AUTO) DossierLinking_Source and Target', 'Viz', 'line chart']);

        // back to itself: back 1#
        await dossierPage.goBackFromDossierLink();
        await since('Back to itself 1st time, the source page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['(AUTO) DossierLinking_Source and Target', 'Viz', 'pie chart']);

        // back to itself: back 2#
        await dossierPage.goBackFromDossierLink();
        await since('Back to itself 2nd time, the source page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['(AUTO) DossierLinking_Source and Target', 'Viz', 'grid']);
        await since('Back to itself 2nd time, back icon should NOT be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(false);

        // Link to others: link #1
        await toc.openPageFromTocMenu({ chapterName: 'Viz', pageName: 'pie chart' });
        await pieChart.linkToTargetByPiechartContextMenu({
            title: 'link to another dossier - other',
            slice: 'Books',
        });
        await since('Link to other dossier 1st time, back icon should be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(true);
        await since('Link to other dossier 1st time, target page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['Target_dossier', 'Chapter 1', 'Grid']);

        // Link to others: link #2
        await grid.linkToTargetByGridContextMenu({ title: 'Visualization 1', headerName: 'Category' });
        await since('Link to other dossier 2nd time, back icon should be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(true);
        await since('Link to other dossier 2nd time, target page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['target_dossier_filter_year_dropdown', 'filter by Year', 'year']);

        // back to source: back 1#
        await dossierPage.goBackFromDossierLink();
        await since('Back to source dossier 1st time, the source page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['Target_dossier', 'Chapter 1', 'Grid']);

        // back to source: back 2#
        await dossierPage.goBackFromDossierLink();
        await since('Back to source dossier 2nd time, the source page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['(AUTO) DossierLinking_Source and Target', 'Viz', 'pie chart']);
        await since('Back to the source dossier 2nd time, back icon should NOT be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(false);

        // mixed link: link to this dossier (1#)
        await toc.openPageFromTocMenu({ chapterName: 'Viz', pageName: 'pie chart' });
        await pieChart.linkToTargetByPiechartContextMenu({
            title: 'link to this dossier',
            slice: 'Books',
        });
        await since('Mixed link: link to this dossiere, back icon should NOT be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(false);
        await since('Mixed link: link to this dossier, target page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['(AUTO) DossierLinking_Source and Target', 'Viz', 'grid']);

        // mixed link: link to another dossier -itself (2#)
        await grid.linkToTargetByGridContextMenu({ title: 'link to another dossier - itself', headerName: 'Category' });
        await since('Mixed link: link to another dossiere(itself), back icon should be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(true);
        await since(
            'Mixed link: link to another dossiere(itself), target page should be #{expected}, instead we have #{actual}'
        )
            .expect(await dossierPage.title())
            .toEqual(['(AUTO) DossierLinking_Source and Target', 'Viz', 'pie chart']);

        // mixed link: link to another dossier - others (3#)
        await pieChart.linkToTargetByPiechartContextMenu({
            title: 'link to another dossier - other',
            slice: 'Books',
        });
        await since('Mixed link: link to another dossier(others), back icon should be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(true);
        await since(
            'Mixed link: link to other dossier(others), target page should be #{expected}, instead we have #{actual}'
        )
            .expect(await dossierPage.title())
            .toEqual(['Target_dossier', 'Chapter 1', 'Grid']);

        // mixed link: back 1#
        await dossierPage.goBackFromDossierLink();
        await since(
            'Back to source dossier(mixed link) 1st time, the source page should be #{expected}, instead we have #{actual}'
        )
            .expect(await dossierPage.title())
            .toEqual(['(AUTO) DossierLinking_Source and Target', 'Viz', 'pie chart']);

        // mixed link: back 2#
        await dossierPage.goBackFromDossierLink();
        await since(
            'Back to source dossier(mixed link) 2nd time, the source page should be #{expected}, instead we have #{actual}'
        )
            .expect(await dossierPage.title())
            .toEqual(['(AUTO) DossierLinking_Source and Target', 'Viz', 'grid']);
        await since('Back to the source dossier(mixed link) 2nd time, back icon should NOT be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(false);
    });

    it('[TC58915_01] Verify selected elements can be passed to target dossier as view filter(attribute, metric value/header)', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: sourceAndTargetDossier,
        });
        await libraryPage.openDossier(sourceAndTargetDossier.name);

        // attribute value
        await toc.openPageFromTocMenu({ chapterName: 'Viz', pageName: 'grid' });
        await grid.linkToTargetByGridContextMenu({
            title: 'link to another dossier - itself',
            headerName: 'Category',
            elementName: 'Books',
        });
        await grid.openViewFilterContainer('link to this dossier');
        await since('Attribute value should be passed as view filter')
            .expect(await grid.getViewFilterItemText())
            .toBe('Clear "Category = Books"');
        await grid.closeViewFilterContainer('link to this dossier');
        await dossierPage.goBackFromDossierLink();

        // metric value
        await grid.linkToTargetByGridContextMenu({
            title: 'link to another dossier - itself',
            headerName: 'Cost',
            elementName: '$4,970,513',
        });
        await grid.openViewFilterContainer('link to this dossier');
        await since('Metric value should be passed as view filter')
            .expect(await grid.isViewFilterItemPresent('Clear "Category = Electronics Year = 2014"'))
            .toBe(true);
        await grid.closeViewFilterContainer('link to this dossier');
        await dossierPage.goBackFromDossierLink();

        // attribute header
        await grid.linkToTargetByGridContextMenu({ title: 'link to another dossier - itself', headerName: 'Category' });
        await since('Attribute header should not be passed as view filter')
            .expect(await grid.isViewFilterPresent('link to this dossier'))
            .toBe(false);
        await dossierPage.goBackFromDossierLink();

        // metric header
        await grid.linkToTargetByGridContextMenu({ title: 'link to another dossier - itself', headerName: 'Cost' });
        await since('Metric header should not be passed as view filter')
            .expect(await grid.isViewFilterPresent('link to this dossier'))
            .toBe(false);
        await dossierPage.goBackFromDossierLink();
    });

    it('[TC58915_02] Verify selected elements can be passed to target dossier as view filter (group value, multiple values)', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: sourceAndTargetDossier,
        });
        await libraryPage.openDossier(sourceAndTargetDossier.name);
        await toc.openPageFromTocMenu({ chapterName: 'Viz', pageName: 'grid' });

        // group value
        await grid.linkToTargetByGridContextMenu({
            title: 'link to another dossier - others',
            headerName: 'Category(Group)',
            elementName: 'Books and Electronic',
        });
        await since('Group value should not be passed as view filter if target to another dossier')
            .expect(await grid.isViewFilterPresent('Visualization 1'))
            .toBe(false);
        await dossierPage.goBackFromDossierLink();

        // multiple values
        await grid.multiSelectGridElements({
            title: 'link to another dossier - itself',
            headerName: 'Category',
            elementName1: 'Books',
            elementName2: 'Movies',
        });
        await grid.linkToTargetByGridContextMenu({
            title: 'link to another dossier - itself',
            headerName: 'Category',
            elementName: 'Movies',
        });
        await grid.openViewFilterContainer('link to this dossier');
        await since('multiple values should be passed as view filter ')
            .expect(await grid.getViewFilterItemText())
            .toBe('Clear "Category = Books OR Movies"');
        await grid.closeViewFilterContainer('link to this dossier');
        await dossierPage.goBackFromDossierLink();
    });

    it('[TC58916] Verify target dossier can be linked by context menu and tooltip', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: sourceAndTargetDossier,
        });
        await libraryPage.openDossier(sourceAndTargetDossier.name);

        // Grid Context Menu
        await toc.openPageFromTocMenu({ chapterName: 'Viz', pageName: 'grid' });
        await grid.openGridElmContextMenu({
            title: 'link to another dossier - itself',
            headerName: 'Category',
            elementName: 'Books',
        });
        await since("'Go to Dashboard: (AUTO) DossierLinking_Source and Target' option should be present")
            .expect(
                await grid.isContextMenuOptionPresent({
                    level: 0,
                    option: 'Go to Dashboard: (AUTO) DossierLinking_Source and Target',
                })
            )
            .toBe(true);
        await grid.linkToTargetByGridContextMenu({
            title: 'link to another dossier - itself',
            headerName: 'Category',
            elementName: 'Books',
        });
        await since('Link to target from grid context menu, back icon should be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(true);
        await dossierPage.goBackFromDossierLink();

        // Grid tooltip
        await grid.hoverOnGridElement({
            title: 'link to another dossier - others',
            headerName: 'Year',
            elementName: '2014',
        });
        await since('Tooltip contents should be #{expected} but is #{actual}')
            .expect(await grid.getVizDossierLinkingTooltip())
            .toBe('Go to Dossier: Target_dossier');
        await grid.linkToTargetByGridToolTip();
        await since('Link to target from grid tooltip, back icon should be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(true);
        await dossierPage.goBackFromDossierLink();

        // PieChart Context Menu
        await toc.openPageFromTocMenu({ chapterName: 'Viz', pageName: 'pie chart' });
        await pieChart.openPieChartElmContextMenu({
            title: 'link to another dossier - other',
            slice: 'Electronics',
        });
        await since("'Go to Dashboard: (AUTO) DossierLinking_Source and Target' option should be present")
            .expect(
                await pieChart.isContextMenuOptionPresent({
                    level: 0,
                    option: 'Go to Dashboard: Target_dossier',
                })
            )
            .toBe(true);
        await pieChart.linkToTargetByPiechartContextMenu({
            title: 'link to another dossier - other',
            slice: 'Electronics',
        });
        await since('Link to target from pie chart context menu, back icon should be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(true);
        await dossierPage.goBackFromDossierLink();

        // Pie Chart tooltip
        await pieChart.hoverOnSlice({
            title: 'link to another dossier - itself',
            //index: 1
            slice: 'Electronics',
        });
        await since('Dossier Linking contents should be #{expected} but is #{actual}')
            .expect(await pieChart.vizDossierLinkingTooltip())
            .toBe('Go to Dossier: DossierLinking_Source and Target');
        await pieChart.linkToTargetByGridToolTip();
        await since('Link to target from Pie Chart tooltip, back icon should be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(true);
        await dossierPage.goBackFromDossierLink();
    });

    it('[TC82595] Verify page linking when dossier page is loaded on demand', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: loadPageOnDemand,
        });
        await libraryPage.openDossier(loadPageOnDemand.name);

        // text
        await toc.openPageFromTocMenu({ chapterName: 'Text', pageName: 'Page 1' });
        await textbox.navigateLink(0);
        await since('Link to Page from Text, back icon should NOT be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(false);
        await since('Link to Page from Text, target page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual([loadPageOnDemand.name, 'Target', 'Page 1']);

        // grid
        await toc.openPageFromTocMenu({ chapterName: 'Grid', pageName: 'Page 1' });
        await grid.linkToTargetByGridContextMenu({
            title: 'Visualization 1',
            headerName: 'Category',
            elementName: 'Books',
        });
        await since('Link to Page from Grid, back icon should NOT be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(false);
        await since('Link to Page from Grid, target page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual([loadPageOnDemand.name, 'Target2', 'Page 1']);
    });

    it('[TC82816] Verify page linking when dossier page is loaded on demand', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: loadChapterOnDemand,
        });
        await libraryPage.openDossier(loadChapterOnDemand.name);

        // text
        await toc.openPageFromTocMenu({ chapterName: 'Text', pageName: 'Page 1' });
        await textbox.navigateLink(0);
        await since('Link to Page from Text, back icon should NOT be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(false);
        await since('Link to Page from Text, target page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual([loadChapterOnDemand.name, 'Target', 'Page 1']);

        // grid
        await toc.openPageFromTocMenu({ chapterName: 'Grid', pageName: 'Page 1' });
        await grid.linkToTargetByGridContextMenu({
            title: 'Visualization 1',
            headerName: 'Category',
            elementName: 'Books',
        });
        await since('Link to Page from Grid, back icon should NOT be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(false);
        await since('Link to Page from Grid, target page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual([loadChapterOnDemand.name, 'Target2', 'Page 1']);
    });

    it('[TC58917] Verify dossier linking error handling when target dossier page is deleted', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: errorHandlingDossier,
        });
        await libraryPage.openDossier(errorHandlingDossier.name);

        // When target page is not found, user should be redirected to the base page of target dossier or back to the source page
        // Link to itself
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Base page' });
        await grid.linkToTargetByGridContextMenu({
            title: 'link to itself',
            headerName: 'Category',
            elementName: 'Books',
        });
        await since('Link to deleted page should popup the error dialog')
            .expect(await libraryPage.isErrorPresent())
            .toBe(true);
        // Click Cancel Button back to Source page
        await libraryPage.clickErrorActionButton('Cancel');
        await since('Back to source page, the source page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['(AUTO) DossierLinking_Error Handling', 'Chapter 1', 'Base page']);
        await grid.linkToTargetByGridContextMenu({
            title: 'link to itself',
            headerName: 'Category',
            elementName: 'Books',
        });
        await since('Link to deleted page should popup the error dialog')
            .expect(await libraryPage.isErrorPresent())
            .toBe(true);
        // Click OK Button to Target default page
        await libraryPage.clickErrorActionButton('OK');
        await since('Go to the target default page, the page title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['(AUTO) DossierLinking_Error Handling', 'Chapter 1', 'Base page']);
        await since('Go to the target default page, back icon should be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(true);
        await dossierPage.goBackFromDossierLink();

        // When target page is not found, user should be redirected to the base page of target dossier or back to the source page
        // Link to other dossier
        await grid.linkToTargetByGridContextMenu({
            title: 'link to others - page not found',
            headerName: 'Category',
            elementName: 'Books',
        });
        await since('Link to deleted page should popup the error dialog')
            .expect(await libraryPage.isErrorPresent())
            .toBe(true);
        // Click Cancel Button back to Source page
        await libraryPage.clickErrorActionButton('Cancel');
        await since('Back to source page, the source page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['(AUTO) DossierLinking_Error Handling', 'Chapter 1', 'Base page']);
        await grid.linkToTargetByGridContextMenu({
            title: 'link to others - page not found',
            headerName: 'Category',
            elementName: 'Books',
        });
        await since('Link to deleted page should popup the error dialog')
            .expect(await libraryPage.isErrorPresent())
            .toBe(true);
        // Click OK Button to Target default page
        await libraryPage.clickErrorActionButton('OK');
        await dossierPage.waitForPageLoading();
        await since('Go to the target default page, the page title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['target_dossier_Error handling', 'Chapter 1', 'Default page']);
        await since('Go to the target default page, back icon should be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(true);
        await dossierPage.goBackFromDossierLink();
    });

    it('[TC78621] Validate special chars as source element to link to target dosssier(%, &, <>, +)', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: specialCharsDossier,
        });
        await libraryPage.openDossier(specialCharsDossier.name);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Open in current tab' });

        // %
        await grid.linkToTargetByGridContextMenu({
            title: 'Visualization 1',
            headerName: 'Elements',
            elementName: 'special % chars',
        });
        await grid.openViewFilterContainer('Visualization 1');
        await since('View filter should be #{expected}, instead we have #{actual}')
            .expect(await grid.getViewFilterItemText())
            .toBe('Clear "Elements = special % chars"');
        await grid.closeViewFilterContainer('Visualization 1');
        await dossierPage.goBackFromDossierLink();

        // &
        await grid.linkToTargetByGridContextMenu({
            title: 'Visualization 1',
            headerName: 'Elements',
            elementName: 'special & chars',
        });
        await grid.openViewFilterContainer('Visualization 1');
        await since('View filter should be #{expected}, instead we have #{actual}')
            .expect(await grid.getViewFilterItemText())
            .toBe('Clear "Elements = special & chars"');
        await grid.closeViewFilterContainer('Visualization 1');
        await dossierPage.goBackFromDossierLink();

        // <>
        await grid.linkToTargetByGridContextMenu({
            title: 'Visualization 1',
            headerName: 'Elements',
            elementName: 'special <> chars',
        });
        await grid.openViewFilterContainer('Visualization 1');
        await since('View filter should be #{expected}, instead we have #{actual}')
            .expect(await grid.getViewFilterItemText())
            .toBe('Clear "Elements = special <> chars"');
        await grid.closeViewFilterContainer('Visualization 1');
        await dossierPage.goBackFromDossierLink();

        // +
        await grid.linkToTargetByGridContextMenu({
            title: 'Visualization 1',
            headerName: 'Elements',
            elementName: 'special + chars',
        });
        await grid.openViewFilterContainer('Visualization 1');
        await since('View filter should be #{expected}, instead we have #{actual}')
            .expect(await grid.getViewFilterItemText())
            .toBe('Clear "Elements = special + chars"');
        await grid.closeViewFilterContainer('Visualization 1');
        await dossierPage.goBackFromDossierLink();

        // ?
        await grid.linkToTargetByGridContextMenu({
            title: 'Visualization 1',
            headerName: 'Elements',
            elementName: 'special ? Chars',
        });
        await grid.openViewFilterContainer('Visualization 1');
        await since('View filter should be #{expected}, instead we have #{actual}')
            .expect(await grid.getViewFilterItemText())
            .toBe('Clear "Elements = special ? Chars"');
        await grid.closeViewFilterContainer('Visualization 1');
        await dossierPage.goBackFromDossierLink();

        // /
        await grid.linkToTargetByGridContextMenu({
            title: 'Visualization 1',
            headerName: 'Elements',
            elementName: 'special / Chars',
        });
        await grid.openViewFilterContainer('Visualization 1');
        await since('View filter should be #{expected}, instead we have #{actual}')
            .expect(await grid.getViewFilterItemText())
            .toBe('Clear "Elements = special / Chars"');
        await grid.closeViewFilterContainer('Visualization 1');
        await dossierPage.goBackFromDossierLink();

        // "
        await grid.linkToTargetByGridContextMenu({
            title: 'Visualization 1',
            headerName: 'Elements',
            elementName: 'special " Chars',
        });
        await grid.openViewFilterContainer('Visualization 1');
        await since('View filter should be #{expected}, instead we have #{actual}')
            .expect(await grid.getViewFilterItemText())
            .toBe('Clear "Elements = special " Chars"');
        await grid.closeViewFilterContainer('Visualization 1');
        await dossierPage.goBackFromDossierLink();
    });
});
export const config = specConfiguration;
