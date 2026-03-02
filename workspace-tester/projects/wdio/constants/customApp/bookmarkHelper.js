import createCustomApp from '../../api/customApp/createCustomApp.js';

let { dossierPage, libraryPage, share, shareDossier, bookmark, notification, toc, promptEditor } = browsers.pageObj1;

export const bmUserNotInLibrary = {
    credentials: {
        username: 'bmusernotinlibrary',
        password: '',
    },
};

export const bmUser2NotInLibrary = {
    credentials: {
        username: 'bmuser2notinlibrary',
        fullname: 'bmUser2NotInLibrary',
        password: '',
    },
};

export const bmUserInLibrary = {
    credentials: {
        username: 'bmuserinlibrary',
        password: '',
    },
};

export const bmUser2InLibrary = {
    credentials: {
        username: 'receivebminlibrary',
        password: '',
    },
};

export const dossier = {
    id: '178DCBD847C2F4FD029DE69A220ACB66',
    name: 'Dossier with PS + filter + link',
    project: {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    },
    chapter1: 'link to this dossier',
    chapter2: 'Chapter 1',
    page: 'Page 1',
};

// const dossierLinkedMci = {
//     id: '6EF1B9D04AE8FF34D2D23691696367FD',
//     name: '1.Dossier with multi-layer links',
//     project: {
//         id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
//         name: 'MicroStrategy Tutorial',
//     },
//     chapter: 'link to other dossier',
//     page: 'Page 1',
//     chapter2: 'link to dossier target 1',
//     page2: 'page 1',
// };

// const dossierLinkedLocal = {
//     id: 'DBFA8EC78243E9D8122D289659A851A6',
//     name: 'Auto_Android2',
//     project: {
//         id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
//         name: 'MicroStrategy Tutorial',
//     },
//     chapter: 'link to other dossier',
//     page: 'Page 1',
//     chpater2: 'link to this dossier',
//     page2: 'Page 1',
// };

// export function getLinkedDossier() {
//     if (domainIP.includes('mci-')) {
//         return dossierLinkedMci;
//     } else {
//         return dossierLinkedLocal;
//     }
// }

export const dossierLinked2 = {
    id: '694844DF4F8E5584B8180896B0FBD2D8',
    name: '3.Dossier with DE + all filters + link',
    project: {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    },
};

export const dossierBmLinksNoPrompt = {
    id: '7A520F8574495A11C57DEDB8D09C3442',
    name: 'BM_Links_noPrompt',
    project: {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    },
    chapter1: 'link to itself',
    chapter2: 'link to dossier target 1',
    ch1_p1: 'link to current page',
    ch1_p2: 'link to other page',
    ch2_p1: 'page 1',
    ch2_p2: 'page 2',
};

export const dossierNoPromptLink1 = {
    id: 'F59572F94E8F3683508069AB4BACEE30',
    name: 'target1 with all links',
    project: {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    },
    chapter1: 'link to itself',
    chapter2: 'link to base dossier',
    ch1_p1: 'link to current page',
    ch1_p2: 'link to other page',
    ch2_p1: 'link to source page',
    ch2_p2: 'link to other page',
};

export const rsdSource = {
    id: '6AD63FFC614E2F9AE4C0FEBB5F4B56E9',
    name: 'RSDWithLinking',
    project: {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    },
    chapter: 'Layout 1',
    chpater2: 'Layout 2',
};

export const promptDossierSource = {
    id: '4E10CA44D744C76C238EC1B5C04C64B6',
    name: 'ValuePromptDossier-Source',
    project: {
        id: '61ABA574CA453CCCF398879AFE2E825F',
        name: 'Platform Analytics',
    },
    chapter: 'Chapter 1',
    page1: 'Page 1',
    page2: 'Page 2',
};

export const promptDossierTarget = {
    id: '52576385422A3F9F174B97BE6E361116',
    name: 'Analysis Document',
    project: {
        id: '61ABA574CA453CCCF398879AFE2E825F',
        name: 'Platform Analytics',
    },
};

export async function createCustomAppAndOpenIt(usercredentials, customAppInfo, prompt = false) {
    let customAppId = await createCustomApp({ credentials: usercredentials, customAppInfo: customAppInfo });
    await libraryPage.openCustomAppById({ id: customAppId, dossier: true });
    if (prompt) {
        await promptEditor.run();
    }
    await browser.sleep(2000);
    await dossierPage.waitForDossierLoading();
    return customAppId;
}

export async function removeDossierAndCreateCustomAppAndOpenIt(
    usercredentials,
    customAppInfo,
    dossierList,
    prompt = false
) {
    await removeDossierFromLibrary(usercredentials, dossierList);
    let customAppId = await createCustomAppAndOpenIt(usercredentials, customAppInfo, prompt);
    return customAppId;
}

export async function removeDossierAndOpenCustomApp(usercredentials, dossierList, customAppId, prompt = false) {
    await removeDossierFromLibrary(usercredentials, dossierList);
    await libraryPage.openCustomAppById({ id: customAppId, dossier: true });
    if (prompt) {
        await promptEditor.run();
    }
    await dossierPage.waitForDossierLoading();
}

export async function createBMandClose(bmList) {
    await bookmark.openPanel();
    for (const bmName of bmList) {
        await bookmark.addNewBookmark(bmName);
    }
    await bookmark.closePanel();
}

export async function switchPageAndCreateBMandClose(pageContent, bmName) {
    await toc.openMenu();
    await toc.goToPage(pageContent);
    await createBMandClose(bmName);
}

export async function shareBookmarkFromShareWindows(bookmarkList, includeBookmark = true) {
    await share.openSharePanel();
    await share.openShareDossierDialog();
    if (includeBookmark) {
        await shareDossier.includeBookmark();
    }
    await shareDossier.openBMList();
    await shareDossier.selectSharedBookmark(bookmarkList);
    await shareDossier.closeShareBookmarkDropDown();
}

export async function shareBookmarkAddRecipients(userList, message = '') {
    if (message != '') {
        await shareDossier.addMessage(message);
    }
    for (const user of userList) {
        await shareDossier.searchRecipient(user);
    }
    await shareDossier.selectRecipients(userList);
    await shareDossier.shareDossier();
}

export async function createBookmarkAndShareFromBMPanel(bmName, userList, message = '') {
    await bookmark.openPanel();
    await bookmark.addNewBookmark(bmName);
    await bookmark.shareBookmark(bmName);
    await shareBookmarkAddRecipients(userList, message);
}

export async function removeDossierFromLibrary(usercredentials, dossierList) {
    // go to default app
    await libraryPage.openDefaultApp();
    for (const dossier of dossierList) {
        //remove dossier in recipient library home
        await libraryPage.removeDossierFromLibrary(usercredentials, dossier);
    }
}

export async function recipientRemoveNotificationsAndDossierThenSwitchUser(
    sender,
    receiver,
    dossierList,
    customAppId,
    prompt = false
) {
    // recipient remove dossier from library
    if (prompt) {
        await libraryPage.openDefaultApp();
        await libraryPage.switchUser(receiver.credentials);
        await libraryPage.openCustomAppById({ id: customAppId, dossier: true });
        await promptEditor.run();
    } else {
        await libraryPage.switchUser(receiver.credentials);
    }
    // remove notificaitons
    await notification.openPanelAndWaitListMsg();
    await notification.clearAllMsgs();
    await notification.closePanel();

    await removeDossierFromLibrary(receiver.credentials, dossierList);

    // switch user
    await libraryPage.switchUser(sender.credentials);
    await libraryPage.openCustomAppById({ id: customAppId, dossier: true });
    if (prompt) {
        await promptEditor.run();
    }
    await libraryPage.sleep(2000);
    await dossierPage.waitForDossierLoading();
}

export async function recipientRemoveNotificationsThenSwitchUser(sender, receiver, customAppId) {
    // recipient remove dossier from library
    await libraryPage.switchUser(receiver.credentials);
    // remove notificaitons
    await notification.openPanelAndWaitListMsg();
    await notification.clearAllMsgs();
    await notification.closePanel();

    // switch user
    await libraryPage.openCustomAppById({ id: customAppId, dossier: true });
    await libraryPage.switchUser(sender.credentials);
}
