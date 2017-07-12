/// <reference path="../../libs/pixi/dts/pixi.js.d.ts"/>
var game;
(function (game) {
    var EffectCircleView = (function () {
        function EffectCircleView() {
            var _this = this;
            this.mainNode = new PIXI.Container();
            var animateTextures = [];
            for (var num = 0; num <= 18; num++) {
                animateTextures.push(PIXI.Texture.fromFrame('effect_circle_' + num + '.png'));
                animateTextures.push(PIXI.Texture.fromFrame('effect_circle_' + num + '.png')); //fpsをわざと遅らせるために無理やり増やしてみる
                animateTextures.push(PIXI.Texture.fromFrame('effect_circle_' + num + '.png')); //fpsをわざと遅らせるために無理やり増やしてみる
            }
            var animationMc = new PIXI.extras.MovieClip(animateTextures);
            animationMc.visible = false;
            animationMc.loop = false;
            animationMc.onComplete = function () { return _this._onPlayComplete(); };
            animationMc.anchor.x = 0.5;
            animationMc.anchor.y = 0.55;
            //animationMc.scale.x = 1.5;
            //animationMc.scale.y = 1.5;
            this.mainNode.addChild(animationMc);
            this._animationMc = animationMc;
        }
        EffectCircleView.prototype.play = function (point) {
            this._animationMc.x = point.x;
            this._animationMc.y = point.y;
            this._animationMc.visible = true;
            this._animationMc.play();
        };
        EffectCircleView.prototype._onPlayComplete = function () {
            this._animationMc.visible = false;
            this._animationMc.gotoAndStop(0);
        };
        EffectCircleView.prototype.getNode = function () {
            return this.mainNode;
        };
        return EffectCircleView;
    }());
    game.EffectCircleView = EffectCircleView;
})(game || (game = {}));
