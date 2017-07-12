/// <reference path="../../libs/pixi/dts/pixi.js.d.ts"/>
/// <reference path="../../libs/tween.js.d.ts"/>

module game {
    export class GaugeView extends PIXI.Container{
        public mainNode:PIXI.Container;
        private _maxValue:number;
        private _nowValue:number;
        private _barSprite:PIXI.Sprite;
        private _barWidth:number;
        constructor(type:string='middle' , nowValue:number=1, maxValue:number=1)
        {
            super();

            this.mainNode = new PIXI.Container();

            let borderAssetName = 'gauge_border_m.png';
            let barWidth = 300 - 2*4;
            if(type == 'large'){
                borderAssetName = 'gauge_border_l.png';
                barWidth = 620 - 2*4;
            }else if(type == 'small'){
                borderAssetName = 'gauge_border_s.png';
                barWidth = 150 - 2*4;
            }

            let borderSprite = PIXI.Sprite.fromFrame(borderAssetName);
            let barSprite = PIXI.Sprite.fromFrame('gauge_red.png');
            let backgroundSprite = PIXI.Sprite.fromFrame('black.png');

            //barSprite.width = barWidth;
            //barSprite.height = 16;
            barSprite.x = 4;
            barSprite.y = 4;

            backgroundSprite.width = barWidth;
            backgroundSprite.height = 16;
            backgroundSprite.x = 4;
            backgroundSprite.y = 4;

            this._barSprite = barSprite;
            this._maxValue = maxValue;
            this._nowValue = nowValue;
            this._barWidth = barWidth;

            this.setValue(nowValue);

            this.mainNode.addChild(backgroundSprite);
            this.mainNode.addChild(barSprite);
            this.mainNode.addChild(borderSprite);

            this.addChild(this.mainNode);

        }


        public setValue(value:number){
            this._nowValue = value;
            this._barSprite.width = this._barWidth * value / this._maxValue;

        }

        public setValueAnimate(value:number){
            let fromVal = this._barWidth * this._nowValue / this._maxValue;
            let toVal = this._barWidth * value / this._maxValue;

            if(toVal < 0){
                toVal = 0;
            }

            this._nowValue = value;
            let target = this._barSprite;
            let tween:TWEEN.Tween = new TWEEN.Tween({width:fromVal})
                    .to({width:toVal } , 500)
                    .onUpdate(function(){
                        target.width  = this.width;
                    })
                    .easing(TWEEN.Easing.Quadratic.Out)
                ;
            tween.start();

        }



    }
}