export const SOCKET_EVENTS = {
    //socket.io events
    CONNECT: 'connect',
    CONNECT_ERROR: 'connect_error',
    DISCONNECT: 'disconnect',
    RECONNECT: 'reconnect',
    RECONNECTING: 'reconnecting',
    RECONNECT_ERROR: 'reconnect_error',
    RECONNECT_FAILED: 'reconnect_failed',

    //RTService events
    AUTH: 'auth_request',
    AUTH_STATUS: 'auth_request.status',
    SESSION: 'session',
    SESSION_DELETED: 'session.deleted',
    LOGOUT: 'logout',

    BOOKMARKS: 'bookmarks',
    BOOKMARKS_UPDATE: 'bookmarks.update',

    TOPIC: 'topic',
    TOPIC_LOAD: 'topic.load',
    TOPIC_ARRAY: 'topic.array',
    TOPIC_NEW: 'topic.new',
    TOPIC_UPDATE: 'topic.update',
    TOPIC_DELETE: 'topic.delete',
    TOPIC_DELETED: 'topic.deleted',
    TOPIC_STATUS: 'topic.status',
    SUBSCRIBE: 'topic.subscribe',
    UNSUBSCRIBE: 'topic.unsubscribe',

    COMMENT: 'comment',
    COMMENT_ARRAY: 'comment.array',
    COMMENT_LOAD: 'comment.load',
    COMMENT_NEW: 'comment.new',
    COMMENT_DELETE: 'comment.delete',
    COMMENT_DELETED: 'comment.deleted',
    COMMENT_STATUS: 'comment.status',

    NOTIFICATION: 'notification',
    NOTIFICATION_ARRAY: 'notification.array',
    NOTIFICATION_STATUS: 'notification.status',
    NOTIFICATION_UPDATE: 'notification.update',
    NOTIFICATION_DELETE: 'notification.delete',
    NOTIFICATION_DELETED: 'notification.deleted',

    INVITATION_NEW: 'invitation.new',
    INVITATION_STATUS: 'invitation.status',
    INVITATION_QUERY: 'invitation.query',
    INVITATION_UPDATE: 'invitation.update',
    GROUP_QUERY: 'group.query',
    GROUP_STATUS: 'group.status',
};
