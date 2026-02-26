# Confluence Publishing Quick Reference

## ⚠️ CRITICAL RULE

**NEVER publish raw Markdown to Confluence!**

Confluence uses HTML storage format, not Markdown. Publishing `.md` files directly will display ugly plain text with `#`, `**`, `|` visible.

---

## ✅ Correct Process

### Option 1: Using Wrapper Script (Recommended)
```bash
./scripts/confluence/publish.sh <input.md> <page-id>
```

**Example:**
```bash
./scripts/confluence/publish.sh \
  projects/feature-plan/BCED-4198/qa_plan_final.md \
  5903319628
```

### Option 2: Manual Steps
```bash
# Step 1: Convert MD → HTML
node scripts/confluence/md-to-confluence.js <input.md> <output.html>

# Step 2: Publish with storage format
confluence update <page-id> --file <output.html> --format storage

# Step 3: Verify page renders correctly
```

**Example:**
```bash
node scripts/confluence/md-to-confluence.js \
  qa_plan_final.md \
  qa_plan_confluence.html

confluence update 5903319628 \
  --file qa_plan_confluence.html \
  --format storage
```

---

## ❌ WRONG - Don't Do This

```bash
# This will publish ugly raw Markdown:
confluence update 5903319628 --file plan.md
```

---

## Verification Checklist

After publishing, check:
- [ ] Tables render with borders (not `|---|---|`)
- [ ] Headers are formatted (not `## Heading`)
- [ ] Bold/italic work (not `**bold**`)
- [ ] Links are clickable (not `[text](url)`)
- [ ] Code blocks have syntax highlighting
- [ ] Emoji render as Confluence emoticons

---

## Troubleshooting

### Tables Have Extra Empty Cells
**Fix**: Already handled in `md-to-confluence.js` via `.slice(1, -1)`

### Emoji Not Rendering
**Fix**: Add emoji mapping in converter. Currently supported:
- ✅ → tick
- ❌ → cross
- ⚠️ → warning
- 🔴 🟠 🟡 → flags

### Nested Lists Not Working
**Current Status**: Not supported yet. Use flat lists or manual HTML.

---

## Scripts Location

```
scripts/confluence/
├── md-to-confluence.js    # Converter
├── publish.sh              # Wrapper
└── README.md               # Full docs
```

---

**Remember**: Markdown is for authoring. HTML is for Confluence. Always convert!
