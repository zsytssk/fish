type GunGlobalPos = { [key: string]: Point };
/** 坐标 */
export let Coordinates = {
    /** 桌面上四个炮的坐标坐标, 用来计算每一个炮的子弹的发射点 */
    gun_global_pos: {
        '0': {
            x: 670,
            y: 696,
        },
        '1': {
            x: 1250,
            y: 696,
        },
        '2': {
            x: 1250,
            y: 54,
        },
        '3': {
            x: 670,
            y: 54,
        },
    } as GunGlobalPos,
    /** 炮的种类对应每一个炮的开始发射点, 用来计算子弹的运动的开始位置 */
    guns_inside_pos: {
        /** 枪发射的位置 */
        start_point: {
            x: 74.5,
            y: 20,
        },
        /** 中心点 */
        origin_point: {
            x: 74.5,
            y: 74.5,
        },
    },
    /** 炮的种类对应每一个炮的开始发射点, 用来计算子弹的运动的开始位置 */
    bullet_offset: {
        '11': [0],
        '12': [15, -15],
        '13': [15, -15],
        '21': [0],
        '22': [10, -10],
        '23': [10, -10],
        '31': [0],
        '32': [10, -10],
        '33': [10, -10],
        '41': [0],
        '42': [20, -20],
        '43': [20, -20],
        '51': [0],
        '52': [0],
        '53': [0],
    },
    /** gun 在gunBox中的位置 */
    guns_inbox_pos: {
        x: 104,
        y: 78,
    },
};
