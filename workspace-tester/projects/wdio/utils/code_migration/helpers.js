// helpers.js

import fs from 'fs';
import path from 'path';
import babelParser from '@babel/parser';
import crypto from 'crypto';
import _traverse from '@babel/traverse';
const traverse = _traverse.default;

import { FeatureStep, ScenarioModel } from './models.js';

// Recursively read files from directory
const walkSync = (dir, filelist = []) => {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            walkSync(filePath, filelist);
        } else {
            filelist.push(filePath);
        }
    });
    return filelist;
};

// Extract method names and parameter names
const extractMethodsAndParams = (expression, methods, params) => {
    if (!expression) return null;
    
    if (expression.type === 'CallExpression') {
        if (expression.callee.type === 'MemberExpression') {
            const objectName = extractMethodsAndParams(expression.callee.object, methods, params);
            const propertyName = expression.callee.property.name;
            
            // Handle 'this' context better - when we see 'this.methodName', record it as just 'methodName'
            // so it can be matched across all page objects
            if (objectName === 'this') {
                methods.push(propertyName);
            } else if (objectName) {
                methods.push(`${objectName}.${propertyName}`);
            } else {
                methods.push(propertyName);
            }
        } else if (expression.callee.name) {
            methods.push(expression.callee.name);
        }
        
        // Recursively process arguments to find nested method calls
        expression.arguments.forEach((arg) => {
            if (arg.type === 'AwaitExpression') {
                extractMethodsAndParams(arg.argument, methods, params);
            } else if (arg.type === 'CallExpression') {
                extractMethodsAndParams(arg, methods, params);
            } else if (arg.type === 'Identifier') {
                params.push(arg.name);
            } else if (arg.type === 'StringLiteral') {
                params.push(arg.value);
            }
        });
    } else if (expression.type === 'MemberExpression') {
        const objectName = extractMethodsAndParams(expression.object, methods, params);
        const propertyName = expression.property.name;
        
        if (objectName === 'this') {
            return propertyName;
        } else if (objectName) {
            return `${objectName}.${propertyName}`;
        } else {
            return propertyName;
        }
    } else if (expression.type === 'Identifier') {
        return expression.name;
    } else if (expression.type === 'ThisExpression') {
        return 'this';
    } else if (expression.type === 'AwaitExpression') {
        // Handle nested await expressions
        return extractMethodsAndParams(expression.argument, methods, params);
    }
    return null;
};

// Function to generate a unique identifier based on the content
const generateUniqueId = (content) => {
    return crypto.createHash('md5').update(content).digest('hex');
};

// Utility function to generate unique scenarioId when there are duplicates
const generateUniqueScenarioId = (baseId, existingIds) => {
    let id = baseId;
    let counter = 1;
    while (existingIds.has(id)) {
        id = `${baseId}_${counter}`;
        counter += 1;
    }
    existingIds.add(id);
    return id;
};
/**
 * Parses a single line from the feature file to extract relevant information
 * @param {string} line - The line to parse
 * @param {Object} state - The current state object containing accumulated information and configurations
 */
export const parseFeatureLine = (line, state) => {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith('Feature:')) {
        state.featureDescription = trimmedLine.substring('Feature:'.length).trim();
    } else if (trimmedLine.startsWith('@')) {
        const matches = trimmedLine.match(/@\w+/g);
        if (matches) {
            matches.forEach((match) => {
                if (match.startsWith('@TC') || match.startsWith('@DE')) {
                    const scenarioIdMatch = match.match(/@(TC|DE)(\d+)/);
                    if (scenarioIdMatch) {
                        const fullScenarioId = scenarioIdMatch[0].substring(1);
                        state.scenarioId = generateUniqueScenarioId(fullScenarioId, state.existingScenarioIds);
                    }
                } else {
                    state.scenarioId = generateUniqueScenarioId('TC0000', state.existingScenarioIds);
                }
            });
        }
    } else if (trimmedLine.startsWith('Scenario:')) {
        if (state.currentScenarioSteps.length > 0) {
            state.scenarios.push(new ScenarioModel(state.scenarioId, state.scenarioName, state.currentScenarioSteps));
            state.currentScenarioSteps = [];
        }
        state.scenarioName = trimmedLine.substring('Scenario:'.length).trim();
    } else if (
        trimmedLine.startsWith('Given') ||
        trimmedLine.startsWith('When') ||
        trimmedLine.startsWith('Then') ||
        trimmedLine.startsWith('And')
    ) {
        const [keyword] = trimmedLine.split(' ');
        state.currentScenarioSteps.push(new FeatureStep(trimmedLine, keyword));
    }
};

// Function to build Control Flow Graph (CFG)
const buildCFG = (name, methods, folder = 'cfg/cucumber') => {
    // if no folder create one
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
    }
    const nodes = [];
    const edges = [];

    methods.forEach((method) => {
        const methodNodeId = `${name}_${method.methodName}`;
        nodes.push({ id: methodNodeId, label: `Method: ${method.methodName}` });

        // Check if methodBody exists
        if (!method.methodBody) {
            console.warn(`No method body found for ${method.methodName}`);
            return; // Skip this method as it has no body
        }

        // Wrap method body in a function to avoid "return" syntax error
        const wrappedMethodBody = `async function wrappedMethod() { ${method.methodBody} }`;

        let ast;
        try {
            ast = babelParser.parse(wrappedMethodBody, { sourceType: 'module' });
        } catch (error) {
            console.error(`Failed to parse method body for ${method.methodName}:`, error.message);
            return;
        }

        traverse(ast, {
            IfStatement(path) {
                // Ensure the hub attribute is initialized
                if (!path.hub) {
                    path.hub = { getCode: () => wrappedMethodBody };
                }
                const testNodeId = `${name}_${method.methodName}_if_${path.node.start}`;
                const testCode = path.toString();
                nodes.push({ id: testNodeId, label: `If (${testCode})` });
                edges.push({ from: methodNodeId, to: testNodeId });

                const consequent = path.get('consequent');
                if (consequent && consequent.node && consequent.node.body) {
                    const consequentBody = consequent.node.body;
                    consequentBody.forEach((n, index) => {
                        const statementNodeId = `${name}_${method.methodName}_cons_${n.start}_${index}`;
                        const statementCode = path.getSource(n) || n.toString();
                        nodes.push({ id: statementNodeId, label: statementCode });
                        edges.push({ from: testNodeId, to: statementNodeId });
                    });
                }

                const alternate = path.get('alternate');
                if (alternate && alternate.node && alternate.node.body) {
                    const alternateBody = alternate.node.body;
                    alternateBody.forEach((n, index) => {
                        const statementNodeId = `${name}_${method.methodName}_alt_${n.start}_${index}`;
                        const statementCode = path.getSource(n) || n.toString();
                        nodes.push({ id: statementNodeId, label: statementCode });
                        edges.push({ from: testNodeId, to: statementNodeId });
                    });
                }
            },
        });
    });

    const dotString = `
      digraph ${name}_cfg {
        ${nodes.map((node) => `${node.id} [label="${node.label}"];`).join('\n')}
        ${edges.map((edge) => `${edge.from} -> ${edge.to};`).join('\n')}
      }
    `;

    // Generate a unique file name using the content hash
    const uniqueId = generateUniqueId(dotString);
    const dotFilePath = `${folder}/${name}_${uniqueId}_cfg.dot`;
    const pngFilePath = `${folder}/${name}_${uniqueId}_cfg.png`;

    fs.writeFileSync(dotFilePath, dotString, 'utf8');
    // execSync(`dot -Tpng ${dotFilePath} -o ${pngFilePath}`);
    console.log(`Control flow graph for ${name} created successfully: ${pngFilePath}`);
};

export { walkSync, extractMethodsAndParams, buildCFG };