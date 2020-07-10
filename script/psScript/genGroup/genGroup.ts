import * as path from 'path';
import { write } from '../../zutil/ls/write';
import { stringify } from '../../zutil/utils/stringify';
import GroupData from './group.origin.json';

/** 生成鱼组数据脚本 */
type GroupItem = {
    type: string;
    pos: Point;
};
type GroupData = {
    group: GroupItem[];
    offset: number[];
};

const result = {} as { [key: string]: GroupData };
let i = 0;
for (const [key, data] of Object.entries(GroupData)) {
    const { pos, shape, fish: fish_ori } = data;
    const group: GroupItem[] = [];
    for (const item of fish_ori) {
        const { fishType, pos: fish_pos } = item;
        group.push({
            type: fishType + '',
            pos: {
                x: fish_pos.x - pos.x,
                y: fish_pos.y - pos.y,
            },
        });
    }
    const top = pos.y - shape.y;
    const right = shape.x + shape.width - pos.x;
    const bottom = shape.y + shape.height - pos.y;
    const left = pos.x - pos.x;
    const offset: number[] = [top, right, bottom, left];
    result[`G${++i}`] = {
        group,
        offset,
    };
}

write(path.resolve(__dirname, 'group.json'), stringify(result, 2));
