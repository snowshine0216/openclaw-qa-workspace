# since

This service is a fork of this repo. https://github.com/avrelian/jasmine2-custom-message.
The usage of this service should be similar to the original fork.

The original fork is based on Jasmine 2, so we enhance it to support Jasmine 5 + TypeScript + AsyncExpect(which is the default expect in WDIO).

## Typescript support

Please include this file `./wdioServices/since` in your tsconfig.json.

## Test cases

```shell
HEADLESS=1 npm run infra -- \
    --baseUrl "https://hanw15949-t.labs.microstrategy.com:8443/MicroStrategyLibrary/" --tcList TC1101
```
