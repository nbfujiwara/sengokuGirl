/// <reference path="../../libs/pixi/dts/pixi.js.d.ts"/>
/// <reference path="../../libs/tween.js.d.ts"/>
/// <reference path="./GaugeView.ts"/>
/// <reference path="./DataObject.ts"/>

module game
{
    export class EnemyView extends PIXI.Container{
        public mainNode:PIXI.Container;
        private _enemyImage;
        private _hpGauge:GaugeView;
        private _turnText:PIXI.Text;
        private _nowTurn:number;
        constructor(enemyData:DtoBattleEnemy)
        {
            super();

            this._enemyImage =  PIXI.Sprite.fromFrame(enemyData.assetId);
            this.addChild(this._enemyImage);

            this._enemyImage.anchor.x = 0.5;

            let gaugeType = 'middle';
            let gaugePosX = - 300/2;
            if(enemyData.size == DtoBattleEnemy.SIZE_SMALL) {
                gaugeType = 'small';
                gaugePosX = - 150/2;
            }else if(enemyData.size == DtoBattleEnemy.SIZE_MIDDLE){
                gaugeType = 'middle';
                gaugePosX = - 300/2;
            }else if(enemyData.size == DtoBattleEnemy.SIZE_LARGE){
                gaugeType = 'large';
                gaugePosX = - 620/2;
            }

            this._hpGauge = new GaugeView(gaugeType, enemyData.hp , enemyData.maxHp);
            this._hpGauge.scale.y = 0.7;
            this._hpGauge.x = gaugePosX;
            this._hpGauge.y = 280;
            this.addChild(this._hpGauge);


            let turnCaption = new PIXI.Text('ターン', {
                font:'bold 20px "ヒラギノ角ゴ Pro W3",Meiryo'
                ,fill:'#ffffff'
                ,align:'right'
                ,stroke:'#000000'
                ,strokeThickness:5
            });

            turnCaption.anchor.x = 1;
            turnCaption.y = 50;
            this.addChild(turnCaption);



            let turnText = new PIXI.Text(enemyData.turn.toString(), {
                font:'bold 30px "ヒラギノ角ゴ Pro W3",Meiryo'
                ,fill:'#ff0000'
                ,align:'left'
                ,stroke:'#ffff00'
                ,strokeThickness:8
            });
            turnText.x = 5;
            turnText.y = 45;
            this.addChild(turnText);

            this._turnText = turnText;
            this._nowTurn = enemyData.turn;
        }

        public decreaseTurn():void{
            this._nowTurn --;
            this._turnText.text = this._nowTurn.toString();
        }
        public setTurn(turn:number):void{
            this._nowTurn = turn;
            this._turnText.text = this._nowTurn.toString();
        }

        public changeHp(restHp:number){
            this._hpGauge.setValueAnimate(restHp);

            let image = this._enemyImage;
            let gauge = this._hpGauge;

            let shakeTween:TWEEN.Tween = new TWEEN.Tween({dummy:0 ,offset:30, target:this._enemyImage })
                    .to({dummy:1} , 600)
                    .onUpdate(function(){
                        image.x = Math.floor((Math.random() - 0.5) * this.offset);
                        image.y = Math.floor((Math.random() - 0.5) * this.offset);
                    })
                ;

            let mainNode = this;

            if(restHp <= 0){
                shakeTween.chain(
                    new TWEEN.Tween({alpha:1 })
                        .to({alpha:0} , 500)
                        .onUpdate(function(){
                            mainNode = this.alpha;
                        })
                );
            }

            shakeTween.onComplete(function(){
                image.x = 0;
                image.y = 0;
            });
            shakeTween.start();
        }


        public attack(callback):void{

            let tg = this._enemyImage;
            let onUpdateFunc = function(){
                tg.y = this.y;
            };

            let params = {y:0};
            new TWEEN.Tween(params).to({y:-50} , 100).onUpdate(onUpdateFunc).easing(TWEEN.Easing.Quadratic.Out).chain(
                new TWEEN.Tween(params).to({y:0} , 100).onUpdate(onUpdateFunc).easing(TWEEN.Easing.Quadratic.In).chain(
                    new TWEEN.Tween(params).to({y:-50} , 100).onUpdate(onUpdateFunc).easing(TWEEN.Easing.Quadratic.Out).chain(
                        new TWEEN.Tween(params).to({y:0} , 100).onUpdate(onUpdateFunc).easing(TWEEN.Easing.Quadratic.In).onComplete(callback)
                    )
                )
            ).start();
/*
            var tg = this._enemyImage;
            var onUpdateFunc = function(){
                tg.scale.x = this.dummy;
            };
            new TWEEN.Tween({dummy:0})
                .to({dummy:1} , 2000)
                .onUpdate(onUpdateFunc)
                .onComplete(callback).start();

 */
        }


    }
}