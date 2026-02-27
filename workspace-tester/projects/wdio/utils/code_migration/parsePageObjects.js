// parsePageObjects.js

import { walkSync, buildCFG } from './helpers.js';
import { PageObject, Method } from './models.js';
import fs from 'fs';
import babelParser from '@babel/parser';
import _traverse from "@babel/traverse";
const traverse = _traverse.default;

const parsePageObjects = (pageObjectsFolders) => {
    const pageObjects = [];

    // 遍历每个文件夹
    pageObjectsFolders.forEach((folder) => {
        const files = walkSync(folder); // 假设 walkSync 返回所有文件
        console.log(`Processing folder: ${folder}`); // Debug: 当前处理的文件夹

        files.forEach((file) => {
            console.log(`Parsing file: ${file}`); // Debug: 当前处理的文件
            const content = fs.readFileSync(file, 'utf-8');

            const ast = babelParser.parse(content, { sourceType: 'module', plugins: ['classProperties'] });

            traverse(ast, {
                ClassDeclaration(path) {
                    const className = path.node.id.name;
                    const methods = [];

                    path.node.body.body.forEach((member) => {
                        if (
                            (member.type === 'ClassMethod' || member.type === 'ClassProperty') &&
                            member.key.type === 'Identifier'
                        ) {
                            const methodName = member.key.name;
                            const methodArgs = member.params ? member.params.map((param) => param.name) : [];
                            let methodBody = '';

                            if (member.body) {
                                methodBody = content.substring(member.body.start, member.body.end);
                            }

                            methods.push(new Method(methodName, methodArgs, methodBody));
                        }
                    });

                    pageObjects.push(new PageObject(className, methods));
                },
                ExportDefaultDeclaration(path) {
                    if (path.node.declaration.type === 'ClassDeclaration') {
                        const className = path.node.declaration.id.name;
                        pageObjects.push(new PageObject(className, []));
                    }
                },
            });
        });
    });

    console.log('Parsed Page Objects:', JSON.stringify(pageObjects, null, 2)); // Debug: 解析的页面对象
    return pageObjects;
};

export default parsePageObjects;
