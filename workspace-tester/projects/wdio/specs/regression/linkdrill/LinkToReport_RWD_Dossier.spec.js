import { customCredentials } from '../../../constants/index.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

const specConfiguration = { ...customCredentials('_LD') };
const specConfiguration_userWithNoPrivilege = { ...customCredentials('_noprivilege') };

describe('LinkToReport_RWD_Dossier', () => {
    const rsd = {
        id: '213E3FE24D8ED427B57DDA8046A3D1A0',
        name: 'Source_LinkToReport/RWD/Dossier',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const document2 = {
        id: '9B77C1A1417C359B687BBBBD51B78218',
        name: 'Source_LinkToReportWithDifferentGridModes',
    };

    // User without DS privilege
    const { credentials } = specConfiguration;
    const { credentials: userWithNoPrivilege } = specConfiguration_userWithNoPrivilege;

    let { loginPage, dossierPage, libraryPage, reportGrid, rsdGrid } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC66932] validate multiple links to different targets with default one on Library RSD', async () => {
        //tap link set default one to run report
        await libraryPage.openDossier(rsd.name);
        await dossierPage.waitForDossierLoading();
        await dossierPage.clickBtnByTitle('Link to Report/RWD/Dossier_DefaultLink');
        await reportGrid.waitForGridRendring();

        //link via context menu to run rwd
        await dossierPage.goBackFromDossierLink();
        await dossierPage.selectLinkFromContextMenu('Link to Report/RWD/Dossier_DefaultLink', 'RunRWD');
        await dossierPage.waitForDossierLoading();

        //link via context menu to run dossier
        await dossierPage.goBackFromDossierLink();
        await dossierPage.selectLinkFromContextMenu('Link to Report/RWD/Dossier_DefaultLink', 'RunDossier');
        await dossierPage.waitForDossierLoading();
    });

    it('[TC66933] validate multiple links to different targets without default one on Library RSD', async () => {
        // tap link without default set, product issue that it will use first one other than trigger context menu
        await libraryPage.openDossier(rsd.name);
        await dossierPage.waitForDossierLoading();
        await dossierPage.clickBtnByTitle('Link to Report/RWD/Dossier_NoDefaultLink');
        await reportGrid.waitForGridRendring();

        //link via context menu to run rwd
        await dossierPage.goBackFromDossierLink();
        await dossierPage.selectLinkFromContextMenu('Link to Report/RWD/Dossier_NoDefaultLink', 'RunRWD');
        await dossierPage.waitForDossierLoading();

        //link via context menu to run dossier
        await dossierPage.goBackFromDossierLink();
        await dossierPage.selectLinkFromContextMenu('Link to Report/RWD/Dossier_NoDefaultLink', 'RunDossier');
        await dossierPage.waitForDossierLoading();
    });

    it('[TC66634] Linking a text to any report containing "|" in the name on Library RSD', async () => {
        await libraryPage.openDossier(rsd.name);
        await dossierPage.waitForDossierLoading();
        await dossierPage.clickBtnByTitle('Link to Report with |_NewWindow');
        // switch to the new window page
        await dossierPage.switchToTab(1);
        since('The target grid data should be #{expected}, instead we have #{actual} ').expect(await reportGrid.getOneRowData(1)).toEqual(['USA', '$329,589', '$97,986']);
        // close the new page and go back to library page
        await dossierPage.closeTab(1);
    });

    it('[TC66640] Validate no extra characters for http/https urls on Library RSD', async () => {
        await libraryPage.openDossier(rsd.name);
        await dossierPage.waitForDossierLoading();
        await dossierPage.clickBtnByTitle('Link to https://www.baidu.com/');
        // switch to the new window page
        await dossierPage.switchToTab(1);
        since('The target url should be #{expected}, instead we have #{actual} ').expect(await browser.getUrl()).toBe('https://www.baidu.com/');
        // close the new page and go back to library page
        await dossierPage.closeTab(1);
    });

    it('[TC66656] Grid style is not broken when target is enabled incremental fetch on Library Web', async () => {
        //link drill to target with grid enable incremental fetch in same window
        await libraryPage.openDossier(rsd.name);
        await dossierPage.waitForDossierLoading();
        await dossierPage.clickBtnByTitle('Link to Target_IncrementalFetchEnabled_SameWindow');
        await dossierPage.waitForPageLoading();

        //scroll on grid
        let rsdGridTargetRWD = rsdGrid.getRsdGridByKey('K44');
        await rsdGridTargetRWD.scrollInGridToBottom();
        await dossierPage.waitForDossierLoading();
        //scroll back due to issue when reopen
        await rsdGridTargetRWD.scrollInGridToTop();

        //link drill to target with grid enable incremental fetch in new window
        await dossierPage.goBackFromDossierLink();
        await dossierPage.clickBtnByTitle('Link to Target_IncrementalFetchEnabled_NewWindow');
        // switch to the new window page
        await dossierPage.switchToTab(1);
        rsdGridTargetRWD = rsdGrid.getRsdGridByKey('K44');
        await rsdGridTargetRWD.scrollInGridToBottom();
        await dossierPage.waitForPageLoading();
        await rsdGridTargetRWD.scrollInGridToTop();
        // close the new page and go back to library page
        await dossierPage.closeTab(1);

        await dossierPage.clickBtnByTitle('Link to Target_IncrementalFetchDisabled_SameWindow');
        await dossierPage.waitForPageLoading();
        rsdGridTargetRWD = rsdGrid.getRsdGridByKey('K44');
        await rsdGridTargetRWD.scrollInGridToBottom();
        await dossierPage.waitForPageLoading();
        await rsdGridTargetRWD.scrollInGridToTop();

        //link drill to target with grid disable incremental fetch in new window
        await dossierPage.goBackFromDossierLink();
        await dossierPage.clickBtnByTitle('Link to Target_IncrementalFetchDisabled_NewWindow');
        // switch to the new window page
        await dossierPage.switchToTab(1);
        rsdGridTargetRWD = rsdGrid.getRsdGridByKey('K44');
        await rsdGridTargetRWD.scrollInGridToBottom();
        await dossierPage.waitForPageLoading();
        await rsdGridTargetRWD.scrollInGridToTop();
        // close the new page and go back to library page
        await dossierPage.closeTab(1);
    });

    it('[TC79728] Verify Edit links to report grid with different modes on Library RSD ', async () => {
        await libraryPage.openDossier(document2.name);

        // link to target report with different views via button text
        await dossierPage.clickBtnByTitle('Link to Report with Grid');
        await reportGrid.waitForGridRendring();
        await dossierPage.goBackFromDossierLink();

        await dossierPage.clickBtnByTitle('Link to Report with Graph');
        since('The target grid data should be #{expected}, instead we have #{actual} ').expect(await reportGrid.getGraphWarningMessage()).toEqual(
                'Graph view has been switched to grid. For graphs, create a dashboard to access an assortment of graph types.'
            );
        await dossierPage.goBackFromDossierLink();

        // due to product issue that report couldn't show grid&graph view on library web
        await dossierPage.clickBtnByTitle('Link to Report with Grid&Graph');
        await expect(await reportGrid.getGraphWarningMessage()).toEqual(
            'Graph view has been removed. For graphs, create a dashboard to access an assortment of graph types.'
        );
        await dossierPage.goBackFromDossierLink();

        // link to target report with different views via grid
        let sourceGrid = rsdGrid.getRsdGridByKey('W846332A90C134D4CA051951C9682CDCB');
        await sourceGrid.clickCell('Books');
        await reportGrid.waitForGridRendring();
        await dossierPage.goBackFromDossierLink();
        
        sourceGrid = rsdGrid.getRsdGridByKey('W846332A90C134D4CA051951C9682CDCB');
        await sourceGrid.clickCell('Business');
        await expect(await reportGrid.getGraphWarningMessage()).toEqual(
            'Graph view has been switched to grid. For graphs, create a dashboard to access an assortment of graph types.'
        );
        await dossierPage.goBackFromDossierLink();
        
        sourceGrid = rsdGrid.getRsdGridByKey('W846332A90C134D4CA051951C9682CDCB');
        await sourceGrid.clickCell('USA');
        await expect(await reportGrid.getGraphWarningMessage()).toEqual(
            'Graph view has been removed. For graphs, create a dashboard to access an assortment of graph types.'
        );
        await dossierPage.goBackFromDossierLink();
    });

    it('[TC79729] Verify links could not be opened when user did not have "drill and link" privilege on Library RSD', async () => {
        // switch to user with no DS privillege
        await libraryPage.switchUser(userWithNoPrivilege);
        await libraryPage.openDossier(rsd.name);

        // check the default link did not work
        await dossierPage.clickBtnByTitle('Link to Report/RWD/Dossier_DefaultLink');

        // check the context menu did not show
        const rsdButton = dossierPage.findButtonByText('Link to Report/RWD/Dossier_NoDefaultLink');
        await expect(await dossierPage.isButtonConntextMenuPresent('Link to Report/RWD/Dossier_NoDefaultLink')).toEqual(false);

        // restore user login credential
        await libraryPage.switchUser(credentials);
    });
});
export const config = specConfiguration;
