/* eslint-disable @typescript-eslint/no-explicit-any */
// import * as zip from '@zip.js/zip.js';
import * as JSZip from 'jszip';

import { loader } from 'Laya';
import { Loader } from 'laya/net/Loader';
import { Utils } from 'laya/utils/Utils';

import { httpLoad, loadRes } from './loadRes';

type ZipMap = { [key: string]: string };
type ZipResItem = {
    name: string;
    getData: () => Promise<string | Uint8Array>;
};
export class ZipResManager {
    private zipMap: ZipMap;
    private version: string;
    public static instance: ZipResManager;
    private loadingMap: { [key: string]: Promise<any> } = {};
    private loadProcessList: { [key: string]: Promise<ZipResItem[]> } = {};
    private zipResMap: { [key: string]: ZipResItem[] } = {};
    private zip_folder: string;
    constructor() {
        ZipResManager.instance = this;
    }
    public async init(
        zip_map_path: string,
        zip_folder: string,
        version: string,
    ) {
        return loadRes(zip_map_path).then(() => {
            console.log(`test:>ZipResManager`);
            const data = loader.getRes(zip_map_path);
            if (!data) {
                return;
            }
            this.zip_folder = zip_folder;
            this.zipMap = data;
            this.version = version;
            this.injectLoad();
        });
    }
    private injectLoad() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        const oldFn = (Loader.prototype as any)._loadHttpRequest;
        (Loader.prototype as any)._loadHttpRequest = function (
            ...params: any[]
        ) {
            let url = params[0];
            const type = params[1];
            const onLoadCaller = params[2];
            const onLoad = params[3];
            const onErrorCaller = params[6];
            const onError = params[7];

            url = url.split('?')[0].replace(location.origin + '/', '');

            const zipName = ZipResManager.instance.containRes(url);
            if (!zipName) {
                return oldFn.apply(this, [...params]);
            } else {
                if (!self.loadingMap[url]) {
                    self.loadingMap[url] = ZipResManager.instance
                        .loadZip(zipName, url)
                        .then((item) => {
                            return item.getData().then((data) => {
                                return new Promise((resolve, reject) => {
                                    try {
                                        if (type === 'json') {
                                            data = JSON.parse(data as string);
                                        } else if (type === 'xml') {
                                            data =
                                                Utils.parseXMLFromString(data);
                                        }
                                        resolve(data);
                                    } catch {
                                        reject();
                                    }
                                });
                            });
                        });
                }
                self.loadingMap[url]
                    .then((data) => {
                        onLoad.apply(onLoadCaller, [data]);
                    })
                    .catch(() => {
                        onError.call(onErrorCaller);
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

            const zipName = ZipResManager.instance.containRes(url);
            if (!zipName) {
                return oldImgFn.apply(this, [...params]);
            } else {
                if (!self.loadingMap[url]) {
                    self.loadingMap[url] = ZipResManager.instance
                        .loadZip(zipName, url)
                        .then((item) => {
                            return item.getData().then((data) => {
                                return new Promise((resolve, reject) => {
                                    function clear(): void {
                                        const img: any = image;
                                        img.onload = null;
                                        img.onerror = null;
                                    }
                                    function onerror() {
                                        clear();
                                        reject();
                                    }
                                    function onload() {
                                        clear();
                                        resolve(image);
                                    }

                                    const image = new window.Image();
                                    image.crossOrigin = '';
                                    image.onload = onload;
                                    image.onerror = onerror;
                                    image.src = `data:image/png;base64,${data}`;
                                });
                            });
                        });
                }

                self.loadingMap[url]
                    .then((image: HTMLImageElement) => {
                        onLoad.call(onLoadCaller, image);
                    })
                    .catch(() => {
                        onError.call(onErrorCaller);
                    });
            }
        };
    }
    private containRes(res: string) {
        const { zipMap } = this;
        for (const [key, list] of Object.entries(zipMap)) {
            if (list.indexOf(res) !== -1) {
                return key;
            }
        }
        return false;
    }
    private async loadZip(zip_name: string, res_url: string) {
        let zip_res = this.zipResMap[zip_name];
        if (!zip_res) {
            if (!this.loadProcessList[zip_name]) {
                const path = `${this.zip_folder}/${zip_name}.zip?version=${this.version}`;

                this.loadProcessList[zip_name] = httpLoad(
                    path,
                    Loader.BUFFER,
                ).then((data: any) => {
                    return JSZip.loadAsync(data).then((zip: any) => {
                        const file_list = Object.keys(zip.files);
                        return file_list.map((file_name) => {
                            return {
                                name: file_name,
                                getData: async () => {
                                    const etx = file_name.split('.')[1];

                                    if (etx === 'sk') {
                                        return zip
                                            .file(file_name)
                                            .async('uint8array');
                                    } else if (etx === 'png' || etx === 'jpg') {
                                        return zip
                                            .file(file_name)
                                            .async('base64');
                                    } else {
                                        return zip
                                            .file(file_name)
                                            .async('string');
                                    }
                                },
                            };
                        });
                    });
                });
            }
            const list = await this.loadProcessList[zip_name];
            this.zipResMap[zip_name] = zip_res = list;
        }
        return zip_res.find((item) => item.name === res_url);
    }
}
