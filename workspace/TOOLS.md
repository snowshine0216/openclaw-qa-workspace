# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

### Feishu

- github-updates: oc_dd7a5e9afb38197566c7a55c5f7df2b0

### Gmail Integration

- **Status:** ✅ Configured
- **Credentials:** `~/.gmail/credentials.json`
- **Tokens:** `~/.gmail/token.json`
- **Auth script:** `~/.gmail/auth.sh`
- **Scopes:** read, send, labels
- **Project ID:** snows-project-472022

**To authenticate:** Run `~/.gmail/auth.sh`
**To refresh:** Run `~/.gmail/auth.sh` again

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

Add whatever helps you do your job. This is your cheat sheet.
