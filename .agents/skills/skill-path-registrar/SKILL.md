---
name: skill-path-registrar
description: Resolves skill root and shared skill script paths with fallback order and user-confirmation persistence. Use when scripts need to invoke jira-cli, feishu-notify, or other shared skills without hardcoded paths.
---

# Skill Path Registrar

## Purpose

Provide a unified way to resolve:
1. **Skill root** — from script path or run directory
2. **Shared skill script paths** — jira-cli, feishu-notify, markxmind, etc., with fallback order and optional user-confirmation when not found

## Resolution Order (Shared Skills)

1. Env override (`JIRA_CLI_SCRIPT`, `FEISHU_NOTIFY_SCRIPT`, etc.)
2. Persisted config (`~/.openclaw/skill_paths.json`)
3. Repo-local (`$REPO_ROOT/.agents/skills/<skill>/<path>`)
4. `$CODEX_HOME/skills/<skill>/<path>`
5. `~/.agents/skills/<skill>/<path>`
6. `~/.openclaw/skills/<skill>/<path>`

## API (Node/ESM)

```javascript
import { resolveSharedSkill, persistSkillPath } from './lib/resolveSharedSkill.mjs';
import { resolveSkillRoot } from './lib/resolveSkillRoot.mjs';
import { findRepoRoot } from './lib/findRepoRoot.mjs';

// Resolve shared skill script
const path = await resolveSharedSkill('jira-cli', 'scripts/jira-run.sh', { repoRoot });
if (path) { /* use path */ }
else if (path?.needUserConfirm) { /* prompt user, then persistSkillPath */ }

// Resolve skill root
const { skillRoot, skillName } = await resolveSkillRoot({ fromScriptPath: import.meta.url });
```

## Bash Integration

```bash
source .agents/skills/skill-path-registrar/scripts/skill_path_registrar.sh
if resolve_shared_skill_script jira-cli scripts/jira-run.sh; then
  exec "$RESOLVED_SKILL_SCRIPT" me
fi
```

## CLI

```bash
node .agents/skills/skill-path-registrar/scripts/cli_resolve.mjs jira-cli scripts/jira-run.sh
# Output: /path/to/jira-run.sh
```

## When Not Found

When `requireUserConfirm: true` and no path is found, the API returns `{ found: false, needUserConfirm: true, triedPaths: [...] }`. The caller should prompt the user for the path, validate it exists, then call `persistSkillPath(skillName, scriptRelativePath, userPath)`.
