
  ⭐ Defect  🚧 To Do  ⌛ Wed, 04 Mar 26  👷 Mingkang Fan  🔑️ BCEN-4843  💭 19 comments  🧵 0 linked                 
                                                                                                                      
  # Improve the behavior for end user to allow continued operations on report in Library after error happens.         
                                                                                                                      
  ⏱️  Tue, 13 Jan 26  🔎 Jira Integration  🚀 High  📦 None  🏷️  None  👀 2 watchers                                  
                                                                                                                      
  ------------------------ Description ------------------------                                                       
                                                                                                                      
  **Description:** When user met error when operating with report in Library, they can not continue operations and are
  forced to return to home page. This behavior is not user friendly.                                                  
                                                                                                                      
  For example,                                                                                                        
                                                                                                                      
  in the video i uploaded, i have set maximum rows of data as 100 to trigger error easily.                            
                                                                                                                      
  When a report designer edit a report and does some design changes(add/delete report filter, objects, etc), he runs  
  the report to check the effect.                                                                                     
                                                                                                                      
  Here if he meets an error, closes the error message and tries to review his report design, he has no way to return  
  to edit page with his previous changes preserved.                                                                   
                                                                                                                      
  The page is forever loading with an cancel button. But if he clicks on Cancel, he is forced to be directed to       
  library home page.                                                                                                  
                                                                                                                      
  Customer complained they got many claims for end user. The efficiency to design report is very low as they dont have
  chance to save the change they made.                                                                                
                                                                                                                      
  They request to have a way to be able to continue editing report with all changes preserved for such scenario.      
                                                                                                                      
  **Expected Behavior:** null                                                                                         
                                                                                                                      
  **Steps to Reproduce:** null                                                                                        
                                                                                                                      
  **Business Impact:** Comment from AE                                                                                
                                                                                                                      
  We have received numerous requests for improvement from JFE Steel regarding the error messages and system behavior  
  when errors occur. We would like to request a fundamental enhancement in this area and hereby summarize their       
  requirements.                                                                                                       
                                                                                                                      
  Currently, the issues described below are occurring frequently. As a result, the customer has become very reluctant 
  toward the Tableau replacement project, the EAM project, and proposals to JFE group companies, and there is a risk  
  that some of these opportunities may be lost.                                                                       
                                                                                                                      
  The potential business impact is as follows:                                                                        
                                                                                                                      
  Tableau replacement project: approx. 25 million JPY per year                                                        
                                                                                                                      
  EAM project: approx. 30 million JPY per year                                                                        
                                                                                                                      
  JFE Logistics project: approx. 15 million JPY per year                                                              
                                                                                                                      
  If the error messages and behavior at the time of error are not fundamentally improved, the likelihood of losing the
  above-mentioned opportunities will increase, and we expect the overall business impact to be very significant.      
                                                                                                                      
  We would therefore appreciate it if you could urgently consider your response policy and schedule, register these   
  items as enhancement requests, and share with us a concrete improvement plan.                                       
                                                                                                                      
  **Troubleshooting Steps:** null                                                                                     
                                                                                                                      
  ------------------------ 19 Comments ------------------------                                                       
                                                                                                                      
  svc-corp-jira-reader • Wed, 04 Mar 26 • Latest comment                                                              
                                                                                                                      
  Changes made into build no: 11.6.0400.00027                                                                         
                                                                                                                      
  Repo:mojojs                                                                                                         
                                                                                                                      
  Branch:m2021                                                                                                        
                                                                                                                      
  svc-corp-jira-reader • Tue, 03 Mar 26                                                                               
                                                                                                                      
  Changes made into build no: 11.6.0400.00088                                                                         
                                                                                                                      
  Repo:biweb                                                                                                          
                                                                                                                      
  Branch:m2021                                                                                                        
                                                                                                                      
  svc-corp-jira-reader • Thu, 26 Feb 26                                                                               
                                                                                                                      
  Pull request merged into m2021 by tchen_mstr: https://github.com/mstr-kiai/server/pull/10905 https://github.com/mstr-
  kiai/server/pull/10905                                                                                              
                                                                                                                      
  svc-corp-jira-reader • Thu, 26 Feb 26                                                                               
                                                                                                                      
  New pull request created by mfan_mstr for m2021: https://github.com/mstr-kiai/server/pull/10905                     
  https://github.com/mstr-kiai/server/pull/10905                                                                      
                                                                                                                      
  Yali Guo • Tue, 27 Jan 26                                                                                           
                                                                                                                      
  @@Min Zheng We are still working on the spike, from end-end workflow. It is very fundamental and the same issue is  
  also reproduced in legacy clients. The plan is to get this enhanced in Q2, tentatively April. We will keep you      
  posted once we have more confidence. Thanks                                                                         
                                                                                                                      
  cc @@Peng Peng  @@Tao (Andrei) Chen  @@Wei (Irene) Jiang  @@Wenyin (Athlon) Wang  @@En Li  @@Kuanqing Wang          
                                                                                                                      
  Yali Guo • Tue, 27 Jan 26                                                                                           
                                                                                                                      
  @@Peng Peng It is associated with error improvement feature in Irene’s team. we will evaluate the supported         
  scenarios after coming to the solution at architecture level.                                                       
                                                                                                                      
  Peng Peng • Mon, 26 Jan 26                                                                                          
                                                                                                                      
  @@Yali Guo Can we attach this to the feature from Irene and set the release for this feature                        
                                                                                                                      
  Min Zheng • Mon, 26 Jan 26                                                                                          
                                                                                                                      
  @@Peng Peng  @@Wenyin (Athlon) Wang  @@Yali Guo  @@Mingkang Fan  @@Tao (Andrei) Chen  @@Wei (Irene) Jiang  @@En Li  
                                                                                                                      
  is there any timeline/target release(roughly) we can share with customer?                                           
                                                                                                                      
  Mingkang Fan • Fri, 16 Jan 26                                                                                       
                                                                                                                      
  The solution is to enter pause mode and display a clear error message to remind users how to avoid this error when  
  we switch to execution mode and encounter an error.                                                                 
                                                                                                                      
  Both server and client SE are working on the detailed solution spike.                                               
                                                                                                                      
  cc @@Yali Guo  @@Tao (Andrei) Chen  @@Peng Peng  @@Wei (Irene) Jiang  @@Wenyin (Athlon) Wang  @@En Li               
                                                                                                                      
  Peng Peng • Fri, 16 Jan 26                                                                                          
                                                                                                                      
  Discussed with the team, we should support return to the pause mode and have a clear error message to let the       
  customer know what caused the error so he can continue the maniplation in pause mode                                
                                                                                                                      
  Yali Guo • Thu, 15 Jan 26                                                                                           
                                                                                                                      
  Update                                                                                                              
                                                                                                                      
  Today engineer did further investigation of the possible solution. We would try to rely on undo during authoring to 
  return to the previous status. Will keep working on the solution tomorrow.                                          
                                                                                                                      
  Mingkang Fan • Wed, 14 Jan 26                                                                                       
                                                                                                                      
  @@Yali Guo  @@Tao (Andrei) Chen We support partial failures in the grid view for reports, similar to the dashboard. 
  The mentioned row limit error that causes the entire report or dashboard to fail is a dataset execution failure.    
                                                                                                                      
  [attachment]We automatically revert the dataset error caused by changing the object parameter selection for the     
  dashboard through a strict condition check.                                                                         
                                                                                                                      
  **Perhaps we can expand the condition check to revert the general dataset error in the report.**                    
                                                                                                                      
  cc @@Kuanqing Wang  @@Peng Peng  @@Wenyin (Athlon) Wang  @@Zhongfang Zhou  @@Wei (Irene) Jiang                      
                                                                                                                      
  Yali Guo • Wed, 14 Jan 26                                                                                           
                                                                                                                      
  @@Mingkang Fan Hi Mingkang, could you please help follow up?                                                        
                                                                                                                      
  @@Bernardo Avalos Report in Web and library does not support partial failure capability. Just share this context    
  with you first. We will need some time to review and evaluate as current ownership.                                 
                                                                                                                      
  cc @@Tao (Andrei) Chen  @@Kuanqing Wang  @@Peng Peng  @@Wenyin (Athlon) Wang  @@Zhongfang Zhou  @@Wei (Irene) Jiang 
                                                                                                                      
  Bernardo Avalos • Wed, 14 Jan 26                                                                                    
                                                                                                                      
  @@Zhongfang Zhou  @@Yali Guo                                                                                        
                                                                                                                      
  Team, thank you for your work on this,                                                                              
                                                                                                                      
  Just wanted to chime in and provide you with additional context: the customer, JFE Steel, will escalated today 4    
  issues related to error handling. This is one of those.                                                             
                                                                                                                      
  As per comments from the AE, we don’t have a huge pressure on the timelines, but we need to assign a production     
  release and keep it.                                                                                                
                                                                                                                      
  Thanks again,                                                                                                       
                                                                                                                      
  cc @@Wenyin (Athlon) Wang                                                                                           
                                                                                                                      
  Zhongfang Zhou • Wed, 14 Jan 26                                                                                     
                                                                                                                      
  Hi @@Yali Guo ,  could you help check this escalation?                                                              
                                                                                                                      
  It’s similar to BCEN-4129 https://strategyagile.atlassian.net/browse/BCEN-4129 .                                    
                                                                                                                      
  When the report exceeds the maximum number of rows, the instance becomes broken and any subsequent manipulations can
  no longer be executed.                                                                                              
                                                                                                                      
  The issue notes that clicking the cancel button forcibly navigates to the Library home page. However, even if we    
  hide the cancel button, users still cannot perform any manipulations.                                               
                                                                                                                      
  cc @@Wei (Irene) Jiang  @@En Li                                                                                     
                                                                                                                      
  [attachment]                                                                                                        
                                                                                                                      
  Bin (Jason) Xu • Wed, 14 Jan 26                                                                                     
                                                                                                                      
  @@Wei (Irene) Jiang cc @@En Li                                                                                      
                                                                                                                      
  This defect can be reproduced in house.                                                                             
                                                                                                                      
  Steps to reproduce:                                                                                                 
                                                                                                                      
  1. Edit report https://tec-l-1183620.labs.microstrategy.                                                            
  com/MicroStrategyLibrary/app/B3FEE61A11E696C8BD0F0080EFC58F44/CFF23873264F9A08893AEA89F2004D03/K53--K46 https://tec-
  l-1183620.labs.microstrategy.                                                                                       
  com/MicroStrategyLibrary/app/B3FEE61A11E696C8BD0F0080EFC58F44/CFF23873264F9A08893AEA89F2004D03/K53--K46 by bxu with 
  empty password                                                                                                      
  2. Switch to running mode ❭❭ it will throw error “Maximum number of results rows per report exceeded limit“         
  3. Dismiss the error dialog ❭❭ issue here: report keeps in loading, click cancel will be back to library home       
                                                                                                                      
  Min Zheng • Wed, 14 Jan 26                                                                                          
                                                                                                                      
  video to show the issue customer complaint                                                                          
                                                                                                                      
  [attachment]                                                                                                        
                                                                                                                      
  Yanqing Liu • Tue, 13 Jan 26                                                                                        
                                                                                                                      
  Hi team, another request from JFE Steel Corporation and the case might be escalated soon as well. Could you help    
  review the request and suggest the plan to optimize the workflow? Thanks in advance!                                
                                                                                                                      
  cc @@Min Zheng                                                                                                      
                                                                                                                      
  Jira Integration • Tue, 13 Jan 26                                                                                   
                                                                                                                      
  Account: JFE Steel Corporation, Owner: Min Zheng (CSM), Creator: null                                               
                                                                                                                      
  Subject: Improve the behavior for end user to allow continued operations on report in Library after error happens.  
                                                                                                                      
  Business Impact: Comment from AE                                                                                    
                                                                                                                      
  We have received numerous requests for improvement from JFE Steel regarding the error messages and system behavior  
  when errors occur. We would like to request a fundamental enhancement in this area and hereby summarize their       
  requirements.                                                                                                       
                                                                                                                      
  Currently, the issues described below are occurring frequently. As a result, the customer has become very reluctant 
  toward the Tableau replacement project, the EAM project, and proposals to JFE group companies, and there is a risk  
  that some of these opportunities may be lost.                                                                       
                                                                                                                      
  The potential business impact is as follows:                                                                        
                                                                                                                      
  Tableau replacement project: approx. 25 million JPY per year                                                        
                                                                                                                      
  EAM project: approx. 30 million JPY per year                                                                        
                                                                                                                      
  JFE Logistics project: approx. 15 million JPY per year                                                              
                                                                                                                      
  If the error messages and behavior at the time of error are not fundamentally improved, the likelihood of losing the
  above-mentioned opportunities will increase, and we expect the overall business impact to be very significant.      
                                                                                                                      
  We would therefore appreciate it if you could urgently consider your response policy and schedule, register these   
  items as enhancement requests, and share with us a concrete improvement plan.                                       
                                                                                                                      
  Description: When user met error when operating with report in Library, they can not continue operations and are    
  forced to return to home page. This behavior is not user friendly.                                                  
                                                                                                                      
  For example, when report execution failed by exceeding the maximum row allowed, could the behavior be adjusted to   
  explicitly indicate the row count limit has been exceeded, display the available rows up to that point, and then    
  allow users to narrow down the data themselves using filter conditions or similar methods?                          
                                                                                                                      
  Particularly during the initial stages of report creation, it is common for users to proceed through trial and error
  while reviewing output results, without setting strict filter conditions beforehand. Considering this usage pattern,
  Strategy One's behavior of becoming completely unresponsive upon error occurrence presents a challenge from a user  
  experience perspective.                                                                                             
                                                                                                                      
[0;90m[0m[0;90m[0m  [0;90mView this issue on Jira: https://strategyagile.atlassian.net/browse/BCEN-4843[0m                                       

