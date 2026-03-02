import fs from 'fs';
import path from 'path';

// Define input and output folders directly in the script
const INPUT_FOLDER = './specs/regression/snapshot/snapshots';
const OUTPUT_FOLDER = './specs/regression/config/snapshots';

function extractTestCaseIds(specContent) {
    // Regex to match test cases with TC IDs in brackets like [TC12345]
    const testCaseRegex = /it\(['"](?:\[)?(TC\d+(?:_\d+)?)(?:\])?/g;
    const testCaseIds = [];
    let match;

    while ((match = testCaseRegex.exec(specContent)) !== null) {
        testCaseIds.push(match[1]);
    }

    return testCaseIds;
}

function generateConfigXml(specFiles, folderName) {
    let xmlContent = `<?xml version="1.0" encoding="utf-8" ?>
<root>`;

    // Track TestSuite ID to increment it for each suite
    let suiteId = 1;

    for (const specFile of specFiles) {
        const specContent = fs.readFileSync(specFile, 'utf8');
        const testCaseIds = extractTestCaseIds(specContent);
        
        if (testCaseIds.length === 0) {
            console.log(`No test cases found in ${specFile}`);
            continue;
        }
        
        // Use the full spec filename as the TestSuite name
        const suiteName = path.basename(specFile);
        
        // Format the ID with leading zero if needed
        const formattedId = suiteId.toString().padStart(2, '0');
        
        xmlContent += `
    <TestSuite id='${formattedId}' name='${suiteName}'>
${testCaseIds.map((id) => `        <TC>${id}</TC>`).join('\n')}
    </TestSuite>`;

        // Increment the suite ID for the next TestSuite
        suiteId++;
    }

    xmlContent += `
</root>`;

    return xmlContent;
}

function processSpecFiles() {
    // Create output folder if it doesn't exist
    if (!fs.existsSync(OUTPUT_FOLDER)) {
        fs.mkdirSync(OUTPUT_FOLDER, { recursive: true });
    }
    
    // Find all spec files
    const specFiles = findSpecFiles(INPUT_FOLDER);
    
    // Group spec files by folder
    const specFilesByFolder = {};
    
    for (const specFile of specFiles) {
        const relativePath = path.relative(INPUT_FOLDER, specFile);
        const pathParts = relativePath.split(path.sep);
        
        let folderName;
        
        if (pathParts.length > 1) {
            // If in a subfolder, use the subfolder name
            folderName = pathParts[0];
            
            if (!specFilesByFolder[folderName]) {
                specFilesByFolder[folderName] = [];
            }
            
            specFilesByFolder[folderName].push(specFile);
        } else {
            // For files directly in the reportEditor folder, create individual config files
            const fileName = path.basename(specFile, '.spec.js');
            const configXml = generateConfigXml([specFile], fileName);
            const outputPath = path.join(OUTPUT_FOLDER, `${fileName}.config.xml`);
            
            fs.writeFileSync(outputPath, configXml);
            console.log(`Generated individual config file: ${outputPath}`);
        }
    }
    
    // Generate config.xml for each subfolder
    for (const [folderName, files] of Object.entries(specFilesByFolder)) {
        const configXml = generateConfigXml(files, folderName);
        const outputPath = path.join(OUTPUT_FOLDER, `${folderName}.config.xml`);
        
        fs.writeFileSync(outputPath, configXml);
        console.log(`Generated folder config file: ${outputPath} with ${files.length} test suites`);
    }
}

function findSpecFiles(folder) {
    const specFiles = [];

    function scan(directory) {
        const files = fs.readdirSync(directory);

        for (const file of files) {
            const fullPath = path.join(directory, file);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                scan(fullPath);
            } else if (file.endsWith('.spec.js')) {
                specFiles.push(fullPath);
            }
        }
    }

    scan(folder);
    return specFiles;
}

function main() {
    console.log(`Scanning spec files in: ${INPUT_FOLDER}`);
    console.log(`Output folder: ${OUTPUT_FOLDER}`);

    processSpecFiles();
}

main();
