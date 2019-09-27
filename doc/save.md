-   @ques@imp js createTimeout 会不会重复
-   @ques model com 能不能缓存 这样可以减小很多的消耗

-   @todo 鱼死亡 自动瞄准

-   @todo 其他玩家网不进行碰撞检测如何处理

-   @ques 碰撞检测, 所有的 body_com 放在一个地方处理

-   @ques 所有的 shape|sprite 的位置匹配太麻烦了, 有没有更好的方式

*   @ques track 在鱼 fish destroy, 需要将子弹还原, 这怎么处理
    -   trackCom + recover...

-   @ques 将 createFish|bullet 放在 ctrl/state 中, 有更好的方式吗
-   @ques 网捕捉到鱼 我怎么知道是谁捉到的

-   @note moveVelocity 可以再优化 将碰墙去掉
-   @note `angle + Math.PI / 2;` 这种代码最好清理掉

-   @note countDown 能不能做成工具函数, 不需要 new..
-   @todo BackgroundMonitor 测试环境禁用

    -   提供接口禁用 也做成工具函数类型

## 生成鱼群工具
