import * as path from 'path';
import * as Config from './config.json';
import { cp } from '../zutil/ls/main';
import { replaceReg } from '../zutil/utils/replaceReg';
import { readFile } from '../zutil/ls/asyncUtil';
import { write } from '../zutil/ls/write';

const type = process.argv[2] || 'updateSdk';

async function main() {
    const actions = {
        updateSdk,
        updateSdkSource,
        // publishSdk,
    };
    if (actions[type]) {
        await actions[type]();
    }
}
main();

async function updateSdk() {
    const { sdk_path, project_path } = Config;
    const sdk_src = path.resolve(sdk_path, 'dist/coingame.min.js');
    const project_dist = path.resolve(project_path, 'libs/coingame.min.js');
    await cp(sdk_src, project_dist);
}

async function updateSdkSource() {
    const { sdk_path, project_path } = Config;
    const sdk_src = path.resolve(sdk_path, 'src');
    const project_dist = path.resolve(project_path, 'libs/game.client.sdk');
    await cp(sdk_src, project_dist);
    await removeBabel();
}

// async function publishSdk() {}

async function removeBabel() {
    const { project_path } = Config;
    const entry = path.resolve(project_path, 'libs/game.client.sdk/entry.js');
    const content = await readFile(entry);
    const new_content = replaceReg(
        content,
        new RegExp(`$import '@babel/polyfill/noConflict';`, 'g'),
        `///import '@babel/polyfill/noConflict';`,
    );
    await write(entry, new_content);
}
