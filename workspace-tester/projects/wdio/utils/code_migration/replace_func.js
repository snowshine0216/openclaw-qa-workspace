import fs from 'fs';
import path from 'path';

const replacements = [
    {
        regex: /reportPageBy\.getSelectorPulldownTextBox\('([^']+)'\)\.getText\(\)/g,
        replace: "reportPageBy.getPageBySelectorText('$1')",
    },
    {
        regex: /await reportGridView\.getGridCellByPos\((\d+),\s*(\d+)\)\.getText\(\)/g,
        replace: 'await reportGridView.getGridCellTextByPos($1, $2)',
    },
    {
        regex: /await reportGridView\.getGridCellByIndex\((\d+),\s*'([^']+)'\)\.toBe/g,
        replace: "await reportGridView.getGridCellTextByIndex($1).toContain('$2')",
    },
    {
        regex: /reportGridView\.getContextMenuOption\('([^']+)'\)\.isDisplayed\(\)/g,
        replace: "reportEditorPanel.contextMenuContainsOption('$1')",
    },
    {
        regex: /expect\(await reportGridView\.getContextMenuOption\('([^']+)'\)\)\.toBeExisting\(\)/g,
        replace: "expect(await reportGridView.contextMenuContainsOption('$1')).toBe(true)",
    },
    {
        regex: /expect\(await reportGridView\.getContextMenuOption\('([^']+)'\)\)\.toBeTruthy\(\)/g,
        replace: "expect(await reportGridView.contextMenuContainsOption('$1')).toBe(true)",
    },
    {
        regex: /reportPageBy\.getElementFromPopupList\('([^']+)'\)\.getAttribute\('index'\)/g,
        replace: "reportPageBy.getIndexForElementFromPopupList('$1')",
    },
    {
        regex: /await reportGridView\.moveVerticalScrollBarToBottom\('([^']+)'\)/g,
        replace: "await reportGridView.scrollGridToBottom('$1')",
    },
    {
        regex: /await reportGridView\.getGridCellStyleByPos\((\d+),\s*(\d+)\)\.getCSSProperty\('([^']+)'\)\.value/g,
        replace: "await reportGridView.getGridCellStyleByPos($1, $2, '$3')",
    },
    {
        regex: /await reportGridView\.getGridCellByPos\((\d+),\s*(\d+)\)\.getCSSProperty\('([^']+)'\)\.value/g,
        replace: "await reportGridView.getGridCellStyleByPos($1, $2, '$3')",
    },
    //  replace rgba(2, 143, 148, 1) to rgba(2,143,148,1) by removing the space
    {
        regex: /rgba\(\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^)]+)\s*\)/g,
        replace: 'rgba($1,$2,$3,$4)',
    },
    // replace reportGridView.getGridCellByPos('1', '0').getText() to reportGridView.getGridCellTextByPos(1, 0)
    {
        regex: /reportGridView\.getGridCellByPos\(\s*'(\d+)'\s*,\s*'(\d+)'\s*\)\.getText\(\)/g,
        replace: 'reportGridView.getGridCellTextByPos($1, $2)',
    },
    // {
    //     regex: /expect\(\s*(?!await\s)([^)]+)\s*\)/g,
    //     replace: 'expect(await $1)',
    // },
    {
        regex: /reportGridView\.getGridCellByPos\(\s*'(\d+)'\s*,\s*'(\d+)'\s*\)\.getCSSProperty\(\s*'([^']+)'\s*\)/g,
        replace: "reportGridView.getGridCellStyleByPos($1, $2, '$3')",
    },
    {
        regex: /newFormatPanelForGrid\.expandSection\(\s*'Layout'\s*\)/g,
        replace: 'newFormatPanelForGrid.expandLayoutSection()',
    },
    {
        regex: /reportEditorPanel\.getRankSubMenuDropdown\(\s*'([^']+)'\s*\)\.getText\(\)/g,
        replace: "reportEditorPanel.getRankSubMenuDropdownText('$1')",
    },
    {
        regex: /reportEditorPanel\.getRankSubMenuDropdownItem\(\s*'([^']+)'\s*,\s*'([^']+)'\s*\)\.isDisplayed\(\)/g,
        replace: "reportEditorPanel.isRankSubMenuDropdownItemDisplayed('$1', '$2')",
    },
    {
        regex: /reportEditorPanel\.getSubmenuItem\(\s*'([^']+)'\s*\)\.isDisplayed\(\)/g,
        replace: "reportEditorPanel.isSubmenuItemDisplayed('$1')",
    },
    {
        regex: /reportEditorPanel\.isRankSubMenuDropdownItemDisplayed\(\s*'breakBy'\s*,\s*'([^']+)'\s*\)/g,
        replace: "reportEditorPanel.isBreakBySubMenuDropdownDisplayed('$1')",
    },
    {
        regex: /reportEditorPanel\.getRankSubMenuDropdownText\(\s*'breakby'\s*\)/g,
        replace: 'reportEditorPanel.getRankBreakByDropdownText()',
    },
    {
        regex: /reportEditorPanel\.getRankSubMenuDropdownText\(\s*'sort'\s*\)/g,
        replace: 'reportEditorPanel.getRankSortsDropdownText()',
    },
    // {
    //     regex: /await reportGridView\.scrollAgGrid\('([^']+)',\s*(\d+),\s*'right'\)/g,
    //     replace: "await reportGridView.scrollGridHorizontally('$1', $2)",
    // },
    // {
    //     regex: /await reportGridView\.scrollAgGrid\('([^']+)',\s*(\d+),\s*'left'\)/g,
    //     replace: "await reportGridView.scrollGridHorizontally('$1', -$2)",
    // },
];
function traverseDirectory(dir, callback) {
    fs.readdirSync(dir).forEach((file) => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            traverseDirectory(filePath, callback);
        } else {
            callback(filePath);
        }
    });
}
function replaceInFile(filePath) {
    if (path.extname(filePath) === '.js' && filePath.endsWith('.spec.js')) {
        let content = fs.readFileSync(filePath, 'utf8');
        replacements.forEach(({ regex, replace }) => {
            content = content.replace(regex, replace);
        });
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

function main() {
    const targetDirectory =
        '/Users/xuyin/Documents/Repository/bot_automtaion/web-dossier/tests/wdio/specs/regression/reportEditor'; // 替换为你的目标文件夹路径
    traverseDirectory(targetDirectory, replaceInFile);
}

main();
