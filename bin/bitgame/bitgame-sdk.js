class sdk {
	_isLegal = false;
	init = () => {
		// 除了判断是否在iframe内，还要增加域名判断
		if (self === parent || parent.name !== 'gameTransit') {
			console.warn('no parent detected! illegal call!');
		} else {
			this._isLegal = true;
			this.initEvent();
		}
	};
	initEvent = () => {
		window.name = 'gamesdk-inner';
	};
	postMessage = (message = { type: '', data: '' }) => {
		this._isLegal && parent.postMessage(JSON.stringify(message));
	};
	login = () => {
		this.postMessage({ type: 'login', data: '' });
	};
	message = (msg = '') => {
		this.postMessage({ type: 'message', data: msg });
	};
	recharge = (rechargeInfo = {}) => {
		this.postMessage({ type: 'recharge', data: JSON.stringify(rechargeInfo) });
	};
	withdraw = (withdrawInfo = {}) => {
		this.postMessage({ type: 'withdraw', data: JSON.stringify(withdrawInfo) });
	};
	reload = () => {
		this.postMessage({ type: 'reload' });
	};
}

const bitgame = (window.bitgame = new sdk());
bitgame.init();
