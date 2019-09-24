-   @todo 这个星期要让所有的鱼游起来...

## 2019-09-24 11:55:04

-   @ques curve is_static 是什么意思

-   @ques 鱼的大小对移动路径的影响如何处理

    -   在创建移动控制器之前，将数据组合进去...

-   @ques 郑玄函数的长度
-   @ques moveComponent 只提供 tick 的方法 onUpdate...

-   @todo Bezier 库 + 类型文件

-   @opt 只有一个 Curve 类型, 他有三种实现方式, 下面的代码就可以删除掉了
    `export type Curve = Bezier | Line | t_displace_fun;`

-   @opt 将 displace 因鱼的大小而修正的逻辑从 displace 中拿出来

-   todo displace 的数据 + 控制 可以直接使用

frameLoop 可以删除了 -> zTimer

vscode line end

-   子弹移动撞墙 应该可以做一个独立的 component。。。
    -   getComp
-   一发炮弹多个子弹 怎么处理。。。

    -   关联子弹 ？怎么处理

-   @ques gunModel 到底还要吗

-   @todo bullet | fish 公用 body + Move component
-   note 外面 不应该访问 component 里面的方法，所有的 component 应该都是一个封装之内

## 2019-09-24 09:54:38

mac auto complete

-   laya 2.2.0

-   moveComponent :> 改变 pos vec。。。
    -   在 component 中去更新位置，更新完成之后 修改 fish 本身的位置
    -   子弹碰撞墙壁的处理。。。

*   ts strict: true

-   @ques 将 honor 依赖的变成 ctrl
    -   只要实现自己的 api 就可以了...
    -   runScene openDialog 都是 ctrl?

*   @ques Set 在 for del item 的时候会不会出错

*   @ques glory animate rxjs

-   @note countDown 能不能做成工具函数, 不需要 new..
-   @todo BackgroundMonitor 测试环境禁用
    -   提供接口禁用 也做成工具函数类型
