import * as path from 'path';
import { genVersion } from '../genVersion/genVersion';
import { readFile } from '../zutil/ls/asyncUtil';
import { cp } from '../zutil/ls/main';
import { clear } from '../zutil/ls/rm';
import * as config from './config.json';

async function getConfig(): Promise<typeof config> {
    const file = path.resolve(__dirname, './config.json');
    const str = await readFile(file);
    return JSON.parse(str);
}

export async function afterBuild() {
    await genVersion();
    await copyBinToDist();
}

async function copyBinToDist() {
    const { project_path, dist_path } = await getConfig();
    const bin = path.resolve(project_path, 'bin');
    const dist_bin = path.resolve(dist_path);
    await clear(dist_bin);
    await cp(bin, dist_bin);
}

export async function test() {}
