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
    var ButtonView = (function (_super) {
        __extends(ButtonView, _super);
        function ButtonView(label, onClickHandler) {
            var _this = _super.call(this) || this;
            var background = PIXI.Sprite.fromFrame('button.png');
            _this.addChild(background);
            var textStyle = {
                font: 'bold 32px "ヒラギノ角ゴ Pro W3",Meiryo',
                fill: '#ffffff',
                align: 'center',
                stroke: '#000044',
                strokeThickness: 10
            };
            var labelText = new PIXI.Text(label, textStyle);
            labelText.x = background.width / 2 - labelText.width / 2;
            labelText.y = background.height / 2 - labelText.height / 2;
            _this.addChild(labelText);
            //this.click  = onClickHandler;
            //this.on('click' , onClickHandler);
            //this.on('click' , (e)=>{onClickHandler(e); return false;});
            _this.on('mouseup', function (e) { console.log(e); e.stopPropagation(); onClickHandler(e); return false; })
                .on('touchend', function (e) { e.stopPropagation(); onClickHandler(e); return false; });
            return _this;
        }
        return ButtonView;
    }(PIXI.Container));
    game.ButtonView = ButtonView;
})(game || (game = {}));
