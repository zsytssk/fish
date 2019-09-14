import honor, { HonorScene } from 'honor';

export default class EmptyScene extends Laya.Scene implements HonorScene {
    public static preEnter() {
        honor.director.runScene(EmptyScene);
    }
    public onMounted() {
        console.log('EmptyScene enable');
    }
    public onOpened() {
        console.log('EmptyScene enable');
    }
}
