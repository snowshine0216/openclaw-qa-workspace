/**
 * Tests for Bug 3: getDownstreamJobNames() always returns []
 * and Fix 3: getAllLibraryJobNames() correctly discovers Library_* jobs
 *
 * Run: npx jest tests/unit/job_discovery_bug3.test.js --verbose
 */
const {
  getDownstreamJobNames,
  getAllLibraryJobNames,
  findMatchingBuild,
  discoverAndroidBuilds,
} = require('../../android/job_discovery');

// ─────────────────────────────────────────────────────────────────────────────
// BUG 3 PROOF: downstreamProjects is always empty for dynamic trigger jobs
// ─────────────────────────────────────────────────────────────────────────────

describe('Bug 3 — getDownstreamJobNames() returns [] for dynamic trigger jobs', () => {
  it('returns empty array when Jenkins reports no downstreamProjects (empty array)', async () => {
    // This is what Jenkins actually returns for Trigger_Library_Jobs because
    // downstream jobs are triggered dynamically via UpstreamCause, not statically configured.
    const mockClient = {
      fetch: jest.fn().mockResolvedValue({
        _class: 'hudson.model.FreeStyleProject',
        name: 'Trigger_Library_Jobs',
        downstreamProjects: [], // ← always [] in practice for dynamic pipelines
      }),
    };

    const result = await getDownstreamJobNames('Trigger_Library_Jobs', mockClient);

    // BUG: returns [] even though 80+ Library jobs actually ran under this trigger
    expect(result).toEqual([]);
    expect(mockClient.fetch).toHaveBeenCalledWith(
      '/job/Trigger_Library_Jobs/api/json?tree=downstreamProjects[name]'
    );
  });

  it('returns empty array when downstreamProjects key is absent entirely', async () => {
    // Happens when jobs are triggered via parameterized pipeline, not static config
    const mockClient = {
      fetch: jest.fn().mockResolvedValue({
        _class: 'hudson.model.FreeStyleProject',
        name: 'Trigger_Library_Jobs',
        // NOTE: no downstreamProjects key at all
      }),
    };

    const result = await getDownstreamJobNames('Trigger_Library_Jobs', mockClient);

    // Result: empty analysis → empty report — this confirms the bug
    expect(result).toEqual([]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// FIX 3: getAllLibraryJobNames() discovers jobs by name prefix scan
// ─────────────────────────────────────────────────────────────────────────────

describe('Fix 3 — getAllLibraryJobNames() discovers Library_* jobs by prefix', () => {
  const mockJenkinsJobList = {
    _class: 'hudson.model.Hudson',
    jobs: [
      { name: 'Library_Dossier_InfoWindow' },
      { name: 'Library_CustomApp_Cache' },
      { name: 'Library_Maps_Overlay' },
      { name: 'Trigger_Library_Jobs' }, // ← must NOT be included
      { name: 'Tanzu_Report_Env_Upgrade' }, // ← must NOT be included
      { name: 'Library_Analytics_Dashboard' },
      { name: 'Global_Config_Job' }, // ← must NOT be included
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
    expect(result).not.toContain('Tanzu_Report_Env_Upgrade');
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

  it('returns empty array when Jenkins returns no jobs key at all', async () => {
    const mockClient = { fetch: jest.fn().mockResolvedValue({}) };

    const result = await getAllLibraryJobNames(mockClient);
    expect(result).toEqual([]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// INTEGRATION: discoverAndroidBuilds() with Fix 3 applied end-to-end
// ─────────────────────────────────────────────────────────────────────────────

describe('discoverAndroidBuilds() with Fix 3 — end-to-end discovery', () => {
  /**
   * Build a mock Jenkins client that simulates:
   *   Library_Dossier_InfoWindow #564 — triggered by Trigger #87, FAILED
   *   Library_CustomApp_Cache    #312 — triggered by Trigger #87, SUCCESS
   *   Library_Maps_Overlay       #201 — triggered by Trigger #87, FAILED, then manually re-run #202 → SUCCESS
   */
  const buildMockClient = () => ({
    fetch: jest.fn().mockImplementation(async (url) => {
      // Root API — full job list
      if (url === '/api/json?tree=jobs[name]') {
        return {
          jobs: [
            { name: 'Library_Dossier_InfoWindow' },
            { name: 'Library_CustomApp_Cache' },
            { name: 'Library_Maps_Overlay' },
          ],
        };
      }

      // Library_Dossier_InfoWindow — primary build match query
      if (
        url.includes('Library_Dossier_InfoWindow') &&
        url.includes('upstreamProject,upstreamBuild]]{0,10}')
      ) {
        return {
          builds: [
            {
              number: 564,
              result: 'FAILURE',
              timestamp: 1708700000000,
              causes: [{ upstreamProject: 'Trigger_Library_Jobs', upstreamBuild: 87 }],
            },
          ],
        };
      }

      // Library_CustomApp_Cache — primary build: SUCCESS
      if (
        url.includes('Library_CustomApp_Cache') &&
        url.includes('upstreamProject,upstreamBuild]]{0,10}')
      ) {
        return {
          builds: [
            {
              number: 312,
              result: 'SUCCESS',
              timestamp: 1708700100000,
              causes: [{ upstreamProject: 'Trigger_Library_Jobs', upstreamBuild: 87 }],
            },
          ],
        };
      }

      // Library_Maps_Overlay — primary build: FAILURE
      if (
        url.includes('Library_Maps_Overlay') &&
        url.includes('upstreamProject,upstreamBuild]]{0,10}')
      ) {
        return {
          builds: [
            {
              number: 201,
              result: 'FAILURE',
              timestamp: 1708700200000,
              causes: [{ upstreamProject: 'Trigger_Library_Jobs', upstreamBuild: 87 }],
            },
          ],
        };
      }

      // Library_Dossier_InfoWindow — re-run detection: no re-run within window
      if (url.includes('Library_Dossier_InfoWindow') && url.includes('_class')) {
        return {
          builds: [
            {
              number: 564,
              result: 'FAILURE',
              timestamp: 1708700000000,
              causes: [{ upstreamProject: 'Trigger_Library_Jobs', upstreamBuild: 87 }],
            },
          ],
        };
      }

      // Library_Maps_Overlay — re-run detection: manual re-run #202 succeeded 30 min later
      if (url.includes('Library_Maps_Overlay') && url.includes('_class')) {
        return {
          builds: [
            {
              number: 202,
              result: 'SUCCESS',
              timestamp: 1708700200000 + 30 * 60 * 1000, // 30 min later
              causes: [{ _class: 'hudson.model.Cause$UserIdCause' }],
            },
            {
              number: 201,
              result: 'FAILURE',
              timestamp: 1708700200000,
              causes: [{ upstreamProject: 'Trigger_Library_Jobs', upstreamBuild: 87 }],
            },
          ],
        };
      }

      return {};
    }),
  });

  it('classifies downstream jobs correctly: passed, failed, passedByRerun', async () => {
    const mockClient = buildMockClient();

    const result = await discoverAndroidBuilds('Trigger_Library_Jobs', 87, mockClient);

    // Library_CustomApp_Cache #312 → passed
    expect(result.passed).toHaveLength(1);
    expect(result.passed[0]).toMatchObject({ jobName: 'Library_CustomApp_Cache', buildNum: 312 });

    // Library_Dossier_InfoWindow #564 → failed
    expect(result.failed).toHaveLength(1);
    expect(result.failed[0]).toMatchObject({
      jobName: 'Library_Dossier_InfoWindow',
      buildNum: 564,
    });

    // Library_Maps_Overlay #201 → passedByRerun (re-run #202 succeeded)
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
        // Build list has no entry with upstreamBuild=87 (it ran under build 86)
        if (url.includes('Library_Dossier_InfoWindow') && url.includes('upstreamProject')) {
          return {
            builds: [
              {
                number: 563,
                result: 'SUCCESS',
                timestamp: 1708600000000,
                causes: [
                  { upstreamProject: 'Trigger_Library_Jobs', upstreamBuild: 86 }, // different trigger
                ],
              },
            ],
          };
        }
        return {};
      }),
    };

    const result = await discoverAndroidBuilds('Trigger_Library_Jobs', 87, mockClient);

    // Job did not run under trigger #87 — must be completely skipped
    expect(result.passed).toHaveLength(0);
    expect(result.failed).toHaveLength(0);
    expect(result.passedByRerun).toHaveLength(0);
    expect(result.running).toHaveLength(0);
  });
});
