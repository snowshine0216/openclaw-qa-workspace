import resetDossierState from '../../../api/resetDossierState.js';
import resetBookmarks from '../../../api/resetBookmarks.js';
import resetBookmarksWithPrompt from '../../../api/resetBookmarksWithPrompt.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('Bookmark', () => {
    const dossier1 = {
        id: '8CDF3DFF4034D57B004D27B11037DA9D',
        name: 'Bookmark',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };
    const dossier2 = {
        id: '1D5967034F4E24CF69AD82AD22702717',
        name: 'Bookmark with Multiple Prompts',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };
    const document = {
        id: '2B661A2946B4EF162BA7359A0F9445C3',
        name: 'RWD_Bookmark',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };
    const promptName = 'Category';
    let {
        loginPage,
        bookmark,
        checkboxFilter,
        libraryPage,
        dossierPage,
        filterPanel,
        reset,
        promptEditor,
        prompt,
        promptObject,
        filterSummaryBar,
    } = browsers.pageObj1;
    let cart = promptObject.shoppingCart;

    beforeAll(async () => {
        await loginPage.login(browsers.params.credentials);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC56654] Bookmark -- Create/Rename Bookmark', async () => {
        await resetDossierState({
            credentials: browsers.params.credentials,
            dossier: dossier1,
        });
        await resetBookmarks({
            credentials: browsers.params.credentials,
            dossier: dossier1,
        });

        await libraryPage.openDossier(dossier1.name);
        await bookmark.openPanel();

        await takeScreenshotByElement(await bookmark.getPanel(), 'TC56654', 'EmptyBookmarkList');

        // 'Add new Bookmark with empty name'
        await bookmark.addNewBookmark('');
        since('Empty input can be created successfully with a default name Bookmark 1')
            .expect(await bookmark.labelInTitle())
            .toBe('Bookmark 1');
        // 'Add new Bookmark with standard name'
        await bookmark.addNewBookmark('New Bookmark 1');
        // 'Add new Bookmark with special character'
        await bookmark.addNewBookmark('New Bookmark 2[');
        since('Inline error with special keywords for BM name should be "#{expected}", instead we have "#{actual}"')
            .expect(await bookmark.isErrorInputDialogPresent())
            .toBe(true);
        since('Inline error msg with special keywords for BM name should be "#{expected}", instead we have "#{actual}"')
            .expect(await bookmark.getAddBookmarkErrorMsg())
            .toBe('The name cannot contain the following characters " \\ [ ].');
        await bookmark.cancelInputName();
        since('Current BM label on navigation bar should be NewBookmark 1')
            .expect(await bookmark.labelInTitle())
            .toBe('New Bookmark 1');

        //apply BM1 and then create a new one
        await bookmark.applyBookmark('Bookmark 1');
        await dossierPage.waitForPageLoading();
        await bookmark.openPanel();
        await bookmark.addNewBookmark('New Bookmark 2');
        since('Current BM label on navigation bar should be NewBookmark 2')
            .expect(await bookmark.labelInTitle())
            .toBe('New Bookmark 2');

        //'Rename Bookmark with existing name'
        await bookmark.renameBookmark('New Bookmark 2', 'BookMark 1');
        since('Inline error msg with duplicated BM name should be "#{expected}", instead we have "#{actual}"')
            .expect(await bookmark.getAddBookmarkErrorMsg())
            .toBe('The name is already taken.');
        await bookmark.cancelInputName();
        await bookmark.renameBookmark('New Bookmark 2', 'NEW BOOKMARK 2');
        await bookmark.renameBookmark('NEW BOOKMARK 2', 'New Bookmark 2[');
        since('Inline error msg with special keywords for BM name should be "#{expected}", instead we have "#{actual}"')
            .expect(await bookmark.getAddBookmarkErrorMsg())
            .toBe('The name cannot contain the following characters " \\ [ ].');
        since('Bookmark list is supposed to be 3')
            .expect(await bookmark.bookmarkCount())
            .toBe(3);
        await bookmark.closePanel();
    });

    it('[TC56656] Bookmark -- Update Bookmark', async () => {
        await resetDossierState({
            credentials: browsers.params.credentials,
            dossier: dossier1,
        });
        await resetBookmarks({
            credentials: browsers.params.credentials,
            dossier: dossier1,
        });
        await libraryPage.openDossier(dossier1.name);
        await bookmark.openPanel();

        // 'Add new Bookmark with UBookmark'
        await bookmark.addNewBookmark('UBookmark 1');
        await bookmark.closePanel();
        //swipe pages and then update to the BM
        await dossierPage.switchPageByKey('left', '3000');
        since('Current BM label on navigation bar should be UBookmark 1')
            .expect(await bookmark.labelInTitle())
            .toBe('UBookmark 1');
        await bookmark.openPanel();
        await bookmark.updateBookmark('UBookmark 1');

        // 'Add new Bookmark with UBookmark2'
        await bookmark.addNewBookmark('UBookmark 2');
        await bookmark.closePanel();
        //change filter  and then update to the BM
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Region');
        await checkboxFilter.selectElementByName('Central');
        await filterPanel.apply();
        since('No bookmark is applied currently')
            .expect(await bookmark.isBookmarkLabelPresent())
            .toBe(false);
        await bookmark.openPanel();
        await bookmark.updateBookmark('UBookmark 2');
        since('Current BM label on navigation bar should be UBookmark 2')
            .expect(await bookmark.labelInTitle())
            .toBe('UBookmark 2');

        //switch bookmark and back to check data
        await bookmark.applyBookmark('UBookmark 1');
        await bookmark.openPanel();
        await bookmark.applyBookmark('UBookmark 2');
        since('Filter summary for UBookmark 2 should be')
            .expect(await filterSummaryBar.filterSummaryBarText())
            .toBe('Region(Central, Mid-Atlantic, +6)');

        //Add new Bookmark with UBookmark3
        await bookmark.openPanel();
        await bookmark.addNewBookmark('UBookmark 3');
        await bookmark.closePanel();
        //swipe page and do filter
        await dossierPage.switchPageByKey('right', '3000');
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Region');
        await checkboxFilter.selectElementByName('South');
        await filterPanel.apply();
        since('No bookmark is applied currently')
            .expect(await bookmark.isBookmarkLabelPresent())
            .toBe(false);

        //check the save icon on BM after re-open the BM panel
        await bookmark.openPanel();
        await bookmark.hoverOnBookmark('UBookmark 2');
        await bookmark.hideBookmarkTimeStamp();
        // await takeScreenshotByElement(await bookmark.getPanel(), 'TC56656', 'UpdateBMIconAfterReopenPanel', {
        //     tolerance: 0.3,
        // });
        await bookmark.showBookmarkTimeStamp();

        //Apply other BM and check the dialog

        await bookmark.applyBookmark('UBookmark 2');
        since('Update dialog will pop over to prompt user whether to save these changes')
            .expect(await bookmark.isSaveChangesDialogPresent())
            .toBe(true);
        await takeScreenshotByElement(
            await bookmark.getSaveChangesDialog(),
            'TC56656',
            'ApplyNewBMWithoutSavedChanges'
        );
        await takeScreenshotByElement(await bookmark.getSaveChangesCheckbox(), 'TC56656', 'CheckboxWithSaveDialog');

        //stay on UBookmark 3
        await bookmark.keepSaveReminder();
        //do reset and check saved icon on UBookmark 3
        await reset.selectReset();
        await reset.confirmReset();
        await bookmark.openPanel();
        await bookmark.hoverOnBookmark('UBookmark 3');
        await expect(await bookmark.isUpdateBMPresent('UBookmark 3')).toBe(false);

        //check full bookmark list
        since('Bookmark list is supposed to be 3')
            .expect(await bookmark.bookmarkCount())
            .toBe(3);
        await bookmark.closePanel();
    });

    it('[TC56657] Bookmark -- Apply Bookmark', async () => {
        await resetDossierState({
            credentials: browsers.params.credentials,
            dossier: dossier1,
        });
        await resetBookmarks({
            credentials: browsers.params.credentials,
            dossier: dossier1,
        });
        await libraryPage.openDossier(dossier1.name);
        await bookmark.openPanel();

        // 'Add two new Bookmarks'
        await bookmark.addNewBookmark('NewBookmark 1');
        await bookmark.addNewBookmark('NewBookmark 2');

        //Apply Bookmark 1 from Bookmark 2,check Bookmark main panel
        await bookmark.applyBookmark('NewBookmark 1');
        since('Bookmark panel should be dismissed')
            .expect(await bookmark.isPanelOpen())
            .toBe(false);
        since('Current BM label on navigation bar should be NewBookmark 1')
            .expect(await bookmark.labelInTitle())
            .toBe('NewBookmark 1');

        //Swipe pages from Bookmark 1 and apply to Bookmark 2, No confirmation dialog pops over
        await dossierPage.switchPageByKey('left', '5000');
        await bookmark.openPanel();
        await bookmark.applyBookmark('NewBookmark 2');
        since('Current BM label on navigation bar should be NewBookmark 2')
            .expect(await bookmark.labelInTitle())
            .toBe('NewBookmark 2');

        //Apply NewBookmark 1 back to check dossier name
        await bookmark.openPanel();
        await bookmark.applyBookmark('NewBookmark 1');
        since('Page title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual(['Bookmark', 'Chapter 1', 'Page 2']);

        //Change filter on Bookmark 2 and apply to Bookmark 1, confirmation dialog pops over
        await bookmark.openPanel();
        await bookmark.applyBookmark('NewBookmark 2');
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Region');
        await checkboxFilter.selectElementByName('Central');
        await filterPanel.apply();
        await bookmark.openPanel();
        await bookmark.applyBookmark('NewBookmark 1');
        since('Update dialog will pop over to prompt user whether to save these changes')
            .expect(await bookmark.isSaveChangesDialogPresent())
            .toBe(true);
        await takeScreenshotByElement(
            await bookmark.getSaveChangesDialog(),
            'TC56657',
            'SavedDialog for apply bookmark from other bookmark'
        );

        //Dismiss the changes on Bookmark 2
        await bookmark.keepSaveReminder();
        //Check whether it has been applied successfully
        since('No bookmark is applied currently')
            .expect(await bookmark.isBookmarkLabelPresent())
            .toBe(false);

        //close BM panel and go back to library
        await dossierPage.goToLibrary();
        await bookmark.ignoreSaveReminder();

        //reopen it and change filter
        await libraryPage.openDossier(dossier1.name);
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Region');
        await checkboxFilter.selectElementByName('Central');
        await filterPanel.apply();

        //apply bookmark and confirm dialog pops out
        await bookmark.openPanel();
        await bookmark.applyBookmark('NewBookmark 1');
        since('Update dialog will pop over to prompt user whether to save these changes')
            .expect(await bookmark.isSaveChangesDialogPresent())
            .toBe(true);
        await takeScreenshotByElement(
            await bookmark.getSaveChangesDialog(),
            'TC56657',
            'SavedDialog for apply bookmark from short-cut'
        );

        //confirm changes
        await bookmark.ignoreSaveReminder();
        since('Current applied Bookmark should be bookmark 1')
            .expect(await bookmark.labelInTitle())
            .toBe('NewBookmark 1');
    });

    it(
        '[TC56658] Bookmark -- Delete Bookmark and long Bookmark list',
        async () => {
            await resetDossierState({
                credentials: browsers.params.credentials,
                dossier: dossier1,
            });
            await resetBookmarks({
                credentials: browsers.params.credentials,
                dossier: dossier1,
            });
            await libraryPage.openDossier(dossier1.name);
            await bookmark.openPanel();

            //create new BM with list number=20
            await bookmark.addNewBookmark('');
            await bookmark.createBookmarksByDefault(19);

            //delete them from Bookmark 1-10
            await bookmark.deleteBookmarksByDefault(10);
            since('Bookmark list is supposed to be 10')
                .expect(await bookmark.bookmarkCount())
                .toBe(10);
            since('Current applied Bookmark should be Bookmark 20')
                .expect(await bookmark.labelInTitle())
                .toBe('Bookmark 20');

            //delete the current applied one
            await bookmark.deleteBookmarkWithoutConfirm('Bookmark 20');
            since('Confirmation msg for bulk delete should be #{expected}, instead we have #{actual}')
                .expect(await bookmark.getDeleteConfirmMsg())
                .toBe('Are you sure you want to delete? Any associated subscriptions will also be deleted.');
            await bookmark.cancelDelete();
            await bookmark.deleteBookmark('Bookmark 20');
            since('Bookmark list is supposed to be 9')
                .expect(await bookmark.bookmarkCount())
                .toBe(9);
            since('No bookmark is applied currently')
                .expect(await bookmark.isBookmarkLabelPresent())
                .toBe(false);

            //apply BM11 and do manipulation then save
            await bookmark.applyBookmark('Bookmark 11');
            await bookmark.closePanel;
            await dossierPage.switchPageByKey('left', '3000');
            await filterPanel.openFilterPanel();
            await checkboxFilter.openSecondaryPanel('Region');
            await checkboxFilter.selectElementByName('South');
            await filterPanel.apply();
            await bookmark.openPanel();
            await bookmark.updateBookmark('Bookmark 11');

            //then delete the newly saved BM
            await bookmark.deleteBookmark('Bookmark 11');
            since('Bookmark list is supposed to be 8')
                .expect(await bookmark.bookmarkCount())
                .toBe(8);
            since('No bookmark is applied currently')
                .expect(await bookmark.isBookmarkLabelPresent())
                .toBe(false);

            await bookmark.closePanel();
        },
        6 * 60 * 1000
    );

    it('[TC59232] Bookmark -- Validating Bulk delete for BM', async () => {
        await resetDossierState({
            credentials: browsers.params.credentials,
            dossier: dossier1,
        });
        await resetBookmarks({
            credentials: browsers.params.credentials,
            dossier: dossier1,
        });

        await libraryPage.openDossier(dossier1.name);
        await bookmark.openPanel();
        // create new BM with list number=6
        await bookmark.addNewBookmark('');
        await bookmark.createBookmarksByDefault(5);

        //go into bulk delete mode
        await bookmark.editBulkDeleteBookmarks();
        await bookmark.hideBookmarkTimeStamp();
        await takeScreenshotByElement(bookmark.getPanel(), 'TC59232', 'InitialRendering_BulkDelete', {
            tolerance: 0.5,
        });
        await bookmark.showBookmarkTimeStamp();

        // select Bookmark 1 and Bookmark 2 to be delete
        await bookmark.selectBookmarkToDeleteByName('Bookmark 1');
        await bookmark.selectBookmarkToDeleteByName('Bookmark 2');

        //click delete
        await bookmark.bulkDeleteBookmarks();
        since('Confirmation msg for bulk delete should be')
            .expect(await bookmark.getDeleteConfirmMsg())
            .toBe('Are you sure you want to delete? Any associated subscriptions will also be deleted.');
        await bookmark.confirmDelete();
        since('Current bookmark number should be 4 after delete 2')
            .expect(await bookmark.bookmarkCount())
            .toBe(4);

        //go into bulk delete mode again
        await bookmark.editBulkDeleteBookmarks();
        //select all
        await bookmark.selectAllToDelete();
        await bookmark.hideBookmarkTimeStamp();
        await takeScreenshotByElement(bookmark.getPanel(), 'TC59232', 'SelectAll_BulkDelete', { tolerance: 0.41 });
        //deselect all
        await bookmark.selectAllToDelete();
        await takeScreenshotByElement(bookmark.getPanel(), 'TC59232', 'DeselectAll_BulkDelete', { tolerance: 0.41 });
        await bookmark.showBookmarkTimeStamp();

        //select all and  cancel delete
        await bookmark.selectAllToDelete();
        await bookmark.bulkDeleteBookmarks();
        await bookmark.cancelDelete();
        since('Current bookmark number should be 4 after cancle bulk delete all')
            .expect(await bookmark.bookmarkCount())
            .toBe(4);

        //confirm delete and close BM panel
        await bookmark.bulkDeleteBookmarks();
        await bookmark.confirmDelete();
        since('Current bookmark number should be 0 after bulk delete all')
            .expect(await bookmark.bookmarkCount())
            .toBe(0);
        await bookmark.closePanel();
    });

    it('[TC59359] Bookmark -- Validating BM with prompt', async () => {
        await resetDossierState({
            credentials: browsers.params.credentials,
            dossier: dossier2,
        });

        await resetBookmarksWithPrompt({
            credentials: browsers.params.credentials,
            dossier: dossier2,
        });

        await libraryPage.openDossier(dossier2.name);

        //create new BM with default prompt answer
        await bookmark.openPanel();
        await bookmark.addNewBookmark('');
        await bookmark.createBookmarksByDefault(2);
        await bookmark.closePanel();

        //re-prompt
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(promptName);
        await cart.clickElmInSelectedList(prompt, 'Books');
        await cart.removeSingle(prompt);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();

        //check BM icon ater reprompt
        since('No bookmark is applied currently')
            .expect(await bookmark.isBookmarkLabelPresent())
            .toBe(false);
        await bookmark.openPanel();

        //apply new BM without save changes
        await bookmark.applyBookmark('Bookmark 1');
        since('Save changes dialog will pop over to prompt user whether to save these changes')
            .expect(await bookmark.isSaveChangesDialogPresent())
            .toBe(true);

        await takeScreenshotByElement(await bookmark.getSaveChangesDialog(), 'TC59369', 'ApplyNewBMAfter_Reprompt');

        //keep staying on current BM and update
        await bookmark.keepSaveReminder();
        await bookmark.updateBookmark('Bookmark 3');
        since('Current applied Bookmark should be bookmark 3')
            .expect(await bookmark.labelInTitle())
            .toBe('Bookmark 3');

        //re-prompt and reset
        await bookmark.closePanel();
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(promptName);
        await cart.clickElmInSelectedList(prompt, 'Movies');
        await cart.removeSingle(prompt);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await reset.selectReset();
        await reset.confirmReset(true);
        await promptEditor.runWithWaitForCancel();
        await dossierPage.waitForDossierLoading();
        since('No bookmark is applied currently')
            .expect(await bookmark.isBookmarkLabelPresent())
            .toBe(false);

        //re-open dossier and check BM3 about the prompt answer
        await dossierPage.goToLibrary();
        await await libraryPage.openDossier(dossier2.name);
        await bookmark.openPanel();
        await bookmark.applyBookmark('Bookmark 3');
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        since(
            'For BM3, the prompt answer for [Category] should be default values: #{expected}, instead we have #{actual}'
        )
            .expect(await promptEditor.checkListSummary('Category'))
            .toEqual('Electronics, Movies, Music');

        //cancel prompt editor
        await promptEditor.cancelEditor();
    });

    it('[TC56659] Bookmark -- Disable BM on RSD | Compatibility', async () => {
        // No BM for RSD
        await resetDossierState({
            credentials: browsers.params.credentials,
            dossier: document,
        });
        await libraryPage.openDossier(document.name);
        since('Bookmark icon is disabled for RSD')
            .expect(await bookmark.isBookmarkEnabled())
            .toBe(true);
    });
});
