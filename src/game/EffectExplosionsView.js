/// <reference path="../../libs/pixi/dts/pixi.js.d.ts"/>
/// <reference path="../../libs/tween.js.d.ts"/>
var game;
(function (game) {
    var EffectExplosionsView = (function () {
        function EffectExplosionsView() {
            this.mainNode = new PIXI.Container();
            this._pool = [];
            //事前にN個poolしておいてみる
            for (var i = 0; i < 5; i++) {
                var newMc = this._createMovieClip();
                this._pool.push(newMc);
            }
        }
        EffectExplosionsView.prototype.play = function (point, delay, chainIdx) {
            var _this = this;
            if (chainIdx == 0) {
                return;
            }
            var scale = 1.5;
            if (chainIdx <= 10) {
                scale = 0.5 + (chainIdx) / 10;
            }
            new TWEEN.Tween({ dummy: 0 })
                .to({ dummy: 1 }, delay)
                .onComplete((function (_func, arg1, arg2) {
                return function () { _func(arg1, arg2); };
            })(function (point, scale) { return _this._playExecute(point, scale); }, point, scale))
                .start();
        };
        EffectExplosionsView.prototype._playExecute = function (point, scale) {
            var _this = this;
            var mcIdx = this._getTargetMovieClipIndex();
            var tgMc = this._pool[mcIdx];
            tgMc.x = point.x;
            tgMc.y = point.y;
            tgMc.visible = true;
            tgMc.scale.x = scale;
            tgMc.scale.y = scale;
            tgMc.onComplete = (function (_func, arg1) {
                return function () { _func(arg1); };
            })(function (tgIdx) { return _this._onPlayComplete(tgIdx); }, mcIdx);
            tgMc.play();
        };
        EffectExplosionsView.prototype._onPlayComplete = function (mcIdx) {
            var tgMc = this._pool[mcIdx];
            tgMc.visible = false;
            tgMc.gotoAndStop(0);
        };
        EffectExplosionsView.prototype._getTargetMovieClipIndex = function () {
            for (var i = 0; i < this._pool.length; i++) {
                var mc = this._pool[i];
                if (!mc.playing) {
                    return i;
                }
            }
            console.log('poolが足りなくなったので追加する' + this._pool.length);
            var newMc = this._createMovieClip();
            this._pool.push(newMc);
            return (this._pool.length - 1);
        };
        EffectExplosionsView.prototype._createMovieClip = function () {
            var animateTextures = [];
            for (var num = 0; num <= 29; num++) {
                animateTextures.push(PIXI.Texture.fromFrame('effect_explosion_' + num + '.png'));
            }
            var animationMc = new PIXI.extras.MovieClip(animateTextures);
            animationMc.visible = false;
            animationMc.loop = false;
            //            animationMc.onComplete = ()=>this._onPlayComplete();
            animationMc.anchor.x = 0.5;
            animationMc.anchor.y = 0.5;
            this.mainNode.addChild(animationMc);
            return animationMc;
        };
        EffectExplosionsView.prototype.getNode = function () {
            return this.mainNode;
        };
        return EffectExplosionsView;
    }());
    game.EffectExplosionsView = EffectExplosionsView;
})(game || (game = {}));
