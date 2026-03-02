import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import setWindowSize from '../../../config/setWindowSize.js';
import deleteAllDataModelFavorites from '../../../api/dataModel/deleteAllDataModelFavorites.js';
import { deleteAllTags, renameUnstructuredData } from '../../../api/bot2/unstructuredDataAPI.js';
import resetCertify from '../../../api/resetCertify.js';
import * as bot from '../../../constants/bot2.js';
import deleteObjectByNames from '../../../api/folderManagement/deleteObjectByNames.js';
import {
    isFileNotEmpty,
    deleteFolderContents,
    findDownloadedFile,
    waitForFileToExist,
} from '../../../config/folderManagement.js';
import path from 'path';
import { fileURLToPath } from 'url';

describe('Bot 2.0 Unstructured Data Management', () => {
    const unstructure_txt = {
        id: 'EB7800EE25824EE5826E73DD08F9EF8C',
        name: 'AUTO_TXT',
        project: bot.project_applicationTeam.project,
    };
    const unstructure_pdf = {
        id: '8DABC8BBB7E94028B3BC2AFAA34D6715',
        name: 'AUTO_PDF',
        project: bot.project_applicationTeam.project,
    };
    const unstructure_docx = {
        id: '20ABD16964DC400393F526C4AD5A3F69',
        name: 'AUTO_DOCX',
        project: bot.project_applicationTeam.project,
    };
    const unstructure_eml = {
        id: 'BA5DBB4B69604A56BBCD7F86CDAA0545',
        name: 'AUTO_EML',
        project: bot.project_applicationTeam.project,
    };
    const unstructure_html = {
        id: '73B14F1FD50543C48204FA50CFDD38C8',
        name: 'AUTO_HTML',
        project: bot.project_applicationTeam.project,
    };
    const unstructure_md = {
        id: '025BEBCFA31F4AC19811043642245633',
        name: 'AUTO_MD',
        project: bot.project_applicationTeam.project,
    };
    // const unstructure_replace = {
    //     id: 'F908601A16FD406194F8E707C681B357',
    //     name: 'AUTO_Replace',
    //     project: bot.project_applicationTeam.project,
    // };
    const unstructure_adc = {
        id: '213A4CA3E84DFF224D652FA94EDC2F16',
        name: 'AUTO_Unstructure_Files',
        project: bot.project_applicationTeam.project,
    };
    const unstructure_rename = {
        id: 'F908601A16FD406194F8E707C681B357',
        name: 'AUTO_Rename',
        project: bot.project_applicationTeam.project,
    };
    const unstructure_folder = {
        name: 'Target Folder',
        path: ['Shared Reports', 'Bot2.0', 'Automation', 'Unstructure'],
    };
    const shortcutFolder = {
        name: 'Target Folder',
        path: ['My Reports', 'ShortcutFolder'],
        id: '34CEBF4C3E46BFA2DD2B578F6AE9E76C',
    };
    const moveToFolder = {
        name: 'Target Folder',
        path: ['My Reports', 'TargetMoveToFolder'],
        id: '0221505B1F4E23C41238AD95C2CC7683',
    };
    const newlyDataFolder = {
        name: 'Target Folder',
        path: ['My Reports', 'NewlyDataFolder'],
        id: 'B4173BC4EB4B3AC90F4AB2AFFE4ABDC6',
    };
    const browserWindow = {
        width: 1600,
        height: 1200,
    };
    const unstructure_RenamedName = unstructure_rename.name + new Date().getTime();
    const newADC = 'AUTO_Unstructured_ADC' + new Date().getTime();

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const downloadFolder = path.resolve(__dirname, '../../../downloads');

    let {
        libraryPage,
        listViewAGGrid,
        infoWindow,
        manageAccess,
        copyMoveWindow,
        sidebar,
        contentDiscovery,
        loginPage,
        listView,
        quickSearch,
        fullSearch,
        filterOnSearch,
        botAuthoring,
        libraryFilter,
        aibotChatPanel,
        adc,
        datasetsPanel,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(bot.unstructuredDataUser);
        await libraryPage.waitForLibraryLoading();
        // delete all favorites
        await deleteAllDataModelFavorites(bot.unstructuredDataUser);

        // delete tags for txt file
        await deleteAllTags({
            credentials: bot.unstructuredDataUser,
            projectId: bot.project_applicationTeam.id,
            unstructuredDataId: unstructure_txt.id,
        });

        // open data  page
        await libraryPage.openSidebarOnly();
        await sidebar.openDataSection();

        // filter data
        await filterByOwnByMe();
    });

    beforeEach(async () => {
        await libraryPage.resetToLibraryHome();
        await libraryPage.openSidebarOnly();
        await sidebar.openDataSection();
        await listView.deselectListViewMode();
    });

    afterAll(async () => {
        // delete all favorites
        await deleteAllDataModelFavorites(bot.unstructuredDataUser);
        const isCertified = await libraryPage.libraryItem.isItemCertified(unstructure_txt.name);
        // reset certify
        const testObjectsList = [unstructure_txt, unstructure_docx];
        for (const testObject of testObjectsList) {
            console.log('Reset certify for object: ' + testObject.name);
            if (isCertified) {
                await resetCertify({
                    dossier: testObject,
                    credentials: bot.unstructuredDataUser,
                    type: '55',
                    certify: false,
                });
                await libraryPage.refresh();
            }
        }

        // const parentFolderIdNamesMap = {
        //     // Delete temporary test objects from My Reports folder
        //     '24F17BADB948C34828F114BD3D793C1C': [newADC],
        //     // Delete temporary test objects from My Reports > ShortcutFolder folder
        //     [shortcutFolder.id]: [unstructure_docx.name],
        // };
        // for (const [parentFolderId, names] of Object.entries(parentFolderIdNamesMap)) {
        //     await deleteObjectByNames({
        //         credentials: bot.unstructuredDataUser,
        //         projectId: project.id,
        //         parentFolderId: parentFolderId,
        //         names: names,
        //     });
        // }
    });

    async function filterByOwnByMe() {
        await libraryPage.clickFilterIcon();
        await libraryFilter.openFilterDetailPanel('Owner');
        await libraryFilter.checkFilterType('Owned by me');
        await libraryFilter.clickApplyButton();
    }

    async function filterByType() {
        await libraryPage.clickFilterIcon();
        await libraryFilter.openFilterDetailPanel('Type');
        await libraryFilter.selectFilterDetailsPanelItem('Unstructured Data');
        await libraryFilter.clickApplyButton();
    }

    it('[TC99030_1] Unstructured -  Grid view and list view', async () => {
        //reset certify status in case unstable context menu screenshot
        const isCertified = await libraryPage.libraryItem.isItemCertified(unstructure_txt.name);
        if (isCertified) {
            await resetCertify({
                dossier: unstructure_txt,
                credentials: bot.unstructuredDataUser,
                type: '55',
                certify: false,
            });
            await libraryPage.refresh();
        }

        // grid view
        // context menu
        await libraryPage.openDossierContextMenu(unstructure_txt.name);
        await since(
            'Open context menu on grid view, context menu option count should be #{expected}, while we get #{actual}'
        )
            .expect(await libraryPage.getMenuContextItemCount())
            .toBe(13);
        await takeScreenshotByElement(
            libraryPage.getDossierContextMenu(),
            'unstructure_Manipulation',
            'gridView_ContextMenu'
        );
        // info window
        await libraryPage.clickDossierContextMenuItem('Get Info');
        await since('Open info window on grid view, action buttons count should be #{expected}, while we get #{actual}')
            .expect(await infoWindow.getActionButtonsCount())
            .toBe(5);
        await since('Open info window on grid view, tags present should be #{expected}, while we get #{actual}')
            .expect(await infoWindow.isTagsDisplayed())
            .toBe(true);
        await takeScreenshotByElement(infoWindow.getActionIcons(), 'unstructure_Manipulation', 'gridView_infoWindow');
        await takeScreenshotByElement(
            infoWindow.getTagsContainer(),
            'unstructure_Manipulation',
            'gridView_infoWindow_Tags'
        );
        await infoWindow.close();

        // switch to list view
        await listView.selectListViewMode();
        await listView.sleep(500);

        // context menu
        await listView.openContextMenu(unstructure_txt.name);
        await since(
            'Open context menu on list view, context menu option count should be #{expected}, while we get #{actual}'
        )
            .expect(await libraryPage.getMenuContextItemCount())
            .toBe(12);
        await takeScreenshotByElement(
            libraryPage.getDossierContextMenu(),
            'unstructure_Manipulation',
            'listView_ContextMenu'
        );
        //// info window
        await libraryPage.clickDossierContextMenuItem('Get Info');
        await libraryPage.sleep(500);
        await since('Open info window on list view, info window present should be #{expected}, while we get #{actual}')
            .expect(await listView.isListViewInfoWindowPresent())
            .toBe(true);
        await since('Open info window on list view, tags present should be #{expected}, while we get #{actual}')
            .expect(await listView.isTagsDisplayed())
            .toBe(true);
        await takeScreenshotByElement(listView.getItemShare(), 'unstructure_Manipulation', 'listView_infoWindow');
        await takeScreenshotByElement(
            listView.getTagsContainer(),
            'unstructure_Manipulation',
            'listView_infoWindow_Tags'
        );
        // multi-select
        await listView.selectItemInListView(unstructure_txt.name);
        await listView.selectItemInListView(unstructure_pdf.name);
        await listView.openContextMenu(unstructure_txt.name);
        await since(
            'Open context menu on list view in multi-select mode, context menu option count should be #{expected}, while we get #{actual}'
        )
            .expect(await libraryPage.getMenuContextItemCount())
            .toBe(2);
        await takeScreenshotByElement(
            libraryPage.getDossierContextMenu(),
            'unstructure_Manipulation',
            'multiSelect_listView_ContextMenu'
        );
        //// switch to grid view
        await listView.deselectListViewMode();
        await libraryPage.openDossierContextMenu(unstructure_txt.name);
        await since(
            'Open context menu on grid view in multi-select mode, context menu option count should be #{expected}, while we get #{actual}'
        )
            .expect(await libraryPage.getMenuContextItemCount())
            .toBe(2);
        await takeScreenshotByElement(
            libraryPage.getDossierContextMenu(),
            'unstructure_Manipulation',
            'multiSelect_ListView_ContextMenu'
        );
    });

    it('[TC99030_2] Unstructured -  Preview', async () => {
        const files_fromDataBlade = [
            { obj: unstructure_txt, type: 'txt' },
            { obj: unstructure_pdf, type: 'pdf' },
        ];
        for (const file of files_fromDataBlade) {
            await libraryPage.openDossier(unstructure_txt.name);
            await since(`preview ${file.type} and the tab count should be #{expected}, instead we have #{actual}`)
                .expect(await libraryPage.tabCount())
                .toBe(2);
            await aibotChatPanel.switchToTab(1);
            await aibotChatPanel.waitForCurtainDisappear();
            await since(`preview ${file.type} and error present should be #{expected}, instead we have #{actual}`)
                .expect(await libraryPage.isErrorPresent())
                .toBe(false);
            await aibotChatPanel.closeTab(1);
        }

        // Preview eml - from data blade
        await libraryPage.openDossierContextMenu(unstructure_eml.name);
        await libraryPage.clickDossierContextMenuItem('Preview');
        await libraryPage.sleep(500);
        await since('preview email and error present should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.isErrorPresent())
            .toBe(true);
        await libraryPage.showDetails();
        await since('error text should contain #{expected}, instead we have #{actual}')
            .expect(await libraryPage.errorDetails())
            .toContain('Previewing email files is not supported');
        await libraryPage.dismissError();

        const files_fromDADC = [
            { obj: unstructure_md, type: 'MD' },
            { obj: unstructure_html, type: 'htm' },
            { obj: unstructure_docx, type: 'docx' },
        ];
        await libraryPage.openDossier(unstructure_adc.name);
        for (const file of files_fromDADC) {
            await datasetsPanel.preview(unstructure_md.name);
            await since(`preview ${file.type} and the tab count should be #{expected}, instead we have #{actual}`)
                .expect(await libraryPage.tabCount())
                .toBe(2);
            await aibotChatPanel.switchToTab(1);
            await aibotChatPanel.waitForCurtainDisappear();
            await since(`preview ${file.type} and error present should be #{expected}, instead we have #{actual}`)
                .expect(await libraryPage.isErrorPresent())
                .toBe(false);
            await aibotChatPanel.closeTab(1);
        }
    });

    it('[TC99030_3] Unstructured -  Create ADC', async () => {
        // creat ADC
        await libraryPage.openDossierInfoWindow(unstructure_txt.name);
        await infoWindow.clickCreateADCButton();
        await since('Create ADC and error present should be #{expected}, while we get #{actual}')
            .expect(await adc.isErrorPresent())
            .toBe(false);
        await adc.saveToPath(newADC, null, 'My Reports');
        await adc.waitForCurtainDisappear();
        await adc.cancel();

        // delete newly created ADC
        await libraryPage.openDossierContextMenu(newADC);
        await libraryPage.clickDossierContextMenuItem('Delete');
        await libraryPage.confirmDelete();
    });

    it('[TC99030_4] Unstructured -  Download', async () => {
        // clear all the downloads
        await deleteFolderContents(downloadFolder);
        const filepath_txt = path.join(downloadFolder, `${unstructure_txt.name}.txt`);
        const filepath_html = path.join(downloadFolder, `${unstructure_html.name}.htm`);

        // download from context menu - txt
        await libraryPage.openDossierContextMenu(unstructure_txt.name);
        await libraryPage.clickDossierContextMenuItem('Download');
        await waitForFileToExist({
            name: unstructure_txt.name,
            fileType: '.txt',
            timeout: 5 * 60 * 1000,
        });
        await libraryPage.sleep(5000); // wait for download to start
        const downloadedFile1 = await findDownloadedFile({ name: '', fileType: '.txt' });
        await since(`The txt file for ${unstructure_txt.name} was downloaded`)
            .expect(await isFileNotEmpty({ name: downloadedFile1.name, fileType: '.txt' }))
            .toBe(true);

        // download from info window - html
        await libraryPage.openDossierInfoWindow(unstructure_html.name);
        await infoWindow.clickDownloadButton();
        await waitForFileToExist({
            name: unstructure_html.name,
            fileType: '.htm',
            timeout: 5 * 60 * 1000,
        });
        const downloadedFile2 = await findDownloadedFile({ name: '', fileType: '.htm' });
        await since(`The html file for ${unstructure_html.name} was downloaded`)
            .expect(await isFileNotEmpty({ name: downloadedFile2.name, fileType: '.htm' }))
            .toBe(true);
    });

    it('[TC99030_5] Unstructured -  Replace', async () => {});

    it('[TC99030_6] Unstructured -  Add tags', async () => {
        const tag_1 = {
            key: 'Auto_TagKey_Main',
            value: ['Tag1', 'Tag2'],
        };
        await deleteAllTags({
            credentials: bot.unstructuredDataUser,
            projectId: bot.project_applicationTeam.id,
            unstructuredDataId: unstructure_txt.id,
        });
        await filterByType();

        // add tag
        await libraryPage.openDossierInfoWindow(unstructure_txt.name);
        await infoWindow.addTag(tag_1.key, tag_1.value);
        await since('Add tag and tag count should be #{expected}, while we get #{actual}')
            .expect(await infoWindow.getTagsCount())
            .toBe(1);
        await infoWindow.saveTags();
        await since('Save tags and tag count should be #{expected}, while we get #{actual}')
            .expect(await infoWindow.getTagsCount())
            .toBe(1);
        await since('Add tag value and value count should be #{expected}, while we get #{actual}')
            .expect(await infoWindow.getTagKeyValuesCount(tag_1.key))
            .toBe(2);

        // delete tag
        await infoWindow.deleteTagValue(tag_1.key, tag_1.value[1]);
        await since('Delete tag value and value count should be #{expected}, while we get #{actual}')
            .expect(await infoWindow.getTagKeyValuesCount(tag_1.key))
            .toBe(1);
        await infoWindow.deleteTagKey(tag_1.key);
        await infoWindow.saveTags();
        await since('Delete tag and tag count should be #{expected}, while we get #{actual}')
            .expect(await infoWindow.getTagsCount())
            .toBe(0);
    });

    it('[TC99030_7] Unstructured -  Favorite', async () => {
        const dataCount = await libraryPage.getDataModelCountFromTitle();
        const favoriteCount = await libraryPage.getFavoritesCountFromTitle();
        // favorite by card
        await libraryPage.moveDossierIntoViewPort(unstructure_txt.name);
        await libraryPage.favoriteByImageIcon(unstructure_txt.name);
        await libraryPage.sleep(1000); // wait for static rendering
        await since('Favorite by card, the total favorites count should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.getFavoritesCountFromTitle())
            .toBe(favoriteCount + 1);
        await since('Favorite by card, the total data count should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.getDataModelCountFromTitle())
            .toBe(dataCount - 1);

        // favorite by info window
        await libraryPage.openDossierInfoWindow(unstructure_html.name);
        await infoWindow.favoriteData();
        await infoWindow.sleep(500); // wait for static rendering
        await since('Favorite by infowindow, the total favorites count should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.getFavoritesCountFromTitle())
            .toBe(favoriteCount + 2);
        await since('Favorite by infowindow, the total data count should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.getDataModelCountFromTitle())
            .toBe(dataCount - 2);

        // remove favorite by context menu in multi-select mode
        await libraryPage.clickMultiSelectBtn();
        await libraryPage.selectDossier(unstructure_txt.name);
        await libraryPage.selectDossier(unstructure_html.name);
        await libraryPage.openDossierContextMenu(unstructure_txt.name);
        await libraryPage.clickDossierContextMenuItem('Remove from Favorites');
        await since('remove favorite and  the total data count should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.getDataModelCountFromTitle())
            .toBe(dataCount);
        await since('Remove favorite and Favorites present should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.isFavoritesPresent())
            .toBe(false);
    });

    it('[TC99030_8] Unstructured -  Rename', async () => {
        // Prepare for renaming test
        await renameUnstructuredData({
            credentials: bot.unstructuredDataUser,
            projectId: bot.project_applicationTeam.id,
            unstructuredDataId: unstructure_rename.id,
            name: unstructure_rename.name,
        });
        await filterByOwnByMe();
        await libraryPage.refresh();

        // Rename unstructured data
        await libraryPage.openDossierContextMenu(unstructure_rename.name);
        await libraryPage.clickDossierContextMenuItem('Rename');
        await libraryPage.renameDossier(unstructure_RenamedName);
        await libraryPage.waitForItemLoading();
        await libraryPage.refresh();

        await since('New name present should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.isDossierPresent(unstructure_RenamedName))
            .toBe(true);
    });

    it('[TC99030_9] Unstructured -  Create Shortcut', async () => {
        const count = await libraryPage.getDataModelCountFromTitle();
        await libraryPage.openDossierContextMenu(unstructure_docx.name);

        // create shortcut
        await libraryPage.clickDossierContextMenuItem('Create Shortcut');
        await since('creat shortcut, window present should be #{expected}, while we get #{actual}')
            .expect(await copyMoveWindow.isWindowPrensent())
            .toBe(true);
        await copyMoveWindow.openFolderByPath(shortcutFolder.path);
        await copyMoveWindow.clickCreate();

        // open content discovery page
        await sidebar.openContentDiscovery();
        await contentDiscovery.openProjectList();
        await contentDiscovery.searchProject('tutorial');
        await contentDiscovery.selectProject(bot.project_applicationTeam.name);
        await contentDiscovery.openFolderByPath(shortcutFolder.path);
        // delete shortcut of adc
        await listView.openContextMenu(unstructure_docx.name);
        await listView.clickContextMenuItem('Delete');
        await libraryPage.confirmDelete();
        await since('delete shorcut ADC, error window present should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.isErrorPresent())
            .toBe(false);
    });

    it('[TC99030_10] Unstructured -  Manage access', async () => {
        // manage access
        await libraryPage.openDossierInfoWindow(unstructure_txt.name);

        // open manage access
        await infoWindow.openManageAccessDialog();
        await manageAccess.waitForManageAccessLoading();
        await since('open manage access, manage access window present should be #{expected}, while we get #{actual}')
            .expect(await manageAccess.isManageAccessPresent())
            .toBe(true);
        // clear dirty data
        const isExisted = await manageAccess.isUserACLExisted(bot.botUser3.username);
        if (isExisted) {
            await manageAccess.removeACL(bot.botUser3.username);
        }

        await takeScreenshotByElement(
            manageAccess.getManageAccessDialog(),
            'unstructure_Manipulation',
            'manageAccessWindow'
        );
        const acl_count = await manageAccess.getACLItemscount();

        // add acl
        await manageAccess.addACL([bot.botUser3.username], [], 'Can View');
        await since('add acl, acl items count should be #{expected}, while we get #{actual}')
            .expect(await manageAccess.getACLItemscount())
            .toBe(acl_count + 1);

        // delete acl
        await manageAccess.removeACL(bot.botUser3.username);
        await since('delete acl, acl items count should be #{expected}, while we get #{actual}')
            .expect(await manageAccess.getACLItemscount())
            .toBe(acl_count);

        await manageAccess.cancelManageAccessChange();
        await infoWindow.close();
    });

    it('[TC99030_11] Unstructured -  Certify', async () => {
        const isCertified = await libraryPage.libraryItem.isItemCertified(unstructure_docx.name);
        if (isCertified) {
            await resetCertify({
                dossier: unstructure_docx,
                credentials: bot.unstructuredDataUser,
                type: '55',
                certify: false,
            });
            await libraryPage.refresh();
        }

        // Certify
        await libraryPage.openDossierContextMenu(unstructure_docx.name);
        await since('On contenxt menu, Certify present should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.isItemDisplayedInContextMenu('Certify'))
            .toBe(true);
        await libraryPage.clickDossierContextMenuItem('Certify');
        await libraryPage.openDossierInfoWindow(unstructure_docx.name);
        await since('Certified, On info window, Certify present should be #{expected}, while we get #{actual}')
            .expect(await infoWindow.isCertifiedPresent())
            .toBe(true);
        await infoWindow.close();

        // decertify
        await libraryPage.openDossierContextMenu(unstructure_docx.name);
        await since('On contenxt menu, Decertify present should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.isItemDisplayedInContextMenu('Decertify'))
            .toBe(true);
        await libraryPage.clickDossierContextMenuItem('Decertify');
        await libraryPage.openDossierInfoWindow(unstructure_docx.name);
        await since('Decertified, On info window, Certify present should be #{expected}, while we get #{actual}')
            .expect(await infoWindow.isCertifiedPresent())
            .toBe(false);
        await infoWindow.close();
    });

    it('[TC99030_12] Unstructured -  Search and Filter', async () => {
        await deleteAllDataModelFavorites(bot.unstructuredDataUser);

        // Search results page
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch('auto');
        await fullSearch.waitForSearchLoading();
        await filterOnSearch.openSearchFilterPanel();
        await filterOnSearch.openFilterDetailPanel('Type');
        await since('Open info window on library search, ADC type exist should be #{expected}, while we get #{actual}')
            .expect(await filterOnSearch.isOptionPresentInCheckboxPanel('Unstructured Data'))
            .toBe(true);

        // Check unstructured filter results count
        const noFilterResultsCount = await fullSearch.getAllTabCount();
        await filterOnSearch.selectOptionInCheckbox('Unstructured Data');
        await filterOnSearch.applyFilterChanged();
        const filterResultsCount = await fullSearch.getAllTabCount();
        await since('Filter on search and the count should be #{expected}, while we get #{actual}')
            .expect(noFilterResultsCount - filterResultsCount)
            .toBeGreaterThan(0);

        // Open info window and create bot
        await fullSearch.openInfoWindow(unstructure_txt.name);
        await since('Open info window and tags present should be #{expected}, while we get #{actual}')
            .expect(await infoWindow.isTagsDisplayed())
            .toBe(true);
        await takeScreenshotByElement(infoWindow.getActionIcons(), 'unstructure_Manipulation', 'fullSearch_infoWindow');

        await infoWindow.clickCreateADCButton();
        await adc.waitForCurtainDisappear();
        await since('Create ADC and no error should be present #{expected}, while we get #{actual}')
            .expect(await adc.isErrorPresent())
            .toBe(false);
        await adc.cancel();
    });

    it('[TC99030_13] Unstructured -  Content Discovery', async () => {
        await sidebar.openContentDiscovery();
        await contentDiscovery.openProjectList();
        await contentDiscovery.searchProject('tutorial');
        await contentDiscovery.selectProject(bot.project_applicationTeam.name);
        await contentDiscovery.openFolderByPath(unstructure_folder.path);
        await listView.openContextMenu(unstructure_txt.name);
        await since(
            'Open context menu on list view and context menu option count should be #{expected}, while we get #{actual}'
        )
            .expect(await libraryPage.getMenuContextItemCount())
            .toBe(12);
        await takeScreenshotByElement(
            libraryPage.getDossierContextMenu(),
            'unstructure_Manipulation',
            'listView_ContextMenu'
        );

        // Open info window
        await listView.openInfoWindowFromListView(unstructure_txt.name);
        await since('Open info window and action icon count supposed to be #{expected}, instead we have #{actual}.')
            .expect(await listView.getInfoWindowActionCount())
            .toBe(6);
        await takeScreenshotByElement(
            listView.getItemShare(),
            'unstructure_Manipulation',
            'contentDiscovery_infoWindow',
            {
                tolerance: 0.12,
            }
        );
        // More
        await listView.clickMoreMenuFromIW();
        await since('Open info window and action icon count supposed to be #{expected}, instead we have #{actual}.')
            .expect(await listView.getInfoWindowMorActionAcount())
            .toBe(4);
        await takeScreenshotByElement(
            listView.getMoreOptiobDropDownInIW(),
            'unstructure_Manipulation',
            'contentDiscovery_infoWindow_more'
        );

        // Create bot from info window
        await listView.clickCreateADCFromIW();
        await adc.waitForCurtainDisappear();
        await adc.cancel();
    });
});
