import authentication from '../../../../../api/authentication.js';
import getUserLibrary from '../../../../../api/getUserLibrary.js';
import { projectInfo } from '../../../../../api/getProjectInfo.js';
import logout from '../../../../../api/logout.js';
import { logger } from '../../logger.js';

/**
 * Initialize bot configuration
 * Looks up bot by name or uses provided object ID
 * Resolves project ID by name
 *
 * @param {string} baseUrl - Base URL for API calls
 * @param {Object} botInfo - Bot information from profile
 * @param {Object} credential - User credential for authentication
 * @param {boolean} executeBotByName - Whether to look up bot by name
 * @param {string} overrideProjectName - Override project name if provided
 * @returns {Object} Initialized bot configuration
 */
export async function initializeBot(baseUrl, botInfo, credential, executeBotByName, overrideProjectName = null) {
    const botConfig = {
        name: botInfo.name,
        objectId: botInfo.objectId,
        projectId: null,
        projectName: overrideProjectName || botInfo.projectName,
        groupName: botInfo.groupName,
        variantName: botInfo.variantName,
    };

    const session = await authentication({ baseUrl, authMode: 1, credentials: credential });

    try {
        if (executeBotByName) {
            logger.debug(`Looking up bot '${botConfig.name}' from user library...`);
            const objectList = await getUserLibrary({ baseUrl, session });
            const aiBot = objectList.aiBotContents.find((bot) => bot.name === botConfig.name);

            if (!aiBot) {
                throw new Error(`Bot '${botConfig.name}' not found in user library.`);
            }

            botConfig.objectId = aiBot.target.id;
            botConfig.projectId = aiBot.projectId;
            logger.debug(
                `✅ Found bot '${botConfig.name}' (Object ID: ${botConfig.objectId}, Project ID: ${botConfig.projectId})`
            );
        } else {
            logger.debug(`Using bot object ID from JSON: ${botConfig.objectId}`);
            logger.debug(`Looking up project ID for project '${botConfig.projectName}'...`);

            const project = await projectInfo({ baseUrl, session });
            const projectDetails = project.find((p) => p.name === botConfig.projectName);

            if (!projectDetails) {
                throw new Error(`Project '${botConfig.projectName}' not found.`);
            }

            botConfig.projectId = projectDetails.id;
            logger.info(`✅ Found project '${botConfig.projectName}' (Project ID: ${botConfig.projectId})`);
        }
    } finally {
        await logout({ baseUrl, session });
    }

    return botConfig;
}
