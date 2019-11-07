oxpk/assets/script/utils/Socket.js
oxpk/assets/script/utils/SocketManager.js

CONFIG.ACTION.SOCKET_AUTHORIZE

-   glory socket

```ts
// @ques host
new WebSocket(
    `${this._url}/gws?auth=${this._authorizeKey}&code=${this._code}&host=${host}`,
);

async function checkToken(token = '') {
    this._progress += 0.25;

    // 没有token 是游客 通过
    if (
        token === '' &&
        localStorage.getItem('token') === null &&
        utils.cookie.get('token') === null
    ) {
        const { data } = await utils.socket.send({
            cmd: CONFIG.ACTION.GET_GUEST_TOKEN,
            isPromise: true,
            ignore: true,
        });

        utils.socket.token = data.jwt;

        localStorage.setItem('token', data.jwt);

        utils.cookie.set('token', data.jwt);

        this._progress += 0.25;
        this._done += 1;
    } else {
        if (token === '') {
            token = localStorage.getItem('token') || utils.cookie.get('token');
        }

        utils.socket.token = token;

        localStorage.setItem('token', token);

        utils.cookie.set('token', token);

        this._progress += 0.25;
        this._done += 1;
    }
}
```
