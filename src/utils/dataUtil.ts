import { Coordinates } from 'data/coordinate';
import { SpriteType } from 'data/sprite';
import { SPRITE } from 'data/sprite';
import { SHAPE } from 'data/shape';
import { vectorToAngle } from './mathUtils';

export function getGunInfo(server_index: number) {
    const pos = Coordinates.gun_global_pos[server_index];
    return {
        pos,
    };
}
/** 获取sprite的信息 */
export function getSpriteInfo(type: SpriteType, level?: number | string) {
    let sprite_info = SPRITE[type][level] || SPRITE[type]['1'] || SPRITE[type];
    if (sprite_info.as) {
        sprite_info = SPRITE[type][sprite_info.as];
    }
    return sprite_info;
}
/** 获取形状信息 */
export function getShapeInfo(type: SpriteType, level?: number | string) {
    let shape_info = SHAPE[type][level] || SHAPE[type]['1'] || SHAPE[type];
    if (shape_info.as) {
        shape_info = SPRITE[type][shape_info.as];
    }
    return shape_info;
}

/**
 * 获取子弹发射的开始位置, 返回的子弹发射开始位置数组, 多个表示多个子弹同时发射
 * @param server_index 用户的服务器index
 * @param direction 大炮的方向
 */
export function getBulletStartPos(
    server_index: number,
    direction: SAT.Vector,
): Point {
    const server_client_index = server_index - 1;
    const gun_global_pos: Point =
        Coordinates.gun_global_pos[server_client_index].pos;
    const gun_origin_pos: Point = Coordinates.guns_inside_pos.origin_point;
    const gun_start_point: Point = Coordinates.guns_inside_pos.start_point;
    let x: number;
    let y: number;

    if (server_client_index <= 1) {
        x = gun_start_point.x - gun_origin_pos.x;
        y = gun_start_point.y - gun_origin_pos.y;
    } else {
        // 上面的炮台的位置 子弹gun_start_point相对于gun_origin_pos的位置正好是与底下的相反
        x = gun_origin_pos.x - gun_start_point.x;
        y = gun_origin_pos.y - gun_start_point.y;
    }
    let vector = new SAT.Vector(x, y);
    /** 向量需要转动的角度 */
    let angle: number;
    if (server_client_index <= 1) {
        // 底下的gun的大炮的初始角度是-Math.PI / 2
        angle = vectorToAngle(direction) + Math.PI / 2;
    } else {
        // 底下的gun的大炮的初始角度是Math.PI / 2
        angle = vectorToAngle(direction) - Math.PI / 2;
    }
    vector = vector.rotate(angle);
    x = gun_global_pos.x + vector.x;
    y = gun_global_pos.y + vector.y;
    return { x, y };
}
