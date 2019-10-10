/** 资源所属场景 */
type BelongScene = 'room_normal' | 'room_poker';
/** 鱼网子弹的sprite
 * img 里面是图片的地址+pivot
 * shape 里面是形状+pivot
 */

export type SpriteInfo = {
    as?: string;
    /** 动画类型龙骨动画 帧动画 直接图片 */
    type?: 'DragonBone' | 'Frame' | 'Img';
    /** 图片的地址 */
    path?: string;
    /** 图片的中心点 */
    pivot?: Point;
    /** 宽 */
    width?: number;
    /** 高 */
    height?: number;
    belong_scene?: BelongScene;
};

export type FishSpriteInfo = SpriteInfo & {
    /** 有没有转向动画 */
    has_turn_animate?: boolean;
    /** 有没有死亡动画 */
    has_death_animate?: boolean;
    /** 有没有颠倒动画 */
    has_upsidedown_animate?: boolean;
    group?: Array<{
        typeId: string;
        pos: Point;
    }>;
    /** offset 是为了处理骨骼动画的中心点位置不是sprite的中心点情况 */
    offset?: number[];
};
export interface GameSprite {
    /** 枪 */
    gun: {
        [key: string]: SpriteInfo;
    };
    /** 子弹 */
    bullet: {
        [key: string]: SpriteInfo;
    };
    /** 鱼icon */
    fish_icon: {
        [key: string]: SpriteInfo;
    };
    /** 网 */
    net: {
        [key: string]: SpriteInfo;
    };
    /** 鱼阴影 */
    fish_shadow: {
        [key: string]: SpriteInfo;
    };
    /** 鱼 */
    fish: {
        [key: string]: FishSpriteInfo;
    };
    /** 技能 */
    other: {
        [key: string]: SpriteInfo;
    };
}
/** 鱼网子弹的sprite
 * img 里面是图片的地址+pivot
 * shape 里面是形状+pivot
 */
export type SpriteType =
    | 'coin'
    | 'gun'
    | 'net'
    | 'bullet'
    | 'fish'
    | 'fish_shadow'
    | 'gun_fire'
    | 'skill'
    | 'other';

export let SPRITE: GameSprite = {
    gun: {
        '1': {
            type: 'DragonBone',
            pivot: {
                x: 105,
                y: 140,
            },
            path: 'ani/gun/gun1',
        },
    },
    bullet: {
        '1': {
            type: 'Img',
            path: 'image/game/bullet1',
            pivot: {
                x: 33,
                y: 18,
            },
            width: 66,
            height: 150,
        },
        '2': {
            type: 'Img',
            path: 'image/game/bulletvip1',
            pivot: {
                x: 33,
                y: 22,
            },
            width: 66,
            height: 150,
        },
    },
    net: {
        '1': {
            type: 'Img',
            path: 'image/game/net',
            pivot: {
                x: 69,
                y: 70,
            },
        },
        '2': { as: '1' },
    },
    fish_shadow: {
        '1': {
            type: 'Img',
            path: 'images/game/fish_shadow1',
        },
    },
    fish: {
        '1': {
            type: 'DragonBone',
            offset: [20, 26, 32, 29],
            path: 'ani/fish/fish1',
        },
        '2': {
            type: 'DragonBone',
            offset: [24, 22, 39, 22],
            path: 'ani/fish/fish2',
        },
        '17': {
            type: 'DragonBone',
            offset: [240, 175, 354, 175],
            path: 'ani/fish/fish17',
        },
    },
    fish_icon: {
        '1': {
            type: 'Img',
            path: 'images/game/normal/icon_fish1',
        },
        '2': {
            type: 'Img',
            path: 'images/game/normal/icon_fish2',
        },
    },
    other: {
        coin: {
            type: 'Frame',
            pivot: {
                x: 44 / 2,
                y: 46 / 2,
            },
            width: 44,
            height: 46,
        },
    },
};
