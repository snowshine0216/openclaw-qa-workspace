
  ⭐ Defect  🚧 To Do  ⌛ Tue, 03 Feb 26  👷 Wei (Irene) Jiang  🔑️ BCIN-974  💭 4 comments  🧵 0 linked              
                                                                                                                      
  # Report Editor | Loading Data forever blocks further interaction after clicking pause partial data retrieval for a 
  report that cannot be executed                                                                                      
                                                                                                                      
  ⏱️  Thu, 28 Aug 25  🔎 Tingting Li  🚀 Low  📦 None  🏷️  None  👀 1 watchers                                        
                                                                                                                      
  ------------------------ Description ------------------------                                                       
                                                                                                                      
  DESCRIPTION:                                                                                                        
                                                                                                                      
  Report Editor | Loading Data forever blocks further interaction after clicking pause partial data retrieval for a   
  report that cannot be executed                                                                                      
                                                                                                                      
  [attachment][Rally url - https://rally1.rallydev.com/slm/attachment/832038972151/Screenshot 2025-08-28 145400.png]  
                                                                                                                      
  EXPECTED BEHAVIOR:                                                                                                  
                                                                                                                      
  user interaction should not be blocked                                                                              
                                                                                                                      
  ENVIRONMENT (Browser, OS, Secure Cloud info, URL, Intelligence Server info, metadata/warehouse info, etc):          
                                                                                                                      
  25.09                                                                                                               
                                                                                                                      
  STEPS TO REPRODUCE:                                                                                                 
                                                                                                                      
  • in Library, PA project, create a report with attributes: Object Category, Object Extended Type, Object Type, save 
  • edit report                                                                                                       
  • add one more attribute Change Type, click Resume Data Retrieval, error: QueryEngine encountered error: A cartesian
  join is detected and execution is aborted per \"Cartesian Join Governing\" setting. Please review the design of the 
  report/visualization. Excerpt of the query: lu_change_type cross join lu_object_extended_type. [Strategy Error      
  Instance:719F2C714CF6034393106E95219E4D65]. Error in Process method of Component: QueryEngineServer, Project        
  Platform Analytics, Job 40, Error Code= -2147212544.)",                                                             
  • dismiss the error, click Pause Data Retrieval, ISSUE HERE: it's loading data forever until you close or refresh   
  the whole web page                                                                                                  
  SUPPORTING DOCUMENTATION (Screenshot, video/gif, .mstr file, logs, etc):                                            
                                                                                                                      
  Please                                                                                                              
  clickhereto](https://microstrategy.atlassian.net/wiki/spaces/TECAGILEWORKS/pages/162727022/Defect+Logging+          
  Guidelines)t                                                                                                        
  https://microstrategy.atlassian.net/wiki/spaces/TECAGILEWORKS/pages/162727022/Defect+Logging+Guidelines)to) read the
  full guidelines of logging defects.                                                                                 
                                                                                                                      
  ------------------------ 4 Comments ------------------------                                                        
                                                                                                                      
  Yan Zhang • Thu, 11 Sep 25 • Latest comment                                                                         
                                                                                                                      
  Rally item ( DE334893 https://rally1.rallydev.com/#/search/?keywords=DE334893 ) was successfully migrated to Jira.  
                                                                                                                      
  Yan Zhang • Thu, 28 Aug 25                                                                                          
                                                                                                                      
  2025-08-28T07:50:36 - Bin (Jason) Xu                                                                                
                                                                                                                      
  @Wei Jiang (PO) This is not a regression. It can also be reproduced on 25.08 on luna                                
  https://luna.trial.cloud.microstrategy.com/MicroStrategyLibrary/app/                                                
  https://luna.trial.cloud.microstrategy.com/MicroStrategyLibrary/app/ (                                              
  https://luna.trial.cloud.microstrategy.com/MicroStrategyLibrary/app/                                                
  https://luna.trial.cloud.microstrategy.com/MicroStrategyLibrary/app/ ) cc @Tingting Li (@tinli, PO)                 
                                                                                                                      
  [attachment][Rally url - https://rally1.rallydev.com/slm/attachment/832041814091/Recording 2025-08-28 at 15.46.34.  
  gif]                                                                                                                
                                                                                                                      
  Yan Zhang • Thu, 28 Aug 25                                                                                          
                                                                                                                      
  2025-08-28T07:34:57 - Wei Jiang (PO)                                                                                
                                                                                                                      
  @Bin (Jason) Xu Could you help to check whether this is regression? Thank.                                          
                                                                                                                      
  Yan Zhang • Thu, 28 Aug 25                                                                                          
                                                                                                                      
  2025-08-28T07:17:41 - Tingting Li (@tinli, PO)                                                                      
                                                                                                                      
  @Wei Jiang (PO)  Could you please triage this issue related to report editor in library?                            
                                                                                                                      
[0;90m[0m[0;90m[0m  [0;90mView this issue on Jira: https://strategyagile.atlassian.net/browse/BCIN-974[0m                                        

