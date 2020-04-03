import { GuideMain } from './guideMain';
import { NewUserGuide } from './guideList/newUser';

/**
 * @author zhangshiyang
 * @description 新手引导配置
 */
let guide: GuideMain;
type GuideInfo = { group_id: string; functionId: string };
export let guide_arr: GuideInfo[] = [];
let running = false;
/** 跳转到特定的新手引导 */
export async function gotoGuide(group_id: string, functionId: string) {
    guide_arr.push({ group_id, functionId });
    if (!running) {
        running = true;
        triggerGuide();
    }
}

(window as any).gotoGuide = gotoGuide;

async function triggerGuide() {
    if (!guide) {
        guide = new GuideMain();
    }
    await guide.start();
    while (guide_arr.length > 0) {
        const { group_id, functionId } = guide_arr.shift();
        const guide_item = GuideConfig[group_id];
        await guide_item();
        /** 强制引导 引导结束 新手引导结束 */
        guide.onGuideUpdate(group_id, functionId);
    }
    running = false;
    guide.end();
}
/** 新手引导的配置
 * @author zhangshiyang
 */

const GuideConfig = {
    '1': async () => {
        const in_power = new NewUserGuide();
        await in_power.start('1');
    },
};
