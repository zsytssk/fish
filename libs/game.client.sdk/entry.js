///import '@babel/polyfill/noConflict';

// 工具 - HTTP请求
import Request from './utils/Request.js';
// 工具 - Cookie
import cookie from './utils/cookie.js';
// 工具 - 常用工具
import * as tools from './utils/tools.js';

// 模块 - 配置管理
import SystemManager from './modules/System.manager.js';
// 模块 - 账户管理
import AccountManager from './modules/Account.manager.js';
// 模块 - 支付管理
import PayManager from './modules/Pay.manager.js';
// 模块 - 加载管理
import LoaderManager from './modules/Loader.manager.js';
// 模块 - 加载管理
import ChannelManager from './modules/Channel.manager.js';

// 组件 - 导航栏
import Nav from './components/nav/nav.component.js';

class CoinGame {
    constructor() {
        // 版本号
        this.verson = '1.0.0';

        // 工具 - HTTP请求
        this.Request = Request;
        // 工具 - Cookie
        this.cookie = cookie;
        // 工具 - 常用工具
        this.tools = tools;

        // 模块 - 获取配置信息
        this.sys = new SystemManager();
        // 模块 - 账户管理
        this.account = new AccountManager();
        // 模块 - 支付管理
        this.pay = new PayManager();
        // 模块 - 加载管理
        this.loader = new LoaderManager();
        // 模块 - 渠道管理
        this.channel = new ChannelManager();

        // 组件
        this.comps = {
            // 导航栏
            nav: new Nav(),
        };

        // 获取终端环境
        this.sys.getBrowser();

        // 获取渠道信息
        this.sys.getChannel();
    }

    /*
     * 初始化
     * @param {array} files 加载文件列表
     * @param {function} success 成功回调
     * @param {function} error 失败回调
     */
    init({ files = [], components = [], success, error }) {
        if (!Array.isArray(files) || files.length === 0) {
            typeof error === 'function' && error();

            return;
        }

        this.sys.init({
            success: () => {
                // 检查登录态
                const logged = this.account.checkLogged();

                if (logged) {
                    (async () => {
                        try {
                            await this.loader.load({
                                files,
                                isPromise: true,
                            });

                            let { cdn = '' } = this.sys.config.cdn;
                            cdn === '' ? cdn : cdn + '/';

                            console.log('coingame init success');

                            typeof success === 'function' &&
                                success({
                                    cdn,
                                });
                        } catch (err) {
                            console.log('coingame init error:', err);

                            typeof error === 'function' && error();
                        }
                    })();
                }
            },
            error: () => {
                console.log('coingame init error:', err);

                typeof error === 'function' && error();
            },
        });
    }

    /*
     * 检测组件是否存在
     * @param {array} list 组件名称列表
     * @param {function} success 成功回调
     */
    checkComponents({ list = [], success }) {
        const result = {};

        for (let name of list) {
            result[name] = this.hasComponent(name);
        }

        if (typeof success === 'function') {
            success(result);
        }
    }

    /*
     * 批量加载组件
     * @param {array} components 组件列表配置
     */
    loadComponents(components) {
        for (let { name, params } of components) {
            if (
                this.hasComponent(name) &&
                typeof this.comps[name].init === 'function'
            ) {
                this.comps[name].init(params);
            }
        }
    }

    /*
     * 获取组件
     * @param {string} name 组件名称
     * @return {object} result
     */
    getComponent(name) {
        let comp = null;

        if (this.hasComponent(name)) {
            comp = this.comps[name];
        }

        return comp;
    }

    /*
     * 检测组件是否存在
     * @param {string} name 组件名称
     * @return {boolean} result
     */
    hasComponent(name) {
        return this.comps.hasOwnProperty(name);
    }
}

const coingame = new CoinGame();

export default coingame;

if (typeof window !== 'undefined') {
    // exports to window
    window.coingame = coingame;
}
