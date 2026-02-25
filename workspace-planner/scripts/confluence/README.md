# Confluence Publishing Scripts

Scripts for converting and publishing content to Confluence.

## Files

### `md-to-confluence.js`
Converts Markdown files to Confluence storage format (HTML).

**Usage:**
```bash
node scripts/confluence/md-to-confluence.js <input.md> <output.html>
```

**Features:**
- ✅ Headers (#, ##, ###) → `<h1>`, `<h2>`, `<h3>`
- ✅ Bold (**text**) → `<strong>`
- ✅ Italic (*text*) → `<em>`
- ✅ Inline code (`code`) → `<code>`
- ✅ Code blocks (```) → Confluence code macro
- ✅ Links ([text](url)) → `<a href>`
- ✅ Lists (-, *, 1.) → `<ul>`, `<ol>`
- ✅ Tables (|---|---) → `<table>`
- ✅ Emoji (✅, ❌, 🔴) → Confluence emoticons
- ✅ Horizontal rules (---) → `<hr />`
- ✅ Blockquotes (>) → `<blockquote>`

**Example:**
```bash
# Convert QA plan to Confluence HTML
node scripts/confluence/md-to-confluence.js \
  projects/feature-plan/BCED-4198/qa_plan_final.md \
  projects/feature-plan/BCED-4198/qa_plan_confluence.html

# Publish to Confluence
confluence update 5903319628 \
  --file projects/feature-plan/BCED-4198/qa_plan_confluence.html \
  --format storage
```

## Workflow for Publishing to Confluence

### Step 1: Convert Markdown to HTML
```bash
node scripts/confluence/md-to-confluence.js <input.md> <output.html>
```

### Step 2: Verify Conversion
```bash
head -100 <output.html>
```

Check that:
- Tables look correct (no empty cells)
- Headers converted properly
- Links work
- Code blocks use Confluence macros

### Step 3: Publish to Confluence
```bash
confluence update <page-id> --file <output.html> --format storage
```

**⚠️ NEVER publish raw Markdown:**
```bash
# ❌ WRONG - Don't do this!
confluence update 12345 --file plan.md

# ✅ CORRECT - Always convert first
node scripts/confluence/md-to-confluence.js plan.md plan.html
confluence update 12345 --file plan.html --format storage
```

## Troubleshooting

### Tables Have Extra Empty Cells
- **Cause**: Table parser not stripping leading/trailing pipe characters
- **Fix**: Update `convertTablesToConfluence()` to use `.slice(1, -1)` after split

### Emoji Not Rendering
- **Cause**: Emoji not mapped to Confluence emoticons
- **Fix**: Add emoji mapping in `convertMarkdownToConfluence()`
- **List**: https://confluence.atlassian.com/doc/confluence-storage-format-790796544.html

### Code Blocks Not Syntax Highlighting
- **Cause**: Language not specified in code macro
- **Fix**: Update code block regex to capture language from ```lang

### Lists Not Nested
- **Current**: Only handles single-level lists
- **Future**: Enhance regex to handle nested lists with indentation

## Limitations

**Current converter is simple and doesn't handle:**
- Nested lists
- Task lists (- [ ] checkbox)
- Image embeds (![alt](url))
- Footnotes
- Definition lists
- Advanced Confluence macros (info panels, expand, etc.)

**For complex documents**, consider:
- Using `pandoc`: `pandoc -f markdown -t html input.md -o output.html`
- Manual Confluence editor for advanced layouts
- Confluence Blueprint templates

## Future Enhancements

1. **Info/Warning Panels**: Convert markdown alerts to Confluence info/warning macros
2. **Table of Contents**: Auto-generate TOC macro
3. **Image Upload**: Handle image references and upload to Confluence
4. **Nested Lists**: Support multi-level bullet/numbered lists
5. **Task Lists**: Convert `- [ ]` to Confluence task checkboxes

---

**Last Updated**: 2026-02-25  
**Maintainer**: QA Planner Agent (Atlas)
