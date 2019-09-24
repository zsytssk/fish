
export type ShapeDirection = 'normal' | 'turn' | 'fix' | 'upsidedown';

/** 鱼网子弹的形状
 * shape 里面是形状+pivot
*/
export type shape_type = 'Box' | 'Circle' | 'Polygon';
type shape_info = {
  /**形状的类型 矩形 圆 多边形*/
  type?: shape_type,
  /**box的宽*/
  width?: number,
  /**box的高*/
  height?: number,
  /**圆的半径*/
  radius?: number,
  /**多边形的点*/
  points?: number[],
  /**形状的中心点位置 -- 多边形*/
  pivot?: Point;
  /**相对中心点位置 -- 圆*/
  position?: Point;
};

/**形状的参数 */
export type t_shape_info_item = {
  as?: string;
  shape_list?: shape_info[],
  shape_direction?: ShapeDirection,
  fix_direction?: boolean, // 在turn的时候形状是否不变化
}
interface i_shape {
  /**子弹*/
  bullet: t_shape_info_item,
  /**网*/
  net: t_shape_info_item,
  /**鱼*/
  fish: {
    [key: string]: t_shape_info_item
  }
}
/*单个形状的信息*/
export type t_shape_item = {
  /**形状*/
  shape: SAT.Polygon | SAT.Circle;
  /**形状在body中的位置*/
  position?: SAT.Vector;
  /**形状的类型*/
  type: shape_type;
}
export type t_shapes = t_shape_item[];
/**形状来源的类型*/
export type t_shape_origin = 'fish' | 'bullet' | 'net';

/** 鱼网子弹的sprite
 * img 里面是图片的地址+pivot
 * shape 里面是形状+pivot
*/
export let SHAPE: i_shape = {
  "bullet": {
    shape_list: [{
      type: 'Box',
      width: 20,
      height: 50
    }],
  },
  "net": {
    shape_list: [{
      type: 'Circle',
      radius: 67
    }]
  },
  "fish": {
    "1": {
      shape_list: [{
        type: 'Box',
        "width": 19,
        "height": 32,
        "pivot": {
          "x": 10,
          "y": 10
        }
      }]
    },
    "2": {
      shape_list: [{
        "type": "Box",
        "width": 26,
        "height": 38,
        "pivot": {
          "x": 12,
          "y": 17
        }
      }]
    },
    "3": {
      shape_list: [{
        "type": "Box",
        "width": 25,
        "height": 47,
        "pivot": {
          "x": 13,
          "y": 19
        }
      }]
    },
    "4": {
      shape_list: [{
        "type": "Box",
        "width": 29,
        "height": 51,
        "pivot": {
          "x": 15,
          "y": 23
        }
      }]
    },
    "5": {
      shape_list: [{
        "type": "Box",
        "width": 42,
        "height": 55,
        "pivot": {
          "x": 22,
          "y": 23
        }
      }]
    },
    "6": {
      shape_list: [{
        "type": "Box",
        "width": 30,
        "height": 100,
        "pivot": {
          "x": 13,
          "y": 47
        }
      }]
    },
    "7": {
      shape_list: [{
        "type": "Box",
        "width": 29,
        "height": 53,
        "pivot": {
          "x": 16,
          "y": 25
        }
      }]
    },
    "8": {
      shape_list: [{
        "type": "Box",
        "width": 34,
        "height": 58,
        "pivot": {
          "x": 18,
          "y": 30
        }
      }]
    },
    "9": {
      shape_list: [{
        type: 'Box',
        width: 48,
        height: 58,
        pivot: {
          x: 24,
          y: 33
        }
      }],
      shape_direction: 'fix'
    },
    "10": {
      shape_list: [{
        "type": "Box",
        "width": 43,
        "height": 70,
        "pivot": {
          "x": 21,
          "y": 45
        }
      }]
    },
    "11": {
      shape_list: [{
        "type": "Box",
        "width": 21,
        "height": 50,
        "pivot": {
          "x": 10,
          "y": 23
        }
      }]
    },
    "12": {
      shape_list: [{
        "type": "Box",
        "width": 38,
        "height": 62,
        "pivot": {
          "x": 19,
          "y": 33
        }
      }]
    },
    "13": {
      shape_list: [{
        "type": "Box",
        "width": 25,
        "height": 55,
        "pivot": {
          "x": 13,
          "y": 30
        }
      }]
    },
    "14": {
      shape_list: [{
        "type": "Box",
        "width": 31,
        "height": 69,
        "pivot": {
          "x": 15,
          "y": 40
        }
      }]
    },
    "15": {
      shape_list: [{
        "type": "Box",
        "width": 60,
        "height": 87,
        "pivot": {
          "x": 31,
          "y": 46
        }
      }]
    },
    "16": {
      shape_list: [{
        "type": "Box",
        "width": 40,
        "height": 62,
        "pivot": {
          "x": 20,
          "y": 34
        }
      }]
    },
    "17": {
      shape_list: [{
        "type": "Box",
        "width": 85,
        "height": 62,
        "pivot": {
          "x": 43,
          "y": 34
        }
      }]
    },
    "18": {
      shape_list: [{
        "type": "Box",
        "width": 46,
        "height": 166,
        "pivot": {
          "x": 22,
          "y": 82
        }
      }]
    },
    "19": {
      shape_list: [{
        "type": "Box",
        "width": 77,
        "height": 150,
        "pivot": {
          "x": 41,
          "y": 73
        }
      }]
    },
    "20": {
      shape_list: [{
        radius: 166 / 2,
        type: 'Circle',
      }, {
        radius: 100 / 2,
        type: 'Circle',
        position: {
          x: -136,
          y: 0
        }
      }, {
        radius: 100 / 2,
        type: 'Circle',
        position: {
          x: 135,
          y: 0
        }
      }],
      shape_direction: 'fix'
    },
    "21": {
      shape_list: [{
        radius: 165 / 2,
        type: 'Circle',
      }, {
        radius: 98 / 2,
        type: 'Circle',
        position: {
          x: 0,
          y: -139
        }
      }, {
        radius: 98 / 2,
        type: 'Circle',
        position: {
          x: -127,
          y: 48
        }
      }, {
        radius: 98 / 2,
        type: 'Circle',
        position: {
          x: 124,
          y: 48
        }
      }],
      shape_direction: 'upsidedown'
    },
    "22": {
      as: '19'
    },
    "23": {
      shape_list: [{
        radius: 100 / 2,
        type: 'Circle',
        position: {
          x: -135,
          y: -45
        }
      }, {
        radius: 100 / 2,
        type: 'Circle',
        position: {
          x: -28,
          y: -48
        }
      }, {
        radius: 100 / 2,
        type: 'Circle',
        position: {
          x: 23,
          y: 47
        }
      }, {
        radius: 100 / 2,
        type: 'Circle',
        position: {
          x: 130,
          y: 47
        }
      }],
      shape_direction: 'fix'
    },
    "24": {
      as: "15"
    },
    "25": {
      shape_list: [{
        radius: 200 / 2,
        type: 'Circle',
      }, {
        radius: 124 / 2,
        type: 'Circle',
        position: {
          x: -120,
          y: -120
        }
      }, {
        radius: 124 / 2,
        type: 'Circle',
        position: {
          x: 117,
          y: -120
        }
      }, {
        radius: 124 / 2,
        type: 'Circle',
        position: {
          x: 131,
          y: 114
        }
      }, {
        radius: 124 / 2,
        type: 'Circle',
        position: {
          x: -120,
          y: 114
        }
      }],
      shape_direction: 'fix'
    },
    "26": {
      shape_list: [{
        "type": "Circle",
        "radius": 95,
        "position": {
          "x": 0,
          "y": 0
        }
      }]
    },
    "27": {
      shape_list: [{
        "type": "Box",
        "width": 58,
        "height": 185,
        "pivot": {
          "x": 30,
          "y": 90
        }
      }]
    },
    "28": {
      shape_list: [{
        "type": "Box",
        "width": 82,
        "height": 99,
        "pivot": {
          "x": 41,
          "y": 50
        }
      }],
      shape_direction: 'fix'
    },
    "29": {
      shape_list: [{
        "type": "Box",
        "width": 79,
        "height": 133,
        "pivot": {
          "x": 42,
          "y": 76
        }
      }]
    },
    "30": {
      shape_list: [{
        "type": "Box",
        "width": 93,
        "height": 270,
        "pivot": {
          "x": 45,
          "y": 126
        }
      }],
      shape_direction: 'fix'
    },
    "31": {
      as: '30'
    },
    "32": {
      shape_list: [{
        "type": "Box",
        "width": 136,
        "height": 268,
        "pivot": {
          "x": 71,
          "y": 115
        }
      }]
    },
    "33": {
      shape_list: [{
        "type": "Box",
        "width": 136,
        "height": 268,
        "pivot": {
          "x": 71,
          "y": 115
        }
      }]
    },
    "34": {
      shape_list: [{
        "type": "Box",
        "width": 147,
        "height": 305,
        "pivot": {
          "x": 61,
          "y": 157
        }
      }],
      shape_direction: 'turn'
    },
    "35": {
      shape_list: [{
        "type": "Box",
        "width": 66,
        "height": 212,
        "pivot": {
          "x": 33,
          "y": 106
        }
      }],
      shape_direction: 'turn'
    },
    "36": {
      shape_list: [{
        "type": "Box",
        "width": 60,
        "height": 272,
        "pivot": {
          "x": 30,
          "y": 136
        }
      }],
      shape_direction: 'turn'
    },
    "37": {
      shape_list: [{
        "type": "Box",
        "width": 141,
        "height": 293,
        "pivot": {
          "x": 68,
          "y": 148
        }
      }]
    },
    "38": {
      shape_list: [{
        type: 'Circle',
        radius: 119,
      }],
      shape_direction: 'fix'
    },
    "39": {
      shape_list: [{
        "type": "Box",
        "width": 67,
        "height": 660,
        "pivot": {
          "x": 34,
          "y": 273
        }
      }]
    },
    "40": {
      shape_list: [{
        "type": "Box",
        "width": 110,
        "height": 160,
        "pivot": {
          "x": 54,
          "y": 76
        }
      }]
    },
    "41": {
      shape_list: [{
        type: 'Box',
        width: 70,
        height: 414,
        pivot: {
          x: 36,
          y: 207
        }
      }],
      shape_direction: 'turn',
      fix_direction: true,
    }
  }
}