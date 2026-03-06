# OpenClaw Best Practices

> Consolidated guide for agent design and self-evolution in OpenClaw.
> Sources: Fu Sheng 龙虾 article, workspace skills (openclaw-agent-design, capability-evolver, self-improving-agent).

---

## Part 1: Best Practices for Agent Design (from the Article)

From Fu Sheng's 14-day "养龙虾" experiment — a CEO using OpenClaw to build an 8-agent AI team while recovering from injury.

### 1.1 Skill Accumulation as the Core Moat

> **"Agent的核心壁垒不是模型，不是平台——是Skill积累。"**  
> (The core moat of agents is not the model or the platform—it's Skill accumulation.)

- Every mistake → a rule → a Skill → "Never Again".
- Skills don't disappear, don't forget, can be instantly passed to other agents.
- Early runs are slow; once Skills accumulate, runs become much smoother.
- Knowledge transfer between agents is nearly cost-free.

### 1.2 Learn from Every Error

> **"踩坑、总结、写成文档、下次自动执行——这就是龙虾的学习方式。"**  
> (Stumble, summarize, document, auto-execute next time—that's how the lobster learns.)

- Turn each failure into a documented rule.
- Store rules as Skills so they are reused automatically.
- Avoid repeating the same mistake.

### 1.3 Four Structural Differences vs. Typical Agents

| Dimension | Typical Agent | OpenClaw-Style Agent |
|-----------|---------------|----------------------|
| **Environment** | Sandboxed | Full computer access |
| **Memory** | In-conversation context | File-based long-term memory |
| **Skills** | Fixed | Extensible Skills |
| **Automation** | Human-triggered | Cron-driven 7×24 operation |

### 1.4 Inject Private Data

> **"龙虾越养越好用，因为你的私有数据都在它脑子里。"**  
> (The lobster gets better the more you use it, because your private data is in its memory.)

- Feed in your preferences, style, and context.
- The agent should know your habits, constraints, and workflows.
- Personal data makes the agent more useful over time.

### 1.5 Agent as "Person with Computer", Not Software

> **"Agent是软件，龙虾是配备了电脑的人。软件等你输入精确指令。"**  
> (An agent is software; the lobster is a person with a computer. Software waits for precise instructions.)

- Design for natural-language, human-style instructions.
- The agent should infer intent, not require exact commands.
- It should proactively analyze, decide, and act.

### 1.6 Iteration Cost Near Zero

> **"改东西不再有代价——24小时改了一百多次，每次一两分钟出结果。"**  
> (Changing things no longer has a cost—100+ changes in 24 hours, each taking 1–2 minutes.)

- Support fast, low-cost iteration.
- Each change should produce results quickly.
- Use automation so humans can focus on direction, not execution.

### 1.7 "老板思维" (Boss Mindset)

> **"知道目标，拆解任务，分配给最合适的人或AI，检查结果、迭代调整。"**  
> (Know the goal, break down tasks, assign to the right person or AI, check results, iterate.)

- Agent should: understand goals → decompose tasks → assign → verify → iterate.
- The bottleneck is orchestration, not raw intelligence.
- Design agents to be schedulable and delegatable.

### 1.8 Multi-Agent Team Structure

- One human + multiple agents = a team.
- Different agents for different roles (e.g., 三万, 笔杆子, 参谋, 运营官, 进化官, 健康管家, 交易官, 社区官).
- Agents can share Skills and work together.

### 1.9 Real-World Validation

> **"最好的demo就是出了事，AI Agent真的能兜住。"**  
> (The best demo is when something goes wrong and the AI agent actually handles it.)

- Test in real incidents and edge cases.
- The agent should be able to diagnose, fix, and recover.
- Use real business scenarios, not only demos.

### 1.10 Complete "Brain" Design

> **"大模型是智商，记忆系统是海马体，Skill是肌肉记忆，Cron是生物钟，多通道接入是感知器官。"**  
> (LLM is intelligence; memory is hippocampus; Skills are muscle memory; Cron is circadian rhythm; multi-channel input is sensory organs.)

- **LLM**: reasoning and judgment.
- **Memory**: long-term, persistent context.
- **Skills**: reusable, accumulated capabilities.
- **Cron**: scheduled, autonomous execution.
- **Multi-channel**: voice, screenshots, chat, etc.

### 1.11 Summary Table

| Practice | Description |
|----------|-------------|
| **Skill-first** | Treat Skill accumulation as the main moat, not model size. |
| **Error → Skill** | Turn every mistake into a documented, reusable Skill. |
| **Full environment** | Give agents real computer access, not only sandbox. |
| **Persistent memory** | Use file-based long-term memory, not just chat context. |
| **Private data** | Continuously inject user-specific data and preferences. |
| **Human-style interaction** | Support natural language and intent, not only precise commands. |
| **7×24 automation** | Use Cron and scheduling for continuous operation. |
| **Multi-agent teams** | Design roles and let agents share Skills and collaborate. |
| **Real-world validation** | Test in real incidents and production scenarios. |

**Source:** [全网炸了！骨折傅盛直播翻车：龙虾3分钟救场，10万人看懵了](https://mp.weixin.qq.com/s/Gh2xu45ZOKO2GHc5Pmwivg) — MLNLP community article on Fu Sheng's 14-day OpenClaw/EasyClaw experiment.

---

## Part 2: How to Self-Evolve (OpenClaw)

Two main mechanisms in the workspace: **self-improving-agent** (continuous learning) and **capability-evolver** (protocol-driven evolution).

### 2.1 Self-Improving-Agent (Continuous Learning)

#### When to Log

| Situation | Log To | Category |
|-----------|--------|----------|
| Command/operation fails | `.learnings/ERRORS.md` | — |
| User corrects you | `.learnings/LEARNINGS.md` | `correction` |
| User wants missing feature | `.learnings/FEATURE_REQUESTS.md` | — |
| API/external tool fails | `.learnings/ERRORS.md` | — |
| Knowledge outdated | `.learnings/LEARNINGS.md` | `knowledge_gap` |
| Better approach found | `.learnings/LEARNINGS.md` | `best_practice` |

#### Promotion Path

```
.learnings/ (raw) → CLAUDE.md / AGENTS.md / TOOLS.md / SOUL.md (promoted)
```

When a learning is broadly applicable:

- **Behavioral patterns** → `SOUL.md`
- **Workflow improvements** → `AGENTS.md`
- **Tool gotchas** → `TOOLS.md`

#### Skill Extraction

When a learning qualifies (recurring, verified, broadly applicable):

```bash
./skills/self-improvement/scripts/extract-skill.sh skill-name --dry-run
./skills/self-improvement/scripts/extract-skill.sh skill-name
```

### 2.2 Capability-Evolver (Protocol-Driven Evolution)

#### What It Does

- Scans memory and history for errors and patterns.
- Uses signals to select Genes/Capsules.
- Emits a GEP protocol prompt to guide safe evolution.
- Does not edit code directly; it generates a protocol-bound prompt.

#### GEP Assets

| Asset | Purpose |
|-------|---------|
| `assets/gep/genes.json` | Reusable Gene definitions |
| `assets/gep/capsules.json` | Success capsules to avoid repeating reasoning |
| `assets/gep/events.jsonl` | Append-only evolution events (tree-like) |

#### Run Modes

```bash
# Automated (Mad Dog Mode) — applies changes immediately
node skills/capability-evolver/index.js

# Review mode — human-in-the-loop, confirm before apply
node skills/capability-evolver/index.js --review

# Continuous loop — e.g. via cron
node skills/capability-evolver/index.js --loop
```

#### Mutation Directive

- **Errors found** → Repair mode (fix bugs).
- **Stable** → Forced optimization (refactor/innovate).

### 2.3 ADL (Anti-Degeneration Lock)

#### Forbidden Evolution

1. **Fake intelligence** — adding meaningless complex steps to "appear smart".
2. **Unverifiable** — mechanisms with unverifiable results.
3. **Vague concepts** — terms like "feeling", "intuition", "dimension".
4. **Novelty bias** — sacrificing stability for novelty.

#### Priority Order

1. **Stability** — must run 1000 times without crashing.
2. **Explainability** — must be able to explain why.
3. **Reusability** — usable in other scenarios.
4. **Scalability** — handles volume growth.
5. **Novelty** — least important.

#### Before Every Evolution

- **Rollback plan**: If the new feature explodes, how to restore with one click?
- **Failure condition**: How to know it exploded? (e.g. success rate < 90%)

### 2.4 Recommended Self-Evolution Workflow

```
1. Log learnings (self-improving-agent)
   └── .learnings/ERRORS.md, LEARNINGS.md, FEATURE_REQUESTS.md

2. Promote high-value learnings
   └── CLAUDE.md, AGENTS.md, TOOLS.md, SOUL.md

3. Extract recurring patterns → Skills
   └── extract-skill.sh skill-name

4. Run capability-evolver (periodic)
   └── node index.js --review  (recommended first)
   └── node index.js           (auto after you trust it)

5. Enforce ADL
   └── Stability > explainability > reusability > scalability > novelty
```

### 2.5 Configuration

```bash
# Use Feishu for evolution reports
EVOLVE_REPORT_TOOL=feishu-card

# Or rely on skill auto-detection (workspace/skills/feishu-card)
```

### 2.6 Safety Checklist

- [ ] Use `--review` first in production.
- [ ] Run git sync before/after evolution.
- [ ] Single process only (no evolver spawning evolver).
- [ ] ADL: stability first, then explainability.
- [ ] Rollback plan before every evolution.

### 2.7 龙虾 Pattern (from the Article)

> **"Every mistake → rule → Skill → Never Again."**

- Turn each error into a documented rule.
- Store rules as Skills.
- Skills persist and can be shared across agents.
- Knowledge transfer cost between agents ≈ 0.

---

## References

- [Fu Sheng 龙虾 article](https://mp.weixin.qq.com/s/Gh2xu45ZOKO2GHc5Pmwivg)
- `.cursor/skills/openclaw-agent-design/SKILL.md`
- `.cursor/skills/openclaw-agent-design-review/SKILL.md`
- `.agents/skills/self-improving-agent/SKILL.md`
- `.agents/skills/evolver/SKILL.md` (capability-evolver)
- `workspace-healer/skills/evolver/ADL.md`
- `docs/SKILL_SHELL_WORKFLOW_ENHANCEMENT_DESIGN.md`