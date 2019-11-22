import { getCurUserId, modelState } from 'model/modelState';
import { AudioCtrl } from 'ctrl/ctrlUtils/audioCtrl';

export function initUserInfo() {
    modelState.app.setting.initAudio();
}
export function getCacheBalance() {
    const user_id = getCurUserId();
    return localStorage.getItem(`${user_id}:balance`);
}
export function setCacheBalance(balance: string) {
    const user_id = getCurUserId();
    return localStorage.setItem(`${user_id}:balance`, balance);
}
export function getAudio() {
    const user_id = getCurUserId();
    const voice = Number(localStorage.getItem(`${user_id}:voice`)) || 1;
    const music = Number(localStorage.getItem(`${user_id}:music`)) || 1;
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
