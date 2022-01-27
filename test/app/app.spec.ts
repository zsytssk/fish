import { getLang } from '@app/ctrl/hall/hallCtrlUtil';
import { Lang, InternationalTip } from '@app/data/internationalConfig';
import { modelState } from '@app/model/modelState';
import { getCurrencyIcon } from '@app/model/userInfo/userInfoUtils';
import { KeyBoardNumber } from '@app/utils/layaKeyboard';

export const app_test = {
    enter_game: () => {
        //
    },
    set_lang: (lang: Lang) => {
        modelState.app.user_info.setLang(lang);
    },
    set_local_storage: (lang: Lang) => {
        const fn1 = localStorage.clear;
        localStorage.clear = function (...params) {
            console.error(`test:>`, ...params);
            fn1.bind(localStorage, ...params);
        };
        setTimeout(() => {
            localStorage.clear();
        }, 5000);
    },
    keyboard: () => {
        const lang = getLang();
        const { confirm } = InternationalTip[lang];
        const { InputEmptyWarn, Delete } = InternationalTip[lang];
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
    },

    test: (lang: Lang) => {
        getCurrencyIcon();
    },
};
