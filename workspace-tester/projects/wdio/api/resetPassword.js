import request from 'request';

export default async function resetPassword(baseUrl, session, userId, password, requireNewPassword) {
    const options = {
        url: baseUrl + `api/users/${userId}`,
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': session.token,
            Cookie: session.cookie,
        },
        json: {
            operationList: [
                {
                    op: 'REPLACE',
                    path: '/password',
                    value: password,
                },
                {
                    op: 'REPLACE',
                    path: '/requireNewPassword',
                    value: requireNewPassword,
                },
            ],
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    console.log('Password Reset success');
                    resolve();
                } else {
                    console.log('Password Reset failed. status code:', response.statusCode);
                    console.log('Password Reset failed. message:', body);
                    reject(body);
                }
            } else {
                console.log('Password Reset failed.');
                reject(error);
            }
        });
    });
}
