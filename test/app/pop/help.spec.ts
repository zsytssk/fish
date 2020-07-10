import { Test } from 'testBuilder';
import HelpPop from 'view/pop/help';

export const help_test = new Test('help', runner => {
    runner.describe('open', async () => {
        HelpPop.preEnter();
    });
});
