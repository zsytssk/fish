import * as zip from '@zip.js/zip.js';

export class ZipResManager {
    zipMapPath:string
    public init(zip_map_path: string) {

    }
}

const reader = new zip.ZipReader(new zip.HttpReader('./test.zip'));
    console.log(`test:>1`);

    const file_list = (await reader.getEntries()).map((item) => {
        return {
            name: item.filename,
            getData: async () => {
                const etx = item.filename.split('.')[1];

                let writer: any;
                if (etx === 'sk') {
                    writer = new zip.Uint8ArrayWriter();
                } else if (etx === 'png' || etx === 'jpg') {
                    writer = new zip.Uint8ArrayWriter();
                } else {
                    writer = new zip.TextWriter();
                }
                return await item.getData(writer, {
                    onprogress: (index, max) => {
                        // onprogress callback
                    },
                });
            },
        };
    });

    const oldFn = (Loader.prototype as any)._loadHttpRequest;
    (Loader.prototype as any)._loadHttpRequest = function (...params: any[]) {
        let url = params[0];
        const type = params[1];
        const onLoadCaller = params[2];
        const oLoad = params[3];

        url = url.split('?')[0].replace(location.origin + '/', '');
        if (url.indexOf('mp3') !== -1) {
            console.log(`test:>`, url);
        }

        const find = file_list.find((item) => item.name === url);
        if (!find) {
            return oldFn.apply(this, [...params]);
        } else {
            find.getData().then((data) => {
                if (type === 'json') {
                    data = JSON.parse(data);
                } else if (type === 'xml') {
                    data = Utils.parseXMLFromString(data);
                }
                oLoad.apply(onLoadCaller, [data]);
            });
        }
    };

    const oldImgFn = (Loader.prototype as any)._loadHtmlImage;
    (Loader.prototype as any)._loadHtmlImage = function (...params: any[]) {
        let url = params[0];
        const onLoadCaller = params[1];
        const onLoad = params[2];
        const onErrorCaller = params[3];
        const onError = params[4];

        url = url.split('?')[0].replace(location.origin + '/', '');

        if (url.indexOf('image/hall/mermaid_ball') !== -1) {
            console.log(`test:>2`, url);
        }
        const find = file_list.find((item) => item.name === url);
        if (!find) {
            return oldImgFn.apply(this, [...params]);
        } else {
            find.getData().then((data) => {
                const biStr = []; //new Array(i);
                let i = data.length;
                while (i--) {
                    biStr[i] = String.fromCharCode(data[i]);
                }
                const base64 = window.btoa(biStr.join(''));

                function clear(): void {
                    const img: any = image;
                    img.onload = null;
                    img.onerror = null;
                    delete (Loader as any)._imgCache[url];
                }
                function onerror() {
                    clear();
                    onError.call(onErrorCaller);
                }
                function onload() {
                    clear();
                    onLoad.call(onLoadCaller, image);
                }

                const image = new window.Image();
                image.crossOrigin = '';
                image.onload = onload;
                image.onerror = onerror;
                image.src = `data:image/png;base64,${base64}`;
                (Loader as any)._imgCache[url] = image;
            });
        }
    };