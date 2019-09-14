import honor from 'honor';
import Start from 'view/scenes/start';
import { LoginCtrl } from './loginCtrl';

export class StartCtrl {
    private view: Start;
    constructor(view: Start) {
        this.view = view;
        this.init();
    }
    public static async preEnter() {
        const view = (await Start.preEnter()) as Start;
        const ctrl = new StartCtrl(view);
    }
    private init() {
        const { btn_back } = this.view;
        const { CLICK } = Laya.Event;

        btn_back.on(CLICK, this, () => {
            LoginCtrl.preEnter();
        });
    }
}
