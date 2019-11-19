const coingame: {
    comps: {
        nav: {
            init: (params: any) => void;
            show: () => void;
            hide: () => void;
        };
    };
    checkComponents(params: any): void;
    sys: {
        init: (data, override?) => void;
        updateLanguage: (lang: string) => void;
        config: {
            [key: string]: string;
        };
    };
    account: {
        checkLogged: () => boolean;
        login: () => void;
        app: () => void;
        logout: () => void;
        home(): () => void;
    };
    pay: {
        /*
         * @param {string} type 支付类型 0:提现, 1:充值
         * @param {string} channel 支付渠道
         * @param {object} data 支付数据
         * @param {function} success 成功回调
         * @param {function} error 失败回调
         * @param {function} complete 完成回调
         */
        request: ({ type, channel, data, success, error, complete }) => void;
    };
};

export default coingame;
