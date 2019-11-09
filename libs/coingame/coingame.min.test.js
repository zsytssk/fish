const coingame = {
    sys: {
        init: (data, override) => {
            data.success();
        },
        config: {
            host: 'testing-bitfish.cointest.link',
            api: 'testing-bitfish-api.asdy88.com',
        },
    },
    account: {
        checkLogged: () => {
            return true;
        },
    },
};

export default coingame;
