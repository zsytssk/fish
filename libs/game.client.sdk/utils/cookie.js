// cookie
class Cookie {
    constructor() {}

    /**
     * 获取cookie
     * @param {string} key cookie的键
     */
    get(key) {
        const arr = document.cookie.match(
            new RegExp('(^| )' + key + '=([^;]*)(;|$)'),
        );

        if (arr != null) {
            return unescape(arr[2]);
        }

        return null;
    }

    /**
     * 设置cookie
     * @param {string} key cookie的键
     * @param {string} value cookie的值
     * @param {number} expires 过期时间(单位：天)
     */
    set(key, value, expires = 1) {
        const Days = expires || 1;
        const exp = new Date();

        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        document.cookie = key + '=' + escape(value) + ';expires=' + exp.toUTCString();
    }

    /**
     * 删除cookie
     * @param {string} key cookie的键
     */
    remove(key) {
        const exp = new Date();
        exp.setTime(exp.getTime() - 1);

        const cval = this.get(key);
        if (cval != null) {
            document.cookie = key + '=' + cval + ';expires=' + exp.toUTCString();
        }
    }
}

const cookie = new Cookie();

export default cookie;