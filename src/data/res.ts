import { SPRITE } from './sprite';
import { getGunSkinMap } from 'utils/dataUtil';
import { AudioRes } from './audioRes';
import { Loader } from 'laya/net/Loader';

export const res = {
    font: [],
    audio: [],
    game: [
        {
            url: `res/atlas/image/game.png`,
            type: Loader.IMAGE,
        },
        // {
        //     url: `res/atlas/image/game.json`,
        //     type: Loader.JSON,
        // },
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

/** gun */
for (let i = 1; i <= 3; i++) {
    for (let j = 1; j <= 3; j++) {
        const ani_map = getGunSkinMap(`${i}`, `${j}`);
        for (const [ani_name, ani_id] of ani_map) {
            const name = `${ani_name}${ani_id}`;
            res.game.push(
                {
                    url: `ani/gun/${name}.sk`,
                    type: Loader.BUFFER,
                },
                {
                    url: `ani/gun/${name}.png`,
                    type: Loader.IMAGE,
                },
            );
        }
    }

    res.game.push(
        {
            url: `ani/gun/bullet${i}.sk`,
            type: Loader.BUFFER,
        },
        {
            url: `ani/gun/bullet${i}.png`,
            type: Loader.IMAGE,
        },
    );
    res.game.push(
        {
            url: `ani/gun/net${i}.sk`,
            type: Loader.BUFFER,
        },
        {
            url: `ani/gun/net${i}.png`,
            type: Loader.IMAGE,
        },
    );
}

export const font_list = [
    'font/score_num',
    'font/numYellow40',
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
