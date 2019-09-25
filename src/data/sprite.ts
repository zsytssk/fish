/** 资源所属场景 */
type BelongScene = 'room_normal' | 'room_poker';
/** 鱼网子弹的sprite
 * img 里面是图片的地址+pivot
 * shape 里面是形状+pivot
 */

type SpriteInfo = {
    as?: string;
    /** 动画类型龙骨动画 帧动画 直接图片 */
    sprite_type?: 'DragonBone' | 'Frame' | 'Img';
    /** 图片的地址 */
    src?: string;
    /** 图片的名称 @ques 干什么的 */
    file_name?: string;
    /** 图片的中心点 */
    pivot?: Point;
    /** 宽 */
    width?: number;
    /** 高 */
    height?: number;
    belong_scence?: BelongScene;
};

type GunSpriteInfo = SpriteInfo & {
    /** 炮台的类型 只有三种 单-0|双-1|三-2 */
    hole_num?: 1 | 2 | 3;
    /** 炮火距离原本位置偏移 */
    fire_offset?: number;
};

type FishSpriteInfo = SpriteInfo & {
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
        [key: string]: GunSpriteInfo;
    };
    gun_fire?: SpriteInfo;
    coin?: SpriteInfo;
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
    skill: {
        [key: string]: {
            as?: string;
            big?: string;
            small?: string;
            treasure?: string;
        };
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
            sprite_type: 'DragonBone',
            pivot: {
                x: 105,
                y: 140,
            },
            hole_num: 1,
            fire_offset: 10,
        },
    },
    bullet: {
        '1': {
            sprite_type: 'Img',
            src: 'images/room/bullet1.png',
            pivot: {
                x: 33,
                y: 47,
            },
        },
    },
    net: {
        '1': {
            sprite_type: 'Img',
            src: 'images/room/net.png',
            pivot: {
                x: 69,
                y: 70,
            },
        },
    },
    fish_shadow: {
        '1': {
            sprite_type: 'Img',
            src: 'images/room/fish_shadow1.png',
        },
        '39': {
            sprite_type: 'DragonBone',
            pivot: {
                x: 83,
                y: 355,
            },
        },
    },
    fish: {
        '1': {
            sprite_type: 'DragonBone',
            offset: [20, 26, 32, 29],
        },
        '2': {
            sprite_type: 'DragonBone',
            offset: [24, 22, 39, 22],
        },
    },
    fish_icon: {
        '1': {
            sprite_type: 'Img',
            src: 'images/room/normal/icon_fish1.png',
        },
        '2': {
            sprite_type: 'Img',
            src: 'images/room/normal/icon_fish2.png',
        },
    },
    skill: {
        '1001': {
            small: 'images/component/icon_gold.png',
        },
    },
    other: {
        coin: {
            sprite_type: 'Frame',
            pivot: {
                x: 44 / 2,
                y: 46 / 2,
            },
            width: 44,
            height: 46,
        },
        coins: {
            sprite_type: 'DragonBone',
            pivot: {
                x: 126 / 2,
                y: 122 / 2,
            },
            width: 126,
            height: 122,
        },
        diamonds: {
            sprite_type: 'DragonBone',
            pivot: {
                x: 126 / 2,
                y: 122 / 2,
            },
            width: 126,
            height: 122,
        },
    },
};
