/// <reference path="../../libs/pixi/dts/pixi.js.d.ts"/>
/// <reference path="../../libs/tween.js.d.ts"/>
/// <reference path="./NumberSprite.ts"/>
/// <reference path="./EffectAttackView.ts"/>
/// <reference path="./EnemyView.ts"/>
/// <reference path="./DataObject.ts"/>
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var game;
(function (game) {
    var FightView = (function (_super) {
        __extends(FightView, _super);
        function FightView() {
            var _this = _super.call(this) || this;
            _this._enemyViewList = [];
            _this.mainNode = new PIXI.Container();
            _this.addChild(_this.mainNode);
            var background = PIXI.Sprite.fromFrame('stage_background.png');
            _this.mainNode.addChild(background);
            _this._enemyLayer = new PIXI.Container();
            _this.mainNode.addChild(_this._enemyLayer);
            _this._enemyLayer.visible = false;
            _this._effectView = new game.EffectAttackView();
            _this.mainNode.addChild(_this._effectView.getNode());
            _this._damageNumLayer = new PIXI.Container();
            _this.mainNode.addChild(_this._damageNumLayer);
            return _this;
        }
        FightView.prototype.setEnemies = function (_enemies) {
            this._clearEnemies();
            this._enemyLayer.visible = false;
            for (var i = 0; i < _enemies.length; i++) {
                var enemyView = new game.EnemyView(_enemies[i]);
                enemyView.x = _enemies[i].posX;
                enemyView.y = _enemies[i].posY;
                this._enemyViewList.push(enemyView);
                this._enemyLayer.addChild(enemyView);
                /*
                
                                var damageNum = new NumberSprite(999, 'center');
                                damageNum.visible = false;
                                damageNum.x = _enemies[i].posX;
                                this._damageNumList.push(damageNum);
                                this._damageNumLayer.addChild(damageNum);
                */
            }
        };
        FightView.prototype.showEnemies = function (_onComplete) {
            this._enemyLayer.alpha = 0;
            this._enemyLayer.visible = true;
            var tg = this._enemyLayer;
            var tween = new TWEEN.Tween({ y: 100, alpha: 0 })
                .to({ y: 0, alpha: 1 }, 800)
                .onUpdate(function () {
                tg.y = this.y;
                tg.alpha = this.alpha;
            })
                .easing(TWEEN.Easing.Exponential.Out)
                .onComplete(_onComplete);
            tween.start();
        };
        FightView.prototype._clearEnemies = function () {
            var i;
            for (i = 0; i < this._enemyViewList.length; i++) {
                this._enemyLayer.removeChild(this._enemyViewList[i]);
                this._enemyViewList[i] = null;
            }
            this._enemyViewList = null;
            this._enemyViewList = [];
            /*
            for(i=0; i<this._damageNumList.length; i++){
                this._damageNumLayer.removeChild(this._damageNumList[i]);
                this._damageNumList[i] = null;
            }
            this._damageNumList = null;
            this._damageNumList = [];
            */
        };
        FightView.prototype.playFight = function (fightResult, callback) {
            this._fightResult = fightResult;
            this._playFightCallback = callback;
            this._playEffect();
            this._playDamage();
        };
        FightView.prototype._playEffect = function () {
            var effectType = this._fightResult.effectType;
            if (effectType == 3) {
                this._effectView.playA();
            }
            else if (effectType == 2) {
                this._effectView.playB();
            }
            else {
                this._effectView.playC();
            }
        };
        FightView.prototype._playOneDamageNum = function (enemyIdx, damage, baseDelay, callback) {
            var enemyView = this._enemyViewList[enemyIdx];
            if (!enemyView) {
                console.log('対象enemyViewが不明なためダメージ表示中止');
                return;
            }
            var damageNumView = new game.NumberSprite(damage, 'center');
            damageNumView.visible = true;
            damageNumView.alpha = 0;
            damageNumView.scale.x = 0.85;
            damageNumView.scale.y = 0.85;
            var baseX = enemyView.x + 10 * Math.cos(2 * Math.PI * Math.random());
            var baseY = 180 + 10 * Math.sin(2 * Math.PI * Math.random());
            var startX = baseX + 200 * Math.cos(2 * Math.PI * Math.random());
            var startY = baseY + 200 * Math.sin(2 * Math.PI * Math.random());
            var params = { x: startX, y: startY, alpha: 0 };
            var numContainer = this._damageNumLayer;
            numContainer.addChild(damageNumView);
            var damageNumTween = new TWEEN.Tween(params)
                .to({ x: baseX, y: baseY, alpha: 1 }, 200)
                .delay(baseDelay)
                .onUpdate(function () {
                damageNumView.x = this.x;
                damageNumView.y = this.y;
                damageNumView.alpha = this.alpha;
            })
                .easing(TWEEN.Easing.Quartic.Out);
            damageNumTween.chain(new TWEEN.Tween(params)
                .to({ y: baseY + 30, alpha: 0 }, 90)
                .delay(100)
                .onUpdate(function () {
                damageNumView.y = this.y;
                damageNumView.alpha = this.alpha;
            })
                .easing(TWEEN.Easing.Linear.None)
                .onComplete(function () {
                numContainer.removeChild(damageNumView);
                damageNumView = null;
                if (callback) {
                    callback();
                }
            }));
            damageNumTween.start();
        };
        FightView.prototype._playDamage = function () {
            var _this = this;
            var damageList = this._fightResult.damageList;
            this._playingDamageCount = damageList.length;
            this._playedDamageCount = 0;
            var lastHpHash = {};
            for (var i = 0; i < damageList.length; i++) {
                var tgIdx = damageList[i].enemyIndex;
                lastHpHash[tgIdx] = damageList[i].restHp;
                if (i == damageList.length - 1) {
                    var callback2 = function () { return _this._onPlayDamageComplete(); };
                    this._playOneDamageNum(tgIdx, damageList[i].damage, 100 + i * 100, callback2);
                }
                else {
                    this._playOneDamageNum(tgIdx, damageList[i].damage, 100 + i * 100, null);
                }
            }
            for (var eIdx in lastHpHash) {
                var enemyView = this._enemyViewList[eIdx];
                if (enemyView) {
                    enemyView.changeHp(lastHpHash[eIdx]);
                }
            }
        };
        FightView.prototype._onPlayDamageComplete = function () {
            for (var i = 0; i < this._enemyViewList.length; i++) {
                this._enemyViewList[i].decreaseTurn();
            }
            console.log('_onPlayDamageComplete');
            console.log(this._fightResult.enemyAttacks);
            if (this._fightResult.enemyAttacks.length) {
                this._enemyAttackIndex = 0;
                this._playEnemyAttack();
            }
            else {
                this._playFightCallback();
            }
        };
        FightView.prototype._playEnemyAttack = function () {
            var _this = this;
            var attack = this._fightResult.enemyAttacks[this._enemyAttackIndex];
            var enemyView = this._enemyViewList[attack.enemyIndex];
            enemyView.attack(function () { return _this._onPlayEnemyAttackComplete(); });
        };
        FightView.prototype._onPlayEnemyAttackComplete = function () {
            var attack = this._fightResult.enemyAttacks[this._enemyAttackIndex];
            var enemyView = this._enemyViewList[attack.enemyIndex];
            enemyView.setTurn(attack.nextTurn);
            this._enemyAttackIndex++;
            if (this._enemyAttackIndex >= this._fightResult.enemyAttacks.length) {
                this._playFightCallback();
            }
            else {
                this._playEnemyAttack();
            }
        };
        return FightView;
    }(PIXI.Container));
    game.FightView = FightView;
})(game || (game = {}));
