/// <reference path="../../libs/pixi/dts/pixi.js.d.ts"/>

module game
{
    //interactionがオブジェクトの重なりを無視して発行されるので
    //こんなん作ってみる
    export class MyInteractionManager {

        private static allTargets = [];
        private static defaultTargets:PIXI.DisplayObject[] = [];

        public static addDefault(target:PIXI.DisplayObject){
            MyInteractionManager.defaultTargets.push(target);
            MyInteractionManager._setInteractive([target] , true);
        }

        private static _setInteractive(list:PIXI.DisplayObject[] , flag:boolean){
            for(let i=0; i<list.length; i++){
                list[i].interactive = flag;
            }
        }

        public static add(targets:PIXI.DisplayObject[]){

            let len = MyInteractionManager.allTargets.length;
            if(len){
                MyInteractionManager._setInteractive(MyInteractionManager.allTargets[len-1] , false);
            }else{
                MyInteractionManager._setInteractive(MyInteractionManager.defaultTargets , false);
            }
            MyInteractionManager.allTargets.push(targets);
            MyInteractionManager._setInteractive(targets , true);
        }

        public static release(){
            let len = MyInteractionManager.allTargets.length;
            if(len > 1) {
                MyInteractionManager._setInteractive(MyInteractionManager.allTargets[len-1] , false);
                MyInteractionManager._setInteractive(MyInteractionManager.allTargets[len-2], true);
                MyInteractionManager.allTargets.splice(len-1  , 1);
            }else if(len == 1){
                MyInteractionManager._setInteractive(MyInteractionManager.allTargets[len-1] , false);
                MyInteractionManager._setInteractive(MyInteractionManager.defaultTargets, true);
                MyInteractionManager.allTargets = [];
            }else{
                MyInteractionManager._setInteractive(MyInteractionManager.defaultTargets, true);
                MyInteractionManager.allTargets = [];
            }
        }
    }


}

