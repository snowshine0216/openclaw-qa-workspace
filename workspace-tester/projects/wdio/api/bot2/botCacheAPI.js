import botV2RestAPI from './botV2API.js';

export async function deleteBotCache({ credentials, projectId, botId }) {
    const params = {
        projectId,
        botId,
        options: {
            url: `api/v2/bots/${botId}/caches/questionGroups`,
            method: 'DELETE',
        },
    };
    await botV2RestAPI({ group: 'Delete bot cache', credentials, params });
}

export async function disableBotCache({ credentials, projectId, botId }) {
    const params = {
        projectId,
        botId,
        options: {
            url: `api/v2/bots/${botId}`,
            method: 'PATCH',
        },
        json: {
            operationList: [
                {
                    op: 'replace',
                    path: '/config/cacheSettings/mode',
                    value: 0,
                },
            ],
        },
    };
    await botV2RestAPI({ group: 'Disable bot cache', credentials, params });
}

export async function enableBotFullCache({ credentials, projectId, botId }) {
    const params = {
        projectId,
        botId,
        options: {
            url: `api/v2/bots/${botId}`,
            method: 'PATCH',
        },
        json: {
            operationList: [
                {
                    op: 'replace',
                    path: '/config/cacheSettings/mode',
                    value: 2,
                },
            ],
        },
    };
    await botV2RestAPI({ group: 'Enable bot full cache', credentials, params });
}
