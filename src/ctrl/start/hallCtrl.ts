import { GameCtrl } from '../game/gameCtrl';
import Start from 'view/scenes/start';
import { state } from 'ctrl/state';
import { AppPath } from 'model/appModel';

export class HallCtrl {
    private view: Start;
    constructor(view: Start) {
        this.view = view;
        this.init();
    }
    public static async preEnter() {
        const view = (await Start.preEnter()) as Start;
        const ctrl = new HallCtrl(view);
        state.app_model.changePath(AppPath.Hall);
    }
    private init() {
        const { btn_back } = this.view;
        const { CLICK } = Laya.Event;

        btn_back.on(CLICK, this, () => {
            GameCtrl.preEnter();
        });
    }
}
