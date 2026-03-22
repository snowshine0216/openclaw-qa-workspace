# Phase 4a — Scenario Draft (Blind, Pre‑defect)
**Benchmark case:** RE-P4A-SCENARIO-DRAFT-001  
**Feature:** BCIN-7289  
**Feature family / knowledge pack:** report-editor  
**Primary phase under test:** phase4a (scenario drafting)  
**Evidence mode:** blind_pre_defect  
**Benchmark profile:** global-cross-feature-v1  
**Priority:** advisory  
**Blind evidence policy:** **all_customer_issues_only** (exclude non-customer issues)  
**Fixture references:** BCIN-7289-blind-pre-defect-bundle (**not provided locally**)  

## Evidence intake (what was available)
- The run included **no accessible customer issue evidence** and **no accessible fixture contents** for `BCIN-7289-blind-pre-defect-bundle`.
- `./skill_snapshot/SKILL.md` was referenced as required by the benchmark instructions, but **no contents were provided in the prompt/evidence set**, and no local file contents were supplied here.

**Resulting constraint:** Under the blind evidence policy, scenarios must be drafted strictly from customer issues; since none are available, scenario drafting cannot be evidence-grounded.

## Phase 4a output: Scenario draft status
### Required focus areas (must be covered by scenarios)
1. **Prompt handling** (user prompt → system response/interpretation)
2. **Template save** (saving a report template)
3. **Report builder loading** (opening/loading builder/editor)
4. **Visible report title outcomes** (title shown in UI after actions)

### Scenario set (blocked: cannot draft from customer evidence)
No phase4a scenarios can be produced compliantly because:
- No customer issue narratives, steps, screenshots, logs, or repro details are available.
- Fixture bundle is referenced but not accessible; cannot extract customer-reported behaviors.

## Compliance check against benchmark expectations
- **[phase_contract][advisory] Case focus explicitly covered:** **BLOCKED** (cannot draft evidence-based scenarios for prompt handling/template save/builder loading/title outcomes without customer issues)
- **[phase_contract][advisory] Output aligns with primary phase phase4a:** **PARTIAL** (this artifact is a phase4a scenario-draft deliverable, but contains no scenarios due to missing evidence)

## What’s needed to complete phase4a (minimum evidence request)
Provide any of the following **customer-origin** evidence for BCIN-7289 (or equivalent report-editor issues) that mentions at least one of: prompt handling, template save, report builder loading, or report title visibility:
- Customer ticket text with repro steps and expected/actual outcomes
- Customer chat transcripts
- Customer-provided screenshots/video and short description
- Customer-side logs (if any) tied to user actions

Once provided, I will draft phase4a scenarios that:
- Use only those customer issues
- Include clear preconditions, steps, and expected visible outcomes (especially report title)
- Cover each of the four focus areas explicitly