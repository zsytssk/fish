import { listenLocal, test, preBuild, build, afterBuild } from './buildUtils';

const type = process.argv.slice(2)[0] || 'buildMap';

export const build_tips = `请选择要执行的命令\n 1.编译代码(prod) \n 2.本地编译代码(test) 提交  \n 3.本地编译代码(prod) 提交 \n > `;

const buildMap = {
    '1': async () => {
        await preBuild();
        await build();
        await afterBuild();
    },
    '2': async () => {
        await preBuild();
        await build('test');
        await afterBuild(true);
    },
    '3': async () => {
        await preBuild();
        await build('prod');
        await afterBuild(true);
    },
};

const actionMap = {
    async buildMap() {
        for (let i = 0; i < 50; i++) {
            const listen_type = await listenLocal();
            console.time(`buildType:${listen_type}, costTime:`);
            if (buildMap[listen_type]) {
                await buildMap[listen_type]();
            }
            console.timeEnd(`buildType:${listen_type}, costTime:`);
        }
    },
    async test() {
        await test();
    },
};

export async function main() {
    console.log(type);
    console.time('AllCostTime');
    await actionMap[type]();
    console.timeEnd('AllCostTime');
}

main();
