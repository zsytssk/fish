const coingame = {
    sys: {
        init: (data, override) => {
            data.success();
        },
    },
    account: {
        checkLogged: () => {
            return true;
        },
    },
};

export default coingame;
