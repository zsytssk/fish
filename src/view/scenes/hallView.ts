import { ui } from '../../ui/layaMaxUI';
import honor from 'honor';

export default class HallView extends ui.scenes.hall.hallUI {
    public static preEnter() {
        return honor.director.runScene('scenes/hall/hall.scene');
    }
    public onEnable() {}
}
