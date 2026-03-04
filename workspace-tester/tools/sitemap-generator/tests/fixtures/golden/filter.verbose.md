# Site Knowledge: Filter Domain

## Overview

- **Domain key:** `filter`
- **Components covered:** CalendarFilter, CheckboxFilter
- **Spec files scanned:** 2
- **POM files scanned:** 2

## Components

### CalendarFilter
- **CSS root:** `.mstrd-CalendarWidget`
- **User-visible elements:**
  - Apply Button (`.mstrd-Apply-btn`)
  - Date Input (`.mstrd-Date-input`)
  - Root (`.mstrd-CalendarWidget`)
- **Component actions:**
  - `applyFilter()`
  - `selectDate(year, month, day)`
- **Related components:** CalendarWidget

### CheckboxFilter
- **CSS root:** `.mstrd-CheckboxFilter`
- **User-visible elements:**
  - Apply Button (`.mstrd-Apply-btn`)
  - Root (`.mstrd-CheckboxFilter`)
  - Search Box (`.mstrd-FilterSearch`)
- **Component actions:**
  - `applyFilter()`
  - `searchElement(text)`
- **Related components:** _none_

## Common Workflows (from spec.ts)

1. change report filter (used in 2 specs)

## Common Elements (from POM + spec.ts)

1. Apply Button -- frequency: 2
2. mstrd Apply btn -- frequency: 2
3. mstrd Filter Search -- frequency: 2
4. Root -- frequency: 2
5. button -- frequency: 1
6. Date Input -- frequency: 1
7. Filter summary -- frequency: 1
8. getSearchBox -- frequency: 1
9. Search Box -- frequency: 1

## Key Actions

- `applyFilter()` -- used in 2 specs
- `getSearchBox()` -- used in 1 specs
- `searchElement(text)` -- used in 1 specs
- `selectDate(year, month, day)` -- used in 1 specs

## Source Coverage

- `pageObjects/filter/**/*.js`
- `specs/regression/filter/**/*.{ts,js}`
- `specs/regression/filterSearch/**/*.{ts,js}`
- `specs/regression/reportEditor/reportScopeFilter/**/*.{ts,js}`
- `specs/regression/reportFilter/**/*.{ts,js}`
- `specs/regression/scopefilter/**/*.{ts,js}`
