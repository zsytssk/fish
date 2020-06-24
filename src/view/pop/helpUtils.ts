import { SkillMap } from 'data/config';
import { Lang, InternationalTip } from 'data/internationalConfig';

export const test_fish_list = [
    { id: 1, num: 2, is_special: 300 },
    { id: 2, num: 3, is_special: 300 },
    { id: 3, num: 5, is_special: 300 },
    { id: 4, num: 8, is_special: 300 },
    { id: 5, num: 10, is_special: 300 },
    { id: 6, num: 15, is_special: 300 },
    { id: 7, num: 20, is_special: 300 },
    { id: 8, num: 30, is_special: 300 },
    { id: 10, num: 50, is_special: 300 },
    { id: 11, num: 80, is_special: 300 },
    { id: 12, num: 100, is_special: 300 },
    { id: 13, num: 150, is_special: 300 },
    { id: 14, num: 200, is_special: 300 },
    { id: 15, num: 250, is_special: 300 },
    // { id: 16, num: 300, is_special: 300 },
    // { id: 17, num: 300, is_special: 300 },
    // { id: 18, num: 300, is_special: 300 },
    // { id: 19, num: 300, is_special: 300 },
    { id: 20, num: 300, is_special: 300 },
    { id: 9, num: 0, is_special: 300 },
];

export function getSkillIntroList(lang: Lang) {
    const { help2Freeze, help2Lock, help2Bomb } = InternationalTip[lang];

    return [
        {
            id: SkillMap.Bomb,
            intro: help2Bomb,
        },
        {
            id: SkillMap.Freezing,
            intro: help2Freeze,
        },
        {
            id: SkillMap.LockFish,
            intro: help2Lock,
        },
        // {
        //     id: SkillMap.Super,
        //     intro: help2Super,
        // },
    ];
}
