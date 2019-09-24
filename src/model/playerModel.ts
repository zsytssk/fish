import { ComponentManager } from 'comMan/component';

/** 玩家的数据类 */
export class PlayerModel extends ComponentManager {
    /** 用户id */
    public user_id: string;
    /** 服务器的位置 */
    public server_pos: number;
    /** 等级 */
    public level: number;
    /** 金币数量 */
    public gold: number;
    /** 用户名 */
    public nickname: string;
    /** 图像地址 */
    public avatar: string;
}
