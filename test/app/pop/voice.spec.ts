import { Test } from 'testBuilder';

import honor from 'honor';

import VoicePop from '@app/view/pop/voice';

export const voice_test = {
    open_dialog: () => {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve) => {
            const pop = await VoicePop.preEnter();
            setTimeout(() => {
                resolve();
            }, 1000);
        }) as Promise<void>;
    },
};
