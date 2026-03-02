import os from 'os';
import * as cp from 'child_process';
import psList from 'ps-list';
import { killProcessByName, OSSwitch } from '../../utils/teams/msic.js';

export async function quitTeamsApp() {
    try {
        const teamsProcessName = OSSwitch(
            () => 'ms-teams.exe',
            () => 'MSTeams'
        );
        const processes = await psList();
        const teamsProcess = processes.filter((process) => process.name === teamsProcessName);
        if (teamsProcess.length > 0) {
            killProcessByName(teamsProcessName);
        }
    } catch (e) {
        console.log(e.message);
    }
}

export async function launchTeamsApp() {
    await quitTeamsApp();
    const user = os.userInfo().username;
    const launchTeamsCmd = OSSwitch(
        () => `start C:\\Users\\${user}\\AppData\\Local\\Microsoft\\WindowsApps\\ms-teams.exe`,
        () => `open /Applications/Microsoft\\ Teams.app`
    );
    cp.exec(launchTeamsCmd, {
        env: { WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS: '--remote-debugging-port=9222', ...process.env },
    });
}
