/** 音频控制器 */
export class AudioCtrl {
    private static voice: number;
    private static music: number;
    private static sound_manager = Laya.SoundManager;
    public static setVoice(voice: number) {
        this.voice = voice;
        this.sound_manager.setSoundVolume(voice);
    }
    public static setMusic(music: number) {
        music = music * 0.8;
        this.music = music;
        this.sound_manager.setMusicVolume(music);
    }
    /**
     * 播放音频
     * @param audio 音频地址
     * @param is_bg 是否是背景音乐
     */
    public static play(audio: string, is_bg = false) {
        const music = this.music || 1;
        const { playSound, playMusic } = this.sound_manager;
        const play_fn = is_bg ? playMusic : playSound;

        /** 静音不处理 */
        if (this.isMute(is_bg)) {
            return;
        }

        /** 处理播放音乐, 将背景音乐音量调小 */
        let play_callback = null;
        /** 是否重复播放 */
        let loops = 1;
        // 背景音乐
        if (is_bg) {
            // 重复播放
            loops = 0;
            this.sound_manager.setMusicVolume(music);
            this.stopAll();
        } else {
            // 如果是其他音乐 现将背景音乐音量变小 等到音乐放完 再设置回去
            this.sound_manager.setMusicVolume(music * 0.5);
            play_callback = Laya.Handler.create(null, () => {
                this.sound_manager.setMusicVolume(music);
            });
        }
        play_fn(audio, loops, play_callback);
        /** 50ms后异步执行 */
        Laya.timer.once(50, this, () => {});
    }
    /**
     * 停止播放音频
     * @param audio 音频的名称
     */
    public static stop(audio?: string) {
        const stop_fn = this.sound_manager.stopSound;
        if (!audio) {
            return true;
        }
        if (audio.indexOf('bg') !== -1) {
            this.sound_manager.stopMusic();
        }
        stop_fn(audio);
    }
    /**
     * 停止播放所有音频
     */
    public static stopAll() {
        this.sound_manager.stopAll();
    }
    /** 控制音量 */
    public static changeVolume(volume: number) {
        this.sound_manager.setMusicVolume(volume);
        this.sound_manager.setSoundVolume(volume);
    }
    public static isMute(is_bg = false) {
        if (is_bg) {
            return this.music === 0;
        }
        return this.voice === 0;
    }
}
