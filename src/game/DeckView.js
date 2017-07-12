/// <reference path="../../libs/pixi/dts/pixi.js.d.ts"/>
/// <reference path="../../libs/tween.js.d.ts"/>
/// <reference path="./GaugeView.ts"/>
/// <reference path="./MyInteractionManager.ts"/>
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
    var DeckView = (function (_super) {
        __extends(DeckView, _super);
        function DeckView(cards, maxHp, nowHp) {
            var _this = _super.call(this) || this;
            _this.mainNode = new PIXI.Container();
            _this.addChild(_this.mainNode);
            for (var i = 0; i < cards.length; i++) {
                var charaImage = PIXI.Sprite.fromFrame(cards[i].assetId);
                charaImage.x = i * (640 / 5);
                _this.mainNode.addChild(charaImage);
                game.MyInteractionManager.addDefault(charaImage);
                var onTap = (function (_func, a) {
                    return function () { _func(a); };
                })(function (charaIdx) { return _this._onClickCharacter(charaIdx); }, i);
                //                charaImage.on('click' , onTap);
                charaImage.on('mouseup', onTap).on('touchend', onTap);
            }
            var hpGauge = new game.GaugeView('large', nowHp, maxHp);
            hpGauge.y = 180 - 24;
            hpGauge.x = 10;
            _this.mainNode.addChild(hpGauge);
            _this._hpGauge = hpGauge;
            return _this;
        }
        DeckView.prototype.playDamage = function (damage, restHp) {
            var image = this.mainNode;
            var shakeTween = new TWEEN.Tween({ dummy: 0, offset: 30, target: this.mainNode })
                .to({ dummy: 1 }, 600)
                .onUpdate(function () {
                image.x = Math.floor((Math.random() - 0.5) * this.offset);
                image.y = Math.floor((Math.random() - 0.5) * this.offset);
            });
            var hpGage = this._hpGauge;
            shakeTween.onComplete(function () {
                image.x = 0;
                image.y = 0;
                hpGage.setValueAnimate(restHp);
            });
            shakeTween.start();
        };
        DeckView.prototype.setClickCharacterCallback = function (func) {
            this._clickCallback = func;
        };
        DeckView.prototype._onClickCharacter = function (charaIdx) {
            if (this._clickCallback) {
                this._clickCallback(charaIdx);
            }
        };
        return DeckView;
    }(PIXI.Container));
    game.DeckView = DeckView;
})(game || (game = {}));
