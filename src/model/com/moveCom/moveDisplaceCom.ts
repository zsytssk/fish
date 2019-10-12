import { Displace, DisplaceInfo } from 'utils/displace/displace';
import { clearTick, createTick } from 'utils/tick';

type MoveUpdateFn = (displace_info: DisplaceInfo) => void;

/** 固定路径 移动控制 */
export class MoveDisplaceCom implements MoveCom {
    private displace: Displace;
    private tick_index: number;
    private is_stop = false;
    constructor(displace: Displace, update_fn: MoveUpdateFn) {
        this.displace = displace;
        this.tick_index = createTick(t => {
            if (this.is_stop) {
                return;
            }
            const info = this.displace.update(t);
            update_fn(info);
        });
    }
    public stop() {
        this.is_stop = true;
    }
    public start() {
        this.is_stop = false;
    }
    public destroy() {
        clearTick(this.tick_index);
    }
}
