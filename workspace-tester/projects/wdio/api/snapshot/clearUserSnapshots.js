import getSnapshots from './getSnapshots.js';
import deleteSnapshots from './deleteSnapshots.js';

export default async function clearUserSnapshots({ credentials, scope = 'single_user', removeOthersMessage = false }) {
    for (const credential of credentials) {
        const historyLists = await getSnapshots({ credentials: credential, scope: scope });
        await deleteSnapshots({
            credentials: credential,
            historyLists: historyLists,
            removeOthersMessage: removeOthersMessage,
        });
    }
}
