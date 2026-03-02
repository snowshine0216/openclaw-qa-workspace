import authentication from './authentication.js';
import logout from './logout.js';
import urlParser from './urlParser.js';
import { groupLog, groupLogEnd } from '../config/consoleFormat.js';
import getInsightsKpis from './getInsightsKpis.js';
import deleteInsightKpi from './deleteInsightKpi.js';

export default async function deleteAllInsightsKpis(credentials) {
    groupLog('deleteAllInsights by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    const insights = await getInsightsKpis({ baseUrl, session });
    if (insights.kpis) {
        for (const kpi of insights.kpis) {
            await deleteInsightKpi({ baseUrl: baseUrl, session: session, id: kpi.id, projectId: kpi.projectId });
        }
    }
    await logout({ baseUrl, session });
    groupLogEnd();
}
