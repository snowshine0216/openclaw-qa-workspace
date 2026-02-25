/**
 * Job Discovery Module for Android Library CI
 * Responsible for finding downstream Library_* jobs for a given Trigger_Library_Jobs run
 * and identifying re-runs of the same jobs within a time window.
 */

/**
 * Get downstream job names from Jenkins API.
 *
 * @deprecated This method is BROKEN for dynamic trigger jobs.
 * Jenkins `downstreamProjects[]` only lists statically-configured downstreams.
 * For Trigger_Library_Jobs, downstream jobs are triggered dynamically via UpstreamCause
 * and will NEVER appear in downstreamProjects[]. Use getAllLibraryJobNames() instead.
 *
 * @param {string} triggerJobName
 * @param {object} jenkinsClient - mockable client
 * @returns {Promise<string[]>}  Always returns [] for dynamic pipelines.
 */
async function getDownstreamJobNames(triggerJobName, jenkinsClient) {
  const rs = await jenkinsClient.fetch(`/job/${triggerJobName}/api/json?tree=downstreamProjects[name]`);
  return rs.downstreamProjects?.map(p => p.name).filter(Boolean) || [];
}

/**
 * [FIX 3] Get all Jenkins job names that start with a given prefix.
 *
 * This replaces the broken getDownstreamJobNames() for dynamic trigger jobs.
 * Instead of querying downstreamProjects (which is always empty for dynamically-
 * triggered pipelines), we fetch the full job list from Jenkins root and filter
 * by the Library_* prefix.
 *
 * @param {object} jenkinsClient - mockable Jenkins client with .fetch(endpoint)
 * @param {string} [prefix='Library_'] - job name prefix to filter by
 * @returns {Promise<string[]>} List of matching job names
 */
async function getAllLibraryJobNames(jenkinsClient, prefix = 'Library_') {
  const rs = await jenkinsClient.fetch('/api/json?tree=jobs[name]');
  const jobs = rs.jobs || [];
  return jobs
    .map(j => j.name)
    .filter(name => name && name.startsWith(prefix));
}

/**
 * Find the primary build triggered by the trigger job.
 *
 * IMPORTANT: Jenkins REST API nests causes inside actions[], NOT directly on the build.
 * build.causes is always undefined — must use build.actions[].causes[] and flatten.
 *
 * @param {string} libraryJobName
 * @param {string} upstreamProject
 * @param {number} upstreamBuildNum
 * @param {object} jenkinsClient
 * @returns {Promise<{buildNum: number, result: string, timestamp: number}|null>}
 */
async function findMatchingBuild(libraryJobName, upstreamProject, upstreamBuildNum, jenkinsClient) {
  // Bug C fix: query via actions[causes[...]] — causes are NESTED under actions in Jenkins API
  const rs = await jenkinsClient.fetch(
    `/job/${libraryJobName}/api/json?tree=builds[number,result,timestamp,actions[_class,causes[upstreamProject,upstreamBuild]]]{0,10}`
  );

  if (!rs.builds) return null;

  for (const build of rs.builds) {
    // Flatten causes from all actions (Jenkins nests them inside CauseAction)
    const causes = (build.actions || []).flatMap(a => a.causes || []);
    const matched = causes.some(
      c => c.upstreamProject === upstreamProject && c.upstreamBuild === upstreamBuildNum
    );
    if (matched) {
      return { buildNum: build.number, result: build.result, timestamp: build.timestamp };
    }
  }
  return null;
}

/**
 * Detect if a re-run occurred after the primary build
 * @param {string} jobName 
 * @param {number} primaryBuildNum 
 * @param {number} primaryTimestamp 
 * @param {string} upstreamProject
 * @param {number} upstreamBuild
 * @param {object} jenkinsClient 
 * @returns {Promise<{buildNum: number, result: string, timestamp: number}|null>}
 */
async function detectRerun(jobName, primaryBuildNum, primaryTimestamp, upstreamProject, upstreamBuild, jenkinsClient) {
  // Bug C fix: same as findMatchingBuild — causes are nested under actions[]
  const rs = await jenkinsClient.fetch(
    `/job/${jobName}/api/json?tree=builds[number,result,timestamp,actions[_class,causes[_class,upstreamProject,upstreamBuild]]]{0,5}`
  );
  if (!rs.builds) return null;

  const RE_RUN_WINDOW_MS = 3 * 60 * 60 * 1000;

  for (const build of rs.builds) {
    if (build.number <= primaryBuildNum) continue;
    if (build.timestamp - primaryTimestamp > RE_RUN_WINDOW_MS) continue;
    if (build.result === null) continue; // still running

    // Flatten causes from all actions
    const causes = (build.actions || []).flatMap(a => a.causes || []);
    const isManualTrigger = causes.some(c => c._class === 'hudson.model.Cause$UserIdCause');
    const isSameUpstream = causes.some(
      c => c.upstreamProject === upstreamProject && c.upstreamBuild === upstreamBuild
    );

    if (isManualTrigger || isSameUpstream) {
      return { buildNum: build.number, result: build.result, timestamp: build.timestamp };
    }
  }
  return null;
}

/**
 * Top level orchestration for job discovery
 * @param {string} triggerJobName 
 * @param {number} triggerBuildNum 
 * @param {object} jenkinsClient 
 */
async function discoverAndroidBuilds(triggerJobName, triggerBuildNum, jenkinsClient) {
  // FIX 3: Use getAllLibraryJobNames() instead of getDownstreamJobNames().
  // getDownstreamJobNames() queries downstreamProjects[] which is always empty for
  // dynamically-triggered pipelines like Trigger_Library_Jobs.
  // getAllLibraryJobNames() scans all Jenkins jobs by the Library_* prefix and then
  // identifies which ones actually ran under this specific trigger build via UpstreamCause.
  const downstreamJobs = await getAllLibraryJobNames(jenkinsClient);

  const passed = [];
  const failed = [];
  const passedByRerun = [];
  const running = [];

  for (const jobName of downstreamJobs) {
    const primaryInfo = await findMatchingBuild(jobName, triggerJobName, triggerBuildNum, jenkinsClient);
    if (!primaryInfo) continue; // no matching build found, maybe skipping?

    if (primaryInfo.result === 'SUCCESS') {
      passed.push({ jobName, buildNum: primaryInfo.buildNum });
    } else if (primaryInfo.result === null) {
      running.push({ jobName, buildNum: primaryInfo.buildNum });
    } else {
      // Failed or unstable
      const rerunInfo = await detectRerun(jobName, primaryInfo.buildNum, primaryInfo.timestamp, triggerJobName, triggerBuildNum, jenkinsClient);
      
      if (rerunInfo && rerunInfo.result === 'SUCCESS') {
        passedByRerun.push({ jobName, primaryBuildNum: primaryInfo.buildNum, rerunBuildNum: rerunInfo.buildNum });
      } else {
        failed.push({
          jobName,
          buildNum: primaryInfo.buildNum,
          rerun: rerunInfo
        });
      }
    }
  }

  return { passed, failed, passedByRerun, running };
}

module.exports = {
  getAllLibraryJobNames,   // FIX 3: new recommended function
  getDownstreamJobNames,  // DEPRECATED: broken for dynamic pipelines, kept for compatibility
  findMatchingBuild,
  detectRerun,
  discoverAndroidBuilds
};
