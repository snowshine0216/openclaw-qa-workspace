import { lockPageSizeCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('lock page size', () => {
    const dossier = {
        id: '2CDCCAB20847DCD87A5A63AC67FC662A',
        name: 'LockPageSize',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const minimumHeightDossier = {
        id: '503853274649053A1BAC5FB9F9F88B53',
        name: 'MinimumHeight',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const panelStackLockPageDossier = {
        id: '98D16D9AAE48BED05E7E248DB9B2EF4C',
        name: 'Auto_panelStack_lockPageSize',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const classicThemeLockPageNotSetPaddingDossier = {
        id: 'C64312367242309728AF71A108D2E951',
        name: 'classic theme + no padding set + lock page size',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let {
        libraryPage,
        loginPage,
        dossierPage,
        libraryAuthoringPage,
        dossierAuthoringPage,
        contentsPanel,
        formatPanel,
        baseContainer,
        toc,
        dashboardFormattingPanel,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(lockPageSizeCredentials);
        await setWindowSize(browserWindow);
    });

    it('[TC99180_1] Dossier | Lock page size on web', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
        await dashboardFormattingPanel.open();
        await dashboardFormattingPanel.clickLockPageSizeCheckBox();
        await dashboardFormattingPanel.clickLockPageSizeHelperIcon();
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getDashboardFormattingPopUp(),
            'TC99180_1',
            'Lock page size helper icon'
        );
        await dashboardFormattingPanel.openConsumptionViewDropDown();
        await takeScreenshotByElement(
            await dashboardFormattingPanel.getDashboardFormattingPopUp(),
            'TC99180_1',
            'Default Zoom in Library panel'
        );
    });

    it('[TC99180_2] Dossier | Lock page size with minimum height web', async () => {
        await libraryPage.editDossierByUrl({
            projectId: minimumHeightDossier.project.id,
            dossierId: minimumHeightDossier.id,
        });
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await takeScreenshotByElement(
            await formatPanel.getFormatDetail(),
            'TC99180_2',
            'initial status for minimum height page level'
        );
        await dashboardFormattingPanel.open();
        await dashboardFormattingPanel.clickLockPageSizeCheckBox();
        await dashboardFormattingPanel.clickOkButton();

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await takeScreenshotByElement(
            await formatPanel.getFormatDetail(),
            'TC99180_2',
            'minimum height disabled on page level'
        );

        await libraryAuthoringPage.clickComponentFromLayerPanel('Information Window 1');
        await libraryAuthoringPage.clickComponentFromLayerPanel('Panel IW');
        await takeScreenshotByElement(
            await formatPanel.getFormatDetail(),
            'TC99180_2',
            'minimum height for IW still enabled'
        );

        await libraryAuthoringPage.clickComponentFromLayerPanel('Panel 1');
        await takeScreenshotByElement(
            await formatPanel.getFormatDetail(),
            'TC99180_2',
            'minimum height for panel stack still enabled'
        );

        await dossierAuthoringPage.goToLibrary();
        const notSave = dossierAuthoringPage.getDoNotSaveButton();
        if (await notSave.isExisting()) {
            await dossierAuthoringPage.notSaveDossier();
        }
    });

    it('[TC99180_3] Lock page size panel stack', async () => {
        const url =
            browser.options.baseUrl + `app/${panelStackLockPageDossier.project.id}/${panelStackLockPageDossier.id}`;
        await libraryPage.openDossierByUrl(url.toString());
        await dossierPage.resetDossierIfPossible();

        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });

        await baseContainer.clickOnContainerTitle('Viz');
        await baseContainer.hoverOnMaximizeBtn();
        let tooltipText = (await dossierAuthoringPage.getMojoTooltip().getText()).trim();
        await expect(tooltipText).toBe('Maximize');

        await baseContainer.clickMaximizeBtn();
        const panels = await $$('.mstrmojo-DocPanelStack');
        await takeScreenshotByElement(panels[0], 'TC99180_3', 'Maximized panel stack in lock page dashboard');

        await baseContainer.clickOnContainerTitle('Viz');
        await baseContainer.hoverOnRestoreBtn();
        tooltipText = (await dossierAuthoringPage.getMojoTooltip().getText()).trim();
        // BCDA-7122: restore button's tooltip should be correct
        await expect(tooltipText).toBe('Restore');
    });

    it('[TC99180_4] Classic theme lock page size and no padding', async () => {
        //BCDA-7201
        const url =
            browser.options.baseUrl +
            `app/${classicThemeLockPageNotSetPaddingDossier.project.id}/${classicThemeLockPageNotSetPaddingDossier.id}`;
        await libraryPage.openDossierByUrl(url.toString());
        await dossierPage.resetDossierIfPossible();

        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        // sleep for 2 seconds to make sure the scroll bar is disappeared before taking screenshot
        await browser.pause(2000);
        const dossierView = await dossierPage.getDossierView();
        await takeScreenshotByElement(dossierView, 'TC99180_4', 'Classic theme lock page size and no padding');
    });
});
