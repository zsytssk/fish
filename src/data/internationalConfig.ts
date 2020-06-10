import { ServerErrCode } from './serverEvent';

export enum Lang {
    /** 中文 */
    Zh = 'zh',
    /** 中文 */
    Zh_HK = 'hk',
    /** 韓文 */
    Kor = 'kor',
    /** 英文 */
    En = 'en',
    /** 日文 */
    Jp = 'jp',
}

/** 國際化的資源 */
export const InternationalRes = {};
/** 國際化的提示 */
export const International = {
    [Lang.En]: {
        deposit: 'Deposit',
        withdrawal: 'Withdrawal',
        balance: 'Balance',
        bullet: 'Bullet',
        automaticFiring: 'Automatic firing',
        buyBullet: 'Purchase Bullet',
        casualMode: 'Casual Mode',
        tournamentMode: 'Tournament Mode',
        trialField: 'Trial Field',
        realField: 'Real Field',
        stayTuned: 'Stay Tuned',
        quickStart: 'Quick Start',
        NumBullet: 'Bullet',
        guest: 'Guest',
        volumeSetting: 'Volume Setting',
        music: 'Music',
        soundEffects: 'Sound',
        tips: 'Tips',
        cancel: 'Cancel',
        confirm: 'Confirm',
        luckyDraw: 'Lucky Draw',
        redemption: 'Redemption',
        buySuccess: 'Purchase successfully',
        luckyDrawTip2: 'Congrats! You’ve got',
        Num: 'Bullet',
        shop: 'Shop',
        skin: 'Skin',
        lock: 'Lock',
        freeze: 'Freeze',
        bomb: 'Bomb',
        voucher: 'Voucher',
        use: 'Use',
        inUse: 'In Use',
        item: 'Item',
        youAreHere: 'You are here',
        purchase: 'Purchase',
        buyBulletCost: 'Need to spend',
        leaveTip: 'Confirm to leave the game?',
        reEnter: 'You are in the game now, do you want to re-enter?',
        kickedTip: 'You have been kicked, refresh to re-enter the room?',
        buyBulletTip: 'Insufficient bullet, proceed to purchase?',
        buySkillTip: 'You don’t have this skill, proceed to purchase?',
        logoutTip: 'Login disconnected, refresh current page?',
        posBombTip: 'Please select a location on the screen to place the bomb',
        aimFish: 'Please select the fish you want to attack',
        help: 'Help',
        times: 'times',
        help1:
            'Fish Point: Different fishes have different value, the number of bullets obtained after capturing a fish equals to the multiple of the cannon currently used multiplied by the Fish Point. For instance, a fish with 50 fish point is captured by a 10x cannon, the number of bullets obtained is 50x10=500. Fishes with different Fish Point:',
        help2:
            '2. Skill instruction: Players can apply below skills in the game.',
        help2Super:
            'Super Skill: Passive skill, it will be automatically triggered after certain number of fish are captured by player. It increases bullet power and doubles the rate of fire.',
        help2Freeze:
            'Frozen Skill: Active skill, it can be obtained by killing certain types of fish, or can be purchased. It can freeze most of the fishes on the current screen.',
        help2Lock:
            'Lock Skill: Active skill, it can be obtained by killing certain types of fish, or can be purchased. It can automatically lock the fish with the highest Fish Point on the current screen, or players can also click to select a fish to lock.',
        help2Bomb:
            'Bomb: Active skill, can be purchased. it will randomly kill a group of fish on the screen.',
        help3: '3. Available multiple of cannon:',
        help31: '1,2,3,4,5,10,15,20,30,50,80,100',
        help4: '4. Other instructions',
        help41:
            'Redemption: Player can get some Fish Vouchers after capturing certain type of fish. The Fish Vouchers can be used for redeem rewards. ',
        help42:
            'Lucky draw: Player will qualify 1 lucky draw after capturing 10 fishes with 100 Fish Point at least, the rewards includes bullet and currency.',
        help43:
            'Purchase: Player can purchase bullets inside the hall, and purchase cannon skin or bullet effect by clicking the cannon in the game.',
        tourSkip: 'Exit',
        tourStart: 'Start',
        tour1: 'Click the drop-down button to select the coin',
        tour2: 'Game room will change accordingly <br/>based on coin selection',
        tour3:
            'You only can experience the game in Trial Field, <br/>you can earn coins in the Real Field',
        tour4:
            'System will automatically convert your coins into<br/> bullets after entering Real Field; All your balance<br/> bullet will be converted back to coins after you <br/> leave the room.',
        tour5:
            'Control your cannon, click and capture fishes<br/> to gain more bullets',
        tour6:
            'Use items to assist you to capture more <br/> and bigger fishes',
    },
    [Lang.Kor]: {
        deposit: '충전',
        withdrawal: '출금',
        balance: '잔액',
        bullet: '총알',
        automaticFiring: '자동 발사',
        buyBullet: '총알 구매',
        casualMode: '레저 모드',
        tournamentMode: '경기 모드',
        trialField: '시연장',
        realField: '게임장',
        stayTuned: '준비 중',
        quickStart: '시작',
        NumBullet: '잔여 총알',
        guest: '관전',
        volumeSetting: '음량 설정',
        music: '음악',
        soundEffects: '음향',
        tips: '주의',
        cancel: '취소',
        confirm: '확인',
        luckyDraw: '추첨',
        redemption: '교환',
        buySuccess: '구매 완료',
        luckyDrawTip2: '축하드립니다',
        Num: '잔금',
        shop: '상점',
        skin: '장비',
        lock: '목표 지정',
        freeze: '얼음',
        bomb: '폭탄',
        voucher: '쿠폰',
        use: '사용',
        inUse: '사용중',
        item: '도구',
        youAreHere: '현 위치',
        purchase: '구매',
        buyBulletCost: '비용 수요',
        leaveTip: '나가시겠습니까?',
        reEnter: '게임 진행 중입니다. 다시 진입 하시겠습니까?',
        kickedTip: '방에서 탈퇴 당하셨습니다. 다시 진입 하시겠습니까?',
        buyBulletTip: '총알 수량이 부족합니다. 구입 하시겠습니까?',
        buySkillTip: '해당 기능이 없습니다. 구입 하시겠습니까?',
        logoutTip: '로그인이 끊겼습니다. 페이지 새로 고침 하시겠습니까?',
        posBombTip: '위치를 선택하여 폭탄을 배치하세요.',
        aimFish: '공격하실 물고기를 선택하세요.',
        help: '도움',
        times: '배',
        help1:
            '1. 물고기 점수 설명: 물고기에 따라 점수가 다릅니다. 한 마리를 잡고 받을 수 있는 총알의 수량는 현재 사용 중인 포좌의 배수에 이 물고기의 점수를 곱한 것과 같습니다. 예를 들어 50배의 물고기 한 마리를 잡았을 때 10배의 포좌를 사용하였으면 받을 수 있는 총알 수량은 50X10=500입니다.각 물고기의 점수는 아래와 같습니다.',
        help2:
            '2. 기능 사용 설명: 게임 진행중 플레이어는 다음과 같은 기능을 사용할 수 있습니다.',
        help2Super:
            '슈퍼기능: 자동 기능, 플레이어가 일정량의 물고기를 포획한 후 자동으로 발사 됩니다.',
        help2Freeze:
            '얼음 기능:수동 기능, 일정한 량의 물고기를 포획하면 받을 수 있 구매도 가능합니다. 해당 기능을 사용하면 게임중 대부분의 물고기들은 움직이지 않습니다.',
        help2Lock:
            '목표 지정 기능: 수동 기능, 일정한 량의 물고기를 포획하면 받 을 수 있고 구매도 가능합니다.  해당 기능을 사용하면 게임중의 가장  점수가 높은 물고기에 목표 지정이 됩니다. 또한 플레이어는 수동으로 한마리를 지정할 수 있습니다.',
        help2Bomb:
            '폭탄: 수동 기능, 구매하여야 합니다. 사용후 랜덤으로 한 무리의 물고기를 폭격할 수 있습니다.',
        help3: '3. 선택 가능한 포좌의 배수는 아래와 같습니다.',
        help31: '1,2,3,4,5,10,15,20,30,50,80,100',
        help4: '4. 기타 설명',
        help41:
            '환전: 플레이어가 지정된 물고기를 포획할 때, 물고기 쿠폰을 받게 되고, 쿠폰을 모으면 경품을 교환할 수 있게 됩니다.',
        help42:
            '추첨: 플레이어는 100점 이상의 물고기를 10마리 잡은 후, 추첨 기회가 한번 주어집니다. 추첨 보상은 총알이나 코인입니다.',
        help43:
            '구매: 플레이어는 첫 페이지에서 ‘구매’를 클릭하여 총알을 구입할 수도 있고, 게임 내에서 ‘포좌’를 클릭하여 포좌 종류 또한 특수 기능 총알을 구입할 수도 있습니다. 기능의 수가 0일 때 이 기능 아이콘을 클릭하여 기능을 구입할 수 있습니다.',
        tourSkip: 'Exit',
        tourStart: 'Start',
        tour1: '내리기 버튼을 클릭하여 코인 종류를 선택합니다.',
        tour2: '코인 종류에 따라 게임방이 다를 수 있습니다.',
        tour3:
            '시연장에서 유저는 체험만 가능하고 기엠장에서는 디지털 화폐를 획득할 수 있습니다',
        tour4:
            '게임이 본격적으로 시작되면 시스템이 자동으로 디지털 화폐를 총알로 바꿔드립니다. 게임방을 떠난 후, 남은 모든 총알은 다시 디지털 화폐로 교환됩니다.',
        tour5:
            '포좌를 컨트롤하고 물고기 포획을 클릭하면 더 <br/> 많은 총알을 받을 수 있습니다.',
        tour6:
            '도구를 사용하여 더 많고 더 큰 물고기를 <br/> 포획할 수 있습니다.',
    },
    [Lang.Jp]: {
        deposit: '⼊⾦',
        withdrawal: '送⾦',
        balance: '殘⾼',
        bullet: '弾薬',
        automaticFiring: '⾃動攻撃',
        buyBullet: '弾薬購⼊',
        casualMode: 'レジャーモード',
        tournamentMode: '競技モード',
        trialField: '體験 ゲームルーム',
        realField: '本番ゲームルーム',
        stayTuned: '未開放',
        quickStart: '即開始',
        NumBullet: '弾薬',
        guest: 'ゲスト',
        volumeSetting: '⾳量設定',
        music: '⾳楽',
        soundEffects: '⾳聲効果',
        tips: '提示',
        cancel: 'キャンセル',
        confirm: '確認',
        luckyDraw: '抽選',
        redemption: '交換',
        buySuccess: '購⼊完了',
        luckyDrawTip2: '恭喜你獲得',
        Num: '殘り',
        shop: 'ショップ',
        skin: 'スタイル',
        lock: 'ロック',
        freeze: '冷凍',
        bomb: '爆弾',
        voucher: '賞券',
        use: '使⽤',
        inUse: '使⽤中',
        item: 'スキル',
        youAreHere: 'ここにいる',
        purchase: '購⼊',
        buyBulletCost: '消費必要',
        leaveTip: 'ゲーム終了しますか。',
        reEnter: '　現在ゲーム中ですが、再び開始しますか？',
        kickedTip: 'プレールームから出てました。もう⼀度⼊場します か？',
        buyBulletTip: '弾薬殘數が不⾜になり、ご購⼊しますか。',
        buySkillTip: 'スキルまだない、ご購⼊しますか。',
        logoutTip: 'ログイン接続できません。ページを再読み込みしますか。',
        posBombTip: '畫⾯中、爆弾を置く場所を選択してください。',
        aimFish: '攻撃したい⿂を選択してください。',
        help: 'ヘルプ',
        times: '倍',
        help1:
            '⿂ポイント説明：それぞれの⿂ポイントの數値は異なります。１つの⿂を捕獲すること により、獲得弾薬は現在使⽤中の砲臺の倍數をかける⿂ポイントの數値となります。 例えば、50倍の⿂を捕獲する場合は、10倍で撃ちまして、獲得弾薬は50X10=500となり ます。それぞれのポイントは以下のようです。',
        help2:
            'スキル使⽤説明：プレーヤーはゲーム中で以下のスキルで使⽤可能です。',
        help2Super:
            'スーパースキル：受動スキル、プレーヤーが捕獲した⿂におけて、⼀定の數量に達 すると、弾薬の威⼒が増加し、攻撃スピードが加速となります。',
        help2Freeze:
            '冷凍スキル：主動スキル、特定な⿂を攻撃することによって獲得し、もしくは購⼊ もできます。使⽤後、畫⾯內の多數な⿂を凍結されます。',
        help2Lock:
            'ロックスキル：主動スキル、特定な⿂を攻撃することによって獲得し、もしくは購 ⼊もできます。使⽤後、畫⾯內の⾼の⿂ポイントに⾃動的に的中し、プレーヤー が⾃由選択もできます。',
        help2Bomb:
            '爆弾：主動スキル、購⼊で獲得できます。使⽤後、畫⾯內のランダムで１つ群の⿂ に攻撃します。',
        help3: '選択可能の倍數は以下のようです。',
        help31: '1,2,3,4,5,10,15,20,30,50,80,100',
        help4: 'その他説明：',
        help41:
            '交換：プレーヤーは、特定な⿂を捕獲することにより、⿂券が獲得できます。その ⼀定の數量の⿂券を収集すると、景品と交換可能です',
        help42:
            '抽選：プレーヤーは、10匹100ポイント以上の⿂を捕獲すると、1回の抽選に參加可 能です。景品は弾薬と通貨を含みます。',
        help43:
            '購⼊：プレーヤーは、ホームで購⼊ボタンをクリックし、弾薬を購⼊できます。ま た、ゲーム中で砲臺ボタンをクリックし、砲臺スタイルと弾薬特効を購⼊できま す。スキルの數は0の時、スキルボタンを押して購⼊できます。',
        tourSkip: 'Exit',
        tourStart: 'Start',
        tour1: 'ボタンで通貨タイプを選択',
        tour2: '通貨タイプが異なることにより、ゲーム ルームが切替されます。',
        tour3:
            '體験ルームプレーはゲームの體験のみ可能です。本番プレールームで仮想通貨が獲得 可能です。',
        tour4:
            '本番ゲームルームに⼊場の際、システムは⾃動的に仮想通貨を弾薬に交換されます。 また、お客様は退場の際、殘りの弾薬が⾃動的に仮想通貨に交換されます。ご安⼼くだ さい。',
        tour5:
            '砲臺をコントロールし、クリックかつ⿂の捕獲、<br/>もっと弾薬が獲得可能',
        tour6: 'スキルの使⽤で、もっと⼤きくて多い⿂を<br/>捕獲可能です。',
    },
    [Lang.Zh]: {
        deposit: '充值',
        withdrawal: '提币',
        balance: '余额',
        bullet: '子弹',
        automaticFiring: '自动开炮',
        buyBullet: '购买子弹',
        casualMode: '休闲模式',
        tournamentMode: '竞技模式',
        trialField: '试玩场',
        realField: '正式场',
        stayTuned: '敬请期待',
        quickStart: '快速开始',
        NumBullet: '剩余子弹',
        guest: '游客',
        volumeSetting: '音量设置',
        music: '音乐',
        soundEffects: '音效',
        tips: '提示',
        cancel: '取消',
        confirm: '确定',
        luckyDraw: '抽奖',
        redemption: '兑换',
        buySuccess: '购买成功',
        luckyDrawTip2: '恭喜你获得',
        Num: '剩余',
        shop: '商店',
        skin: '皮肤',
        lock: '锁定',
        freeze: '冰冻',
        bomb: '炸弹',
        voucher: '奖券',
        use: '使用',
        inUse: '使用中',
        item: '道具',
        youAreHere: '您在此处',
        purchase: '购买',
        buyBulletCost: '需要花费',
        leaveTip: '确定要离开游戏吗?',
        reEnter: '你当前在游戏中是否重新进入?',
        kickedTip: '你被踢出房间, 刷新重新进入?',
        buyBulletTip: '子弹数目不够, 是否购买?',
        buySkillTip: '你还没有当前技能, 是否购买!',
        logoutTip: '登陆断开, 是否刷新页面!',
        posBombTip: '请选择屏幕中的位置放置炸弹',
        aimFish: '请选中你要攻击的鱼',
        help: '帮助',
        times: '倍',
        help1:
            '1.	鱼分说明：不同的鱼有不同的分值，捕获一条鱼得的子弹数等于当前使用的炮台倍数乘以这条鱼的分数。比如捕获一条50倍的鱼，用的10倍的炮，获得的子弹数量就是50X10=500。 不同鱼的鱼分如下',
        help2: '2.	技能使用说明：玩家在游戏过程中可以使用下列技能。',
        help2Super:
            '超级技能：被动技能，玩家捕获一定数量的鱼后自动触发，子弹威力加强、射速加倍。',
        help2Freeze:
            '冰冻技能：主动技能，可以通过打死某些鱼获得，也可购买，使用后冻住 当前屏幕内的大部分鱼。',
        help2Lock:
            '锁定技能：主动技能，可以通过打死某些鱼获得，也可购买，使用后会 自动锁定当前屏幕内鱼分最高的那条鱼，玩家也可以自己点击选择某一条鱼。',
        help2Bomb: '炸弹：主动技能，购买获得，使用后会随机炸死屏幕内的一群鱼。',
        help3: '3. 可选的炮倍数如下：',
        help31: '1,2,3,4,5,10,15,20,30,50,80,100',
        help4: '4. 其他说明',
        help41:
            '兑换：玩家捕获某些鱼时，会得到一些鱼券，收集一定数量的鱼券可以兑换奖品。',
        help42:
            '抽奖：玩家捕获10条鱼分100以上的鱼后，可以抽一次，奖品包括子弹和货币。',
        help43:
            '购买：玩家可以在大厅点击购买来购买子弹，也可以在游戏内点击炮台购买炮台皮肤或子弹特效。当技能的数量是0时，可以点击此技能图标来购买技能。',
        tourSkip: '退出引导',
        tourStart: '开始游戏',
        tour1: '点击下拉按钮选择币种',
        tour2: '选择币种不同，<br/>游戏房间也会随之切换',
        tour3: '在试玩场您只能体验游戏，<br/>在正式场才能赢得数字货币',
        tour4:
            '进入正式场后，系统会自动将您的数字货币兑换成子弹；请放心，在您离开房间后，所有剩余子弹将会再兑换成您的数字货币',
        tour5: '控制您的炮台，点击并捕捉鱼群，获得更多子弹',
        tour6: '可以使用道具，帮助您捕获<br/>更多更大的鱼',
    },
    [Lang.Zh_HK]: {
        deposit: '充值',
        withdrawal: '提幣',
        balance: '餘額',
        bullet: '子彈',
        automaticFiring: '自動開炮',
        buyBullet: '購買子彈',
        casualMode: '休閒模式',
        tournamentMode: '競技模式',
        trialField: '試玩場',
        realField: '正式場',
        stayTuned: '敬請期待',
        quickStart: '快速開始',
        NumBullet: '剩餘子彈',
        guest: '遊客',
        volumeSetting: '音量設定',
        music: '音樂',
        soundEffects: '音效',
        tips: '提示',
        cancel: '取消',
        confirm: '確定',
        luckyDraw: '抽獎',
        redemption: '兌換',
        buySuccess: '購買成功',
        luckyDrawTip2: '恭喜你獲得',
        Num: '弾薬',
        shop: '商店',
        skin: '皮膚',
        lock: '鎖定',
        freeze: '冰凍',
        bomb: '炸彈',
        voucher: '獎券',
        use: '使用',
        inUse: '使用中',
        item: '道具',
        youAreHere: '您在此處',
        purchase: '購買',
        buyBulletCost: '需要花費',
        leaveTip: '確定要離開遊戲嗎?',
        reEnter: '你當前在遊戲中是否重新進入?',
        kickedTip: '你被踢出房間, 刷新重新進入?',
        buyBulletTip: '子彈數目不夠, 是否購買?',
        buySkillTip: '你還冇有當前技能, 是否購買!',
        logoutTip: '登陸斷開, 收否刷新頁麵!',
        posBombTip: '請選擇屏幕中的位置放置炸彈',
        aimFish: '請選中你要攻擊的魚',
        help: '幫助',
        times: '倍',
        help1:
            '1.	魚分說明：不同的魚有不同的分值，捕獲一條魚得的子彈數等於當前使用的炮臺倍數乘以這條魚的分數。比如捕獲一條50倍的魚，用的10倍的炮，獲得的子彈數量就是50X10=500。 不同魚的魚分如下',
        help2: '2.	技能使用說明：玩家在遊戲過程中可以使用下列技能。',
        help2Super:
            '超級技能：被動技能，玩家捕獲一定數量的魚後自動觸發，子彈威力加強、射速加倍。',
        help2Freeze:
            '冰凍技能：主動技能，可以通過打死某些魚獲得，也可購買，使用後凍住 當前屏幕內的大部分魚。',
        help2Lock:
            '鎖定技能：主動技能，可以通過打死某些魚獲得，也可購買，使用後會 自動鎖定當前屏幕內魚分最高的那條魚，玩家也可以自己點擊選擇某一條魚。',
        help2Bomb: '炸彈：主動技能，購買獲得，使用後會隨機炸死屏幕內的一群魚。',
        help3: '3. 可選的炮倍數如下：',
        help31: '1,2,3,4,5,10,15,20,30,50,80,100',
        help4: '4.	其他說明',
        help41:
            '兌換：玩家捕獲某些魚時，會得到一些魚券，收集一定數量的魚券可以兌換獎品。',
        help42:
            '抽獎：玩家捕獲10條魚分100以上的魚後，可以抽一次，獎品包括子彈和貨幣。',
        help43:
            '購買：玩家可以在大廳點擊購買來購買子彈，也可以在遊戲內點擊炮臺購買炮臺皮膚或子彈特效。當技能的數量是0時，可以點擊此技能圖標來購買技能。',
        tourSkip: '退出引導',
        tourStart: '開始遊戲',
        tour1: '點擊下拉按鈕選擇幣種',
        tour2: '選擇幣種不同，<br/>遊戲房間也會隨之切換',
        tour3: '在試玩場您隻能體驗遊戲，<br/>在正式場才能贏得數字貨幣',
        tour4:
            '進入正式場後，係統會自動將您的數字貨幣兌換成子彈；請放心，在您離開房間後，所有剩餘子彈將會再兌換成您的數字貨幣',
        tour5: '控製您的炮臺，點擊並捕捉魚群，獲得更多子彈',
        tour6: '可以使用道具，幫助您捕獲<br/>更多更大的魚',
    },
};

export const InternationalTip = International as {
    [key: string]: typeof International[Lang.Zh];
};

/** - @ques 翻译给徐磊 */
const InternationalTip2 = {
    [Lang.Zh]: {
        NetError: '网络异常, 正在重新连接',
        NetComeBack: '欢迎回来!',
        OtherLogin: '异地登录，请刷新重试',
        InputEmptyWarn: '输入的值不能为空...!',
        Delete: '删除',
        buyItemTip: '确认花费$1个$2, 购买$3个$4.',
        buySkinTip: '确认花费$1个$2, 购买$3.',
        beyondBulletNum: '超出当前的子弹数目',
        itemListTitle: '道具存量',
        itemList1: '道具类型',
        itemList2: '购买数量总和',
        itemList3: '游戏赠送总和',
        search: '查询',
        gameNo: '场次',
        remainingNum: '剩余数量',
        gameListTitle: '游戏存量',
        [ServerErrCode.NoMoney]: '当前货币余额不足，请去充值或切换其他货币.',
        noMoneyConfirm: '去充值',
        [ServerErrCode.ReExchange]: '子弹不足是否继续兑换!',
        [ServerErrCode.TrialTimeGame]: '已超出试玩时长，请去正式场进行游戏',
        [ServerErrCode.TrialNotBullet]:
            '子弹不足，请重新进入或去正式场进行游戏',
        [ServerErrCode.NetError]: '网络异常, 请刷新重试',
    },
};

const arr = [Lang.Zh, Lang.En, Lang.Jp, Lang.Kor, Lang.Zh_HK];
for (const item of arr) {
    InternationalTip2[item] = InternationalTip2[Lang.Zh];
}

export const InternationalTipOther = InternationalTip2 as {
    [key: string]: typeof InternationalTip2[Lang.Zh];
};
