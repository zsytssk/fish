export type OnProgressChange = (radio: number) => void;
export type ProgressUI = Laya.Sprite & {
    progress_btn: Laya.Sprite;
    progress_bar: Laya.ProgressBar;
};
/** 控制进度的ctrl */
export default class ProgressCtrl {
    /** 控制的ui */
    private view: ProgressUI;
    /** 改变progress的执行函数 */
    private on_progress: OnProgressChange;
    private radio: number;
    constructor(view: ProgressUI, on_progress: OnProgressChange) {
        this.view = view;
        this.on_progress = on_progress;
        this.initEvent();
    }
    private initEvent() {
        const { view } = this;
        const { progress_btn } = view;
        const {
            CLICK,
            MOUSE_DOWN,
            MOUSE_MOVE,
            MOUSE_OVER,
            MOUSE_OUT,
        } = Laya.Event;

        view.on(CLICK, this, this.onClick);
        progress_btn.on(MOUSE_DOWN, this, () => {
            Laya.stage.on(MOUSE_MOVE, this, this.onMouseMove);
            Laya.stage.on(MOUSE_OVER, this, this.onMouseOut);
            Laya.stage.on(MOUSE_OUT, this, this.onMouseOut);
        });
    }
    private onClick(e: Laya.Event) {
        e.stopPropagation();
        const { view } = this;
        const { progress_bar, progress_btn, width } = view;
        const { x } = view.getMousePoint();
        const radio = x / width;
        progress_bar.value = radio;
        progress_btn.x = x;
    }
    private onMouseMove(e: Laya.Event) {
        const { view } = this;
        e.stopPropagation();
        const { x } = view.getMousePoint();
        const { width } = view;
        let radio = x / width;

        if (radio > 1) {
            radio = 1;
        }
        if (radio < 0) {
            radio = 0;
        }
        this.setProgress(radio);
    }
    private onMouseOut(e: Laya.Event) {
        e.stopPropagation();
        Laya.stage.offAllCaller(this);
    }
    public setProgress(radio: number) {
        const { view } = this;
        const { width } = view;
        const { progress_bar, progress_btn } = view;
        if (radio === this.radio) {
            return;
        }
        this.radio = radio;
        progress_bar.value = radio;
        progress_btn.x = radio * width;
        this.on_progress(radio);
    }
    public destroy() {
        this.view = undefined;
        this.on_progress = undefined;
    }
}
