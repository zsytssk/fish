/** 资源所属场景 */
type BelongScene = 'room_normal' | 'room_poker';
/** 鱼网子弹的sprite
 * img 里面是图片的地址+pivot
 * shape 里面是形状+pivot
 */
export interface GameSprite {
    /**枪*/
    gun: {
        [key: string]: {
            as?: string;
            /** 动画类型龙骨动画 帧动画 直接图片*/
            sprite_type?: 'DragonBone' | 'Frame' | 'Img';
            /**图片的地址*/
            src?: string;
            file_name?: string;
            /**图片的中心点*/
            pivot?: Point;
            /**宽*/
            width?: number;
            /**高*/
            height?: number;
            /**炮台的类型 只有三种 单-0|双-1|三-2*/
            hole_num?: 1 | 2 | 3;
            /**炮火距离原本位置偏移*/
            fire_offset?: number;
            belong_scence?: BelongScene;
        };
    };
    gun_fire?: {
        as?: string;
        /**动画类型龙骨动画 帧动画 直接图片*/
        sprite_type?: 'DragonBone' | 'Frame' | 'Img';
        /**图片的地址*/
        src?: string;
        file_name?: string;
        /**宽*/
        width?: number;
        /**高*/
        height?: number;
        /**图片的中心点*/
        pivot?: Point;
        belong_scence?: BelongScene;
    };
    coin?: {
        as?: string;
        /**动画类型龙骨动画 帧动画 直接图片*/
        sprite_type?: 'DragonBone' | 'Frame' | 'Img';
        /**图片的地址*/
        src?: string;
        file_name?: string;
        /**宽*/
        width?: number;
        /**高*/
        height?: number;
        /**图片的中心点*/
        pivot?: Point;
        belong_scence?: BelongScene;
    };
    /**子弹*/
    bullet: {
        [key: string]: {
            as?: string;
            /** 图片|动画*/
            sprite_type?: 'DragonBone' | 'Frame' | 'Img';
            /**图片的地址*/
            src?: string;
            file_name?: string;
            /**图片的中心点*/
            pivot?: Point;
            /**宽*/
            width?: number;
            /**高*/
            height?: number;
            belong_scence?: BelongScene;
        };
    };
    /**鱼icon*/
    fish_icon: {
        [key: string]: {
            as?: string;
            /** 图片|动画*/
            sprite_type?: 'DragonBone' | 'Frame' | 'Img';
            /**图片的地址*/
            src?: string;
            file_name?: string;
            /**图片的中心点*/
            pivot?: Point;
            /**宽*/
            width?: number;
            /**高*/
            height?: number;
            belong_scence?: BelongScene;
        };
    };
    /**网*/
    net: {
        [key: string]: {
            /**和某个一样*/
            as?: string;
            /** 图片|动画*/
            sprite_type?: 'DragonBone' | 'Frame' | 'Img';
            /**图片的地址*/
            src?: string;
            file_name?: string;
            /**图片的中心点*/
            pivot?: Point;
            /**宽*/
            width?: number;
            /**高*/
            height?: number;
            belong_scence?: BelongScene;
        };
    };
    /**鱼阴影*/
    fish_shadow: {
        [key: string]: {
            /** 图片|动画*/
            as?: string;
            /**动画的类型*/
            sprite_type?: 'DragonBone' | 'Frame' | 'Img';
            /**图片的中心点*/
            src?: string;
            file_name?: string;
            pivot?: Point;
            /**宽*/
            width?: number;
            /**高*/
            height?: number;
            belong_scence?: BelongScene;
        };
    };
    /**鱼*/
    fish: {
        [key: string]: {
            /** 图片|动画*/
            as?: string;
            /**动画的类型*/
            sprite_type?: 'DragonBone' | 'Frame' | 'Img';
            /**图片的中心点*/
            file_name?: string;
            src?: string;
            pivot?: Point;
            /**宽*/
            width?: number;
            /**高*/
            height?: number;
            /**有没有转向动画*/
            has_turn_animate?: boolean;
            /**有没有死亡动画*/
            has_death_animate?: boolean;
            /**有没有颠倒动画*/
            has_upsidedown_animate?: boolean;
            group?: {
                typeId: string;
                pos: Point;
            }[];
            /**offset 是为了处理骨骼动画的中心点位置不是sprite的中心点情况*/
            offset?: number[];
            belong_scence?: BelongScene;
        };
    };
    /**技能*/
    skill: {
        [key: string]: {
            as?: string;
            big?: string;
            small?: string;
            treasure?: string;
        };
    };
    /**技能*/
    other: {
        [key: string]: {
            as?: string;
            /**动画的类型*/
            sprite_type?: 'DragonBone' | 'Frame' | 'Img';
            /**图片的中心点*/
            src?: string;
            pivot?: Point;
            width?: number;
            height?: number;
            file_name?: string;
            belong_scence?: BelongScene;
        };
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
        '2': {
            sprite_type: 'DragonBone',
            pivot: {
                x: 105,
                y: 140,
            },
            hole_num: 2,
            fire_offset: 10,
        },
        vip1: {
            sprite_type: 'DragonBone',
            pivot: {
                x: 105,
                y: 140,
            },
            hole_num: 2,
            fire_offset: 10,
        },
        vip2: {
            sprite_type: 'DragonBone',
            pivot: {
                x: 105,
                y: 140,
            },
            hole_num: 3,
        },
        vip3: {
            as: 'vip2',
        },
        vip4: {
            as: 'vip2',
        },
        vip5: {
            as: 'vip2',
        },
        vip6: {
            as: 'vip2',
        },
        vip7: {
            as: 'vip2',
        },
        vip8: {
            as: 'vip2',
        },
        vip9: {
            as: 'vip2',
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
        '2': {
            as: '1',
        },
        vip1: {
            sprite_type: 'Img',
            src: 'images/room/bulletvip1.png',
            pivot: {
                x: 33,
                y: 47,
            },
        },
        vip2: {
            sprite_type: 'Img',
            src: 'images/room/bulletvip2.png',
            pivot: {
                x: 33,
                y: 47,
            },
        },
        vip3: {
            sprite_type: 'Img',
            src: 'images/room/bulletvip3.png',
            pivot: {
                x: 33,
                y: 47,
            },
        },
        vip4: {
            sprite_type: 'Img',
            src: 'images/room/bulletvip4.png',
            pivot: {
                x: 33,
                y: 47,
            },
        },
        vip5: {
            sprite_type: 'Img',
            src: 'images/room/bulletvip5.png',
            pivot: {
                x: 33,
                y: 47,
            },
        },
        vip6: {
            sprite_type: 'Img',
            src: 'images/room/bulletvip6.png',
            pivot: {
                x: 33,
                y: 47,
            },
        },
        vip7: {
            sprite_type: 'Img',
            src: 'images/room/bulletvip7.png',
            pivot: {
                x: 33,
                y: 47,
            },
        },
        vip8: {
            sprite_type: 'Img',
            src: 'images/room/bulletvip8.png',
            pivot: {
                x: 33,
                y: 47,
            },
        },
        vip9: {
            sprite_type: 'Img',
            src: 'images/room/bulletvip9.png',
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
        '2': {
            sprite_type: 'Img',
            src: 'images/room/net.png',
            pivot: {
                x: 69,
                y: 70,
            },
        },
        vip1: {
            sprite_type: 'Img',
            src: 'images/room/netvip1.png',
            pivot: {
                x: 69,
                y: 70,
            },
        },
        vip2: {
            as: 'vip1',
        },
        vip3: {
            sprite_type: 'Img',
            src: 'images/room/netvip3.png',
            pivot: {
                x: 69,
                y: 70,
            },
        },
        vip4: {
            sprite_type: 'Img',
            src: 'images/room/netvip4.png',
            pivot: {
                x: 69,
                y: 70,
            },
        },
        vip5: {
            sprite_type: 'Img',
            src: 'images/room/netvip5.png',
            pivot: {
                x: 69,
                y: 70,
            },
        },
        vip6: {
            sprite_type: 'Img',
            src: 'images/room/netvip6.png',
            pivot: {
                x: 69,
                y: 70,
            },
        },
        vip7: {
            sprite_type: 'Img',
            src: 'images/room/netvip7.png',
            pivot: {
                x: 69,
                y: 70,
            },
        },
        vip8: {
            sprite_type: 'Img',
            src: 'images/room/netvip8.png',
            pivot: {
                x: 69,
                y: 70,
            },
        },
        vip9: {
            sprite_type: 'Img',
            src: 'images/room/netvip9.png',
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
        '2': {
            sprite_type: 'Img',
            src: 'images/room/fish_shadow2.png',
        },
        '3': {
            sprite_type: 'Img',
            src: 'images/room/fish_shadow3.png',
        },
        '4': {
            as: '3',
        },
        '5': {
            sprite_type: 'Img',
            src: 'images/room/fish_shadow5.png',
        },
        '6': {
            sprite_type: 'Img',
            src: 'images/room/fish_shadow6.png',
        },
        '7': {
            sprite_type: 'Img',
            src: 'images/room/fish_shadow7.png',
        },
        '8': {
            sprite_type: 'Img',
            src: 'images/room/fish_shadow8.png',
        },
        '9': {
            sprite_type: 'Img',
            src: 'images/room/fish_shadow9.png',
        },
        '10': {
            sprite_type: 'Img',
            src: 'images/room/fish_shadow10.png',
        },
        '11': {
            sprite_type: 'Img',
            src: 'images/room/fish_shadow11.png',
        },
        '12': {
            sprite_type: 'Img',
            src: 'images/room/fish_shadow12.png',
        },
        '13': {
            sprite_type: 'Img',
            src: 'images/room/fish_shadow13.png',
        },
        '14': {
            sprite_type: 'Img',
            src: 'images/room/fish_shadow14.png',
        },
        '15': {
            sprite_type: 'Img',
            src: 'images/room/fish_shadow15.png',
        },
        '16': {
            sprite_type: 'Img',
            src: 'images/room/fish_shadow16.png',
        },
        '17': {
            sprite_type: 'Img',
            src: 'images/room/fish_shadow17.png',
        },
        '18': {
            sprite_type: 'Img',
            src: 'images/room/fish_shadow18.png',
        },
        '19': {
            sprite_type: 'Img',
            src: 'images/room/fish_shadow19.png',
        },
        '22': {
            as: '19',
        },
        '24': {
            sprite_type: 'Img',
            src: 'images/room/fish_shadow24.png',
        },
        '26': {
            sprite_type: 'Img',
            src: 'images/room/fish_shadow28.png',
        },
        '27': {
            sprite_type: 'Img',
            src: 'images/room/fish_shadow28.png',
        },
        '28': {
            sprite_type: 'Img',
            src: 'images/room/fish_shadow28.png',
        },
        '29': {
            sprite_type: 'Img',
            src: 'images/room/fish_shadow29.png',
        },
        // "30": {},
        // "31": {},
        // "34": {},
        // "35": {},
        // "36": {},
        '37': {
            sprite_type: 'Img',
            src: 'images/room/fish_shadow37.png',
        },
        // "38": {},
        '39': {
            sprite_type: 'DragonBone',
            pivot: {
                x: 83,
                y: 355,
            },
        },
        '40': {
            sprite_type: 'Img',
            src: 'images/room/fish_shadow40.png',
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
        '3': {
            sprite_type: 'DragonBone',
            offset: [25, 21, 44, 21],
        },
        '4': {
            sprite_type: 'DragonBone',
            offset: [30, 26, 45, 26],
        },
        '5': {
            sprite_type: 'DragonBone',
            offset: [27, 30, 50, 30],
        },
        '6': {
            sprite_type: 'DragonBone',
            offset: [52, 25, 100, 20],
        },
        '7': {
            sprite_type: 'DragonBone',
            offset: [25, 20, 40, 20],
        },
        '8': {
            sprite_type: 'DragonBone',
            offset: [36, 36, 55, 36],
        },
        '9': {
            // sprite_type: "Frame",
            sprite_type: 'DragonBone',
            offset: [50, 42, 90, 42],
        },
        '10': {
            sprite_type: 'DragonBone',
            offset: [45, 48, 40, 45],
        },
        '11': {
            sprite_type: 'DragonBone',
            offset: [10, 25, 47, 25],
        },
        '12': {
            sprite_type: 'DragonBone',
            offset: [38, 28, 38, 28],
        },
        '13': {
            sprite_type: 'DragonBone',
            offset: [30, 28, 50, 28],
        },
        '14': {
            sprite_type: 'DragonBone',
            offset: [62, 38, 66, 38],
        },
        '15': {
            sprite_type: 'DragonBone',
            offset: [46, 50, 130, 55],
        },
        '16': {
            sprite_type: 'DragonBone',
            offset: [55, 35, 78, 35],
        },
        '17': {
            sprite_type: 'DragonBone',
            offset: [47, 73, 100, 73],
        },
        '18': {
            sprite_type: 'DragonBone',
            offset: [82, 54, 175, 54],
        },
        '19': {
            sprite_type: 'DragonBone',
            offset: [84, 75, 135, 75],
        },
        '20': {
            sprite_type: 'DragonBone',
            offset: [85, 191, 85, 85],
            group: [
                {
                    typeId: '10',
                    pos: {
                        x: 0,
                        y: 0,
                    },
                },
                {
                    typeId: '4',
                    pos: {
                        x: -136,
                        y: 0,
                    },
                },
                {
                    typeId: '4',
                    pos: {
                        x: 135,
                        y: 0,
                    },
                },
            ],
        },
        '21': {
            sprite_type: 'DragonBone',
            offset: [194, 182, 105, 182],
            group: [
                {
                    typeId: '17',
                    pos: {
                        x: 0,
                        y: 0,
                    },
                },
                {
                    typeId: '7',
                    pos: {
                        x: 0,
                        y: -139,
                    },
                },
                {
                    typeId: '7',
                    pos: {
                        x: -127,
                        y: 48,
                    },
                },
                {
                    typeId: '7',
                    pos: {
                        x: 124,
                        y: 48,
                    },
                },
            ],
        },
        '22': {
            as: '19',
        },
        '23': {
            sprite_type: 'DragonBone',
            group: [
                {
                    typeId: '8',
                    pos: {
                        x: -135,
                        y: -46,
                    },
                },
                {
                    typeId: '8',
                    pos: {
                        x: -28,
                        y: -48,
                    },
                },
                {
                    typeId: '8',
                    pos: {
                        x: 23,
                        y: 47,
                    },
                },
                {
                    typeId: '8',
                    pos: {
                        x: 130,
                        y: 47,
                    },
                },
            ],
            offset: [100, 188, 100, 188],
            has_upsidedown_animate: true,
        },
        '24': {
            as: '15',
        },
        '25': {
            sprite_type: 'DragonBone',
            offset: [190, 195, 167, 187],
            group: [
                {
                    typeId: '18',
                    pos: {
                        x: 0,
                        y: 0,
                    },
                },
                {
                    typeId: '15',
                    pos: {
                        x: -120,
                        y: -120,
                    },
                },
                {
                    typeId: '15',
                    pos: {
                        x: 117,
                        y: -120,
                    },
                },
                {
                    typeId: '15',
                    pos: {
                        x: 131,
                        y: 114,
                    },
                },
                {
                    typeId: '15',
                    pos: {
                        x: -120,
                        y: 114,
                    },
                },
            ],
        },
        '26': {
            sprite_type: 'DragonBone',
            offset: [140, 140, 140, 140],
        },
        '27': {
            sprite_type: 'DragonBone',
            offset: [90, 63, 170, 63],
        },
        '28': {
            sprite_type: 'DragonBone',
            offset: [50, 42, 90, 42],
        },
        '29': {
            sprite_type: 'DragonBone',
            offset: [77, 100, 70, 100],
        },
        '30': {
            sprite_type: 'DragonBone',
            offset: [127, 85, 170, 85],
        },
        '31': {
            sprite_type: 'DragonBone',
            offset: [127, 85, 170, 85],
        },
        '32': {
            sprite_type: 'DragonBone',
            offset: [154, 200, 246, 200],
        },
        '33': {
            sprite_type: 'DragonBone',
            offset: [154, 200, 246, 200],
        },
        '34': {
            sprite_type: 'DragonBone',
            offset: [157, 87, 150, 60],
            has_turn_animate: true,
            has_death_animate: true,
        },
        '35': {
            sprite_type: 'DragonBone',
            offset: [133, 100, 175, 110],
            has_turn_animate: true,
            has_death_animate: true,
        },
        '36': {
            sprite_type: 'DragonBone',
            offset: [160, 155, 180, 125],
            has_turn_animate: true,
            has_death_animate: true,
        },
        '37': {
            sprite_type: 'DragonBone',
            offset: [148, 175, 206, 175],
        },
        '38': {
            offset: [237 / 2, 243 / 2, 237 / 2, 243 / 2],
            sprite_type: 'DragonBone',
            has_turn_animate: true,
        },
        '39': {
            sprite_type: 'DragonBone',
            offset: [273, 80, 400, 80],
        },
        '40': {
            sprite_type: 'DragonBone',
            offset: [76, 88, 110, 88],
        },
        '41': {
            sprite_type: 'DragonBone',
            has_turn_animate: true,
            offset: [245, 204, 250, 206],
            belong_scence: 'room_normal',
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
        '3': {
            sprite_type: 'Img',
            src: 'images/room/normal/icon_fish3.png',
        },
        '4': {
            sprite_type: 'Img',
            src: 'images/room/normal/icon_fish4.png',
        },
        '5': {
            sprite_type: 'Img',
            src: 'images/room/normal/icon_fish5.png',
        },
        '6': {
            sprite_type: 'Img',
            src: 'images/room/normal/icon_fish6.png',
        },
        '7': {
            sprite_type: 'Img',
            src: 'images/room/normal/icon_fish7.png',
        },
        '8': {
            sprite_type: 'Img',
            src: 'images/room/normal/icon_fish8.png',
        },
        '9': {
            sprite_type: 'Img',
            src: 'images/room/normal/icon_fish9.png',
        },
        '10': {
            sprite_type: 'Img',
            src: 'images/room/normal/icon_fish10.png',
        },
        '11': {
            sprite_type: 'Img',
            src: 'images/room/normal/icon_fish11.png',
        },
        '12': {
            sprite_type: 'Img',
            src: 'images/room/normal/icon_fish12.png',
        },
        '13': {
            sprite_type: 'Img',
            src: 'images/room/normal/icon_fish13.png',
        },
        '14': {
            sprite_type: 'Img',
            src: 'images/room/normal/icon_fish14.png',
        },
        '15': {
            sprite_type: 'Img',
            src: 'images/room/normal/icon_fish15.png',
        },
        '16': {
            sprite_type: 'Img',
            src: 'images/room/normal/icon_fish16.png',
        },
        '17': {
            sprite_type: 'Img',
            src: 'images/room/normal/icon_fish17.png',
        },
        '18': {
            sprite_type: 'Img',
            src: 'images/room/normal/icon_fish18.png',
        },
        '19': {
            sprite_type: 'Img',
            src: 'images/room/normal/icon_fish19.png',
        },
        '20': {
            sprite_type: 'Img',
            src: 'images/room/normal/icon_fish20.png',
        },
        '21': {
            sprite_type: 'Img',
            src: 'images/room/normal/icon_fish21.png',
        },
        '22': {
            sprite_type: 'Img',
            src: 'images/room/normal/icon_fish22.png',
        },
        '23': {
            sprite_type: 'Img',
            src: 'images/room/normal/icon_fish23.png',
        },
        '24': {
            sprite_type: 'Img',
            src: 'images/room/normal/icon_fish24.png',
        },
        '25': {
            sprite_type: 'Img',
            src: 'images/room/normal/icon_fish25.png',
        },
        '26': {
            sprite_type: 'Img',
            src: 'images/room/normal/icon_fish26.png',
        },
        '27': {
            sprite_type: 'Img',
            src: 'images/room/normal/icon_fish27.png',
        },
        '28': {
            sprite_type: 'Img',
            src: 'images/room/normal/icon_fish28.png',
        },
        '29': {
            sprite_type: 'Img',
            src: 'images/room/normal/icon_fish29.png',
        },
        '30': {
            sprite_type: 'Img',
            src: 'images/room/normal/icon_fish30.png',
        },
        '31': {
            sprite_type: 'Img',
            src: 'images/room/normal/icon_fish31.png',
        },
        '32': {
            sprite_type: 'Img',
            src: 'images/room/normal/icon_fish32.png',
        },
        '33': {
            sprite_type: 'Img',
            src: 'images/room/normal/icon_fish33.png',
        },
        '34': {
            sprite_type: 'Img',
            src: 'images/room/normal/icon_fish34.png',
        },
        '35': {
            sprite_type: 'Img',
            src: 'images/room/normal/icon_fish35.png',
        },
        '36': {
            sprite_type: 'Img',
            src: 'images/room/normal/icon_fish35.png',
        },
        '37': {
            sprite_type: 'Img',
            src: 'images/room/normal/icon_fish35.png',
        },
        '38': {
            sprite_type: 'Img',
            src: 'images/room/normal/icon_fish35.png',
        },
        '39': {
            sprite_type: 'Img',
            src: 'images/room/normal/icon_fish35.png',
        },
        '40': {
            sprite_type: 'Img',
            src: 'images/room/normal/icon_fish36.png',
        },
    },
    skill: {
        '1001': {
            small: 'images/component/icon_gold.png',
        },
        '1002': {
            big: 'images/component/icon_diamond.png',
            small: 'images/component/icon_diamond.png',
        },
        '1003': {
            small: 'images/room/normal/icon_fishticket_small.png',
            treasure: 'images/room/normal/icon_fish_ticket_treasure.png',
        },
        '2001': {
            big: 'images/room/normal/icon_skill_magiclamp.png',
            small: 'images/room/normal/icon_skill_magiclamp_s.png',
        },
        '2002': {
            big: 'images/room/normal/icon_skill_freeze.png',
            small: 'images/room/normal/icon_skill_freeze_s.png',
        },
        '2003': {
            big: 'images/room/normal/icon_skill_trackbullet.png',
            small: 'images/room/normal/icon_skill_trackbullet_s.png',
        },
        '2004': {
            big: 'images/room/normal/icon_skill_speedupshoot.png',
            small: 'images/room/normal/icon_skill_speedupshoot_s.png',
        },
        '2005': {
            big: 'images/room/normal/icon_skill_timefunnel.png',
            small: 'images/room/normal/icon_skill_timefunnel_s.png',
        },
        '2006': {
            big: 'images/room/normal/icon_skill_piranhahorn.png',
            small: 'images/room/normal/icon_skill_piranhahorn_s.png',
        },
        '3001': {
            small: 'images/room/normal/icon_stone_origin.png',
        },
        '3002': {
            small: 'images/room/normal/icon_stone_green.png',
        },
        '3003': {
            small: 'images/room/normal/icon_stone_purple.png',
        },
        '3004': {
            small: 'images/room/normal/icon_stone_blood.png',
        },
        '3005': {
            big: 'images/room/stone.png',
            small: 'images/room/normal/icon_stone_yellow.png',
        },
        '4001': {
            small: 'images/room/normal/bomb_copper.png',
        },
        '4002': {
            small: 'images/room/normal/bomb_silver.png',
        },
        '4003': {
            small: 'images/room/normal/bomb_gold.png',
        },
        '4004': {
            small: 'images/room/normal/bomb_platinum.png',
        },
        '4005': {
            small: 'images/room/normal/bomb_nuclear.png',
        },
        '8001': {
            small: 'images/room/normal/icon_treasure_small.png',
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
        score: {
            sprite_type: 'Img',
            src: 'images/room/normal/sign_cup.png',
            pivot: {
                x: 80 / 2,
                y: 80 / 2,
            },
            width: 80,
            height: 80,
        },
        gun_fire: {
            sprite_type: 'DragonBone',
            pivot: {
                x: 98 / 2,
                y: 80 / 2,
            },
            width: 98,
            height: 95,
        },
        guide_pointer: {
            sprite_type: 'DragonBone',
            file_name: 'pointer',
        },
        skill_trackbullet_track: {
            src: 'images/room/normal/skill_trackbullet_track.png',
            sprite_type: 'Img',
            pivot: {
                x: 141 / 2,
                y: 141 / 2,
            },
        },
        skill_trackbullePoint: {
            src: 'images/room/normal/skill_trackbullet_path.png',
            sprite_type: 'Img',
            pivot: {
                x: 31 / 2,
                y: 30 / 2,
            },
        },
        skill_trackbullet_tip: {
            src: 'images/room/normal/skill_trackbullet_tip.png',
            sprite_type: 'Img',
            pivot: {
                x: 549 / 2,
                y: 54 / 2,
            },
        },
        skill_freezing: {
            sprite_type: 'DragonBone',
            pivot: {
                x: 0,
                y: 0,
            },
        },
        magic_lamp: {
            sprite_type: 'DragonBone',
            pivot: {
                x: 134,
                y: 126,
            },
        },
        piranha_horn: {
            sprite_type: 'DragonBone',
            file_name: 'piranh',
            pivot: {
                x: 134,
                y: 126,
            },
        },
        shoal_wave: {
            sprite_type: 'DragonBone',
            pivot: {
                x: 0,
                y: 0,
            },
        },
        shoal_banner: {
            sprite_type: 'DragonBone',
            pivot: {
                x: 514 / 2,
                y: 125 / 2,
            },
        },
        boss_banner: {
            sprite_type: 'DragonBone',
            pivot: {
                x: 514 / 2,
                y: 125 / 2,
            },
        },
        boss_border: {
            sprite_type: 'DragonBone',
            pivot: {
                x: 0,
                y: 0,
            },
        },
        explosion: {
            sprite_type: 'DragonBone',
            pivot: {
                x: 1334 / 2,
                y: 750 / 2,
            },
        },
        speed_up: {
            sprite_type: 'DragonBone',
            pivot: {
                x: 0,
                y: 0,
            },
        },
        gun_update: {
            sprite_type: 'DragonBone',
            pivot: {
                x: 120,
                y: 130,
            },
        },
        gun_track: {
            sprite_type: 'DragonBone',
            pivot: {
                x: 90,
                y: 90,
            },
        },
        fish_light: {
            sprite_type: 'DragonBone',
            pivot: {
                x: 39,
                y: 41,
            },
        },
        award_banner: {
            sprite_type: 'DragonBone',
            file_name: 'award_bann',
        },
        award_banner_coin: {
            sprite_type: 'DragonBone',
            file_name: 'award_banc',
        },
        award_circle: {
            sprite_type: 'DragonBone',
        },
        scence_change: {
            sprite_type: 'DragonBone',
            file_name: 'scenceChan',
        },
        bomb_copper: {
            sprite_type: 'DragonBone',
            file_name: 'bomb_cop',
            pivot: {
                x: 88,
                y: 0,
            },
        },
        bomb_nuclear: {
            sprite_type: 'DragonBone',
            file_name: 'bomb_nuc',
            pivot: {
                x: 88,
                y: 0,
            },
        },
        bomb_silver: {
            sprite_type: 'DragonBone',
            file_name: 'bomb_sil',
            pivot: {
                x: 88,
                y: 0,
            },
        },
        bomb_gold: {
            sprite_type: 'DragonBone',
            file_name: 'bomb_gold',
            pivot: {
                x: 88,
                y: 0,
            },
        },
        bomb_platinum: {
            sprite_type: 'DragonBone',
            file_name: 'bomb_plat',
            pivot: {
                x: 88,
                y: 0,
            },
        },
        bomb_explosion: {
            sprite_type: 'DragonBone',
            file_name: 'explosion',
            pivot: {
                x: 1334 / 2,
                y: 750 / 2,
            },
        },
        bomb_target: {
            sprite_type: 'DragonBone',
            file_name: 'bomb_tar',
            pivot: {
                x: 417 / 2,
                y: 417 / 2,
            },
        },
        light: {
            sprite_type: 'DragonBone',
            pivot: {
                x: 0,
                y: 187 / 2,
            },
        },
        gun_circle: {
            sprite_type: 'DragonBone',
            pivot: {
                x: 106.72,
                y: 100.24,
            },
        },
        award_gold: {
            sprite_type: 'DragonBone',
            pivot: {
                x: 100,
                y: 50,
            },
        },
        award_diamond: {
            sprite_type: 'DragonBone',
            pivot: {
                x: 100,
                y: -20,
            },
        },
        fishticket_light: {
            sprite_type: 'DragonBone',
            file_name: 'fishticketLight',
        },
        cur_player_pos_tip: {
            sprite_type: 'Img',
            src: 'images/room/cur_pos_tip.png',
            pivot: {
                x: 198 / 2,
                y: 104,
            },
        },
        bg_chat_emoji: {
            sprite_type: 'Img',
            src: 'images/room/bg_chat_emoji.png',
            pivot: {
                x: 100,
                y: 68,
            },
        },
        bg_chat_txt: {
            sprite_type: 'Img',
            src: 'images/room/bg_chat_txt.png',
            pivot: {
                x: 100 / 2,
                y: 104,
            },
        },
        txt_tip_lottery: {
            sprite_type: 'Img',
            src: 'images/room/normal/txt_tip_lottery.png',
            pivot: {
                x: 100,
                y: 44 / 2,
            },
        },
        fish41_bottom_move: {
            sprite_type: 'DragonBone',
            belong_scence: 'room_normal',
        },
        fish41_bottom_death: {
            sprite_type: 'DragonBone',
            belong_scence: 'room_normal',
        },
        fish41_enter_tip: {
            sprite_type: 'DragonBone',
            belong_scence: 'room_normal',
        },
    },
};
