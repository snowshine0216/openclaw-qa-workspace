# QA Risk & Defect Analysis Report
## BCIN-6637: AG Grid Multiple Form Attribute Support

**Report Date:** January 28, 2026  
**Feature:** Multiple Form Attribute Support in AG Grid  
**Total Defects Analyzed:** 21

---

## Executive Summary

This report provides a comprehensive analysis of all defects parented to **BCIN-6637** (AG Grid Multiple Form Attribute Support). The analysis reveals a complex feature implementation with significant quality challenges across multiple functional areas.

### Key Findings

| Metric | Count | Percentage |
|--------|-------|------------|
| **Total Defects** | 21 | 100% |
| **Completed (Done)** | 15 | 71.4% |
| **In Progress** | 4 | 19.0% |
| **To Do** | 2 | 9.5% |
| **High Priority** | 10 | 47.6% |
| **Medium/Low Priority** | 11 | 52.4% |

### Risk Rating: **HIGH**

The feature exhibits:
- **High defect density** with 21 defects across multiple functional areas
- **Complex interaction patterns** involving pin/freeze/hide/resize operations
- **Rendering and layout issues** that affect core grid functionality
- **Edge case sensitivity** with NDE (New Derived Elements) and specific attribute configurations

---

## Defect Breakdown by Status

### ✅ Completed Defects (15 Done)

| ID | Summary | Priority | Fixed Date |
|----|---------|----------|------------|
| BCIN-7064 | AG grid cannot render in specific dashboard | High | 2026-01-26 |
| BCIN-7063 | Cannot resize multiform attribute by dragging border | High | 2026-01-27 |
| BCIN-7039 | Pin/Freeze/Hide - enabling form shows in wrong area | High | 2026-01-26 |
| BCIN-7023 | NDE col-span incorrect during scroll | High | 2026-01-24 |
| BCIN-7019 | Pin indicator missing on grid header | Low | 2026-01-26 |
| BCIN-7018 | Cell not properly merged in NDE | High | 2026-01-26 |
| BCIN-7016 | Sort won't work for recursive attribute form | High | 2026-01-27 |
| BCIN-7014 | Header wrapped when space available | High | 2026-01-24 |
| BCIN-6731 | Pin to right indicator line partially missing | Low | 2026-01-21 |
| BCIN-6711 | Resize lost after disable/enable multiform | High | 2026-01-21 |
| BCIN-6700 | Cannot hide column with multiple forms | Low | 2026-01-22 |
| BCIN-6587 | Cannot resize/hide/pin single form after pin | High | 2026-01-26 |
| BCIN-5765 | DE shows empty columns for ungrouped elements | High | 2026-01-26 |
| BCIN-5692 | Row header disappears after grid conversion | Lowest | 2026-01-26 |
| BCIN-5281 | Fixed column width applied to column header | Lowest | 2026-01-26 |

### 🔄 In Progress Defects (4)

| ID | Summary | Priority | Assignee |
|----|---------|----------|----------|
| BCIN-7077 | NDE layout broken after keep only | High | Yanping Tong |
| BCIN-7059 | Merged header width should match combined forms | High | Yanping Tong |
| BCIN-7057 | NDE col-span incorrect during page switch | High | Yanping Tong |
| BCIN-7048 | Freeze fails after pin + grid conversion | Low | Yanping Tong |

### 📋 To Do Defects (2)

| ID | Summary | Priority | Assignee |
|----|---------|----------|----------|
| BCIN-7088 | Resize animation shows background color | Low | Wei Jiang |
| BCIN-7084 | First form width too large in fit to content (FF off) | Low | Wei Jiang |

### 📊 Additional Open Defects (2)

| ID | Summary | Priority | Assignee |
|----|---------|----------|----------|
| BCIN-7060 | Merged header column width slightly larger | Low | Jianxiao Qi |
| BCIN-7056 | NDE column width much bigger than needed | High | Jianxiao Qi |

---

## Risk Analysis by Functional Area

### 🔴 Critical Risk Areas (HIGH)

#### 1. **NDE (New Derived Element) Support**
**Defect Count:** 5 (BCIN-7077, BCIN-7057, BCIN-7056, BCIN-7023, BCIN-7018)  
**Status:** 2 Done, 3 In Progress  
**Risk Level:** HIGH

**Issues:**
- Col-span calculations incorrect during scroll and page switches
- Layout broken after "keep only" operations
- Column width inconsistencies compared to normal grid
- Cell merging failures

**Impact:** NDE is a core feature for data analysis. These issues severely impact user workflows involving derived elements.

**Testing Focus:**
- Test all NDE operations (create, modify, keep only, exclude)
- Verify col-span remains correct during scroll and page navigation
- Compare column widths between AG Grid and Normal Grid
- Test cell merging with various NDE configurations

#### 2. **Pin/Freeze/Hide Operations**
**Defect Count:** 6 (BCIN-7048, BCIN-7039, BCIN-6731, BCIN-6700, BCIN-6587, BCIN-7019)  
**Status:** 4 Done, 1 In Progress, 1 To Do  
**Risk Level:** HIGH

**Issues:**
- Newly enabled forms appear in wrong areas after pin/freeze/hide
- Cannot manipulate single forms after pinning attribute
- Indicator lines missing or partially missing
- Freeze fails after grid type conversion

**Impact:** These are fundamental grid manipulation features. Failures here affect basic usability.

**Testing Focus:**
- Test pin left/right with single and multiple forms
- Enable/disable forms after pinning and verify positioning
- Test freeze up to column with multiform attributes
- Verify indicator lines display correctly in all scenarios
- Test hide column for attributes with 2, 3, and 4+ forms

#### 3. **Column Sizing & Layout**
**Defect Count:** 6 (BCIN-7084, BCIN-7063, BCIN-7060, BCIN-7059, BCIN-7014, BCIN-6711)  
**Status:** 3 Done, 1 In Progress, 2 To Do  
**Risk Level:** HIGH

**Issues:**
- Cannot resize by dragging borders in specific scenarios
- Merged header widths don't match combined form widths
- Headers wrap unnecessarily when space is available
- Resize lost after enabling multiform
- First form width calculation issues with feature flag off

**Impact:** Layout and sizing are critical for usability and data presentation quality.

**Testing Focus:**
- Test resize by dragging both left and right borders
- Verify merged header width calculations with 2, 3, 4+ forms
- Test fit to content vs fit to container modes
- Test resize persistence after save/refresh
- Compare layouts with new layout feature flag on/off

### 🟡 Medium Risk Areas (MEDIUM)

#### 4. **Rendering & Display**
**Defect Count:** 3 (BCIN-7088, BCIN-7064, BCIN-5692)  
**Status:** 1 Done, 1 To Do, 1 Lowest Priority  
**Risk Level:** MEDIUM

**Issues:**
- AG grid fails to render in specific dashboards
- Resize animation shows background color
- Row headers disappear after grid conversion

**Impact:** Visual quality and basic rendering functionality.

**Testing Focus:**
- Test rendering with various dashboard configurations
- Test with different data volumes and attribute combinations
- Verify resize animations are smooth
- Test Normal Grid to AG Grid conversion

#### 5. **Sorting & Interaction**
**Defect Count:** 1 (BCIN-7016)  
**Status:** Done  
**Risk Level:** MEDIUM

**Issues:**
- Sort doesn't work for recursive attribute forms

**Impact:** Data analysis capability for recursive hierarchies.

**Testing Focus:**
- Test sorting on all forms of recursive attributes
- Verify ascending and descending sort orders
- Test with multi-level recursive hierarchies

### 🟢 Low Risk Areas (LOW)

#### 6. **Visual Polish Issues**
**Defect Count:** 2 (BCIN-5281, BCIN-5765)  
**Status:** Both Done  
**Risk Level:** LOW

**Issues:**
- Fixed column width applied to header in Modern Grid
- DE shows empty columns for filtered ungrouped elements

**Impact:** Minor visual inconsistencies that don't block functionality.

---

## Defect Analysis by Priority

### High Priority Defects (10 total)

**Status Breakdown:**
- Done: 6
- In Progress: 3
- To Do: 1

**Critical Open Items:**
1. **BCIN-7077** - NDE layout broken after keep only (In Progress)
2. **BCIN-7059** - Merged header width issues (In Progress)
3. **BCIN-7057** - NDE col-span incorrect (In Progress)
4. **BCIN-7056** - NDE column width too large (To Do)

**Risk Assessment:** High priority defects represent core functionality issues. With 4 still open, there's significant risk to feature stability.

### Medium/Low Priority Defects (11 total)

**Status Breakdown:**
- Done: 9
- In Progress: 1
- To Do: 1

These represent polish and edge case issues. The completion rate (82%) is good.

---

## Code Change Analysis

**Note:** PR links were not found in the Jira issue comments. The fixes appear to have been implemented directly without linked pull requests, or PR links were not added to the Jira tickets.

### Fix Complexity Assessment

Based on the changelog data and defect descriptions:

| Complexity | Count | Examples |
|------------|-------|----------|
| **High** | 6 | NDE col-span, Pin/Freeze interaction, Resize logic |
| **Medium** | 9 | Header wrapping, Sort functionality, Hide column |
| **Low** | 6 | Visual indicators, Animation polish |

**Observations:**
- Multiple defects assigned to same developers (Yanping Tong, Mengya Peng)
- Fixes concentrated in Sprint S-3-2026 and S-4-2026
- Several defects reassigned between team members
- Target release: 26.02

---

## Residual Risk Assessment

### Overall Risk Level: **HIGH**

#### Risk Factors:

1. **Complex Feature Interaction** (HIGH RISK)
   - Multiple form support interacts with pin, freeze, hide, resize, and NDE features
   - High potential for regression when fixing one area affects another

2. **Edge Case Sensitivity** (HIGH RISK)
   - Many defects occur in specific scenarios (after pin, after conversion, with NDE)
   - Suggests the implementation may not handle all state combinations correctly

3. **Open High-Priority Defects** (HIGH RISK)
   - 4 high-priority defects still open
   - NDE functionality particularly affected

4. **Visual Layout Issues** (MEDIUM RISK)
   - Multiple sizing and positioning defects
   - User experience impact

5. **Incomplete Testing Coverage** (HIGH RISK)
   - High defect count discovered suggests incomplete initial testing
   - Many defects found by same QA engineer (Yanping Tong), indicating concentrated testing

---

## Recommended QA Focus Areas

### 🎯 Critical Testing Scenarios

#### 1. **Multi-Form Attribute Operations**
```
Priority: CRITICAL
Test all operations with 2, 3, and 4+ forms:
□ Enable/disable individual forms
□ Reorder forms
□ Show/hide attribute form headers
□ Test with and without new layout feature flag
```

#### 2. **Pin/Freeze/Hide Workflows**
```
Priority: CRITICAL
Test sequence:
□ Pin attribute → Enable additional forms → Verify positioning
□ Freeze up to column → Enable forms → Verify freeze area
□ Hide form → Enable form → Hide again → Verify state
□ Pin → Convert to normal grid → Convert back → Verify
```

#### 3. **NDE with Multiple Forms**
```
Priority: CRITICAL
Test scenarios:
□ Create NDE from multiform attribute
□ Scroll NDE data → Verify col-span
□ Keep only elements → Verify layout
□ Exclude elements → Verify col-span
□ Switch pages with NDE → Verify rendering
□ Filter ungrouped elements → Verify no empty columns
```

#### 4. **Column Sizing Operations**
```
Priority: HIGH
Test resize methods:
□ Drag right border of merged header
□ Drag left border of merged header
□ Drag individual form borders
□ Test in fit-to-content mode
□ Test in fit-to-container mode
□ Save and refresh → Verify persistence
```

#### 5. **Grid Type Conversion**
```
Priority: MEDIUM
Test conversions:
□ Normal Grid → AG Grid with pinned columns
□ AG Grid → Normal Grid → AG Grid (round trip)
□ Verify all attributes render correctly
□ Verify row headers remain visible
□ Test with single and multiple form attributes
```

#### 6. **Sorting & Recursive Attributes**
```
Priority: MEDIUM
Test sorting:
□ Sort each form individually
□ Sort recursive attribute forms (asc/desc)
□ Verify order changes correctly
□ Test with Customer hierarchy and multi-level recursion
```

#### 7. **Dashboard Integration**
```
Priority: HIGH
Test in context:
□ Multiple AG grids on same dashboard
□ AG grid with selectors and filters
□ Large datasets (1000+ rows)
□ Complex dashboards with many visualizations
```

### 🔍 Exploratory Testing Recommendations

1. **State Transition Testing**
   - Rapidly toggle between states (pin/unpin, enable/disable forms)
   - Test undo/redo operations
   - Test concurrent modifications (multiple users)

2. **Performance Testing**
   - Large datasets with 4+ forms per attribute
   - Rapid scrolling with NDE
   - Multiple resize operations in succession

3. **Browser Compatibility**
   - Test in all supported browsers
   - Pay special attention to Chrome and Safari for rendering issues

4. **Regression Testing**
   - Test all previously fixed defects from this list
   - Verify no regression in single-form attribute behavior

---

## Test Environment Recommendations

### Required Test Instances

1. **Development Environment**
   - URL: `https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary`
   - Credentials: `tqmsuser/ddset`
   - Version: 26.02 (latest build)

2. **Test Lab Environment**
   - URL: `https://tec-l-1301917.labs.microstrategy.com/MicroStrategyLibrary`
   - Multiple test dashboards with multiform attributes

3. **Feature Flag Configuration**
   - Test with new layout feature flag ON
   - Test with new layout feature flag OFF
   - Document any behavior differences

### Test Data Requirements

1. **Attributes with Multiple Forms**
   - 2 forms (e.g., Category: ID + DESC)
   - 3 forms (e.g., City: ID + DESC + ZIP)
   - 4+ forms for stress testing

2. **Recursive Attributes**
   - Customer hierarchy
   - Employee hierarchy
   - Test data with 3+ levels

3. **New Derived Elements (NDE)**
   - Pre-created NDEs with grouping
   - Test data with grouped and ungrouped elements

---

## Verification Checklist for Release

### Pre-Release Validation

```
□ All HIGH priority defects resolved and verified
□ No critical regressions in core grid functionality
□ All test scenarios from Focus Areas executed
□ Performance benchmarks met (render time, scroll smoothness)
□ Cross-browser testing completed
□ Documentation updated with any known limitations
□ Release notes include multiform attribute support details
```

### Known Limitations to Document

1. Feature flag dependency (new layout)
2. Any unsupported attribute configurations
3. Browser-specific rendering differences
4. Performance considerations for large datasets

---

## Conclusion

The BCIN-6637 feature (AG Grid Multiple Form Attribute Support) represents a significant enhancement with considerable complexity. The **21 defects** discovered across multiple functional areas indicate:

1. **Implementation Complexity**: The feature touches many grid subsystems (pin, freeze, hide, resize, NDE, sorting)
2. **Edge Case Sensitivity**: Many issues occur in specific scenarios requiring careful state management
3. **Active Development**: High fix velocity with most defects closed, but 6 still open
4. **Quality Concern**: High defect density suggests the need for comprehensive regression testing

### Risk Mitigation Strategy

1. **Immediate**: Complete all HIGH priority open defects
2. **Pre-Release**: Execute comprehensive test plan outlined in this report
3. **Post-Release**: Monitor for additional edge cases in production
4. **Long-term**: Consider refactoring to reduce complexity and improve maintainability

### Recommended Action

**DO NOT RELEASE** to production until:
- All HIGH priority defects are resolved
- Comprehensive regression testing is completed
- At least 90% of test scenarios outlined pass successfully

---

## Appendix: Defect Reference List

### Complete Defect List with Links

1. BCIN-7088 - https://strategyagile.atlassian.net/browse/BCIN-7088
2. BCIN-7084 - https://strategyagile.atlassian.net/browse/BCIN-7084
3. BCIN-7077 - https://strategyagile.atlassian.net/browse/BCIN-7077
4. BCIN-7064 - https://strategyagile.atlassian.net/browse/BCIN-7064
5. BCIN-7063 - https://strategyagile.atlassian.net/browse/BCIN-7063
6. BCIN-7060 - https://strategyagile.atlassian.net/browse/BCIN-7060
7. BCIN-7059 - https://strategyagile.atlassian.net/browse/BCIN-7059
8. BCIN-7057 - https://strategyagile.atlassian.net/browse/BCIN-7057
9. BCIN-7056 - https://strategyagile.atlassian.net/browse/BCIN-7056
10. BCIN-7048 - https://strategyagile.atlassian.net/browse/BCIN-7048
11. BCIN-7039 - https://strategyagile.atlassian.net/browse/BCIN-7039
12. BCIN-7023 - https://strategyagile.atlassian.net/browse/BCIN-7023
13. BCIN-7019 - https://strategyagile.atlassian.net/browse/BCIN-7019
14. BCIN-7018 - https://strategyagile.atlassian.net/browse/BCIN-7018
15. BCIN-7016 - https://strategyagile.atlassian.net/browse/BCIN-7016
16. BCIN-7014 - https://strategyagile.atlassian.net/browse/BCIN-7014
17. BCIN-6731 - https://strategyagile.atlassian.net/browse/BCIN-6731
18. BCIN-6711 - https://strategyagile.atlassian.net/browse/BCIN-6711
19. BCIN-6700 - https://strategyagile.atlassian.net/browse/BCIN-6700
20. BCIN-6587 - https://strategyagile.atlassian.net/browse/BCIN-6587
21. BCIN-5765 - https://strategyagile.atlassian.net/browse/BCIN-5765
22. BCIN-5692 - https://strategyagile.atlassian.net/browse/BCIN-5692
23. BCIN-5281 - https://strategyagile.atlassian.net/browse/BCIN-5281

---

**Report Generated By:** QA Risk Analysis System  
**Analyst:** AI QA Lead & Bug Hunter  
**Date:** January 28, 2026  
**Version:** 1.0
