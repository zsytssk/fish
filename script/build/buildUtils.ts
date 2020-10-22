import * as path from 'path';
import { genVersion } from '../genVersion/genVersion';
import { readFile } from '../zutil/ls/asyncUtil';
import { excuse } from '../zutil/ls/exec';
import { cp } from '../zutil/ls/main';
import { clear } from '../zutil/ls/rm';
import * as config from './config.json';

async function getConfig(): Promise<typeof config> {
    const file = path.resolve(__dirname, './config.json');
    const str = await readFile(file);
    return JSON.parse(str);
}

export type BuildType = 'test' | 'prod';

export async function build(type: BuildType = 'prod') {
    const { project_path } = await getConfig();

    let cmd = 'npm run test';
    if (type === 'prod') {
        cmd = 'npm run prod';
    }

    await excuse(cmd, {
        path: project_path,
        output: true,
    });
}

export async function afterBuild(push = false) {
    const { dist_path } = await getConfig();
    await genVersion();
    await copyBinToDist();
    // await compress(dist_bin);
    if (push) {
        await pushRemote();
    }
}

async function copyBinToDist() {
    const { project_path, dist_path } = await getConfig();
    const bin = path.resolve(project_path, 'bin');
    const dist_bin = path.resolve(dist_path);
    await clear(dist_bin);
    await cp(bin, dist_bin);
}

export async function pushRemote() {
    const { dist_path } = await getConfig();
    await excuse('git acpp', { path: dist_path, output: true });
}

export async function test() {}
