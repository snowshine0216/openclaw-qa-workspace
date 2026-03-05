#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const JENKINS_URL = process.env.WEB_JENKINS_URL?.replace(/\/$/, "");
const JENKINS_USER = process.env.WEB_JENKINS_USER;
const JENKINS_API_TOKEN = process.env.WEB_JENKINS_API_TOKEN;

if (!JENKINS_URL || !JENKINS_USER || !JENKINS_API_TOKEN) {
  console.error("Missing required environment variables: WEB_JENKINS_URL, WEB_JENKINS_USER, WEB_JENKINS_API_TOKEN");
  process.exit(2);
}

const auth = Buffer.from(`${JENKINS_USER}:${JENKINS_API_TOKEN}`).toString("base64");

const headers = {
  "Authorization": `Basic ${auth}`,
  "Accept": "application/json",
};

async function request(path) {
  const url = `${JENKINS_URL}${path}`;
  const res = await fetch(url, { headers });
  
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText} for ${url}`);
  }
  
  return await res.json();
}

async function getViewJobs(viewName) {
  const data = await request(`/view/${encodeURIComponent(viewName)}/api/json?tree=name,jobs[name,url,color,lastBuild[number,result,timestamp]]`);
  return data.jobs || [];
}

async function getSingleJob(jobName) {
  try {
    const data = await request(`/job/${encodeURIComponent(jobName)}/api/json?tree=name,url,color,lastBuild[number,result,timestamp]`);
    return [data];
  } catch (e) {
    console.error(`Error fetching job ${jobName}:`, e.message);
    return [];
  }
}

async function main() {
  console.log("Collecting Jenkins job information...\n");
  
  const sources = [
    { type: 'view', name: 'ReportEditor' },
    { type: 'view', name: 'SubscriptionWebTest' },
    { type: 'view', name: 'CustomAppWebTest' },
    { type: 'job', name: 'Dashboard_TemplateCreator' }
  ];
  
  const allJobs = {};
  
  for (const source of sources) {
    console.log(`Fetching from ${source.type}: ${source.name}...`);
    let jobs = [];
    
    if (source.type === 'view') {
      jobs = await getViewJobs(source.name);
    } else if (source.type === 'job') {
      jobs = await getSingleJob(source.name);
    }
    
    allJobs[source.name] = jobs;
    console.log(`  Found ${jobs.length} jobs\n`);
  }
  
  // Save raw data
  const outputPath = './jobs_data.json';
  fs.writeFileSync(outputPath, JSON.stringify(allJobs, null, 2));
  console.log(`\nSaved all job data to: ${outputPath}`);
  
  // Generate summary
  let totalJobs = 0;
  let passedJobs = 0;
  let failedJobs = 0;
  let unstableJobs = 0;
  let notBuiltJobs = 0;
  
  const failedJobsList = [];
  const passedJobsList = [];
  
  for (const [sourceName, jobs] of Object.entries(allJobs)) {
    for (const job of jobs) {
      totalJobs++;
      
      if (!job.lastBuild) {
        notBuiltJobs++;
        continue;
      }
      
      const result = job.lastBuild.result;
      const jobInfo = {
        source: sourceName,
        name: job.name,
        buildNumber: job.lastBuild.number,
        result: result,
        timestamp: job.lastBuild.timestamp,
        url: job.url
      };
      
      if (result === 'SUCCESS') {
        passedJobs++;
        passedJobsList.push(jobInfo);
      } else if (result === 'FAILURE') {
        failedJobs++;
        failedJobsList.push(jobInfo);
      } else if (result === 'UNSTABLE') {
        unstableJobs++;
        failedJobsList.push(jobInfo);
      }
    }
  }
  
  console.log("\n=== SUMMARY ===");
  console.log(`Total Jobs: ${totalJobs}`);
  console.log(`Passed: ${passedJobs}`);
  console.log(`Failed: ${failedJobs}`);
  console.log(`Unstable: ${unstableJobs}`);
  console.log(`Not Built: ${notBuiltJobs}`);
  
  // Save failed jobs list for analysis
  fs.writeFileSync('./failed_jobs.json', JSON.stringify(failedJobsList, null, 2));
  fs.writeFileSync('./passed_jobs.json', JSON.stringify(passedJobsList, null, 2));
  
  console.log(`\nFailed jobs list saved to: ./failed_jobs.json`);
  console.log(`Passed jobs list saved to: ./passed_jobs.json`);
  console.log(`\nTotal failed jobs to analyze: ${failedJobsList.length}`);
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
