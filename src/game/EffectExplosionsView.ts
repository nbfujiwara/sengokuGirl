/// <reference path="../../libs/pixi/dts/pixi.js.d.ts"/>
/// <reference path="../../libs/tween.js.d.ts"/>
module game {
    export class EffectExplosionsView {
        public mainNode:PIXI.Container;
        private _pool;
        constructor()
        {
            this.mainNode = new PIXI.Container();

            this._pool = [];


            //事前にN個poolしておいてみる
            for(let i=0; i<5; i++){
                let newMc:PIXI.extras.MovieClip = this._createMovieClip();
                this._pool.push(newMc);
            }
        }


        public play(point:PIXI.Point , delay:number , chainIdx:number){
            if(chainIdx == 0){
                return;
            }
            let scale = 1.5;
            if(chainIdx <= 10){
                scale = 0.5 + (chainIdx) / 10;
            }

            new TWEEN.Tween({dummy:0})
                .to({dummy:1} , delay)
                .onComplete(
                (function(_func ,arg1,arg2){
                    return function(){_func(arg1,arg2);}
                    })( (point , scale)=>this._playExecute(point, scale) , point , scale) )
                .start();
        }

        private _playExecute(point:PIXI.Point , scale):void{

            let mcIdx = this._getTargetMovieClipIndex();
            let tgMc = this._pool[mcIdx];

            tgMc.x = point.x;
            tgMc.y = point.y;
            tgMc.visible = true;
            tgMc.scale.x = scale;
            tgMc.scale.y = scale;

            tgMc.onComplete = (function(_func ,arg1){
                return function(){_func(arg1);}
            })( (tgIdx)=>this._onPlayComplete(tgIdx) , mcIdx);
            tgMc.play();
        }
        private _onPlayComplete(mcIdx){
            let tgMc = this._pool[mcIdx];
            tgMc.visible = false;
            tgMc.gotoAndStop(0);
        }



        private _getTargetMovieClipIndex():number{
            for(let i=0; i<this._pool.length; i++){
                let mc:PIXI.extras.MovieClip = this._pool[i];
                if(! mc.playing){
                    return i;
                }
            }
            console.log('poolが足りなくなったので追加する' + this._pool.length);
            let newMc:PIXI.extras.MovieClip = this._createMovieClip();
            this._pool.push(newMc);
            return (this._pool.length - 1);
        }





        private _createMovieClip(){
            let animateTextures:PIXI.Texture[] = [];
            for(let num=0; num<=29; num++){
                animateTextures.push( PIXI.Texture.fromFrame('effect_explosion_' + num + '.png') );
            }

            let animationMc:PIXI.extras.MovieClip = new PIXI.extras.MovieClip(animateTextures);
            animationMc.visible = false;
            animationMc.loop = false;
//            animationMc.onComplete = ()=>this._onPlayComplete();

            animationMc.anchor.x = 0.5;
            animationMc.anchor.y = 0.5;
            this.mainNode.addChild(animationMc);

            return animationMc;
        }


        public getNode(): PIXI.Container{
            return this.mainNode;
        }
    }
}