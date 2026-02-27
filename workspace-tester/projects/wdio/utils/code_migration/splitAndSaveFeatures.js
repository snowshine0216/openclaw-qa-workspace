// splitAndSaveFeatures.js
import fs from 'fs';
import path from 'path';

const splitAndSaveFeatures = (featureFilePath) => {
    const content = fs.readFileSync(featureFilePath, 'utf8');
    const lines = content.split('\n');

    // If the number of lines is not greater than 200, no splitting is needed
    if (lines.length <= 200) {
        return [featureFilePath]; // Return original file path
    }

    // Parse scenarios and split into different files
    const scenarios = [];
    let currentScenario = [];
    let headerInfo = []; // Store all header information (Feature, Background, comments, etc.)
    let inScenario = false;
    let scenarioCount = 1;

    // Extract header info and scenarios while reading the file
    lines.forEach((line, index) => {
        const trimmedLine = line.trim();

        if (trimmedLine.startsWith('Scenario:') || trimmedLine.startsWith('Scenario Outline:')) {
            inScenario = true;
            // If current scenario exists, save current scenario and reset
            if (currentScenario.length > 0) {
                scenarios.push(currentScenario);
                currentScenario = [];
            }
            // Push current line (scenario title) to current scenario
            currentScenario.push(line);
        } else if (inScenario) {
            // If we're in a scenario, add to current scenario
            currentScenario.push(line);
        } else {
            // If we haven't reached a scenario yet, add to header info
            headerInfo.push(line);
        }
    });

    // Add the last scenario (if exists)
    if (currentScenario.length > 0) {
        scenarios.push(currentScenario);
    }

    // Debug logging
    console.log(`Original file: ${featureFilePath}`);
    console.log(`Total lines: ${lines.length}`);
    console.log(`Header info lines: ${headerInfo.length}`);
    console.log(`Number of scenarios: ${scenarios.length}`);
    console.log('Header content:');
    headerInfo.forEach((line, i) => console.log(`  ${i}: "${line}"`));

    // Create and save split files
    const savedFiles = [];
    const originalFileName = path.basename(featureFilePath, '.feature'); // Get original filename without extension
    const directory = path.dirname(featureFilePath); // Get directory of original file

    scenarios.forEach((scenarioLines) => {
        const newFileName = path.join(directory, `${originalFileName}_${scenarioCount}.feature`); // Create new filename
        // Add headerInfo to the beginning of each new file, followed by the scenario
        const contentParts = [...headerInfo, ...scenarioLines];
        const contentToSave = contentParts.join('\n');

        console.log(`Creating file: ${newFileName}`);
        console.log(`Content preview (first 5 lines):`);
        contentParts.slice(0, 5).forEach((line, i) => console.log(`  ${i}: "${line}"`));

        fs.writeFileSync(newFileName, contentToSave, 'utf8');
        savedFiles.push(newFileName);
        scenarioCount++; // Increment counter after saving each file
    });

    return savedFiles;
};

export default splitAndSaveFeatures;
