// http 请求
export default class Request {
    constructor() {
        this._xhr = null;
        this._url = null;
        this._method = null;
        this._data = null;
        // 超时时间
        this._time = 5000;

        // 计数器
        this._count = 0;
        // 最大值
        this._max = 3;

        // 回调模式
        this._success = null;
        this._fail = null;
        this._complete = null;

        // Promise 模式
        this._resolve = null;
        this._reject = null;
    }

    /*
     * 发送请求
     * @param (string) url 请求地址
     * @param (string) method 请求方式 GET | POST
     * @param (object) data 数据
     * @param (function) success 成功回调
     * @param (function) fail 失败回调
     * @param (function) complete 完成回调
     * @param (function) resolve Promise resolve
     * @param (function) reject Promise reject
     */
    send({
        url,
        method = 'GET',
        data,
        success,
        fail,
        complete,
        resolve = null,
        reject = null
    }) {
        this._success = success;
        this._fail = fail;
        this._complete = complete;
        this._resolve = resolve;
        this._reject = reject;

        const xhr = new XMLHttpRequest();
        let formartUrl = url;
        let formartData = null;

        if (typeof data === 'object') {
            formartData = Object.keys(data).map(function(key) {
                const str = typeof data[key] === 'object' ? JSON.stringify(data[key]) : data[key];

                return encodeURIComponent(key) + '=' + encodeURIComponent(str);
            }).join('&');
        }

        if (method === 'GET') {
            if (formartData !== null) {
                if (formartUrl.includes('?')) {
                    formartUrl += '&' + formartData;
                } else {
                    formartUrl = formartUrl + '?' + formartData;
                }
            }

            xhr.open(method, formartUrl, true);
        } else if (method === 'POST') {
            xhr.open(method, formartUrl, true);

            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }

        xhr.timeout = this._time;

        this._initEvent(xhr);

        this._xhr = xhr;
        this._url = formartUrl;
        this._method = method;
        this._data = formartData;

        this._send();
    }

    // 中断请求
    abort() {
        this._xhr.abort();
    }

    /*
     * 定义监听事件
     * @param (object) xhr xhr对象
     */ 
    _initEvent(xhr) {
        // 请求成功
        xhr.onload = () => {
            this._load();
        };

        // 请求完成
        xhr.onloadend = () => {
            this._loadend();
        };

        // 请求失败
        xhr.onerror = () => {
            this._error();
        };

        // 请求超时
        xhr.ontimeout = () => {
            this._timeout();
        };

        // 请求中断
        xhr.onabort = () => {
            this._abort();
        };
    }

    // 发送
    _send() {
        // 若在断网状态下调用xhr.send(data)方法，则会抛错：Uncaught NetworkError: Failed to execute 'send' on 'XMLHttpRequest'。
        try {
            this._xhr.send(this._data)
        } catch (err) {
            if (this._reject !== null) {
                this._reject({
                    status: 'networkError',
                    statusText: 'sendRequest networkError'
                });
            }
        }
    }

    // 重试
    _retry() {
        this._count++;

        const xhr = new XMLHttpRequest();

        xhr.timeout = this._time;

        xhr.open(this._method, this._url, true);

        if (this._method === 'POST') {
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }

        this._initEvent(xhr);

        this.xhr = xhr;

        this._send();
    }

    // 请求成功时调用
    _load() {
        const xhr = this._xhr;

        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
            if (xhr.responseText.trim() === '') {
                if (this._reject !== null) {
                    this._reject({
                        status: xhr.status,
                        statusText: xhr.statusText
                    });
                }

                return;
            }

            const data = JSON.parse(xhr.responseText);

            if (typeof this._success === 'function') {
                this._success(data);
            }

            if (this._resolve !== null) {
                this._resolve(data);
            }
        } else {
            if (this._reject !== null) {
                this._reject({
                    status: xhr.status,
                    statusText: xhr.statusText
                });
            }
        }
    }

    // 请求完成时调用
    _loadend() {
        if (typeof this._complete === 'function') {
            this._complete();
        }
    }

    // 请求失败时调用
    _error() {
        if (typeof this._fail === 'function') {
            this._fail();
        }

        if (this._reject !== null) {
            this._reject({
                status: this._xhr.status,
                statusText: this._xhr.statusText
            });
        }
    }

    // 请求超时时调用
    _timeout() {
        if (this._count < this._max) {
            this._retry();
        } else {
            if (this._reject !== null) {
                this._reject({
                    status: 'timeout',
                    statusText: 'sendRequest timeout'
                });
            }
        }
    }

    // 请求中断时调用
    _abort() {
        if (this._reject !== null) {
            this._reject({
                status: 'abort',
                statusText: 'sendRequest abort'
            });
        }
    }
}