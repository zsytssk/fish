import { SPRITE } from './sprite';
import { getGunSkinMap } from 'utils/dataUtil';
import { AudioRes } from './audioRes';
import { Loader } from 'laya/net/Loader';
import { AlertRes } from 'view/pop/alert';

export const res = {
    font: [],
    audio: [],
    common: [],
    game: [
        {
            url: `res/image/game.png`,
            type: Loader.IMAGE,
        },
        {
            url: `image/game/bg_normal.sk`,
            type: Loader.BUFFER,
        },
        {
            url: `image/game/bg_normal.png`,
            type: Loader.IMAGE,
        },
    ],
};

for (const top_type in SPRITE) {
    if (!SPRITE.hasOwnProperty(top_type)) {
        continue;
    }
    // console.log(`test:>`, top_type);
    // if (top_type !== 'other' && top_type !== 'fish') {
    //     continue;
    // }
    const item_map = SPRITE[top_type];
    for (const sub_type in item_map) {
        if (!item_map.hasOwnProperty(sub_type)) {
            continue;
        }
        const item = item_map[sub_type];
        if (item.type === 'DragonBone') {
            const path = item.path;
            res.game.push(
                {
                    url: `${path}.sk`,
                    type: Loader.BUFFER,
                },
                {
                    url: `${path}.png`,
                    type: Loader.IMAGE,
                },
            );
        }
    }
}

export const font_list = [
    'font/score_num',
    'font/numYellow40',
    'font/lottery',
    'font/numWhite40',
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
    if (!AudioRes.hasOwnProperty(key)) {
        continue;
    }
    const url = AudioRes[key];
    res.audio.push({
        url,
        type: Loader.SOUND,
    });
}
for (const key in AlertRes) {
    if (!AlertRes.hasOwnProperty(key)) {
        continue;
    }
    const url = AlertRes[key];
    res.common.push(url);
}
