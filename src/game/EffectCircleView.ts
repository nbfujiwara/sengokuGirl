/// <reference path="../../libs/pixi/dts/pixi.js.d.ts"/>

module game {
    export class EffectCircleView {
        public mainNode:PIXI.Container;

        private _animationMc:PIXI.extras.MovieClip;
        constructor()
        {
            this.mainNode = new PIXI.Container();

            let animateTextures:PIXI.Texture[] = [];
            for(let num=0; num<=18; num++){
                animateTextures.push( PIXI.Texture.fromFrame('effect_circle_' + num + '.png') );
                animateTextures.push( PIXI.Texture.fromFrame('effect_circle_' + num + '.png') );//fpsをわざと遅らせるために無理やり増やしてみる
                animateTextures.push( PIXI.Texture.fromFrame('effect_circle_' + num + '.png') );//fpsをわざと遅らせるために無理やり増やしてみる
            }

            let animationMc:PIXI.extras.MovieClip = new PIXI.extras.MovieClip(animateTextures);
            animationMc.visible = false;
            animationMc.loop = false;
            animationMc.onComplete = ()=>this._onPlayComplete();

            animationMc.anchor.x = 0.5;
            animationMc.anchor.y = 0.55;
            //animationMc.scale.x = 1.5;
            //animationMc.scale.y = 1.5;
            this.mainNode.addChild(animationMc);

            this._animationMc = animationMc;
        }


        public play(point:PIXI.Point):void{

            this._animationMc.x = point.x;
            this._animationMc.y = point.y;
            this._animationMc.visible = true;
            this._animationMc.play();
        }
        private _onPlayComplete(){
            this._animationMc.visible = false;
            this._animationMc.gotoAndStop(0);
        }


        public getNode(): PIXI.Container{
            return this.mainNode;
        }
    }
}