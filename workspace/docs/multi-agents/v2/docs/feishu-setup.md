# Feishu Integration Setup Guide

**Version:** 2.0  
**Date:** 2026-02-23  
**Purpose:** Configure Feishu (飞书) bot for multi-agent QA workflow

---

## 📋 Prerequisites

- Feishu account (飞书账号)
- Admin access to create a bot
- OpenClaw installed

---

## 🤖 Step 1: Create Feishu Bot

### 1.1 Go to Feishu Open Platform
- URL: https://open.feishu.cn/
- Login with your Feishu account

### 1.2 Create New App
1. Click "创建应用" (Create App)
2. Choose "自建应用" (Custom App)
3. App Name: **Atlas QA Bot**
4. App Description: **Multi-agent QA workflow orchestrator**
5. Icon: Upload a suitable icon (optional)

### 1.3 Get Credentials
After creation, note down:
- **App ID** (应用ID): `cli_xxxxxxxxxx`
- **App Secret** (应用密钥): `xxxxxxxxxxxx`

---

## 🔑 Step 2: Configure Bot Permissions

### 2.1 Enable Permissions
Go to "权限管理" (Permissions) and enable:

- ✅ **接收消息** (Receive messages)
- ✅ **发送消息** (Send messages)
- ✅ **读取群信息** (Read group info)
- ✅ **获取用户信息** (Get user info)

### 2.2 Set Event Subscriptions
Go to "事件订阅" (Event Subscriptions):

1. Enable "消息与群组" (Messages & Groups)
2. Subscribe to events:
   - `im.message.receive_v1` (Receive message)
   - `im.message.message_read_v1` (Message read - optional)

### 2.3 Set Webhook URL
OpenClaw will provide a webhook URL after configuration. Return here to set it.

---

## 📡 Step 3: Configure OpenClaw

### 3.1 Update Feishu Config

Edit: `workspace/docs/multi-agents/v2/feishu-config.json5`

```json5
{
  // Feishu configuration
  feishu: {
    accounts: [
      {
        id: "atlas-qa-bot",
        appId: "cli_xxxxxxxxxx",        // Replace with your App ID
        appSecret: "xxxxxxxxxxxx",      // Replace with your App Secret
        encryptKey: "",                 // Optional, for message encryption
        verificationToken: ""           // Optional, for webhook verification
      }
    ]
  },

  // Default agent
  defaultAgent: "master",

  // Agent bindings
  bindings: [
    {
      agentId: "master",
      match: {
        channel: "feishu",
        accountId: "atlas-qa-bot"
      }
    }
  ],

  // Agents (see full config in feishu-config.json5)
  agents: {
    master: {
      workspace: "./workspace/docs/multi-agents/v2/agents/master",
      model: "github-copilot/claude-sonnet-4.5",
      skillsAllowlist: ["clawddocs", "sessions_spawn"]
    },
    // ... (other agents)
  }
}
```

### 3.2 Install Configuration

```bash
# Backup current config
cp ~/.openclaw/openclaw.json ~/.openclaw/openclaw.json.backup-$(date +%Y%m%d-%H%M%S)

# Install new config
cp workspace/docs/multi-agents/v2/feishu-config.json5 ~/.openclaw/openclaw.json

# Restart gateway
openclaw gateway restart
```

### 3.3 Get Webhook URL

After restarting the gateway, OpenClaw will expose a webhook URL:

```bash
# Check logs for webhook URL
openclaw gateway logs | grep "Feishu webhook"

# Expected output:
# Feishu webhook available at: https://<your-domain>/webhook/feishu/atlas-qa-bot
```

---

## 🔗 Step 4: Set Webhook in Feishu

### 4.1 Configure Event Callback URL

1. Go back to Feishu Open Platform
2. Navigate to "事件订阅" (Event Subscriptions)
3. Set "请求网址配置" (Request URL):
   ```
   https://<your-domain>/webhook/feishu/atlas-qa-bot
   ```
4. Click "保存" (Save)
5. Verify the URL (Feishu will send a test request)

### 4.2 Publish the App

1. Go to "版本管理与发布" (Version & Release)
2. Create a version
3. Submit for review (if required)
4. Or directly publish to your organization

---

## 👥 Step 5: Add Bot to Group

### 5.1 Create or Join QA Group

1. In Feishu, create a group for QA (e.g., "QA Team - Atlas")
2. Or use an existing group

### 5.2 Add Atlas QA Bot

1. In the group, click "+" to add members
2. Search for "Atlas QA Bot" (or your bot name)
3. Add the bot to the group

### 5.3 Test the Bot

Send a message in the group:
```
@Atlas QA Bot Master, introduce yourself
```

Expected response:
```
Hello! I'm Atlas Master, the task delegation orchestrator for the QA workflow.

I coordinate with 5 specialized agents:
- openclaw-config: OpenClaw configuration expert
- qa-daily: Daily Jira & CI monitoring
- qa-plan: Test planning & strategy
- qa-test: Test execution & automation
- qa-report: Test reporting & Jira updates

How can I help you today?
```

---

## 🧪 Step 6: Verify Configuration

### 6.1 Check Agent Routing

```bash
# List agents and bindings
openclaw agents list --bindings

# Expected output:
# Agents:
#   ✓ master (default, feishu:atlas-qa-bot)
#   ✓ openclaw-config
#   ✓ qa-daily
#   ✓ qa-plan
#   ✓ qa-test
#   ✓ qa-report
```

### 6.2 Test Message Delivery

In Feishu group:
```
Master, are you online?
```

Expected: Master agent responds immediately.

### 6.3 Test Agent Delegation

In Feishu group:
```
Master, spawn openclaw-config and ask it to list available documentation categories
```

Expected: Master spawns openclaw-config, which uses clawddocs skill and responds.

---

## 🎯 Step 7: Configure Agent-to-Agent Communication

### 7.1 Enable Agent Communication

Ensure in `feishu-config.json5`:

```json5
{
  agentToAgent: {
    enabled: true
  }
}
```

### 7.2 Test Delegation

In Feishu:
```
Master, test issue BCIN-1234
```

Expected flow:
1. Master acknowledges
2. Master spawns qa-plan (delegates)
3. qa-plan responds to master
4. Master spawns qa-test (delegates)
5. qa-test responds to master
6. Master spawns qa-report (delegates)
7. qa-report responds to master
8. Master reports final summary to Snow

---

## 🛠️ Troubleshooting

### Issue: Bot Not Responding

**Possible causes:**
- Webhook URL not set correctly
- Gateway not running
- Feishu permissions not enabled

**Fix:**
```bash
# Check gateway status
openclaw gateway status

# Check logs
openclaw gateway logs | grep -i feishu

# Restart gateway
openclaw gateway restart
```

### Issue: Wrong Agent Responding

**Possible causes:**
- Bindings misconfigured
- Multiple agents match the same criteria

**Fix:**
```bash
# Verify bindings order (most specific first)
openclaw agents list --bindings

# Check routing in logs
openclaw gateway logs | grep "routing"
```

### Issue: sessions_spawn Fails

**Possible causes:**
- Agent-to-agent communication disabled
- Agent ID mismatch

**Fix:**
```bash
# Verify agentToAgent is enabled
cat ~/.openclaw/openclaw.json | grep -A 3 "agentToAgent"

# Verify agent IDs match
openclaw agents list
```

---

## 📚 Additional Resources

- **Feishu Open Platform Docs:** https://open.feishu.cn/document/
- **OpenClaw Providers Docs:** `~/Documents/Repository/openclaw-qa-workspace/workspace/docs/providers/`
- **clawddocs Skill:** `~/Documents/Repository/openclaw-qa-workspace/workspace/skills/clawddocs/`

---

## ✅ Checklist

- [ ] Created Feishu bot on open.feishu.cn
- [ ] Noted App ID and App Secret
- [ ] Enabled bot permissions (receive, send, group info, user info)
- [ ] Subscribed to message events
- [ ] Updated `feishu-config.json5` with credentials
- [ ] Installed config to `~/.openclaw/openclaw.json`
- [ ] Restarted gateway
- [ ] Set webhook URL in Feishu Open Platform
- [ ] Published bot to organization
- [ ] Added bot to QA group
- [ ] Tested basic message delivery
- [ ] Tested agent delegation
- [ ] Verified agent-to-agent communication

---

**Setup complete! 🎉 Your multi-agent QA workflow is now live on Feishu!**
