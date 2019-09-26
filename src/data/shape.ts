/** 形状方向: 正常 | 左右 | 固定 | 上下 */
export type ShapeOriDirection = 'normal' | 'turn' | 'fix' | 'upsidedown';

/** 鱼网子弹的形状
 * shape 里面是形状+pivot
 */
export type shape_type = 'Box' | 'Circle' | 'Polygon';

type ShapeOriInfo = {
    /** 形状的类型 矩形 圆 多边形 */
    type?: shape_type;
    /** box的宽 */
    width?: number;
    /** box的高  */
    height?: number;
    /** 圆的半径 */
    radius?: number;
    /** 多边形的点  */
    points?: number[];
    /** 形状的中心点位置 -- 多边形 */
    pivot?: Point;
    /** 相对中心点位置 -- 圆 */
    position?: Point;
};

/** 形状的参数 */
export type shapeOriInfoItem = {
    as?: string;
    shape_list?: ShapeOriInfo[];
    shape_direction?: ShapeOriDirection;
    fix_direction?: boolean; // 在turn的时候形状是否不变化
};
interface ShapeOriData {
    /** 子弹 */
    bullet: shapeOriInfoItem;
    /** 网 */
    net: shapeOriInfoItem;
    /** 鱼 */
    fish: {
        [key: string]: shapeOriInfoItem;
    };
}
/*单个形状的信息*/
export type t_shape_item = {
    /** 形状  */
    shape: SAT.Polygon | SAT.Circle;
    /** 形状在body中的位置 */
    position?: SAT.Vector;
    /** 形状的类型 */
    type: shape_type;
};
export type t_shapes = t_shape_item[];
/** 形状来源的类型 */
export type ShapeOriType = 'fish' | 'bullet' | 'net';

/** 鱼网子弹的sprite
 * img 里面是图片的地址+pivot
 * shape 里面是形状+pivot
 */
export let SHAPE: ShapeOriData = {
    bullet: {
        shape_list: [
            {
                type: 'Box',
                width: 20,
                height: 50,
                pivot: {
                    x: 10,
                    y: 50,
                },
            },
        ],
    },
    net: {
        shape_list: [
            {
                type: 'Circle',
                radius: 67,
            },
        ],
    },
    fish: {
        '1': {
            shape_list: [
                {
                    type: 'Circle',
                    radius: 19,
                },
                // {
                //     type: 'Box',
                //     width: 19,
                //     height: 32,
                //     pivot: {
                //         x: 10,
                //         y: 10,
                //     },
                // },
            ],
        },
        '2': {
            shape_list: [
                {
                    type: 'Circle',
                    radius: 19,
                },
            ],
        },
        '3': {
            shape_list: [
                {
                    type: 'Box',
                    width: 25,
                    height: 47,
                    pivot: {
                        x: 13,
                        y: 19,
                    },
                },
            ],
        },
        '4': {
            shape_list: [
                {
                    type: 'Box',
                    width: 29,
                    height: 51,
                    pivot: {
                        x: 15,
                        y: 23,
                    },
                },
            ],
        },
        '5': {
            shape_list: [
                {
                    type: 'Box',
                    width: 42,
                    height: 55,
                    pivot: {
                        x: 22,
                        y: 23,
                    },
                },
            ],
        },
        '6': {
            shape_list: [
                {
                    type: 'Box',
                    width: 30,
                    height: 100,
                    pivot: {
                        x: 13,
                        y: 47,
                    },
                },
            ],
        },
        '7': {
            shape_list: [
                {
                    type: 'Box',
                    width: 29,
                    height: 53,
                    pivot: {
                        x: 16,
                        y: 25,
                    },
                },
            ],
        },
        '8': {
            shape_list: [
                {
                    type: 'Box',
                    width: 34,
                    height: 58,
                    pivot: {
                        x: 18,
                        y: 30,
                    },
                },
            ],
        },
        '9': {
            shape_list: [
                {
                    type: 'Box',
                    width: 48,
                    height: 58,
                    pivot: {
                        x: 24,
                        y: 33,
                    },
                },
            ],
            shape_direction: 'fix',
        },
        '10': {
            shape_list: [
                {
                    type: 'Box',
                    width: 43,
                    height: 70,
                    pivot: {
                        x: 21,
                        y: 45,
                    },
                },
            ],
        },
    },
};
