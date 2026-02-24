# Android CI Fix - Quick Reference

**Status:** Ready for implementation  
**Date:** 2026-02-24  
**Updated:** 2026-02-24 (added Fix 0: report naming)

---

## 🐛 Problems Identified

1. **Wrong report naming** - Using generic `android_report.docx` instead of `{JOB}_{BUILD}.docx`
2. **Empty results from manual_trigger.sh** - Log files not created, spawned process silent
3. **No report regeneration** - Cached reports block re-analysis even when requested
4. **No single job mode** - Cannot analyze individual Library jobs for debugging

---

## ✅ Solutions

### Quick Wins (2-3 hours total)

0. **Report naming** → Use `Trigger_Library_Jobs_87.docx` format (matches web CI)
1. **Better logging** → Add error traps, verbose mode, environment checks
2. **Force flag** → `--force` to bypass cache and regenerate
3. **Feishu webhook** → Set `FEISHU_WEBHOOK_URL` environment variable

### Feature Add (2-3 hours)

4. **Single job mode** → New script `android_analyzer_single.sh` for individual jobs

---

## 🚀 Implementation Steps

### Phase 1: Fix Critical Issues

```bash
# 0. Update report naming (MUST DO FIRST)
#    Edit android_analyzer.sh: Change android_report.docx → ${TRIGGER_JOB}_${TRIGGER_BUILD}.docx
#    Edit generate_android_report.mjs: Update output filename

# 1. Update android_analyzer.sh with:
#    - Better logging (touch log file explicitly)
#    - Error traps
#    - --force flag support
#    - Environment variable checks

# 2. Set Feishu webhook
export FEISHU_WEBHOOK_URL=<webhook_from_TOOLS.md>

# 3. Test
bash scripts/android_analyzer.sh --force Trigger_Library_Jobs 87
# Report should be: reports/Trigger_Library_Jobs_87/Trigger_Library_Jobs_87.docx
```

### Phase 2: Add Single Job Support

```bash
# Create three new files:
# 1. scripts/android_analyzer_single.sh
# 2. scripts/pipeline/process_android_single.js  
# 3. scripts/generate_android_single_report.mjs

# Test
bash scripts/android_analyzer_single.sh Library_Dossier_InfoWindow 564
```

---

## 🧪 Testing Commands

```bash
# Test 0: Report naming (FIRST!)
bash scripts/android_analyzer.sh Trigger_Library_Jobs 87
ls -lh reports/Trigger_Library_Jobs_87/
# Should see: Trigger_Library_Jobs_87.docx (NOT android_report.docx)

# Test 1: Logging works
export DEBUG=1
bash scripts/android_analyzer.sh Trigger_Library_Jobs 87
cat logs/android_analyzer_Trigger_Library_Jobs_87.log

# Test 2: Force regeneration
bash scripts/android_analyzer.sh --force Trigger_Library_Jobs 87

# Test 3: Feishu delivery
export FEISHU_WEBHOOK_URL=<webhook>
bash scripts/android_analyzer.sh --force Trigger_Library_Jobs 87
# Check chat: oc_f15b73b877ad243886efaa1e99018807

# Test 4: Single job (Phase 2 only)
bash scripts/android_analyzer_single.sh Library_Dossier_InfoWindow 564
```

---

## 📋 Files to Modify

### Phase 1
- ✏️ `scripts/android_analyzer.sh` (report naming, logging, --force)
- ✏️ `scripts/generate_android_report.mjs` (output filename)
- 📝 Environment (set FEISHU_WEBHOOK_URL)

### Phase 2  
- ➕ `scripts/android_analyzer_single.sh` (new)
- ➕ `scripts/pipeline/process_android_single.js` (new)
- ➕ `scripts/generate_android_single_report.mjs` (new)

---

## 📖 Full Details

See: `docs/ANDROID_FIX_PLAN.md`

---

**Prepared by:** Atlas Daily (QA Agent)  
**Ready for:** Implementation
