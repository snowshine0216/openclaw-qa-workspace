import botV2RestAPI from './botV2API.js';

async function updateTags({ credentials, projectId, unstructuredDataId, payload, comments }) {
    const params = {
        projectId,
        options: {
            url: `api/nuggets/${unstructuredDataId}/categories`,
            method: 'PUT',
        },
        json: payload,
    };
    await botV2RestAPI({ group: comments, credentials, params });
}

export async function deleteAllTags({ credentials, projectId, unstructuredDataId }) {
    await updateTags({
        credentials,
        projectId,
        unstructuredDataId,
        payload: {},
        comments: 'Delete all tags from unstructured data:' + unstructuredDataId,
    });
}

// Remove unstucutured data
export async function renameUnstructuredData({ credentials, projectId, unstructuredDataId, name }) {
    const params = {
        projectId,
        options: {
            url: `api/objects/${unstructuredDataId}?type=90`,
            method: 'PUT',
        },
        json: {
            name: name,
        },
    };
    await botV2RestAPI({ group: 'Rename unstructured data', credentials, params });
}
