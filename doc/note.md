-   @todo 基本功能 全部完成
    -   形状 + 可视化
    -   鱼群
    -   炮台发射子弹
    -   碰撞检测

## 2019-09-25 09:15:11

-   @ques 出屏幕的路线和屏幕的角度越小 越难处理....

    -   可能会导致 沿着线方向 离开了, 但是侧边没有离开
    -   叫设计将出屏幕的路线全部变成直角

-   ## @todo 鱼一开始 隐藏 进入页面之后才显示...

    -   离开隐藏

-   @ques MoveCom 等到做子弹之后再看
    -   检测碰撞 减少计算... 最好变成 component 只做需要的计算

*   捕鱼的工具全部放到一起...

    -   生成鱼群
    -   生成路径

*   @note 圆比矩形更适合做形状

*   @ques body 的位置不对...

    -   是鱼的位置不对, 还是 body 的位置不对...
    -   圆心点的位置不一致
    -   画一个不动的鱼, 去调整他的角度..

*   @bug 鱼还没完全离开页面 就消失了...

*   @ques 有没有更好的方式去组织 shape 信息

    -   鱼的 sprite 可以放在 ui 编辑器中

*   @ques 形状的可视化 -> 放在 test 中...

*   @ui 鱼的动画全部放在中间...

*   @todo 将 生成形状的原始数据 放在外面 精简 里面的逻辑

    -   也许可以缓存这些数据..
    -   @ques body fix_direction 是否可以放在外边处理...
    -   将所有的代码可以可感觉, 而不是一大坨...
    -   `angle + Math.PI / 2;` 这种代码最好清理掉

*   @todo detectCollision

-   @bug test 中无法 run 自己

*   game_test

*   全局 state 数据类...
*   叠高 mac + 键盘..
*   mac 系统快捷键

*   @ques mac touch bar f12 怎么找

*   @ques ts object function keys injectAfter..

*   @ques prettier width

## 2019-09-24 11:55:04

-   @todo injectAfter... promise

-   @opt 鱼的大小对移动路径的影响如何处理

    -   在创建移动控制器之前，将数据组合进去...
    -   先把生成默认的路径, 然后在 get(0) get(1) 来创建新的 curve push 进去
    -   鱼的路径发生改变时 只要将 curve 修改就可以了

-   @note countDown 能不能做成工具函数, 不需要 new..
-   @todo BackgroundMonitor 测试环境禁用

    -   提供接口禁用 也做成工具函数类型

-   socketIo

-   @ques MoveCom | TickCom

    -   怎么将这些组建放在一起, 节省计算量

-   @ques 子弹的运动能不能和鱼放在一起
-   计算 前后端的时间差 从而知道 延迟多长时间...

-   @ques 外面有没有现成的 sine 函数库

    -   @ques 郑玄函数的长度
    -   https://math.stackexchange.com/questions/45089/what-is-the-length-of-a-sine-wave-from-0-to-2-pi

-   mac vscode line end

-   @todo 加载 fish 的资源

-   fishCtrl

*   @opt upsidedown

*   @note 耦合的代码实在是太难整理了

    -   将代码拆成一个个不关联的小块...

*   i_sprite

*   可以先将项目跑起来, 然后再去优化

*   @ques 最好 displace 能做一个独立的部分 里面需要的变量 可以从外面传进去...

*   `This module can only be referenced with ECMAScript imports/exports by turning on the 'esModuleInterop' flag and referencing its default export.`

*   @ques curve is_static 是什么意思

    -   鱼游离开页面之后就不去便利了 is_static
    -   其实可以直接将鱼删除掉

*   @ques moveComponent 只提供 tick 的方法 onUpdate...

*   @todo Bezier 库 + 类型文件

*   @opt 只有一个 Curve 类型, 他有三种实现方式, 下面的代码就可以删除掉了
    `export type Curve = Bezier | Line | t_displace_fun;`

*   @opt 将 displace 因鱼的大小而修正的逻辑从 displace 中拿出来

*   todo displace 的数据 + 控制 可以直接使用

frameLoop 可以删除了 -> zTimer

-   子弹移动撞墙 应该可以做一个独立的 component。。。
    -   getComp
-   一发炮弹多个子弹 怎么处理。。。

    -   关联子弹 ？怎么处理
    -   组合鱼 怎么处理

-   @ques gunModel 到底还要吗

-   @todo bullet | fish 公用 body + Move component
-   note 外面 不应该访问 component 里面的方法，所有的 component 应该都是一个封装之内

## 2019-09-24 09:54:38

-   laya 2.2.0

-   moveComponent :> 改变 pos vec。。。

    -   在 component 中去更新位置，更新完成之后 修改 fish 本身的位置
    -   子弹碰撞墙壁的处理。。。

-   @ques 将 honor 依赖的变成 ctrl
    -   只要实现自己的 api 就可以了...
    -   runScene openDialog 都是 ctrl?

*   @ques Set 在 for del item 的时候会不会出错

*   @ques glory animate rxjs
