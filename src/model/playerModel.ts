import { ComponentManager } from 'comMan/component';
import { GunModel } from './gun/gunModel';
import { getGunInfo } from 'utils/dataUtil';
import { GameModel } from './gameModel';

export type PlayerInfo = ServerPlayerInfo & {
    isCurPlayer: boolean;
};
/** 玩家的数据类 */
export class PlayerModel extends ComponentManager {
    /** 用户id */
    public user_id: string;
    /** 是否是当前用户 */
    public is_cur_player: boolean;
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
    public gun: GunModel;
    /** game 引用 */
    private game: GameModel;
    constructor(player_info: PlayerInfo, game: GameModel) {
        super();
        this.game = game;
        this.init(player_info);
    }
    private init(player_info: PlayerInfo) {
        const {
            userId,
            serverIndex,
            level,
            gunSkin,
            nickname,
            avatar,
            gold,
            isCurPlayer,
        } = player_info;

        this.user_id = userId;
        this.server_index = serverIndex;
        this.nickname = nickname;
        this.gold = gold;
        this.level = level;
        this.avatar = avatar;
        this.gold = gold;
        this.is_cur_player = isCurPlayer;

        const { pos } = getGunInfo(serverIndex);
        const gun = new GunModel(pos, gunSkin, this);
        this.gun = gun;
    }
}
