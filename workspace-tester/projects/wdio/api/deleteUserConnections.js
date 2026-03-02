import request from 'request';
 
export default async function deleteUserConnections(baseUrl, sessionOrCookies, id) {
    let sessionId;
    let cookie;
    
    // Support both session object and cookies array
    if (sessionOrCookies && sessionOrCookies.token) {
        // It's a session object
        sessionId = sessionOrCookies.token;
        cookie = sessionOrCookies.cookie;
    } else if (Array.isArray(sessionOrCookies)) {
        // It's a cookies array
        let cnt = sessionOrCookies.length;
        for (let i = 0; i < cnt; i++) {
            let obj = sessionOrCookies[i];
            if (obj.name === 'iSession') {
                sessionId = obj.value;
            }
        }
    }
 
    const options = {
        url: baseUrl + `api/monitors/userConnections/${id}`,
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': sessionId,
        },
    };
    
    if (cookie) {
        options.headers.Cookie = cookie;
    }
 
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 204 || response.statusCode === 200) {
                    console.log(`✅ Delete user connection ${id} succeeded - Status: ${response.statusCode}`);
                    resolve(response);
                } else {
                    const errorMsg = `❌ Delete user connection ${id} failed - Status: ${response.statusCode}, Body: ${JSON.stringify(body)}`;
                    console.error(errorMsg);
                    reject(new Error(errorMsg));
                }
            } else {
                const errorMsg = `❌ Delete user connection ${id} request error: ${JSON.stringify(error)}`;
                console.error(errorMsg);
                reject(new Error(errorMsg));
            }
        });
    });
}