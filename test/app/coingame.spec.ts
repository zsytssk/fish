import { Test } from 'testBuilder';
import { showNav, hideNav } from 'coingame/coingameUtil';

export const coingame_test = new Test('coingame', runner => {
    runner.describe('show_nav', () => {
        showNav('zh');
    });
    runner.describe('hide_nav', () => {
        hideNav();
    });
});
