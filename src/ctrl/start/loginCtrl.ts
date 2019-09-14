import Alert from 'view/pop/alert';
import Login from 'view/scenes/login';
import { StartCtrl } from './startCtrl';

export class LoginCtrl {
    private view: Login;
    constructor(view: Login) {
        this.view = view;
        this.init();
    }
    public static async preEnter() {
        const view = (await Login.preEnter()) as Login;
        const ctrl = new LoginCtrl(view);
    }
    private init() {
        const { open_dialog, enter_start } = this.view;
        const { CLICK } = Laya.Event;
        open_dialog.on(CLICK, this, () => {
            console.log('openDialog');
            Alert.preOpen('this is a test');
        });
        enter_start.on(CLICK, this, () => {
            console.log('enter_start');
            StartCtrl.preEnter();
        });
    }
}
