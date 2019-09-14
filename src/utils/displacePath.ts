import { PATH } from '../data/path';
import { zutil } from './zutil';
import { Displace, t_curve_info, t_curve, t_fish_displace_pos } from './displace';

type t_path_from = 'left' | 'right';

/**
 * 位移控制器 -- 路径
*/
export class DisplacePath extends Displace {
  private path_id: string;
  private prev_pos = {} as t_point;
  private is_reverse: boolean = false;
  /**
    * 获取鱼的路径
    * @param path_id 鱼的路径
    * @param 11 total_time 鱼总共游多长时间
    * @param used_time 鱼已经游了多长时间
  */
  constructor(path_id: string, fish_type: string, total_time: number, used_time: number, from?: t_path_from) {
    super(fish_type, total_time, used_time);
    this.path_id = path_id;
    if (from == 'right') {
      this.is_reverse = true;
    }
    this.initPath();
  }
  private initPath() {
    let path_id = this.path_id;
    let curves = [] as t_curve_info[];
    let path_info = PATH[path_id];

    let all_length = 0;
    for (let i = 0; i < path_info.length; i++) {
      let curve_info: t_curve_info, curve: t_curve;
      let path_item_info = path_info[i];
      if (path_item_info.length >= 6) {
        // 贝塞尔曲线
        curve_info = this.createBezier(path_item_info);
        curve = curve_info.curve;
      } else if (path_item_info.length == 4) {
        // 直线
        curve_info = this.createLine(path_item_info);
        curve = curve_info.curve;
      } else {
        // 不是直线也不是贝塞尔曲线 我无法画
        zutil.log(`path is niether a bezier or line, I can't make it`)
        continue;
      }

      all_length += curve_info.length;
      // 在曲线的前面添加一个直线, 用于鱼游入
      if (i == 0) {
        let curve_before = this.createSpace('before', curve.get(0), curve.derivative(0)) as t_curve_info;
        curves.push(curve_before);
        all_length += curve_before.length;
      }

      curves.push(curve_info);

      // 在曲线的后面添加一个直线, 用于鱼游出
      if (i == path_info.length - 1) {
        let curve_after = this.createSpace('after', curve.get(1), curve.derivative(1)) as t_curve_info;
        curves.push(curve_after);
        all_length += curve_after.length;
      }
    }

    let cur_length = 0
    for (let i = 0; i < curves.length; i++) {
      let curve = curves[i];
      cur_length += curve.length;
      curve.radio = cur_length / all_length;
    }

    this.curve_list = curves;
  }
  private createBezier(path_info) {
    let curve_info = {} as t_curve_info;
    let curve = new Bezier(path_info);
    curve_info.curve = curve;
    curve_info.length = curve.length();
    return curve_info;
  }
  /**
   * 更新path的时间, 通过这个计算现在的位置
   * @param update_frame 更新的帧数
   */
  public update(update_frame: number): t_fish_displace_pos {
    let used_frame = this.used_frame = this.used_frame + update_frame;
    let used_radio = used_frame / this.total_frame;
    let is_complete: boolean = false;
    if (used_radio < 0 || used_radio >= 1) {
      is_complete = true;
      return {
        is_complete: is_complete
      }
    }
    if (this.is_reverse) {
      used_radio = 1 - used_radio;
    }

    let point_info = this.getPointAtRadio(used_radio);
    let position = point_info.position;
    let direction = point_info.direction;
    if (this.is_reverse) {
      direction = direction.reverse();
    }

    return {
      position: point_info.position,
      direction: point_info.direction,
      is_complete: is_complete
    }
  }
}