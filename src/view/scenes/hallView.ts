import { ui } from '../../ui/layaMaxUI';
import honor from 'honor';

export default class HallView extends ui.scenes.hall.hallUI {
    public static preEnter() {
        return honor.director.runScene('scenes/hall/hall.scene');
    }
    public onResize(width: number, height: number) {
        const { width: tw, height: th } = this;
        this.x = (width - tw) / 2;
        this.y = (height - th) / 2;
    }
    public onEnable() {}
}
