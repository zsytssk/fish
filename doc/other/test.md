-   兼容性测试

    -   es6-map es6-set ...

-   @todo toggleBalanceMenu 效果...

-   @todo 页面鱼在复盘之后不同步...

-   @todo 子弹击中空地 显示 网

*   两套 js es6 es5, 同时检测 es5 客户的百分比

-   模拟服务端返回

```ts
test.web_socket.run('receive', 'game', {
    cmd: 'addFish',
    res: {
        fish: [
            {
                eid: 'F:MvYY0vm.6',
                fishId: '9',
                group: null,
                displaceType: 'fun',
                pathNo: '',
                usedTime: 0,
                totalTime: 27449,
                displaceLen: 15000,
                funList: [
                    {
                        funNo: '3',
                        radio: 0.08630994734595133,
                        params: [
                            { x: 0, y: 234.5 },
                            { x: 606.5, y: 234.5 },
                        ],
                    },
                    {
                        funNo: '3',
                        radio: 0.7267681798776149,
                        params: [
                            { x: 606.5, y: 234.5 },
                            { x: 606.5, y: 234.5 },
                        ],
                    },
                    {
                        funNo: '3',
                        radio: 0.18692187277643377,
                        params: [
                            { x: 606.5, y: 234.5 },
                            { x: 1920, y: 234.5 },
                        ],
                    },
                ],
                pathList: [],
                reverse: false,
            },
        ],
    },
});
```
