Instructions for Design Author1800

 * Do NOT delete any sections below from the template. You may add new sections
   if necessary. If an existing section is not applicable, simply indicate it is
   NA with a brief description

 * For any questions/feedback for this Design template, please reach out to
   Divisional Architects.

Target release

26.04

Feature

BCIN-6709dbec92f5-caa5-3227-a246-185a23663d18Strategy Jira

Design Status

1129 5f5f3704-ad02-44e1-8386-5ddac07c7401 complete Design Drafted 1130
efd73263-b759-4499-98b6-a475bbe4cce3 incomplete Review in Progress 1131
aa0e6eda-f650-44dc-8c21-f0a3c79ec09c incomplete Approved

SE Owner



QA Owner

QA Engineer responsible for the test plan

UX Owner



Reviewed by

Design reviewer(s) - This should include both SE and QA reviewers.

Related Designs

Link(s) to related design documentation (if any). This might be designs in a
similar area or which depend upon this design etc.

Design Contributors



UX Design

Link to the UX design (if applicable)

Test Plan

Link to the end-to-end test plan - This should be created by the SET owner.


1. Introduction

Why are we developing this feature? Provide background information from the
product feature specification or Rally feature specification.


1.1 Purpose / Requirements

When report encounters errors, user has to exit the report back to library home
and open again to continue working, while all the previous editing would be
lost. This is frustrating for report users and we have received more and more
customer complains about it including one escalation. We need to address this
problem asap.



1.1.1 DESIGN ASSUMPTIONS & SCOPE

Provide additional engineering requirements & Assumptions which aren’t covered
in the Feature requirements.

 * This feature prompt answer error with 'Maximum number of results rows per
   report exceeded the current limit' depends on F43454 cancel prompt answer and
   back to prompt.

 * This feature only recreate server instance when certain manipulation crashes
   the instance.

 * This feature only scope on the report authoring mode, not including
   comsumption mode.


1.2 Deployment Type Support

Is the current feature supported/In-Scope for each deployment type based on PM
Requirements? Is this feature also enabled by default or does it require feature
flag to be turned on?

Details of different deployment types supported are described here Cloud
Offerings .

VMware Tanzu Kubernetes Cluster is available for Internal Tec
Development/Testing for Containerized deployment. For More info: Tanzu
Kubernetes Cluster Guide

Deployment Offer

Deployment Type

In Scope (Yes/No)

Default behavior

Disabled/Enabled/NA

Description

Provide Justification

MCE (MicroStrategy Cloud Environment) - (AWS, Azure)

VM

Yes

Enabled



MEP (MicroStrategy Enterprise Platform) - OnPrem

OnPrem

Yes

Enabled



MCG - (MicroStrategy Cloud for Government) - FedRAMP (AWS)

Container

Yes

Enabled



MCE (MicroStrategy Cloud Environment) - (GCP) (*Azure 2024)

Container

Yes

Enabled



VMWare Tanzu (Internal Testing)

Container

Yes

Enabled



Customer Managed Cloud (CMC) (*2024)

Container

Yes

Enabled



MCP (MicroStrategy Cloud Platform)

VM

Yes

Enabled



 * Future planned releases


2. Design

2100590214023959015168411Untitled
Diagram-1772006818860.drawio1212https://microstrategy.atlassian.net/wikiUntitled
Diagram-1772006818860.drawio01780.51150.5


2.1 System Design

When the report exceeds the maximum number of rows or encounters other
manipulation errors, the instance becomes broken and any subsequent
manipulations can no longer be executed. The issue notes that clicking the
cancel button forcibly navigates to the Library home page. However, even if we
hide the cancel button, users still cannot perform any manipulations.

The solution is to go back to pause mode and display a clear error message to
remind users how to avoid this error when we switch to execution mode and
encounter an error. Both server and client SE are working on the detailed
solution spike.

Error workflow:

2100591223215159015168411Untitled
Diagram-1772087677051.drawio66https://microstrategy.atlassian.net/wikiUntitled
Diagram-1772087677051.drawio0743.6543352785363481


2.2 Components

List and describe the major components and/or services of this feature.  This
should cover all parts of the platform that will need to be modified to support
the feature. Examples may include Class Diagram, Component Diagrams etc.

Scenario

Failed request

Issue/Special handle

Solution

Pause mode → Click "Resume Data Retrieval"

rebuildDocument manipulation with error

POST /api/documents/{id}/instances/{instanceId}/manipulations

 * Issue 1 Click “Resume Data retrieval” again or undo/redo hanging without
   request
   [https://microstrategy.atlassian.net/wiki/spaces/~yuanli/pages/5901516841/BCIN-6709+Improve+the+behavior+for+end+user+to+allow+continued+operations+on+report+in+Library+after+error+happens.#Issue-1-Click-%E2%80%9CResume-Data-retrieval%E2%80%9D-again-or-undo%2Fredo-hanging-without-request]

 * Issue 2 Undo redo reset
   [https://microstrategy.atlassian.net/wiki/spaces/~yuanli/pages/5901516841/BCIN-6709+Improve+the+behavior+for+end+user+to+allow+continued+operations+on+report+in+Library+after+error+happens.#Issue-2-Undo-redo-reset]

 * Issue 3 Error empty report-editor-grid
   [https://microstrategy.atlassian.net/wiki/spaces/~yuanli/pages/5901516841/BCIN-6709+Improve+the+behavior+for+end+user+to+allow+continued+operations+on+report+in+Library+after+error+happens.#Issue-3-Error-empty-report-editor-grid]

newGreen Back to Pause mode with all previous manipulations.

If the error caused by Modeling service maninpulation, clear undo/redo history
list.

If the error caused by normal maninpulation, keep undo/redo history list.

https://microstrategy.atlassian.net/wiki/spaces/~yuanli/pages/5901516841/BCIN-6709+Improve+the+behavior+for+end+user+to+allow+continued+operations+on+report+in+Library+after+error+happens.#2.3.2-Recreate-server-instance-without-resolve-prompt
[https://microstrategy.atlassian.net/wiki/spaces/~yuanli/pages/5901516841/BCIN-6709+Improve+the+behavior+for+end+user+to+allow+continued+operations+on+report+in+Library+after+error+happens.#2.3.2-Recreate-server-instance-without-resolve-prompt]

BCIN-974 [https://strategyagile.atlassian.net/browse/BCIN-974]

 1. Modeling service request success

 2. updateTemplate manipulation success

 3. rebuildDocument manipulation with error



Running mode manipulation

 1. Modeling service request success

 2. rebuildDocument manipulation with error

 * Issue 2 modeling service manipulation reset undo redo
   [https://microstrategy.atlassian.net/wiki/spaces/~yuanli/pages/5901516841/BCIN-6709+Improve+the+behavior+for+end+user+to+allow+continued+operations+on+report+in+Library+after+error+happens.#Issue-2-modeling-service-manipulation-reset-undo-redo]

 * Issue 3 Judge modeling service manipulation
   [https://microstrategy.atlassian.net/wiki/spaces/~yuanli/pages/5901516841/BCIN-6709+Improve+the+behavior+for+end+user+to+allow+continued+operations+on+report+in+Library+after+error+happens.#Issue-3-Judge-modeling-service-manipulation]

BCIN-974 [https://strategyagile.atlassian.net/browse/BCIN-974]

 1. Modeling service request success

 2. updateTemplate manipulation with error

Issue 4 Click "Resume Data retrieval" – Issue: Can’t revert manipulation in UI

 * Issue 4 Can’t undo crashed manipulation
   [https://microstrategy.atlassian.net/wiki/spaces/~yuanli/pages/5901516841/BCIN-6709+Improve+the+behavior+for+end+user+to+allow+continued+operations+on+report+in+Library+after+error+happens.#Issue-4--Can%E2%80%99t-undo-crashed-manipulation]

normal manipulation with error

POST /api/documents/{id}/instances/{instanceId}/manipulations

 * Issue 1 document-view still grid view, not update to pause mode empty view
   [https://microstrategy.atlassian.net/wiki/spaces/~yuanli/pages/5901516841/BCIN-6709+Improve+the+behavior+for+end+user+to+allow+continued+operations+on+report+in+Library+after+error+happens.#Issue-1-document-view-still-grid-view%2C-not-update-to-pause-mode-empty-view]

Prompt, reprompt and

prompt in prompt

 1. Answer prompt success

 2. Get instance with error

GET /api/dossiers/{dossierId}/instances/{dossierInstanceId}



existing for server side

newGreen for Library web

Keep the previous mode and go back to the prompt with the previous prompt
answers

https://microstrategy.atlassian.net/wiki/spaces/~yuanli/pages/5901516841/BCIN-6709+Improve+the+behavior+for+end+user+to+allow+continued+operations+on+report+in+Library+after+error+happens.#2.3.3-Recreate-server-instance-and-back-to-prompt
[https://microstrategy.atlassian.net/wiki/spaces/~yuanli/pages/5901516841/BCIN-6709+Improve+the+behavior+for+end+user+to+allow+continued+operations+on+report+in+Library+after+error+happens.#2.3.3-Recreate-server-instance-and-back-to-prompt]

Modeling service maninpulation fail

Modeling service request with error

PUT /api/model/reports/{reportId}

Click "Resume Data retrieval" again, the doc-view not update

UpdateYellow Keep the previous mode and state, handle grid view can display
normally.

The document instance is not crashed, can continue to do manipulations. Don’t
need to recreate document instance.

2.2.1 PAUSE MODE CLICK "RESUME DATA RETRIEVAL" FAIL ERROR WITH CRASHED INSTANCE





When you click "Resume Data retrieval", it will trigger

POST rebuildDocument manipulation POST
"/{id}/instances/{instanceId}/manipulations"

wide760

rebuildDocument manipulation fail error:

jsonwide760wide4000

After click the “OK“, user would back to

ISSUE 1 CLICK “RESUME DATA RETRIEVAL” AGAIN OR UNDO/REDO HANGING WITHOUT REQUEST



mojo/js/source/vi/VisualInsightAppBase.js?v=1762321932356
[http://localhost:8001/MicroStrategyLibrary/javascript/mojo/js/source/vi/VisualInsightAppBase.js?v=1762321932356]

mojojs/production/code/mojo/js/source/ServerProxy.js, the holdRequests will be
true, since the previous request with error make existingRequests is true.

wide760

So after the new revert manipulation, should call
mstrApp?.serverProxy?.cancelRequests?.(); to clean all existingRequests

jswide760jswide760

Solution:

/react-report-editor/production/src/store/shared/shared-recover-from-error.ts
reCreateReportInstanceThunkHelper

wide833

ISSUE 2 UNDO REDO RESET



After call `mstrApp?.serverProxy?.cancelRequests?.(); `, it will trigger
complete cmdMgr.reset();

production/code/mojo/js/source/vi/controllers/RootController.js

jswide760

Solution: Add isReCreateReportInstance to control whether to reset undo/redo
list.

When it is modeling service manipulation, isReCreateReportInstance is false,
when complete it will reset undo/redo list.

When it is a normal manipulation, isReCreateReportInstance is true, when
complete, it will keep undo/redo list.

production/code/mojo/js/source/vi/controllers/RootController.js

wide760

production/code/mojo/js/source/vi/controllers/UICmdMgr.js

wide760

react-report-editor/production/src/utils/undo-redo-util.ts

wide760

/react-report-editor/production/src/store/doc-view-slice/doc-view-slice.ts
reCreateReportInstanceThunkHelper

wide833

ISSUE 3 ERROR EMPTY REPORT-EDITOR-GRID



production/src/components/report-editor/report-editor.tsx

wide760

production/src/components/document-view/document-view.tsx

<div id="mojo-report"></div>

intial:

revert - document-view - useEffect, stid: 0
document-view.js:96 LYK: DocumentView useEffect - preparationStatus: 2
isMstrAppStarted: true isInitialDataLoaded: true msgId:
43AE71795F41F19586739B983BDA2DFE

revert - document-view - useEffect, stid: 0
document-view.js:96 LYK: DocumentView useEffect - preparationStatus: 2
isMstrAppStarted: false isInitialDataLoaded: true msgId:
43AE71795F41F19586739B983BDA2DFE

MojoDocViewHelper.createMstrApp

Solution: Add new <ReCreateErrorCatcher



Don’t make document-view.tsx rerender, once rerender it will render as

<div class="">

<div id="mojo-report"></div>

</div>

After useEffect of document-view.tsx, mojo will replace <div
id="mojo-report"></div> to <div id="mstr61"> ... </div>

wide760

So create new <ReCreateErrorCatcher as the child of document-view.tsx

wide760



2.2.2 RUNNING MODE MANIPULATION FAIL WITH ERROR AND CRASHED INSTANCE

REQUEST ERROR OF ADVANCED PROPERTIES

lyk BCIN-6922 normal report:
http://localhost:8001/MicroStrategyLibrary/app/config/A1C7555FE67448E7B5464FC574D4482C/B7CA92F04B9FAE8D941C3E9B7E0CD754/B30381168A4907792593F5BCAD03AE4A/edit
[http://localhost:8001/MicroStrategyLibrary/app/config/A1C7555FE67448E7B5464FC574D4482C/B7CA92F04B9FAE8D941C3E9B7E0CD754/B30381168A4907792593F5BCAD03AE4A/edit]

 1. Click "Resume Data retrieval"

 2. File → Report Properties → Advanced Properties → Results Set Row Limit

 3. Modify Results Set Row Limit to <=300 → Done

 4. Error here



1 modify Advanced Properties [Modeling service request success]

PUT
https://tec-l-1183620.labs.microstrategy.com/MicroStrategyLibrary/api/model/reports/B30381168A4907792593F5BCAD03AE4A?showExpressionAs=tree&showAdvancedProperties=true
[https://tec-l-1183620.labs.microstrategy.com/MicroStrategyLibrary/api/model/reports/B30381168A4907792593F5BCAD03AE4A?showExpressionAs=tree&showAdvancedProperties=true]
payload:

wide760

2 rebuildDocument manipulation with error

POST
https://tec-l-1183620.labs.microstrategy.com/MicroStrategyLibrary/api/documents/B30381168A4907792593F5BCAD03AE4A/instances/31781C2EE04EE6A9C4E05781F189FA11/manipulations
[https://tec-l-1183620.labs.microstrategy.com/MicroStrategyLibrary/api/documents/B30381168A4907792593F5BCAD03AE4A/instances/31781C2EE04EE6A9C4E05781F189FA11/manipulations]

jsonwide760



ISSUE 1 DOCUMENT-VIEW STILL GRID VIEW, NOT UPDATE TO PAUSE MODE EMPTY VIEW



Running mode manipulation error fix 1 rerender doc view
[https://github.com/mstr-modules/react-report-editor/commit/c94e8921dea3bf6ac907d3169e63d8a17f65a246]

Solution:

Add reportError.reRenderDocView to mark whether to rerender document-view.

jswide874

We will handle it inside the callback of the error handler.

Set mstrApp.appState to DEFAULT to rerender doc view correctly

jswide894

ISSUE 2 MODELING SERVICE MANIPULATION RESET UNDO REDO

Running mode manipulation error fix 2 resetUndoRedo for modify advanc…
[https://github.com/mstr-modules/react-report-editor/commit/934819760ed2dd806af71be76b982697f08cd494]

Modeling service request function

in react-report-editor/production/src/service/service.ts

POST

 * createNewReport: proxy.post('/model/reports?...') → service.ts:140

 * createInstance: proxy.post('/model/reports/${reportId}/instances...') →
   service.ts:149

 * createInstanceFromTemplate:
   proxy.post('/model/reports/${reportId}/instances...') → service.ts:162

 * createInstanceFromMDXCube:
   proxy.post('/model/reports/${reportId}/instances...') → service.ts:171

 * createInstanceWithLink:
   proxy.post('/model/reports/${reportId}/instances?...') → service.ts:190

 * saveInstance: proxy.post('/model/reports/${reportId}/instances/save') →
   service.ts:245

 * validateExpression
   proxy.post('/model/reports/${reportId}/${entry}/expression/validate') →
   service.ts:408

PUT

 * modifyReportDefinition: proxy.put('/model/reports/${reportId}?...') →
   service.ts:223

modifyReportDefinition

 * join-menu.tsx:121：When UI click join type, dispatch(modifyReportDefinition({
   reportDef: newAdvProp, isAdvanced: true }))

 * filter-slice.ts:194-206：updateReportDefinition thunk
   dispatch(modifyReportDefinition({ reportDef }))（used to write back the filter
   changes to reportDef）

 * report-def-slice.ts:345-372：modifyReportDefinition thunk inner call
   service.modifyReportDefinition(...) send request

 * report-def-slice.ts:426：updateBaseTemplateUnits thunk call
   service.modifyReportDefinition(...)

 * report-property-slice.ts:156-163：updateReportProperties thunk call
   service.modifyReportDefinition(...)（update advancedProperties / template ）

Solution:

resetUndoRedo for all modeling service request

wide760

ISSUE 3 JUDGE MODELING SERVICE MANIPULATION

Running mode manipulation error fix 3 Judge whether isModelingService…
[https://github.com/mstr-modules/react-report-editor/commit/92537916450d11dc7ee07bf7437e42e8b80fb4d4]

 1. clearUndoRedo is used for modeling service manipulation，rebuildDocument is
    triggered by react-report-editor

 2. This case can’t be judged by clearUndoRedo，rebuildDocument is triggered by
    mojo
    
    1. modifyReportDefinition →
       proxy.put(`/model/reports/${reportId}?showExpressionAs=tree${advancedQuery}`

Solution:

Add new isModelingServiceManipulation in doc-view-slice.

wide760wide760

And in the final set isModelingServiceManipulation back to false.

jswide760

ISSUE 4 CAN’T UNDO CRASHED MANIPULATION

 * revert undo and back to pause mode

 * The new added ”User Entity Type” isn’t in UI, so user can’t remove ”User
   Entity Type” from report

 * Click "Resume Data retrieval" again

Solution:

Need to update report data for report objects after the undo stid=”-1” sucess:

jswide760

2.2.3 PROMPT ANSWER APPLY ERROR - PAUSE 2 RUN + REPROMPT [LIBRARYWEB]





REQUEST PAUSE TO RUN - PROMPT

1 answer prompt

POST
http://localhost:8001/MicroStrategyLibrary/api/documents/270FE2FE074579251CF4D4AE1A76A328/instances/A8100F89544409C0B4D39F8A43DCE800/promptsAnswers
[http://localhost:8001/MicroStrategyLibrary/api/documents/270FE2FE074579251CF4D4AE1A76A328/instances/A8100F89544409C0B4D39F8A43DCE800/promptsAnswers]

2 get instance

GET
http://localhost:8001/MicroStrategyLibrary/api/dossiers/270FE2FE074579251CF4D4AE1A76A328/instances/A8100F89544409C0B4D39F8A43DCE800?includeTOC=true&includeShortcutInfo=false&excludeData=true
[http://localhost:8001/MicroStrategyLibrary/api/dossiers/270FE2FE074579251CF4D4AE1A76A328/instances/A8100F89544409C0B4D39F8A43DCE800?includeTOC=true&includeShortcutInfo=false&excludeData=true]

jsonwide4000



REQUEST - REPROMPT

1 repropmt

POST
http://localhost:8001/MicroStrategyLibrary/api/documents/270FE2FE074579251CF4D4AE1A76A328/instances/2D733DA6734CE0185C32FA82AAE5ED00/rePrompt
[http://localhost:8001/MicroStrategyLibrary/api/documents/270FE2FE074579251CF4D4AE1A76A328/instances/2D733DA6734CE0185C32FA82AAE5ED00/rePrompt]

response

{"mid":"D3DAA2320A43ED8A021221A01F1ABC8E"}

2 Get instance

GET
http://localhost:8001/MicroStrategyLibrary/api/dossiers/270FE2FE074579251CF4D4AE1A76A328/instances/D3DAA2320A43ED8A021221A01F1ABC8E
[http://localhost:8001/MicroStrategyLibrary/api/dossiers/270FE2FE074579251CF4D4AE1A76A328/instances/D3DAA2320A43ED8A021221A01F1ABC8E]

response : {…, PromptEditor:{…}}

3 answer prompt

POST
http://localhost:8001/MicroStrategyLibrary/api/documents/270FE2FE074579251CF4D4AE1A76A328/instances/A8100F89544409C0B4D39F8A43DCE800/promptsAnswers
[http://localhost:8001/MicroStrategyLibrary/api/documents/270FE2FE074579251CF4D4AE1A76A328/instances/A8100F89544409C0B4D39F8A43DCE800/promptsAnswers]

4 get instance

GET
http://localhost:8001/MicroStrategyLibrary/api/dossiers/270FE2FE074579251CF4D4AE1A76A328/instances/A8100F89544409C0B4D39F8A43DCE800?includeTOC=true&includeShortcutInfo=false&excludeData=true
[http://localhost:8001/MicroStrategyLibrary/api/dossiers/270FE2FE074579251CF4D4AE1A76A328/instances/A8100F89544409C0B4D39F8A43DCE800?includeTOC=true&includeShortcutInfo=false&excludeData=true]

jsonwide760

BIWeb/BIWebSDK/code/java/src/com/microstrategy/utils/localization/WebAPIErrors.properties

wide4000jswide1011

ERROR TRANSFORM

production/src/react/src/modules/prompt/promptActionCreators.js ::
applyPromptAnswers

Mark error.applyReportPromptAnswersFailure to true, to make library web only
handle authoring mode prompt answering error.

jswide1800

production/src/react/src/services/transforms/ErrorObjectTransform.js

jswide1800

CANCEL FOR PROMPT, REPROMPT AND PROMPT IN PROMPT

cancelPromptAnswersAndBackToPrompt1800js


2.3 Data Model

2.3.1 I-SERVER

26.04 | Improve error for report editor

2.3.2 RECREATE SERVER INSTANCE WITHOUT RESOLVE PROMPT

Undo with stid=”-1” and back to pause mode

Send <rfrs exef= append DssXmlDocExecutionResolve stid="-1" <os>8</os> without
<ri

For example: <rfrs exef="163844" stid="-1" <os>8</os> without <ri

 1. noActionMode: true      exet but <rfrs don’t have exet attribute, so use 
     <os>8<os> to set servier side:   noActionMode: true      no data 

 2. resolveExecution: true         exef  DssXmlDocExecutionResolve   whether to
    calculate prompt in server side, true: no prompt, false: popup prompt
    (similar to resolveOnly, but resolveOnly is not used in
    https://github.com/mstr-kiai/biweb/blob/m2021/BIWebSDK/code/java/src/com/microstrategy/web/objects/RWManipulationImpl.java#L1198
    [https://github.com/mstr-kiai/biweb/blob/m2021/BIWebSDK/code/java/src/com/microstrategy/web/objects/RWManipulationImpl.java#L1198]
    )

noActionMode: true && resolveExecution: true              no data no prompt

admin-rest: PUT or POST "/{id}/instances/{instanceId}/manipulations"

wide760

BIWebSDK:

javawide1800

Server: xml command:

wide4000

2.3.3 RECREATE SERVER INSTANCE AND BACK TO PROMPT

Currently when applying prompt answer, server-side will substitute prompt, the
state id won’t be increased, and there’s no correpsonding deltaxml stands for
the reverse operation, so it does not support reverse undo. Need to go with
normal undo which will replay the manipulation to the stid client sends in
'rfrs' cmd.

back to prompt send <ri with <rfrs with <os> 5</os> (killJob=true,
isCancelPromptAnswer=true, isCancelPrompt=false)

 * [client change] Send ri with 'fg' = 32768(DssXmlInboxDeleteOnlyGetJobList)
   only.

 * [client change] Send 'rfrs' with <os>5</os>. The refresh command uses exef =
   32772
   (DssDocumentExecuteXML（0x4） + DssDocumentExecuteUpdateRWDCache（0x8000）)

 * The Cancel Prompt workflow uses a refresh operation to roll back state.

 * During refresh, the server re-creates the document instance.

 * <os> 5</os> when "killJob": true && "isCancelPromptAnswer": true

admin-rest: POST "/{id}/instances/{instanceId}/manipulations"

jsonwide760

BIWebSDK:

javawide1800

Server: xml command

xmlwide1800


2.4 APIs

2.4.1 API CHANGES SUMMARY

Describe summary of all APIs and/or SDKs being added as part of this feature and
provide a link to the API specification. REST APIs should follow the REST API
design guidelines and MUST provide an Open API specification (a.k.a. swagger
definition). Alternatively, you can embed the OpenAPI Spec collection to
simplify the documentation steps as described here (Swagger UI in Confluence -
https://microstrategy.atlassian.net/wiki/spaces/TECToolsSDK/pages/3383263456/Swagger+UI+in+Confluence)

Sample format for API Changes1800

Create a child page/subpage under the main design page using the appropriate
template for each API. These templates need to be imported in the same way this
Engineering Feature Design template is imported.

 * For DELETE API: Use template Subsection for DELETE API

 * For GET API: Use template Subsection for GET API

 * For PATCH API: Use template Subsection for PATCH API

 * For POST API: Use template Subsection for POST API

 * For PUT API: Use template Subsection for PUT API

Section

API (Create a child page/subpage under the main design page using the
appropriate template for each API)

Change (Added/Updated/Deprecated/Deleted)

API Access

Public (External Access)

Private (Internal Only Access )

Description

(If these are legacy tasks API and not REST, add further details in description)

2.4.1. 1

POST "/{id}/instances/{instanceId}/manipulations"

Updated

Public

Add a new value reCreateInstance inside payload:

json

2.4.1.3

PUT "/{id}/instances/{instanceId}/manipulations"

Updated

Public

Code changes: https://github.com/mstr-kiai/biweb/compare/m2021...revertReport
[https://github.com/mstr-kiai/biweb/compare/m2021...revertReport]

BIWebSDK/code/java/src/com/microstrategy/web/objects/RWManipulationBuilder.java

javawide1800



2.4.2 WORKFLOW INTEGRATION

Describe how we intend to use the API(s) for this feature. Include details:

 * Integration Across Services - Add a Sequence diagrams of APIS to be executed
   in a defined order with integration across services such as Workstation,
   Library, Server etc. to execute required workflow.

 * Integration based on Personas (ex. Admin, analyst, developer) - Identify
   major workflows as per the UX, and incorporate those workflow in the Sequence
   Diagram based on Personas.



<add Sequence Diagram>


3. Non-functional requirements (NFRs)
[https://github.microstrategy.com/pages/kiai/developers-guide/#Non-functional-Requirements]


3.1 Security 🔗 Best Practices
[https://github.microstrategy.com/pages/kiai/developers-guide/#Secure-Engineering]

Are there any security implications related to this feature? Such as encryption,
secure data at rest, secure API, and others. Highlight any security risks that
we can identify. 

Note: Do not modify the checklist. Please, select the options as applicable.
Further details should be provided in the "DETAILS" section based on the
selection. This is applicable for all following sections.

Review of SELECTION is MANDATORY for design approval. They are moved under
“Expand” Section to improve readability.



SELECTION

Expand and select from options1800 1132 1401fd04-f2e4-41cd-a91a-eec914db010d
incomplete Review Data at Rest 1133 06c12fd1-d0a2-4bd1-bc00-be5342bfcf9b
incomplete Feature doesn’t change/impact Security of Data at Rest as No
changes/introduction of sensitive data or configuration 1134
ac2a5b57-a6e4-46c8-83e6-17ce79d3d122 incomplete Feature impacts Security of Data
at Rest 1135 77c39719-9f56-497b-b2c9-9fbfdae1d17e incomplete Details have been
provided explaining how Data is Stored Securely (ex. Encryption) 1136
23ce679d-d1a3-4aed-abd0-2987333620ec incomplete Sensitive Data is being stored
in DB 1137 e3f239b2-a5ca-4d0d-aabc-843e6866226d incomplete Sensitive Data is
being stored in FileSystem (ex. New Config file , or additional configurations
data added to existing Config file) 1138 013ffa90-ac98-4f08-bc4f-b6e22f353f5a
incomplete Sensitive Data is being stored on Client (Browser / Mobile /
Workstation etc.) File Systems / Local Storage 1139
ed93394c-6c32-4d47-baf2-4313666a37d5 incomplete Data Access controlled through
Privileges 1140 6f980d35-e1c8-40ad-a4ea-6ea310986f6e incomplete Review Data in
Transit 1141 dd306cf5-f9f2-418d-bee6-813e958ea769 incomplete Feature doesn’t
change/impact Security of Data in Transit (This is not normal) 1142
1a59c919-0696-410d-b002-0ef580fb3019 incomplete Feature impacts Security of Data
in Transit 1143 3c33a8a8-53ec-40e7-b129-ab4c0f38290d incomplete New Services
(MicroServices) or Backend Jobs are Introduced 1144
54e8d441-0c98-41be-b9c1-27026a37a82f incomplete New APIs are Introduced , or New
Code is being introduced which processes User Supplied Data 1145
a11025c3-ec2d-4553-a202-7a2e980f3326 incomplete Security best practices are
being applied (Data Validation, Encoding, etc. ) and described in API Section or
in the details below 1146 a25a7a3e-2060-4610-bb14-28e8358b86a4 incomplete
Changes in Client Tools/Components which calls External services 1147
222ca81d-3dc2-4476-9636-45b48052ed13 incomplete Security best practices are
being applied (Data Validation, Encoding, etc. ) and described in API Section or
in the details below 1148 fa4024a4-2bf2-4a00-ae67-0ae3d6fe4a53 incomplete Review
Input Data Validation and Output Data Sanitization 1149
59b8517e-186c-4c2d-9107-9cf93f145071 incomplete Review Authentication 1150
4c47e9c5-741f-4c34-9d1b-76526087724b incomplete Feature introduces APIs which
are publicly accessible without requiring authentication (This is not normal)
1151 61e2fb4c-4601-4477-b90c-919ac7170a7c incomplete Feature APIs requires User
Authentication 1152 e8a8bd54-55d5-46bc-8e2f-d03b4b9dda00 incomplete New
MicroService has been introduced 1153 b54c7f79-23fa-4070-9f5e-85dc453ff0af
incomplete Service to Service Authentication details have been provided 1154
5392542a-a9f8-47ec-be9b-2f410269dff8 incomplete Database Service / Connection
has been introduced 1155 f942adb6-0e68-49bc-81be-557191f09f51 incomplete
Database access follows Principle of Least Privileges, and details have been
documented 1156 a56d031c-ad2a-49c3-b56a-43124106bef2 incomplete Encryption
details for the DB connection has been provided, and connection will be
encrypted (TLS) by default 1157 f689e42d-25b4-44d3-8cf8-7550a2896685 incomplete
Review Authorization 1158 26125e70-41aa-4843-96f7-ee002ab326e7 incomplete
Details for Role based access and error handling has been provided



DETAILS

Add details based on the selection above


3.2 Scalability 🔗 Best Practices
[https://github.microstrategy.com/pages/kiai/developers-guide/#Non-functional-Requirements]

What are the scalability requirements of the feature? Such as data volume,
response time, concurrency, resource constraints, and others. 



SELECTION

Expand and select from options1800 1159 63292b66-751f-4994-89e5-5307dbb99224
incomplete Review Scalability 1160 2d8bc3d1-bf6c-4b0f-b1fd-4b8c196b579e
incomplete Synchronous vs Asynchronous execution details has been documented
1161 63fb0468-5e42-4933-b399-9167e3ed9a5e incomplete Horizontal Scaling is
supported 1162 3e3bef4f-a899-4eeb-9fec-2e341799eb11 incomplete Data Volume



DETAILS

Add details based on the selection above


3.3 Performance & Stability 🔗 Best Practices
[https://github.microstrategy.com/pages/kiai/developers-guide/#Non-functional-Requirements]

What are the performance targets for this feature? Please describe any potential
performance impacts and how the design will mitigate them. ex. How many requests
are expected and what’s the expected response time? This includes information
about supporting high-availability and disaster recovery if applicable

SELECTION

Expand and select from options1800 1163 b572f5c1-5238-4932-a413-4300abf4a11e
incomplete Review Performance Criteria 1164 0e1b5f22-3dc0-4efa-8b4d-a8bb5f5bb694
incomplete Documentation has been provided with details on Performance
expectations specified in the feature



DETAILS

Add details on how the implementation meets the performance criteria




3.4 Error and exception handling 🔗 Best Practices
[https://github.microstrategy.com/pages/kiai/developers-guide/#Non-functional-Requirements]

REPORT ERROR TYPES

ErrorCode

ErrorType

Severity

Title (key → en-US)

Heading (key → en-US)

Message (key → en-US)

Details

isAnalyticalEngineError

AnalyticalEngineErrorType

restartApp





LOGIN

INFO

authError → “Authentication Error”

—

loginFailedMessage → “Unable to log in to the server, please check your
credentials and try.”

undefined

false

—

false



ERR003

AUTHENTICATION

INFO

authError → “Authentication Error”

—

sessionTimeoutMessage → “Your session has timed out.”

undefined

false

—

false



ERR001

APPLICATION (exceed rows)

INFO

appError → “Application Error”

—

exceedRowsMessage → “You've exceeded the maximum number of rows the server can
return, please change your data.”

undefined

false

—

false

ERR001

APPLICATION (unsupported report type)

INFO

appError → “Application Error”

cannotOpenReport → “Report cannot be opened.”

unsupportedReportType → “This report type is not supported.”

error.stack ?? error.message

false

—

false

'Maximum number of results rows per report exceeded the current limit'



revert report error types

revert report error types

revert report error types





TYPE_ERROR

CRITICAL

appError → “Application Error”

—

typeErrorMessage → “An error has occurred in the application's code, please
report this to an administrator.”

error.stack ?? error.message

false

—

false





REFERENCE

CRITICAL

appError → “Application Error”

—

referenceErrorMessage → “React has failed to render.”

error.stack ?? error.message

false

—

false



ERR004

RESOURCE_NOT_FOUND

ERROR

serverError → “Server Error”

—

resourceNotFoundMessage → “The server failed to return the requested object.
Please see the details for more information.”

error.stack ?? error.message

false

—

false



ERR008

MSG_RESULT_NOT_READY

ERROR

serverError → “Server Error”

—

messageResultNotReadyMessage → “An error has occurred while sending a server
action. Please reopen the report and try again.”

undefined

false

—

false





UNKNOWN (default/fallback)

WARNING

notification → “Notification”

—

unknownErrorMessage → “An unknown error has occurred.”

error.stack ?? error.message

false

—

false





ENGINE_ERROR (code 8004da08 or 8004da0b)

WARNING

serverError → “Server Error”

cannotOpenReport → “Report cannot be opened.”

unsupportedReportType → “This report type is not supported.”

firstError.message

true

REPORT_TYPE

false





ENGINE_ERROR (code 8004da22 or 8004da65)

WARNING

serverError → “Server Error”

—

analyticalEngineFailedMessage → “The analytical engine failed to process this
report.”

firstError.message

true

ACTION_FAILED

true

revert report error types 8004da65



ENGINE_ERROR (code 8004da03)

WARNING

serverError → “Server Error”

—

analyticalEngineFailedMessage → “The analytical engine failed to process this
report.”

firstError.message

true

DUPLICATE

false





ENGINE_ERROR (analytical code unknown / not mapped)

WARNING

serverError → “Server Error”

—

analyticalEngineFailedMessage → “The analytical engine failed to process this
report.”

firstError.message

true

UNKNOWN

false



ERR001

API_ERROR_CODE_MAP.ERR_APPLICATION

Library web prompt error





serverError → “Server Error”

error.title = svrErr; error.icon = 'server';



error.desc = IntlUtils.formatMessage(1390, 'One or more datasets are not loaded
for this item.');

error.message=

false





'Maximum number of results rows per report exceeded the current limit'





3.4.1 SYSTEM ERRORS (EX. APPLICATION CRASHES, RESTART, TIMEOUT, NETWORK SLOWNESS
OR OFFLINE MODE)

BCEN-4843 'MAXIMUM NUMBER OF RESULTS ROWS PER REPORT EXCEEDED THE CURRENT LIMIT'

https://microstrategy.atlassian.net/wiki/spaces/~yuanli/pages/edit-v2/5901516841#2.2.1-Pause-mode-Click-%22Resume-Data-retrieval%22-fail-error-with-crashed-instance
[https://microstrategy.atlassian.net/wiki/spaces/~yuanli/pages/edit-v2/5901516841#2.2.1-Pause-mode-Click-%22Resume-Data-retrieval%22-fail-error-with-crashed-instance]

https://microstrategy.atlassian.net/wiki/spaces/~yuanli/pages/edit-v2/5901516841#2.2.2-Running-mode-manipulation-fail-with-error-and-crashed-instance
[https://microstrategy.atlassian.net/wiki/spaces/~yuanli/pages/edit-v2/5901516841#2.2.2-Running-mode-manipulation-fail-with-error-and-crashed-instance]

https://microstrategy.atlassian.net/wiki/spaces/~yuanli/pages/edit-v2/5901516841#2.2.3-Prompt-answer-apply-error---pause-2-Run-%2B-Reprompt-%5BLibraryweb%5D
[https://microstrategy.atlassian.net/wiki/spaces/~yuanli/pages/edit-v2/5901516841#2.2.3-Prompt-answer-apply-error---pause-2-Run-%2B-Reprompt-%5BLibraryweb%5D]

BCIN-6485 REMOVE FROM REPORT WHICH ALREADY USED IN FILTER[MODELING SERVICE
ERROR]

BCIN-6485dbec92f5-caa5-3227-a246-185a23663d18Strategy Jira

https://tec-l-1183620.labs.microstrategy.com/MicroStrategyLibrary/app/B7CA92F04B9FAE8D941C3E9B7E0CD754/C53926FAD04AEBC336C1C1BAE395B142/K53--K46/edit
[https://tec-l-1183620.labs.microstrategy.com/MicroStrategyLibrary/app/B7CA92F04B9FAE8D941C3E9B7E0CD754/C53926FAD04AEBC336C1C1BAE395B142/K53--K46/edit]



PUT modeling service error

https://tec-l-1183620.labs.microstrategy.com/MicroStrategyLibrary/api-docs/index.html?visibility=all#/Reports/ms-putReport
[https://tec-l-1183620.labs.microstrategy.com/MicroStrategyLibrary/api-docs/index.html?visibility=all#/Reports/ms-putReport]

http://localhost:8001/MicroStrategyLibrary/api/model/reports/C53926FAD04AEBC336C1C1BAE395B142?showExpressionAs=tree&showAdvancedProperties=true
[http://localhost:8001/MicroStrategyLibrary/api/model/reports/C53926FAD04AEBC336C1C1BAE395B142?showExpressionAs=tree&showAdvancedProperties=true]

payload:760json

response error:

jsonwide760wide760wide760

BCIN-974 [https://strategyagile.atlassian.net/browse/BCIN-974] QUERYENGINE
ENCOUNTERED ERROR: A CARTESIAN JOIN …

Test object: BCIN-974 Report
http://localhost:8001/MicroStrategyLibrary/app/61ABA574CA453CCCF398879AFE2E825F/8CE78A5A5D4ECD0C241EAA8516495ACE/edit
[http://localhost:8001/MicroStrategyLibrary/app/61ABA574CA453CCCF398879AFE2E825F/8CE78A5A5D4ECD0C241EAA8516495ACE/edit]

Steps:

 * Click "Resume Data retrieval"

 * Add “User Entity Type“ attribute

POST updateTemplate manipulations

http://localhost:8001/MicroStrategyLibrary/api/documents/8CE78A5A5D4ECD0C241EAA8516495ACE/instances/78ABA16BFA40EFEDCC92B5BE50CB8F81/manipulations
[http://localhost:8001/MicroStrategyLibrary/api/documents/8CE78A5A5D4ECD0C241EAA8516495ACE/instances/78ABA16BFA40EFEDCC92B5BE50CB8F81/manipulations]

payload:

jsonwide760

jsonwide760

BCIN-6706 SQL FAIL

BCIN-6706dbec92f5-caa5-3227-a246-185a23663d18Strategy Jira

test object: BCIN-6706, sql failed

http://localhost:8001/MicroStrategyLibrary/app/E8DCF814A44EEC23C5EB77A32C59716B/2333BC992E42F9AE77612B8A5EB354FD/K53--K46/edit
[http://localhost:8001/MicroStrategyLibrary/app/E8DCF814A44EEC23C5EB77A32C59716B/2333BC992E42F9AE77612B8A5EB354FD/K53--K46/edit]

Click "Resume Data retrieval",

POST
http://localhost:8001/MicroStrategyLibrary/api/documents/2333BC992E42F9AE77612B8A5EB354FD/instances/278DC760C645574DD417D9AFBBCA8679/manipulations
[http://localhost:8001/MicroStrategyLibrary/api/documents/2333BC992E42F9AE77612B8A5EB354FD/instances/278DC760C645574DD417D9AFBBCA8679/manipulations]

jsonwide760

rebuildDocument fail error:

wide760

BCEN-4129 MDX

BCEN-4129dbec92f5-caa5-3227-a246-185a23663d18Strategy Jira



EXECUTE QUERY FAILED ERROR TYPE: ODBC ERROR

report limit with category metric

jsonwide760

3.4.2 CONFIGURATION & DEPLOYMENT ERRORS (EX. INVALID/MISSING REQUIRED
CONFIGURATION)

N/A

3.4.3 USER OR FUNCTIONAL ERRORS (EX. INVALID/MISSING INPUT,
AUTHENTICATION/AUTHORIZATION ERROR)




3.5 Logging 🔗 Best Practices
[https://github.microstrategy.com/pages/kiai/developers-guide/#Logging]

Describe how the feature will adhere to the logging guidelines outline in the
MSTR developer guide. Note: The guidelines do not cover client-side logging
techniques, so if this is a UI-related feature please describe how you will
debug issues at runtime.



SELECTION

Expand and select from options1800 1165 6b3ed4b4-3929-43a9-b52f-d5302ef9b408
incomplete Review Selection 1166 e2e64153-5bec-4fb1-8e32-7bff750c6539 incomplete
Logging framework exist for the repository which meets the standards defined in
Developer Guide 1167 7322fb45-2093-4df7-8bee-2eae5ce114b5 incomplete Audit Logs
are created in separate config file and processed through Fluent bit
Configuration 1168 d9a23ef8-4f4a-453f-8abd-d8d773070fa7 incomplete Logging
Framework will be introduced. Stories are created in Rally. 1169
49c18ee8-a8dd-4e64-9063-69999696f2a6 incomplete New log files are introduced
1170 135cb4f9-661f-49e7-a9f7-c50545523cac incomplete Rally Stories are created
to process these Log files through Fluent bit Configuration. 



DETAILS

Add details based on the selection above




3.6 Monitoring
[https://github.microstrategy.com/pages/kiai/developers-guide/#Monitoring] &
Telemetry

Describe any feature specific Monitoring & Telemetry requirements. What are the
options available to monitor Application health?




3.7 Internationalization
[https://github.microstrategy.com/pages/kiai/developers-guide/#Internationalization]

Please describe how this feature will satisfy internationalization requirements.
Please refer to the Internationalization guidelines in the developers guide for
more details.


3.8 UI Component Considerations

This section covers UI related design aspects.

3.8.1 ACCESSIBILITY
[https://github.microstrategy.com/pages/kiai/developers-guide/#Accessibility]

If applicable please describe how this feature will satisfy accessibility
requirements. Please refer to the accessibility guidelines in the developers
guide for more details.

SELECTION

Expand and select from options1800 1171 6b80ea33-4112-42d9-903b-2906db3faf28
incomplete Review Selection 1172 5c080dcb-7f47-4dc5-ad19-937ede6dcf03 incomplete
Feature doesn’t have an impact on accessibility Requirements 1173
b3f30ca9-af5c-4fb1-b1e6-9b458e70ed89 incomplete Brief Justification has been
added 1174 92eaf341-cb7f-4be3-96c9-98a04f4dd5f0 incomplete Feature has an impact
on accessibility Requirements 1175 91277e42-ea57-45c9-a948-293ea4af4c99
incomplete Provide text alternatives for any non-text content (images, input
labels, frames) 1176 1a2d194e-cfab-4b7f-887a-d745936ff884 incomplete The reading
and navigation order (determined by code order) is logical and intuitive. 1177
e4bb6df6-5845-4f73-9a30-f8ab4dba5d0c incomplete Ensure programmatic events are
triggered by all UI activities 1178 9b18905f-cad6-40e6-aa58-eaec49989def
incomplete Ensure all UI correctly scales by any DPI setting and orientation
(responsive design) 1179 5fd2fb9e-7597-4a78-83ca-d8c7e0dcb442 incomplete Provide
keyboard interface for all UI elements and show the keyboard focus 1180
db240396-eb10-419b-af03-e9666c50b568 incomplete Ensure all the text elements in
the UI have a contrast ratio of at least 3:1 1181
e847de91-8c4f-4334-a67f-62c193953274 incomplete Provide users enough time to
read and use content (notifications, carousels can be stopped) 1182
4a7d748b-8aea-46b9-a475-148f13567f9c incomplete Do not design content in a way
that is known to cause seizures or physical reactions (flashing elements).

DETAILS

Add details based on the selection above

3.8.2 MICROSTRATEGY APPLICATION FEATURE
[https://ubiquitous-adventure-vr31okw.pages.github.io/#Application/overall]

Please evaluate the following considerations that might impact the Application
feature.

SELECTION

Expand and select from options1800 1183 e65aba95-bb6d-4fe9-b964-e5f6d1d7c912
incomplete Review Application Components Control
[https://ubiquitous-adventure-vr31okw.pages.github.io/#Application/UIComponents/componentsControl]
1184 ce5fd02e-9cc4-46a2-b73d-ff0bc680af9e incomplete The feature has new UI
components need to be show / hide controlled in application 1185
0e5e656b-d2df-4a74-bd2b-921dd84257ce incomplete Use existing application
properties to control the new UI components (Check Application Properties Table
[https://microstrategy-my.sharepoint.com/:x:/p/wjiang/EQ1gtSKo0fZGhNAgd7nADmABkHsNWboNqpqzPS0tMULNeg?e=eTqhmv])
1186 bc2023a4-5074-4771-9488-9fd24062d03b incomplete Add new application
properties to control the new UI components 1187
b697db29-d069-42db-8360-41b37f8f0045 incomplete Feature has impact on Library
Application Themes
[https://ubiquitous-adventure-vr31okw.pages.github.io/#Application/UIAppearance/libraryColorThemes]
(New UI Components added or existing components modified) 1188
3bbef140-7a1e-4208-a179-f9d6451144bf incomplete Application Theme should be
supported, and details are added. 1189 c16d6e08-0b83-4494-9a5e-01d890a23cb7
incomplete Application Theme is not required for the new UI Components, and a
brief justification is added 1190 2f9a5a34-4d91-4b63-8d2c-6ecc08909268
incomplete Other Case and a brief justification is added

DETAILS

Add details based on the selection above

3.8.3 EMBEDDING SDK IMPACTS
[https://ubiquitous-adventure-vr31okw.pages.github.io/#Embedding]

Describe the impacts to the Embedding SDK. Any updates the Embedding SDK group
should be aware of?

SELECTION

Expand and select from options1800 1191 9e32208f-b973-493a-9705-2afa8b3f8202
incomplete Review Selection 1192 88cec86c-d850-45a1-8d68-b201fda3f97e incomplete
The feature doesn’t introduce any change that may affect the OOTB MicroStrategy
Library 1193 fd12697c-56c0-4258-8dc4-a2364304725f incomplete The feature
introduces changes that may affect the OOTB MicroStrategy Library 1194
7e03c4f1-fa43-4d3e-89c7-c079e0133e2b incomplete CORS constraints
[https://ubiquitous-adventure-vr31okw.pages.github.io/Embedding/iframe.html?count=2#avoid-the-cors-errors]
cases are considered. 1195 7a9267f4-bfb2-41ee-a96f-0e616ddf4823 incomplete CSS
names
[https://ubiquitous-adventure-vr31okw.pages.github.io/Embedding.html?count=1#avoid-css-conflicts]
and data keys
[https://ubiquitous-adventure-vr31okw.pages.github.io/Embedding.html?count=3#avoid-the-data-conflicts-across-dossiers-and-pages]
are designed to avoid conflicts. 1196 5a76320c-3459-4757-adf4-39e90c70a244
incomplete The new UI layout supports responsive design and can be used as a
module
[https://ubiquitous-adventure-vr31okw.pages.github.io/Embedding.html?count=3#dont-rely-on-the-library-ui-assumptions]
that embedded in non-web/library containers. 1197
012e830d-a126-444b-9a68-9319870b5586 incomplete Component logic doesn’t consume
new global variables
[https://ubiquitous-adventure-vr31okw.pages.github.io/Embedding.html?count=3#do-not-introduce-new-global-variables-that-would-change-on-different-dossierspages]
or overwriting common Javascript APIs
[https://ubiquitous-adventure-vr31okw.pages.github.io/Embedding.html?count=3#dont-overwrite-common-javascript-apis].
1198 715f5dc0-9541-4ece-9627-c8b1e513387d incomplete The trigger time points of
the critical Library Redux actions
[https://ubiquitous-adventure-vr31okw.pages.github.io/Embedding.html?count=3#check-the-critical-redux-action-trigger-time-points]
are unchanged

DETAILS

Add details based on the selection above



3.8.4 PENDO

Considering Pendo for frontend features




3.9 Compatibility
[https://github.microstrategy.com/pages/kiai/developers-guide/#Non-functional-Requirements]

Are there any compatibility concerns or requirement with previous versions or
features?


3.10 Feature Flag

If applicable, provide information about how the feature will be
enabled/disabled. Especially when the feature or related features are developed
in multiple stages.   



SELECTION

Expand and select from options1800 1199 00d69e3c-2c13-4ae7-9b3e-c111b7ffee65
incomplete Review Selection 1200 48320c9f-0254-4424-9858-8e77d3e511c4 incomplete
Feature flag has been introduced based on Deployment Type 1201
bf21ee11-b3aa-4fa8-8a7b-37011c8d1fb0 incomplete Server side defaults
Configuration based on Deployment Type 1202 37a58d01-3f3a-46aa-abfe-ff3ac93a84fe
incomplete Details have been added to explain Logic, Defaults etc. 1203
46c8372e-fc01-491e-9a18-1a0f81324bac incomplete Client (Ex. Workstation) side
defaults configuration at Run Time based on Deployment Type Reported by
Server(Note: Should be avoided unless absolutely necessary) 1204
cbb9488c-4b66-4928-933f-9ef6df241abc incomplete Justification has been
documented 1205 47e8a17c-7c5d-4bc4-a275-4f7c964faed1 incomplete Feature Flag has
been introduced based on MicroStrategy Version (Note: Should be avoided unless
absolutely necessary) 1206 8540fb33-9056-414f-9740-7335913b1bc9 incomplete
Details have been added to explain Logic, Defaults, and deprecation etc. 1207
df08a352-b8b9-4a6f-825e-b1c32d2c0260 incomplete Feature flag has been introduced
to control end user visibility based on Configuration changes 1208
e87757a2-0f3f-4d28-b0bb-6ad5315040fe incomplete Client (Ex. Workstation)
specific feature flag to hide/show functionality 1209
f20df457-c7da-4ebf-9e2c-49e496f376e1 incomplete Feature flag isn’t required 1210
d64f0c48-4f50-49e0-8700-a7cbd49ce0ee incomplete Review Feature Flag Storage 1211
d8bf506c-9988-459a-a019-d6d11aff30fd incomplete Config File 1212
899e93cc-7dd4-4c6e-ae87-40df1a27a92a incomplete Database 1213
89656c54-9114-4d28-a444-2f61c3c2afcf incomplete NA



DETAILS

Add details based on the selection above




3.11 Administration and Configuration

Does the feature require any new administrative settings?  If so describe what
they are, how they would work and where the settings are stored.  If the
customer should be able to restrict who can modify these settings describe how
this restriction should be enforced (e.g. require certain access rights on
certain objects etc.)



SELECTION

Expand and select from options1800 1214 4c44953d-354c-4c86-833d-c91731d5f4a9
incomplete Review Selection 1215 0a3279f0-0e2d-4fcd-bf8c-8f4bea10e730 incomplete
Feature doesn’t introduce administrative settings 1216
5e883aea-cf8e-48e0-9e28-533f1fc8e706 incomplete Feature introduces
administrative settings 1217 2aaa520a-28db-4d86-b048-15f48885438d incomplete
Settings can be modified by Platform administrators only through Configuration
changes during deployment 1218 1510d5f9-859c-4f1e-9094-8a036c4af390 incomplete
Settings can be modified through UI / APIs by Admins or other Users 1219
dd7dc76b-ec43-48a8-bdf1-e72372ae4fcb incomplete Details have been added to
include File Location, Privileges , defaults etc. 1220
9cb220f9-a1f6-4e9b-8ee9-6108bc734237 incomplete Review Application Downtime
Selection 1221 e73c3724-71ab-402f-96d2-e89b7c5d7121 incomplete Some/All Changes
require Restart 1222 5d8936c9-5957-45d9-915b-91c56f337396 incomplete All Changes
are dynamically applied



DETAILS

Add details based on the selection above




3.12 CI / CD (Continuous Integration & Continuous Deployment) & DevSecOps

Describe impacts to CI/CD Process. Are there any changes in Container build or
Installer build process? Any updates devOps should be aware of?



SELECTION

Expand and select from options1800

Are you adding new Service/Repository?

1223 16bb0def-57a5-482e-b74c-6d531befa412 incomplete No 1224
c716857c-0e7b-48b7-914b-ebed3f5aae27 incomplete Yes  1225
65003e03-32b1-4b3e-a283-ebf2d57d24ec incomplete Feature doesn’t require adding
new GitHub Repository 1226 a52b57ed-cbb0-454f-a411-01fe0000f46a incomplete
Feature requires adding new GitHub repository(s) 1227
73627d73-b6bc-46dd-b1d7-adbd7473c98e incomplete Rally Stories are created to
setup CI Pipeline 1228 c8bd4e52-3b9b-4eb5-9a0f-ad1f4f736010 incomplete
Repository follows standard readme template 1229
0d3e6569-4cdc-40d3-a105-20980c21a8f2 incomplete Rally Stories are created for
Security Tools Integration (SonarQube, Veracode, CheckMarx, BlackDuck, Prisma)
1230 2e57218c-96c2-4df7-82e8-10a53de96801 incomplete Feature requires adding new
Service/ MicroService (ex. Database , Cache, API service etc. Includes both
Container or Non-Container) 1231 931cd30f-2791-4613-9a99-383d458f1825 incomplete
Details are added for Deployment/Installation 1232
7dbf268b-5222-4dec-9bbb-3d4e84005ad2 incomplete Details are added for HA (High
Availability) and Scalability requirements

Are there any Configuration Changes?

1233 4fbb5a58-2d1c-4f29-8f4a-ac208cf407f6 incomplete No new configurations are
being added 1234 fae44e21-5304-47c9-ba97-f4eef5c509a9 incomplete Existing
Configuration settings are modified 1235 1fd0e578-e9ec-4e7b-aa2c-c2e1cb9e8721
incomplete Details are added Backup/Restore/Upgrade 1236
f865b09b-af5f-4d9b-accf-79d827d76368 incomplete Details are added for
Compatibility via Migration of existing settings 1237
fa5a4ff3-ec59-498a-ab8d-0387143b5397 incomplete New Configuration settings are
added in existing Configuration files 1238 21f23e3c-8c7f-457b-bd7e-eb9d4fc9d24f
incomplete Provide details of Location of the file 1239
a0ba3279-afa1-4e37-b7ee-9a1677233cdb incomplete Details for
Backup/Restore/Upgrade (ex. MSTRBak, On-Prem Install) 1240
99d3fb0a-e1e1-40e5-87c4-eab555e07997 incomplete New Configuration file is added
1241 3ecc6270-0e1e-4e10-aa13-b6d929eea4e7 incomplete Installation/Deployment
tasks are created for Backup/Restore/Upgrade of Configuration 1242
7e94d33f-41d5-4628-aebc-1f26686c3a16 incomplete Add Details for
Backup/Restore/Upgrade (ex. MSTRBak, On-Prem Install)



DETAILS

Add details based on the selection above



Deployment Type

In Scope (Yes/No)

Configuration Changes

Build Instructions

Deployment/Installation Instructions

MCG - (MicroStrategy Cloud for Government) - Container









MCE (MicroStrategy Cloud Environment) - VM based









MCP (MicroStrategy Cloud Platform) w/ Container









MCP (MicroStrategy Cloud Platform) - VM Based









MEP (MicroStrategy Enterprise Platform)









VMWare Tanzu w/Container (Internal Testing)












3.13 Compliance

3.13.1 FEDRAMP COMPLIANCE SUMMARY

If you answer Yes to any questions, apart from your group/division architect,
Platforms Division Architect approval is also required



Questions

Response (Yes/No)

Description

Does this feature introduce any new Containers?



If Yes, additional areas to cover in this design: (Note that OSCAR Approval is
required regardless of FedRAMP impact or not)

 * Base Image usage

 * Container Scanning Result & Integration Automation with Prisma

Does this feature requires handling of sensitive data? (ex. Credentials, Tokens
)

Does this feature use encryption?



If Yes, provide details on

 * Data-in-Transit encryption

 * Data-at-rest encryption

 * FIPS 140-2 compliance

 * Encryption algorithm & Library used

 * Ensure Audit logs are collected through Fluentbit side car containers

 * Ensure data is masked/removed from Logging

FedRAMP has very strict requirement on using only FIPS 140-2 approved modules.



DETAILS

Add details based on the selection above


3.14 New Container/Service 🔗 Best Practices
[https://github.microstrategy.com/pages/kiai/developers-guide/#Containerization]

If you are adding new Container/Service, it needs to meet MicroStrategy
Developer Guide to ensure minimal framework requirements are met



SELECTION

Expand and select from options1800 1243 d8afda35-772e-47b0-ad78-eedc30e4d293
incomplete No New Container/Services are being introduced 1244
9df13c12-375a-42b0-b327-b360a09bd45a incomplete New Container/Service will be
introduced, and Delivery Units (User Stories) are created to ensure following
conditions are met 1245 3ee56493-0829-48d9-b233-b4fbd80d62bf incomplete
Container uses approved base Image (UBI8-minimal) 1246
a8f64c6d-22f5-4446-a54c-90be9204a97e incomplete Service exposes health check API
endpoint 1247 a2d055e1-d191-4fb5-a7f9-49939e01013e incomplete Readiness &
Liveness probe are configured for Container 1248
a8f2f048-0fcd-4819-8f39-0cfd5aeaf385 incomplete Application logs are collected
through fluent-bit side car container and sent to appropriate destination based
on deployment type 1249 ff29f057-7550-4d59-8e24-9c4f4afbcaf3 incomplete Audit
Logs are created and collected through fluent-bit side car container and sent to
appropriate destination based on deployment type 1250
3627999a-cba3-4186-94f5-9e57d742bfac incomplete Service supports Horizontal
Scaling 1251 f97e0e8c-9eac-4bb2-802d-979528b4eae9 incomplete Service is
stateless



DETAILS

Add details based on the selection above




3.15 Infrastructure Cost

Does the feature introduce a new component or external dependencies (ex. Managed
Cloud Services), which may have impact on Infrastructure Cost? 

 * Ex. New Database or Storage needs to be added (ex. Managed Postgres Service
   from Cloud, Object Storage etc.) which would add to the infrastructure Cost.
   Describe the Cost impact.

 * Ex. New Test Automation which requires additional Machines (VRA or Cloud) to
   be deployed. Explain how do you mitigate the cost - Running Per Commit vs
   Daily vs Weekly , Automating deletion etc. Prioritize VRA over Cloud for Test
   Automation where feasible/applicable.


4. Testing

Work with the SET transversal on the end-to-end test plan and provide a link to
the test plan they create. You should also summarize the expectations for
overall automated test coverage of this feature. here.


4.1 Unit Testing

Please describe how unit tests will be performed for this feature. If the code
was designed to be unit testable then you MUST build automated tests and
integrate them with CI. If data is required to test the feature, please describe
the strategy for mocking the data.

Expand and select from Options1800

SELECTION

1252 a7927fc6-571f-4aab-a7cc-8d2e0a799a9a incomplete Code Repository has Unit
Test Framework 1253 9897bba3-86ef-4035-87ad-ca5448fce4af incomplete New Unit
Tests will be added 1254 7e92d815-bab3-4789-bb82-a5f546877e29 incomplete
Repository currently doesn’t have Unit Test Framework 1255
52eeec36-6d61-452e-9fad-e3c30674b706 incomplete Rally Story has been created for
adding new Unit Test Framework



DETAILS

<add details based on the selection above>


4.2 Integration Testing

If applicable, please describe how integration testing will be performed for
this feature. For example, if this feature provides a REST API, how will you
ensure breaking changes are not introduced into the API. Integration tests
should be automated and integrated into CI.

Expand and select from options1800

SELECTION

1256 edc6cff1-a621-4a18-bb5c-1e8b898bd255 incomplete Integration Tests are done
manually 1257 4f67479f-07c6-4b29-b94a-257a535ec4dd incomplete Automated
Integration test framework exists 1258 fe04cbf5-7aa0-46fa-b337-a5be6f097329
incomplete Rally Stories are created to add new test cases



DETAILS

<add details based on the selection above>




4.3 Testing Error Handling

Please describe how errors will be triggered and tested. Describe how triggering
and validating error handling will be automated and integrated into CI.



SELECTION

Expand and select from options1800 1259 9c301577-51ed-47dc-a30c-1ec29c6b9ea7
incomplete Code introduces new APIs or changes to existing APIs 1260
e18222cc-6984-4cb1-b442-6f2700b1ce02 incomplete Error handling cases have been
documented in the API details section above with details on 4XX or 5XX Response
codes 1261 045a611b-cc56-4a42-9208-71aaba89c5e8 incomplete Rally items are
created to add test cases for Error scenarios 1262
addfc24e-4e6a-4ec6-a37e-eac12e57bf05 incomplete Error Related to Incorrect
Configurations settings have been documented



DETAILS

<add details based on the selection above>


5. Discussion

List important design decisions: including choice of technology stack, partition
of functions among modules and classes, data model design, design patterns,
etc. 


5.1 Design Decisions

Alternatives, Trade-off, Drawbacks, Assumptions, Limitations, Corner cases,
Design Patterns, UX, selection of algorithms when significant etc. 


5.2 Technology Choice

Standard, Framework, Advantages and disadvantages 


5.3 3rd Party Libraries, Software
[https://github.microstrategy.com/pages/kiai/developers-guide/#Tools] and tools

List the 3rd Party libraries and/or software being used to develop this feature.
If the libraries and tools are not already used in the platform, please follow
the process describe in the developer guide for introducing new 3rd party
software to the platform. 

Ensure that OSCAR (Open Source Component Approval Request) process  is followed
for any 3rd party Library / Container introduced.  The requirements are
applicable for not just the libraries shipped in the product, but it’s also
required for libraries used in development process (it would be lightweight
approval process in that case) as a vulnerability could be applicable for CI
process too  

For More details, please review OSCAR (Open Source Component Approval Request)
process
[https://rally1.rallydev.com/#/40267755691d/dashboard?detail=%2Fportfolioitem%2Ftheme%2F603852442724]



SELECTION

Expand and select from options1800 1263 474d26bd-f2e7-4a06-bde0-3869ed9b86df
incomplete Review Selection 1264 3f976066-eac8-4ddf-be3f-1d733edaa017 incomplete
No 3rd Party Libraries / Services to be added/modified 1265
9dbe8f74-9387-4891-be6c-0ac06fb15791 incomplete New 3rd Party Libraries/
Services will be added/modified 1266 603ea447-c990-40d8-8241-daeb149b8b7f
incomplete Rally Story created for OSCAR Creation/modification



DETAILS

Add details based on the selection above




5.4 Frequently Asked Questions

This is a place to put down anything else that seems to be relevant but which
does not fit in the rest of the design. 




6. Self-review Check-list for Design Author



SELECTION

1267 95c2950d-6472-479a-820f-63a4b9536591 incomplete Functional design meets the
UX requirements 1268 bde2ca31-3b1e-4b29-9161-70b91e1ce5c4 incomplete
Non-Functional Requirements have been adequately provided 1269
3b3b803a-9033-40ed-bb31-85856871b46e incomplete Design has been moved to PD2 in
Rally and SE leads/Architects and Product Owners have been notified for further
review




