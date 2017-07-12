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
/// <reference path="./ViewCore.ts"/>
/// <reference path="./GameLogic.ts"/>
var game;
(function (game) {
    var PanelView = (function (_super) {
        __extends(PanelView, _super);
        function PanelView(panelData) {
            var _this = _super.call(this) || this;
            _this._bothContainer = new PIXI.Container();
            _this.mainNode.addChild(_this._bothContainer);
            _this._bothContainer.x = 100 / 2;
            _this._bothContainer.y = 100 / 2;
            _this._upperLayer = new PIXI.Container();
            _this._downerLayer = new PIXI.Container();
            _this._bothContainer.addChild(_this._downerLayer);
            _this._bothContainer.addChild(_this._upperLayer);
            _this._panelData = panelData;
            _this._upperSprite = _this._createPanelImageSprite('p' + _this._panelData.id + '_0.png');
            _this._downerSprite = _this._createPanelImageSprite('p' + _this._panelData.id + '_1.png');
            _this._upperLayer.addChild(_this._upperSprite);
            _this._downerLayer.addChild(_this._downerSprite);
            _this._layerCommonSetting(_this._upperLayer);
            _this._layerCommonSetting(_this._downerLayer);
            _this._upperLayer.visible = !_this._panelData.reverse;
            _this._downerLayer.visible = _this._panelData.reverse;
            _this._upperHeart = _this._createHeartImageSprite();
            _this._downerHeart = _this._createHeartImageSprite();
            _this._upperLayer.addChild(_this._upperHeart);
            _this._downerLayer.addChild(_this._downerHeart);
            return _this;
        }
        PanelView.prototype._layerCommonSetting = function (layer) {
            //layer.x = 100/2;
            //layer.y = 100/2;
            //layer.rotation = 45;
            layer.visible = false;
        };
        PanelView.prototype._createHeartImageSprite = function () {
            var sprite = PIXI.Sprite.fromFrame('p_heart.png');
            sprite.x = 15;
            sprite.y = 15;
            sprite.visible = this._panelData.heal;
            return sprite;
        };
        PanelView.prototype._createPanelImageSprite = function (assetName) {
            var sprite = PIXI.Sprite.fromFrame(assetName);
            /*
            sprite.anchor.x = 0.5;
            sprite.anchor.y = 0.5;
            sprite.x = 100/2;
            sprite.y = 100/2;
            */
            sprite.x = -100 / 2;
            sprite.y = -100 / 2;
            return sprite;
        };
        PanelView.prototype._getUpperAssetName = function () {
            var assetName = 'p' + this._panelData.id;
            if (this._panelData.reverse) {
                assetName += '_1.png';
            }
            else {
                assetName += '_0.png';
            }
            return assetName;
        };
        PanelView.prototype._getDownerAssetName = function () {
            var assetName = 'p' + this._panelData.id;
            if (this._panelData.reverse) {
                assetName += '_0.png';
            }
            else {
                assetName += '_1.png';
            }
            return assetName;
        };
        PanelView.prototype.reverse = function () {
            var nowSide = this._upperLayer;
            var nextSide = this._downerLayer;
            if (this._downerLayer.visible) {
                nowSide = this._downerLayer;
                nextSide = this._upperLayer;
            }
            var params = { scale: 1 };
            var tween = new TWEEN.Tween(params)
                .to({ scale: 0 }, 90)
                .onUpdate(function () {
                nowSide.scale.y = this.scale;
            })
                .easing(TWEEN.Easing.Quadratic.Out)
                .onComplete(function () {
                nowSide.visible = false;
                nextSide.visible = true;
            });
            tween.chain(new TWEEN.Tween(params)
                .to({ scale: 1 }, 90)
                .onUpdate(function () {
                nextSide.scale.y = this.scale;
            })
                .easing(TWEEN.Easing.Quadratic.In));
            tween.start();
        };
        PanelView.prototype.change = function () {
            var _this = this;
            var upper = this._upperLayer;
            var downer = this._downerLayer;
            var target = this._bothContainer;
            var scaleUpdateFunc = function () {
                target.scale.x = this.scale;
                target.scale.y = this.scale;
                //                upper.rotation = downer.rotation = this.rotation;
            };
            var tween = new TWEEN.Tween({ scale: 1, rotation: 45 })
                .to({ scale: 0, rotation: 45 + 360 }, 300)
                .onUpdate(scaleUpdateFunc)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onComplete(function () { return _this._changeImage(); });
            tween.chain(new TWEEN.Tween({ scale: 0, rotation: 45 + 360 })
                .to({ scale: 1, rotation: 45 }, 300)
                .onUpdate(scaleUpdateFunc)
                .easing(TWEEN.Easing.Quadratic.In));
            tween.start();
        };
        PanelView.prototype._changeImage = function () {
            this._upperLayer.removeChild(this._upperSprite);
            this._downerLayer.removeChild(this._downerSprite);
            this._upperSprite = null;
            this._downerSprite = null;
            this._upperSprite = this._createPanelImageSprite('p' + this._panelData.id + '_0.png');
            this._downerSprite = this._createPanelImageSprite('p' + this._panelData.id + '_1.png');
            this._upperLayer.addChild(this._upperSprite);
            this._downerLayer.addChild(this._downerSprite);
            this._upperLayer.visible = !this._panelData.reverse;
            this._downerLayer.visible = this._panelData.reverse;
            this._upperLayer.removeChild(this._upperHeart);
            this._downerLayer.removeChild(this._downerHeart);
            this._upperHeart = null;
            this._downerHeart = null;
            this._upperHeart = this._createHeartImageSprite();
            this._downerHeart = this._createHeartImageSprite();
            this._upperLayer.addChild(this._upperHeart);
            this._downerLayer.addChild(this._downerHeart);
        };
        PanelView.prototype.chain = function (callback, delay) {
            if (delay === void 0) { delay = 0; }
            var fromY = this.mainNode.y;
            var toY = fromY - 150;
            var target = this.mainNode;
            var tween = new TWEEN.Tween({ y: fromY, alpha: 1 })
                .to({ y: toY, alpha: 0 }, 500)
                .onUpdate(function () {
                target.y = this.y;
                target.alpha = this.alpha;
            })
                .delay(delay)
                .easing(TWEEN.Easing.Quartic.In);
            tween.start();
            //callbackを早めに発行させてみる
            var tween2 = new TWEEN.Tween({ dummy: 0 })
                .to({ dummy: 1 }, 200)
                .delay(delay)
                .onComplete(callback);
            tween2.start();
        };
        return PanelView;
    }(game.ViewCore));
    game.PanelView = PanelView;
})(game || (game = {}));
