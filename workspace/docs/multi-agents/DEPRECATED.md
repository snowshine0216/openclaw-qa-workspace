# ⚠️ DEPRECATED - Old Multi-Agent Design

**Date:** 2026-02-23  
**Reason:** Architecture revised to use separate workspaces per agent and Feishu integration

---

## What Changed

### Old Architecture (Deprecated)
- ❌ Shared workspace for all agents
- ❌ Agent files in `workspace/agents/<id>/`
- ❌ No channel specified
- ❌ Manual clawddocs usage

### New Architecture (Active)
- ✅ **Separate workspace per agent** under `workspace/docs/multi-agents/<agent-id>/`
- ✅ **Feishu channel integration** for all agents
- ✅ **clawddocs skill mandatory** - configured in each agent
- ✅ **Isolated state and memory** per agent

---

## Migration Path

**Do NOT use the files in this directory for new setups.**

**New documentation:**
- See: `workspace/docs/multi-agents/v2/README.md`
- Configuration: `workspace/docs/multi-agents/v2/feishu-config.json5`
- Agent definitions: `workspace/docs/multi-agents/v2/agents/<agent-id>/`

---

## Files Deprecated

- ❌ `README.md` (old)
- ❌ `SETUP-GUIDE.md` (old)
- ❌ `SETUP-COMPLETE.md` (old)
- ❌ `QUICK-REFERENCE.md` (old)
- ❌ `TROUBLESHOOTING.md` (old)
- ❌ All agent configs (old)

**These files are kept for reference only. DO NOT INSTALL.**

---

**For new setup, see:** `workspace/docs/multi-agents/v2/`
