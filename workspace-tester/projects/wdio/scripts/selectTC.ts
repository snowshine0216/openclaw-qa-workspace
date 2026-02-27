import fs from 'fs-extra';
import * as cheerio from 'cheerio';
import { glob } from 'glob';
import path from 'path';
import getLogger from './logger.js';
import ts from 'typescript';

const { warn, info, gray } = getLogger('[selectTC.ts]: ');
const FEATURE_MAPPING_JSON = './featureMapping.json';

interface TestCase {
    id: string;
    tags: string[];
}

interface ScanResult {
    [tcId: string]: {
        specFilePath: string;
        specFileName: string;
        tags: string[];
    };
}

interface InputJSON {
    [relativeSpecFilePath: string]: string[];
}

interface Feature {
    [featureName: string]: string[] | Feature;
}

interface FlattenedFeatures {
    [featureName: string]: string[];
}

// Traverse AST to extract test cases and tags
function visitNode(node: ts.Node, testCases: TestCase[]) {
    if (
        ts.isCallExpression(node) &&
        ts.isIdentifier(node.expression) &&
        node.expression.text === 'it' &&
        node.arguments.length > 0 &&
        ts.isStringLiteral(node.arguments[0])
    ) {
        const testCaseName = node.arguments[0].text;
        // Get Rally TC strings like: it('[TC79862], it('[TC67161_01], it('[TC67161_02_01] etc.
        // Get JIRA TC strings like: it('[BCIN-1234], it('[BCIN-1234_01], it('[BCIN-1234_02_01] etc.
        const match = testCaseName.match(/^\[((?:TC\d+|[A-Z]{4}-\d+)(?:_\d+)*)\]/);
        if (match) {
            const tags: string[] = [];
            ts.getJSDocTags(node.parent).forEach((tag) => {
                if (tag.tagName.text === 'wdio' && typeof tag.comment === 'string') {
                    tags.push(...tag.comment.split(',').map((t) => t.trim()));
                }
            });

            testCases.push({ id: match[1], tags });
        } else {
            warn(`"${testCaseName}" does not match the [TCID] prefix pattern, skip this`);
        }
    }

    ts.forEachChild(node, (node) => visitNode(node, testCases));
}

function flattenFeatures(feature: Feature): FlattenedFeatures {
    let output: FlattenedFeatures = {};

    for (const featureName in feature) {
        if (Array.isArray(feature[featureName])) {
            output[featureName] = feature[featureName] as string[];
        } else if (typeof feature[featureName] === 'object') {
            const ret = flattenFeatures(feature[featureName] as Feature);
            const mergedArray = Object.values(ret).flat();
            output = {
                ...output,
                [featureName]: mergedArray,
                ...ret,
            };
        } else {
            throw new Error('invalid data format');
        }
    }

    return output;
}

function logResult(specFiles: string[], resolveBaseDir: string, type: 'featureList' | 'tcList' | 'xml') {
    info(
        `Resolve ${type} to ${specFiles.length} specFiles: "${specFiles
            .slice(0, 3)
            .map((filePath) => path.relative(resolveBaseDir, filePath))
            .join(',')}${specFiles.length > 3 ? '...' : ''}"`
    );
}

function convertFeatureList2InputJSON(features: string[], resolveBaseDir: string): InputJSON {
    // 1. flatten the mapping json file
    const mapping: Feature = fs.readJSONSync(path.join(resolveBaseDir, FEATURE_MAPPING_JSON));
    const flattenedFeatureMappings = flattenFeatures(mapping);

    // 2. get specFiles contained by features
    let specFileNames: string[] = [];

    if (features.join(',') === '*') {
        features = Object.keys(mapping).filter((key) => key !== 'ManualConfigurationNeededFeatures');
    }

    features.forEach((featureName) => {
        if (flattenedFeatureMappings[featureName]) {
            specFileNames.push(...(flattenedFeatureMappings[featureName] || []));
        } else {
            warn(`Feature "${featureName}" is not found in the mapping file, skip this`);
        }
    });
    specFileNames = [...new Set(specFileNames)];

    // 3. get tcId to specFile mapping
    const tcId2SpecFileMapping: ScanResult = {};
    _readTcId2SpecFileMapping(resolveBaseDir, tcId2SpecFileMapping, true);

    // 4. generate InputJSON data from the specFiles and tcId2SpecFileMapping
    const inputJSON: InputJSON = specFileNames.reduce((prev, specFileName) => {
        const matched = Object.entries(tcId2SpecFileMapping).filter(([, o]) => o.specFileName === specFileName);

        const filePaths = [...new Set(matched.map(([, o]) => o.specFilePath))];
        if (filePaths.length === 0) {
            warn(`specFile "${specFileName}" have matched no files in the ${resolveBaseDir} folder`);
        } else if (filePaths.length > 1) {
            warn(
                `specFile "${specFileName}" have matched ${filePaths.join(
                    ','
                )} in the ${resolveBaseDir} folder, skip this`
            );
        } else {
            prev[filePaths[0]] = matched.map(([id]) => `[${id}]`);
        }

        return prev;
    }, {});

    const specFiles = Object.keys(inputJSON);
    if (specFiles.length === 0) {
        throw new Error(`features ${features.join(',')} do not contain any valid specFiles`);
    }

    logResult(specFiles, resolveBaseDir, 'featureList');

    return inputJSON;
}

function convertTcList2InputJSON(tcList: string[], resolveBaseDir: string): InputJSON {
    const tcId2SpecFileMapping: ScanResult = {};
    _readTcId2SpecFileMapping(resolveBaseDir, tcId2SpecFileMapping, true);

    const inputJSON: InputJSON = {};
    tcList.forEach((tcId) => {
        const { specFilePath } = tcId2SpecFileMapping[tcId] || {};
        if (specFilePath) {
            inputJSON[specFilePath] = inputJSON[specFilePath] || [];
            inputJSON[specFilePath].push(`[${tcId}]`);
        } else {
            warn(`tcId "${tcId}" is not defined in any specFiles`);
        }
    });

    const specFiles = Object.keys(inputJSON);
    if (specFiles.length === 0) {
        throw new Error(`tcIds ${tcList.join(',')} are not defined in any valid specFiles`);
    }

    logResult(specFiles, resolveBaseDir, 'tcList');

    return inputJSON;
}

/**
 * Transform XML to JSON format, the input XML formatting should like the following
 * <root>
 *  <TestSuite id='1' name='XssFilter.spec.js'>
 *    <TC>TC73252</TC>
 *    <TC>TC73252_01</TC>
 *  </TestSuite>
 * </root>
 */
function converXML2InputJSON(xmlFilePath: string, resolveBaseDir: string): InputJSON {
    const $ = _readFromXmlFile(xmlFilePath);

    const inputJSON: InputJSON = {};
    $('TestSuite').each(function () {
        const fileName = $(this).attr('name');
        const globPattern = `${resolveBaseDir}/**/${fileName}`;

        const matchedFiles = glob.sync(globPattern);
        if (matchedFiles.length !== 1) {
            throw new Error(`${globPattern} find 0 or more than 1 files: ${matchedFiles.join(',')}`);
        }

        const filePath = matchedFiles[0];
        inputJSON[filePath] = [];
        const children = $(this).children();
        for (let l = 0; l < children.length; l++) {
            inputJSON[filePath].push(`[${children.eq(l).text()}]`);
        }
    });

    const specFiles = Object.keys(inputJSON);
    if (specFiles.length === 0) {
        throw new Error(`xml ${xmlFilePath} does not contain any valid specFiles`);
    }

    logResult(specFiles, resolveBaseDir, 'xml');

    return inputJSON;
}

/**
 * Generate input json by xml file, feature list or tc list
 */
export default function selectTC({ featureList, tcList, xml: xmlFilePath }, { resolveBaseDir }): InputJSON | null {
    if (featureList) {
        const features = (featureList as string).split(',').map((o) => o.trim());
        info(`Run by featureList: "${features.join(',')}"`);
        return convertFeatureList2InputJSON(features, resolveBaseDir);
    } else if (tcList) {
        const tcArray = (tcList as string).split(',').map((o) => o.trim());
        info(`Run by tcList: "${tcArray.join(',')}"`);
        return convertTcList2InputJSON(tcArray, resolveBaseDir);
    } else if (xmlFilePath) {
        info(`Run by xml: "${xmlFilePath}"`);
        return converXML2InputJSON(xmlFilePath, resolveBaseDir);
    }

    return null;
}

/** Recursively reads the test case ID to spec file mapping from the given base directory. */
function _readTcId2SpecFileMapping(baseDir: string, result: ScanResult, isRoot: boolean = false): void {
    if (!fs.existsSync(baseDir)) {
        return;
    }

    fs.readdirSync(baseDir).forEach((subPath) => {
        const curPath = path.join(baseDir, subPath);
        const stats = fs.statSync(curPath);

        if (stats.isDirectory()) {
            _readTcId2SpecFileMapping(curPath, result);
        } else if (stats.isFile()) {
            const fileName = path.basename(curPath);

            if (!(fileName.endsWith('.spec.js') || fileName.endsWith('.spec.ts'))) return;

            const content = fs.readFileSync(curPath, 'utf8');

            let ast: ts.SourceFile;
            try {
                // Parse TypeScript code and generate AST
                ast = ts.createSourceFile(curPath, content, ts.ScriptTarget.ES2021, true);
            } catch (e) {
                warn(`"${curPath}" is not a valid TypeScript/JavaScript file, skip this`);
                return;
            }

            const testCases: TestCase[] = [];
            ts.forEachChild(ast, (node) => visitNode(node, testCases));

            testCases.forEach(({ id, tags }) => {
                if (result[id]) {
                    warn(`tcId "${id}" is defined in both ${result[id].specFilePath} and ${curPath}, skip this`);
                } else {
                    result[id] = { specFilePath: curPath, specFileName: subPath, tags };
                }
            });
        }
    });

    if (isRoot) {
        const tcCount = Object.keys(result).length;
        const specFileNumber = [...new Set(Object.values(result).map((o) => o.specFilePath))].length;
        gray(`Found ${tcCount} test cases and ${specFileNumber} specFiles in "${baseDir}" folder`);
        const tcTags = [
            ...new Set(
                Object.values(result)
                    .map((o) => o.tags)
                    .flat()
            ),
        ];
        tcTags.length && gray(`Found "${tcTags.join(',')}" tags in "${baseDir}" folder`);
    }
}

function _readFromXmlFile(filePath: string): cheerio.CheerioAPI {
    if (!filePath || !fs.existsSync(filePath)) {
        throw new Error(`${filePath} does not exist!`);
    }

    const xmlContent = fs.readFileSync(filePath, 'utf8');
    const $ = cheerio.load(xmlContent, {
        xml: {
            xmlMode: true,
        },
    });

    return $;
}
