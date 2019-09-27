import { Displace, DisplaceInfo } from 'utils/displace/displace';
import { clearTick, createTick } from 'utils/tick';

type MoveUpdateFn = (displace_info: DisplaceInfo) => void;

/** 固定路径 移动控制 */
export class MoveDisplaceCom {
    private displace: Displace;
    private tick_index: number;
    constructor(displace: Displace, update_fn: MoveUpdateFn) {
        this.displace = displace;
        this.tick_index = createTick(t => {
            const info = this.displace.update(t);
            update_fn(info);
        });
    }
    public destroy() {
        clearTick(this.tick_index);
    }
}
