import request from 'request';

export default async function getBasicAuthRespone(url, auth = '') {
    return new Promise((resolve, reject) => {
        const options = {
            url: url,
            headers: {
                Authorization: `Basic ${Buffer.from(auth).toString('base64')}`,
            },
            rejectUnauthorized: false,
        };

        request(options, (error, response) => {
            if (!error && response) {
                console.log('status code: %s', response.statusCode);
                resolve(response.statusCode);
            } else if (error) {
                console.log('error: %s', error);
                reject(error);
            }
        });
    });
}
