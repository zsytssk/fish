## 登陆流程

### 第一步 跳转登陆页面

-   进入页面 自动进入 sso 获取登陆状态
-   没有登陆作为游客(没有 code,url 带上 preflight, 防止重复刷新)
-   登陆作为正常用户(有 code)

### 第二步 连接 socket

-   正常用户 -> 通过 socket -> 获取 token -> 记下 token
-   游客 -> 通过特殊接口 -> 获取 token -> 记下 token

下次就用 token 来判断登陆状态
