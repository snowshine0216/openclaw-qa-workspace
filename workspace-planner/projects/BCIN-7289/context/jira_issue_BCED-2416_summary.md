# Supportive Artifact: BCED-2416 — Lessons Learned for BCIN-7289

**Type:** Feature  
**Status:** Done  
**Assignee:** Yang Du  
**Labels:** Library_and_Dashboards, Moved_DoneInEmbeddingCTC, bi-dashboards_team  
**URL:** https://strategyagile.atlassian.net/browse/BCED-2416

---

## Summary
**Enhance Workstation dashboard authoring experience with Library capability parity.**  
This feature **embeds the Library Web dashboard editor into Workstation via WebView/iFrame**, replacing the legacy WS-native dashboard editor. This is the **direct precedent and analog** for BCIN-7289 (same pattern, applied to Reports instead of Dashboards).

---

## Key Lessons from BCED-2416 (applicable to BCIN-7289 Report embedding)

### 1. Feature Flag / Preference Gating
- Introduced as **opt-in** via `Help Menu > "Enable New Dashboard Editor"` toggle
- In 25.09 the feature was **disabled by default**; in 25.08 it was enabled by default
- **Lesson for BCIN-7289:** Expect a similar preference toggle for the new Report editor. Test both enabled and disabled states exhaustively.

### 2. Entry Points
- New Dashboard: from Create icon or Workstation Menu → popup dataset select → new editor
- Edit Dashboard: right-click dashboard → Edit button
- Edit Without Data: right-click → "Edit without data" → pause mode
- Create Dashboard from Dataset: right-click dataset → "Dashboard from CSV"
- **Lesson for BCIN-7289:** Map equivalent report entry points (open existing report, create new report, create from template).

### 3. Save / Save-As Workflows
- "Save" and "Save As" must pop up **native Workstation save dialog** (not Library's)
- **Known defects:** 
  - Missing "Certify" and "Set as template" checkboxes on new dashboard save (DE331555 / CGWI-1000)
  - New dashboard not displayed under folder after create/save-as; needs refresh (DE332260)
  - Dashboard name not updated in toolbar after create+save (BCED-3149)
- **Lesson for BCIN-7289:** Verify Workstation-native save dialog; verify object appears in folder immediately after save; verify name/title update in toolbar.

### 4. Session Timeout / Auth
- Login page shown inside embedded editor on session timeout (BCED-2945, BCED-3022)
- "Input credential" popup shown but connection still fails (BCED-3024)
- After session expire, cannot close dashboard (BCED-2912)
- Cancel execution during executing redirects to embedded library home page (BCED-2942)
- **Lesson for BCIN-7289:** Session timeout handling in the embedded report editor is a critical test area. Verify: graceful recovery, no redirect to Library home, ability to close the editor.

### 5. Cancel / Close Execution
- Cancel button during execution → should stay in WS, not redirect to Library (BCED-2942)
- Close (X button) when dashboard running → crash errors (BCED-2893, BCED-2971)
- Cancel re-prompt → dashboard cannot close (BCED-2947)
- Click close during execute → instance not deleted (BCED-2932)
- **Lesson for BCIN-7289:** Cancel execution paths in the embedded report editor need explicit testing — especially prompt cancellation and closing while executing.

### 6. Workstation-Native vs Library Application Settings
- Workstation should NOT use application-level settings (e.g. Disable toolbar) when in embedded editing mode (BCED-2907)
- "Generate embedding URL" button caused a gap in toolbar (BCED-2906)
- **Lesson for BCIN-7289:** Application-level settings must not bleed into Workstation embedded report editor. Verify toolbar configuration isolation.

### 7. Compatibility / Server Version Fallback
- 25.08 Server → new WebView editor  
- Pre-25.08 Server → fallback to legacy editor  
- No workflow breaks across versions
- **Lesson for BCIN-7289:** Server version compatibility and graceful fallback to legacy report editor is a required test dimension.

### 8. Export
- Export behavior changed from 25.07 (BCED-3035); export settings not followed (BCED-2980)
- Export to PDF broken due to crash (BCED-2879)
- **Lesson for BCIN-7289:** Export (PDF, Excel) from embedded report editor must be verified end-to-end.

### 9. Performance
- 1st-time creating/opening: +20s (network-dependent) due to WebView/Library resources download
- Subsequent opens: +2s–4s above legacy editor baseline
- Scroll degradation (DE331633)
- **Lesson for BCIN-7289:** First-load performance (WebView cold start), subsequent navigation performance are risk areas.

### 10. Security / Privileges
- Workstation embedded editor matched Library Web's privilege/ACL behavior
- User must not be able to edit without proper privileges/ACL
- **Lesson for BCIN-7289:** Verify that report editing privilege and ACL enforcement remains correct in the embedded editor.

### 11. Data Sources / OAuth
- Snowflake OAuth, Python data source, Community Connector OAuth, Native OAuth all failed in server-based mode (BCED-2531, BCED-2901, BCED-2903, BCED-2873)
- **Lesson for BCIN-7289:** If reports use prompted or connected data sources, connection and OAuth flows inside the embedded editor need testing.

### 12. Auto Dashboard / NLG / DI / Transaction (sub-features in embedded editor)
- Multiple sub-feature teams (Auto Dashboard, NLG, Data Import, Export, Visualization, Auth) had to do "in ws editor" delivery work items
- **Lesson for BCIN-7289:** All sub-feature capabilities that work in Library Report Editor must be validated in the Workstation embedding context.

### 13. Notable QA Metrics from BCED-2416
- 25.08: 66 defects (1 P1, 29 P2, 35 P3, 1 P4)
- 25.09: 90 defects (4 P1, 46 P2, 38 P3, 2 P4)
- High defect volume signals the complexity of this embedding pattern

---

## Relevant Child Issues (Key Risk Areas)
| Key | Category | Lesson |
|-----|----------|--------|
| BCED-2956 / CGWI-1000 | Save | Missing Certify/Set as template on save |
| BCED-3022 / BCED-2945 | Auth/Session | Session timeout login page shown inside editor |
| BCED-2942 | Cancel | Cancel execution redirects to Library home |
| BCED-2907 | Settings | Application-level settings bleed into WS editor |
| BCED-3035 / BCED-2980 | Export | Export behavior regression |
| BCED-2906 | UI | Toolbar gap from "Generate embedding URL" button |
| BCED-3149 | UI | Dashboard name not updated after save |
| BCED-2879 | Export | Crash on PDF export |
| BCED-2989 / BCED-2552 | Performance | 20s cold start, scroll degradation |
| BCED-2531 / BCED-2901 / BCED-2903 | Data Sources | OAuth failures in server-based mode |
