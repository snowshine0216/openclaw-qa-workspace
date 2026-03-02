// parseFeatureFile.js

import fs from 'fs';
import { FeatureModel, ScenarioModel } from './models.js';
import { parseFeatureLine } from './helpers.js';

const parseFeatureFile = (featureFilePath) => {
    const content = fs.readFileSync(featureFilePath, 'utf8');
    const lines = content.split('\n');

    const featureName = featureFilePath.split('/').pop().replace('.feature', '');

    const state = {
        featureDescription: '',
        currentScenarioSteps: [],
        scenarios: [],
        existingScenarioIds: new Set(),
        scenarioId: 'TC0000',
        scenarioName: '',
    };

    lines.forEach((line) => {
        parseFeatureLine(line, state);
    });

    // Add the last scenario if there are any steps left
    if (state.currentScenarioSteps.length > 0) {
        state.scenarios.push(new ScenarioModel(state.scenarioId, state.scenarioName, state.currentScenarioSteps));
    }

    return new FeatureModel(featureName, state.featureDescription, state.scenarios);
};

export default parseFeatureFile;
