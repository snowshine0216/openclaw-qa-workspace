import botV2RestAPI from './botV2API.js';
import { errorLog, successLog } from '../../config/consoleFormat.js';


export async function clearBotV2HistoryByAPI({ credentials, projectId, botId, chatId='00000000000000000000000000000000' }) {
    const params = {
        projectId,
        botId,
        chatId,
        options: {
            url: `api/questions?botIds=${botId}&chatId=${chatId}`,
            method: 'DELETE',
        },
    };
    await botV2RestAPI({ group: 'Clearing bot v2 history', credentials, params });
}

export async function addBotV2ChatByAPI({ credentials, projectId, botId }) {
    const params = {
        projectId,
        botId,
        options: {
            url: `api/v2/bots/${botId}/chats`,
            method: 'POST',
        },
        json: { "id":"","type":1 },
    };
    // const body = await botV2RestAPI({ group: 'Add new chat v2', credentials, params });

    try {
        const body = await botV2RestAPI({ group: 'Add new chat v2', credentials, params });
        if (body && body.id) {
            successLog(`Create chat ${body.id} successfully`);
            return body.id;
        } else {
            throw new Error(`No ID returned. response body is ${body}`);
        }
    } catch (error) {
        errorLog(`Failed to new a chat: ${error}`);
        throw error; 
    }
}

export async function deleteBotV2ChatByAPI({ credentials, projectId, botId, chatId }) {
    let params,url;
    if (chatId) {
        url = `api/v2/bots/${botId}/chats/${chatId}`;
        params = {
            projectId,
            botId,
            chatId,
            options: {
                url,
                method: 'DELETE',
            },
        };
    } else {
        url = `api/v2/bots/${botId}/chats`;
        params = {
            projectId,
            botId,
            options: {
                url,
                method: 'DELETE',
            },
        };
    }
    await botV2RestAPI({ group: 'delete chat', credentials, params });
}



export default {
    clearBotV2HistoryByAPI,
    addBotV2ChatByAPI,
    deleteBotV2ChatByAPI,
};
