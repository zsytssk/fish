import { Test } from 'testBuilder';
import { gotoGuide } from 'ctrl/guide/guideConfig';

export const guide_test = new Test('guide', (runner) => {
    runner.describe('guide', () => {
        gotoGuide('1', '1');
    });
});
