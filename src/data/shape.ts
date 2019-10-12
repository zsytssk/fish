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
                type: 'Circle',
                radius: 20,
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
            ],
        },
        '2': {
            shape_list: [
                {
                    type: 'Box',
                    width: 50,
                    height: 50,
                    pivot: {
                        x: 25,
                        y: 30,
                    },
                },
            ],
        },
        '3': {
            shape_list: [
                {
                    type: 'Circle',
                    radius: 19,
                },
            ],
        },
        '4': {
            shape_list: [
                {
                    type: 'Circle',
                    radius: 19,
                },
            ],
        },
        '5': {
            shape_list: [
                {
                    type: 'Circle',
                    radius: 19,
                },
            ],
        },
        '6': {
            shape_list: [
                {
                    type: 'Circle',
                    radius: 19,
                },
            ],
        },
        '7': {
            shape_list: [
                {
                    type: 'Circle',
                    radius: 19,
                },
            ],
        },
        '8': {
            shape_list: [
                {
                    type: 'Circle',
                    radius: 19,
                },
            ],
        },
        '9': {
            shape_list: [
                {
                    type: 'Circle',
                    radius: 19,
                },
            ],
        },
        '10': {
            shape_list: [
                {
                    type: 'Circle',
                    radius: 19,
                },
            ],
        },
        '11': {
            shape_list: [
                {
                    type: 'Circle',
                    radius: 19,
                },
            ],
        },
        '12': {
            shape_list: [
                {
                    type: 'Circle',
                    radius: 19,
                },
            ],
        },
        '13': {
            shape_list: [
                {
                    type: 'Circle',
                    radius: 19,
                },
            ],
        },
        '14': {
            shape_list: [
                {
                    type: 'Circle',
                    radius: 19,
                },
            ],
        },
        '15': {
            shape_list: [
                {
                    type: 'Circle',
                    radius: 19,
                },
            ],
        },
        '16': {
            shape_list: [
                {
                    type: 'Circle',
                    radius: 19,
                },
            ],
        },
        '17': {
            shape_list: [
                {
                    type: 'Circle',
                    radius: 19,
                },
            ],
        },
        '18': {
            shape_list: [
                {
                    type: 'Box',
                    width: 70,
                    height: 100,
                    pivot: {
                        x: 30,
                        y: 80,
                    },
                },
            ],
        },
        '19': {
            shape_list: [
                {
                    type: 'Circle',
                    radius: 19,
                },
            ],
        },
        '20': {
            shape_list: [
                {
                    type: 'Box',
                    width: 180,
                    height: 80,
                    pivot: {
                        x: 90,
                        y: 50,
                    },
                },
            ],
        },
        // '2': {
        //     shape_list: [
        //         {
        //             type: 'Box',
        //             width: 25,
        //             height: 47,
        //             pivot: {
        //                 x: 13,
        //                 y: 19,
        //             },
        //         },
        //     ],
        // },
    },
};
