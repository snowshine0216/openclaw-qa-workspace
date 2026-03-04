# Site Knowledge: Insights Domain

## Overview

- **Domain key:** `insights`
- **Components covered:** InsightsPage, KpiEditor, KpiTile
- **Spec files scanned:** 0
- **POM files scanned:** 3

## Components

### InsightsPage
- **CSS root:** `.mstrd-LoadingIcon-loader`
- **User-visible elements:**
  - Loading Icon (`.mstrd-LoadingIcon-loader`)
- **Component actions:**
  - `openInsightsPage()`
- **Related components:** _none_

### KpiEditor
- **CSS root:** `.mstrd-KpiEditor`
- **User-visible elements:**
  - Kpi Edtor Container (`.mstrd-KpiEditor`)
- **Component actions:**
  - `clickCloseButton()`
  - `clickSaveButton()`
  - `renameInsight(name)`
- **Related components:** getKpiEdtorContainer

### KpiTile
- **CSS root:** `.info-pane-container`
- **User-visible elements:**
  - Info Pane (`.info-pane-container`)
  - Insights Notification Button (`.mstr-insights-icon`)
  - Kpi Insights Notification Button (`.mstr-insights-icon.mstr-insights-icon--in-kpi-grid-view`)
  - Open Dossier Button (`.mstr-open-dossier-icon.mstr-open-dossier-icon--in-kpi-grid-view`)
- **Component actions:**
  - `clickEditButton()`
  - `clickKpiTile(name)`
  - `deleteInsight()`
- **Related components:** _none_

## Common Workflows (from spec.ts)

1. _none_

## Common Elements (from POM + spec.ts)

1. Info Pane -- frequency: 1
2. Insights Notification Button -- frequency: 1
3. Kpi Edtor Container -- frequency: 1
4. Kpi Insights Notification Button -- frequency: 1
5. Loading Icon -- frequency: 1
6. Open Dossier Button -- frequency: 1

## Key Actions

- `clickCloseButton()` -- used in 0 specs
- `clickEditButton()` -- used in 0 specs
- `clickKpiTile(name)` -- used in 0 specs
- `clickSaveButton()` -- used in 0 specs
- `deleteInsight()` -- used in 0 specs
- `openInsightsPage()` -- used in 0 specs
- `renameInsight(name)` -- used in 0 specs

## Source Coverage

- `pageObjects/insights/**/*.js`
