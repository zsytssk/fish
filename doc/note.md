-   @todo 技能的渲染 + 倒计时 + 狂暴技能动画

    -   直接添加在 ui 中的动画能不能停止播放 visible = false
    -   冰冻... 真实的技能的控制...
    -   检测所有有问题的路径 开始两个 结束两个...

*   getDomain http...

*   @todo 接口 链接发给我...

*   @todo fish 的 offset 只需要前后...
    -   路径和屏幕的夹角 > 45%
    -   站立的鱼怎么处理, 左右...

-   @bug 直立行走的鱼动画路径错误

-   @bug 可以用直线 来测试上下左右 sprite offset 对不对...

## 2019-10-18 13:34:50

-   前端仓库... @hujianxin @mengge

    -   胡建新能不能给我建立...

-   钱币不够 --> 跳转链接 @张笑

-   大厅的顶上的 ui 都是一样的 能用以前公共的吗?

    -   应该不能... @萌哥

-   @ques 我给头尾添加距离, 为什么不直接算 offset 的 top...

-   @ques 其他技能要不要处理...

-   @ques 浏览器切后台需要 关闭游戏...

-   @ques 特殊的鱼有没有特殊的效果

    -   比方炸弹鱼...

-   @ques socket 需要加密吗 等后端...ß

## 2019-10-18 10:06:47

-   @todo 提交代码 + 看今天有没有有意思的东西

*   @ques 如何获取炮台的位置...
    z - 很多地方会用... - getGunPos - gunModel -> playerCtrl -> aim... - @ques 怎么绘制点... 抄过来就可以了 - 感觉这需要一个类来处理了

*   @bug 追踪子弹 第一发 没有追踪目标...

*   @todo 当前用户的位置指视 + 技能 倒计时 + 冰冻 + 瞄准 + 鱼潮动画...

    -   有哪些是可以照抄以前的...

*   @ques aniWrap view 创建能不能放在 view 层 但是没有相应的 view 层

    -   ...
    -   直接在 ctrl 创建冰冻有什么不好...

*   @todo 还原冰冻 + shoalWave

*   exploding + shoal_wave + pos_tip + aim

*   @ques 同时可以出现多个冰冻如何处理

    -   创建多个骨骼动画??, 怎么保存 怎么访问
    -   要两个数组... 一个缓存 一个正在播放的冰冻...

*   @note 当前用户必须是第一个进入页面的玩家

    -   其他玩家依赖 upside_down 由他创建

*   @ques 如果服务端告诉我一个鱼被 capture 但是这个鱼已经离开我的页面我怎么处理
    -   显示奖励..., 说明奖励和鱼捕捉要分开显示 不然怎么处理这个问题

## 2019-10-17 15:35:20

-   @bug 冰封的效果是是冰冻某些鱼 @产品@设计

    -   现在的动画是全屏冰冻 是否不太合理...

-   @todo 多少 毫秒 tick config

    -   很多地方都需要, tick...
    -   能不能传 2,这样其他地方就不用改了...

-   @todo 爆炸的图片太大了...

-   @todo 所有的骨骼动画缓存....

-   @todon 要看看子弹 鱼同步同步...

-   @todon 所有的资源最好全部放在 sprite 中

    -   res 中需要加载的资源 + createSprite...
    -   bullet\${i}\_rage gun 怎么处理...
    -   特殊处理 gun font...

-   @note 一下子想做很多的事情 就特别累...

## 2019-10-17 13:57:49

-   @ques 直接颠倒 pool 怎么样...

    -   ... 站立的鱼怎么处理...
    -   这样计算少写, 只是需要计算站立的鱼, 挺好的...

-   @todo 颠倒的形状

    -   设计能把 ui 的中心点 放在中心吗, 使上下的区域差不多..
    -   这样颠倒屏幕就不会出现偏差了

*   @bug 快速释放 子弹的时候 炮台的 fire 动画 没有释放完全...

*   @todo 更新位置和碰撞的 tick 可以不一样, 碰撞检测是运算最复杂的地方, 也没有必要每次都去

## 2019-10-17 11:30:14

-   @todo 晚上排期

    -   购买子弹-1
    -   大厅-1 房间-1 帮助-1 商店-1 抽奖-1
    -   炮台的布局 1
    -   国际化 1
    -   鱼的形状+sprite offet 数据 1
    -   socket - 0.5 声音 - 0.5
    -   所有的技能
        -   技能的基本逻辑(倒计时+释放)-1
        -   冰冻 1
        -   锁定 1
        -   炸弹 + 炸弹鱼 1
        -   超级技能 = 加速-1
        -   自动挂机(怎么做??)-1
    -   所有鱼的形状的调整 1
    -   鱼群
        -   鱼群的基本逻辑-1
        -   生成鱼群数据(每个鱼群一天))
    -   鱼组-1
        -   yu zhu
    -   炮台+子弹+网的皮肤(ui 动画转到编辑器中+代码调用) 1
    -   双口炮 两个 子弹 两个网 1
    -   用户 炮台 子弹 鱼 在页面中 上下同步 1

    *   服务端的接口
        -   鱼更新
        -   复盘 1

    -   其他 1
        -   socket + sdk 接入
    -   性能优化
        -   缓存所有的骨骼动画-1

-   @todo 鱼上下同步 碰撞的位置必须是 上下对称

-   @note typedoc

## 2019-10-16 20:12:32

-   @ques 怎么发双炮... + 狂暴子弹 + 网的效果

    -   removeBullet(group)
    -   子弹的狂暴...

*   @todo 界面

    -   炮台的分数...
    -   子弹 动画 + 发射的位置
    -   用户的 score

*   @save 狂暴 子弹三要大些

-   @save sdk 更新了

-   @save 服务端的接口 更新...

-   @ques [自动] == 挂机 自动打鱼

-   @ques 鱼潮被冰冻住了怎么处理...
-   @ques 萌哥 我搬到楼上了

### complete

-   @todo skillBox..

-   innerHtml 样式
-   @save 群免打扰...
-   @save font 怎么初始化

    -   font 没有显示

## 2019-10-16 10:32:57

-   @todo node 脚本

    -   messages.json @zhanglaosi

-   @todo 子弹发射的位置...

## 2019-10-15 17:25:58

-   @todo jiang 自己的 script 发到 npm 上面

    -   es6 模块 像 ldash 一样

-   @todo createGun...
-   @todo gun 的位置, 切换 ui..

-   @todo angleToVector...

*   鱼组..

*   背景

    -   炮台

    -   背景要 1920 x 1920

*   高适配 + gmStart 的源码没有了

*   @todo 投影的大小 @设计

*   @ques 多语言怎么处理???

    -   语言.json
    -   全局发送命令...
    -   @张笑

*   @ques 鱼的影子能不能不一样?

    -   这样体验是不是好些...

*   @todo index.html 如何处理 coingame...

*   @ques 炮台的资源 如何处理

## 2019-10-15 11:48:04

-   @todo gameScene 没有剧中

## 2019-10-15 10:20:35

-   ts-node --files Cannot find module 'utils/mathUtils'

-   @todo 排期的技术点...

    -   页面布局
        -   大厅、房间、帮助、声音、抽奖、商店
    -   所有的技能
        -   技能的基本逻辑 倒计时
        -   冰冻 + 锁定
        -   炸弹 + 炸弹鱼
        -   超级技能 = 加速
    -   鱼群
        -   生成鱼群脚本
        -   鱼群进入页面的逻辑...
    -   鱼组..
    -   炮台的位置
    -   炮台+子弹+网的皮肤
    -   双口炮 两个 子弹 两个网
    -   上下颠倒同步...
    -   版本号

-   首页
-   选择游戏模式
-   用户炮台弹出层
-   抽奖

-   游戏里面有没有 ajax 请求...

-   总共有哪些弹出层 @ques 产品

    -   设计稿什么时候能给

-   @ques 游戏的宽高... @产品

-   排期给服务端吗

## 2019-10-14 15:29:13

-   @todo socket.io ...
    -   添加 wrap, 可以扩展功能...
    -   断线重连...

```ts
var decodeData = Base64.decode(data);
var parsedData = JSON.parse(decodeData);
```

-   @ques 萌哥的 socket 到底是怎么使用的...

    -   有用 base64 吗? 有用 token 吗

-   @todo game-sdk

-   双口炮 发送两个

## 2019-10-14 13:53:21

-   @todo 所有的形状

-   shape circle pos box pivot

    -   5..2

-   @todo 龙虾三个形状 旋转

-   @todo 碰撞形状能不能让设计去设置, 我在 psd 中转一下...

    -   春明 顺时针画

-   @todo 螃蟹的形状 网的形状不太对...

-   @todo 布局 渔网 子弹 炮台 什么时候给我...

-   @todo 登陆 张笑 (和后端没有关系) + socket.io

    -   有没有库可以参考下

-   @todo 登陆 张笑 (和后端没有关系)

## 2019-10-14 10:08:43

-   @todo 形状 scaleX 有没有用...

-   @todo 18 号鱼颠倒形状
    -   颠倒之后形状是对的,的但是就无法击中了, 点不在是逆时针了

## 2019-10-12 20:10:44

-   @ques 将 bodyCom 上面的 shape pos 全部删除

    -   shape.pos 和 shapeInfo.pos 的区别是什么...
    -   这里面好像哪里有问题
        -   drawShape:>rotationShape

-   @ques 站立 body 的形状
    -   形状 能不能 scaleX -1
        -   自己写一个方法去翻转
    -   其他鱼的颠倒

*   @todo 游戏中添加 socket 的处理...
*   @todo tsc·
*   @todo 本地模拟 socket @ques socket 到底如何建立

*   @ques 站立鱼的 形状和动画如何处理

    -   body fix_direction 是否可以放在外边处理...

*   @todo injectAfter

*   @play 个人所得税:> 租房抵扣
*   @play 移动流量

*   tslint unessary semicolon

    -   tslint vacode semicolon ignore-bound-class-methods

*   @todo 其他用户自动发射子弹

*   @todo genVersion ...

## 2019-10-12 10:07:55

-   @ques photoshop js 怎么创建 layer

    -   https://www.adobe.com/content/dam/acom/en/devnet/photoshop/scripting/Photoshop-CS6-JavaScript-Ref.pdf
    -   创建图层, 创建新的 pathItem 创建 subPathInfo
    -   没搞出来...

-   14-26 27-39(30) 40-51(40) 52-63(52) 64-75

skill-test freezing

-   炮台转动不灵敏

-   @todo FishStatus emit...

-   @opt 性能优化

```ts
public get event() {
    return this.getCom(EventCom);
}
this.event = this.getCom(EventCom);
```

## 2019-10-11 16:09:15

-   @todo test modelState ctrlState

*   @ques 页面上的动画如何处理...

    -   炸弹
    -   狂暴[加速发射] + 冰冻; ... 追踪子弹... ani_ctrl 冰冻

-   @todo 锁定第一个子弹的发射角度有问题..

-   @todo 追踪子弹

    -   自动发射 + 追踪子弹

-   @todo 所有的 event 全部首字母大写 时间 用下划线

-   @ques com 要不要和对应的 compMan 放在一起... 公共的放在一起..

-   @ques fish_list player_list 的处理能不能做成一个 comp 这需要思考下

-   @ques 自动追踪 的鱼离开页面, 需要将用户的子弹还原怎么处理

    -   子弹需要记录自己的炮台...

-   @ques com 的交互 自动攻击

    -   trackCom -> autoLaunchCom -> gunBox 这怎么处理

-   @todo 可以计算前后端的时间差 这样就可以 避免延迟导致的 位置不同步

    -   鱼 + 子弹 子弹的发射 技能的释放带 作用时间... (这样有点问题)

-   @ques 自动攻击..., 的显示效果怎么处理...

-   @todo 自动攻击时 点击页面只会 改变炮台的方向 而不是发射子弹

    -   在 trackfish 的时候点击页面不做任何处理...
    -   这时候只需要改变炮台的方向...

-   @todo 炮台的 pos initDirection 数据可以在外面处理好了再发过来
-   @todo 游戏中 大的鱼层级高些 ...

-   @ques trackFish 的子弹和炮台能不能放在一起处理... trackFishCom

-   @ques 如果 trackFishCom 比加上 trackFish 属性 更复杂那么就放在属性上面

-   @todo setStatus + addBullet

-   @todo gun 的开枪间隔
-   @todo 鱼有多少种状态... out_stage...

## 2019-10-11 09:27:40

-   @todo 排期

-   @todo shape_direction

    -   各种特殊的鱼

-   @ques 新的鱼动画 形状添加到页面中

-   @ques 新的路径能不能处理

-   @ques 鱼的位置在中心点 子弹网 在左上方
    -   shape 如何定位
    -   子弹的中心点不对 是不是图片被截取了的缘故...

*   @ques 有时候页面会变得比较卡 是什么问题

    -   可能是电脑卡了...

-   @bug 高阳的路径的背景的长宽
    -   1625x750

*   @sheji
    -   子弹不能有空白区域
    -   路径在 1334x750 上面设置
        -   设计模式是 1334x750 还是多少...
        -   高阳的 的太大了
    -   贝塞尔不能离开页面

## 2019-10-10 11:28:22

-   mac docker 怎么跑到其他的屏幕上去了 @zhihua

-   @ques 鱼的路径 psd 中路径的 id 怎么处理, psd 怎么只识别显示的路径

    -   能不能让服务端自己去生成路径
    -   我要给一个函数给服务端, 这样路径就是动态生成的

-   @ques 鱼群需要哪些的信息

    -   包含的鱼
    -   鱼群的数目
    -   添加删除鱼群...

-   @todo 鱼群 + 技能
    -   鱼群的处理
    -   冰冻
    -   自动攻击

*   鱼群 shoalCom 的处理
    -   addShoal removeShoal preAddShoal
    -   gameMode.shoal_com
    -   event -> event_com ???
    -   需不需要 ShoalModel 对象
        -   看实际的需要, 合不合理

-   git 的权限 @xuyujun

-   @play
    -   vscode 1.39

## 2019-10-10 09:26:42

-   job

    -   设计的 ui
    -   鱼的动画
    -   路径的动画

-   取消 10 号的请假

    -   问下人事

## 2019-09-27 20:15:47

-   @todo CaptureFish castFish

-   CountFn, cur_rate

-   两屏展示 - 总 + 分

-   @todo is_cur_player 的传递

*   @todo 当前用户检测 net 不去做碰撞检测 直接删除...

-   es6-set|map git 提交...

*   count.spec.ts 可以用 Laya.timer.loop 来处理

    -   节省效率
    -   最好是很方便的清理...

*   @ques 鱼在屏幕之外 或者已经被击杀 就不用做碰撞检测了...

*   @ques 如何检测是否是当前用户..., player.is_cur_player...

## 2019-09-27 17:37:04

-   @todo ctrl 中对 view 的控制移动到其他地方

-   @todo playerCtrl 点击的位置..

    -   当前玩家的判断...

-   @note countDown 能不能做成工具函数, 不需要 new..

    -   应用场景 是怎样
        -   技能的冷却, 倒计时
    -   CountDown 的逻辑太复杂了
    -   能不能简化下,
    -   能不能用 setInterval 去处理这个问题

-   @ques gameCtrl -> appCtrl --> appModel --> gameModel

-   @todo view 层全部命名 `_view`

## 2019-09-27 15:39:08

-   @todo 基本功能 全部完成

    -   形状 + 可视化
    -   炮台发射子弹 碰撞检测 网
    -   鱼群

-   @todo 月度总结 :> 请假...; 告诉萌哥 10/8 下午来 上班...

-   @todo 完成内容

    -   捕鱼项目的前端的基本架构 mvc + 组件化开发
        -   将所有的能提纯的放在组件中
        -   在外面组织所有的组件构成业务的逻辑
    -   完成功能: 鱼的创建 形状 子弹攻击 网 碰撞检测

## 2019-09-27 13:51:38

-   @ques model ctrl 依赖其他地方如何处理

    -   state, 将依赖的东西放在一个地方...

*   @ques MoveDisplaceCom 还有没有必要存在

    -   现在只是启动一个 tick, tick 其实可以直接调用的为什么非要建立一个 com
    -   而且他依赖外界的 displace 的逻辑...

-   @ques fish 炮台自动攻击 位置...

-   @todo TimeoutCom

-   @ques 网形状位置 有问题

-   net 渲染 + 位置 + 碰撞检测 + 销毁

## 2019-09-27 09:44:54

-   @ques 如果是对战 子弹可以击中其他玩家这怎么处理...

-   @ques 网到的鱼要不要通知 gun, 其他玩家的网我是不处理的, 我怎么知道这是其他玩家...

-   @todo 创建网

-   @ques 绘制的位置不对

-   @todo 无法碰撞到鱼 形状的数据有问题

-   @ques 是不是非现在不做不可以 | 现在做什么最好

-   @ques 所有的 model 都从一个地方创建 在这里面就可以访问任何一个实例了, 这样好不好

-   @ques 怎么获取所有的鱼

-   将所有的数据放在一个 state 上面是不是更好...

-   @note 追踪子弹 连 body 都不需要

-   @ques CollisionFishCom 将 tick 的逻辑全部放在里面 还是由外面 tick 更好
    -   只需要外界的 body, 在 body 的 update 之后触发这个判断...

## 2019-09-26 16:17:18

-   @todo 子弹弹几次 消失..

-   @todo 子弹碰撞鱼 追踪子弹无需这个功能, 而且网也需要这个功能

    -   collisionFishCom, 怎么获取所有的鱼...

-   @ques 假设碰撞只是形状之间的, 我又怎么知道 到底是碰到了什么

    -   难道我再去这个形状对应是哪个 fish 或者什么东西
    -   只做 body 的碰撞是可以的...
    -   有没有更好的方式...

-   @ques 所有的形状|sprite 的位置匹配太麻烦了, 有没有更好的方式

-   @todo MoveVelocity 一卡一卡的 Laya.timer.once 频繁创建导致的

    -   FrameInterval 删掉算了 timerLoop 又不会出现 timer 次数的变化, 这一切都没有意义的

-   @todo

-   @todo MoveCom 我希望是在一个地方 新建一个 loop, 每一地方要用就会在这里添加一个函数

-   @ques 添加子弹到页面上

    -   撞墙反弹
    -   zTimer 变化太大了, 不太适合做动画

-   @todo 建立新的 git 库 将 fish 放上去

*   @todo createSprite

*   mvc 最可能出现问题的地方到了 view 的关系组织

*   @todo 发射子弹...

*   @todo 鱼+子弹的位置更新能不能写成 通用的...

*   @bug 鱼离开没有 destroy 绑定的事件不一致...

## 2019-09-26 15:05:32

-   @todo addPlayer

-   动画 + sprite 应该如何创建..

## 2019-09-26 11:07:39

-   @ques 碰撞检测每一条鱼 怎么处理

    -   在子弹的更新里面处理??

-   gun: pos 有什么用...

    -   瞄准时自动旋转炮口...

-   @ques

    -   所有移动组件 公用一套 interface, 这样其实停难的
    -   DisplaceInfo
        -> moveInfo moveCom

-   @todo 先只把用户加进去, 最简单的实现基本逻辑...

    -   bulletGroup | netGroup 还有没有必要存在...
    -   可以先删除掉, 后面再加也可以...

-   @ques 炮台的位置 有没有比 Coordinates 更好的方式

    -   普通场 + 竞技场的区别

-   @ques 现在的炮台也许只有一个炮口...

-   @note net 可以放在 bullet 下面, gun 监听 bullet cast_fish...

    -   这样就不需要维护 gun:net 属性了

-   @ques bullet tract 如何做成一个 com

    -   改变 bullet 的位置 方向 + 触发击中逻辑:> 改变原来的移动逻辑
    -   moveVelocityCom moveTrack MoveDisplace 这里面调用 tick 命令

-   fish.body:> 测试碰撞...

## 2019-09-25 09:15:11

-   @todo bulletGroup fishGroup

    -   gun>bullet|group 他们提供相同的 api, group 里面可以是 bullet

-   @ques gunModel netModel 有没有必要存在...

    -   去掉有什么优点, 保留有什么缺点...

-   @todo 有些动画是不需要放在 sprite 里面的

-   mac shortcut f11 是干什么的
-   @ques 鱼的站立动画如何处理

-   @ques data/sprite.ts 到底有什么意义 能不能删除掉

    -   难道要我去建立那么多的 ui, fish 1-40 other/...

-   @todo 一个星期之后试试 鼠标操作

-   @ques mac 文件夹 自动排序

-   @ques 知乎 typescript

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

-   @ques glory animate rxjs
