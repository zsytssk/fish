import { Test } from 'testBuilder';
import { modelState } from 'model/modelState';
import {
    Lang,
    InternationalTip,
    InternationalTipOther,
} from 'data/internationalConfig';
import { KeyBoardNumber } from 'utils/layaKeyboard';
import { getLang } from 'ctrl/hall/hallCtrlUtil';

export const app_test = new Test('app', runner => {
    runner.describe('enter_game', () => {});
    runner.describe('set_lang', (lang: Lang) => {
        modelState.app.user_info.setLang(lang);
    });
    runner.describe('keyboard', () => {
        const lang = getLang();
        const { confirm } = InternationalTip[lang];
        const { InputEmptyWarn, Delete } = InternationalTipOther[lang];
        const keyboard = new KeyBoardNumber();
        setTimeout(() => {
            keyboard.enter('1', {
                nullMsg: InputEmptyWarn,
                delTxt: Delete,
                confirmTxt: confirm,
                float: true,
                close(type: string, value: string) {
                    console.log(type, value);
                },
            });
        }, 3000);
    });
});
