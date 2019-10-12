export const res = {
    game: [
        {
            url: `res/image/game.png`,
            type: Laya.Loader.IMAGE,
        },
        {
            url: `res/image/game.json`,
            type: Laya.Loader.JSON,
        },
    ],
};

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
for (let i = 1; i <= 2; i++) {
    res.game.push(
        {
            url: `ani/gun/gun${i}.sk`,
            type: Laya.Loader.BUFFER,
        },
        {
            url: `ani/gun/gun${i}.png`,
            type: Laya.Loader.IMAGE,
        },
    );
}
