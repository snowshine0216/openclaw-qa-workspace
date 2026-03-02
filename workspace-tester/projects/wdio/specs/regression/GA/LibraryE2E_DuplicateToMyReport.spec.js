import resetDossierState from '../../../api/resetDossierState.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import deleteObjectsByFolder  from '../../../api/folderManagement/deleteObjectsByFolder.js';
import { customCredentials } from '../../../constants/index.js';
import resetReportState from '../../../api/reports/resetReportState.js';

const specConfiguration = { ...customCredentials('_personal') };

describe('Library E2E_ duplicate to my personal folder', () => {
    const dossier = {
        id: '90FDE5DB4B9CD092B5443CA07C150E24',
        name: 'E2E_Dashboard without prompt',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };
    
    const document = {
        id: 'EAE41AE24D0C5C2A8E5C1F86598FDEBA',
        name: 'E2E_RWD without prompt',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    

    const report = {
        id: '5965FBC84453F446815927A163CA9DFF',
        name: 'E2E_DS Report',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    let {
        loginPage,
        libraryPage,
        dossierPage,
        promptObject,
        libraryAuthoringPage,
        sidebar,
        contentDiscovery,
        listViewAGGrid,
    } = browsers.pageObj1;
    const customAppIdOfShowContentDiscovery = 'A44AFBF7D6A648FB83438C4FB43170F3';
    const { credentials } = specConfiguration;
    
    beforeAll(async () => {
        await loginPage.login(credentials);
        await libraryPage.openCustomAppById({ id: customAppIdOfShowContentDiscovery });
    });

    beforeEach(async () => {
         // delete all objects for my folder
         await deleteObjectsByFolder({
            credentials: credentials,
            parentFolderId: '57CB713E4720D770F5585E82559EDBF6',
            projectId: dossier.project.id,
        });
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
        await libraryPage.openUserAccountMenu();
        await libraryPage.logout();
        await libraryPage.executeScript('window.localStorage.clear();');
        await loginPage.login(credentials);
    });

    it('[TC98195_11] Verify AI consumer user duplicate report/rwd/dashboard to my personal folder on library web', async () => {
        // reset all objects
        await resetDossierState({
            credentials: credentials,
            dossier: dossier,
        });

        await resetDossierState({
            credentials: credentials,
            dossier: document,
        });

        await resetReportState({
            credentials: credentials,
            report: report,
        });



        // duplicate dossier
        await libraryPage.openDossier(dossier.name, 'Xueli Yi');
        await dossierPage.clickDuplicateButton();

        // check save as dialog
        since('Defalt selection in save as dialog should be #{expected}, instead we have #{actual}')
            .expect(await libraryAuthoringPage.getSaveInFolderSelectionText()).toBe('My Reports');
        since ('Dropdown options in save as dialog should be #{expected}, instead we have #{actual}')
            .expect(await libraryAuthoringPage.getSaveInFolderDropdownOptionsText()).toEqual(['My Reports']);
        since ('New Folder button display for dossier in save as dialog should be #{expected}, instead we have #{actual}')
            .expect(await libraryAuthoringPage.isNewFolderButtonDisplayed()).toBe(false);
        await takeScreenshotByElement(await libraryAuthoringPage.getSaveAsEditor(), 'TC98195','Duplicate Dialog_AIUser' );
        await libraryAuthoringPage.saveInMyReport(dossier.name);
        since('Add to library banner display should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isAddToLibraryDisplayed()).toBe(false);
        await dossierPage.goToLibrary();
        
        // duplicate rwd
        await libraryPage.openDossier(document.name, 'Xueli Yi');
        await dossierPage.clickDuplicateButton();

        // check save as dialog
        since('Defalt selection in save as dialog should be #{expected}, instead we have #{actual}')
            .expect(await libraryAuthoringPage.getSaveInFolderSelectionText()).toBe('My Reports');
        since ('Dropdown options in save as dialog should be #{expected}, instead we have #{actual}')
            .expect(await libraryAuthoringPage.getSaveInFolderDropdownOptionsText()).toEqual(['My Reports']);
        since ('New Folder button display for rwd in save as dialog should be #{expected}, instead we have #{actual}')
            .expect(await libraryAuthoringPage.isNewFolderButtonDisplayed()).toBe(false);
        await libraryAuthoringPage.saveInMyReport(document.name);
        since('Add to library banner display should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isAddToLibraryDisplayed()).toBe(false);
        await dossierPage.goToLibrary();

        // duplicate report
        await libraryPage.openDossier(report.name);
        await dossierPage.clickDuplicateButton();

        // check save as dialog
        since('Defalt selection in save as dialog should be #{expected}, instead we have #{actual}')
            .expect(await libraryAuthoringPage.getSaveInFolderSelectionText()).toBe('My Reports');
        since ('Dropdown options in save as dialog should be #{expected}, instead we have #{actual}')
            .expect(await libraryAuthoringPage.getSaveInFolderDropdownOptionsText()).toEqual(['My Reports']);
        since ('New Folder button display in save as dialog should be #{expected}, instead we have #{actual}')
            .expect(await libraryAuthoringPage.isNewFolderButtonDisplayed()).toBe(false);
        await libraryAuthoringPage.saveInMyReport(report.name);
        await dossierPage.goToLibrary();
        
            
        // check My Reports folder
        await libraryPage.openSidebarOnly();
        await sidebar.openContentDiscovery();
        await contentDiscovery.openFolderByPath(['My Reports']);
        since('Dossier count in my reports folder should be #{expected}, instead we have #{actual}')
            .expect(await listViewAGGrid.getAGGridItemCount()).toBe(3);

    });
});
export const config = specConfiguration;