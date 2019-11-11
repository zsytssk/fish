-   @ques displace=fun usedTime 如何处理...
    -   usedTime -> used_frame ->
    -   显示的总共时间, 在页面行动轨迹...

## 2019-11-11 20:06:26

-   @ques 鱼群中的鱼 usedTime 为负数 也需要添加额外的距离

-   @todo 倍数文档 更改倍数...

-   @todo channel

-   @todo 优化 鱼群数据

    -   缩短 key + 去掉 funcList
    -   本地保存一份鱼群的路线数据
    -   funList fun --> radio

*   @ques 乌龟需要一个标示... dieReBorn: true

*   @todo 显示用户的金钱 + 金钱的变化

    -   更改倍数
    -   添加用户...
    -   发射子弹 减少金钱...

*   @todo 不影响游戏体验的提示 在顶部出现一个提示框...
*   @todo 添加用户接口...

*   @bug `const shapes = getShapes('net');`
    -   暂时不用 level 后面可能会改, 但是折合 level 其实没有什么关系...
*   @todo StartTrackInfo

*   @todo gold -> bullet_num
*   @bug bombModel.active fish_model 没有 pos

*   @ques 我可以监听 gunAddBullet 然后 bullet.setTrack

    -   不行... bullet 在创建的时候就会设置 MoveCom
    -   能不能将 move_com 传进去...
    -   所有需要借用 Event 传递收据 都需要 提供方法 emitEvent, 知道哪些地方用了这个方法...

*   @ques 能不能将所有的代码 com 的代码全部放在其他的地方...

    -   trackFishCom

*   @ques ...

-   @todo model 的 destroy

-   点击屏幕内您想投放炸弹的位置

*   @todo emit(ModelEvent.Destroy);

*   @todo PlayerEvent.Destroy

*   @todo gunSpeedUpCom...

    -   com 命名

*   @todo modelEvent -> CommonEvent

*   @todo 奖励数目 颠倒...

-   @todo 测试环境的搭建...

    -   正常进入游戏 ... 鱼 socket...
    -   各个测试相互的独立, 分别进入...

*   @thk 能不能在不同的游戏模式的时候, 动态的给 model 添加 com, 实现... 的功能...
    -   将不同模式的代码隔离...

-   @todo 设计模式
    -   一个 model 只做实现这个模块的基础代码(struct)
    -   这个代码可以扩展其他的功能(com)

*   @bug bulletModel -> MoveTrackCom update 报错...

    -   target 销毁时 没有消除绑定...

*   @todo 设计模式
    -   destroy 时候 调用方法 --> 初始化值 -> 父类 destroy

-   @ques GunTrackFishCom 能不能知道 track_fish 时创建的子弹...
    -   event...

## 2019-11-11 10:24:33

-   @todo

    -   服务端的鱼发给我的时候鱼已经要离开页面 我需要做兼容
    -   tableOut 的处理

*   @bug 技能释放的时间不同步...

*   @bug 锁定无法选中屏幕中的鱼???

*   @bug 机器人自动攻击...

*   @todo 技能激活的动画...

    -   炸弹无法关闭

-   @todo 炸弹 + 锁定 没法触发

-   @ques 狂暴的进度怎么处理...

-   @ques 鱼潮的位置可以通过鱼的 offset 来设置...

    -   这需要我和设计的原图保持一致

-   @ques 通过鱼分

-   @bug 锁定的鱼 锁定的部分在屏幕外面 (因为鱼只有很少部分在屏幕内...)

## 2019-11-09 13:40:56

-   token 过期的处理

-   conn::error 接口格式... res 而不是 code
-   @ques @test 如何测鱼的路径...

*   @todo 皮肤 SkinMap
    -   getSkinNoById

-   @opt 鱼的 totalTime 要不要在之前处理掉...

-   @opt mac 高亮光标

-   @opt ps 脚本获取 显示的图层...

-   @todo 本地测试鱼潮数据...

-   @todo 正常连接 socket 的地方如何测试环境
    -   ....

## 鱼潮生成

-   鱼的游速 @产品

## 2019-11-08 14:12:16

-   @ques 鱼潮来了 没有进入的鱼 要不要清除...

-   conn::error 1002 "BAD_JWT_TOKEN"

*   @todo 鱼潮来了 换皮肤...

*   @bug 鱼潮中有两个鱼叠在一起...

-   @bug 数据报错 难道要 try catch

    -   特殊的错误的处理...

-   @todo 鱼潮的数据能用最新的吗 @hujianx

-   @opt 鱼群来了 清理鱼的时候所有的鱼的速度都一样...

-   @bug 用户获得钱 颠倒了...

-   enterGame 用户 + item...

    -   shoot :> 发射子弹 + ...
    -   渲染用户的技能...
        -   @ques item_id 对应的技能分别是什么...

-   quickLeaveFish 鱼没有显示 直接离开页面...

    -   tototal time /1000

-   enterGame 获取用户信息, 加鱼 打鱼

    -   鱼群添加 鱼...

-   @ques 能不能把正常进入游戏的接口天好

-   @todo login.js

-   @todo 设置 socket url...

-   @ques coingame nav 太大了...

-   @todo 登陆的 url 如何获取 coingame.config.loginUrl @zhangxiao

    -   coingame.account.login()
    -   coingame.sys.lang

-   @todo 登陆的 url 如何获取 coingame.config.loginUrl @zhangxiao

    -   coingame.account.login()

-   @ques 游戏中如何登陆 socket...

    -   login + enterGame.. 连接 GameSocket
    -   publicKey 写死...

-   @todo 大厅的 socket

    -   @ques socket url 从哪获取... 如果是写死的 那么只能通过环境变量来解决这个问题了...

-   @todo 断开 socket... env

*   @todo 公共的部分应该去做哪些内容...

*   @ques token 出错的的错误码 是在 code 中

    -   websocket 怎么做 统一的错误处理...

*   @ques token 出错的的错误码

*   @ques 如果本地已经有 token 的处理...

*   @todo game-client-sdk merge request

## 2019-11-08 10:02:30

-   @ques 游客的 token 是怎么处理的...

    -   游客和没有登陆的用户怎么区分...

-   @note
    // 获取游客 TOEKN
    "GET_GUEST_TOKEN": "getRequestId",

-   @ques 前端代码 要不要 区分是游客

```ts
const { data } = await utils.socket.send({
    cmd: CONFIG.ACTION.GET_GUEST_TOKEN,
    isPromise: true,
    ignore: true,
});
```

-   ## @ques 游客和正常用户 是怎么区分的

-   @ques 游客通过一个特殊的接口获取 游客的 token...

-   @ques 用户直接点击登陆按钮是直接登陆的吧 没有 `&preflight=true`

## 2019-11-07 20:07:33

-   @todo 机器人的处理逻辑...

-   @todo 切换炮台等级

    -   登陆页面
    -   获取 code
    -   获取 token
    -   token 不合法 的处理

-   @todo 第一通过 code 后面就将 code 删除掉了

    -   这个逻辑是对的

-   @ques 为什么不用张笑的 socket

    -   监听事件 不太好用
    -   要一帧帧去更新, 捕鱼不能这样去做...

-   我只要 url 中去掉 code, 验证 token 就可以了...

    -   url 中去掉 code, 最好 公共模块去做...
    -   game.sdk 只要获取 code, 其他的就可以不做了...

-   @ques 游客怎么处理...

-   @ques 这公共的代码 检测 code(url + localStorage+ cookie) + token
    -   ...

*   @opt 开始不显示 鱼 只有鱼进入页面才显示...

    -   in_screen change...
    -   不然不创建 fishAni...

*   @todo fishView setVisible

-   @todo 切换炮台等级

    -   登陆页面
    -   进入桌子
    -   离开桌子
    -   addFish

-   @todo 鱼组 + 鱼潮的数据...

-   @todo 设计 鱼潮数据...

-   @todo quickLeaveFish + changeMoveCom

    -   鱼的速度增加...

-   @ques fish 需要 quick_leave 的状态吗...

-   @todo 鱼潮来袭 处理

    -   清理所有的鱼 能不能做成 被鱼碰到波浪才加速 和 wave 一样的速度...

*   @ques 鱼群数据...

## 2019-11-06 17:42:57

-   @todo 所有技能的联调

    -   锁定 lock_fish

-   @ques 我这代码其他人能不能看的懂...
-   @ques lockFish useId 写错了 @hujianx

-   @ques 胡建新 能不能使用 used_time....

-   @ques 技能锁定 有两步 我怎么处理...
    -   step ... 怎么把这数据传过来...

*   @todo 鱼潮的数据...

    -   先按照我的做, 可以给一个原来的 demo...

-   @todo 子弹 1 2 3 也放在一起... @设计
    -   bindSocketEvent

*   @bug startCount 的时间比 createTimeout 时间长..

### save

-   冰冻...

## 登陆的流程...

-   @todo jiri 地址...

-   @ques 访问的地址怎么又一个 null

    -   checkLogged

-   @ques location.replace vs location.href =

    -   preflight=true @meng

-   @todo 登陆的流程参考 张笑+萌哥的

testing-bitfish.cointest.link

-   @todo 连服务器
    -   如何去登陆, 获取登陆接口...
    -   登陆 获取 token

## 2019-11-06 11:42:33

-   @bug 其他用户的炮口的位置不对...

    -   @ques 为什么... 动画加载前设置 没有用吗...
    -   在设置好方向之后 设置
    -   上面的炮台的方向为什么也是 `new SAT.Vector(0, -1)`

-   @todo 楼上开炮 是什么效果..., 会不会颠倒...

*   @todo 本地测试

    -   炸弹
        -> gameCtrl.onUserBomb -> gameModel.activeSkill -> PlayerModel -> BombModel.active --> SkillModel... -> SkillCtrl
    -   冰冻 鱼潮...

*   @todo BombModel.active -> skill_model.active(data, this);

*   @todo testBuilder 异步操作 + 去掉 afterAll...

-   @todo 对炮台 子弹 网 大小和坐标 @yangchunming

-   @todo 狂暴技能... 像其他技能一样...

    -   @todo 狂暴的样式... @设计 @todo 不显示 技能图标 而是 技能框子 上面闪动

-   @ques 炸弹的显示效果 + 实际作用如何处理....

## 2019-11-02 16:47:45

-   @todo 技能的光...

-   @todo 鱼潮来了倒计时 @设计稿

-   @todo 鱼的阴影

-   @todo 发射子弹的 调试...

*   @bug 本地激活技能之后 有可能无法点击屏幕发射子弹

-   @todo 用户的金钱 变化...

*   @bug 每个(子弹+网) 不同的大小如何解决

*   @play 当前用户的钱怎么展示...

*   @play 抽奖动画... + 技能动画...

*   @play 用户断线 自动 离开游戏吗??
    -   还是只是将

#### save

-   击中鱼 奖励
-   @bug `SPRITE.gun[i].has_base`

-   @ques 自己的测试数据 模拟整个流程...整个流程...

    -   炸弹的激活 --> 选中位置 --> 给服务端 --> 显示爆炸效果 + 鱼击杀效果..
        -   mockSocket..., 和 socket 一样的接口...
    -   射击 + 击中鱼 + 鱼死亡 + 奖励...

-   @ques 奖励动画...

    -   奖励圆盘

-   @todo showAwardNum 注册字体...

-   显示奖励数目

-   gun5 网

## 2019-11-01 20:29:59

-   @todo 音量设置

    -   voiceCtrl

-   @todo gun5 怎么做 大都是一个动画

    -   5:> body + gun
    -   1-4:> gun light
    -   播放动画不一样...
        -   分成三丰...
    -   直接使用不同的 ui 是最好的...
    -   用户换皮肤的时候怎么换 class...
    -   5 动画...

-   @todo vscode 快捷键...

-   @todo 日历

-   @ques 普通场 竞技场 代码有什么不同

-   @ques 子弹过于花哨了 能不能干净点 让 击中网动画漂亮点就可以了
    -   4 网的效果 有问题...
    -   light 怎么没有...
    -   光能不能 上去点 这样动画好显示......

## 2019-11-01 11:30:35

-   @ques 怎么给字体添加组件 作出效果...

-   @uqes 抽奖中的奖券, 是从哪获取

-   @todo 炮台 + 金币动画

    -   多个动画在一起 会不会变卡

-   @ques vscode 复制选中区域复制选中区域...

-   @ques 这周我想把接口连调上...

## 2019-10-31 17:56:29

-   @todo runLottery

-   @todo 抽奖

    -   renderExchange
    -   渲染数据
    -   动画
    -   点击事件

-   @ques use_gun_skin 没作用

-   @todo shop 方框的样式

-   @todo 所有弹出层的数据渲染...

    -   商店
    -   抽奖
    -   购买子弹
    -   声音设置..

-   @ques 商店 item 的名称 应该支持多个语言

    -   这需要前端本地来做吗...

-   @todo 购买按钮的样式...

-   @todo 平台 的 币种的配置...

-   @todo bug 无法打包 json 文件

    -   webpack ts-loader test

-   @ques 鱼潮来了 要把页面背景换掉 是不是搞错了...

## 2019-10-31 13:46:23

-   @todo 升级 mac..

-   @bug loading 进度条的样式...

-   @bug 在 game 上设置一个 game mode 表示游戏的模式...

    -   这个玩意放在什么地方都不怎么合适...
    -   放在 component 里面可以合适吗...
    -   和数据无关的就放在 ctrl 层

-   @todo test 的样式

## game-client-sdk

-   可以将他和 main.ts 单独打一个包 其他文件在打一个包

    -   这样好不好 ???

-   `import '@babel/polyfill/noConflict';`

    -   这个可以放到 webpack 的的配置中去

-   @todo coingame.sys 能不能支持本地测试..

    -   `coingame.sys.init` 能不能设置服务器的地址 请求...

*   @ques 我可以本地不使用 coingame.sys 而是用自己的代码
    -   这样就可以测试了...
    -   @ques coingame 实现哪些功能...
    -   http://gitlab.intranet.huiyin.com/springfans/game/game-client-sdk
    -   提交 merge request 给张笑...
    -   直接使用 coingame.sdk 代码, 让他可以支持本地测试...
        -   将 babel 的依赖去掉...
        -

## 2019-10-31 09:15:22

-   @bug once destroy 时有的事件无法执行...

    -   set let of 难道也有数组的问题...

-   @todo fish_total_time 时间加长 会 导致误差增大吗
    -   不会...

## 2019-10-30 20:49:42

-   @bug Laya.timer.loop 会不会 丢帧...

    -   还会差 1 2 帧, 是不是 bug
    -   检测鱼在屏幕中游动的时间
    -   增加时间 会不会加大误差...
    -   等很长时间不做任何事情 突然发射一个子弹 子弹就飞掉了...
    -   这鱼游动不止 10s 钟

-   @ques 本地怎么测试 登陆用户

    -   有没有测试环境...
    -   写死 publicKey ...
    -   怎么获取这些 key+code
    -   这些数据又能 激活多长时间...
    -   服务端有没有写好什么接口... 有没有地方有这些数据...

-   @ques decorator cacheInit 挺实用的

-   @ques 弹出层的数据测试...

-   @ques 是不是 所有 item 又一个特殊的 id... @服务端

    -   技能 皮肤 ...

-   @ques

    -   让一条鱼 停在页面中...
    -   stop.MoveCom

-   @bug gun1 子弹发射的位置...

-   @todo 冰冻动画的 缝隙...

-   @todo 炮台旁边空白区域 无法点击...

-   @todo 本地游戏初始化 接入登陆..流程...
    -   能不能像 glory 一样...

## 2019-10-30 17:16:21

-   @ques hallCtrl 的 destroy 在什么地方调用...

    -   ctrl 自己调用...

-   @todo 添加首页动画...

    -   设置 coin 语言
    -   test...

-   @ques on 要不要做成 取默认的数据, 这样就不用担心初始化了..

    -   但是 event 并不知道 数据的路径...

-   @ques 当前用户 名 + 账户信息保存在什么地方..

    -   userInfo...

-   @bug animate slide_down_in 频繁调用 就会位置飞掉...

    -   做成异步的就可以了...

*   @todo 全屏自适应... bug

-   @todo 测试本地数据...

-   @todo offBindEvent

-   @todo 压缩 + 生成版本号(是不是服务端生成的..)

## 2019-10-30 10:16:32

-   @ques 什么时候重启心跳...

    -   收到任何消息的时候...
    -   每隔 10s 中发送一次信息如果 3s 内没有收到信息就
    -   能不能做成 await 这样逻辑清晰点...

-   @thk 三个异步过程

    -   能不能用 rxjs 处理
    -   每隔 10s 大循环 (1)
    -   10s 后 三秒去重连 (2)
    -   10s 后 发送命令 如果收到回复 清除 2 (3)

-   @todo 打到鱼组中的鱼 将 groupId 返回给服务端...
-   @todo 鱼潮 id r1-r6
-   路径的长度 path.json id:len
-   所有的时间单位都是毫秒...

## 2019-10-29 17:16:07

-   websocket 代码

    -   连上
    -   心跳(2 | 3) (\_on(msg) {)

-   @ques socket 的数据从哪获取

    -   code 从哪获取..., 从登陆的流程 url 中获取... 参考 glory
    -   jwt(token) 从哪获取...,参考张笑的代码... 又一个

*   @ques 要不要 honor 只提供原始的 socket
    -   只做基本逻辑 + 封装 api 类似 socket.io
    -   我有很多地方需要绑定

-   @ques 传奇的时候我需要不停的传 token 吗

    -   @服务端需要吗 真的需要...
    -   好像不是 但是我的 token 需要记下来

-   @ques ping 是多长时间发一次...

    -   每隔一段时间 pingTimeout 是不是有问题...

-   @ques `localStorage.getItem('token')` 会不会过期啊...

    -   能不能像传奇一样啊...
    -   又一个固定的错误嘛

-   @todo 月度总结...

-   @ques 有没有验证 checkToken 的接口...

    -   code --> token
    -   code 记在本地, 每次刷新 去请求 token..., 请求不到 以为是游客
    -   游客登陆

-   'scoket:authorize';

## 2019-10-29 11:41:28

-   @ques decorator cacheInit 挺实用的

    -   function 能不能用 decarator

-   @todo 连接 socket + 大厅的动画...

    -   最好我自己写一个 websocket 的连接处理...
    -   加密 解密 怎么处理...
    -   断线重连怎么处理...
    -   glory 的 websocket
    -   自己写 看看他的源码

-   张笑的 socket 连接的处理

    -   http://gitlab.intranet.huiyin.com/springfans/game/game-utils/blob/master/SocketManager.js
    -   http://gitlab.intranet.huiyin.com/springfans/game/game-utils
    -   http://gitlab.intranet.huiyin.com/springfans/game/oxpk

-   @todo 张笑的游戏初始化的处理...

## 2019-10-29 09:53:50

-   @todo 连接 socket...
-   @todo 小 alert, 将所有的 txt 后面加 zh

-   @1920 x 750 在 ipad 或者普通电脑上显示效果有问题

    -   需要自己写自适应方法吗...

-   @ques injectAfter

-   @todo
    -   tip 的代码... tip 怎么居中
    -   alert

## 2019-10-28 15:43:50

-   @todo websocket 验证流程...

*   @todo 打开弹出层...

*   @todo 所有东西的 icon 放在一起 用来什么来区分

    -   name + itemMap

*   @todo item 的样式...

    -   shop 单独以文件夹...

*   lottery item 的样式...

*   lottery progress bar...

## 2019-10-28 10:50:20

-   @todo

    -   技能的冷却时间...
    -   技能的本地 联调

-   @todo 触发... 爆炸动画

-   @bug freeze 之后无法二次 freeze

-   @bug 无法取消 `offFishClick`

-   @ques 怎么 complete a observer

    -   自定义 complete func
    -   when Subscriber complete
    -   rxjs fromEvent complete... 取消事件绑定...

-   @bug 瞄准鱼之后无法点击屏幕了

*   @todo 锁定无法更改目标...

    -   现在是 promise, 可以做成 observer
    -   但是怎么清除这个绑定呢..
    -   offFishClick

*   @bug 技能已经激活 点击技能图标再次激活...

*   @todo `enum SkillMap`

-   @bug createFishDisplace...

-   @ques 怎么选中屏幕中的鱼...

    -   创建一个鱼的节点 将他包裹起来, 他的大小等于鱼的大小...
        -   如果鱼的形状是圆行怎么办 --> 只计算 offset...
    -   点击屏幕之后通过 便利 fishModel 计算 pointInShape...

-   @ques onFishClick... 获取 fish 的 fishId

    -   能不能监听一次 之后就取消了...
    -   promise.race

-   @todo 被攻击的特效 可以和发射的特效一样处理...

-   @todo test.fish.... 数据错误...

## 2019-10-25 10:38:03

-   @todo

    -   大厅页面
    -   技能的本地 联调
        -   技能的冷却时间...

*   @ques 不同的技能怎么使用相同的格式

    -   getProgress

*   @todo 炮弹选择屏幕中的位置时

    -   已经激活 但是没有触发 怎么显示这个个状态 @设计
    -   skillBox 上直接显示提示...
    -   技能本身需不需要什么特殊的样式

*   @ques 鱼组中所有的鱼的速度都是一样的 这可以吗 (产品...)

*   @todo 国旗 flag ..

*   @todo 马上玩的 接口.. @hujianx

*   @bug 进入游戏的时候 大厅没有销毁...

    -   切换场景怎么处理...
    -   怎么监听切换场景...

-   @

*   @ques hallView onResize 为什么不执行...

*   @todo 玩玩张笑的游戏 看看有什么需要注意的地方...

*   @todo onPoolClick onFishClick

## 2019-10-24 09:34:56

-   @ques 鱼组 中间删掉一个元素...

-   @todo markdown to type.d.ts

-   @ques 自动发射怎么将命令给服务端...

    -   每次发射都需要将命令给服务端...

-   @ques checkReplay @ques

*   @todo 同步服务端的接口...

-   @todo 技能冷却时间复盘 ?? @hujianx

-   @todo setRobotReport 复盘...

*   @todo

    -   技能:> 本地跑完
    -   同步服务端的接口...
    -   点击 鱼 + 点击屏幕一个位置 (不显示提示触发 技能...))
    -   webpack 清理 console.log --> 这时候怎么调试呢
    -   干脆替换 console.log 吧

*   @ques 鱼组 能不能 按照鱼潮的数据生成...

    -   能不能将对路径的偏移做成一个函数...
    -   这样鱼组就是几个独立的鱼...

*   @ques 给当前用户炮台添加点击事件

    -   这样就不会发射到底部...
    -   所有用户的炮台都需要这样的点击事件 查看玩家信息...
    -   @设计

*   @todo 技能的点击 + 释放...

    -   技能无法点击...

*   @ques 更新 energy 需不需要 接口 (应该要) @后台...

*   @ques 自动释放的技能怎么处理...

*   @note 点击释放技能

    -   选中鱼
    -   选择炸弹炸点

*   @ques 其他用户需不需要创建 skillCtrl

    -   如果不要 炸弹如何处理...
    -   gameModel 添加 炸弹效果...
    -   不需要...

*   @ques 技能有多部操作 在什么地方去监听这些...

    -   最好是在相应的 skillCtrl 中监听...
    -   ctrl --> model --> ctrl --> server --> ... model
    -   比方说炸弹...

*   将技能在页面上渲染出来

*   @ques 能不能用

    -   export 给 bomb bomb 再去
    -   const 表示 SkillStatus
    -   不好指定类型...

*   @todo 多步技能怎么处理

```ts
BombStats = {
    ...SkillStatus
    fish_list: string[]
}
```

怎么处理...

-   @ques 有没有必要 将服务端的数据换成自己需要的数据
    -   player_info ... 就直接可以 setProps 了

## 2019-10-23 11:31:34

-   @bug 网的动画太大了 有时候罩 P 住鱼 但是鱼没有显示 被网住...

-   @bug 子弹开始的位置 可能在炮的旁边能够看出来...

-   @ques skillModel --> freezing 这个不用继承 怎么处理

    -   interface...
    -   skillCoreCom

-   @ques FreezingCom --> GameFreezingCom

-   @todo CMD.skill_disable

-   @ques 鱼提示锁定鱼怎么处理...

    -   锁定的鱼被打死 重新提示怎么处理...
    -   服务端的数据...

## 2019-10-23 09:43:10

-   @todo overlapArrLast

    -   多次发炮 - 然后动画就不播放
    -   炮台在子弹最后一个发射之后 还要 fire
        -   怎么让最后一个不清楚...

-   @ques 滚动条那么长 是渐变 能处理吗
    -   能做一个小的吗

*   @ques fire 动画播完自动播放 standby...

    -   播放队列...

*   function asyncQue("name", params, function() {})

*   @todo vscode open contianer folder

*   @ques junqing react 的工作好找吗???

*   @ques level 击中鱼 时 需要发给服务端

    -   我如果像设计一样用他们的动画怎么样...
    -   碰撞区域需要特殊制作...

*   @ques 每一个炮台的发射位置不一样...
    -   需要一个配置...
    -   在 sprite 里面写...
    -   而且子弹张的不一样怎么处理
        -   子弹的动画在配置里面读取... as

-   @ques 网到的鱼需要变色

    -   当前用户 网到的鱼需要变色
    -   机器人+当前用户需要知道捕捉的鱼
    -   其他用户只用出网就可以了...

*   @todo @设计 子弹 + 网 只需要给一个...
    -   动画能不能放在一起...

-   @ques bulletGroup 能不能 删除...

*   @ques 有什么方便的方式去生成鱼群...
    -   这可能和他鱼的路径有关系....
    -   可能他的路线也比较简单...

## 2019-10-22 11:38:49

-   @ques 我代码怎么发布到测试环境... @张笑

    -   将 dist 传到 git 上面, 然后 让服务端指定 dist 文件夹...
    -   这样项目就会大两倍 没有更好的方法吗...

-   @todo 国际化

    -   国际化的翻译 [...]

-   @ques 胡建新有没有用过比较好的设计模式...

    -   切换语言之后是不是要本地保存 + 用户配置

-   @ques sdk

-   @bug 默认炮台播放动画 + 所有的子弹的皮肤都一样

    -   12 13 gun 动画搞错了

## 2019-10-22 09:23:42

-   @ques 如果 fishGroup 中一个鱼被击杀了, 那么这个鱼到底怎么同步

    -   添加一个 index 或者, 按照数组的排列...

*   @bug @设计 net2 动画太慢了

    -   gun3 炮口太窄了

*   @ques 一号炮台 为什么 base 和 gun 能不能放在一起...

*   @ques 2 网有四种状态...

    -   怎么有四种 分别是做什么的...

*   @ques 光底座是不是都是一样的

*   @todo getHoleNum(level)

    -   改变炮台的等级... score
    -   接口的 md 地址... @后端...

*   @ques calcCurCurveInfo 实在是太恶心了

*   @todo 鱼群来了 清理鱼 fishModel 的原来的 move_com 需要 destroy...

*   @todo 炮台的等级...
*   @todo 优化 displace

*   @ques gun skin level 如何区分...

*   @todo 鱼 长宽 屏幕长宽
    -   1920x750

-   snippets const state let state

## 2019-10-21 10:43:26

-   @ques 怎么将鱼组中的鱼 的路径... createSpace... 怎么处理..

    -   能不能将原来的路径方法扩展一下
    -   和普通鱼的不同
    -   @设计 能不能画在正常的后面...
    -   @ques 平移之后 贝塞尔曲线 起始点 还能出屏幕吗...

-   @ques 要不先画出来再说...

-   @ques 能不能几条鱼 全部使用一个 disPlace 这样可以节省性能...

    -   直接传入 MoveCom... onTick start stop... destroy
    -   destroy 要清除三个
    -   createFishModel()
    -   createFishGroup()

-   @ques 游动到屏幕外面 在现在的 displace 中怎么处理...

-   @todo 鱼组 被冰冻的时候所有的鱼都被冻住了...

-   @todo 技能的渲染 + 倒计时 + 狂暴技能动画

    -   直接添加在 ui 中的动画能不能停止播放 visible = false
    -   冰冻... 真实的技能的控制...
    -   检测所有有问题的路径 开始两个 结束两个...

-   @todo FishGroup..., 提供和 fish 一样的接口...

    -   bulletGroup 能不能也一样...

-   @test 能不能在 game_test 下面添加子 test. runAll...

-   @todo 子弹的动画看的不流畅 是否是他的帧数 和 刷新的帧数不一致...

*   getDomain http...

*   @todo 子弹相互碰撞的效果...

*   @todo 接口 链接发给我...

*   @todo fish 的 offset 只需要前后...
    -   路径和屏幕的夹角 > 45%
    -   站立的鱼怎么处理, 左右...

-   @bug 直立行走的鱼动画路径错误

-   @bug 可以用直线 来测试上下左右 sprite offset 对不对...

    -   @ques 如何翻转一个贝塞尔曲线..
    -   end_radio 需要重新计算,
    -   我可以在生成数据的时候直接将原始 path 颠倒, 但是 function 能这样处理吗...

-   @todo 优化 Displace 逻辑...

-   @bug `test.fish.run(0, '17', '2')` 会跳一段距离
    -   reverse

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
    -   所有鱼的形状的调整 1
    -   炮台的布局 1
    -   鱼的形状+sprite offet 数据 1
    -   鱼组-1
        -   yu zhu
    -   鱼群
        -   鱼群的基本逻辑-1
        -   生成鱼群数据(每个鱼群一天))
    -   所有的技能
        -   技能的基本逻辑(倒计时+释放)-1
        -   冰冻 1
        -   锁定 1
        -   炸弹 + 炸弹鱼 1
        -   超级技能 = 加速-1
        -   自动挂机(怎么做??)-1
    -   炮台+子弹+网的皮肤(ui 动画转到编辑器中+代码调用) 1
    -   双口炮 两个 子弹 两个网 1
    -   用户 炮台 子弹 鱼 在页面中 上下同步 1

    *   服务端的接口
        -   鱼更新
        -   复盘 1

    -   其他 1
        -   socket - 0.5 声音 - 0.5
        -   国际化 1
        -   socket + sdk 接入
        -   页面切入后台返回
        -   复盘: 页面切入后台返回 + 异地登陆 + 刷新页面
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
