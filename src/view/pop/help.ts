import honor, { HonorDialog } from 'honor';
import { openDialog } from 'honor/ui/sceneManager';
import { loadRes } from 'honor/utils/loadRes';
import { Box } from 'laya/ui/Box';
import { Handler } from 'laya/utils/Handler';

import { offLangChange, onLangChange } from '@app/ctrl/hall/hallCtrlUtil';
import { SkillMap, SkillNameMap } from '@app/data/config';
import { Lang } from '@app/data/internationalConfig';
import { ui } from '@app/ui/layaMaxUI';
import { LayaSlider } from '@app/utils/layaSlider';
import { resizeContain } from '@app/utils/layaUtils';
import { tplIntr } from '@app/utils/utils';

import { getSkillIntroList, test_fish_list } from './helpUtils';

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
    private slider_glr: LayaSlider;
    private times_tpl: string;
    public static async preEnter(index = 0) {
        const help_pop = await openDialog<HelpPop>('pop/help/help.scene');

        help_pop.goto(index);
    }
    public static async preLoad() {
        return loadRes('pop/help/help.scene');
    }
    public onAwake() {
        onLangChange(this, () => {
            this.initLang();
        });
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
    }
    public goto(index: number) {
        this.slider_glr.goto(index);
    }
    private fishListRender(item: ui.pop.help.helpItemUI, index: number) {
        const { times_tpl } = this;
        const { id, num, is_special } = this.fish_list.array[
            index
        ] as FishItemData;
        const { bg, num_label, icon } = item;
        if (num) {
            num_label.text = num + times_tpl;
        } else {
            num_label.text = '';
        }
        icon.skin = `image/pop/help/fish${id}.png`;
        const bg_num = is_special ? '' : '1';
        bg.skin = `image/pop/help/fish_item_bg${bg_num}.png`;
    }
    private skillListRender(item: ui.pop.help.skillItemUI, index: number) {
        const { skill_icon, intro_label, item_box } = item;
        const { id, intro } = this.skill_list.array[index] as SkillItemData;

        intro_label.text = intro;
        if (id !== SkillMap.Super) {
            skill_icon.skin = `image/game/skill_${SkillNameMap[id]}.png`;
        } else {
            item_box.visible = false;
            intro_label.x = 10;
            intro_label.width = (intro_label.parent as Box).width;
        }
    }
    private initLang() {
        const { title, intro1, intro2, intro3, intro31, intro4, intro41 } =
            this;

        this.times_tpl = tplIntr('times');
        this.fish_list.refresh();
        title.text = tplIntr('help');
        intro1.text = tplIntr('help1');
        intro2.text = tplIntr('help2');

        intro3.text = tplIntr('help3');
        intro31.text = tplIntr('help31');
        intro4.text = tplIntr('help4');
        intro41.text =
            tplIntr('help41') +
            `\n` +
            tplIntr('help42') +
            `\n` +
            tplIntr('help43');
        this.skill_list.array = getSkillIntroList();
        resizeContain(this.item0_wrap, 10, 'vertical');
        resizeContain(this.item1_wrap, 10, 'vertical');
        resizeContain(this.item2_wrap, 10, 'vertical');
    }
    public destroy() {
        offLangChange(this);
        super.destroy();
    }
}
