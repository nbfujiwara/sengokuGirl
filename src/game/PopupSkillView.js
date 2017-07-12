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
/// <reference path="../../libs/pixi/dts/pixi.js.d.ts"/>
/// <reference path="./PopupViewCore.ts"/>
/// <reference path="./ButtonView.ts"/>
/// <reference path="./MyInteractionManager.ts"/>
var game;
(function (game) {
    var PopupSkillView = (function (_super) {
        __extends(PopupSkillView, _super);
        function PopupSkillView() {
            var _this = _super.call(this) || this;
            var background = new PIXI.Graphics();
            background.lineStyle(10, 0x9999ff, 1);
            background.beginFill(0xcccccc);
            background.drawRoundedRect(50, 200, 540, 520, 20);
            background.endFill();
            _this.mainNode.addChild(background);
            _this._textTitle = new PIXI.Text('', {
                font: 'bold 40px "ヒラギノ角ゴ Pro W3",Meiryo',
                fill: '#ffffff',
                align: 'center',
                stroke: '#000044',
                strokeThickness: 10
            });
            _this._textDetail = new PIXI.Text('', {
                font: 'bold 32px "ヒラギノ角ゴ Pro W3",Meiryo',
                fill: '#ffffff',
                align: 'center',
                stroke: '#000044',
                strokeThickness: 10,
                wordWrap: true,
                wordWrapWidth: 460
            });
            _this._textTitle.anchor.x = 0.5;
            _this._textTitle.x = 320;
            _this._textTitle.y = 240;
            _this._textDetail.anchor.x = 0.5;
            _this._textDetail.anchor.y = 0.5;
            _this._textDetail.x = 320;
            _this._textDetail.y = 430;
            _this.mainNode.addChild(_this._textTitle);
            _this.mainNode.addChild(_this._textDetail);
            var execButton = new game.ButtonView('発動', function () { return _this.onExecute(); });
            var cancelButton = new game.ButtonView('キャンセル', function () { return _this.onCancel(); });
            execButton.x = 70;
            execButton.y = 600;
            cancelButton.x = 330;
            cancelButton.y = 600;
            _this.mainNode.addChild(execButton);
            _this.mainNode.addChild(cancelButton);
            _this._interactiveList = [execButton, cancelButton];
            return _this;
        }
        PopupSkillView.prototype.setExecCallback = function (func) {
            this._execCallback = func;
        };
        PopupSkillView.prototype.showSkill = function (skillTitle, skillDetail) {
            game.MyInteractionManager.add(this._interactiveList);
            _super.prototype.show.call(this);
            this._textDetail.text = skillDetail;
            this._textTitle.text = skillTitle;
        };
        PopupSkillView.prototype.hide = function () {
            console.log('release interact');
            game.MyInteractionManager.release();
            _super.prototype.hide.call(this);
        };
        PopupSkillView.prototype.onExecute = function () {
            this.hide();
            if (this._execCallback) {
                this._execCallback();
            }
            return false;
        };
        PopupSkillView.prototype.onCancel = function () {
            this.hide();
            return false;
        };
        return PopupSkillView;
    }(game.PopupViewCore));
    game.PopupSkillView = PopupSkillView;
})(game || (game = {}));
