import request from 'request';

export default async function deleteSession(baseUrl, cookies) {
    let cnt = cookies.length;
    let sessionId;
    let jSessionCookie;
    for (let i = 0; i < cnt; i++) {
        let obj = cookies[i];
        if (obj.name === 'iSession') {
            sessionId = obj.value;
        }
        if (obj.name == 'JSESSIONID') {
            jSessionCookie = `JSESSIONID=${obj.value}`;
        }
    }

    const options = {
        url: baseUrl + 'api/sessions',
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': sessionId,
            Cookie: jSessionCookie,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                resolve();
            } else {
                console.log('Request error');
                reject(error);
            }
        });
    });
}
