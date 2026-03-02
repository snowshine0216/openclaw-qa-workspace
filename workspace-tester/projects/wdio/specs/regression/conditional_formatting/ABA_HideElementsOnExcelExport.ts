import { noExecuteUser } from '../../../constants/bot.js';
import { checkElementByImageComparison } from '../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import resetDossierState from '../../../api/resetDossierState.js';
import { waitForFileExists } from '../../../utils/compareImage.js';
import path from 'path';
import { reverse } from 'dns';
export const downloadDirectory = (() => path.join(process.cwd(), 'downloads'))();
import { ExpressionType, FunctionName, UnitType } from '../../../pageObjects/library/authoring/utils/model.js'
import loginPage from '../../../pageObjects/library/authoring/library.login.page.js'
import consumptionPage from '../../../pageObjects/library/authoring/library.consumption.page.js'
import authoringPage from '../../../pageObjects/library/authoring/library.authoring.page.js'
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('LibraryExport - Check Hide Export on Excel Function for Elements in Dashboard', () => {
    let {
        loginPage,
        libraryPage,
        share,
        infoWindow,
        dossierPage,
        excelExportPanel,
        librarySearch,
        fullSearch,
        listView,
        toc,
        hamburgerMenu,
        libraryAuthoringPage,
    } = browsers.pageObj1;

    const dossier_hideElementsOnExcel_01 = {
        id: '3660AB8747A4FF5AC647BFB1FDB87299',
        name: 'hideElementsOnExcel_01',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dossier_hideElementsOnExcel_02 = {
        id: 'D665F0E4405A74E57B7A7B8653565B4A',
        name: 'hideElementsOnExcel_01',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dossier_hideElementsOnExcel_03 = {
        id: '9422D2144EB3BC63FBE33BA8D7F0124C',
        name: 'hideElementsOnExcel_01',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    beforeAll(async () => {
        await browser.setWindowSize(1600, 1200);
        await loginPage.login({username: 'auto_cf', password: 'newman1#'});
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });


    it('[TC00001] Check Set hide on excel export function for single element', async () => {
         await libraryPage.openUrl(dossier_hideElementsOnExcel_01.project.id, dossier_hideElementsOnExcel_01.id);
         await libraryAuthoringPage.editDossierFromLibrary();
         await authoringPage.openContextMenuInLayerPanel('NormalText');
         const contextMenuElement = await authoringPage.getContextMenuInLayerPanel();
         await takeScreenshotByElement(contextMenuElement,'TC00001', 'contextMenu', {tolerance: 0.3});
         await authoringPage.clickHideOnExcelExportItem();
         await authoringPage.openContextMenuInLayerPanel('RichText');
         await authoringPage.clickHideOnExcelExportItem();
         await authoringPage.openContextMenuInLayerPanel('Image');
         await authoringPage.clickHideOnExcelExportItem();
         await authoringPage.openContextMenuInLayerPanel('Rectangle');
         await authoringPage.clickHideOnExcelExportItem();
         await authoringPage.openContextMenuInLayerPanel('HTMLContainer');
         await authoringPage.clickHideOnExcelExportItem();
         await authoringPage.openContextMenuInLayerPanel('Filter');
         await authoringPage.clickHideOnExcelExportItem();
         await authoringPage.openContextMenuInLayerPanel('PanelSelector');
         await authoringPage.clickHideOnExcelExportItem();
         await authoringPage.openContextMenuInLayerPanel('PanelStack');
         await authoringPage.clickHideOnExcelExportItem();
         await authoringPage.openContextMenuInLayerPanel('Group');
         await authoringPage.clickHideOnExcelExportItem();
         const layersPanel_setted = await authoringPage.getLayersPanel();
         await takeScreenshotByElement(layersPanel_setted,'TC00001', 'layersPanel_setted', {tolerance: 0.3});
         await authoringPage.saveDossier();
         await libraryPage.openUrl(dossier_hideElementsOnExcel_01.project.id, dossier_hideElementsOnExcel_01.id);
         await libraryAuthoringPage.editDossierFromLibrary();
         const layersPanel_saved = await authoringPage.getLayersPanel();
         await takeScreenshotByElement(layersPanel_saved,'TC00001', 'layersPanel_saved', {tolerance: 0.3});
         
    });

    it('[TC00002] Set hide on excel export function for group elements', async () => {
         await libraryPage.openUrl(dossier_hideElementsOnExcel_02.project.id, dossier_hideElementsOnExcel_02.id);
         await libraryAuthoringPage.editDossierFromLibrary();
         await authoringPage.openContextMenuInLayerPanel('Group');
         const contextMenuElement = await authoringPage.getContextMenuInLayerPanel();
         await takeScreenshotByElement(contextMenuElement,'TC00002', 'contextMenu', {tolerance: 0.3});
         await authoringPage.clickHideOnExcelExportItem();
         await authoringPage.openContextMenuInLayerPanel('PanelStack');
         await authoringPage.clickHideOnExcelExportItem();
         const layersPanel_setted = await authoringPage.getLayersPanel();
         await takeScreenshotByElement(layersPanel_setted,'TC00002', 'layersPanel_setted', {tolerance: 0.3});
         await authoringPage.saveDossier();
         await libraryPage.openUrl(dossier_hideElementsOnExcel_02.project.id, dossier_hideElementsOnExcel_02.id);
         await libraryAuthoringPage.editDossierFromLibrary();
         const layersPanel_saved = await authoringPage.getLayersPanel();
         await takeScreenshotByElement(layersPanel_saved,'TC00002', 'layersPanel_saved', {tolerance: 0.3});
    });
    
    it('[TC00003] Check hide on excel export function for multi-select elements', async () => {
        await libraryPage.openUrl(dossier_hideElementsOnExcel_03.project.id, dossier_hideElementsOnExcel_03.id);
        await libraryAuthoringPage.editDossierFromLibrary();
        const el1 = await authoringPage.getLayersPanelElement('Image');
        const el2 = await authoringPage.getLayersPanelElement('RichText');
        const el3 = await authoringPage.getLayersPanelElement('Filter');
        const el4 = await authoringPage.getLayersPanelElement('HTMLContainer');
        const el5 = await authoringPage.getLayersPanelElement('Rectangle');
        const el6 = await authoringPage.getLayersPanelElement('PanelStack');
        await authoringPage.reactCtrlRightClick(el1, el2);
        const contextMenu1 = await authoringPage.getContextMenuInLayerPanel();
        await takeScreenshotByElement(contextMenu1,'TC00003', 'contextMenuForGroup1', {tolerance: 0.3});
        await authoringPage.clickHideOnExcelExportItem();
        const layersPanel1 = await authoringPage.getLayersPanel();
        await takeScreenshotByElement(layersPanel1,'TC00003', 'layersPanel1', {tolerance: 0.3});
        await authoringPage.reactCtrlRightClick(el1, el3, el4);
        const contextMenu2 = await authoringPage.getContextMenuInLayerPanel();
        await takeScreenshotByElement(contextMenu2,'TC00003', 'contextMenuForGroup2', {tolerance: 0.3});
        await authoringPage.clickHideOnExcelExportItem();
        const layersPanel2 = await authoringPage.getLayersPanel();
        await takeScreenshotByElement(layersPanel2,'TC00003', 'layersPanel2', {tolerance: 0.3});
        await authoringPage.reactCtrlRightClick(el5, el6);
        const contextMenu3 = await authoringPage.getContextMenuInLayerPanel();
        await takeScreenshotByElement(contextMenu3,'TC00003', 'contextMenuForGroup3', {tolerance: 0.3});
        await authoringPage.clickShowOnExcelExportItem();
        const layersPanel_setted = await authoringPage.getLayersPanel();
        await takeScreenshotByElement(layersPanel_setted,'TC00003', 'layersPanel_setted', {tolerance: 0.3});
        await authoringPage.saveDossier();
        await libraryPage.openUrl(dossier_hideElementsOnExcel_03.project.id, dossier_hideElementsOnExcel_03.id);
        await libraryAuthoringPage.editDossierFromLibrary();
        const layersPanel_saved = await authoringPage.getLayersPanel();
        await takeScreenshotByElement(layersPanel_saved,'TC00003', 'layersPanel_saved', {tolerance: 0.3});

    });
    
    
});