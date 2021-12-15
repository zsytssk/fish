import { Loader } from 'laya/net/Loader';

import { getGunSkinMap } from '@app/utils/dataUtil';

import { AudioRes } from './audioRes';
import { SPRITE } from './sprite';

export const res = {
    font: [],
    audio: [],
    common: [],
    game: [
        {
            url: `res/image/game.png`,
            type: Loader.IMAGE,
        },
    ],
    gameTutorial: [
        {
            url: `res/image/game.png`,
            type: Loader.IMAGE,
        },
    ],
};

const tutorialKeys = ['1', 'pos_tip', 'coin', 'award_light'];

for (const top_type in SPRITE) {
    const item_map = SPRITE[top_type];

    if (top_type === 'gun') {
        for (const sub_type in item_map) {
            for (let j = 1; j <= 3; j++) {
                const ani_map = getGunSkinMap(`${sub_type}`, `${j}`);
                for (const [ani_name, ani_id] of ani_map) {
                    const name = `${ani_name}${ani_id}`;
                    const res_arr = [
                        {
                            url: `ani/gun/${name}.sk`,
                            type: Loader.BUFFER,
                        },
                        {
                            url: `ani/gun/${name}.png`,
                            type: Loader.IMAGE,
                        },
                    ];
                    res.game.push(...res_arr);

                    if (tutorialKeys.indexOf(sub_type) !== -1) {
                        res.gameTutorial.push(...res_arr);
                    }
                }
            }
        }
        continue;
    }
    for (const sub_type in item_map) {
        const item = item_map[sub_type];
        if (item.type === 'DragonBone') {
            const path = item.path;
            const res_arr = [
                {
                    url: `${path}.sk`,
                    type: Loader.BUFFER,
                },
                {
                    url: `${path}.png`,
                    type: Loader.IMAGE,
                },
            ];
            if (tutorialKeys.indexOf(sub_type) !== -1) {
                res.gameTutorial.push(...res_arr);
            }
            res.game.push(...res_arr);
        }
    }
}

export const font_list = [
    'font/score_num',
    'font/numYellow40',
    'font/lottery',
    'font/numWhite40',
    'font/alphabet',
];
for (const font of font_list) {
    res.font.push(
        {
            url: `${font}.fnt`,
            type: Loader.XML,
        },
        {
            url: `${font}.png`,
            type: Loader.IMAGE,
        },
    );
}
for (const key in AudioRes) {
    const url = AudioRes[key];
    res.audio.push({
        url,
        type: Loader.SOUND,
    });
}

const AlertRes = [
    'pop/alert/alert.json',
    'image/pop/alert/alert_bg_01.png',
    'image/pop/alert/alert_bg_02.png',
    'image/pop/alert/btn_close.png',
    'image/pop/alert/alert_con_bg.png',
    'image/pop/alert/btn_cancel.png',
    'image/pop/alert/btn_confirm.png',
];

for (const key in AlertRes) {
    const url = AlertRes[key];
    res.common.push(url);
}
