/// <reference path="../../libs/pixi/dts/pixi.js.d.ts"/>
/// <reference path="../../libs/tween.js.d.ts"/>
/// <reference path="./NumberSprite.ts"/>
/// <reference path="./EffectAttackView.ts"/>
/// <reference path="./EnemyView.ts"/>
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
    var PopupViewCore = (function (_super) {
        __extends(PopupViewCore, _super);
        function PopupViewCore() {
            var _this = _super.call(this) || this;
            var background = new PIXI.Graphics();
            background.beginFill(0x000000);
            background.drawRect(0, 0, 640, 920);
            background.endFill();
            background.alpha = 0.5;
            _this.addChild(background);
            _this.mainNode = new PIXI.Container();
            _this.addChild(_this.mainNode);
            _this.visible = false;
            return _this;
        }
        PopupViewCore.prototype.show = function () {
            this.visible = true;
            this.alpha = 0;
            var target = this;
            var tween = new TWEEN.Tween({ x: -640, alpha: 0 })
                .to({ x: 0, alpha: 1 }, 200)
                .onUpdate(function () {
                target.x = this.x;
                target.alpha = this.alpha;
            })
                .easing(TWEEN.Easing.Quartic.Out);
            tween.start();
        };
        PopupViewCore.prototype.hide = function () {
            this.visible = false;
        };
        return PopupViewCore;
    }(PIXI.Container));
    game.PopupViewCore = PopupViewCore;
})(game || (game = {}));
