export const res = {
    game: [],
};

for (let i = 1; i <= 10; i++) {
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
