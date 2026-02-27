import { v4 as uuidv4 } from 'uuid';

export const CONFIGURATION_PROJECT_ID = '38A062302D4411D28E71006008960167';
/**
 *
 * sts: nugget status, 1: indexing, 2: ready, 3: failed, 4: unloaded
 * pid: project id, it is always '38A062302D4411D28E71006008960167' for configuration object
 */
export function getNuggetObjectInfo({ nuggetName = 'nugget to test', fileName = 'test_nuggets.xlsx', rights = 255 }) {
    const nuggetInfo = {
        save: [
            {
                acg: 255,
                cjcmd: {
                    cmms: [],
                },
                def: {
                    collection_id: getFakeGuid(),
                    filel: '',
                    filet: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    fn: fileName,
                    indext: {
                        day: 30,
                        day_of_week: 6,
                        do: 0,
                        dt: -100,
                        dtm: 0,
                        hour: 0,
                        ig: false,
                        minute: 0,
                        month: 12,
                        sec: 0,
                        srs: 0,
                        tms: 0,
                        week: 5,
                        year: 1899,
                    },
                    nu: 1,
                    nug: -1,
                    sts: 4,
                    upl: {
                        day: 30,
                        day_of_week: 6,
                        do: 0,
                        dt: -100,
                        dtm: 0,
                        hour: 0,
                        ig: false,
                        minute: 0,
                        month: 12,
                        sec: 0,
                        srs: 0,
                        tms: 0,
                        week: 5,
                        year: 1899,
                    },
                },
                did: getFakeGuid(),
                lcl: 1033,
                n: [
                    {
                        lcl: 1033,
                        n: `${nuggetName}-${getFakeGuid()}`,
                    },
                ],
                nct: '2024-02-21T05:37:58.940Z',
                nmdt: '2024-02-21T05:42:35.566Z',
                owid: '54F3D26011D2896560009A8E67019608',
                parent_id: '62EA9710210B4CC7A401527A9F70153D',
                pid: CONFIGURATION_PROJECT_ID,
                scu: {
                    acl: {
                        it_c: [
                            {
                                deny: false,
                                inheritable: false,
                                rights,
                                tp: 1,
                                trustee: 'C82C6B1011D2894CC0009D9F29718E4F',
                            },
                        ],
                    },
                },
                sta: 0,
                stp: 23040,
                tp: 90,
                vr: 'FB9937EA3D4F279FA029409ECB4E6A45',
            },
        ],
    };
    return nuggetInfo;
}

function getFakeGuid() {
    const uuid = uuidv4();
    return uuid.replace(/-/g, '');
}
