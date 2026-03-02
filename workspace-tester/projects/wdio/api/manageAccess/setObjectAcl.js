import updateObjectAcl from './updateObjectAcl.js';
import { groupLog, groupLogEnd } from '../../config/consoleFormat.js';
import urlParser from '../urlParser.js';
import authentication from '../authentication.js';
import logout from '../logout.js';

const permissionMap = {
    'Full Control': { rights: 255, denied: false },
    'Can Modify': { rights: 223, denied: false },
    'Can View': { rights: 199, denied: false },
    'Denied All': { rights: 255, denied: true },
};

function createAccessEntry({ options, isFolder = false }) {
    const accessEntries = [
        {
            ...options,
            type: 1,
            op: 'REPLACE',
            inheritable: false,
        },
    ];
    // if it is a folder, add another entry for inheritable
    if (isFolder) {
        accessEntries.push({
            ...options,
            type: 1,
            op: 'REPLACE',
            inheritable: true,
        });
    }
    return accessEntries;
}

export function createACLRequestPayload(payload, isFolder = false) {
    const { acl, applyToChildren, aclOverwrite } = payload;
    const accessControlList = acl
        .flatMap((ace) => {
            if (ace.value === 'Custom') {
                let customAcls = [];
                if ('rights' in ace) {
                    customAcls.push({ rights: ace.rights, trustee: ace.id, denied: false });
                }
                if ('denyRights' in ace) {
                    customAcls.push({ rights: ace.denyRights, trustee: ace.id, denied: true });
                }
                return customAcls;
            } else {
                return { ...permissionMap[ace.value], trustee: ace.id };
            }
        })
        .flatMap((options) => {
            return createAccessEntry({ options, isFolder: isFolder });
        });

    if (isFolder) {
        const propagateACLToChildren = applyToChildren !== undefined ? applyToChildren : true;
        const aclOverwriteChildren = aclOverwrite !== undefined ? aclOverwrite : true;
        const propagationBehavior = aclOverwriteChildren ? 'overwrite_recursive' : 'precise_recursive';
        return {
            acl: accessControlList,
            propagateACLToChildren: propagateACLToChildren, //default to true
            propagationBehavior: propagateACLToChildren ? propagationBehavior : undefined, //default to true
        };
    } else {
        return {
            acl: accessControlList,
        };
    }
}

/**
 *
 * @param credentials: { username, password }
 * @param object: { id, name, project, type }
 * @param acl: [{
                value: 'Full Control',
                id: 'C82C6B1011D2894CC0009D9F29718E4F',
                name: 'Everyone',
            },...], this parameter is optional if payload is provided
 * @param payload: { acl, applyToChildren, aclOverwrite }, this parameter is optional
 */
export default async function setObjectAcl({ credentials, object, acl, payload }) {
    groupLog('setObjectAcl by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    if (!payload) {
        payload = { acl: acl };
    }
    await updateObjectAcl({ baseUrl, session, object, payload: createACLRequestPayload(payload, object.type === 8) });
    await logout({ baseUrl, session });
    groupLogEnd();
}
