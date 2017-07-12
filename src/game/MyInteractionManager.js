/// <reference path="../../libs/pixi/dts/pixi.js.d.ts"/>
var game;
(function (game) {
    //interactionがオブジェクトの重なりを無視して発行されるので
    //こんなん作ってみる
    var MyInteractionManager = (function () {
        function MyInteractionManager() {
        }
        MyInteractionManager.addDefault = function (target) {
            MyInteractionManager.defaultTargets.push(target);
            MyInteractionManager._setInteractive([target], true);
        };
        MyInteractionManager._setInteractive = function (list, flag) {
            for (var i = 0; i < list.length; i++) {
                list[i].interactive = flag;
            }
        };
        MyInteractionManager.add = function (targets) {
            var len = MyInteractionManager.allTargets.length;
            if (len) {
                MyInteractionManager._setInteractive(MyInteractionManager.allTargets[len - 1], false);
            }
            else {
                MyInteractionManager._setInteractive(MyInteractionManager.defaultTargets, false);
            }
            MyInteractionManager.allTargets.push(targets);
            MyInteractionManager._setInteractive(targets, true);
        };
        MyInteractionManager.release = function () {
            var len = MyInteractionManager.allTargets.length;
            if (len > 1) {
                MyInteractionManager._setInteractive(MyInteractionManager.allTargets[len - 1], false);
                MyInteractionManager._setInteractive(MyInteractionManager.allTargets[len - 2], true);
                MyInteractionManager.allTargets.splice(len - 1, 1);
            }
            else if (len == 1) {
                MyInteractionManager._setInteractive(MyInteractionManager.allTargets[len - 1], false);
                MyInteractionManager._setInteractive(MyInteractionManager.defaultTargets, true);
                MyInteractionManager.allTargets = [];
            }
            else {
                MyInteractionManager._setInteractive(MyInteractionManager.defaultTargets, true);
                MyInteractionManager.allTargets = [];
            }
        };
        return MyInteractionManager;
    }());
    MyInteractionManager.allTargets = [];
    MyInteractionManager.defaultTargets = [];
    game.MyInteractionManager = MyInteractionManager;
})(game || (game = {}));
