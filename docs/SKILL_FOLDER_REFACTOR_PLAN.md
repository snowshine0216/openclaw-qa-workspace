# Skill Folder Refactor Plan — Minimal Mapping

> Goal: move shared/global skills into `.agents/skills`, keep agent-specific skills under `workspace-*/skills`, and de-duplicate.

## 1. Shared Skills → `.agents/skills`

These skills should exist only once in `.agents/skills` and be referenced from workspaces (symlink or wrapper), not duplicated.

| Skill name | Final home | Notes |
| --- | --- | --- |
| agent-browser | `.agents/skills` | Shared utility (used by multiple workspaces) |
| brave-search | `.agents/skills` | Shared utility |
| browser-use | `.agents/skills` | Shared utility |
| bug-report-formatter | `.agents/skills` | Shared QA utility |
| capability-evolver / evolver | `.agents/skills` | Shared meta/experiment utility |
| clawddocs | `.agents/skills` | Shared docs helper |
| code-structure-quality | `.agents/skills` | Shared quality helper |
| code-quality-orchestrator | `.agents/skills` | Shared orchestration helper for write -> review -> refactor quality loops |
| confluence | `.agents/skills` | Shared docs/integration |
| database | `.agents/skills` | Shared DB helper |
| deep-research | `.agents/skills` | Shared research helper |
| docs-organization-governance | `.agents/skills` | Shared docs helper |
| function-test-coverage | `.agents/skills` | Shared testing helper |
| github | `.agents/skills` | Shared integration |
| humanizer | `.agents/skills` | Shared text helper (keep only this variant) |
| jira-cli | `.agents/skills` | Shared Jira helper |
| mcporter | `.agents/skills` | Shared MCP helper |
| nano-pdf | `.agents/skills` | Shared docs helper |
| notion | `.agents/skills` | Shared integration |
| obsidian | `.agents/skills` | Shared integration |
| openclaw-agent-design / review / robust-agent-design | `.agents/skills` | Shared OpenClaw design helpers |
| microstrategy-qa-workflow | `.agents/skills` | Shared MicroStrategy QA orchestrator |
| readme-gen | `.agents/skills` | Shared docs helper |
| self-improving-agent | `.agents/skills` | Shared meta helper |
| sql-toolkit | `.agents/skills` | Shared DB helper |
| summarize | `.agents/skills` | Shared summarization helper |
| tavily-search | `.agents/skills` | Shared search helper |
| test-case-generator | `.agents/skills` | Shared QA helper |
| test-patterns | `.agents/skills` | Shared testing helper |

Any copies of these in `workspace-*/skills` should be removed and replaced by references to the `.agents/skills` implementation.

## 2. Workspace-Specific Skills → `workspace-*/skills`

These skills are scoped to a specific workspace and should live only in that workspace’s `skills/` folder.

| Skill name | Final home | Notes |
| --- | --- | --- |
| qa-test-keypoints-map | `workspace-tester/skills` | Tester-only helper (moved from planner) |
| defect-analysis-reporter | `workspace-reporter/skills` | Reporter-only |
| qa-summary / qa-summary-review | `workspace-reporter/skills` | Reporter-only |
| report-quality-reviewer | `workspace-reporter/skills` | Reporter-only |
| migration-quality-check | `workspace-tester/skills` | Tester-only orchestrator |
| playwright-skill | `workspace-tester/skills` | Tester-only |
| site-knowledge-search | `workspace-tester/skills` | Tester-only |
| test-report | `workspace-tester/skills` | Tester-only |
| ai-component / ai-dockerfile / api-gateway / atxp | `workspace-healer/skills` and/or `workspace/skills` | General dev/healer-only utilities |
| auto-animate / cache-strategy-gen / caldav-calendar | `workspace-healer/skills` and/or `workspace/skills` | General dev/healer-only |
| email / error-handler | `workspace-reporter/skills`, `workspace-daily/skills`, `workspace-healer/skills`, `workspace/skills` | Keep in workspaces that actually own workflows using them |
| jenkins / jenkins-runtime-entrypoints | `workspace-daily/skills` | Daily-only |
| kubernetes | `workspace-daily/skills`, `workspace-healer/skills`, `workspace/skills` | Workspace-only infra helpers |
| microstrategy-biweb-test / microstrategy-library-test / microstrategy-ui-test / microstrategy-webstation-test | `workspace-tester/skills` | Tester-only MicroStrategy test skills (other copies removed) |
| middleware-gen / nextjs-expert / react-expert / shadcn-ui | `workspace-healer/skills` / `workspace/skills` | Dev-only helpers |
| openai-whisper | `workspace-daily/skills`, `workspace-healer/skills`, `workspace/skills` | Workspace-only (if not promoted to shared) |
| senior-backend | `workspace-healer/skills` | Healer-only (removed from other workspaces) |
| vercel-composition-patterns | `workspace-healer/skills`, `workspace-tester/skills`, `workspace/skills` | Dev/test-only |
| vercel-react-best-practices | `workspace-healer/skills`, `workspace/skills` | Dev-only (removed from tester) |
| close-test-sets | `workspace-tester/skills` | Tester-only (moved from daily) |
| qa-summary / qa-summary-review / qa-summary-related | `workspace-reporter/skills` | Reporter-only |

Additionally, the following workspace-scoped shared skills should be treated as owned by a specific workspace:

| Skill name | Final home | Notes |
| --- | --- | --- |
| performance-test-designer | `workspace-planner/skills` | Planner-only QA/perf design |
| playwright-cli | `workspace-tester/skills` | Tester-only Playwright runner |
| playwright-test-planner / generator / healer | `workspace-tester/skills` | Tester-only Playwright pipeline |
| qa-daily-workflow | `workspace-daily/skills` | Daily-only QA workflow |
| qa-plan-* | `workspace-planner/skills` | Planner-only QA planning helpers |

## 3. Removed Skills

These skills are planned to be removed from the repo (or kept only for legacy compatibility, but not used going forward):

| Skill name | Action | Notes |
| --- | --- | --- |
| gemini | remove | No longer needed as a core shared skill |
| auto-updater | remove | No longer needed as a core shared skill |
| himalaya | remove | Email integration not used in current workflows |
| humanize-ai-text | remove | Consolidate on `humanizer` only |
| model-usage | remove | Remove from `.agents` and workspaces |
| stock-analysis | remove | Remove from `.agents` and workspaces |
| storybook-gen | remove | Remove from `.agents` and workspaces |
| homeassistant | remove | Domain-specific, not needed |
| marketing-mode | remove | Domain-specific, not needed |
| openclaw-agent-mgmt | remove | Retire healer-only management skill |
| postgres | remove | Remove dedicated skill; rely on generic SQL tooling if needed |
| rate-limiter | remove | Remove from daily/healer/workspace |
| slack | remove | Remove Slack-specific integration skill |
| swagger-gen | remove | Remove from healer/reporter/workspace |
| wacli | remove | Remove dev/ops helper |
| web-deploy | remove | Remove dev/ops helper |
| wed | remove | Remove dev/ops helper |
| blogwatcher | remove | Remove monitoring helper |
| youtube-watcher | remove | Remove monitoring helper |

Implementation rule of thumb:

- If a skill appears in more than one `workspace-*/skills` folder and matches a “shared” pattern above, consolidate it into `.agents/skills`.  
- If it is tied to a single agent’s responsibilities or runtime (like reporter/tester/healer only), keep it in that workspace and remove any extra copies.

---

## Implementation Status (2026-03-06)

- **Shared skills**: Copied to `.agents/skills` with real content (agent-browser, brave-search, browser-use, bug-report-formatter, capability-evolver, evolver, clawddocs, confluence, database, deep-research, github, humanizer, jira-cli, mcporter, nano-pdf, notion, obsidian, readme-gen, self-improving-agent, sql-toolkit, summarize, tavily-search, test-case-generator, test-patterns, microstrategy-qa-workflow). OpenClaw design skills (agent-idempotency, code-structure-quality, docs-organization-governance, function-test-coverage, openclaw-agent-design, robust-agent-design) remain as symlinks to `.cursor/skills`.
- **New shared orchestrator**: Added `code-quality-orchestrator` in `.agents/skills` for strict `write (TDD) -> review -> refactor -> retest` workflows that compose existing quality/review skills.
- **Removed skills**: Deleted gemini, auto-updater, himalaya, humanize-ai-text, model-usage, stock-analysis, storybook-gen, homeassistant, marketing-mode, openclaw-agent-mgmt, postgres, rate-limiter, slack, swagger-gen, wacli, web-deploy, wed, blogwatcher, youtube-watcher from all workspaces.
- **Workspace-specific moves**: qa-test-keypoints-map moved from planner to tester; senior-backend removed from workspace and daily (healer only); vercel-react-best-practices removed from tester; microstrategy-* consolidated in tester only.
- **Shared-skill dedup**: Removed duplicate copies of shared skills from all workspace-*/skills folders.
