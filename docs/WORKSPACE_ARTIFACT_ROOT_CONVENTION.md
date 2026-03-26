# Workspace Artifact Root Convention

## Overview

This document defines the canonical folder taxonomy and ownership rules for runtime artifacts in the openclaw-qa-workspace repository.

**Core Principle**: Source skill directories contain only code, definitions, and frozen archive evidence. Live runtime state lives under `workspace-artifacts/`.

**Rationale**:
- Prevents runtime pollution of source-controlled skill trees
- Enables clean separation between versioned code and ephemeral execution state
- Simplifies .gitignore rules and repository hygiene
- Provides predictable paths for artifact discovery and cleanup

## Canonical Folder Taxonomy

```
openclaw-qa-workspace/
├── .agents/skills/              # Shared skills (source-owned)
│   ├── <skill-name>/
│   │   ├── skill.json
│   │   ├── src/
│   │   └── benchmarks/
│   │       └── <family>/
│   │           └── archive/     # Frozen baselines (versioned, read-only)
│   └── lib/                     # Shared libraries
│
├── workspace-*/skills/          # Workspace-local skills (source-owned)
│   └── <skill-name>/
│       ├── skill.json
│       ├── src/
│       └── benchmarks/
│           └── <family>/
│               └── archive/     # Frozen baselines (versioned, read-only)
│
└── workspace-artifacts/         # Runtime-only root (gitignored)
    └── skills/
        ├── shared/              # Shared skill runtime artifacts
        │   └── <skill-name>/
        │       ├── runs/
        │       │   └── <run-key>/
        │       └── benchmarks/
        │           └── <family>/
        │               ├── iter-<N>/
        │               ├── candidate_snapshot/
        │               └── champion_snapshot/
        │
        └── <workspace-name>/    # Workspace-local skill runtime artifacts
            └── <skill-name>/
                ├── runs/
                │   └── <run-key>/
                └── benchmarks/
                    └── <family>/
                        ├── iter-<N>/
                        ├── candidate_snapshot/
                        └── champion_snapshot/
```

## Path Ownership Rules

### Source-Owned Paths (Versioned)

**Location**: `.agents/skills/*` and `workspace-*/skills/*`

**Contents**:
- `skill.json` - Skill manifest
- `src/` - Source code
- `tests/` - Test suites
- `docs/` - Skill-specific documentation
- `benchmarks/<family>/archive/` - Frozen baseline evidence (versioned, read-only)

**Policy**: These paths are version-controlled and must never contain runtime state.

### Runtime-Owned Paths (Gitignored)

**Location**: `workspace-artifacts/skills/<workspace>/<skill>/`

**Contents**:
- `runs/<run-key>/` - Individual execution artifacts
- `benchmarks/<family>/iter-<N>/` - Benchmark iteration snapshots
- `benchmarks/<family>/candidate_snapshot/` - Current candidate under evaluation
- `benchmarks/<family>/champion_snapshot/` - Current champion baseline

**Policy**: These paths are gitignored and ephemeral. They may be deleted at any time without affecting source integrity.

### Archive Paths (Versioned, Read-Only)

**Location**: `<skill-source>/benchmarks/<family>/archive/`

**Contents**:
- Frozen baseline snapshots promoted from runtime
- Historical evidence for regression analysis
- Immutable once committed

**Policy**: Archive contents are versioned but treated as read-only. New archives are added via explicit promotion, never modified in place.

## Runtime-Only vs Source-Owned Distinction

### Why Separate Runtime from Source?

**Problem**: Mixing runtime artifacts with source code creates:
- Repository bloat from ephemeral execution state
- Merge conflicts on transient files
- Unclear ownership boundaries
- Difficult cleanup and maintenance

**Solution**: Strict separation enforced by convention and tooling.

### Enforcement Mechanisms

**Gitignore**: `workspace-artifacts/` is globally ignored at the repository root.

**Discovery Exclusion**: Skill discovery systems must respect exclusion patterns to avoid treating runtime artifacts as active skills.

**Path Validation**: Tests enforce that runtime paths resolve to `workspace-artifacts/` and source paths resolve to skill trees.

## Discovery Exclusion Enforcement

### In-Repo Policy Helper

**Location**: `.agents/skills/lib/artifactDiscoveryPolicy.mjs`

**Purpose**: Provides canonical exclusion and allowlist patterns for skill discovery systems.

**Key Exports**:
- `EXCLUSION_PATTERNS` - Patterns to exclude from discovery
- `ALLOWLIST_PATTERNS` - Patterns to include in discovery
- `isExcludedPath(path)` - Check if path should be excluded
- `isAllowedPath(path)` - Check if path matches allowlist
- `shouldIncludeInDiscovery(path)` - Combined inclusion check
- `getSkillTreeRoots()` - Canonical source-owned skill tree roots

**Exclusion Rules**:
```javascript
// Excluded from discovery:
workspace-artifacts/**
**/benchmarks/*/archive/**

// Allowed in discovery:
.agents/skills/*
workspace-*/skills/*
```

### In-Repo Enforcement Point

**Location**: `workspace-planner/skills/qa-plan-orchestrator/tests/workspaceArtifactPolicy.test.mjs`

**Purpose**: Validates that the artifact discovery policy is correctly implemented and enforced.

**Test Coverage**:
- Exclusion pattern matching
- Allowlist pattern matching
- Combined discovery inclusion logic
- Skill tree root resolution

### Ownership Note

Discovery exclusion is the responsibility of the discovery system, not individual skills. Skills should use the policy helper to ensure consistent behavior across the workspace.

## Path Resolution API

### Core Module

**Location**: `.agents/skills/lib/artifactRoots.mjs`

**Purpose**: Provides canonical path resolution for all artifact locations.

**Key Functions**:

```javascript
// Repository and workspace roots
getRepoRoot()                    // Repository root directory
getWorkspaceArtifactRoot()       // workspace-artifacts/ root

// Skill artifact roots
getSkillArtifactRoot(workspace, skill)
// → workspace-artifacts/skills/<workspace>/<skill>/

// Run-specific paths
getRunRoot(workspace, skill, runKey)
// → workspace-artifacts/skills/<workspace>/<skill>/runs/<runKey>/

// Benchmark runtime paths
getBenchmarkRuntimeRoot(workspace, skill, family)
// → workspace-artifacts/skills/<workspace>/<skill>/benchmarks/<family>/

// Canonical skill root resolution (for snapshot redirection)
resolveCanonicalSkillRoot(skillRoot)
```

**Environment Overrides**:
- `REPO_ROOT` - Override repository root detection
- `ARTIFACT_ROOT` - Override workspace-artifacts location
- `FQPO_CANONICAL_SKILL_ROOT` - Redirect snapshot reads to canonical location

## Migration Guidance for Future Skills

### For New Skills

1. **Import the artifact root resolver**:
   ```javascript
   import { getSkillArtifactRoot, getRunRoot } from '../../lib/artifactRoots.mjs';
   ```

2. **Use canonical path functions**:
   ```javascript
   const skillRoot = getSkillArtifactRoot('shared', 'my-skill');
   const runRoot = getRunRoot('shared', 'my-skill', runKey);
   ```

3. **Never hardcode artifact paths**. Always use the resolver functions.

4. **Store runtime state under the skill artifact root**:
   - Execution logs → `<skillRoot>/runs/<runKey>/`
   - Benchmark iterations → `<skillRoot>/benchmarks/<family>/iter-<N>/`
   - Snapshots → `<skillRoot>/benchmarks/<family>/{candidate,champion}_snapshot/`

5. **Store frozen evidence in source tree**:
   - Archive baselines → `<skill-source>/benchmarks/<family>/archive/`

### For Existing Skills

1. **Audit current artifact paths**:
   - Identify all locations where runtime artifacts are written
   - Check for hardcoded paths or relative path construction

2. **Replace hardcoded paths with resolver calls**:
   ```javascript
   // Before:
   const outputDir = join(skillDir, 'output', runKey);

   // After:
   import { getRunRoot } from '../../lib/artifactRoots.mjs';
   const outputDir = getRunRoot('shared', 'my-skill', runKey);
   ```

3. **Update tests to validate artifact paths**:
   - Ensure runtime artifacts resolve to `workspace-artifacts/`
   - Ensure source artifacts resolve to skill source tree
   - Use `artifactDiscoveryPolicy.mjs` for discovery validation

4. **Migrate existing artifacts**:
   - Move runtime state from source tree to `workspace-artifacts/`
   - Promote important baselines to `benchmarks/*/archive/`
   - Clean up obsolete runtime artifacts from source tree

### Common Pitfalls

**Don't**: Construct artifact paths manually
```javascript
// ❌ Bad
const artifactPath = join(skillDir, '..', '..', 'workspace-artifacts', 'skills', workspace, skill);
```

**Do**: Use the resolver
```javascript
// ✅ Good
const artifactPath = getSkillArtifactRoot(workspace, skill);
```

**Don't**: Store runtime state in source tree
```javascript
// ❌ Bad
const runDir = join(skillSourceDir, 'runs', runKey);
```

**Do**: Use runtime artifact root
```javascript
// ✅ Good
const runDir = getRunRoot(workspace, skill, runKey);
```

**Don't**: Modify archive contents in place
```javascript
// ❌ Bad
await writeFile(join(archiveDir, 'baseline.json'), newData);
```

**Do**: Promote new baselines explicitly
```javascript
// ✅ Good
await copySnapshot(candidateSnapshot, join(archiveDir, `baseline-${timestamp}.json`));
```

## Summary

The workspace artifact root convention provides:
- Clear separation between source code and runtime state
- Predictable, canonical paths for all artifact types
- Enforcement mechanisms to prevent policy violations
- Migration path for existing and future skills

All skills must follow this convention to maintain repository hygiene and enable consistent artifact management across the workspace.
