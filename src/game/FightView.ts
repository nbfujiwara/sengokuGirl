/// <reference path="../../libs/pixi/dts/pixi.js.d.ts"/>
/// <reference path="../../libs/tween.js.d.ts"/>
/// <reference path="./NumberSprite.ts"/>
/// <reference path="./EffectAttackView.ts"/>
/// <reference path="./EnemyView.ts"/>
/// <reference path="./DataObject.ts"/>

module game {
    export class FightView extends PIXI.Container{
        public mainNode:PIXI.Container;
       // private _damageNum:NumberSprite;
        private _effectView:EffectAttackView;
        private _enemyLayer:PIXI.Container;
        private _enemyViewList:EnemyView[] = [];
        private _damageNumLayer:PIXI.Container;
//        private _damageNumList:NumberSprite[] = [];
        //private _dummyEnemyHp:number;

        private _fightResult:DtoAttackFightResult;
        private _playingDamageCount;
        private _playedDamageCount;
        private _playFightCallback;
        private _enemyAttackIndex:number;

        constructor()
        {
            super();

            this.mainNode = new PIXI.Container();
            this.addChild( this.mainNode);


            let background =  PIXI.Sprite.fromFrame('stage_background.png');
            this.mainNode.addChild(background);

            this._enemyLayer = new PIXI.Container();
            this.mainNode.addChild(this._enemyLayer);
            this._enemyLayer.visible = false;


            this._effectView = new EffectAttackView();
            this.mainNode.addChild(this._effectView.getNode());

            this._damageNumLayer = new PIXI.Container();
            this.mainNode.addChild(this._damageNumLayer);
        }


        public setEnemies(_enemies:DtoBattleEnemy[]):void{
            this._clearEnemies();
            this._enemyLayer.visible = false;
            for(let i=0; i<_enemies.length; i++){
                let enemyView = new EnemyView(_enemies[i]);
                enemyView.x = _enemies[i].posX;
                enemyView.y = _enemies[i].posY;
                this._enemyViewList.push(enemyView);
                this._enemyLayer.addChild(enemyView);
/*

                var damageNum = new NumberSprite(999, 'center');
                damageNum.visible = false;
                damageNum.x = _enemies[i].posX;
                this._damageNumList.push(damageNum);
                this._damageNumLayer.addChild(damageNum);
*/

            }
        }
        public showEnemies(_onComplete):void{
            this._enemyLayer.alpha = 0;
            this._enemyLayer.visible = true;

            let tg = this._enemyLayer;
            let tween:TWEEN.Tween = new TWEEN.Tween({y:100,alpha:0})
                    .to({y:0 , alpha:1} , 800)
                    .onUpdate(function(){
                        tg.y = this.y;
                        tg.alpha = this.alpha;
                    })
                    .easing(TWEEN.Easing.Exponential.Out)
                    .onComplete(_onComplete)
                ;
            tween.start();
        }

        private _clearEnemies():void{
            let i;
            for(i=0; i<this._enemyViewList.length; i++){
                this._enemyLayer.removeChild(this._enemyViewList[i]);
                this._enemyViewList[i] = null;
            }
            this._enemyViewList = null;
            this._enemyViewList = [];
            /*
            for(i=0; i<this._damageNumList.length; i++){
                this._damageNumLayer.removeChild(this._damageNumList[i]);
                this._damageNumList[i] = null;
            }
            this._damageNumList = null;
            this._damageNumList = [];
            */
        }


        public playFight(fightResult:DtoAttackFightResult , callback){
            this._fightResult = fightResult;
            this._playFightCallback = callback;
            this._playEffect();
            this._playDamage();
        }

        private _playEffect(){
            let effectType = this._fightResult.effectType;
            if(effectType == 3){
                this._effectView.playA();
            }else if(effectType == 2){
                this._effectView.playB();
            }else{
                this._effectView.playC();
            }
        }

        private _playOneDamageNum(enemyIdx,damage,baseDelay ,callback){
            let enemyView = this._enemyViewList[enemyIdx];
            if(! enemyView){
                console.log('対象enemyViewが不明なためダメージ表示中止');
                return;
            }

            let damageNumView = new NumberSprite(damage, 'center');
            damageNumView.visible = true;
            damageNumView.alpha = 0;
            damageNumView.scale.x = 0.85;
            damageNumView.scale.y = 0.85;
            let baseX = enemyView.x + 10*Math.cos(2 * Math.PI * Math.random());
            let baseY = 180 + 10*Math.sin(2 * Math.PI * Math.random());
            let startX = baseX + 200*Math.cos(2 * Math.PI * Math.random());
            let startY = baseY + 200*Math.sin(2 * Math.PI * Math.random());
            let params = {x:startX , y:startY , alpha:0};


            let numContainer = this._damageNumLayer;
            numContainer.addChild(damageNumView);
            let damageNumTween:TWEEN.Tween = new TWEEN.Tween(params)
                    .to({x:baseX , y:baseY , alpha:1} , 200)
                    .delay(baseDelay)
                    .onUpdate(function(){
                        damageNumView.x = this.x;
                        damageNumView.y = this.y;
                        damageNumView.alpha = this.alpha;
                    })
                    .easing(TWEEN.Easing.Quartic.Out)
                ;

            damageNumTween.chain(
                new TWEEN.Tween(params)
                    .to({y:baseY+30 , alpha:0} , 90)
                    .delay(100)
                    .onUpdate(function(){
                        damageNumView.y = this.y;
                        damageNumView.alpha = this.alpha;
                    })
                    .easing(TWEEN.Easing.Linear.None)
                    .onComplete(function(){
                        numContainer.removeChild(damageNumView);
                        damageNumView = null;
                        if(callback){
                            callback();
                        }
                    })
            );

            damageNumTween.start();
        }

        private _playDamage(){
            let damageList = this._fightResult.damageList;
            this._playingDamageCount = damageList.length;
            this._playedDamageCount = 0;

            let lastHpHash = {};
            for(let i=0; i<damageList.length; i++) {
                let tgIdx = damageList[i].enemyIndex;
                lastHpHash[tgIdx] = damageList[i].restHp;

                if(i == damageList.length-1){
                    let callback2 = ()=>this._onPlayDamageComplete();

                    this._playOneDamageNum(tgIdx, damageList[i].damage, 100 + i * 100 , callback2);

                }else{
                    this._playOneDamageNum(tgIdx, damageList[i].damage, 100 + i * 100 , null);

                }


            }
            for(let eIdx in lastHpHash){
                let enemyView = this._enemyViewList[eIdx];
                if(enemyView){
                    enemyView.changeHp(lastHpHash[eIdx]);
                }
            }

        }

        private _onPlayDamageComplete(){

            for(let i=0; i<this._enemyViewList.length; i++){
                this._enemyViewList[i].decreaseTurn();
            }
            console.log('_onPlayDamageComplete');
            console.log(this._fightResult.enemyAttacks);
            if(this._fightResult.enemyAttacks.length){
                this._enemyAttackIndex = 0;
                this._playEnemyAttack();
            }else{
                this._playFightCallback();
            }
        }

        private _playEnemyAttack():void
        {
            let attack = this._fightResult.enemyAttacks[ this._enemyAttackIndex ];

            let enemyView = this._enemyViewList[attack.enemyIndex];
            enemyView.attack( ()=>this._onPlayEnemyAttackComplete() );
        }
        private _onPlayEnemyAttackComplete(){
            let attack = this._fightResult.enemyAttacks[ this._enemyAttackIndex ];
            let enemyView = this._enemyViewList[attack.enemyIndex];
            enemyView.setTurn(attack.nextTurn);

            this._enemyAttackIndex ++;
            if(this._enemyAttackIndex >= this._fightResult.enemyAttacks.length){
                this._playFightCallback();
            }else{
                this._playEnemyAttack();
            }


        }


    }
}