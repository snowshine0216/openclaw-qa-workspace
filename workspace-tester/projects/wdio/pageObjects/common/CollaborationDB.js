import PostgresService from '../../api/collab/dbservice/dbservice.js';

export default class CollaborationDB extends PostgresService {
    async deleteAllComments(dburl, dossierID) {
        PostgresService.init(dburl);
        await PostgresService.deleteAllCommentsInDossier(dossierID);
        PostgresService.disconnect();
    }

    async deleteAllNotifications(dburl, userID) {
        PostgresService.init(dburl);
        await PostgresService.deleteAllNotificationsForUser(userID);
        PostgresService.disconnect();
    }

    async deleteAllTopics(dburl, dossierID) {
        PostgresService.init(dburl);
        await PostgresService.deleteAllTopicInDossier(dossierID);
        PostgresService.disconnect();
    }

    async disconnect() {
        PostgresService.disconnect();
    }
}
