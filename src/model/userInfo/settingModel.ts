import { Lang } from 'data/internationalConfig';
import { ComponentManager } from 'comMan/component';
import { EventCom } from 'comMan/eventCom';

type CoinList = Map<string, number>;
export const SettingEvent = {
    CurCoinChange: 'cur_coin_change',
    LangChange: 'lang_change',
    VoiceChange: 'voice_change',
    MusicChange: 'music_change',
};
/** 设置数据 */
export class SettingModel extends ComponentManager {
    /** 语言 */
    public lang: Lang;
    /** 当前钱币类型 */
    public cur_coin: string;
    /** 声音 */
    public voice: number;
    /** 背景音乐 */
    public music: number;
    constructor() {
        super();

        this.addCom(new EventCom());
    }
    public get event() {
        return this.getCom(EventCom);
    }
    /** 选择当前用户当前的coin类型 */
    public setCurCoin(coin: string) {
        if (coin === this.cur_coin) {
            return;
        }
        this.cur_coin = coin;
        this.event.emit(SettingEvent.CurCoinChange, coin);
    }
    public setLang(lang: Lang) {
        if (lang === this.lang) {
            return;
        }
        this.lang = lang;
        this.event.emit(SettingEvent.LangChange, lang);
    }

    public setVoice(voice: number) {
        if (voice === this.voice) {
            return;
        }
        this.voice = voice;
        this.event.emit(SettingEvent.VoiceChange, voice);
    }
    public setMusic(music: number) {
        if (music === this.music) {
            return;
        }
        this.music = music;
        this.event.emit(SettingEvent.MusicChange, music);
    }
}
