import { customCredentials } from '../../../constants/index.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import setWindowSize from '../../../config/setWindowSize.js';
import resetDossierState from '../../../api/resetDossierState.js';

const specConfiguration = { ...customCredentials('_linking') };

describe('External Link on SaaS', () => {
    const project = {
        id: '69D4DA35264BAA98CC2BF68356064C35',
        name: 'MicroStrategy Tutorial',
    };
    const dashboard_textLink = {
        id: 'C33BD73C7D436B14520A0BA15F45A7A0',
        name: '(AUTO) ExternalLink_DashboardText',
        project,
    };
    const dashboard_gridLink = {
        id: '1A4E032BBB4E7F804A918BA1A88B5721',
        name: '(AUTO) ExternalLink_DashboardGrid',
        project,
    };
    const aibot_link = {
        id: '4E903D864447AFE6CE4C0C99CC18CA1D',
        name: '(AUTO) ExternalLink_AIBot',
        project,
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    const { credentials } = specConfiguration;

    let {
        loginPage,
        dossierPage,
        libraryPage,
        saasExternalLinkDialog,
        toc,
        textbox,
        imageContainer,
        grid,
        aibotChatPanel,
        userAccount,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(specConfiguration.credentials);
        await libraryPage.executeScript('window.pendo?.stopGuides();');
        await libraryPage.waitForLibraryLoading();
    });

    beforeEach(async () => {
        await dossierPage.goToLibrary();

        const handles = await dossierPage.getBrowserTabs();
        // sometimes undefined returned
        if (handles) {
            if (handles.length > 1) {
                for (let i = 1; i < handles.length; i++) {
                    await dossierPage.switchToTab(handles[i]);
                    await dossierPage.closeTab();
                }
            }
        }
    });

    afterAll(async () => {
        await libraryPage.executeScript('window.localStorage.clear();');
        await libraryPage.executeScript('window.sessionStorage.clear();');
        await browser.deleteCookies();
    });

    it('[TC94364_01] Verify external link popup dialogue general funciton ', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dashboard_textLink,
        });
        await libraryPage.openDossier(dashboard_textLink.name);

        // external link dialogue
        await toc.openPageFromTocMenu({ chapterName: 'Linking outside mstr', pageName: 'Text linking' });
        await textbox.navigateLink(0);
        await since('Link to external link, the popup present should be #{expected}, instead we have #{actual}')
            .expect(await saasExternalLinkDialog.isExternalLinkBoxPresent())
            .toBe(true);

        await since('Popop external link diaogue, the browsers tab should be #{expected}, instead we have #{actual} ')
            .expect((await dossierPage.getBrowserTabs()).length)
            .toBe(1);
        await takeScreenshotByElement(
            saasExternalLinkDialog.getExternalLinkErrorBox(),
            'TC94364_01',
            'SaaS_ExternalLink',
            {
                tolerance: 0.1,
            }
        );

        // stay here
        await saasExternalLinkDialog.stayHere();
        await since('Click stay here, the popup present should be #{expected}, instead we have #{actual}')
            .expect(await saasExternalLinkDialog.isExternalLinkBoxPresent())
            .toBe(false);
        await since('Click stay here, the browsers tab should be #{expected}, instead we have #{actual} ')
            .expect((await dossierPage.getBrowserTabs()).length)
            .toBe(1);

        // open link
        await textbox.navigateLink(0);
        await since('Open text link again, the popup present should be #{expected}, instead we have #{actual}')
            .expect(await saasExternalLinkDialog.isExternalLinkBoxPresent())
            .toBe(true);
        await saasExternalLinkDialog.openLink();
        await since('Click open link, the browsers tab should be #{expected}, instead we have #{actual} ')
            .expect((await dossierPage.getBrowserTabs()).length)
            .toBe(2);
        await dossierPage.closeTab(1);
        await since('Click open link, the popup present should be #{expected}, instead we have #{actual}')
            .expect(await saasExternalLinkDialog.isExternalLinkBoxPresent())
            .toBe(false);
    });

    it('[TC94364_02] Verify different types of external link on dashboard text/image ', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dashboard_textLink,
        });
        await libraryPage.openDossier(dashboard_textLink.name);

        // http URL: same saas site but with different protocal + port
        await toc.openPageFromTocMenu({ chapterName: 'Linking outside mstr', pageName: 'Text linking' });
        await textbox.navigateLink(1);
        await since(
            'Link to same saas site but diff port, the popup present should be #{expected}, instead we have #{actual}'
        )
            .expect(await saasExternalLinkDialog.isExternalLinkBoxPresent())
            .toBe(true);
        await saasExternalLinkDialog.stayHere();

        // http URL: external site (timage)
        await toc.openPageFromTocMenu({ chapterName: 'Linking outside mstr', pageName: 'Image linking' });
        await imageContainer.navigateLinkInCurrentPage(0);
        await since('Link to external site, the popup present should be #{expected}, instead we have #{actual}')
            .expect(await saasExternalLinkDialog.isExternalLinkBoxPresent())
            .toBe(true);
        await saasExternalLinkDialog.stayHere();

        // maito URL
        await toc.openPageFromTocMenu({ chapterName: 'Linking outside mstr', pageName: 'Linking types' });
        await textbox.navigateLink(0);
        await since('Link to non-http url:mailto, the popup present should be #{expected}, instead we have #{actual}')
            .expect(await saasExternalLinkDialog.isExternalLinkBoxPresent())
            .toBe(true);
        await saasExternalLinkDialog.stayHere();

        // ftp URL
        await textbox.navigateLink(1);
        await since('Link to non-http url:tel, the popup present should be #{expected}, instead we have #{actual}')
            .expect(await saasExternalLinkDialog.isExternalLinkBoxPresent())
            .toBe(true);
        await saasExternalLinkDialog.stayHere();

        // data URL
        await textbox.navigateLink(2);
        await since('Link to non-http url:data, the popup present should be #{expected}, instead we have #{actual}')
            .expect(await saasExternalLinkDialog.isExternalLinkBoxPresent())
            .toBe(true);
        await saasExternalLinkDialog.stayHere();
    });

    it('[TC94364_03] Verify different types of external link on dashboard grid ', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dashboard_gridLink,
        });
        await libraryPage.openDossier(dashboard_gridLink.name);

        // normal grid
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Normal Grid' });
        await grid.clickGridElementLink({
            title: 'Visualization 1',
            headerName: 'URL',
            elementName: 'https://www.google.com',
        });
        await since('Link from normal grid, the popup present should be #{expected}, instead we have #{actual}')
            .expect(await saasExternalLinkDialog.isExternalLinkBoxPresent())
            .toBe(true);
        await saasExternalLinkDialog.stayHere();

        // compund grid
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Compund Grid' });
        await grid.clickGridElementLink({
            title: 'Visualization 2',
            headerName: 'Phone Number(Link)',
            elementName: '18067981332',
        });
        await since('Link from compund grid, the popup present should be #{expected}, instead we have #{actual}')
            .expect(await saasExternalLinkDialog.isExternalLinkBoxPresent())
            .toBe(true);
        await saasExternalLinkDialog.stayHere();

        // ag grid
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'AG Grid' });
        await grid.clickGridElementLink({
            title: 'Visualization 2',
            headerName: 'Email(Link)',
            elementName: 'xyi@microstrategy.com',
            agGrid: true,
        });
        await since('Link from ag grid, the popup present should be #{expected}, instead we have #{actual}')
            .expect(await saasExternalLinkDialog.isExternalLinkBoxPresent())
            .toBe(true);
        await saasExternalLinkDialog.openLink();
        await since('Link from ag grid, open link, the browsers tab should be #{expected}, instead we have #{actual} ')
            .expect((await dossierPage.getBrowserTabs()).length)
            .toBe(2);
        await dossierPage.closeTab(1);
    });

    it('[TC94364_04] Verify different types of external link on aibot ', async () => {
        await libraryPage.openDossier(aibot_link.name);

        await aibotChatPanel.clickExternalLinkByText('Google');
        await since('Link Google from aibot, the popup present should be #{expected}, instead we have #{actual}')
            .expect(await saasExternalLinkDialog.isExternalLinkBoxPresent())
            .toBe(true);
        await saasExternalLinkDialog.stayHere();

        await aibotChatPanel.clickExternalLinkByText('Bing');
        await since('Link Bing from aibot, the popup present should be #{expected}, instead we have #{actual}')
            .expect(await saasExternalLinkDialog.isExternalLinkBoxPresent())
            .toBe(true);
        await saasExternalLinkDialog.openLink();
        await since('open link, the browsers tab should be #{expected}, instead we have #{actual} ')
            .expect((await dossierPage.getBrowserTabs()).length)
            .toBe(2);
        await dossierPage.closeTab(1);
        await since('close new tab, the popup present should be #{expected}, instead we have #{actual}')
            .expect(await saasExternalLinkDialog.isExternalLinkBoxPresent())
            .toBe(false);
    });

    it('[TC94364_05] Verify pendo and help link is able to open directly ', async () => {
        // helper link
        await libraryPage.openUserAccountMenu();
        await userAccount.clickAccountOption('Help');
        await since('Help link, the popup present should be #{expected}, instead we have #{actual}')
            .expect(await saasExternalLinkDialog.isExternalLinkBoxPresent())
            .toBe(false);
        await since('Help: url api, the browsers tab should be #{expected}, instead we have #{actual} ')
            .expect((await dossierPage.getBrowserTabs()).length)
            .toBe(2);
        await dossierPage.closeTab(1);

        // pendo link
        await libraryPage.openDossier(dashboard_textLink.name);
        await toc.openPageFromTocMenu({ chapterName: 'Pendo link', pageName: 'Pendo' });
        await textbox.navigateLink(0);
        await since('Pendo link, the popup present should be #{expected}, instead we have #{actual}')
            .expect(await saasExternalLinkDialog.isExternalLinkBoxPresent())
            .toBe(false);
        await since('Pendo link, the browsers tab should be #{expected}, instead we have #{actual} ')
            .expect((await dossierPage.getBrowserTabs()).length)
            .toBe(2);
        await dossierPage.closeTab(1);
    });

    it('[TC94364_06] Verify internal link on text and grid is able to open directly ', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dashboard_textLink,
        });
        await libraryPage.openDossier(dashboard_textLink.name);

        // page key
        await toc.openPageFromTocMenu({ chapterName: 'Linking within saas', pageName: 'URL API' });
        await textbox.navigateLink(0);
        await since('Internal link: url api, the popup present should be #{expected}, instead we have #{actual}')
            .expect(await saasExternalLinkDialog.isExternalLinkBoxPresent())
            .toBe(false);
        await since('Internal link: url api, the browsers tab should be #{expected}, instead we have #{actual} ')
            .expect((await dossierPage.getBrowserTabs()).length)
            .toBe(2);
        await dossierPage.closeTab(1);

        // contextual linking - image
        await toc.openPageFromTocMenu({ chapterName: 'Linking within saas', pageName: 'Text/Image contexual linking' });
        await imageContainer.navigateLinkInCurrentPage(0);
        await since('Image contextual linking, the popup present should be #{expected}, instead we have #{actual}')
            .expect(await saasExternalLinkDialog.isExternalLinkBoxPresent())
            .toBe(false);
        await dossierPage.goBackFromDossierLink();

        // contexual linking - grid
        await toc.openPageFromTocMenu({ chapterName: 'Linking within saas', pageName: 'Grid/Viz contexual linking' });
        await grid.linkToTargetByGridContextMenu({
            title: 'open in new tab',
            headerName: 'Year',
        });
        await since('Grid contextual linking, the popup present should be #{expected}, instead we have #{actual}')
            .expect(await saasExternalLinkDialog.isExternalLinkBoxPresent())
            .toBe(false);
        await since('Grid contextual linking, the browsers tab should be #{expected}, instead we have #{actual} ')
            .expect((await dossierPage.getBrowserTabs()).length)
            .toBe(2);
        await dossierPage.closeTab(1);
    });

    it('[TC94364_07] Verify external link popup setting - do not warn me about external site', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dashboard_textLink,
        });
        await libraryPage.openDossier(dashboard_textLink.name);
        await toc.openPageFromTocMenu({ chapterName: 'Linking outside mstr', pageName: 'Image linking' });
        await dossierPage.sleep(1000);
        await imageContainer.navigateLinkInCurrentPage(0);
        await since('Link to external link, the popup present should be #{expected}, instead we have #{actual}')
            .expect(await saasExternalLinkDialog.isExternalLinkBoxPresent())
            .toBe(true);
        await saasExternalLinkDialog.selectDontWarnMeAgain();
        await saasExternalLinkDialog.stayHere();

        // check setting - same object
        await imageContainer.navigateLinkInCurrentPage(0);
        await since(
            'Select dont warn me, open dabshboard, the popup present should be #{expected}, instead we have #{actual}'
        )
            .expect(await saasExternalLinkDialog.isExternalLinkBoxPresent())
            .toBe(false);
        await since(
            'Select dont warn me, open dabshboard,the browsers tab should be #{expected}, instead we have #{actual} '
        )
            .expect((await dossierPage.getBrowserTabs()).length)
            .toBe(2);
        await dossierPage.closeTab(1);
        await dossierPage.goToLibrary();

        // check setting - different object(bot)
        await libraryPage.openDossier(aibot_link.name);
        await aibotChatPanel.clickExternalLinkByText('Bing');
        await since('Select dont warn me, open bot, the popup present should be #{expected}, instead we have #{actual}')
            .expect(await saasExternalLinkDialog.isExternalLinkBoxPresent())
            .toBe(false);
        await since('Select dont warn me, open bot, the browsers tab should be #{expected}, instead we have #{actual} ')
            .expect((await dossierPage.getBrowserTabs()).length)
            .toBe(2);
        await dossierPage.closeTab(1);

        // clear local storage
        await libraryPage.executeScript('window.localStorage.clear();');
        await libraryPage.refresh();
    });
});

export const config = specConfiguration;
