import { AudioCtrl } from 'ctrl/ctrlUtils/audioCtrl';
import { getCurUserId } from 'model/modelState';
import { Lang } from 'data/internationalConfig';

export function getSaveLang() {
    const save_lang =
        localStorage.getItem('lang') || localStorage.getItem('local_lang');
    let lang: Lang;
    if (save_lang === 'en-us') {
        lang = 'en' as Lang;
    } else if (save_lang === 'zh-Hant') {
        lang = 'zh' as Lang;
    }
    return lang || 'en';
}
export function getCacheBalance() {
    const user_id = getCurUserId();
    return localStorage.getItem(`${user_id}:balance`);
}
export function setCacheBalance(balance: string) {
    if (balance === undefined) {
        return;
    }
    const user_id = getCurUserId();
    return localStorage.setItem(`${user_id}:balance`, balance);
}
export function getAudio(user_id: string) {
    const voice_str = localStorage.getItem(`${user_id}:voice`);
    const music_str = localStorage.getItem(`${user_id}:music`);
    const music = music_str ? Number(music_str) : 0.5;
    const voice = voice_str ? Number(voice_str) : 0.5;
    AudioCtrl.setVoice(voice);
    AudioCtrl.setMusic(music);
    return [voice, music];
}
export function setVoice(voice: number) {
    const user_id = getCurUserId();
    AudioCtrl.setVoice(voice);
    localStorage.setItem(`${user_id}:voice`, voice + '');
}
export function setMusic(music: number) {
    const user_id = getCurUserId();
    AudioCtrl.setMusic(music);
    localStorage.setItem(`${user_id}:music`, music + '');
}
