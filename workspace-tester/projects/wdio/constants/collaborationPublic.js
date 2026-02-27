//dossier credentials
import * as dburl from './collaborationPrivate.js';

export const tagUserDossier = {
    id: '0B0F920142D1E68E69C168A1A58AC6DA',
    name: 'tagUserDossier',
    project: {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    },
};

export const atFilterDossier = {
    id: 'CD0B3A434EF79B0B658678B111C6FD05',
    name: 'atFilterDossier',
    project: {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    },
};

export const tagUserFilterDossier = {
    id: 'C0550936440FB5113BCBACB45B6891D8',
    name: 'tagUserFilterDossier',
    project: {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    },
};

export const checkCurrentPage = {
    id: 'ED1ED6734AF395B99E16AF881EE5AFA7',
    name: 'checkCurrentPage',
    chapter1: 'Chapter 1',
    page1: 'Page 1',
    page2: 'Page 2',
    project: {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    },
};

// User credentials
export const collab1 = {
    credentials: {
        username: 'collab1',
        password: '',
    },
};
export const collab2 = {
    credentials: {
        username: 'collab2',
        password: '',
    },
};

export const collab3 = {
    credentials: {
        username: 'collab3',
        password: '',
    },
};

export const collab4 = {
    credentials: {
        username: 'collab4',
        password: '',
    },
};

export const collab5 = {
    id: '7FFBC9B2416858E477A2B69A4CD5F8F1',
    credentials: {
        username: 'collab5',
        password: '',
    },
};

export const collab6 = {
    credentials: {
        username: 'collab6',
        password: '',
    },
};

export const comment1 = "it's an automation test with user mention comment.";
export const comment2 = "it's an automation test with @filter comment.";
export const comment3 = "it's an automation test with both tagging user and filter comment";
export const comment4 = "it's an automation test on page1";
export const comment5 = "it's an automation test on page2";
// export const dburl = 'postgresql://mstr_collab:47kA8vn5X5M8@' + constAdmin.domainIP + ':5432/mstr_collab';
// const dburlABA = 'postgresql://postgres:mstr123@localhost:5432/mstr_collab';
export const dburlTanzu = dburl.dburlTanzu;
// export const dburlTanzu =
//     'postgresql://mstr_collab:4Z1zCoZ6po@mci-ze4yt-dev.hypernow.microstrategy.com:30036/mstr_collab';
// const dburlVra = 'postgresql://xuyin1630390672:abcd1234@ts-pgsql11.labs.microstrategy.com:5432/xuyin1630390672';
// export function getDburl() {
//     if (constAdmin.domainIP.includes('mci-')) {
//         return dburlTanzu;
//     } else {
//         return dburlVra;
//     }
// }
