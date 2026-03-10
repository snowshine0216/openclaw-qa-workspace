
  ⭐ Defect  ✅ Done  ⌛ Wed, 04 Feb 26  👷 Xue Yin  🔑️ BCIN-6574  💭 6 comments  🧵 0 linked                        
                                                                                                                      
  # The error details do not display when running a report in Library intermittently.                                 
                                                                                                                      
  ⏱️  Fri, 05 Dec 25  🔎 Jira Integration  🚀 Low  📦 None  🏷️  Title_Reviewed, xuyin_Q4, xuyin_q1_rca  👀 1 watchers 
                                                                                                                      
  ------------------------ Description ------------------------                                                       
                                                                                                                      
  **Description:** Subject:                                                                                           
                                                                                                                      
  The error detail is not displayed when running a report in Library intermittently.                                  
                                                                                                                      
  Description:                                                                                                        
                                                                                                                      
  The error detail is not displayed when running a report in Library.                                                 
                                                                                                                      
  For example, when running a report with some prompts and server error occurs ,like "Maximum number of results rows  
  per report exceeded the current limit: 32000", the link for error detail is typically shown on error dialog.        
                                                                                                                      
  But the detail sometime is not displayed.                                                                           
                                                                                                                      
  Hence the customer does not know a reason why error occurs.                                                         
                                                                                                                      
  product version: Strategy ONE JUNE 2025                                                                             
                                                                                                                      
  **Expected Behavior:** The customer wants to display the error details.                                             
                                                                                                                      
  **Steps to Reproduce:** REPRODUCED                                                                                  
                                                                                                                      
  VM: 10.27.73.123  HOST: TI104W2K12a (Sep2025)                                                                       
                                                                                                                      
  VM Owner: tishikawa@microstrategy.com mailto:tishikawa@microstrategy.com                                            
                                                                                                                      
  UID/PW: administrator / m$tr!23                                                                                     
                                                                                                                      
  project: pTuto02                                                                                                    
                                                                                                                      
  report: CS0991930t01                                                                                                
                                                                                                                      
  *Steps:                                                                                                             
                                                                                                                      
  1. run a report several time in Library.                                                                            
                                                                                                                      
  (please check the videos under the following folder)                                                                
                                                                                                                      
  if not reproduced, please use browser inside this VM.                                                               
                                                                                                                      
  *Provided logs and files:                                                                                           
                                                                                                                      
  CS0991930Issue.xlsx – issue details.                                                                                
                                                                                                                      
  \supp-fs-was\clients\R\Riso Kagaku Corporation\CS0991930\tosme                                                      
                                                                                                                      
  2025-12-04_02.mp4 (report: CS0991930t01)  – video captured when issue occurs.                                       
                                                                                                                      
  2025-12-04-63206.mp4 (report: CS0991930t02Lib)                                                                      
                                                                                                                      
  **Business Impact:** The error details is not displayed.                                                            
                                                                                                                      
  **Troubleshooting Steps:** As of 2025/12/03                                                                         
                                                                                                                      
  [*] check attachment file: 改善要望_Libraryホーム画面からレポート実行した際のエラーメッセージについて.xlsx          
                                                                                                                      
  ❭❭ screenshots of reproduce steps.                                                                                  
                                                                                                                      
  [*] test in house.                                                                                                  
                                                                                                                      
  [+] VM: 10.27.73.123  HOST: TI104W2K12a (Sep2025)                                                                   
                                                                                                                      
  [+] project: pTuto02                                                                                                
                                                                                                                      
  [+] report: CS0991930t01                                                                                            
                                                                                                                      
  [-] Run report "CS0991930t01" in Library several times.                                                             
                                                                                                                      
  As of 2025/12/04                                                                                                    
                                                                                                                      
  [*] ask sme about this issue.                                                                                       
                                                                                                                      
  ❭❭ suggested to log a defect.                                                                                       
                                                                                                                      
  ------------------------ 6 Comments ------------------------                                                        
                                                                                                                      
  Xue Yin • Thu, 15 Jan 26 • Latest comment                                                                           
                                                                                                                      
  FC on library wit version: 11.6.0200.00588.                                                                         
                                                                                                                      
  The detailed error msg can be consistently shown when running http://10.27.73.123:8080/web-                         
  dossier/app/D372CA814B312C2D40F0F6B61C1E9C7B/503547BA43643B1BFD754A8FB5EEDF47/K53--K46?continue                     
  http://10.27.73.123:8080/web-dossier/app/D372CA814B312C2D40F0F6B61C1E9C7B/503547BA43643B1BFD754A8FB5EEDF47/K53--    
  K46?continue                                                                                                        
                                                                                                                      
  [attachment] @@supportsnow As it’s fixed on 26.02 build, I will close it as fix. Customer can see the fix once they 
  upgraded to 26.02 build.                                                                                            
                                                                                                                      
  cc @@Wei (Irene) Jiang  @@En Li  @@Lingping Zhu                                                                     
                                                                                                                      
  En Li • Wed, 14 Jan 26                                                                                              
                                                                                                                      
  PR merged. @@Xue Yin please help to verify with latest build. Thanks.                                               
                                                                                                                      
  Xue Yin • Mon, 08 Dec 25                                                                                            
                                                                                                                      
  @@Wei (Irene) Jiang  @@En Li could you pls help to review this defect? By opening report using this link            
  http://10.27.73.                                                                                                    
  123:8080/MicroStrategyLibrary/api/dossiers/503547BA43643B1BFD754A8FB5EEDF47/instances/44423E8740D4E8390675589A712D7A6E?includeTOC=true&includeShortcutInfo=true&resultFlag=3&checkPrompted=true
  http://10.27.73.                                                                                                    
  123:8080/MicroStrategyLibrary/api/dossiers/503547BA43643B1BFD754A8FB5EEDF47/instances/44423E8740D4E8390675589A712D7A6E?includeTOC=true&includeShortcutInfo=true&resultFlag=3&checkPrompted=true
  This issue can be randomly reproduced                                                                               
                                                                                                                      
  [attachment]The expected error is:                                                                                  
                                                                                                                      
  [attachment]When there is no detailed error shows up, the new instance api resturns instance id, but failed at get  
  instance request.                                                                                                   
                                                                                                                      
  And when there is detailed error shown, The frontend catches the POST instance error and show the messages in erros 
  array.                                                                                                              
                                                                                                                      
  We may need to enhance the UI to also show the error in GET instance api.  (example payload is: {                   
                                                                                                                      
  "code": "ERR001",                                                                                                   
                                                                                                                      
  "iServerCode": -2147466604,                                                                                         
                                                                                                                      
  "message": "Document Execution Failed: One or more dataset reports returned an error.CS0991930t01_2                 
  [503547BA43643B1BFD754A8FB5EEDF47]: (Maximum number of results rows per report exceeded the current limit: 32000.   
  Please reduce the number of rows or contact the administrator to change the limit in the project configuration      
  through Developer.[It is set for report: CS0991930t01_2]Error in Process method of Component: QueryEngineServer,    
  Project pTuto02, Job 4944, Error Code= -2147205488.)",                                                              
                                                                                                                      
  "ticketId": "d67cc16f6ee94374b29baf89f1b1d2ca",                                                                     
                                                                                                                      
  "subErrors": [                                                                                                      
                                                                                                                      
  {                                                                                                                   
                                                                                                                      
  "iServerCode": -2147205488,                                                                                         
                                                                                                                      
  "message": "(Maximum number of results rows per report exceeded the current limit: 32000. Please reduce the number  
  of rows or contact the administrator to change the limit in the project configuration through Developer.[It is set  
  for report: CS0991930t01_2]Error in Process method of Component: QueryEngineServer, Project pTuto02, Job 4944, Error
  Code= -2147205488.)",                                                                                               
                                                                                                                      
  "additionalProperties": {                                                                                           
                                                                                                                      
  "objectId": "503547BA43643B1BFD754A8FB5EEDF47",                                                                     
                                                                                                                      
  "objectName": "CS0991930t01_2"                                                                                      
                                                                                                                      
  }                                                                                                                   
                                                                                                                      
  }                                                                                                                   
                                                                                                                      
  ]                                                                                                                   
                                                                                                                      
  }                                                                                                                   
                                                                                                                      
  cc @@Lingping Zhu                                                                                                   
                                                                                                                      
  Yanqing Liu • Mon, 08 Dec 25                                                                                        
                                                                                                                      
  Hi @@Xue Yin Thanks for your update. Based on my tests, the error without the detailed section is returned by this  
  API:                                                                                                                
                                                                                                                      
  http://10.27.73.                                                                                                    
  123:8080/MicroStrategyLibrary/api/dossiers/503547BA43643B1BFD754A8FB5EEDF47/instances/44423E8740D4E8390675589A712D7A6E?includeTOC=true&includeShortcutInfo=true&resultFlag=3&checkPrompted=true
  http://10.27.73.                                                                                                    
  123:8080/MicroStrategyLibrary/api/dossiers/503547BA43643B1BFD754A8FB5EEDF47/instances/44423E8740D4E8390675589A712D7A6E?includeTOC=true&includeShortcutInfo=true&resultFlag=3&checkPrompted=true
                                                                                                                      
  [attachment]Please find the full network trace attached: error.har                                                  
                                                                                                                      
  You may also check try this report which might be easier to reproduce these 2 different errors. (it’s a copy of     
  report CS0991930t01 but changed the option to last viewed).                                                         
                                                                                                                      
  http://10.27.73.                                                                                                    
  123:8080/MicroStrategyLibrary/app/D372CA814B312C2D40F0F6B61C1E9C7B/503547BA43643B1BFD754A8FB5EEDF47/K53--           
  K46                                                                                                                 
  http://10.27.73.                                                                                                    
  123:8080/MicroStrategyLibrary/app/D372CA814B312C2D40F0F6B61C1E9C7B/503547BA43643B1BFD754A8FB5EEDF47/K53--           
  K46                                                                                                                 
                                                                                                                      
  Please let us know if any additional info is required from us. Thanks!                                              
                                                                                                                      
  cc @@Wei (Irene) Jiang  @@Lingping Zhu                                                                              
                                                                                                                      
  Xue Yin • Mon, 08 Dec 25                                                                                            
                                                                                                                      
  @@supportsnow I can’t reproduce using the report you gave in the description. The detailed message always show up.  
                                                                                                                      
  [attachment]So could you pls help open the chrom tools and then try to reproduce again by monitoring the network    
  tab, to see which api goes 500 error and the response it returns? Thanks!                                           
                                                                                                                      
  cc @@Wei (Irene) Jiang  @@Lingping Zhu                                                                              
                                                                                                                      
  Jira Integration • Fri, 05 Dec 25                                                                                   
                                                                                                                      
  Account: Riso Kagaku Corporation, Owner: Toshiaki Ishikawa (CSS), Creator: tsaito@microstrategy.com                 
  mailto:tsaito@microstrategy.com                                                                                     
                                                                                                                      
  Subject: Libraryホーム画面からレポート実行した際のエラーメッセージについて/The error detail is not displayed when   
  running a report in Library intermittently                                                                          
                                                                                                                      
  Business Impact: The error details is not displayed.                                                                
                                                                                                                      
  Description: Subject:                                                                                               
                                                                                                                      
  The error detail is not displayed when running a report in Library intermittently.                                  
                                                                                                                      
  Description:                                                                                                        
                                                                                                                      
  The error detail is not displayed when running a report in Library.                                                 
                                                                                                                      
  For example, when running a report with some prompts and server error occurs ,like "Maximum number of results rows  
  per report exceeded the current limit: 32000", the link for error detail is typically shown on error dialog.        
                                                                                                                      
  But the detail sometime is not displayed.                                                                           
                                                                                                                      
  Hence the customer does not know a reason why error occurs.                                                         
                                                                                                                      
  product version: Strategy ONE JUNE 2025                                                                             
                                                                                                                      
[0;90m[0m[0;90m[0m  [0;90mView this issue on Jira: https://strategyagile.atlassian.net/browse/BCIN-6574[0m                                       

