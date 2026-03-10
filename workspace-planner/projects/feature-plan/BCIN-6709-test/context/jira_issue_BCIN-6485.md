
  ⭐ Defect  🚧 To Do  ⌛ Mon, 05 Jan 26  👷 Wei (Irene) Jiang  🔑️ BCIN-6485  💭 3 comments  🧵 0 linked             
                                                                                                                      
  # [기술보증기금] 뷰필터 적용 어트리뷰트 삭제시 행 이슈 - The hang icon happens and nothing works in report editor   
  once remove attribute which used in view filter in Strategy Library ON                                              
                                                                                                                      
  ⏱️  Fri, 21 Nov 25  🔎 Jira Integration  🚀 Lowest  📦 None  🏷️  xuyin_Q4  👀 0 watchers                            
                                                                                                                      
  ------------------------ Description ------------------------                                                       
                                                                                                                      
  **Description:** Subject : The hang icon happens and nothing works in report editor once remove attribute which used
  in view filter in Strategy Library ONE March 2024.                                                                  
                                                                                                                      
  Description : The hang icon happens and nothing works in report editor once remove attribute which used in view     
  filter in Strategy Library ONE March 2024.                                                                          
                                                                                                                      
  After applying an attribute view filter (filter data) to a Library report, if we remove the attribute from an object
  within the report, we receive an error message stating, "Cannot be removed because it is being used in a view       
  filter." Instead of displaying the report execution results, only a loading image is displayed. Resuming data       
  retrieval is not possible, forcing us to close the report we are editing.                                           
                                                                                                                      
  When removing an attribute applied to a view filter from an object within the report, we receive an error message   
  indicating that it is being used in a view filter, but the report we are editing is halted and must be closed.      
                                                                                                                      
  reported version : March 2024                                                                                       
                                                                                                                      
  tested version : Sep. 2025                                                                                          
                                                                                                                      
  **Expected Behavior:** End user expects to solve this issue                                                         
                                                                                                                      
  **Steps to Reproduce:** 1. In the Library, open the report editor  ❭ add attribute like category ❭ click "Resume    
  Data Retrieval" ❭ The report results display.                                                                       
                                                                                                                      
  2. In the Filter tab ❭ view filter ❭ add a category (Filter Data) and apply conditions like category in books ❭     
  Check the report execution results.                                                                                 
  3. Objects ❭ tab "In Report" ❭ Select the category  attribute ❭ RMC ❭  "Remove from Report" ❭ Error  ❭ Ok           
                                                                                                                      
  Error : Cannot remove attribute (id='8D…A4') from report because it is used by a view filter.                       
                                                                                                                      
  (refer to CS0987755_VF_error.png)                                                                                   
                                                                                                                      
  4. Then the grid hang with data loading icon  and "Resume data retrieval" "pause data retrieval" , re-execute ,     
  nothing works but showing the data loading progress icon only and customer could not edit / save in this report.    
                                                                                                                      
  (refer to CS0987755_Loading.png)                                                                                    
                                                                                                                      
  **Business Impact:** End user expects to solve this issue                                                           
                                                                                                                      
  **Troubleshooting Steps:** [-] reproduced                                                                           
                                                                                                                      
  ------------------------ 3 Comments ------------------------                                                        
                                                                                                                      
  Xue Yin • Mon, 24 Nov 25 • Latest comment                                                                           
                                                                                                                      
  @@Wei (Irene) Jiang  @@En Li it’s an existing issue that report editor can’t recover from error message. https://tec-
  l-1183620.labs.microstrategy.                                                                                       
  com/MicroStrategyLibrary/app/B7CA92F04B9FAE8D941C3E9B7E0CD754/C53926FAD04AEBC336C1C1BAE395B142/K53--                
  K46/edit https://tec-l-                                                                                             
  1183620.labs.microstrategy.                                                                                         
  com/MicroStrategyLibrary/app/B7CA92F04B9FAE8D941C3E9B7E0CD754/C53926FAD04AEBC336C1C1BAE395B142/K53--                
  K46/edit can be used to reproduce it.                                                                               
                                                                                                                      
  [attachment]cc @@Lingping Zhu                                                                                       
                                                                                                                      
  Lingping Zhu • Mon, 24 Nov 25                                                                                       
                                                                                                                      
  @@Xue Yin it looks to be one common manipulation for Report in Library, not sure whether it’s still there for Report
  in Library. Would you please help to take a confirmation? If it’s still there, we may ask @@Wei (Irene) Jiang team  
  to fix it. Thanks.                                                                                                  
                                                                                                                      
  Jira Integration • Fri, 21 Nov 25                                                                                   
                                                                                                                      
  Account: MOCOCO, Inc., Owner: Jenna Kim (CSS), Creator: servicecloud@microstrategy.com                              
  mailto:servicecloud@microstrategy.com                                                                               
                                                                                                                      
  Subject: [기술보증기금] 뷰필터 적용 어트리뷰트 삭제시 행 이슈 - The hang icon happens and nothing works in report   
  editor once remove attribute which used in view filter in Strategy Library ON                                       
                                                                                                                      
  Business Impact: End user expects to solve this issue                                                               
                                                                                                                      
  Description: Subject : The hang icon happens and nothing works in report editor once remove attribute which used in 
  view filter in Strategy Library ONE March 2024.                                                                     
                                                                                                                      
  Description : The hang icon happens and nothing works in report editor once remove attribute which used in view     
  filter in Strategy Library ONE March 2024.                                                                          
                                                                                                                      
  After applying an attribute view filter (filter data) to a Library report, if we remove the attribute from an object
  within the report, we receive an error message stating, "Cannot be removed because it is being used in a view       
  filter." Instead of displaying the report execution results, only a loading image is displayed. Resuming data       
  retrieval is not possible, forcing us to close the report we are editing.                                           
                                                                                                                      
  When removing an attribute applied to a view filter from an object within the report, we receive an error message   
  indicating that it is being used in a view filter, but the report we are editing is halted and must be closed.      
                                                                                                                      
  reported version : March 2024                                                                                       
                                                                                                                      
  tested version : Sep. 2025                                                                                          
                                                                                                                      
[0;90m[0m[0;90m[0m  [0;90mView this issue on Jira: https://strategyagile.atlassian.net/browse/BCIN-6485[0m                                       

