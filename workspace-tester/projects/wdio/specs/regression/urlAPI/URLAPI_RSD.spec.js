import setWindowSize from '../../../config/setWindowSize.js';
import { customCredentials, downloadDirectory } from '../../../constants/index.js';
import path from 'path';
import { waitForFileExists, deleteFile } from '../../../utils/compareImage.js';
import '../../../utils/toMatchPdf.ts';
import CheckBox from '../../../pageObjects/selector/CheckBox.js';

const specConfiguration = { ...customCredentials('_urlapi') };

describe('Url API Pass in RSD', () => {
    const sourceDashboard = {
        id: 'A0FB836D41BCD69D60C47F8E9FDA49D0',
        name: 'Source_Dashboard_Automation',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const rsdExportToPDF = {
        id: '4B96AC264D94A9822D8A1BABF9BE06E1',
        name: 'Target_Document'
    };

    const dashboardExportToPDF = {
        id: '827D018E4236A58984C056AB2860CE6C',
        name: 'Target_Dashboard'
    };

    const { credentials } = specConfiguration;

    let {
        loginPage,
        dossierPage,
        libraryPage,
        promptObject,
        promptEditor,
        toc,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);
        await setWindowSize({
            width: 1000,
            height: 800,
        });
    });

    afterEach(async () => {
        await browser.url(browser.options.baseUrl);
        await dossierPage.waitForDossierLoading();
    });

    it('[TC94178_03] Url API Pass promptsAnswerXML', async () => {
        // do links
        await libraryPage.openDossier(sourceDashboard.name);
        await dossierPage.waitForDossierLoading();
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'DashBoard default' });

        // pass promptAnswerXML and check prompt answers -- Library URL link
        await dossierPage.clickTextfieldByTitle('Library + promptsAnswerXML');
        await dossierPage.switchToTab(1);
        // The Category prompt is not answered because the promptAnswerXML not include it
        since('Library URL: total prompts should be #{expected}, while we get #{actual}')
            .expect(await promptObject.getPromptsNumber())
            .toBe(1);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        // The Year prompt from the source should be 2014, 2015, 2016
        since('Library URL: Year Prompt from the source should be #{expected}, while we get #{actual}')
            .expect(await promptEditor.checkListSummaryByIndex(0))
            .toEqual('2014, 2015, 2016');
        await dossierPage.closeCurrentTab();
        await dossierPage.switchToTab(0);

        // pass promptAnswerXML and check prompt answers -- Web URL link
        await dossierPage.clickTextfieldByTitle('MSTRWeb + promptsAnswerXML');
        await dossierPage.switchToTab(1);
        // The Category prompt is not answered because the promptAnswerXML not include it
        since('Web URL: total prompts should be #{expected}, while we get #{actual}')
            .expect(await promptObject.getPromptsNumber())
            .toBe(1);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        // The Year prompt from the source should be 2014, 2015, 2016
        since('Web URL: Year Prompt from the source should be #{expected}, while we get #{actual}')
            .expect(await promptEditor.checkListSummaryByIndex(0))
            .toEqual('2014, 2015, 2016');
        await dossierPage.closeCurrentTab();
        await dossierPage.switchToTab(0);

        // pass promptAnswerXML -- Open in this tab
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'DashBoard Open In This Tab' });
        await dossierPage.clickTextfieldByTitle('Library + promptsAnswerXML');
        // The Category prompt is not answered because the promptAnswerXML not include it
        since('Open in this tab: total prompts should be #{expected}, while we get #{actual}')
            .expect(await promptObject.getPromptsNumber())
            .toBe(1);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        // The Year prompt from the source should be 2014, 2015, 2016
        since('Open in this tab: Year Prompt from the source should be #{expected}, while we get #{actual}')
            .expect(await promptEditor.checkListSummaryByIndex(0))
            .toEqual('2014, 2015, 2016');
    });

    it('[TC94178_04] Url API Pass promptsAnswerXML and export', async () => {
        // do links
        await libraryPage.openDossier(sourceDashboard.name);
        await dossierPage.waitForDossierLoading();

        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'DashBoard Export default' });

        // pass promptAnswerXML and check prompt answers -- Library URL link
        await dossierPage.clickTextfieldByTitle('Library + promptsAnswerXML');
        await dossierPage.switchToTab(1);
        await promptEditor.run();

        const filepath = path.join(downloadDirectory, `${dashboardExportToPDF.name}.pdf`);
        await waitForFileExists(filepath, 30000);
        const baselineDirectory = path.join(process.cwd(), 'resources');
        await expect(filepath).toMatchPdf(path.join(baselineDirectory, `${dashboardExportToPDF.name}_promptsAnswerXML.pdf`));
        await deleteFile({
            name: dashboardExportToPDF.name,
            fileType: '.pdf',
        });
    })

    it('[TC94178_05] Url API Pass in RSD with Library URL', async () => {
        // do links
        await libraryPage.openDossier(sourceDashboard.name);
        await dossierPage.waitForDossierLoading();
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Document default' });

        // pass originMessageID and selectorMode(0)
        await dossierPage.clickTextfieldByTitle('Library + originMessageID + selectorMode(0)');
        await dossierPage.waitForDossierLoading();
        await dossierPage.switchToTab(1);
        // The Category prompt is not answered because the source not include it
        since('Library URL: total prompts should be #{expected}, while we get #{actual}')
            .expect(await promptObject.getPromptsNumber())
            .toBe(1);
        
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();

        let checkbox = new CheckBox()
        since('Category selector value after pass selector by ID should be #{expected}, while we get #{actual} ')
            .expect(await checkbox.getSelectedItemsText())
            .toEqual(['Books', 'Movies', 'Music']);
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        // The Year prompt from the source should be 2014, 2015, 2016
        since('Library URL: Year Prompt from the source should be #{expected}, while we get #{actual}')
            .expect(await promptEditor.checkListSummaryByIndex(0))
            .toEqual('2014, 2015, 2016');
        await dossierPage.closeCurrentTab();
        await dossierPage.switchToTab(0);
    });

    it('[TC94178_06] Url API Pass in RSD with MSTRWeb URL', async () => {
        await libraryPage.openDossier(sourceDashboard.name);
        await dossierPage.waitForDossierLoading();
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Document default' });

        // pass originMessageID and selectorMode(0)
        await dossierPage.clickTextfieldByTitle('MSTRWeb + originMessageID + promptAnswerMode(1) + selectorMode(1)');
        await dossierPage.waitForDossierLoading();
        await dossierPage.switchToTab(1);

        let checkbox = new CheckBox()
        since('Category selector value after pass selector by ID should be #{expected}, while we get #{actual} ')
            .expect(await checkbox.getSelectedItemsText())
            .toEqual(['Movies', 'Music']);
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        // The Year prompt from the source should be 2014, 2015, 2016
        since('MSTRWeb URL: Year Prompt from the source should be #{expected}, while we get #{actual}')
            .expect(await promptEditor.checkListSummaryByIndex(0))
            .toEqual('2014, 2015, 2016');
        since('MSTRWeb URL: Category Prompt use the default answers should be #{expected}, while we get #{actual}')
            .expect(await promptEditor.checkListSummaryByIndex(1))
            .toEqual('Music, Books, Electronics, Movies');
        await dossierPage.closeCurrentTab();
        await dossierPage.switchToTab(0);
    });

    it('[TC94178_07] Url API Pass in RSD with Library URL Open in This Tab', async () => {
        await libraryPage.openDossier(sourceDashboard.name);
        await dossierPage.waitForDossierLoading();
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Document Open in This Tab' });

        await dossierPage.clickTextfieldByTitle('Library + promptsAnswerXML');
        await dossierPage.waitForDossierLoading();

        // The Category prompt is not answered because the promptAnswerXML not include it
        since('Open in this tab: total prompts should be #{expected}, while we get #{actual}')
            .expect(await promptObject.getPromptsNumber())
            .toBe(1);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        // The Year prompt from the source should be 2014, 2015, 2016
        since('Open in this tab: Year Prompt from the source should be #{expected}, while we get #{actual}')
            .expect(await promptEditor.checkListSummaryByIndex(0))
            .toEqual('2014, 2015, 2016');
    });

    it('[TC94178_08] Url API Export with RSD', async () => {
        await libraryPage.openDossier(sourceDashboard.name);
        await dossierPage.waitForDossierLoading();
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Document Export default' });

        await dossierPage.clickTextfieldByTitle('Library + originMessageID + promptAnswerMode(1)');
        
        const filepath = path.join(downloadDirectory, `${rsdExportToPDF.name}.pdf`);
        await waitForFileExists(filepath, 30000);
        const baselineDirectory = path.join(process.cwd(), 'resources');
        await expect(filepath).toMatchPdf(path.join(baselineDirectory, `${rsdExportToPDF.name}_URLAPI_RSD_Export.pdf`));
        await deleteFile({
            name: rsdExportToPDF.name,
            fileType: '.pdf',
        });
    });

    it('[TC94178_09] Url API Export with GridKey', async () => {
        // do links
        await libraryPage.openDossier(sourceDashboard.name);
        await dossierPage.waitForDossierLoading();
        
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Export with gridKey' });

        // pass promptAnswerXML and check prompt answers -- Library URL link
        await dossierPage.clickTextfieldByTitle('Export with gridKey(K52)');
    
        const filepath = path.join(downloadDirectory, `${dashboardExportToPDF.name}.pdf`);
        await waitForFileExists(filepath, 30000);
        const baselineDirectory = path.join(process.cwd(), 'resources');
        await expect(filepath).toMatchPdf(path.join(baselineDirectory, `${dashboardExportToPDF.name}_Visualization(K52).pdf`));
        await deleteFile({
            name: `${dashboardExportToPDF.name}.pdf`,
            fileType: '.pdf',
        });
    });
});

export const config = specConfiguration;