import honor, { HonorDialog } from 'honor';
import { ui } from 'ui/layaMaxUI';
import { getLang, onLangChange } from 'ctrl/hall/hallCtrlUtil';
import { InternationalTip, Lang } from 'data/internationalConfig';
import { Event } from 'laya/events/Event';

type RewardData = {
    type: string;
    num: number;
};
/** 恭喜获得提示框 */
export default class RewardPop extends ui.pop.lottery.rewardUI
    implements HonorDialog {
    public isModal = true;
    public static async preEnter(data: RewardData) {
        const pop = (await honor.director.openDialog({
            dialog: RewardPop,
            use_exist: true,
        })) as RewardPop;
        pop.showReward(data);
    }
    public onAwake() {
        const {} = this;
        onLangChange(this, lang => {
            this.initLang(lang);
        });

        const { btn_confirm } = this;
        btn_confirm.on(Event.CLICK, this, () => {
            this.close();
        });
    }
    private initLang(lang: Lang) {
        const { btn_confirm_label } = this;
        const { confirm } = InternationalTip[lang];

        btn_confirm_label.text = confirm;
    }
    public showReward(data: RewardData) {
        const lang = getLang();
        const { luckyDrawTip2, bullet } = InternationalTip[lang];
        const {
            item_num,
            item_type,
            bullet_icon,
            bullet_num,
            txt_label,
        } = this;
        const { type, num } = data;

        const is_bullet = type === 'bullet';
        const name = is_bullet ? bullet : type;
        const num_str = num + '';
        if (is_bullet) {
            txt_label.text = luckyDrawTip2 + `${name}x${num}`;
        } else {
            txt_label.text = luckyDrawTip2 + `${num}${name}`;
        }

        item_num.visible = item_type.visible = bullet_icon.visible = bullet_num.visible = false;
        if (is_bullet) {
            bullet_icon.visible = bullet_num.visible = true;
            bullet_num.text = num_str;
        } else {
            item_num.visible = item_type.visible = true;
            item_num.text = num_str;
            item_type.skin = `image/pop/lottery/txt_${type.toLowerCase()}.png`;
        }

        let scale = 1 / (num_str.length / 4);
        scale = scale > 1 ? 1 : scale;
        item_num.scale(scale, scale);
    }
}
