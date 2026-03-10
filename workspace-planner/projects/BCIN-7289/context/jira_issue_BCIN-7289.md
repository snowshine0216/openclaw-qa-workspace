# Jira Issue: BCIN-7289 (Single Source of Truth)

**Type:** Feature  
**Status:** In Progress  
**Due:** Mon, 09 Mar 2026  
**Assignee:** Wei (Irene) Jiang  
**Priority:** High  
**Labels:** Library_and_Dashboards  
**URL:** https://strategyagile.atlassian.net/browse/BCIN-7289

## Summary
**Embed Library Report Editor into the Workstation report authoring.**

## Description
Currently there is a lot of overhead on the Workstation report editor when working on Report features. For any new enhancements, the report in Workstation needs separate effort to support, as its prompt is of very old code technology, totally different from the Library prompt.

To improve dev efficiency, the team must embed the Library report editor into the Workstation report authoring — similar to how the **dashboard embedding** works today (precedent: BCED-2416).

## Sub-Issues
| Key | Summary | Status |
|-----|---------|--------|
| BCIN-7603 | Enhancements in Workstation (new preference, fallback editor registration) | To Do |

## BCIN-7603 Detail
- Add a new **preference** to adopt the new (embedded Library) report editor in Workstation
- When multiple editors are registered for the same object type, if the first editor fails → **fall back** to the next registered editor in sequence
- PR already raised: https://github.com/mstr-kiai/workstation-windows/pull/4811

## Key Comment
> "Lumin already have some design works here. Please continually work on this." — Yingchun Mei, 09 Mar 2026 (cc Wei Irene Jiang)

## Planning Consequence
- Feature is **user_facing** → EndToEnd mandatory
- Preference/feature-flag gating (opt-in) is a core test axis
- Fallback to legacy editor is a required regression coverage area
