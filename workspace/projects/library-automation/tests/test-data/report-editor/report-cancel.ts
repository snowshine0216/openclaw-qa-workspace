/**
 * Test data for reportCancel (Phase 2j).
 * Mirrors WDIO constants/report.js: BigReportNoPrompt, BigReportWithPrompt, cancelReportExecutionUser.
 */

export const tutorialProject = {
  id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
  name: 'Tutorial',
};

export const BigReportNoPrompt = {
  id: '37EC2D837540C3CC770998A538B37A99',
  name: 'Report cancel @no prompt',
  project: tutorialProject,
};

export const BigReportWithPrompt = {
  id: '974ED293D2414E85ACAC87B4C011F4FF',
  name: 'Report cancel @prompt',
  project: tutorialProject,
};

export const cancelReportExecutionUser = {
  username: 'cre',
  password: '',
};

export const reportCancelData = {
  BigReportNoPrompt,
  BigReportWithPrompt,
  cancelReportExecutionUser,
};
