import * as path from 'path';
import * as config from './config.json';
import { readFile } from '../zutil/ls/asyncUtil';
import { excuse } from '../zutil/ls/exec';
import { cp } from '../zutil/ls/main';

async function getConfig(): Promise<typeof config> {
    const file = path.resolve(__dirname, './config.json');
    const str = await readFile(file);
    return JSON.parse(str);
}

export async function main() {
    await webpack();
    await copyBinToDist();
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
