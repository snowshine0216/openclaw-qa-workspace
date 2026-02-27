import bulkWriteObjectsAPI from '../../server/bulkWriteObjectsAPI.js';
import { groupLog, groupLogEnd } from '../../../config/consoleFormat.js';
import allureReporter from '@wdio/allure-reporter';
import { CONFIGURATION_PROJECT_ID } from '../../../constants/nugget.js';

export default async function deleteNuggetsBulkAPI({ iServerRest, sessionID, nuggets }) {
    groupLog('initialize delete nuggets by iServer bulk write api');
    const nuggetsToDelete = nuggets.map((nugget) => {
        const { did, tp, pid } = nugget;
        return { did, tp, pid };
    });
    await bulkWriteObjectsAPI({ iServerRest, sessionID, CONFIGURATION_PROJECT_ID, data: { delete: nuggetsToDelete } });
    groupLogEnd();
    allureReporter.addStep(`Delete nuggets by iServer bulk write api with iServerRest=${iServerRest}`);
}
