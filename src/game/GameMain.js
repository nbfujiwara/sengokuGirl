/// <reference path="../../libs/pixi/dts/pixi.js.d.ts"/>
/// <reference path="../../libs/tween.js.d.ts"/>
/// <reference path="./DeckView.ts"/>
/// <reference path="./FightView.ts"/>
/// <reference path="./PanelView.ts"/>
/// <reference path="./EffectCircleView.ts"/>
/// <reference path="./EffectExplosionsView.ts"/>
/// <reference path="./PopupSkillView.ts"/>
/// <reference path="./DataObject.ts"/>
/// <reference path="./GameLogic.ts"/>
/// <reference path="./MyInteractionManager.ts"/>
/// <reference path="./StubData.ts"/>
var game;
(function (game) {
    var GameMain = (function () {
        function GameMain() {
            var _this = this;
            this._panelViews = [];
            this.PANEL_WIDTH = 100;
            this.PANEL_HEIGHT = 100;
            //private _nowShiftList = [];
            //private _nowChainCount;
            this._playedChainCount = 0;
            this._enableAttack = false;
            this._isDragging = false;
            this._dragCellList = [];
            this._rootNode = new PIXI.Container();
            this._fightView = new game.FightView();
            this._rootNode.addChild(this._fightView);
            this._puzzleNode = new PIXI.Container();
            this._puzzleNode.y = 330;
            this._puzzleNode.x = 20;
            this._rootNode.addChild(this._puzzleNode);
            var deckLayer = new PIXI.Container();
            deckLayer.y = 740;
            this._rootNode.addChild(deckLayer);
            this._effectCircleView = new game.EffectCircleView();
            this._rootNode.addChild(this._effectCircleView.getNode());
            this._effectExplosionsView = new game.EffectExplosionsView();
            this._rootNode.addChild(this._effectExplosionsView.getNode());
            this._popupLayer = new PIXI.Container();
            this._rootNode.addChild(this._popupLayer);
            this._logic = new game.GameLogic();
            this._logic.setAllEnemies(game.StubData.getBattleAllEnemies());
            this._logic.setDeckCards(game.StubData.getBattleCards());
            this._logic.startStage();
            this._deckView = new game.DeckView(this._logic.getDeckCards(), this._logic.getPlayerMaxHp(), this._logic.getPlayerHp());
            this._deckView.setClickCharacterCallback(function (charaIdx) { return _this._showSkillPopup(charaIdx); });
            deckLayer.addChild(this._deckView);
            var panels = this._logic.getAllPanels();
            this._panelViews = [];
            for (var row = 0; row < panels.length; row++) {
                for (var col = 0; col < panels[row].length; col++) {
                    var panelView = new game.PanelView(panels[row][col]);
                    var panelSprite = panelView.getNode();
                    panelSprite.x = col * this.PANEL_WIDTH;
                    panelSprite.y = row * this.PANEL_HEIGHT;
                    this._puzzleNode.addChild(panelSprite);
                    this._panelViews.push({
                        row: row,
                        col: col,
                        view: panelView
                    });
                }
            }
            this._puzzleNode.alpha = 0;
            //this._puzzleNode.interactive = true; //↓のMyInteractionManagerに変更
            game.MyInteractionManager.addDefault(this._puzzleNode);
            //this._puzzleNode.mousedown = this._puzzleNode.touchstart = (e)=>this._onTouchStartPuzzleHandler(e);
            //this._puzzleNode.mousemove = this._puzzleNode.touchmove   = (e)=>this._onTouchMovePuzzleHandler(e);
            //this._puzzleNode.mouseup = this._puzzleNode.touchend  = (e)=>this._onTouchEndPuzzleHandler(e);
            this._puzzleNode
                .on('mousedown', function (e) { return _this._onTouchStartPuzzleHandler(e); })
                .on('touchstart', function (e) { return _this._onTouchStartPuzzleHandler(e); })
                .on('mousemove', function (e) { return _this._onTouchMovePuzzleHandler(e); })
                .on('touchmove', function (e) { return _this._onTouchMovePuzzleHandler(e); })
                .on('mouseup', function (e) { return _this._onTouchEndPuzzleHandler(e); })
                .on('touchend', function (e) { return _this._onTouchEndPuzzleHandler(e); });
            this._fightView.setEnemies(this._logic.getNowBattleEnemies());
            this._fightView.showEnemies(function () { return _this._onCompleteShowEnemy(); });
            this._showFirstPuzzle();
        }
        GameMain.prototype._onCompleteShowEnemy = function () {
            this._enableAttack = true;
            console.log('enable Attack On');
        };
        GameMain.prototype._showFirstPuzzle = function () {
            var target = this._puzzleNode;
            var tween = new TWEEN.Tween({ alpha: 0 })
                .to({ alpha: 1 }, 500)
                .onUpdate(function () {
                target.alpha = this.alpha;
            })
                .easing(TWEEN.Easing.Quadratic.Out)
                .start();
        };
        GameMain.prototype._onTouchStartPuzzleHandler = function (e) {
            if (!this._enableAttack) {
                return;
            }
            if (!this._logic.isDragMode()) {
                return; //何もしない
            }
            var interact = e.data;
            console.log('touch down');
            this._isDragging = true;
            this._mouseDownCell = this.getCell(this._getPuzzleNodePosition(e));
            this._dragCellList = [];
            this._pushDragCell(this.getCell(this._getPuzzleNodePosition(e)));
        };
        GameMain.prototype._onTouchMovePuzzleHandler = function (e) {
            if (!this._isDragging) {
                return;
            }
            if (!this._enableAttack) {
                return;
            }
            var interact = e.data;
            var nowCell = this.getCell(this._getPuzzleNodePosition(e));
            if (this._isSameCells(nowCell, this._mouseMovePrevCell)) {
                return;
            }
            if (!this._isDragMultiEnableCells(nowCell, this._mouseMovePrevCell)) {
                this._clearDrag();
                return;
            }
            if (this.isCellExistsInArray(nowCell, this._dragCellList)) {
                this._clearDrag();
                return;
            }
            this._pushDragCell(nowCell);
            //if(nowCell.row == this._mouseMovePrevCell.row)
        };
        GameMain.prototype._clearDrag = function () {
            this._isDragging = false;
            if (this._dragCellList.length) {
                for (var i = 0; i < this._panelViews.length; i++) {
                    var panelView = this._panelViews[i].view;
                    if (panelView && panelView.getNode().alpha < 1) {
                        panelView.getNode().alpha = 1;
                    }
                }
                this._dragCellList = [];
            }
        };
        GameMain.prototype._pushDragCell = function (cell) {
            this._mouseMovePrevCell = cell;
            this._dragCellList.push(cell);
            console.log('複数選択追加 row,col=' + cell.row + ',' + cell.col);
            var panelView = this._getPanelView(cell.row, cell.col);
            panelView.getNode().alpha = 0.2;
        };
        GameMain.prototype._isSameCells = function (cell1, cell2) {
            if (!cell1 || !cell2) {
                return false;
            }
            return ((cell1.row == cell2.row) && (cell1.col == cell2.col));
        };
        GameMain.prototype._isDragMultiEnableCells = function (cell1, cell2) {
            if (!cell1 || !cell2) {
                return false;
            }
            return ((cell1.row == cell2.row) && (cell1.col == cell2.col - 1)
                || (cell1.row == cell2.row) && (cell1.col == cell2.col + 1)
                || (cell1.row == cell2.row - 1) && (cell1.col == cell2.col)
                || (cell1.row == cell2.row + 1) && (cell1.col == cell2.col));
        };
        GameMain.prototype.isCellExistsInArray = function (cell, list) {
            for (var i = 0; i < list.length; i++) {
                if (this._isSameCells(cell, list[i])) {
                    return true;
                }
            }
            return false;
        };
        GameMain.prototype._getPuzzleNodePosition = function (event) {
            //console.log(event);
            var interact = event.data;
            //console.log(interact.getLocalPosition(event.target));
            var point = interact.getLocalPosition(event.target);
            return point;
        };
        GameMain.prototype._onTouchEndPuzzleHandler = function (e) {
            var _this = this;
            if (!this._enableAttack) {
                return;
            }
            this._enableAttack = false;
            console.log('touch end');
            var cell;
            var dragCellList = [];
            if (this._isDragging) {
                cell = this._mouseDownCell;
                dragCellList = this._dragCellList;
                //this._clearDrag();
                //this._clearDrag()はもうちょっと後のタイミングでやったほうが見た目がいいので　_enableAttack　のtrue戻しと同タイミングで行う
                this._isDragging = false;
                //でもisDraggingだけは戻しておく
            }
            else {
                cell = this.getCell(this._getPuzzleNodePosition(e));
            }
            if (cell) {
                console.log('attack select target row=' + cell.row + ' ,col=' + cell.col);
                var attackResult = this._logic.attack(cell.row, cell.col, dragCellList);
                console.log(attackResult);
                this._attackResult = attackResult;
                this._playedChainCount = 0;
                var i = void 0;
                var panelView = void 0;
                for (i = 0; i < attackResult.reverseList.length; i++) {
                    panelView = this._getPanelView(attackResult.reverseList[i].row, attackResult.reverseList[i].col);
                    panelView.reverse();
                }
                var chainList = attackResult.chainList;
                var chainDelay = 150;
                for (i = 0; i < chainList.length; i++) {
                    var r = chainList[i].row;
                    var c = chainList[i].col;
                    panelView = this._getPanelView(r, c);
                    var chainCallback = (function (_func, a, b) {
                        return function () { _func(a, b); };
                    })(function (row, col) { return _this._callbackChainPanelTween(row, col); }, r, c);
                    panelView.chain(chainCallback, chainDelay);
                    this._effectExplosionsView.play(this.getEffectPoint(chainList[i]), chainDelay, i);
                    chainDelay += 100;
                }
                //this._nowChainCount = chainList.length;
                //this._nowShiftList = attackResult.shiftList;
                this._effectCircleView.play(this.getEffectPoint(cell));
            }
            else {
                console.log('場所不明');
            }
        };
        GameMain.prototype._getPanelView = function (row, col) {
            return this._panelViews[this._getPanelViewIndex(row, col)].view;
        };
        GameMain.prototype._getPanelViewIndex = function (row, col) {
            for (var i = 0; i < this._panelViews.length; i++) {
                if (this._panelViews[i].row == row && this._panelViews[i].col == col) {
                    return i;
                }
            }
            return null;
        };
        GameMain.prototype._callbackChainPanelTween = function (row, col) {
            var _this = this;
            console.log('chain tween complete callback');
            var panelIndex = this._getPanelViewIndex(row, col);
            if (!this._panelViews[panelIndex]) {
                console.log('既にnullになっちゃってる!!!');
                return;
            }
            var panelView = this._panelViews[panelIndex].view;
            this._puzzleNode.removeChild(panelView.getNode());
            this._panelViews[panelIndex].view = null;
            this._panelViews[panelIndex] = null;
            this._panelViews.splice(panelIndex, 1);
            this._playedChainCount++;
            if (this._playedChainCount >= this._attackResult.chainList.length) {
                this._fightView.playFight(this._attackResult.fightResult, function () { return _this._callbackPlayFight(); });
                this._playShiftPanel();
                //敵がまだ残っていたら&敵が攻撃してなかったらパズル可能に
                if (!this._attackResult.fightResult.isDestroy && !this._attackResult.fightResult.enemyAttacks.length) {
                    this._enableAttack = true;
                    console.log('enable Attack On');
                }
            }
        };
        GameMain.prototype._playShiftPanel = function () {
            var shiftList = this._attackResult.shiftList;
            var panelView;
            var panelSprite;
            var panelIndex;
            for (var i = 0; i < shiftList.length; i++) {
                if (shiftList[i].type == 'move') {
                    panelIndex = this._getPanelViewIndex(shiftList[i].fromRow, shiftList[i].fromCol);
                    panelView = this._panelViews[panelIndex].view;
                    panelSprite = panelView.getNode();
                }
                if (shiftList[i].type == 'create') {
                    panelIndex = this._panelViews.length;
                    panelView = new game.PanelView(shiftList[i].panelData);
                    panelSprite = panelView.getNode();
                    panelSprite.x = (shiftList[i].col + shiftList[i].shiftCount) * this.PANEL_HEIGHT;
                    panelSprite.y = shiftList[i].row * this.PANEL_HEIGHT;
                    this._puzzleNode.addChild(panelSprite);
                    this._panelViews.push({
                        view: panelView
                    });
                }
                this._panelViews[panelIndex].row = shiftList[i].row;
                this._panelViews[panelIndex].col = shiftList[i].col;
                var fromX = panelSprite.x;
                var fromY = panelSprite.y;
                var toX = this._panelViews[panelIndex].col * this.PANEL_WIDTH;
                var toY = this._panelViews[panelIndex].row * this.PANEL_HEIGHT;
                var tween = new TWEEN.Tween({ x: fromX, y: fromY, target: panelSprite })
                    .to({ x: toX, y: toY }, 200)
                    .onUpdate(function () {
                    this.target.x = this.x;
                    this.target.y = this.y;
                })
                    .easing(TWEEN.Easing.Quadratic.Out);
                tween.start();
                //                console.log(shiftList[i]);
            }
        };
        GameMain.prototype._callbackPlayFight = function () {
            var _this = this;
            console.log('fight play callback');
            this._clearDrag();
            if (this._attackResult.isClear) {
                alert('クリアしました！！！');
                location.href = 'index.html';
            }
            else if (this._attackResult.isNextBattle) {
                this._fightView.setEnemies(this._logic.getNowBattleEnemies());
                this._fightView.showEnemies(function () { return _this._onCompleteShowEnemy(); });
            }
            else if (this._attackResult.isLose) {
                alert('負けちゃいました...');
            }
            else {
                if (this._attackResult.fightResult.enemyAttacks.length) {
                    var attackList = this._attackResult.fightResult.enemyAttacks;
                    var playerDamage = 0;
                    var playerHp = 0;
                    for (var i = 0; i < attackList.length; i++) {
                        playerDamage += attackList[i].damage;
                        playerHp = attackList[i].restHp;
                    }
                    this._deckView.playDamage(playerDamage, playerHp);
                }
                //次のターンへ
                this._enableAttack = true;
                console.log('enable Attack On');
            }
        };
        GameMain.prototype._showSkillPopup = function (charaIdx) {
            var _this = this;
            if (!this._popupSkillView) {
                this._popupSkillView = new game.PopupSkillView();
                this._popupLayer.addChild(this._popupSkillView);
            }
            this._popupSkillView.setExecCallback((function (_func, a) {
                return function () { _func(a); };
            })(function (charaIdx) { return _this._invokeSkill(charaIdx); }, charaIdx));
            var skillData = this._logic.getSkillData(charaIdx);
            this._popupSkillView.showSkill(skillData.name, skillData.detail);
        };
        GameMain.prototype._invokeSkill = function (charaIdx) {
            var skillResult = this._logic.executeSkill(charaIdx);
            var convertList = skillResult.convertPanels;
            for (var i = 0; i < convertList.length; i++) {
                var panelView = this._getPanelView(convertList[i].row, convertList[i].col);
                panelView.change();
            }
        };
        GameMain.prototype.getEffectPoint = function (cell) {
            var pt = this.getPoint(cell);
            pt.x += this._puzzleNode.x;
            pt.y += this._puzzleNode.y;
            return pt;
        };
        GameMain.prototype.getPoint = function (cell) {
            var x = (cell.col + 0.5) * this.PANEL_WIDTH;
            var y = (cell.row + 0.5) * this.PANEL_HEIGHT;
            return new PIXI.Point(x, y);
        };
        GameMain.prototype.getCell = function (point) {
            var row = 0;
            var col = 0;
            if (point.y >= 0 && point.y < this.PANEL_HEIGHT * this._logic.ROW_CNT) {
                row = Math.floor(point.y / this.PANEL_HEIGHT);
            }
            else {
                return null;
            }
            if (point.x >= 0 && point.x < this.PANEL_WIDTH * this._logic.COL_CNT) {
                col = Math.floor(point.x / this.PANEL_WIDTH);
            }
            else {
                return null;
            }
            return { row: row, col: col };
        };
        GameMain.prototype.getNode = function () {
            return this._rootNode;
        };
        return GameMain;
    }());
    game.GameMain = GameMain;
})(game || (game = {}));
