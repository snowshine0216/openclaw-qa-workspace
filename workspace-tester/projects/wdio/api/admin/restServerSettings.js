import request from 'request';

export default async function changeCollabSettings({
    libraryURL,
    baseURL,
    enabled,
    commentsEnabled,
    discussionsEnabled,
    tlsEnabled,
}) {
    if (!libraryURL.endsWith('/')) {
        libraryURL = libraryURL + '/';
    }
    const url = libraryURL + 'api/admin/restServerSettings/collaboration';

    const options = {
        url,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            Accept: 'application/json',
            // 'Authorization': 'Basic YWRtaW46YWRtaW4=',
        },
        body: JSON.stringify({
            baseURL: baseURL,
            commentsEnabled: commentsEnabled,
            discussionsEnabled: discussionsEnabled,
            enabled: enabled,
            tlsEnabled: tlsEnabled,
            updated: false,
        }),
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                try {
                    if (response.statusCode === 204) {
                        resolve();
                    } else {
                        reject(body);
                    }
                } catch (err) {
                    reject(error);
                }
            } else {
                reject(error);
            }
        });
    });
}

// class RestServerSettings {

//     static changeCollaborationSettings({libraryURL, baseURL, enabled, commentsEnabled, discussionsEnabled, tlsEnabled}) {
//         return changeCollabSettings({libraryURL, baseURL, enabled, commentsEnabled, discussionsEnabled, tlsEnabled});
//     }
// }

// module.exports = RestServerSettings;
