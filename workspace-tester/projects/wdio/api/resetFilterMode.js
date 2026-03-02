import { groupLog, groupLogEnd } from '../config/consoleFormat.js';

export default async function resetFilterMode(dossierName, dockMode) {
    groupLog('resetFilterMode by api');
    const { dossierPage, filterPanel, libraryPage } = browsers.pageObj1;
    await libraryPage.openDossier(dossierName);

    // Undock filter panel if it is already docked from the previous test suites

    const isOpen = await filterPanel.isMainPanelOpen();
    if (!isOpen) {
        await filterPanel.openFilterPanel();
    }
    const isDocked = await filterPanel.isPanelDocked();
    if (isDocked) {
        await filterPanel.undockFilterPanel();
    }
    // Randomly select filter panel mode (popup vs. dock)

    const result = await filterPanel.isPanelDocked();
    if (Math.random() < 0.5) {
        await filterPanel.dockFilterPanel();
        if (result) {
            console.log('INFO: Filter panel is in dock mode.');
        }
    } else {
        if (!result) {
            console.log('INFO: Filter panel is in pop-up mode.');
        }
    }
    await dossierPage.goToLibrary();
    groupLogEnd();
}
