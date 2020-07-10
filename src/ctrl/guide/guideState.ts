import { PointerGuide } from './core/pointer';
import { PromptGuide } from './core/prompt';
import GuideDialog from './guideDialog';
import { Rectangle } from 'laya/maths/Rectangle';
import { Laya } from 'Laya';
import { Sprite } from 'laya/display/Sprite';

export type Circle = {
    x;
    y;
    radius;
};
export type Shape = Rectangle | Circle;

export type GuideState = {
    guide_dialog: GuideDialog;
    prompt: PromptGuide;
    pointer: PointerGuide;
    btn_next: Sprite;
};

export const guide_state = {} as GuideState;
