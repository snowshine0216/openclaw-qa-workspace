From 746cd6a884f9045ed6e832985f32ebee4878ba21 Mon Sep 17 00:00:00 2001
From: yuanli <yuanli@microstrategy.com>
Date: Thu, 29 Jan 2026 18:11:01 +0800
Subject: [PATCH 01/11] reCreateReportInstance 1-7

---
 .../document-view/document-view.tsx           |  32 +-
 .../recreate-error-catcher/index.scss         |  99 ++++++
 .../recreate-error-catcher.tsx                | 304 +++++++++++++++++
 .../recreate-report-error.ts                  | 307 ++++++++++++++++++
 .../report-editor/report-editor.tsx           |   1 +
 production/src/mstr/types.ts                  |   1 +
 .../store/doc-view-slice/doc-view-slice.ts    |  56 +++-
 production/src/store/types.ts                 |   1 +
 production/src/store/ui-slice/ui-selector.ts  |   1 +
 production/src/store/ui-slice/ui-slice.ts     |   5 +
 production/src/utils/undo-redo-util.ts        |   7 +
 11 files changed, 809 insertions(+), 5 deletions(-)
 create mode 100644 production/src/components/recreate-error-catcher/index.scss
 create mode 100644 production/src/components/recreate-error-catcher/recreate-error-catcher.tsx
 create mode 100644 production/src/components/recreate-error-catcher/recreate-report-error.ts

diff --git a/production/src/components/document-view/document-view.tsx b/production/src/components/document-view/document-view.tsx
index bb2c79f2d..c50714267 100644
--- a/production/src/components/document-view/document-view.tsx
+++ b/production/src/components/document-view/document-view.tsx
@@ -1,8 +1,9 @@
-import React, { FC, useEffect, useRef, useContext, useMemo } from 'react'
+import React, { FC, useEffect, useRef, useContext, useCallback } from 'react'
 import { batch, useDispatch, useSelector } from 'react-redux'
 import { SplashScreen } from '@mstr/rc'
 import { useTranslation } from 'react-i18next'
 import { DEFAULT_LANG, LANGUAGE_CODE } from '../../locale/locale'
+import ReCreateErrorCatcher from '../recreate-error-catcher/recreate-error-catcher'
 
 import {
   updateContextMenuObject,
@@ -14,7 +15,9 @@ import {
   updateShouldRenderAdvSortEditor,
   updateSelectedAttrForms,
   updatePauseMode,
-  updatePauseModeBeforePrompt
+  updatePauseModeBeforePrompt,
+  updateReCreateErrorState,
+  updateIsInitialDataLoaded
 } from '../../store/ui-slice/ui-slice'
 import {
   loadAppConfig,
@@ -67,6 +70,7 @@ import type {
   DossierDataDefinition,
   FontPickerDefinition
 } from '../../types'
+import type { Service } from '../../service/types'
 import { DrillPathObject, AdvSortOptionsObject } from '../../store'
 import { EnumDeploymentFeatures } from '../../mstr/mstr-features'
 import { getCancelStateId } from '../../utils/undo-redo-util'
@@ -76,6 +80,7 @@ import {
   selectIsReportTemplateEmpty,
   selectSourceType
 } from '../../store/report-def-slice/report-def-selector'
+import { ReportError } from '../recreate-error-catcher/recreate-report-error'
 
 export interface DocumentViewProps {
   width: number
@@ -90,6 +95,7 @@ export interface DocumentViewProps {
   fontPickerDefinition?: FontPickerDefinition
   onFontsLoaded?: () => void
   editWithData?: boolean // whether to edit with data or not, default to false
+  service: Service
 }
 
 const DOM_ID = 'mojo-report'
@@ -107,7 +113,8 @@ const DocumentView: FC<DocumentViewProps> = props => {
     deployFeatures,
     fontPickerDefinition,
     onFontsLoaded,
-    editWithData
+    editWithData,
+    service
   } = props
   const dispatch = useDispatch()
   const docViewRef = useRef<MojoDocView | null>(null)
@@ -387,6 +394,24 @@ const DocumentView: FC<DocumentViewProps> = props => {
     }
   }, [isMstrAppStarted, isViewTemplateDirty, isPauseMode, consumptionMode, dispatch])
 
+  const reCreateErrorHandler = useCallback(
+    async (error?: Error) => {
+      dispatch(updateReCreateErrorState(null))
+      if (error) {
+        const reportError = error as ReportError
+        if (reportError && reportError.restartApp) {
+          // Reset the app state
+          batch(() => {
+            dispatch(updateIsInitialDataLoaded(false))
+            dispatch(updateIsMstrAppStarted(false))
+          })
+        }
+      }
+      return Promise.resolve(true)
+    },
+    [dispatch]
+  )
+
   // wrap component w/ an outer div to avoid react error about unable to execute
   // 'removeChild' on 'Node' when toggling between sql and doc view
   // b/c placeholder div gets replaced when rendering doc view
@@ -395,6 +420,7 @@ const DocumentView: FC<DocumentViewProps> = props => {
       {!isMstrAppStarted && appHost !== ReportEditorHost.LibraryAuthoring ? <SplashScreen /> : null}
       <div className={className}>
         <div id={DOM_ID} />
+        {!isConsumptionMode && (<ReCreateErrorCatcher service={service} handleError={reCreateErrorHandler}/>)}
       </div>
     </>
   )
diff --git a/production/src/components/recreate-error-catcher/index.scss b/production/src/components/recreate-error-catcher/index.scss
new file mode 100644
index 000000000..c1e4833e2
--- /dev/null
+++ b/production/src/components/recreate-error-catcher/index.scss
@@ -0,0 +1,99 @@
+@import 'antd/es/form/style/index.css';
+@import 'antd/es/button/style/index.css';
+
+.report-error-popup {
+  .report-error-popup-content {
+    display: flex;
+    flex-direction: row;
+
+    .report-error-icon {
+      width: 46px;
+      height: 58px;
+      margin-right: 24px;
+      background: url('./assets/images/report_alert.svg') no-repeat 0 0;
+    }
+
+    .report-error-text {
+      flex: 1;
+      overflow: hidden;
+    }
+
+    .report-error-message,
+    .report-error-heading {
+      line-height: 1.5em;
+    }
+
+    .report-error-heading {
+      font-weight: bold;
+      margin-bottom: 1rem;
+    }
+
+    .report-error-details {
+      margin-top: 1rem;
+
+      button {
+        background: none;
+        border: none;
+        padding: 0;
+        color: #1471d5;
+        font-weight: bold;
+      }
+
+      > div {
+        display: none;
+        user-select: text;
+        margin-top: 4px;
+        margin-bottom: 0;
+        padding: 2px 4px;
+        padding-bottom: 8px;
+        line-height: 1.1em;
+        // TODO: Official UI/UX max-height
+        max-height: 100px;
+        overflow-y: auto;
+
+        &.visible {
+          display: block;
+        }
+      }
+    }
+
+    // TODO: Proper UI/UX for this
+    .report-error-login-form {
+      margin-top: 0.75rem;
+      padding: 6px;
+
+      .ant-form-item {
+        margin-bottom: 1rem;
+      }
+
+      .ant-form-vertical .ant-form-item-label {
+        padding-bottom: 4px;
+      }
+
+      label {
+        font-size: 1rem;
+        font-weight: bold;
+      }
+
+      .ant-form-item-explain-error {
+        font-size: 1rem;
+      }
+
+      .login-form-footer {
+        margin-top: 2rem;
+
+        .ant-form-item-control-input-content {
+          display: flex;
+          justify-content: flex-end;
+          gap: 1rem;
+        }
+      }
+    }
+  }
+
+  .report-error-footer {
+    display: flex;
+    justify-content: flex-end;
+    gap: 1rem;
+  }
+}
diff --git a/production/src/components/recreate-error-catcher/recreate-error-catcher.tsx b/production/src/components/recreate-error-catcher/recreate-error-catcher.tsx
new file mode 100644
index 000000000..8dcb6af1c
--- /dev/null
+++ b/production/src/components/recreate-error-catcher/recreate-error-catcher.tsx
@@ -0,0 +1,304 @@
+import { Dialog, Input } from '@mstr/rc'
+import Form from 'antd/es/form'
+import Button from 'antd/es/button/button'
+import React, { Component, FC, ReactNode } from 'react'
+import { connect } from 'react-redux'
+import { TFunction, withTranslation } from 'react-i18next'
+import { ConvertError, ErrorSeverity, ErrorType, ReportError, ReportErrorAll } from './recreate-report-error'
+import type { Service } from '../../service'
+import type { MojoMstrApp } from '../../mstr/types'
+import type { ReportEditorState } from '../../store/types'
+import { selectReCreateErrorState } from '../../store/ui-slice/ui-selector'
+
+declare const mstrApp: any
+
+interface Props {
+  children?: ReactNode
+  service: Service
+  t: TFunction<'translation', undefined>
+  handleError: (error?: Error) => Promise<boolean>
+  errorState?: Error | null
+  onErrorExternal?: (error: ReportErrorAll) => boolean
+}
+
+interface State {
+  isOpen: boolean
+  isDetailsCollapsed: boolean
+  reportError?: ReportError
+}
+
+const SeverityClasses: { [key: number]: string } = {
+  [ErrorSeverity.INFO]: 'severity-info',
+  [ErrorSeverity.WARNING]: 'severity-warning',
+  [ErrorSeverity.ERROR]: 'severity-error',
+  [ErrorSeverity.CRITICAL]: 'severity-critical'
+}
+
+interface LoginFormProps {
+  service: Service
+  t: TFunction<'translation', undefined>
+  onLoginCancel: () => void
+  onLoginSuccess: () => void
+}
+
+const LoginForm: FC<LoginFormProps> = ({ service, t, onLoginCancel, onLoginSuccess }) => {
+  const [form] = Form.useForm()
+
+  const onLogin = async () => {
+    const values = (await form.validateFields()) as { username: string; password: string }
+    await service.login(values.username, values.password || '')
+    onLoginSuccess()
+  }
+
+  return (
+    <Form form={form} name='login-form' layout='vertical' component='div'>
+      <Form.Item name='username' label={t('Username')} rules={[{ required: true }]}>
+        <Input size='small' />
+      </Form.Item>
+      <Form.Item name='password' label={t('Password')}>
+        <Input type='password' size='small' />
+      </Form.Item>
+
+      <Form.Item className='login-form-footer'>
+        <Button type='default' onClick={onLoginCancel}>
+          {t('Cancel')}
+        </Button>
+
+        <Button type='primary' onClick={onLogin}>
+          {t('Login')}
+        </Button>
+      </Form.Item>
+    </Form>
+  )
+}
+
+const isReportError = (error: Error): error is ReportError => {
+  return (error as ReportError)?.type !== undefined
+}
+
+const generateNextErrorState = (
+  errorState?: Error | null,
+  onErrorExternal = (error: ReportErrorAll) => false,
+  t: TFunction<'translation', undefined> = msg => msg
+) => {
+  let reportError: ReportError | undefined = errorState as ReportError
+  if (!isReportError(reportError) && errorState) {
+    reportError = ConvertError(errorState)
+  }
+
+  let isOpen = !!reportError
+  // Only handle error in external when report editor pops up error dialog
+  if (isOpen && onErrorExternal) {
+    isOpen = !onErrorExternal({
+      ...errorState,
+      ...reportError,
+      title: t(reportError?.title ?? ''),
+      heading: t(reportError?.heading ?? ''),
+      message: reportError?.message ? t(reportError.message) : errorState?.message
+    } as ReportErrorAll)
+  }
+  return { isOpen, reportError }
+}
+
+// Error Boundaries are only supported in class components,
+// there is no functional component hook.
+class ReCreateErrorCatcher extends Component<Props, State> {
+  static getDerivedStateFromProps(nextProps: Readonly<Props>, prevState: State) {
+    const { errorState, onErrorExternal, t } = nextProps
+
+    const hasReportError = isReportError(errorState as ReportError)
+    if (hasReportError || errorState) {
+      const newState = generateNextErrorState(errorState, onErrorExternal, t)
+      return { ...newState }
+    }
+
+    return prevState
+  }
+
+  static getDerivedStateFromError(error: Error): State {
+    const newState = generateNextErrorState(error)
+    return { ...newState, isDetailsCollapsed: true }
+  }
+
+  constructor(props: Props) {
+    super(props)
+
+    const { errorState } = props
+    if (errorState) {
+      const reportError = errorState as ReportError
+      this.state = { isOpen: !!reportError, isDetailsCollapsed: true, reportError }
+    } else {
+      this.state = {
+        isOpen: false,
+        isDetailsCollapsed: true,
+        reportError: undefined
+      }
+    }
+  }
+
+  componentDidUpdate() {
+    const { reportError } = this.state
+
+    if (reportError) {
+      // Prevent the mojo loading indicator from getting "stuck"
+      // since it prevents all click actions from going through.
+      // If we're rendering this dialog, we should already be
+      // past the point where mojo has failed and needs to be
+      // dismissed, thus its safe to just handle it here.
+
+      /* eslint-disable */
+      setTimeout(() => {
+        const mstrApp = window?.mstrApp as MojoMstrApp
+        if (mstrApp?.hideWait) {
+          mstrApp.hideWait(true)
+        }
+      }, 0)
+      /* eslint-enable */
+    }
+  }
+
+  getPopupJSX() {
+    const { service, t: tt, handleError } = this.props
+    const { isOpen, isDetailsCollapsed, reportError } = this.state
+    // TODO: Remove this when strings are added to DB
+    const t = (s: string): string => tt(s) || s
+
+    if (!reportError || reportError.swallow) {
+      return null
+    }
+
+    const root = document.querySelector('.report-wrapper')
+    const onOk = async () => {
+      // If handleError returns true, we should dismiss the error
+      const doClose = await handleError(reportError)
+      if (doClose) {
+        this.setState({
+          isOpen: false,
+          reportError: undefined
+        })
+      }
+    }
+
+    const {
+      type: errorType,
+      severity: errorSeverity,
+      title: errorTitle,
+      message: errorMessage,
+      heading: errorHeading,
+      details: errorDetails
+    } = reportError
+
+    const onClick = () => {
+      this.setState({ isDetailsCollapsed: !isDetailsCollapsed })
+    }
+
+    let popupContent: JSX.Element
+    let footerContent: JSX.Element | null = (
+      <div className='report-error-footer'>
+        <Button type='primary' onClick={onOk}>
+          {t('OK')}
+        </Button>
+      </div>
+    )
+
+    if (errorType === ErrorType.LOGIN || errorType === ErrorType.AUTHENTICATION) {
+      popupContent = (
+        <div className='report-error-popup-content'>
+          {errorHeading && <div className='report-error-heading'>{t(errorHeading)}</div>}
+          <div className='report-error-message'>{t(errorMessage)}</div>
+          <div className='report-error-login-form'>
+            <LoginForm service={service} t={t} onLoginCancel={onOk} onLoginSuccess={onOk} />
+          </div>
+        </div>
+      )
+
+      footerContent = null
+    } else if (errorDetails) {
+      popupContent = (
+        <div className='report-error-popup-content'>
+          <div className='report-error-icon' />
+          <div className='report-error-text'>
+            {errorHeading && <div className='report-error-heading'>{t(errorHeading)}</div>}
+            <div className='report-error-message'>{t(errorMessage)}</div>
+            <div className='report-error-details'>
+              <button type='button' onClick={onClick}>
+                {t('showDetails')}
+              </button>
+
+              <div className={`${isDetailsCollapsed ? '' : 'visible'}`}>{errorDetails}</div>
+            </div>
+          </div>
+        </div>
+      )
+    } else {
+      popupContent = (
+        <div className='report-error-popup-content'>
+          <div className='report-error-icon' />
+          <div className='report-error-text'>
+            {errorHeading && <div className='report-error-heading'>{t(errorHeading)}</div>}
+            <div className='report-error-message'>{t(errorMessage)}</div>
+          </div>
+        </div>
+      )
+    }
+
+    return (
+      <Dialog
+        className={`report-error-popup ${SeverityClasses[errorSeverity]}`}
+        appElement={root}
+        isOpen={isOpen}
+        title={t(errorTitle)}
+        content={popupContent}
+        footer={footerContent}
+      />
+    )
+  }
+
+  render() {
+    const { children } = this.props
+    const { reportError } = this.state
+
+    if (reportError) {
+      let renderChildren = true
+
+      const { severity: errorSeverity } = reportError
+      switch (errorSeverity) {
+        // React errors, shouldn't render children or the error
+        // state will just loop infinitely
+        case ErrorSeverity.CRITICAL:
+          renderChildren = false
+          break
+
+        // If we can't determine the severity at all, something
+        // went wrong when creating the ReportError object. For
+        // safety (e.g. make sure the entire report doesn't crash)
+        // we should hide the children.
+        case undefined:
+          renderChildren = false
+          break
+
+        default:
+          renderChildren = true
+          break
+      }
+
+      const PopupJSX = this.getPopupJSX()
+
+      return (
+        <div className='error-wrapper'>
+          {renderChildren ? children : null}
+
+          {PopupJSX}
+        </div>
+      )
+    }
+
+    return children
+  }
+}
+
+const mapStateToProps = (state: ReportEditorState) => ({
+  errorState: selectReCreateErrorState(state)
+})
+export default connect(mapStateToProps)(withTranslation()(ReCreateErrorCatcher))
+
diff --git a/production/src/components/recreate-error-catcher/recreate-report-error.ts b/production/src/components/recreate-error-catcher/recreate-report-error.ts
new file mode 100644
index 000000000..2d1762a2f
--- /dev/null
+++ b/production/src/components/recreate-error-catcher/recreate-report-error.ts
@@ -0,0 +1,307 @@
+// eslint-disable-next-line import/prefer-default-export
+export enum ErrorType {
+  UNKNOWN,
+
+  // Server errors
+  LOGIN,
+  APPLICATION,
+  AUTHENTICATION,
+  RESOURCE_NOT_FOUND,
+  MSG_RESULT_NOT_READY,
+
+  // Analytical engine errors
+  ENGINE_ERROR,
+
+  // Javascript errors
+  TYPE_ERROR,
+
+  // A ReferenceError means we tried to access a variable
+  // in a React component that doesn't exist. This will
+  // cause the component to detach, which can effectively
+  // halt the entire application.
+  REFERENCE
+}
+
+export enum AnalyticalEngineErrorType {
+  UNKNOWN,
+
+  REPORT_TYPE,
+  DUPLICATE,
+
+  ACTION_FAILED
+}
+
+export enum ErrorSeverity {
+  INFO,
+  WARNING,
+  ERROR,
+  CRITICAL
+}
+
+export interface IReportError extends Error {
+  type: ErrorType
+  severity: ErrorSeverity
+  restartApp?: boolean
+  title: string
+  heading?: string
+  details?: string
+  swallow: boolean
+}
+
+export interface ServerSubError {
+  iServerCode: number
+  message: string
+  ticketId?: string
+}
+
+export interface ServerError extends Error {
+  code: string
+  message: string
+  subErrors?: ServerSubError[]
+  iServerCode?: string | number
+  ticketId?: string
+  statusCode?: number
+  statusMsg?: string
+}
+
+export interface AnalyticalEngineError {
+  errors: { code: string; message: string }[]
+}
+
+export interface ReportErrorAll extends IReportError, ServerError {}
+
+const ErrorNameToType: { [key: string]: ErrorType } = {
+  TypeError: ErrorType.TYPE_ERROR,
+
+  ReferenceError: ErrorType.REFERENCE
+}
+
+const ErrorCodeToType: { [key: string]: ErrorType } = {
+  ERR001: ErrorType.APPLICATION,
+  ERR003: ErrorType.AUTHENTICATION,
+  ERR004: ErrorType.RESOURCE_NOT_FOUND,
+  ERR008: ErrorType.MSG_RESULT_NOT_READY
+}
+
+const AnalyticalEngineCodeToType: { [key: string]: AnalyticalEngineErrorType } = {
+  '8004da08': AnalyticalEngineErrorType.REPORT_TYPE,
+  '8004da0b': AnalyticalEngineErrorType.REPORT_TYPE,
+
+  '8004da03': AnalyticalEngineErrorType.DUPLICATE,
+
+  '8004da22': AnalyticalEngineErrorType.ACTION_FAILED,
+  '8004da65': AnalyticalEngineErrorType.ACTION_FAILED
+}
+
+const IServerUnsupportedCodeType: { [key: string]: string } = {
+  '-2147212800': 'hierarchies'
+}
+
+const IServerIgnoreCodeType: string[] = [
+  '-2147205027' // "Date or time values required."
+]
+
+const ExceedRowsErrorCode = -2147205488
+
+export class ReportError extends Error implements IReportError {
+  type: ErrorType = ErrorType.UNKNOWN
+
+  severity: ErrorSeverity = ErrorSeverity.ERROR
+
+  restartApp?: boolean = false
+
+  title = ''
+
+  heading?: string = undefined
+
+  details?: string = undefined
+
+  swallow = false
+
+  constructor(
+    type: ErrorType,
+    severity: ErrorSeverity,
+    title: string,
+    message: string,
+    heading?: string,
+    details?: string,
+    swallow?: boolean
+  ) {
+    super(message)
+
+    this.type = type
+    this.severity = severity
+    this.title = title
+    this.heading = heading
+    this.details = details
+    this.swallow = swallow || false
+  }
+}
+
+const HandleAnalyticalError = (error: AnalyticalEngineError): ReportError => {
+  const errors = error?.errors ?? [error]
+  const firstError = errors[0] // For now we only handle one error
+
+  const errorType: AnalyticalEngineErrorType = AnalyticalEngineCodeToType[firstError.code]
+  const severity = ErrorSeverity.WARNING
+  const details: string = firstError.message
+
+  let title = 'serverError'
+  let message = 'analyticalEngineFailedMessage'
+  let heading: string | undefined
+
+  let restartApp = false
+
+  switch (errorType) {
+    case AnalyticalEngineErrorType.REPORT_TYPE:
+      title = 'serverError'
+      message = 'unsupportedReportType'
+      heading = 'cannotOpenReport'
+      break
+
+    case AnalyticalEngineErrorType.ACTION_FAILED:
+      restartApp = true
+      break
+
+    default:
+      break
+  }
+
+  const reportError = new ReportError(ErrorType.ENGINE_ERROR, severity, title, message, heading, details)
+  reportError.restartApp = restartApp
+  return reportError
+}
+
+const isServerError = (err: any): err is ServerError => (err as ServerError).code !== undefined
+
+const isAnaylticalError = (error?: Error | AnalyticalEngineError): error is AnalyticalEngineError => {
+  // Workstation may just have the single error instead of the entire "errors" array
+  const code = (error as ServerError)?.code
+  if (code && AnalyticalEngineCodeToType[code]) {
+    return true
+  }
+
+  return (error as AnalyticalEngineError)?.errors !== undefined
+}
+
+const isExceedRowsError = (error?: ServerError) =>
+  error?.subErrors?.some(err => err.iServerCode === ExceedRowsErrorCode)
+
+const GenerateError = (type: ErrorType, error?: Error | AnalyticalEngineError | ServerError): IReportError => {
+  let severity = ErrorSeverity.ERROR
+  let title = ''
+  let message = ''
+  let heading: string | undefined
+  let details: string | undefined
+  let swallow = false
+
+  if (isAnaylticalError(error)) {
+    return HandleAnalyticalError(error)
+  }
+
+  if (isServerError(error) && IServerIgnoreCodeType.includes(String(error.iServerCode))) {
+    swallow = true
+  }
+
+  switch (type) {
+    case ErrorType.LOGIN:
+      severity = ErrorSeverity.INFO
+      title = 'authError'
+      message = 'loginFailedMessage'
+      break
+
+    case ErrorType.AUTHENTICATION:
+      severity = ErrorSeverity.INFO
+      title = 'authError'
+      message = 'sessionTimeoutMessage'
+      break
+
+    case ErrorType.APPLICATION:
+      severity = ErrorSeverity.INFO
+
+      if (isServerError(error) && isExceedRowsError(error)) {
+        title = 'appError'
+        message = 'exceedRowsMessage'
+        break
+      } else {
+        title = 'appError'
+        message = 'unsupportedReportType'
+        heading = 'cannotOpenReport'
+        details = error?.stack ?? error?.message
+        break
+      }
+
+    case ErrorType.RESOURCE_NOT_FOUND:
+      title = 'serverError'
+      message = 'resourceNotFoundMessage'
+      details = error?.stack ?? error?.message
+      break
+
+    case ErrorType.MSG_RESULT_NOT_READY:
+      title = 'serverError'
+      message = 'messageResultNotReadyMessage'
+      break
+
+    case ErrorType.TYPE_ERROR:
+      severity = ErrorSeverity.CRITICAL
+      title = 'appError'
+      message = 'typeErrorMessage'
+      details = error?.stack ?? error?.message
+      break
+
+    case ErrorType.REFERENCE:
+      severity = ErrorSeverity.CRITICAL
+      title = 'appError'
+      message = 'referenceErrorMessage'
+      details = error?.stack ?? error?.message
+      break
+
+    case ErrorType.UNKNOWN:
+    default:
+      severity = ErrorSeverity.WARNING
+      title = 'notification'
+      message = 'unknownErrorMessage'
+      details = error?.stack ?? error?.message
+      break
+  }
+
+  return new ReportError(type, severity, title, message, heading, details, swallow)
+}
+
+export const ConvertError = (error: Error): ReportError | undefined => {
+  const { name } = error
+  let type = ErrorNameToType[name]
+
+  if (!type) {
+    if (isAnaylticalError(error)) {
+      return GenerateError(type, error)
+    }
+
+    if (isServerError(error)) {
+      const { code } = error
+      type = ErrorCodeToType[code]
+
+      return GenerateError(type, error)
+    }
+  }
+
+  return GenerateError(type, error)
+}
+
+export const getErrorCodeFromRawError = (error: any) => {
+  // Check if this is the specific error we want to handle gracefully
+  // This error indicates the report is still processing, not a real error condition
+  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
+  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
+  const errorCode =
+    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
+    error?.response?.data?.errors?.[0]?.code ||
+    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
+    error?.errors?.[0]?.code ||
+    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
+    error?.code
+  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
+  return errorCode
+}
+
+export default GenerateError
diff --git a/production/src/components/report-editor/report-editor.tsx b/production/src/components/report-editor/report-editor.tsx
index 308cd37e0..655b2b396 100644
--- a/production/src/components/report-editor/report-editor.tsx
+++ b/production/src/components/report-editor/report-editor.tsx
@@ -829,6 +829,7 @@ const ReportEditor: FC<ReportEditorProps> = (props: ReportEditorProps) => {
         fontPickerDefinition={fontPickerDefinition}
         onFontsLoaded={handleFontsLoaded}
         editWithData={editWithData}
+        service={service}
       />
     </section>
   )
diff --git a/production/src/mstr/types.ts b/production/src/mstr/types.ts
index feeffd73f..c9ee3a1a7 100644
--- a/production/src/mstr/types.ts
+++ b/production/src/mstr/types.ts
@@ -81,6 +81,7 @@ export interface UICmdMgr {
   dataService?: DataService
   state: number
   cancelPromptUndoStateId?: number
+  isReCreateReportInstance?: boolean
   createUndoCmdForReport: (stid: number, urInfo?: any) => void
   createUndoCmdForReportPrompt: (isCancelPromptAnswer: boolean, urInfo?: any) => void
   untrackCancelPromptCmd: () => void
diff --git a/production/src/store/doc-view-slice/doc-view-slice.ts b/production/src/store/doc-view-slice/doc-view-slice.ts
index d3b9f8e5e..ba81098d0 100644
--- a/production/src/store/doc-view-slice/doc-view-slice.ts
+++ b/production/src/store/doc-view-slice/doc-view-slice.ts
@@ -4,6 +4,7 @@ import { AnyAction, createAsyncThunk, createSlice, PayloadAction, ThunkDispatch
 import { ServerError } from '../../components/error-catcher/report-error'
 import {
   updateErrorState,
+  updateReCreateErrorState,
   updateHost,
   updateShouldRenderFormatPanel,
   updateIsInitialDataLoaded,
@@ -111,7 +112,8 @@ import {
   Panel,
   PreparationStatus,
   TemplateUpdateStatus,
-  ManipulationActionType
+  ManipulationActionType,
+  TreesToRenderFlag
 } from '../../constants'
 import i18n from '../../locale/locale'
 import { getReportsDossiersDocumentsIdsArray, getNodeChildren } from '../../utils/object-util'
@@ -120,7 +122,12 @@ import { populateReportLinkAction, sendReportLinkForm } from '../../mstr/mojo-he
 import { addNewAnswersToLink } from '../context-link-slice/context-link-slice'
 import { DEFAULT_ANSWER_TYPE } from '../consts'
 import { isTypeNormalReport } from '../../utils/doc-view-util'
-import { resetUndoRedo, saveCancelPromptStateId, hasCancelExecutionFeatureFlag } from '../../utils/undo-redo-util'
+import {
+  resetUndoRedo,
+  saveCancelPromptStateId,
+  hasCancelExecutionFeatureFlag,
+  updateIsReCreateReportInstance
+} from '../../utils/undo-redo-util'
 
 const EMPTY_DATA = {}
 const STATE_BUSY = 2
@@ -945,6 +952,38 @@ export const getGridViewTemplate = createAsyncThunk(
   }
 )
 
+export const reCreateReportInstanceThunkHelper = async (error: any, thunkAPI: any): Promise<DossierDataDefinition> => {
+  const { dispatch, getState } = thunkAPI
+  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
+  const thunkArgument: ThunkArgument = thunkAPI.extra as ThunkArgument
+  const { service } = thunkArgument
+  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
+  const state: ReportEditorState = getState() as ReportEditorState
+  const { isPause, reportId, msgId } = state.ui
+  const body = {
+    actions: [{ act: 'undo', stid: -1, reCreateInstance: true, resolveExecution: true }],
+    style: { params: { treesToRender: 1 }, name: 'RWIVEMojoStyle' },
+    excludeData: false,
+    noActionMode: true,
+    resolveOnly: true,
+    sqlViewMode: false,
+    suppressData: false
+  }
+  // Don't treat as an error, set to pause mode, then undo
+  dispatch(updateManipulationType(ManipulationActionType.NONE))
+  dispatch(updatePauseModeBeforePrompt(false))
+  dispatch(updatePauseMode(true))
+
+  updateIsReCreateReportInstance(true)
+  const mstrApp = window.mstrApp as MojoMstrApp
+  mstrApp?.serverProxy?.cancelRequests?.()
+
+  const revertRes: DossierDataDefinition = await service.updateViewTemplate(reportId, msgId, body)
+
+  updateIsReCreateReportInstance(false)
+  dispatch(updateIsLoading(false))
+  return revertRes
+}
 const updateViewTemplateThunkHelper = async (
   actionParams: UpdateViewTemplateParam,
   thunkAPI: any,
@@ -1296,6 +1335,19 @@ const updateViewTemplateThunkHelper = async (
       })
     }
 
+    // Handle Maximum rows exceeded error specially to keep mojo-report structure
+    const state: ReportEditorState = getState() as ReportEditorState
+    const { isConsumptionMode } = state.docView
+    if (
+      (err as Error)?.message?.includes('Maximum number of results rows per report exceeded the current limit') &&
+      !isConsumptionMode
+    ) {
+      // Recreate server instance and switch to pause mode
+      const result = await reCreateReportInstanceThunkHelper(err, thunkAPI)
+      dispatch(updateReCreateErrorState(err as Error))
+      return result
+    }
+
     if (actionParams?.callback?.failure && handleMojoError) {
       actionParams.callback.failure(
         (err as GeneralServerError).response?.request || {
diff --git a/production/src/store/types.ts b/production/src/store/types.ts
index 1c7c9772e..cfa595c3e 100644
--- a/production/src/store/types.ts
+++ b/production/src/store/types.ts
@@ -90,6 +90,7 @@ export type UI = {
   isPauseBeforePrompt: boolean
   appHost: ReportEditorHost
   errorState: Error | null
+  reCreateErrorState: Error | null
   selectedAttrForms: DatasetPanelUnit | null
   host: AgXtab | null | undefined
   shouldRenderDrillDialog: boolean
diff --git a/production/src/store/ui-slice/ui-selector.ts b/production/src/store/ui-slice/ui-selector.ts
index 185ac8568..2aa966e6b 100644
--- a/production/src/store/ui-slice/ui-selector.ts
+++ b/production/src/store/ui-slice/ui-selector.ts
@@ -16,6 +16,7 @@ export const selectIsPauseModeBeforePrompt = createSelector(selectUI, appState =
 export const selectIsSubsetReport = createSelector(selectUI, appState => appState.isSubsetReport)
 export const selectAppHost = createSelector(selectUI, ui => ui.appHost)
 export const selectErrorState = createSelector(selectUI, appState => appState.errorState)
+export const selectReCreateErrorState = createSelector(selectUI, appState => appState.reCreateErrorState)
 export const selectAttrFormsDialog = createSelector(selectUI, appState => appState.selectedAttrForms)
 export const selectHost = createSelector(selectUI, ui => ui.host)
 export const selectShouldRenderDrillDialog = createSelector(selectUI, ui => ui.shouldRenderDrillDialog)
diff --git a/production/src/store/ui-slice/ui-slice.ts b/production/src/store/ui-slice/ui-slice.ts
index 80cc3d5dc..797990c38 100644
--- a/production/src/store/ui-slice/ui-slice.ts
+++ b/production/src/store/ui-slice/ui-slice.ts
@@ -42,6 +42,7 @@ const initialState: UI = {
   isPauseBeforePrompt: true,
   appHost: ReportEditorHost.Workstation,
   errorState: null,
+  reCreateErrorState: null,
   selectedAttrForms: null,
   host: null,
   shouldRenderDrillDialog: false,
@@ -276,6 +277,9 @@ const uiSlice = createSlice({
     updateErrorState: (state: UI, action: PayloadAction<Error | null>) => {
       state.errorState = action.payload
     },
+    updateReCreateErrorState: (state: UI, action: PayloadAction<Error | null>) => {
+      state.reCreateErrorState = action.payload
+    },
     updateSelectedAttrForms: (state: UI, action: PayloadAction<DatasetPanelUnit | null>) => {
       state.selectedAttrForms = action.payload
     },
@@ -496,6 +500,7 @@ export const {
   updateIsModelingInstanceCreated,
   updateIsInitialDataLoaded,
   updateErrorState,
+  updateReCreateErrorState,
   updateSelectedAttrForms,
   updateHost,
   updateShouldRenderFormatPanel,
diff --git a/production/src/utils/undo-redo-util.ts b/production/src/utils/undo-redo-util.ts
index 573ce4d3e..d98c1a75e 100644
--- a/production/src/utils/undo-redo-util.ts
+++ b/production/src/utils/undo-redo-util.ts
@@ -67,6 +67,13 @@ export const hasCancelExecutionFeatureFlag = (): boolean => {
   return false
 }
 
+export const updateIsReCreateReportInstance = (updateReCreateReportInstance: boolean) => {
+  const cmdMgr = window.mstrApp?.docModel?.controller?.cmdMgr
+  if (cmdMgr) {
+    cmdMgr.isReCreateReportInstance = updateReCreateReportInstance
+  }
+}
+
 const UNDO_REDO_RELEASE_VERSION = '11.5.0400'
 const CANCEL_PROMPT_VERSION = '11.5.0600'
 

From a31447d7eb0a340232787898efa62be8e53029a8 Mon Sep 17 00:00:00 2001
From: yuanli <yuanli@microstrategy.com>
Date: Thu, 29 Jan 2026 18:13:39 +0800
Subject: [PATCH 02/11] reCreateReportInstance 1-7 fix eslint

---
 .../src/components/document-view/document-view.tsx  |  2 +-
 .../recreate-error-catcher.tsx                      |  1 -
 .../src/store/doc-view-slice/doc-view-slice.ts      | 13 +++++++++----
 3 files changed, 10 insertions(+), 6 deletions(-)

diff --git a/production/src/components/document-view/document-view.tsx b/production/src/components/document-view/document-view.tsx
index c50714267..5d7b416b6 100644
--- a/production/src/components/document-view/document-view.tsx
+++ b/production/src/components/document-view/document-view.tsx
@@ -420,7 +420,7 @@ const DocumentView: FC<DocumentViewProps> = props => {
       {!isMstrAppStarted && appHost !== ReportEditorHost.LibraryAuthoring ? <SplashScreen /> : null}
       <div className={className}>
         <div id={DOM_ID} />
-        {!isConsumptionMode && (<ReCreateErrorCatcher service={service} handleError={reCreateErrorHandler}/>)}
+        {!isConsumptionMode && <ReCreateErrorCatcher service={service} handleError={reCreateErrorHandler} />}
       </div>
     </>
   )
diff --git a/production/src/components/recreate-error-catcher/recreate-error-catcher.tsx b/production/src/components/recreate-error-catcher/recreate-error-catcher.tsx
index 8dcb6af1c..95a79b538 100644
--- a/production/src/components/recreate-error-catcher/recreate-error-catcher.tsx
+++ b/production/src/components/recreate-error-catcher/recreate-error-catcher.tsx
@@ -301,4 +301,3 @@ const mapStateToProps = (state: ReportEditorState) => ({
   errorState: selectReCreateErrorState(state)
 })
 export default connect(mapStateToProps)(withTranslation()(ReCreateErrorCatcher))
-
diff --git a/production/src/store/doc-view-slice/doc-view-slice.ts b/production/src/store/doc-view-slice/doc-view-slice.ts
index ba81098d0..b36449c7a 100644
--- a/production/src/store/doc-view-slice/doc-view-slice.ts
+++ b/production/src/store/doc-view-slice/doc-view-slice.ts
@@ -952,17 +952,18 @@ export const getGridViewTemplate = createAsyncThunk(
   }
 )
 
-export const reCreateReportInstanceThunkHelper = async (error: any, thunkAPI: any): Promise<DossierDataDefinition> => {
+export const reCreateReportInstanceThunkHelper = async (thunkAPI: any): Promise<DossierDataDefinition> => {
+  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
   const { dispatch, getState } = thunkAPI
   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
   const thunkArgument: ThunkArgument = thunkAPI.extra as ThunkArgument
   const { service } = thunkArgument
   // eslint-disable-next-line @typescript-eslint/no-unsafe-call
   const state: ReportEditorState = getState() as ReportEditorState
-  const { isPause, reportId, msgId } = state.ui
+  const { reportId, msgId } = state.ui
   const body = {
     actions: [{ act: 'undo', stid: -1, reCreateInstance: true, resolveExecution: true }],
-    style: { params: { treesToRender: 1 }, name: 'RWIVEMojoStyle' },
+    style: { params: { treesToRender: TreesToRenderFlag.DEFN }, name: 'RWIVEMojoStyle' },
     excludeData: false,
     noActionMode: true,
     resolveOnly: true,
@@ -970,18 +971,21 @@ export const reCreateReportInstanceThunkHelper = async (error: any, thunkAPI: an
     suppressData: false
   }
   // Don't treat as an error, set to pause mode, then undo
+  /* eslint-disable @typescript-eslint/no-unsafe-call */
   dispatch(updateManipulationType(ManipulationActionType.NONE))
   dispatch(updatePauseModeBeforePrompt(false))
   dispatch(updatePauseMode(true))
 
   updateIsReCreateReportInstance(true)
   const mstrApp = window.mstrApp as MojoMstrApp
+  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
   mstrApp?.serverProxy?.cancelRequests?.()
 
   const revertRes: DossierDataDefinition = await service.updateViewTemplate(reportId, msgId, body)
 
   updateIsReCreateReportInstance(false)
   dispatch(updateIsLoading(false))
+  /* eslint-enable @typescript-eslint/no-unsafe-call */
   return revertRes
 }
 const updateViewTemplateThunkHelper = async (
@@ -1336,6 +1340,7 @@ const updateViewTemplateThunkHelper = async (
     }
 
     // Handle Maximum rows exceeded error specially to keep mojo-report structure
+    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
     const state: ReportEditorState = getState() as ReportEditorState
     const { isConsumptionMode } = state.docView
     if (
@@ -1343,7 +1348,7 @@ const updateViewTemplateThunkHelper = async (
       !isConsumptionMode
     ) {
       // Recreate server instance and switch to pause mode
-      const result = await reCreateReportInstanceThunkHelper(err, thunkAPI)
+      const result = await reCreateReportInstanceThunkHelper(thunkAPI)
       dispatch(updateReCreateErrorState(err as Error))
       return result
     }

From c94e8921dea3bf6ac907d3169e63d8a17f65a246 Mon Sep 17 00:00:00 2001
From: yuanli <yuanli@microstrategy.com>
Date: Tue, 3 Feb 2026 17:05:43 +0800
Subject: [PATCH 03/11] Running mode manipulation error fix 1 rerender doc view

---
 .../document-view/document-view.tsx           | 15 +++---
 .../recreate-report-error.ts                  |  2 +
 .../store/doc-view-slice/doc-view-slice.ts    | 48 +++++++++++++++----
 3 files changed, 49 insertions(+), 16 deletions(-)

diff --git a/production/src/components/document-view/document-view.tsx b/production/src/components/document-view/document-view.tsx
index 0ee4a32ce..c7248b1c3 100644
--- a/production/src/components/document-view/document-view.tsx
+++ b/production/src/components/document-view/document-view.tsx
@@ -27,7 +27,8 @@ import {
   updatePreparationStatus,
   updateIsCancelLoading,
   rebuildGridViewData,
-  updateManipulationType
+  updateManipulationType,
+  updateIsViewTemplateDirty
 } from '../../store/doc-view-slice/doc-view-slice'
 import {
   selectStid,
@@ -420,12 +421,12 @@ const DocumentView: FC<DocumentViewProps> = props => {
       dispatch(updateReCreateErrorState(null))
       if (error) {
         const reportError = error as ReportError
-        if (reportError && reportError.restartApp) {
-          // Reset the app state
-          batch(() => {
-            dispatch(updateIsInitialDataLoaded(false))
-            dispatch(updateIsMstrAppStarted(false))
-          })
+        if (reportError && reportError.reRenderDocView) {
+          const mstrApp = window.mstrApp as MojoMstrApp
+          // Set mstrApp.appState to DEFAULT to rerender doc view correctly
+          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
+          mstrApp.appState = window.mstrmojo?.vi?.VisualInsightAppBase?.APP_STATES?.DEFAULT
+          dispatch(updateIsViewTemplateDirty(false))
         }
       }
       return Promise.resolve(true)
diff --git a/production/src/components/recreate-error-catcher/recreate-report-error.ts b/production/src/components/recreate-error-catcher/recreate-report-error.ts
index 2d1762a2f..be3c86694 100644
--- a/production/src/components/recreate-error-catcher/recreate-report-error.ts
+++ b/production/src/components/recreate-error-catcher/recreate-report-error.ts
@@ -110,6 +110,8 @@ export class ReportError extends Error implements IReportError {
 
   restartApp?: boolean = false
 
+  reRenderDocView?: boolean = false
+
   title = ''
 
   heading?: string = undefined
diff --git a/production/src/store/doc-view-slice/doc-view-slice.ts b/production/src/store/doc-view-slice/doc-view-slice.ts
index e8270ec50..55e5c8f57 100644
--- a/production/src/store/doc-view-slice/doc-view-slice.ts
+++ b/production/src/store/doc-view-slice/doc-view-slice.ts
@@ -1,7 +1,12 @@
 import { cloneDeep } from 'lodash-es'
 import { batch } from 'react-redux'
 import { AnyAction, createAsyncThunk, createSlice, PayloadAction, ThunkDispatch } from '@reduxjs/toolkit'
-import { ServerError } from '../../components/error-catcher/report-error'
+import {
+  ErrorSeverity,
+  ErrorType,
+  ReportError,
+  ServerError
+} from '../../components/recreate-error-catcher/recreate-report-error'
 import {
   updateErrorState,
   updateReCreateErrorState,
@@ -977,11 +982,6 @@ export const reCreateReportInstanceThunkHelper = async (thunkAPI: any): Promise<
     sqlViewMode: false,
     suppressData: false
   }
-  // Don't treat as an error, set to pause mode, then undo
-  /* eslint-disable @typescript-eslint/no-unsafe-call */
-  dispatch(updateManipulationType(ManipulationActionType.NONE))
-  dispatch(updatePauseModeBeforePrompt(false))
-  dispatch(updatePauseMode(true))
 
   updateIsReCreateReportInstance(true)
   const mstrApp = window.mstrApp as MojoMstrApp
@@ -989,8 +989,16 @@ export const reCreateReportInstanceThunkHelper = async (thunkAPI: any): Promise<
   mstrApp?.serverProxy?.cancelRequests?.()
 
   const revertRes: DossierDataDefinition = await service.updateViewTemplate(reportId, msgId, body)
-
   updateIsReCreateReportInstance(false)
+
+  batch(() => {
+    // switch to pause mode
+    /* eslint-disable @typescript-eslint/no-unsafe-call */
+    dispatch(updateManipulationType(ManipulationActionType.NONE))
+    dispatch(updatePauseMode(true))
+    dispatch(updatePauseModeBeforePrompt(false))
+  })
+
   dispatch(updateIsLoading(false))
   /* eslint-enable @typescript-eslint/no-unsafe-call */
   return revertRes
@@ -1367,14 +1375,36 @@ const updateViewTemplateThunkHelper = async (
     // Handle Maximum rows exceeded error specially to keep mojo-report structure
     // eslint-disable-next-line @typescript-eslint/no-unsafe-call
     const state: ReportEditorState = getState() as ReportEditorState
-    const { isConsumptionMode } = state.docView
+    const { isConsumptionMode, manipulationType } = state.docView
     if (
       (err as Error)?.message?.includes('Maximum number of results rows per report exceeded the current limit') &&
       !isConsumptionMode
     ) {
+      // Create a proper ReportError with reRenderDocView explicitly set to false
+      const reportError = new ReportError(ErrorType.APPLICATION, ErrorSeverity.INFO, 'appError', 'exceedRowsMessage')
+      reportError.name = 'ReportError' // Ensure it's recognized as a ReportError
+      // Copy any additional properties from original error
+      const errStack =
+        typeof err === 'object' &&
+        err !== null &&
+        'stack' in err &&
+        typeof (err as { stack?: unknown }).stack === 'string'
+          ? (err as { stack: string }).stack
+          : undefined
+
+      if (errStack) {
+        reportError.stack = errStack
+      }
+      const isSwitchToDesignMode = manipulationType === ManipulationActionType.SWITCH_TO_UNPAUSE_MODE
+      if (isSwitchToDesignMode) {
+        reportError.reRenderDocView = false
+      } else {
+        // modeling service error, need to rerender document-view
+        reportError.reRenderDocView = true
+      }
       // Recreate server instance and switch to pause mode
       const result = await reCreateReportInstanceThunkHelper(thunkAPI)
-      dispatch(updateReCreateErrorState(err as Error))
+      dispatch(updateReCreateErrorState(reportError as Error))
       return result
     }
 

From 934819760ed2dd806af71be76b982697f08cd494 Mon Sep 17 00:00:00 2001
From: yuanli <yuanli@microstrategy.com>
Date: Wed, 4 Feb 2026 13:05:48 +0800
Subject: [PATCH 04/11] Running mode manipulation error fix 2 resetUndoRedo for
 modify advanced properties

---
 .../src/store/report-property-slice/report-property-slice.ts  | 4 +++-
 1 file changed, 3 insertions(+), 1 deletion(-)

diff --git a/production/src/store/report-property-slice/report-property-slice.ts b/production/src/store/report-property-slice/report-property-slice.ts
index aa85e75a7..548117546 100644
--- a/production/src/store/report-property-slice/report-property-slice.ts
+++ b/production/src/store/report-property-slice/report-property-slice.ts
@@ -23,7 +23,7 @@ import type {
 import { updateIsViewTemplateDirty, setViewEvalOrder, setDocumentProperties } from '../doc-view-slice/doc-view-slice'
 import { EMPTY_UUID } from '../../constants'
 import { isTypeNormalReport } from '../../utils/doc-view-util'
-import { saveCancelPromptStateId } from '../../utils/undo-redo-util'
+import { resetUndoRedo, saveCancelPromptStateId } from '../../utils/undo-redo-util'
 import PrivilegeHelper from '../../mstr/privilege-helper'
 import { EnumReportFeatures } from '../../mstr/mstr-features'
 
@@ -161,6 +161,8 @@ export const updateReportProperties = createAsyncThunk<
         )
         .then(async response => {
           saveCancelPromptStateId(response.stateId, isPause)
+          const cmdMgr = window.mstrApp?.docModel?.controller?.cmdMgr
+          resetUndoRedo(cmdMgr, response?.stateId)
           if ((isViewEvalOrderChanged || (isNormalReport && isChangedDatasetEvalOrder)) && calculation) {
             await dispatch(setViewEvalOrder(calculation))
           } else {

From 92537916450d11dc7ee07bf7437e42e8b80fb4d4 Mon Sep 17 00:00:00 2001
From: yuanli <yuanli@microstrategy.com>
Date: Wed, 4 Feb 2026 17:18:08 +0800
Subject: [PATCH 05/11] Running mode manipulation error fix 3 Judge whether
 isModelingServiceManipulation

---
 .../store/doc-view-slice/doc-view-slice.ts    | 31 +++++++++++++------
 .../report-def-slice/report-def-slice.ts      |  7 ++++-
 .../report-property-slice.ts                  |  9 +++++-
 production/src/store/types.ts                 |  1 +
 4 files changed, 36 insertions(+), 12 deletions(-)

diff --git a/production/src/store/doc-view-slice/doc-view-slice.ts b/production/src/store/doc-view-slice/doc-view-slice.ts
index 55e5c8f57..f48287552 100644
--- a/production/src/store/doc-view-slice/doc-view-slice.ts
+++ b/production/src/store/doc-view-slice/doc-view-slice.ts
@@ -312,7 +312,8 @@ const initialState: DocViewDefinition = {
   manipulationType: ManipulationActionType.NONE,
   previousManipulationType: ManipulationActionType.NONE,
   themeId: '',
-  resolvePromptOnly: false
+  resolvePromptOnly: false,
+  isModelingServiceManipulation: false
 }
 
 const docViewSlice = createSlice({
@@ -454,6 +455,9 @@ const docViewSlice = createSlice({
       state.previousManipulationType = state.manipulationType
       state.manipulationType = action.payload
     },
+    updateIsModelingServiceManipulation: (state: DocViewDefinition, action: PayloadAction<boolean>) => {
+      state.isModelingServiceManipulation = action.payload
+    },
     updateRePromptOnApplyAnswers: (
       state: DocViewDefinition,
       action: PayloadAction<(data: DossierDataDefinition) => DossierDataDefinition>
@@ -525,6 +529,7 @@ export const {
   updateReportPromptsData,
   updateShouldPollStatus,
   updateManipulationType,
+  updateIsModelingServiceManipulation,
   updateRePromptOnApplyAnswers,
   updateRePromptOnCancel,
   updateThemeId,
@@ -964,7 +969,10 @@ export const getGridViewTemplate = createAsyncThunk(
   }
 )
 
-export const reCreateReportInstanceThunkHelper = async (thunkAPI: any): Promise<DossierDataDefinition> => {
+export const reCreateReportInstanceThunkHelper = async (
+  resetUndo: boolean,
+  thunkAPI: any
+): Promise<DossierDataDefinition> => {
   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
   const { dispatch, getState } = thunkAPI
   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
@@ -982,8 +990,11 @@ export const reCreateReportInstanceThunkHelper = async (thunkAPI: any): Promise<
     sqlViewMode: false,
     suppressData: false
   }
-
-  updateIsReCreateReportInstance(true)
+  // Don't treat as an error, undo stid:-1 to recreate instance, set to pause mode
+  if (!resetUndo) {
+    // not from modeling service manipulation
+    updateIsReCreateReportInstance(true) // Avoid resetUndoRedo
+  }
   const mstrApp = window.mstrApp as MojoMstrApp
   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
   mstrApp?.serverProxy?.cancelRequests?.()
@@ -1375,7 +1386,7 @@ const updateViewTemplateThunkHelper = async (
     // Handle Maximum rows exceeded error specially to keep mojo-report structure
     // eslint-disable-next-line @typescript-eslint/no-unsafe-call
     const state: ReportEditorState = getState() as ReportEditorState
-    const { isConsumptionMode, manipulationType } = state.docView
+    const { isConsumptionMode, manipulationType, isModelingServiceManipulation } = state.docView
     if (
       (err as Error)?.message?.includes('Maximum number of results rows per report exceeded the current limit') &&
       !isConsumptionMode
@@ -1396,14 +1407,13 @@ const updateViewTemplateThunkHelper = async (
         reportError.stack = errStack
       }
       const isSwitchToDesignMode = manipulationType === ManipulationActionType.SWITCH_TO_UNPAUSE_MODE
-      if (isSwitchToDesignMode) {
-        reportError.reRenderDocView = false
-      } else {
-        // modeling service error, need to rerender document-view
+      if (!isSwitchToDesignMode) {
+        // unpause mode --> manipulation error --> back to pause mode, need to rerender document-view
         reportError.reRenderDocView = true
       }
+      const resetUndo = isModelingServiceManipulation || clearUndoRedo
       // Recreate server instance and switch to pause mode
-      const result = await reCreateReportInstanceThunkHelper(thunkAPI)
+      const result = await reCreateReportInstanceThunkHelper(resetUndo, thunkAPI)
       dispatch(updateReCreateErrorState(reportError as Error))
       return result
     }
@@ -1426,6 +1436,7 @@ const updateViewTemplateThunkHelper = async (
     return thunkAPI.rejectWithValue(err)
   } finally {
     dispatch(updateTemplateUpdateStatus(TemplateUpdateStatus.NotStarted))
+    dispatch(updateIsModelingServiceManipulation(false))
   }
 }
 
diff --git a/production/src/store/report-def-slice/report-def-slice.ts b/production/src/store/report-def-slice/report-def-slice.ts
index f3e7cf610..561e9befb 100644
--- a/production/src/store/report-def-slice/report-def-slice.ts
+++ b/production/src/store/report-def-slice/report-def-slice.ts
@@ -8,7 +8,8 @@ import {
   updateDossierBulk,
   constructEmptyGrid,
   rebuildGridViewData,
-  getGridViewTemplate
+  getGridViewTemplate,
+  updateIsModelingServiceManipulation
 } from '../doc-view-slice/doc-view-slice'
 import { ChangeType, EnumDSSXMLExtendedType, ObjectType, ReportSubType, UnitType } from '../../constants'
 import { getUpdatedTemplateUnits, getViewTemplateUnitType, isMetricBlock } from '../../utils/object-util'
@@ -380,6 +381,8 @@ export const modifyReportDefinition = createAsyncThunk<
           resetUndoRedo(cmdMgr, response?.stateId)
           // save the stid for prompt cancel
           saveCancelPromptStateId(response.stateId, isPause)
+          dispatch(updateIsModelingServiceManipulation(true))
+
           return response
         })
     } catch (err) {
@@ -431,6 +434,8 @@ export const updateBaseTemplateUnits = createAsyncThunk<
       resetUndoRedo(cmdMgr, response?.stateId)
       // save the stid for prompt cancel
       saveCancelPromptStateId(response.stateId, isPause)
+      dispatch(updateIsModelingServiceManipulation(true))
+
       dispatch(updateIsReportDirty(true))
 
       const { template: newTemplate } = response
diff --git a/production/src/store/report-property-slice/report-property-slice.ts b/production/src/store/report-property-slice/report-property-slice.ts
index 548117546..f3fd5e4f0 100644
--- a/production/src/store/report-property-slice/report-property-slice.ts
+++ b/production/src/store/report-property-slice/report-property-slice.ts
@@ -20,7 +20,12 @@ import type {
   TemplateUnit,
   TemplateObject
 } from '../../types'
-import { updateIsViewTemplateDirty, setViewEvalOrder, setDocumentProperties } from '../doc-view-slice/doc-view-slice'
+import {
+  updateIsViewTemplateDirty,
+  setViewEvalOrder,
+  setDocumentProperties,
+  updateIsModelingServiceManipulation
+} from '../doc-view-slice/doc-view-slice'
 import { EMPTY_UUID } from '../../constants'
 import { isTypeNormalReport } from '../../utils/doc-view-util'
 import { resetUndoRedo, saveCancelPromptStateId } from '../../utils/undo-redo-util'
@@ -163,6 +168,8 @@ export const updateReportProperties = createAsyncThunk<
           saveCancelPromptStateId(response.stateId, isPause)
           const cmdMgr = window.mstrApp?.docModel?.controller?.cmdMgr
           resetUndoRedo(cmdMgr, response?.stateId)
+          dispatch(updateIsModelingServiceManipulation(true))
+
           if ((isViewEvalOrderChanged || (isNormalReport && isChangedDatasetEvalOrder)) && calculation) {
             await dispatch(setViewEvalOrder(calculation))
           } else {
diff --git a/production/src/store/types.ts b/production/src/store/types.ts
index b04ae1879..167d8a876 100644
--- a/production/src/store/types.ts
+++ b/production/src/store/types.ts
@@ -440,6 +440,7 @@ export interface DocViewDefinition {
   rePromptOnCancel?: (isCancelPromptAnswer?: boolean, promptEditor?: any) => void
   themeId: string
   resolvePromptOnly: boolean
+  isModelingServiceManipulation: boolean
 }
 
 export interface GetGridViewTemplateParam {

From b0dc395a1e9fe838563737d4fd0c6ce3e19d775f Mon Sep 17 00:00:00 2001
From: yuanli <yuanli@microstrategy.com>
Date: Wed, 11 Feb 2026 11:23:27 +0800
Subject: [PATCH 06/11] Refactor to support BCIN-6485 Remove from report which
 already used in filter

---
 .../recreate-error-catcher.tsx                |  13 +-
 .../recreate-report-error.ts                  |   8 +-
 .../store/doc-view-slice/doc-view-slice.ts    |  95 +-------
 .../report-def-slice/report-def-slice.ts      |  22 +-
 .../store/shared/shared-recover-from-error.ts | 225 ++++++++++++++++++
 production/src/utils/undo-redo-util.ts        |   2 +-
 6 files changed, 268 insertions(+), 97 deletions(-)
 create mode 100644 production/src/store/shared/shared-recover-from-error.ts

diff --git a/production/src/components/recreate-error-catcher/recreate-error-catcher.tsx b/production/src/components/recreate-error-catcher/recreate-error-catcher.tsx
index 95a79b538..e12d83c8c 100644
--- a/production/src/components/recreate-error-catcher/recreate-error-catcher.tsx
+++ b/production/src/components/recreate-error-catcher/recreate-error-catcher.tsx
@@ -4,7 +4,14 @@ import Button from 'antd/es/button/button'
 import React, { Component, FC, ReactNode } from 'react'
 import { connect } from 'react-redux'
 import { TFunction, withTranslation } from 'react-i18next'
-import { ConvertError, ErrorSeverity, ErrorType, ReportError, ReportErrorAll } from './recreate-report-error'
+import {
+  ConvertError,
+  ErrorSeverity,
+  ErrorType,
+  isReportError,
+  ReportError,
+  ReportErrorAll
+} from './recreate-report-error'
 import type { Service } from '../../service'
 import type { MojoMstrApp } from '../../mstr/types'
 import type { ReportEditorState } from '../../store/types'
@@ -72,10 +79,6 @@ const LoginForm: FC<LoginFormProps> = ({ service, t, onLoginCancel, onLoginSucce
   )
 }
 
-const isReportError = (error: Error): error is ReportError => {
-  return (error as ReportError)?.type !== undefined
-}
-
 const generateNextErrorState = (
   errorState?: Error | null,
   onErrorExternal = (error: ReportErrorAll) => false,
diff --git a/production/src/components/recreate-error-catcher/recreate-report-error.ts b/production/src/components/recreate-error-catcher/recreate-report-error.ts
index be3c86694..01bc8f7c2 100644
--- a/production/src/components/recreate-error-catcher/recreate-report-error.ts
+++ b/production/src/components/recreate-error-catcher/recreate-report-error.ts
@@ -140,6 +140,12 @@ export class ReportError extends Error implements IReportError {
   }
 }
 
+export const isServerError = (err: any): err is ServerError => (err as ServerError).code !== undefined
+
+export const isReportError = (error: unknown): error is ReportError => {
+  return (error as ReportError)?.type !== undefined
+}
+
 const HandleAnalyticalError = (error: AnalyticalEngineError): ReportError => {
   const errors = error?.errors ?? [error]
   const firstError = errors[0] // For now we only handle one error
@@ -174,8 +180,6 @@ const HandleAnalyticalError = (error: AnalyticalEngineError): ReportError => {
   return reportError
 }
 
-const isServerError = (err: any): err is ServerError => (err as ServerError).code !== undefined
-
 const isAnaylticalError = (error?: Error | AnalyticalEngineError): error is AnalyticalEngineError => {
   // Workstation may just have the single error instead of the entire "errors" array
   const code = (error as ServerError)?.code
diff --git a/production/src/store/doc-view-slice/doc-view-slice.ts b/production/src/store/doc-view-slice/doc-view-slice.ts
index f48287552..a93c1ca5a 100644
--- a/production/src/store/doc-view-slice/doc-view-slice.ts
+++ b/production/src/store/doc-view-slice/doc-view-slice.ts
@@ -1,12 +1,9 @@
 import { cloneDeep } from 'lodash-es'
 import { batch } from 'react-redux'
 import { AnyAction, createAsyncThunk, createSlice, PayloadAction, ThunkDispatch } from '@reduxjs/toolkit'
-import {
-  ErrorSeverity,
-  ErrorType,
-  ReportError,
-  ServerError
-} from '../../components/recreate-error-catcher/recreate-report-error'
+import { ServerError } from '../../components/error-catcher/report-error'
+import { ErrorSeverity, ErrorType, ReportError } from '../../components/recreate-error-catcher/recreate-report-error'
+import { recoverReportFromError, reCreateReportInstanceThunkHelper } from '../shared/shared-recover-from-error'
 import {
   updateErrorState,
   updateReCreateErrorState,
@@ -969,51 +966,6 @@ export const getGridViewTemplate = createAsyncThunk(
   }
 )
 
-export const reCreateReportInstanceThunkHelper = async (
-  resetUndo: boolean,
-  thunkAPI: any
-): Promise<DossierDataDefinition> => {
-  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
-  const { dispatch, getState } = thunkAPI
-  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
-  const thunkArgument: ThunkArgument = thunkAPI.extra as ThunkArgument
-  const { service } = thunkArgument
-  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
-  const state: ReportEditorState = getState() as ReportEditorState
-  const { reportId, msgId } = state.ui
-  const body = {
-    actions: [{ act: 'undo', stid: -1, reCreateInstance: true, resolveExecution: true }],
-    style: { params: { treesToRender: TreesToRenderFlag.DEFN }, name: 'RWIVEMojoStyle' },
-    excludeData: false,
-    noActionMode: true,
-    resolveOnly: true,
-    sqlViewMode: false,
-    suppressData: false
-  }
-  // Don't treat as an error, undo stid:-1 to recreate instance, set to pause mode
-  if (!resetUndo) {
-    // not from modeling service manipulation
-    updateIsReCreateReportInstance(true) // Avoid resetUndoRedo
-  }
-  const mstrApp = window.mstrApp as MojoMstrApp
-  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
-  mstrApp?.serverProxy?.cancelRequests?.()
-
-  const revertRes: DossierDataDefinition = await service.updateViewTemplate(reportId, msgId, body)
-  updateIsReCreateReportInstance(false)
-
-  batch(() => {
-    // switch to pause mode
-    /* eslint-disable @typescript-eslint/no-unsafe-call */
-    dispatch(updateManipulationType(ManipulationActionType.NONE))
-    dispatch(updatePauseMode(true))
-    dispatch(updatePauseModeBeforePrompt(false))
-  })
-
-  dispatch(updateIsLoading(false))
-  /* eslint-enable @typescript-eslint/no-unsafe-call */
-  return revertRes
-}
 const updateViewTemplateThunkHelper = async (
   actionParams: UpdateViewTemplateParam,
   thunkAPI: any,
@@ -1383,39 +1335,16 @@ const updateViewTemplateThunkHelper = async (
       })
     }
 
-    // Handle Maximum rows exceeded error specially to keep mojo-report structure
-    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
-    const state: ReportEditorState = getState() as ReportEditorState
-    const { isConsumptionMode, manipulationType, isModelingServiceManipulation } = state.docView
-    if (
-      (err as Error)?.message?.includes('Maximum number of results rows per report exceeded the current limit') &&
-      !isConsumptionMode
-    ) {
-      // Create a proper ReportError with reRenderDocView explicitly set to false
-      const reportError = new ReportError(ErrorType.APPLICATION, ErrorSeverity.INFO, 'appError', 'exceedRowsMessage')
-      reportError.name = 'ReportError' // Ensure it's recognized as a ReportError
-      // Copy any additional properties from original error
-      const errStack =
-        typeof err === 'object' &&
-        err !== null &&
-        'stack' in err &&
-        typeof (err as { stack?: unknown }).stack === 'string'
-          ? (err as { stack: string }).stack
-          : undefined
-
-      if (errStack) {
-        reportError.stack = errStack
-      }
-      const isSwitchToDesignMode = manipulationType === ManipulationActionType.SWITCH_TO_UNPAUSE_MODE
-      if (!isSwitchToDesignMode) {
-        // unpause mode --> manipulation error --> back to pause mode, need to rerender document-view
-        reportError.reRenderDocView = true
+    const recovered = await recoverReportFromError<DossierDataDefinition>(
+      err,
+      thunkAPI as Pick<AsyncThunkConfig, 'dispatch' | 'getState' | 'extra'>,
+      {
+        clearUndoRedo,
+        reCreateReportThunkHelper: reCreateReportInstanceThunkHelper
       }
-      const resetUndo = isModelingServiceManipulation || clearUndoRedo
-      // Recreate server instance and switch to pause mode
-      const result = await reCreateReportInstanceThunkHelper(resetUndo, thunkAPI)
-      dispatch(updateReCreateErrorState(reportError as Error))
-      return result
+    )
+    if (recovered.handled) {
+      return recovered.result
     }
 
     if (actionParams?.callback?.failure && handleMojoError) {
diff --git a/production/src/store/report-def-slice/report-def-slice.ts b/production/src/store/report-def-slice/report-def-slice.ts
index 561e9befb..c9fc707cc 100644
--- a/production/src/store/report-def-slice/report-def-slice.ts
+++ b/production/src/store/report-def-slice/report-def-slice.ts
@@ -28,6 +28,7 @@ import {
 import { updateReportProperties } from '../report-property-slice/report-property-slice'
 import { updateGlobalFilterDefinition } from '../actions/global-filter-actions'
 import MojoDocViewHelper from '../../components/document-view/mojo-doc-view-helper'
+import { recoverReportFromError, reCreateReportInstanceThunkHelper } from '../shared/shared-recover-from-error'
 import type { BaseActionsParams, ReportParam, AsyncThunkConfig } from '../types'
 import type {
   ObjectInfo,
@@ -402,13 +403,10 @@ export const updateBaseTemplateUnits = createAsyncThunk<
   AsyncThunkConfig
 >(
   'report/updateBase',
-  async (
-    { units, actionType, updateView, callback },
-    { getState, dispatch, extra: { service, onError }, rejectWithValue }
-  ) => {
+  async ({ units, actionType, updateView, callback }, { getState, dispatch, extra, rejectWithValue }) => {
     const { reportDefn, docView, ui } = getState()
     const { msgId, isPause } = ui
-
+    const { service, onError } = extra
     if (!units) {
       return reportDefn
     }
@@ -476,7 +474,19 @@ export const updateBaseTemplateUnits = createAsyncThunk<
       }
 
       return response
-    } catch (err) {
+    } catch (err: unknown) {
+      const recovered = await recoverReportFromError<unknown>(
+        err,
+        { dispatch, getState, extra },
+        {
+          clearUndoRedo: true,
+          reCreateReportThunkHelper: reCreateReportInstanceThunkHelper
+        }
+      )
+
+      if (recovered.handled) {
+        return reportDefn
+      }
       dispatch(updateErrorState(err as Error))
       onError(err)
       return rejectWithValue(err)
diff --git a/production/src/store/shared/shared-recover-from-error.ts b/production/src/store/shared/shared-recover-from-error.ts
new file mode 100644
index 000000000..8b2f1d291
--- /dev/null
+++ b/production/src/store/shared/shared-recover-from-error.ts
@@ -0,0 +1,225 @@
+import { batch } from 'react-redux'
+import { ManipulationActionType, TreesToRenderFlag } from '../../constants'
+import { updatePauseMode, updatePauseModeBeforePrompt, updateReCreateErrorState } from '../ui-slice/ui-slice'
+import type { AsyncThunkConfig, ReportEditorState } from '../types'
+import type { ThunkArgument, DossierDataDefinition } from '../../types'
+import type { MojoMstrApp } from '../../mstr/types'
+import { updateIsReCreateReportInstance } from '../../utils/undo-redo-util'
+import {
+  isReportError,
+  ReportError,
+  AnalyticalEngineError,
+  ServerError,
+  ConvertError,
+  isServerError
+} from '../../components/recreate-error-catcher/recreate-report-error'
+
+const MAX_ROWS_EXCEEDED_MESSAGE = 'Maximum number of results rows per report exceeded the current limit'
+const EXCEED_ROWS_ISERVER_CODE = -2147466604
+const ANALYTICAL_ACTION_FAILED_REMOVE_CODE = '8004da65'
+
+type AnalyticalEngineErrorEntryLike = {
+  code?: unknown
+  message?: unknown
+  additionalProperties?: unknown
+}
+
+const isAnalyticalEngineErrorEntryLike = (entry: unknown): entry is AnalyticalEngineErrorEntryLike => {
+  return typeof entry === 'object' && entry !== null && 'code' in entry
+}
+
+const isAnalyticalEngineError = (error: unknown): error is AnalyticalEngineError => {
+  if (typeof error !== 'object' || error === null) {
+    return false
+  }
+
+  const allErrors = (error as AnalyticalEngineError)?.errors
+  if (Array.isArray(allErrors)) {
+    return true
+  }
+
+  // Some analytical errors may come through as a single object with a `code` field.
+  const code = (error as ServerError)?.code
+  const AnalyticalEngineCodeToType: { [key: string]: boolean } = {
+    '8004da08': true,
+    '8004da0b': true,
+    '8004da03': true,
+    '8004da22': true,
+    [ANALYTICAL_ACTION_FAILED_REMOVE_CODE]: true
+  }
+  return Boolean(code && AnalyticalEngineCodeToType[code])
+}
+
+const isExceedRowsError = (error?: ServerError) =>
+  error?.subErrors?.some(err => err.iServerCode === EXCEED_ROWS_ISERVER_CODE)
+
+/**
+ * Checks if error is a maximum rows exceeded error.
+ * This checks the error message string.
+ */
+const isMaximumRowsExceededMessageError = (err: unknown): boolean => {
+  const msg =
+    typeof err === 'object' &&
+    err !== null &&
+    'message' in err &&
+    typeof (err as { message?: unknown }).message === 'string'
+      ? (err as { message: string }).message
+      : undefined
+
+  return Boolean(msg?.includes(MAX_ROWS_EXCEEDED_MESSAGE))
+}
+
+/**
+ * Checks if error is analytical engine error with code 8004da65.
+ * This is the error shape seen in report-def-slice.
+ */
+const isAnalyticalActionFailedRemove = (err: unknown): boolean => {
+  // Support both shapes:
+  // 1) { errors: [{ code: '8004da65', ... }] }
+  // 2) a single error entry object { code: '8004da65', ... }
+  if (isAnalyticalEngineErrorEntryLike(err)) {
+    return err.code === ANALYTICAL_ACTION_FAILED_REMOVE_CODE
+  }
+
+  if (!isAnalyticalEngineError(err)) {
+    return false
+  }
+
+  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
+  const errors = (err as any)?.errors
+  if (!Array.isArray(errors)) {
+    return false
+  }
+
+  return errors.some(
+    (entry: unknown) => isAnalyticalEngineErrorEntryLike(entry) && entry.code === ANALYTICAL_ACTION_FAILED_REMOVE_CODE
+  )
+}
+
+/**
+ * Determines if the error should trigger recovery.
+ * Handles both:
+ * - Maximum rows exceeded message errors (doc-view-slice)
+ * - Analytical engine errors with code 8004da65 (report-def-slice)
+ * - Server errors with exceed rows subError code
+ */
+const shouldRecoverFromError = (err: unknown): boolean => {
+  // Check message-based error (doc-view context)
+  if (isMaximumRowsExceededMessageError(err)) {
+    return true
+  }
+  // Check server error with exceed rows subError
+  if (isServerError(err) && isExceedRowsError(err)) {
+    return true
+  }
+
+  // Check analytical engine error with 8004da65 (report-def context)
+  if (isAnalyticalActionFailedRemove(err)) {
+    return true
+  }
+
+  return false
+}
+
+export type DocViewContext = {
+  isConsumptionMode: boolean
+  manipulationType: ManipulationActionType
+  isModelingServiceManipulation: boolean
+}
+
+export type RecoveryResult<T> =
+  | { handled: false }
+  | {
+      handled: true
+      result: T
+      reportError?: ReportError
+    }
+
+export const reCreateReportInstanceThunkHelper = async (
+  resetUndo: boolean,
+  thunkAPI: any
+): Promise<DossierDataDefinition> => {
+  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
+  const { dispatch, getState } = thunkAPI
+  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
+  const thunkArgument: ThunkArgument = thunkAPI.extra as ThunkArgument
+  const { service } = thunkArgument
+  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
+  const state: ReportEditorState = getState() as ReportEditorState
+  const { reportId, msgId } = state.ui
+  const body = {
+    actions: [{ act: 'undo', stid: -1, reCreateInstance: true, resolveExecution: true }],
+    style: { params: { treesToRender: TreesToRenderFlag.DEFN }, name: 'RWIVEMojoStyle' },
+    excludeData: false,
+    noActionMode: true,
+    resolveOnly: true,
+    sqlViewMode: false,
+    suppressData: false
+  }
+
+  // Don't treat as an error, undo stid:-1 to recreate instance, set to pause mode
+  if (!resetUndo) {
+    // not from modeling service manipulation
+    updateIsReCreateReportInstance(true) // Avoid resetUndoRedo
+  }
+
+  const mstrApp = window.mstrApp as MojoMstrApp
+  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
+  mstrApp?.serverProxy?.cancelRequests?.()
+
+  const revertRes: DossierDataDefinition = await service.updateViewTemplate(reportId, msgId, body)
+  updateIsReCreateReportInstance(false)
+
+  // switch to pause mode
+  batch(() => {
+    /* eslint-disable @typescript-eslint/no-unsafe-call */
+    // Avoid importing doc-view-slice here (circular dependency). Dispatch the action by type.
+    dispatch({ type: 'doc-view/updateManipulationType', payload: ManipulationActionType.NONE })
+    dispatch(updatePauseMode(true))
+    dispatch(updatePauseModeBeforePrompt(false))
+  })
+
+  // Avoid importing doc-view-slice here (circular dependency). Dispatch the action by type.
+  dispatch({ type: 'doc-view/updateIsLoading', payload: false })
+  /* eslint-enable @typescript-eslint/no-unsafe-call */
+  return revertRes
+}
+
+export const recoverReportFromError = async <T>(
+  err: unknown,
+  thunkAPI: Pick<AsyncThunkConfig, 'dispatch' | 'getState' | 'extra'>,
+  options: {
+    clearUndoRedo: boolean
+    reCreateReportThunkHelper: (resetUndo: boolean, thunkAPI: any) => Promise<T>
+  }
+): Promise<RecoveryResult<T>> => {
+  const { dispatch, getState } = thunkAPI
+  const state = getState() as { docView: DocViewContext }
+  const { isConsumptionMode, manipulationType, isModelingServiceManipulation } = state.docView
+  const { clearUndoRedo, reCreateReportThunkHelper } = options
+
+  if (isConsumptionMode) {
+    return { handled: false }
+  }
+
+  // Check if this error should trigger recovery
+  if (!shouldRecoverFromError(err)) {
+    return { handled: false }
+  }
+
+  let reportError: ReportError | undefined = err as ReportError
+  if (!isReportError(reportError) && err) {
+    reportError = ConvertError(err as Error)
+  }
+
+  const isSwitchToDesignMode = manipulationType === ManipulationActionType.SWITCH_TO_UNPAUSE_MODE
+  if (!isSwitchToDesignMode && reportError) {
+    reportError.reRenderDocView = true
+  }
+
+  const resetUndo = isModelingServiceManipulation || clearUndoRedo
+  const result = await reCreateReportThunkHelper(resetUndo, thunkAPI)
+  dispatch(updateReCreateErrorState(reportError as Error))
+
+  return { handled: true, result, reportError }
+}
diff --git a/production/src/utils/undo-redo-util.ts b/production/src/utils/undo-redo-util.ts
index d98c1a75e..ae9e056ee 100644
--- a/production/src/utils/undo-redo-util.ts
+++ b/production/src/utils/undo-redo-util.ts
@@ -1,4 +1,4 @@
-import { UICmdMgr, MojoMstrApp } from '../mstr/types'
+import type { UICmdMgr, MojoMstrApp } from '../mstr/types'
 import { EnumDeploymentFeatures } from '../mstr/mstr-features'
 import { isVersionSupported } from './index'
 

From 44e9027d50a849ced052458189d580affac28c43 Mon Sep 17 00:00:00 2001
From: yuanli <yuanli@microstrategy.com>
Date: Thu, 12 Feb 2026 14:35:35 +0800
Subject: [PATCH 07/11] Support all "iServerCode": -2147466604 errors

---
 .../recreate-report-error.ts                  | 178 +++++++++++++++++-
 .../store/shared/shared-recover-from-error.ts |  40 ++--
 2 files changed, 200 insertions(+), 18 deletions(-)

diff --git a/production/src/components/recreate-error-catcher/recreate-report-error.ts b/production/src/components/recreate-error-catcher/recreate-report-error.ts
index 01bc8f7c2..3a18fcc82 100644
--- a/production/src/components/recreate-error-catcher/recreate-report-error.ts
+++ b/production/src/components/recreate-error-catcher/recreate-report-error.ts
@@ -83,6 +83,10 @@ const ErrorCodeToType: { [key: string]: ErrorType } = {
   ERR008: ErrorType.MSG_RESULT_NOT_READY
 }
 
+export const AnalyticalEngineErrorCode = {
+  DRM_E_H264_PPS_MORE_RBSP: '8004da65' // "Cannot remove attribute (id='xxx') from report because it is used by view filter."
+}
+
 const AnalyticalEngineCodeToType: { [key: string]: AnalyticalEngineErrorType } = {
   '8004da08': AnalyticalEngineErrorType.REPORT_TYPE,
   '8004da0b': AnalyticalEngineErrorType.REPORT_TYPE,
@@ -90,7 +94,7 @@ const AnalyticalEngineCodeToType: { [key: string]: AnalyticalEngineErrorType } =
   '8004da03': AnalyticalEngineErrorType.DUPLICATE,
 
   '8004da22': AnalyticalEngineErrorType.ACTION_FAILED,
-  '8004da65': AnalyticalEngineErrorType.ACTION_FAILED
+  [AnalyticalEngineErrorCode.DRM_E_H264_PPS_MORE_RBSP]: AnalyticalEngineErrorType.ACTION_FAILED
 }
 
 const IServerUnsupportedCodeType: { [key: string]: string } = {
@@ -101,7 +105,165 @@ const IServerIgnoreCodeType: string[] = [
   '-2147205027' // "Date or time values required."
 ]
 
-const ExceedRowsErrorCode = -2147205488
+export const ServerAPIErrorCodes = {
+  // 2^32, used for safe 32-bit conversions without bitwise ops (ESLint no-bitwise).
+  // Keep as a literal to avoid any runtime dependency on Math.pow in hot paths.
+  UINT32_MOD: 0x100000000,
+  E_UNUSED: 0xffffffff,
+  E_UNSPECIFIED: 0x80004005, // -2147467259
+
+  AUTHEN_E_LOGIN_FAIL_EXPIRED_PWD: 0x800411bd, // -2147216963
+  AUTHEN_E_LOGIN_FAILED_NEW_PASSWORD_REQD: 0x800411c0, // -2147216960
+  AUTHEN_E_LOGIN_FAIL: 0x800411c1, // -2147216959
+  AUTHEN_E_LOGIN_FAIL_ACCOUNT_DISABLED: 0x800411bb, // -2147216965
+  AUTHEN_E_USER_NO_PRIV: 0x80041e28, // -2147213784
+  AUTHEN_E_CHANGEPASSWORD_FAILED_NOT_MEET_REQ: 0x80049e63, // -2147180957
+  AUTHEN_E_LOGIN_FAIL_NO_STANDARD_AUTH: 0x80041e20, // -2147753504
+
+  E_MSI_UNKNOWN_HOST: 0x80043706, // -2147207418
+  MSI_SERVER_NOT_FOUND: 0x800438f5, // -2147206923
+
+  E_GIT_INTEGRATION_REFRESH_TOKEN_FAILED: 0x800448c5, // -2147202875
+  E_GIT_INTEGRATION_NO_EXTERNAL_SESSION: 0x8006489c, // -2147071844
+
+  MSI_INBOX_MSG_NOT_FOUND: 0x80003946, // -2147468986
+  MSI_INBOX_MSG_NOT_READY: 0x80003999, // -2147468903
+  MDSVR_E_NO_ID: 0x8004140b, // -2147216373
+  MDSVR_E_DB_ERROR: 0x80041404, // -2147216380
+  MDSVR_E_NO_OBJECT: 0x80041414, // -2147216364
+  AUTHEN_E_INVALID_OPERATION: 0x800411c3, // -2147216957
+  E_KEY_NOT_FOUND: 0x80041019, // -2147217383,
+  /* eslint camelcase: "off" */
+  MSI_DocumentDataPreparationTask_ReportIncomplete: 0x80004294, // -2147466604
+  MSI_CUBE_NOT_PUBLISHED: 0x80064618, // -2147072488
+  MSI_CUBE_OFFLINE: 0x800645e2, // -2147072542
+  MSI_REPORT_INCOMPLETE_OP: 0x8004ffce, // -2147156018
+
+  MCE_E_OBJECT_INFO_NOT_FOUND: 0x8004ffe2, // -2147155998
+
+  // Session expired by any of below error codes:
+  MSI_SERVER_NAME_NOT_INITIALIZED: 0x800438f3,
+  MSI_INVALID_SESSION_ID: 0x800438f4,
+  E_MSI_USERMGR_USER_NOTFOUND: 0x800430a5, // UserLogin expired
+  E_MSI_CONNECT_FAILED: 0x80043705,
+  E_MSI_USERMGR_USER_PROJ_NOT_LOGIN: 0x80004003, // -2147467261
+  E_MSI_USERMGR_USER_PROJ_NOT_FOUND: 0x80043775, // -2147207307
+  E_MSI_USERMGR_MAX_SERVERUSERS_EXCEEDED: 0x800430a0, // -2147209056
+
+  // Datasource refresh token expired error
+  E_MSI_RETRIEVE_REFRESH_TOKEN_FAILED: 0x800448d7, // -2147202857
+
+  // LDAP Configuration/credential errors
+  MSI_E_LDAP_SERVER_NOT_CONFIG: 0x80043edf, // -2147205409
+  MSI_E_INCORRECT_LDAP_CONFIG_AUTH_USER: 0x80043ee3, // -2147205405
+
+  // Add Doc Template error
+  MSI_E_ADD_DOC_TEMPLATE_TO_LIBRARY: 0x8000fd01, // -2147418879
+
+  // Privilege
+  E_USER_HAS_NO_ACCESSIBLE_PROJECT: 0x80042578, // -2147211912
+  SEC_C_PRIV_LACK: 0x8000106b, // -2147479445
+  SEC_E_USER_ACCESS_DENIED: 0x80041b18, // -2147214568
+  SEC_E_VIZ_EXECUTION_ACCESS: 0x80041b1c, // -2147214564
+  SEC_E_SELECTOR_EXECUTION_ACCESS: 0x80041b1d, // -2147214563
+
+  // Access denied to dossier object
+  E_ACCESSDENIED: 0x80070005, // -2147024891
+  MSI_LOGINMGR_ACCESS_DENIED: 0x80043759,
+  SEC_E_ACCESS_DENIED: 0x80041b0d, // -2147214579
+  SEC_E_NO_ACCESS_TO_PROJECT: 0x80041b0e, // -2147214578
+  SEC_E_CANT_CREATE_OBJECT: 0x80041b0b, // -2147214581
+
+  // Duplicated dossier name
+  MSI_INVALID_OBJECT_NAME: 0x80041023, // -2147217373
+  MDSVR_E_INVALID_ID: 0x8004140a, // -2147216374
+  MSI_REQUEST_TIMEOUT: 0x80043a9f, // -2147206497
+
+  // Project
+  NOT_REGISTERED_PROJECT: 0x80043041, // -2147209151
+  API_ERR_PROJECT_OFFLINE: 0x80043021, // -2147209183
+  API_ERR_PROJECT_NOT_LOADED: 0x80043027, // -21147209177
+  API_ERR_PROJECT_IDLE: 0x80043018, // -2147209192
+
+  // Prompt
+  DSSCOM_C_PROMPT_REQ: 0x8000036e,
+
+  // Export
+  E_EXPORT_OPTIONS: 0x80042b82,
+  E_EXPORT_JSON_LENGTH_LIMIT: 0x80042b83,
+  E_EXPORT_FAILURE: 0x80002b84, // -2147472508
+  E_EE_GOOGLE_DRIVE_REFRESH_TOKEN_EXPIRED: 0x80002c31, // -2147472335
+  E_EE_GOOGLE_EXPORT_IAM_NOT_FOUND: 0x80002c32, // -2147472334
+  E_EE_GOOGLE_EXPORT_UPLOAD_FAILURE: 0x80002c33, // -2147472333
+  EE_NEWEE_EXPORT_FAIL: 0x80042b85,
+  DSSCOM_E_CANNOT_EXPORT_DUE_TO_MSTR_SIZE_EXCEEDED: 0x80042538,
+
+  // SDK error
+  ERR_SDK_E_INVALID: 0x80044033,
+  ERR_SDK_E_PROMPT_NUMERICAL_VALUES: 0x80044056,
+  ERR_SDK_E_PROMPT_DATE_TIME: 0x8004405d,
+
+  // Linkng target page not found
+  DSSCOM_E_TARGET_PAGE_NOT_FOUND: 0x8004fc34,
+
+  // Model Report API Errors
+  MODEL_REPORT_DUPLICATED_NAMES: '8004da5c', // model service Save As Error with duplicated report names
+  MSI_E_CREATE_EXECUTE_BOT_USING_ANONYMOUS_NOT_ALLOWED: 0x8004fc16, // guest is not allowed to execute / edit ai bot
+  E_SHARING_EXCEED_MAX_LIMIT: 0x800411e5, // sharing exceed max limit in SaaS
+  E_BOT_DATASET_CONTAINS_PROMPT: 0x80041906, // bot dataset contains prompt, not supported
+
+  DSSCOM_E_AI_REQUEST_EXCEED_LIMIT: 0x8000fe3b, // -2147418565 The number of AI request exceeds the maximum limit.
+
+  E_MSI_CLUSTER_STATE_SERVICE_CONNECTION_FAILED: 0x8004fe83, // -2147156349
+  E_MULTI_DATA_SOURCE_PRIVILEGE: 0x80004305, // -2147466491
+
+  SEC_E_TARGET_CHAPTER_INACCESSIBLE: 0x8004fc1a, // -2147156966
+
+  // Report Errors
+  DFC_QRYENG_RES_TRUNC: 0x80043e90, // -2147205488 ExceedRowsErrorCode
+
+  /**
+   * Convert negative decimal error code into hex number
+   * @param {number} errCode The Server API error code either in negative decimal or 32-bit hex number
+   * @return {number} Hex representative of server error code
+   */
+  toHex(errCode: number | string) {
+    // Error code from server api response header can be a negative signed int32.
+    // Convert to unsigned int32 so -2147466604 becomes 0x80004294.
+    let code: number
+    if (typeof errCode === 'number') {
+      code = errCode
+    } else {
+      const trimmed = errCode.trim()
+      const isHex = /^0x/i.test(trimmed) || (/^[0-9a-f]+$/i.test(trimmed) && trimmed.length >= 8)
+      code = parseInt(trimmed, isHex ? 16 : 10)
+    }
+
+    // Coerce to uint32 without bitwise. Mirrors `code >>> 0` including NaN -> 0.
+    if (Number.isNaN(code)) {
+      return 0
+    }
+
+    const mod = code % this.UINT32_MOD
+    return mod < 0 ? mod + this.UINT32_MOD : mod
+  },
+
+  /**
+   * Convert hex number into negative decimal error code
+   * @param {number} hex representative of server error code in 32-bit hex number
+   * @returns The Server API error code either in negative decimal
+   */
+  hexToSignedInt32(hex: number) {
+    // Coerce to int32 without bitwise. Mirrors `hex | 0` for uint32 values.
+    if (Number.isNaN(hex)) {
+      return 0
+    }
+
+    const mod = hex % this.UINT32_MOD
+    const uint32 = mod < 0 ? mod + this.UINT32_MOD : mod
+    return uint32 >= 0x80000000 ? uint32 - this.UINT32_MOD : uint32
+  }
+}
 
 export class ReportError extends Error implements IReportError {
   type: ErrorType = ErrorType.UNKNOWN
@@ -142,6 +304,14 @@ export class ReportError extends Error implements IReportError {
 
 export const isServerError = (err: any): err is ServerError => (err as ServerError).code !== undefined
 
+export const isServerReportIncompleteError = (error: unknown): error is ReportError => {
+  return (
+    isServerError(error) &&
+    error.iServerCode ===
+      ServerAPIErrorCodes.hexToSignedInt32(ServerAPIErrorCodes.MSI_DocumentDataPreparationTask_ReportIncomplete)
+  )
+}
+
 export const isReportError = (error: unknown): error is ReportError => {
   return (error as ReportError)?.type !== undefined
 }
@@ -191,7 +361,9 @@ const isAnaylticalError = (error?: Error | AnalyticalEngineError): error is Anal
 }
 
 const isExceedRowsError = (error?: ServerError) =>
-  error?.subErrors?.some(err => err.iServerCode === ExceedRowsErrorCode)
+  error?.subErrors?.some(
+    err => err.iServerCode === ServerAPIErrorCodes.hexToSignedInt32(ServerAPIErrorCodes.DFC_QRYENG_RES_TRUNC)
+  )
 
 const GenerateError = (type: ErrorType, error?: Error | AnalyticalEngineError | ServerError): IReportError => {
   let severity = ErrorSeverity.ERROR
diff --git a/production/src/store/shared/shared-recover-from-error.ts b/production/src/store/shared/shared-recover-from-error.ts
index 8b2f1d291..fce183707 100644
--- a/production/src/store/shared/shared-recover-from-error.ts
+++ b/production/src/store/shared/shared-recover-from-error.ts
@@ -11,12 +11,13 @@ import {
   AnalyticalEngineError,
   ServerError,
   ConvertError,
-  isServerError
+  isServerError,
+  isServerReportIncompleteError,
+  AnalyticalEngineErrorCode,
+  ServerAPIErrorCodes
 } from '../../components/recreate-error-catcher/recreate-report-error'
 
 const MAX_ROWS_EXCEEDED_MESSAGE = 'Maximum number of results rows per report exceeded the current limit'
-const EXCEED_ROWS_ISERVER_CODE = -2147466604
-const ANALYTICAL_ACTION_FAILED_REMOVE_CODE = '8004da65'
 
 type AnalyticalEngineErrorEntryLike = {
   code?: unknown
@@ -45,14 +46,11 @@ const isAnalyticalEngineError = (error: unknown): error is AnalyticalEngineError
     '8004da0b': true,
     '8004da03': true,
     '8004da22': true,
-    [ANALYTICAL_ACTION_FAILED_REMOVE_CODE]: true
+    [AnalyticalEngineErrorCode.DRM_E_H264_PPS_MORE_RBSP]: true
   }
   return Boolean(code && AnalyticalEngineCodeToType[code])
 }
 
-const isExceedRowsError = (error?: ServerError) =>
-  error?.subErrors?.some(err => err.iServerCode === EXCEED_ROWS_ISERVER_CODE)
-
 /**
  * Checks if error is a maximum rows exceeded error.
  * This checks the error message string.
@@ -69,6 +67,16 @@ const isMaximumRowsExceededMessageError = (err: unknown): boolean => {
   return Boolean(msg?.includes(MAX_ROWS_EXCEEDED_MESSAGE))
 }
 
+const isExceedRowsError = (error?: unknown) => {
+  const subErrorExceedRows =
+    isServerError(error) &&
+    error?.subErrors?.some(
+      // 0x80043e90 -2147205488 ExceedRowsErrorCode
+      err => err.iServerCode === ServerAPIErrorCodes.hexToSignedInt32(ServerAPIErrorCodes.DFC_QRYENG_RES_TRUNC)
+    )
+  return subErrorExceedRows || isMaximumRowsExceededMessageError(error)
+}
+
 /**
  * Checks if error is analytical engine error with code 8004da65.
  * This is the error shape seen in report-def-slice.
@@ -78,7 +86,8 @@ const isAnalyticalActionFailedRemove = (err: unknown): boolean => {
   // 1) { errors: [{ code: '8004da65', ... }] }
   // 2) a single error entry object { code: '8004da65', ... }
   if (isAnalyticalEngineErrorEntryLike(err)) {
-    return err.code === ANALYTICAL_ACTION_FAILED_REMOVE_CODE
+    // "Cannot remove attribute (id='xxx') from report because it is used by view filter."
+    return err.code === AnalyticalEngineErrorCode.DRM_E_H264_PPS_MORE_RBSP
   }
 
   if (!isAnalyticalEngineError(err)) {
@@ -92,7 +101,8 @@ const isAnalyticalActionFailedRemove = (err: unknown): boolean => {
   }
 
   return errors.some(
-    (entry: unknown) => isAnalyticalEngineErrorEntryLike(entry) && entry.code === ANALYTICAL_ACTION_FAILED_REMOVE_CODE
+    (entry: unknown) =>
+      isAnalyticalEngineErrorEntryLike(entry) && entry.code === AnalyticalEngineErrorCode.DRM_E_H264_PPS_MORE_RBSP
   )
 }
 
@@ -104,12 +114,8 @@ const isAnalyticalActionFailedRemove = (err: unknown): boolean => {
  * - Server errors with exceed rows subError code
  */
 const shouldRecoverFromError = (err: unknown): boolean => {
-  // Check message-based error (doc-view context)
-  if (isMaximumRowsExceededMessageError(err)) {
-    return true
-  }
-  // Check server error with exceed rows subError
-  if (isServerError(err) && isExceedRowsError(err)) {
+  // Check maximum rows exceeded error
+  if (isExceedRowsError(err)) {
     return true
   }
 
@@ -118,6 +124,10 @@ const shouldRecoverFromError = (err: unknown): boolean => {
     return true
   }
 
+  if (isServerReportIncompleteError(err)) {
+    return true
+  }
+
   return false
 }
 

From c5fa3f564021b57f4ce8ca0930e65461926059a0 Mon Sep 17 00:00:00 2001
From: yuanli <yuanli@microstrategy.com>
Date: Tue, 24 Feb 2026 13:06:23 +0800
Subject: [PATCH 08/11] fix lint

---
 production/src/store/doc-view-slice/doc-view-slice.ts     | 2 +-
 production/src/store/report-def-slice/report-def-slice.ts | 2 +-
 production/src/store/shared/shared-recover-from-error.ts  | 4 ++--
 3 files changed, 4 insertions(+), 4 deletions(-)

diff --git a/production/src/store/doc-view-slice/doc-view-slice.ts b/production/src/store/doc-view-slice/doc-view-slice.ts
index a93c1ca5a..e6afe696e 100644
--- a/production/src/store/doc-view-slice/doc-view-slice.ts
+++ b/production/src/store/doc-view-slice/doc-view-slice.ts
@@ -1335,7 +1335,7 @@ const updateViewTemplateThunkHelper = async (
       })
     }
 
-    const recovered = await recoverReportFromError<DossierDataDefinition>(
+    const recovered = await recoverReportFromError(
       err,
       thunkAPI as Pick<AsyncThunkConfig, 'dispatch' | 'getState' | 'extra'>,
       {
diff --git a/production/src/store/report-def-slice/report-def-slice.ts b/production/src/store/report-def-slice/report-def-slice.ts
index c9fc707cc..f4ad65fc0 100644
--- a/production/src/store/report-def-slice/report-def-slice.ts
+++ b/production/src/store/report-def-slice/report-def-slice.ts
@@ -475,7 +475,7 @@ export const updateBaseTemplateUnits = createAsyncThunk<
 
       return response
     } catch (err: unknown) {
-      const recovered = await recoverReportFromError<unknown>(
+      const recovered = await recoverReportFromError(
         err,
         { dispatch, getState, extra },
         {
diff --git a/production/src/store/shared/shared-recover-from-error.ts b/production/src/store/shared/shared-recover-from-error.ts
index fce183707..8fd8b7da4 100644
--- a/production/src/store/shared/shared-recover-from-error.ts
+++ b/production/src/store/shared/shared-recover-from-error.ts
@@ -195,14 +195,14 @@ export const reCreateReportInstanceThunkHelper = async (
   return revertRes
 }
 
-export const recoverReportFromError = async <T>(
+export const recoverReportFromError = async function <T>(
   err: unknown,
   thunkAPI: Pick<AsyncThunkConfig, 'dispatch' | 'getState' | 'extra'>,
   options: {
     clearUndoRedo: boolean
     reCreateReportThunkHelper: (resetUndo: boolean, thunkAPI: any) => Promise<T>
   }
-): Promise<RecoveryResult<T>> => {
+): Promise<RecoveryResult<T>> {
   const { dispatch, getState } = thunkAPI
   const state = getState() as { docView: DocViewContext }
   const { isConsumptionMode, manipulationType, isModelingServiceManipulation } = state.docView

From 3ab1937ecb48a716db1259b15ceeba02f6938a9b Mon Sep 17 00:00:00 2001
From: yuanli <yuanli@microstrategy.com>
Date: Mon, 2 Mar 2026 18:53:44 +0800
Subject: [PATCH 09/11] BCIN-6709;Modeling service error handle by ErrorCatcher
 without rerender document-view

---
 .../error-catcher/error-catcher.tsx           |  61 +++++------
 .../components/error-catcher/report-error.ts  |   8 +-
 .../recreate-error-catcher.tsx                |  61 +++++------
 .../recreate-report-error.ts                  |  16 ++-
 .../store/doc-view-slice/doc-view-slice.ts    |  27 +----
 .../report-def-slice/report-def-slice.ts      |   4 +-
 .../store/shared/shared-recover-from-error.ts | 103 ++++++++++++++----
 production/src/utils/grid-data-util.ts        |  20 ++++
 8 files changed, 179 insertions(+), 121 deletions(-)
 create mode 100644 production/src/utils/grid-data-util.ts

diff --git a/production/src/components/error-catcher/error-catcher.tsx b/production/src/components/error-catcher/error-catcher.tsx
index a39762e48..d395dbacb 100644
--- a/production/src/components/error-catcher/error-catcher.tsx
+++ b/production/src/components/error-catcher/error-catcher.tsx
@@ -255,42 +255,35 @@ class ErrorCatcher extends Component<Props, State> {
     const { children } = this.props
     const { reportError } = this.state
 
-    if (reportError) {
-      let renderChildren = true
-
-      const { severity: errorSeverity } = reportError
-      switch (errorSeverity) {
-        // React errors, shouldn't render children or the error
-        // state will just loop infinitely
-        case ErrorSeverity.CRITICAL:
-          renderChildren = false
-          break
-
-        // If we can't determine the severity at all, something
-        // went wrong when creating the ReportError object. For
-        // safety (e.g. make sure the entire report doesn't crash)
-        // we should hide the children.
-        case undefined:
-          renderChildren = false
-          break
-
-        default:
-          renderChildren = true
-          break
-      }
-
-      const PopupJSX = this.getPopupJSX()
-
-      return (
-        <div className='error-wrapper'>
-          {renderChildren ? children : null}
-
-          {PopupJSX}
-        </div>
-      )
+    let renderChildren = true
+    switch (reportError?.severity) {
+      // React errors, shouldn't render children or the error
+      // state will just loop infinitely
+      case ErrorSeverity.CRITICAL:
+        renderChildren = false
+        break
+
+      // If we can't determine the severity at all, something
+      // went wrong when creating the ReportError object. For
+      // safety (e.g. make sure the entire report doesn't crash)
+      // we should hide the children.
+      case undefined:
+        renderChildren = false
+        break
+
+      default:
+        renderChildren = true
+        break
     }
 
-    return children
+    const PopupJSX = reportError ? this.getPopupJSX() : null
+
+    return (
+      <>
+        {!reportError || renderChildren ? children : null}
+        {PopupJSX}
+      </>
+    )
   }
 }
 
diff --git a/production/src/components/error-catcher/report-error.ts b/production/src/components/error-catcher/report-error.ts
index 2d1762a2f..8a47e5718 100644
--- a/production/src/components/error-catcher/report-error.ts
+++ b/production/src/components/error-catcher/report-error.ts
@@ -118,6 +118,8 @@ export class ReportError extends Error implements IReportError {
 
   swallow = false
 
+  isAnaylticalError?: boolean = false
+
   constructor(
     type: ErrorType,
     severity: ErrorSeverity,
@@ -125,7 +127,8 @@ export class ReportError extends Error implements IReportError {
     message: string,
     heading?: string,
     details?: string,
-    swallow?: boolean
+    swallow?: boolean,
+    isAnaylticalError?: boolean
   ) {
     super(message)
 
@@ -135,6 +138,7 @@ export class ReportError extends Error implements IReportError {
     this.heading = heading
     this.details = details
     this.swallow = swallow || false
+    this.isAnaylticalError = isAnaylticalError || false
   }
 }
 
@@ -167,7 +171,7 @@ const HandleAnalyticalError = (error: AnalyticalEngineError): ReportError => {
       break
   }
 
-  const reportError = new ReportError(ErrorType.ENGINE_ERROR, severity, title, message, heading, details)
+  const reportError = new ReportError(ErrorType.ENGINE_ERROR, severity, title, message, heading, details, false, true)
   reportError.restartApp = restartApp
   return reportError
 }
diff --git a/production/src/components/recreate-error-catcher/recreate-error-catcher.tsx b/production/src/components/recreate-error-catcher/recreate-error-catcher.tsx
index e12d83c8c..81dc9293e 100644
--- a/production/src/components/recreate-error-catcher/recreate-error-catcher.tsx
+++ b/production/src/components/recreate-error-catcher/recreate-error-catcher.tsx
@@ -261,42 +261,35 @@ class ReCreateErrorCatcher extends Component<Props, State> {
     const { children } = this.props
     const { reportError } = this.state
 
-    if (reportError) {
-      let renderChildren = true
-
-      const { severity: errorSeverity } = reportError
-      switch (errorSeverity) {
-        // React errors, shouldn't render children or the error
-        // state will just loop infinitely
-        case ErrorSeverity.CRITICAL:
-          renderChildren = false
-          break
-
-        // If we can't determine the severity at all, something
-        // went wrong when creating the ReportError object. For
-        // safety (e.g. make sure the entire report doesn't crash)
-        // we should hide the children.
-        case undefined:
-          renderChildren = false
-          break
-
-        default:
-          renderChildren = true
-          break
-      }
-
-      const PopupJSX = this.getPopupJSX()
-
-      return (
-        <div className='error-wrapper'>
-          {renderChildren ? children : null}
-
-          {PopupJSX}
-        </div>
-      )
+    let renderChildren = true
+    switch (reportError?.severity) {
+      // React errors, shouldn't render children or the error
+      // state will just loop infinitely
+      case ErrorSeverity.CRITICAL:
+        renderChildren = false
+        break
+
+      // If we can't determine the severity at all, something
+      // went wrong when creating the ReportError object. For
+      // safety (e.g. make sure the entire report doesn't crash)
+      // we should hide the children.
+      case undefined:
+        renderChildren = false
+        break
+
+      default:
+        renderChildren = true
+        break
     }
 
-    return children
+    const PopupJSX = reportError ? this.getPopupJSX() : null
+
+    return (
+      <>
+        {!reportError || renderChildren ? children : null}
+        {PopupJSX}
+      </>
+    )
   }
 }
 
diff --git a/production/src/components/recreate-error-catcher/recreate-report-error.ts b/production/src/components/recreate-error-catcher/recreate-report-error.ts
index 3a18fcc82..831690f7b 100644
--- a/production/src/components/recreate-error-catcher/recreate-report-error.ts
+++ b/production/src/components/recreate-error-catcher/recreate-report-error.ts
@@ -272,8 +272,6 @@ export class ReportError extends Error implements IReportError {
 
   restartApp?: boolean = false
 
-  reRenderDocView?: boolean = false
-
   title = ''
 
   heading?: string = undefined
@@ -282,6 +280,10 @@ export class ReportError extends Error implements IReportError {
 
   swallow = false
 
+  isAnaylticalError?: boolean = false
+
+  reRenderDocView?: boolean = false
+
   constructor(
     type: ErrorType,
     severity: ErrorSeverity,
@@ -289,7 +291,9 @@ export class ReportError extends Error implements IReportError {
     message: string,
     heading?: string,
     details?: string,
-    swallow?: boolean
+    swallow?: boolean,
+    isAnaylticalError?: boolean,
+    reRenderDocView?: boolean
   ) {
     super(message)
 
@@ -299,6 +303,8 @@ export class ReportError extends Error implements IReportError {
     this.heading = heading
     this.details = details
     this.swallow = swallow || false
+    this.isAnaylticalError = isAnaylticalError || false
+    this.reRenderDocView = reRenderDocView || false
   }
 }
 
@@ -345,12 +351,12 @@ const HandleAnalyticalError = (error: AnalyticalEngineError): ReportError => {
       break
   }
 
-  const reportError = new ReportError(ErrorType.ENGINE_ERROR, severity, title, message, heading, details)
+  const reportError = new ReportError(ErrorType.ENGINE_ERROR, severity, title, message, heading, details, false, true)
   reportError.restartApp = restartApp
   return reportError
 }
 
-const isAnaylticalError = (error?: Error | AnalyticalEngineError): error is AnalyticalEngineError => {
+export const isAnaylticalError = (error?: Error | AnalyticalEngineError): error is AnalyticalEngineError => {
   // Workstation may just have the single error instead of the entire "errors" array
   const code = (error as ServerError)?.code
   if (code && AnalyticalEngineCodeToType[code]) {
diff --git a/production/src/store/doc-view-slice/doc-view-slice.ts b/production/src/store/doc-view-slice/doc-view-slice.ts
index e6afe696e..f1317bc6c 100644
--- a/production/src/store/doc-view-slice/doc-view-slice.ts
+++ b/production/src/store/doc-view-slice/doc-view-slice.ts
@@ -2,11 +2,9 @@ import { cloneDeep } from 'lodash-es'
 import { batch } from 'react-redux'
 import { AnyAction, createAsyncThunk, createSlice, PayloadAction, ThunkDispatch } from '@reduxjs/toolkit'
 import { ServerError } from '../../components/error-catcher/report-error'
-import { ErrorSeverity, ErrorType, ReportError } from '../../components/recreate-error-catcher/recreate-report-error'
 import { recoverReportFromError, reCreateReportInstanceThunkHelper } from '../shared/shared-recover-from-error'
 import {
   updateErrorState,
-  updateReCreateErrorState,
   updateHost,
   updateShouldRenderFormatPanel,
   updateIsInitialDataLoaded,
@@ -28,6 +26,7 @@ import {
 } from '../ui-slice/ui-slice'
 import MojoDocViewHelper, { setupPageByPanel } from '../../components/document-view/mojo-doc-view-helper'
 import { updateAppConfigObjects, mapPaletteThemesProperties, populatePromptDescs } from '../../mstr/mstrapp-util'
+import { extractGridData } from '../../utils/grid-data-util'
 
 import {
   generateAddToViewAction,
@@ -127,8 +126,7 @@ import { isTypeNormalReport } from '../../utils/doc-view-util'
 import {
   resetUndoRedo,
   saveCancelPromptStateId,
-  hasCancelExecutionFeatureFlag,
-  updateIsReCreateReportInstance
+  hasCancelExecutionFeatureFlag
 } from '../../utils/undo-redo-util'
 
 const EMPTY_DATA = {}
@@ -215,21 +213,6 @@ function overrideMojoFnForUserPromptOption() {
   window.mstrApp.parseLayoutXMLtoJSON = window.mstrmojo.vi.VisualInsightAppBase.prototype.parseLayoutXMLtoJSON
 }
 
-export function extractGridData(data: Record<string, any>, key: string): GridViewObject {
-  if (!data) return EMPTY_DATA
-  if (data.k === key || data.sortIndex === key) {
-    return data
-  }
-  let res = EMPTY_DATA
-
-  const children = (getNodeChildren(data as Node) as Node[]) ?? []
-  // eslint-disable-next-line no-restricted-syntax
-  for (const chdNode of children) {
-    res = Object.keys(res).length ? res : extractGridData(chdNode, key)
-  }
-  return res || EMPTY_DATA
-}
-
 /**
  * TODO: Temporary logic to fake an empty grid
  */
@@ -1323,7 +1306,7 @@ const updateViewTemplateThunkHelper = async (
     }
 
     return res
-  } catch (err: unknown) {
+  } catch (err) {
     // Handle AbortError specifically
     if ((err as Error)?.name === 'AbortError' || (err as Error)?.message === 'AbortError') {
       // Don't treat as an error, just return early
@@ -1336,12 +1319,12 @@ const updateViewTemplateThunkHelper = async (
     }
 
     const recovered = await recoverReportFromError(
-      err,
       thunkAPI as Pick<AsyncThunkConfig, 'dispatch' | 'getState' | 'extra'>,
       {
         clearUndoRedo,
         reCreateReportThunkHelper: reCreateReportInstanceThunkHelper
-      }
+      },
+      err as Error
     )
     if (recovered.handled) {
       return recovered.result
diff --git a/production/src/store/report-def-slice/report-def-slice.ts b/production/src/store/report-def-slice/report-def-slice.ts
index f4ad65fc0..aa2adb101 100644
--- a/production/src/store/report-def-slice/report-def-slice.ts
+++ b/production/src/store/report-def-slice/report-def-slice.ts
@@ -476,12 +476,12 @@ export const updateBaseTemplateUnits = createAsyncThunk<
       return response
     } catch (err: unknown) {
       const recovered = await recoverReportFromError(
-        err,
         { dispatch, getState, extra },
         {
           clearUndoRedo: true,
           reCreateReportThunkHelper: reCreateReportInstanceThunkHelper
-        }
+        },
+        err as Error
       )
 
       if (recovered.handled) {
diff --git a/production/src/store/shared/shared-recover-from-error.ts b/production/src/store/shared/shared-recover-from-error.ts
index 8fd8b7da4..1edd2e2df 100644
--- a/production/src/store/shared/shared-recover-from-error.ts
+++ b/production/src/store/shared/shared-recover-from-error.ts
@@ -1,9 +1,18 @@
 import { batch } from 'react-redux'
+import { cloneDeep } from 'lodash-es'
+import type { AnyAction, ThunkDispatch } from '@reduxjs/toolkit'
 import { ManipulationActionType, TreesToRenderFlag } from '../../constants'
-import { updatePauseMode, updatePauseModeBeforePrompt, updateReCreateErrorState } from '../ui-slice/ui-slice'
-import type { AsyncThunkConfig, ReportEditorState } from '../types'
+import {
+  updatePauseMode,
+  updatePauseModeBeforePrompt,
+  updateReCreateErrorState,
+  updateDssXmlStatus,
+  updateShowBaseViewInLibrary
+} from '../ui-slice/ui-slice'
+import type { AsyncThunkConfig, ReportEditorState, Attribute, Metric, RowsStructure } from '../types'
 import type { ThunkArgument, DossierDataDefinition } from '../../types'
 import type { MojoMstrApp } from '../../mstr/types'
+import { extractGridData } from '../../utils/grid-data-util'
 import { updateIsReCreateReportInstance } from '../../utils/undo-redo-util'
 import {
   isReportError,
@@ -14,11 +23,62 @@ import {
   isServerError,
   isServerReportIncompleteError,
   AnalyticalEngineErrorCode,
-  ServerAPIErrorCodes
+  ServerAPIErrorCodes,
+  isAnaylticalError
 } from '../../components/recreate-error-catcher/recreate-report-error'
 
 const MAX_ROWS_EXCEEDED_MESSAGE = 'Maximum number of results rows per report exceeded the current limit'
 
+const EMPTY_DATA = {}
+const EMPTY_GSI = {
+  rows: [] as Attribute[],
+  cols: [] as Attribute[],
+  mx: [] as Metric[]
+}
+const EMPTY_GTS = {
+  row: [],
+  col: [],
+  page: [],
+  cws: [],
+  show: true,
+  rec: true,
+  rowSubPos: 0,
+  colSubPos: 0,
+  pageSubPos: 0
+}
+// Mirrors `updateDossierBulk` but avoids importing `doc-view-slice`.
+const updateDossierBulkRevert = (
+  dispatch: ThunkDispatch<unknown, unknown, AnyAction>,
+  dossierData: DossierDataDefinition
+) => {
+  batch(() => {
+    dispatch({ type: 'doc-view/updateDossierData', payload: dossierData })
+    dispatch({ type: 'doc-view/updateStid', payload: dossierData.stid })
+    dispatch({ type: 'doc-view/updateHp', payload: dossierData.hp })
+    dispatch({ type: 'doc-view/updatePrompted', payload: dossierData.prompted })
+    dispatch({ type: 'doc-view/updateJobId', payload: dossierData.jobId })
+    dispatch({ type: 'doc-view/updateReportCached', payload: dossierData.reportCached })
+
+    dispatch(updateDssXmlStatus(dossierData.status))
+    dispatch(updateShowBaseViewInLibrary(dossierData.showBaseViewInLibrary))
+
+    const gridData = extractGridData(dossierData.data, 'K52')
+    dispatch({ type: 'doc-view/updateGridData', payload: cloneDeep(gridData || EMPTY_DATA) })
+
+    dispatch({ type: 'doc-view/updateGridRow', payload: gridData.rw as RowsStructure })
+    dispatch({ type: 'doc-view/updateGsi', payload: cloneDeep((gridData && gridData.gsi) || EMPTY_GSI) })
+    dispatch({ type: 'doc-view/updateGts', payload: cloneDeep((gridData && gridData.gts) || EMPTY_GTS) })
+    dispatch({ type: 'doc-view/updateDatasets', payload: cloneDeep(dossierData.datasets) })
+
+    if (gridData.nf) {
+      dispatch({ type: 'doc-view/updateNumberFormat', payload: gridData.nf })
+    }
+    if (gridData.nfu) {
+      dispatch({ type: 'doc-view/updateTextFormat', payload: gridData.nfu })
+    }
+  })
+}
+
 type AnalyticalEngineErrorEntryLike = {
   code?: unknown
   message?: unknown
@@ -108,24 +168,19 @@ const isAnalyticalActionFailedRemove = (err: unknown): boolean => {
 
 /**
  * Determines if the error should trigger recovery.
- * Handles both:
- * - Maximum rows exceeded message errors (doc-view-slice)
- * - Analytical engine errors with code 8004da65 (report-def-slice)
- * - Server errors with exceed rows subError code
  */
-const shouldRecoverFromError = (err: unknown): boolean => {
-  // Check maximum rows exceeded error
-  if (isExceedRowsError(err)) {
-    return true
+const shouldRecoverFromError = (err?: Error | AnalyticalEngineError | ServerError): boolean => {
+  if (!err) {
+    return false
   }
 
-  // Check analytical engine error with 8004da65 (report-def context)
-  if (isAnalyticalActionFailedRemove(err)) {
+  // Check maximum rows exceeded error and "iServerCode": -2147466604
+  if (isExceedRowsError(err) || isServerReportIncompleteError(err)) {
     return true
   }
 
-  if (isServerReportIncompleteError(err)) {
-    return true
+  if (isAnaylticalError(err)) {
+    return false
   }
 
   return false
@@ -195,13 +250,13 @@ export const reCreateReportInstanceThunkHelper = async (
   return revertRes
 }
 
-export const recoverReportFromError = async function <T>(
-  err: unknown,
+export const recoverReportFromError = async function <T extends DossierDataDefinition>(
   thunkAPI: Pick<AsyncThunkConfig, 'dispatch' | 'getState' | 'extra'>,
   options: {
     clearUndoRedo: boolean
     reCreateReportThunkHelper: (resetUndo: boolean, thunkAPI: any) => Promise<T>
-  }
+  },
+  err?: Error | AnalyticalEngineError | ServerError
 ): Promise<RecoveryResult<T>> {
   const { dispatch, getState } = thunkAPI
   const state = getState() as { docView: DocViewContext }
@@ -228,8 +283,12 @@ export const recoverReportFromError = async function <T>(
   }
 
   const resetUndo = isModelingServiceManipulation || clearUndoRedo
-  const result = await reCreateReportThunkHelper(resetUndo, thunkAPI)
-  dispatch(updateReCreateErrorState(reportError as Error))
-
-  return { handled: true, result, reportError }
+  try {
+    const result = await reCreateReportThunkHelper(resetUndo, thunkAPI)
+    updateDossierBulkRevert(dispatch, result)
+    dispatch(updateReCreateErrorState(reportError as Error))
+    return { handled: true, result, reportError }
+  } catch (error) {
+    return { handled: false }
+  }
 }
diff --git a/production/src/utils/grid-data-util.ts b/production/src/utils/grid-data-util.ts
new file mode 100644
index 000000000..c1bd73828
--- /dev/null
+++ b/production/src/utils/grid-data-util.ts
@@ -0,0 +1,20 @@
+/* eslint-disable import/prefer-default-export */
+import type { GridViewObject } from 'src/store/types'
+import { getNodeChildren, type Node } from './object-util'
+
+const EMPTY_DATA = {}
+
+export const extractGridData = (data: Record<string, any>, key: string): GridViewObject => {
+  if (!data) return EMPTY_DATA
+  if (data.k === key || data.sortIndex === key) {
+    return data
+  }
+  let res = EMPTY_DATA
+
+  const children = (getNodeChildren(data as Node) as Node[]) ?? []
+  // eslint-disable-next-line no-restricted-syntax
+  for (const chdNode of children) {
+    res = Object.keys(res).length ? res : extractGridData(chdNode, key)
+  }
+  return res || EMPTY_DATA
+}

From 6c5ef94b0873bbc76e51088708fd226849011c79 Mon Sep 17 00:00:00 2001
From: yuanli <yuanli@microstrategy.com>
Date: Wed, 4 Mar 2026 14:03:16 +0800
Subject: [PATCH 10/11] BCIN-7543; Modify updateShouldResetUndoRedo

---
 production/src/mstr/types.ts                             | 2 +-
 production/src/store/shared/shared-recover-from-error.ts | 5 ++---
 production/src/utils/undo-redo-util.ts                   | 4 ++--
 3 files changed, 5 insertions(+), 6 deletions(-)

diff --git a/production/src/mstr/types.ts b/production/src/mstr/types.ts
index c9ee3a1a7..fd2c5f221 100644
--- a/production/src/mstr/types.ts
+++ b/production/src/mstr/types.ts
@@ -81,7 +81,7 @@ export interface UICmdMgr {
   dataService?: DataService
   state: number
   cancelPromptUndoStateId?: number
-  isReCreateReportInstance?: boolean
+  shouldResetUndoRedo?: boolean
   createUndoCmdForReport: (stid: number, urInfo?: any) => void
   createUndoCmdForReportPrompt: (isCancelPromptAnswer: boolean, urInfo?: any) => void
   untrackCancelPromptCmd: () => void
diff --git a/production/src/store/shared/shared-recover-from-error.ts b/production/src/store/shared/shared-recover-from-error.ts
index 1edd2e2df..ed1631d9d 100644
--- a/production/src/store/shared/shared-recover-from-error.ts
+++ b/production/src/store/shared/shared-recover-from-error.ts
@@ -13,7 +13,7 @@ import type { AsyncThunkConfig, ReportEditorState, Attribute, Metric, RowsStruct
 import type { ThunkArgument, DossierDataDefinition } from '../../types'
 import type { MojoMstrApp } from '../../mstr/types'
 import { extractGridData } from '../../utils/grid-data-util'
-import { updateIsReCreateReportInstance } from '../../utils/undo-redo-util'
+import { updateShouldResetUndoRedo } from '../../utils/undo-redo-util'
 import {
   isReportError,
   ReportError,
@@ -225,7 +225,7 @@ export const reCreateReportInstanceThunkHelper = async (
   // Don't treat as an error, undo stid:-1 to recreate instance, set to pause mode
   if (!resetUndo) {
     // not from modeling service manipulation
-    updateIsReCreateReportInstance(true) // Avoid resetUndoRedo
+    updateShouldResetUndoRedo(false) // Avoid resetUndoRedo
   }
 
   const mstrApp = window.mstrApp as MojoMstrApp
@@ -233,7 +233,6 @@ export const reCreateReportInstanceThunkHelper = async (
   mstrApp?.serverProxy?.cancelRequests?.()
 
   const revertRes: DossierDataDefinition = await service.updateViewTemplate(reportId, msgId, body)
-  updateIsReCreateReportInstance(false)
 
   // switch to pause mode
   batch(() => {
diff --git a/production/src/utils/undo-redo-util.ts b/production/src/utils/undo-redo-util.ts
index ae9e056ee..5b6630169 100644
--- a/production/src/utils/undo-redo-util.ts
+++ b/production/src/utils/undo-redo-util.ts
@@ -67,10 +67,10 @@ export const hasCancelExecutionFeatureFlag = (): boolean => {
   return false
 }
 
-export const updateIsReCreateReportInstance = (updateReCreateReportInstance: boolean) => {
+export const updateShouldResetUndoRedo = (shouldReset: boolean) => {
   const cmdMgr = window.mstrApp?.docModel?.controller?.cmdMgr
   if (cmdMgr) {
-    cmdMgr.isReCreateReportInstance = updateReCreateReportInstance
+    cmdMgr.shouldResetUndoRedo = shouldReset
   }
 }
 

From 3f0c5d2ce50fb2b7315b0a69ef13b0a86c0c2340 Mon Sep 17 00:00:00 2001
From: yuanli <yuanli@microstrategy.com>
Date: Thu, 5 Mar 2026 13:54:38 +0800
Subject: [PATCH 11/11] BCIN-7543; Update error string

---
 .../recreate-error-catcher/recreate-report-error.ts           | 4 ++--
 1 file changed, 2 insertions(+), 2 deletions(-)

diff --git a/production/src/components/recreate-error-catcher/recreate-report-error.ts b/production/src/components/recreate-error-catcher/recreate-report-error.ts
index 831690f7b..bb87ab389 100644
--- a/production/src/components/recreate-error-catcher/recreate-report-error.ts
+++ b/production/src/components/recreate-error-catcher/recreate-report-error.ts
@@ -409,8 +409,8 @@ const GenerateError = (type: ErrorType, error?: Error | AnalyticalEngineError |
         break
       } else {
         title = 'appError'
-        message = 'unsupportedReportType'
-        heading = 'cannotOpenReport'
+        heading = 'cannotExecuteReport'
+        message = 'cannotExecuteReportError'
         details = error?.stack ?? error?.message
         break
       }
