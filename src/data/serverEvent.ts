/** 服务器端的接口 */
export const ServerEvent = {
    RoomIn: 'roomIn',
    CheckReplay: 'checkReplay',
    EnterGame: 'enterGame',
    RoomOut: 'roomOut',
    Shoot: 'shoot',
    Hit: 'hit',
    ChangeTurret: 'changeTurret',
    FishShoal: 'fishShoal',
    UseLock: 'useLock',
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
