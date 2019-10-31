// 渠道管理
export default class ChannelManager {
    constructor() {}

    /*
     * 调用渠道方法
     * @param {string} channelName 渠道名
     * @param {function} funcName 方法名
     * @param {object} data 数据
     */
    invoke({
        channelName,
        funcName,
        data
    }) {
        if (typeof this.__proto__[funcName] === 'function') {
            this.__proto__[funcName](data);
        }
    }

    // 龙网 - 显示关闭按钮
    showCloseBtn() {
        const { ios, android } = coingame.sys.browser;

        //  安卓
        if (android && !!window.JSInterface && typeof window.JSInterface.showCloseBtn === 'function') {
            window.JSInterface.showCloseBtn(true);
        }

        // IOS
        if (ios && !!window.webkit && window.webkit.hasOwnProperty('messageHandlers') && typeof window.webkit.messageHandlers.showCloseBtn === 'function') {
            window.webkit.messageHandlers.showCloseBtn.postMessage({
                body: '',
                callback: ''
            });
        }
    }

}