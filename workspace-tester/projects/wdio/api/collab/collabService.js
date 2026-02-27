import io from 'socket.io-client';
import { SOCKET_EVENTS } from './SocketEvents.js';
import request from 'request';

let libraryServer = '';
let collabServer = 'http://localhost:3000';
let socket;
let socketPromiseMap = {};
let identityToken;

function generateSocketPromise(emitEvent, emitPayload, onEvent) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // console.log('Timeout');
            reject('Timeout for socket promise:' + emitEvent);
        }, 5000);
        socketPromiseMap[onEvent] = resolve;
        socket.emit(emitEvent, emitPayload);
    });
}

function getIdentityToken(token, cookie) {
    const options = {
        url: libraryServer + 'auth/identityToken',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': token,
            Cookie: cookie,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                identityToken = response.headers['x-mstr-identitytoken'];
                resolve(identityToken);
                // if (response.statusCode === 201) {
                //     resolve(JSON.parse(body));
                // } else {
                //     reject(body);
                // }
            } else {
                reject(error);
            }
        });
    });
}

function getToken(username, password, loginMode) {
    let jsessionCookie = null;
    let authToken = null;

    const cookieJar = request.jar();
    const baseUrl = libraryServer;
    const url = baseUrl + 'auth/login';

    const options = {
        url,
        method: 'POST',
        jar: cookieJar,
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
        },
        form: {
            loginMode: loginMode,
            username: username,
            password: password,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                try {
                    jsessionCookie = cookieJar.getCookieString(url);
                    if (response.statusCode === 204) {
                        authToken = response.headers['x-mstr-authtoken'];
                        resolve({ token: authToken, cookie: jsessionCookie });
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
    }).then((credentials) => {
        return getIdentityToken(credentials.token, credentials.cookie);
    });
}

function execCommand(url) {
    const options = {
        url: url,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                resolve(body);
            } else {
                reject(error);
            }
        });
    });
}

export class CollabService {
    static init(libraryServerURL, collabServerURL) {
        libraryServer = libraryServerURL;
        socket = io(collabServerURL);

        let msgNames = [
            'auth_request.status',
            'bookmarks',
            'bookmarks.status',
            'comment',
            'comment.array',
            'comment.deleted',
            'comment.status',
            'group.status',
            'invitation.status',
            'notification',
            'notification.array',
            'notification.deleted',
            'notification.status',
            'session',
            'session.deleted',
            'topic',
            'topic.array',
            'topic.deleted',
            'topic.status',
        ];
        msgNames.forEach((msgName) => {
            socket.on(msgName, (data) => {
                // console.log('Received ' + msgName + ': ');
                // console.log(JSON.stringify(data));
                let resolveFunc = socketPromiseMap[msgName];
                if (resolveFunc) {
                    resolveFunc(data);
                }
            });
        });
    }

    static close() {
        if (socket) {
            socket.close();
        }
    }

    static authenticate(token, cookie) {
        return getIdentityToken(token, cookie).then((token) => {
            return generateSocketPromise(
                SOCKET_EVENT.AUTH,
                { accessToken: token, version: 2 },
                SOCKET_EVENT.AUTH_STATUS
            );
        });
    }

    static authenticateDirectly(username, password, loginMode = 1) {
        return getToken(username, password, loginMode).then((token) => {
            return generateSocketPromise(
                SOCKET_EVENT.AUTH,
                { accessToken: token, version: 2 },
                SOCKET_EVENT.AUTH_STATUS
            );
        });
    }

    static loadComment() {
        return generateSocketPromise(
            SOCKET_EVENT.COMMENT_LOAD,
            { howMany: 10, relation: -1, topicId: '5f3f432f6ee34be27540cd3d' },
            SOCKET_EVENT.COMMENT_STATUS
        );
    }

    static shareBookmark(bookmarkIds, resourceId, userIds, shareMsg, shareName = 'defaultShareName') {
        let bookmarks = [];
        for (let bid of bookmarkIds) {
            bookmarks.push({ ebdBmId: bid, ebdBmName: 'testBookmarkName' });
        }
        let payload = {
            checkOnly: false,
            embedded: {
                ebdBookmarks: bookmarks,
                ebdMsg: shareMsg,
            },
            name: shareName,
            resourceId: resourceId,
            userIdArray: userIds,
        };
        return generateSocketPromise(SOCKET_EVENT.INVITATION_NEW, payload, SOCKET_EVENT.INVITATION_STATUS);
    }

    static exec(cmd, url) {
        return execCommand(url + '/?cmd=' + cmd);
    }
}
