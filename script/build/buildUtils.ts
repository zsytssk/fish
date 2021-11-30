import * as path from 'path';
import * as child_process from 'child_process';
import { genVersion } from '../genVersion/genVersion';
import { excuse } from '../zutil/ls/exec';
import { cp } from '../zutil/ls/main';
import { clear } from '../zutil/ls/rm';
import { dist_path, project_path } from './const';

const { execSync } = child_process;

export type BuildType = 'test' | 'prod';

export async function build(type: BuildType = 'prod') {
    const mode = type === 'prod' ? 'production' : 'development';
    const env = type === 'prod' ? 'PROD' : 'TEST';

    execSync(`npm run prod`, {
        cwd: project_path,
        stdio: 'inherit',
    });
}

export async function afterBuild(push = false) {
    await genVersion();
    await copyBinToDist();
    // await compress(dist_bin);
    if (push) {
        await pushRemote();
    }
}

async function copyBinToDist() {
    const bin = path.resolve(project_path, 'bin');
    const dist_bin = path.resolve(dist_path);
    await clear(dist_bin);
    await cp(bin, dist_bin);
}

export async function pushRemote() {
    execSync('git acpp', { cwd: project_path, stdio: 'inherit' });
}

export async function test() {}
