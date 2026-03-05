# Environment Management for ReportEditor Tests

This document describes how env config works for `library-automation` report-editor specs and how to add new users when migrating additional specs.

---

## 1. Config File: `tests/config/env.ts`

`getReportEnv()` loads from `.env.report` (or `.env.report.{REPORT_ENV}`) and returns:

| Key | Required | Description | Fallback when unset |
|-----|----------|-------------|---------------------|
| `reportTestUrl` | Yes | Base URL for MicroStrategy Library | `''` |
| `reportTestUser` | Yes | Default login user | `tqmsuser` |
| `reportTestPassword` | Yes | Password (shared for all users; WDIO uses empty) | `''` |
| `reportCubePrivUser` | No | createByCubePrivilege (WDIO: reportTestUserWithoutDefineCubePrivilege) | `re_nic` |
| `reportSubsetUser` | No | createByCube (WDIO: reportSubsetTestUser) | `re_ss` |
| `reportTemplateNoExecuteUser` | No | reportTemplateSecurity (WDIO: reportTemplateNoExecuteAclUser) | `ret_ne` |
| `reportTemplateUser` | No | reportTemplateSecurity (WDIO: reportTemplateTestUser) | `re_template` |

**Env var names:** lowercase `reportCubePrivUser` or uppercase `REPORT_CUBE_PRIV_USER` (both supported).

---

## 2. `.env.report` and `.env.report.example`

**Required (every setup):**
```
reportTestUrl=https://your-library.example.com/MicroStrategyLibrary
reportTestUser=tqmsuser
reportTestPassword=
```

**Optional (report-creator suite):** Add when your environment uses different users. If unset, specs use `reportCreatorData` usernames.

```bash
# Optional: report-creator suite users (WDIO: constants/report.js)
# createByCubePrivilege, createByCube, reportTemplateSecurity use these when set.
# If unset, specs fall back to reportCreatorData usernames.
# reportCubePrivUser=re_nic
# reportSubsetUser=re_ss
# reportTemplateNoExecuteUser=ret_ne
# reportTemplateUser=re_template
```

Uncomment and set values if your environment differs from WDIO defaults.

---

## 3. Spec Usage Pattern

Specs that need per-user login must:

1. **beforeAll / beforeEach:** `logout` → `login(getReportEnv().<userKey> || reportCreatorData.<entry>.username)`
2. **Password:** Use `getReportEnv().reportTestPassword` (shared for all users per WDIO).
3. **Fallback:** If env key is unset, use `reportCreatorData` so specs still run.

**Examples:**

| Spec | Env key | Fallback |
|------|---------|----------|
| createByCubePrivilege.spec.ts | `reportCubePrivUser` | `reportCreatorData.reportTestUserWithoutDefineCubePrivilege.username` |
| createByCube.spec.ts | `reportSubsetUser` | `reportCreatorData.reportSubsetTestUser.username` |
| reportTemplateSecurity.spec.ts | `reportTemplateNoExecuteUser`, `reportTemplateUser` | `reportCreatorData.reportTemplateNoExecuteAclUser.username`, `reportCreatorData.reportTemplateTestUser.username` |

**Code pattern:**
```typescript
const env = getReportEnv();
await loginPage.login({
  username: env.reportCubePrivUser || reportCreatorData.reportTestUserWithoutDefineCubePrivilege.username,
  password: env.reportTestPassword,
});
```

---

## 4. Adding New Users (Practice for New Specs)

When migrating specs that require additional users:

1. **Extend `ReportEnvConfig`** in `tests/config/env.ts`:
   ```typescript
   export interface ReportEnvConfig {
     // ... existing
     /** newSpecName (WDIO: constantName) */
     reportNewUser: string;
   }
   ```

2. **Extend `getReportEnv()`**:
   ```typescript
   reportNewUser: process.env.reportNewUser || process.env.REPORT_NEW_USER || 'default_username',
   ```

3. **Add to `.env.report.example`** (commented):
   ```
   # reportNewUser=new_user
   ```

4. **Add to `reportCreatorData`** (or relevant test-data file) with the default username/password.

5. **Use fallback pattern in spec:**
   ```typescript
   username: env.reportNewUser || reportCreatorData.newUserEntry.username,
   password: env.reportTestPassword,
   ```

This ensures specs run even when the new env key is unset.
