# BCED-2416 — Embedding Dashboard Editor in Workstation: Summary

**Source:** docs/BCED-2416-embedding-dashboard-editor-workstation.md  
**Feature:** Replace Workstation's legacy native dashboard editor with a WebView-based editor (embedded Library web authoring page)

## Key Architecture Change
- Old: CEF/onetier native editor (`react-report-editor` shared module, different WS/Library behaviors)
- New: iFrame embedding via Workstation plugin + Embedding SDK (same as new Dossier plugin)
- Goal: Library authoring improvements automatically apply to Workstation

## Entry Points
- New Dashboard: Help menu → "Enable New Dashboard Editor" → dataset select popup → Create
- Edit Existing: Right-click dashboard → Edit
- Edit Without Data: Enters pause mode
- Create from Dataset: Right-click dataset → "Dashboard from X.csv"

## Critical Test Areas (from BCED-2416 doc)
1. Editor Launch & Activation
2. Save / Save As (native WS dialog, not Library web dialog)
3. Cancel / Close (X button, cancel execution)
4. Session Timeout / Auth (native error dialog, NOT Library login)
5. Navigation / Links (toolbar actions, same-tab links)
6. Export (PDF, .mstr download)
7. UI / Menu Bar (theme, toolbar, layers panel)
8. Performance (1st open ~+2-4s, caching on subsequent)
9. Security / ACL (without edit privilege cannot open editor)
10. Upgrade Compatibility (25.08+ new editor, pre-25.08 fallback to legacy)
11. Data Sources / Datasets (add/replace dataset dialogs)
12. Environment-Specific (Tanzu, AQDT, Embedding Library)

## Menus / Actions (from Confluence design doc Section 4)
### Menus:
- Save
- Save As
- Set Template
- Save Theme
- Close btn / Close Window

### Actions:
- Convert to cube
- Convert to datamart

### Interactions / Entry Points:
- Link drill
- Link to a Report/Document/Dashboard
- Open report in Python / SQL editor
- Edit using context menu
- New report by click + icon
- New subset report from dataset
- New report / subset / freeform SQL / Python query report by Workstation main menu

## Error Handling (2 levels)
1. When caught in Mojo/report editor: OK dismisses dialog, does nothing
2. When caught in Library: OK closes the editor dialog (**NEW behavior for users**)
