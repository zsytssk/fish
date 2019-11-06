/** 服务器端的接口 */
export const ServerEvent = {
    RoomIn: 'roomIn',
    CheckReplay: 'checkReplay',
    EnterGame: 'enterGame',
    RoomOut: 'roomOut',
    Shoot: 'shoot',
    Hit: 'hit',
    ChangeTurret: 'changeTurret',
    /** 鱼潮来了提示 */
    FishShoalWarn: 'fishShoalWarn',
    /** 鱼潮 */
    FishShoal: 'fishShoal',
    /** 激活锁定 */
    UseLock: 'useLock',
    /** 锁定<鱼> */
    LockFish: 'lockFish',
    UseBomb: 'useBomb',
    PowerUp: 'powerUp',
    SetRobotReport: 'setRobotReport',
    UserAccount: 'userAccount',
    GetDomain: 'getDomain',
    UseFreeze: 'useFreeze',
    FreezeOver: 'freezeOver',
    Lottery: 'lottery',
    TicketExchange: 'ticketExchange',
    ShopList: 'shopList',
    Buy: 'buy',
    /** 获取游客 TOKEN */
    GetGuestToken: 'getRequestId',
    /** 获取用户 TOKEN */
    GetUserToken: 'getTokenByCode',
    /** 获取用户信息 */
    GetUserInfo: 'getUserInfo',
};
