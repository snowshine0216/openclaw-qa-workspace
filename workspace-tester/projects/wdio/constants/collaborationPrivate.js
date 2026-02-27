import * as constAdmin from './collaborationAdmin.js';

// export const browserWindow = {
//     browserInstance: browsers.browser1,
//     width: 1600,
//     height: 1200,
// };

// export const mobileWindow = {
//     browserInstance: browsers.browser1,
//     width: 360,
//     height: 640,
// };

//dossier credentials
export const privateDossier1 = {
    id: '34C0778E4C85782CDEDB608FBE2B4251',
    name: 'PrivateDossier1',
    project: {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    },
};

export const baseDossierHM = {
    id: 'B952E9784CC6486E532835915EE9C750',
    name: 'PABlankDossier',
    project: {
        id: '5FDF3E5C4CCB76AA7E3292A4C47DECB8',
        name: 'Platform Analytics',
    },
};

export let rsdTest;
{
    if (constAdmin.domainIP.includes('mci-')) {
        rsdTest = {
            id: '688551A69743F9B407C66BA909F038E9',
            name: 'RSDGraph',
            project: {
                id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
                name: 'MicroStrategy Tutorial',
            },
        };
    } else {
        rsdTest = {
            id: 'AF4DFDA9465E0F12C3930EB96979C647',
            name: 'RSDGraph',
            project: {
                id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
                name: 'MicroStrategy Tutorial',
            },
        };
    }
}

// User credentials
export const tc1user1 = {
    credentials: {
        username: 'tc1user1',
        password: '',
    },
};

//tc1user2 has no dossier in library
export const tc1user2 = {
    id: '95ECFD9140EC41256E7E739D2D2F8BF0',
    credentials: {
        username: 'tc1user2',
        password: '',
    },
};

export const tc1user3 = {
    id: '4D89031244B3ECE7DED32F9823D6A148',
    credentials: {
        username: 'tc1user3',
        password: '',
    },
};

export const tc1user4 = {
    id: 'C9B0E36F4E185CFDED96B985889DFA2C',
    credentials: {
        username: 'tc1user4',
        password: '',
    },
};

export const groupuser1 = {
    id: '38F5482240009140C54F92AE88A017ED',
    credentials: {
        username: 'tc1group1',
        password: '',
    },
};

export const tc2user1 = {
    id: '04BE82C34B2639E9628E3A894B8C82A7',
    credentials: {
        username: 'tc2user1',
        password: '',
    },
};

export const tc2user2 = {
    id: '406DD2FD49ABABA6D33BA391D352A2C1',
    credentials: {
        username: 'tc2user2',
        password: '',
    },
};

export const tc2user3 = {
    id: '708D916A4DDFF6FDBED0DBAD48FB9F37',
    credentials: {
        username: 'tc2user3',
        password: '',
    },
};

export const tc2group1 = {
    id: '33EA561142EAA117D77BB58934C8073B',
    credentials: {
        username: 'tc2group1',
        password: '',
    },
};

export const tc2group2 = {
    id: '5E71D05340E6231DCE4FE3A69AA05137',
    credentials: {
        username: 'tc2group2', // no dossier
        password: '',
    },
};
export const tc3user1 = {
    credentials: {
        username: 'tc3user1',
        password: '',
    },
};

// tc3user2 has no dossier in Library
export const tc3user2 = {
    id: '5F6112AD48E6CE8B3BA7BF80A7A84638',
    credentials: {
        username: 'tc3user2',
        password: '',
    },
};

export const tc3user3 = {
    id: 'B6051E3042BF1FD5ED00B29BF056984F',
    credentials: {
        username: 'tc3user3',
        password: '',
    },
};

export const tc3user4 = {
    credentials: {
        username: 'tc3user4',
        password: '',
    },
};

export const tc4user1 = {
    credentials: {
        username: 'tc4user1',
        password: '',
    },
};

export const tc4user2 = {
    id: 'B98FB35247B05F8773067CB174E3706D',
    credentials: {
        username: 'tc4user2',
        password: '',
    },
};

export const tc4user3 = {
    credentials: {
        username: 'tc4user3',
        password: '',
    },
};

export const tc4user4 = {
    credentials: {
        username: 'tc4user4',
        password: '',
    },
};

export const tc4user5 = {
    credentials: {
        username: 'tc4user5',
        password: '',
    },
};

export const tc4user6 = {
    credentials: {
        username: 'tc4user6',
        password: '',
    },
};

export const tc4user7 = {
    id: '9DD1B8BF4A49AFD5374CF8AD6A1AF8B0',
    credentials: {
        username: 'tc4user7',
        password: '',
    },
};

export const tc5user1 = {
    id: '543EB624428B23B19F42EBB0C2322169',
    credentials: {
        username: 'tc5user1',
        password: '',
    },
};

export const tc5user2 = {
    id: 'DE7A8640417E4F874ADB4F912A4417E7',
    credentials: {
        username: 'tc5user2',
        password: '',
    },
};

export const tc5user3 = {
    id: '0EF3B34145D2306E129686BB3D884029',
    credentials: {
        username: 'tc5user3',
        password: '',
    },
};

export const nocollab = {
    credentials: {
        username: 'nocollab',
        fullname: 'noCollab',
        password: '',
    },
};

export const partaccess = {
    id: '57C5BA2149E49B2D556E2AB8736DCAA3',
    credentials: {
        username: 'partAccess',
        password: '',
    },
};

export const test100 = {
    credentials: {
        username: 'test100',
        password: '',
    },
};

export const collabRecUser = {
    id: 'B527F7A88F487D40CC9F22A54791406B',
    username: 'collab_rec',
    password: '',
};

// export const dburl = 'postgresql://mstr_collab:47kA8vn5X5M8@' + constAdmin.domainIP + ':5432/mstr_collab';
// const dburlABA = 'postgresql://postgres:mstr123@localhost:5432/mstr_collab';
export const dburlTanzu =
    'postgresql://mstr_collab:4Z1zCoZ6po@mci-ze4yt-dev.hypernow.microstrategy.com:30036/mstr_collab';
// comment following lines since we will only run automation on vra machine
// const dburlVra = 'postgresql://xuyin1630390672:abcd1234@ts-pgsql11.labs.microstrategy.com:5432/xuyin1630390672';
// export function getDburl() {
//     if (constAdmin.domainIP.includes('mci-')) {
//         return dburlTanzu;
//     } else {
//         return dburlVra;
//     }
// }

export const group = 'tc1group';
export const tc2group = 'tc2group';
export const groupManage = 'WebPrivateTest';
export const tc4group = 'tc4group';
export const noMemberGroup = 'NoMemberGroup';
export const addedHistoryMsg = ' has been added to the discussion.';
export const removedHistoryMsg = ' has been removed from the discussion.';
export const cantSeeHistoryMsg = ' cannot see the message because they have not been invited to this discussion.';
export const changeNameHistoryMsg = ' has changed the discussion name to ';
export const invitedNotification = 'You were invited to a discussion in ';
export const invitedDossierNotification = 'You were invited to the ';
export const newMsgNotification = 'You have 1 new message in a discussion in ';
export const newMsgDossierNotification = 'You have 1 new message in ';
export const newMsgsNotification = 'You have 2 new messages in ';
export const new3MsgsNotification = 'You have 3 new messages in ';
export const startDiscussionNotification = ' has started a discussion with you in ';
export const inNewDossiereDeletedNotification = ' in a dossier has been deleted.';
export const new2MentionsNotification = 'You have 2 new mentions in ';

export const message1 = 'test for creating discussion with one user';
export const message2 = 'test for creating discussion with group';
export const groupName1 = 'One User Discussion';
export const groupName2 = 'Test for remove user';
export const groupName3 = 'Post msg in discussion';
export const groupName4 = 'Delete msg in discussion';
export const discussionName1 = 'Test for invite user from about panel';
export const discussionName2 = 'Test for invite user in detail panel';
export const discussionName3 = 'Test for mute discussion';
export const message3 = 'test for notification - dossier not in Library,merged,mention user';
export const message4 = 'test for notification - dossier in Library, not merged,mention user';
export const message6 = 'test for notificationn - dossier in library, not merged, not mention user';
export const message5 = 'invite users in discussion detail panel';
export const message7 = 'test for remove user';
export const message8 = 'test for invite user from about panel';
export const renameDiscussion = 'renameDiscussion';
export const emptyNotificationTxt = 'No recent notifications';
export const message9 = 'test post public comments for partaccess user';
export const message10 = 'test post private comments for partaccess user';
