// models.js
// models for cucumber scripts
class FeatureStep {
    constructor(rawText, keyword) {
        this.rawText = rawText;
        this.keyword = keyword;
    }
}

class Method {
    constructor(methodName, methodArgs, methodBody) {
        this.methodName = methodName;
        this.methodArgs = methodArgs;
        this.methodBody = methodBody;
    }
}

class PageObject {
    constructor(className, methods) {
        this.className = className;
        this.methods = methods;
    }
}

class PageObjectMethodInfo {
    constructor(className) {
        this.className = className;
        this.methods = [];
    }

    addMethod(methodName, methodBody) {
        this.methods.push({ methodName, methodBody });
    }
}

class StepDefinition {
    constructor(stepType, pattern, methods, parameters) {
        this.stepType = stepType;
        this.pattern = pattern;
        this.methods = methods;
        this.parameters = parameters;
    }
}

class StepMatch {
    constructor(featureStep, definition = null, parameters = {}, pageObjects = [], mapping = []) {
        this.featureStep = featureStep;
        this.definition = definition;
        this.parameters = parameters;
        this.pageObjects = pageObjects;
        this.mapping = mapping;
    }
}

// export class Mapping {
//     constructor(pageObject, method) {
//         this.pageObject = pageObject;
//         this.method = method;
//     }
// }
export class ScenarioModel {
    constructor(scenarioId, scenarioName, steps) {
        this.id = scenarioId;
        this.name = scenarioName;
        this.steps = steps;
    }
}

export class FeatureModel {
    constructor(featureName, featureDescription, scenarios) {
        this.name = featureName;
        this.description = featureDescription;
        this.scenarios = scenarios;
    }
}
export { FeatureStep, Method, PageObject, StepDefinition, StepMatch, PageObjectMethodInfo };
