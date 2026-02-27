import resetManipulations from './resetManipulations.js';
import resetObjectState from './commonUtils/resetObjectState.js';

export default function resetDossierState({ credentials, dossier }) {
    return resetObjectState(credentials, dossier, resetManipulations);
}
