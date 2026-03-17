# Skill Path Registrar

Resolves skill root and shared skill script paths with a deterministic fallback order. No hardcoded `.agents/skills` or `workspace-*/skills` paths.

## Quick Start

### Node/ESM

```javascript
import { resolveSharedSkill } from './lib/resolveSharedSkill.mjs';
import { findRepoRoot } from './lib/findRepoRoot.mjs';

const repoRoot = await findRepoRoot(process.cwd());
const path = await resolveSharedSkill('jira-cli', 'scripts/jira-run.sh', { repoRoot });
if (path) {
  // Use path
}
```

### Bash

```bash
source .agents/skills/skill-path-registrar/scripts/skill_path_registrar.sh
resolve_shared_skill_script jira-cli scripts/jira-run.sh
echo "$RESOLVED_SKILL_SCRIPT"
```

### CLI

```bash
REPO_ROOT=/path/to/repo node scripts/cli_resolve.mjs jira-cli scripts/jira-run.sh
```

## API Reference

### resolveSharedSkill(skillName, scriptRelativePath, options?)

Returns: `Promise<string | { found: false; needUserConfirm: true; ... } | null>`

Options:
- `repoRoot` — Repo root (default: discovered via findRepoRoot)
- `requireUserConfirm` — When true, returns needUserConfirm object instead of null when not found
- `configPath` — Path to skill_paths.json (default: ~/.openclaw/skill_paths.json)

### persistSkillPath(skillName, scriptRelativePath, absolutePath, configPath?)

Writes user-confirmed path to config. Throws if path does not exist.

### resolveSkillRoot(options)

Options:
- `fromScriptPath` — Path to script file; walks up to find SKILL.md
- `fromRunDir` — Run dir path containing skills/<name>/runs/
- `repoRoot` — Optional

### findRepoRoot(startDir?)

Walks up from startDir until .agents or AGENTS.md is found.

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `REPO_ROOT` | Repository root (optional) |
| `CODEX_HOME` | Codex skills root |
| `JIRA_CLI_SCRIPT` | Override for jira-run.sh |
| `FEISHU_NOTIFY_SCRIPT` | Override for send-feishu-notification.js |

## Config: ~/.openclaw/skill_paths.json

When a script is not found, prompt the user for the path, then:

```javascript
persistSkillPath('jira-cli', 'scripts/jira-run.sh', '/user/provided/path');
```

## Tests

```bash
node --test scripts/test/resolveSharedSkill.test.mjs
node --test scripts/test/resolveSkillRoot.test.mjs
node --test scripts/test/findRepoRoot.test.mjs
node --test scripts/test/persistSkillPath.test.mjs
```
