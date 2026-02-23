#!/usr/bin/env node
/**
 * Historical Failure Checker
 * Checks if a job failed in previous builds (max 5 builds back)
 */

const { execSync } = require('child_process');

const [,, jobName, currentBuildNumber, jenkinsUrl, jenkinsUser, jenkinsToken] = process.argv;

if (!jobName || !currentBuildNumber || !jenkinsUrl || !jenkinsUser || !jenkinsToken) {
  console.error('Usage: node check_previous_failures.js <jobName> <buildNumber> <jenkinsUrl> <user> <token>');
  process.exit(1);
}

async function checkPreviousBuilds() {
  try {
    const currentBuild = parseInt(currentBuildNumber);
    const previousFailures = [];
    
    // Check up to 5 previous builds
    for (let i = 1; i <= 5; i++) {
      const buildNum = currentBuild - i;
      if (buildNum < 1) break;
      
      try {
        // Fetch build info
        const cmd = `curl -s -u "${jenkinsUser}:${jenkinsToken}" "${jenkinsUrl}/job/${jobName}/${buildNum}/api/json?tree=number,result"`;
        const output = execSync(cmd, { encoding: 'utf8' });
        const buildInfo = JSON.parse(output);
        
        if (buildInfo.result === 'FAILURE' || buildInfo.result === 'UNSTABLE') {
          previousFailures.push(buildNum);
        }
      } catch (error) {
        // Build might not exist, continue
        continue;
      }
    }
    
    return {
      jobName,
      currentBuild: currentBuild,
      previousFailures,
      failureCount: previousFailures.length,
      lastFailedBuild: previousFailures.length > 0 ? previousFailures[0] : null,
      isRecurring: previousFailures.length > 0,
      consecutiveFailures: countConsecutiveFailures(currentBuild, previousFailures),
    };
    
  } catch (error) {
    console.error(`Error checking previous builds: ${error.message}`);
    return {
      jobName,
      currentBuild: parseInt(currentBuildNumber),
      previousFailures: [],
      failureCount: 0,
      lastFailedBuild: null,
      isRecurring: false,
      consecutiveFailures: 0,
      error: error.message,
    };
  }
}

/**
 * Count how many consecutive failures (from current build backwards)
 */
function countConsecutiveFailures(currentBuild, failures) {
  let count = 1; // Current build is a failure
  
  for (let i = 1; i <= failures.length; i++) {
    if (failures.includes(currentBuild - i)) {
      count++;
    } else {
      break;
    }
  }
  
  return count;
}

// Run check and output JSON
checkPreviousBuilds().then(result => {
  console.log(JSON.stringify(result, null, 2));
}).catch(error => {
  console.error(JSON.stringify({
    error: error.message,
    jobName,
    currentBuild: parseInt(currentBuildNumber),
  }, null, 2));
  process.exit(1);
});
