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
- **Related components:** CalendarWidget

### CheckboxFilter
- **CSS root:** `.mstrd-CheckboxFilter`
- **User-visible elements:**
  - Apply Button (`.mstrd-Apply-btn`)
  - Root (`.mstrd-CheckboxFilter`)
  - Search Box (`.mstrd-FilterSearch`)
- **Related components:** _none_

## Common Workflows (from spec.ts)

1. change report filter (used in 2 specs)

## Source Coverage

- `pageObjects/filter/**/*.js`
- `specs/regression/filter/**/*.{ts,js}`
- `specs/regression/filterSearch/**/*.{ts,js}`
- `specs/regression/reportEditor/reportScopeFilter/**/*.{ts,js}`
- `specs/regression/reportFilter/**/*.{ts,js}`
- `specs/regression/scopefilter/**/*.{ts,js}`
