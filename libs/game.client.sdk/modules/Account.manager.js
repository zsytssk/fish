// 账户管理
export default class AccountManager {
    constructor() {
        /*
         * 登录类型
         * 0: 网页
         * 1: 客户端 - 游客
         * 2: 客户端 - 平台
         * 3: 客户端 - ios
         * 4: 客户端 - 安卓
         * 5: 客户端 - 微信
         * 6: 客户端 - 渠道 1:普通渠道登录 2:渠道QQ登录 3:渠道微信登录 4:渠道游客登录
         */ 
        this._type = {
            GUEST: 1, 
            PLATFORM: 2,
            IOS: 3,
            ANDROID: 4,
            WECHAT: 5,
            CHANNEL: 6
        };
    }

    // 获取登录类型
    get type() {
        return this._type;
    }

    // 检查登录态
    checkLogged() {
        let logged = false;
    	const code = coingame.tools.getQueryParams('code');

        if (code !== '') {
            logged = true;

            localStorage.setItem('code', code);

            // 不跳转替换url地址
            window.history.replaceState(null, null, '/');
        } else {
        	localStorage.removeItem('code');

            // 检测token
            const token = localStorage.getItem('token') || coingame.cookie.get('token');;

            if (token === null && !location.search.includes('preflight')) {
                const href = coingame.sys.config.loginUrl || localStorage.getItem('loginUrl');

                if (typeof href === 'string') {
        			location.replace(href + '&preflight=true');
                }
            } else {
                logged = true;
            }
        }

        return logged;
    }
    
    /*
     * 登录请求
     * @param {string} type 类型
     * @param {object} data 数据
     * @param {function} success 成功回调
     * @param {function} error 失败回调
     * @param {function} complete 完成回调
     */
    login({
        type = 0,
        data = {},
        success,
        error,
        complete
    } = {}) {
        switch(type) {
    		case this._type.GUEST: 
                break;
            case this._type.PLATFORM: 
                break;
            case this._type.IOS: 
                break;
            case this._type.ANDROID: 
                break;
            case this._type.WECHAT: 
                break;
            case this._type.CHANNEL: 
                break;
            default:
                const href = coingame.sys.config.loginUrl || localStorage.getItem('loginUrl');

                if (typeof href === 'string') {
                	 location.href = href;
                }
    	}
    }

    /*
     * 登出
     * @param {string} type 类型
     * @param {object} data 数据
     * @param {function} success 成功回调
     * @param {function} error 失败回调
     * @param {function} complete 完成回调
     */
    logout({
        type = '',
        data = {},
        success,
        error,
        complete
    } = {}) {
        switch(type) {
            case this._type.GUEST: 
                break;
            case this._type.PLATFORM: 
                break;
            case this._type.IOS: 
                break;
            case this._type.ANDROID: 
                break;
            case this._type.WECHAT: 
                break;
            case this._type.CHANNEL: 
                break;
            default:
                const href = coingame.sys.config.logoutUrl || localStorage.getItem('logoutUrl');

                if (typeof href === 'string') {
                    localStorage.clear();

                    location.href = href;
                }
        }
    }

    // 首页
    home() {
        const href = coingame.sys.config.homeUrl || localStorage.getItem('homeUrl');
        location.href = href;
    }

    // 应用
    app() {
        const href = coingame.sys.config.androidDownloadUrl || localStorage.getItem('androidDownloadUrl');
        location.href = href;
    }
}