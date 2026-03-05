# Daily RCA Check - Setup Complete

## ✅ What Was Created

### 1. Fetch Script (No Owner Filter)
**File:** `projects/rca-daily/src/fetch-rca.sh`
- Fetches ALL defects with `category = "requires_rca"`
- No `proposed_owner` filter
- Output: `projects/rca-daily/output/rca-all-<timestamp>.json`
- Current count: **25 defects**

### 2. Daily Check Script
**File:** `projects/rca-daily/src/daily-rca-check.sh`
- Runs fetch script
- Groups defects by proposed_owner
- Generates summary for Feishu
- Logs to: `projects/rca-daily/output/logs/daily-rca-check-YYYYMMDD.log`

### 3. Cron Wrapper
**File:** `projects/rca-daily/src/cron-daily-rca-check.sh`
- Adds randomization: 0-30 minutes delay
- Runs daily check
- Handles Feishu notification

### 4. Cron Job
**Schedule:** Daily at 8:00 AM Asia/Shanghai (±30 min randomization)
**Command:**
```bash
0 8 * * * cd ~/Documents/Repository/openclaw-qa-workspace/workspace-daily/projects/rca-daily/src && ./cron-daily-rca-check.sh >> ~/Documents/Repository/openclaw-qa-workspace/workspace-daily/projects/rca-daily/output/logs/cron-$(date +\%Y\%m\%d).log 2>&1
```

**Installed:** ✅ (verified with `crontab -l`)

---

## 📊 Current RCA Status (2026-03-05)

**Total Defects Requiring RCA:** 25

**By Owner:**
- Shuai, Xiong: 10
- Peipei, Chen: 5
- Lingping, Zhu: 4
- Xue, Yin: 2
- Xuejie, Zhang: 2
- Yaoli, Li: 2

---

## 🔄 Daily Workflow

Every day at ~8:00 AM:
1. Cron triggers `cron-daily-rca-check.sh`
2. Random delay 0-30 minutes
3. Fetch all defects requiring RCA
4. Generate summary by owner
5. Send Feishu notification with:
   - Total count
   - Breakdown by owner
   - Top 10 issues with links

---

## 🧪 Testing

**Manual Trigger:**
```bash
cd projects/rca-daily/src
./daily-rca-check.sh
```

**Test Results:**
- ✅ Fetch successful (25 defects found)
- ✅ Summary generation working
- ✅ Feishu notification sent
- ✅ Cron job installed and verified

---

## 📁 Output Files

- **Data:** `projects/rca-daily/output/rca-all-<timestamp>.json`
- **Summary:** `projects/rca-daily/output/feishu-daily-summary-YYYYMMDD.md`
- **Logs:** `projects/rca-daily/output/logs/daily-rca-check-YYYYMMDD.log`
- **Cron Logs:** `projects/rca-daily/output/logs/cron-YYYYMMDD.log`

---

## 🔧 Maintenance

**View cron job:**
```bash
crontab -l
```

**Edit cron job:**
```bash
crontab -e
```

**Remove cron job:**
```bash
crontab -l | grep -v "daily-rca-check" | crontab -
```

**Check last run:**
```bash
ls -lt projects/rca-daily/output/logs/daily-rca-check-*.log | head -1
tail projects/rca-daily/output/logs/daily-rca-check-$(date +%Y%m%d).log
```

---

**Setup Date:** 2026-03-05 17:08 UTC  
**Next Run:** 2026-03-06 ~08:00 Asia/Shanghai
