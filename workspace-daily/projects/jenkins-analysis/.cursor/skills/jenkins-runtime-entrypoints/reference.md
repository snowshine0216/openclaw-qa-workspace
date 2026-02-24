# Jenkins Runtime Entrypoints Reference

## Current Canonical Entrypoints

- Service entrypoint: `scripts/server/index.js`
- Build processing orchestration: `scripts/pipeline/process_build.js`
- Spectre CLI orchestration: `scripts/pipeline/spectre_cli.js`
- Database migration entrypoint: `scripts/database/migrate.js`

## Current Package Script Conventions

From `scripts/package.json`:
- `main`: `server/index.js`
- `start`: `node server/index.js`
- `test`: Jest runner

## Wrapper Script Boundary Guidance

Wrapper scripts (for example, shell scripts and `.mjs` automation scripts) should:
1. Call canonical entrypoints only.
2. Avoid importing internal modules that are not entry-safe.
3. Fail fast when required env vars/config are missing.

## PM2/Runtime Notes

Typical service command pattern:

```bash
pm2 start scripts/server/index.js --name jenkins-webhook
```

After updates:
1. Validate path exists.
2. Restart process.
3. Confirm health/log output.

## Change Checklist

- [ ] Canonical entrypoint inventory still accurate
- [ ] `package.json` scripts aligned to canonical entrypoints
- [ ] Wrapper scripts updated
- [ ] PM2/deployment commands updated
- [ ] Startup smoke test successful
