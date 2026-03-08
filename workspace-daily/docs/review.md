  - Phase 3 is asynchronous, but run.sh is written as fully sequential. run.sh immediately proceeds into phases 4 and 5 after
    phase 3 returns, but phase 3 explicitly says the shell script only prepares the manifest and the orchestrator agent completes
    the real work later. That means phase 4 can run before RCAs exist: workspace-daily/docs/
    RCA_DAILY_SKILL_REFACTOR_DESIGN.md:311, workspace-daily/docs/RCA_DAILY_SKILL_REFACTOR_DESIGN.md:316, workspace-daily/docs/
    RCA_DAILY_SKILL_REFACTOR_DESIGN.md:321, workspace-daily/docs/RCA_DAILY_SKILL_REFACTOR_DESIGN.md:940.
  - The Phase 0 “skip run” behavior is not actually wired through. phase0_check_resume.sh exits early on FINAL_EXISTS, but run.sh
    invokes it as a child shell, so the parent script still continues unless it inspects a return signal or state file:
    workspace-daily/docs/RCA_DAILY_SKILL_REFACTOR_DESIGN.md:299, workspace-daily/docs/RCA_DAILY_SKILL_REFACTOR_DESIGN.md:535,
    workspace-daily/docs/RCA_DAILY_SKILL_REFACTOR_DESIGN.md:579.
  - Phase 4 contradicts itself on what Jira field gets updated. The orchestrator skill says customfield_10050, while the script
    spec and implementation say the main description field via --update-description, and the quality gate separately says raw
    REST PUT to the issue: workspace-daily/docs/RCA_DAILY_SKILL_REFACTOR_DESIGN.md:186, workspace-daily/docs/
    RCA_DAILY_SKILL_REFACTOR_DESIGN.md:316, workspace-daily/docs/RCA_DAILY_SKILL_REFACTOR_DESIGN.md:979, workspace-daily/docs/
    RCA_DAILY_SKILL_REFACTOR_DESIGN.md:987, workspace-daily/docs/RCA_DAILY_SKILL_REFACTOR_DESIGN.md:1528.
  - The doc mixes interactive and unattended behavior. It says Phase 0 should “present options” and avoid overwriting without
    confirmation, but this is also described as a scheduled shell workflow and the phase 0 script auto-wipes for
    full_regenerate / fresh: workspace-daily/docs/RCA_DAILY_SKILL_REFACTOR_DESIGN.md:182, workspace-daily/docs/
    RCA_DAILY_SKILL_REFACTOR_DESIGN.md:282, workspace-daily/docs/RCA_DAILY_SKILL_REFACTOR_DESIGN.md:584, workspace-daily/docs/
    RCA_DAILY_SKILL_REFACTOR_DESIGN.md:593.
  - The status model is inconsistent. Phase 4 only writes success or failed, but the summary and schema expect partial_success;
    also the doc says all state writes must go through lib/state.sh, yet phase 5 edits task.json directly with raw jq: workspace-
    daily/docs/RCA_DAILY_SKILL_REFACTOR_DESIGN.md:422, workspace-daily/docs/RCA_DAILY_SKILL_REFACTOR_DESIGN.md:1156, workspace-
    daily/docs/RCA_DAILY_SKILL_REFACTOR_DESIGN.md:1160, workspace-daily/docs/RCA_DAILY_SKILL_REFACTOR_DESIGN.md:1211, workspace-
    daily/docs/RCA_DAILY_SKILL_REFACTOR_DESIGN.md:1443, workspace-daily/docs/RCA_DAILY_SKILL_REFACTOR_DESIGN.md:1287, workspace-
    daily/docs/RCA_DAILY_SKILL_REFACTOR_DESIGN.md:1525.
  - Two deliverables are declared but not actually specified. The design says to create both reference.md files, but section 3
    only defines the contents of the two SKILL.md files and the README: workspace-daily/docs/
    RCA_DAILY_SKILL_REFACTOR_DESIGN.md:73, workspace-daily/docs/RCA_DAILY_SKILL_REFACTOR_DESIGN.md:75, workspace-daily/docs/
    RCA_DAILY_SKILL_REFACTOR_DESIGN.md:109, workspace-daily/docs/RCA_DAILY_SKILL_REFACTOR_DESIGN.md:160, workspace-daily/docs/
    RCA_DAILY_SKILL_REFACTOR_DESIGN.md:208.
  - The sub-agent handoff is incomplete. Phase 3 says sub-agents update task.json, but the RCA skill contract only requires
    writing the RCA file and announcing completion; it never defines how item status or phase completion gets written back:
    workspace-daily/docs/RCA_DAILY_SKILL_REFACTOR_DESIGN.md:134, workspace-daily/docs/RCA_DAILY_SKILL_REFACTOR_DESIGN.md:137,
    workspace-daily/docs/RCA_DAILY_SKILL_REFACTOR_DESIGN.md:933, workspace-daily/docs/RCA_DAILY_SKILL_REFACTOR_DESIGN.md:940.
  - Process-wise, the design is not review-complete yet. The checklist still shows reviewer artifacts and reviewer status as
    missing: workspace-daily/docs/RCA_DAILY_SKILL_REFACTOR_DESIGN.md:1536, workspace-daily/docs/
    RCA_DAILY_SKILL_REFACTOR_DESIGN.md:1537.
