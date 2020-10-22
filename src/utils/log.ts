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

export let log: typeof console.log = console.log;
export let debug: typeof console.warn = console.warn;
export let error: typeof console.error = console.error;
setTimeout(() => {
    log = createLog();
    debug = createLog('debug');
    error = createLog('error');
}, 0);
