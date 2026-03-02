import XLSX from 'xlsx';
import Papa from 'papaparse';
import fs from 'fs';
import lodash from 'lodash'; 
const { pick, sortBy, isEqual, differenceWith } = lodash;

/**
 * read excel file
 */
export function readExcel(filePath) {
    // console.log('exists:', fs.existsSync(filePath));
    // const stat = fs.statSync(filePath);
    // console.log('File size:', stat.size, 'bytes');
    const buf = fs.readFileSync(filePath);
    // console.log('File start bytes:', buf.slice(0, 8).toString('hex'));
    try {
        const workbook = XLSX.read(buf, { type: 'buffer' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        return XLSX.utils.sheet_to_json(sheet, { defval: '' });
    } catch (e) {
        console.error('XLSX.readFile/Buffer error:', e);
        throw e;
    }
}

/**
 * read csv file
 */
export function readCsv(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const result = Papa.parse(content, { header: true, skipEmptyLines: true });
    return result.data;
}

/**
 * compare excel files
 */
export function compareExcel(fileA, fileB, options = {}) {
    let arrA = readExcel(fileA);
    let arrB = readExcel(fileB);
    const { ignoreOrder, fields, showDiff } = options;
    if (fields) {
        arrA = arrA.map(row => pick(row, fields));
        arrB = arrB.map(row => pick(row, fields));
    }
    if (ignoreOrder) {
        arrA = sortBy(arrA, JSON.stringify);
        arrB = sortBy(arrB, JSON.stringify);
    }

    const equal = isEqual(arrA, arrB);

    if (!equal && showDiff) {
        const aNotInB = differenceWith(arrA, arrB, isEqual);
        const bNotInA = differenceWith(arrB, arrA, isEqual);
        console.error(`❌ Excel not same!`);
        if (aNotInB.length) {
            console.error('in baseline not in output:', aNotInB);
        }
        if (bNotInA.length) {
            console.error('in output not in baseline:', bNotInA);
        }
    }
    return equal;
}

/**
 * compare csv files
 */
export function compareCsv(fileA, fileB, options = {}) {
    let arrA = readCsv(fileA);
    let arrB = readCsv(fileB);
    const { ignoreOrder, fields, showDiff } = options;
    if (fields) {
        arrA = arrA.map(row => pick(row, fields));
        arrB = arrB.map(row => pick(row, fields));
    }
    if (ignoreOrder) {
        arrA = sortBy(arrA, JSON.stringify);
        arrB = sortBy(arrB, JSON.stringify);
    }
    const equal = isEqual(arrA, arrB);

    if (!equal && showDiff) {
        const aNotInB = differenceWith(arrA, arrB, isEqual);
        const bNotInA = differenceWith(arrB, arrA, isEqual);
        console.error('❌ CSV not same!');
        if (aNotInB.length) {
            console.error('in baseline not in output:', aNotInB);
        }
        if (bNotInA.length) {
            console.error('in output not in baseline:', bNotInA);
        }
    }
    return equal;
}

/**
 * detect ecoding of csv files
 */
export function detectFileBom(filePath) {
    const buf = fs.readFileSync(filePath);
    if (buf.length >= 3 && buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF) {
        return 'utf-8-bom';
    }
    if (buf.length >= 2 && buf[0] === 0xFE && buf[1] === 0xFF) {
        return 'utf-16-be';
    }
    if (buf.length >= 2 && buf[0] === 0xFF && buf[1] === 0xFE) {
        return 'utf-16-le';
    }
    return 'utf-8-no-bom';
}