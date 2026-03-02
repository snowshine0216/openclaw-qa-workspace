import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';
import { dossier } from '../../../constants/teams.js';

const specConfiguration = { ...customCredentials('_urllink') };

describe('URL Link - Open in new tab', () => {
    const tutorialProject = {
        id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
        name: 'MicroStrategy Tutorial',
    };
    const Dossier = {
        id: '1A96921D45F4158C4DB565B2E869C8B0',
        name: '(AUTO) URL Link_OpenInNewTab',
        project: tutorialProject,
    };

    const { credentials } = specConfiguration;

    let {
        dossierPage,
        toc,
        libraryPage,
        grid,
        textbox,
        imageContainer,
        loginPage,
        libraryAuthoringPage,
        dossierAuthoringPage,
        linkEditor,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
        await resetDossierState({
            credentials: credentials,
            dossier: Dossier,
        });
    });

    beforeEach(async () => {
        await libraryPage.openDossier(Dossier.name);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC97765_01]  Verify url links on dashboard - open in new window', async () => {

        // open in new tab for text/image url links
        await toc.openPageFromTocMenu({ chapterName: 'URL Links_New', pageName: 'Page' });
        // contexual link for open in new tab
        await textbox.navigateLinkByText('Text with contexual linking_open in new tab');
        await dossierPage.switchToTab(1);
        await toc.openPageFromTocMenu({ chapterName: 'pass filter: single filter', pageName: 'Page' });
        await dossierPage.closeTab(1);

        // contexual link for open in current tab
        await textbox.navigateLinkByText('Text with contextual linking_open in current tab');
        await dossierPage.goBackFromDossierLink();

        // url link for open in new tab
        await imageContainer.navigateLink(0);
        await dossierPage.switchToTab(1);
        since('The target url should be #{expected}, instead we have #{actual} ').expect(await browser.getUrl()).toBe('https://www.baidu.com/');
        await dossierPage.closeTab(1);

        // url link for open in current tab
        await imageContainer.navigateLink(1);
        since('The target url should be #{expected}, instead we have #{actual} ').expect(await browser.getUrl()).toBe('https://www.baidu.com/');
        await browser.url(browser.options.baseUrl);

        // grid url link for open in new tab
        await libraryPage.openDossier(Dossier.name);
        await grid.clickGridElementLink({
            title: 'linking to itself',
            headerName: 'Year(Link)_open in new tab',
            elementName: '2014',
        });
        await dossierPage.switchToTab(1);
        since('The target url should be #{expected}, instead we have #{actual} ').expect(await browser.getUrl()).toBe('https://www.baidu.com/');
        await dossierPage.closeTab(1);
        
        // grid url link for open in current tab
        await grid.clickGridElementLink({
            title: 'linking to itself',
            headerName: 'Category(Link)_open in current tab',
            elementName: 'Books',
        });
        since('The target url should be #{expected}, instead we have #{actual} ').expect(await browser.getUrl()).toBe('https://www.baidu.com/');
        await browser.url(browser.options.baseUrl);

    });

    it('[TC97765_02] Verify url links on dashboard - open in new window_link editor', async () => {

        // go into authoring mode
        await libraryAuthoringPage.editDossierFromLibrary();
        // link editor with dashboard set open in new tab 
        await textbox.openTextLinkEditor('Text with contexual linking_open in new tab');
        since('The selected tab should be #{expected}, instead we have #{actual} ').expect(await linkEditor.getSelectedTabName()).toBe('Dashboard');
        since('Open in new tab option in dashboard tab should be #{expected}, instead we have #{actual} ')
            .expect(await linkEditor.isDashboardOpenInNewTabCheckboxChecked()).toBe(true);
        // switch to url tab
        await linkEditor.selectTab('URL');
        since('Open in new tab option in url tab should be #{expected}, instead we have #{actual} ')
            .expect(await linkEditor.isURLOpenInNewTabCheckboxChecked()).toBe(true);
        // uncheck open in new tab in URL tab
        await linkEditor.selectURLOpenInNewTabCheckbox();
        
        // check open in new tab in dashboard tab
        await linkEditor.selectTab('Dashboard');
        since('Open in new tab option in dashboard tab should be #{expected}, instead we have #{actual} ')
            .expect(await linkEditor.isDashboardOpenInNewTabCheckboxChecked()).toBe(true);
        // switch back to url tab to check the change
        await linkEditor.selectTab('URL');
        since('Open in new tab option in url tab should be #{expected}, instead we have #{actual} ')
            .expect(await linkEditor.isURLOpenInNewTabCheckboxChecked()).toBe(false);
        // cancle and close the link editor
        await linkEditor.closeEditorWithoutSaving();
        
        // link editor with dashboard set open in current tab 
        await textbox.openTextLinkEditor('Text with contextual linking_open in current tab');
        since('The selected tab should be #{expected}, instead we have #{actual} ')
            .expect(await linkEditor.getSelectedTabName()).toBe('Dashboard');
        since('Open in new tab option in dashboard tab should be #{expected}, instead we have #{actual} ')
            .expect(await linkEditor.isDashboardOpenInNewTabCheckboxChecked()).toBe(false);
        // switch to url tab
        await linkEditor.selectTab('URL');
        since('Open in new tab option in url tab should be #{expected}, instead we have #{actual} ')
            .expect(await linkEditor.isURLOpenInNewTabCheckboxChecked()).toBe(true);
        // uncheck open in new tab in URL tab
        await linkEditor.selectURLOpenInNewTabCheckbox();
        
        // check open in new tab in dashboard tab
        await linkEditor.selectTab('Dashboard');
        since('Open in new tab option in dashboard tab should be #{expected}, instead we have #{actual} ')
            .expect(await linkEditor.isDashboardOpenInNewTabCheckboxChecked()).toBe(false);
        // switch back to url tab to check the change
        await linkEditor.selectTab('URL');
        since('Open in new tab option in url tab should be #{expected}, instead we have #{actual} ')
            .expect(await linkEditor.isURLOpenInNewTabCheckboxChecked()).toBe(false);
        // cancle and close the link editor
        await linkEditor.closeEditorWithoutSaving();

        // link editor with url set open in new tab 
        await imageContainer.openImageLinkEditor(0);
        since('The selected tab should be #{expected}, instead we have #{actual} ')
            .expect(await linkEditor.getSelectedTabName()).toBe('URL');
        since('Open in new tab option in dashboard tab should be #{expected}, instead we have #{actual} ')
            .expect(await linkEditor.isURLOpenInNewTabCheckboxChecked()).toBe(true);
        // switch to Dashboard tab
        await linkEditor.selectTab('Dashboard');
        since('Open in new tab option in url tab should be #{expected}, instead we have #{actual} ')
            .expect(await linkEditor.isDashboardOpenInNewTabDisplayed()).toBe(false);
        // uncheck open in new tab in URL tab
        await linkEditor.selectTab('URL');
        await linkEditor.selectURLOpenInNewTabCheckbox();
        
        // check open in new tab in dashboard tab
        await linkEditor.selectTab('Dashboard');
        since('Open in new tab option in url tab should be #{expected}, instead we have #{actual} ')
            .expect(await linkEditor.isDashboardOpenInNewTabDisplayed()).toBe(false);
        // switch back to url tab to check the change
        await linkEditor.selectTab('URL');
        since('Open in new tab option in url tab should be #{expected}, instead we have #{actual} ')
            .expect(await linkEditor.isURLOpenInNewTabCheckboxChecked()).toBe(false);
        // cancle and close the link editor
        await linkEditor.closeEditorWithoutSaving();
        
        // link editor with url set open in current tab 
        await imageContainer.openImageLinkEditor(1);
        since('The selected tab should be #{expected}, instead we have #{actual} ')
            .expect(await linkEditor.getSelectedTabName()).toBe('URL');
        since('Open in new tab option in dashboard tab should be #{expected}, instead we have #{actual} ')
            .expect(await linkEditor.isURLOpenInNewTabCheckboxChecked()).toBe(false);
        // switch to Dashboard tab
        await linkEditor.selectTab('Dashboard');
        since('Open in new tab option in url tab should be #{expected}, instead we have #{actual} ')
            .expect(await linkEditor.isDashboardOpenInNewTabDisplayed()).toBe(false);
        // uncheck open in new tab in URL tab
        await linkEditor.selectTab('URL');
        await linkEditor.selectURLOpenInNewTabCheckbox();
        
        // check open in new tab in dashboard tab
        await linkEditor.selectTab('Dashboard');
        since('Open in new tab option in url tab should be #{expected}, instead we have #{actual} ')
            .expect(await linkEditor.isDashboardOpenInNewTabDisplayed()).toBe(false);
        // switch back to url tab to check the change
        await linkEditor.selectTab('URL');
        since('Open in new tab option in url tab should be #{expected}, instead we have #{actual} ')
            .expect(await linkEditor.isURLOpenInNewTabCheckboxChecked()).toBe(true);
        // cancle and close the link editor
        await linkEditor.closeEditorWithoutSaving();
        await dossierAuthoringPage.clickCloseDossierButton();

    });

    it('[TC97765_03] Verify url links on dashboard - open in new window - upgrading case', async () => {

        // open in new tab for text/image url links
        await toc.openPageFromTocMenu({ chapterName: 'URL Links_Old', pageName: 'Page' });
        
        // url link created in previous
        await imageContainer.navigateLink(0);
        await dossierPage.switchToTab(1);
        since('The target url should be #{expected}, instead we have #{actual} ').expect(await browser.getUrl()).toBe('https://www.baidu.com/');
        await dossierPage.closeTab(1);

        // url link created in previous
        await textbox.navigateLinkByText('This is a text url link');
        await dossierPage.switchToTab(1);
        since('The target url should be #{expected}, instead we have #{actual} ').expect(await browser.getUrl()).toBe('https://www.baidu.com/');
        await dossierPage.closeTab(1);

        // grid url link created in previous
        await grid.clickGridElementLink({
            title: 'Visualization 1',
            headerName: 'Country(Link)',
            elementName: 'USA',
        });
        await dossierPage.switchToTab(1);
        since('The target url should be #{expected}, instead we have #{actual} ').expect(await browser.getUrl()).toBe('https://www.baidu.com/');
        await dossierPage.closeTab(1);
        

    });


    
});
export const config = specConfiguration;
