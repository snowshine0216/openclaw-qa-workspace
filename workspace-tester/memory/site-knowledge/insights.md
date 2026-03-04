# Site Knowledge: insights

> Components: 3

### InsightsPage
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `LoadingIcon` | `.mstrd-LoadingIcon-loader` | element |

**Actions**
| Signature |
|-----------|
| `openInsightsPage()` |

**Sub-components**
_none_

---

### KpiEditor
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `KpiEdtorContainer` | `.mstrd-KpiEditor` | element |

**Actions**
| Signature |
|-----------|
| `clickSaveButton()` |
| `renameInsight(name)` |
| `clickCloseButton()` |

**Sub-components**
- getKpiEdtorContainer

---

### KpiTile
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `InfoPane` | `.info-pane-container` | element |
| `InsightsNotificationButton` | `.mstr-insights-icon` | element |
| `KpiInsightsNotificationButton` | `.mstr-insights-icon.mstr-insights-icon--in-kpi-grid-view` | element |
| `OpenDossierButton` | `.mstr-open-dossier-icon.mstr-open-dossier-icon--in-kpi-grid-view` | element |

**Actions**
| Signature |
|-----------|
| `clickKpiTile(name)` |
| `clickEditButton()` |
| `deleteInsight()` |

**Sub-components**
_none_
