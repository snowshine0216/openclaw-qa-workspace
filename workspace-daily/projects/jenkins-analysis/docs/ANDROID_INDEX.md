# Android CI Analysis - Documentation Index

**Project:** Jenkins Android Library CI Analysis  
**Last Updated:** 2026-02-24

---

## 📚 Documentation Structure

### Core Design Documents

1. **[ANDROID_DESIGN.md](./ANDROID_DESIGN.md)** — Complete system design
   - Architecture overview
   - ExtentReport parsing strategy
   - Job discovery algorithm
   - Re-run detection logic
   - Database schema
   - Report format
   - **Read this first** for understanding the entire system

### Implementation & Fixes

2. **[ANDROID_FIX_PLAN.md](./ANDROID_FIX_PLAN.md)** — Detailed fix plan for current issues
   - Problem analysis (3 issues identified)
   - Solution designs (logging, force flag, single job mode)
   - Implementation phases
   - Testing protocol
   - Success criteria
   - **Read this** when implementing fixes

3. **[ANDROID_FIX_SUMMARY.md](./ANDROID_FIX_SUMMARY.md)** — Quick reference
   - One-page summary of problems and solutions
   - Quick command reference
   - File modification checklist
   - **Read this** for quick overview

### Operations & Support

4. **[ANDROID_TROUBLESHOOTING.md](./ANDROID_TROUBLESHOOTING.md)** — Troubleshooting guide
   - 8 common issues with solutions
   - Debug checklist
   - Log locations
   - Contact information
   - **Read this** when things go wrong

---

## 🎯 Quick Start

### I'm New to This Project
1. Read: **ANDROID_DESIGN.md** (sections 1-6 for overview)
2. Understand: Job hierarchy, failure types, ExtentReport structure
3. Run: `bash scripts/android_analyzer.sh Trigger_Library_Jobs <build>`

### I Need to Fix the Current Issues
1. Read: **ANDROID_FIX_SUMMARY.md** (1-2 min overview)
2. Read: **ANDROID_FIX_PLAN.md** (detailed implementation guide)
3. Implement: Phase 1 fixes (logging, force flag, Feishu webhook)
4. Test: Follow testing protocol in fix plan
5. (Optional) Implement: Phase 2 fix (single job mode)

### Something's Broken
1. Read: **ANDROID_TROUBLESHOOTING.md**
2. Find: Your issue in the 8 common problems
3. Run: Diagnosis commands
4. Apply: Suggested solutions
5. Check: Debug checklist if still broken

### I Want to Understand Re-run Detection
1. Read: **ANDROID_DESIGN.md § 16** (Re-run Detection)
2. See: Algorithm in section 16.2
3. Understand: Result interpretation (section 16.3)
4. Check: Report output format (section 16.4)

### I Want to Add Features
1. Read: **ANDROID_DESIGN.md** (full document)
2. Check: Module design (section 7)
3. Follow: Testing strategy (section 18)
4. Update: This index with new docs

---

## 📋 Document Purposes

| Document | Purpose | Audience | When to Read |
|----------|---------|----------|--------------|
| **ANDROID_DESIGN.md** | Complete system design and architecture | Engineers, architects | Initial learning, feature planning |
| **ANDROID_FIX_PLAN.md** | Detailed fix implementation guide | Developers | When fixing current issues |
| **ANDROID_FIX_SUMMARY.md** | Quick reference for fixes | Everyone | Quick lookup, commands |
| **ANDROID_TROUBLESHOOTING.md** | Operational troubleshooting | Operators, QA | When errors occur |

---

## 🔄 Document Status

| Document | Status | Version | Last Updated |
|----------|--------|---------|--------------|
| ANDROID_DESIGN.md | ✅ Complete | 1.2 | 2026-02-24 |
| ANDROID_FIX_PLAN.md | ✅ Complete | 1.0 | 2026-02-24 |
| ANDROID_FIX_SUMMARY.md | ✅ Complete | 1.0 | 2026-02-24 |
| ANDROID_TROUBLESHOOTING.md | ✅ Complete | 1.0 | 2026-02-24 |
| ANDROID_INDEX.md (this) | ✅ Complete | 1.0 | 2026-02-24 |

---

## 🗂️ Related Files

### Implementation Files

```
scripts/
├── android/
│   ├── extent_parser.js           # ExtentReport HTML → JSON parser
│   ├── failure_classifier.js      # Screenshot vs script play classification
│   └── job_discovery.js           # Discover Library_* builds from trigger
├── pipeline/
│   └── process_android_build.js   # Main orchestration for Android CI
├── android_analyzer.sh             # Bash entry point
└── generate_android_report.mjs     # Report generator
```

### Configuration Files

```
server/
└── config.js                       # ANDROID_WATCHED_JOBS, JENKINS_URL

.env (create if needed)
└── FEISHU_WEBHOOK_URL
    JENKINS_USER
    JENKINS_API_TOKEN
```

### Data Files

```
data/
└── jenkins_history.db              # SQLite database (platform = 'android')

reports/
└── <JobName>_<BuildNum>/
    ├── android_report.md
    ├── android_report.docx
    ├── passed_jobs.json
    ├── failed_jobs.json
    └── extent_failures.json
```

---

## 🚀 Common Commands

### Analysis

```bash
# Full trigger job analysis
bash scripts/android_analyzer.sh Trigger_Library_Jobs 87

# Force regeneration
bash scripts/android_analyzer.sh --force Trigger_Library_Jobs 87

# Single job (Phase 2 implementation)
bash scripts/android_analyzer_single.sh Library_Dossier_InfoWindow 564

# Manual webhook trigger
bash scripts/manual_trigger.sh Trigger_Library_Jobs 87
```

### Debugging

```bash
# Enable debug mode
export DEBUG=1

# Check logs
tail -f logs/android_analyzer_Trigger_Library_Jobs_87.log

# Check webhook logs
tail -f logs/webhook.log

# Verify Jenkins connection
curl -u $JENKINS_USER:$JENKINS_API_TOKEN "$JENKINS_URL/api/json"
```

### Database

```bash
# Check schema
sqlite3 data/jenkins_history.db ".schema failed_steps"

# Query Android records
sqlite3 data/jenkins_history.db \
  "SELECT * FROM failed_steps WHERE platform='android' LIMIT 5;"

# Run migration
node scripts/database/migrate.js
```

---

## 📞 Support

- **Project Lead:** Snow
- **QA Agent:** Atlas Daily
- **Feishu Chat:** oc_f15b73b877ad243886efaa1e99018807
- **Jenkins Server:** http://tec-l-1081462.labs.microstrategy.com:8080/

---

## 🔖 Quick Links

- [Jenkins Trigger Job](http://tec-l-1081462.labs.microstrategy.com:8080/job/Trigger_Library_Jobs/)
- [ExtentReport Example](http://ci-master.labs.microstrategy.com:8011/job/Library_Dossier_InfoWindow/564/ExtentReport/)
- [Feishu Chat](https://feishu.cn/) (Chat ID: oc_f15b73b877ad243886efaa1e99018807)

---

**Prepared by:** Atlas Daily (QA Daily Check Agent)  
**Documentation Version:** 1.0
