# BCED-2416 — Embedding Dashboard Editor in Workstation

**Jira:** https://strategyagile.atlassian.net/browse/BCED-2416  
**Summary:** Enhance Workstation dashboard authoring experience with Library capability parity  
**Status:** ✅ Done | **Fix Version:** 25.09 | **Assignee:** Yang Du  
**Parent:** PRD-126 — Composable and Competitive Analytical Experiences with Dashboards  
**Labels:** `Library_and_Dashboards`, `Moved_DoneInEmbeddingCTC`, `bi-dashboards_team`

---

## 📋 Description

The feature replaces Workstation's legacy native dashboard editor with a **WebView-based editor** (embedded Library web authoring page) to achieve parity with Library Web and eliminate dual-maintenance burden.

**Goal:** Replace the old onetier/CEF native editor with a Workstation plugin + Embedding SDK approach, so all Library authoring improvements automatically apply to Workstation too.

**Key requirements:**
- **New Dashboard:** Enable via `Help menu → "Enable New Dashboard Editor"` → select dataset → launch new editor
- **Edit Dashboard:** Right-click dashboard → Edit; or "Edit without data" → enters pause mode
- **Create from Dataset:** Right-click dataset → "Dashboard from X.csv"
- **Local Mode:** Legacy editor retained until 25.12 (not affected by this change)
- **Cancel Execution:** Cancel button / X button must cancel execution properly
- **Save:** Uses native Workstation save dialog (Save / Save As)

---

## 🔗 Key Linked / Child Issues

| Category | Key Issues |
|---|---|
| **Core delivery** | BCED-2497, BCED-2505, BCED-2614 (Delivery Work Items 1–4) |
| **Cross-team eval** | BCED-2470 (Parent Story – cross team evaluation) |
| **Performance** | BCED-2544, BCED-2552, BCED-2528 (degradation / cache / preloading) |
| **Auth / OAuth** | BCED-2531, BCSA-848 (OAuth/SDK/CC sources on WS server-based mode) |
| **Automation** | BCED-2485, CGWI-1397 |
| **Component tests** | BCED-2636 |

---

## 🧪 Embedding Test Key Points

### 1. 🚀 Editor Launch & Activation
- Enable via `Help → "Enable New Dashboard Editor"` toggle works
- New dashboard creation flow: create icon → dataset select popup → Create button → editor opens
- Edit existing dashboard: right-click → Edit opens editor directly
- "Edit without data" enters pause mode correctly
- Create dashboard from dataset (right-click dataset)
- Pre-25.08 server: falls back to **legacy editor** (compatibility)

### 2. 💾 Save / Save As
- Save and Save As trigger **native Workstation dialog** (not Library's web dialog)
- "Certify" and "Set as template" checkboxes present when saving a new dashboard (BCED-2956, CGWI-1000)
- Newly saved dashboard appears in folder **without needing refresh** (BCED-3149)
- Save As to folder shows the item correctly (BCVE-1621)

### 3. ❌ Cancel / Close
- Cancel button stops execution and closes cleanly
- X button on editor closes and cancels any running execution (BCED-2971, BCED-2981)
- Cancel on prompted dashboard deletes the instance (BCED-2932, BCED-2947)
- No crash on close when dashboard is in running/busy state (BCED-2893)
- Only one X button visible on the menu bar (BCED-3121)

### 4. ⏱️ Session Timeout / Auth
- Session timeout → shows **native error dialog**, NOT Library login/homepage (BCED-3022, BCED-2912, BCED-2942, BCED-2945)
- OAuth connections (Snowflake/Azure, Snowflake/PingOne, Salesforce, SurveyMonkey) work in WS server-based dashboard mode (BCED-2901, BCED-2903, BCED-3058, BCED-3065, BCED-3066)
- DB OAuth sources work on WS server-based dashboard (BCED-3066)
- CommunityConnector OAuth can return to source page after approval (BCED-3089)

### 5. 🔗 Navigation / Links
- Links to other dashboards: toolbar actions still work after navigation (BCED-2967)
- Link in same tab: doesn't trigger save workflow (BCED-2997)
- Clicking link to another dashboard doesn't make editor empty (BCED-2926)

### 6. 📊 Export
- Export PDF follows correct export settings (BCED-2980, BCED-3035)
- Download `.mstr` file works (BCED-2931)

### 7. 🎨 UI / Menu Bar
- Theme menu on menu bar renders correctly
- Toolbar not affected by app-level settings (e.g. "Disable toolbar" should not apply in WS editor) (BCED-2907)
- No gap between toolbar and dashboard from "Generate embedding URL" button (BCED-2906)
- Layers panel width consistent with 25.07 (BCED-2883)
- Dashboard formatting properties dialog fully displayed and scrollable (BCED-3129)
- Save dropdown only shows when >1 option available (BCED-3142)
- No duplicate "Edit without data" in context menu (BCED-2881)

### 8. ⚡ Performance
- 1st open dashboard: acceptable degradation (~2–4s vs. legacy; 1st-time load ~+20s on network)
- Scroll in dashboard is smooth (DE331633 — scroll roughness known issue)
- Subsequent opens use caching (BCED-2552, BCED-2528)

### 9. 🔒 Security / ACL
- User **without** edit privilege cannot open the authoring editor
- ACL behavior matches Library Web

### 10. 🔄 Upgrade Compatibility
- **25.08+ server** → new WebView editor
- **Pre-25.08 server** → falls back to legacy editor seamlessly; no workflow breaks
- Local mode (`.mstr` files): legacy editor still used; if re-edited after Save As, shows new editor style

### 11. 📦 Data Sources / Datasets
- Add dataset, replace dataset dialogs work correctly (BCED-2982)
- Insert unpublished dataset shows clear error message (BCED-2891)
- Python data source on WS server-based dashboard works (BCED-2873)
- Prompted dataset replace: no crash (BCED-2928)

### 12. 🖥️ Environment-Specific
- Tanzu environment: dashboards execute correctly (BCED-3009)
- AQDT server: dashboard can be closed (BCED-3136)
- Embedding Library: logout works (BCED-3097)

---

## 📊 QA Summary

### E2E & Functionality — Pass
- 90 defects detected total (4 P1, 46 P2, 38 P3, 2 P4) tracked in DS2856
- All MTDI blocker defects fixed in 25.09
- Blitz test: **Pass**

### Performance — Low Pass
- Opening dashboard: +2–4s vs legacy (network resources from Library)
- 1st-time create/open: ~+20s (network dependent)
- Scroll not smooth (DE331633 — moved to future release)
- Feature disabled by default in 25.09; user must enable via Help menu

### Upgrade & Compatibility — Pass
- 25.08+ server: new WebView editor
- Pre-25.08 server: legacy editor fallback; no broken workflows

### Security — Pass
- Privileges/ACL matches Library Web behavior

### Automation
- WDIO automation implemented in US614013

---

## 📎 References

- **QA Test Cases Wiki:** https://microstrategy.atlassian.net/wiki/spaces/CQT/pages/5186127599/F43445+Enhance+Workstation+dashboard+authoring+experience+with+Library+capability+parity
- **Performance Test Results:** https://microstrategy.atlassian.net/wiki/spaces/CQT/pages/5190221884
- **Confluence Feature Doc:** F43445; Consolidate Dashboard Editor in Library and Workstation (ID: 5137467708)

---

*Generated: 2026-03-09 | Source: BCED-2416 + child issues via jira-cli*
