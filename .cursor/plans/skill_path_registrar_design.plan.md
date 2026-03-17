---
name: Skill Path Registrar Design
overview: Introduce a unified Skill Path Registrar to eliminate hardcoded skill folder paths, provide deterministic resolution for skill root and shared skill scripts, and add user-confirmation + persistence when fallbacks fail.
todos:
  - id: doc-readme
    content: Add Skill Path Setup section to root README.md
    status: completed
  - id: registrar-module
    content: Create .agents/skills/skill-path-registrar/ with lib and scripts
    status: completed
  - id: tests
    content: Create test files for registrar (unit + integration)
    status: completed
  - id: evals-update
    content: Update openclaw-agent-design and openclaw-agent-design-review evals
    status: completed
  - id: design-skill-update
    content: Update openclaw-agent-design SKILL.md and reference.md
    status: completed
  - id: review-skill-update
    content: Update openclaw-agent-design-review with PATH-001, PATH-002
    status: completed
  - id: validate-paths
    content: Extend validate_paths.sh to flag hardcoded skill paths
    status: completed
  - id: migration
    content: Migrate existing scripts to use registrar
    status: completed
isProject: false
---

# Skill Path Registrar — Design Plan

## Problem Summary

Scripts in OpenClaw skills frequently call shared skill scripts (jira-cli, feishu-notify, markxmind, etc.) or need to resolve their own skill root. Current issues:

1. **Hardcoded paths** — `$REPO_ROOT/.agents/skills/jira-cli/scripts/jira-run.sh`, `workspace-reporter/skills/qa-summary`, `cd "$SCRIPT_DIR/../../../.."` with varying depths
2. **Scattered resolution logic** — `sharedSkillPaths.mjs`, `check_runtime_env.mjs`, `runtimeEnv.mjs`, `notify_feishu.sh`, `phase0.sh` each implement different fallback orders
3. **No user-confirmation flow** — When all fallbacks fail, scripts exit with "script not found" instead of prompting the user and persisting the path

---

## 1. Skill Path Setup Documentation (Root README)

**Location:** [README.md](README.md) (repository root)

Add a new section **"Skill Path Setup"** after "Usage of Shared Skills" (around line 80). Content:

```markdown
### Skill Path Setup

Scripts that invoke shared skills (e.g. jira-cli, feishu-notify) must use the **skill-path-registrar** to resolve paths — no hardcoded `.agents/skills` or `workspace-*/skills` paths.

**Resolution order (first found wins):**
1. Env override: `JIRA_CLI_SCRIPT`, `FEISHU_NOTIFY_SCRIPT`, etc.
2. Persisted config: `~/.openclaw/skill_paths.json`
3. Repo-local: `$REPO_ROOT/.agents/skills/<skill>/<path>`
4. `CODEX_HOME/skills/<skill>/<path>`
5. `~/.agents/skills/<skill>/<path>`
6. `~/.openclaw/skills/<skill>/<path>`

**When a script is not found:** The agent or script will prompt you for the exact path. After you provide it, the path is validated and written to `~/.openclaw/skill_paths.json` for future runs.

**Config file:** `~/.openclaw/skill_paths.json` stores user-confirmed paths:
```json
{
  "jira-cli/scripts/jira-run.sh": "/absolute/path/to/jira-run.sh",
  "feishu-notify/scripts/send-feishu-notification.js": "/absolute/path/to/send-feishu-notification.js"
}
```

**For script authors:** See [.agents/skills/skill-path-registrar/README.md](.agents/skills/skill-path-registrar/README.md) for API usage.

```

Also add a dedicated **`docs/SKILL_PATH_SETUP.md`** with:
- Full fallback order and env var reference
- How to run `./src/init-skills` to symlink shared skills to `~/.openclaw/skills`
- Troubleshooting: "script not found" → user confirmation flow
- Link from root README: "Full details: docs/SKILL_PATH_SETUP.md"

---

## 2. Registrar Module and Tests

### Module structure

```

.agents/skills/skill-path-registrar/
├── SKILL.md
├── README.md                    # API usage, env vars, examples
├── lib/
│   ├── resolveSkillRoot.mjs
│   ├── resolveSharedSkill.mjs
│   └── findRepoRoot.mjs
├── scripts/
│   ├── cli_resolve.mjs
│   └── skill_path_registrar.sh
└── scripts/test/                # Test files (required)
    ├── resolveSkillRoot.test.mjs
    ├── resolveSharedSkill.test.mjs
    ├── findRepoRoot.test.mjs
    └── persistSkillPath.test.mjs

```

### Test file requirements

| Test File | Scenarios |
|-----------|-----------|
| `resolveSkillRoot.test.mjs` | fromScriptPath finds SKILL.md; fromRunDir extracts skill from path; returns null when not found |
| `resolveSharedSkill.test.mjs` | env override wins; config wins over repo; repo-local found; fallback order; returns needUserConfirm when not found |
| `findRepoRoot.test.mjs` | finds repo from subdir when .agents exists; finds when AGENTS.md exists; returns null when neither |
| `persistSkillPath.test.mjs` | writes to config; validates path exists before write; rejects invalid path |

**Smoke command:** `node --test .agents/skills/skill-path-registrar/scripts/test/resolveSharedSkill.test.mjs`

---

## 3. Evals Updates

### openclaw-agent-design evals

**File:** [.agents/skills/openclaw-agent-design/evals/evals.json](.agents/skills/openclaw-agent-design/evals/evals.json)

Add expectation to existing evals (id 1 and 2) or add new eval:

- **Eval 1 / 2:** Add expectation: `"Design doc uses skill-path-registrar or mandates no hardcoded skill paths for shared skill script resolution"`

- **New eval (optional id 4):** Prompt: "Design a script-bearing skill that invokes jira-cli and feishu-notify. Ensure the design specifies path resolution via skill-path-registrar and documents the user-confirmation flow when a shared skill script is not found."
  - Expectations: design references skill-path-registrar; design documents fallback order; design includes user-confirmation flow when not found

### openclaw-agent-design-review evals

**File:** [.agents/skills/openclaw-agent-design-review/evals/evals.json](.agents/skills/openclaw-agent-design-review/evals/evals.json)

- **Eval 2:** Add expectation: `"Report flags hardcoded .agents/skills or workspace-*/skills paths as P1 (PATH-001) when present"`

- **New eval (optional id 4):** Prompt: "Review a design doc that hardcodes `$REPO_ROOT/.agents/skills/jira-cli/scripts/jira-run.sh` in a phase script. Identify PATH-001 and recommend using skill-path-registrar."
  - Expectations: Report contains PATH-001 finding; Report recommends skill-path-registrar; Status is fail (P1 blocks pass)

### skill-path-registrar evals (new)

**File:** `.agents/skills/skill-path-registrar/evals/evals.json` (create)

- Eval: "Resolve jira-cli scripts/jira-run.sh with REPO_ROOT set. Output must be a valid path or needUserConfirm."
- Eval: "Resolve feishu-notify scripts/send-feishu-notification.js when not in repo. Should return needUserConfirm or path from CODEX_HOME/~/.openclaw."

### CI path updates

**EVALS_TRIGGER.md** and any CI workflow that runs evals on path changes:

- Add path: `'.agents/skills/skill-path-registrar/**'`
- Add run step: `node .agents/skills/skill-path-registrar/evals/run_evals.mjs --dry-run` (if evals exist)

---

## 4. Solution Summary (from original plan)

### Registrar API

- `resolveSkillRoot({ fromScriptPath | fromRunDir, repoRoot? })` → `{ skillRoot, skillName, repoRoot }`
- `resolveSharedSkill(skillName, scriptRelativePath, { repoRoot, envOverrides, requireUserConfirm, configPath })` → path or `{ found: false, needUserConfirm: true, triedPaths }`
- `persistSkillPath(skillName, scriptRelativePath, absolutePath, configPath?)` → writes to `~/.openclaw/skill_paths.json`

### Fallback order

1. Env override
2. `~/.openclaw/skill_paths.json`
3. `$repoRoot/.agents/skills/<skill>/<path>`
4. `$CODEX_HOME/skills/<skill>/<path>`
5. `$HOME/.agents/skills/<skill>/<path>`
6. `$HOME/.openclaw/skills/<skill>/<path>`

### Design and review skill updates

- openclaw-agent-design: Section 6.5 Skill Path Resolution; no hardcoded paths rule
- openclaw-agent-design-review: PATH-001 (P1), PATH-002 (P2); validate_paths.sh enhancement

---

## Implementation Checklist

1. **Documentation:** Add Skill Path Setup to [README.md](README.md); create [docs/SKILL_PATH_SETUP.md](docs/SKILL_PATH_SETUP.md)
2. **Registrar module:** Create `.agents/skills/skill-path-registrar/` with lib, scripts, SKILL.md, README.md
3. **Tests:** Create `scripts/test/*.test.mjs` for resolveSkillRoot, resolveSharedSkill, findRepoRoot, persistSkillPath
4. **Evals:** Update openclaw-agent-design and openclaw-agent-design-review evals.json; create skill-path-registrar evals; update EVALS_TRIGGER.md / CI paths
5. **Design skill:** Update openclaw-agent-design SKILL.md and reference.md
6. **Review skill:** Update openclaw-agent-design-review with PATH-001, PATH-002
7. **validate_paths.sh:** Extend to flag hardcoded skill paths
8. **Migration:** Migrate sharedSkillPaths.mjs, notify_feishu.sh, phase0.sh, validate_testcase_structure.sh
9. **Run tests:** `node --test .agents/skills/skill-path-registrar/scripts/test/*.test.mjs`
10. **Run evals:** `node .agents/skills/openclaw-agent-design/evals/run_evals.mjs --dry-run`

---

## References

- [sharedSkillPaths.mjs](workspace-reporter/skills/qa-summary/scripts/lib/sharedSkillPaths.mjs)
- [check_runtime_env.mjs](.agents/skills/openclaw-agent-design/examples/check_runtime_env.mjs)
- [runtimeEnv.mjs](workspace-planner/skills/qa-plan-orchestrator/scripts/lib/runtimeEnv.mjs)
- [SKILL_FOLDER_REFACTOR_PLAN.md](docs/SKILL_FOLDER_REFACTOR_PLAN.md)
- [openclaw-agent-design evals](.agents/skills/openclaw-agent-design/evals/evals.json)
- [openclaw-agent-design-review evals](.agents/skills/openclaw-agent-design-review/evals/evals.json)
```

