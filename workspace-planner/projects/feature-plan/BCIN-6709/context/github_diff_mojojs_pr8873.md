diff --git a/production/code/mojo/js/source/vi/controllers/RootController.js b/production/code/mojo/js/source/vi/controllers/RootController.js
index fa6c17f7024..a1a694126a7 100644
--- a/production/code/mojo/js/source/vi/controllers/RootController.js
+++ b/production/code/mojo/js/source/vi/controllers/RootController.js
@@ -4608,7 +4608,13 @@
                                         }, 0);
                                     },
                                     complete: function () {
-                                        cmdMgr.reset();
+                                        try {
+                                            if (cmdMgr.shouldResetUndoRedo) {
+                                                cmdMgr.reset();
+                                            }
+                                        } finally {
+                                            cmdMgr.shouldResetUndoRedo = true;
+                                        }
                                     }
                                 },
                                 rebuildFn = function (update) {
diff --git a/production/code/mojo/js/source/vi/controllers/UICmdMgr.js b/production/code/mojo/js/source/vi/controllers/UICmdMgr.js
index d0f76e86d00..188962999ff 100644
--- a/production/code/mojo/js/source/vi/controllers/UICmdMgr.js
+++ b/production/code/mojo/js/source/vi/controllers/UICmdMgr.js
@@ -156,6 +156,8 @@
 
             cancelPromptUndoStateId: -1,
 
+            shouldResetUndoRedo: true,
+
             cancelController: null,
 
             CMD_PHASE: CMD_PHASE,
