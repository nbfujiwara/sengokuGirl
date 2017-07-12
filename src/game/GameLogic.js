/// <reference path="./DataObject.ts"/>
var game;
(function (game) {
    var GameFightLogic = (function () {
        function GameFightLogic() {
            this._enemies = [];
            this._cards = [];
            this._lastAttackEnemyIndex = 0;
        }
        GameFightLogic.prototype.setCards = function (_cards) {
            this._cards = _cards;
            this._playerHp = 0;
            this._playerMaxHp = 0;
            for (var i = 0; i < this._cards.length; i++) {
                this._playerHp += this._cards[i].maxHp;
                this._playerMaxHp += this._cards[i].maxHp;
            }
        };
        GameFightLogic.prototype.startBattle = function (_enemies) {
            this._enemies = _enemies;
        };
        GameFightLogic.prototype.getPlayerHp = function () {
            return this._playerHp;
        };
        GameFightLogic.prototype.getPlayerMaxHp = function () {
            return this._playerMaxHp;
        };
        GameFightLogic.prototype.attack = function (panelData, chainCount) {
            var effectType;
            if (chainCount <= 3) {
                effectType = 1;
            }
            else if (chainCount <= 6) {
                effectType = 2;
            }
            else {
                effectType = 3;
            }
            /*
                        var damageAllHash = {};
                        var i;
                        for(i=0; i<this._cards.length; i++){
                            var atkCard = this._cards[i];
                            if(! this._isEnableAttack(atkCard.attributes , panelData)){
                                continue;
                            }
            
                            var eIdx = this._getAttackTargetEnemyIndex();
                            this._lastAttackEnemyIndex = eIdx;
                            //console.log('enemy index =' + eIdx);
                            var damage = this._calculateDamage( this._enemies[eIdx] , this._cards[i] , chainCount );
                            this._enemies[eIdx].hp -= damage;
            
                            if(! damageAllHash.hasOwnProperty(eIdx.toString())){
                                damageAllHash[eIdx] = 0;
                            }
                            damageAllHash[eIdx] += damage;
                        }
            
                        var enemyAttacks = this._defense();
            
                        var damageList = [];
                        for(var idx in damageAllHash){
                            damageList.push(new DtoAttackFightDamageRow({
                                enemyIndex:idx,
                                damage:damageAllHash[idx],
                                restHp:this._enemies[idx].hp
                            }));
                        }
            */
            var damageList = [];
            var i;
            for (i = 0; i < this._cards.length; i++) {
                var atkCard = this._cards[i];
                if (!this._isEnableAttack(atkCard.attributes, panelData)) {
                    continue;
                }
                var eIdx = this._getAttackTargetEnemyIndex();
                this._lastAttackEnemyIndex = eIdx;
                //console.log('enemy index =' + eIdx);
                var damage = this._calculateDamage(this._enemies[eIdx], this._cards[i], chainCount);
                this._enemies[eIdx].hp -= damage;
                damageList.push(new game.DtoAttackFightDamageRow({
                    enemyIndex: eIdx,
                    damage: damage,
                    restHp: this._enemies[eIdx].hp
                }));
            }
            var enemyAttacks = this._defense();
            var result = new game.DtoAttackFightResult();
            result.damageList = damageList;
            result.effectType = effectType;
            result.enemyAttacks = enemyAttacks;
            if (!this._getRemainEnemyIdxList().length) {
                result.isDestroy = true;
            }
            return result;
        };
        GameFightLogic.prototype._defense = function () {
            var enemyAttackList = [];
            for (var i = 0; i < this._enemies.length; i++) {
                this._enemies[i].turn--;
                if (this._enemies[i].hp <= 0) {
                    continue;
                }
                if (this._enemies[i].turn > 0) {
                    continue;
                }
                this._enemies[i].turn = this._enemies[i].maxTurn;
                var playerDamage = this._enemies[i].attack;
                this._playerHp -= playerDamage;
                enemyAttackList.push(new game.DtoAttackFightEnemyAttackRow({
                    enemyIndex: i,
                    damage: playerDamage,
                    restHp: this._playerHp,
                    nextTurn: this._enemies[i].maxTurn
                }));
            }
            return enemyAttackList;
        };
        GameFightLogic.prototype._calculateDamage = function (enemy, card, chainCount) {
            var chainRate = 1 + (chainCount - 1) * 0.52;
            var damage = Math.floor(card.attack * chainRate - enemy.defense);
            if (damage < 1) {
                damage = 1;
            }
            return damage;
        };
        GameFightLogic.prototype._getRemainEnemyIdxList = function () {
            var list = [];
            for (var i = 0; i < this._enemies.length; i++) {
                if (this._enemies[i].hp > 0) {
                    list.push(i);
                }
            }
            return list;
        };
        GameFightLogic.prototype._getAttackTargetEnemyIndex = function () {
            var remainIndexList = this._getRemainEnemyIdxList();
            if (remainIndexList.length) {
                var randomNo = Math.floor(Math.random() * remainIndexList.length);
                return remainIndexList[randomNo];
            }
            //既に全員殺したので、死んでる奴にさらにダメージ加算
            //return  Math.floor(Math.random() * this._enemies.length);
            //最後にコロシタやつにする（↑だと最初一人殺してしばらくして二人目殺したときに一人目を指定しえるので）
            return this._lastAttackEnemyIndex;
        };
        GameFightLogic.prototype._isEnableAttack = function (attributes, panelData) {
            var panelAttributeId = (panelData.id * 2) - 1;
            if (panelData.reverse) {
                panelAttributeId++;
            }
            for (var i = 0; i < attributes.length; i++) {
                if (attributes[i] == panelAttributeId) {
                    return true;
                }
            }
            return false;
        };
        return GameFightLogic;
    }());
    var GameLogic = (function () {
        function GameLogic() {
            this.ROW_CNT = 4;
            this.COL_CNT = 6;
            this._panelIdList = [1, 2];
            this._checkedHash = {};
            this._invokePuzzleSkillId = null;
            this._allEnemies = [];
            this._cards = [];
            this._fightLogic = new GameFightLogic();
        }
        GameLogic.prototype.setAllEnemies = function (allEnemies) {
            this._allEnemies = allEnemies;
        };
        GameLogic.prototype.setDeckCards = function (cards) {
            this._cards = cards;
            this._fightLogic.setCards(cards);
        };
        GameLogic.prototype.startStage = function () {
            this._battleIndex = 0;
            this._fightLogic.startBattle(this.getNowBattleEnemies());
            this._refreshPanel();
        };
        GameLogic.prototype.getNowBattleEnemies = function () {
            return this._allEnemies[this._battleIndex];
        };
        GameLogic.prototype.getDeckCards = function () {
            return this._cards;
        };
        GameLogic.prototype.getPlayerHp = function () {
            return this._fightLogic.getPlayerHp();
        };
        GameLogic.prototype.getPlayerMaxHp = function () {
            return this._fightLogic.getPlayerMaxHp();
        };
        GameLogic.prototype._refreshPanel = function () {
            this._panels = [];
            for (var row = 0; row < this.ROW_CNT; row++) {
                var list = [];
                for (var col = 0; col < this.COL_CNT; col++) {
                    list.push(this._getRandomPanel());
                }
                this._panels.push(list);
            }
        };
        GameLogic.prototype.getAllPanels = function () {
            return this._panels;
        };
        GameLogic.prototype._getRandomPanel = function () {
            var randNum = Math.floor(Math.random() * this._panelIdList.length);
            var randomId = this._panelIdList[randNum];
            return new DtoPanel(randomId, (Math.random() >= 0.5), (Math.random() >= 0.8));
            //            return new DtoPanel(randomId , false);
        };
        GameLogic.prototype.attack = function (row, col, dragList) {
            if (dragList === void 0) { dragList = []; }
            console.log('drag count=' + dragList.length);
            var reverseList = this._getReverseList(row, col, dragList);
            for (var i = 0; i < reverseList.length; i++) {
                this._panels[reverseList[i].row][reverseList[i].col].reverse = !this._panels[reverseList[i].row][reverseList[i].col].reverse;
            }
            this._checkedHash = {};
            var chainList = [{ row: row, col: col }];
            chainList = this._getChainList(row, col, this._panels[row][col], chainList);
            var shiftList = this._getShiftList(chainList);
            var fightResult = this._fightLogic.attack(this._panels[row][col], chainList.length);
            this._invokePuzzleSkillId = null;
            var result = new game.DtoAttackResult();
            result.reverseList = reverseList;
            result.chainList = chainList;
            result.shiftList = shiftList;
            result.fightResult = fightResult;
            if (fightResult.isDestroy) {
                this._battleIndex++;
                if (this._battleIndex >= this._allEnemies.length) {
                    result.isClear = true;
                }
                else {
                    this._fightLogic.startBattle(this.getNowBattleEnemies());
                    result.isNextBattle = true;
                }
            }
            return result;
        };
        GameLogic.prototype._getReverseList = function (row, col, dragList) {
            var ret = [];
            var i;
            if (this._invokePuzzleSkillId == 2) {
                //ドラッグで複数のパネルを\nターゲットパネルに\n指定できるようにする\n(攻撃起点は最初のパネル)
                ret = this._getReverseListMulti(dragList);
            }
            else if (this._invokePuzzleSkillId == 3) {
                //ターゲットパネルの\n縦1列横1列を反転対象にする
                for (i = 0; i < this.ROW_CNT; i++) {
                    if (i != row) {
                        ret.push({ row: i, col: col });
                    }
                }
                for (i = 0; i < this.COL_CNT; i++) {
                    if (i != col) {
                        ret.push({ row: row, col: i });
                    }
                }
            }
            else if (this._invokePuzzleSkillId == 4) {
                //ターゲットパネルの周囲を\n反転させずに攻撃を開始する
                ret = [];
            }
            else {
                ret = this._getAround(row, col);
            }
            return ret;
        };
        GameLogic.prototype._getReverseListMulti = function (dragList) {
            var i;
            var ret = [];
            this._checkedHash = {};
            //dragListを対象から外すためにチェック済にいれる
            for (i = 0; i < dragList.length; i++) {
                this._checkPanelHash(dragList[i].row, dragList[i].col);
            }
            for (i = 0; i < dragList.length; i++) {
                var aroundList = this._getAround(dragList[i].row, dragList[i].col);
                for (var k = 0; k < aroundList.length; k++) {
                    if (this._checkPanelHash(aroundList[k].row, aroundList[k].col)) {
                        ret.push(aroundList[k]);
                    }
                }
            }
            return ret;
        };
        GameLogic.prototype._getShiftList = function (chainList) {
            var i;
            var ret = [];
            for (var row = 0; row < this.ROW_CNT; row++) {
                var attackCols = [];
                for (i = 0; i < chainList.length; i++) {
                    if (chainList[i].row == row) {
                        attackCols.push(chainList[i].col);
                    }
                }
                //降順数値並び替え
                attackCols.sort(function (a, b) { return b - a; });
                var shiftCount = attackCols.length;
                //攻撃で消えたことによりshiftして移動するものたち
                for (var col = 0; col < this.COL_CNT; col++) {
                    var beforeBreakCount = 0;
                    var isBreakTarget = false;
                    for (i = 0; i < shiftCount; i++) {
                        if (attackCols[i] == col) {
                            isBreakTarget = true;
                            break;
                        }
                        if (attackCols[i] < col) {
                            beforeBreakCount++;
                        }
                    }
                    if (!isBreakTarget && (beforeBreakCount > 0)) {
                        ret.push({
                            type: 'move',
                            row: row,
                            col: (col - beforeBreakCount),
                            fromRow: row,
                            fromCol: col,
                            shiftCount: beforeBreakCount,
                            panelData: null
                        });
                    }
                }
                //攻撃で消えるものを実際に削除
                for (i = 0; i < shiftCount; i++) {
                    this._panels[row].splice(attackCols[i], 1);
                }
                //消えた分だけ末尾にランダムで追加
                while (this._panels[row].length < this.COL_CNT) {
                    var addPanel = this._getRandomPanel();
                    var pushCol = this._panels[row].length;
                    this._panels[row].push(addPanel);
                    ret.push({
                        type: 'create',
                        row: row,
                        col: pushCol,
                        shiftCount: shiftCount,
                        panelData: addPanel
                    });
                }
            }
            return ret;
        };
        GameLogic.prototype._getChainList = function (row, col, panelData, chainList) {
            var aroundList = this._getAround(row, col);
            this._checkPanelHash(row, col);
            var i;
            var nextChainList = [];
            for (i = 0; i < aroundList.length; i++) {
                var tgR = aroundList[i].row;
                var tgC = aroundList[i].col;
                if (this._checkPanelHash(tgR, tgC)) {
                    var tgPanel = this._panels[tgR][tgC];
                    if ((tgPanel.id == panelData.id) && (tgPanel.reverse == panelData.reverse)) {
                        chainList.push({ row: tgR, col: tgC });
                        nextChainList.push({ row: tgR, col: tgC });
                    }
                }
            }
            for (i = 0; i < nextChainList.length; i++) {
                chainList = this._getChainList(nextChainList[i].row, nextChainList[i].col, panelData, chainList);
            }
            return chainList;
        };
        GameLogic.prototype._checkPanelHash = function (row, col) {
            var key = row + '_' + col;
            if (this._checkedHash.hasOwnProperty(key)) {
                return false;
            }
            this._checkedHash[key] = true;
            return true;
        };
        GameLogic.prototype._getAround = function (row, col) {
            var allList = [
                [row - 1, col - 1],
                [row - 1, col],
                [row - 1, col + 1],
                [row, col + 1],
                [row + 1, col + 1],
                [row + 1, col],
                [row + 1, col - 1],
                [row, col - 1]
            ];
            var ret = [];
            for (var i = 0; i < allList.length; i++) {
                var tgR = allList[i][0];
                var tgC = allList[i][1];
                if (tgR < 0)
                    continue;
                if (tgC < 0)
                    continue;
                if (tgR >= this.ROW_CNT)
                    continue;
                if (tgC >= this.COL_CNT)
                    continue;
                ret.push({ row: tgR, col: tgC });
            }
            return ret;
        };
        GameLogic.prototype.isDragMode = function () {
            return (this._invokePuzzleSkillId == 2);
        };
        GameLogic.prototype.executeSkill = function (charaIdx) {
            var skillData = this.getSkillData(charaIdx);
            var skillResult = new game.DtoSkillResult();
            switch (skillData.id) {
                case 1:
                    this._invokePuzzleSkillId = null;
                    skillResult.convertPanels = this._convertPanels(skillData.id);
                    break;
                case 2:
                    this._invokePuzzleSkillId = skillData.id;
                    skillResult.drag = true;
                    break;
                case 3:
                    this._invokePuzzleSkillId = skillData.id;
                    break;
                case 4:
                    this._invokePuzzleSkillId = skillData.id;
                    break;
                case 5:
                    this._invokePuzzleSkillId = null;
                    skillResult.convertPanels = this._convertPanels(skillData.id);
                    break;
                default:
                    this._invokePuzzleSkillId = null;
                    break;
            }
            return skillResult;
        };
        GameLogic.prototype._convertPanels = function (skillId) {
            var row;
            var col;
            var ret = [];
            if (skillId == 1) {
                for (row = 0; row < this.ROW_CNT; row++) {
                    for (col = 0; col < this.COL_CNT; col++) {
                        if ((this._panels[row][col].id == 2) && !this._panels[row][col].reverse) {
                            this._panels[row][col].id = 1;
                            this._panels[row][col].reverse = false;
                            ret.push({ row: row, col: col });
                        }
                    }
                }
            }
            else {
                for (row = 0; row < this.ROW_CNT; row++) {
                    for (col = 0; col < this.COL_CNT; col++) {
                        this._panels[row][col].id = 1;
                        this._panels[row][col].reverse = ((row == 0 && col == 1) || (row == 1 && col == 1) || (row == 1 && col == 0));
                        ret.push({ row: row, col: col });
                    }
                }
            }
            return ret;
        };
        GameLogic.prototype.getSkillData = function (charaIdx) {
            return this._cards[charaIdx].skill;
        };
        return GameLogic;
    }());
    game.GameLogic = GameLogic;
    var DtoPanel = (function () {
        function DtoPanel(_id, _reverse, _heal) {
            this.id = _id;
            this.reverse = _reverse;
            this.heal = _heal;
        }
        return DtoPanel;
    }());
    game.DtoPanel = DtoPanel;
    var DtoSkillResult = (function () {
        function DtoSkillResult(dt) {
            if (dt === void 0) { dt = null; }
            this.drag = false;
            this.convertPanels = [];
            if (dt) {
                for (var key in dt) {
                    this[key] = dt[key];
                }
            }
        }
        return DtoSkillResult;
    }());
    game.DtoSkillResult = DtoSkillResult;
})(game || (game = {}));
