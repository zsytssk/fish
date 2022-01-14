import honor, { HonorDialog } from 'honor';
import { openDialog } from 'honor/ui/sceneManager';

import { AudioCtrl } from '@app/ctrl/ctrlUtils/audioCtrl';
import { offLangChange, onLangChange } from '@app/ctrl/hall/hallCtrlUtil';
import { AudioRes } from '@app/data/audioRes';
import { modelState } from '@app/model/modelState';
import { ui } from '@app/ui/layaMaxUI';
import { formatDateTime } from '@app/utils/dayjsUtil';
import LayaProgressCtrl from '@app/utils/layaProgressCtrl';
import { tplIntr } from '@app/utils/utils';

/** 声音的弹出层 */
export default class VoicePop
    extends ui.pop.alert.voiceUI
    implements HonorDialog
{
    private music_ctrl: LayaProgressCtrl;
    private voice_ctrl: LayaProgressCtrl;
    public static preEnter() {
        openDialog('pop/alert/voice.scene', { use_exist: true });
        AudioCtrl.play(AudioRes.PopShow);
    }
    public onAwake() {
        onLangChange(this, () => {
            this.initLang();
        });

        const { voice, music } = modelState.app.setting;
        const { music_progress, voice_progress, version } = this;
        const music_ctrl = new LayaProgressCtrl(
            music_progress,
            this.onMusicChange,
        );
        const voice_ctrl = new LayaProgressCtrl(
            voice_progress,
            this.onVoiceChange,
        );

        voice_ctrl.setProgress(voice);
        music_ctrl.setProgress(music);
        this.music_ctrl = music_ctrl;
        this.voice_ctrl = voice_ctrl;

        version.text = formatDateTime(
            Number((window as any).version),
            'YYYY/MM/DD HH:mm',
        );
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
        offLangChange(this);
        music_ctrl.destroy();
        voice_ctrl.destroy();
        this.music_ctrl.destroy();
        this.voice_ctrl.destroy();

        super.destroy();
    }

    private initLang() {
        const { sound_label, music_label, title } = this;

        title.text = tplIntr('volumeSetting');
        sound_label.text = tplIntr('soundEffects');
        music_label.text = tplIntr('music');
    }
}
