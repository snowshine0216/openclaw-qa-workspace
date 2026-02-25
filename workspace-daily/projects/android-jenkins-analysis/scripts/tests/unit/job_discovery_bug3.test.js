/**
 * Tests for:
 *   Bug 3: getDownstreamJobNames() always returns [] (wrong endpoint)
 *   Bug C: causes[] is nested inside actions[], not directly on build
 *   Fix 3: getAllLibraryJobNames() correctly discovers Library_* jobs
 *   Fix C: findMatchingBuild/detectRerun now flatten actions[].causes[]
 *
 * Run: npx jest tests/unit/job_discovery_bug3.test.js --verbose
 */
const {
  getDownstreamJobNames,
  getAllLibraryJobNames,
  findMatchingBuild,
  detectRerun,
  discoverAndroidBuilds,
} = require('../../android/job_discovery');

// Helper: wrap causes in the real Jenkins actions[] nesting
const withCauses = (causes) => ({
  actions: [{ _class: 'hudson.model.CauseAction', causes }]
});

// ─────────────────────────────────────────────────────────────────────────────
// BUG 3 PROOF: downstreamProjects is always empty for dynamic trigger jobs
// ─────────────────────────────────────────────────────────────────────────────

describe('Bug 3 — getDownstreamJobNames() returns [] for dynamic trigger jobs', () => {
  it('returns empty array when Jenkins reports no downstreamProjects (empty array)', async () => {
    const mockClient = {
      fetch: jest.fn().mockResolvedValue({
        _class: 'hudson.model.FreeStyleProject',
        name: 'Trigger_Library_Jobs',
        downstreamProjects: [],
      }),
    };
    const result = await getDownstreamJobNames('Trigger_Library_Jobs', mockClient);
    expect(result).toEqual([]);
    expect(mockClient.fetch).toHaveBeenCalledWith(
      '/job/Trigger_Library_Jobs/api/json?tree=downstreamProjects[name]'
    );
  });

  it('returns empty array when downstreamProjects key is absent entirely', async () => {
    const mockClient = {
      fetch: jest.fn().mockResolvedValue({
        _class: 'hudson.model.FreeStyleProject',
        name: 'Trigger_Library_Jobs',
      }),
    };
    const result = await getDownstreamJobNames('Trigger_Library_Jobs', mockClient);
    expect(result).toEqual([]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// BUG C PROOF: causes[] is nested under actions[], not on build directly
// ─────────────────────────────────────────────────────────────────────────────

describe('Bug C — causes[] is nested under actions[], not directly on build', () => {
  it('findMatchingBuild returns null when causes is put directly on build (old broken way)', async () => {
    // Simulate what the OLD code queried and what Jenkins actually returns
    // build.causes is always undefined — Jenkins puts them in build.actions[].causes[]
    const mockClient = {
      fetch: jest.fn().mockResolvedValue({
        builds: [{
          number: 564,
          result: 'FAILURE',
          timestamp: 1708700000000,
          // OLD BROKEN: causes here directly — Jenkins API does NOT return this
          causes: [{ upstreamProject: 'Trigger_Library_Jobs', upstreamBuild: 87 }],
          // No actions key — so (build.actions || []).flatMap(...) = []
        }]
      })
    };

    // Even though causes looks right, the fixed code reads via actions[] which is absent
    // This test documents: if Jenkins returns causes directly (which it doesn't), we still handle it
    // The new code only looks in actions[].causes[], so this would return null with the real API
    const result = await findMatchingBuild('Library_Dossier_InfoWindow', 'Trigger_Library_Jobs', 87, mockClient);
    // With the fix, build.causes is ignored; only build.actions[].causes matters
    expect(result).toBeNull(); // proves the old approach was broken with real Jenkins
  });

  it('findMatchingBuild finds build when causes are correctly in actions[] (real Jenkins structure)', async () => {
    const mockClient = {
      fetch: jest.fn().mockResolvedValue({
        builds: [{
          number: 564,
          result: 'FAILURE',
          timestamp: 1708700000000,
          // CORRECT: Jenkins nests causes inside CauseAction in actions[]
          actions: [
            { _class: 'hudson.model.ParametersAction', parameters: [] },
            { _class: 'hudson.model.CauseAction',
              causes: [{ upstreamProject: 'Trigger_Library_Jobs', upstreamBuild: 87 }]
            },
          ],
        }]
      })
    };

    const result = await findMatchingBuild('Library_Dossier_InfoWindow', 'Trigger_Library_Jobs', 87, mockClient);
    expect(result).toMatchObject({ buildNum: 564, result: 'FAILURE' });
  });

  it('detectRerun finds manual re-run when cause is in actions[].causes (real Jenkins structure)', async () => {
    const primaryBuildNum = 201;
    const primaryTimestamp = 1708700000000;

    const mockClient = {
      fetch: jest.fn().mockResolvedValue({
        builds: [
          {
            number: 202,
            result: 'SUCCESS',
            timestamp: primaryTimestamp + 30 * 60 * 1000,
            actions: [{
              _class: 'hudson.model.CauseAction',
              causes: [{ _class: 'hudson.model.Cause$UserIdCause' }]
            }]
          },
          {
            number: 201,
            result: 'FAILURE',
            timestamp: primaryTimestamp,
            actions: [{
              _class: 'hudson.model.CauseAction',
              causes: [{ upstreamProject: 'Trigger_Library_Jobs', upstreamBuild: 87 }]
            }]
          }
        ]
      })
    };

    const result = await detectRerun(
      'Library_Maps_Overlay', primaryBuildNum, primaryTimestamp,
      'Trigger_Library_Jobs', 87, mockClient
    );
    expect(result).toMatchObject({ buildNum: 202, result: 'SUCCESS' });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// FIX 3: getAllLibraryJobNames() discovers jobs by name prefix scan
// ─────────────────────────────────────────────────────────────────────────────

describe('Fix 3 — getAllLibraryJobNames() discovers Library_* jobs by prefix', () => {
  const mockJenkinsJobList = {
    jobs: [
      { name: 'Library_Dossier_InfoWindow' },
      { name: 'Library_CustomApp_Cache' },
      { name: 'Library_Maps_Overlay' },
      { name: 'Trigger_Library_Jobs' },       // must NOT be included
      { name: 'Tanzu_Report_Env_Upgrade' },   // must NOT be included
      { name: 'Library_Analytics_Dashboard' },
      { name: 'Global_Config_Job' },           // must NOT be included
    ],
  };

  it('returns only jobs starting with "Library_"', async () => {
    const mockClient = { fetch: jest.fn().mockResolvedValue(mockJenkinsJobList) };
    const result = await getAllLibraryJobNames(mockClient);
    expect(result).toEqual([
      'Library_Dossier_InfoWindow',
      'Library_CustomApp_Cache',
      'Library_Maps_Overlay',
      'Library_Analytics_Dashboard',
    ]);
    expect(result).not.toContain('Trigger_Library_Jobs');
    expect(result).not.toContain('Global_Config_Job');
  });

  it('calls the correct Jenkins root API endpoint', async () => {
    const mockClient = { fetch: jest.fn().mockResolvedValue({ jobs: [] }) };
    await getAllLibraryJobNames(mockClient);
    expect(mockClient.fetch).toHaveBeenCalledWith('/api/json?tree=jobs[name]');
  });

  it('supports a custom prefix for flexibility', async () => {
    const mockClient = { fetch: jest.fn().mockResolvedValue(mockJenkinsJobList) };
    const result = await getAllLibraryJobNames(mockClient, 'Trigger_');
    expect(result).toEqual(['Trigger_Library_Jobs']);
  });

  it('returns empty array when no jobs match prefix', async () => {
    const mockClient = {
      fetch: jest.fn().mockResolvedValue({ jobs: [{ name: 'Foo_Job' }, { name: 'Bar_Job' }] }),
    };
    const result = await getAllLibraryJobNames(mockClient, 'Library_');
    expect(result).toEqual([]);
  });

  it('returns empty array when Jenkins returns no jobs key', async () => {
    const mockClient = { fetch: jest.fn().mockResolvedValue({}) };
    const result = await getAllLibraryJobNames(mockClient);
    expect(result).toEqual([]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// INTEGRATION: discoverAndroidBuilds() — real Jenkins actions[] structure
// ─────────────────────────────────────────────────────────────────────────────

describe('discoverAndroidBuilds() — end-to-end with real Jenkins actions[] structure', () => {
  /**
   * Mock using REAL Jenkins API structure:
   *   causes are inside build.actions[].causes[], NOT build.causes[]
   *
   *   Library_Dossier_InfoWindow #564 — triggered by Trigger #87, FAILED, no re-run
   *   Library_CustomApp_Cache    #312 — triggered by Trigger #87, SUCCESS
   *   Library_Maps_Overlay       #201 — triggered by Trigger #87, FAILED
   *                              #202 — manual re-run 30min later, SUCCESS → passedByRerun
   */
  const buildMockClient = () => ({
    fetch: jest.fn().mockImplementation(async (url) => {
      // Root job list
      if (url === '/api/json?tree=jobs[name]') {
        return {
          jobs: [
            { name: 'Library_Dossier_InfoWindow' },
            { name: 'Library_CustomApp_Cache' },
            { name: 'Library_Maps_Overlay' },
          ],
        };
      }

      // Primary build queries (look for upstreamBuild in URL pattern)
      if (url.includes('Library_Dossier_InfoWindow') && url.includes('{0,10}')) {
        return {
          builds: [{
            number: 564, result: 'FAILURE', timestamp: 1708700000000,
            ...withCauses([{ upstreamProject: 'Trigger_Library_Jobs', upstreamBuild: 87 }]),
          }],
        };
      }

      if (url.includes('Library_CustomApp_Cache') && url.includes('{0,10}')) {
        return {
          builds: [{
            number: 312, result: 'SUCCESS', timestamp: 1708700100000,
            ...withCauses([{ upstreamProject: 'Trigger_Library_Jobs', upstreamBuild: 87 }]),
          }],
        };
      }

      if (url.includes('Library_Maps_Overlay') && url.includes('{0,10}')) {
        return {
          builds: [{
            number: 201, result: 'FAILURE', timestamp: 1708700200000,
            ...withCauses([{ upstreamProject: 'Trigger_Library_Jobs', upstreamBuild: 87 }]),
          }],
        };
      }

      // Re-run detection queries ({0,5} in URL)
      if (url.includes('Library_Dossier_InfoWindow') && url.includes('{0,5}')) {
        // No re-run for InfoWindow
        return {
          builds: [{
            number: 564, result: 'FAILURE', timestamp: 1708700000000,
            ...withCauses([{ upstreamProject: 'Trigger_Library_Jobs', upstreamBuild: 87 }]),
          }],
        };
      }

      if (url.includes('Library_Maps_Overlay') && url.includes('{0,5}')) {
        // Manual re-run #202 succeeded 30 min after primary
        return {
          builds: [
            {
              number: 202, result: 'SUCCESS',
              timestamp: 1708700200000 + 30 * 60 * 1000,
              ...withCauses([{ _class: 'hudson.model.Cause$UserIdCause' }]),
            },
            {
              number: 201, result: 'FAILURE', timestamp: 1708700200000,
              ...withCauses([{ upstreamProject: 'Trigger_Library_Jobs', upstreamBuild: 87 }]),
            },
          ],
        };
      }

      return {};
    }),
  });

  it('classifies downstream jobs correctly: passed, failed, passedByRerun', async () => {
    const result = await discoverAndroidBuilds('Trigger_Library_Jobs', 87, buildMockClient());

    expect(result.passed).toHaveLength(1);
    expect(result.passed[0]).toMatchObject({ jobName: 'Library_CustomApp_Cache', buildNum: 312 });

    expect(result.failed).toHaveLength(1);
    expect(result.failed[0]).toMatchObject({ jobName: 'Library_Dossier_InfoWindow', buildNum: 564 });

    expect(result.passedByRerun).toHaveLength(1);
    expect(result.passedByRerun[0]).toMatchObject({
      jobName: 'Library_Maps_Overlay',
      primaryBuildNum: 201,
      rerunBuildNum: 202,
    });

    expect(result.running).toHaveLength(0);
  });

  it('skips Library jobs that did NOT run under the given trigger build', async () => {
    const mockClient = {
      fetch: jest.fn().mockImplementation(async (url) => {
        if (url === '/api/json?tree=jobs[name]') {
          return { jobs: [{ name: 'Library_Dossier_InfoWindow' }] };
        }
        // Build ran under trigger #86, not #87
        if (url.includes('Library_Dossier_InfoWindow')) {
          return {
            builds: [{
              number: 563, result: 'SUCCESS', timestamp: 1708600000000,
              ...withCauses([{ upstreamProject: 'Trigger_Library_Jobs', upstreamBuild: 86 }]),
            }],
          };
        }
        return {};
      }),
    };

    const result = await discoverAndroidBuilds('Trigger_Library_Jobs', 87, mockClient);
    expect(result.passed).toHaveLength(0);
    expect(result.failed).toHaveLength(0);
    expect(result.passedByRerun).toHaveLength(0);
    expect(result.running).toHaveLength(0);
  });
});
