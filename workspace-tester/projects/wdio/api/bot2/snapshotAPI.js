import botV2RestAPI from './botV2API.js';

export async function addBotV2SnapshotsByAPI({ credentials, projectId, botId, questionId }) {
    const params = {
        projectId,
        botId,
        options: {
            url: `api/questions/${projectId}:${botId}:${questionId}`,
            method: 'PATCH',
        },
        json: { operationList: [{ op: 'replace', path: '/snapshot', value: false }] },
    };
    await botV2RestAPI({ group: 'Adding bot v2 snapshot', credentials, params });
}

export async function setBotV2SnapshotsSortByAPI({ credentials, projectId, botId, sortBy }) {
    const params = {
        projectId,
        botId,
        options: {
            url: `api/questions?botId=${botId}`,
            method: 'PATCH',
        },
        json: { operationList: [{ op: 'replace', path: '/snapshotSortBy', value: sortBy }] },
    };
    await botV2RestAPI({ group: `Set the sort by of snapshots to: ${sortBy}`, credentials, params });
}

export async function clearBotV2SnapshotsByAPI({ credentials, projectId, botId }) {
    const params = {
        projectId,
        botId,
        options: {
            url: `api/questions?type=snapshots&botIds=${botId}`,
            method: 'DELETE',
        },
    };
    await botV2RestAPI({ group: 'Clearing bot v2 snapshots', credentials, params });
}

export default {
    addBotV2SnapshotsByAPI,
    setBotV2SnapshotsSortByAPI,
    clearBotV2SnapshotsByAPI,
};
