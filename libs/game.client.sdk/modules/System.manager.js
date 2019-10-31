// 工具 - HTTP请求
import Request from '../utils/Request.js';
// 工具 - Cookie
import cookie from '../utils/cookie.js';
// 工具 - 常用工具
import * as tools from '../utils/tools.js';

// 系统管理
export default class SystemtManager {
    constructor() {
        // 获取配置信息请求地址
        this._path = '/getDomain';
        // 请求对象
        this._request = null;
        // 配置信息
        this._config = {};
        // 终端环境
        this._browser = {};
    }

    /*
     * 获取配置信息
     * @return {object} result
     */
    get config() {
        return this._config
    }

    /*
     * 获取终端环境
     * @return {object} result
     */
    get browser() {
        return this._browser
    }

    /*
     * 初始化
     * @param {string} url 请求地址
     * @param {string} origin 请求域名
     * @param {function} callback 回调函数
     */
    init(data) {
        this.getLanguage();

        this.getChannel();

        this.getConfig(data);

        this.getBrowser();
    }

    // 获取终端环境
    getBrowser() {
        const ua = navigator.userAgent;
        const app = navigator.appVersion;
        const browser = {
            trident: ua.includes('Trident'), //IE内核
            presto: ua.includes('Presto'), //opera内核
            webKit: ua.includes('AppleWebKit'), //苹果、谷歌内核
            gecko: ua.includes('Gecko') && !ua.includes('KHTML'), //火狐内核
            mobile: !!ua.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
            ios: !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: ua.includes('Android') || ua.includes('Adr'), //android终端
            iPhone: ua.includes('iPhone'), //是否为iPhone或者QQHD浏览器
            iPad: ua.includes('iPad'), //是否iPad
            webApp: !ua.includes('Safari'), //是否web应该程序，没有头部与底部
            wechat: ua.includes('MicroMessenger'), //是否微信
            qq: ua.match(/\sQQ/i) === 'qq' //是否QQ
        };

        // 访问终端
        this._browser = browser;
    }

    // 获取语言环境
    getLanguage() {
        // 检测语言
        let lang = tools.getQueryParams('l') ||
            tools.getQueryParams('lang') ||
            cookie.get('l') ||
            cookie.get('lang') ||
            localStorage.getItem('l') ||
            localStorage.getItem('lang');

        if (typeof lang !== 'string' || lang === '') {
            lang = (navigator.browserLanguage || navigator.language).toLowerCase();

            if (lang === 'zh-cn') {
                lang = 'zh';
            }
        }

        localStorage.setItem('lang', lang);

        Object.assign(this._config, { lang });
    }

    // 获取渠道信息
    getChannel() {
        const channel = tools.getQueryParams('channel') ||
            cookie.get('channel') ||
            localStorage.getItem('channel') || '';

        localStorage.setItem('channel', channel);

        Object.assign(this._config, { channel });
    }

    /*
     * 获取配置信息
     * @param {string} url 请求地址
     * @param {string} origin 请求域名
     * @param {function} success 成功回调
     * @param {function} error 失败回调
     */
    getConfig({
        url = '',
        origin = '',
        success,
        error
    }) {
        if (url === '') {
            if (origin === '') {
                origin = location.origin;
            }

            url = origin + this._path;
        }

        if (this._request !== null) {
            this._request.abort();

            this._request = null;
        }

        const request = new Request();

        request.send({
            url: url,
            data: {
                host: location.host
            },
            success: (res) => {
                const { code, data } = res;

                if (code === 200) {
                    this._save(data);

                    typeof success === 'function' && success(data);
                }
            },
            error: () => {
                typeof error === 'function' && error();
            },
            complete: (res) => {
                this._request = null;
            }
        });

        this._request = request;
    }

    /*
     * 保存配置信息
     * @param {object} data 数据
     * domain 游戏主域名
     * domainRecharge 官网主域名
     * api api主域名
     * cdn 资源主域名
     * sso sso主域名
     * channelRecharge 渠道充值地址
     * loginUrl 登录注册地址
     * logoutUrl 登出地址
     * androidDownloadUrl android下载包地址
     * rechargeUrlPc pc充值地址
     * rechargeUrlMobile 移动充值地址
     * rechargeUrlChannel 渠道充值地址
     * clientId 渠道ID
     */
    _save(data) {
        const {
            domain,
            domainRecharge,
            api,
            cdn,
            sso,
            channelRecharge,
            homeUrl,
            loginUrl,
            logoutUrl,
            serverApi,
            clientId
        } = data;

        // 格式化域名
        data.domain = `${location.protocol}//${domain}`;
        data.domainRecharge = `${location.protocol}//${domainRecharge}`;
        data.api = `${location.protocol}//${api}`;
        data.cdn = `${location.protocol}//${cdn}`;
        data.sso = `${location.protocol}//${sso}`;
        data.channelRecharge = `${location.protocol}//${channelRecharge}`;
        data.homeUrl = `${location.protocol}//${homeUrl}`;
        data.serverApi = `${location.protocol}//${serverApi}`;

        data.loginUrl = data.sso + loginUrl;
        data.logoutUrl = data.sso + logoutUrl;

        // 登入 & 登出 移除code
        const redirectUrl = encodeURIComponent(location.origin);

        data.loginUrl = data.loginUrl.replace('{clientId}', clientId).replace('{redirectUrl}', redirectUrl);
        data.logoutUrl = data.logoutUrl.replace('{redirectUrl}', redirectUrl);

        // 保存配置信息
        for (let key in data) {
            localStorage.setItem(key, data[key]);
        }

        Object.assign(this._config, data);
    }
}