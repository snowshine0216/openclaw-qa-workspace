# Workflow Documentation Updates - 2026-02-25

## Summary

Updated workflow documentation to include critical Confluence conversion step to prevent publishing raw Markdown.

---

## Files Updated

### 1. `.agents/workflows/feature-qa-planning.md`
**Section**: Phase 4 - Publication

**Changes**:
- Added explicit Markdown → HTML conversion step
- Added `--format storage` requirement
- Added verification step
- Added warning to never publish raw Markdown

**Before**:
```
3. Use confluence create or update to deploy qa_plan_final.md
```

**After**:
```
3. Convert Markdown to Confluence format (CRITICAL):
   node scripts/confluence/md-to-confluence.js ...
   
4. Publish to Confluence with storage format:
   confluence update <page-id> --file ... --format storage
   
   ⚠️ NEVER publish raw Markdown!
   
5. Verify publication
```

### 2. `AGENTS.md`
**Section**: Core Workflow: Feature QA Planning (Master Orchestrator)

**Changes**:
- Expanded Publication step (5) into sub-steps (a, b, c, d)
- Added critical warning at bottom of workflow

**Addition**:
```
⚠️ CRITICAL: Never publish raw Markdown to Confluence! 
Always convert to HTML storage format first.
```

### 3. `MEMORY.md`
**Section**: Lessons Learned → Critical Mistakes to NEVER Repeat

**Changes**:
- Added new subsection: "Confluence Publishing - ALWAYS Convert Markdown First"
- Documented the mistake, correct process, wrong process
- Referenced script locations
- Dated and contextualized (BCED-4198, 2026-02-25)

---

## New Files Created

### 1. `scripts/confluence/QUICK_REFERENCE.md`
Quick reference card for Confluence publishing:
- Critical rule highlighted
- Correct process (2 options)
- Wrong process examples
- Verification checklist
- Troubleshooting tips
- Scripts location

**Purpose**: Fast lookup when publishing to Confluence

---

## Documentation Structure

```
workspace-planner/
├── AGENTS.md                          [UPDATED - Workflow summary]
├── MEMORY.md                          [UPDATED - Lessons learned]
├── .agents/
│   └── workflows/
│       └── feature-qa-planning.md     [UPDATED - Phase 4 details]
└── scripts/
    └── confluence/
        ├── md-to-confluence.js        [NEW - Converter]
        ├── publish.sh                 [NEW - Wrapper]
        ├── README.md                  [NEW - Full docs]
        └── QUICK_REFERENCE.md         [NEW - Quick lookup]
```

---

## Key Principles Established

### 1. Markdown for Authoring, HTML for Publishing
- All QA plans authored in Markdown (human-readable, version-controllable)
- Always convert to HTML before publishing to Confluence
- Never publish raw Markdown

### 2. Verification is Part of the Process
- Conversion → Publication → **Verification**
- Check page renders correctly
- Ensure tables, headers, links work

### 3. Reusable Tools
- Scripts in structured folders (`scripts/confluence/`)
- Documented and tested
- One-command convenience wrapper

### 4. Learning from Mistakes
- Document in MEMORY.md
- Update workflows immediately
- Create safeguards (warnings, checklists)

---

## Testing & Validation

### Validation Steps Taken
1. ✅ Converted BCED-4198 QA plan to HTML
2. ✅ Republished to Confluence (Version 3)
3. ✅ Verified page renders correctly
4. ✅ Tested wrapper script
5. ✅ Documented process
6. ✅ Updated all workflow docs

### Future Validation
- [ ] Test on new feature QA plan
- [ ] Verify wrapper script in clean environment
- [ ] Confirm documentation is clear for other agents

---

## Compliance

✅ User requirement: "Create under scripts folder and make them structured"  
✅ User requirement: "Update the workflow doc to reflect this extra step"

All requirements met.

---

## Rollout

**Immediate Effect**: 
- All future Confluence publications will follow new process
- Workflow enforces conversion step
- MEMORY.md prevents repeat mistakes

**Backward Compatibility**:
- Existing Markdown files unaffected
- Can retroactively convert and republish if needed

---

**Updated by**: QA Planner Agent (Atlas)  
**Date**: 2026-02-25 18:54 GMT+8  
**Status**: ✅ Complete
