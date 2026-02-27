# Spectre WDIO Service

[Spectre](<(https://github.com/wearefriday/spectre)>) itself is an image comparison service that you can use to compare image with baseline to find UI issues.

You can use these two together to compare browser level or element level screenshot with baseline.

This service provide a custom WDIO command called `compareScreenshot` and a custom jasmine matcher called `toMatchBaseline`. In the `compareScreenshot` function, a screenshot is taken using the webdriver protocol and uploaded to the Spectre service. Spectre then compares this image with baseline and responds indicating whether the differences exceed the tolerance or not.

## Quick start

### Enable this service in wdio.config.ts

```javascript
import SpectreService from './wdioServices/spectre/index.js';
export const config = {
    services: [
        [
            SpectreService,
            {
                /** Whether to enable this service, default to true */
                enable: boolean,
                /** The spectre service base URL, such as http://10.23.33.4:3000 */
                url: string,
                /** The project name on spectre service */
                projectName: string,
                /** Whether to enable image comparison, default to true */
                enableDiff: boolean,
                /** The toleration on the difference with baseline*/
                tolerance: number,
            },
        ],
    ],
};
```

### What does this service offer

-   Added a custom WDIO command called `compareScreenshot` at `browser` level to compare screenshot differences with baseline.
-   Added a custom jasmine matcher called `toMatchBaseline` to be used with `compareScreenshot`

### Use Cases

**Take full screenshot and make assertion**

```javascript
const result = await browser.compareScreenshot('screenShotName', options);
await expect(result).toMatchBaseline();
```

**Take component level screenshot and make assertion**

```javascript
const resolvedElem = await ele;
const result = await browser.compareScreenshot('screenShotName', { element: resolvedElem, ...options });
await expect(result).toMatchBaseline();
```

**Custom toleration**

```javascript
const result = await browser.compareScreenshot('screenShotName', { tolerance: 0.1 });
await expect(result).toMatchBaseline();
```

## Typescript support

Please include this file `./wdioServices/spectre` in your tsconfig.json.

## Test cases

### Service enabled

```shell
HEADLESS=1 npm run infra -- \
    --baseUrl "https://hanw15949-t.labs.microstrategy.com:8443/MicroStrategyLibrary/" --tcList TC1102 \
    --spectre.enable=true --spectre.url="http://10.23.33.4:3000" \
    --spectre.projectName="Library E2E - Demo" --spectre.enableDiff=true
```

### Service disabled

```shell
HEADLESS=1 npm run infra -- \
    --baseUrl "https://hanw15949-t.labs.microstrategy.com:8443/MicroStrategyLibrary/" --tcList TC1102 \
    --spectre.enable=false
```

### Service enabled but diff disabled

```shell
HEADLESS=1 npm run infra -- \
    --baseUrl "https://hanw15949-t.labs.microstrategy.com:8443/MicroStrategyLibrary/" --tcList TC1102 \
    --spectre.enable=true --spectre.url="http://10.23.33.4:3000" \
    --spectre.projectName="Library E2E - Demo" --spectre.enableDiff=false
```
