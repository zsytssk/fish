import { Test } from 'testBuilder';
import honor from 'honor';
import VoicePop from 'view/pop/voice';

export const voice_test = new Test('voice', runner => {
    runner.describe('open_dialog', () => {
        return new Promise(async resolve => {
            const pop = (await honor.director.openDialog(VoicePop)) as VoicePop;
            setTimeout(() => {
                resolve();
            }, 1000);

            setTimeout(() => {}, 3000);
        }) as Promise<void>;
    });
});
