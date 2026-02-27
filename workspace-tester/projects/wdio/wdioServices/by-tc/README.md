# By-tc WDIO service

This service provide test case level execution control, allowing you to run specific test cases and retry failed ones.

By default, WDIO only supports control at the specFile level. For instance, you can use the `--spec` CLI argument to specify which specFiles you want to run. If any of these specFiles fail, WDIO will automatically rerun the entire failed specFiles even if only one out of ten test cases failed.

With this service, you have even more control over test case level execution.

## Quick start

```js
import ByTcService from './wdioServices/by-tc/index.js';
export const config = {
    services: [[ByTcService, {}]],
};
```

By default, this service will read file from `$cwd()}/.by-tc/input.json` and write to `$cwd()}/.by-tc/output.json`

If you want to specify the test cases that you want to run, please write content to the input file with correct format

Here is an example:

```json
{
    "specs/${specKind}/${folder}/${file}.spec.js": "ALL",
    "specs/${specKind}/${folder}/${file}.spec.js": ["[TC0001]", "[TC0002]", "full name of the it block"]
}
```

If you want to retry only on the failed cases, make sure you config the `specFileRetries` correctly as this service relies on it.

```js
export const config = {
    specFileRetries: 1, // change to the number you want.
};
```

## A sample of output file

```json
[
    {
        "specFile": "specs/infra-test/specFolder/b.spec.js",
        "startTime": "2023-08-04T07:28:45.367Z",
        "passed": [],
        "failed": ["[TC1102]"],
        "pending": [],
        "excluded": ["[TC1001]", "[TC1103]"],
        "finishTime": "2023-08-04T07:28:56.377Z"
    },
    {
        //...
    }
]
```

## What's behind

This service utilizes Jasmine's capability to selectively disable test cases.

It also includes a custom Jasmine reporter that records the execution status of test cases. Therefore, when the same specFile is executed again, it will know which test cases have failed and need to be retried.

See https://microstrategy.atlassian.net/wiki/spaces/TTAWC/pages/3833214811/By+TC+service+technical+Design for more.

## Test Cases

**Default**

```shell
HEADLESS=1 RETRY=1 npm run wdio-raw -- --specKind infra-test \
    --baseUrl "https://hanw15949-t.labs.microstrategy.com:8443/MicroStrategyLibrary/" --tcList TC1103,TC1104
```

**Custom outputFilePath**

```shell
HEADLESS=1 RETRY=1 npm run wdio-raw -- --specKind infra-test \
    --baseUrl "https://hanw15949-t.labs.microstrategy.com:8443/MicroStrategyLibrary/" --tcList TC1103,TC1104 \
    --byTC.outputFilePath "./.by-tc/test.json"
```

**Test input For ALL and TC id**

manual
