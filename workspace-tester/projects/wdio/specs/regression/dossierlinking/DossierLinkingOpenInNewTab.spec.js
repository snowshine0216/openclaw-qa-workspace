import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';

const specConfiguration = { ...customCredentials('_linking') };

describe('Dossier Linking - Open in new tab', () => {
    const tutorialProject = {
        id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
        name: 'MicroStrategy Tutorial',
    };
    const sourceAndTargetDossier_NewTab = {
        id: '6B089C184E36B5FE8637ACAE93EA55E5',
        name: '(AUTO) DossierLinking_Source and Target_OpenInNewTab',
        project: tutorialProject,
    };
    const passFilterOnNewTab = {
        id: '5B7656B443B89FDC5A2E73B22782A21E',
        name: '(AUTO) DossierLinking_Pass Filter_OpenInNewTab',
        project: tutorialProject,
    };
    const passPromptAnswerOnNewTab = {
        id: 'F89DC4EA4C3AC887AC12DFBB171C395E',
        name: '(AUTO) DossierLinking_Pass Prompt_Answer Type_OpenInNewTab',
        project: tutorialProject,
    };
    const passPromptTypeOnNewTab = {
        id: 'D42BDAF54CF3DA7E23919599A02C2EC5',
        name: '(AUTO) DossierLinking_Pass Prompt_Prompt Type_OpenInNewTab',
        project: tutorialProject,
    };
    const specialCharsDossier = {
        id: '33BFC9B343D42D96A02EB794A35AB04C',
        name: '(AUTO) DossierLinking_Special Chars',
        project: tutorialProject,
    };
    const promptAnswerRequired = {
        id: '2E4A3AE64357C32D955662B3CD030E4C',
        name: '(AUTO) DossierLinking_PassFilterPanel_PromptAnswerRequired',
        project: tutorialProject,
    };

    const { credentials } = specConfiguration;

    let {
        dossierPage,
        toc,
        libraryPage,
        grid,
        promptEditor,
        filterSummary,
        textbox,
        imageContainer,
        pieChart,
        loginPage,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC69372] Verify selected elements can be passed to target dossier as view filter - open in new window', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: sourceAndTargetDossier_NewTab,
        });
        await libraryPage.openDossier(sourceAndTargetDossier_NewTab.name);

        // attribute value
        await toc.openPageFromTocMenu({ chapterName: 'Viz', pageName: 'grid' });
        await grid.linkToTargetByGridContextMenu({
            title: 'link to another dossier - itself',
            headerName: 'Category',
            elementName: 'Books',
        });
        await dossierPage.switchToTab(1);
        await grid.openViewFilterContainer('link to this dossier');
        await since('Attribute value should be passed as view filter')
            .expect(await grid.getViewFilterItemText())
            .toBe('Clear "Category = Books"');
        await grid.closeViewFilterContainer('link to this dossier');
        await dossierPage.closeTab(1);

        // metric value
        await grid.linkToTargetByGridContextMenu({
            title: 'link to another dossier - itself',
            headerName: 'Cost',
            elementName: '$4,970,513',
        });
        await dossierPage.switchToTab(1);
        await grid.openViewFilterContainer('link to this dossier');
        await since('Metric value should be passed as view filter')
            .expect(await grid.isViewFilterItemPresent('Clear "Category = Electronics Year = 2014"'))
            .toBe(true);
        await grid.closeViewFilterContainer('link to this dossier');
        await dossierPage.closeTab(1);

        // attribute header
        await grid.linkToTargetByGridContextMenu({ title: 'link to another dossier - itself', headerName: 'Category' });
        await dossierPage.switchToTab(1);
        await since('Attribute header should not be passed as view filter')
            .expect(await grid.isViewFilterPresent('link to this dossier'))
            .toBe(false);
        await dossierPage.closeTab(1);

        // metric header
        await grid.linkToTargetByGridContextMenu({ title: 'link to another dossier - itself', headerName: 'Cost' });
        await dossierPage.switchToTab(1);
        await since('Metric header should not be passed as view filter')
            .expect(await grid.isViewFilterPresent('link to this dossier'))
            .toBe(false);
        await dossierPage.closeTab(1);

        // group value
        await grid.linkToTargetByGridContextMenu({
            title: 'link to another dossier - others',
            headerName: 'Category(Group)',
            elementName: 'Books and Electronic',
        });
        await dossierPage.switchToTab(1);
        await since('Group value should not be passed as view filter if target to another dossier')
            .expect(await grid.isViewFilterPresent('Visualization 1'))
            .toBe(false);
        await dossierPage.closeTab(1);

        // multiple values
        await grid.multiSelectGridElements({
            title: 'link to another dossier - itself',
            headerName: 'Category',
            elementName1: 'Movies',
            elementName2: 'Music',
        });
        await grid.linkToTargetByGridContextMenu({
            title: 'link to another dossier - itself',
            headerName: 'Category',
            elementName: 'Movies',
        });
        await dossierPage.switchToTab(1);
        await grid.openViewFilterContainer('link to this dossier');
        await since('multiple values should be passed as view filter ')
            .expect(await grid.getViewFilterItemText())
            .toBe('Clear "Category = Movies OR Music"');
        await grid.closeViewFilterContainer('link to this dossier');
        await dossierPage.closeTab(1);
    });

    it('[TC69373] Verify dossier multiple links and backs work as expected - open in new window', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: sourceAndTargetDossier_NewTab,
        });
        await libraryPage.openDossier(sourceAndTargetDossier_NewTab.name);

        // Link to itself: link #1
        await toc.openPageFromTocMenu({ chapterName: 'Viz', pageName: 'grid' });
        await grid.linkToTargetByGridContextMenu({ title: 'link to another dossier - itself', headerName: 'Category' });
        await dossierPage.switchToTab(1);
        await since('Link to itself 1st time and open in new window, back icon should NOT be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(false);
        await since(
            'Link to itself 1st time and open in new window, target page should be #{expected}, instead we have #{actual}'
        )
            .expect(await dossierPage.title())
            .toEqual(['(AUTO) DossierLinking_Source and Target_OpenInNewTab', 'Viz', 'pie chart']);

        // Link to itself: link #2
        await pieChart.linkToTargetByPiechartContextMenu({
            title: 'link to another dossier - itself',
            slice: 'Books',
        });
        await dossierPage.switchToTab(2);
        await since('Link to itself 2nd time and open in new window, back icon should NOT be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(false);
        await since(
            'Link to itself 2nd time and open in new window, target page should be #{expected}, instead we have #{actual}'
        )
            .expect(await dossierPage.title())
            .toEqual(['(AUTO) DossierLinking_Source and Target_OpenInNewTab', 'Viz', 'line chart']);

        // Close new window
        await dossierPage.closeTab(2);
        await dossierPage.closeTab(1);

        // Link to others: link #1
        await toc.openPageFromTocMenu({ chapterName: 'Viz', pageName: 'pie chart' });
        await pieChart.linkToTargetByPiechartContextMenu({
            title: 'link to another dossier - other',
            slice: 'Books',
        });
        await dossierPage.switchToTab(1);
        await since('Link to other dossier 1st time and open in new window, back icon should NOT be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(false);
        await since(
            'Link to other dossier 1st time and open in new window, target page should be #{expected}, instead we have #{actual}'
        )
            .expect(await dossierPage.title())
            .toEqual(['Target_dossier', 'Chapter 1', 'Grid']);

        // Link to others: link #2
        await grid.linkToTargetByGridContextMenu({ title: 'Visualization 1', headerName: 'Category' });
        await since('Link to other dossier 2nd time and open in current window, back icon should be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(true);
        await since(
            'Link to other dossier 2nd time and open in current window, target page should be #{expected}, instead we have #{actual}'
        )
            .expect(await dossierPage.title())
            .toEqual(['target_dossier_filter_year_dropdown', 'filter by Year', 'year']);

        // back to source: back 1#
        await dossierPage.goBackFromDossierLink();
        await since('Back to source dossier 1st time, the source page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['Target_dossier', 'Chapter 1', 'Grid']);

        // close new window
        await dossierPage.closeTab(1);

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
            .toEqual(['(AUTO) DossierLinking_Source and Target_OpenInNewTab', 'Viz', 'grid']);

        // mixed link: link to another dossier -itself (2#)
        await grid.linkToTargetByGridContextMenu({ title: 'link to another dossier - itself', headerName: 'Category' });
        await dossierPage.switchToTab(1);
        await since(
            'Mixed link: link to another dossiere(itself) and open in new window, back icon should NOT be appeared'
        )
            .expect(await dossierPage.isBackIconPresent())
            .toBe(false);
        await since(
            'Mixed link: link to another dossiere(itself) and open in new window, target page should be #{expected}, instead we have #{actual}'
        )
            .expect(await dossierPage.title())
            .toEqual(['(AUTO) DossierLinking_Source and Target_OpenInNewTab', 'Viz', 'pie chart']);

        // mixed link: link to another dossier - others (3#)
        await pieChart.linkToTargetByPiechartContextMenu({
            title: 'link to another dossier - other',
            slice: 'Books',
        });
        await dossierPage.switchToTab(2);
        await since(
            'Mixed link: link to another dossier(others) and open in new window, back icon should NOT be appeared'
        )
            .expect(await dossierPage.isBackIconPresent())
            .toBe(false);
        await since(
            'Mixed link: link to other dossier(others) and open in new window, target page should be #{expected}, instead we have #{actual}'
        )
            .expect(await dossierPage.title())
            .toEqual(['Target_dossier', 'Chapter 1', 'Grid']);

        // close new window
        await dossierPage.closeTab(2);
        await dossierPage.closeTab(1);
    });

    it('[TC69371] Verify filter can be passed to target dossier - open in new window', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: passFilterOnNewTab,
        });
        await libraryPage.openDossier(passFilterOnNewTab.name);

        //pass single filter -  on text
        await toc.openPageFromTocMenu({ chapterName: 'pass filter: single filter' });
        await textbox.navigateLink(0);
        await dossierPage.switchToTab(1);
        await since('Link to target and open in new window, back icon should NOT be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(false);
        await since(
            'Pass single filter and open in new window, filter [Year] is passed and value should be #{expected}, while we got #{actual}'
        )
            .expect(await filterSummary.filterItems('Year'))
            .toBe('(2014, 2015)');
        await dossierPage.closeTab(1);

        //pass multiple filters - on grid
        await toc.openPageFromTocMenu({ chapterName: 'pass filter: multi filters' });
        await grid.linkToTargetByGridContextMenu({ title: 'linking', headerName: 'Category' });
        await dossierPage.switchToTab(1);
        await since('Link to target and open in new window, back icon should NOT be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(false);
        await since(
            'Pass multiple filters and open in new window, passed filter [Category] and value should be #{expected}'
        )
            .expect(await filterSummary.filterItems('Category'))
            .toBe('(Books, Electronics)');
        await since(
            'Pass multiple filters and open in new window, passed filter [Year] and value should be #{expected}'
        )
            .expect(await filterSummary.filterItems('Year'))
            .toBe('(2014, 2015)');
        await dossierPage.closeTab(1);

        // pass filter with exclude mode - on text
        await toc.openPageFromTocMenu({ chapterName: 'pass filter: exclude' });
        await textbox.navigateLink(0);
        await dossierPage.switchToTab(1);
        await since('Link to target and open in new window, back icon should NOT be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(false);
        await since(
            'Pass filter exclude mode and open in new window, passed filter [Year] and value should be #{expected}'
        )
            .expect(await filterSummary.filterItems('Year'))
            .toBe('(exclude 2015)');
        await dossierPage.closeTab(1);

        // pass filter with multiple attribute forms - on image
        await toc.openPageFromTocMenu({ chapterName: 'pass filter: attribute form' });
        await imageContainer.navigateLinkInCurrentPage(0);
        await dossierPage.switchToTab(1);
        await since('link to target and open in new window, back icon should NOT be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(false);
        await since(
            'Pass filter with multiple attribute forms and open in new window, passed filter [Category] and value should be #{expected}'
        )
            .expect(await filterSummary.filterItems('Category'))
            .toBe('(exclude Books)');
        await since(
            'Pass filter with multiple attribute forms and open in new window, passed filter [Region] and value should be #{expected}'
        )
            .expect(await filterSummary.filterItems('Region'))
            .toBe('(Northeast)');
        await since(
            'Pass filter with multiple attribute forms and open in new window, passed filter [Year] and value should be #{expected}'
        )
            .expect(await filterSummary.filterItems('Year'))
            .toBe('(2015 - 2016)');
        await dossierPage.closeTab(1);

        // pass filter in unset state - on grid
        await toc.openPageFromTocMenu({ chapterName: 'pass filter: unset' });
        await grid.linkToTargetByGridContextMenu({ title: 'linking', headerName: 'Category' });
        await dossierPage.switchToTab(1);
        await since('link to target and open in new window, back icon should NOT be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(false);
        await since(
            "Pass filter with unset state and open in new window, filter should be passed as 'select all' instead of 'select none', and filter count should be #{expected},while we got #{actural}"
        )
            .expect(await filterSummary.filterCount())
            .toBe('0');
        await dossierPage.closeTab(1);

        // NOT pass filter - on image
        await toc.openPageFromTocMenu({ chapterName: 'NOT pass filter' });
        await imageContainer.navigateLinkInCurrentPage(0);
        await dossierPage.switchToTab(1);
        await since('link to target and open in new window, back icon should NOT be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(false);
        await since(
            'Not pass filter and open in new window, target dossier filter should keep original ones and filter value should be #{expected}'
        )
            .expect(await filterSummary.filterItems('Year'))
            .toBe('(2014)');
        await dossierPage.closeTab(1);
    });

    it('[TC69370_01] Verify different prompt answer type can be passed to target dossier - open in new window(prompt user,use selected,use default)', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: passPromptAnswerOnNewTab,
        });
        await libraryPage.openDossier(passPromptAnswerOnNewTab.name);

        //prompt user - on text
        await toc.openPageFromTocMenu({ chapterName: 'prompt answers', pageName: 'prompt user' });
        await textbox.navigateLink(0);
        await dossierPage.switchToTab(1);
        await promptEditor.waitForEditor();
        await since('Prompt user should show prompt window when link to target')
            .expect(await promptEditor.isEditorOpen())
            .toBe(true);
        await promptEditor.toggleViewSummary();
        await since('In prompt user, the prompt answer for [Category] should be default values: #{expected}')
            .expect(await promptEditor.checkListSummary('Category'))
            .toEqual('Books');
        await promptEditor.run();
        await dossierPage.closeTab(1);

        // use the selected object as prompt answer - on grid
        await toc.openPageFromTocMenu({
            chapterName: 'prompt answers',
            pageName: 'use the selected object as prompt answer',
        });
        await grid.linkToTargetByGridContextMenu({ title: 'linking', headerName: 'Category', elementName: 'Movies' });
        await dossierPage.switchToTab(1);
        await since('Use the selected object as prompt answer should not show prompt window when link to target')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await since(
            'In Use the selected object as prompt answer, the prompt answer for [Category] should be default values: #{expected}'
        )
            .expect(await promptEditor.checkListSummary('Category'))
            .toEqual('Movies');
        await promptEditor.cancelEditor();
        await dossierPage.closeTab(1);

        //user the defaut answer - on image
        await toc.openPageFromTocMenu({ chapterName: 'prompt answers', pageName: 'user the defaut answer' });
        await imageContainer.navigateLink(0);
        await dossierPage.switchToTab(1);
        await since('User the defaut answer should not show prompt window when link to target')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await since('In user the defaut answer, the prompt answer for [Category] should be default values: #{expected}')
            .expect(await promptEditor.checkListSummary('Category'))
            .toEqual('Books');
        await promptEditor.cancelEditor();
        await dossierPage.closeTab(1);
    });

    it('[TC69370_02] Verify different prompt answer type can be passed to target dossier - open in new window(use same,ignore prompt)', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: passPromptAnswerOnNewTab,
        });
        await libraryPage.openDossier(passPromptAnswerOnNewTab.name);

        //use the same answer from the source prompt - grid
        await toc.openPageFromTocMenu({
            chapterName: 'prompt answers',
            pageName: 'use the same answer from the source prompt',
        });
        await grid.linkToTargetByGridContextMenu({ title: 'linking', headerName: 'Category' });
        await dossierPage.switchToTab(1);
        await since('Use the same answer from the source prompt should not show prompt window when link to target')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await since(
            'In use the same answer from the source prompt, the prompt answer for [Category] should be default values: #{expected}'
        )
            .expect(await promptEditor.checkListSummary('Category'))
            .toEqual('Books, Electronics, Movies');
        await promptEditor.cancelEditor();
        await dossierPage.closeTab(1);

        //ignore the prompt -text
        await toc.openPageFromTocMenu({ chapterName: 'prompt answers', pageName: 'ignore the prompt' });
        await textbox.navigateLink(0);
        await dossierPage.switchToTab(1);
        await since('Ignore the prompt should not show prompt window when link to target')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Category');
        await since('In ignore the prompt, the prompt answer for [Category] should be default values: #{expected}')
            .expect(await promptEditor.checkEmptySummary('Category'))
            .toEqual('No Selection');
        await promptEditor.cancelEditor();
        await dossierPage.closeTab(1);
    });

    it('[TC69344_01] Verify pass prompt answer are supported on different prompt type - open in new window(AE,AQ,MQ)', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: passPromptTypeOnNewTab,
        });
        await libraryPage.openDossier(passPromptTypeOnNewTab.name);

        //attribute element prompt -text
        await toc.openPageFromTocMenu({
            chapterName: 'different type of prompt',
            pageName: 'attribute element prompt',
        });
        await textbox.navigateLink(0);
        await dossierPage.switchToTab(1);
        await since('attribute element prompt should not show prompt window when link to target')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Category');
        await since(
            'For attribute element prompt, the prompt answer for [Category] should be default values: #{expected}'
        )
            .expect(await promptEditor.checkListSummary('Category'))
            .toEqual('Books, Electronics');
        await promptEditor.cancelEditor();
        await dossierPage.closeTab(1);

        //attribute qualification prompt - Grid
        await toc.openPageFromTocMenu({
            chapterName: 'different type of prompt',
            pageName: 'attribute qulification prompt',
        });
        await grid.linkToTargetByGridContextMenu({ title: 'use same answer', headerName: 'Quarter' });
        await dossierPage.switchToTab(1);
        await since('attribute qualification prompt should not show prompt window when link to target')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Quarter');
        await since(
            'For qualification element prompt, the prompt answer for [Quarter] should: #{expected}, instead we have #{actual}'
        )
            .expect(await promptEditor.checkQualSummary('Quarter'))
            .toEqual('QuarterDESC Greater than2015 Q3');
        await promptEditor.cancelEditor();
        await dossierPage.closeTab(1);

        // metric qualification prompt - Grid
        await toc.openPageFromTocMenu({
            chapterName: 'different type of prompt',
            pageName: 'metric qualification prompt',
        });
        await grid.linkToTargetByGridContextMenu({ title: 'use the same answer', headerName: 'Subcategory' });
        await since('metric qualification prompt should not show prompt window when link to target')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Cost');
        await since(
            'For metric qualification prompt, the prompt answer for [Cost] should be default values: #{expected}, instead we have #{actual}'
        )
            .expect(await promptEditor.checkQualSummary('Cost'))
            .toEqual('CostGreater than or equal to2000at levelDefault');
        await promptEditor.cancelEditor();
        await dossierPage.closeTab(1);
    });

    it('[TC69344_02] Verify pass prompt answer are supported on different prompt type - open in new window(HQ,Value,Object prompt)', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: passPromptTypeOnNewTab,
        });
        await libraryPage.openDossier(passPromptTypeOnNewTab.name);

        // hierarchy qualification prompt - Image
        await toc.openPageFromTocMenu({
            chapterName: 'different type of prompt',
            pageName: 'hierarchy qualification prompt',
        });
        await imageContainer.navigateLinkInCurrentPage(0);
        await dossierPage.switchToTab(1);
        await since('hierarchy qualification prompt should not show prompt window when link to target')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Time');
        await since(
            'For hierarchy qualification prompt, the prompt answer for [Time] should be default values: #{expected}, instead we have #{actual}'
        )
            .expect(await promptEditor.checkQualSummary('Time'))
            .toEqual('YearID Greater than2015');
        await promptEditor.cancelEditor();
        await dossierPage.closeTab(1);

        // value prompt - Text
        await toc.openPageFromTocMenu({ chapterName: 'different type of prompt', pageName: 'value prompt' });
        await textbox.navigateLink(0);
        await dossierPage.switchToTab(1);
        await since('value prompt should not show prompt window when link to target')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Date');
        await since(
            'For value prompt, the prompt answer for [Date] should be default values: #{expected}, instead we have #{actual}'
        )
            .expect(await promptEditor.checkTextSummary('Date'))
            .toEqual('1/1/2016');
        await promptEditor.cancelEditor();
        await dossierPage.closeTab(1);

        // object prompt - Grid
        await toc.openPageFromTocMenu({ chapterName: 'different type of prompt', pageName: 'object prompt' });
        await grid.linkToTargetByGridContextMenu({ title: 'Visualization 1', headerName: 'Category' });
        await dossierPage.switchToTab(1);
        await since('object prompt should not show prompt window when link to target')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Objects');
        await since(
            'For object prompt, the prompt answer for [Objects] should be default values: #{expected}, instead we have #{actual}'
        )
            .expect(await promptEditor.checkListSummary('Objects'))
            .toEqual('Subcategory');
        await promptEditor.cancelEditor();
        await dossierPage.closeTab(1);
    });

    it('[TC82138] Verify filter panel can be passed to target dossier as prompt answer - open in new window', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: promptAnswerRequired,
        });
        await libraryPage.openDossier(promptAnswerRequired.name);

        // prompt answer not meet min/max
        await toc.openPageFromTocMenu({ chapterName: 'Prompt required-not met' });
        await textbox.navigateLink(0);
        await dossierPage.switchToTab(1);
        await promptEditor.waitForEditor();
        await since(
            'Pass filter panel with prompt answer required(open in new tab), not met condition, prompt window should be appeared'
        )
            .expect(await promptEditor.isEditorOpen())
            .toBe(true);
        await promptEditor.toggleViewSummary();
        await since(
            'Pass filter panel with prompt answer required(open in new tab), the prompt answer should be #{expected}, while we get #{actual}'
        )
            .expect(await promptEditor.checkListSummary('Category'))
            .toEqual('Books, Electronics, Movies, Music');
        await promptEditor.run();
        await dossierPage.closeTab(1);

        // prompt answer meet min/max
        await toc.openPageFromTocMenu({ chapterName: 'Prompt required-met' });
        await textbox.navigateLink(0);
        await dossierPage.switchToTab(1);
        await since(
            'Pass filter panel with prompt answer required(open in new tab), met condition, prompt window should NOT be appeared'
        )
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await since(
            'Pass filter panel with prompt answer required(open in new tab), the prompt answer should be #{expected}, while we get #{actual}'
        )
            .expect(await promptEditor.checkListSummary('Category'))
            .toEqual('Electronics, Books');
        await promptEditor.cancelEditor();
        await dossierPage.closeTab(1);
    });

    it('[TC79672] Validate special chars as source element to link to target dosssier - open in new tab(%, &,<>,+)', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: specialCharsDossier,
        });
        await libraryPage.openDossier(specialCharsDossier.name);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Open in new tab' });

        // %
        await grid.linkToTargetByGridContextMenu({
            title: 'Visualization 1',
            headerName: 'Elements',
            elementName: 'special % chars',
        });
        await dossierPage.switchToTab(1);
        await grid.openViewFilterContainer('Visualization 1');
        await since('View filter should be #{expected}, instead we have #{actual}')
            .expect(await grid.getViewFilterItemText())
            .toBe('Clear "Elements = special % chars"');
        await grid.closeViewFilterContainer('Visualization 1');
        await dossierPage.closeTab(1);

        // &
        await grid.linkToTargetByGridContextMenu({
            title: 'Visualization 1',
            headerName: 'Elements',
            elementName: 'special & chars',
        });
        await dossierPage.switchToTab(1);
        await grid.openViewFilterContainer('Visualization 1');
        await since('View filter should be #{expected}, instead we have #{actual}')
            .expect(await grid.getViewFilterItemText())
            .toBe('Clear "Elements = special & chars"');
        await grid.closeViewFilterContainer('Visualization 1');
        await dossierPage.closeTab(1);

        // <>
        await grid.linkToTargetByGridContextMenu({
            title: 'Visualization 1',
            headerName: 'Elements',
            elementName: 'special <> chars',
        });
        await dossierPage.switchToTab(1);
        await grid.openViewFilterContainer('Visualization 1');
        await since('View filter should be #{expected}, instead we have #{actual}')
            .expect(await grid.getViewFilterItemText())
            .toBe('Clear "Elements = special <> chars"');
        await grid.closeViewFilterContainer('Visualization 1');
        await dossierPage.closeTab(1);

        // +
        await grid.linkToTargetByGridContextMenu({
            title: 'Visualization 1',
            headerName: 'Elements',
            elementName: 'special + chars',
        });
        await dossierPage.switchToTab(1);
        await grid.openViewFilterContainer('Visualization 1');
        await since('View filter should be #{expected}, instead we have #{actual}')
            .expect(await grid.getViewFilterItemText())
            .toBe('Clear "Elements = special + chars"');
        await grid.closeViewFilterContainer('Visualization 1');
        await dossierPage.closeTab(1);

        // ?
        await grid.linkToTargetByGridContextMenu({
            title: 'Visualization 1',
            headerName: 'Elements',
            elementName: 'special ? Chars',
        });
        await dossierPage.switchToTab(1);
        await grid.openViewFilterContainer('Visualization 1');
        await since('View filter should be #{expected}, instead we have #{actual}')
            .expect(await grid.getViewFilterItemText())
            .toBe('Clear "Elements = special ? Chars"');
        await grid.closeViewFilterContainer('Visualization 1');
        await dossierPage.closeTab(1);

        // /
        await grid.linkToTargetByGridContextMenu({
            title: 'Visualization 1',
            headerName: 'Elements',
            elementName: 'special / Chars',
        });
        await dossierPage.switchToTab(1);
        await grid.openViewFilterContainer('Visualization 1');
        await since('View filter should be #{expected}, instead we have #{actual}')
            .expect(await grid.getViewFilterItemText())
            .toBe('Clear "Elements = special / Chars"');
        await grid.closeViewFilterContainer('Visualization 1');
        await dossierPage.closeTab(1);

        // "
        await grid.linkToTargetByGridContextMenu({
            title: 'Visualization 1',
            headerName: 'Elements',
            elementName: 'special " Chars',
        });
        await dossierPage.switchToTab(1);
        await grid.openViewFilterContainer('Visualization 1');
        await since('View filter should be #{expected}, instead we have #{actual}')
            .expect(await grid.getViewFilterItemText())
            .toBe('Clear "Elements = special " Chars"');
        await grid.closeViewFilterContainer('Visualization 1');
        await dossierPage.closeTab(1);
    });
});
export const config = specConfiguration;
