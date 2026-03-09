# BCED-2416 — Issue Summary (For Future Reference)

_Saved: 2026-03-09_

## Feature Overview

**Key**: BCED-2416  
**Title**: Enhance Workstation dashboard authoring experience with Library capability parity  
**Parent Initiative**: PRD-126 — Composable and Competitive Analytical Experiences with Dashboards  
**Status**: Done (shipped 25.08; guarded by toggle default-OFF in 25.09)  
**Related design**: BCIN-7289 (Confluence) — Use Embedding Report in Workstation Plugin (26.04 scope, same architecture)

## What This Feature Does

Migrates the Workstation **dashboard authoring editor** from a legacy native React implementation to a **WebView-based embedded Library editor** (iFrame embedding of Library Web dashboard/report authoring page). This is architecturally identical to the new dossier editor migration (F43445).

### Why
- Eliminate maintenance gap between Workstation and Library (two separate authoring codebases)
- Future Library features flow automatically into Workstation via embedding
- Reduce per-feature porting effort

### How
- Single Workstation plugin handles both classic and embedding editors
- Before mounting React app, checks: **server/web version** AND **Workstation preference `new-dashboard-editor`**
- If both pass → loads embedding script, does NOT mount classic editor
- Otherwise → mounts classic React editor
- New window registered in `workstation.json`; duplicate menu entries with `isVisible`/`canExecute` conditions

## Key Capabilities Added

| Capability | Status | Source |
|---|---|---|
| Help menu toggle "Enable New Dashboard Editor" | ✅ Shipped | CGWI-1544 |
| Create dashboard → dataset select → Library editor | ✅ | BCED-2416 |
| Edit dashboard → opens Library editor directly | ✅ | BCED-2416 |
| Edit without Data (pause mode) | ✅ | BCED-2416 |
| Native Workstation save/save-as dialog | ✅ | BCED-2416 |
| Presentation mode | ✅ | BCED-2416 |
| Cancel execution button/X | ✅ | BCED-2416 / BCFR-46 |
| Cancel SQL on backend on close | ✅ | BCFR-46 |
| Custom fonts | ✅ | BCIN-1190 |
| Export (Excel, PDF) | ✅ | BCVE-1535 |
| Visualizations parity | ✅ | BCVE-1534 |
| Data Import (DI) | ✅ | BCSM-2114 |
| Auth in WS editor | ✅ | BCSA-848 |
| Bundle packaging for performance | ✅ | CGWI-1570 |
| Legacy fallback for pre-25.08 servers | ✅ | BCED-2416 |

## Key QA Findings (25.08 / 25.09)

### 25.08 QA Summary
- 66 defects: 1 P1, 29 P2, 35 P3, 1 P4
- Performance: +2s~4s for opening; scroll not smooth (DE331633, deferred)
- Upgrade: Pass — fallback to legacy works

### 25.09 QA Summary
- Feature disabled by default; user enables via Help menu toggle
- 90 defects: 4 P1, 46 P2, 38 P3, 2 P4
- First-time open: ~+20s degradation (critical risk)

## Named Defects to Watch

| Defect | Description | Risk |
|---|---|---|
| DE331555 | Missing Set as Template / Certify checkbox in save dialog | P1 regression |
| DE332260 | New saved dashboard not visible in folder without refresh | P1 regression |
| DE331633 | Hard / unsmooth scrolling in dashboard editor | P1 regression |
| DE332080 | First-create / first-render performance degradation | P1 regression |
| DE334755 | Stale message after connection editor closes | P2 |
| DE332662 | OAuth/SDK/CC popup fails in embedded editor context | P1 — critical auth path |
| BCED-3121 | Two X close buttons on menu bar | P1 |
| BCED-3136 | Cannot close editor in AQDT environment | P2 |
| BCED-3149 | Window title not updated after save | P2 |
| BCED-2997 | Link click triggers unwanted save workflow | P2 |
| BCED-3097 | No response after embedded logout | P2 |

## Library vs Workstation Gap — What Was Closed

| Gap | Closed? |
|---|---|
| Custom fonts | ✅ |
| Cancel execution (initial load, manipulation, prompts) | ✅ |
| Export visualization to Excel | ✅ |
| Selector panel with apply button | ✅ |
| Auto Narrative | ✅ |
| Embedding URL generation | ✅ |
| Pass prompts via URL API | ✅ |
| Toolbar icon consistency | ✅ |
| Future Library features auto-available | ✅ (structural) |
| Performance parity with old editor | ❌ Some degradation |
| Scroll smoothness | ❌ Deferred |
| Pre-threshold server users | ❌ Always fallback by design |

## What Remains Workstation-Only (NOT in Library Web)

- Convert Report/Dashboard to Intelligent Cube
- Data Import from local files / Super Cube creation
- Change journal
- Window switching menu (multi-window desktop management)
- Plugin architecture
- Admin console functions
- Scripts/automation
- Local mode authoring (no server)

## Child Stories Inventory

| Key | Summary | Status |
|---|---|---|
| CGWI-1544 | Add "Enable New Dashboard Editor" under Help menu | Done |
| CGWI-661 | Workstation: Support new dossier editor (save-as-template, hide legacy menu, WebError fix) | Done |
| CGWI-1570 | Bundle dashboard editor code into Workstation for performance | Done |
| CGWI-1397 | [Parent Story] WS Dashboard Library Authoring native enhancements | Done |
| BCVE-1535 | Export in WS editor | Done |
| BCVE-1534 | Visualizations in WS editor | Done |
| BCSM-2114 | Data Import in WS editor | Done |
| BCSA-848 | Auth in WS editor | Done |
| BCIN-1190 | Custom fonts in Workstation font picker | Done |
| BCFR-46 | Cancel SQL on close | Done |
| BCFR-33 | Clean unit settings on grid conversion | Done |
| BCIN-1263 | Custom font support in Workstation | Done |

## QA Plan Location

`projects/feature-plan/BCED-2416/drafts/qa-plan-draft-v2.md`
