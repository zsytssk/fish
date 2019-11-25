import { viewState } from 'view/viewState';
import SkillItemView from 'view/scenes/game/skillItemView';
import { tween } from 'utils/animate';
import { setProps } from 'utils/utils';

const pool = [] as SkillItemView[];
export async function awardSkill(
    start_pos: Point,
    end_pos: Point,
    data: HitDrop[],
) {
    for (const drop_item of data) {
        const { itemNum, itemId } = drop_item;

        const item_ui = createUI();
        item_ui.setId(itemId);
        item_ui.setNum(itemNum);

        tween({
            sprite: item_ui,
            start_props: start_pos,
            end_props: {
                ...end_pos,
                alpha: 0.2,
                scaleX: 0.4,
                scaleY: 0.4 * item_ui.scaleY,
            },
            time: 5 * 1000,
        }).then(() => {
            recoverUI(item_ui);
        });
    }
}

function recoverUI(item_ui: SkillItemView) {
    item_ui.removeSelf();
    item_ui.unHighlight();
    pool.push(item_ui);
}
function createUI() {
    const { ani_wrap } = viewState;
    const { upside_down } = viewState.game;
    let item_ui = pool.pop();
    if (!item_ui) {
        item_ui = new SkillItemView();
        // item_ui.num_label.fontSize = 30;
        item_ui.pivot(item_ui.width / 2, item_ui.height / 2);
        if (upside_down) {
            item_ui.scaleY = -1;
        }
    }
    setProps(item_ui, {
        scaleX: 1,
        alpha: 1,
        scaleY: item_ui.scaleY / Math.abs(item_ui.scaleY),
    });
    ani_wrap.addChild(item_ui);
    item_ui.highlight();
    return item_ui;
}
