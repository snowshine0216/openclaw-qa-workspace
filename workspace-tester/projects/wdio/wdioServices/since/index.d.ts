/* eslint-disable no-var */
type SinceFn = (input: string | (() => string)) => {
    expect: ExpectWebdriverIO.Expect;
};

declare var since: SinceFn;

declare namespace NodeJS {
    interface Global {
        since: SinceFn;
    }
}
