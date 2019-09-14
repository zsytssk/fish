import honor, { HonorScene } from 'honor';
import { ui } from '../../ui/layaMaxUI';

export default class Login extends ui.scenes.loginUI implements HonorScene {
    public static async preEnter() {
        return honor.director.runScene('scenes/login.scene', '参数1', '参数2');
    }
    public onMounted(...params) {
        console.log(...params);
    }
    public onResize(width: number, height: number) {
        console.log('Scene onResize', width, height);
    }
    public onAwake(...params) {
        console.log(...params);
    }
    public onEnable(...params) {
        console.log(...params);
    }
    public onClosed() {
        // this.destroy();
    }
}
