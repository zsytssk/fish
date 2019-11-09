declare const ENV: 'DEV' | 'TEST' | 'PROD';

export const state = {} as {
    origin: string;
    host: string;
    env: typeof ENV;
};

state.env = ENV;
if (ENV === 'DEV') {
    state.origin = 'https://testing-bitfish.cointest.link';
    state.host = 'testing-bitfish.cointest.link';
} else if (ENV === 'TEST') {
    origin = location.origin;
} else if (ENV === 'PROD') {
    origin = location.origin;
}
