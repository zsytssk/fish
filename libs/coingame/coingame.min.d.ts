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
};

export default coingame;
