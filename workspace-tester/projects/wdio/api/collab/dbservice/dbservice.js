// import { Pool } from 'pg';
import pkg from 'pg';
const { Pool } = pkg;

let connectionInfo = 'postgresql://mstr_collab:mstr_collab@localhost:5432/mstr_collab';
let pool;

export default class PostgresService {
    static init(connectionString) {
        connectionInfo = connectionString;
        pool = new Pool({
            connectionString: connectionInfo,
        });
    }

    static query(sql) {
        return pool.query(sql);
    }

    static disconnect() {
        if (pool) {
            return pool.end();
        }
    }

    static async deleteAllCommentsInDossier(resourceId) {
        let r1 = await pool.query(`SELECT _id FROM topics WHERE private is not true and "topicDssId" = $1;`, [
            resourceId,
        ]);
        let publicTopicId = r1.rows[0] && r1.rows[0]._id;
        return publicTopicId
            ? pool.query(`DELETE FROM comments where "topicId" = $1;`, [publicTopicId])
            : Promise.resolve();
    }

    static deleteAllNotificationsForUser(userId) {
        return pool.query(`DELETE FROM notifications where "userDssId" = $1;`, [userId]);
    }

    static deleteAllTopicInDossier(resourceId) {
        return pool.query(`DELETE FROM topics where "topicDssId" = $1;`, [resourceId]);
    }

    static async queryTelemetry({ jobId, userName = 'telemetry_user' }) {
        try {
            const queryText = `
                SELECT COUNT(*) as count
                FROM fact_client_executions fce
                INNER JOIN lu_account la ON la.account_id = fce.account_id
                WHERE la.account_name = $1 AND fce.job_id = $2
            `;

            const queryParams = [userName, jobId];

            const result = await pool.query(queryText, queryParams);

            // Assuming the query will always return a row with COUNT(*)
            return parseInt(result.rows[0].count, 10);
        } catch (error) {
            console.error('Error querying telemetry:', error);
            throw new Error('Query failed');
        }
    }

    static async queryTelemetryByObjectId({ jobId, objectId, userName = 'telemetry_user' }) {
        try {
            const queryText = `
                SELECT COUNT(*) as count
                FROM fact_client_executions fce
                INNER JOIN lu_account la ON la.account_id = fce.account_id
                INNER JOIN lu_object lo ON lo.object_id = fce.object_id
                WHERE la.account_name = $1 AND fce.job_id = $2 AND lo.object_guid = $3
            `;

            const queryParams = [userName, jobId, objectId];

            const result = await pool.query(queryText, queryParams);

            // Assuming the query will always return a row with COUNT(*)
            return parseInt(result.rows[0].count, 10);
        } catch (error) {
            console.error('Error querying telemetry by object id:', error);
            throw new Error('Query failed');
        }
    }
}
