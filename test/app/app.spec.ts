import { Test } from 'testBuilder';
import { modelState } from 'model/modelState';
import { Lang } from 'data/internationalConfig';

export const app_test = new Test('app', runner => {
    runner.describe('enter_game', () => {});
    runner.describe('set_lang', (lang: Lang) => {
        modelState.app.user_info.setLang(lang);
    });
});
