import PostgresService from '../../api/collab/dbservice/dbservice.js';

export default class PADb extends PostgresService {
    async queryTelemetry(dburl, { jobId, userName = 'telemetry_user', objectId = null }) {
        PostgresService.init(dburl);
        if (objectId) {
            let row = await PostgresService.queryTelemetryByObjectId({ jobId, userName, objectId });
            PostgresService.disconnect();
            return row;
        } else {
            let row = await PostgresService.queryTelemetry({ jobId, userName });
            PostgresService.disconnect();
            return row;
        }
    }

    async disconnect() {
        PostgresService.disconnect();
    }
}
