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

/** 鱼动画类型 正常 | 水平翻转 */
export type FishAniType = 'normal' | 'horizon_turn';
export type FishSpriteInfo = SpriteInfo & {
    /** 有没有转向动画 */
    ani_type?: FishAniType;
    group?: Array<{
        typeId: string;
        pos: Point;
    }>;
    /** 为了在边界给鱼添加额外的路径, 慢慢的进入|退出 */
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
                x: 76,
                y: 79,
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
            ani_type: 'horizon_turn',
        },
        '2': {
            type: 'DragonBone',
            offset: [24, 22, 39, 22],
            path: 'ani/fish/fish2',
        },
        '3': {
            type: 'DragonBone',
            offset: [20, 26, 32, 29],
            path: 'ani/fish/fish3',
            ani_type: 'horizon_turn',
        },
        '4': {
            type: 'DragonBone',
            offset: [44, 22, 39, 22],
            path: 'ani/fish/fish4',
        },
        '5': {
            type: 'DragonBone',
            offset: [20, 26, 32, 29],
            path: 'ani/fish/fish5',
        },
        '6': {
            type: 'DragonBone',
            offset: [20, 26, 32, 29],
            path: 'ani/fish/fish6',
            ani_type: 'horizon_turn',
        },
        '7': {
            type: 'DragonBone',
            offset: [24, 22, 39, 22],
            path: 'ani/fish/fish7',
            ani_type: 'horizon_turn',
        },
        '8': {
            type: 'DragonBone',
            offset: [20, 26, 32, 29],
            path: 'ani/fish/fish8',
        },
        '9': {
            type: 'DragonBone',
            offset: [24, 22, 39, 22],
            path: 'ani/fish/fish9',
        },
        '10': {
            type: 'DragonBone',
            offset: [20, 26, 32, 29],
            path: 'ani/fish/fish10',
        },
        '11': {
            type: 'DragonBone',
            offset: [24, 22, 39, 22],
            path: 'ani/fish/fish11',
            ani_type: 'horizon_turn',
        },
        '12': {
            type: 'DragonBone',
            offset: [20, 26, 32, 29],
            path: 'ani/fish/fish12',
        },
        '13': {
            type: 'DragonBone',
            offset: [24, 22, 39, 22],
            path: 'ani/fish/fish13',
        },
        '14': {
            type: 'DragonBone',
            offset: [20, 26, 32, 29],
            path: 'ani/fish/fish14',
        },
        '15': {
            type: 'DragonBone',
            offset: [24, 22, 39, 22],
            path: 'ani/fish/fish15',
        },
        '16': {
            type: 'DragonBone',
            offset: [20, 26, 32, 29],
            path: 'ani/fish/fish16',
            ani_type: 'horizon_turn',
        },
        '17': {
            type: 'DragonBone',
            offset: [24, 22, 39, 22],
            path: 'ani/fish/fish17',
        },
        '18': {
            type: 'DragonBone',
            offset: [20, 26, 32, 29],
            path: 'ani/fish/fish18',
            ani_type: 'horizon_turn',
        },
        '19': {
            type: 'DragonBone',
            offset: [24, 22, 39, 22],
            path: 'ani/fish/fish19',
            ani_type: 'horizon_turn',
        },
        '20': {
            type: 'DragonBone',
            offset: [20, 26, 32, 29],
            path: 'ani/fish/fish20',
            ani_type: 'horizon_turn',
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
