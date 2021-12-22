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
        buyBullet: 'Purchase Bullets',
        casualMode: 'Casual Mode',
        tournamentMode: 'Tournament Mode',
        trialField: 'Demo game',
        realField: 'Real game',
        stayTuned: 'Stay Tuned',
        quickStart: 'Quick Start',
        NumBullet: 'Bullets',
        guest: 'Guest',
        volumeSetting: 'Volume Setting',
        music: 'Music',
        soundEffects: 'Sound',
        tips: 'Reminder',
        cancel: 'Cancel',
        confirm: 'Confirm',
        luckyDraw: 'Prize Draw',
        redemption: 'Exchange',
        buySuccess: 'Congratulations on acquiring!',
        luckyDrawTip2: 'Congrats! You’ve got ',
        Num: 'Remaining',
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
        buyBulletCost: 'Must spend',
        leaveTip: 'Are you sure you want to leave the game?',
        reEnter: 'You are in the game now, do you want to re-enter?',
        kickedTip:
            'You have been kicked out of the game room, do you want to refresh the page and re-enter the game room?',
        buyBulletTip: 'Out of ammo, do you want to purchase more?',
        buySkillTip: 'You don’t have this skill, do you want to purchase it?',
        logoutTip:
            'Login disconnected, do you want to refresh the current page?',
        posBombTip: 'Please select a location on the screen to place the bomb',
        aimFish: 'Please select the fish you want to attack',
        help: 'Help',
        times: 'times',
        help1: '1. Fish Points: Different fishes have different values, with the number of bullets obtained after capturing a fish being equal to the multiple of the cannon currently being used multiplied by the number of Fish Points. For example, if a fish with 50 Fish Points is captured using a 10x cannon, the number of bullets obtained is 50x10=500. Each different type of fish and their corresponding numbers of Fish Points are as follows:',
        help2: '2. Skill description: Players can apply the following skills in the game.',
        help2Super:
            'Super Skill: This is a passive skill which is automatically triggered after a certain number of fish have been captured by the player. It increases bullet power and doubles the firing speed.',
        help2Freeze:
            'Freezing Skill: Active skill which can be obtained either by killing certain types of fish or by directly purchasing. It can freeze most of the fish on the screen.',
        help2Lock:
            'Lock Skill: Active skill which can be obtained either by killing certain types of fish or by directly purchasing. It can automatically lock in place the fish on the screen which have the highest number of Fish Points; players can also select the fish which they want to lock in place.',
        help2Bomb:
            'Bomb Skill: Active skill which can be directly purchased. It will randomly kill groups of nearby fish on the screen.',
        help3: '3. Available cannon multiples: ',
        help31: '1,2,3,4,5,10,15,20',
        help4: '4. Other instructions',
        help41: 'Redemption: Players can get some Fish Vouchers after capturing certain types of fish. Fish Vouchers can be redeemed in exchange for rewards.',
        help42: 'Lucky draw: Players can qualify for 1 lucky draw after capturing 10 fish that each have at least 100 Fish Points. Rewards include bullets and currency.',
        help43: 'Purchases: Players can purchase bullets inside the main hall, and can also purchase cannon skins or bullet effects by clicking on the cannon icon in the game.',
        tourSkip: 'Skip',
        tourStart: 'Start game',
        tour1: 'Click the drop-down button to select the currency',
        tour2: 'Game room will change <br/>according to which currency is selected',
        tour3: 'In the demo game you can only experience the game, <br/>you must be in the real game in order to earn currency',
        tour4: 'The system will automatically convert your digital currency into<br/> bullets when you enter a real game; any remaining <br/> bullets will be converted back into currency after you <br/> have left the room.',
        tour5: 'Control your cannon, click and catch <br/>fish to get more bullets',
        tour6: 'Use items to help you catch more <br/> and bigger fish',
        noData: 'No data',
        NetError: 'Problem with Internet connection, reconnecting',
        NetComeBack: 'Welcome back!',
        OtherLogin: 'Login error, please refresh and try again.',
        InputEmptyWarn: 'Input value cannot be blank!',
        Delete: 'Delete',
        buyItemTip: 'Confirm cost $1 $2,purchase $3 $4.',
        buySkinTip: 'Confirm cost $1 个 $2,purchase $3.',
        beyondBulletNum: 'Exceeds current ammunition limit',
        itemListTitle: 'Items stored',
        itemList1: 'Item types',
        itemList2: 'Sum of purchases',
        itemList3: 'Sum of prizes',
        search: 'Inquire',
        gameNo: 'Sessions',
        remainingNum: 'Amount remaining',
        gameListTitle: 'Game record',
        cost: 'Use up',
        prize: 'Winnings',
        delayUpdateAccount:
            'Updates to your balance might be delayed until blocks on the chain can be confirmed, please be patient.',
        enterGameCostTip:
            'The system converts {bringAmount} {currency} into {bulletNum} bullets. \n After you leave the room, any remaining bullets \n will then be converted back into your {currency}.',
        NoMoneyAmount:
            'The current currency surplus is insufficient, the minimum requirement to enter the market is {minAmount}{currency}, please go to top up or switch to other currencies.',
        platformDiffCurrencyEnterGameErr:
            'You have unfinished games, the system will automatically repeat.',
        arenaHelpRule11:
            'a) 捕魚大獎賽，以活動形式指定時間段開放，每個時段結束前{deadlineTime}分鍾停止報名',
        arenaHelpRule12:
            'b)大獎賽每次開放均可獲贈{freeNum}次免費挑戰的次數（遊客玩家和正式賬號獲得一次），免費挑戰次數不纍積',
        arenaHelpRule13:
            'c) 重複挑戰需要報名消耗貨幣，消耗的貨幣數量每次都一樣',
        arenaHelpRule21:
            'a) 報名成功後，每個玩家可以射擊{initBulletNum}發子彈，擊殺魚後可以獲得魚倍率對應的積分，1倍=1積分。',
        arenaHelpRule22: 'b) 大獎賽中炮臺倍率越高，擊殺魚的概率也相應增加',
        arenaHelpRule23:
            'c) 玩家開炮後，若剩餘子彈為500倍數，觸發懸賞任務，完成可獲得額外積分獎勵',
        arenaHelpRule24:
            'd) 所有子彈打完後，本次挑戰結束。最終積分可以參與排名(註意:子彈未打完的成績不參與排名)',
        arenaHelpRule31:
            'a)每日取單次最高積分進入排名(至少需要{rankingScoreDown}分才可參與排名)',
        arenaHelpRule32: 'b)積分相同的情況下，先達到的玩家排名在前',
        arenaHelpRule33:
            'c)日排行獎勵發放時間為每日23:35，最終排名以23:30之後為準。( 註意: 23:00之前的排名獎勵僅作預覽，不是實際發放獎勵)',
        arenaHelpRule34:
            'd) 總冠軍獎勵發放時間為每次活動結束後第二天0:05，單次積分最高的玩家為總冠軍，獲得額外的大獎',
        arenaHelpRule35:
            'e) 比賽的獎勵直接發放到賬號上，玩家可以在大廳界麵查看大獎賽獎勵發放記錄',
        arenaHelpRule41:
            'a) 炮臺加成 使用不同炮臺皮膚，比賽中命中率加成不一樣，不纍加命中',
        arenaHelpRule42:
            '炮臺皮膚      命中加成 \n 皮膚1           {1001}%\n 皮膚2           {1002}%\n 皮膚3           {1003}%\n 皮膚4           {1004}%\n 皮膚5           {1005}%\n',
        [ServerErrCode.NoMoney]:
            'Insufficient funds, please add funds or change to another currency.',
        noMoneyConfirm: 'Add funds',
        [ServerErrCode.ReExchange]: 'Out of ammo. Continue exchanging?',
        [ServerErrCode.TrialTimeGame]:
            'Demo playing time is up, please go to the real game to continue playing.',
        [ServerErrCode.TrialNotBullet]:
            'Out of ammo, please reload the game or go the real game to continue.',
        [ServerErrCode.NetError]: 'Network error, please reload the game ',
        [ServerErrCode.TrialClose]: 'Demo mode is off.',
        [ServerErrCode.OverLimit]:
            'Your spending have reached the maximum limit.',
        [ServerErrCode.ToQuick]: 'Operation done too frequently',
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
        help1: '1. 물고기 점수 설명: 물고기에 따라 점수가 다릅니다. 한 마리를 잡고 받을 수 있는 총알의 수량는 현재 사용 중인 포좌의 배수에 이 물고기의 점수를 곱한 것과 같습니다. 예를 들어 50배의 물고기 한 마리를 잡았을 때 10배의 포좌를 사용하였으면 받을 수 있는 총알 수량은 50X10=500입니다.각 물고기의 점수는 아래와 같습니다.',
        help2: '2. 기능 사용 설명: 게임 진행중 플레이어는 다음과 같은 기능을 사용할 수 있습니다.',
        help2Super:
            '슈퍼기능: 자동 기능, 플레이어가 일정량의 물고기를 포획한 후 자동으로 발사 됩니다.',
        help2Freeze:
            '얼음 기능:수동 기능, 일정한 량의 물고기를 포획하면 받을 수 있 구매도 가능합니다. 해당 기능을 사용하면 게임중 대부분의 물고기들은 움직이지 않습니다.',
        help2Lock:
            '목표 지정 기능: 수동 기능, 일정한 량의 물고기를 포획하면 받 을 수 있고 구매도 가능합니다.  해당 기능을 사용하면 게임중의 가장  점수가 높은 물고기에 목표 지정이 됩니다. 또한 플레이어는 수동으로 한마리를 지정할 수 있습니다.',
        help2Bomb:
            '폭탄: 수동 기능, 구매하여야 합니다. 사용후 랜덤으로 한 무리의 물고기를 폭격할 수 있습니다.',
        help3: '3. 선택 가능한 포좌의 배수는 아래와 같습니다.',
        help31: '1,2,3,4,5,10,15,20',
        help4: '4. 기타 설명',
        help41: '환전: 플레이어가 지정된 물고기를 포획할 때, 물고기 쿠폰을 받게 되고, 쿠폰을 모으면 경품을 교환할 수 있게 됩니다.',
        help42: '추첨: 플레이어는 100점 이상의 물고기를 10마리 잡은 후, 추첨 기회가 한번 주어집니다. 추첨 보상은 총알이나 코인입니다.',
        help43: '구매: 플레이어는 첫 페이지에서 ‘구매’를 클릭하여 총알을 구입할 수도 있고, 게임 내에서 ‘포좌’를 클릭하여 포좌 종류 또한 특수 기능 총알을 구입할 수도 있습니다. 기능의 수가 0일 때 이 기능 아이콘을 클릭하여 기능을 구입할 수 있습니다.',
        tourSkip: 'Exit',
        tourStart: 'Start',
        tour1: '내리기 버튼을 클릭하여 코인 종류를 선택합니다.',
        tour2: '코인 종류에 따라 게임방이 다를 수 있습니다.',
        tour3: '시연장에서 유저는 체험만 가능하고 기엠장에서는 디지털 화폐를 획득할 수 있습니다',
        tour4: '게임이 본격적으로 시작되면 시스템이 자동으로 디지털 화폐를 총알로 바꿔드립니다. 게임방을 떠난 후, 남은 모든 총알은 다시 디지털 화폐로 교환됩니다.',
        tour5: '포좌를 컨트롤하고 물고기 포획을 클릭하면 더 <br/> 많은 총알을 받을 수 있습니다.',
        tour6: '도구를 사용하여 더 많고 더 큰 물고기를 <br/> 포획할 수 있습니다.',
        noData: '데이터 없음',
        NetError: '네트워크 오류, 다시 연결 중',
        NetComeBack: '돌아오신 걸 환영합니다!',
        OtherLogin: '다른 곳에서 로그인 시도, 새로고침해 주세요',
        InputEmptyWarn: '빈칸을 입력해주세요!',
        Delete: '삭제',
        buyItemTip: '$1개의 $2를 소비하여, $3개의 $4를 구매',
        buySkinTip: '$1개의 $2를 소비하여, $3 구매',
        beyondBulletNum: '현재 총알 수량 초과',
        itemListTitle: '아이템 보관량',
        itemList1: '아이템',
        itemList2: '총 구매 수량',
        itemList3: '총 게임 보너스',
        search: '조회',
        gameNo: '횟수',
        remainingNum: '남은 수량',
        gameListTitle: '게임 기록',
        cost: '소비',
        prize: '수익',
        delayUpdateAccount:
            '잔고에 변동이 생겼습니다. 블록체인에 문제가 생김으로  다소 지연이 될 수 있으니 양해 부탁드립니다.',
        enterGameCostTip:
            '시스템이 {bringAmount}{currency}를 {bulletNum}개의 총알로 바꿔드립니다.\n 게임을 나가실때 남은 총알은 {currency}로 바꿔드립니다.',
        NoMoneyAmount:
            '현재 화폐 잔액이 부족합니다. 최소{minAmount}{currency} 소유해야 입장이 가능합니다. 충전하시거나 다른 화폐로 교환해주세요.',
        platformDiffCurrencyEnterGameErr:
            '완료되지 않은 게임이 있으면 시스템이 자동으로 반복됩니다.',
        arenaHelpRule11:
            'a) 捕魚大獎賽，以活動形式指定時間段開放，每個時段結束前{deadlineTime}分鍾停止報名',
        arenaHelpRule12:
            'b)大獎賽每次開放均可獲贈{freeNum}次免費挑戰的次數（遊客玩家和正式賬號獲得一次），免費挑戰次數不纍積',
        arenaHelpRule13:
            'c) 重複挑戰需要報名消耗貨幣，消耗的貨幣數量每次都一樣',
        arenaHelpRule21:
            'a) 報名成功後，每個玩家可以射擊{initBulletNum}發子彈，擊殺魚後可以獲得魚倍率對應的積分，1倍=1積分。',
        arenaHelpRule22: 'b) 大獎賽中炮臺倍率越高，擊殺魚的概率也相應增加',
        arenaHelpRule23:
            'c) 玩家開炮後，若剩餘子彈為500倍數，觸發懸賞任務，完成可獲得額外積分獎勵',
        arenaHelpRule24:
            'd) 所有子彈打完後，本次挑戰結束。最終積分可以參與排名(註意:子彈未打完的成績不參與排名)',
        arenaHelpRule31:
            'a)每日取單次最高積分進入排名(至少需要{rankingScoreDown}分才可參與排名)',
        arenaHelpRule32: 'b)積分相同的情況下，先達到的玩家排名在前',
        arenaHelpRule33:
            'c)日排行獎勵發放時間為每日23:35，最終排名以23:30之後為準。( 註意: 23:00之前的排名獎勵僅作預覽，不是實際發放獎勵)',
        arenaHelpRule34:
            'd) 總冠軍獎勵發放時間為每次活動結束後第二天0:05，單次積分最高的玩家為總冠軍，獲得額外的大獎',
        arenaHelpRule35:
            'e) 比賽的獎勵直接發放到賬號上，玩家可以在大廳界麵查看大獎賽獎勵發放記錄',
        arenaHelpRule41:
            'a) 炮臺加成 使用不同炮臺皮膚，比賽中命中率加成不一樣，不纍加命中',
        arenaHelpRule42:
            '炮臺皮膚      命中加成 \n 皮膚1           {1001}%\n 皮膚2           {1002}%\n 皮膚3           {1003}%\n 皮膚4           {1004}%\n 皮膚5           {1005}%\n',
        [ServerErrCode.NoMoney]:
            '현재 보유 중인 화폐 수량이 부족합니다. 입금 또는 다른 화폐를 환전해주세요.',
        noMoneyConfirm: '충전하기',
        [ServerErrCode.ReExchange]: '총알 부족, 계속 교환 하시겠습니까?',
        [ServerErrCode.TrialTimeGame]:
            '무료 플레이 종료. 정식 버전을 이용해주세요',
        [ServerErrCode.TrialNotBullet]:
            '총알 부족, 다시 입장하거나 정식 버전을 이용해 주세요.',
        [ServerErrCode.NetError]:
            '네트워크 오류. 새로고침 후 다시 시도해 주세요.',
        [ServerErrCode.TrialClose]: '체험모드 종료',
        [ServerErrCode.OverLimit]: '귀하의 소비가 제한에 도달했습니다.',
        [ServerErrCode.ToQuick]: '너무 자주 작동',
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
        tips: '注意',
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
        help1: '⿂ポイント説明：それぞれの⿂ポイントの數値は異なります。１つの⿂を捕獲すること により、獲得弾薬は現在使⽤中の砲臺の倍數をかける⿂ポイントの數値となります。 例えば、50倍の⿂を捕獲する場合は、10倍で撃ちまして、獲得弾薬は50X10=500となり ます。それぞれのポイントは以下のようです。',
        help2: 'スキル使⽤説明：プレーヤーはゲーム中で以下のスキルで使⽤可能です。',
        help2Super:
            'スーパースキル：受動スキル、プレーヤーが捕獲した⿂におけて、⼀定の數量に達 すると、弾薬の威⼒が増加し、攻撃スピードが加速となります。',
        help2Freeze:
            '冷凍スキル：主動スキル、特定な⿂を攻撃することによって獲得し、もしくは購⼊ もできます。使⽤後、畫⾯內の多數な⿂を凍結されます。',
        help2Lock:
            'ロックスキル：主動スキル、特定な⿂を攻撃することによって獲得し、もしくは購 ⼊もできます。使⽤後、畫⾯內の⾼の⿂ポイントに⾃動的に的中し、プレーヤー が⾃由選択もできます。',
        help2Bomb:
            '爆弾：主動スキル、購⼊で獲得できます。使⽤後、畫⾯內のランダムで１つ群の⿂ に攻撃します。',
        help3: '選択可能の倍數は以下のようです。',
        help31: '1,2,3,4,5,10,15,20',
        help4: 'その他説明：',
        help41: '交換：プレーヤーは、特定な⿂を捕獲することにより、⿂券が獲得できます。その ⼀定の數量の⿂券を収集すると、景品と交換可能です',
        help42: '抽選：プレーヤーは、10匹100ポイント以上の⿂を捕獲すると、1回の抽選に參加可 能です。景品は弾薬と通貨を含みます。',
        help43: '購⼊：プレーヤーは、ホームで購⼊ボタンをクリックし、弾薬を購⼊できます。ま た、ゲーム中で砲臺ボタンをクリックし、砲臺スタイルと弾薬特効を購⼊できま す。スキルの數は0の時、スキルボタンを押して購⼊できます。',
        tourSkip: 'Exit',
        tourStart: 'Start',
        tour1: 'ボタンで通貨タイプを選択',
        tour2: '通貨タイプが異なることにより、ゲーム <br/> ルームが切替されます。',
        tour3: '體験ルームプレーはゲームの體験のみ可能です。本番プレールームで仮想通貨が獲得 可能です。',
        tour4: '本番ゲームルームに⼊場の際、システムは⾃動的に仮想通貨を弾薬に交換されます。 また、お客様は退場の際、殘りの弾薬が⾃動的に仮想通貨に交換されます。ご安⼼くだ さい。',
        tour5: '砲臺をコントロールし、クリックかつ⿂<br/>の捕獲、もっと弾薬が獲得可能',
        tour6: 'スキルの使⽤で、もっと⼤きくて多い⿂を<br/>捕獲可能です。',
        noData: 'データなし',
        NetError: '異常なネットワーク、再接続',
        NetComeBack: 'お帰りなさい！',
        OtherLogin: 'サイト外でログオフし、更新して再試行してください',
        InputEmptyWarn: '入力した値は空にできません...！',
        Delete: '削除する',
        buyItemTip: '費用$1$2、購入$3$4を確認します。',
        buySkinTip: '确认花费$1个$2, 购买$3.',
        beyondBulletNum: '費用$1$2、購入$3を確認します。',
        itemListTitle: 'アイテムの在庫',
        itemList1: '道具',
        itemList2: '合計購入金額',
        itemList3: 'ゲームギフトの合計',
        search: '問い合わせ',
        gameNo: 'セッション',
        remainingNum: '残高',
        gameListTitle: 'ゲーム記録',
        cost: '消費する',
        prize: '収益',
        delayUpdateAccount:
            'チェーンのブロック確認により、資金の変更が遅れる場合があります。しばらくお待ちください',
        enterGameCostTip:
            'システムで{bringAmount}{currency}を{bulletNum}弾に変換します。\n部屋を出る時、残りの弾丸を{currency}に交換されます',
        NoMoneyAmount:
            '現在の残高が不足しており、参加には最低{minAmount}{currency}を保有する必要があります。入金または他のトークンに切り替えてください。',
        platformDiffCurrencyEnterGameErr:
            'まだ終わっていないゲームがありますので、システムは自動的にリセットして差し上げます。',
        arenaHelpRule11:
            'a) 捕魚大獎賽，以活動形式指定時間段開放，每個時段結束前{deadlineTime}分鍾停止報名',
        arenaHelpRule12:
            'b)大獎賽每次開放均可獲贈{freeNum}次免費挑戰的次數（遊客玩家和正式賬號獲得一次），免費挑戰次數不纍積',
        arenaHelpRule13:
            'c) 重複挑戰需要報名消耗貨幣，消耗的貨幣數量每次都一樣',
        arenaHelpRule21:
            'a) 報名成功後，每個玩家可以射擊{initBulletNum}發子彈，擊殺魚後可以獲得魚倍率對應的積分，1倍=1積分。',
        arenaHelpRule22: 'b) 大獎賽中炮臺倍率越高，擊殺魚的概率也相應增加',
        arenaHelpRule23:
            'c) 玩家開炮後，若剩餘子彈為500倍數，觸發懸賞任務，完成可獲得額外積分獎勵',
        arenaHelpRule24:
            'd) 所有子彈打完後，本次挑戰結束。最終積分可以參與排名(註意:子彈未打完的成績不參與排名)',
        arenaHelpRule31:
            'a)每日取單次最高積分進入排名(至少需要{rankingScoreDown}分才可參與排名)',
        arenaHelpRule32: 'b)積分相同的情況下，先達到的玩家排名在前',
        arenaHelpRule33:
            'c)日排行獎勵發放時間為每日23:35，最終排名以23:30之後為準。( 註意: 23:00之前的排名獎勵僅作預覽，不是實際發放獎勵)',
        arenaHelpRule34:
            'd) 總冠軍獎勵發放時間為每次活動結束後第二天0:05，單次積分最高的玩家為總冠軍，獲得額外的大獎',
        arenaHelpRule35:
            'e) 比賽的獎勵直接發放到賬號上，玩家可以在大廳界麵查看大獎賽獎勵發放記錄',
        arenaHelpRule41:
            'a) 炮臺加成 使用不同炮臺皮膚，比賽中命中率加成不一樣，不纍加命中',
        arenaHelpRule42:
            '炮臺皮膚      命中加成 \n 皮膚1           {1001}%\n 皮膚2           {1002}%\n 皮膚3           {1003}%\n 皮膚4           {1004}%\n 皮膚5           {1005}%\n',
        [ServerErrCode.NoMoney]:
            '現在の通貨残高が不足しています。再チャージするか、他の通貨に切り替えてください。',
        noMoneyConfirm: 'チャージ',
        [ServerErrCode.ReExchange]:
            '弾丸が不十分な場合は、引き換えてください！',
        [ServerErrCode.TrialTimeGame]:
            '体験期間が過ぎました。会場でご利用ください。',
        [ServerErrCode.TrialNotBullet]:
            '弾丸が足りません。再入力するか、公式会場でプレイしてください。',
        [ServerErrCode.NetError]:
            'ネットワークが異常です。更新してもう一度お試しください。',
        [ServerErrCode.TrialClose]: 'デモモードオフ',
        [ServerErrCode.OverLimit]: '消費金額が上限に達しました',
        [ServerErrCode.ToQuick]: '操作が多すぎる',
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
        help1: '1.	鱼分说明：不同的鱼有不同的分值，捕获一条鱼得的子弹数等于当前使用的炮台倍数乘以这条鱼的分数。比如捕获一条50倍的鱼，用的10倍的炮，获得的子弹数量就是50X10=500。 不同鱼的鱼分如下',
        help2: '2.	技能使用说明：玩家在游戏过程中可以使用下列技能。',
        help2Super:
            '超级技能：被动技能，玩家捕获一定数量的鱼后自动触发，子弹威力加强、射速加倍。',
        help2Freeze:
            '冰冻技能：主动技能，可以通过打死某些鱼获得，也可购买，使用后冻住 当前屏幕内的大部分鱼。',
        help2Lock:
            '锁定技能：主动技能，可以通过打死某些鱼获得，也可购买，使用后会 自动锁定当前屏幕内鱼分最高的那条鱼，玩家也可以自己点击选择某一条鱼。',
        help2Bomb: '炸弹：主动技能，购买获得，使用后会随机炸死屏幕内的一群鱼。',
        help3: '3. 可选的炮倍数如下：',
        help31: '1,2,3,4,5,10,15,20',
        help4: '4. 其他说明',
        help41: '兑换：玩家捕获某些鱼时，会得到一些鱼券，收集一定数量的鱼券可以兑换奖品。',
        help42: '抽奖：玩家捕获10条鱼分100以上的鱼后，可以抽一次，奖品包括子弹和货币。',
        help43: '购买：玩家可以在大厅点击购买来购买子弹，也可以在游戏内点击炮台购买炮台皮肤或子弹特效。当技能的数量是0时，可以点击此技能图标来购买技能。',
        tourSkip: '退出引导',
        tourStart: '开始游戏',
        tour1: '点击下拉按钮选择币种',
        tour2: '选择币种不同，<br/>游戏房间也会随之切换',
        tour3: '在试玩场您只能体验游戏，<br/>在正式场才能赢得数字货币',
        tour4: '进入正式场后，系统会自动将您的数字货币兑换成子弹；<br/>请放心，在您离开房间后，所有剩余子弹将会再兑换成您的数字货币',
        tour5: '控制您的炮台，点击并捕捉鱼群，<br/>获得更多子弹',
        tour6: '可以使用道具，帮助您捕获<br/>更多更大的鱼',
        noData: '暂无数据',
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
        gameListTitle: '游戏记录',
        cost: '消耗',
        prize: '收益',
        delayUpdateAccount:
            '您的余额变动因链上区块确认可能有所延迟，请耐心等待。',
        enterGameCostTip:
            '系統將{bringAmount}{currency}兌換成{bulletNum}子彈，\n離開房間時，會將剩餘子彈兌換成您的{currency}。',
        NoMoneyAmount:
            '当前货币余额不足，最小需携带{minAmount}{currency}才可进场，请去充值或者切换其他货币。',
        platformDiffCurrencyEnterGameErr:
            '您还有未完成的游戏，系统自动帮您复盘。',
        arenaHelpRule11:
            'a) 捕鱼大奖赛，以活动形式指定时间段开放，每个时段结束前{deadlineTime}分钟停止报名',
        arenaHelpRule12:
            'b)大奖赛每次开放均可获赠{freeNum}次免费挑战的次数（游客玩家和正式账号获得一次），免费挑战次数不累积',
        arenaHelpRule13:
            'c) 重复挑战需要报名消耗货币，消耗的货币数量每次都一样',
        arenaHelpRule21:
            'a) 报名成功后，每个玩家可以射击{initBulletNum}发子弹，击杀鱼后可以获得鱼倍率对应的积分，1倍=1积分。',
        arenaHelpRule22: 'b) 大奖赛中炮台倍率越高，击杀鱼的概率也相应增加',
        arenaHelpRule23:
            'c) 玩家开炮后，若剩余子弹为500倍数，触发悬赏任务，完成可获得额外积分奖励',
        arenaHelpRule24:
            'd) 所有子弹打完后，本次挑战结束。最终积分可以参与排名(注意:子弹未打完的成绩不参与排名)',
        arenaHelpRule31:
            'a)每日取单次最高积分进入排名(至少需要{rankingScoreDown}分才可参与排名)',
        arenaHelpRule32: 'b)积分相同的情况下，先达到的玩家排名在前',
        arenaHelpRule33:
            'c)日排行奖励发放时间为每日23:35，最终排名以23:30之后为准。( 注意: 23:00之前的排名奖励仅作预览，不是实际发放奖励)',
        arenaHelpRule34:
            'd) 总冠军奖励发放时间为每次活动结束后第二天0:05，单次积分最高的玩家为总冠军，获得额外的大奖',
        arenaHelpRule35:
            'e) 比赛的奖励直接发放到账号上，玩家可以在大厅界面查看大奖赛奖励发放记录',
        arenaHelpRule41:
            'a) 炮台加成 使用不同炮台皮肤，比赛中命中率加成不一样，不累加命中',
        arenaHelpRule42:
            '炮台皮肤      命中加成 \n 皮肤1           {gun1001}%\n 皮肤2           {gun1002}%\n 皮肤3           {gun1003}%\n 皮肤4           {gun1004}%\n 皮肤5           {gun1005}%\n',
        [ServerErrCode.NoMoney]: '当前货币余额不足，请去充值或切换其他货币.',
        noMoneyConfirm: '去充值',
        [ServerErrCode.ReExchange]: '子弹不足是否继续兑换!',
        [ServerErrCode.TrialTimeGame]: '已超出试玩时长，请去正式场进行游戏',
        [ServerErrCode.TrialNotBullet]:
            '子弹不足，请重新进入或去正式场进行游戏',
        [ServerErrCode.NetError]: '网络异常, 请刷新重试',
        [ServerErrCode.TrialClose]: '试玩模式关闭',
        [ServerErrCode.OverLimit]: '消费金额已达上限',
        [ServerErrCode.ToQuick]: '操作太频繁',
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
        help1: '1.	魚分說明：不同的魚有不同的分值，捕獲一條魚得的子彈數等於當前使用的炮臺倍數乘以這條魚的分數。比如捕獲一條50倍的魚，用的10倍的炮，獲得的子彈數量就是50X10=500。 不同魚的魚分如下',
        help2: '2.	技能使用說明：玩家在遊戲過程中可以使用下列技能。',
        help2Super:
            '超級技能：被動技能，玩家捕獲一定數量的魚後自動觸發，子彈威力加強、射速加倍。',
        help2Freeze:
            '冰凍技能：主動技能，可以通過打死某些魚獲得，也可購買，使用後凍住 當前屏幕內的大部分魚。',
        help2Lock:
            '鎖定技能：主動技能，可以通過打死某些魚獲得，也可購買，使用後會 自動鎖定當前屏幕內魚分最高的那條魚，玩家也可以自己點擊選擇某一條魚。',
        help2Bomb: '炸彈：主動技能，購買獲得，使用後會隨機炸死屏幕內的一群魚。',
        help3: '3. 可選的炮倍數如下：',
        help31: '1,2,3,4,5,10,15,20',
        help4: '4.	其他說明',
        help41: '兌換：玩家捕獲某些魚時，會得到一些魚券，收集一定數量的魚券可以兌換獎品。',
        help42: '抽獎：玩家捕獲10條魚分100以上的魚後，可以抽一次，獎品包括子彈和貨幣。',
        help43: '購買：玩家可以在大廳點擊購買來購買子彈，也可以在遊戲內點擊炮臺購買炮臺皮膚或子彈特效。當技能的數量是0時，可以點擊此技能圖標來購買技能。',
        tourSkip: '退出引導',
        tourStart: '開始遊戲',
        tour1: '點擊下拉按鈕選擇幣種',
        tour2: '選擇幣種不同，<br/>遊戲房間也會隨之切換',
        tour3: '在試玩場您隻能體驗遊戲，<br/>在正式場才能贏得數字貨幣',
        tour4: '進入正式場後，係統會自動將您的數字貨幣兌換成子彈；請放心，在您離開房間後，所有剩餘子彈將會再兌換成您的數字貨幣',
        tour5: '控製您的炮臺，點擊並捕捉魚群，<br/>獲得更多子彈',
        tour6: '可以使用道具，幫助您捕獲<br/>更多更大的魚',
        noData: '暫無數據',
        NetError: '網絡異常, 正在重新連接',
        NetComeBack: '歡迎回來!',
        OtherLogin: '異地登錄，請刷新重試',
        InputEmptyWarn: '輸入的值不能為空...!',
        Delete: '刪除',
        buyItemTip: '確認花費$1個$2, 購買$3個$4.',
        buySkinTip: '確認花費$1個$2, 購買$3.',
        beyondBulletNum: '超出當前的子彈數目',
        itemListTitle: '道具存量',
        itemList1: '道具類型',
        itemList2: '購買數量總和',
        itemList3: '遊戲贈送總和',
        search: '查詢',
        gameNo: '場次',
        remainingNum: '剩餘數量',
        gameListTitle: '遊戲記錄',
        cost: '消耗',
        prize: '收益',
        delayUpdateAccount:
            '您的餘額變動因鏈上區塊確認可能有所延遲，請耐心等待。',
        enterGameCostTip:
            '系統將{bringAmount}{currency}兌換成{bulletNum}子彈，\n離開房間時，會將剩餘子彈兌換成您的{currency}。',
        NoMoneyAmount:
            '當前貨幣餘額不足，最小需攜帶{minAmount}{currency}才可進場，請去充值或者切換其他貨幣。',
        platformDiffCurrencyEnterGameErr:
            '您還有未完成的遊戲，係統自動幫您複盤。',
        arenaHelpRule11:
            'a) 捕魚大獎賽，以活動形式指定時間段開放，每個時段結束前{deadlineTime}分鍾停止報名',
        arenaHelpRule12:
            'b)大獎賽每次開放均可獲贈{freeNum}次免費挑戰的次數（遊客玩家和正式賬號獲得一次），免費挑戰次數不纍積',
        arenaHelpRule13:
            'c) 重複挑戰需要報名消耗貨幣，消耗的貨幣數量每次都一樣',
        arenaHelpRule21:
            'a) 報名成功後，每個玩家可以射擊{initBulletNum}發子彈，擊殺魚後可以獲得魚倍率對應的積分，1倍=1積分。',
        arenaHelpRule22: 'b) 大獎賽中炮臺倍率越高，擊殺魚的概率也相應增加',
        arenaHelpRule23:
            'c) 玩家開炮後，若剩餘子彈為500倍數，觸發懸賞任務，完成可獲得額外積分獎勵',
        arenaHelpRule24:
            'd) 所有子彈打完後，本次挑戰結束。最終積分可以參與排名(註意:子彈未打完的成績不參與排名)',
        arenaHelpRule31:
            'a)每日取單次最高積分進入排名(至少需要{rankingScoreDown}分才可參與排名)',
        arenaHelpRule32: 'b)積分相同的情況下，先達到的玩家排名在前',
        arenaHelpRule33:
            'c)日排行獎勵發放時間為每日23:35，最終排名以23:30之後為準。( 註意: 23:00之前的排名獎勵僅作預覽，不是實際發放獎勵)',
        arenaHelpRule34:
            'd) 總冠軍獎勵發放時間為每次活動結束後第二天0:05，單次積分最高的玩家為總冠軍，獲得額外的大獎',
        arenaHelpRule35:
            'e) 比賽的獎勵直接發放到賬號上，玩家可以在大廳界麵查看大獎賽獎勵發放記錄',
        arenaHelpRule41:
            'a) 炮臺加成 使用不同炮臺皮膚，比賽中命中率加成不一樣，不纍加命中',
        arenaHelpRule42:
            '炮臺皮膚      命中加成 \n 皮膚1           {gun1001}%\n 皮膚2           {gun1002}%\n 皮膚3           {gun1003}%\n 皮膚4           {gun1004}%\n 皮膚5           {gun1005}%\n',
        [ServerErrCode.NoMoney]: '當前貨幣餘額不足，請去充值或切換其他貨幣.',
        noMoneyConfirm: '去充值',
        [ServerErrCode.ReExchange]: '子彈不足是否繼續兌換!',
        [ServerErrCode.TrialTimeGame]: '已超出試玩時長，請去正式場進行遊戲',
        [ServerErrCode.TrialNotBullet]:
            '子彈不足，請重新進入或去正式場進行遊戲',
        [ServerErrCode.NetError]: '網絡異常, 請刷新重試',
        [ServerErrCode.TrialClose]: '試玩模式關閉',
        [ServerErrCode.OverLimit]: '消費金額已達上限',
        [ServerErrCode.ToQuick]: '操作太頻繁',
    },
};

export type TypeInternationalTipLang = typeof International[Lang.Zh];
export type TypeInternationalTip = {
    [key: string]: TypeInternationalTipLang;
};
export const InternationalTip = International as TypeInternationalTip;

/** - @ques 翻译给徐磊 */
const InternationalTip2 = {
    [Lang.Kor]: {},
    [Lang.Jp]: {},
    [Lang.Zh]: {},
    [Lang.Zh_HK]: {},
    [Lang.En]: {},
};

export const InternationalTipOther = InternationalTip2 as {
    [key: string]: typeof InternationalTip2[Lang.Zh];
};
