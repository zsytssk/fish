// 支付管理
export default class PayManager {
    constructor() {}

    /*
     * @param {string} type 支付类型 0:提现, 1:充值 
     * @param {string} channel 支付渠道
     * @param {object} data 支付数据
     * @param {function} success 成功回调
     * @param {function} error 失败回调
     * @param {function} complete 完成回调
     */
    request({
        type,
        channel,
        data,
        success,
        error,
        complete
    }) {
        if (type === '0') {
            // 提现
            this._withdraw({
                channel,
                data,
                success,
                error,
                complete
            });
        } else if (type === '1') {
            // 充值
            this._deposit({
                channel,
                data,
                success,
                error,
                complete
            });
        }
    }

    /*
     * 充值 
     * @param {string} channel 支付渠道
     * @param {object} data 支付数据
     * @param {function} success 成功回调
     * @param {function} error 失败回调
     * @param {function} complete 完成回调
     */
    _deposit({
        channel,
        data,
        success,
        error,
        complete
    }) {
        switch (channel) {
            case '0': // android(平台)
                break;
            case '1': // android(第三方)
                break;
            case '2': // ios
                break;
            case '3': // H5(平台)
                break;
            case '4': // H5(第三方)
                break;
            default:
                this._coingameDeposit(data);
        }
    }

    /*
     * 通用充值
     * @param {string} currency 币种
     * @param {string} lang 语言
     * @param {string} operate 操作
     */
    _coingameDeposit({
        currency,
        lang,
        operate = 'deposit'
    }) {
        const { domainRecharge, rechargeUrlMobile, rechargeUrlPc } = coingame.sys.config;
        const { mobile } = coingame.sys.browser;

        let href = domainRecharge;

        href += mobile ? rechargeUrlMobile : rechargeUrlPc;

        href = href.replace('{currency}', currency).replace('{lang}', lang).replace('{operate}', operate);

        location.href = href;
    }

    /*
     * 提币 
     * @param {string} channel 支付渠道
     * @param {object} data 支付数据
     * @param {function} success 成功回调
     * @param {function} error 失败回调
     * @param {function} complete 完成回调
     */
    _withdraw({
        channel,
        data,
        success,
        error,
        complete
    }) {
        switch (channel) {
            case '0': // android(平台)
                break;
            case '1': // android(第三方)
                break;
            case '2': // ios
                break;
            case '3': // H5(平台)
                break;
            case '4': // H5(第三方)
                break;
            default:
                this._coingameWithdraw(data);
        }
    }

    /*
     * 通用提币
     * @param {string} currency 币种
     * @param {string} lang 语言
     * @param {string} operate 操作
     */
    _coingameWithdraw({
        currency,
        lang,
        operate = 'withdraw'
    }) {
        const { domainRecharge, rechargeUrlMobile, rechargeUrlPc } = coingame.sys.config;
        const { mobile } = coingame.sys.browser;

        let href = domainRecharge;

        href += mobile ? rechargeUrlMobile : rechargeUrlPc;

        href = href.replace('{currency}', currency).replace('{lang}', lang).replace('{operate}', operate);

        location.href = href;
    }
}