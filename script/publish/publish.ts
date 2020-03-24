import * as path from 'path';
import { compress } from '../compressImg/compressImg';
import { genVersion } from '../genVersion/genVersion';
import { readFile } from '../zutil/ls/asyncUtil';
import { excuse } from '../zutil/ls/exec';
import { cp } from '../zutil/ls/main';
import { write } from '../zutil/ls/write';
import { replaceReg } from '../zutil/utils/replaceReg';
import * as config from './config.json';

async function getConfig(): Promise<typeof config> {
    const file = path.resolve(__dirname, './config.json');
    const str = await readFile(file);
    return JSON.parse(str);
}

export async function main() {
    console.time('publish');
    const { dist_path } = await getConfig();
    const dist_bin = path.resolve(dist_path, 'bin');
    await webpack();
    await genVersion();
    await copyBinToDist();
    await cleanDist();
    await compress(dist_bin);
    console.timeEnd('publish');
}

main();

async function webpack() {
    const { project_path } = await getConfig();
    await excuse('npm run webpack-test', { path: project_path, output: true });
}
async function copyBinToDist() {
    const { project_path, dist_path } = await getConfig();
    const bin = path.resolve(project_path, 'bin');
    const dist_bin = path.resolve(dist_path, 'bin');
    console.log(bin, dist_bin);
    await cp(bin, dist_bin);
}

async function cleanDist() {
    const { dist_path } = await getConfig();
    const dist_bin = path.resolve(dist_path, 'bin');
    /** 删除index.html中的webpack-dev-server */
    const dist_index = path.resolve(dist_bin, 'index.html');
    let index_str = await readFile(dist_index);
    index_str = replaceReg(
        index_str,
        /\n\s+<script type="text\/javascript" src="webpack-dev-server.js"><\/script>/g,
        '',
    );
    await write(dist_index, index_str);
}
