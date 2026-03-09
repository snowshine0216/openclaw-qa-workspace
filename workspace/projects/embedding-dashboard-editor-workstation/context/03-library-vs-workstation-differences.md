# Report Editor: Library vs Workstation Differences

**Sources:** Confluence design doc (5949096102), BCED-2416, Tavily research, official docs

## Architecture Differences

| Aspect | Library Web | Workstation (New Embedded) | Workstation (Legacy/Old) |
|--------|------------|---------------------------|--------------------------|
| Implementation | React web app | iFrame embedding Library web page | CEF/onetier native editor |
| Code base | react-report-editor (own) | Shares Library code via embedding | react-report-editor (shared but different behaviors) |
| Maintenance | Single source | Automatically gets Library updates | Dual maintenance burden |

## Functional Differences: Workstation Has Extra Features Library Lacks

| Feature | Workstation | Library Web |
|---------|------------|-------------|
| Convert to Intelligent Cube | ✅ Yes (Oct 2025+) | ❌ No |
| Convert to Datamart | ✅ Yes | ❌ No |
| Export PDF / Excel (from File menu) | ✅ Yes | Via Share only |
| Save dialog | Native Workstation dialog | Library web dialog |
| Close / Cancel button | X button + Cancel (native WS) | Library web close |
| Open in Python editor | ✅ Yes | ❌ Not mentioned |
| Open in SQL/Freeform SQL editor | ✅ Yes | ❌ Not mentioned |
| New subset report from dataset | ✅ Yes | ❌ Not mentioned |
| New Freeform SQL report via main menu | ✅ Yes | ❌ Not mentioned |
| New Python query report via main menu | ✅ Yes | ❌ Not mentioned |
| Certify checkbox on Save | ✅ Yes (new dashboard) | Partial |
| Set as template on Save | ✅ Yes (new dashboard) | Partial |
| Create report from Cube | Library Feb 2026+ | ✅ Feb 2026+ |

## Functional Differences: Library Has Features Workstation (Legacy) Lacked

| Feature | Library Web | Workstation (Legacy) |
|---------|------------|----------------------|
| Cancel button on initial loading | ✅ Yes | ❌ Missing |
| Modern prompt editor | ✅ Yes | Legacy prompt editor |
| Advanced Properties panel | ✅ Yes (Update 7+) | ❌ Limited |
| SQL view when paused | ✅ Yes | ❌ Limited |
| Undo/Redo | ✅ Yes (Apr 2025+) | ❌ Not in legacy |
| Themes | ✅ Yes (Dec 2025+) | ❌ Not in legacy |
| Report Templates | ✅ Yes (Nov 2025+) | ❌ Not in legacy |

## Error Handling Difference (Important for QA)

| Scenario | Old Behavior (Mojo/native editor) | New Behavior (Library embedded) |
|----------|----------------------------------|----------------------------------|
| Error caught | OK dismisses dialog, does nothing | OK **closes the editor dialog** |
| Session timeout | Native error dialog (expected) | Must show native error dialog (NOT Library login/homepage) |

**⚠️ Conflict / Gap noted:** The new embedded behavior means OK on error closes the entire editor — this is a behavior change users must be aware of and QA must explicitly verify.

## Save Dialog Difference

- **Legacy WS:** Native Workstation Save dialog always
- **New Embedded WS:** Native Workstation Save dialog (NOT Library's web save dialog) — this is a critical test point; Library web save should be intercepted and replaced

## Toolbar Behavior Difference

- **Library:** App-level settings like "Disable toolbar" can affect toolbar display
- **Workstation (Embedded):** Toolbar must NOT be affected by app-level settings — this is a known bug risk (BCED-2907)

## Context Menu Difference

- **Legacy:** May have had duplicate "Edit without data" option
- **New:** Only one "Edit without data" in context menu (BCED-2881)

## Upgrade Compatibility

| Server Version | Editor Used |
|----------------|-------------|
| 25.08+ | New WebView embedded editor |
| Pre-25.08 | Falls back to legacy editor (no broken workflows) |
| Local mode (.mstr files) | Legacy editor still used; if re-edited after Save As, shows new editor style |
