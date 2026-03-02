This directory contains how to run library web automation with WebDriver IO.

## Prerequisite

**1 Install Node.js from https://nodejs.org**

version >= v16.15.1

```sh
node -v
```

**2 Install dependencies**

```sh
npm install
```

<details><summary>ERROR: This version of ChromeDriver only supports Chrome version xxx</summary>

In case your Chrome version does not match Chrome webdriver binary version.
You will see this error.

```txt
ERROR webdriver: Request failed with status 500 due to session not created: session not created: This version of ChromeDriver only supports Chrome version 108
Current browser version is 114.0.5735.198 with binary path /Applications/Google Chrome.app/Contents/MacOS/Google Chrome
```

Run the following command to install the correct version.

```sh
npm run update-chromedriver
```

WebDriverIO requires corresponding webdriver binary to interact with browser to run e2e tests. For example, if we use Chrome, then we should make sure the correct version of Chrome webdriver binary is installed, which means the version of your local Chrome browser should match the version of Chrome webdriver binary.

Note: npm package `chromedriver` is used to download chromedriver binary, but it self is only a nodejs package.

</details>

**3 Config ESLint/Prettier extensions in VS code**

It is highly recommended that you use VS code and install/config ESLint/Prettier extensions to provide better developer experience.

> -   Extension Name: ESLint
> -   Config VS Code to auto fix issues, see more at the configuration of ESLint extension
> -   Extension Name: Prettier - Code formatter
> -   Config VS Code to use prettier as the default formatter, see more at the configuration of ESLint extension

## Quick start

### specFile Folder structure

We organized our test scripts, aka specFiles by hierarchies: `wdio/specs/[test category]/[feature name]/xxx.spec.js`.

Test category is primarily used to differentiate the testing purpose, such as pre-checkin test/regression test/performance test etc. It is necessary to specify the test category using the `--speckind` parameter, such as `--speckind regression`, then we'll search in the specified test category folder to pick up spec files and test cases to execute. If not defined, the default one is regression.

We can define shortcuts or aliases for different test category folders in the package.json file. This way, during runtime, you only need to enter npm run followed by the defined shortcut to run tests in specific test categories. To view all the scripts that are predefined, please see the scripts section of the `package.json` file.

Each test category folder maintains its own xml config files and feature mapping table. These are used to pick up test cases for execution such `--xml specs/demo/config/Bookmark.config.xml` OR `--featureList Bookmark`

### Run by xml config file

```sh
npm run wdio -- --baseUrl=https://hanw15949-t.labs.microstrategy.com:8443/MicroStrategyLibrary/  --params.credentials。username=tester_auto --xml specs/demo/config/Bookmark.config.xml
```

### Run by features

```sh
npm run wdio -- --baseUrl=https://hanw15949-t.labs.microstrategy.com:8443/MicroStrategyLibrary/ --params.credentials.username=tester_auto  --featureList "Bookmark"
```

### Run by spec files

```sh
npm run wdio -- --baseUrl=https://hanw15949-t.labs.microstrategy.com:8443/MicroStrategyLibrary/  --params.credentials.username=tester_auto  --spec 'specs/demo/Bookmark/sample_Bookmark.spec.js'
# If you need to run multiple specFiles, use --glob 'specs/demo/*/{a,b}.spec.js' instead
```

### Run by TC

```sh
npm run wdio -- --baseUrl=https://hanw15949-t.labs.microstrategy.com:8443/MicroStrategyLibrary/  --params.credentials.username=tester_auto  --tcList=TC56656
```

## Check result

### Check test summary in console

Search 'test summary' in the console, it will show detailed test result

### View Spectre Reports:

Check the console output for spectre report URL.

There should be a INFO log for `service/spectre`.

### Check with Allure Reports:

```sh
npm run allure-report
```

## Migrate page objects from Protractor to WebdriverIO

We have developed automation scripts to help everyone migrate library web page objects from Protractor to WebdriverIO

> -   ./scripts/appendFileExtension.js assisting everyone in migrating from ES6 to ESM's new standard.
> -   ./scripts/migratePageObject.js assisting everyone in migrating certain syntaxes in the page object.

```sh
node ./scripts/appendFileExtension.js
node ./scripts/migratePageObject.js
sh ./interactive.sh
```

You can view more syntaxes diffences of page object migration in https://microstrategy.atlassian.net/wiki/spaces/TTAWC/pages/3853523647/Page+Objects+Migration+from+Protractor+to+Webdriver+IO

## More details on mstr WDIO infrastructure

Please refer to this documentation

https://microstrategy.atlassian.net/wiki/spaces/TTAWC/pages/3833824829/End+to+End+WebdriverIO+infrastructure+For+Web
