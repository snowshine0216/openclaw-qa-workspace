// matchStepsWithDefinitions.js

import { StepMatch, PageObjectMethodInfo } from './models.js';
import { buildCFG } from './helpers.js';

const matchStepsWithDefinitions = (
    featureModel,
    stepDefinitions,
    pageObjects,
    deduplicatePatterns = false,
    includePageObjects = true
) => {
    const stepMatches = [];

    featureModel.scenarios.forEach((scenario) => {
        const seenPatterns = new Set(); // Track already processed patterns
        const updatedSteps = scenario.steps
            .map((featureStep) => {
                const stepText = featureStep.rawText.substring(featureStep.keyword.length).trim();
                const definition = stepDefinitions.find((def) => {
                    try {
                        return new RegExp(def.pattern).test(stepText);
                    } catch (e) {
                        console.error(`Invalid regex pattern: ${def.pattern}`, e);
                        return false;
                    }
                });

                if (!definition) {
                    console.log(`No definition found for step: ${stepText}`);
                    return null;
                }

                // Only check for duplicates if deduplicatePatterns is true
                if (deduplicatePatterns && seenPatterns.has(definition.pattern)) {
                    console.log(`Pattern already seen: ${definition.pattern}`);
                    return null;
                }

                // Add pattern to seen set if deduplicating
                if (deduplicatePatterns) {
                    seenPatterns.add(definition.pattern);
                }

                // Extract method information involved in step definitions
                const methodsInfo = includePageObjects
                    ? definition.methods
                          .map((methodName) => {
                              return pageObjects.reduce((acc, obj) => {
                                  const foundMethod = obj.methods.find(
                                      (method) => method.methodName === methodName.split('.').pop()
                                  );
                                  if (foundMethod) {
                                      acc.push(foundMethod);
                                  }
                                  return acc;
                              }, []);
                          })
                          .flat()
                    : [];

                // Extract detailed information of classes and methods involved in definitions
                const pageObjectsInfo = includePageObjects
                    ? pageObjects.reduce((acc, obj) => {
                          definition.methods.forEach((methodString) => {
                              let pageName, methodName;
                              
                              // Handle both "pageName.methodName" and standalone "methodName" formats
                              if (methodString.includes('.')) {
                                  [pageName, methodName] = methodString.split('.');
                                  
                                  // Improved matching logic to handle common naming variations
                                  const normalizedClassName = obj.className.toLowerCase();
                                  const normalizedPageName = pageName.toLowerCase();
                                  
                                  // Check multiple matching patterns:
                                  // 1. Direct substring match
                                  // 2. Handle common abbreviations (viz -> visualization)
                                  // 3. Handle camelCase to actual words (vizPanelForGrid -> VisualizationPanelForGrid)
                                  const isMatch = normalizedClassName.includes(normalizedPageName) ||
                                      (normalizedPageName.startsWith('viz') && normalizedClassName.includes('visualization')) ||
                                      (normalizedPageName.includes('panel') && normalizedClassName.includes('panel')) ||
                                      (normalizedPageName.includes('grid') && normalizedClassName.includes('grid'));
                                  
                                  if (isMatch) {
                                      const foundMethod = obj.methods.find((method) => method.methodName === methodName);
                                      if (foundMethod) {
                                          let pageObjectInfo = acc.find((info) => info.className === obj.className);
                                          if (!pageObjectInfo) {
                                              pageObjectInfo = new PageObjectMethodInfo(obj.className);
                                              acc.push(pageObjectInfo);
                                          }
                                          pageObjectInfo.addMethod(foundMethod.methodName, foundMethod.methodBody);
                                      }
                                  }
                              } else {
                                  // For standalone method names, search across all page objects
                                  methodName = methodString;
                                  const foundMethod = obj.methods.find((method) => method.methodName === methodName);
                                  if (foundMethod) {
                                      let pageObjectInfo = acc.find((info) => info.className === obj.className);
                                      if (!pageObjectInfo) {
                                          pageObjectInfo = new PageObjectMethodInfo(obj.className);
                                          acc.push(pageObjectInfo);
                                      }
                                      pageObjectInfo.addMethod(foundMethod.methodName, foundMethod.methodBody);
                                  }
                              }
                          });
                          return acc;
                      }, [])
                    : [];

                return new StepMatch(
                    featureStep,
                    {
                        ...definition,
                        methods: methodsInfo,
                    },
                    definition.parameters,
                    pageObjectsInfo
                );
            })
            .filter((step) => step !== null);

        stepMatches.push(...updatedSteps);
        scenario.steps = updatedSteps;
    });

    // console.log('Final Matched Steps: ', JSON.stringify(stepMatches, null, 2)); // Debug: final matched steps
    return featureModel;
};

export default matchStepsWithDefinitions;
