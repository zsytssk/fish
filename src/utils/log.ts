import { getParams } from './utils';

function createLog(type?: string) {
    if (!getParams('GodMode')) {
        // tslint:disable-next-line
        return () => {};
    }

    let log_fun = console[type];
    if (!log_fun) {
        log_fun = console.log;
    }
    return log_fun.bind(window.console);
}

export let log: typeof console.log = () => {};
export let debug: typeof console.warn = () => {};
export let error: typeof console.error = () => {};
setImmediate(() => {
    log = createLog();
    debug = createLog('debug');
    error = createLog('error');
});
// export const log: typeof console.log = console.log.bind(console);
// export const debug: typeof console.warn = console.warn.bind(console);
// export const error: typeof console.error = console.error.bind(console);
