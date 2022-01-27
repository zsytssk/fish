import { Bezier } from 'bezier-js';
import { PATH } from '../../src/data/path';
import { write } from '../zutil/ls/write';
import { stringify } from '../zutil/utils/stringify';

/** 生成鱼路径的长度, 给服务端 算鱼的游动时间 = 长度/速度 */
function main() {
    console.log(__dirname);
    const result = {};
    for (const key in PATH) {
        if (!PATH.hasOwnProperty(key)) {
            continue;
        }
        const item = PATH[key];
        let len = 0;
        for (const path_item of item) {
            const curve = new Bezier(path_item);
            len += curve.length();
        }
        result[key] = parseInt(len + '', 10);
    }

    write(__dirname + '/path.json', stringify(result, 2));
}

main();
