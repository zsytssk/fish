import AdmZip from 'adm-zip';
import * as path from 'path';

import { readFile } from '../zutil/ls/asyncUtil';
import { rm } from '../zutil/ls/rm';
import { write } from '../zutil/ls/write';
import config from './config.json';
import { bin, genMd5FromStr, getAllFiles } from './getFile';

async function main() {
    const { fileMap, allSize } = await getAllFiles();

    const zip_file_map: { [key: string]: string[] } = {};
    const split_size = allSize / config.fileNum;
    let tmpSize = 0;
    let tmpList: string[] = [];
    let version_str = '';
    for (const [name, info] of Object.entries(fileMap)) {
        tmpSize += info.size;
        tmpList.push(name);
        version_str += info.version;
        if (tmpSize > split_size) {
            const name = genMd5FromStr(version_str);
            zip_file_map[name] = tmpList;
            tmpSize = 0;
            tmpList = [];
        }
    }

    const dist_file_map: { [key: string]: string[] } = {};
    await rm(config.distFolder);
    for (const [name, file_list] of Object.entries(zip_file_map)) {
        if (!dist_file_map[name]) {
            dist_file_map[name] = [];
        }
        const zip = new AdmZip();
        const outputFile = path.resolve(config.distFolder, `${name}.zip`);
        for (const item of file_list) {
            const rel_path = path.relative(bin, item);
            dist_file_map[name].push(rel_path);
            const content = await readFile(item);
            zip.addFile(rel_path, content);
        }
        zip.writeZip(outputFile);
    }
    const zip_map_path = path.resolve(config.distFolder, 'zip_map.json');
    await write(zip_map_path, JSON.stringify(dist_file_map));
}

main();
