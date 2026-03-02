import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { browserWindow } from '../../../constants/index.js';
import { collabRecUser } from '../../../constants/collaborationPrivate.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';

describe('Collaboration Defects', () => {
    let { loginPage, libraryPage, groupDiscussion, filterPanel } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(collabRecUser);
        await setWindowSize(browserWindow);
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
        await libraryPage.openDefaultApp();
    });

    // [BCIN-5286] Discussion Thread Disabled for Shared Dashboard with Multiple Cubes and Filters
    it('[BCIN-5286_01] open create group discussion email notification by embedded filter', async () => {
        const createDiscussionLink =
            'https://mci-u6btx-dev.hypernow.microstrategy.com/MicroStrategyLibrary/app/B7CA92F04B9FAE8D941C3E9B7E0CD754/2D2ACCB70E466138E4FCE99AF0DBCF22/topic/6981cd6d042ef30034b2d0a7/share';
        await libraryPage.openDossierByUrl(createDiscussionLink);
        await since('1. embedded filter icon in group discussion should be enabled, instead it is disabled')
            .expect(await groupDiscussion.isFilterButtonEnabled({ messageIndex: 0, filterIndex: 0 }))
            .toBe(true);
        await groupDiscussion.applyEmbeddedFilter({ messageIndex: 0, filterIndex: 0 });
        await filterPanel.openFilterPanel();
        await takeScreenshotByElement(
            filterPanel.getFilterPanelDropdown(),
            'BCIN-5286_01',
            'Apply embedded filter in create discussion'
        );
    });

    it('[BCIN-5286_02] open mention user email notification in group discussion with embedded filter', async () => {
        const createDiscussionLink =
            'https://mci-u6btx-dev.hypernow.microstrategy.com/MicroStrategyLibrary/app/B7CA92F04B9FAE8D941C3E9B7E0CD754/2D2ACCB70E466138E4FCE99AF0DBCF22/K53--K46/channel/6981d080042ef30034b2d0b1/comment/6981d088042ef30034b2d0b5/share';
        await libraryPage.openDossierByUrl(createDiscussionLink);
        await since('1. embedded filter icon in group discussion should be enabled, instead it is disabled')
            .expect(await groupDiscussion.isFilterButtonEnabled({ messageIndex: 0, filterIndex: 0 }))
            .toBe(true);
        await groupDiscussion.applyEmbeddedFilter({ messageIndex: 0, filterIndex: 0 });
        await filterPanel.openFilterPanel();
        await takeScreenshotByElement(
            filterPanel.getFilterPanelDropdown(),
            'BCIN-5286_02',
            'Apply embedded filter in mention user'
        );
    });
});
