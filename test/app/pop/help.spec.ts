import { Test } from 'testBuilder';

import HelpPop from '@app/view/pop/help';

export const help_test = new Test('help', (runner) => {
    runner.describe('open', async () => {
        HelpPop.preEnter();
    });
});
