import { Test } from 'testBuilder';
import { coingameShowNav, coingameHideNav } from 'coingame/coingameUtil';

export const coingame_test = new Test('coingame', runner => {
    runner.describe('show_nav', () => {
        coingameShowNav('zh');
    });
    runner.describe('hide_nav', () => {
        coingameHideNav();
    });
});
