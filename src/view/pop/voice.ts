import honor, { HonorDialog } from 'honor';
import { ui } from 'ui/layaMaxUI';
import ProgressCtrl from 'utils/progressCtrl';
import { modelState } from 'model/modelState';
import { AudioRes } from 'data/audioRes';
import { AudioCtrl } from 'ctrl/ctrlUtils/audioCtrl';

/** 声音的弹出层 */
export default class VoicePop extends ui.pop.alert.voiceUI
    implements HonorDialog {
    public isModal = true;
    private music_ctrl: ProgressCtrl;
    private voice_ctrl: ProgressCtrl;
    public static preEnter() {
        AudioCtrl.play(AudioRes.PopShow);
        honor.director.openDialog(VoicePop);
    }
    public onAwake() {
        const { voice, music } = modelState.app.setting;
        const { music_progress, voice_progress } = this;
        const music_ctrl = new ProgressCtrl(music_progress, this.onMusicChange);
        const voice_ctrl = new ProgressCtrl(voice_progress, this.onVoiceChange);

        voice_ctrl.setProgress(voice);
        music_ctrl.setProgress(music);
        this.music_ctrl = music_ctrl;
        this.voice_ctrl = voice_ctrl;
    }
    private onMusicChange = (radio: number) => {
        const { setting } = modelState.app;
        setting.setMusic(radio);
    }; // tslint:disable-line
    private onVoiceChange = (radio: number) => {
        const { setting } = modelState.app;
        setting.setVoice(radio);
    }; // tslint:disable-line
    public destroy() {
        const { music_ctrl, voice_ctrl } = this;
        super.destroy();
        music_ctrl.destroy();
        voice_ctrl.destroy();
        this.music_ctrl.destroy();
        this.voice_ctrl.destroy();
    }
}
