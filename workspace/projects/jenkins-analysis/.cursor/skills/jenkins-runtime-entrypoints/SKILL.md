---
name: jenkins-runtime-entrypoints
description: Governs jenkins-analysis runtime boundaries, canonical service and CLI entrypoints, and wrapper script invocation paths. Use when changing startup flow, package scripts, shell wrappers, or deployment process configuration.
---

# Jenkins Runtime Entrypoints

## Purpose

Keep runtime execution consistent and prevent path drift across server, CLI, wrappers, and deployment.

## When To Use

Use this skill when:
- Updating service startup flow
- Changing CLI/pipeline entry scripts
- Modifying `scripts/package.json` commands
- Updating `.sh` or `.mjs` wrappers that invoke Node
- Changing PM2/runtime process configuration

## Canonical Rules

1. Maintain one canonical service entrypoint and stable startup command.
2. Keep one canonical CLI entrypoint per workflow.
3. Wrapper scripts must call canonical entrypoints, not deep internal modules.
4. Centralize runtime config and environment-dependent values.
5. Validate all invocation paths whenever module layout changes.

## Runtime Boundary Rules

- `server/` handles HTTP/runtime hosting responsibilities.
- `pipeline/` handles orchestration entrypoints for build processing and CLI workflows.
- Domain logic remains in dedicated modules (`parsing`, `analysis`, `database`, `reporting`).
- Entrypoints should wire dependencies and validate config, not duplicate business logic.

## Update Workflow

1. Identify which canonical entrypoint is affected.
2. Update `scripts/package.json` scripts when startup commands change.
3. Update wrapper scripts to call canonical entrypoints.
4. Verify deployment/process manager commands still target canonical paths.
5. Run smoke checks for service start and main CLI path.

## Quality Gates

- [ ] Entry scripts are canonical and documented
- [ ] Wrappers reference canonical paths only
- [ ] Config is centralized and validated
- [ ] Service startup and CLI smoke checks pass
- [ ] Deployment commands match current canonical entrypoints

## Additional Resources

- Current project mapping: [reference.md](reference.md)
- Concrete migration examples: [examples.md](examples.md)
