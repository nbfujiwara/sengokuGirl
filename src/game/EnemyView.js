/// <reference path="../../libs/pixi/dts/pixi.js.d.ts"/>
/// <reference path="../../libs/tween.js.d.ts"/>
/// <reference path="./GaugeView.ts"/>
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
    var EnemyView = (function (_super) {
        __extends(EnemyView, _super);
        function EnemyView(enemyData) {
            var _this = _super.call(this) || this;
            _this._enemyImage = PIXI.Sprite.fromFrame(enemyData.assetId);
            _this.addChild(_this._enemyImage);
            _this._enemyImage.anchor.x = 0.5;
            var gaugeType = 'middle';
            var gaugePosX = -300 / 2;
            if (enemyData.size == game.DtoBattleEnemy.SIZE_SMALL) {
                gaugeType = 'small';
                gaugePosX = -150 / 2;
            }
            else if (enemyData.size == game.DtoBattleEnemy.SIZE_MIDDLE) {
                gaugeType = 'middle';
                gaugePosX = -300 / 2;
            }
            else if (enemyData.size == game.DtoBattleEnemy.SIZE_LARGE) {
                gaugeType = 'large';
                gaugePosX = -620 / 2;
            }
            _this._hpGauge = new game.GaugeView(gaugeType, enemyData.hp, enemyData.maxHp);
            _this._hpGauge.scale.y = 0.7;
            _this._hpGauge.x = gaugePosX;
            _this._hpGauge.y = 280;
            _this.addChild(_this._hpGauge);
            var turnCaption = new PIXI.Text('ターン', {
                font: 'bold 20px "ヒラギノ角ゴ Pro W3",Meiryo',
                fill: '#ffffff',
                align: 'right',
                stroke: '#000000',
                strokeThickness: 5
            });
            turnCaption.anchor.x = 1;
            turnCaption.y = 50;
            _this.addChild(turnCaption);
            var turnText = new PIXI.Text(enemyData.turn.toString(), {
                font: 'bold 30px "ヒラギノ角ゴ Pro W3",Meiryo',
                fill: '#ff0000',
                align: 'left',
                stroke: '#ffff00',
                strokeThickness: 8
            });
            turnText.x = 5;
            turnText.y = 45;
            _this.addChild(turnText);
            _this._turnText = turnText;
            _this._nowTurn = enemyData.turn;
            return _this;
        }
        EnemyView.prototype.decreaseTurn = function () {
            this._nowTurn--;
            this._turnText.text = this._nowTurn.toString();
        };
        EnemyView.prototype.setTurn = function (turn) {
            this._nowTurn = turn;
            this._turnText.text = this._nowTurn.toString();
        };
        EnemyView.prototype.changeHp = function (restHp) {
            this._hpGauge.setValueAnimate(restHp);
            var image = this._enemyImage;
            var gauge = this._hpGauge;
            var shakeTween = new TWEEN.Tween({ dummy: 0, offset: 30, target: this._enemyImage })
                .to({ dummy: 1 }, 600)
                .onUpdate(function () {
                image.x = Math.floor((Math.random() - 0.5) * this.offset);
                image.y = Math.floor((Math.random() - 0.5) * this.offset);
            });
            var mainNode = this;
            if (restHp <= 0) {
                shakeTween.chain(new TWEEN.Tween({ alpha: 1 })
                    .to({ alpha: 0 }, 500)
                    .onUpdate(function () {
                    mainNode = this.alpha;
                }));
            }
            shakeTween.onComplete(function () {
                image.x = 0;
                image.y = 0;
            });
            shakeTween.start();
        };
        EnemyView.prototype.attack = function (callback) {
            var tg = this._enemyImage;
            var onUpdateFunc = function () {
                tg.y = this.y;
            };
            var params = { y: 0 };
            new TWEEN.Tween(params).to({ y: -50 }, 100).onUpdate(onUpdateFunc).easing(TWEEN.Easing.Quadratic.Out).chain(new TWEEN.Tween(params).to({ y: 0 }, 100).onUpdate(onUpdateFunc).easing(TWEEN.Easing.Quadratic.In).chain(new TWEEN.Tween(params).to({ y: -50 }, 100).onUpdate(onUpdateFunc).easing(TWEEN.Easing.Quadratic.Out).chain(new TWEEN.Tween(params).to({ y: 0 }, 100).onUpdate(onUpdateFunc).easing(TWEEN.Easing.Quadratic.In).onComplete(callback)))).start();
            /*
                        var tg = this._enemyImage;
                        var onUpdateFunc = function(){
                            tg.scale.x = this.dummy;
                        };
                        new TWEEN.Tween({dummy:0})
                            .to({dummy:1} , 2000)
                            .onUpdate(onUpdateFunc)
                            .onComplete(callback).start();
            
             */
        };
        return EnemyView;
    }(PIXI.Container));
    game.EnemyView = EnemyView;
})(game || (game = {}));
