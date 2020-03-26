import honor, { HonorDialog } from 'honor';
import { ui } from 'ui/layaMaxUI';
import { LayaSlider } from 'utils/layaSlider';
import { Handler } from 'laya/utils/Handler';
import { test_fish_list, test_skill_list } from './helpUtils';
import { SkillNameMap } from 'data/config';

type FishItemData = {
    id: string;
    num: string;
    is_special: boolean;
};
type SkillItemData = {
    id: string;
    intro: string;
};
export default class HelpPop extends ui.pop.help.helpUI implements HonorDialog {
    public isModal = true;
    private slider_glr: LayaSlider;
    public static preEnter() {
        honor.director.openDialog(HelpPop);
    }
    public onAwake() {
        this.slider_glr = new LayaSlider(this.glr);
        const { skill_list, fish_list } = this;

        fish_list.array = [];
        skill_list.array = [];
        fish_list.renderHandler = Handler.create(
            this,
            this.fishListRender,
            null,
            false,
        );
        skill_list.renderHandler = Handler.create(
            this,
            this.skillListRender,
            null,
            false,
        );
        fish_list.array = test_fish_list;
        skill_list.array = test_skill_list;
    }
    private fishListRender(item: ui.pop.help.helpItemUI, index: number) {
        const { id, num, is_special } = this.fish_list.array[
            index
        ] as FishItemData;
        const { bg, num_label, icon } = item;
        /** @lang */
        num_label.text = num + '倍';
        icon.skin = `image/pop/help/fish${id}.png`;
        const bg_num = is_special ? '' : '1';
        bg.skin = `image/pop/help/fish_item_bg${bg_num}.png`;
    }
    private skillListRender(item: ui.pop.help.skillItemUI, index: number) {
        const { skill_icon, intro_label } = item;
        const { id, intro } = this.skill_list.array[index] as SkillItemData;

        intro_label.text = intro;
        skill_icon.skin = `image/game/skill_${SkillNameMap[id]}.png`;
    }
    public onMounted() {}
}
