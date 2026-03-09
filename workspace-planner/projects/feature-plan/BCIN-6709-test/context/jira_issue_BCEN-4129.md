
  ⭐ Defect  🚧 To Do  ⌛ Fri, 12 Dec 25  👷 Yali Guo  🔑️ BCEN-4129  💭 9 comments  🧵 1 linked                      
                                                                                                                      
  # Need spike before coming to a solution | (MDX) Report Editor | Library | Unable to recover from MDX engine error. 
  UI will only show button "Cancel". If you click it, all progress is lost                                            
                                                                                                                      
  ⏱️  Thu, 13 Nov 25  🔎 Luis Hernandez Zapata  🚀 Low  📦 None  🏷️  None  👀 0 watchers                              
                                                                                                                      
  ------------------------ Description ------------------------                                                       
                                                                                                                      
  When you create a new MDX report, you may set conditions that will trigger an error in the engine or the source.    
  Once this happen, UI will show the button “cancel” which will not go away. USer will not have a way to recover their
  work. If you click Cancel, the report editor closes, without saving your work.                                      
                                                                                                                      
  Example of error on Engine/MDX source                                                                               
                                                                                                                      
  [attachment]Then UI becomes                                                                                         
                                                                                                                      
  [attachment]                                                                                                        
                                                                                                                      
  ------------------------ Linked Issues ------------------------                                                     
                                                                                                                      
  RELATES TO                                                                                                          
                                                                                                                      
  BCIN-5809 Defect Suite for Create Reports Using MDX Data Sources in Workstation an… • Story •  • Done               
                                                                                                                      
  ------------------------ 9 Comments ------------------------                                                        
                                                                                                                      
  Tao (Andrei) Chen • Tue, 25 Nov 25 • Latest comment                                                                 
                                                                                                                      
  @@Wei (Irene) Jiang  @@Yali Guo                                                                                     
                                                                                                                      
  A common solution is to undo the last action that caused the error, similar to what we did for canceling prompting; 
  otherwise, we cannot restore the broken definition. But it’s known that not everything can be undone. This needs to 
  be checked on a case-by-case basis.                                                                                 
                                                                                                                      
  cc @@Qi Ma                                                                                                          
                                                                                                                      
  Yali Guo • Mon, 24 Nov 25                                                                                           
                                                                                                                      
  Different rounds of research have been done since supporting the new report editor workflow. This is the general    
  behavior of dashboard execution, as some failures could not be recovered. @@Wei (Irene) Jiang                       
                                                                                                                      
  @@Tao (Andrei) Chen  @@Qi Ma Do you have any thoughts about this? it is indeed a pain point since day one.          
                                                                                                                      
  Wei (Irene) Jiang • Mon, 24 Nov 25                                                                                  
                                                                                                                      
  @@Yali Guo Could your team help to take a look at this issue? Besides multiple internal complains, we also received 
  one customer issue which complains that after error message occurs, the report just hangs and can’t recover. It is  
  frustrating to customer that all the previous configurations are lost once any error occurs.                        
                                                                                                                      
  📍 https://strategyagile.atlassian.net/browse/BCIN-6485 https://strategyagile.atlassian.net/browse/BCIN-6485        
                                                                                                                      
  Zhongfang Zhou • Thu, 20 Nov 25                                                                                     
                                                                                                                      
  @@Yali Guo Could your team help investigate this long-standing issue? In addition to MDX, whenever a manipulation   
  causes an error, the instance becomes broken, and subsequent manipulations cannot be executed anymore.              
                                                                                                                      
  cc @@Wei (Irene) Jiang  @@En Li                                                                                     
                                                                                                                      
  Wei (Irene) Jiang • Wed, 19 Nov 25                                                                                  
                                                                                                                      
  Thanks @@Lingping Zhu . Yes, the team is looking at this problem now as it is kind of frustrating for report editing
  process.                                                                                                            
                                                                                                                      
  @@Zhongfang Zhou                                                                                                    
                                                                                                                      
  Lingping Zhu • Wed, 19 Nov 25                                                                                       
                                                                                                                      
  @@Luis Hernandez Zapata thanks for reporting. This is indeed one long-existing limitation for Report Editor in      
  Library due to the special execution workflow.                                                                      
                                                                                                                      
  @@Wei (Irene) Jiang as report is more and more popular in the customer side, we may consider fixing this general    
  issue, especially for the cases which are due to iServer Partial failure from Engine/Kernel logic(like hitting      
  governing settings). We may need to consider adding some fallback logic to protect the current instance, otherwise  
  all the design in the report will NOT be able to continue even saving.                                              
                                                                                                                      
  cc @@Bin (Jason) Xu  @@Xue Yin                                                                                      
                                                                                                                      
  Luis Hernandez Zapata • Fri, 14 Nov 25                                                                              
                                                                                                                      
  This may also happen when hitting governing settings, rather than error on the source.                              
                                                                                                                      
  Increasing severity to High                                                                                         
                                                                                                                      
  [attachment]                                                                                                        
                                                                                                                      
  Xue Yin • Thu, 13 Nov 25                                                                                            
                                                                                                                      
  @@Luis Hernandez Zapata This is an exisiting limitation in library report editor. When error happens, all the       
  progress will be lost. cc @@Wei (Irene) Jiang  @@Bin (Jason) Xu                                                     
                                                                                                                      
  Luis Hernandez Zapata • Thu, 13 Nov 25                                                                              
                                                                                                                      
  fyi @@Xue Yin                                                                                                       
                                                                                                                      
[0;90m[0m[0;90m[0m  [0;90mView this issue on Jira: https://strategyagile.atlassian.net/browse/BCEN-4129[0m                                       

