# MicroStrategy Selectors Reference

## Common UI Elements

### Navigation
- Library button: `.mstrNavBar LibraryButton`
- Home: `.mstrNavBar HomeIcon`
- Favorites: `.mstrNavBar Favorites`
- Search: `.mstrSearchInput`

### Dashboard Elements
- Dashboard container: `.dashboardContainer`
- Dashboard title: `.dashboardTitle`
- Filter panel: `.filterPanel`
- Filter chip: `.filterChip`
- Date range picker: `.dateRangePicker`

### Widgets
- Widget container: `.widgetContainer` or `.widget`
- Chart widget: `.chartWidget`
- Grid widget: `.gridWidget`
- KPI widget: `.kpiWidget`
- Text widget: `.textWidget`

### Grid/Table Specific
- Data grid: `.mstrGrid`
- Table header: `.gridHeader`
- Table row: `.gridRow`
- Table cell: `.gridCell`

### Charts
- Chart container: `.chartContainer`
- Axis labels: `.axisLabel`
- Legend: `.chartLegend`
- Data point: `.dataPoint`
- Tooltip: `.chartTooltip`

### Interactive Elements
- Clickable: `.interactive`
- Hoverable: `.hoverable`
- Draggable: `.draggable`

### Loading States
- Loading spinner: `.loadingSpinner`
- Skeleton loader: `.skeletonLoader`
- Progress bar: `.progressBar`

## Test IDs (if enabled)

MicroStrategy may use data attributes:
- `data-mstr-test-id`: Primary test identifier
- `data-testid`: Standard test id
- `data-widget-id`: Widget identifier
- `data-object-id`: Object identifier

## Example Usage

```bash
# Get filter panel ref
playwright-cli snapshot
playwright-cli type <filterPanel_ref> "Sales"

# Click dashboard
playwright-cli click <dashboardTitle_ref>

# Verify widget
playwright-cli run-code "await expect(page.locator('.widgetContainer')).toBeVisible()"
```
