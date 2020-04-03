import { PromptPos, TipData } from './prompt';
import { guide_state, Shape } from '../guideState';
import { Sprite } from 'laya/display/Sprite';
import { Point as LayaPoint } from 'laya/maths/Point';
import { Rectangle } from 'laya/maths/Rectangle';
import { Event } from 'laya/events/Event';
import { Laya } from 'Laya';
import { fade_in, fade_out } from 'utils/animate';

export function getBoundsOfNode(
    node: Sprite,
    target: Sprite,
    blur: number = 5,
) {
    const half_blur = blur / 2;
    let start = node.localToGlobal(new LayaPoint(-half_blur, -half_blur));
    start = target.globalToLocal(start, true);
    let end = node.localToGlobal(
        new LayaPoint(node.width + half_blur, node.height + half_blur),
    );
    end = target.globalToLocal(end, true);

    const { x, y } = start;
    const width = end.x - x;
    const height = end.y - y;

    return {
        x,
        y,
        width,
        height,
    };
}

export function getPromptByShape(shape: Shape, pos: PromptPos, space = 10) {
    const { prompt } = guide_state;
    const prompt_size = prompt.getSize();
    let result: Point;
    if (shape instanceof Rectangle) {
        const { x, y, width, height } = shape;
        switch (pos) {
            case 'top':
                result = {
                    x,
                    y: y - prompt_size.height - space,
                };
                break;
            case 'right':
                result = {
                    x: x + width + space,
                    y,
                };
                break;
            case 'bottom':
                result = {
                    x,
                    y: y + height + space,
                };
                break;
            case 'left':
                result = {
                    x: x - prompt_size.width - space,
                    y,
                };
                break;
        }
    } else {
        const { x, y, radius } = shape;
        switch (pos) {
            case 'top':
                result = {
                    x: x - radius,
                    y: y - radius - prompt_size.height - space,
                };
                break;
            case 'right':
                result = {
                    x: x + radius + space,
                    y: y - radius,
                };
                break;
            case 'bottom':
                result = {
                    x: x - radius,
                    y: y + radius + space,
                };
                break;
            case 'left':
                result = {
                    x: x - radius - prompt_size.width - space,
                    y: y - radius,
                };
                break;
        }
    }

    return result;
}

export function triggerClick(node: Sprite) {
    node.event(Event.CLICK, { type: Event.CLICK });
}
export function awaitStageClick() {
    return new Promise((resolve, reject) => {
        Laya.stage.on(Event.CLICK, this, () => {
            resolve();
        });
    });
}

/** 在按钮旁显示提示 高亮提示 */
export async function showPromptByNode(
    node: Sprite,
    msg: TipData,
    dir = 'top' as PromptPos,
    force = true,
) {
    const { guide_dialog } = guide_state;
    const { x, y, width, height } = getBoundsOfNode(node, guide_dialog);

    const shape = new Rectangle(x, y, width, height);

    await showPromptByShape(shape, msg, dir, force);
}
/** 在按钮旁显示提示 高亮提示 */
export async function showPromptByShape(
    shape: Shape,
    msg: TipData,
    dir = 'top' as PromptPos,
    force = true,
) {
    const extra_space = 20;
    const { guide_dialog, prompt, btn_next } = guide_state;
    shape = extraShape(shape, extra_space);
    const pos = getPromptByShape(shape, dir);

    prompt.prompt({ pos, dir }, msg, false).then(() => {
        fade_in(btn_next);
        btn_next.visible = true;
        btn_next.once(Event.CLICK, btn_next, () => {
            guide_dialog.forceNext();
            fade_out(btn_next);
        });
    });
    await guide_dialog.drawBlankWaitClick(shape, force);
    await prompt.hide();
    guide_dialog.clearBlank();
}

/** 扩大shape */
export function extraShape(shape: Shape, extra: number) {
    if (shape instanceof Rectangle) {
        const { x, y, width, height } = shape;
        return new Rectangle(
            x - extra / 2,
            y - extra / 2,
            width + extra,
            height + extra,
        );
    } else {
        const { radius, ...other } = shape;
        return {
            ...other,
            radius: radius + extra / 2,
        };
    }
}
