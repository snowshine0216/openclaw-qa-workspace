# Run by test cases and specFiles

## No test case and no spec files

### no tcList, featureList, xml and spec

```sh
BASE_URL=https://hanw15949-t.labs.microstrategy.com:8443/MicroStrategyLibrary/
HEADLESS=1 npm run infra -- --baseUrl=$BASE_URL
```

## Run with --tcList

### single test case

```sh
BASE_URL=https://hanw15949-t.labs.microstrategy.com:8443/MicroStrategyLibrary/
HEADLESS=1 npm run infra -- --baseUrl=$BASE_URL --tcList TC1105
```

### multi test cases in one single specFile

```sh
BASE_URL=https://hanw15949-t.labs.microstrategy.com:8443/MicroStrategyLibrary/
HEADLESS=1 npm run infra -- --baseUrl=$BASE_URL --tcList TC1001,TC1002
```

### multi test cases in multiple specFiles

```sh
BASE_URL=https://hanw15949-t.labs.microstrategy.com:8443/MicroStrategyLibrary/
HEADLESS=1 npm run infra -- --baseUrl=$BASE_URL --tcList " TC1001, TC1105 "
```

### none of test cases exist

```sh
BASE_URL=https://hanw15949-t.labs.microstrategy.com:8443/MicroStrategyLibrary/
HEADLESS=1 npm run infra -- --baseUrl=$BASE_URL --tcList TC99998,TC99999
```

### some of test cases exist

```sh
BASE_URL=https://hanw15949-t.labs.microstrategy.com:8443/MicroStrategyLibrary/
HEADLESS=1 npm run infra -- --baseUrl=$BASE_URL --tcList TC1001,TC99999
```

## Run with --featureList

### single feature

```sh
BASE_URL=https://hanw15949-t.labs.microstrategy.com:8443/MicroStrategyLibrary/
HEADLESS=1 npm run infra -- --baseUrl=$BASE_URL --featureList "feature2"
```

### single feature that contains subfeatures

```sh
BASE_URL=https://hanw15949-t.labs.microstrategy.com:8443/MicroStrategyLibrary/
HEADLESS=1 npm run infra -- --baseUrl=$BASE_URL --featureList "feature1"
```

### multi features

```sh
BASE_URL=https://hanw15949-t.labs.microstrategy.com:8443/MicroStrategyLibrary/
HEADLESS=1 npm run infra -- --baseUrl=$BASE_URL --featureList "feature12, feature2"
```

### all features

```sh
BASE_URL=https://hanw15949-t.labs.microstrategy.com:8443/MicroStrategyLibrary/
HEADLESS=1 npm run infra -- --baseUrl=$BASE_URL --featureList "*"
```

### none of features exist

```sh
BASE_URL=https://hanw15949-t.labs.microstrategy.com:8443/MicroStrategyLibrary/
HEADLESS=1 npm run infra -- --baseUrl=$BASE_URL --featureList "featurexxx, featureyyy"
```

### some of features exist

```sh
BASE_URL=https://hanw15949-t.labs.microstrategy.com:8443/MicroStrategyLibrary/
HEADLESS=1 npm run infra -- --baseUrl=$BASE_URL --featureList "featurexxx, feature11"
```

## Run with --xml

### fully correct xml

```sh
BASE_URL=https://hanw15949-t.labs.microstrategy.com:8443/MicroStrategyLibrary/
HEADLESS=1 npm run infra -- --baseUrl=$BASE_URL --xml specs/infra-test/config/test.config.xml
```

### partially correct xml

```sh
BASE_URL=https://hanw15949-t.labs.microstrategy.com:8443/MicroStrategyLibrary/
HEADLESS=1 npm run infra -- --baseUrl=$BASE_URL --xml specs/infra-test/config/test1.config.xml
```

### xml that contains only one specFile

```sh
BASE_URL=https://hanw15949-t.labs.microstrategy.com:8443/MicroStrategyLibrary/
HEADLESS=1 npm run infra -- --baseUrl=$BASE_URL --xml specs/infra-test/config/test2.config.xml
```

## Run by specFile

### using built-in --spec, not recommended

```sh
BASE_URL=https://hanw15949-t.labs.microstrategy.com:8443/MicroStrategyLibrary/
HEADLESS=1 npm run infra -- --baseUrl=$BASE_URL --spec specs/infra-test/specFolder/a.spec.js
```

### using glob pattern with --glob

> Please to be noticed that you need to embrace the glob pattern with quotations
>
> So that it is not be interpreted by shell itself. Instead it should be interpreted by nodejs.
>
> Learn more about glob: see https://github.com/isaacs/node-glob#glob-primer

```sh
BASE_URL=https://hanw15949-t.labs.microstrategy.com:8443/MicroStrategyLibrary/
HEADLESS=1 npm run infra -- --baseUrl=$BASE_URL --glob 'specs/infra-test/*/*.spec.js'
```

```sh
BASE_URL=https://hanw15949-t.labs.microstrategy.com:8443/MicroStrategyLibrary/
HEADLESS=1 npm run infra -- --baseUrl=$BASE_URL --glob 'specs/infra-test/*/{a,b}.spec.js'
```

## Run by suite

### using built-in --suite, not recommended

```sh
BASE_URL=https://hanw15949-t.labs.microstrategy.com:8443/MicroStrategyLibrary/
HEADLESS=1 npm run infra -- --baseUrl=$BASE_URL --suite infra
```
