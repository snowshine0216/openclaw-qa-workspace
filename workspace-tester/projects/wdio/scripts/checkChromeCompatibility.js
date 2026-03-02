#!/usr/bin/env node

/**
 * Chrome Version Compatibility Checker
 * 检查当前 Chrome 版本并提供相应的配置建议
 */

import { execSync } from 'child_process';
import chalk from 'chalk';

function getChromeVersion() {
    try {
        // Try different methods to get Chrome version
        const commands = [
            'google-chrome --version',
            'google-chrome-stable --version', 
            'chromium --version',
            'chromium-browser --version',
            '/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --version'
        ];

        for (const cmd of commands) {
            try {
                const output = execSync(cmd, { encoding: 'utf8', stdio: 'pipe' });
                const match = output.match(/(\d+)\.(\d+)\.(\d+)\.(\d+)/);
                if (match) {
                    return {
                        full: match[0],
                        major: parseInt(match[1]),
                        minor: parseInt(match[2]),
                        build: parseInt(match[3]),
                        patch: parseInt(match[4])
                    };
                }
            } catch (e) {
                // Try next command
                continue;
            }
        }
        throw new Error('Chrome not found');
    } catch (error) {
        console.error(chalk.red('❌ Could not detect Chrome version'));
        return null;
    }
}

function getRecommendedConfig(version) {
    if (!version) {
        return {
            headlessMode: '--headless=new',
            additionalArgs: ['--no-sandbox', '--disable-setuid-sandbox'],
            notes: 'Chrome version could not be detected. Using safe defaults.'
        };
    }

    const { major } = version;
    
    if (major >= 139) {
        return {
            headlessMode: '--headless=new',
            additionalArgs: [
                '--no-sandbox',
                '--disable-setuid-sandbox', 
                '--disable-dev-shm-usage',
                '--disable-extensions',
                '--disable-background-timer-throttling',
                '--disable-backgrounding-occluded-windows',
                '--disable-renderer-backgrounding',
                '--memory-pressure-off',
                '--single-process',
                '--disable-features=VizDisplayCompositor',
                '--disable-ipc-flooding-protection'
            ],
            userDataDir: 'CRITICAL: Use unique user-data-dir with process.pid',
            notes: `Chrome ${major}+ has stricter security policies. User data directory conflicts are more common.`
        };
    } else if (major >= 120) {
        return {
            headlessMode: '--headless=new',
            additionalArgs: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-extensions'
            ],
            userDataDir: 'Recommended: Use unique user-data-dir',
            notes: `Chrome ${major} supports new headless mode.`
        };
    } else if (major >= 109) {
        return {
            headlessMode: '--headless=chrome',
            additionalArgs: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage'
            ],
            userDataDir: 'Optional: Consider unique user-data-dir for parallel runs',
            notes: `Chrome ${major} supports chrome headless mode.`
        };
    } else {
        return {
            headlessMode: '--headless',
            additionalArgs: [
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ],
            userDataDir: 'Not critical for older versions',
            notes: `Chrome ${major} uses traditional headless mode.`
        };
    }
}

function main() {
    console.log(chalk.blue.bold('🔍 Chrome Version Compatibility Checker\n'));
    
    const version = getChromeVersion();
    
    if (version) {
        console.log(chalk.green(`✅ Chrome Version: ${version.full}`));
        console.log(chalk.gray(`   Major: ${version.major}, Minor: ${version.minor}\n`));
    } else {
        console.log(chalk.yellow('⚠️  Chrome version detection failed\n'));
    }
    
    const config = getRecommendedConfig(version);
    
    console.log(chalk.blue.bold('📋 Recommended Configuration:\n'));
    
    console.log(chalk.cyan('Headless Mode:'));
    console.log(`  ${config.headlessMode}\n`);
    
    console.log(chalk.cyan('Additional Chrome Args:'));
    config.additionalArgs.forEach(arg => {
        console.log(`  ${arg}`);
    });
    console.log();
    
    console.log(chalk.cyan('User Data Directory:'));
    console.log(`  ${config.userDataDir}\n`);
    
    console.log(chalk.yellow('📝 Notes:'));
    console.log(`  ${config.notes}\n`);
    
    // Version-specific warnings
    if (version && version.major >= 139) {
        console.log(chalk.red.bold('⚠️  HIGH PRIORITY WARNING:'));
        console.log(chalk.red('   Chrome 139+ has known issues with:'));
        console.log(chalk.red('   - User data directory conflicts in CI'));
        console.log(chalk.red('   - Stricter security policies'));
        console.log(chalk.red('   - Memory management in containers'));
        console.log(chalk.red('   Please ensure your configuration includes all recommended args!\n'));
    }
    
    // Generate sample configuration
    console.log(chalk.blue.bold('💻 Sample WebDriverIO Configuration:\n'));
    console.log(chalk.gray('```typescript'));
    console.log("const headlessOptions = HEADLESS ? [");
    console.log(`    '${config.headlessMode}',`);
    console.log("    '--disable-gpu',");
    console.log("    '--window-size=1200,800',");
    config.additionalArgs.slice(0, 3).forEach(arg => {
        console.log(`    '${arg}',`);
    });
    console.log("] : [];");
    console.log();
    console.log("'goog:chromeOptions': {");
    console.log("    args: [");
    console.log("        ...headlessOptions,");
    if (version && version.major >= 139) {
        console.log("        // Critical for Chrome 139+:");
        console.log("        `--user-data-dir=/tmp/chrome-\${process.pid}-\${Date.now()}`,");
    }
    console.log("        // ... other args");
    console.log("    ]");
    console.log("}");
    console.log(chalk.gray('```\n'));
    
    // ChromeDriver compatibility check
    if (version) {
        console.log(chalk.blue.bold('🔧 ChromeDriver Compatibility:\n'));
        const chromeDriverVersion = getChromeDriverRecommendation(version.major);
        console.log(`  Chrome ${version.major} → ChromeDriver ${chromeDriverVersion}`);
        console.log(chalk.gray(`  Update with: npm install chromedriver@${chromeDriverVersion}\n`));
    }
}

function getChromeDriverRecommendation(chromeMajor) {
    // ChromeDriver version mapping
    const mapping = {
        139: '^139.0.0',
        138: '^138.0.0', 
        137: '^137.0.0',
        136: '^136.0.0',
        135: '^135.0.0'
    };
    
    return mapping[chromeMajor] || 'latest';
}

main();
