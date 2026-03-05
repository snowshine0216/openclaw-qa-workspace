# Phase 2b Error URLs

Based on test data, here are the URLs being accessed during Phase 2b tests:

**Base URL:** `https://mci-pq2sm-dev.hypernow.microstrategy.com/MicroStrategyLibrary`
**Project ID:** `B628A31F11E7BD953EAE0080EF0583BD`

## Test URLs

### page-by-sorting-2.spec.ts (Custom Group)
**Dossier:** DeveloperPBYearAscCustomCategoriesParentTop
**Dossier ID:** `71DF87284DDBAF9B3FD77E84073823EE`
**Full URL:**
```
https://mci-pq2sm-dev.hypernow.microstrategy.com/MicroStrategyLibrary/app/B628A31F11E7BD953EAE0080EF0583BD/71DF87284DDBAF9B3FD77E84073823EE
```

### page-by-sorting-1.spec.ts (Acceptance test)
**Dossier:** ReportWS_PB_YearCategory1
**Dossier ID:** `5FE3EA2E9F41F5E587B8FB8C03C42809`
**Full URL:**
```
https://mci-pq2sm-dev.hypernow.microstrategy.com/MicroStrategyLibrary/app/B628A31F11E7BD953EAE0080EF0583BD/5FE3EA2E9F41F5E587B8FB8C03C42809
```

### page-by-sorting-3.spec.ts (Consolidation)
**Dossier:** DeveloperPBConsolidationSubcategory
**Dossier ID:** `C05D5E154F132DB25D5D58A14AF01F8D`
**Full URL:**
```
https://mci-pq2sm-dev.hypernow.microstrategy.com/MicroStrategyLibrary/app/B628A31F11E7BD953EAE0080EF0583BD/C05D5E154F132DB25D5D58A14AF01F8D
```

### page-by-sorting-4.spec.ts (Metrics in Page By)
**Dossier:** DeveloperPBMetrics
**Dossier ID:** `288708A946718529881298AFC09808DC`
**Full URL:**
```
https://mci-pq2sm-dev.hypernow.microstrategy.com/MicroStrategyLibrary/app/B628A31F11E7BD953EAE0080EF0583BD/288708A946718529881298AFC09808DC
```

### page-by-sorting-5.spec.ts (Hierarchy in Page By)
**Dossier:** DeveloperPBHierarchy
**Dossier ID:** `F313C895416AF8DB63206FBE0F2AA47D`
**Full URL:**
```
https://mci-pq2sm-dev.hypernow.microstrategy.com/MicroStrategyLibrary/app/B628A31F11E7BD953EAE0080EF0583BD/F313C895416AF8DB63206FBE0F2AA47D
```

### page-by-sorting-6.spec.ts (Quick Sorting)
**Dossier:** ReportWS_PB_YearCategory2
**Dossier ID:** `DD28BFCC4B4A15978F74CEB3C75E8447`
**Full URL:**
```
https://mci-pq2sm-dev.hypernow.microstrategy.com/MicroStrategyLibrary/app/B628A31F11E7BD953EAE0080EF0583BD/DD28BFCC4B4A15978F74CEB3C75E8447
```

### page-by-sorting-7.spec.ts (Move or Remove PageBy Object)
**Dossier:** ReportWS_PB_YearCategory1 (same as test 1)
**Dossier ID:** `5FE3EA2E9F41F5E587B8FB8C03C42809`
**Full URL:**
```
https://mci-pq2sm-dev.hypernow.microstrategy.com/MicroStrategyLibrary/app/B628A31F11E7BD953EAE0080EF0583BD/5FE3EA2E9F41F5E587B8FB8C03C42809
```

### page-by-sorting-8.spec.ts (Attribute Forms)
**Dossier:** ReportWS_PB_YearCategory1 (same as test 1)
**Dossier ID:** `5FE3EA2E9F41F5E587B8FB8C03C42809`
**Full URL:**
```
https://mci-pq2sm-dev.hypernow.microstrategy.com/MicroStrategyLibrary/app/B628A31F11E7BD953EAE0080EF0583BD/5FE3EA2E9F41F5E587B8FB8C03C42809
```

---

## Next Steps to Debug

1. **Manually test one URL** in a browser to verify:
   - Does the report exist in this environment?
   - Does it load successfully?
   - Does it have PageBy configured?
   - Are Year/Month/Metrics/Custom Categories available as PageBy selectors?

2. **Recommended URL to test first:**
   ```
   https://mci-pq2sm-dev.hypernow.microstrategy.com/MicroStrategyLibrary/app/B628A31F11E7BD953EAE0080EF0583BD/71DF87284DDBAF9B3FD77E84073823EE
   ```
   (Custom Group test - page-by-sorting-2)

3. **If reports don't exist:** Test data may need to be updated with report IDs from this dev environment.

4. **If reports exist but have no PageBy:** The dev environment may have different report configurations than the original test environment.
