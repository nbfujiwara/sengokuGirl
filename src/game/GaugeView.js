/// <reference path="../../libs/pixi/dts/pixi.js.d.ts"/>
/// <reference path="../../libs/tween.js.d.ts"/>
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
    var GaugeView = (function (_super) {
        __extends(GaugeView, _super);
        function GaugeView(type, nowValue, maxValue) {
            if (type === void 0) { type = 'middle'; }
            if (nowValue === void 0) { nowValue = 1; }
            if (maxValue === void 0) { maxValue = 1; }
            var _this = _super.call(this) || this;
            _this.mainNode = new PIXI.Container();
            var borderAssetName = 'gauge_border_m.png';
            var barWidth = 300 - 2 * 4;
            if (type == 'large') {
                borderAssetName = 'gauge_border_l.png';
                barWidth = 620 - 2 * 4;
            }
            else if (type == 'small') {
                borderAssetName = 'gauge_border_s.png';
                barWidth = 150 - 2 * 4;
            }
            var borderSprite = PIXI.Sprite.fromFrame(borderAssetName);
            var barSprite = PIXI.Sprite.fromFrame('gauge_red.png');
            var backgroundSprite = PIXI.Sprite.fromFrame('black.png');
            //barSprite.width = barWidth;
            //barSprite.height = 16;
            barSprite.x = 4;
            barSprite.y = 4;
            backgroundSprite.width = barWidth;
            backgroundSprite.height = 16;
            backgroundSprite.x = 4;
            backgroundSprite.y = 4;
            _this._barSprite = barSprite;
            _this._maxValue = maxValue;
            _this._nowValue = nowValue;
            _this._barWidth = barWidth;
            _this.setValue(nowValue);
            _this.mainNode.addChild(backgroundSprite);
            _this.mainNode.addChild(barSprite);
            _this.mainNode.addChild(borderSprite);
            _this.addChild(_this.mainNode);
            return _this;
        }
        GaugeView.prototype.setValue = function (value) {
            this._nowValue = value;
            this._barSprite.width = this._barWidth * value / this._maxValue;
        };
        GaugeView.prototype.setValueAnimate = function (value) {
            var fromVal = this._barWidth * this._nowValue / this._maxValue;
            var toVal = this._barWidth * value / this._maxValue;
            if (toVal < 0) {
                toVal = 0;
            }
            this._nowValue = value;
            var target = this._barSprite;
            var tween = new TWEEN.Tween({ width: fromVal })
                .to({ width: toVal }, 500)
                .onUpdate(function () {
                target.width = this.width;
            })
                .easing(TWEEN.Easing.Quadratic.Out);
            tween.start();
        };
        return GaugeView;
    }(PIXI.Container));
    game.GaugeView = GaugeView;
})(game || (game = {}));
