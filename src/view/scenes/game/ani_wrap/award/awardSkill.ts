import { getCurrencyIcon } from '@app/model/userInfo/userInfoUtils';
import { fade_in, sleep, tween } from '@app/utils/animate';
import { setProps } from '@app/utils/utils';
import SkillItemView from '@app/view/scenes/game/skillItemView';
import { viewState } from '@app/view/viewState';

const pool = [] as SkillItemView[];
export async function awardSkill(
    start_pos: Point,
    end_pos: Point,
    data: HitDrop[],
    currency: string,
) {
    for (const drop_item of data) {
        const { itemNum, itemId } = drop_item;

        const item_ui = createUI();
        if (itemId === '3001') {
            const icon = getCurrencyIcon(currency);
            item_ui.setIcon(icon);
        } else {
            item_ui.setId(itemId);
        }
        item_ui.setNum(itemNum);
        item_ui.pos(start_pos.x, start_pos.y);
        await fade_in(item_ui)
            .then(() => {
                return sleep(0.5);
            })
            .then(() => {
                return tween({
                    sprite: item_ui,
                    start_props: start_pos,
                    end_props: {
                        ...end_pos,
                        alpha: 0.2,
                        scaleX: 0.4,
                        scaleY: 0.4 * item_ui.scaleY,
                    },
                    time: 2 * 1000,
                }).then(() => {
                    recoverUI(item_ui);
                });
            });
    }
}

function recoverUI(item_ui: SkillItemView) {
    item_ui.removeSelf();
    item_ui.unHighlight();
    item_ui.scaleY = 1;
    pool.push(item_ui);
}
function createUI() {
    const { ani_overlay } = viewState;
    const { upside_down } = viewState.game;
    let item_ui = pool.pop();
    if (!item_ui || item_ui.destroyed) {
        item_ui = new SkillItemView();
        item_ui.pivot(item_ui.width / 2, item_ui.height / 2);
    }
    setProps(item_ui, {
        scaleX: 1,
        alpha: 1,
        scaleY: upside_down ? -1 : 1,
    });
    ani_overlay.addChild(item_ui);
    item_ui.highlight();
    return item_ui;
}
