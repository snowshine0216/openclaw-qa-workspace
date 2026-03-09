diff --git a/production/src/react/src/components/popup/ActionLinkContainer/index.js b/production/src/react/src/components/popup/ActionLinkContainer/index.js
index f00f5c77939c..e747442c5f09 100644
--- a/production/src/react/src/components/popup/ActionLinkContainer/index.js
+++ b/production/src/react/src/components/popup/ActionLinkContainer/index.js
@@ -29,6 +29,7 @@ import {
     setCurrentReportDataForHomeReset,
     autoSwitchToAccesibleChapter,
 } from '../../dossier/dossierActionCreators.js';
+import { cancelPromptAnswersAndBackToPrompt } from '../../../modules/prompt/promptActionCreators';
 import { republishCube } from '../../dossier/cubeRepublishActionCreators';
 import { bem } from '../../../utils/CssUtils';
 import { buildTeamsLandingPageUrl } from '../../../utils/TeamsUtils';
@@ -37,7 +38,7 @@ import {
     selectCurrentApplicationIdToDisplayInURL,
 } from '../../onboarding/homeOnboarding/homeConfigSelectors';
 import { fetchShortcutGroups } from '../../library/shortcutGroups/actionCreators';
-import { selectCurrentDossier } from '../../dossier/dossierSelectors';
+import { selectCurrentDossier, selectIsReport } from '../../dossier/dossierSelectors';
 import { selectIsHostedInTeams } from '../../navbar/share/shareToTeams/selectors';
 import { selectHostedInTeamsChannel } from '../../navbar/share/shareToTeams/PinToTeamsTabDialog/selectors';
 import { selectMessageBoxCheckboxSelected, selectMessageBoxExtraInfo } from '../MessageBoxContainer/selectors';
@@ -154,6 +155,22 @@ class ActionLinkContainer extends Component {
                     });
                 },
             };
+        } else if (type === ActionLinkTypes.CANCEL_AND_GO_BACK_PROMPT) {
+            handlers = {
+                onClick: (evt) => {
+                    this.handleClick(evt, type, () => {
+                        this.props.cancelPromptAnswersAndBackToPrompt(false, this.props.isReport);
+                    });
+                },
+            };
+        } else if (type === ActionLinkTypes.CANCEL_AND_GO_BACK_REPROMPT) {
+            handlers = {
+                onClick: (evt) => {
+                    this.handleClick(evt, type, () => {
+                        this.props.cancelPromptAnswersAndBackToPrompt(true, this.props.isReport);
+                    });
+                },
+            };
         } else if (type === ActionLinkTypes.OK_AND_FALLBACK) {
             handlers = {
                 onClick: (evt) => {
@@ -442,6 +459,8 @@ ActionLinkContainer.propTypes = {
     deleteInvalidDossier: PropTypes.func,
     onFolderManagementConfirmDeletion: PropTypes.func,
     autoSwitchToAccesibleChapter: PropTypes.func,
+    cancelPromptAnswersAndBackToPrompt: PropTypes.func,
+    isReport: PropTypes.bool,
 };
 
 const mapStateToProps = (state) => {
@@ -453,6 +472,7 @@ const mapStateToProps = (state) => {
         hostedInTeamsChannel: selectHostedInTeamsChannel(state),
         messageBoxCheckboxSelected: selectMessageBoxCheckboxSelected(state),
         extraInfo: selectMessageBoxExtraInfo(state),
+        isReport: selectIsReport(state),
     };
 };
 
@@ -475,4 +495,5 @@ export default connect(mapStateToProps, {
     setCurrentReportDataForHomeReset,
     deleteInvalidDossier,
     autoSwitchToAccesibleChapter,
+    cancelPromptAnswersAndBackToPrompt,
 })(ActionLinkContainer);
diff --git a/production/src/react/src/constants/ActionLinks.js b/production/src/react/src/constants/ActionLinks.js
index ef432ed1655d..f29fa2f11455 100644
--- a/production/src/react/src/constants/ActionLinks.js
+++ b/production/src/react/src/constants/ActionLinks.js
@@ -9,6 +9,8 @@ export const ActionLinkTypes = {
     PASSWORD: 'PASSWORD',
     GO_TO_LIBRARY: 'GO_TO_LIBRARY',
     CANCEL_AND_GO_BACK: 'CANCEL_AND_GO_BACK',
+    CANCEL_AND_GO_BACK_PROMPT: 'CANCEL_AND_GO_BACK_PROMPT',
+    CANCEL_AND_GO_BACK_REPROMPT: 'CANCEL_AND_GO_BACK_REPROMPT',
     OK_AND_GO_BACK: 'OK_AND_GO_BACK',
     OK_AND_GO_TO_LIBRARY: 'OK_AND_GO_TO_LIBRARY',
     OK_AND_GO_TO_LOGIN: 'OK_AND_GO_TO_LOGIN',
@@ -87,6 +89,18 @@ const ActionLinks = {
         className: 'highlight',
         icon: '',
     },
+    [ActionLinkTypes.CANCEL_AND_GO_BACK_PROMPT]: {
+        type: 'CANCEL_AND_GO_BACK_PROMPT',
+        text: formatMessage(174, 'OK'),
+        className: 'highlight',
+        icon: '',
+    },
+    [ActionLinkTypes.CANCEL_AND_GO_BACK_REPROMPT]: {
+        type: 'CANCEL_AND_GO_BACK_REPROMPT',
+        text: formatMessage(174, 'OK'),
+        className: 'highlight',
+        icon: '',
+    },
     [ActionLinkTypes.OK_AND_GO_BACK]: {
         type: 'OK_AND_GO_BACK',
         text: formatMessage(174, 'OK'),
diff --git a/production/src/react/src/modules/prompt/promptActionCreators.js b/production/src/react/src/modules/prompt/promptActionCreators.js
index 110c9f934e01..8a841f7dc3a7 100644
--- a/production/src/react/src/modules/prompt/promptActionCreators.js
+++ b/production/src/react/src/modules/prompt/promptActionCreators.js
@@ -529,6 +529,12 @@ export function applyPromptAnswers(promptAnswers, pollingOnly = false) {
                     return;
                 }
 
+                // Set report authoring specific error info
+                if (selectIsReport(getState())) {
+                    error.applyReportPromptAnswersFailure = true;
+                    error.isReprompt = selectIsReprompt(getState());
+                }
+
                 // To display error
                 dispatch(setErrorObject(error));
 
diff --git a/production/src/react/src/server/ServerAPIErrorCodes.js b/production/src/react/src/server/ServerAPIErrorCodes.js
index 4216be17afc7..139f0c86bfe3 100644
--- a/production/src/react/src/server/ServerAPIErrorCodes.js
+++ b/production/src/react/src/server/ServerAPIErrorCodes.js
@@ -170,6 +170,9 @@ const ServerAPIErrorCodes = {
 
     SEC_E_TARGET_CHAPTER_INACCESSIBLE: 0x8004fc1a, // -2147156966
 
+    // Report Errors
+    DFC_QRYENG_RES_TRUNC: 0x80043e90, // -2147205488
+
     // Snaphot error
     ERR_INBOX_FULL: 0x8004393b, // -2147206853
 
diff --git a/production/src/react/src/services/transforms/ErrorObjectTransform.js b/production/src/react/src/services/transforms/ErrorObjectTransform.js
index ecab2f612cb3..b58b6a1e6d22 100644
--- a/production/src/react/src/services/transforms/ErrorObjectTransform.js
+++ b/production/src/react/src/services/transforms/ErrorObjectTransform.js
@@ -111,6 +111,30 @@ export function transformErrorObject(errorObject) {
                     error.desc = IntlUtils.formatMessage(517, 'Your request has timed out.');
                     error.icon = `server`;
                     error.actions = [ActionLinks.OK_AND_GO_BACK];
+                } else if (
+                    iserverErrorCode === ServerAPIErrorCodes.MSI_DocumentDataPreparationTask_ReportIncomplete &&
+                    error.applyReportPromptAnswersFailure
+                ) {
+                    error.title = svrErr;
+                    error.desc = IntlUtils.formatMessage(6665, 'One or more datasets failed to load.');
+                    error.icon = 'server';
+
+                    let maximumRowsErrorErrors = [];
+                    if (Array.isArray(error.subErrors)) {
+                        maximumRowsErrorErrors = error.subErrors.filter(
+                            (err) =>
+                                ServerAPIErrorCodes.toHex(err.iServerCode) === ServerAPIErrorCodes.DFC_QRYENG_RES_TRUNC
+                        );
+                    }
+                    const hasMaximumRowsError = maximumRowsErrorErrors.length > 0;
+                    // For prompt answer request failure with hasMaximumRowsError, set back button in error popup
+                    if (hasMaximumRowsError) {
+                        error.actions = error.isReprompt
+                            ? [ActionLinks.CANCEL_AND_GO_BACK_REPROMPT]
+                            : [ActionLinks.CANCEL_AND_GO_BACK_PROMPT];
+                    } else {
+                        error.actions = [ActionLinks.OK_AND_GO_BACK, ActionLinks.EMAIL];
+                    }
                 } else if (
                     iserverErrorCode === ServerAPIErrorCodes.MSI_DocumentDataPreparationTask_ReportIncomplete ||
                     // DE251725,DE248748: select datasets/reports not published, don't show the publish cube button
@@ -119,7 +143,7 @@ export function transformErrorObject(errorObject) {
                     iserverErrorCode === ServerAPIErrorCodes.MSI_CUBE_OFFLINE
                 ) {
                     error.title = svrErr;
-                    error.desc = IntlUtils.formatMessage(1390, 'One or more datasets are not loaded for this item.');
+                    error.desc = IntlUtils.formatMessage(6665, 'One or more datasets failed to load.');
                     error.icon = 'server';
 
                     let unpublishedCubeErrors = [];
@@ -558,7 +582,21 @@ export function transformErrorObject(errorObject) {
                 error.title = svrErr;
                 error.desc = IntlUtils.formatMessage(567, 'Sorry, an error has occurred.');
                 error.icon = 'server';
-                error.actions = [ActionLinks.OK_AND_GO_BACK, ActionLinks.EMAIL];
+
+                let maximumRowsErrorErrors = [];
+                if (Array.isArray(error.subErrors)) {
+                    maximumRowsErrorErrors = error.subErrors.filter(
+                        (err) => ServerAPIErrorCodes.toHex(err.iServerCode) === ServerAPIErrorCodes.DFC_QRYENG_RES_TRUNC
+                    );
+                }
+                const hasMaximumRowsError = maximumRowsErrorErrors.length > 0;
+                if (error.applyReportPromptAnswersFailure && hasMaximumRowsError) {
+                    error.actions = error.isReprompt
+                        ? [ActionLinks.CANCEL_AND_GO_BACK_REPROMPT]
+                        : [ActionLinks.CANCEL_AND_GO_BACK_PROMPT];
+                } else {
+                    error.actions = [ActionLinks.OK_AND_GO_BACK, ActionLinks.EMAIL];
+                }
                 break;
             default:
                 error.title = error.title || svrErr;
diff --git a/production/src/react/src/services/transforms/__tests__/ErrorObjectTransform.test.js b/production/src/react/src/services/transforms/__tests__/ErrorObjectTransform.test.js
index 81ce43d55297..4e15322100b3 100644
--- a/production/src/react/src/services/transforms/__tests__/ErrorObjectTransform.test.js
+++ b/production/src/react/src/services/transforms/__tests__/ErrorObjectTransform.test.js
@@ -79,4 +79,71 @@ describe('Error Object Transform', () => {
         expect(transformedError.icon).toBe('app');
         expect(transformedError.actions).toEqual([ActionLinks.OK_AND_GO_BACK, ActionLinks.EMAIL]);
     });
+
+    describe('ERR_APPLICATION with MSI_DocumentDataPreparationTask_ReportIncomplete and applyReportPromptAnswersFailure', () => {
+        it('should show OK_AND_GO_BACK and EMAIL when applyReportPromptAnswersFailure is true but no maximumRowsError in subErrors', () => {
+            const error = {
+                errorCode: API_ERROR_CODE_MAP.ERR_APPLICATION,
+                iServerErrorCode: ServerAPIErrorCodes.MSI_DocumentDataPreparationTask_ReportIncomplete,
+                statusCode: 500,
+                applyReportPromptAnswersFailure: true,
+                subErrors: [],
+            };
+            const transformedError = transformErrorObject(error);
+            expect(transformedError.title).toBe('Server Error');
+            expect(transformedError.desc).toBe('One or more datasets failed to load.');
+            expect(transformedError.icon).toBe('server');
+            expect(transformedError.actions).toEqual([ActionLinks.OK_AND_GO_BACK, ActionLinks.EMAIL]);
+        });
+
+        it('should show CANCEL_AND_GO_BACK_PROMPT when hasMaximumRowsError and isReprompt is false', () => {
+            const error = {
+                errorCode: API_ERROR_CODE_MAP.ERR_APPLICATION,
+                iServerErrorCode: ServerAPIErrorCodes.MSI_DocumentDataPreparationTask_ReportIncomplete,
+                statusCode: 500,
+                applyReportPromptAnswersFailure: true,
+                subErrors: [
+                    { iServerCode: ServerAPIErrorCodes.hexToSignedInt32(ServerAPIErrorCodes.DFC_QRYENG_RES_TRUNC) },
+                ],
+                isReprompt: false,
+            };
+            const transformedError = transformErrorObject(error);
+            expect(transformedError.title).toBe('Server Error');
+            expect(transformedError.desc).toBe('One or more datasets failed to load.');
+            expect(transformedError.icon).toBe('server');
+            expect(transformedError.actions).toEqual([ActionLinks.CANCEL_AND_GO_BACK_PROMPT]);
+        });
+
+        it('should show CANCEL_AND_GO_BACK_REPROMPT when hasMaximumRowsError and isReprompt is true', () => {
+            const error = {
+                errorCode: API_ERROR_CODE_MAP.ERR_APPLICATION,
+                iServerErrorCode: ServerAPIErrorCodes.MSI_DocumentDataPreparationTask_ReportIncomplete,
+                statusCode: 500,
+                applyReportPromptAnswersFailure: true,
+                subErrors: [
+                    { iServerCode: ServerAPIErrorCodes.hexToSignedInt32(ServerAPIErrorCodes.DFC_QRYENG_RES_TRUNC) },
+                ],
+                isReprompt: true,
+            };
+            const transformedError = transformErrorObject(error);
+            expect(transformedError.title).toBe('Server Error');
+            expect(transformedError.desc).toBe('One or more datasets failed to load.');
+            expect(transformedError.icon).toBe('server');
+            expect(transformedError.actions).toEqual([ActionLinks.CANCEL_AND_GO_BACK_REPROMPT]);
+        });
+
+        it('should show OK_AND_GO_BACK and EMAIL when applyReportPromptAnswersFailure is true and subErrors is not an array', () => {
+            const error = {
+                errorCode: API_ERROR_CODE_MAP.ERR_APPLICATION,
+                iServerErrorCode: ServerAPIErrorCodes.MSI_DocumentDataPreparationTask_ReportIncomplete,
+                statusCode: 500,
+                applyReportPromptAnswersFailure: true,
+            };
+            const transformedError = transformErrorObject(error);
+            expect(transformedError.title).toBe('Server Error');
+            expect(transformedError.desc).toBe('One or more datasets failed to load.');
+            expect(transformedError.icon).toBe('server');
+            expect(transformedError.actions).toEqual([ActionLinks.OK_AND_GO_BACK, ActionLinks.EMAIL]);
+        });
+    });
 });
