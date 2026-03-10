diff --git a/BIWebSDK/code/java/src/com/microstrategy/web/objects/RWManipulationBuilder.java b/BIWebSDK/code/java/src/com/microstrategy/web/objects/RWManipulationBuilder.java
index 14a92f4db7c..1372d9d31d3 100644
--- a/BIWebSDK/code/java/src/com/microstrategy/web/objects/RWManipulationBuilder.java
+++ b/BIWebSDK/code/java/src/com/microstrategy/web/objects/RWManipulationBuilder.java
@@ -6046,6 +6046,7 @@ public void undoHandler(RWDelta delta, JsonObject action, WebObjectsFactory fact
     	int stateId = getJSONInt(action, "stid");
         boolean isCancelPrompt = getJSONOptBoolean(action, "isCancelPrompt");
         boolean isCancelPromptAnswer = getJSONOptBoolean(action, "isCancelPromptAnswer");
+        boolean reCreateInstance = getJSONOptBoolean(action, "reCreateInstance");
     	//TQMS 996043. This parameter indicate that we need to kill current server job.
     	boolean killJob = getJSONOptBoolean(action, "killJob");
         boolean keepDocumentInstance = getJSONOptBoolean(action, "keepDocumentInstance", false);
@@ -6058,7 +6059,9 @@ public void undoHandler(RWDelta delta, JsonObject action, WebObjectsFactory fact
     			rwInstance.getRWManipulator(false).cancel(stateId, keepDocumentInstance, resolveExecution, isCancelPromptAnswer);
     		} else if (isCancelPrompt){
     			rwInstance.getRWManipulator(false).cancelPrompt(stateId);
-    		} else {
+    		} else if (reCreateInstance && stateId == -1) {
+                rwInstance.getRWManipulator(false).reCreateInstance(stateId, resolveExecution);
+            } else {
                 rwInstance.getRWManipulator(false).undo(stateId);
             }
     	}
diff --git a/BIWebSDK/code/java/src/com/microstrategy/web/objects/RWManipulationImpl.java b/BIWebSDK/code/java/src/com/microstrategy/web/objects/RWManipulationImpl.java
index 5da2a1f328f..842d9ab1623 100644
--- a/BIWebSDK/code/java/src/com/microstrategy/web/objects/RWManipulationImpl.java
+++ b/BIWebSDK/code/java/src/com/microstrategy/web/objects/RWManipulationImpl.java
@@ -1085,6 +1085,11 @@ public RWInstance cancelPrompt(int stateID) throws WebObjectsException {
         return refresh(false, false, true, null, null, stateID, false, false, true, false);
     }
 
+    @Override
+    public RWInstance reCreateInstance(int stateID, boolean resolveExecution) throws WebObjectsException {
+        return refresh(false, false, true, null, null, stateID, false, false, false, resolveExecution, false, true);
+    }
+
     @Override
 	public RWInstance redo(int stateID) throws WebObjectsException {
 		rebuild(rwInstance.getResultSettings(), stateID, null, RB_FLAG_RESET_AFTER);
@@ -1098,12 +1103,12 @@ public RWInstance cancel(int stateID) throws WebObjectsException {
 
     @Override
     public RWInstance cancel(int stateID, boolean keepDocumentInstance, boolean resolveExecution) throws WebObjectsException {
-        return refresh(false, false, true, null, null, stateID, false, true, false, keepDocumentInstance, resolveExecution, false);
+        return refresh(false, false, true, null, null, stateID, false, true, false, keepDocumentInstance, resolveExecution, false, false);
     }
 
     @Override
     public RWInstance cancel(int stateID, boolean keepDocumentInstance, boolean resolveExecution, boolean isCancelPromptAnswer) throws WebObjectsException {
-        return refresh(false, false, true, null, null, stateID, false, true, false, keepDocumentInstance, resolveExecution, isCancelPromptAnswer);
+        return refresh(false, false, true, null, null, stateID, false, true, false, keepDocumentInstance, resolveExecution, isCancelPromptAnswer, false);
     }
     
     /**
@@ -1137,11 +1142,15 @@ private int getStateID() {
     }
 
     private RWInstance refresh(boolean reprompt, boolean rerun, boolean regenerate, String promptAnswerXML, String curInfoWindowId, int stateID, boolean forUndo, boolean cancelJob, boolean forCancelPrompt, boolean forCancelPromptAnswer) throws WebObjectsException {
-        return refresh(reprompt, rerun, regenerate, promptAnswerXML, curInfoWindowId, stateID, forUndo, cancelJob, forCancelPrompt, false, false, forCancelPromptAnswer);
+        return refresh(reprompt, rerun, regenerate, promptAnswerXML, curInfoWindowId, stateID, forUndo, cancelJob, forCancelPrompt, false, false, forCancelPromptAnswer, false);
+    }
+
+    private RWInstance refresh(boolean reprompt, boolean rerun, boolean regenerate, String promptAnswerXML, String curInfoWindowId, int stateID, boolean forUndo, boolean cancelJob, boolean forCancelPrompt, boolean resolveExecution, boolean forCancelPromptAnswer, boolean reCreateInstance) throws WebObjectsException {
+        return refresh(reprompt, rerun, regenerate, promptAnswerXML, curInfoWindowId, stateID, forUndo, cancelJob, forCancelPrompt, false, resolveExecution, forCancelPromptAnswer, reCreateInstance);
     }
 
     private RWInstance refresh(boolean reprompt, boolean rerun, boolean regenerate, String promptAnswerXML, String curInfoWindowId, int stateID, boolean forUndo, boolean cancelJob, boolean forCancelPrompt,
-                               boolean keepDocumentInstance, boolean resolveExecution, boolean forCancelPromptAnswer) throws WebObjectsException {
+                               boolean keepDocumentInstance, boolean resolveExecution, boolean forCancelPromptAnswer, boolean reCreateInstance) throws WebObjectsException {
 
         RWInstanceImpl newInstance = null;
 
@@ -1224,6 +1233,9 @@ private RWInstance refresh(boolean reprompt, boolean rerun, boolean regenerate,
             if (cancelJob && forCancelPromptAnswer) {
                 osFlag = 5;
             }
+            if (reCreateInstance) {
+                osFlag = 8;
+            }
             if (osFlag > 0) {
                 buf.append("<os>" + osFlag + "</os>").toString();
             }
diff --git a/BIWebSDK/code/java/src/com/microstrategy/web/objects/rw/RWManipulation.java b/BIWebSDK/code/java/src/com/microstrategy/web/objects/rw/RWManipulation.java
index 3ee99b667b0..a8ea0f7466a 100644
--- a/BIWebSDK/code/java/src/com/microstrategy/web/objects/rw/RWManipulation.java
+++ b/BIWebSDK/code/java/src/com/microstrategy/web/objects/rw/RWManipulation.java
@@ -1227,6 +1227,8 @@ public RWInstance addTemplateFromDataSet(String dataSetId, String key, String pa
 
     public abstract RWInstance cancelPrompt(int stateID) throws WebObjectsException;
 
+    public abstract RWInstance reCreateInstance(int stateID, boolean resolveExecution) throws WebObjectsException;
+
     public abstract RWInstance redo(int stateID) throws WebObjectsException;
     
     public RWInstance toggleDataServeMode(String dsid, int type, int mode) throws WebObjectsException;
