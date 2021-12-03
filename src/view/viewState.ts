import { Sprite } from 'laya/display/Sprite';
import { Point } from 'laya/maths/Point';
import { Box } from 'laya/ui/Box';

import GameView from './scenes/game/gameView';
import GrandPrixView from './scenes/grandPrix/grandPrixView';

type ViewState = {
    game: GameView | GrandPrixView;
    /** 所有的动画的芙父容器(底层) */
    ani_wrap: Box;
    /** 所有的动画的芙父容器(上层) */
    ani_overlay: Box;
};

export const viewState = {} as ViewState;

export function getGameView() {
    return viewState.game;
}
export function addBullet(skin: string, rage: boolean) {
    return viewState.game.addBullet(skin, rage);
}
export function addNet(skin: string) {
    return viewState.game.addNet(skin);
}
export function onPoolClick(once = false) {
    return viewState.game.onPoolClick(once);
}
export function offPoolClick() {
    return viewState.game.offPoolClick();
}
export function setBulletNum(num: number) {
    return viewState.game.setBulletNum(num);
}
export function onFishClick(once = false) {
    return viewState.game.onFishClick(once);
}
export function offFishClick() {
    return viewState.game.offFishClick();
}
export function getPoolMousePos() {
    return viewState.game.getPoolMousePos();
}
export function getSkillItemByIndex(idx: number) {
    return viewState.game.getSkillItemByIndex(idx);
}
export function getAutoShootSkillItem() {
    return viewState.game.getAutoShootSkillItem();
}
export function setAutoShootLight(status: boolean) {
    return viewState.game.setAutoShootLight(status);
}
export function convertPosToNode(
    pos: Point,
    ori_node: Sprite,
    target_node: Sprite,
): Point {
    const global_p = ori_node.localToGlobal(pos, true);
    return target_node.globalToLocal(global_p, true);
}
