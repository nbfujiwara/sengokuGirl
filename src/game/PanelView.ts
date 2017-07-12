/// <reference path="../../libs/pixi/dts/pixi.js.d.ts"/>
/// <reference path="../../libs/tween.js.d.ts"/>

/// <reference path="./ViewCore.ts"/>
/// <reference path="./GameLogic.ts"/>

module game
{
    export class PanelView extends ViewCore{
        private _upperSprite;
        private _downerSprite;
        private _upperLayer;
        private _downerLayer;
        private _upperHeart;
        private _downerHeart;
        private _bothContainer:PIXI.Container;
        private _panelData:DtoPanel;

        constructor(panelData:DtoPanel)
        {
            super();

            this._bothContainer = new PIXI.Container();
            this.mainNode.addChild(this._bothContainer);
            this._bothContainer.x = 100/2;
            this._bothContainer.y = 100/2;


            this._upperLayer = new PIXI.Container();
            this._downerLayer = new PIXI.Container();

            this._bothContainer.addChild(this._downerLayer);
            this._bothContainer.addChild(this._upperLayer);

            this._panelData = panelData;

            this._upperSprite = this._createPanelImageSprite('p' + this._panelData.id + '_0.png');
            this._downerSprite = this._createPanelImageSprite('p' + this._panelData.id + '_1.png');

            this._upperLayer.addChild(this._upperSprite);
            this._downerLayer.addChild(this._downerSprite);

            this._layerCommonSetting(this._upperLayer);
            this._layerCommonSetting(this._downerLayer);

            this._upperLayer.visible = ! this._panelData.reverse;
            this._downerLayer.visible = this._panelData.reverse;


            this._upperHeart = this._createHeartImageSprite();
            this._downerHeart = this._createHeartImageSprite();
            this._upperLayer.addChild(this._upperHeart);
            this._downerLayer.addChild(this._downerHeart);
        }

        private _layerCommonSetting(layer:PIXI.Container){
            //layer.x = 100/2;
            //layer.y = 100/2;
            //layer.rotation = 45;
            layer.visible = false;
        }

        private _createHeartImageSprite(){
            let sprite = PIXI.Sprite.fromFrame('p_heart.png');
            sprite.x = 15;
            sprite.y = 15;
            sprite.visible = this._panelData.heal;
            return sprite;
        }
        private _createPanelImageSprite(assetName){
            let sprite = PIXI.Sprite.fromFrame(assetName);
            /*
            sprite.anchor.x = 0.5;
            sprite.anchor.y = 0.5;
            sprite.x = 100/2;
            sprite.y = 100/2;
            */
            sprite.x = -100/2;
            sprite.y = -100/2;
            return sprite;

        }


        private _getUpperAssetName(){
            let assetName = 'p' + this._panelData.id;
            if(this._panelData.reverse){
                assetName += '_1.png';
            }else{
                assetName += '_0.png';
            }
            return assetName;
        }
        private _getDownerAssetName(){
            let assetName = 'p' + this._panelData.id;
            if(this._panelData.reverse){
                assetName += '_0.png';
            }else{
                assetName += '_1.png';
            }
            return assetName;
        }

        public reverse(){
            let nowSide = this._upperLayer;
            let nextSide = this._downerLayer;
            if(this._downerLayer.visible){
                nowSide = this._downerLayer;
                nextSide = this._upperLayer;
            }

            let params = {scale:1};
            let tween:TWEEN.Tween = new TWEEN.Tween(params)
                .to({scale:0} , 90)
                .onUpdate(function(){
                        nowSide.scale.y = this.scale;
                    })
                .easing(TWEEN.Easing.Quadratic.Out)
                .onComplete(function(){
                        nowSide.visible = false;
                        nextSide.visible = true;
                    })
                ;

            tween.chain(
                new TWEEN.Tween(params)
                .to({scale:1} , 90)
                .onUpdate(function(){
                        nextSide.scale.y = this.scale;
                })
                .easing(TWEEN.Easing.Quadratic.In)
            );
            tween.start();
        }


        public change(){
            let upper = this._upperLayer;
            let downer = this._downerLayer;

            let target = this._bothContainer;
            let scaleUpdateFunc = function(){
                target.scale.x = this.scale;
                target.scale.y = this.scale;

//                upper.rotation = downer.rotation = this.rotation;
            };

            let tween:TWEEN.Tween = new TWEEN.Tween({scale:1,rotation:45})
                    .to({scale:0,rotation:45+360} , 300)
                    .onUpdate(scaleUpdateFunc)
                    .easing(TWEEN.Easing.Quadratic.Out)
                    .onComplete(()=>this._changeImage())
                ;
            tween.chain(
                new TWEEN.Tween({scale:0,rotation:45+360})
                    .to({scale:1,rotation:45} , 300)
                    .onUpdate(scaleUpdateFunc)
                    .easing(TWEEN.Easing.Quadratic.In)
            );
            tween.start();
        }
        private _changeImage(){
            this._upperLayer.removeChild(this._upperSprite);
            this._downerLayer.removeChild(this._downerSprite);
            this._upperSprite = null;
            this._downerSprite = null;

            this._upperSprite = this._createPanelImageSprite('p' + this._panelData.id + '_0.png');
            this._downerSprite = this._createPanelImageSprite('p' + this._panelData.id + '_1.png');
            this._upperLayer.addChild(this._upperSprite);
            this._downerLayer.addChild(this._downerSprite);
            this._upperLayer.visible = ! this._panelData.reverse;
            this._downerLayer.visible = this._panelData.reverse;


            this._upperLayer.removeChild(this._upperHeart);
            this._downerLayer.removeChild(this._downerHeart);
            this._upperHeart = null;
            this._downerHeart = null;
            this._upperHeart = this._createHeartImageSprite();
            this._downerHeart = this._createHeartImageSprite();
            this._upperLayer.addChild(this._upperHeart);
            this._downerLayer.addChild(this._downerHeart);


        }


        public chain(callback,delay=0){
            let fromY = this.mainNode.y;
            let toY = fromY - 150;
            let target = this.mainNode;
            let tween:TWEEN.Tween = new TWEEN.Tween({y:fromY , alpha:1})
                    .to({y:toY, alpha:0} , 500)
                    .onUpdate(function(){
                        target.y = this.y;
                        target.alpha = this.alpha;
                    })
                    .delay(delay)
                    .easing(TWEEN.Easing.Quartic.In)
//                    .onComplete(callback)
                ;
            tween.start();

            //callbackを早めに発行させてみる
            let tween2:TWEEN.Tween = new TWEEN.Tween({dummy:0})
                    .to({dummy:1} , 200)
                    .delay(delay)
                    .onComplete(callback)
                ;
            tween2.start();


        }


    }
}