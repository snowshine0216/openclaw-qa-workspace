type FnCompareScreenshot = import('./worker.js').FnCompareScreenshot;
type FnCompareImageWithBaseline = import('./worker.js').FnCompareImageWithBaseline;

declare namespace WebdriverIO {
    interface Browser {
        compareScreenshot: FnCompareScreenshot;
        compareImageWithBaseline: FnCompareImageWithBaseline;
    }
}

declare namespace ExpectWebdriverIO {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Matchers<R, T> {
        toMatchBaseline(): R;
    }
}
