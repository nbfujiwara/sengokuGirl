/// <reference path="../../libs/pixi/dts/pixi.js.d.ts"/>
/// <reference path="../../libs/tween.js.d.ts"/>
/// <reference path="./NumberSprite.ts"/>
/// <reference path="./EffectAttackView.ts"/>
/// <reference path="./EnemyView.ts"/>

module game {
    export class PopupViewCore extends PIXI.Container{
        public mainNode:PIXI.Container;
        constructor()
        {
            super();

            let background = new PIXI.Graphics();
            background.beginFill(0x000000);
            background.drawRect(0, 0, 640, 920);
            background.endFill();
            background.alpha = 0.5;
            this.addChild( background);

            this.mainNode = new PIXI.Container();
            this.addChild( this.mainNode);

            this.visible = false;
        }


        public show():void
        {
            this.visible = true;
            this.alpha = 0;

            let target = this;
            let tween:TWEEN.Tween = new TWEEN.Tween({x:-640,alpha:0})
                    .to({x:0 , alpha:1} , 200)
                    .onUpdate(function(){
                        target.x = this.x;
                        target.alpha = this.alpha;
                    })
                    .easing(TWEEN.Easing.Quartic.Out)
                ;
            tween.start();
        }


        public hide():void
        {
            this.visible = false;
        }





    }
}