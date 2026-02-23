# Workspace Organization Rules

> This is Clawdbot's workspace rules. Always refer to these rules before generating files.

## 📁 Directory Structure

```
/workspace/
├── AGENTS.md          # Agent behavior definition (ROOT - do not move)
├── SOUL.md            # Personality definition (ROOT - do not move)
├── USER.md            # User information (ROOT - do not move)
├── TOOLS.md           # Tool configuration (ROOT - do not move)
├── IDENTITY.md        # Identity information (ROOT - do not move)
├── HEARTBEAT.md       # Heartbeat tasks (ROOT - do not move)
├── BOOTSTRAP.md       # Initialization (ROOT - do not move)
├── README.md          # Project description (ROOT - do not move)
├── WORKSPACE_RULES.md # This file (ROOT - do not move)
│
├── memory/            # Memory logs (by date)
│   └── YYYY-MM-DD.md
│
├── projects/          # All project content
│   ├── vocabulary/    # Vocabulary learning
│   │   ├── parts/     # vocab_part_*.docx
│   │   ├── days/      # vocab_day_*.docx
│   │   └── *.docx     # Collection files
│   │
│   └── <project>/     # Other projects create subdirectories by name
│
├── scripts/           # Script tools (.sh, .py, etc.)
│
├── skills/            # Skill modules (do not modify manually)
│
├── config/            # Configuration files (optional)
│
└── archive/           # Archived files (optional)
```

## 🚫 Prohibited Actions

1. **No scattered files in root** - All generated files must go into corresponding directories
2. **No arbitrary new directories** - Confirm project categorization first, then create subdirectories
3. **Do not move root .md files** - AGENTS.md, SOUL.md, etc. stay in root permanently
4. **Do not modify skills/** - Skill directory is managed by the system

## ✅ File Categorization Rules

| File Type | Location |
|---------|---------|
| vocab_*.docx/txt | `projects/vocabulary/parts/` or `days/` |
| Project documents | `projects/<project_name>/` |
| Scripts | `scripts/` |
| Temporary files | `tmp/` (delete after use) |
| Archived files | `archive/` |
| Test reports | `projects/<project>/tests/` |
| Skills (workspace level)| `skills/`|

## 📝 Before Creating New Files

1. Ask yourself: what kind of the files are Which project does this file belong to?
2. Check if corresponding directory exists under `projects/`
3. If not, create `projects/<project_name>/`
4. Place the file in the corresponding directory

## 🔄 Regular Maintenance

- Weekly: Check for scattered files in root
- Monthly: Clean up `archive/` directory
- After project completion: Archive to `archive/`

---

_Last updated: 2026-02-13_
