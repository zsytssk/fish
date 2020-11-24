function loadLib(url: string): void;

type PlatformInfo = {
    isLogin: boolean;
    token: string;
    socket_url: string;
    lang: string;
    cdn: string;
};
declare const platform: {
    hideLoading(): void;
    login(): void;
    register(): void;
    logout(): void;
    getInfo(): PlatformInfo;
};
declare const bitgame: any;
