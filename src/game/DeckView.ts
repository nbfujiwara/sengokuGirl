/// <reference path="../../libs/pixi/dts/pixi.js.d.ts"/>
/// <reference path="../../libs/tween.js.d.ts"/>
/// <reference path="./GaugeView.ts"/>
/// <reference path="./MyInteractionManager.ts"/>
/// <reference path="./DataObject.ts"/>

module game
{
    export class DeckView extends PIXI.Container{
        public mainNode:PIXI.Container;
        private _hpGauge:GaugeView;
        private _clickCallback;

        constructor(cards:DtoBattleCard[] , maxHp:number , nowHp:number)
        {
            super();

            this.mainNode = new PIXI.Container();
            this.addChild( this.mainNode);



            for(let i=0; i<cards.length; i++){
                let charaImage = PIXI.Sprite.fromFrame(cards[i].assetId);
                charaImage.x = i * (640/5);
                this.mainNode.addChild(charaImage);

                MyInteractionManager.addDefault(charaImage);

                let onTap = (function(_func ,a){
                    return function(){_func(a);}
                })( (charaIdx)=>this._onClickCharacter(charaIdx) , i);

//                charaImage.on('click' , onTap);
                charaImage.on('mouseup' , onTap).on('touchend' , onTap);

            }

            let hpGauge = new GaugeView('large' , nowHp , maxHp);
            hpGauge.y = 180 - 24;
            hpGauge.x = 10;

            this.mainNode.addChild(hpGauge);
            this._hpGauge = hpGauge;
        }

        public playDamage(damage,restHp){


            let image = this.mainNode;
            let shakeTween:TWEEN.Tween = new TWEEN.Tween({dummy:0 ,offset:30, target:this.mainNode })
                    .to({dummy:1} , 600)
                    .onUpdate(function(){
                        image.x = Math.floor((Math.random() - 0.5) * this.offset);
                        image.y = Math.floor((Math.random() - 0.5) * this.offset);
                    })
                ;


            let hpGage = this._hpGauge;
            shakeTween.onComplete(function(){
                image.x = 0;
                image.y = 0;
                hpGage.setValueAnimate(restHp);
            });
            shakeTween.start();

        }

        public setClickCharacterCallback(func):void{
            this._clickCallback = func;
        }
        private _onClickCharacter(charaIdx:number):void{
            if(this._clickCallback){
                this._clickCallback(charaIdx);
            }
        }


    }
}