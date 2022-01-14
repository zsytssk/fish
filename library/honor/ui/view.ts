import { Scene } from 'laya/display/Scene';
import { Dialog } from 'laya/ui/Dialog';

/** Honor 中 dialog支持的接口 */
export interface HonorDialog extends Dialog {
    onBeforeOpen?: (...param: any) => any;
    /** 弹出层打开之前调用... */
    onResize?(width?: number, height?: number): void;
}

export interface HonorScene extends Scene {
    onResize?(width: number, height: number): void;
}
