# Skill Path Setup

Scripts that invoke shared skills (jira-cli, feishu-notify, markxmind, etc.) must resolve paths via the **skill-path-registrar** — no hardcoded `.agents/skills` or `workspace-*/skills` paths.

## Resolution Order

First existing path wins:

| Order | Source | Example |
|-------|--------|---------|
| 1 | Env override | `JIRA_CLI_SCRIPT`, `FEISHU_NOTIFY_SCRIPT` |
| 2 | Persisted config | `~/.openclaw/skill_paths.json` |
| 3 | Repo-local | `$REPO_ROOT/.agents/skills/<skill>/<path>` |
| 4 | CODEX_HOME | `$CODEX_HOME/skills/<skill>/<path>` |
| 5 | Home agents | `~/.agents/skills/<skill>/<path>` |
| 6 | OpenClaw | `~/.openclaw/skills/<skill>/<path>` |

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `JIRA_CLI_SCRIPT` | Full path to jira-run.sh |
| `FEISHU_NOTIFY_SCRIPT` | Full path to send-feishu-notification.js |
| `REPO_ROOT` | Repository root (optional; registrar can discover via `.agents` or `AGENTS.md`) |
| `CODEX_HOME` | Codex skills root (e.g. `~/.codex/skills`) |

## Initializing Shared Skills

Run `./src/init-skills` or `make init-skills` to create symbolic links from `~/.openclaw/skills` to each skill in `.agents/skills`. This ensures shared skills are available for resolution.

## Config File: ~/.openclaw/skill_paths.json

When a script is not found after all fallbacks, the agent or script will prompt you for the exact path. After you provide it, the path is validated and written to `~/.openclaw/skill_paths.json` for future runs.

Format:

```json
{
  "jira-cli/scripts/jira-run.sh": "/absolute/path/to/jira-run.sh",
  "feishu-notify/scripts/send-feishu-notification.js": "/absolute/path/to/send-feishu-notification.js"
}
```

Keys use the format `skillName/scriptRelativePath`.

## Troubleshooting

### "script not found"

1. Ensure shared skills are initialized: `./src/init-skills`
2. If the skill exists in `.agents/skills`, ensure `REPO_ROOT` is set or the script runs from within the repo (registrar discovers repo via `.agents` or `AGENTS.md`)
3. When prompted, provide the full absolute path to the script; it will be validated and persisted

### Path not persisting

- Config is written to `~/.openclaw/skill_paths.json`; ensure the directory exists and is writable
- The registrar validates that the path exists before persisting

## For Script Authors

See [.agents/skills/skill-path-registrar/README.md](../.agents/skills/skill-path-registrar/README.md) for API usage, Node/ESM imports, and bash integration.
