/// <reference path="../../libs/pixi/dts/pixi.js.d.ts"/>
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
    var NumberSprite = (function (_super) {
        __extends(NumberSprite, _super);
        function NumberSprite(num, align) {
            if (align === void 0) { align = 'left'; }
            var _this = _super.call(this) || this;
            _this._alignLeft = false;
            _this._alignCenter = false;
            _this._alignRight = false;
            _this._container = new PIXI.Container();
            _this.addChild(_this._container);
            if (align == 'center') {
                _this._alignCenter = true;
            }
            else if (align == 'right') {
                _this._alignRight = true;
            }
            else {
                _this._alignLeft = true;
            }
            _this._charImageList = [];
            _this.setNumber(num);
            return _this;
        }
        NumberSprite.prototype.setNumber = function (num) {
            this._clearNumber();
            var numStr = num.toString();
            var charList = [];
            var totalWidth = 0;
            for (var i = 0; i < numStr.length; i++) {
                charList.push(numStr.substr(i, 1));
                var char = numStr.substr(i, 1);
                var charImg = PIXI.Sprite.fromFrame('num/num_' + char + '.png');
                charImg.x = totalWidth;
                this._container.addChild(charImg);
                this._charImageList.push(charImg);
                totalWidth += charImg.width;
            }
            if (this._alignCenter) {
                this._container.x = -totalWidth / 2;
            }
            if (this._alignRight) {
                this._container.x = -totalWidth;
            }
        };
        NumberSprite.prototype._clearNumber = function () {
            for (var i = 0; i < this._charImageList.length; i++) {
                this._container.removeChild(this._charImageList[i]);
                this._charImageList[i] = null;
            }
            this._charImageList = [];
        };
        return NumberSprite;
    }(PIXI.Container));
    game.NumberSprite = NumberSprite;
})(game || (game = {}));
