import botV2RestAPI from './botV2API.js';

export async function updateBotV2StatusByAPI({ credentials, projectId, botId, isActive }) {
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
                    path: '/config/general/active',
                    value: isActive,
                },
            ],
        },
    };
    await botV2RestAPI({ group: 'Update bot v2 active status', credentials, params });
}
