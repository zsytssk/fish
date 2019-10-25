declare global {
    interface Window {
        CDN_VERSION: string;
    }
}

export const Config = {
    /** cnd版本号 */
    CdnVersion: window.CDN_VERSION,
    /** 子弹速度 */
    BulletSpeed: 15,
    /** 水池的宽度 */
    PoolWidth: 1920,
    /** 水池的高度 */
    PoolHeight: 750,
    /** 自动攻击的间隔 ms */
    LaunchSpace: 100,
    /** 炸弹的区域 */
    BombRadius: 300,
};

export enum SkillMap {
    Freezing = '1',
    Bomb = '2',
    TrackFish = '3',
    Auto = '4',
}
