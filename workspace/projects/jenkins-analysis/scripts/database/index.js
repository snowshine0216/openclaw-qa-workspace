const Database = require('./adapter');
const { initSchema, openDb } = require('./schema');
const {
  insertJobRun,
  enforceFiveRecordLimit,
  insertFailedJob,
  insertFailedStep,
  findLastFailedBuild
} = require('./operations');

module.exports = {
  Database,
  initSchema,
  openDb,
  insertJobRun,
  enforceFiveRecordLimit,
  insertFailedJob,
  insertFailedStep,
  findLastFailedBuild
};
