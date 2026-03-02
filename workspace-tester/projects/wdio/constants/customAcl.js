export const AclType = {
    FULL: 'full control',
    DENY: 'deny',
    ONLY_BROWSE: 'only browse',
    BRWOSE_AND_READ: 'browse and read',
    READ_AND_NO_EXECUTE: 'read and no execute',
    READ_EXECUTE_AND_WRITE: 'read execute and write',
    READ_EXECUTE_WRITE_AND_DELETE: 'read execute write and delete',
    ONY_READ_EXECUTE: 'only read and execute',
    NO_READ: 'no read',
};

export function getCustomAclData({ aclType, userId, userName }) {
    const acl = [];
    if (aclType === AclType.FULL) {
        acl.push({
            value: 'Custom',
            id: userId,
            rights: 255,
            denyRights: 0,
            name: userName,
        });
    }
    if (aclType === AclType.DENY) {
        acl.push({
            value: 'Custom',
            id: userId,
            rights: 0,
            denyRights: 255,
            name: userName,
        });
    }
    if (aclType === AclType.ONLY_BROWSE) {
        acl.push({
            value: 'Custom',
            id: userId,
            rights: 1,
            denyRights: 254,
            name: userName,
        });
    }
    if (aclType === AclType.ONY_READ_EXECUTE) {
        acl.push({
            value: 'Custom',
            id: userId,
            rights: 132,
            denyRights: 123,
            name: userName,
        });
    }
    if (aclType === AclType.NO_READ) {
        acl.push({
            value: 'Custom',
            id: userId,
            rights: 251,
            denyRights: 4,
            name: userName,
        });
    }
    if (aclType === AclType.BRWOSE_AND_READ) {
        acl.push({
            value: 'Custom',
            id: userId,
            rights: 5,
            denyRights: 250,
            name: userName,
        });
    }
    if (aclType === AclType.READ_AND_NO_EXECUTE) {
        acl.push({
            value: 'Custom',
            id: userId,
            rights: 127,
            denyRights: 128,
            name: userName,
        });
    }
    if (aclType === AclType.READ_EXECUTE_AND_WRITE) {
        acl.push({
            value: 'Custom',
            id: userId,
            rights: 141,
            denyRights: 114,
            name: userName,
        });
    }
    if (aclType === AclType.READ_EXECUTE_WRITE_AND_DELETE) {
        acl.push({
            value: 'Custom',
            id: userId,
            rights: 157,
            denyRights: 98,
            name: userName,
        });
    }
    return acl;
}
