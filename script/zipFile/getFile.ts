import MD5 from 'crypto-js/md5';
import * as path from 'path';

import { lstatFile, readFile } from '../zutil/ls/asyncUtil';
import config from './config.json';

export const bin = path.resolve('./bin');
const version_path = path.resolve(bin, './version.json');

let file_version_map: { [key: string]: string } = {};
export async function getAllFiles() {
    const version_str = await readFile(version_path);
    file_version_map = JSON.parse(version_str);

    let allSize = 0;
    const fileMap: {
        [key: string]: { version: string; size: number };
    } = {};
    for (const [name, version] of Object.entries(file_version_map)) {
        const etx = name.split('.')[1];
        if (config.containFiles.indexOf(etx) === -1) {
            continue;
        }

        const file = path.resolve(bin, name);
        const stat = await lstatFile(file);
        allSize += stat.size;
        fileMap[file] = { size: stat.size, version };
    }

    return { fileMap, allSize };
}

export function genMd5FromStr(str: string) {
    return ('f' + MD5(str)).slice(0, 11);
}
