import { Displace, DisplaceInfo } from 'utils/displace/displace';
import { clearAll, loop } from 'utils/zTimer';

type MoveUpdateFn = (displace_info: DisplaceInfo) => void;

/** 移动控制component */
export class MoveCom {
    private displace: Displace;
    constructor(displace: Displace, update_fn: MoveUpdateFn) {
        this.displace = displace;

        loop(
            t => {
                const info = this.displace.update(t);
                update_fn(info);
            },
            30,
            this,
        );
    }
    public destroy() {
        clearAll(this);
    }
}
