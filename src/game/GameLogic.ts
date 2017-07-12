/// <reference path="./DataObject.ts"/>

module game
{





    class GameFightLogic {
        private _enemies:DtoBattleEnemy[] = [];
        private _cards:DtoBattleCard[] = [];
        private _playerHp:number;
        private _playerMaxHp:number;
        private _lastAttackEnemyIndex = 0;

        public setCards(_cards):void{
            this._cards = _cards;
            this._playerHp = 0;
            this._playerMaxHp = 0;
            for(let i=0; i<this._cards.length; i++){
                this._playerHp += this._cards[i].maxHp;
                this._playerMaxHp += this._cards[i].maxHp;
            }
        }
        public startBattle(_enemies):void{
            this._enemies = _enemies;
        }
        public getPlayerHp():number{
            return this._playerHp;
        }
        public getPlayerMaxHp():number{
            return this._playerMaxHp;
        }



        public attack(panelData:DtoPanel , chainCount:number):DtoAttackFightResult{

            let effectType;
            if(chainCount <= 3){
                effectType = 1;
            }else if(chainCount <= 6){
                effectType = 2;
            }else{
                effectType = 3;
            }

/*
            var damageAllHash = {};
            var i;
            for(i=0; i<this._cards.length; i++){
                var atkCard = this._cards[i];
                if(! this._isEnableAttack(atkCard.attributes , panelData)){
                    continue;
                }

                var eIdx = this._getAttackTargetEnemyIndex();
                this._lastAttackEnemyIndex = eIdx;
                //console.log('enemy index =' + eIdx);
                var damage = this._calculateDamage( this._enemies[eIdx] , this._cards[i] , chainCount );
                this._enemies[eIdx].hp -= damage;

                if(! damageAllHash.hasOwnProperty(eIdx.toString())){
                    damageAllHash[eIdx] = 0;
                }
                damageAllHash[eIdx] += damage;
            }

            var enemyAttacks = this._defense();

            var damageList = [];
            for(var idx in damageAllHash){
                damageList.push(new DtoAttackFightDamageRow({
                    enemyIndex:idx,
                    damage:damageAllHash[idx],
                    restHp:this._enemies[idx].hp
                }));
            }
*/
            let damageList = [];
            let i;
            for(i=0; i<this._cards.length; i++){
                let atkCard = this._cards[i];
                if(! this._isEnableAttack(atkCard.attributes , panelData)){
                    continue;
                }

                let eIdx = this._getAttackTargetEnemyIndex();
                this._lastAttackEnemyIndex = eIdx;
                //console.log('enemy index =' + eIdx);
                let damage = this._calculateDamage( this._enemies[eIdx] , this._cards[i] , chainCount );
                this._enemies[eIdx].hp -= damage;

                damageList.push(new DtoAttackFightDamageRow({
                    enemyIndex:eIdx,
                    damage:damage,
                    restHp:this._enemies[eIdx].hp
                }));
            }

            let enemyAttacks = this._defense();


            let result = new DtoAttackFightResult();
            result.damageList = damageList;
            result.effectType = effectType;
            result.enemyAttacks = enemyAttacks;
            if(! this._getRemainEnemyIdxList().length){
                result.isDestroy = true;
            }
            return result;
        }

        private _defense():DtoAttackFightEnemyAttackRow[]{
            let enemyAttackList:DtoAttackFightEnemyAttackRow[] = [];
            for(let i=0; i<this._enemies.length; i++){
                this._enemies[i].turn --;

                if(this._enemies[i].hp <= 0) {
                    continue;
                }
                if(this._enemies[i].turn > 0){
                    continue;
                }

                this._enemies[i].turn = this._enemies[i].maxTurn;

                let playerDamage = this._enemies[i].attack;

                this._playerHp -= playerDamage;

                enemyAttackList.push(new DtoAttackFightEnemyAttackRow({
                    enemyIndex:i,
                    damage:playerDamage,
                    restHp:this._playerHp,
                    nextTurn:this._enemies[i].maxTurn
                }));
            }
            return enemyAttackList;
        }


        private _calculateDamage(enemy:DtoBattleEnemy , card:DtoBattleCard , chainCount:number){
            let chainRate = 1 + (chainCount - 1) * 0.52;
            let damage = Math.floor(card.attack * chainRate - enemy.defense);
            if(damage < 1){
                damage = 1;
            }
            return damage;
        }


        private _getRemainEnemyIdxList():number[]{
            let list = [];
            for(let i=0; i<this._enemies.length; i++){
                if(this._enemies[i].hp > 0){
                    list.push(i);
                }
            }
            return list;
        }
        private _getAttackTargetEnemyIndex():number{
            let remainIndexList = this._getRemainEnemyIdxList();
            if(remainIndexList.length){
                let randomNo = Math.floor(Math.random() * remainIndexList.length);
                return remainIndexList[randomNo];
            }
            //既に全員殺したので、死んでる奴にさらにダメージ加算
            //return  Math.floor(Math.random() * this._enemies.length);
            //最後にコロシタやつにする（↑だと最初一人殺してしばらくして二人目殺したときに一人目を指定しえるので）
            return  this._lastAttackEnemyIndex;
        }


        private _isEnableAttack(attributes:number[] , panelData:DtoPanel){
            let panelAttributeId = (panelData.id * 2) - 1;
            if(panelData.reverse){
                panelAttributeId ++;
            }
            for(let i=0; i<attributes.length; i++){
                if(attributes[i] == panelAttributeId){
                    return true;
                }
            }
            return false;
        }





    }

    export class GameLogic {
        public ROW_CNT = 4;
        public COL_CNT = 6;
        private _panels:DtoPanel[][];
        private _panelIdList = [1,2];
        private _checkedHash = {};

        private _invokePuzzleSkillId = null;

        private _allEnemies:DtoBattleEnemy[][] = [];
        private _cards:DtoBattleCard[] = [];

        private _battleIndex:number;

        private _fightLogic:GameFightLogic;


        constructor(){
            this._fightLogic = new GameFightLogic();
        }

        public setAllEnemies(allEnemies:DtoBattleEnemy[][]):void{
            this._allEnemies = allEnemies;
        }
        public setDeckCards(cards:DtoBattleCard[]):void{
            this._cards = cards;
            this._fightLogic.setCards(cards);
        }

        public startStage():void{
            this._battleIndex = 0;
            this._fightLogic.startBattle( this.getNowBattleEnemies() );
            this._refreshPanel();
        }

        public getNowBattleEnemies():DtoBattleEnemy[]{
            return this._allEnemies[ this._battleIndex ];
        }
        public getDeckCards():DtoBattleCard[]{
            return this._cards;
        }

        public getPlayerHp():number{
            return this._fightLogic.getPlayerHp();
        }
        public getPlayerMaxHp():number{
            return this._fightLogic.getPlayerMaxHp();
        }

        private  _refreshPanel(){
            this._panels = [];

            for(let row=0; row<this.ROW_CNT; row++){
                let list = [];
                for(let col=0; col<this.COL_CNT; col++){
                    list.push( this._getRandomPanel() );
                }
                this._panels.push(list);
            }
        }
        public getAllPanels(){
            return this._panels;
        }

        private _getRandomPanel():DtoPanel{
            let randNum = Math.floor(Math.random() * this._panelIdList.length);
            let randomId = this._panelIdList[ randNum ];
            return new DtoPanel(randomId , (Math.random() >= 0.5) , (Math.random() >= 0.8));
//            return new DtoPanel(randomId , false);
        }

        public attack(row , col , dragList=[]){

            console.log('drag count=' + dragList.length );

            let reverseList = this._getReverseList(row , col ,dragList);
            for(let i=0; i<reverseList.length; i++){
                this._panels[ reverseList[i].row ][ reverseList[i].col ].reverse = ! this._panels[ reverseList[i].row ][ reverseList[i].col ].reverse;
            }


            this._checkedHash = {};
            let chainList = [{row:row , col:col}] ;
            chainList = this._getChainList(row , col , this._panels[ row ][ col ] , chainList );

            let shiftList = this._getShiftList(chainList);

            let fightResult = this._fightLogic.attack(this._panels[ row ][ col ] , chainList.length);


            this._invokePuzzleSkillId = null;

            let result = new DtoAttackResult();
            result.reverseList = reverseList;
            result.chainList = chainList;
            result.shiftList = shiftList;
            result.fightResult = fightResult;

            if(fightResult.isDestroy){
                this._battleIndex ++;
                if(this._battleIndex >= this._allEnemies.length){
                    result.isClear = true;
                }else{
                    this._fightLogic.startBattle( this.getNowBattleEnemies() );
                    result.isNextBattle = true;
                }
            }


            return result;
        }

        private _getReverseList(row , col , dragList){
            let ret = [];
            let i;
            if(this._invokePuzzleSkillId == 2) {
                //ドラッグで複数のパネルを\nターゲットパネルに\n指定できるようにする\n(攻撃起点は最初のパネル)
                ret = this._getReverseListMulti(dragList);
            }else if(this._invokePuzzleSkillId == 3){
                //ターゲットパネルの\n縦1列横1列を反転対象にする
                for(i=0; i<this.ROW_CNT; i++) {
                    if(i != row) {
                        ret.push({row:i , col:col});
                    }
                }
                for(i=0; i<this.COL_CNT; i++) {
                    if(i != col) {
                        ret.push({row:row , col:i});
                    }
                }
            }else if(this._invokePuzzleSkillId == 4){
                //ターゲットパネルの周囲を\n反転させずに攻撃を開始する
                ret = [];
            }else{
                ret = this._getAround(row, col);
            }
            return ret;
        }

        private _getReverseListMulti(dragList){
            let i;
            let ret = [];
            this._checkedHash = {};
            //dragListを対象から外すためにチェック済にいれる
            for(i=0; i<dragList.length; i++){
                this._checkPanelHash(dragList[i].row , dragList[i].col);
            }


            for(i=0; i<dragList.length; i++){
                let aroundList =  this._getAround(dragList[i].row , dragList[i].col);
                for(let k=0; k<aroundList.length; k++){
                    if(this._checkPanelHash(aroundList[k].row , aroundList[k].col)) {
                        ret.push(aroundList[k]);
                    }
                }
            }
            return ret;

        }



        private _getShiftList(chainList){
            let i;

            let ret = [];
            for(let row=0; row<this.ROW_CNT; row++){
                let attackCols = [];
                for(i=0; i<chainList.length; i++){
                    if(chainList[i].row == row){
                        attackCols.push( chainList[i].col);
                    }
                }
                //降順数値並び替え
                attackCols.sort(function(a,b){return b-a;} );

                let shiftCount = attackCols.length;


                //攻撃で消えたことによりshiftして移動するものたち
                for(let col=0; col<this.COL_CNT; col++){
                    let beforeBreakCount = 0;
                    let isBreakTarget = false;
                    for(i=0; i<shiftCount; i++) {
                        if(attackCols[i] == col ){
                            isBreakTarget = true;
                            break;
                        }
                        if(attackCols[i] < col ){
                            beforeBreakCount ++;
                        }
                    }
                    if(! isBreakTarget && (beforeBreakCount > 0)){
                        ret.push({
                            type:'move'
                            ,row:row
                            ,col:(col - beforeBreakCount)
                            ,fromRow:row
                            ,fromCol:col
                            ,shiftCount:beforeBreakCount
                            ,panelData:null
                        });
                    }
                }


                //攻撃で消えるものを実際に削除
                for(i=0; i<shiftCount; i++) {
                    this._panels[row].splice( attackCols[i] , 1  );
                }


                //消えた分だけ末尾にランダムで追加
                while( this._panels[row].length < this.COL_CNT){
                    let addPanel = this._getRandomPanel();
                    let pushCol = this._panels[row].length;

                    this._panels[row].push( addPanel );
                    ret.push({
                        type:'create'
                        ,row:row
                        ,col:pushCol
                        ,shiftCount:shiftCount
                        ,panelData:addPanel
                    });
                }

            }

            return ret;
        }


        private _getChainList(row,col,panelData:DtoPanel,chainList){
            let aroundList = this._getAround(row , col);
            this._checkPanelHash(row , col);

            let i;
            let nextChainList = [];
            for(i=0; i<aroundList.length; i++){
                let tgR = aroundList[i].row;
                let tgC = aroundList[i].col;

                if(this._checkPanelHash( tgR , tgC)){
                    let tgPanel:DtoPanel =  this._panels[tgR][tgC];
                    if((tgPanel.id == panelData.id) && (tgPanel.reverse == panelData.reverse) ){
                        chainList.push({row:tgR , col:tgC});
                        nextChainList.push({row:tgR , col:tgC});
                    }
                }
            }
            for(i=0; i<nextChainList.length; i++){
                chainList = this._getChainList(nextChainList[i].row , nextChainList[i].col ,panelData,chainList);
            }

            return chainList;
        }

        private _checkPanelHash(row,col){
            let key = row + '_' + col;
            if(this._checkedHash.hasOwnProperty(key)){
                return false;
            }
            this._checkedHash[key] = true;
            return true;
        }

        private _getAround(row , col){
            let allList = [
                [row-1 , col-1]
                ,[row-1 , col]
                ,[row-1 , col+1]
                ,[row , col+1]
                ,[row+1 , col+1]
                ,[row+1 , col]
                ,[row+1 , col-1]
                ,[row , col-1]
            ];
            let ret = [];
            for(let i=0; i<allList.length; i++){
                let tgR = allList[i][0];
                let tgC = allList[i][1];
                if(tgR < 0) continue;
                if(tgC < 0) continue;
                if(tgR >= this.ROW_CNT) continue;
                if(tgC >= this.COL_CNT) continue;
                ret.push({row:tgR , col:tgC});
            }
            return ret;
        }


        public isDragMode():boolean{
            return (this._invokePuzzleSkillId == 2);
        }

        public executeSkill(charaIdx):DtoSkillResult{
            let skillData = this.getSkillData(charaIdx);
            let skillResult:DtoSkillResult = new game.DtoSkillResult();

            switch (skillData.id){
                case 1:
                    this._invokePuzzleSkillId = null;
                    skillResult.convertPanels = this._convertPanels(skillData.id);
                    break;
                case 2:
                    this._invokePuzzleSkillId = skillData.id;
                    skillResult.drag = true;
                    break;
                case 3:
                    this._invokePuzzleSkillId = skillData.id;
                    break;
                case 4:
                    this._invokePuzzleSkillId = skillData.id;
                    break;
                case 5:
                    this._invokePuzzleSkillId = null;
                    skillResult.convertPanels = this._convertPanels(skillData.id);
                    break;
                default :
                    this._invokePuzzleSkillId = null;
                    break;
            }
            return skillResult;
        }


        private _convertPanels(skillId:number){
            let row;
            let col;

            let ret = [];
            if(skillId == 1){
                for(row=0; row<this.ROW_CNT; row++){
                    for(col=0; col<this.COL_CNT; col++){
                        if( (this._panels[row][col].id == 2) && ! this._panels[row][col].reverse ){
                            this._panels[row][col].id = 1;
                            this._panels[row][col].reverse = false;
                            ret.push({row:row , col:col});
                        }
                    }
                }
            }else{
                for(row=0; row<this.ROW_CNT; row++){
                    for(col=0; col<this.COL_CNT; col++){
                        this._panels[row][col].id = 1;
                        this._panels[row][col].reverse = ( (row==0 && col==1) || (row==1 && col==1) || (row==1 && col==0) );
                        ret.push({row:row , col:col});
                    }
                }

            }


            return ret;
        }



        public getSkillData(charaIdx):DtoSkill{
            return this._cards[ charaIdx ].skill;
        }




    }





    export class DtoPanel{
        public id:number;
        public reverse:boolean;
        public heal:boolean;

        constructor(_id,_reverse , _heal){
            this.id = _id;
            this.reverse = _reverse;
            this.heal = _heal;
        }
    }



    export class DtoSkillResult{
        public drag:boolean = false;
        public convertPanels = [];

        constructor(dt=null){
            if(dt){
                for(let key in dt){
                    this[key] = dt[key];
                }
            }
        }
    }
}

