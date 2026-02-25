# MicroStrategy Workstation - Metric Editor Baseline

**Source:** https://www2.microstrategy.com/producthelp/Current/Workstation/en-us/Content/Metric_Editor_Workstation.htm

## Overview

The Metric Editor in Workstation allows users to create and add metrics to perform calculations on business data. Metrics represent business measures and key performance indicators used on reports, documents, and dashboards.

## Key Capabilities (Desktop Workstation)

### Metric Creation
1. **Formula Definition:**
   - Function: Calculation applied (Sum, Count, etc.)
   - Expression: Business data (facts, attributes, other metrics)
   
2. **Complexity Levels:**
   - Simple metrics: `Sum(Cost)`
   - Compound metrics: `Sum(Cost + Profit)`
   - Non-group functions: `RunningAvg(Cost)`
   - Apply functions (pass-through): `ApplySimple("Datediff(YY, #0, getdate())", [BIRTH_DATE])`

### UI Workflow
1. File menu → New Metric (or double-click existing)
2. Name the metric
3. Choose data type (Default, Binary, Decimal, etc.)
4. Add description
5. Build formula using:
   - **Guided experience:** Functions pane + Objects pane
   - **Direct typing:** Formula pane with auto-complete
6. Validate formula (auto-fills parameters and report level)
7. Save

### Advanced Features
- **Breakdown Tab:**
  - **Level:** Specify attribute level for calculation (regional vs city)
  - **Condition:** Apply filters (specific region, time frame)
  - **Transformation:** Apply offset values ("four months ago")
  
- **Nested Metrics:** Multiple layers of functions with separate levels/conditions/transformations per layer

- **Formatting:** Column headers and value formatting

- **Options:** Totaling functions, dynamic aggregation, joins, VLDB properties

### Stand-Alone vs Derived Metrics
- **Stand-alone:** Saved as separate objects, reusable across reports/dashboards
- **Derived:** Created within reports/dashboards, not saved separately

## Key UI Elements
- **Formula Pane:** Main editor for typing formulas
- **Functions Pane:** Browse/search functions with syntax help
- **Objects Pane:** Browse/search base formulas, attributes, facts, metrics
- **Breakdown Tab:** Level, Condition, Transformation settings
- **Data Type Selector:** With formatting options (precision, scale, byte length)
- **Validate Button:** Checks syntax and auto-fills parameters
- **Save Button:** Persists the metric

## Auto-Complete Features
- Matching objects display in dropdown as you type
- Functions show syntax + description in popup
- Parameters auto-filled on validation
- Level prompts supported (type `?` then `{prompt_name}`)

## Test Considerations for WebStation Port
1. UI parity with desktop (all panes, buttons, tabs)
2. Formula validation and syntax checking
3. Auto-complete and suggestion dropdowns
4. Base formula integration
5. Nested metric creation
6. Level/Condition/Transformation workflows
7. Data type formatting
8. Save/edit persistence
9. Browser compatibility (Chrome, Firefox, Safari, Edge)
10. Responsive design for different screen sizes
