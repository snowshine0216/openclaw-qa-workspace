import { customCredentials, browserWindow } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import copyObjects from '../../../api/folderManagement/copyObjects.js';
import deleteObjectByNames from '../../../api/folderManagement/deleteObjectByNames.js';
import getObjectID from '../../../api/folderManagement/getObjectID.js';
import InCanvasSelector from '../../../pageObjects/selector/InCanvasSelector.js';
import resetDossierState from '../../../api/resetDossierState.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

const specConfiguration = { ...customCredentials('_authoring') };

describe('Function test for Parameter Create Entry', () => {
    const { credentials } = specConfiguration;

    const project = {
        id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
        name: 'MicroStrategy Tutorial',
    };

    let {
        loginPage,
        libraryPage,
        dossierPage,
        datasetsPanel,
        parameterEditor,
        datasetDialog,
        dossierAuthoringPage,
        libraryAuthoringPage,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);
        await setWindowSize(browserWindow);
        await deleteObjectByNames({
            credentials: credentials,
            projectId: project.id,
            parentFolderId: '6C8A7071480729281CCA329620E7CFB9',
            names: ['(Auto) Unmanaged Dataset', '(Auto) Parameter Entry'],
        });
        await copyObjects({
            credentials: credentials,
            objectList: [
                {
                    type: 3,
                    id: 'EC346B6A4ABA2ADB9A570CB512183100',
                    projectId: project.id,
                    newName: '(Auto) Unmanaged Dataset',
                    targetFolderID: '6C8A7071480729281CCA329620E7CFB9',
                },
                {
                    type: 55,
                    id: 'FCBD43234B7AF74BAB67C2A8D6CB4AC1',
                    projectId: project.id,
                    newName: '(Auto) Parameter Entry',
                    targetFolderID: '6C8A7071480729281CCA329620E7CFB9',
                },
            ],
        });
        const objectID = await getObjectID({
            credentials: credentials,
            parentFolderId: '6C8A7071480729281CCA329620E7CFB9',
            name: '(Auto) Parameter Entry',
            projectId: project.id,
        });
        await libraryPage.editDossierByUrl({
            projectId: project.id,
            dossierId: objectID,
        });
        await dossierAuthoringPage.actionOnToolbar('Add Data');
        await dossierAuthoringPage.actionOnSubmenu('Existing Dataset...');
        await dossierAuthoringPage.searchSelectDataset('(Auto) Unmanaged Dataset');
        await dossierAuthoringPage.clickSaveDossierButton();
    });

    beforeEach(async () => {
        const objectID = await getObjectID({
            credentials: credentials,
            parentFolderId: '6C8A7071480729281CCA329620E7CFB9',
            name: '(Auto) Parameter Entry',
            projectId: project.id,
        });
        const pageKey = 'K53--K46';
        await libraryPage.editDossierWithPageKeyByUrl({
            projectId: project.id,
            dossierId: objectID,
            pageKey: pageKey,
        });
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC99133_01] Verify Functionality of Parameter Entry - Create Parameter', async () => {
        await datasetsPanel.clickCreateObjectsBtn('Managed Dataset');
        await datasetsPanel.clickMenuOptions({ firstOption: 'Parameter', secondOption: 'Element List' });
        await parameterEditor.createElementListParameter(
            'Element List',
            'This is a Dataset Element List Parameter',
            'Year'
        );
        await datasetDialog.clickUpdateDatasetBtn();

        await datasetsPanel.executeScript('dossierConfig.features.objectParameter = { "enabled": true }');
        await datasetsPanel.clickCreateObjectsBtn('Dashboard Parameters');
        await datasetsPanel.clickMenuOptions({ firstOption: 'Object' });
        await parameterEditor.createDashboardObjectParameter({
            name: 'Dashboard Object Parameter',
            description: 'This is a dashboard Metric Object Parameter',
            objectList: ['Revenue', 'Profit'],
        });
    });

    it('[TC99133_02] Verify Functionality of Parameter Entry - Keep Changes Locale', async () => {
        await datasetsPanel.clickDatasetMenuIcon('Managed Dataset');
        await datasetsPanel.clickMenuOptions({ firstOption: 'Edit Dataset...' });
        await since('Keep Changes Local checkbox should be #{expected}, instead we have #{actual}')
            .expect(await datasetDialog.isKeepChangesLocalContainerPresent())
            .toBe(false);
        await datasetDialog.clickCancelBtn();

        await datasetsPanel.clickDatasetMenuIcon('(Auto) Unmanaged Dataset');
        await datasetsPanel.clickMenuOptions({ firstOption: 'Edit Dataset...' });
        await since('Keep Changes Local checkbox should be #{expected}, instead we have #{actual}')
            .expect(await datasetDialog.isKeepChangesLocalContainerPresent())
            .toBe(true);
        await datasetDialog.hoverOnCancelBtn();
        await takeScreenshotByElement(
            datasetDialog.getDatasetDialog(),
            'TC99133_02',
            'Parameter Entry - Keep Changes Local'
        );
        await datasetDialog.clickCreateParameterBtn('Value');
        await parameterEditor.createValueParameter('Value', 'This is a Value Parameter', 'Text', 'User Input');
        await datasetDialog.clickUpdateDatasetBtn();
        await datasetDialog.clickNotificationWarningBtn('Update Dataset');

        await datasetsPanel.clickDatasetMenuIcon('(Auto) Unmanaged Dataset');
        await datasetsPanel.clickMenuOptions({ firstOption: 'Edit Dataset...' });
        await datasetDialog.removeObjectFromList('Cost');
        await datasetDialog.checkKeepChangesLocalCheckbox();
        await datasetDialog.clickUpdateDatasetBtn();
        await dossierAuthoringPage.clickSaveDossierButton();

        await dossierAuthoringPage.goToLibrary();
        await libraryAuthoringPage.createBlankDashboard();
        await takeScreenshotByElement(datasetsPanel.getDatasetsPanel(), 'TC99133_02', 'Parameter Entry - No Dataset');
        await dossierAuthoringPage.actionOnToolbar('Add Data');
        await dossierAuthoringPage.actionOnSubmenu('Existing Dataset...');
        await dossierAuthoringPage.searchSelectDataset('(Auto) Unmanaged Dataset');
        await since('Metric element count should be #{expected}, instead we have #{actual}')
            .expect(await datasetsPanel.getElementCountByType('Metric'))
            .toBe(4);
        await since('Metric element count should be #{expected}, instead we have #{actual}')
            .expect(await dossierAuthoringPage.isDatasetElementPresent('Value'))
            .toBe(true);
    });
});
