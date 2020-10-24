import { test, afterBuild } from './buildUtils';

const type = process.argv.slice(2)[0] || 'buildMap';

const actionMap = {
    async buildMap() {
        console.time(`after build, costTime:`);
        await afterBuild();
        console.timeEnd(`after build, costTime:`);
    },
    async test() {
        await test();
    },
};

export async function main() {
    await actionMap[type]();
}

main();
