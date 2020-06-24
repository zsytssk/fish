import { SkillNameMap, ItemMap } from 'data/config';
import { Sprite } from 'laya/display/Sprite';
import { ui } from 'ui/layaMaxUI';
import { playSkeleton, stopSkeleton } from 'utils/utils';

export default class SkillItemView extends ui.scenes.game.skillItemUI {
    private cool_mask: Sprite;
    constructor() {
        super();
        this.init();

        if (!(window as any).test1) {
            (window as any).test1 = this;
        }
    }
    private init() {
        const { overlay } = this;
        const cool_mask = new Sprite();
        overlay.mask = cool_mask;
        overlay.visible = true;
        this.cool_mask = cool_mask;
    }
    public setId(skill_id: string) {
        const { skill_icon } = this;
        let name = SkillNameMap[skill_id];
        if (name) {
            skill_icon.skin = `image/game/skill_${name}.png`;
        } else {
            name = ItemMap[skill_id];
            skill_icon.skin = `image/common/coin/${name}.png`;
        }
    }
    public setNum(num: number) {
        const { num_label } = this;
        let num_str = num + '';
        if (num > 99999) {
            num_str = `99999+`;
        }
        num_label.text = num_str;
    }
    public highlight() {
        const { border_light } = this;
        border_light.visible = true;
        playSkeleton(border_light, 0, true);
    }
    public unHighlight() {
        const { border_light } = this;
        border_light.visible = false;
        stopSkeleton(border_light);
    }
    public setShortcut(name: string) {
        const { shortcut_label } = this;
        shortcut_label.visible = true;
        shortcut_label.text = name;
    }
    /** 显示技能的冷却时间 */
    public showCoolTime(radio: number) {
        const { cool_mask, overlay } = this;
        const graphics = cool_mask.graphics;
        const radius = 60;
        const end_angle = 360 - 90;
        const angle = Math.round((1 - radio) * 360 - 90);
        graphics.clear();

        console.log(`test:>showCoolTime`, angle, end_angle);
        if (radio !== 0) {
            graphics.drawPie(40, 41, radius, angle, end_angle, '#fff');
            // overlay.visible = true;
        } else {
            // overlay.visible = false;
        }
    }
    /** 显示技能的冷却时间 */
    public clearCoolTime() {
        const { overlay } = this;

        // overlay.visible = false;
    }
}
