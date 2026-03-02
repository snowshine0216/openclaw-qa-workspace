import setWindowSize from '../../../config/setWindowSize.js';
import { browserWindow } from '../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import * as snapshotInfo from '../../../constants/snapshot.js';
import { snapshotErrorText } from '../../../constants/snapshot.js';
import resetUserLanguage from '../../../api/resetUserLanguage.js';
import setUserLanguage from '../../../api/setUserLanguage.js';
import urlParser from '../../../api/urlParser.js';
import { languageIdMap } from '../../../constants/bot.js';
import { mockSnapshotTimeStamp, mockSnapshotResult, mockResponseError } from '../../../api/mock/mock-response-utils.js';
import { mockApplicationSidebarSnapshot, mockApplicationTheme } from '../../../api/mock/mock-application.js';
import createSnapshots from '../../../api/snapshot/createSnapshots.js';
import clearUserSnapshots from '../../../api/snapshot/clearUserSnapshots.js';
import createSubscriptions from '../../../api/subscription/createSubscription.js';
import deleteBookmarkByName from '../../../api/deleteBookmarkByName.js';

describe('Test Snapshot Infow Window Manipulation', () => {
    let {
        loginPage,
        libraryPage,
        listView,
        listViewAGGrid,
        sidebar,
        contentDiscovery,
        quickSearch,
        fullSearch,
        subscribe,
    } = browsers.pageObj1;
    let messageIds = [];
    const baseUrl = urlParser(browser.options.baseUrl);
    const longText = 'a'.repeat(251);
    const inputText = 'a'.repeat(250);
    const dossiersFA = [...Array(11).fill(snapshotInfo.financialAnalysis)];
    const dossiersPrivilege = [snapshotInfo.visualVocabulary, snapshotInfo.PAAnalysis];
    const bookmarkName = 'bookmark';
    const requestPath = '**/api/v2/historyList**';
    const updateRequestPath = '**/api/historyList/**';

    const currentDateTime = new Date();
    const formattedDateTime = currentDateTime.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
    });

    beforeAll(async () => {
        await deleteBookmarkByName({
            credentials: snapshotInfo.snapshotInfoUser,
            dossier: snapshotInfo.officeRoyaleSales,
            name: bookmarkName,
        });
        await resetUserLanguage({ credentials: snapshotInfo.snapshotInfoUser });
        await clearUserSnapshots({
            credentials: [
                snapshotInfo.snapshotInfoUser,
                snapshotInfo.snapshotInfoPartUser,
                snapshotInfo.snapshotNoViewUser,
            ],
        });
        await loginPage.login(snapshotInfo.snapshotInfoUser);
        const dossiers = [
            snapshotInfo.callCenterManagement,
            snapshotInfo.humanResourceAnalysis,
            snapshotInfo.visualVocabulary,
            snapshotInfo.PAAnalysis,
            snapshotInfo.financialAnalysis,
            snapshotInfo.officeRoyaleSales,
        ];

        let messageId = await createSnapshots({
            credentials: snapshotInfo.snapshotInfoUser,
            dossiers: dossiers,
        });
        messageIds.push(...messageId);
    });

    beforeEach(async () => {
        await setWindowSize(browserWindow);
        await libraryPage.openDefaultApp();
        await libraryPage.openSidebarOnly();
        await libraryPage.sidebar.clickAllSection();
        await listView.deselectListViewMode();
        await resetUserLanguage({ credentials: snapshotInfo.snapshotInfoUser });
        await libraryPage.switchUser(snapshotInfo.snapshotInfoUser);
    });

    afterAll(async () => {
        await clearUserSnapshots({
            credentials: [
                snapshotInfo.snapshotInfoUser,
                snapshotInfo.snapshotInfoPartUser,
                snapshotInfo.snapshotNoViewUser,
            ],
        });
        await logoutFromCurrentBrowser();
    });

    it('[TC97797_01] When snapshot is disabled Snapshot should not show in infowindow', async () => {
        await mockApplicationSidebarSnapshot({});
        await libraryPage.reload();
        await libraryPage.openDossierInfoWindow(snapshotInfo.callCenterManagement.name);
        await since(
            'When snapshot is disabled in application settings, snapshot show up in infowindow should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.infoWindow.isSnapshotContentSectionPresent())
            .toBe(false);
    });

    it('[TC97797_02] Edit / Delete Snapshot', async () => {
        // await mockSnapshotTimeStamp({});
        // create current date to be like 04/08/2025 no hours

        await libraryPage.openDossierInfoWindow(snapshotInfo.callCenterManagement.name);
        await libraryPage.infoWindow.waitForSnapshotSection();
        await since('Snapshot header should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.infoWindow.getSnapshotsHeader())
            .toContain('Snapshots (1)');
        await since('Snapshot item count should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.infoWindow.getSnapshotItemCount())
            .toBe(1);
        await since('Snapshot date and time should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.infoWindow.getSnapshotDateTime())
            .toContain(formattedDateTime);
        await since('Snapshot title should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.infoWindow.getSnapshotTitleText({}))
            .toContain(snapshotInfo.callCenterManagement.name);
        await libraryPage.infoWindow.editSnapshotName({ text: ' ', save: false });
        await since('Error should be shown when snapshot name is empty, instead we have #{actual}')
            .expect(await libraryPage.infoWindow.getSnapshotErrorText())
            .toBe(snapshotErrorText.English.emptyNameError);
        await libraryPage.infoWindow.editSnapshotName({ text: 'New Name', save: true });
        await since('Snapshot name should be changed to #{expected}, instead we have #{actual}')
            .expect(await libraryPage.infoWindow.getSnapshotName({}))
            .toBe('New Name');
        await libraryPage.infoWindow.editSnapshotName({ text: inputText, save: true });
        await since('Snapshot name should be changed to #{expected}, instead we have #{actual}')
            .expect(await libraryPage.infoWindow.getSnapshotName({}))
            .toBe(inputText);
        // test hover to trigger tooltip
        // await libraryPage.infoWindow.hoverOnSnapshotItem({});
        // await since('Tooltip should be shown when hover on snapshot item, instead we have #{actual}')
        //     .expect(await libraryPage.infoWindow.getSnapshotTooltipText())
        //     .toBe(inputText);
        // await libraryPage.infoWindow.editSnapshotName({ text: longText, save: false });
        // await since('Error should be shown when snapshot name is too long, instead we have #{actual}')
        //     .expect(await libraryPage.infoWindow.getSnapshotErrorText())
        //     .toBe(snapshotErrorText.English.longNameError);
        // await libraryPage.infoWindow.clickSnapshotCancelButton({});
        await libraryPage.infoWindow.deleteSnapshot({});
        await since(
            'After snapshot is deleted,  snapshot show up in infowindow should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.infoWindow.isSnapshotContentSectionPresent())
            .toBe(false);
    });

    it('[TC97797_03] Edit / Delete Snapshot Error', async () => {
        await mockResponseError({ url: updateRequestPath, method: 'patch' });
        await mockResponseError({ url: updateRequestPath, method: 'delete' });
        await libraryPage.openDossierInfoWindow(snapshotInfo.humanResourceAnalysis.name);
        await libraryPage.infoWindow.waitForSnapshotSection();
        await libraryPage.infoWindow.editSnapshotName({ text: 'New Name' });
        await since(
            'After edit snapshot name with error, error message should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.infoWindow.getSnapshotErrorText())
            .toBe(snapshotErrorText.English.renameError);
        await libraryPage.infoWindow.deleteSnapshot({});
        await since('After delete snapshot with error, error message should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.infoWindow.getSnapshotErrorText())
            .toBe(snapshotErrorText.English.deleteError);
    });

    it('[TC97797_04] Get Snapshot Error', async () => {
        await mockResponseError({ url: requestPath, method: 'get' });
        await libraryPage.openDossierInfoWindow(snapshotInfo.visualVocabulary.name);
        await libraryPage.infoWindow.waitForSnapshotSection();
        await since('After get snapshot with error, error message should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.infoWindow.snapshot.getSnapshotListErrorText())
            .toBe(snapshotErrorText.English.getSnapshotsError);
    });

    it('[TC97797_05] Snapshot Infowindow Layout', async () => {
        await createSnapshots({
            credentials: snapshotInfo.snapshotInfoUser,
            dossiers: dossiersFA,
        });
        // Part 1: Test in Library Home Grid View
        await libraryPage.openDossierInfoWindow(snapshotInfo.financialAnalysis.name);
        await libraryPage.infoWindow.waitForSnapshotSection();
        // await libraryPage.infoWindow.scrollSnapshotPanelToBottom();
        await since(
            'After open snapshot info window in Library home grid view, the snapshot section header should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.infoWindow.getSnapshotsHeader())
            .toContain('Snapshots (12)');
        await since(
            'After open snapshot info window in Library home grid view, the snapshot item date and time should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.infoWindow.getSnapshotDateTime())
            .toContain(formattedDateTime);
        await since(
            'After open snapshot info window in Library home grid view, the snapshot item title should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.infoWindow.getSnapshotTitleText({}))
            .toContain(snapshotInfo.financialAnalysis.name);

        // Part 2: Test in Library Home List View
        await listView.selectListViewMode();
        await listViewAGGrid.clickExportPDFIconInGrid(snapshotInfo.financialAnalysis.name);
        await listViewAGGrid.clickBackArrow();
        await libraryPage.infoWindow.waitForSnapshotSection();
        await since(
            'After open snapshot info window in Library home list view, the snapshot section header should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.infoWindow.getSnapshotsHeader())
            .toContain('Snapshots (12)');
        await since(
            'After open snapshot info window in Library home list view, the snapshot item count should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.infoWindow.getSnapshotItemCount())
            .toBe(5);
        await since(
            'After open snapshot info window in Library home list view, the snapshot item date and time should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.infoWindow.getSnapshotDateTime())
            .toContain(formattedDateTime);
        await since(
            'After open snapshot info window in Library home grid view, the snapshot item title should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.infoWindow.getSnapshotTitleText({}))
            .toContain(snapshotInfo.financialAnalysis.name);
        await libraryPage.infoWindow.hoverOnSnapshotItem({});
        await since(
            'After open snapshot info window in Library home list vew by hovering on snapshot item, the snapshot section header should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.infoWindow.getSnapshotsHeader())
            .toContain('Snapshots (12)');
        await since(
            'After open snapshot info window in Library home list view by hovering on snapshot item, the snapshot item date and time should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.infoWindow.getSnapshotDateTime())
            .toContain(formattedDateTime);
        await since(
            'After open snapshot info window in Library home list view by hovering on snapshot item, the snapshot item title should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.infoWindow.getSnapshotTitleText({}))
            .toContain(snapshotInfo.financialAnalysis.name);
        const snapshotItemWidth = await libraryPage.infoWindow.snapshot.getSnapshotItemWidth({
            name: snapshotInfo.financialAnalysis.name,
        });
        // check snapshot item width >= 250px <= 300px
        const snapshotItemWidthInt = parseInt(snapshotItemWidth.replace('px', ''));
        const result = snapshotItemWidthInt >= 250 && snapshotItemWidthInt <= 300;
        console.log('snapshotItemWidthInt', snapshotItemWidthInt);
        await since(
            'After open snapshot info window in Library home list view by hovering on snapshot item, the snapshot item width should be #{expected}, instead we have #{actual}'
        )
            .expect(result)
            .toBe(true);
        await since(
            'After open snapshot info window in Library home list view by hovering on snapshot item, the snapshot item height should be #{expected}, instead we have #{actual}'
        )
            .expect(
                await libraryPage.infoWindow.snapshot.getSnapshotItemHeight({
                    name: snapshotInfo.financialAnalysis.name,
                })
            )
            .toBe('56px');
        await listView.clickCloseIcon();

        await listViewAGGrid.clickInfoWindowIconInGrid(snapshotInfo.financialAnalysis.name);
        await libraryPage.infoWindow.waitForSnapshotSection();
        await since(
            'After open snapshot info window in Library home list view by clicking on info window icon, the snapshot section header should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.infoWindow.getSnapshotsHeader())
            .toContain('Snapshots (12)');
        await since(
            'After open snapshot info window in Library home list view by clicking on info window icon, the snapshot item date and time should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.infoWindow.getSnapshotDateTime())
            .toContain(formattedDateTime);
        await since(
            'After open snapshot info window in Library home list view by clicking on info window icon, the snapshot item title should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.infoWindow.getSnapshotTitleText({}))
            .toContain(snapshotInfo.financialAnalysis.name);
        await libraryPage.infoWindow.editSnapshotName({ text: 'New Name' });
        await since(
            'After open snapshot info window in Library home list view by clicking on info window icon, the snapshot item title should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.infoWindow.getSnapshotTitleText({}))
            .toBe('New Name');
        await listView.clickCloseIcon();

        await listView.openContextMenu(snapshotInfo.financialAnalysis.name);
        await libraryPage.clickDossierContextMenuItem('Get Info');
        await libraryPage.infoWindow.waitForSnapshotSection();
        await since(
            'After open snapshot info window in Library home list view by clicking on Get Info context menu item, the snapshot section header should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.infoWindow.getSnapshotsHeader())
            .toContain('Snapshots (12)');
        await since(
            'After open snapshot info window in Library home list view by clicking on Get Info context menu item, the snapshot item date and time should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.infoWindow.getSnapshotDateTime())
            .toContain(formattedDateTime);
        await since(
            'After open snapshot info window in Library home list view by clicking on Get Info context menu item, the snapshot item title should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.infoWindow.getSnapshotTitleText({}))
            .toContain('New Name');
        await libraryPage.infoWindow.editSnapshotName({ index: 1, text: 'New Name' });
        await since(
            'After open snapshot info window in Library home list view by clicking on Get Info context menu item, the snapshot item title should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.infoWindow.getSnapshotTitleText({ index: 1 }))
            .toBe('New Name');
        // Part 3: Test in Content Discovery
        await sidebar.openContentDiscovery();
        await contentDiscovery.openProjectList();
        await contentDiscovery.selectProject(snapshotInfo.financialAnalysis.project.name);
        await contentDiscovery.openFolderByPath(['Shared Reports', '_Sample Dossiers']);
        await contentDiscovery.expandFolderByPath(['_Sample Dossiers']);
        await listViewAGGrid.clickSortBarColumn('Name', 'descending');
        await listViewAGGrid.clickExportPDFIconInGrid(snapshotInfo.visualVocabulary.name);
        await listView.clickBackArrow();
        await libraryPage.infoWindow.waitForSnapshotSection();

        await since(
            'After open snapshot info window in Content Discovery, the snapshot section header should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.infoWindow.getSnapshotsHeader())
            .toContain('Snapshots (1)');
        await since(
            'After open snapshot info window in Content Discovery, the snapshot item count should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.infoWindow.getSnapshotItemCount())
            .toBe(1);
        await since(
            'After open snapshot info window in Content Discovery, the snapshot item date and time should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.infoWindow.getSnapshotDateTime())
            .toContain(formattedDateTime);
        await since(
            'After open snapshot info window in Content Discovery, the snapshot item title should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.infoWindow.getSnapshotTitleText({}))
            .toContain(snapshotInfo.visualVocabulary.name);
        await libraryPage.infoWindow.hoverOnSnapshotItem({});
        await since(
            'After open snapshot info window in Content Discovery by hovering on snapshot item, the snapshot section header should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.infoWindow.getSnapshotsHeader())
            .toContain('Snapshots (1)');
        await since(
            'After open snapshot info window in Content Discovery by hovering on snapshot item, the snapshot item count should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.infoWindow.getSnapshotItemCount())
            .toBe(1);
        await since(
            'After open snapshot info window in Content Discovery by hovering on snapshot item, the snapshot item date and time should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.infoWindow.getSnapshotDateTime())
            .toContain(formattedDateTime);
        await since(
            'After open snapshot info window in Content Discovery by hovering on snapshot item, the snapshot item title should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.infoWindow.getSnapshotTitleText({}))
            .toContain(snapshotInfo.visualVocabulary.name);
        await libraryPage.infoWindow.editSnapshotName({ text: 'New Name' });
        await since(
            'After open snapshot info window in Content Discovery by hovering on snapshot item and editing snapshot name, the snapshot item title should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.infoWindow.getSnapshotTitleText({}))
            .toBe('New Name');
        await listView.clickCloseIcon();
        await listViewAGGrid.clickInfoWindowIconInGrid(snapshotInfo.visualVocabulary.name);
        await libraryPage.infoWindow.waitForSnapshotSection();
        await since(
            'After open snapshot info window in Content Discovery by clicking on info window icon, the snapshot section header should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.infoWindow.getSnapshotsHeader())
            .toContain('Snapshots (1)');
        await since(
            'After open snapshot info window in Content Discovery by clicking on info window icon, the snapshot item count should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.infoWindow.getSnapshotItemCount())
            .toBe(1);
        await since(
            'After open snapshot info window in Content Discovery by clicking on info window icon, the snapshot item date and time should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.infoWindow.getSnapshotDateTime())
            .toContain(formattedDateTime);
        await since(
            'After open snapshot info window in Content Discovery by clicking on info window icon, the snapshot item title should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.infoWindow.getSnapshotTitleText({}))
            .toContain('New Name');
        await libraryPage.infoWindow.editSnapshotName({ text: 'New Name1' });
        await since(
            'After open snapshot info window in Content Discovery after editing snapshot name, the snapshot item title should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.infoWindow.getSnapshotTitleText({}))
            .toContain('New Name1');
        await listView.clickCloseIcon();
        // await mockSnapshotTimeStamp({});
        await listView.openContextMenu(snapshotInfo.visualVocabulary.name);
        await libraryPage.clickDossierContextMenuItem('Get Info');
        await libraryPage.infoWindow.waitForSnapshotSection();
        await since(
            'After open snapshot info window in Content Discovery by clicking on Get Info context menu item, the snapshot section header should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.infoWindow.getSnapshotsHeader())
            .toContain('Snapshots (1)');
        await since(
            'After open snapshot info window in Content Discovery by clicking on Get Info context menu item, the snapshot item count should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.infoWindow.getSnapshotItemCount())
            .toBe(1);
        await since(
            'After open snapshot info window in Content Discovery by clicking on Get Info context menu item, the snapshot item date and time should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.infoWindow.getSnapshotDateTime())
            .toContain(formattedDateTime);
        await since(
            'After open snapshot info window in Content Discovery by clicking on Get Info context menu item, the snapshot item title should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.infoWindow.getSnapshotTitleText({}))
            .toContain('New Name1');

        // Part 4: Test in Quick Search
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(snapshotInfo.financialAnalysis.name);
        await fullSearch.waitForSearchLoading();
        await fullSearch.clickAllTab();
        await fullSearch.openInfoWindow(snapshotInfo.financialAnalysis.name);
        await libraryPage.infoWindow.waitForSnapshotSection();
        await since(
            'After open snapshot info window after searching for dossier, the snapshot section header should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.infoWindow.getSnapshotsHeader())
            .toContain('Snapshots (12)');
        await since(
            'After open snapshot info window after searching for dossier, the snapshot item date and time should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.infoWindow.getSnapshotDateTime())
            .toContain(formattedDateTime);
        await since(
            'After open snapshot info window after searching for dossier, the snapshot item title should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.infoWindow.getSnapshotTitleText({}))
            .toContain('New Name');
        await libraryPage.infoWindow.editSnapshotName({ text: 'New Name1' });
        await since(
            'After open snapshot info window after searching for dossier and editing snapshot name, the snapshot item title should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.infoWindow.getSnapshotTitleText({}))
            .toContain('New Name1');

        // Part 5: Test in Mobile View
        await setWindowSize(snapshotInfo.mobileWindow);
        await since(
            'After resize to mobile view, the snapshot item width should be #{expected}, instead we have #{actual}'
        )
            .expect(
                await libraryPage.infoWindow.snapshot.getSnapshotItemWidth({
                    name: snapshotInfo.financialAnalysis.name,
                })
            )
            .toBe('495px');
        await since(
            'After resize to mobile view, the snapshot item height should be #{expected}, instead we have #{actual}'
        )
            .expect(
                await libraryPage.infoWindow.snapshot.getSnapshotItemHeight({
                    name: snapshotInfo.financialAnalysis.name,
                })
            )
            .toBe('56px');
    });

    it('[TC97797_06] Snapshot Infowindow Result status', async () => {
        await mockSnapshotResult({});
        await libraryPage.openDossierInfoWindow(snapshotInfo.visualVocabulary.name);
        await since(
            'When snapshot requestStatus does not equal to result, snapshot show up in infowindow should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.infoWindow.isSnapshotContentSectionPresent())
            .toBe(true);
    });

    it('[TC97797_07] Snapshot Infowindow No Privilege', async () => {
        await createSnapshots({
            credentials: snapshotInfo.snapshotNoViewUser,
            dossiers: dossiersPrivilege,
        });
        await createSnapshots({
            credentials: snapshotInfo.snapshotInfoPartUser,
            dossiers: dossiersPrivilege,
        });
        await libraryPage.switchUser(snapshotInfo.snapshotNoViewUser);
        const output1 = await browser.mock(requestPath);
        await libraryPage.openDossierInfoWindow(snapshotInfo.visualVocabulary.name);
        await since(
            'For user has no view history list privilege for Tutorial project, number of historylist requests should be #{expected}, instead we have #{actual}'
        )
            .expect(output1.matches.length)
            .toBe(0);
        await libraryPage.infoWindow.close();
        const output2 = await browser.mock(requestPath);
        await libraryPage.openDossierInfoWindow(snapshotInfo.PAAnalysis.name);
        await since(
            'For user has no view history list privilege for Tutorial project, number of historylist requests should be #{expected}, instead we have #{actual}'
        )
            .expect(output2.matches.length)
            .toBe(0);
        await libraryPage.infoWindow.close();
        await libraryPage.switchUser(snapshotInfo.snapshotInfoPartUser);
        const output3 = await browser.mock(requestPath);
        await libraryPage.openDossierInfoWindow(snapshotInfo.visualVocabulary.name);
        await since(
            'For user has no view history list privilege for Tutorial project, number of historylist requests should be #{expected}, instead we have #{actual}'
        )
            .expect(output3.matches.length)
            .toBe(0);
        await libraryPage.infoWindow.close();
        const output4 = await browser.mock(requestPath);
        await libraryPage.openDossierInfoWindow(snapshotInfo.PAAnalysis.name);
        await since(
            'For user has view history list privilege for PA project, number of historylist requests should be #{expected}, instead we have #{actual}'
        )
            .expect(output4.matches.length)
            .toBe(1);
        await libraryPage.infoWindow.close();
    });

    it('[TC97797_08] Snapshot Infowindow i18n', async () => {
        await mockSnapshotTimeStamp({});
        await setUserLanguage({
            baseUrl,
            userId: snapshotInfo.snapshotInfoUser.id,
            adminCredentials: snapshotInfo.mstrUser,
            localeId: languageIdMap.ChineseSimplified,
        });
        await libraryPage.switchUser(snapshotInfo.snapshotInfoUser);
        await libraryPage.openDossierInfoWindow(snapshotInfo.visualVocabulary.name);
        await libraryPage.infoWindow.waitForSnapshotSection();
        const chineseDateTimeFormat = /\d{4}\/\d{2}\/\d{2}(\s\d{2}:\d{2})?/;
        await since(
            'After set user language to Chinese, the snapshot item date time should match format like 2025/08/10 or 2011/08/24 23:34, instead we have #{actual}'
        )
            .expect(await libraryPage.infoWindow.getSnapshotDateTime())
            .toMatch(chineseDateTimeFormat);
        await since(
            'After set user language to Chinese, the snapshot section header should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.infoWindow.getSnapshotsHeader())
            .toBe('快照 (1)');
        await mockResponseError({ url: updateRequestPath, method: 'patch' });
        await mockResponseError({ url: updateRequestPath, method: 'delete' });
        // await libraryPage.openDossierInfoWindow(snapshotInfo.financialAnalysis.name);
        await libraryPage.infoWindow.waitForSnapshotSection();
        await libraryPage.infoWindow.editSnapshotName({ text: '', save: false });
        await since(
            'After edit snapshot name with empty name, error message should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.infoWindow.getSnapshotErrorText())
            .toBe(snapshotErrorText.Chinese.emptyNameError);
        await libraryPage.infoWindow.editSnapshotName({ text: 'new', save: true });
        await since(
            'After edit snapshot name with empty name, error message should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.infoWindow.getSnapshotErrorText())
            .toBe(snapshotErrorText.Chinese.renameError);
        await libraryPage.infoWindow.deleteSnapshot({});
        await since(
            'After edit snapshot name with empty name, error message should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.infoWindow.getSnapshotErrorText())
            .toBe(snapshotErrorText.Chinese.deleteError);
        await libraryPage.infoWindow.editSnapshotName({ text: longText, save: false });
        await since(
            'After edit snapshot name with long name, error message should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.infoWindow.getSnapshotErrorText())
            .toBe(snapshotErrorText.Chinese.longNameError);
        await mockResponseError({ url: requestPath, method: 'get' });
        // close and open again
        // await libraryPage.openDossierInfoWindow(snapshotInfo.visualVocabulary.name);
        await libraryPage.infoWindow.close();
        await libraryPage.openDossierInfoWindow(snapshotInfo.campaignOverView.name);
        await libraryPage.infoWindow.waitForSnapshotSection();
        await since('After get snapshot with error, error message should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.infoWindow.snapshot.getSnapshotListErrorText())
            .toBe(snapshotErrorText.Chinese.getSnapshotsError);
    });

    it('[TC97797_09] Snapshot Infowindow color theme', async () => {
        await mockApplicationTheme({});
        // await mockSnapshotTimeStamp({});
        await libraryPage.reload();
        await libraryPage.openDossierInfoWindow(snapshotInfo.PAAnalysis.name);
        await libraryPage.infoWindow.waitForSnapshotSection();
        await since(
            'In dark theme, the background color of snapshot section should be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.infoWindow.snapshot.getSnapshotSectionBackgroundColor())
            .toBe('rgba(0,0,0,0)');
        await since(
            'In dark theme, the background color of snapshot item should be #{expected}, instead we have #{actual}.'
        )
            .expect(
                await libraryPage.infoWindow.snapshot.getSnapshotItemBackgroundColor({
                    name: snapshotInfo.PAAnalysis.name,
                })
            )
            .toBe('rgba(0,0,0,0)');
        await mockResponseError({ url: updateRequestPath, method: 'patch' });
        await mockResponseError({ url: updateRequestPath, method: 'delete' });
        await libraryPage.infoWindow.editSnapshotName({ text: ' ', save: false });
        await since(
            'After edit snapshot name with empty name, error message should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.infoWindow.getSnapshotErrorText())
            .toBe('Please enter a name.');
        await since(
            'After edit snapshot name with empty name, the snapshot background color should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.infoWindow.snapshot.getSnapshotSectionBackgroundColor())
            .toBe('rgba(0,0,0,0)');
        await libraryPage.infoWindow.editSnapshotName({ text: 'New Name', save: true });
        await since(
            'After edit snapshot name with long name, error message should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.infoWindow.getSnapshotErrorText())
            .toBe(snapshotErrorText.English.renameError);
        await since(
            'After edit snapshot name with long name, the snapshot background color should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.infoWindow.snapshot.getSnapshotSectionBackgroundColor())
            .toBe('rgba(0,0,0,0)');
        await libraryPage.infoWindow.editSnapshotName({ text: longText, save: false });
        await since(
            'After edit snapshot name with long name, error message should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.infoWindow.getSnapshotErrorText())
            .toBe(snapshotErrorText.English.longNameError);
        await since(
            'After edit snapshot name with long name, the snapshot background color should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.infoWindow.snapshot.getSnapshotSectionBackgroundColor())
            .toBe('rgba(0,0,0,0)');
        await mockResponseError({ url: requestPath, method: 'get' });
        // close and open again
        // await libraryPage.openDossierInfoWindow(snapshotInfo.visualVocabulary.name);
        await libraryPage.infoWindow.close();
        await libraryPage.openDossierInfoWindow(snapshotInfo.PAAnalysis.name);
        await libraryPage.infoWindow.waitForSnapshotSection();
        await since('After get snapshot with error, error message should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.infoWindow.snapshot.getSnapshotListErrorText())
            .toBe(snapshotErrorText.English.getSnapshotsError);
        await since(
            'After get snapshot with error, the snapshot background color should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.infoWindow.snapshot.getSnapshotSectionBackgroundColor())
            .toBe('rgba(0,0,0,0)');
    });

    it('[TC97797_10] Snapshot Infowindow trigger historyList API Test', async () => {
        // create subscription
        await createSubscriptions({
            credentials: snapshotInfo.snapshotInfoUser,
            dossier: snapshotInfo.officeRoyaleSales,
            bookmarkName: bookmarkName,
            recipient: snapshotInfo.snapshotInfoUser,
        });
        // test go back from manage subscripition menu
        await libraryPage.openDossierInfoWindow(snapshotInfo.officeRoyaleSales.name);
        const output1 = await browser.mock(requestPath);
        await libraryPage.infoWindow.clickManageSubscriptionsButton();
        await subscribe.exitInfoWindowPDFSettingsMenu();
        await libraryPage.infoWindow.clickManageSubscriptionsButton();
        await since(
            'After click exit manage subscription in info window, number of historylist requests should be #{expected}, instead we have #{actual}'
        )
            .expect(output1.matches.length)
            .toBe(1);
        // test go back from manage subscripition menu in list view
        await listView.selectListViewMode();
        const output2 = await browser.mock(requestPath);
        await listViewAGGrid.clickBackArrow();
        await listView.clickCloseIcon();
        await since(
            'After click exit manage subscription in info window in library list view, number of historylist requests should be #{expected}, instead we have #{actual}'
        )
            .expect(output2.matches.length)
            .toBe(1);

        // test click on another info window button to trigger historyList API
        await listView.deselectListViewMode();
        await libraryPage.openDossierInfoWindow(snapshotInfo.officeRoyaleSales.name);
        const output3 = await browser.mock(requestPath);
        await libraryPage.infoWindow.clickManageSubscriptionsButton();
        await libraryPage.openDossierInfoWindow(snapshotInfo.storePerformance.name);
        await since(
            'After expand manage subscription in info window and click another info window in library list view, number of historylist requests should be #{expected}, instead we have #{actual}'
        )
            .expect(output3.matches.length)
            .toBe(1);
    });
});
