// index.js
import fs from 'fs';
import parseFeatureFile from './parseFeatureFile.js';
import parseStepDefinitions from './parseStepDefinitions.js';
import parsePageObjects from './parsePageObjects.js';
import matchStepsWithDefinitions from './matchStepsWithDefinitions.js';
import splitAndSaveFeatures from './splitAndSaveFeatures.js'; // 引入分割功能
import path from 'path';

const feature = 'NumberFormatting';
const BIWEB_FOLDER = '/Users/xuyin/Documents/Repository/biweb/ecosystem/tests/acceptance/protractor';
const input = {
    featureFileName: `${BIWEB_FOLDER}/features/Grid/${feature}.feature`,
    stepsFolders: [`${BIWEB_FOLDER}/steps/dossierauthoring`],
    pageObjectsFolders: [`${BIWEB_FOLDER}/page-objects`],
};

const featureFiles = splitAndSaveFeatures(input.featureFileName);

featureFiles.forEach((featureFile) => {
    const featureModel = parseFeatureFile(featureFile);
    const stepDefinitions = parseStepDefinitions(input.stepsFolders);
    const pageObjects = parsePageObjects(input.pageObjectsFolders);
    const stepMatches = matchStepsWithDefinitions(featureModel, stepDefinitions, pageObjects);

    fs.writeFileSync(`${path.basename(featureFile, '.feature')}.json`, JSON.stringify(stepMatches, null, 2));
});
