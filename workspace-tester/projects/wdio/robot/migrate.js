import fs from 'fs';
import axios from 'axios';

// Get the input file path
const args = process.argv.slice(2);

const filePath = args[0];
const modifiedFile = filePath.replace('e2e', 'wdio');

// The system content to be used in the chat API
const systemContent = `You are familiar with Protractor and WebdriverIO. Translate Protractor to use WebdriverIO API. Refactor them one by one. Just show the result, no explanations, and do not eliminate the comments.
There are some API changes:
1. executeScript -> execute
2. switchTo().window -> switchWindow
3. actions().sendKeys(protractor.Key.ENTER).perform() -> keys('Enter')
4. keyDown(protractor.Key.COMMAND).sendKeys('a').keyUp(protractor.Key.COMMAND).perform() -> keys(['Control', 'a'])
The user input is a code snippet.
Here are the requirements: only handle the function one by one; do not change the function name; do not add new functions; do not add function defn or any } or comment to the code snippet even if the function is not complete.
`;

const startDate = new Date();

// Read the JavaScript file
fs.readFile(filePath, 'utf8', async (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    // Split the file into smaller blocks
    const MAX_BLOCK_SIZE = 1600;
    const blocks = [];
    let currentBlock = '';
    let insideFunction = false;

    const lines = data.split('\n');
    for (const line of lines) {
        if (line.includes('function')) {
            insideFunction = true;
        }

        if (currentBlock.length + line.length > MAX_BLOCK_SIZE) {
            blocks.push(currentBlock);
            currentBlock = '';
        }

        currentBlock += line + '\n';

        if (insideFunction && line.includes('}')) {
            insideFunction = false;
            blocks.push(currentBlock);
            currentBlock = '';
        }
    }

    if (currentBlock.length > 0) {
        blocks.push(currentBlock);
    }

    const migrateBlocks = [];
    for (let i = 0; i < blocks.length; i++) {
        // console.log(`Block ${i + 1}:`);
        // console.log('Before: \n', blocks[i]);
        // migrate blocks
        const migrateBlock = await callOpenAIChatAPI(blocks[i]);
        if (migrateBlock) {
            // console.log('After: \n', migrateBlock);
            migrateBlocks.push(
                migrateBlock.startsWith('```') && migrateBlock.endsWith('```')
                    ? migrateBlock.slice(3, -3).trim()
                    : migrateBlock
            );
        }
    }

    // Write the modified file
    if (!fs.existsSync(modifiedFile)) {
        const directory = modifiedFile.substring(0, modifiedFile.lastIndexOf('/'));
        fs.mkdirSync(directory, { recursive: true });
    }
    fs.writeFileSync(modifiedFile, migrateBlocks.join(''));

    const endDate = new Date();
    const timeDiff = endDate.getTime() - startDate.getTime();
    console.log('    Migration is complete, it takes ', timeDiff + 'ms!');
});
