import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let resultData = [];
let generateResultData = {};

export default function featureData(rawData, actionList) {
    //rawData = rawData.dossier;
    //rawData.forEach(elem => {console.log(elem)});
    // the first element will always be app render and it only shows once
    let index = 0;
    console.log(actionList);
    //console.log('Start to process performance data.');
    actionList.forEach((action) => {
        console.log(action);
        let actionObj = {};
        actionObj.name = action;
        actionObj.dataAPI = { name: actionObj.name + ' - API' };
        actionObj.render = { name: actionObj.name + ' - Render' };
        actionObj.duration = 0;
        actionObj.E2EDuration = 0;
        // while (rawData[index].name === 'buildBoxLayout' || rawData[index].name === 'bookmark-get-list' || rawData[index].name.includes('applyGroupTree') || rawData[index].name.includes('dossier-vis-filter-render')){
        //     index++;
        //     console.log('Skip buildBoxLayout grouptree and getbookmarklist');
        // }
        if (action.includes('Load Library')) {
            actionObj.render.duration = 0;
            while (rawData[index].name !== 'library-data-request') {
                index++;
                console.log('Library1:' + index);
            }
            actionObj.dataAPI.duration = rawData[index].duration;
            index++;
            console.log('Library2:' + index);
            while (rawData[index].name !== 'library-list-render') {
                index++;
                console.log('Library3:' + index);
            }
            while (rawData[index] && rawData[index].name === 'library-list-render') {
                actionObj.render.duration += rawData[index].duration;
                index++;
                console.log('Library4:' + index);
            }
            actionObj.duration = actionObj.render.duration + actionObj.dataAPI.duration;
            actionObj.E2EDuration = actionObj.duration;
            console.log(actionObj.duration);
        } else if (
            action.includes('Execute Report') ||
            action.includes('Reset') ||
            action.includes('Link to') ||
            action.includes('Back to') ||
            action.includes('Execute Dashboard')
        ) {
            while (!rawData[index].name.includes('dossier-execution')) {
                index++;
                console.log('Execute1:' + index);
            }
            actionObj.dataAPI.duration = rawData[index].duration;
            let start = rawData[index].startTime;
            while (!rawData[index].name.includes('mojo-view-render')) {
                index++;
                console.log('Execute2:' + index);
            }
            actionObj.render.duration = rawData[index].duration;
            actionObj.duration = rawData[index].startTime + rawData[index].duration - start;
            console.log(actionObj.duration);
            index++;
            while (!rawData[index].name.includes('mojo-objects-render')) {
                index++;
                console.log('Execute3:' + index);
            }
            actionObj.E2EDuration = rawData[index].startTime + rawData[index].duration - start;
        } else if (action.includes('Execute RSD') || action.includes('Re-set RSD')) {
            while (!rawData[index].name.includes('dossier-execution')) {
                index++;
                console.log('RSDExecute1:' + index);
            }
            actionObj.dataAPI.duration = rawData[index].duration;
            let start = rawData[index].startTime;
            while (!rawData[index].name.includes('mojo-view-render')) {
                index++;
                console.log('RSDExecute2:' + index);
            }
            actionObj.render.duration = rawData[index].duration;
            actionObj.duration = rawData[index].startTime + rawData[index].duration - start;
            console.log(actionObj.duration);
            actionObj.E2EDuration = actionObj.duration;
        } else if (action.includes('Apply link with dossier')) {
            while (!rawData[index].name.includes('dossier-execution')) {
                index++;
                console.log('Execute1:' + index);
            }
            actionObj.dataAPI.duration = rawData[index].duration;
            let start = rawData[index].startTime;
            while (!rawData[index].name.includes('mojo-view-render')) {
                index++;
                console.log('Execute2:' + index);
            }
            actionObj.render.duration = rawData[index].duration;
            actionObj.duration = rawData[index].startTime + rawData[index].duration - start;
            index++;
            console.log(actionObj.duration);
            while (!rawData[index].name.includes('mojo-objects-render')) {
                index++;
                console.log('Execute3:' + index);
            }
            actionObj.E2EDuration = rawData[index].startTime + rawData[index].duration - start;
        } else if (action.includes('Open embedding dossier')) {
            while (!rawData[index].name.includes('dossier-execution')) {
                index++;
                console.log('Embedding1:' + index);
            }
            actionObj.dataAPI.duration = rawData[index].duration;
            while (!rawData[index].name.includes('mojo-view-render')) {
                index++;
                console.log('Embedding2:' + index);
            }
            actionObj.render.duration = rawData[index].duration;
            actionObj.duration = rawData[index].startTime + rawData[index].duration;
            index++;
            console.log(actionObj.duration);
            while (!rawData[index].name.includes('mojo-objects-render')) {
                index++;
                console.log('Embedding3:' + index);
            }
            actionObj.E2EDuration = rawData[index].startTime + rawData[index].duration;
        } else if (action.includes('Visualization as Filter') || action.includes('Visualization Action')) {
            while (!rawData[index].name.includes('mojo-viz-filter-render')) {
                index++;
                console.log('Filter1:' + index);
            }
            actionObj.duration = rawData[index].duration;
            index++;
            console.log('Filter2:' + index);
            actionObj.dataAPI.duration = actionObj.duration;
            actionObj.render.duration = 0;
            actionObj.E2EDuration = actionObj.duration;
            console.log(actionObj.duration);
        } else if (action.includes('Export to PDF') || action.includes('Download mstr file')) {
            actionObj.duration = rawData[index].duration;
            index++;
            console.log('Export1:' + index);
            actionObj.dataAPI.duration = actionObj.duration;
            actionObj.render.duration = 0;
            actionObj.E2EDuration = actionObj.duration;
            console.log(actionObj.duration);
        } else if (action.includes('BM') && !action.includes('Share')) {
            if (action.includes('Apply')) {
                while (rawData[index].name !== 'bookmark-apply') {
                    index++;
                    console.log('BM1:' + index);
                }
                actionObj.dataAPI.duration = rawData[index].duration;
                let start = rawData[index].startTime;
                index++;
                console.log('BM2:' + index);
                actionObj.dataAPI.duration += rawData[index].duration;
                while (!rawData[index].name.includes('mojo-view-render')) {
                    index++;
                    console.log('BM3:' + index);
                }
                actionObj.render.duration = rawData[index].duration;
                actionObj.duration = rawData[index].startTime + rawData[index].duration - start;
                console.log(actionObj.duration);
                while (!rawData[index].name.includes('mojo-objects-render')) {
                    index++;
                    console.log('BM4:' + index);
                }
                actionObj.E2EDuration = rawData[index].startTime + rawData[index].duration - start;
            } else {
                //console.log('Process bookmark action');
                while (!rawData[index].name.includes('bookmark') || rawData[index].name === 'bookmark-get-list') {
                    index++;
                    console.log('BM5:' + index);
                }
                actionObj.duration = rawData[index].duration;
                actionObj.dataAPI.duration = actionObj.duration;
                actionObj.render.duration = 0;
                actionObj.E2EDuration = actionObj.duration;
                console.log(actionObj.duration);
            }
            index++;
            console.log('BM6:' + index);
        } else if (action.includes('ShareBM')) {
            if (action.includes('Apply')) {
                while (rawData[index].name !== 'bookmark-apply') {
                    index++;
                    console.log('shareBM1:' + index);
                }
                actionObj.dataAPI.duration = rawData[index].duration;
                let start = rawData[index].startTime;
                index++;
                console.log('shareBM2:' + index);
                actionObj.dataAPI.duration += rawData[index].duration;
                while (!rawData[index].name.includes('mojo-view-render')) {
                    index++;
                    console.log('shareBM3:' + index);
                }
                actionObj.render.duration = rawData[index].duration;
                actionObj.duration = rawData[index].startTime + rawData[index].duration - start;
                console.log(actionObj.duration);
                while (!rawData[index].name.includes('mojo-objects-render')) {
                    index++;
                    console.log('shareBM4:' + index);
                }
                actionObj.E2EDuration = rawData[index].startTime + rawData[index].duration - start;
            } else if (action.includes('Add')) {
                index = 0;
                while (rawData[index].name !== 'bookmark-add-references') {
                    index++;
                    console.log('shareBM4:' + index);
                }
                actionObj.duration = rawData[index].duration;
                actionObj.dataAPI.duration = actionObj.duration;
                actionObj.render.duration = 0;
                actionObj.E2EDuration = actionObj.duration;
                console.log(actionObj.duration);
            } else if (action.includes('Delete')) {
                while (rawData[index].name !== 'bookmark-delete') {
                    index++;
                    console.log('shareBM5:' + index);
                }
                actionObj.duration = rawData[index].duration;
                actionObj.dataAPI.duration = actionObj.duration;
                actionObj.render.duration = 0;
                actionObj.E2EDuration = actionObj.duration;
                console.log(actionObj.duration);
            } else if (action.includes('Run')) {
                while (!rawData[index].name.includes('dossier-execution')) {
                    index++;
                    console.log('shareBM6:' + index);
                }
                actionObj.dataAPI.duration = rawData[index].duration;
                let start = rawData[index].startTime;
                index++;
                console.log('shareBM7:' + index);
                actionObj.dataAPI.duration += rawData[index].duration;
                while (!rawData[index].name.includes('mojo-view-render')) {
                    index++;
                    console.log('shareBM8:' + index);
                }
                actionObj.render.duration = rawData[index].duration;
                actionObj.duration = rawData[index].startTime + rawData[index].duration - start;
                console.log(actionObj.duration);
                while (!rawData[index].name.includes('mojo-objects-render')) {
                    index++;
                    console.log('shareBM9:' + index);
                }
                actionObj.E2EDuration = rawData[index].startTime + rawData[index].duration - start;
            } else if (action.includes('Remove')) {
                while (rawData[index].name !== 'bookmark-remove-hidden') {
                    index++;
                    console.log('shareBM9:' + index);
                }
                actionObj.duration = rawData[index].duration;
                actionObj.dataAPI.duration = actionObj.duration;
                actionObj.render.duration = 0;
                actionObj.E2EDuration = actionObj.duration;
                console.log(actionObj.duration);
            }
            index++;
            console.log('shareBM10:' + index);
        } else if (action.includes('Load Prompt')) {
            while (!rawData[index].name.includes('prompt-get-promptEditor')) {
                index++;
                console.log('Prompt1:' + index);
            }
            actionObj.duration = rawData[index].duration;
            actionObj.dataAPI.duration = actionObj.duration;
            actionObj.render.duration = 0;
            actionObj.E2EDuration = actionObj.duration;
            console.log(actionObj.duration);
            index++;
            console.log('Prompt2:' + index);
        } else if (action.includes('Apply link with prompt dossier')) {
            while (!rawData[index].name.includes('prompt-get-promptEditor')) {
                index++;
                console.log('Prompt1:' + index);
            }
            actionObj.duration = rawData[index].duration + rawData[index].startTime;
            actionObj.dataAPI.duration = actionObj.duration;
            actionObj.render.duration = 0;
            actionObj.E2EDuration = actionObj.duration;
            console.log(actionObj.duration);
            index++;
            console.log('Prompt2:' + index);
        } else if (action.includes('Load Reprompt')) {
            while (!rawData[index].name.includes('prompt-reprompt')) {
                index++;
                console.log('Prompt3:' + index);
            }
            actionObj.duration = rawData[index].duration;
            actionObj.dataAPI.duration = actionObj.duration;
            actionObj.render.duration = 0;
            actionObj.E2EDuration = actionObj.duration;
            console.log(actionObj.duration);
            index++;
            console.log('Prompt4:' + index);
        } else if (action.includes('Answer Prompt')) {
            while (!rawData[index].name.includes('prompt-applyAnswer')) {
                index++;
                console.log('Prompt5:' + index);
            }
            actionObj.dataAPI.duration = rawData[index].duration;
            let start = rawData[index].startTime;
            while (!rawData[index].name.includes('mojo-view-render')) {
                index++;
                console.log('Prompt6:' + index);
            }
            actionObj.render.duration = rawData[index].duration;
            actionObj.duration = rawData[index].startTime + rawData[index].duration - start;
            console.log(actionObj.duration);
            while (!rawData[index].name.includes('mojo-objects-render')) {
                index++;
                console.log('Prompt7:' + index);
            }
            actionObj.E2EDuration = rawData[index].startTime + rawData[index].duration - start;
        } else if (action.includes('Login')) {
            actionObj.render.duration = 0;
            while (rawData[index]) {
                if (rawData[index].name === 'library-list-render') {
                    actionObj.duration = rawData[index].startTime + rawData[index].duration;
                    actionObj.render.duration += rawData[index].duration;
                    console.log('Login2:' + index);
                }
                index++;
                console.log('Login1:' + index);
            }
            actionObj.dataAPI.duration = actionObj.duration - actionObj.render.duration;
            actionObj.E2EDuration = actionObj.duration;
            console.log(actionObj.duration);
        } else if (action.includes('Logout')) {
            while (!rawData[index].name.includes('logout')) {
                index++;
                console.log('logout:' + index);
            }
            actionObj.duration = rawData[index].duration;
            actionObj.dataAPI.duration = actionObj.duration;
            actionObj.render.duration = 0;
            actionObj.E2EDuration = actionObj.duration;
            console.log(actionObj.duration);
            index++;
        } else if (action.includes('user list')) {
            while (!rawData[index].name.includes('group-get-flatted-user-list')) {
                index++;
                console.log('share:' + index);
            }
            actionObj.duration = rawData[index].duration;
            actionObj.dataAPI.duration = actionObj.duration;
            actionObj.render.duration = 0;
            actionObj.E2EDuration = actionObj.duration;
            console.log(actionObj.duration);
            index++;
        } else if (action.includes('Grouping and Favorite') || action.includes('Bundle') || action.includes('browser cache') || action.includes('Open embedding library')) {
            while (rawData[index].name !== 'library-list-render') {
                index++;
                console.log('group1:' + index);
            }
            while (rawData[index] && rawData[index].name === 'library-list-render') {
                actionObj.duration = rawData[index].startTime + rawData[index].duration;
                actionObj.render.duration += rawData[index].duration;
                index++;
                if (index === rawData.length) {
                    break;
                }
                console.log('group2:' + index);
            }
            actionObj.dataAPI.duration = actionObj.duration - actionObj.render.duration;
            actionObj.E2EDuration = actionObj.duration;
            console.log(actionObj.duration);
        } else if (action.includes('Get Timezone List')) {
            while (!rawData[index].name.includes('timezone-data-request')) {
                index++;
                console.log('timezone:' + index);
            }
            actionObj.duration = rawData[index].duration;
            actionObj.dataAPI.duration = actionObj.duration;
            actionObj.render.duration = 0;
            actionObj.E2EDuration = actionObj.duration;
            console.log(actionObj.duration);
            index++;
        } else if (action.includes('Subscription')) {
            while (!rawData[index].name.includes('subscription-get-list')) {
                index++;
                console.log('sub1:' + index);
            }
            let start = rawData[index].startTime;
            let end = rawData[index].startTime + rawData[index].duration;
            while (rawData[index].name.includes('subscription-get-list')) {
                let tmp = rawData[index].startTime + rawData[index].duration;
                if (tmp > end) {
                    end = tmp;
                }
                index++;
                console.log('sub2:' + index);
                if (index === rawData.length) {
                    break;
                }
            }
            actionObj.duration = end - start;
            actionObj.dataAPI.duration = actionObj.duration;
            actionObj.render.duration = 0;
            actionObj.E2EDuration = actionObj.duration;
            console.log(actionObj.duration);
            index++;
        } else if (action.includes('Open folder list')) {
            while (!rawData[index].name.includes('folder-items-request')) {
                index++;
                console.log('folder1:' + index);
            }
            actionObj.dataAPI.duration = rawData[index].duration;
            let end = rawData[index].startTime + rawData[index].duration;
            index++;
            console.log('folder2:' + index);
            while (!rawData[index].name.includes('folder-browsing-get-folder')) {
                index++;
                console.log('folder3:' + index);
            }
            actionObj.render.duration = rawData[index].duration + rawData[index].startTime - end;
            actionObj.duration = rawData[index].duration;
            actionObj.E2EDuration = actionObj.duration;
            console.log(actionObj.duration);
            index++;
        } else if (action.includes('Open content list')) {
            while (!rawData[index].name.includes('folder-items-request')) {
                index++;
                console.log('foldercontent1:' + index);
            }
            actionObj.dataAPI.duration = rawData[index].duration;
            let start = rawData[index].startTime;
            index++;
            console.log('foldercontent2:' + index);
            while (!rawData[index].name.includes('ag-grid-list-first-render')) {
                index++;
                console.log('foldercontent3:' + index);
            }
            actionObj.render.duration = rawData[index].duration;
            actionObj.duration = rawData[index].startTime + rawData[index].duration - start;
            actionObj.E2EDuration = actionObj.duration;
            console.log(actionObj.duration);
            index++;
        } else if (action.includes('Open content with cache')) {
            while (!rawData[index].name.includes('ag-grid-list-first-render')) {
                index++;
                console.log('foldercontent4:' + index);
            }
            actionObj.dataAPI.duration = 0;
            actionObj.render.duration = rawData[index].duration;
            actionObj.duration = actionObj.render.duration;
            actionObj.E2EDuration = actionObj.duration;
            console.log(actionObj.duration);
            index++;
        } else if (action.includes('rsd layout')) {
            let start = rawData[index].startTime;
            index++;
            console.log('rsd1:' + index);
            actionObj.dataAPI.duration = rawData[index].duration;
            index++;
            console.log('rsd2:' + index);
            actionObj.render.duration = rawData[index].duration;
            actionObj.duration = rawData[index].startTime + rawData[index].duration - start;
            console.log(actionObj.duration);
            actionObj.E2EDuration = actionObj.duration;
        } else {
            let start = rawData[index].startTime;
            index++;
            console.log('Other1:' + index);
            actionObj.dataAPI.duration = rawData[index].duration;
            index++;
            console.log('Other2:' + index);
            actionObj.render.duration = rawData[index].duration;
            actionObj.duration = rawData[index].startTime + rawData[index].duration - start;
            console.log(actionObj.duration);
            while (!rawData[index].name.includes('mojo-objects-render')) {
                index++;
                console.log('Other3:' + index);
            }
            actionObj.E2EDuration = rawData[index].startTime + rawData[index].duration - start;
        }
        console.log(actionObj.E2EDuration);
        resultData.push(actionObj);
    });
}

export function generateResult(fileName) {
    let filePath = path.join(__dirname, '../e2ePerfResults', 'PerfTest_' + Date.now() + '.json');
    generateResultData[fileName] = resultData;
    fs.writeFile(filePath, JSON.stringify(generateResultData), (err) => {
        if (err) {
            console.error('get error in write file', err);
            return false;
        }
        return true;
    });
    resultData = [];
    generateResultData = {};
}
