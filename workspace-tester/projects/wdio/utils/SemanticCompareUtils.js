import axios from 'axios';

async function compareSemantic({compare_json, model, strictness, thresholds, inputprompt}) {
    const url = 'http://10.23.36.28:5000/semantic-compare';
    const data = {
            compare_json: compare_json,
            model: model,
            thresholds: thresholds,
            strictness: strictness,
            inputprompt: inputprompt};
    
    try {
        // console.log("post data: " + JSON.stringify(data)); // Use JSON.stringify to log the data object
        const res = await axios.post(url, data, {headers: {'Content-Type': 'application/json'}}); 
        return res.data['result']; // Return PASS/FAIL
    } catch (error) {
        console.log('Error making API request:', error.message);
        return null;
    }

}

/**
 * Compares Semantic similarity/correlation between a output object(topics) and a input object(e.g. dataset objects).
 * @param {JSON object} options.compare_json - It should be json like {'input': 'xxx', 'output': 'xxx'}
 * @param {string} [options.model='sentence-t5-large'] - The model used for semantic comparison. Following models can be used:'sentence-t5-large','all-mpnet-base-v2', 'all-MiniLM-L6-v2', 'paraphrase-MiniLM-L6-v2', 'stsb-roberta-large', 'paraphrase-multilingual-MiniLM-L12-v2'
 * @param {string} [options.strictness='simple'] - The fuzzy comparison model. Following models can be used: strict, simple
 * @param {number array} [options.thresholds=[0.8,0.8,0.8]] - The Semantic similarity/correlation threshold above which answers are considered a match.
 * @param {string} [options.inputprompt] - Sometimes need to use chatgpt to do the semantic comparison, so please customize the input prompt as needed.
 * @returns {boolean} [matchRes] - The result of the semantic comparison. It will return true if the semantic similarity/correlation is above the threshold, otherwise it will return false.
 */
export default async function compareWithSemanticComparison({compare_json, model='sentence-t5-large', strictness='simple', thresholds, inputprompt}) {
    //print "call this function to do semantic comparison"
    var matchRes = false;

    // Check if compare_json is a JSON object
    try {
        JSON.stringify(compare_json);
    } catch (e) {
        console.log('compare_json is not a JSON object');
        return false;
    }

    // Check if compare_json is not empty
    if (!compare_json || Object.keys(compare_json).length === 0){
        console.log('compare_json is empty');
        return false;
    }

    // Check if the compare_json contains the keys "input" and "output"
    if (!compare_json.hasOwnProperty('input') || !compare_json.hasOwnProperty('output')) {
        console.log('compare_json does not contain the keys "input" or "output"');
        return false;
    }

    
    // Check if thresholds is provided and not null
    if (!thresholds) {
        thresholds =  [0.8, 0.8, 0.8];
    }
    
    // Check if A is an array and has exactly 3 elements
    if (!Array.isArray(thresholds) || thresholds.length !== 3) {
        console.log('thresholds is not an array or does not have exactly 3 elements');
        return false;
    }
    
    // Check if each element in the array is a number between 0 and 1
    for (let i = 0; i < thresholds.length; i++) {
        if (typeof thresholds[i] !== 'number' || thresholds[i] < 0 || thresholds[i] > 1) {
            console.log('thresholds contains an element that is not a number between 0 and 1');
            return false;
        }
    }

    if(!inputprompt){
            inputprompt = "Please accurately evaluate semantic correlation or similarity between the given input object and output object, and ONLY RETURN THE EVALUATION SCORE NUMBER.";
    }
        
    await compareSemantic({compare_json: JSON.stringify(compare_json), model:model, strictness:strictness, thresholds, inputprompt:inputprompt}).then(function (result) {
        console.log('\n***compare result: ' + result + '***\n');
            if (result === 'PASS') {
                matchRes = true;
            }
        });      

    return matchRes;
}
