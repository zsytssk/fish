/* eslint-disable @typescript-eslint/no-explicit-any */
// import * as zip from '@zip.js/zip.js';
import * as zip from 'zip';

import { loader } from 'Laya';
import { Loader } from 'laya/net/Loader';
import { Utils } from 'laya/utils/Utils';

import { loadRes } from './loadRes';

type ZipMap = { [key: string]: string };
type ZipResItem = {
    name: string;
    getData: () => Promise<string | Uint8Array>;
};
export class ZipResManager {
    private zipMap: ZipMap;
    private version: string;
    public static instance: ZipResManager;
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
        const oldFn = (Loader.prototype as any)._loadHttpRequest;
        (Loader.prototype as any)._loadHttpRequest = function (
            ...params: any[]
        ) {
            let url = params[0];
            const type = params[1];
            const onLoadCaller = params[2];
            const oLoad = params[3];

            url = url.split('?')[0].replace(location.origin + '/', '');

            const zipName = ZipResManager.instance.containRes(url);
            if (!zipName) {
                return oldFn.apply(this, [...params]);
            } else {
                ZipResManager.instance.loadZip(zipName, url).then((item) => {
                    item.getData().then((data: string) => {
                        if (type === 'json') {
                            data = JSON.parse(data);
                        } else if (type === 'xml') {
                            data = Utils.parseXMLFromString(data);
                        }
                        oLoad.apply(onLoadCaller, [data]);
                    });
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
                ZipResManager.instance.loadZip(zipName, url).then((item) => {
                    item.getData().then((data: Uint8Array) => {
                        const biStr = [];
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
            let list: ZipResItem[];
            if (this.loadProcessList[zip_name]) {
                list = await this.loadProcessList[zip_name];
            } else {
                const reader = new (zip as any).ZipReader(
                    new (zip as any).HttpReader(
                        `${this.zip_folder}/${zip_name}.zip?version=${this.version}`,
                    ),
                );

                const loadedProcessItem = (this.loadProcessList[zip_name] =
                    reader.getEntries().then((file_list) => {
                        return file_list.map((item) => {
                            return {
                                name: item.filename,
                                getData: async () => {
                                    const etx = item.filename.split('.')[1];

                                    let writer: any;
                                    if (etx === 'sk') {
                                        writer = new (
                                            zip as any
                                        ).Uint8ArrayWriter();
                                    } else if (etx === 'png' || etx === 'jpg') {
                                        writer = new (
                                            zip as any
                                        ).Uint8ArrayWriter();
                                    } else {
                                        writer = new (zip as any).TextWriter();
                                    }
                                    return await item.getData(writer, {
                                        onprogress: (index, max) => {
                                            // onprogress callback
                                        },
                                    });
                                },
                            };
                        });
                    }));

                list = await loadedProcessItem;
            }

            this.zipResMap[zip_name] = zip_res = list;
        }

        // console.log(`test:>`, res_url);
        return zip_res.find((item) => item.name === res_url);
    }
}
