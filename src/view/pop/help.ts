import honor, { HonorDialog } from 'honor';
import { ui } from 'ui/layaMaxUI';
import { LayaSlider } from 'utils/layaSlider';
import { Handler } from 'laya/utils/Handler';
import { test_fish_list, test_skill_list } from './helpUtils';
import { SkillNameMap } from 'data/config';
import { onLangChange, offLangChange } from 'ctrl/hall/hallCtrlUtil';
import { Lang, InternationalTip } from 'data/internationalConfig';
import { resizeContain } from 'utils/layaUtils';

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
    private times_tpl: string;
    public static preEnter() {
        honor.director.openDialog(HelpPop);
    }
    public onAwake() {
        onLangChange(this, lang => {
            this.initLang(lang);
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
        skill_list.array = test_skill_list;
    }
    private fishListRender(item: ui.pop.help.helpItemUI, index: number) {
        const { times_tpl } = this;
        const { id, num, is_special } = this.fish_list.array[
            index
        ] as FishItemData;
        const { bg, num_label, icon } = item;
        /** @lang */
        num_label.text = num + times_tpl;
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
    private initLang(lang: Lang) {
        const {
            help,
            help1,
            help2,
            help2Super,
            help2Freeze,
            help2Lock,
            help2Bomb,
            help3,
            help31,
            help4,
            help41,
            help42,
            help43,
            times,
        } = InternationalTip[lang];
        const {
            title,
            intro1,
            intro2,
            intro3,
            intro31,
            intro4,
            intro41,
        } = this;

        this.times_tpl = times;
        this.fish_list.refresh();
        title.text = help;
        intro1.text = help1;
        intro2.text = help2;

        test_skill_list[0].intro = help2Bomb;
        test_skill_list[1].intro = help2Freeze;
        test_skill_list[2].intro = help2Lock;
        test_skill_list[3].intro = help2Super;
        this.skill_list.refresh();

        intro3.text = help3;
        intro31.text = help31;
        intro4.text = help4;
        intro41.text = help41 + `\n` + help42 + `\n` + help43;

        resizeContain(this.item0_wrap, 10, 'vertical');
        resizeContain(this.item1_wrap, 10, 'vertical');
        resizeContain(this.item2_wrap, 10, 'vertical');
    }
    public destroy() {
        offLangChange(this);
    }
}
