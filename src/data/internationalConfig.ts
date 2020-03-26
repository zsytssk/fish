export enum Lang {
    /** 中文 */
    Zh = 'zh',
    /** 中文 */
    Zh_TW = 'Zh_TW',
    /** 韩文 */
    Kor = 'kor',
    /** 英文 */
    En = 'en',
    /** 日文 */
    Jp = 'jp',
}

/** 国际化的资源 */
export const InternationalRes = {};
/** 国际化的提示 */
export const InternationalTip = {
    [Lang.En]: {
        '404': 'not found',
    },
    [Lang.Kor]: {
        '404': '찾지 못하다',
    },
    [Lang.Jp]: {
        '404': 'いらない',
    },
    [Lang.Zh]: {
        '404': '没有发现页面',
    },
    [Lang.Zh_TW]: {
        '404': '没有发现页面',
    },
};
