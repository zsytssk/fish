import { Sprite } from 'laya/display/Sprite';

import { SkillNameMap, ItemMap } from '@app/data/config';
import { ui } from '@app/ui/layaMaxUI';
import { playSkeleton, stopSkeleton } from '@app/utils/utils';

export default class SkillItemView extends ui.scenes.game.skillItemUI {
    private cool_mask: Sprite;
    constructor() {
        super();
        this.init();
    }
    private init() {
        const { overlay } = this;
        const cool_mask = new Sprite();
        overlay.cacheAs = 'bitmap';
        cool_mask.blendMode = 'destination-out';
        overlay.addChild(cool_mask);
        this.cool_mask = cool_mask;
        overlay.visible = false;
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
    public setIcon(url: string) {
        const { skill_icon } = this;
        skill_icon.skin = url;
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
        const angle = -90 + 360 * (1 - radio);

        graphics.clear();
        if (radio !== 0) {
            overlay.visible = true;
            graphics.drawPie(40, 41, radius, 270, angle, '#fff');
        } else {
            overlay.visible = false;
        }
    }
    /** 显示技能的冷却时间 */
    public clearCoolTime() {
        const { overlay } = this;

        overlay.visible = false;
    }
}
