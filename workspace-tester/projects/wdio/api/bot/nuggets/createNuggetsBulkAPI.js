import bulkWriteObjectsAPI from '../../server/bulkWriteObjectsAPI.js';
import { groupLog, groupLogEnd } from '../../../config/consoleFormat.js';
import allureReporter from '@wdio/allure-reporter';

export default async function createNuggetsBulkAPI({ iServerRest, sessionID, data }) {
    groupLog('initialize create nuggets by iServer bulk write api');
    const result = await bulkWriteObjectsAPI({ iServerRest, sessionID, data });
    groupLogEnd();
    allureReporter.addStep(`Create nuggets by iServer bulk write api with iServerRest=${iServerRest}`);
    return result;
}
