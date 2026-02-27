// parseStepDefinitions.js

import { walkSync, extractMethodsAndParams, buildCFG } from './helpers.js';
import { StepDefinition } from './models.js';
import fs from 'fs';
import babelParser from '@babel/parser';
import _traverse from '@babel/traverse';
const traverse = _traverse.default;

const parseStepDefinitions = (stepsFolders) => {
    const stepDefinitions = [];

    // 遍历每个文件夹
    stepsFolders.forEach((folder) => {
        const files = walkSync(folder); // 假设 walkSync 返回所有文件
        console.log(`Processing folder: ${folder}`); // Debug: 当前处理的文件夹

        files.forEach((file) => {
            console.log(`Parsing file: ${file}`); // Debug: 当前处理的文件
            const content = fs.readFileSync(file, 'utf-8');
            const ast = babelParser.parse(content, { sourceType: 'module' });

            traverse(ast, {
                CallExpression(path) {
                    const callee = path.node.callee;
                    if (callee.type === 'Identifier' && ['Given', 'When', 'Then', 'And'].includes(callee.name)) {
                        const args = path.node.arguments;
                        if (
                            args.length >= 2 &&
                            (args[0].type === 'StringLiteral' || args[0].type === 'RegExpLiteral')
                        ) {
                            const stepType = callee.name;
                            const pattern = args[0].type === 'StringLiteral' ? args[0].value : args[0].pattern;
                            let methods = [];
                            let params = [];

                            if (args[1].type === 'FunctionExpression' || args[1].type === 'ArrowFunctionExpression') {
                                // 遍历 AST 的主体节点以提取表达式
                                const traverseNode = (node) => {
                                    if (node.type === 'ExpressionStatement' || node.type === 'VariableDeclaration') {
                                        let expression =
                                            node.expression || (node.declarations[0] && node.declarations[0].init);
                                        if (expression) {
                                            // Handle nested await expressions
                                            if (expression.type === 'AwaitExpression') {
                                                expression = expression.argument;
                                            }
                                            extractMethodsAndParams(expression, methods, params);
                                        }
                                    } else if (node.type === 'IfStatement') {
                                        const testExpression = node.test;
                                        if (
                                            testExpression &&
                                            testExpression.left &&
                                            testExpression.left.object &&
                                            testExpression.left.property
                                        ) {
                                            methods.push(
                                                `${testExpression.left.object.name}.${testExpression.left.property.name}`
                                            );
                                        }

                                        const consequentBody = (node.consequent && node.consequent.body) || [];
                                        consequentBody.forEach(traverseNode);

                                        const alternateBody = (node.alternate && node.alternate.body) || [];
                                        alternateBody.forEach(traverseNode);
                                    } else if (node.type === 'BlockStatement') {
                                        // Handle nested blocks
                                        node.body.forEach(traverseNode);
                                    }
                                };

                                args[1].body.body.forEach(traverseNode);
                            }

                            stepDefinitions.push(new StepDefinition(stepType, pattern, methods, params));
                            console.log(
                                `Parsed Step Definition: ${JSON.stringify(stepDefinitions[stepDefinitions.length - 1])}`
                            ); // Debug: 解析的步骤定义
                        }
                    }
                },
            });
        });
    });

    console.log('Final Parsed Step Definitions:', JSON.stringify(stepDefinitions, null, 2)); // Debug: 最终解析的步骤定义
    return stepDefinitions;
};

export default parseStepDefinitions;
