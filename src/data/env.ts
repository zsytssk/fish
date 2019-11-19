declare const ENV: 'DEV' | 'TEST' | 'PROD';

export const EnvState = {
    localTest: Laya.Utils.getQueryString('localTest'),
    origin: '',
    host: '',
    env: '' as typeof ENV,
};

EnvState.env = ENV;
if (ENV === 'DEV') {
    EnvState.origin = 'https://testing-bitfish.cointest.link';
    EnvState.host = 'testing-bitfish.cointest.link';
} else if (ENV === 'TEST') {
    origin = location.origin;
} else if (ENV === 'PROD') {
    origin = location.origin;
}
