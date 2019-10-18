import { PATH } from 'data/path';
import { Test } from 'testBuilder';
import { stage_width, stage_height } from 'utils/displace/displaceUtil';

export const path_test = new Test('path', runner => {
    runner.describe('correct', () => {
        for (const key in PATH) {
            if (!PATH.hasOwnProperty(key)) {
                continue;
            }
            const item = PATH[key];
            const first = {
                x: item[0][0],
                y: item[0][1],
            };
            const last_p = item[item.length - 1].reverse();
            const end = {
                x: last_p[1],
                y: last_p[0],
            };
            item[item.length - 1].reverse();

            const fr = isRight(first);
            const er = isRight(end);
            if (!fr || !er) {
                console.log(`${key}: first:${fr}, end:${er}`, end);
            }
        }
    });
});

function isRight(p: Point) {
    const { x, y } = p;
    if (x < 0) {
        return true;
    }
    if (x > stage_width) {
        return true;
    }
    if (y < 0) {
        return true;
    }
    if (y > stage_height) {
        return true;
    }

    return false;
}
