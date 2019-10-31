// 生成uuid
export function uuid() {
    const s = [];
    const hexDigits = "0123456789abcdef";
    for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    // bits 12-15 of the time_hi_and_version field to 0010
    s[14] = '4';
    // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
    s[8] = s[13] = s[18] = s[23] = '-';

    return s.join('');
}

/*
 * 截取字符串，支持中文
 * @param (string) str 截取的字符串
 * @param (number) len 截取的字符串长度
 * @param (number) fixed 截取后修正字符数量
 */
export function formatData(str, len = 8, correction = 0) {
    let _str = '' + str;
    let str_len = 0;
    let str_cut = '';

    for (let i = 0, _len = _str.length; i < _len; i++) {
        const a = _str.charAt(i);

        str_len++;

        if (escape(a).length > 4) {
            //中文字符的长度经编码之后大于4
            str_len++;
        }

        if (str_len <= len) {
            str_cut = str_cut.concat(a);
        }
    }

    //如果给定字符串小于指定长度，则返回原字符串
    if (str_len <= len) {
        return str_cut;
    } else {
        str_cut = str_cut.substring(0, str_cut.length - correction);

        return str_cut = str_cut.concat('...');
    }
}

/**
 * 格式化昵称，支持中文
 * @param (string) str 截取的字符串
 * @param (string) len 截取的字符串长度 默认中文最多4个，英文8个
 **/
export function formatSensitiveData(str, len = 8) {
    let _str = '' + str;
    let str_len = 0;

    for (let i = 0, _len = _str.length; i < _len; i++) {
        const a = _str.charAt(i);

        str_len++;

        if (escape(a).length > 4) {
            //中文字符的长度经编码之后大于4
            str_len++;
        }
    }

    //如果给定字符串小于指定长度，则返回原字符串
    if (str_len <= len) {
        return _str;
    } else {
        return _str.substr(0, 3) + '***' + _str.substr(_str.length - 3, _str.length);
    }
}

/*
 * 在url查询部分中，通过key获取value
 * @param (string) str 截取的字符串
 * @param (number) len 截取的字符串长度
 */
export function getQueryParams(key = '') {
    const reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)', 'i');
    const r = window.location.search.substr(1).match(reg);
    let context = '';

    if (r !== null) {
        context = r[2];
    }

    if (context === null || context === 'undefined') {
        context = '';
    }

    return context;
}
