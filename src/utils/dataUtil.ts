import { SpriteType } from '../data/sprite';
import { SPRITE } from 'data/sprite';
import { SHAPE } from 'data/shape';

export function getGunInfo(gun_level: number, vip_level: number) {
    let skin_level = '1';
    if (Number(vip_level) > 0) {
        skin_level = 'vip' + vip_level;
    } else if (Number(gun_level) >= 30) {
        skin_level = '2';
    }
    let sprite_info = SPRITE.gun[skin_level];
    if (sprite_info.as) {
        sprite_info = SPRITE.gun[sprite_info.as];
    }
    return {
        skin_level,
        hole_num: sprite_info.hole_num,
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
