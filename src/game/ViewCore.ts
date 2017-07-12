/// <reference path="../../libs/pixi/dts/pixi.js.d.ts"/>

module game
{
    export class ViewCore {

        public mainNode:PIXI.Container;
        constructor()
        {
            this.mainNode = new PIXI.Container();
        }
        public appendTo(parentElm:PIXI.Container):void
        {
            parentElm.addChild(this.mainNode);
        }

        public getNode(): PIXI.Container{
            return this.mainNode;
        }

    }
}