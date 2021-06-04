import { AudioCtrl } from 'ctrl/ctrlUtils/audioCtrl';
import { getLang } from 'ctrl/hall/hallCtrlUtil';
import { InternationalTip } from 'data/internationalConfig';
import { getCurUserId, getUserInfo } from 'model/modelState';
import { getItem, setItem } from 'utils/localStorage';
import AlertPop from 'view/pop/alert';
import { AccountMap } from './userInfoModel';

export function getCacheCurrency(account_map: AccountMap) {
    const platform_currency = paladin.getCurrency();
    if (platform_currency && account_map.get(platform_currency)) {
        return platform_currency;
    }
    const user_id = getCurUserId();
    return getItem(`${user_id}:balance`);
}

export function setCacheBalance(name: string, balance: any) {
    if (name === undefined) {
        return;
    }
    paladin.account.currency({
        name,
        balance,
    } as any);
    const user_id = getCurUserId();
    return setItem(`${user_id}:balance`, name);
}

export function tipPlatformCurrency() {
    const lang = getLang();
    const platform_currency = paladin.getCurrency();
    const { cur_balance } = getUserInfo();
    if (cur_balance !== platform_currency) {
        AlertPop.alert(InternationalTip[lang].platformDiffCurrencyEnterGameErr);
    }
}

export function getAudio(user_id: string) {
    const voice_str = getItem(`${user_id}:voice`);
    const music_str = getItem(`${user_id}:music`);
    const music = music_str ? Number(music_str) : 0.5;
    const voice = voice_str ? Number(voice_str) : 0.5;
    AudioCtrl.setVoice(voice);
    AudioCtrl.setMusic(music);
    return [voice, music];
}
export function setVoice(voice: number) {
    const user_id = getCurUserId();
    AudioCtrl.setVoice(voice);
    setItem(`${user_id}:voice`, voice + '');
}
export function setMusic(music: number) {
    const user_id = getCurUserId();
    AudioCtrl.setMusic(music);
    setItem(`${user_id}:music`, music + '');
}

export function getCurrencyIcon(currency?: string) {
    const { account_map } = getUserInfo();
    return account_map.get(currency)?.icon;
}
