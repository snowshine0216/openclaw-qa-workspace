import axios from 'axios';

async function compareSimilarity({ baseline, output, model, threshold }) {
    const url = 'http://10.23.39.2:5000/compare-similarity';
    const data = {
        baseline: baseline,
        output: output,
        library: {
            name: 'sentence-transformers',
            model: model,
            threshold: threshold,
        },
    };

    try {
        // console.log("post data: " + JSON.stringify(data)); // Use JSON.stringify to log the data object
        const res = await axios.post(url, data, { headers: { 'Content-Type': 'application/json' } }); // Use await to get the resolved value from the Promise
        return res.data; // No need to parse as JSON, as response.data should already be parsed
    } catch (error) {
        console.log('Error making API request:', error.message);
        return null;
    }
}

/**
 * Compares the latest answer from an AI chatbot with a baseline answer using textual similarity.
 * @param {Object} options - An object containing the following options:
 * @param {string} options.baselines - The baseline answer. should be json like {'result': 'xxx', 'result_1': 'xxx'}
 * @param {string} options.output - The output in chatbot.
 * @param {string} [options.model='sentence-t5-large'] - The model used for textual similarity comparison. Following models can be used: sentence-t5-large, all-mpnet-base-v2, paraphrase-multilingual-MiniLM-L12-v2 (used for I18n tests)
 * @param {number} [options.threshold=0.9] - The similarity threshold above which answers are considered a match.
 * @returns {Promise<void>} - Resolves when the comparison is complete.
 */
export default async function compareAnswerWithBaselineBySimilarity({ baselines, output, model, threshold }) {
    var matchRes = false;
    let similarity = 0;
    if (Object.keys(baselines).length === 0) {
        console.log('Baseline is empty, skip similarity comparison');
        return matchRes;
    } else {
        for (var key in baselines) {
            if (baselines[key] === output) {
                matchRes = true;
            } else {
                await compareSimilarity({ baseline: baselines[key], output, model, threshold }).then(function (result) {
                    // Logger.logActionMessage(JSON.stringify(result));
                    // Logger.logActionMessage('\n***compare score: ' + result['similarity'] + '***\n');
                    console.log('\n***compare score: ' + result['similarity'] + '***\n');
                    similarity = result['similarity'];
                    if (result['result'] === 'PASS') {
                        matchRes = true;
                    }
                });
            }
            if (matchRes) {
                break;
            }
        }
    }
    // return [matchRes, result['similarity']];
    return { matchRes, similarity };
}
