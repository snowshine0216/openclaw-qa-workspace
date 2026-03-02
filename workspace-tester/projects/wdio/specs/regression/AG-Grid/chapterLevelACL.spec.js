import { customCredentials } from '../../../constants/index.js';
import * as consts from '../../../constants/visualizations.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('') };
const { credentials } = specConfiguration;

//npm run wdio -- --baseUrl=https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary/  --spec 'specs/regression/AG-Grid/chapterLevelACL.spec.js'
describe('Chapter Level ACL', () => {
    const tutorialProject = {
        id: 'B628A31F11E7BD953EAE0080EF0583BD',
        name: 'New MicroStrategy Tutorials',
    };
    const ChapterLevelE2E = {
        id: '7094FA8441F52C2FC1BB98A5D26182F6',
        name: 'Chapter Level ACL E2E',
        project: tutorialProject,
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    const uu1 = {
        credentials: {
            username: 'uu1',
            password: '',
        },
    };

    const uu2 = {
        credentials: {
            username: 'uu2',
            password: '',
        },
    };

    const uu3 = {
        credentials: {
            username: 'uu3',
            password: '',
        },
    };

    let { dossierAuthoringPage, dossierPage, libraryPage, manageAccessEditor, loginPage } = browsers.pageObj1;

    beforeEach(async () => {
        if (!(await loginPage.isLoginPageDisplayed())) {
            await browser.url(new URL('auth/ui/loginPage', browser.options.baseUrl).toString(), 100000);
        }
        await loginPage.login(consts.tqmsUser.credentials);
        await setWindowSize(browserWindow);
        // Reset the dashboard chapter level acl setting to make sure the following test can run successfully
        const url = browser.options.baseUrl + `app/${tutorialProject.id}/${ChapterLevelE2E.id}/edit`;
        await libraryPage.openDossierByUrl(url.toString());
        await manageAccessEditor.openManageAccessEditor('Chapter 1');
        await manageAccessEditor.setPulldown('Everyone who can view this dashboard');
        await manageAccessEditor.switchChapterInEditor('Chapter 2');
        await manageAccessEditor.setPulldown('Everyone who can view this dashboard');
        await manageAccessEditor.clickButton('Apply');
        await dossierAuthoringPage.clickSaveDossierButtonWithWait();
    });

    it('[TC95907] Chapter Level ACL E2E', async () => {
        const url = browser.options.baseUrl + `app/${tutorialProject.id}/${ChapterLevelE2E.id}/edit`;
        await libraryPage.openDossierByUrl(url.toString());

        await manageAccessEditor.openManageAccessEditor('Chapter 1');
        await since('Chapter 1 is locked should be #{expected}, instead we have #{actual}')
            .expect(await manageAccessEditor.chapterIsLocked('Chapter 1'))
            .toBe(false);
        await since('Chapter 2 is locked should be #{expected}, instead we have #{actual}')
            .expect(await manageAccessEditor.chapterIsLocked('Chapter 2'))
            .toBe(false);

        // Configure the chapter level acl for chapter 1 and validate selections
        await manageAccessEditor.switchPulldown('Everyone who can view this dashboard', 'Only users selected');
        await manageAccessEditor.searchUserGroup('uu');
        await manageAccessEditor.selectFromSuggestList('uu1');
        await manageAccessEditor.clickAddUserButton();
        await since('User "uu1" is added should be #{expected}, instead we have #{actual}')
            .expect(await manageAccessEditor.userOrGroupIsAdded('uu1'))
            .toBe(true);
        await since('User "uu1" is checked should be #{expected}, instead we have #{actual}')
            .expect(await manageAccessEditor.userOrGroupIsChecked('uu1'))
            .toBe(true);
        await since('Chapter 1 is locked should be #{expected}, instead we have #{actual}')
            .expect(await manageAccessEditor.chapterIsLocked('Chapter 1'))
            .toBe(true);
        await since('Chapter 2 is locked should be #{expected}, instead we have #{actual}')
            .expect(await manageAccessEditor.chapterIsLocked('Chapter 2'))
            .toBe(false);

        await manageAccessEditor.clickButton('Apply');
        await manageAccessEditor.openManageAccessEditor('Chapter 1');
        await since('User "uu1" is checked should be #{expected}, instead we have #{actual}')
            .expect(await manageAccessEditor.userOrGroupIsChecked('uu1'))
            .toBe(true);
        await since('Chapter 1 is locked should be #{expected}, instead we have #{actual}')
            .expect(await manageAccessEditor.chapterIsLocked('Chapter 1'))
            .toBe(true);
        await since('Chapter 2 is locked should be #{expected}, instead we have #{actual}')
            .expect(await manageAccessEditor.chapterIsLocked('Chapter 2'))
            .toBe(false);

        // Configure the chapter level acl for chapter 2
        await manageAccessEditor.switchChapterInEditor('Chapter 2');
        await manageAccessEditor.switchPulldown('Everyone who can view this dashboard', 'Only users selected');
        await manageAccessEditor.searchUserGroup('uu');
        await manageAccessEditor.selectFromSuggestList('uu2');
        await manageAccessEditor.searchUserGroup('uu');
        await manageAccessEditor.selectFromSuggestList('uu3');
        await manageAccessEditor.clickAddUserButton();
        await since('User "uu1" is added should be #{expected}, instead we have #{actual}')
            .expect(await manageAccessEditor.userOrGroupIsAdded('uu1'))
            .toBe(false);
        await since('User "uu2" is checked should be #{expected}, instead we have #{actual}')
            .expect(await manageAccessEditor.userOrGroupIsChecked('uu2'))
            .toBe(true);
        await since('User "uu3" is checked should be #{expected}, instead we have #{actual}')
            .expect(await manageAccessEditor.userOrGroupIsChecked('uu3'))
            .toBe(true);
        await since('Chapter 1 is locked should be #{expected}, instead we have #{actual}')
            .expect(await manageAccessEditor.chapterIsLocked('Chapter 1'))
            .toBe(true);
        await since('Chapter 2 is locked should be #{expected}, instead we have #{actual}')
            .expect(await manageAccessEditor.chapterIsLocked('Chapter 2'))
            .toBe(true);

        await manageAccessEditor.searchInSelectedList('uu3');
        await manageAccessEditor.checkUserOrGroupFromExistingList('uu3');
        await manageAccessEditor.searchInSelectedList('');
        await since('User "uu2" is checked should be #{expected}, instead we have #{actual}')
            .expect(await manageAccessEditor.userOrGroupIsChecked('uu2'))
            .toBe(true);
        await since('User "uu3" is checked should be #{expected}, instead we have #{actual}')
            .expect(await manageAccessEditor.userOrGroupIsChecked('uu3'))
            .toBe(false);
        await since('User "uu3" is added should be #{expected}, instead we have #{actual}')
            .expect(await manageAccessEditor.userOrGroupIsAdded('uu3'))
            .toBe(true);
        await since('Chapter 1 is locked should be #{expected}, instead we have #{actual}')
            .expect(await manageAccessEditor.chapterIsLocked('Chapter 1'))
            .toBe(true);
        await since('Chapter 2 is locked should be #{expected}, instead we have #{actual}')
            .expect(await manageAccessEditor.chapterIsLocked('Chapter 2'))
            .toBe(true);

        await manageAccessEditor.toggleViewSelectedButton();
        await since('User "uu2" is checked should be #{expected}, instead we have #{actual}')
            .expect(await manageAccessEditor.userOrGroupIsChecked('uu2'))
            .toBe(true);
        await since('User "uu3" is added should be #{expected}, instead we have #{actual}')
            .expect(await manageAccessEditor.userOrGroupIsAdded('uu3'))
            .toBe(false);

        await manageAccessEditor.toggleViewSelectedButton();
        await since('User "uu2" is checked should be #{expected}, instead we have #{actual}')
            .expect(await manageAccessEditor.userOrGroupIsChecked('uu2'))
            .toBe(true);
        await since('User "uu3" is added should be #{expected}, instead we have #{actual}')
            .expect(await manageAccessEditor.userOrGroupIsAdded('uu3'))
            .toBe(true);

        await manageAccessEditor.clickButton('Apply');

        // Save the dashboard
        await dossierAuthoringPage.clickSaveDossierButtonWithWait();

        // Relogin as user "uu1" which only has access to Chapter 1
        await loginPage.relogin(uu1.credentials);
        await libraryPage.openDossierByUrl(url.toString());
        await since('User "uu1" can see Chapter 1 is #{expected}, instead we have #{actual}')
            .expect(await manageAccessEditor.chapterIsDisplayedInTOC('Chapter 1'))
            .toBe(true);
        await since('User "uu1" can see Chapter 2 is #{expected}, instead we have #{actual}')
            .expect(await manageAccessEditor.chapterIsDisplayedInTOC('Chapter 2'))
            .toBe(false);

        // Relogin as user "uu2" which only has access to Chapter 2
        await loginPage.relogin(uu2.credentials);
        await libraryPage.openDossierByUrl(url.toString());
        await since('User "uu2" can see Chapter 1 is #{expected}, instead we have #{actual}')
            .expect(await manageAccessEditor.chapterIsDisplayedInTOC('Chapter 1'))
            .toBe(false);
        await since('User "uu2" can see Chapter 2 is #{expected}, instead we have #{actual}')
            .expect(await manageAccessEditor.chapterIsDisplayedInTOC('Chapter 2'))
            .toBe(true);

        // Relogin as user "uu3" which has no access to Chapter 1 or Chapter 2
        await loginPage.relogin(uu3.credentials);
        await libraryPage.openDossierByUrl(url.toString());
        await manageAccessEditor.clickShowDetails();
        await since('User "uu3" see the error message is #{expected}, instead we have #{actual}')
            .expect(
                await manageAccessEditor.errorMsgIsDisplayed(
                    '(You have been denied access to all chapters of this dashboard. Please contact Administrator for help.)'
                )
            )
            .toBe(true);
    });
});
export const config = specConfiguration;
