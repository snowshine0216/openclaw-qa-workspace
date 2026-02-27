import type { Services } from '@wdio/types';
import { launchTeamsApp, quitTeamsApp } from './teams-app-management.js';
import getLogger from '../../scripts/logger.js';

const SERVICE_NAME = 'team-app-service';
const logger = getLogger(`[${SERVICE_NAME}] `);
/**
 * This service is used to start/stop Microsoft Teams app.
 */
export default class TeamsAppWorkerService implements Services.ServiceInstance {
    async onPrepare(): Promise<void> {
        logger.info('launch teams app..');
        await launchTeamsApp();
    }

    async onComplete(): Promise<void> {
        logger.info('quit teams app..');
        await quitTeamsApp();
    }
}
