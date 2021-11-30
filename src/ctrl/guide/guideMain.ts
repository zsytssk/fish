import Honor from 'honor';

import { setStyle } from '@app/utils/animate';

import { PointerGuide } from './core/pointer';
import { PromptGuide } from './core/prompt';
import GuideDialog from './guideDialog';
import { guide_state } from './guideState';

/** 新手引导主类
 * @author zhangshiyang
 */
export class GuideMain {
    public name = 'guide_main';
    public guide_dialog: GuideDialog;
    public prompt: PromptGuide;
    public pointer: PointerGuide;

    public async start() {
        await this.init();
    }
    public onGuideUpdate(groupId: string, functionId: string) {
        // empty
    }
    public async init() {
        if (this.guide_dialog) {
            await Honor.director.openDialog(this.guide_dialog);
            return;
        }
        const guide_dialog = await GuideDialog.preEnter();

        const { prompt_ui, pointer_ui, btn_next } = guide_dialog;
        const prompt = new PromptGuide(prompt_ui, {
            fontSize: 25,
            color: '#ffe7a7',
        });
        const pointer = new PointerGuide(pointer_ui);

        this.guide_dialog = guide_dialog;
        this.prompt = prompt;
        this.pointer = pointer;

        setStyle(guide_state, { guide_dialog, prompt, pointer, btn_next });
    }
    public async end() {
        const { guide_dialog, prompt } = guide_state;
        await prompt.hide();
        guide_dialog.hide();
    }
}
