// 加载管理
export default class LoaderManager {
    constructor() {}

    /*
     * 加载资源
     * @param {array} files 脚本列表
     * @param {function} success 成功回调
     * @param {function} error 失败回调
     * @param {boolean} isPromise 是否开启Promise
     */
    load({
        files,
        success,
        error,
        isPromise = false
    }) {
        if (!Array.isArray(files) || files.length === 0) {
            return;
        }

        if (isPromise) {
            return new Promise((resolve, reject) => {
                this._loadFiles({
                    files,
                    success,
                    error
                }, resolve, reject);
            });
        } else {
            this._loadFiles({
                files,
                success,
                error
            });
        }
    }

    // 逐步加载文件
    async _loadFiles(data, resolve, reject) {
        const { files, success, error } = data;
        const total = files.length;
        let done = 0;

        try {
            // 逐步发送命令
            for (let item of files) {
                await this._loadScript(item);

                done++;
            }

            if (done === total) {
                typeof success === 'function' && success();

                typeof resolve === 'function' && resolve();
            }
        } catch (err) {
            console.log('coingame loader error:', err);
            
            typeof error === 'function' && error();

            typeof reject === 'function' && reject();
        }
    }

    /*
     * 加载script文件
     * @param {string} file 文件名
     */
    _loadScript(file) {
        return new Promise((resolve, reject) => {
            const { cdn = '' } = coingame.sys.config.cdn;
            const src = cdn === '' ? file : cdn + '/' + file;
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.async = 'async';

            script.onload = function() {
                console.log('coingame loader file success:', src);

                resolve();
            };

            script.onerror = function() {
                console.log('coingame load file error:', src);

                reject();
            };

            script.src = src;
            document.body.appendChild(script);
        });
    }
}