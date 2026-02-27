import request from 'request';

export default async function getServerBuildByName(machineName) {
    const options = {
        url: 'http://ctc-android2.labs.microstrategy.com:8088/api/v1/buildInfo',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        json: {
            serverName: machineName,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    console.log(`retriving server build of '${machineName}' is successful.    id = '${body.id}'`);
                    resolve(body.buildNumber);
                } else {
                    console.log(
                        `retriving server build of '${machineName}' failed. Status code: ${response.statusCode}. Message: ${body}`
                    );
                    reject(body);
                }
            } else {
                console.log(`retriving server build of '${machineName}' is successful. failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
