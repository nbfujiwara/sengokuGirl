/// <reference path="../../libs/pixi/dts/pixi.js.d.ts"/>
var game;
(function (game) {
    var ViewCore = (function () {
        function ViewCore() {
            this.mainNode = new PIXI.Container();
        }
        ViewCore.prototype.appendTo = function (parentElm) {
            parentElm.addChild(this.mainNode);
        };
        ViewCore.prototype.getNode = function () {
            return this.mainNode;
        };
        return ViewCore;
    }());
    game.ViewCore = ViewCore;
})(game || (game = {}));
