import urlParser from './urlParser.js';

export default async function generateViewDossierLink(dossier) {
    const baseUrl = urlParser(browser.options.baseUrl);
    const projectId = dossier.project.id;
    const docId = dossier.id;
    return baseUrl + ['app', projectId, docId].join('/');
}
