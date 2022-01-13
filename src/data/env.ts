declare const ENV: 'DEV' | 'TEST' | 'PROD';

export const env = ENV;

export function isProd() {
    return true;
    return env === 'PROD';
}
