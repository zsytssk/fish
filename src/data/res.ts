export const res = {
    font: [],
    game: [
        {
            url: `res/image/game.png`,
            type: Laya.Loader.IMAGE,
        },
        {
            url: `res/image/game.json`,
            type: Laya.Loader.JSON,
        },
        {
            url: `image/game/bg_normal.sk`,
            type: Laya.Loader.BUFFER,
        },
        {
            url: `image/game/bg_normal.png`,
            type: Laya.Loader.IMAGE,
        },
    ],
};

/** fish */
for (let i = 1; i <= 20; i++) {
    res.game.push(
        {
            url: `ani/fish/fish${i}.sk`,
            type: Laya.Loader.BUFFER,
        },
        {
            url: `ani/fish/fish${i}.png`,
            type: Laya.Loader.IMAGE,
        },
    );
}

/** gun */
for (let i = 1; i <= 3; i++) {
    res.game.push(
        {
            url: `ani/gun/gun${i}/light.sk`,
            type: Laya.Loader.BUFFER,
        },
        {
            url: `ani/gun/gun${i}/light.png`,
            type: Laya.Loader.IMAGE,
        },
        {
            url: `ani/gun/gun${i}/base.sk`,
            type: Laya.Loader.BUFFER,
        },
        {
            url: `ani/gun/gun${i}/base.png`,
            type: Laya.Loader.IMAGE,
        },
        {
            url: `ani/gun/gun${i}/gun.sk`,
            type: Laya.Loader.BUFFER,
        },
        {
            url: `ani/gun/gun${i}/gun.png`,
            type: Laya.Loader.IMAGE,
        },
    );
}

/** bullet */
for (let i = 1; i <= 1; i++) {
    res.game.push(
        {
            url: `ani/gun/bullet${i}.sk`,
            type: Laya.Loader.BUFFER,
        },
        {
            url: `ani/gun/bullet${i}.png`,
            type: Laya.Loader.IMAGE,
        },
        {
            url: `ani/gun/bullet${i}_rage.sk`,
            type: Laya.Loader.BUFFER,
        },
        {
            url: `ani/gun/bullet${i}_rage.png`,
            type: Laya.Loader.IMAGE,
        },
    );
}
for (let i = 1; i <= 1; i++) {
    res.game.push(
        {
            url: `ani/gun/net${i}.sk`,
            type: Laya.Loader.BUFFER,
        },
        {
            url: `ani/gun/net${i}.png`,
            type: Laya.Loader.IMAGE,
        },
    );
}

export const font_list = ['font/score_num'];
for (const font of font_list) {
    res.font.push(
        {
            url: `${font}.fnt`,
            type: Laya.Loader.XML,
        },
        {
            url: `${font}.png`,
            type: Laya.Loader.IMAGE,
        },
    );
}
