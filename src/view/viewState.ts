import Game from './scenes/game/gameView';

type ViewState = {
    game: Game;
};

export const viewState = {} as ViewState;

export function addBullet(skin: string) {
    return viewState.game.addBullet(skin);
}
export function addNet(skin: string) {
    return viewState.game.addNet(skin);
}
export function getPoolMousePos() {
    return viewState.game.getPoolMousePos();
}
