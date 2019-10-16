import Game from './scenes/game/gameView';

type ViewState = {
    game: Game;
};

export const viewState = {} as ViewState;

export function addBullet(skin: string, rage: boolean) {
    return viewState.game.addBullet(skin, rage);
}
export function addNet(skin: string) {
    return viewState.game.addNet(skin);
}
export function getPoolMousePos() {
    return viewState.game.getPoolMousePos();
}
export function convertPosToNode(
    pos: Laya.Point,
    ori_node: Laya.Sprite,
    target_node: Laya.Sprite,
): Laya.Point {
    const global_p = ori_node.localToGlobal(pos, true);
    return target_node.globalToLocal(global_p, true);
}
