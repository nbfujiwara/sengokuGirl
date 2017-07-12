/// <reference path="../../libs/pixi/dts/pixi.js.d.ts"/>

module game {
    export class EffectAttackView {
        public mainNode:PIXI.Container;

        private _mcTypeA:PIXI.extras.MovieClip;
        private _mcTypeB:PIXI.extras.MovieClip;
        private _mcTypeC:PIXI.extras.MovieClip;
        private _isPlaying:boolean = false;
        private _playingTarget;

        constructor()
        {
            this.mainNode = new PIXI.Container();

            this._mcTypeA = this._createAnimateMc('effect_atk_a_' , 19);
            this._mcTypeB = this._createAnimateMc('effect_atk_b_' , 19);
            this._mcTypeC = this._createAnimateMc('effect_atk_c_' , 19);
        }


        private _createAnimateMc(prefix ,maxNum):PIXI.extras.MovieClip{
            let textures = this._getAnimateTextures(prefix , maxNum);
            let animationMc:PIXI.extras.MovieClip = new PIXI.extras.MovieClip(textures);

            animationMc.visible = false;
            animationMc.loop = false;
            animationMc.anchor.x = 0.5;
            animationMc.anchor.y = 0.5;
            animationMc.scale.x = 2;
            animationMc.scale.y = 2;

            animationMc.x = 320;
            animationMc.y = 160;
            animationMc.onComplete = ()=>this._onPlayComplete();

            this.mainNode.addChild(animationMc);

            return animationMc;
        }

        private _getAnimateTextures(prefix ,maxNum){
            let animateTextures:PIXI.Texture[] = [];
            for(let num=0; num<=maxNum; num++){
                animateTextures.push( PIXI.Texture.fromFrame(prefix + num + '.png') );
                animateTextures.push( PIXI.Texture.fromFrame(prefix + num + '.png') );
            }
            return animateTextures;
        }


        public playA():void{
            if(this._isPlaying) return;
            this._playingTarget = this._mcTypeA;
            this._play();
        }
        public playB():void{
            if(this._isPlaying) return;
            this._playingTarget = this._mcTypeB;
            this._play();
        }
        public playC():void{
            if(this._isPlaying) return;
            this._playingTarget = this._mcTypeC;
            this._play();
        }

        private _play():void{
            this._isPlaying = true;
            this._playingTarget.visible = true;
            this._playingTarget.play();
        }
        private _onPlayComplete(){
            this._playingTarget.visible = false;
            this._playingTarget.gotoAndStop(0);
            this._isPlaying = false;
        }


        public getNode(): PIXI.Container{
            return this.mainNode;
        }
    }
}