/// <reference path="../../libs/pixi/dts/pixi.js.d.ts"/>
var game;
(function (game) {
    var EffectAttackView = (function () {
        function EffectAttackView() {
            this._isPlaying = false;
            this.mainNode = new PIXI.Container();
            this._mcTypeA = this._createAnimateMc('effect_atk_a_', 19);
            this._mcTypeB = this._createAnimateMc('effect_atk_b_', 19);
            this._mcTypeC = this._createAnimateMc('effect_atk_c_', 19);
        }
        EffectAttackView.prototype._createAnimateMc = function (prefix, maxNum) {
            var _this = this;
            var textures = this._getAnimateTextures(prefix, maxNum);
            var animationMc = new PIXI.extras.MovieClip(textures);
            animationMc.visible = false;
            animationMc.loop = false;
            animationMc.anchor.x = 0.5;
            animationMc.anchor.y = 0.5;
            animationMc.scale.x = 2;
            animationMc.scale.y = 2;
            animationMc.x = 320;
            animationMc.y = 160;
            animationMc.onComplete = function () { return _this._onPlayComplete(); };
            this.mainNode.addChild(animationMc);
            return animationMc;
        };
        EffectAttackView.prototype._getAnimateTextures = function (prefix, maxNum) {
            var animateTextures = [];
            for (var num = 0; num <= maxNum; num++) {
                animateTextures.push(PIXI.Texture.fromFrame(prefix + num + '.png'));
                animateTextures.push(PIXI.Texture.fromFrame(prefix + num + '.png'));
            }
            return animateTextures;
        };
        EffectAttackView.prototype.playA = function () {
            if (this._isPlaying)
                return;
            this._playingTarget = this._mcTypeA;
            this._play();
        };
        EffectAttackView.prototype.playB = function () {
            if (this._isPlaying)
                return;
            this._playingTarget = this._mcTypeB;
            this._play();
        };
        EffectAttackView.prototype.playC = function () {
            if (this._isPlaying)
                return;
            this._playingTarget = this._mcTypeC;
            this._play();
        };
        EffectAttackView.prototype._play = function () {
            this._isPlaying = true;
            this._playingTarget.visible = true;
            this._playingTarget.play();
        };
        EffectAttackView.prototype._onPlayComplete = function () {
            this._playingTarget.visible = false;
            this._playingTarget.gotoAndStop(0);
            this._isPlaying = false;
        };
        EffectAttackView.prototype.getNode = function () {
            return this.mainNode;
        };
        return EffectAttackView;
    }());
    game.EffectAttackView = EffectAttackView;
})(game || (game = {}));
