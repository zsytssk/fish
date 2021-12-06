import { Test } from 'testBuilder';

import HelpPop from '@app/view/pop/help';

export const help_test = {
    open: async () => {
        HelpPop.preEnter();
    },
};
