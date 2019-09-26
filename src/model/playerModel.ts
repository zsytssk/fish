import { ComponentManager } from 'comMan/component';
import { GunModel } from './gunModel';
import { getGunInfo } from 'utils/dataUtil';
import { GameModel } from './gameModel';

/** 玩家的数据类 */
export class PlayerModel extends ComponentManager {
    /** 用户id */
    public user_id: string;
    /** 服务器的位置 */
    public server_index: number;
    /** 等级 */
    public level: number;
    /** 金币数量 */
    public gold: number;
    /** 用户名 */
    public nickname: string;
    /** 图像地址 */
    public avatar: string;
    /** 炮台 */
    private gun: GunModel;
    /** game 引用 */
    private game: GameModel;
    constructor(player_info: ServerPlayerInfo, game: GameModel) {
        super();
        this.game = game;
        this.init(player_info);
    }
    private init(player_info: ServerPlayerInfo) {
        const {
            userId,
            serverIndex,
            level,
            gunSkin,
            nickname,
            avatar,
            gold,
        } = player_info;

        this.user_id = userId;
        this.server_index = serverIndex;
        this.nickname = nickname;
        this.gold = gold;
        this.avatar = avatar;
        this.gold = gold;

        const { pos } = getGunInfo(serverIndex);
        const gun = new GunModel(pos, level, gunSkin);
        this.gun = gun;
    }
}
