import honor, { HonorDialog } from 'honor';
import { openDialog } from 'honor/ui/sceneManager';
import { Event } from 'laya/events/Event';

import { offLangChange, onLangChange } from '@app/ctrl/hall/hallCtrlUtil';
import { ui } from '@app/ui/layaMaxUI';
import { tplIntr, tplStr } from '@app/utils/utils';

type RewardData = {
    type: string;
    num: number;
};

const tip_tpl1 = `<div style="width: 392px;height: 32px;line-height:32px;font-size: 24px;color:#d3d6ff;align:center;"><span>{tip}</span><span style="margin-right: 10px;">&nbsp;{name}&nbsp;</span><span color="#ffdd76">{num}</span></div>`;

const tip_tpl2 = `<div style="width: 392px;height: 32px;line-height:32px;font-size: 24px;color:#d3d6ff;align:center;"><span>{tip}</span><span color="#ffdd76" style="margin-right: 10px;">&nbsp;{num}&nbsp;</span><span>{name}</span></div>`;
/** 恭喜获得提示框 */
export default class RewardPop
    extends ui.pop.lottery.rewardUI
    implements HonorDialog
{
    private close_resolve: () => void;
    public static async preEnter(data: RewardData) {
        const pop = (await openDialog('pop/lottery/reward.scene')) as RewardPop;

        await pop.showReward(data);
    }
    public onAwake() {
        onLangChange(this, () => {
            this.initLang();
        });

        const { btn_confirm } = this;
        btn_confirm.on(Event.CLICK, this, () => {
            this.close();
        });
    }
    private initLang() {
        const { btn_confirm_label } = this;

        btn_confirm_label.text = tplIntr('confirm');
    }
    public showReward(data: RewardData) {
        return new Promise<void>((resolve, _reject) => {
            const { item_num, item_type, bullet_icon, bullet_num, txt_label } =
                this;

            this.close_resolve = resolve;
            const { type, num } = data;

            const is_bullet = type === 'bullet';
            const name = is_bullet ? tplIntr('bullet') : type;
            const num_str = num + '';
            if (is_bullet) {
                txt_label.innerHTML = tplStr(tip_tpl1, {
                    tip: tplIntr('luckyDrawTip2'),
                    name,
                    num: `x${num}`,
                });
            } else {
                txt_label.innerHTML = tplStr(tip_tpl2, {
                    tip: tplIntr('luckyDrawTip2'),
                    name,
                    num,
                });
            }

            item_num.visible =
                item_type.visible =
                bullet_icon.visible =
                bullet_num.visible =
                    false;
            if (is_bullet) {
                bullet_icon.visible = bullet_num.visible = true;
                bullet_num.text = num_str;
            } else {
                item_num.visible = item_type.visible = true;
                item_num.text = num_str;
                item_type.text = type.toUpperCase();
            }

            let scale2 = 1 / (type.length / 4);
            let scale = 1 / (num_str.length / 4);
            scale = scale > 1 ? 1 : scale;
            scale2 = scale2 > 0.95 ? 0.95 : scale2;
            item_num.scale(scale, scale);
            item_type.scale(scale2, scale2);
        });
    }
    public onClosed() {
        this.close_resolve?.();
    }
    public destroy() {
        offLangChange(this);
        super.destroy();
    }
}
