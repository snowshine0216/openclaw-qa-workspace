---
name: microstrategy-ui-test
description: |
  UI testing for MicroStrategy Products （mainly for Library， BI Web(aka, authroing web), WebStation.
  Use when testing MicroStrategy product's interfaces, validating dashboard elements,
  checking widget visibility, or performing end to end testing.

  Supports: MicroStrategy Library, MicroStrategy Web, MicroStrategy WebStation.
  Prerequisites: playwright-cli must be installed (`npm install -g @playwright/cli@latest`).

  **IMPORTANT:**
  - If a Jira issue or link is provided, use the **jira-cli** skill first to fetch issue details
  - If login password is empty, directly click the login button without attempting to type
  - All reports and snapshots must be saved to `/Users/vizcitest/Documents/Repository/Features/Reports/<feature>` where `<feature>` is the issue key (e.g., BCIN-7313) or short name
  - **Element Not Found Protocol**: If a required button or element cannot be found, STOP the test immediately and notify the user. Explain why the element cannot be found (e.g., selector mismatch, element not visible, wrong page, application error). DO NOT terminate all tests unless explicitly approved by the user.
---

# MicroStrategy UI Testing Skill

## UI Test Router
1. if it's to test web station,(there is `admin-hub` in the url), always use  **microstrategy-webstation-test** skill to test
2. if it's to test library, (there is `MicrostrategyLibrary` in the url or user explictly state it), always use  **microstrategy-library-test** skill to test
3. if it's to test bi web, (therei is `MicroStrategy` in the url or user explictly state it), always use **microstrategy-biweb-test** skill to test
4. if you're unsure, always confirm user firstly!


## Examples for each product url
1. webstation: `https://tec-l-1183620.labs.microstrategy.com/MicroStrategyLibrary/apps/admin-modeling/#/content-group/`
2. library: `https://tec-l-1183620.labs.microstrategy.com/MicroStrategyLibrary`
3. biweb: `https://tec-l-1183620.labs.microstrategy.com/MicroStrategy`
