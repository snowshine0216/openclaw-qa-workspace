---
name: markxmind
description: Generate Markdown files using XMindMark syntax for mind maps. Use when the user asks to create a mind map, brainstorm outline, hierarchical structure, or convert content to XMind format. Output .md files compatible with MarkXMind (markxmind.js.org) for preview and export to .xmind, .svg, .png.
---

# MarkXMind

Generate `.md` files with valid XMindMark syntax for mind maps. Output is compatible with the [MarkXMind](https://markxmind.js.org/) online editor.

## Online Tool

**[MarkXMind](https://markxmind.js.org/)** — paste generated content for real-time preview and export:

- Export to `.xmind`, `.xmindmark`, `.svg`, `.png`
- Import `.xmind` and convert to XMindMark text
- Runs in browser, no backend required

## When to Use

- Create mind maps from scratch
- Brainstorm outlines or hierarchical content
- Convert structured content to XMind format
- QA plan structures, test case outlines, feature coverage trees

## Workflow

1. Write XMindMark content following [reference.md](reference.md)
2. Save as `.md` file
3. Optionally validate: `node .agents/skills/markxmind/scripts/validate_xmindmark.mjs <path-to.md>`
4. User pastes into [MarkXMind](https://markxmind.js.org/) for visualization and export

## Resources

- **Syntax**: [reference.md](reference.md) — XMindMark quick reference
- **Patterns**: [examples.md](examples.md) — generic and QA planning examples
