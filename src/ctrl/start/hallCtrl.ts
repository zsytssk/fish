import HallView from 'view/scenes/hallView';
import ShopPop from 'view/pop/shop';

export class HallCtrl {
    private view: HallView;
    constructor(view: HallView) {
        this.view = view;
        this.init();
    }
    public static async preEnter() {
        const view = (await HallView.preEnter()) as HallView;
        const ctrl = new HallCtrl(view);
    }
    private init() {
        const { normal_box, match_box, header } = this.view;
        const {
            btn_coin_select,
            btn_get,
            btn_charge,
            btn_buy,
            btn_home,
            btn_app,
            btn_leave,
            btn_voice,
            flag_box,
        } = header;

        const { CLICK } = Laya.Event;

        const btn_normal_try = normal_box.getChildByName('btn_try');
        const btn_normal_play = normal_box.getChildByName('btn_play');
        const btn_match_try = match_box.getChildByName('btn_try');
        const btn_match_play = match_box.getChildByName('btn_play');
        btn_normal_try.on(CLICK, this, () => {
            console.log(`btn_normal_try`);
        });
        btn_normal_play.on(CLICK, this, () => {
            console.log(`btn_normal_play`);
        });
        btn_match_try.on(CLICK, this, () => {
            console.log(`btn_match_try`);
        });
        btn_coin_select.on(CLICK, this, () => {
            console.log(`btn_coin_select`);
        });
        btn_get.on(CLICK, this, () => {
            console.log(`btn_get`);
        });
        btn_charge.on(CLICK, this, () => {
            console.log(`btn_charge`);
        });
        btn_buy.on(CLICK, this, () => {
            ShopPop.preEnter();
        });
        btn_home.on(CLICK, this, () => {
            console.log(`btn_home`);
        });
        btn_app.on(CLICK, this, () => {
            console.log(`btn_app`);
        });
        btn_home.on(CLICK, this, () => {
            console.log(`btn_home`);
        });
        btn_leave.on(CLICK, this, () => {
            console.log(`btn_leave`);
        });
        btn_voice.on(CLICK, this, () => {
            console.log(`btn_voice`);
        });
        flag_box.on(CLICK, this, () => {
            console.log(`flag_box`);
        });
    }
}
