# BCED-2416 Jira Evidence Pack

## 1. BCED-2416 full detail (verbatim from `jira issue view BCED-2416 --plain`)

```text

  ⭐ Feature  ✅ Done  ⌛ Fri, 06 Feb 26  👷 Yang Du  🔑️ BCED-2416  💭 30 comments  🧵 0 linked                      
                                                                                                                      
  # Enhance Workstation dashboard authoring experience with Library capability parity                                 
                                                                                                                      
  ⏱️  Sun, 20 Jul 25  🔎 Yan Zhang  🚀 Low  📦 None  🏷️  Library_and_Dashboards, Moved_DoneInEmbeddingCTC, bi-        
  dashboards_team  👀 1 watchers                                                                                      
                                                                                                                      
  ------------------------ Description ------------------------                                                       
                                                                                                                      
  **1. Description** (In 1-3 sentences, describe the feature, state the personas involved and how this feature solves 
  their problem. A brief overview of why the feature is necessary, what problem it solves, and the benefits it brings 
  to the user or product)                                                                                             
                                                                                                                      
  Now we have dashboard authoring in Library, Web and Workstation. Although most of the codes are shared among them,  
  there are still some discrepancies to each other. These discrepancy significantly increases our development and     
  maintenance burden, and, in my opinion, it does not provide substantial business value.                             
                                                                                                                      
  **2. Use Cases**                                                                                                    
                                                                                                                      
  Changing the authoring editor from WS to the Library web as consumption mode, since WS Offline mode is getting      
  deprecated in WS. This change could save hundreds of hours annually in development, testing, and release validation,
  allowing us to allocate resources to more valuable features.                                                        
                                                                                                                      
  **6. Requirements**                                                                                                 
                                                                                                                      
  **6.1 Business / Technical Requirements** (Specific functionalities that the feature must include to accomplish the 
  desired tasks. This may include details about data input, system behavior, and data output.)                        
                                                                                                                      
  • New Dashboard in Workstation                                                                                      
      • Check the "Enable New Dashboard Edtior" under the Help menu to activate the new editor                        
                                                                                                                      
                                                                                                                      
  [attachment][Rally url - https://rally1.rallydev.com/slm/attachment/832103195877/image.png]                         
                                                                                                                      
  Click new dashboard from create dashboard Icon or from Workstation Menu, Poup up dataset select page,               
                                                                                                                      
  [attachment][Rally url - https://rally1.rallydev.com/slm/attachment/829315089219/image.png]                         
                                                                                                                      
  #- Select Dataset and click Create Botton.                                                                          
                                                                                                                      
  #- Open a new Dashboard Editor as below!829313537629-image.png!                                                     
                                                                                                                      
  [Rally url - https://rally1.rallydev.com/slm/attachment/829313537629/image.png]                                     
                                                                                                                      
  #- The editor menu including                                                                                        
                                                                                                                      
  [attachment][Rally url - https://rally1.rallydev.com/slm/attachment/829313551703/image.png]                         
                                                                                                                      
  [attachment][Rally url - https://rally1.rallydev.com/slm/attachment/829313554431/image.png]                         
                                                                                                                      
  #- Theme menu will be moved to menu bar                                                                             
                                                                                                                      
  [attachment][Rally url - https://rally1.rallydev.com/slm/attachment/829314058805/image.png]                         
                                                                                                                      
  #- Click "presentation mode" button to enter presentation view, and click edit button back to authoring page.       
                                                                                                                      
  [attachment][Rally url - https://rally1.rallydev.com/slm/attachment/829314071395/image.png]                         
                                                                                                                      
  [attachment][Rally url - https://rally1.rallydev.com/slm/attachment/829314073983/image.png]                         
                                                                                                                      
  #- Click "Save" or from File menu to Save or Save as dashboard. Should popup native Workstation save dialog.        
                                                                                                                      
  [attachment][Rally url - https://rally1.rallydev.com/slm/attachment/829314559301/image.png]                         
                                                                                                                      
  • Edit Dashboard in Workstation                                                                                     
      • Right click the dashboard and click Edit button, should open authoring editor directly.                       
      • Click Edit without Data button, should enter pause mode.                                                      
  • Create Dashboard from Dataset'                                                                                    
      • Right click the dataset, and select "Dashboard from '1.csv' ", and pop up new dashboard editor.               
                                                                                                                      
                                                                                                                      
  [attachment][Rally url - https://rally1.rallydev.com/slm/attachment/829314571801/image.png]                         
                                                                                                                      
  • Local Mode in Workstation                                                                                         
  We will keep the local mode editor util 25.12, after that the local mode will be retired. Thus, this change won't   
  affect local mode editor.                                                                                           
                                                                                                                      
  In local mode, if dashboard save as to MD, the existing editor page won't change, but if edit the saved dashboard   
  again, it should show the new editor style.                                                                         
                                                                                                                      
  • The new Editor should have the cancel execution function when click cancel button or close editor from X button.  
  **6.2 Cloud Requirements**                                                                                          
                                                                                                                      
  |  |  |                                                                                                             
                                                                                                                      
  --- | --- | --- | --- **Deployment Type**  |  **In Scope** (Yes/No) |  **Default behavior** Disabled/Enabled/NA |   
  **Description** Provide Justification MCG (MicroStrategy Cloud for Government) - FedRAMP |  |  | MCE (MicroStrategy 
  Cloud Environment) - VM based |  |  | MCP (MicroStrategy Cloud Platform) w/Container |  |  | MCP (MicroStrategy     
  Cloud                                                                                                               
  Platform) - VM based |  |  | MEP (MicroStrategy Enterprise Platform) - OnPrem |  |  | VMWare Tanzu w/Container      
  (Internal Testing) |  |  | **6.3 Library Feature Enablement Requirements**                                          
                                                                                                                      
  *Library Application is leveraged to define the feature enablement for different platforms by different UI setting  
  controls(link).                                                                                                     
                                                                                                                      
  If the feature is adding Library functions or need to add any config setting to Library Application Control, please 
  fill in:                                                                                                            
                                                                                                                      
  |  |  |  |  |                                                                                                       
                                                                                                                      
  --- | --- | --- | --- | --- | --- **Default Behavior for Existing Application**  **after Upgrade** (On/Off) |       
  **Default Behavior for                                                                                              
  New Application**  **after Upgrade** (On/Off) |  **Behavior for Teams Plugin** On/Off/Follow Application |          
  **Behavior for PPT Add-in** On/Off/Follow Application |  **Behavior Excel Add-in** On/Off/Follow Application |      
  **SaaS** On/Off |  |  |  |  | **Note: If new features affect or require application framework settings, Please help 
  to create a user story under the feature for AC-Integration-CTC team; otherwise, you can just mark as N/A in the    
  above                                                                                                               
  table.**                                                                                                            
                                                                                                                      
  **6.4 Accessibility Requirements**                                                                                  
                                                                                                                      
  **6.5 Telemetry Requirements**                                                                                      
                                                                                                                      
  **7. Design Considerations** (An outline of the user interface, interaction design, or any other design requirements
  for the feature. This might include wireframes, diagrams, or flowcharts.)                                           
                                                                                                                      
  **8. Constraints and Assumptions** (Any limitations that must be considered during feature development and          
  assumptions made during the planning process.)                                                                      
                                                                                                                      
  i.e.                                                                                                                
                                                                                                                      
  •    This data is only requested for MCE customers since the AI features will only be available for MCE             
  environments.                                                                                                       
                                                                                                                      
  •    The prompt tokens and completion tokens should not be available for customers to consume.                      
                                                                                                                      
  •    The telemetry should be collected hourly                                                                       
                                                                                                                      
  •    It cannot have PII data, therefore should be aggregated (no user names, no specific tokens)                    
                                                                                                                      
  **10. Risks and Mitigation Strategies** (Identification of potential risks associated with the feature and          
  strategies to mitigate them.)                                                                                       
                                                                                                                      
  i.e.                                                                                                                
                                                                                                                      
  There could be privacy concerns as we are tracking usage statistics. However, we will only be collecting aggregate  
  usage data, not individual user data. All data will be handled in compliance with GDPR and other relevant data      
  protection laws.                                                                                                    
                                                                                                                      
  **11. Dependencies** (Other features, systems, or resources that this feature relies on.)                           
                                                                                                                      
  i.e.                                                                                                                
                                                                                                                      
  Other AI related features                                                                                           
                                                                                                                      
  Fxxxx – Project AI Canvas                                                                                           
                                                                                                                      
  ## QA Goal                                                                                                          
                                                                                                                      
  • **E2E: End to End**                                                                                               
      • Ensure Workstation users can seamlessly create or edit dashboards using the new WebView-based dashboard editor,
      achieving functional parity with Library Web.                                                                   
  • **FUN: Functionality**                                                                                            
      • Dashboard authoring workflows are covered by comprehensive component tests, as well as an end-to-end test to  
      ensure related workflows (create, edit, save, save as) work as expected. No regression is introduced by this new
      feature.                                                                                                        
  • **PER: Performance**                                                                                              
      • Compared to 25.07 WorkStation, no obvious performance degradation for dashboard execution and manipulations.  
  • **UPG: Upgrade and Compatibility**                                                                                
      • Connect to server pre 25.08 release, user can create or edit dashboards using old dashboard editor.           
  • **SEC: Security**                                                                                                 
      • User should not be able to edit dashboard without related priviledges or ACL.                                 
  • **AUTO: Automation**                                                                                              
      • Automation will be implemented using WorkStation automation framework - WDIO.                                 
                                                                                                                      
                                                                                                                      
  ## Test Cases                                                                                                       
                                                                                                                      
  Test cases marked with P1 are component-level tests, which are covered by the development team; test cases marked   
  with P2 and P3 are end-to-end test covered by QA team.                                                              
                                                                                                                      
  Detail status, please refer to:                                                                                     
  https://microstrategy.atlassian.net/wiki/spaces/CQT/pages/5186127599/F43445+Enhance+Workstation+dashboard+authoring+
  experience+with+Library+capability+parity                                                                           
  https://microstrategy.atlassian.net/wiki/spaces/CQT/pages/5186127599/F43445+Enhance+Workstation+dashboard+authoring+
  experience+with+Library+capability+parity                                                                           
  (                                                                                                                   
  https://microstrategy.atlassian.net/wiki/spaces/CQT/pages/5186127599/F43445+Enhance+Workstation+dashboard+authoring+
  experience+with+Library+capability+parity                                                                           
  https://microstrategy.atlassian.net/wiki/spaces/CQT/pages/5186127599/F43445+Enhance+Workstation+dashboard+authoring+
  experience+with+Library+capability+parity                                                                           
  )                                                                                                                   
                                                                                                                      
  ## QA Summary                                                                                                       
                                                                                                                      
  **E2E Testing & Functionality**                                                                                     
                                                                                                                      
  **Result** : **Pass**                                                                                               
                                                                                                                      
  • 66 defects detected (1 P1, 29 P2, 35 P3, 1 P4) - Defects are tracked in DS2856                                    
  • All defects have been reviewed. P1 and P2 defects are fixed in 25.08; P3 and P4 defects are scheduled in 25.09~26-
  H1.                                                                                                                 
  • Till today(8/7), still 2 P2 defects open in 25.08 and will fix on 8/8.                                            
      • DE331555:](https://rally1.rallydev.com/#/?detail=/defect/830209204821&fdp=true) https://rally1.rallydev.      
      com/#/?detail=/defect/830209204821&fdp=true):) [Workstation]The "Certify" and "Set as template" checkbox is     
      missing when save a new created dashboard                                                                       
      • DE332260:](https://rally1.rallydev.com/#/?detail=/defect/830743376425&fdp=true) https://rally1.rallydev.      
      com/#/?detail=/defect/830743376425&fdp=true):) [Workstation]Create a new dashboard or save as a dashboard in    
      folder, the new created dashboard is not displayed under folder, need refresh to see the new created/saved      
      folder                                                                                                          
      Coverage:                                                                                                       
  • WorkStation Dashboard authoring workflows are covered in E2E and Functionalities test, detailed test cases can be 
  found here.                                                                                                         
  • End to end blitz test performed by QA team and related development teams. Test result is **Pass** .               
  **Performance**                                                                                                     
                                                                                                                      
  **Result** : **Low pass**                                                                                           
                                                                                                                      
  Workstation dashboard editor is primarily designed for **dashboard authoring by Analyst users** (not consumption).  
  Its migration to the WebView-based editor in *25.08 Workstation*brought good parity with Library Web. While **some  
  performance degradation** was introduced due to the new framework, it’s **not so critical,** and the detailed       
  information is as below.                                                                                            
                                                                                                                      
  Compared **24.08 Workstation** with **25.07 Workstation** and **25.08 Library** :                                   
                                                                                                                      
  • **For opening the dashboard** , increased by **2s~****4s** across the dashboards due to more resources required to
  download from the Library;                                                                                          
  • **For manipulations in the dashboard** , all are the same as 25.07 WS or 25.08 Library except scroll manipulation:
      • Scroll is NOT smooth enough, logged with DE331633.                                                            
  • **Continue optimization:** will be conducted on 25.09 with US629449 - [WorkStation] Performance degradation to    
  open dashboard.                                                                                                     
  Detailed performance test result can be found in https://microstrategy.atlassian.                                   
  net/wiki/spaces/CQT/pages/5190221884 https://microstrategy.atlassian.net/wiki/spaces/CQT/pages/5190221884 (         
  https://microstrategy.atlassian.net/wiki/spaces/CQT/pages/5190221884 https://microstrategy.atlassian.               
  net/wiki/spaces/CQT/pages/5190221884 ) .                                                                            
                                                                                                                      
  **Upgrade and Compatibility**                                                                                       
                                                                                                                      
  **Result** : **Pass**                                                                                               
                                                                                                                      
  • 25.08 Server: Uses new WebView editor.                                                                            
  • Pre-25.08 Server: Falls back to legacy editor.                                                                    
  • No workflow breaks across versions.                                                                               
  **Security**                                                                                                        
                                                                                                                      
  **Result** : **Pass**                                                                                               
                                                                                                                      
  Privileges/ACL matches Library Web’s behavior.                                                                      
                                                                                                                      
  **Automation**                                                                                                      
                                                                                                                      
  Automation for WorkStation dashboard authoring will be implemented in US614013.                                     
                                                                                                                      
  ## QA Summary - 25.09                                                                                               
                                                                                                                      
  Code change in 25.09                                                                                                
                                                                                                                      
  • In 25.09, this feature is disabled by default. User can turn on “Enable New Dashboard Editor” setting in          
  WorkStation Help menu to enable this feature.                                                                       
  • MTDI blocker defects are fixed                                                                                    
  • Performance defects are moved to future release, no change on performance                                         
  **E2E Testing & Functionality**                                                                                     
                                                                                                                      
  **Result** : Pass                                                                                                   
                                                                                                                      
  • 90 defects detected (4P1, 46 P2, 38 P3, 2 P4) - Defects are tracked in DS2856                                     
  • Blocker defects for MTDI are fixed in 25.09.                                                                      
  • Till today(8/28), still 2 P2 defects open.                                                                        
      • Ready for test - DE334755:](https://rally1.rallydev.com/#/?detail=/defect/831975135539&fdp=true)              
      https://rally1.rallydev.com/#/?detail=/defect/831975135539&fdp=true):) [Workstation] “To continue, save your    
      work in the Database Connections window.” would not disappear even when the connection editor windows is closed 
      • Moved to 25.10 - DE331633:](https://rally1.rallydev.com/#/?detail=/defect/830283837291&fdp=true)              
      https://rally1.rallydev.com/#/?detail=/defect/830283837291&fdp=true):) [F43445][Workstation] Hard to scroll in  
      dashboard using the Workstation                                                                                 
      Coverage:                                                                                                       
  • WorkStation Dashboard authoring workflows are covered in E2E and Functionalities test, detailed test cases can be 
  found here.                                                                                                         
  • End to end blitz test performed by QA team and related development teams, focus on various data source connection 
  in WorkStation Dashboard Editor. Test result is **Pass** .                                                          
  **Performance**                                                                                                     
                                                                                                                      
  **Result** : Low pass                                                                                               
                                                                                                                      
  The new WebView-based dashboard editor in *25.09 Workstation*brought good parity with Library Web. While **some     
  performance degradation** was introduced due to the new framework.                                                  
                                                                                                                      
  Performance defects are moved to future release since this feature is disabled by default in 25.09.                 
                                                                                                                      
  • **For 1st time creating/opening dashboard** ,* **increased by~****20s(depends on the network)** *for 1st time     
  creating a blank dashboard or opening an existing dashboard.                                                        
      • DE332080:](https://rally1.rallydev.com/#/?detail=/defect/830583271793&fdp=true) https://rally1.rallydev.      
      com/#/?detail=/defect/830583271793&fdp=true):) [WorkStation] Obvious Performance degradation for the 1st        
      creating or rendering of dashboard.                                                                             
  • **For opening the dashboard** , increased by **2s~****4s** across the dashboards due to more resources required to
  download from the Library;                                                                                          
  • **For manipulations in the dashboard** , all are the same as the default dashboard editor except scroll           
  manipulation:                                                                                                       
      • Scroll is NOT smooth, logged with DE331633.                                                                   
      Detailed performance test result can be found in F43445 WorkStation New Dashboard Editor Performance Test .     
                                                                                                                      
                                                                                                                      
  **Upgrade and Compatibility**                                                                                       
                                                                                                                      
  **Result** : Pass                                                                                                   
                                                                                                                      
  Use legacy editor by default;                                                                                       
                                                                                                                      
  Turn on “Enable New Dashboard Editor” setting in WorkStation                                                        
                                                                                                                      
  • 25.09 Server: Uses new WebView editor.                                                                            
  • Pre-25.09 Server: Falls back to legacy editor.                                                                    
  • No workflow breaks across versions.                                                                               
  **Security**                                                                                                        
                                                                                                                      
  **Result** : Pass                                                                                                   
                                                                                                                      
  Privileges/ACL matches Library Web’s behavior.                                                                      
                                                                                                                      
  **Automation**                                                                                                      
                                                                                                                      
  Automation for WorkStation dashboard authoring will be implemented in US614013.                                     
                                                                                                                      
  ------------------------ 30 Comments ------------------------                                                       
                                                                                                                      
  Yan Zhang • Fri, 12 Sep 25 • Latest comment                                                                         
                                                                                                                      
  Rally item ( F43445 https://rally1.rallydev.com/#/search/?keywords=F43445 ) was successfully migrated to Jira.      
                                                                                                                      
[0;90m[0m[0;90m[0m  [0;90mUse --comments  with jira issue view to load more comments[0m                                                          
                                                                                                                      
[0;90m[0m[0;90m[0m  [0;90mView this issue on Jira: https://strategyagile.atlassian.net/browse/BCED-2416[0m                                       


```

## 2. Parent issue hierarchy

### PRD-126 — Composable and Competitive Analytical Experiences with Dashboards
- Type: Initiative
- Status: In Progress
- Description summary/raw extract:

```text

```

## 3. All child issues of BCED-2416

### QAC-2 — End to end test
- Type: Story
- Status: Done
- Description:

```

```
- Test steps: ``

### CLEANUP-245 — Test Preparations
- Type: Story
- Status: Done
- Description:

```

```
- Test steps: ``

### CGWI-1900 — [ER] [Lowe's Companies Inc] Add custom fonts in Workstation
- Type: Story
- Status: Done
- Description:

```
Description:   The customer wants to be able to develop dossiers end to end in Workstation with custom fonts. This would apply to all environments.This would apply to users with architect/development permissions for the Corporate environment It is a product gapThe workaround is to exclusively develop using a browser, which is inefficient, but it will allow for deliverables to be completed  Expected Behavior:  To use custom fonts on Dossiers through Workstation, for being able to develop dashboards that meet the desired styling requirements from the Premier UI/UX team.   Steps to Reproduce:   N/A   Business Impact:  What is the business requirement for this ER?-Being able to develop dossiers end to end in Workstation, using custom fonts on Dossiers.How many users do you intend on rolling this functionality out to? What are their business roles?-This would apply to users with architect/development permissions for the Corporate environment - the  number fluctuatesDoes this request represent a critical functionality? If so, could you offer more details?-It is a product gap. The workaround is to exclusively develop using a browser, which is inefficient, but it will allow for deliverables to be completed   Troubleshooting Steps:  [5/31][+]Supp duplicated the case CS0705595 for adding Lowe's to the original ER.Supp collected the business impact through Teams chat.Related rally cases:Rally ID: US406916Rally ID: US490241
```
- Test steps: ``

### CGWI-1570 — i-31 Adding bundles for workstation dashboard editor to improve the loading performance 
- Type: Story
- Status: Done
- Description:

```
We found there are some performance degradation in the new workstation dashboard editor, and the solution is to package partial file into the workstation.Here is the design:https://microstrategy.atlassian.net/wiki/spaces/SDK/pages/5198776344/Improve+the+Performance+of+New+Workstation+Dossier+Editor(https://microstrategy.atlassian.net/wiki/spaces/SDK/pages/5198776344/Improve+the+Performance+of+New+Workstation+Dossier+Editor)
```
- Test steps: ``

### CGWI-1544 —  [workstation] add "Enable New Dashboard Editor" under Help menu
- Type: Story
- Status: Done
- Description:

```
DESCRIPTION:   [workstation] add "Enable New Dashboard Editor" under Help menu, by default it is unchecked, once user checked the item, it will switch to the new dashboard editor.The preference name exposed to plugins should be new-dashboard-editor  [Rally url - https://rally1.rallydev.com/slm/attachment/831553076303/image.png]EXPECTED BEHAVIOR:ENVIRONMENT (Browser, OS, Secure Cloud info, URL, Intelligence Server info, metadata/warehouse info, etc):STEPS TO REPRODUCE:SUPPORTING DOCUMENTATION (Screenshot, video/gif, .mstr file, logs, etc):Please click[here](https://microstrategy.atlassian.net/wiki/spaces/TECAGILEWORKS/pages/162727022/Defect+Logging+Guidelines)to read the full guidelines of logging defects.
```
- Test steps: ``

### CGWI-1397 — [Parent Story] WS Dashboard Library Authoring | Workstation Native Enhancements
- Type: Story
- Status: Done
- Description:

```
Investigate and resolve items connected with [F43445](https://rally1.rallydev.com/#/?detail=/portfolioitem/feature/823049229263&fdp=true): Enhance Workstation dashboard authoring experience with Library capability parity  Including:Package Dashboard-related code bundles into Workstation to reduce the need for these bundles to be fetched when initially loading a Dashboard.Design: https://microstrategy.atlassian.net/wiki/spaces/SDK/pages/5198776344/Improve+the+Performance+of+New+Workstation+Dossier+Editor(https://microstrategy.atlassian.net/wiki/spaces/SDK/pages/5198776344/Improve+the+Performance+of+New+Workstation+Dossier+Editor)
```
- Test steps: ``

### CGWI-1000 — [Workstation]The "Certify" and "Set as template" checkbox is missing when save a new created dashboard
- Type: Defect
- Status: Done
- Description:

```
25.08 workstation connect to 25.08 library: https://mci-cbzy7-dev.hypernow.microstrategy.com/MicroStrategyLibrary/auth/ui/loginPage(https://mci-cbzy7-dev.hypernow.microstrategy.com/MicroStrategyLibrary/auth/ui/loginPage) tqmsuser/ddsetCreate a new dashboardSaveIssue here: the "Certify" and "Set as template" checkbox is missing when save a new created dashboardThis issue seems to be caused by the plugin API constraint. When I call saveAs to open the dialog in this workflow, I always set showCertifyOption to true, and according to @Wojciech Antolik, the "set as template" option now will always show for dossier.It indeed works for the saveAs of an existing dossier. However, we found that when the dossier is an unsaved new dossier, the 2 options will not show. It's not expected behavior as these options' result can be used in the following workflow, even if the dossier is a new dossier.[Rally url - https://rally1.rallydev.com/slm/attachment/830208737487/image.png]
```
- Test steps: ``

### CGWI-996 — [WorkStation] Open a dashboard contains HTML container, the whole dashboard cannot be used.
- Type: Defect
- Status: Done
- Description:

```
ENVIRONMENT (Browser, OS, Secure Cloud info, URL, Intelligence Server info, metadata/warehouse info, etc):WorkStation Version: 11.5.0800.00823Server: https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary(https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary)Credentials: tqmsuser/ddsetServer version: 11.5.0800.0073STEPS TO REPRODUCE:Connect to the environment https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary(https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary)Open dashboard "Employee Fitness_new" (dashboard link: https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary/app/B628A31F11E7BD953EAE0080EF0583BD/6E0917F28F436970AFC56DB97BF62F0B)(https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary/app/B628A31F11E7BD953EAE0080EF0583BD/6E0917F28F436970AFC56DB97BF62F0B))Switch to page "EF Bot"Issue Here: Got the error "Oops... We are having trouble loading data now..." as shown in below screenshot. The whole dashboard cannot be used, user cannot edit this page or switch to other page.SUPPORTING DOCUMENTATION (Screenshot, video/gif, .mstr file, logs, etc):25.08[Rally url - https://rally1.rallydev.com/slm/attachment/830089322559/Screenshot 2025-07-29 at 10.40.44.png]25.07 - user can continue edit the dashboard[Rally url - https://rally1.rallydev.com/slm/attachment/830089323971/Screenshot 2025-07-29 at 10.40.54.png]
```
- Test steps: ``

### CGWI-661 — Workstation: Support the new dossier editor
- Type: Story
- Status: Done
- Description:

```
To deliver the new dossier editor on the workstation, we need the workstation side to support:Expose new parameter to show the "save as template" option for the SDK workstation.dialogs.saveAs()Hide the original "Edit without Data" menu on the dossier item whenThe server version >= 25.08The workstation is in preview modeStop showing WebError.html when the internal dashboard HTML errors out.  [Rally url - https://rally1.rallydev.com/slm/attachment/830220513237/image.png][Rally url - https://rally1.rallydev.com/slm/attachment/830220513671/image.png]Issues mentioned in this US were separately logged as defects and the work is tracked there:[DE331403](https://rally1.rallydev.com/#/?detail=/defect/830099524249&fdp=true): [Workstation]The "Set as Template" checkbox is missing in 25.08 save as dialog[DE331365](https://rally1.rallydev.com/#/?detail=/defect/830084379837&fdp=true): [Workstation]There are 2 "Edit without data" items in dashboard context menu[DE331384](https://rally1.rallydev.com/#/?detail=/defect/830088554743&fdp=true): [WorkStation] Open a dashboard contains HTML container, the whole dashboard cannot be used.
```
- Test steps: ``

### BCVE-1621 — [F43445][WorkStation] Save as any dashboard in AQDT server, get 500 Internal Server Error
- Type: Defect
- Status: Done
- Description:

```
ENVIRONMENT (Browser, OS, Secure Cloud info, URL, Intelligence Server info, metadata/warehouse info, etc):WorkStation version: 11.5.0900.00424STEPS TO REPRODUCE:Connect 25.09 WorkStation to AQDT Prod environment https://aqueduct.microstrategy.com/MicroStrategyLibrary/appOpen any dashboard, you may use Rally Analytics > Public Objects > Reports > 3. Personal > sxiong > PRD.Customer Cases_Modern GridClick "File" > "Save As..."Issue Here: Get 500 Internal Server ErrorIssue is not reproduced in 25.07 WorkStationSUPPORTING DOCUMENTATION (Screenshot, video/gif, .mstr file, logs, etc):[Rally url - https://rally1.rallydev.com/slm/attachment/831454458231/Screenshot 2025-08-19 at 15.37.56.png]
```
- Test steps: ``

### BCVE-1535 — Export in ws editor
- Type: Story
- Status: Done
- Description:

```

```
- Test steps: ``

### BCVE-1534 — Vis in ws editor
- Type: Story
- Status: Done
- Description:

```

```
- Test steps: ``

### BCSM-2114 — DI in ws editor
- Type: Story
- Status: Done
- Description:

```

```
- Test steps: ``

### BCSA-848 — Auth in ws editor
- Type: Story
- Status: Done
- Description:

```

```
- Test steps: ``

### BCIN-3965 — [Dashboard AG grid] Some of the grid cell will not show when connecting to 25.0304 server by 25.06 workstation
- Type: Defect
- Status: Done
- Description:

```
DESCRIPTION:[Dashboard AG grid] Some of the grid cell will not show when connecting to 25.0304 server by 25.06 workstation.workstation dashboard editorworkstation report editorEXPECTED BEHAVIOR:ENVIRONMENT (Browser, OS, Secure Cloud info, URL, Intelligence Server info, metadata/warehouse info, etc):STEPS TO REPRODUCE:Login https://stg-env-54450.cloud.microstrategy.com/MicroStrategyLibrary/(https://stg-env-54450.cloud.microstrategy.com/MicroStrategyLibrary/) by administrator / oIb1bt2bC2SRun dashboard "Dashboard, AG Grid", scroll up/down in the grid >> issue here: some of the grid cell border will not showSUPPORTING DOCUMENTATION (Screenshot, video/gif, .mstr file, logs, etc):Please click[here](https://microstrategy.atlassian.net/wiki/spaces/TECAGILEWORKS/pages/162727022/Defect+Logging+Guidelines)to read the full guidelines of logging defects.
```
- Test steps: ``

### BCIN-1263 — Custom font is not supported in Workstation.
- Type: Story
- Status: Done
- Description:

```
Description:   Ability to add custom font to Workstation  Expected Behavior:  null   Steps to Reproduce:   null   Business Impact:  Corporate fonts have to be used across all interfaces   Troubleshooting Steps:  F38110 - PA-Applications HQ
```
- Test steps: ``

### BCIN-1190 — The ability for custom fonts to be available in the font picker list within Workstation
- Type: Story
- Status: Done
- Description:

```
Description:   Yahoo have a set of custom Yahoo fonts that they use on Dossiers in Web and Library, and the goal is to do the same from within Workstation. Text using these custom fonts does render properly within Workstation if they've already been chosen in Library, but the request is for the fonts to be available in the font picker list within Workstation.  Expected Behavior:  For the custom fonts to appear in the custom font picker within Workstation   Steps to Reproduce:   [NOT APPLICABLE]  [-]Custom fonts cannot be added to the font picker within Workstation   Business Impact:  Reports and dossiers that are created via Workstation are not able to use the Yahoo custom font since this font does not appear as part of the font picker. Objects have be created via Web or Library for the font to be used.   Troubleshooting Steps:  12/18/2023  [-]This is already on the roadmap to be implemented via US481058
```
- Test steps: ``

### BCFR-46 — Request for functionality in Workstation when closing report/dossier it should cancel SQL execution on Database
- Type: Story
- Status: Done
- Description:

```
Description:   In the MicroStrategy Developer once a report run  is canceled it will cancel the SQL on the Database.   In workstation there is no button to cancel the report, there is only the possible to close the whole report but then the SQL is still running on Database. The customer wants to raise an enhancement request to implement the same functionality as it was in Developer. MicroStrategy version used is 2021 update 10  Expected Behavior:  Functionality in Workstation when closing report/dossier it should cancel SQL execution on Database   Steps to Reproduce:   [Not reproduced]  Checking  We need to prepare a simple test scenario. As Snowflake is cost-heavy, we could create a big table in Postgres on Labs and test how it behaves  Tested in Postgres:  Host: ts-pgsql14, Port:5432, Database: mlosk1700744650, Username: mlosk1700744650, Password: abcd1234  We cannot use internal Snowflake anymore   Business Impact:  Major impact for a strategic customer, especially after their users migrate to Workstation   Troubleshooting Steps:  07-03-2024  The issue will be logged as confirmed with Klaudia  28/02/2024  Screenshots from Snowflake uploaded on \\supp-fs-was\CLIENTS\S\SchwarzITKG\CS0799938  22-02-2024  Collect Snowflake Query history for both of the scenarios a)clicking on "X" b)Stopping the data retrieval + exact timestamp  21-02-2024  The customer confirmed, that using the cancellation button is not a solution for them.  We need to prepare a simple test scenario. As Snowflake is cost-heavy, we could create a big table in Postgres on Labs and test how it behaves  20-02-2024  Need to confirm the workflow with André Ruffer, as there is an option to cancel report execution when opening reports in Workstation.  Pause and Resume Dossier Execution  https://www2.microstrategy.com/producthelp/Current/MSTRWeb/WebHelp/Lang_1033/Content/pausing_dossier.htm  otherwise there should be probably a mechanism to run SYSTEM$CANCEL_QUERY when closing a dossier https://docs.snowflake.com/en/sql-reference/functions/system_cancel_query  https://select.dev/posts/cost-per-query Snowflake customers are billed for each second that virtual warehouses are running, with a minimum 60 second charge each time one is resumed.
```
- Test steps: ``

### BCFR-33 — [Parent Story]  Clean unit settings when convert modern grid to classic/compound grid
- Type: Story
- Status: Done
- Description:

```
As a POI want to convert the modern grid to classic/compound gridso that users can change settings in classic/compound grid.Now if user convert classic grid to modern grid, and then make some format changes. After converting grid back to classic grid. those changed setting can not be changed again.The reason is that:Once a grid is configured with unit-level formatting, it can no longer be changed to high-level formatting. For example, if the grid is switched from the modern style to the classic style, all formats previously set at the unit level will become fixed and cannot be modified.Expected: The Units format should be cleared when switch from unit-level formatting grid like the mordern grid to the high level formatting grid like the normal grid/compound grid.
```
- Test steps: ``

### BCFR-21 — Dashboard | [Specific dashboard]  | Save dashboard show error
- Type: Defect
- Status: Done
- Description:

```
1. <https://aqueduct.microstrategy.com/MicroStrategyLibrary/app/0730F68F4B8B4B52AA23F0AAB46F3CA8/427DA697DF499D8A50FC0992DB926066/W97--K46>2. Login with corp account3. Save as the dashboard in any folder4. Issue here, show error
```
- Test steps: ``

### BCED-3160 — [WorkStation] Close dashboard editor when edit mosaic dataset, crash error shows up
- Type: Defect
- Status: Done
- Description:

```
ENVIRONMENT (Browser, OS, Secure Cloud info, URL, Intelligence Server info, metadata/warehouse info, etc):WorkStation Version: 11.5.0800.00880Server: Vega https://vega.trial.cloud.microstrategy.com/MicroStrategyLibrary(https://vega.trial.cloud.microstrategy.com/MicroStrategyLibrary)Credentials: Your corp accountServer version: 11.5.0800.0076STEPS TO REPRODUCE:Connect WorkStation to the environment https://vega.trial.cloud.microstrategy.com/MicroStrategyLibrary(https://vega.trial.cloud.microstrategy.com/MicroStrategyLibrary)Search and Open the dashboard "Drill_MosaicDataset1" (dashboard link: https://vega.trial.cloud.microstrategy.com/MicroStrategyLibrary/app/E9E37D2411EA7E76E7750080EF950EC5/F9572996CB473B02FF986B9552940FA0/publish)On dataset panel, open the context menu of dataset "Mosaic Model for Modern grid", click "Edit Mosaic Model..."Click the "x" button to close dashboard editorIssue Here: Crash error shows as following screenshot[Rally url - https://rally1.rallydev.com/slm/attachment/830199580109/Screenshot 2025-07-30 at 14.35.30.png]
```
- Test steps: ``

### BCED-3149 — [Workstation]The dashboard name is not updated in 1st layer toolbar after create a new dashboard and saved
- Type: Defect
- Status: Done
- Description:

```
Create new dashboard and savedThe dashboard name is not updated in 1st layer toolbar, still show "New Dashboard"[Rally url - https://rally1.rallydev.com/slm/attachment/830085633849/image.png]
```
- Test steps: ``

### BCED-3145 — [Workstation][Add Existing Dataset] Click "Cancel" in insert existing dataset dialog, crash error shows up
- Type: Defect
- Status: Done
- Description:

```
25.08 workstation connect to 25.08 library: https://mci-cbzy7-dev.hypernow.microstrategy.com/MicroStrategyLibrary/auth/ui/loginPage(https://mci-cbzy7-dev.hypernow.microstrategy.com/MicroStrategyLibrary/auth/ui/loginPage) tqmsuser/ddsetClick "Insert-> Add Data-> Existing Dataset..."    [Rally url - https://rally1.rallydev.com/slm/attachment/830207740955/image.png]Click "Cancel"Issue here: Crash error shows as following[Rally url - https://rally1.rallydev.com/slm/attachment/830207739555/Screen Recording 2025-07-30 at 16.49.05.gif]
```
- Test steps: ``

### BCED-3142 — [Workstation] No need have dropdown menu when there is only one item "Save" in the dropdown menu
- Type: Defect
- Status: Done
- Description:

```
No need have dropdown menu when there is only one item "Save" in the dropdown menu[Rally url - https://rally1.rallydev.com/slm/attachment/830084387269/image.png]
```
- Test steps: ``

### BCED-3136 — [WorkStation][Compatibility] Cannot close dashboard in AQDT environment
- Type: Defect
- Status: Done
- Description:

```
ENVIRONMENT (Browser, OS, Secure Cloud info, URL, Intelligence Server info, metadata/warehouse info, etc):WorkStation Version: 11.5.0800.00823Server: aqueduct.microstrategy.com/MicroStrategyLibrary/Credentials: Your corp accountServer version: 25.06STEPS TO REPRODUCE:Connect to AQDT environmentOpen a dashboard. You may use "PRD.Customer Cases"Click the "X" button to the 1st layerIssue Here: Cannot close the dashboard.Click the "X" button in the navigation window, dashboard cannot be closed either. Even after clicking "Close all windows", the dashboard cannot be closedSUPPORTING DOCUMENTATION (Screenshot, video/gif, .mstr file, logs, etc):PRD.Customer Cases[Rally url - https://rally1.rallydev.com/slm/attachment/830086869423/Screenshot 2025-07-29 at 10.02.16.png][Rally url - https://rally1.rallydev.com/slm/attachment/830086872163/Screenshot 2025-07-29 at 10.04.40.png]
```
- Test steps: ``

### BCED-3129 — [Workstation][Dashboard formatting properties] The dashboard formatting properties dialog is not fully displayed and cannot be scrolled
- Type: Defect
- Status: Done
- Description:

```
The dashboard formatting properties dialog is not fully displayed and cannot be scrolled[Rally url - https://rally1.rallydev.com/slm/attachment/830087136021/image.png]
```
- Test steps: ``

### BCED-3127 — (Converted to UserStory) [workstation] uncheck "Enable New Data Import Experience" it is still showing New Data Import Experience
- Type: Defect
- Status: Done
- Description:

```
DESCRIPTION:   [workstation] uncheck "Enable New Data Import Experience" it is still showing New Data Import Experience  [Rally url - https://rally1.rallydev.com/slm/attachment/831553076303/image.png]EXPECTED BEHAVIOR:ENVIRONMENT (Browser, OS, Secure Cloud info, URL, Intelligence Server info, metadata/warehouse info, etc):STEPS TO REPRODUCE:SUPPORTING DOCUMENTATION (Screenshot, video/gif, .mstr file, logs, etc):Please click[here](https://microstrategy.atlassian.net/wiki/spaces/TECAGILEWORKS/pages/162727022/Defect+Logging+Guidelines)to read the full guidelines of logging defects.
```
- Test steps: ``

### BCED-3121 — [WorkStation] There are 2 "X" button on the menu bar, user can enter consumption mode by clicking "X" button on 2nd layer of menu bar
- Type: Defect
- Status: Done
- Description:

```
ENVIRONMENT (Browser, OS, Secure Cloud info, URL, Intelligence Server info, metadata/warehouse info, etc):WorkStation Version: 11.5.0800.00823Server: aqueduct.microstrategy.com/MicroStrategyLibrary/Credentials: Your corp accountServer version: 25.06STEPS TO REPRODUCE:Connect to AQDT environmentOpen a dashboard. You may use "PRD.Customer Cases"Issue Here: There are 2 "X" button on the toolbar, 1 on 1st layer, 1 on 2nd layer. Click the "X" on the 2nd layer, user can enter consumption modeSUPPORTING DOCUMENTATION (Screenshot, video/gif, .mstr file, logs, etc):PRD.Customer Cases[Rally url - https://rally1.rallydev.com/slm/attachment/830086869423/Screenshot 2025-07-29 at 10.02.16.png]
```
- Test steps: ``

### BCED-3097 — [Embedding Library] No response after clicking logout in embedding library. 
- Type: Defect
- Status: Done
- Description:

```
DESCRIPTION: No response after clicking logout in embedding library.EXPECTED BEHAVIOR: LogoutENVIRONMENT (Browser, OS, Secure Cloud info, URL, Intelligence Server info, metadata/warehouse info, etc):[env-359766.customer.cloud.microstrategy.com/embedding_library.html](https://env-359766.customer.cloud.microstrategy.com/embedding_library.html)STEPS TO REPRODUCE:Open above link. You can see embedding library page.Logout. No response after user clicking Log Out button.  Regression from 25.08[Rally url - https://rally1.rallydev.com/slm/attachment/831792966471/image.png]SUPPORTING DOCUMENTATION (Screenshot, video/gif, .mstr file, logs, etc):Please click[here](https://microstrategy.atlassian.net/wiki/spaces/TECAGILEWORKS/pages/162727022/Defect+Logging+Guidelines)to read the full guidelines of logging defects.
```
- Test steps: ``

### BCED-3089 — CommunityConnector OAuth | Click 'Approve'/Allow' button can't return to Alchemer/Jira source page
- Type: Defect
- Status: Done
- Description:

```
DESCRIPTION:CommunityConnector OAuth | Click 'Approve' button can't return to SurveyGizmo/Alchemer source pageEXPECTED BEHAVIOR:ENVIRONMENT (Browser, OS, Secure Cloud info, URL, Intelligence Server info, metadata/warehouse info, etc):ws-11.5.0900.00412STEPS TO REPRODUCE:Workstation + LibraryDashboardAlchemer or JiraIssue: failed to login[Rally url - https://rally1.rallydev.com/slm/attachment/831470558493/image.png][Rally url - https://rally1.rallydev.com/slm/attachment/831471429787/image.png]SUPPORTING DOCUMENTATION (Screenshot, video/gif, .mstr file, logs, etc):Please click[here](https://microstrategy.atlassian.net/wiki/spaces/TECAGILEWORKS/pages/162727022/Defect+Logging+Guidelines)to read the full guidelines of logging defects.
```
- Test steps: ``

### BCED-3066 — DB OAuth | Failed to use DB OAuth sources on workstation server based dashboard mode
- Type: Defect
- Status: Done
- Description:

```
DESCRIPTION:Failed to use DB OAuth sources on workstation server based dashboard modeEXPECTED BEHAVIOR:ENVIRONMENT (Browser, OS, Secure Cloud info, URL, Intelligence Server info, metadata/warehouse info, etc):ws-11.5.0900.00412STEPS TO REPRODUCE:Workstation + LibraryDashaboardsADLS2*、*SharePoint and OneDrive, S3OAuth, GCSOAuth Jira Cloud(CloudConnector) are failed to login[Rally url - https://rally1.rallydev.com/slm/attachment/831466853195/image.jpeg][Rally url - https://rally1.rallydev.com/slm/attachment/831466853193/image.jpeg][Rally url - https://rally1.rallydev.com/slm/attachment/831466853201/image.jpeg][Rally url - https://rally1.rallydev.com/slm/attachment/831466853205/image.jpeg]SUPPORTING DOCUMENTATION (Screenshot, video/gif, .mstr file, logs, etc):Please click[here](https://microstrategy.atlassian.net/wiki/spaces/TECAGILEWORKS/pages/162727022/Defect+Logging+Guidelines)to read the full guidelines of logging defects.
```
- Test steps: ``

### BCED-3065 — CommunityConnector OAuth | Failed to login SurveyMonkey  on workstation server based dashboard mode
- Type: Defect
- Status: Done
- Description:

```
DESCRIPTION:Failed to login SurveyMonkey  on workstation server based dashboard modeEXPECTED BEHAVIOR:ENVIRONMENT (Browser, OS, Secure Cloud info, URL, Intelligence Server info, metadata/warehouse info, etc):ws-11.5.0900.00412STEPS TO REPRODUCE:Workstation + LibraryDashboardSurveyMonkeyIssue: failed to login[Rally url - https://rally1.rallydev.com/slm/attachment/831470144257/image.png]SUPPORTING DOCUMENTATION (Screenshot, video/gif, .mstr file, logs, etc):Please click[here](https://microstrategy.atlassian.net/wiki/spaces/TECAGILEWORKS/pages/162727022/Defect+Logging+Guidelines)to read the full guidelines of logging defects.
```
- Test steps: ``

### BCED-3058 — Native OAuth | Failed to login Salesforce Report/Financial Force Reports/ServiceMax Reports/Veeva CRM Reports  on workstation server based dashboard mode
- Type: Defect
- Status: Done
- Description:

```
DESCRIPTION:Failed to login Salesforce Reports  on workstation server based dashboard modeEXPECTED BEHAVIOR:ENVIRONMENT (Browser, OS, Secure Cloud info, URL, Intelligence Server info, metadata/warehouse info, etc):ws-11.5.0900.00412STEPS TO REPRODUCE:Workstation + LibraryDashboardSalesforce Report/Financial Force Reports/ServiceMax Reports/Veeva CRM ReportsIssue: failed to login[Rally url - https://rally1.rallydev.com/slm/attachment/831467352993/image.png]SUPPORTING DOCUMENTATION (Screenshot, video/gif, .mstr file, logs, etc):Please click[here](https://microstrategy.atlassian.net/wiki/spaces/TECAGILEWORKS/pages/162727022/Defect+Logging+Guidelines)to read the full guidelines of logging defects.
```
- Test steps: ``

### BCED-3052 — Modern grid content will loss after the mosaic editor or MTDI window is resized
- Type: Defect
- Status: Done
- Description:

```
ENVIRONMENT (Browser, OS, Secure Cloud info, URL, Intelligence Server info, metadata/warehouse info, etc):Server: https://tec-l-1183620.labs.microstrategy.com/MicroStrategyLibrary(https://tec-l-1183620.labs.microstrategy.com/MicroStrategyLibrary)Credentials: mstr1/123456Web Server version: 11.5.0800.00534STEPS TO REPRODUCE:Open https://tec-l-1183620.labs.microstrategy.com/MicroStrategyLibrary/app/B7CA92F04B9FAE8D941C3E9B7E0CD754/7FBA63128648ADE1C852EAA188D5CC40/K53--K46/editOn Datasets panel, click the context menu of "Mosaic Model for Modern grid" dataset, click "Edit Mosaic Model..."On Mosaic Model edit page, drag the left or right border of the editor to resize itClose the Mosaic Model edit page and go back to the dossier authoring page.Issue Here: Get a blank grid. See errorVideo.mov in attachments.
```
- Test steps: ``

### BCED-3035 — [F43445][Workstation][Export]The export pdf behavior changed from 25.07
- Type: Defect
- Status: Done
- Description:

```
25.08 workstation connect to 25.08 libraryOpen a dashboardClick "File" -> "Export to PDF" -> "Export"Issue here:during the export process, there is no prominent loading indicator―only a very small and inconspicuous loading indicator located in an inappropriate positionit will show "Export Complete" before user select a folder to save the downloaded file, and no success indicator when the real export finished[Rally url - https://rally1.rallydev.com/slm/attachment/830374375337/Screen Recording 2025-08-01 at 14.56.06.gif]In 25.07, it will pop up a dialog for user to select a folder to save first, then show loading icon during download, and show success after download completed
```
- Test steps: ``

### BCED-3031 — [F43445][Workstation]Show new dashboard editor when connecting to the 25.08 library
- Type: Defect
- Status: Done
- Description:

```
ENVIRONMENT (Browser, OS, Secure Cloud info, URL, Intelligence Server info, metadata/warehouse info, etc):WorkStation Version: 25.09STEPS TO REPRODUCE:Open 25.09 WorkStation and connect to a 25.08 Library serverOpen any dashboard, and see the new dashboard editor.[Rally url - https://rally1.rallydev.com/slm/attachment/831365491133/image.png]Issue here: Because we reverted the editor in 25.08, it should show the old style edtior. The new edtior should start to work from 25.09 release.
```
- Test steps: ``

### BCED-3024 — [Workstation] "input credential" can trigger pop up login window, but the connection still does not go through
- Type: Defect
- Status: Done
- Description:

```
DESCRIPTION:   [Workstation] input credential can trigger pop up login window, but the connection still does not go through[Rally url - https://rally1.rallydev.com/slm/attachment/831635431357/refresh.gif]EXPECTED BEHAVIOR:ENVIRONMENT (Browser, OS, Secure Cloud info, URL, Intelligence Server info, metadata/warehouse info, etc):STEPS TO REPRODUCE:SUPPORTING DOCUMENTATION (Screenshot, video/gif, .mstr file, logs, etc):Please click[here](https://microstrategy.atlassian.net/wiki/spaces/TECAGILEWORKS/pages/162727022/Defect+Logging+Guidelines)to read the full guidelines of logging defects.
```
- Test steps: ``

### BCED-3022 — [F43445][Workstation][dashboard][session timeout] Should not show login page when session timeout
- Type: Defect
- Status: Done
- Description:

```
09 workstation connect to 09 library: https://mci-cbzy7-dev.hypernow.microstrategy.com/MicroStrategyLibrary(https://mci-cbzy7-dev.hypernow.microstrategy.com/MicroStrategyLibrary) tqmsuser/ddsetOpen a dashboardWait for session expire. I opened the dashboard yesterday and wait for a nightIssue here: show login page[Rally url - https://rally1.rallydev.com/slm/attachment/831267407189/image.png]
```
- Test steps: ``

### BCED-3009 — [WorkStation] Cannot execute any dashboard in a tanzu environment
- Type: Defect
- Status: Done
- Description:

```
ENVIRONMENT (Browser, OS, Secure Cloud info, URL, Intelligence Server info, metadata/warehouse info, etc):WorkStation Version: 11.5.0800.01066Server: https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary(https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary)Credentials: tqmsuser/ddsetServer version: 11.5.0800.0097STEPS TO REPRODUCE:Connect 25.08 WorkStation to the environment https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary(https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary)Open any dashboardIssue Here: It displays a blank screen. Cannot execute any dashboard on this environmentThe dashboard on this environment can be opened successfully on Library Web.[Rally url - https://rally1.rallydev.com/slm/attachment/830464651993/Screenshot 2025-08-04 at 11.28.09.png]
```
- Test steps: ``

### BCED-3004 — [Workstation] Missing edit icon before the new item "Edit without data"
- Type: Defect
- Status: Done
- Description:

```
[Rally url - https://rally1.rallydev.com/slm/attachment/830549889195/image.png]
```
- Test steps: ``

### BCED-2997 — [Workstation][Link]Click link in dashboard should not trigger save workflow
- Type: Defect
- Status: Done
- Description:

```
25.09 workstation connect 25.09 library, eg: https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary(https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary) tqmsuser/ddsetOpen dashboard: link test yatong, do some changeClick link text: "baidu in same tab"Issue here: it will trigger save confirm dialog, in native dashboard editor, link will not trigger save workflow
```
- Test steps: ``

### BCED-2991 — [WorkStation] Crash error when dragging the border of Edit Mosaic Model page
- Type: Defect
- Status: Done
- Description:

```
ENVIRONMENT (Browser, OS, Secure Cloud info, URL, Intelligence Server info, metadata/warehouse info, etc):WorkStation Version: 11.5.0800.01130Server: Vega https://vega.trial.cloud.microstrategy.com/MicroStrategyLibrary(https://vega.trial.cloud.microstrategy.com/MicroStrategyLibrary)Credentials: Your corp accountServer version: 11.5.0800.0101STEPS TO REPRODUCE:Connect 25.08 WorkStation to the environment https://vega.trial.cloud.microstrategy.com/MicroStrategyLibrary(https://vega.trial.cloud.microstrategy.com/MicroStrategyLibrary)Navigate to DashboardsSearch dashboard "Drill_MosaicDataset1", open this dashboardOn Datasets panel, click the context menu of "Mosaic Model for Modern grid" dataset, click "Edit Mosaic Model..."On Mosaic Model edit page, drag the left or right border of the editor to resize itIssue Here: Get the crash error.[Rally url - https://rally1.rallydev.com/slm/attachment/830562981857/Screenshot 2025-08-05 at 14.16.47.png]
```
- Test steps: ``

### BCED-2989 — [WorkStation] Obvious Performance degradation for the 1st creating or rendering of dashboard.
- Type: Defect
- Status: Done
- Description:

```
ENVIRONMENT (Browser, OS, Secure Cloud info, URL, Intelligence Server info, metadata/warehouse info, etc):WorkStation Version: 11.5.0800.01130Server: https://vega.trial.cloud.microstrategy.com/MicroStrategyLibraryCredentials: Your corp accountServer version: 11.5.0800.0101STEPS TO REPRODUCE:Clean install 25.08 WorkStationConnect to 25.08 environment, you may use vega environmentFor the 1st time opening a dashboardIssue 1: Blank screen shows for a while. There is no loading icon, user doesn't know what happenedIssue 2: It is quite slow for the 1st time create or render a dashboard, take this [dashboard](https://vega.trial.cloud.microstrategy.com/MicroStrategyLibrary/app/47761EC611EA16DDAA780080EFB5CE10/19832122BD482ED7ED3C29B84F50E928/edit) as an example, it takes about 20s for the 1st rendering. While it take 7.4s in 25.07 for the 1st rendering.Issue only happens for the 1st time render a dashboard after installing the WorkStation.
```
- Test steps: ``

### BCED-2982 — [Workstation][Select existing dataset]The select existing dataset for replace dataset is different with add dataset
- Type: Defect
- Status: Done
- Description:

```
The select existing dataset for replace dataset is different with add dataset1.25.08 workstation connect to 25.08 library: https://mci-cbzy7-dev.hypernow.microstrategy.com/MicroStrategyLibrary/app(https://mci-cbzy7-dev.hypernow.microstrategy.com/MicroStrategyLibrary/app) tqmsuser/ddset2.Open dashboard3. Click "Insert" -> "Add Data" -> "Existing Dataset..."[Rally url - https://rally1.rallydev.com/slm/attachment/830565720003/image.png]4. For add dataset, the select existing dataset dialog is as below, click cancel[Rally url - https://rally1.rallydev.com/slm/attachment/830565711533/image.png]5. Click datasets context menu -> Replace All Datasets -> Existing Dataset...[Rally url - https://rally1.rallydev.com/slm/attachment/830565722869/image.png]6. Issue here:  the select existing dataset dialog is another style[Rally url - https://rally1.rallydev.com/slm/attachment/830565709331/image.png]
```
- Test steps: ``

### BCED-2981 —  [WorkStation] Cancel execution
- Type: Defect
- Status: Done
- Description:

```
ENVIRONMENT (Browser, OS, Secure Cloud info, URL, Intelligence Server info, metadata/warehouse info, etc):11.5.0800.0639STEPS TO REPRODUCE:Open dashboard in Workstation editorclick cancel button when loading, it shows error message, the editor should close directly.[Rally url - https://rally1.rallydev.com/slm/attachment/830286025485/image.png]
```
- Test steps: ``

### BCED-2980 — [Workstation][Export]The export don't follow the export settings
- Type: Defect
- Status: Done
- Description:

```
25.08 workstation connect to 25.08 library: https://mci-cbzy7-dev.hypernow.microstrategy.com/MicroStrategyLibrary(https://mci-cbzy7-dev.hypernow.microstrategy.com/MicroStrategyLibrary) tqmsuser/ddsetOpen a dashboard with multiple chaptersExport the dashboard with different export settings, eg: "This page" "This chapter" "Entire dashboard"[Rally url - https://rally1.rallydev.com/slm/attachment/830648653325/image.png]Issue here: the exported pdf don't follow the selected export setting
```
- Test steps: ``

### BCED-2977 — [WorkStation] Random get the Error: Uncaught TypeError: Cannot read properties of null (reading 'parentNode')
- Type: Defect
- Status: Done
- Description:

```
ENVIRONMENT (Browser, OS, Secure Cloud info, URL, Intelligence Server info, metadata/warehouse info, etc):WorkStation Version: 11.5.0800.00955Server: Vega https://vega.trial.cloud.microstrategy.com/MicroStrategyLibrary(https://vega.trial.cloud.microstrategy.com/MicroStrategyLibrary)Credentials: Your corp accountServer version: 11.5.0800.0076STEPS TO REPRODUCE:Connect 25.08 WorkStation to the environment https://vega.trial.cloud.microstrategy.com/MicroStrategyLibrary(https://vega.trial.cloud.microstrategy.com/MicroStrategyLibrary)Create a blank dashboard in "Rally Analytics Lite" ProjectClick "Insert" > "Browse Objects...", select dashboard "Public Objects > Reports > 2. Personal > 2.User Contents > sxiong > Demo Dashboards > Customer Service Management"Click "File > Save As", save it as a new dashboard in Vega environmentIssue Here: Random get the  Error: Uncaught TypeError: Cannot read properties of null (reading 'parentNode')[Rally url - https://rally1.rallydev.com/slm/attachment/830278039585/Screenshot 2025-07-31 at 11.19.33.png]
```
- Test steps: ``

### BCED-2971 — [WorkStation] Can't close dashboard editor by clicking close button when dashboard is in certain status
- Type: Defect
- Status: Done
- Description:

```
ENVIRONMENT (Browser, OS, Secure Cloud info, URL, Intelligence Server info, metadata/warehouse info, etc):11.5.0800.0639STEPS TO REPRODUCE:Open dashboard in Workstation editorclick cancel button in a rowdismiss the errorclick on close buttonissue here:dashboard editor remains there
```
- Test steps: ``

### BCED-2968 — [WorkStation] Click cancel button in a row will trigger error 
- Type: Defect
- Status: Done
- Description:

```
ENVIRONMENT (Browser, OS, Secure Cloud info, URL, Intelligence Server info, metadata/warehouse info, etc):11.5.0800.0639STEPS TO REPRODUCE:Open dashboard in Workstation editorclick cancel button in a rowissue here:[Rally url - https://rally1.rallydev.com/slm/attachment/830286788561/image.png]
```
- Test steps: ``

### BCED-2967 — [Workstation][link]Link to a html link in same tab, the actions in toolbar cannot work any more
- Type: Defect
- Status: Done
- Description:

```
25.08 workstation connect 25.08 library, eg: https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary(https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary) tqmsuser/ddsetOpen dashboard: link test yatongClick link text: "baidu in same tab"Issue here:[Rally url - https://rally1.rallydev.com/slm/attachment/830667976851/image.png]#- it will open baidu in current dashboard editor (in 25.07 it will open baidu in default browser)#- the actions in toolbar cannot work anymoreAnother case is link to a dashboard in same tab, it will open target dashboard in current dashboard editor, the title in toolbar is not correct, and the actions in 1st layer toolbar cannot work wellIn 25.07, it will open target dashboard in a new dashboard editor whether the link setting in open in same tab or not[Rally url - https://rally1.rallydev.com/slm/attachment/830667981729/image.png]
```
- Test steps: ``

### BCED-2966 — Close show data dialog, the icon does not stop loading
- Type: Defect
- Status: Done
- Description:

```
after closing the show data dialog, the icon kept loading.https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary/app/B628A31F11E7BD953EAE0080EF0583BD/64E5FFA6DB4347833942E2B8999D86C0/K53--K46(https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary/app/B628A31F11E7BD953EAE0080EF0583BD/64E5FFA6DB4347833942E2B8999D86C0/K53--K46)tqmsuser/ddset[Rally url - https://rally1.rallydev.com/slm/attachment/831444088333/Screen Recording 2025-08-19 at 13.37.56.gif]
```
- Test steps: ``

### BCED-2957 — (Converted to UserStory) [WorkStation] Performance degradation to open dashboard.
- Type: Defect
- Status: Done
- Description:

```
ENVIRONMENT (Browser, OS, Secure Cloud info, URL, Intelligence Server info, metadata/warehouse info, etc):WorkStation Version: 11.5.0800.00823Server: https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary(https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary)Credentials: tqmsuser/ddsetServer version: 11.5.0800.0073STEPS TO REPRODUCE:Connect to the environment https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary(https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary)Search dashboard "Employee Fitness_new" (dashboard link: https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary/app/B628A31F11E7BD953EAE0080EF0583BD/6E0917F28F436970AFC56DB97BF62F0B)(https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary/app/B628A31F11E7BD953EAE0080EF0583BD/6E0917F28F436970AFC56DB97BF62F0B))Open the dashboardIssue Here: It takes about 13.21s to open this dashboard in 25.08 WorkStation.Using 25.07 WorkStation, it takes about 8.03s to open the same dashboard25.08[Rally url - https://rally1.rallydev.com/slm/attachment/830098909397/2508.gif]25.07[Rally url - https://rally1.rallydev.com/slm/attachment/830098910591/2507.gif]
```
- Test steps: ``

### BCED-2956 —  [Workstation] Certify and set as template is missing in Save new dashboard
- Type: Defect
- Status: Done
- Description:

```
25.08 workstation connect to 25.08 library: https://mci-cbzy7-dev.hypernow.microstrategy.com/MicroStrategyLibrary/auth/ui/loginPage(https://mci-cbzy7-dev.hypernow.microstrategy.com/MicroStrategyLibrary/auth/ui/loginPage) tqmsuser/ddsetCreate a new dashboardClick close buttonpopup save boxClick "Save"[Rally url - https://rally1.rallydev.com/slm/attachment/830739193479/image.png]6. issue here: the set as Template and certify checkbox is missing, blow is 25.07[Rally url - https://rally1.rallydev.com/slm/attachment/830738722431/image.png]
```
- Test steps: ``

### BCED-2955 — [Font detect]Missing font is not pop up while there is some missing font in Custom viz
- Type: Defect
- Status: Done
- Description:

```
https://mci-cbzy7-dev.hypernow.microstrategy.com/MicroStrategyLibrary/app/B628A31F11E7BD953EAE0080EF0583BD/D25CE1CF428307B0E95AD0B489F2AC62/W232--K46(https://mci-cbzy7-dev.hypernow.microstrategy.com/MicroStrategyLibrary/app/B628A31F11E7BD953EAE0080EF0583BD/D25CE1CF428307B0E95AD0B489F2AC62/W232--K46) tqmsuser/ddsetGo to authoring modeIssue here: missing font is not pop up while there is missing font "Bookshelf Symbol 1" used in current page[Rally url - https://rally1.rallydev.com/slm/attachment/830293124523/image.png]
```
- Test steps: ``

### BCED-2953 — [Workstation] The comment input box is not show when select "Save" from file in 1st layer toolbar or click "Save" button in 2nd layer toolbar
- Type: Defect
- Status: Done
- Description:

```
25.08 workstation connect to 25.08 libraryEdit an exisiting dashboardClick "Save" from file in 1st layer toolbar or click "Save" button in 2nd layer toolbarIssue here, the dashboard will saved without a comment input box to add comment
```
- Test steps: ``

### BCED-2947 — [Workstation][Close]The dashboard cannot be closed for the first after cancel re-prompt
- Type: Defect
- Status: Done
- Description:

```
1.25.08 workstation connect to 25.08 library: https://mci-cbzy7-dev.hypernow.microstrategy.com/MicroStrategyLibrary/app(https://mci-cbzy7-dev.hypernow.microstrategy.com/MicroStrategyLibrary/app) tqmsuser/ddset2.Open dashboard with prompt[Rally url - https://rally1.rallydev.com/slm/attachment/830297537173/image.png]3.Click re-prompt and cancel re-prompt4.Click close button5. Issue here, the dashboard cannot be closed[Rally url - https://rally1.rallydev.com/slm/attachment/830297937725/Screen Recording 2025-07-31 at 17.25.35.gif]
```
- Test steps: ``

### BCED-2945 — [Workstation]Shouldn't show library login page when open dashboard during session timeout
- Type: Defect
- Status: Done
- Description:

```
Shouldn't show library login page when open dashboard during session timeout[Rally url - https://rally1.rallydev.com/slm/attachment/830094506433/image.png]
```
- Test steps: ``

### BCED-2942 — [Workstation]Cancel during executing dashboard will go to embedded library home page
- Type: Defect
- Status: Done
- Description:

```
25.08 wokstation connect to 25.08 librarydouble click a dashboard to go to edit modeclick "cancel" during executingissue here: it will show embedded library home page[Rally url - https://rally1.rallydev.com/slm/attachment/830100011347/image.png]
```
- Test steps: ``

### BCED-2932 — [Workstation][Cancel]Click close button when open a prompted dashboard, the instance is not deleted
- Type: Defect
- Status: Done
- Description:

```
1.25.08 workstation connect to 25.08 library: https://mci-cbzy7-dev.hypernow.microstrategy.com/MicroStrategyLibrary/app(https://mci-cbzy7-dev.hypernow.microstrategy.com/MicroStrategyLibrary/app) tqmsuser/ddset2.Open dashboard with prompt[Rally url - https://rally1.rallydev.com/slm/attachment/830297537173/image.png]3. Click close button without answer the prompt[Rally url - https://rally1.rallydev.com/slm/attachment/830299945389/image.png]4. Issue here, the instance is not deleted[Rally url - https://rally1.rallydev.com/slm/attachment/830299953685/image.png]
```
- Test steps: ``

### BCED-2931 — [F43445][WorkStation]There is no response after clicking "Download .mstr File"
- Type: Defect
- Status: Done
- Description:

```
ENVIRONMENT (Browser, OS, Secure Cloud info, URL, Intelligence Server info, metadata/warehouse info, etc):WorkStation Version: 11.5.0800.01350Server: Vega https://vega.trial.cloud.microstrategy.com/MicroStrategyLibrary(https://vega.trial.cloud.microstrategy.com/MicroStrategyLibrary)Credentials: Your corp accountServer version: 11.5.0800.0129STEPS TO REPRODUCE:Connect 25.08 WorkStation to Vega environmentOpen any dashboardClick "File" > "Download .mstr File"Issue here: There is no response after clicking "Download .mstr File"SUPPORTING DOCUMENTATION (Screenshot, video/gif, .mstr file, logs, etc):[Rally url - https://rally1.rallydev.com/slm/attachment/830926110517/Screenshot 2025-08-11 at 13.10.21.png]
```
- Test steps: ``

### BCED-2928 — [Workstation][Replace prompt dataset] Crash when try to replace prompt dataset
- Type: Defect
- Status: Done
- Description:

```
25.08 workstation connect to 25.08 library: https://mci-cbzy7-dev.hypernow.microstrategy.com/MicroStrategyLibrary/app(https://mci-cbzy7-dev.hypernow.microstrategy.com/MicroStrategyLibrary/app) tqmsuser/ddsetOpen dashboard with prompt[Rally url - https://rally1.rallydev.com/slm/attachment/830297537173/image.png]3. Click on dataset menu and select "replace dataset"[Rally url - https://rally1.rallydev.com/slm/attachment/830300201017/image.png]4. Choose "Categoryprompt"5. Issue here: show error "An exception is not caught in js which might cause Workstation crash"[Rally url - https://rally1.rallydev.com/slm/attachment/830299658565/image.png]
```
- Test steps: ``

### BCED-2926 — [WorkStation] Click the link to another dashboard then the editor becomes empty 
- Type: Defect
- Status: Done
- Description:

```
ENVIRONMENT (Browser, OS, Secure Cloud info, URL, Intelligence Server info, metadata/warehouse info, etc):WorkStation Version: 11.5.0800.00823Server: https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary(https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary)Credentials: tqmsuser/ddsetServer version: 11.5.0800.0073STEPS TO REPRODUCE:Connect to the environment https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary(https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary)Open dashboard "yy dashboard"click the dossier link  [Rally url - https://rally1.rallydev.com/slm/attachment/830109079319/image.png]Issue Here: popup an empty page.SUPPORTING DOCUMENTATION (Screenshot, video/gif, .mstr file, logs, etc):25.08[Rally url - https://rally1.rallydev.com/slm/attachment/830109068427/image.png]25.07 - workstation will pop up a new editor for linked dashboard.
```
- Test steps: ``

### BCED-2925 — [WorkStation] Auto Dashboard input box is not displayed
- Type: Defect
- Status: Done
- Description:

```
ENVIRONMENT (Browser, OS, Secure Cloud info, URL, Intelligence Server info, metadata/warehouse info, etc):WorkStation Version: 11.5.0800.00830Server: Vega https://vega.trial.cloud.microstrategy.com/MicroStrategyLibrary(https://vega.trial.cloud.microstrategy.com/MicroStrategyLibrary)Credentials: Your corp accountServer version: 11.5.0800.0076STEPS TO REPRODUCE:Connect to the environment https://vega.trial.cloud.microstrategy.com/MicroStrategyLibrary(https://vega.trial.cloud.microstrategy.com/MicroStrategyLibrary)Create a dashboard, add any datasetClick "Auto Dashboard" buttonIssue Here: Auto Dashboard input box is not displayed, user cannot ask AI to create visualization[Rally url - https://rally1.rallydev.com/slm/attachment/830113359119/Screenshot 2025-07-29 at 17.23.48.png]
```
- Test steps: ``

### BCED-2912 — [F43445][WorkStation] Cannot close dashboard after session expire.
- Type: Defect
- Status: Done
- Description:

```
ENVIRONMENT (Browser, OS, Secure Cloud info, URL, Intelligence Server info, metadata/warehouse info, etc):WorkStation Version: 11.5.0800.01350Server: Vega https://vega.trial.cloud.microstrategy.com/MicroStrategyLibrary(https://vega.trial.cloud.microstrategy.com/MicroStrategyLibrary)Credentials: Your corp accountServer version: 11.5.0800.0131STEPS TO REPRODUCE:Connect 25.08 WorkStation to Vega environmentOpen any dashboardWait for session expire. I opened the dashboard yesterday and wait for a night.Close dashboardIssue here: Cannot close the dashboard after session expireSometimes it shows below error in the dashboard editor[Rally url - https://rally1.rallydev.com/slm/attachment/831310751013/Screenshot 2025-08-16 at 09.15.55.png]
```
- Test steps: ``

### BCED-2907 — [WorkStation] Should not use application level setting (e.g. Disable toolbar) when editing dashboard in WorkStation
- Type: Defect
- Status: Done
- Description:

```
ENVIRONMENT (Browser, OS, Secure Cloud info, URL, Intelligence Server info, metadata/warehouse info, etc):https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary(https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary)Server Version: 11.5.0800.0092Credentials: tqmsuser/ddsetWorkStation Version: 11.5.0800.01008STEPS TO REPRODUCE:Connect 25.08 WorkStation to the environmentOpen the default Application > Components, check "Disable toolbar", Save the change [Rally url - https://rally1.rallydev.com/slm/attachment/830360613325/Screenshot 2025-08-01 at 09.55.37.png]Open any dashboard in this environmentIssue Here: Toolbar is disabled. Open a dashboard in WorkStation, it should not use application level settingsIn 25.07 WorkStation, 25.08 BI Web, open dashboard will not use application level settings[Rally url - https://rally1.rallydev.com/slm/attachment/830360614359/Screenshot 2025-08-01 at 09.49.28.png]
```
- Test steps: ``

### BCED-2906 — [WorkStation] A gap displays between toolbar and dashboard due to "Generate embedding URL" button
- Type: Defect
- Status: Done
- Description:

```
ENVIRONMENT (Browser, OS, Secure Cloud info, URL, Intelligence Server info, metadata/warehouse info, etc):WorkStation Version: 11.5.0800.00830Server: Vega https://vega.trial.cloud.microstrategy.com/MicroStrategyLibrary(https://vega.trial.cloud.microstrategy.com/MicroStrategyLibrary)Credentials: Your corp accountServer version: 11.5.0800.0076STEPS TO REPRODUCE:Connect to the environment https://vega.trial.cloud.microstrategy.com/MicroStrategyLibrary(https://vega.trial.cloud.microstrategy.com/MicroStrategyLibrary)Edit any dashboardIssue Here: A gap displays between toolbar and dashboard. There is a "Generate embedding URL" button displays on this area.If issue is not reproduced, decrease the width of the dashboard editor, then you'll see the "Generate embedding URL" button displays under "Save" button[Rally url - https://rally1.rallydev.com/slm/attachment/830116320639/Screenshot 2025-07-29 at 18.04.16.png]
```
- Test steps: ``

### BCED-2903 — [WorkStation] snowflake oauth connection using Azure does not go through
- Type: Defect
- Status: Done
- Description:

```
DESCRIPTION:   snowflake oauth connection using Azure does not go through in workstation, even through we login through browser, it does not callback   [Rally url - https://rally1.rallydev.com/slm/attachment/831552217891/image.jpeg]EXPECTED BEHAVIOR:ENVIRONMENT (Browser, OS, Secure Cloud info, URL, Intelligence Server info, metadata/warehouse info, etc):STEPS TO REPRODUCE:SUPPORTING DOCUMENTATION (Screenshot, video/gif, .mstr file, logs, etc):Please click[here](https://microstrategy.atlassian.net/wiki/spaces/TECAGILEWORKS/pages/162727022/Defect+Logging+Guidelines)to read the full guidelines of logging defects.
```
- Test steps: ``

### BCED-2901 — [WorkStation] Snowflake Oauth connection  use pingone does not go through 
- Type: Defect
- Status: Done
- Description:

```
DESCRIPTION:   Snowflake Oauth connection  use pingone does not go through   https://tec-w-011411.labs.microstrategy.com:8443/MicroStrategyLibrary/(https://tec-w-011411.labs.microstrategy.com:8443/MicroStrategyLibrary/)  administrator  [Rally url - https://rally1.rallydev.com/slm/attachment/831552215059/image.png]EXPECTED BEHAVIOR:ENVIRONMENT (Browser, OS, Secure Cloud info, URL, Intelligence Server info, metadata/warehouse info, etc):STEPS TO REPRODUCE:SUPPORTING DOCUMENTATION (Screenshot, video/gif, .mstr file, logs, etc):Please click[here](https://microstrategy.atlassian.net/wiki/spaces/TECAGILEWORKS/pages/162727022/Defect+Logging+Guidelines)to read the full guidelines of logging defects.
```
- Test steps: ``

### BCED-2893 — Workstation | Fails to close dashboard if it's running, it says: Uncaught TypeError: Cannot read properties of null (reading 'close')
- Type: Defect
- Status: Done
- Description:

```
DESCRIPTION: Workstation | Fails to close dashboard if it's running, it says: Uncaught TypeError: Cannot read properties of null (reading 'close')EXPECTED BEHAVIOR:  should be able to close itENVIRONMENT (Browser, OS, Secure Cloud info, URL, Intelligence Server info, metadata/warehouse info, etc):STEPS TO REPRODUCE:connect to https://tec-l-1183620.labs.microstrategy.com/MicroStrategyLibrary/app(https://tec-l-1183620.labs.microstrategy.com/MicroStrategyLibrary/app) login as mstr1 / 123456go to dashboards, search Dashboard with nested promptsrmc on it -> editchoose year for attribute list and select all categories in 2nd prompt windowclick applyafter prompt window dispears, click on close buttonissue here:[Rally url - https://rally1.rallydev.com/slm/attachment/830116058495/image.png]SUPPORTING DOCUMENTATION (Screenshot, video/gif, .mstr file, logs, etc):Please click[here](https://microstrategy.atlassian.net/wiki/spaces/TECAGILEWORKS/pages/162727022/Defect+Logging+Guidelines)to read the full guidelines of logging defects.
```
- Test steps: ``

### BCED-2891 — [Workstation][Error handling] The error msg is confused when insert unpublished dataset
- Type: Defect
- Status: Done
- Description:

```
25.08 workstation connect to 25.08 libraryOpen dashboardClick "Insert" -> "Add Data" -> "Existing Dataset..."Select any unpublished dataset, eg: "Airline Data"Issue here: the error msg is not clear, the unpublished dataset name is "undefined"[Rally url - https://rally1.rallydev.com/slm/attachment/830380578149/image.png]In library, it can show the unpublished dataset name:[Rally url - https://rally1.rallydev.com/slm/attachment/830380587095/image.png]
```
- Test steps: ``

### BCED-2889 — Workstation | add prompted dataset , prompt apply error message is empty and user can't cancel or close it
- Type: Defect
- Status: Done
- Description:

```
DESCRIPTION: Workstation | Fails to close dashboard if it's running, it says: Uncaught TypeError: Cannot read properties of null (reading 'close')EXPECTED BEHAVIOR:  should be able to close itENVIRONMENT (Browser, OS, Secure Cloud info, URL, Intelligence Server info, metadata/warehouse info, etc):STEPS TO REPRODUCE:connect to https://tec-l-1183620.labs.microstrategy.com/MicroStrategyLibrary/app(https://tec-l-1183620.labs.microstrategy.com/MicroStrategyLibrary/app) login as mstr1 / 123456go to dashboards, search 2.2 Dashboard, DDAclick on add data in tool barselect prompted reportclick on applyissue here:I can't close or cancel the prompt dialoguenothing in notification[Rally url - https://rally1.rallydev.com/slm/attachment/830116070431/image.png]SUPPORTING DOCUMENTATION (Screenshot, video/gif, .mstr file, logs, etc):Please click[here](https://microstrategy.atlassian.net/wiki/spaces/TECAGILEWORKS/pages/162727022/Defect+Logging+Guidelines)to read the full guidelines of logging defects.
```
- Test steps: ``

### BCED-2883 — [WorkStation] Layers panel in 25.08 is much wider compared with 25.07, cannot reduce the width of layer panel
- Type: Defect
- Status: Done
- Description:

```
ENVIRONMENT (Browser, OS, Secure Cloud info, URL, Intelligence Server info, metadata/warehouse info, etc):WorkStation Version: 11.5.0800.00830Server: Vega https://vega.trial.cloud.microstrategy.com/MicroStrategyLibrary(https://vega.trial.cloud.microstrategy.com/MicroStrategyLibrary)Credentials: Your corp accountServer version: 11.5.0800.0076STEPS TO REPRODUCE:Connect to the environment https://vega.trial.cloud.microstrategy.com/MicroStrategyLibrary(https://vega.trial.cloud.microstrategy.com/MicroStrategyLibrary)Edit any dashboardClick "Layers Panel" button on the toolbar to trigger layers panelIssue Here: Layers panel is much wider compared with 25.07, cannot reduce the width of layer panel. The area to display visualiztions is smaller.Resize the dashboard editor window, the Layers panel is overlap with Format panel and dashboard contents25.08[Rally url - https://rally1.rallydev.com/slm/attachment/830120144787/Screenshot 2025-07-29 at 18.56.23.png][Rally url - https://rally1.rallydev.com/slm/attachment/830198981463/Screenshot 2025-07-30 at 12.29.35.png]25.07[Rally url - https://rally1.rallydev.com/slm/attachment/830120145269/Screenshot 2025-07-29 at 18.56.40.png][Rally url - https://rally1.rallydev.com/slm/attachment/830198982363/Screenshot 2025-07-30 at 12.29.46.png]
```
- Test steps: ``

### BCED-2881 — [Workstation]There are 2 "Edit without data" items in dashboard context menu
- Type: Defect
- Status: Done
- Description:

```
There are 2 "Edit without data" items in dashboard context menu[Rally url - https://rally1.rallydev.com/slm/attachment/830084379327/image.png]
```
- Test steps: ``

### BCED-2880 — [Workstation] The title in 1st toolbar is wrong when edit without data
- Type: Defect
- Status: Done
- Description:

```
The title in 1st toolbar is wrong when edit without data[Rally url - https://rally1.rallydev.com/slm/attachment/830386815107/image.png]
```
- Test steps: ``

### BCED-2879 — [WorkStation] Export function is broken due to a crash error
- Type: Defect
- Status: Done
- Description:

```
ENVIRONMENT (Browser, OS, Secure Cloud info, URL, Intelligence Server info, metadata/warehouse info, etc):WorkStation Version: 11.5.0800.00830Server: Vega https://vega.trial.cloud.microstrategy.com/MicroStrategyLibrary(https://vega.trial.cloud.microstrategy.com/MicroStrategyLibrary)Credentials: Your corp accountServer version: 11.5.0800.0076STEPS TO REPRODUCE:Connect to the environment https://vega.trial.cloud.microstrategy.com/MicroStrategyLibrary(https://vega.trial.cloud.microstrategy.com/MicroStrategyLibrary)Open a dashboard.Click "File" > "Export to PDF", click "Export" button on the dialogIssue Here: Crash error displays. User cannot export any dashboard to PDF[Rally url - https://rally1.rallydev.com/slm/attachment/830121468451/Screenshot 2025-07-29 at 19.03.41.png]
```
- Test steps: ``

### BCED-2875 — [WorkStation] Crash error when clicking "File" button on Edit Mosaic Model page
- Type: Defect
- Status: Done
- Description:

```
ENVIRONMENT (Browser, OS, Secure Cloud info, URL, Intelligence Server info, metadata/warehouse info, etc):WorkStation Version: 11.5.0800.01008Server: Vega https://vega.trial.cloud.microstrategy.com/MicroStrategyLibrary(https://vega.trial.cloud.microstrategy.com/MicroStrategyLibrary)Credentials: Your corp accountServer version: 11.5.0800.0076STEPS TO REPRODUCE:Connect 25.08 WorkStation to the environment https://vega.trial.cloud.microstrategy.com/MicroStrategyLibrary(https://vega.trial.cloud.microstrategy.com/MicroStrategyLibrary)Navigate to DashboardsSearch dashboard "Drill_MosaicDataset1", open this dashboardOn Datasets panel, click the context menu of "Mosaic Model for Modern grid" dataset, click "Edit Mosaic Model..."On Mosaic Model edit page, click "File" button on menu barIssue Here: Get the crash error.[Rally url - https://rally1.rallydev.com/slm/attachment/830384602617/Screenshot 2025-08-01 at 17.50.36.png]
```
- Test steps: ``

### BCED-2874 — [Workstation] Click "Responsive view" in dashboard, show uncaught TypeError:  Cannot read properties of null (reading 'offsetHeight')
- Type: Defect
- Status: Done
- Description:

```
25.08 workstation connect to 25.08 libraryOpen dashboard: 7382E5D76B46ABDD065200A7999B68D4Click "Responsive Preview" in toolbarIssue here: show uncaught TypeError:  Cannot read properties of null (reading 'offsetHeight')[Rally url - https://rally1.rallydev.com/slm/attachment/830376218175/image.png]
```
- Test steps: ``

### BCED-2873 — Unable to create python data source on workstation Server based dashboard
- Type: Defect
- Status: Done
- Description:

```
DESCRIPTION:Unable to create python data source on workstation Server based dashboardEXPECTED BEHAVIOR:ENVIRONMENT (Browser, OS, Secure Cloud info, URL, Intelligence Server info, metadata/warehouse info, etc):11.5.0900.0045STEPS TO REPRODUCE:issue: we can't create python datasource on workstation server based dashboard, but we can create it from workstation standalone dataset.server based dashboard[Rally url - https://rally1.rallydev.com/slm/attachment/831550860273/image.png]#- workstation standalone dataset:[Rally url - https://rally1.rallydev.com/slm/attachment/831551372297/image.png]SUPPORTING DOCUMENTATION (Screenshot, video/gif, .mstr file, logs, etc):Please click[here](https://microstrategy.atlassian.net/wiki/spaces/TECAGILEWORKS/pages/162727022/Defect+Logging+Guidelines)to read the full guidelines of logging defects.
```
- Test steps: ``

### BCED-2636 — Component level test
- Type: Story
- Status: Done
- Description:

```

```
- Test steps: ``

### BCED-2630 — Remove feature flag for modern grid 
- Type: Story
- Status: Done
- Description:

```
Now we have 2 feature flag in modern grid,1. for default grid2. server side or client side
```
- Test steps: ``

### BCED-2614 — Delivery Work Item 4 ｜ Dashboard | WS
- Type: Story
- Status: Done
- Description:

```
PPlease replace this placeholder with the actual stories required to deliver and validate the Feature end-to-end.
```
- Test steps: ``

### BCED-2600 — Set up a new plugin project workstation-dossier-editor and its CI
- Type: Story
- Status: Done
- Description:

```
Please replace this placeholder with the actual stories required to deliver and validate the Feature end-to-end.
```
- Test steps: ``

### BCED-2552 — [WorkStation] Improve Performance via dashboard cache
- Type: Story
- Status: Done
- Description:

```
Improve Performance via dashboard cache.
```
- Test steps: ``

### BCED-2548 — Investigate the solution
- Type: Story
- Status: Done
- Description:

```
Please replace this placeholder with the actual stories required to deliver and validate the Feature end-to-end.
```
- Test steps: ``

### BCED-2544 — [WorkStation] Performance degradation to open dashboard.
- Type: Story
- Status: Done
- Description:

```
ENVIRONMENT (Browser, OS, Secure Cloud info, URL, Intelligence Server info, metadata/warehouse info, etc):WorkStation Version: 11.5.0800.00823Server: https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary(https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary)Credentials: tqmsuser/ddsetServer version: 11.5.0800.0073STEPS TO REPRODUCE:Connect to the environment https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary(https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary)Search dashboard "Employee Fitness_new" (dashboard link: https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary/app/B628A31F11E7BD953EAE0080EF0583BD/6E0917F28F436970AFC56DB97BF62F0B)(https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary/app/B628A31F11E7BD953EAE0080EF0583BD/6E0917F28F436970AFC56DB97BF62F0B))Open the dashboardIssue Here: It takes about 13.21s to open this dashboard in 25.08 WorkStation.Using 25.07 WorkStation, it takes about 8.03s to open the same dashboard25.08[Rally url - https://rally1.rallydev.com/slm/attachment/830098909397/2508.gif]25.07[Rally url - https://rally1.rallydev.com/slm/attachment/830098910591/2507.gif]
```
- Test steps: ``

### BCED-2535 — Implement the code
- Type: Story
- Status: Done
- Description:

```
Please replace this placeholder with the actual stories required to deliver and validate the Feature end-to-end.
```
- Test steps: ``

### BCED-2531 —  OAuth/SDK/CC sources failed on Workstation Server based dashboard mode
- Type: Story
- Status: Done
- Description:

```
DESCRIPTION:OAuth/SDK/CC sources failed on Workstation Server based dashboard modeEXPECTED BEHAVIOR:ENVIRONMENT (Browser, OS, Secure Cloud info, URL, Intelligence Server info, metadata/warehouse info, etc):11.5.0800.0127PASS build: https://nexus.internal.microstrategy.com/content/repositories/releases/com/microstrategy/m2021/workstation-windows/11.5.0800.00804/(https://nexus.internal.microstrategy.com/content/repositories/releases/com/microstrategy/m2021/workstation-windows/11.5.0800.00804/)STEPS TO REPRODUCE:Workstation + libraryDashboardsOAuth/SDK/CC sourcesIssues:#1： An error pops out when click OAuth sources to login[Rally url - https://rally1.rallydev.com/slm/attachment/831004910347/image.png]#- #2：SDK sources go to browser and can't return back to workstation##- [Rally url - https://rally1.rallydev.com/slm/attachment/831004910735/image.png]#- #3: Create and Save DBRole on Dashboards reported an error:##- [Rally url - https://rally1.rallydev.com/slm/attachment/831022504953/image.png]SUPPORTING DOCUMENTATION (Screenshot, video/gif, .mstr file, logs, etc):Please click[here](https://microstrategy.atlassian.net/wiki/spaces/TECAGILEWORKS/pages/162727022/Defect+Logging+Guidelines)to read the full guidelines of logging defects.
```
- Test steps: ``

### BCED-2528 — Enhance pre loading for dashboard editor in WS
- Type: Story
- Status: Done
- Description:

```

```
- Test steps: ``

### BCED-2505 — Delivery Work Item 2 ｜ Dashboard | WS
- Type: Story
- Status: Done
- Description:

```
Please replace this placeholder with the actual stories required to deliver and validate the Feature end-to-end.
```
- Test steps: ``

### BCED-2497 — Delivery Work Item 1 | Dashboard | WS
- Type: Story
- Status: Done
- Description:

```
Please replace this placeholder with the actual stories required to deliver and validate the Feature end-to-end.
```
- Test steps: ``

### BCED-2485 — Automation
- Type: Story
- Status: Done
- Description:

```
This User Story defines all of the planning-related tasks necessary for designing and defining a New Feature at MSTR across all key roles PM, SE, UX, and QA. The output is intended to describe the work required for cross-team alignment, estimation, sizing, risk, 3rd party, automation plans across all teams to produce a fully automated increment of functionality for the Platform. The progress on these planning states shall be measured in the TEC.PD planning metrics and the intent is not to put new work items into the execution plan unless they are well understood, sized, prioritized.
```
- Test steps: ``

### BCED-2470 — [Parent Story] Cross team evaluation
- Type: Story
- Status: Done
- Description:

```

```
- Test steps: ``

### BCED-2459 — Enhancement Requests
- Type: Story
- Status: Done
- Description:

```

```
- Test steps: ``

### BCED-2438 — [Parent Story] Test ｜ Dashboard | WS
- Type: Story
- Status: Done
- Description:

```
Please replace this placeholder with the actual stories required to deliver and validate the Feature end-to-end.
```
- Test steps: ``

### BCED-719 — NLG in ws editor
- Type: Story
- Status: Done
- Description:

```

```
- Test steps: ``

### BCDA-5299 — Dashboard Filter in ws editor
- Type: Story
- Status: Done
- Description:

```

```
- Test steps: ``

### BCDA-632 — transaction in ws editor
- Type: Story
- Status: Done
- Description:

```

```
- Test steps: ``

### BCAP-7128 —  DI in ws editor
- Type: Story
- Status: Done
- Description:

```

```
- Test steps: ``

### BCAP-1063 — DI in ws editor
- Type: Story
- Status: Done
- Description:

```

```
- Test steps: ``

### AHIT-346 — auto dashboard 2.0 in ws editor
- Type: Story
- Status: Done
- Description:

```

```
- Test steps: ``


## 4. BCED-2416 comment highlights

Discovered linked issue keys in comments: BF-2, BF-4

- **Yan Zhang** (2025-09-12): Rally item (F43445) was successfully migrated to Jira.
- **Yan Zhang** (2025-09-03): 2025-09-03T09:54:29 - Yang Du @Shannon Meehan please be awared that we slightly updated the document: https://microstrategy.atlassian.net/wiki/spaces/SDK/pages/5197529587/F43445+Enhance+Workstation+dashboard+authoring+experience+with+Library+capability+parity(https://microstrategy.atlassian.net/wiki/spaces/SDK/pages/5197529587/F43445+Enhance+Workstation+dashboard+authoring+experience+with+Library+capability+parity) today, and add one sentence: "In the future, all newly added features will be automatically synced from the Library to the new editor."
- **Yan Zhang** (2025-09-03): 2025-08-29T19:29:43 - Shannon Meehan @Yang Du Noted! We'll send over the draft doc as soon as its ready!
- **Yan Zhang** (2025-09-03): 2025-08-29T09:59:16 - Lingping Zhu @Shuai Xiong QA summary looks pretty good to me. Thank you.@Jianhua Wang as we synced preivously with Qingling: this is one preview feature. It passed in most of the tests but got a low pass in the performance test. So the overall result is low pass. It's hidden by one setting, pretty safe. Please take a review for QA summary when you are available.cc @Yang Du
- **Yan Zhang** (2025-09-03): 2025-08-29T09:03:55 - Shuai Xiong @Lingping Zhu @Jianhua Wang @Yang Du  QA Summary for this feature is added to feature description, would you please help to review? Thanks. cc @Yanping Tong @Ran Yu @Qingling DongIn 25.09, this feature is disabled by default. User can turn on “Enable New Dashboard Editor” setting in WorkStation Help menu to enable this feature.MTDI blocker defects are fixed on the New dashboard editor.Performance defects of the new dashboard editor are moved to future release, no change on performance.E2E Testing & Functionality - Pass90 defects detected (4P1, 46 P2, 38 P3, 2 P4) - Defects are tracked in [DS2856](https://rally1.rallydev.com/#/?detail=/defectsuite/830003521161&fdp=true)Blocker defects for MTDI are fixed in 25.09.Till today(8/28), still 2 P2 defects open.Ready for test - [DE334755](https://rally1.rallydev.com/#/?detail=/defect/831975135539&fdp=true): [Workstation] “To continue, save your work in the Database Connections window.” would not disappear even
- **Yan Zhang** (2025-09-03): 2025-08-29T05:52:38 - Yang Du @Shannon Meehan would you please help update the document for this feature https://microstrategy.atlassian.net/wiki/spaces/SDK/pages/5197529587/F43445+Enhance+Workstation+dashboard+authoring+experience+with+Library+capability+parity(https://microstrategy.atlassian.net/wiki/spaces/SDK/pages/5197529587/F43445+Enhance+Workstation+dashboard+authoring+experience+with+Library+capability+parity) in the 25.09 release. Including readme too.cc @Qingling Dong
- **Yan Zhang** (2025-09-03): 2025-08-27T12:28:41 - Yang Du @Stan Gordiienko set this feature to validated, and highly appreciate @Luke Lasich (PO CA-WSInfrastructure GDC) @Michal Kowalik @Mingzhi Zhu (@mizhu) @Lingping Zhu @Shuai Xiong @Rong Yu @Yang Huang  (Zoe) @Jianglong Ma @Ruiqing Xu @Cong Qian (PO of Application Gateways CTC) @Weifei Yu (PO of Self-Service Modeling) @Yan Rao (PO) @Yuyuan Wu for your solid support!cc @Qingling Dong @Liqun Xu (SM)
- **Yan Zhang** (2025-09-03): 2025-08-21T07:59:12 - Weifei Yu (PO of Self-Service Modeling) @Jonasz Kubik (PO of the CLD-Admin GDC) @Yang Du , currently only mosaic model RMC option has Edit in Library, we don't support Mosaic Studio on Workstation yet. It's separate with Dashboard.  Mosaic model RMC option has Dashboard in Library, for this one I think after this feature, it should be directly use Dashboard in Workstation. For Dashboard on Workstation, for dataset with Mosaic model, since currently we don't support edit mosaic model standalone object on workstation yet, based on the discussion with @Mohamed Diakite Pineda (Moha) (@mdiakite) (PO of AA-Analytics) @Peng Peng(PO of BI)  before, we think we don't need to expose this for Dashboard dataset panel as well. @Mohamed Diakite Pineda (Moha) (@mdiakite) (PO of AA-Analytics) @Peng Peng(PO of BI) , please clarify if I'm wrong.
- **Yan Zhang** (2025-09-03): 2025-08-21T07:44:27 - Yang Du @Jonasz Kubik (PO of the CLD-Admin GDC) I think @Weifei Yu (PO of Self-Service Modeling)  have some concerns about exposing the Mosaic model in WS, and it us not ready for 25.09 release. Weifei, can you help explain it?
- **Yan Zhang** (2025-09-03): 2025-08-21T07:16:15 - Jonasz Kubik (PO of the CLD-Admin GDC) @Yang Du can we already adjust the RMC option for Mosaic Models in WS so that they can be edited locally in Workstation instead of sending the user to the library editor?  cc: @Patryk Neumann
- **Yan Zhang** (2025-09-03): 2025-08-12T15:18:54 - Yang Du Unfortunately, in the 25.08 release, we found a showstopper issue [DE332662](https://rally1.rallydev.com/#/?detail=/defect/831004911521&fdp=true): OAuth/SDK/CC sources failed on Workstation Server based dashboard mode, which will lead to failure when connecting to OAuth/SDK/CC source with the embedded DI editor in the Workstation dashboard editor.The root cause is that the new editor plugin uses window.open() to open OAuth/SDK/CC windows, which have an independent context, that are not able to communicate with the main dashboard window.After discussing with engineers, we think it is risky to fix this issue in the 25.08 release since it requires both Workstation Native and plugin changes. Besides, this feature is driven by internal to eliminate the gap between the Workstation dashboard editor and the Library dashboard editor.As a result, I moved this feature to the 25.09 release, and will fix this issue as well as enhance the page loading speed to make our
- **Yan Zhang** (2025-09-03): 2025-08-08T15:58:50 - Yang Du All the defects are fixed, set to validated.@Stan Gordiienko  @Qingling Dong @Liqun Xu (SM) @Lingping Zhu
- **Yan Zhang** (2025-09-03): 2025-08-08T04:29:33 - Lingping Zhu @Yang Du @Qingling Dong @Jianhua WangHere is the QA summary for this feature. Would you please take a review when you are available? 2 tips:We still have 2 P2 defects scheduled to be fixed by COB today, so ideally there will be no P2 defects remaining after the 25.08 release;Regarding the test results, it’s a PASS overall, although the performance part is Low-Pass.For the detail information, please refer to QA summary part. Thank you.cc @Shuai XiongQA SummaryE2E Testing & FunctionalityResult: Pass66 defects detected (1 P1, 29 P2, 35 P3, 1 P4) - Defects are tracked in [DS2856](https://rally1.rallydev.com/#/?detail=/defectsuite/830003521161&fdp=true)All defects have been reviewed. P1 and P2 defects are fixed in 25.08; P3 and P4 defects are scheduled in 25.09~26-H1.Till today(8/7), still 2 P2 defects open in 25.08 and will fix on 8/8.[DE331555](https://rally1.rallydev.com/#/?detail=/defect/830209204821&fdp=true): [Workstation]The "Certify" and "Set as te
- **Yan Zhang** (2025-09-03): 2025-08-07T14:44:17 - Yang Du Move due date to 8.8, one open defect, plan to fix in 8.8
- **Yan Zhang** (2025-09-03): 2025-08-06T10:59:23 - Yang Du Change Due date to 8/7, still have some open defect waiting for build.
- **Yan Zhang** (2025-09-03): 2025-07-21T03:39:32 - Steven Weber (DM) *Comment added in Jira by Yan Zhang on Jul 20, 2025, 11:39 PM:*—2025-07-21T02:48:36 - Steven Weber (DM): *Comment added in Jira by *Yan Zhang* on Jul 20, 2025, 10:48 PM:*—2025-07-16T09:02:18 - Yang Du: @Shuai Xiong @Lingping Zhu @Stan Gordiienko  would you please help review the requirements in description? cc @Ran Yu @Yanping Tong—Original comment viewable in [Jira](https://strategyagile.atlassian.net/browse/BF-2?focusedCommentId=10649&page=com.atlassian.jira.plugin.system.issuetabpanels%3Acomment-tabpanel#comment-10649(https://strategyagile.atlassian.net/browse/BF-2?focusedCommentId=10649&page=com.atlassian.jira.plugin.system.issuetabpanels%3Acomment-tabpanel#comment-10649))—Original comment viewable in [Jira](https://strategyagile.atlassian.net/browse/BF-4?focusedCommentId=11000&page=com.atlassian.jira.plugin.system.issuetabpanels%3Acomment-tabpanel#comment-11000)
- **Yan Zhang** (2025-09-03): 2025-07-21T03:39:28 - Steven Weber (DM) *Comment added in Jira by Yan Zhang on Jul 20, 2025, 11:39 PM:*—2025-07-15T05:16:06 - Shu Liu: @Ran Yu @Yang Du Can we have a design review for this feature? I would like to know whether Document and Report can also use the same approach.@Qingling Dong—Original comment viewable in [Jira](https://strategyagile.atlassian.net/browse/BF-4?focusedCommentId=10995&page=com.atlassian.jira.plugin.system.issuetabpanels%3Acomment-tabpanel#comment-10995)
- **Yan Zhang** (2025-09-03): 2025-07-21T03:39:28 - Steven Weber (DM) *Comment added in Jira by Yan Zhang on Jul 20, 2025, 11:39 PM:*—2025-07-16T09:02:18 - Yang Du: @Shuai Xiong @Lingping Zhu @Stan Gordiienko  would you please help review the requirements in description? cc @Ran Yu @Yanping Tong—Original comment viewable in [Jira](https://strategyagile.atlassian.net/browse/BF-4?focusedCommentId=10997&page=com.atlassian.jira.plugin.system.issuetabpanels%3Acomment-tabpanel#comment-10997)
- **Yan Zhang** (2025-09-03): 2025-07-21T03:39:34 - Steven Weber (DM) *Comment added in Jira by Yan Zhang on Jul 20, 2025, 11:39 PM:*—Successfully migrated from Rally [F43445](https://rally1.rallydev.com/#/search/?keywords=F43445): Consolidate Dashboard Editor in Library and Workstation to Reduce Maintenance CostMigration Exceptions:  2025-07-20 23:39:06: Owner email yadu@microstrategy.com not found in Jira. Skipping setting owner.—Original comment viewable in [Jira](https://strategyagile.atlassian.net/browse/BF-4?focusedCommentId=11003&page=com.atlassian.jira.plugin.system.issuetabpanels%3Acomment-tabpanel#comment-11003)
- **Yan Zhang** (2025-09-03): 2025-07-21T03:39:27 - Steven Weber (DM) *Comment added in Jira by Yan Zhang on Jul 20, 2025, 11:39 PM:*—2025-04-10T11:53:16 - Yang Du: @Benjamin Reyes  I created this feature to unify dashboard authoring in Workstation and Library because we currently have dashboard authoring available in Library, Web, and Workstation. Although most of the code is shared among these platforms, there are still some discrepancies that could lead to errors during development. We have already experienced some regression issues as a result. This situation has significantly increased our development and maintenance burden, and I believe it does not provide substantial business value.    I discussed this with @Alex Olvera Velasco and suggested that when a user clicks to create or edit a dashboard in Workstation, it should redirect to the Library authoring page, similar to the current consumption mode. The benefit is clear: we can avoid duplicating efforts for dashboard authoring.Of course, there are some mino
- **Yan Zhang** (2025-09-03): 2025-07-21T03:39:29 - Steven Weber (DM) *Comment added in Jira by Yan Zhang on Jul 20, 2025, 11:39 PM:*—2025-07-21T02:48:35 - Steven Weber (DM): *Comment added in Jira by *Yan Zhang* on Jul 20, 2025, 10:48 PM:*—2025-04-10T11:53:16 - Yang Du: @Benjamin Reyes  I created this feature to unify dashboard authoring in Workstation and Library because we currently have dashboard authoring available in Library, Web, and Workstation. Although most of the code is shared among these platforms, there are still some discrepancies that could lead to errors during development. We have already experienced some regression issues as a result. This situation has significantly increased our development and maintenance burden, and I believe it does not provide substantial business value.     I discussed this with @Alex Olvera Velasco and suggested that when a user clicks to create or edit a dashboard in Workstation, it should redirect to the Library authoring page, similar to the current consumption mode. T
- **Yan Zhang** (2025-09-03): 2025-07-21T02:48:36 - Steven Weber (DM) *Comment added in Jira by Yan Zhang on Jul 20, 2025, 10:48 PM:*—2025-07-16T10:29:43 - Lingping Zhu: Include @Yali Guo (PO) @Zhilinwei Chen (Max) for awareness .Hi Yali/Max, Scott team plans to use *the Embedded iFrame to open the dashboard in the workstation*. Previously, Engine team worked on many workstation engine logics. I'm not pretty sure whether this solution will bring some problems. Do you have any questions or concerns about this? If required, I believe @Yang Du can offer one sharing about the requirements. Thankscc @Shuai Xiong—Original comment viewable in [Jira](https://strategyagile.atlassian.net/browse/BF-2?focusedCommentId=10650&page=com.atlassian.jira.plugin.system.issuetabpanels%3Acomment-tabpanel#comment-10650)
- **Yan Zhang** (2025-09-03): 2025-07-21T02:48:35 - Steven Weber (DM) *Comment added in Jira by Yan Zhang on Jul 20, 2025, 10:48 PM:*—2025-07-15T05:16:06 - Shu Liu: @Ran Yu @Yang Du Can we have a design review for this feature? I would like to know whether Document and Report can also use the same approach.@Qingling Dong—Original comment viewable in [Jira](https://strategyagile.atlassian.net/browse/BF-2?focusedCommentId=10647&page=com.atlassian.jira.plugin.system.issuetabpanels%3Acomment-tabpanel#comment-10647)
- **Yan Zhang** (2025-09-03): 2025-07-21T02:48:36 - Steven Weber (DM) *Comment added in Jira by Yan Zhang on Jul 20, 2025, 10:48 PM:*—2025-07-16T09:02:18 - Yang Du: @Shuai Xiong @Lingping Zhu @Stan Gordiienko  would you please help review the requirements in description? cc @Ran Yu @Yanping Tong—Original comment viewable in [Jira](https://strategyagile.atlassian.net/browse/BF-2?focusedCommentId=10649&page=com.atlassian.jira.plugin.system.issuetabpanels%3Acomment-tabpanel#comment-10649)
- **Yan Zhang** (2025-09-03): 2025-07-21T02:48:35 - Steven Weber (DM) *Comment added in Jira by Yan Zhang on Jul 20, 2025, 10:48 PM:*—2025-04-10T11:53:16 - Yang Du: @Benjamin Reyes  I created this feature to unify dashboard authoring in Workstation and Library because we currently have dashboard authoring available in Library, Web, and Workstation. Although most of the code is shared among these platforms, there are still some discrepancies that could lead to errors during development. We have already experienced some regression issues as a result. This situation has significantly increased our development and maintenance burden, and I believe it does not provide substantial business value.    I discussed this with @Alex Olvera Velasco and suggested that when a user clicks to create or edit a dashboard in Workstation, it should redirect to the Library authoring page, similar to the current consumption mode. The benefit is clear: we can avoid duplicating efforts for dashboard authoring.Of course, there are some mino
- **Yan Zhang** (2025-09-03): 2025-07-16T10:29:43 - Lingping Zhu Include @Yali Guo (PO) @Zhilinwei Chen (Max) for awareness .Hi Yali/Max, Scott team plans to use the Embedded iFrame to open the dashboard in the workstation. Previously, Engine team worked on many workstation engine logics. I'm not pretty sure whether this solution will bring some problems. Do you have any questions or concerns about this? If required, I believe @Yang Du can offer one sharing about the requirements. Thankscc @Shuai Xiong
- **Yan Zhang** (2025-09-03): 2025-07-16T09:02:18 - Yang Du @Shuai Xiong @Lingping Zhu @Stan Gordiienko  would you please help review the requirements in description? cc @Ran Yu @Yanping Tong
- **Yan Zhang** (2025-09-03): 2025-07-15T05:36:19 - Yang Du @Shu Liu ， yes, we planed to have design review next week once @Ran Yu back from vacation.
- **Yan Zhang** (2025-09-03): 2025-07-15T05:16:06 - Shu Liu @Ran Yu @Yang Du Can we have a design review for this feature? I would like to know whether Document and Report can also use the same approach.@Qingling Dong
- **Yan Zhang** (2025-09-03): 2025-04-10T11:53:16 - Yang Du @Benjamin Reyes  I created this feature to unify dashboard authoring in Workstation and Library because we currently have dashboard authoring available in Library, Web, and Workstation. Although most of the code is shared among these platforms, there are still some discrepancies that could lead to errors during development. We have already experienced some regression issues as a result. This situation has significantly increased our development and maintenance burden, and I believe it does not provide substantial business value.  I discussed this with @Alex Olvera Velasco and suggested that when a user clicks to create or edit a dashboard in Workstation, it should redirect to the Library authoring page, similar to the current consumption mode. The benefit is clear: we can avoid duplicating efforts for dashboard authoring.Of course, there are some minor gaps between Workstation and Library, which we will address and fix.Your opinion is critical to us, so pl

## 5. High-value child story details

### CGWI-1544 —  [workstation] add "Enable New Dashboard Editor" under Help menu
- Type: Story
- Status: Done
- Description:

```
DESCRIPTION:   [workstation] add "Enable New Dashboard Editor" under Help menu, by default it is unchecked, once user checked the item, it will switch to the new dashboard editor.The preference name exposed to plugins should be new-dashboard-editor  [Rally url - https://rally1.rallydev.com/slm/attachment/831553076303/image.png]EXPECTED BEHAVIOR:ENVIRONMENT (Browser, OS, Secure Cloud info, URL, Intelligence Server info, metadata/warehouse info, etc):STEPS TO REPRODUCE:SUPPORTING DOCUMENTATION (Screenshot, video/gif, .mstr file, logs, etc):Please click[here](https://microstrategy.atlassian.net/wiki/spaces/TECAGILEWORKS/pages/162727022/Defect+Logging+Guidelines)to read the full guidelines of logging defects.
```
- Test steps: ``

### CGWI-661 — Workstation: Support the new dossier editor
- Type: Story
- Status: Done
- Description:

```
To deliver the new dossier editor on the workstation, we need the workstation side to support:Expose new parameter to show the "save as template" option for the SDK workstation.dialogs.saveAs()Hide the original "Edit without Data" menu on the dossier item whenThe server version >= 25.08The workstation is in preview modeStop showing WebError.html when the internal dashboard HTML errors out.  [Rally url - https://rally1.rallydev.com/slm/attachment/830220513237/image.png][Rally url - https://rally1.rallydev.com/slm/attachment/830220513671/image.png]Issues mentioned in this US were separately logged as defects and the work is tracked there:[DE331403](https://rally1.rallydev.com/#/?detail=/defect/830099524249&fdp=true): [Workstation]The "Set as Template" checkbox is missing in 25.08 save as dialog[DE331365](https://rally1.rallydev.com/#/?detail=/defect/830084379837&fdp=true): [Workstation]There are 2 "Edit without data" items in dashboard context menu[DE331384](https://rally1.rallydev.com/#/?detail=/defect/830088554743&fdp=true): [WorkStation] Open a dashboard contains HTML container, the whole dashboard cannot be used.
```
- Test steps: ``

### CGWI-1570 — i-31 Adding bundles for workstation dashboard editor to improve the loading performance 
- Type: Story
- Status: Done
- Description:

```
We found there are some performance degradation in the new workstation dashboard editor, and the solution is to package partial file into the workstation.Here is the design:https://microstrategy.atlassian.net/wiki/spaces/SDK/pages/5198776344/Improve+the+Performance+of+New+Workstation+Dossier+Editor(https://microstrategy.atlassian.net/wiki/spaces/SDK/pages/5198776344/Improve+the+Performance+of+New+Workstation+Dossier+Editor)
```
- Test steps: ``

### CGWI-1397 — [Parent Story] WS Dashboard Library Authoring | Workstation Native Enhancements
- Type: Story
- Status: Done
- Description:

```
Investigate and resolve items connected with [F43445](https://rally1.rallydev.com/#/?detail=/portfolioitem/feature/823049229263&fdp=true): Enhance Workstation dashboard authoring experience with Library capability parity  Including:Package Dashboard-related code bundles into Workstation to reduce the need for these bundles to be fetched when initially loading a Dashboard.Design: https://microstrategy.atlassian.net/wiki/spaces/SDK/pages/5198776344/Improve+the+Performance+of+New+Workstation+Dossier+Editor(https://microstrategy.atlassian.net/wiki/spaces/SDK/pages/5198776344/Improve+the+Performance+of+New+Workstation+Dossier+Editor)
```
- Test steps: ``

### BCVE-1535 — Export in ws editor
- Type: Story
- Status: Done
- Description:

```

```
- Test steps: ``

### BCVE-1534 — Vis in ws editor
- Type: Story
- Status: Done
- Description:

```

```
- Test steps: ``

### BCSM-2114 — DI in ws editor
- Type: Story
- Status: Done
- Description:

```

```
- Test steps: ``

### BCSA-848 — Auth in ws editor
- Type: Story
- Status: Done
- Description:

```

```
- Test steps: ``

### BCIN-1190 — The ability for custom fonts to be available in the font picker list within Workstation
- Type: Story
- Status: Done
- Description:

```
Description:   Yahoo have a set of custom Yahoo fonts that they use on Dossiers in Web and Library, and the goal is to do the same from within Workstation. Text using these custom fonts does render properly within Workstation if they've already been chosen in Library, but the request is for the fonts to be available in the font picker list within Workstation.  Expected Behavior:  For the custom fonts to appear in the custom font picker within Workstation   Steps to Reproduce:   [NOT APPLICABLE]  [-]Custom fonts cannot be added to the font picker within Workstation   Business Impact:  Reports and dossiers that are created via Workstation are not able to use the Yahoo custom font since this font does not appear as part of the font picker. Objects have be created via Web or Library for the font to be used.   Troubleshooting Steps:  12/18/2023  [-]This is already on the roadmap to be implemented via US481058
```
- Test steps: ``

### BCFR-46 — Request for functionality in Workstation when closing report/dossier it should cancel SQL execution on Database
- Type: Story
- Status: Done
- Description:

```
Description:   In the MicroStrategy Developer once a report run  is canceled it will cancel the SQL on the Database.   In workstation there is no button to cancel the report, there is only the possible to close the whole report but then the SQL is still running on Database. The customer wants to raise an enhancement request to implement the same functionality as it was in Developer. MicroStrategy version used is 2021 update 10  Expected Behavior:  Functionality in Workstation when closing report/dossier it should cancel SQL execution on Database   Steps to Reproduce:   [Not reproduced]  Checking  We need to prepare a simple test scenario. As Snowflake is cost-heavy, we could create a big table in Postgres on Labs and test how it behaves  Tested in Postgres:  Host: ts-pgsql14, Port:5432, Database: mlosk1700744650, Username: mlosk1700744650, Password: abcd1234  We cannot use internal Snowflake anymore   Business Impact:  Major impact for a strategic customer, especially after their users migrate to Workstation   Troubleshooting Steps:  07-03-2024  The issue will be logged as confirmed with Klaudia  28/02/2024  Screenshots from Snowflake uploaded on \\supp-fs-was\CLIENTS\S\SchwarzITKG\CS0799938  22-02-2024  Collect Snowflake Query history for both of the scenarios a)clicking on "X" b)Stopping the data retrieval + exact timestamp  21-02-2024  The customer confirmed, that using the cancellation button is not a solution for them.  We need to prepare a simple test scenario. As Snowflake is cost-heavy, we could create a big table in Postgres on Labs and test how it behaves  20-02-2024  Need to confirm the workflow with André Ruffer, as there is an option to cancel report execution when opening reports in Workstation.  Pause and Resume Dossier Execution  https://www2.microstrategy.com/producthelp/Current/MSTRWeb/WebHelp/Lang_1033/Content/pausing_dossier.htm  otherwise there should be probably a mechanism to run SYSTEM$CANCEL_QUERY when closing a dossier https://docs.snowflake.com/en/sql-reference/functions/system_cancel_query  https://select.dev/posts/cost-per-query Snowflake customers are billed for each second that virtual warehouses are running, with a minimum 60 second charge each time one is resumed.
```
- Test steps: ``

### BCFR-33 — [Parent Story]  Clean unit settings when convert modern grid to classic/compound grid
- Type: Story
- Status: Done
- Description:

```
As a POI want to convert the modern grid to classic/compound gridso that users can change settings in classic/compound grid.Now if user convert classic grid to modern grid, and then make some format changes. After converting grid back to classic grid. those changed setting can not be changed again.The reason is that:Once a grid is configured with unit-level formatting, it can no longer be changed to high-level formatting. For example, if the grid is switched from the modern style to the classic style, all formats previously set at the unit level will become fixed and cannot be modified.Expected: The Units format should be cleared when switch from unit-level formatting grid like the mordern grid to the high level formatting grid like the normal grid/compound grid.
```
- Test steps: ``


## 6. Key defects for edge-case insights

### CGWI-996 — [WorkStation] Open a dashboard contains HTML container, the whole dashboard cannot be used.
- Type: Defect
- Priority: High
- Status: Done
- Description:

```
ENVIRONMENT (Browser, OS, Secure Cloud info, URL, Intelligence Server info, metadata/warehouse info, etc):WorkStation Version: 11.5.0800.00823Server: https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary(https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary)Credentials: tqmsuser/ddsetServer version: 11.5.0800.0073STEPS TO REPRODUCE:Connect to the environment https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary(https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary)Open dashboard "Employee Fitness_new" (dashboard link: https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary/app/B628A31F11E7BD953EAE0080EF0583BD/6E0917F28F436970AFC56DB97BF62F0B)(https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary/app/B628A31F11E7BD953EAE0080EF0583BD/6E0917F28F436970AFC56DB97BF62F0B))Switch to page "EF Bot"Issue Here: Got the error "Oops... We are having trouble loading data now..." as shown in below screenshot. The whole dashboard cannot be used, user cannot edit this page or switch to other page.SUPPORTING DOCUMENTATION (Screenshot, video/gif, .mstr file, logs, etc):25.08[Rally url - https://rally1.rallydev.com/slm/attachment/830089322559/Screenshot 2025-07-29 at 10.40.44.png]25.07 - user can continue edit the dashboard[Rally url - https://rally1.rallydev.com/slm/attachment/830089323971/Screenshot 2025-07-29 at 10.40.54.png]
```
- Edge-case insight: Editor mode/state mismatch around dossier opening and navigation.

### CGWI-1000 — [Workstation]The "Certify" and "Set as template" checkbox is missing when save a new created dashboard
- Type: Defect
- Priority: High
- Status: Done
- Description:

```
25.08 workstation connect to 25.08 library: https://mci-cbzy7-dev.hypernow.microstrategy.com/MicroStrategyLibrary/auth/ui/loginPage(https://mci-cbzy7-dev.hypernow.microstrategy.com/MicroStrategyLibrary/auth/ui/loginPage) tqmsuser/ddsetCreate a new dashboardSaveIssue here: the "Certify" and "Set as template" checkbox is missing when save a new created dashboardThis issue seems to be caused by the plugin API constraint. When I call saveAs to open the dialog in this workflow, I always set showCertifyOption to true, and according to @Wojciech Antolik, the "set as template" option now will always show for dossier.It indeed works for the saveAs of an existing dossier. However, we found that when the dossier is an unsaved new dossier, the 2 options will not show. It's not expected behavior as these options' result can be used in the following workflow, even if the dossier is a new dossier.[Rally url - https://rally1.rallydev.com/slm/attachment/830208737487/image.png]
```
- Edge-case insight: Visualization rename/title metadata can desync in the new editor.

### BCED-2971 — [WorkStation] Can't close dashboard editor by clicking close button when dashboard is in certain status
- Type: Defect
- Priority: Low
- Status: Done
- Description:

```
ENVIRONMENT (Browser, OS, Secure Cloud info, URL, Intelligence Server info, metadata/warehouse info, etc):11.5.0800.0639STEPS TO REPRODUCE:Open dashboard in Workstation editorclick cancel button in a rowdismiss the errorclick on close buttonissue here:dashboard editor remains there
```
- Edge-case insight: Prompt answers or selections can disappear when switching editor/runtime paths.

### BCED-2980 — [Workstation][Export]The export don't follow the export settings
- Type: Defect
- Priority: High
- Status: Done
- Description:

```
25.08 workstation connect to 25.08 library: https://mci-cbzy7-dev.hypernow.microstrategy.com/MicroStrategyLibrary(https://mci-cbzy7-dev.hypernow.microstrategy.com/MicroStrategyLibrary) tqmsuser/ddsetOpen a dashboard with multiple chaptersExport the dashboard with different export settings, eg: "This page" "This chapter" "Entire dashboard"[Rally url - https://rally1.rallydev.com/slm/attachment/830648653325/image.png]Issue here: the exported pdf don't follow the selected export setting
```
- Edge-case insight: Tab switching may not persist state correctly in workstation editor.

### BCED-2981 —  [WorkStation] Cancel execution
- Type: Defect
- Priority: High
- Status: Done
- Description:

```
ENVIRONMENT (Browser, OS, Secure Cloud info, URL, Intelligence Server info, metadata/warehouse info, etc):11.5.0800.0639STEPS TO REPRODUCE:Open dashboard in Workstation editorclick cancel button when loading, it shows error message, the editor should close directly.[Rally url - https://rally1.rallydev.com/slm/attachment/830286025485/image.png]
```
- Edge-case insight: Prompted cube / filter application may regress under workstation-native rendering.

### BCED-2989 — [WorkStation] Obvious Performance degradation for the 1st creating or rendering of dashboard.
- Type: Defect
- Priority: Low
- Status: Done
- Description:

```
ENVIRONMENT (Browser, OS, Secure Cloud info, URL, Intelligence Server info, metadata/warehouse info, etc):WorkStation Version: 11.5.0800.01130Server: https://vega.trial.cloud.microstrategy.com/MicroStrategyLibraryCredentials: Your corp accountServer version: 11.5.0800.0101STEPS TO REPRODUCE:Clean install 25.08 WorkStationConnect to 25.08 environment, you may use vega environmentFor the 1st time opening a dashboardIssue 1: Blank screen shows for a while. There is no loading icon, user doesn't know what happenedIssue 2: It is quite slow for the 1st time create or render a dashboard, take this [dashboard](https://vega.trial.cloud.microstrategy.com/MicroStrategyLibrary/app/47761EC611EA16DDAA780080EFB5CE10/19832122BD482ED7ED3C29B84F50E928/edit) as an example, it takes about 20s for the 1st rendering. While it take 7.4s in 25.07 for the 1st rendering.Issue only happens for the 1st time render a dashboard after installing the WorkStation.
```
- Edge-case insight: Prompt page state or panel transitions can fail after interactions.

### BCED-2997 — [Workstation][Link]Click link in dashboard should not trigger save workflow
- Type: Defect
- Priority: High
- Status: Done
- Description:

```
25.09 workstation connect 25.09 library, eg: https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary(https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary) tqmsuser/ddsetOpen dashboard: link test yatong, do some changeClick link text: "baidu in same tab"Issue here: it will trigger save confirm dialog, in native dashboard editor, link will not trigger save workflow
```
- Edge-case insight: Link/selector interactions can break after dossier editing transitions.

### BCED-3035 — [F43445][Workstation][Export]The export pdf behavior changed from 25.07
- Type: Defect
- Priority: High
- Status: Done
- Description:

```
25.08 workstation connect to 25.08 libraryOpen a dashboardClick "File" -> "Export to PDF" -> "Export"Issue here:during the export process, there is no prominent loading indicator―only a very small and inconspicuous loading indicator located in an inappropriate positionit will show "Export Complete" before user select a folder to save the downloaded file, and no success indicator when the real export finished[Rally url - https://rally1.rallydev.com/slm/attachment/830374375337/Screen Recording 2025-08-01 at 14.56.06.gif]In 25.07, it will pop up a dialog for user to select a folder to save first, then show loading icon during download, and show success after download completed
```
- Edge-case insight: Layout switching / chapter navigation can regress in workstation-native editor.

### BCED-3066 — DB OAuth | Failed to use DB OAuth sources on workstation server based dashboard mode
- Type: Defect
- Priority: High
- Status: Done
- Description:

```
DESCRIPTION:Failed to use DB OAuth sources on workstation server based dashboard modeEXPECTED BEHAVIOR:ENVIRONMENT (Browser, OS, Secure Cloud info, URL, Intelligence Server info, metadata/warehouse info, etc):ws-11.5.0900.00412STEPS TO REPRODUCE:Workstation + LibraryDashaboardsADLS2*、*SharePoint and OneDrive, S3OAuth, GCSOAuth Jira Cloud(CloudConnector) are failed to login[Rally url - https://rally1.rallydev.com/slm/attachment/831466853195/image.jpeg][Rally url - https://rally1.rallydev.com/slm/attachment/831466853193/image.jpeg][Rally url - https://rally1.rallydev.com/slm/attachment/831466853201/image.jpeg][Rally url - https://rally1.rallydev.com/slm/attachment/831466853205/image.jpeg]SUPPORTING DOCUMENTATION (Screenshot, video/gif, .mstr file, logs, etc):Please click[here](https://microstrategy.atlassian.net/wiki/spaces/TECAGILEWORKS/pages/162727022/Defect+Logging+Guidelines)to read the full guidelines of logging defects.
```
- Edge-case insight: Save/open lifecycle can produce stale state or broken refresh behavior.

### BCED-3121 — [WorkStation] There are 2 "X" button on the menu bar, user can enter consumption mode by clicking "X" button on 2nd layer of menu bar
- Type: Defect
- Priority: Low
- Status: Done
- Description:

```
ENVIRONMENT (Browser, OS, Secure Cloud info, URL, Intelligence Server info, metadata/warehouse info, etc):WorkStation Version: 11.5.0800.00823Server: aqueduct.microstrategy.com/MicroStrategyLibrary/Credentials: Your corp accountServer version: 25.06STEPS TO REPRODUCE:Connect to AQDT environmentOpen a dashboard. You may use "PRD.Customer Cases"Issue Here: There are 2 "X" button on the toolbar, 1 on 1st layer, 1 on 2nd layer. Click the "X" on the 2nd layer, user can enter consumption modeSUPPORTING DOCUMENTATION (Screenshot, video/gif, .mstr file, logs, etc):PRD.Customer Cases[Rally url - https://rally1.rallydev.com/slm/attachment/830086869423/Screenshot 2025-07-29 at 10.02.16.png]
```
- Edge-case insight: Widget rendering/data refresh edge cases surface after editing or navigation.

### BCED-3136 — [WorkStation][Compatibility] Cannot close dashboard in AQDT environment
- Type: Defect
- Priority: High
- Status: Done
- Description:

```
ENVIRONMENT (Browser, OS, Secure Cloud info, URL, Intelligence Server info, metadata/warehouse info, etc):WorkStation Version: 11.5.0800.00823Server: aqueduct.microstrategy.com/MicroStrategyLibrary/Credentials: Your corp accountServer version: 25.06STEPS TO REPRODUCE:Connect to AQDT environmentOpen a dashboard. You may use "PRD.Customer Cases"Click the "X" button to the 1st layerIssue Here: Cannot close the dashboard.Click the "X" button in the navigation window, dashboard cannot be closed either. Even after clicking "Close all windows", the dashboard cannot be closedSUPPORTING DOCUMENTATION (Screenshot, video/gif, .mstr file, logs, etc):PRD.Customer Cases[Rally url - https://rally1.rallydev.com/slm/attachment/830086869423/Screenshot 2025-07-29 at 10.02.16.png][Rally url - https://rally1.rallydev.com/slm/attachment/830086872163/Screenshot 2025-07-29 at 10.04.40.png]
```
- Edge-case insight: Undo/redo or edit-state synchronization may not be stable across features.

### BCED-3149 — [Workstation]The dashboard name is not updated in 1st layer toolbar after create a new dashboard and saved
- Type: Defect
- Priority: Low
- Status: Done
- Description:

```
Create new dashboard and savedThe dashboard name is not updated in 1st layer toolbar, still show "New Dashboard"[Rally url - https://rally1.rallydev.com/slm/attachment/830085633849/image.png]
```
- Edge-case insight: Cross-feature integration defect indicating combined editor capabilities need regression coverage.

