import { noExecuteCredentials } from '../../../constants/index.js';
import * as consts from '../../../constants/visualizations.js';
import { gridUser } from '../../../constants/grid.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetDossierState from '../../../api/resetDossierState.js';

//npm run wdio -- --baseUrl=https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary/  --spec 'specs/regression/AG-Grid/chapterLevelACL.spec.js'
describe('No Execute Access on Text', () => {
    const tutorialProject = {
        id: 'B628A31F11E7BD953EAE0080EF0583BD',
        name: 'New MicroStrategy Tutorials',
    };
    const NoExecuteAccessOnTextE2E = {
        id: 'E1A023328B4436CE7DF7B1BB8C356C6C',
        name: 'DashboardWithTextField',
        project: tutorialProject,
    };

    const NoExecuteAccessOnOP = {
        id: '80D82A259A4BE656D2E1328BA1B5CFEE',
        name: 'DynamicOPWIthNoAccessUser',
        project: tutorialProject,
    };

    const NoExecuteAccessOnOPMultiple = {
        id: '76D65EB1A54172A25513C3B890CE2B55',
        name: 'DynamicOPWIthNoAccessUser_AllNas2',
        project: tutorialProject,
    };

    const NoExecuteAccessOnOPAdmin = {
        id: 'AD5C1064304FE910011AE6BED54D6BF0',
        name: 'DynamicOPWIthNoAccessUser_Admin',
        project: tutorialProject,
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let {
        dossierAuthoringPage,
        dossierPage,
        toc,
        libraryPage,
        reset,
        textbox,
        imageContainer,
        grid,
        linkEditor,
        libraryConditionalDisplay,
        contentsPanel,
        loginPage,
        filterPanel,
        filterSummaryBar,
    } = browsers.pageObj1;

    beforeEach(async () => {
        if (!(await loginPage.isLoginPageDisplayed())) {
            await browser.url(new URL('auth/ui/loginPage', browser.options.baseUrl).toString(), 100000);
        }
        await loginPage.login(noExecuteCredentials);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC99378_1] Dossier | No execute access on Text consumption mode', async () => {
        await libraryPage.openDossier(NoExecuteAccessOnTextE2E.name);
        await reset.resetIfEnabled();
        await dossierPage.waitForCurtainDisappear();
        await dossierPage.sleep(3000);
        //1. Validate Text and RichText with no-execute access object, text partial failed with error
        await takeScreenshotByElement(await dossierPage.getDossierView(), 'TC99378_1_1', 'Text no access', {
            tolerance: 0.2,
        });
        //validate contextual linking defined on the text with no-execute access object stil can click the link
        await textbox.navigateLinkByKey('IGK79');
        since('Expect number of tabs opened to be "#{expected}", instead we have "#{actual}" ')
            .expect(await textbox.tabCount())
            .toBe(2);
        await dossierPage.switchToTab(1);
        await dossierPage.waitForCurtainDisappear();
        await dossierPage.sleep(3000);
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC99378_1_1',
            'target dashboard on no access object'
        );
        await dossierPage.closeTab(1);
    });
    it('[TC99378_2] Dossier | No execute access on Rich Text consumption mode', async () => {
        await libraryPage.openDossier(NoExecuteAccessOnTextE2E.name);
        await reset.resetIfEnabled();
        await dossierPage.waitForCurtainDisappear();
        await dossierPage.sleep(3000);

        await toc.openPageFromTocMenu({ chapterName: 'No-execute object on Text', pageName: 'RichText' });
        await dossierPage.waitForCurtainDisappear();
        await dossierPage.sleep(3000);
        await takeScreenshotByElement(await dossierPage.getDossierView(), 'TC99378_2_1', 'RichText no access');
        //2. Validate the grid defined sort on the no-exeucte access object, grid can show data correctly
        await toc.openPageFromTocMenu({ chapterName: 'Sort on no-execute objects', pageName: 'Sort' });
        await dossierPage.waitForCurtainDisappear();
        await dossierPage.sleep(3000);
        await takeScreenshotByElement(await dossierPage.getDossierView(), 'TC99378_2_2', 'Sort on no access object');
    });
    it('[TC99378_3] Dossier | No execute access on HTML in consumption mode', async () => {
        await libraryPage.openDossier(NoExecuteAccessOnTextE2E.name);
        await reset.resetIfEnabled();
        await dossierPage.waitForCurtainDisappear();
        await dossierPage.sleep(3000);
        //3. Validate the HTML iFrame and HTML text with no-exeucte access object, the field partial failed with error
        await toc.openPageFromTocMenu({ chapterName: 'HTML', pageName: 'HTML iFrame' });
        await dossierPage.waitForCurtainDisappear();
        await dossierPage.sleep(3000);
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC99378_3_1',
            'HTML iFrame on no access object'
        );
        await toc.openPageFromTocMenu({ chapterName: 'HTML', pageName: 'HTML Text' });
        await dossierPage.waitForCurtainDisappear();
        await dossierPage.sleep(3000);
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC99378_3_2',
            'HTML Text on no access object'
        );
    });

    it('[TC99378_4] Dossier | No execute access on Image consumption mode', async () => {
        await libraryPage.openDossier(NoExecuteAccessOnTextE2E.name);
        await reset.resetIfEnabled();
        await dossierPage.waitForCurtainDisappear();
        await dossierPage.sleep(3000);
        //4. Validate the Image URL with no-exeucte access object, no impact
        await toc.openPageFromTocMenu({ chapterName: 'No-execute object on Image', pageName: 'Image' });
        await dossierPage.waitForCurtainDisappear();
        await dossierPage.sleep(3000);
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC99378_4_1',
            'Image URL with no access object'
        );
    });
    it('[TC99378_5] Dossier | No execute access on URL consumption mode', async () => {
        await libraryPage.openDossier(NoExecuteAccessOnTextE2E.name);
        await reset.resetIfEnabled();
        await dossierPage.waitForCurtainDisappear();
        await dossierPage.sleep(3000);
        //5. Validate the URL with no-execute access object defined on text, cannot click the url
        await toc.openPageFromTocMenu({ chapterName: 'URLlink', pageName: 'Text' });
        await textbox.hoverTextNodeByKey('W374');
        let element = await textbox.getTextFieldByKey('W374');
        let cursorStyle = await browser.execute((el) => {
            return window.getComputedStyle(el).cursor;
        }, element);
        await since(
            'TC99378_5.1.The mouse cursor should display handover for the URL link with no access attribute but has info window'
        )
            .expect(cursorStyle)
            .toBe('pointer');
        await textbox.navigateLinkByKey('W374');
        await dossierPage.waitForInfoWindowLoading();
        await since('Trigger IW from text W374, the IW should appear')
            .expect(await grid.isVizDisplayed('IW Triggered from Text'))
            .toBe(true);
        // Close IW
        await textbox.navigateLinkByKey('W389');
        await since('Close IW from text, the IW should not appear')
            .expect(await grid.isVizDisplayed('IW Triggered from Text'))
            .toBe(false);

        await textbox.hoverTextNodeByKey('W381');
        element = await textbox.getTextFieldByKey('W381');
        cursorStyle = await browser.execute((el) => {
            return window.getComputedStyle(el).cursor;
        }, element);

        await since(
            'TC99378_5.2.The mouse cursor should display handover for the URL link with no access metric but has info window'
        )
            .expect(cursorStyle)
            .toBe('pointer');
        await textbox.navigateLinkByKey('W381');
        await dossierPage.waitForInfoWindowLoading();
        await since('Trigger IW from text W381, the IW should appear')
            .expect(await grid.isVizDisplayed('IW Triggered from Text'))
            .toBe(true);
        // Close IW
        await textbox.navigateLinkByKey('W389');
        await since('Close IW from text, the IW should not appear')
            .expect(await grid.isVizDisplayed('IW Triggered from Text'))
            .toBe(false);

        await textbox.hoverTextNodeByKey('W380');
        element = await textbox.getTextFieldByKey('W380');
        cursorStyle = await browser.execute((el) => {
            return window.getComputedStyle(el).cursor;
        }, element);
        await since(
            'TC99378_5.3.The mouse cursor should not display handover for the URL link with access but text context contains no access attribute'
        )
            .expect(cursorStyle)
            .not.toBe('pointer');
        await textbox.navigateLinkByKey('W380');
        since('Expect number of tabs opened to be "#{expected}", instead we have "#{actual}" ')
            .expect(await textbox.tabCount())
            .toBe(1);

        await textbox.hoverTextNodeByKey('W382');
        element = await textbox.getTextFieldByKey('W382');
        cursorStyle = await browser.execute((el) => {
            return window.getComputedStyle(el).cursor;
        }, element);
        await since(
            'TC99378_5.4.The mouse cursor should not display handover for the URL link with access but text context contains no access metric'
        )
            .expect(cursorStyle)
            .not.toBe('pointer');
        await textbox.navigateLinkByKey('W382');
        since('Expect number of tabs opened to be "#{expected}", instead we have "#{actual}" ')
            .expect(await textbox.tabCount())
            .toBe(1);

        await textbox.hoverTextNodeByKey('W389');
        element = await textbox.getTextFieldByKey('W389');
        cursorStyle = await browser.execute((el) => {
            return window.getComputedStyle(el).cursor;
        }, element);
        await since(
            'TC99378_5.5.The mouse cursor should not display handover for the URL link with no-execute access attribute'
        )
            .expect(cursorStyle)
            .not.toBe('pointer');
        await textbox.isTooltipDisplayedForTextNodeByKey('W389');
        await textbox.navigateLinkByKey('W389');
        since('Expect number of tabs opened to be "#{expected}", instead we have "#{actual}" ')
            .expect(await textbox.tabCount())
            .toBe(1);

        await textbox.hoverTextNodeByKey('W387');
        element = await textbox.getTextFieldByKey('W387');
        cursorStyle = await browser.execute((el) => {
            return window.getComputedStyle(el).cursor;
        }, element);
        await since(
            'TC99378_5.6.The mouse cursor should not display handover for the URL link with no-execute access metric'
        )
            .expect(cursorStyle)
            .not.toBe('pointer');
        await textbox.isTooltipDisplayedForTextNodeByKey('W387');
        await textbox.navigateLinkByKey('W387');
        since('Expect number of tabs opened to be "#{expected}", instead we have "#{actual}" ')
            .expect(await textbox.tabCount())
            .toBe(1);

        await textbox.hoverTextNodeByKey('W390');
        element = await textbox.getTextFieldByKey('W390');
        cursorStyle = await browser.execute((el) => {
            return window.getComputedStyle(el).cursor;
        }, element);
        await since(
            'TC99378_5.7.The mouse cursor should display handover for the URL link with no-execute access attribute and text context contains access attribute, defined info window'
        )
            .expect(cursorStyle)
            .toBe('pointer');
        await textbox.navigateLinkByKey('W390');
        await dossierPage.waitForInfoWindowLoading();
        await since('Trigger IW from text W390, the IW should appear')
            .expect(await grid.isVizDisplayed('IW Triggered from Text'))
            .toBe(true);
        // Close IW
        await textbox.navigateLinkByKey('W389');
        await since('Close IW from text, the IW should not appear')
            .expect(await grid.isVizDisplayed('IW Triggered from Text'))
            .toBe(false);

        await textbox.hoverTextNodeByKey('W391');
        element = await textbox.getTextFieldByKey('W391');
        cursorStyle = await browser.execute((el) => {
            return window.getComputedStyle(el).cursor;
        }, element);
        await since(
            'TC99378_5.8.The mouse cursor should display handover for the URL link with no-execute access metric and text context contains access metric, defined info window'
        )
            .expect(cursorStyle)
            .toBe('pointer');
        await textbox.navigateLinkByKey('W391');
        await dossierPage.waitForInfoWindowLoading();
        await since('Trigger IW from text W391, the IW should appear')
            .expect(await grid.isVizDisplayed('IW Triggered from Text'))
            .toBe(true);
        // Close IW
        await textbox.navigateLinkByKey('W389');
        await since('Close IW from text, the IW should not appear')
            .expect(await grid.isVizDisplayed('IW Triggered from Text'))
            .toBe(false);
    });
    it('[TC99378_6] Dossier | No execute access on URL Image consumption mode', async () => {
        await libraryPage.openDossier(NoExecuteAccessOnTextE2E.name);
        await reset.resetIfEnabled();
        await dossierPage.waitForCurtainDisappear();
        await dossierPage.sleep(3000);
        //6. Validate the URL with no-execute access object defined on image, cannot click the url
        await toc.openPageFromTocMenu({ chapterName: 'URLlink', pageName: 'Image' });
        await imageContainer.hoverOnImageByKey('W395');
        let element = await imageContainer.getImageNodeByKey('W395');
        let cursorStyle = await browser.execute((el) => {
            return window.getComputedStyle(el).cursor;
        }, element);
        await since(
            'TC99378_6.1.The mouse cursor should not display handover for the URL link with no-execute access attribute on image'
        )
            .expect(cursorStyle)
            .not.toBe('pointer');
        await imageContainer.navigateLinkByKey('W395');
        since('Expect number of tabs opened to be "#{expected}", instead we have "#{actual}" ')
            .expect(await textbox.tabCount())
            .toBe(1);

        await imageContainer.hoverOnImageByKey('W397');
        element = await imageContainer.getImageNodeByKey('W397');
        cursorStyle = await browser.execute((el) => {
            return window.getComputedStyle(el).cursor;
        }, element);
        await since(
            'TC99378_6.2.The mouse cursor should not display handover for the URL link with no-execute access metric on image'
        )
            .expect(cursorStyle)
            .not.toBe('pointer');
        await imageContainer.navigateLinkByKey('W397');
        since('Expect number of tabs opened to be "#{expected}", instead we have "#{actual}" ')
            .expect(await textbox.tabCount())
            .toBe(1);

        await imageContainer.hoverOnImageByKey('W409');
        element = await imageContainer.getImageNodeByKey('W409');
        cursorStyle = await browser.execute((el) => {
            return window.getComputedStyle(el).cursor;
        }, element);
        await since(
            'TC99378_6.3.The mouse cursor should display handover for the URL link with no-execute access attribute on image, defined info window'
        )
            .expect(cursorStyle)
            .toBe('pointer');
        await imageContainer.navigateLinkByKey('W409');
        await dossierPage.waitForInfoWindowLoading();
        await since('Trigger IW from image W409, the IW should appear')
            .expect(await grid.isVizDisplayed('IW Triggered from Image'))
            .toBe(true);
        // Close IW
        await dossierPage.clickTextfieldByTitle('URL link has Category');
        await since('Close IW from Image, the IW should not appear')
            .expect(await grid.isVizDisplayed('IW Triggered from Image'))
            .toBe(false);

        await imageContainer.hoverOnImageByKey('W411');
        element = await imageContainer.getImageNodeByKey('W411');
        cursorStyle = await browser.execute((el) => {
            return window.getComputedStyle(el).cursor;
        }, element);
        await since(
            'TC99378_6.4.The mouse cursor should display handover for the URL link with no-execute access metric on image, defined info window'
        )
            .expect(cursorStyle)
            .toBe('pointer');
        await imageContainer.navigateLinkByKey('W411');
        await dossierPage.waitForInfoWindowLoading();
        await since('Trigger IW from image W411, the IW should appear')
            .expect(await grid.isVizDisplayed('IW Triggered from Image'))
            .toBe(true);
        // Close IW
        await dossierPage.clickTextfieldByTitle('URL link has Category');
        await since('Close IW from Image, the IW should not appear')
            .expect(await grid.isVizDisplayed('IW Triggered from Image'))
            .toBe(false);

        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC99378_6_5',
            'URL with no access object on text and image'
        );
    });
    it('[TC99378_7] Dossier | No execute access on Text with Conditional Display consumption mode', async () => {
        await libraryPage.openDossier(NoExecuteAccessOnTextE2E.name);
        await reset.resetIfEnabled();
        await dossierPage.waitForCurtainDisappear();
        await dossierPage.sleep(3000);
        //7. Validate conditional display with no-execute access objects
        await toc.openPageFromTocMenu({ chapterName: 'ConditionalDisplay', pageName: 'Page 1' });
        await dossierPage.waitForCurtainDisappear();
        await dossierPage.sleep(3000);
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC99378_7_1',
            'Conditional display with no access object'
        );
    });
    it('[TC99378_8] Dossier | No execute access on Text with Filtered Target PS with unset status consumption mode', async () => {
        await libraryPage.openDossier(NoExecuteAccessOnTextE2E.name);
        await reset.resetIfEnabled();
        await dossierPage.waitForCurtainDisappear();
        await dossierPage.sleep(3000);
        //8. Validate the ICS with no-execute access object target PS with text
        await toc.openPageFromTocMenu({ chapterName: 'FilterTargetPS', pageName: 'Category Unset' });
        await dossierPage.waitForCurtainDisappear();
        await dossierPage.sleep(3000);
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC99378_8_1',
            'ICS with no access object target PS with text',
            { tolerance: 0.2 }
        );
        await dossierPage.clickDossierPanelStackSwitchTab('HTML');
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC99378_8_2',
            'ICS with no access object target PS with HTML'
        );
        await dossierPage.clickDossierPanelStackSwitchTab('URL');
        let element = await textbox.getTextFieldByKey('W471');
        let cursorStyle = await browser.execute((el) => {
            return window.getComputedStyle(el).cursor;
        }, element);
        await since(
            'TC99378_8.3.The mouse cursor should display handover for the URL link with access attribute on text targeted by unset filter on no-execute attribute'
        )
            .expect(cursorStyle)
            .toBe('pointer');
        element = await textbox.getTextFieldByKey('IGK609');
        cursorStyle = await browser.execute((el) => {
            return window.getComputedStyle(el).cursor;
        }, element);
        await since(
            'TC99378_8.4.The mouse cursor should display handover for the URL link with access metric on text targeted by unset filter on no-execute attribute'
        )
            .expect(cursorStyle)
            .toBe('pointer');
        element = await textbox.getTextFieldByKey('W473');
        cursorStyle = await browser.execute((el) => {
            return window.getComputedStyle(el).cursor;
        }, element);
        await since(
            'TC99378_8.5.The mouse cursor should not display handover for the URL link with no-execute access attribute on text targeted by unset filter on no-execute attribute'
        )
            .expect(cursorStyle)
            .not.toBe('pointer');
        element = await textbox.getTextFieldByKey('IGK593');
        cursorStyle = await browser.execute((el) => {
            return window.getComputedStyle(el).cursor;
        }, element);
        await since(
            'TC99378_8.6.The mouse cursor should not display handover for the URL link with no-execute access attribute on text targeted by unset filter on no-execute attribute'
        )
            .expect(cursorStyle)
            .not.toBe('pointer');
        await dossierPage.clickDossierPanelStackSwitchTab('ConditionalDisplay');
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC99378_8_7',
            'ICS with no access object target PS with Conditional Display'
        );
    });

    it('[TC99378_9] Dossier | No execute access on Text with Filtered Target PS with chosen status consumption mode', async () => {
        await libraryPage.openDossier(NoExecuteAccessOnTextE2E.name);
        await reset.resetIfEnabled();
        await dossierPage.waitForCurtainDisappear();
        await dossierPage.sleep(3000);
        //8. Validate the ICS with no-execute access object chosen target PS with text

        await toc.openPageFromTocMenu({ chapterName: 'FilterTargetPS', pageName: 'Category Chosen' });
        await dossierPage.waitForCurtainDisappear();
        await dossierPage.sleep(3000);
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC99378_1_9_1',
            'ICS with no access object chosen target PS with text'
        );
        await dossierPage.clickDossierPanelStackSwitchTab('HTML');
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC99378_1_9_2',
            'ICS with no access object chosen target PS with HTML'
        );
        await dossierPage.clickDossierPanelStackSwitchTab('URL');
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC99378_1_9_3',
            'ICS with no access object chosen target PS with URL'
        );
        let element = await textbox.getTextNodeByText('URL has Quarter').$('.mstrmojo-DocTextfield');
        let cursorStyle = await browser.execute((el) => {
            return window.getComputedStyle(el).cursor;
        }, element);
        await since(
            'TC99378_1_9.1.The mouse cursor should not display handover for the URL link with access attribute on text targeted by chosen filter on no-execute attribute'
        )
            .expect(cursorStyle)
            .not.toBe('pointer');
        element = await textbox.getTextNodeByText('URL has Profit').$('.mstrmojo-DocTextfield');
        cursorStyle = await browser.execute((el) => {
            return window.getComputedStyle(el).cursor;
        }, element);
        await since(
            'TC99378_1_9.2.The mouse cursor should not display handover for the URL link with access metric on text targeted by chosen filter on no-execute attribute'
        )
            .expect(cursorStyle)
            .not.toBe('pointer');
        element = await textbox.getTextNodeByText('URL has Category').$('.mstrmojo-DocTextfield');
        cursorStyle = await browser.execute((el) => {
            return window.getComputedStyle(el).cursor;
        }, element);
        await since(
            'TC99378_1_9.3.The mouse cursor should not display handover for the URL link with no-execute access attribute on text targeted by chosen filter on no-execute attribute'
        )
            .expect(cursorStyle)
            .not.toBe('pointer');
        element = await textbox.getTextNodeByText('URL has Cost').$('.mstrmojo-DocTextfield');
        cursorStyle = await browser.execute((el) => {
            return window.getComputedStyle(el).cursor;
        }, element);
        await since(
            'TC99378_1_9.4.The mouse cursor should not display handover for the URL link with no-execute access metric on text targeted by chosen filter on no-execute attribute'
        )
            .expect(cursorStyle)
            .not.toBe('pointer');
        await dossierPage.clickDossierPanelStackSwitchTab('ConditionalDisplay');
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC99378_1_9_5',
            'ICS with no access object chosen target PS with Conditional Display'
        );
        await toc.openPageFromTocMenu({ chapterName: 'FilterTargetPS', pageName: 'Category Dynamic' });
        await dossierPage.waitForCurtainDisappear();
        await dossierPage.sleep(3000);
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC99378_1_9_6',
            'ICS with no access object dynamic target PS with text'
        );
        await dossierPage.clickDossierPanelStackSwitchTab('HTML');
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC99378_1_9_7',
            'ICS with no access object dynamic target PS with HTML'
        );
        await dossierPage.clickDossierPanelStackSwitchTab('URL');
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC99378_1_9_8',
            'ICS with no access object dynamic target PS with URL'
        );
        element = await textbox.getTextNodeByText('URL has Quarter').$('.mstrmojo-DocTextfield');
        cursorStyle = await browser.execute((el) => {
            return window.getComputedStyle(el).cursor;
        }, element);
        await since(
            'TC99378_1_9.9.The mouse cursor should not display handover for the URL link with access attribute on text targeted by dynamic filter on no-execute attribute'
        )
            .expect(cursorStyle)
            .not.toBe('pointer');
        element = await textbox.getTextNodeByText('URL has Profit').$('.mstrmojo-DocTextfield');
        cursorStyle = await browser.execute((el) => {
            return window.getComputedStyle(el).cursor;
        }, element);
        await since(
            'TC99378_1_9.10.The mouse cursor should not display handover for the URL link with access metric on text targeted by dynamic filter on no-execute attribute'
        )
            .expect(cursorStyle)
            .not.toBe('pointer');
        element = await textbox.getTextNodeByText('URL has Category').$('.mstrmojo-DocTextfield');
        cursorStyle = await browser.execute((el) => {
            return window.getComputedStyle(el).cursor;
        }, element);
        await since(
            'TC99378_1_9.11.The mouse cursor should not display handover for the URL link with no-execute access attribute on text targeted by dynamic filter on no-execute attribute'
        )
            .expect(cursorStyle)
            .not.toBe('pointer');
        element = await textbox.getTextNodeByText('URL has Cost').$('.mstrmojo-DocTextfield');
        cursorStyle = await browser.execute((el) => {
            return window.getComputedStyle(el).cursor;
        }, element);
        await since(
            'TC99378_1_9.12.The mouse cursor should not display handover for the URL link with no-execute access metric on text targeted by dynamic filter on no-execute attribute'
        )
            .expect(cursorStyle)
            .not.toBe('pointer');
        await dossierPage.clickDossierPanelStackSwitchTab('ConditionalDisplay');
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC99378_1_9_13',
            'ICS with no access object dynamic target PS with Conditional Display'
        );
    });

    it('[TC99378_10] Dossier | No execute access on Text with Filtered Target PS with CGB desired status consumption mode', async () => {
        await libraryPage.openDossier(NoExecuteAccessOnTextE2E.name);
        await reset.resetIfEnabled();
        await dossierPage.waitForCurtainDisappear();
        await dossierPage.sleep(3000);
        //8. Validate the ICS with no-execute access object CGB desired target PS with text
        await toc.openPageFromTocMenu({ chapterName: 'FilterTargetPS', pageName: 'CGB desired' });
        await dossierPage.waitForCurtainDisappear();
        await dossierPage.sleep(3000);
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC99378_1_10_1',
            'ICS with no access object CGB desired target PS with CGB desired'
        );
        await dossierPage.clickDossierPanelStackSwitchTab('HTML');
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC99378_1_10_2',
            'ICS with no access object CGB desired target PS with HTML'
        );
        await dossierPage.clickDossierPanelStackSwitchTab('URL');
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC99378_1_10_3',
            'ICS with no access object CGB desired target PS with URL'
        );
        let element = await textbox.getTextNodeByText('URL has Quarter').$('.mstrmojo-DocTextfield');
        let cursorStyle = await browser.execute((el) => {
            return window.getComputedStyle(el).cursor;
        }, element);
        await since(
            'TC99378_1_10.4.The mouse cursor should not display handover for the URL link with access attribute on text targeted by CGB desired filter on no-execute attribute'
        )
            .expect(cursorStyle)
            .not.toBe('pointer');
        element = await textbox.getTextNodeByText('URL has Profit').$('.mstrmojo-DocTextfield');
        cursorStyle = await browser.execute((el) => {
            return window.getComputedStyle(el).cursor;
        }, element);
        await since(
            'TC99378_1_10.5.The mouse cursor should not display handover for the URL link with access metric on text targeted by CGB desired filter on no-execute attribute'
        )
            .expect(cursorStyle)
            .not.toBe('pointer');
        element = await textbox.getTextNodeByText('URL has Category').$('.mstrmojo-DocTextfield');
        cursorStyle = await browser.execute((el) => {
            return window.getComputedStyle(el).cursor;
        }, element);
        await since(
            'TC99378_1_10.6.The mouse cursor should not display handover for the URL link with no-execute access attribute on text targeted by CGB desired filter on no-execute attribute'
        )
            .expect(cursorStyle)
            .not.toBe('pointer');
        element = await textbox.getTextNodeByText('URL has Cost').$('.mstrmojo-DocTextfield');
        cursorStyle = await browser.execute((el) => {
            return window.getComputedStyle(el).cursor;
        }, element);
        await since(
            'TC99378_1_10.7.The mouse cursor should not display handover for the URL link with no-execute access metric on text targeted by CGB desired filter on no-execute attribute'
        )
            .expect(cursorStyle)
            .not.toBe('pointer');
        await dossierPage.clickDossierPanelStackSwitchTab('ConditionalDisplay');
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC99378_10_8',
            'ICS with no access object CGB desired target PS with Conditional Display'
        );
        await dossierPage.goToLibrary();
    });

    it('[TC99378_11] Dossier | No execute access on Text edit mode', async () => {
        const url = browser.options.baseUrl + `app/${tutorialProject.id}/${NoExecuteAccessOnTextE2E.id}/K53--K46/edit`;
        await libraryPage.openDossierByUrl(url.toString());
        await dossierAuthoringPage.waitForCurtainDisappear();
        //1. Validate the text and rich text with no-execute access object, text partial failed with error in edit mode
        await takeScreenshotByElement(
            await dossierAuthoringPage.getDossierView(),
            'TC99378_11_1',
            'No execute access on Text edit mode'
        );
        //Double click the text to edit
        await dossierAuthoringPage.sleep(3000);
        await dossierAuthoringPage.doubleClickOnElement(textbox.getTextNodeByKey('W66'));
        await since('Double click the text to edit, it display the original object name')
            .expect(await textbox.getTextFieldByKey('W66').getText())
            .toBe('Textbox with Category: {Category}');
        //Alter the text
        await textbox.InputValuetoTextNodeByKey('W66', 'Textbox with {Quarter}');
        await since('Alter the text on attribute with access object, it display the new text')
            .expect(await textbox.getTextFieldByKey('W66').getText())
            .toBe('Textbox with 2014 Q1');
        await dossierAuthoringPage.doubleClickOnElement(textbox.getTextNodeByKey('W66'));
        await since('Double click the text to edit, it display the original object name')
            .expect(await textbox.getTextFieldByKey('W66').getText())
            .toBe('Textbox with {Quarter}');
        await textbox.InputValuetoTextNodeByKey('W66', 'Textbox with {Category}');
        await since('Alter the text on attribute with no-access object, it display no access')
            .expect(await textbox.getTextNodeByKey('W66').$('.mstrmojo-Label.nonExecuteMsg').getAttribute('aria-label'))
            .toBe('No access');
        await dossierAuthoringPage.sleep(3000);
        await dossierAuthoringPage.doubleClickOnElement(textbox.getTextNodeByKey('IGK125'));
        await since('Double click the text to edit, it display the original object name')
            .expect(await textbox.getTextFieldByKey('IGK125').getText())
            .toBe('Textbox with Metric Cost:  {Cost}');
        await textbox.InputValuetoTextNodeByKey('IGK125', 'Textbox with {Profit}');
        await since('Alter the text on metric, it display the new text')
            .expect(await textbox.getTextFieldByKey('IGK125').getText())
            .toBe('Textbox with $5,293,624');
    });

    it('[TC99378_12] Dossier | No execute access on rich text and sort edit mode', async () => {
        const url = browser.options.baseUrl + `app/${tutorialProject.id}/${NoExecuteAccessOnTextE2E.id}/K53--K46/edit`;
        await libraryPage.openDossierByUrl(url.toString());
        await dossierAuthoringPage.waitForCurtainDisappear();
        //2. Validate the rich text with no-execute access object, rich text partial failed with error in edit mode
        await contentsPanel.goToPage({ chapterName: 'No-execute object on Text', pageName: 'RichText' });
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC99378_12_1',
            'No execute access on RichText edit mode'
        );
        //textbox context menu duplicate
        await textbox.hoverTextNodeByKey('W352');
        await textbox.clickTextContextMenuOptionByKey('W352', 'Duplicate');
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC99378_12_2',
            'Duplicate the textbox with no-execute access object'
        );

        //3. Validate the sort on no-execute objects
        await contentsPanel.goToPage({ chapterName: 'Sort on no-execute objects', pageName: 'Sort' });
        await takeScreenshotByElement(
            await dossierAuthoringPage.getDossierView(),
            'TC99378_12_3',
            'No execute access on Sort edit mode'
        );
    });

    it('[TC99378_13] Dossier | No execute access on HTML and Image edit mode', async () => {
        const url = browser.options.baseUrl + `app/${tutorialProject.id}/${NoExecuteAccessOnTextE2E.id}/K53--K46/edit`;
        await libraryPage.openDossierByUrl(url.toString());
        await dossierAuthoringPage.waitForCurtainDisappear();
        //4. Validate the HTML iFrame with no-execute access object
        await contentsPanel.goToPage({ chapterName: 'HTML', pageName: 'HTML iFrame' });
        await takeScreenshotByElement(
            await dossierAuthoringPage.getDossierView(),
            'TC99378_13_1',
            'No execute access on HTML iFrame edit mode'
        );
        //5. Validate the HTML Text with no-execute access object
        await contentsPanel.goToPage({ chapterName: 'HTML', pageName: 'HTML Text' });
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC99378_13_2',
            'No execute access on HTML Text edit mode'
        );
        //6. Validate the image with no-execute access object
        await contentsPanel.goToPage({ chapterName: 'No-execute object on Image', pageName: 'Image' });
        await takeScreenshotByElement(
            await dossierAuthoringPage.getDossierView(),
            'TC99378_13_3',
            'No execute access on Image edit mode'
        );
    });
    it('[TC99378_14] Dossier | No execute access on URL link edit mode', async () => {
        const url = browser.options.baseUrl + `app/${tutorialProject.id}/${NoExecuteAccessOnTextE2E.id}/K53--K46/edit`;
        await libraryPage.openDossierByUrl(url.toString());
        await dossierAuthoringPage.waitForCurtainDisappear();
        //7. Validate the text with URL link with no-execute access object
        await contentsPanel.goToPage({ chapterName: 'URLlink', pageName: 'Text' });
        await takeScreenshotByElement(
            await dossierAuthoringPage.getDossierView(),
            'TC99378_14_1',
            'No execute access on Text edit mode'
        );
        //Validate no tooltips, linkicon and handover for URL link with no-execute access attribute
        let tooltipExists = await textbox.isTooltipDisplayedForTextNodeByKey('W389');
        await since('Tooltip should not exist').expect(tooltipExists).toBe(false);
        let className = await textbox.getLinkIconByTextNode('W389').getAttribute('class');
        await since('hover-link-btn should still have class "hidden" after hover')
            .expect(className.includes('hidden'))
            .toBe(true);
        let element = await textbox.getTextFieldByKey('W389');
        let cursorStyle = await browser.execute((el) => {
            return window.getComputedStyle(el).cursor;
        }, element);
        await since('The mouse cursor should not display handover for the URL link with no-execute access attribute')
            .expect(cursorStyle)
            .not.toBe('pointer');
        //Click the text, validate no popup link displayed
        await textbox.navigateLinkByKey('W389');
        since('The pop up link should not be displayed')
            .expect(await textbox.isPopUpLinkDisplayedEditMode('Text URL link has category'))
            .toBe(false);
        //Open link editor, validate link editor is opened
        await textbox.openLinkEditorOnContainer(textbox.getTextNodeByKey('W389'));
        since('The selected tab should be #{expected}, instead we have #{actual} ')
            .expect(await linkEditor.getSelectedTabName())
            .toBe('URL');
        await takeScreenshotByElement(await linkEditor.getlinkEditor(), 'TC99378_2_9', 'url link editor');
        //Validate link icon is displayed when link editor is opened
        className = await textbox.getLinkIconByTextNode('W389').getAttribute('class');
        console.log(className);
        since('hover-link-btn should display after open link editor').expect(className.includes('hidden')).toBe(false);
        //Save the link, validate the target url is updated
        await linkEditor.getURLLinkInLinkEditor().setValue('https://www.baidu.com/');
        await dossierAuthoringPage.clickOnElement(linkEditor.getButtonByName('Save'));
        await textbox.navigateLinkEditModeByKey('W389');
        await dossierAuthoringPage.switchToTab(1);
        since('The target url should be #{expected}, instead we have #{actual} ')
            .expect(await browser.getUrl())
            .toBe('http://https//www.baidu.com/');
        await dossierAuthoringPage.closeTab(1);
        //Undo the link, validate the URL is back to original
        await dossierPage.clickUndoInDossier();
        await textbox.clickTextContextMenuOptionByKey('W389', 'Edit Link...');
        await takeScreenshotByElement(await linkEditor.getlinkEditor(), 'TC99378_2_10', 'url link editor after undo');
        className = await textbox.getLinkIconByTextNode('W389').getAttribute('class');
        console.log(className);
        since('hover-link-btn should display after open link editor').expect(className.includes('hidden')).toBe(false);
        await linkEditor.closeEditorWithoutSaving();

        //validate URL contains no-execute access metric
        await textbox.hoverTextNodeByKey('W387');
        tooltipExists = await textbox.isTooltipDisplayedForTextNodeByKey('W387');
        await since('Tooltip should not exist').expect(tooltipExists).toBe(false);
        className = await textbox.getLinkIconByTextNode('W387').getAttribute('class');
        await since('hover-link-btn should still have class "hidden" after hover')
            .expect(className.includes('hidden'))
            .toBe(true);
        element = await textbox.getTextFieldByKey('W387');
        cursorStyle = await browser.execute((el) => {
            return window.getComputedStyle(el).cursor;
        }, element);
        await since('The mouse cursor should not display handover for the URL link with no-execute access metric')
            .expect(cursorStyle)
            .not.toBe('pointer');
        await textbox.navigateLinkByKey('W387');
        since('The pop up link should not be displayed')
            .expect(await textbox.isPopUpLinkDisplayedEditMode('Text URL link has Cost'))
            .toBe(false);
        await textbox.openLinkEditorOnContainer(textbox.getTextNodeByKey('W387'));
        since('The selected tab should be #{expected}, instead we have #{actual} ')
            .expect(await linkEditor.getSelectedTabName())
            .toBe('URL');
        await takeScreenshotByElement(await linkEditor.getlinkEditor(), 'TC99378_2_11', 'url link editor');
        className = await textbox.getLinkIconByTextNode('W387').getAttribute('class');
        since('hover-link-btn should display after open link editor').expect(className.includes('hidden')).toBe(false);
        await linkEditor.getURLLinkInLinkEditor().setValue('https://www.baidu.com/');
        await dossierAuthoringPage.clickOnElement(linkEditor.getButtonByName('Save'));
        await textbox.navigateLinkEditModeByKey('W387');
        await dossierAuthoringPage.switchToTab(1);
        since('The target url should be #{expected}, instead we have #{actual} ')
            .expect(await browser.getUrl())
            .toBe('http://https//www.baidu.com/');
        await dossierAuthoringPage.closeTab(1);
    });
    it('[TC99378_15] Dossier | No execute access on Conditional Display edit mode', async () => {
        const url = browser.options.baseUrl + `app/${tutorialProject.id}/${NoExecuteAccessOnTextE2E.id}/K53--K46/edit`;
        await libraryPage.openDossierByUrl(url.toString());
        await dossierAuthoringPage.waitForCurtainDisappear();

        //8. Validate conditional display defined on no-execute access object
        await contentsPanel.goToPage({ chapterName: 'ConditionalDisplay', pageName: 'Page 1' });
        await takeScreenshotByElement(
            await dossierAuthoringPage.getDossierView(),
            'TC99378_15_1',
            'No execute access on Conditional Display edit mode'
        );
        await libraryConditionalDisplay.chooseElement('2014 Q1 conditonal display on Category in list Books');
        await libraryConditionalDisplay.OpenElementMenu('2014 Q1 conditonal display on Category in list Books');
        await takeScreenshotByElement(
            await libraryConditionalDisplay.getRightClickMenu(),
            'TC99378_15_2',
            'Right Click Menu',
            { tolerance: 0.1 }
        );
        await libraryConditionalDisplay.openConditionalDisplayDialog();
        await takeScreenshotByElement(
            await libraryConditionalDisplay.getConditionalDisplayDialog(),
            'TC99378_15_3',
            'Conditional Display Dialog',
            { tolerance: 0.1 }
        );
        since('Hover on the condition title and the condition is based on no-execute access attribute')
            .expect(await libraryConditionalDisplay.getConditionTitle('Category'))
            .toBe('No access');
        since('Apply button is disabled')
            .expect(await libraryConditionalDisplay.IsConditionalDisplayDialogButtonEnabled('Apply'))
            .toBe(false);
        since('OK button is disabled')
            .expect(await libraryConditionalDisplay.IsConditionalDisplayDialogButtonEnabled('OK'))
            .toBe(false);
        await libraryConditionalDisplay.closeConditionalDisplayDialog();

        await libraryConditionalDisplay.chooseElement('2014 conditonal display on Cost');
        await libraryConditionalDisplay.OpenElementMenu('2014 conditonal display on Cost');
        await takeScreenshotByElement(
            await libraryConditionalDisplay.getRightClickMenu(),
            'TC99378_15_4',
            'Right Click Menu',
            { tolerance: 0.1 }
        );
        await libraryConditionalDisplay.openConditionalDisplayDialog();
        await takeScreenshotByElement(
            await libraryConditionalDisplay.getConditionalDisplayDialog(),
            'TC99378_15_5',
            'Conditional Display Dialog',
            { tolerance: 0.1 }
        );
        since('Hover on the condition title and the condition is based on no-execute access attribute')
            .expect(await libraryConditionalDisplay.getConditionTitle('Cost'))
            .toBe('No access');
        since('Apply button is disabled')
            .expect(await libraryConditionalDisplay.IsConditionalDisplayDialogButtonEnabled('Apply'))
            .toBe(false);
        since('OK button is disabled')
            .expect(await libraryConditionalDisplay.IsConditionalDisplayDialogButtonEnabled('OK'))
            .toBe(false);
        await libraryConditionalDisplay.closeConditionalDisplayDialog();
    });

    it('[TC99378_16] Dossier | No execute access on Filtered Target PS edit mode', async () => {
        const url = browser.options.baseUrl + `app/${tutorialProject.id}/${NoExecuteAccessOnTextE2E.id}/K53--K46/edit`;
        await libraryPage.openDossierByUrl(url.toString());
        await dossierAuthoringPage.waitForCurtainDisappear();

        //9. Validate no-exeucte access object target PS
        await contentsPanel.goToPage({ chapterName: 'FilterTargetPS', pageName: 'Category Unset' });
        await takeScreenshotByElement(
            await dossierAuthoringPage.getDossierView(),
            'TC99378_16_1',
            'No execute access on text with Category Unset edit mode'
        );
        await contentsPanel.goToPage({ chapterName: 'FilterTargetPS', pageName: 'Category Chosen' });
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC99378_16_2',
            'No execute access on text with Category Chosen edit mode'
        );
        await dossierPage.clickDossierPanelStackSwitchTab('HTML');
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC99378_16_3',
            'No execute access on text with Category Chosen edit mode'
        );
        await dossierPage.clickDossierPanelStackSwitchTab('URL');
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC99378_16_4',
            'No execute access on text with Category Chosen edit mode'
        );
        let element = await textbox.getTextNodeByText('URL has Quarter').$('.mstrmojo-DocTextfield');
        let cursorStyle = await browser.execute((el) => {
            return window.getComputedStyle(el).cursor;
        }, element);
        await since(
            'TC99378_16_5.1.The mouse cursor should not display handover for the URL link with access attribute on text targeted by CGB desired filter on no-execute attribute'
        )
            .expect(cursorStyle)
            .not.toBe('pointer');
        element = await textbox.getTextNodeByText('URL has Profit').$('.mstrmojo-DocTextfield');
        cursorStyle = await browser.execute((el) => {
            return window.getComputedStyle(el).cursor;
        }, element);
        await since(
            'TC99378_16_5.2.The mouse cursor should not display handover for the URL link with access metric on text targeted by CGB desired filter on no-execute attribute'
        )
            .expect(cursorStyle)
            .not.toBe('pointer');
        element = await textbox.getTextNodeByText('URL has Category').$('.mstrmojo-DocTextfield');
        cursorStyle = await browser.execute((el) => {
            return window.getComputedStyle(el).cursor;
        }, element);
        await since(
            'TC99378_16_5.3.The mouse cursor should not display handover for the URL link with no-execute access attribute on text targeted by CGB desired filter on no-execute attribute'
        )
            .expect(cursorStyle)
            .not.toBe('pointer');
        element = await textbox.getTextNodeByText('URL has Cost').$('.mstrmojo-DocTextfield');
        cursorStyle = await browser.execute((el) => {
            return window.getComputedStyle(el).cursor;
        }, element);
        await since(
            'TC99378_16_5.4.The mouse cursor should not display handover for the URL link with no-execute access metric on text targeted by CGB desired filter on no-execute attribute'
        )
            .expect(cursorStyle)
            .not.toBe('pointer');
        await dossierPage.clickDossierPanelStackSwitchTab('ConditionalDisplay');
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC99378_16_6',
            'No execute access on text with Category Chosen edit mode'
        );
    });

    it('[TC99378_17] Dossier | No execute access on the candidates of the object parameter', async () => {
        //Reset All 3 dashboards
        await resetDossierState({ credentials: gridUser, dossier: NoExecuteAccessOnOPAdmin });
        await resetDossierState({ credentials: noExecuteCredentials, dossier: NoExecuteAccessOnOPAdmin });
        await resetDossierState({ credentials: noExecuteCredentials, dossier: NoExecuteAccessOnOP });
        await resetDossierState({ credentials: noExecuteCredentials, dossier: NoExecuteAccessOnOPMultiple });

        //User admin user to run NoExecuteAccessOnOPAdmin first to generate the caches
        await libraryPage.switchUser(gridUser);
        await libraryPage.openDossierById({
            projectId: NoExecuteAccessOnOPAdmin.project.id,
            dossierId: NoExecuteAccessOnOPAdmin.id,
        });
        await libraryPage.waitForCurtainDisappear();
        //Back to Library to gernerate the caches
        await dossierPage.goToLibrary();

        //Switch to no-execute user
        await libraryPage.switchUser(noExecuteCredentials);
        //Open the dossier with no-execute access on object parameter
        await libraryPage.openDossierById({
            projectId: NoExecuteAccessOnOPAdmin.project.id,
            dossierId: NoExecuteAccessOnOPAdmin.id,
        });
        await dossierPage.waitForCurtainDisappear();
        //Validate the result
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC99378_17_1',
            'No execute access on the selections of the dynamic object parameter when admin caches are generated',
        );
        //Go to Chapter 1
        await toc.openPageFromTocMenu({ chapterName: 'FP', pageName: 'Page 1' });
        await dossierPage.waitForCurtainDisappear();
        await dossierPage.sleep(3000);
        //Validate the result
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC99378_17_2',
            'No execute access on the selections of the dynamic object parameter when admin caches are generated',
        );
        //Validate the filter summary
        await since('Filter Summary of DashboardA2 should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('DashboardA2'))
            .toBe('(Country)');
        await since('Filter Summary of DashboardM2 should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('DashboardM2'))
            .toBe('(Revenue, Profit)');
        await since('Filter Summary of DatasetA1 should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('DatasetA1'))
            .toBe('(Subcategory, Month of Year)');
        await since('Filter Summary of DatasetM1 should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('DatasetM1'))
            .toBe('(Profit Margin)');
        //Open the filter panel
        await filterPanel.openFilterPanel();
        //Verify the filter panel result
        await takeScreenshotByElement(
            await filterPanel.getFilterPanelDropdown(),
            'TC99378_17_2_filter panel',
            'Filter Panel with Dynamic Selections'
        );
        //Back to library Home
        await dossierPage.goToLibrary();

        //Open another dashboard without caches
        await libraryPage.openDossierById({
            projectId: NoExecuteAccessOnOP.project.id,
            dossierId: NoExecuteAccessOnOP.id,
        });
        //First time open the dashboard, it will generate the caches
        await dossierPage.waitForCurtainDisappear();
        //Validate the result
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC99378_17_3',
            'No execute access on the selections of the dynamic object parameter when no-execute user opens the dashboard without caches',
        );
        //Go to Chapter 1
        await toc.openPageFromTocMenu({ chapterName: 'FP', pageName: 'Page 1' });
        await dossierPage.waitForCurtainDisappear();
        await dossierPage.sleep(3000);
        //Validate the result
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC99378_17_4',
            'No execute access on the selections of the dynamic object parameter when no-execute user opens the dashboard without caches',
        );
        //Validate the filter summary
        await since('Filter Summary of DashboardA2 should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('DashboardA2'))
            .toBe('(Country)');
        await since('Filter Summary of DashboardM2 should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('DashboardM2'))
            .toBe('(Revenue)');
        await since('Filter Summary of DatasetA1 should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('DatasetA1'))
            .toBe('(Subcategory)');
        await since('Filter Summary of DatasetM1 should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('DatasetM1'))
            .toBe('(Profit Margin)');
        //Open the filter panel
        await filterPanel.openFilterPanel();
        //Verify the filter panel result
        await takeScreenshotByElement(
            await filterPanel.getFilterPanelDropdown(),
            'TC99378_17_4_filter panel',
            'Filter Panel with Dynamic Selections'
        );
        //Back to library Home
        await dossierPage.goToLibrary();
        //Open the dashbboard again to hit caches
        await libraryPage.openDossierById({
            projectId: NoExecuteAccessOnOP.project.id,
            dossierId: NoExecuteAccessOnOP.id,
        });
        await dossierPage.waitForCurtainDisappear();
        //Validate the result
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC99378_17_5',
            'No execute access on the selections of the dynamic object parameter when no-execute user opens the dashboard again to hit caches',
        );
        //Validate the filter summary
        await since('Filter Summary of DashboardA2 should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('DashboardA2'))
            .toBe('(Country)');
        await since('Filter Summary of DashboardM2 should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('DashboardM2'))
            .toBe('(Revenue)');
        await since('Filter Summary of DatasetA1 should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('DatasetA1'))
            .toBe('(Subcategory)');
        await since('Filter Summary of DatasetM1 should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('DatasetM1'))
            .toBe('(Profit Margin)');
        //Open the filter panel
        await filterPanel.openFilterPanel();
        //Verify the filter panel result
        await takeScreenshotByElement(
            await filterPanel.getFilterPanelDropdown(),
            'TC99378_17_5_filter panel',
            'Filter Panel with Dynamic Selections'
        );
        //Switch to Chapter ICS
        await toc.openPageFromTocMenu({ chapterName: 'ICS', pageName: 'Page 1' });
        await dossierPage.waitForCurtainDisappear();
        await dossierPage.sleep(3000);
        //Validate the result
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC99378_17_6',
            'No execute access on the selections of the dynamic object parameter when no-execute user opens the dashboard in Chapter ICS',
        );
        //Back to library Home
        await dossierPage.goToLibrary();
        //Open another dashboard with dynamic object parameter with multiple selections at first time
        await libraryPage.openDossierById({
            projectId: NoExecuteAccessOnOPMultiple.project.id,
            dossierId: NoExecuteAccessOnOPMultiple.id,
        });
        //First time open the dashboard, it will generate the caches
        await dossierPage.waitForCurtainDisappear();
        //Validate the result
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC99378_17_7',
            'No execute access on the selections of the dynamic object parameter when no-execute user opens the dashboard with multiple selections for the first time',
        );
        //Go to Chapter 1
        await toc.openPageFromTocMenu({ chapterName: 'FP', pageName: 'Page 1' });
        await dossierPage.waitForCurtainDisappear();
        await dossierPage.sleep(3000);
        //Validate the result
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC99378_17_8',
            'No execute access on the selections of the dynamic object parameter when no-execute user opens the dashboard in Chapter FP',
        );
        //Validate the filter summary
        await since('Filter Summary of DashboardA2 should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('DashboardA2'))
            .toBe('(Country, Year)');
        await since('Filter Summary of DashboardM2 should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('DashboardM2'))
            .toBe('(Revenue, Profit)');
        await since('Filter Summary of DatasetA1 should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('DatasetA1'))
            .toBe('(Subcategory, Month of Year)');
        await since('Filter Summary of DatasetM1 should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('DatasetM1'))
            .toBe('(Freight, Profit Margin)');
        //Open the filter panel
        await filterPanel.openFilterPanel();
        //Verify the filter panel result
        await takeScreenshotByElement(
            await filterPanel.getFilterPanelDropdown(),
            'TC99378_17_8_filter panel',
            'Filter Panel with Dynamic Selections'
        );
        //Back to library Home
        await dossierPage.goToLibrary();
        //Open the dashbboard again to hit caches
        await libraryPage.openDossierById({
            projectId: NoExecuteAccessOnOPMultiple.project.id,
            dossierId: NoExecuteAccessOnOPMultiple.id,
        });
        await dossierPage.waitForCurtainDisappear();
        //Validate the result
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC99378_17_9',
            'No execute access on the selections of the dynamic object parameter when no-execute user opens the dashboard again',
        );
        //Validate the filter summary
        await since('Filter Summary of DashboardA2 should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('DashboardA2'))
            .toBe('(Country, Year)');
        await since('Filter Summary of DashboardM2 should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('DashboardM2'))
            .toBe('(Revenue, Profit)');
        await since('Filter Summary of DatasetA1 should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('DatasetA1'))
            .toBe('(Subcategory, Month of Year)');
        await since('Filter Summary of DatasetM1 should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('DatasetM1'))
            .toBe('(Freight, Profit Margin)');
        //Open the filter panel
        await filterPanel.openFilterPanel();
        //Verify the filter panel result
        await takeScreenshotByElement(
            await filterPanel.getFilterPanelDropdown(),
            'TC99378_17_9_filter panel',
            'Filter Panel with Dynamic Selections'
        );
        //Switch to Chapter ICS
        await toc.openPageFromTocMenu({ chapterName: 'ICS', pageName: 'Page 1' });
        await dossierPage.waitForCurtainDisappear();
        await dossierPage.sleep(3000);
        //Validate the result
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC99378_17_10',
            'No execute access on the selections of the dynamic object parameter when no-execute user opens the dashboard in Chapter ICS',
        );
    });
});