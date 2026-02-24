/**
 * Job Discovery Module for Android Library CI
 * Responsible for finding downstream Library_* jobs for a given Trigger_Library_Jobs run
 * and identifying re-runs of the same jobs within a time window.
 */

/**
 * Get downstream job names from Jenkins API
 * @param {string} triggerJobName
 * @param {object} jenkinsClient - mockable client
 * @returns {Promise<string[]>}
 */
async function getDownstreamJobNames(triggerJobName, jenkinsClient) {
  const rs = await jenkinsClient.fetch(`/job/${triggerJobName}/api/json?tree=downstreamProjects[name]`);
  return rs.downstreamProjects?.map(p => p.name).filter(Boolean) || [];
}

/**
 * Find the primary build triggered by the trigger job
 * @param {string} libraryJobName 
 * @param {string} upstreamProject 
 * @param {number} upstreamBuildNum 
 * @param {object} jenkinsClient
 * @returns {Promise<{buildNum: number, result: string, timestamp: number}|null>}
 */
async function findMatchingBuild(libraryJobName, upstreamProject, upstreamBuildNum, jenkinsClient) {
  // Fetch recent builds
  const rs = await jenkinsClient.fetch(`/job/${libraryJobName}/api/json?tree=builds[number,result,timestamp,causes[upstreamProject,upstreamBuild]]{0,10}`);
  
  if (!rs.builds) return null;

  for (const build of rs.builds) {
    const causes = build.causes || [];
    const walkCauses = (causesList) => {
      for (const cause of causesList) {
        if (cause.upstreamProject === upstreamProject && cause.upstreamBuild === upstreamBuildNum) {
          return true;
        }
      }
      return false;
    };
    if (walkCauses(causes)) {
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
  const rs = await jenkinsClient.fetch(`/job/${jobName}/api/json?tree=builds[number,result,timestamp,causes[_class,upstreamProject,upstreamBuild]]{0,5}`);
  if (!rs.builds) return null;

  const RE_RUN_WINDOW_MS = 3 * 60 * 60 * 1000;

  for (const build of rs.builds) {
    if (build.number <= primaryBuildNum) continue;
    if (build.timestamp - primaryTimestamp > RE_RUN_WINDOW_MS) continue;
    if (build.result === null) continue; // still running

    const causes = build.causes || [];
    const isManualTrigger = causes.some(c => c._class === 'hudson.model.Cause$UserIdCause');
    const isSameUpstream = causes.some(c => c.upstreamProject === upstreamProject && c.upstreamBuild === upstreamBuild);

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
  const downstreamJobs = await getDownstreamJobNames(triggerJobName, jenkinsClient);
  
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
  getDownstreamJobNames,
  findMatchingBuild,
  detectRerun,
  discoverAndroidBuilds
};
