/* eslint-disable protractor/no-get-in-it */
import updateContentGroup from '../../../api/contentGroup/updateContentGroup.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { customCredentials } from '../../../constants/index.js';
import users from '../../../testData/users.json' assert { type: 'json' };

const specConfiguration = customCredentials('_cgem');

describe('ContentGroupErrorMessage', () => {
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    const admincredentials = {
        username: 'contentgroupadmin',
        password: '',
        webServerUsername: 'admin',
        webServerPassword: 'admin',
    };

    const credentials = specConfiguration.credentials;
    const username = credentials.username;
    const testerUser = users[username].id;

    const emptyGroup = "tester_auto_empty group - don't delete";
    const noContentAccessGroup = "tester_auto_no content access - don't delete";
    const noAccessGroup = "tester_auto_no access - don't delete";
    const deletedGroup = 'tester_auto_deleted';

    let { loginPage, libraryPage, sidebar } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await browser.url(browser.options.baseUrl);
        await libraryPage.waitForItemLoading();
    });

    it('[TC81868] Validate Content Group with empty error message', async () => {
        // Check empty content group message
        const url = await browser.getUrl();
        const emptyGroupUrl = url + '/contentGroup/B04EA52D4A5244AC8A7E99B69B790DC3';
        await browser.url(emptyGroupUrl);
        await libraryPage.waitForItemLoading();
        since('Group section for empty group should be empty')
            .expect(await libraryPage.isLibraryEmpty())
            .toBe(true);
        await since(`Message for empty group should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getEmptyLibraryMessage())
            .toBe('This content group is empty or you do not have View access to the content in it.');
        await takeScreenshotByElement(libraryPage.getEmptyLibrary(), 'TC81868_01', 'empty content group');
        since('emptyGroup should be existed')
            .expect(await sidebar.isGroupExisted(emptyGroup))
            .toBe(true);

        // Switch tab
        await sidebar.openAllSectionList();
        await sidebar.openGroupSection(emptyGroup);
        since('Group section for empty group should be empty')
            .expect(await libraryPage.isLibraryEmpty())
            .toBe(true);
        await since(`Message for empty group should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getEmptyLibraryMessage())
            .toBe('This content group is empty or you do not have View access to the content in it.');
        await takeScreenshotByElement(libraryPage.getEmptyLibrary(), 'TC81868_02', 'empty content group');

        // Check no content access content group message
        const url2 = await browser.getUrl();
        const noContentAccessGroupUrl = url2 + '/contentGroup/6E73AF1D46F541296EB240B76ECFFF01';
        await browser.url(noContentAccessGroupUrl);
        await libraryPage.waitForItemLoading();
        since('Group section for no content access should be empty')
            .expect(await libraryPage.isLibraryEmpty())
            .toBe(true);
        await since(`Message for no content access group should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getEmptyLibraryMessage())
            .toBe('This content group is empty or you do not have View access to the content in it.');
        await takeScreenshotByElement(libraryPage.getEmptyLibrary(), 'TC81868_03', 'no content access group');
        since('noContentAccessGroup should be existed')
            .expect(await sidebar.isGroupExisted(noContentAccessGroup))
            .toBe(true);

        // Switch tabs
        await sidebar.openAllSectionList();
        await sidebar.openGroupSection(noContentAccessGroup);
        since('Group section for no content access should be empty')
            .expect(await libraryPage.isLibraryEmpty())
            .toBe(true);
        await since(`Message for no content access group should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getEmptyLibraryMessage())
            .toBe('This content group is empty or you do not have View access to the content in it.');
        await takeScreenshotByElement(libraryPage.getEmptyLibrary(), 'TC81868_04', 'no content access group');
    });

    it('[TC81869] Validate Content Group with not exist error message', async () => {
        // Add user to no access content group
        const contentGroupId = '8305650444004C0432A3188461017A14';
        const updateContentGroupInfo = {
            operationList: [
                {
                    id: 1,
                    op: 'add',
                    path: '/recipients',
                    value: [
                        {
                            id: testerUser,
                        },
                    ],
                },
            ],
        };
        await updateContentGroup({ credentials: admincredentials, contentGroupId, updateContentGroupInfo });

        // Check open no access group message
        const url = await browser.getUrl();
        const noAccessGroupUrl = url + '/contentGroup/8305650444004C0432A3188461017A14';
        await browser.url(noAccessGroupUrl);
        await libraryPage.waitForItemLoading();
        since('Group section for no group access should be empty')
            .expect(await libraryPage.isLibraryEmpty())
            .toBe(true);
        await since(`Message for no group access should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getEmptyLibraryMessage())
            .toBe('This content group has been deleted or you do not have View access to it.');
        since('noAccessGroup should not be existed')
            .expect(await sidebar.isGroupExisted(noAccessGroup))
            .toBe(false);
        await takeScreenshotByElement(libraryPage.getEmptyLibrary(), 'TC81869_01', 'no access group');

        await sidebar.openAllSectionList();
        since(`All tab content count should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getGroupCountFromTitle('All'))
            .toBe(3);

        // Remove user from no access content group
        const updateContentGroupInfo2 = {
            operationList: [
                {
                    id: 1,
                    op: 'remove',
                    path: '/recipients',
                    value: [
                        {
                            id: testerUser,
                        },
                    ],
                },
            ],
        };
        await updateContentGroup({
            credentials: admincredentials,
            contentGroupId,
            updateContentGroupInfo: updateContentGroupInfo2,
        });

        await sidebar.openAllSectionList();
        since(`All tab content count should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getGroupCountFromTitle('All'))
            .toBe(1);

        // Check open deleted group message
        const url2 = await browser.getUrl();
        const deletedGroupUrl = url2 + '/contentGroup/A5CD826242DC61AB644B088D39C95AB7';
        await browser.url(deletedGroupUrl);
        await libraryPage.waitForItemLoading();
        since('Group section for deleted group should be empty')
            .expect(await libraryPage.isLibraryEmpty())
            .toBe(true);
        await since(`Message for no group access should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getEmptyLibraryMessage())
            .toBe('This content group has been deleted or you do not have View access to it.');
        since('deletedGroup should not be existed')
            .expect(await sidebar.isGroupExisted(deletedGroup))
            .toBe(false);
        await takeScreenshotByElement(libraryPage.getEmptyLibrary(), 'TC81869_02', 'deleted group');
    });
});

export const config = specConfiguration;
