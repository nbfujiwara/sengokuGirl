/// <reference path="../../libs/pixi/dts/pixi.js.d.ts"/>
/// <reference path="../../libs/tween.js.d.ts"/>
/// <reference path="./DeckView.ts"/>
/// <reference path="./FightView.ts"/>
/// <reference path="./PanelView.ts"/>
/// <reference path="./EffectCircleView.ts"/>
/// <reference path="./EffectExplosionsView.ts"/>
/// <reference path="./PopupSkillView.ts"/>
/// <reference path="./DataObject.ts"/>
/// <reference path="./GameLogic.ts"/>
/// <reference path="./MyInteractionManager.ts"/>
/// <reference path="./StubData.ts"/>


module game
{
    export class GameMain{
        private _rootNode:PIXI.Container;
        private _puzzleNode:PIXI.Container;
        private _popupLayer:PIXI.Container;
        private _logic:GameLogic;

        private _panelViews = [];
        private PANEL_WIDTH = 100;
        private PANEL_HEIGHT = 100;

        //private _nowShiftList = [];
        //private _nowChainCount;
        private _playedChainCount = 0;
        private _attackResult:DtoAttackResult;

        private _enableAttack = false;

        private _fightView:FightView;
        private _effectCircleView:EffectCircleView;
        private _effectExplosionsView:EffectExplosionsView;

        private _deckView:DeckView;
        private _popupSkillView:PopupSkillView;

        private _isDragging:boolean = false;
        private _mouseDownCell;
        private _mouseMovePrevCell;
        private _dragCellList = [];

        constructor(){
            this._rootNode = new PIXI.Container();

            this._fightView = new FightView();
            this._rootNode.addChild(this._fightView);

            this._puzzleNode = new PIXI.Container();
            this._puzzleNode.y = 330;
            this._puzzleNode.x = 20;
            this._rootNode.addChild(this._puzzleNode);

            let deckLayer =  new PIXI.Container();
            deckLayer.y = 740;
            this._rootNode.addChild(deckLayer);

            this._effectCircleView = new EffectCircleView();
            this._rootNode.addChild(this._effectCircleView.getNode());
            this._effectExplosionsView = new EffectExplosionsView();
            this._rootNode.addChild(this._effectExplosionsView.getNode());

            this._popupLayer = new PIXI.Container();
            this._rootNode.addChild(this._popupLayer);




            this._logic = new GameLogic();

            this._logic.setAllEnemies( StubData.getBattleAllEnemies());
            this._logic.setDeckCards( StubData.getBattleCards());
            this._logic.startStage();


            this._deckView = new DeckView(this._logic.getDeckCards() , this._logic.getPlayerMaxHp() , this._logic.getPlayerHp());
            this._deckView.setClickCharacterCallback((charaIdx)=>this._showSkillPopup(charaIdx));
            deckLayer.addChild(this._deckView);



            let panels = this._logic.getAllPanels();

            this._panelViews = [];
            for(let row=0; row<panels.length; row++){
                for(let col=0; col<panels[row].length; col++){

                    let panelView = new PanelView( panels[row][col]);
                    let panelSprite =panelView.getNode();
                    panelSprite.x = col * this.PANEL_WIDTH;
                    panelSprite.y = row * this.PANEL_HEIGHT;

                    this._puzzleNode.addChild(panelSprite);
                    this._panelViews.push({
                        row:row
                        ,col:col
                        ,view:panelView
                    });
                }
            }

            this._puzzleNode.alpha = 0;

            //this._puzzleNode.interactive = true; //↓のMyInteractionManagerに変更
            MyInteractionManager.addDefault(this._puzzleNode);



            //this._puzzleNode.mousedown = this._puzzleNode.touchstart = (e)=>this._onTouchStartPuzzleHandler(e);
            //this._puzzleNode.mousemove = this._puzzleNode.touchmove   = (e)=>this._onTouchMovePuzzleHandler(e);
            //this._puzzleNode.mouseup = this._puzzleNode.touchend  = (e)=>this._onTouchEndPuzzleHandler(e);
            this._puzzleNode
                .on('mousedown' ,(e)=>this._onTouchStartPuzzleHandler(e))
                .on('touchstart' ,(e)=>this._onTouchStartPuzzleHandler(e))
                .on('mousemove' ,(e)=>this._onTouchMovePuzzleHandler(e))
                .on('touchmove' ,(e)=>this._onTouchMovePuzzleHandler(e))
                .on('mouseup' ,(e)=>this._onTouchEndPuzzleHandler(e))
                .on('touchend' ,(e)=>this._onTouchEndPuzzleHandler(e));

            this._fightView.setEnemies(this._logic.getNowBattleEnemies());
            this._fightView.showEnemies( ()=>this._onCompleteShowEnemy() );

            this._showFirstPuzzle();




        }
        private _onCompleteShowEnemy(){
            this._enableAttack = true;
            console.log('enable Attack On');

        }

        private _showFirstPuzzle():void{
            let target = this._puzzleNode;
            let tween:TWEEN.Tween = new TWEEN.Tween({alpha:0})
                    .to({alpha:1} , 500)
                    .onUpdate(function(){
                        target.alpha = this.alpha;
                    })
                    .easing(TWEEN.Easing.Quadratic.Out)
                    .start()
                ;
        }




        private _onTouchStartPuzzleHandler(e:any){
            if(! this._enableAttack){
                return;
            }
            if(! this._logic.isDragMode()){
                return ; //何もしない
            }

            let interact:PIXI.interaction.InteractionData = e.data;
            console.log('touch down');
            this._isDragging = true;
            this._mouseDownCell = this.getCell(this._getPuzzleNodePosition(e));
            this._dragCellList = [];
            this._pushDragCell( this.getCell(this._getPuzzleNodePosition(e) ) );
        }

        private _onTouchMovePuzzleHandler(e:any){
            if(! this._isDragging){
                return;
            }
            if(! this._enableAttack){
                return;
            }
            let interact:PIXI.interaction.InteractionData = e.data;
            let nowCell = this.getCell(this._getPuzzleNodePosition(e));
            if(this._isSameCells( nowCell , this._mouseMovePrevCell)){
                return;
            }

            if(! this._isDragMultiEnableCells( nowCell , this._mouseMovePrevCell)){
                this._clearDrag();
                return;
            }

            if(this.isCellExistsInArray( nowCell , this._dragCellList)){
                this._clearDrag();
                return;
            }

            this._pushDragCell(nowCell);


            //if(nowCell.row == this._mouseMovePrevCell.row)
        }
        private _clearDrag():void
        {
            this._isDragging = false;
            if(this._dragCellList.length){
                for(let i=0; i<this._panelViews.length; i++){
                    let panelView:PanelView = this._panelViews[i].view;
                    if(panelView && panelView.getNode().alpha < 1){
                        panelView.getNode().alpha = 1;
                    }
                }
                this._dragCellList = [];
            }
        }


        private _pushDragCell(cell):void
        {
            this._mouseMovePrevCell = cell;
            this._dragCellList.push(cell);
            console.log('複数選択追加 row,col=' + cell.row + ',' + cell.col);

            let panelView:PanelView = this._getPanelView(cell.row, cell.col);
            panelView.getNode().alpha = 0.2;
        }

        private _isSameCells(cell1 , cell2):boolean{
            if(! cell1 || ! cell2){
                return false;
            }
            return (
                (cell1.row == cell2.row) && (cell1.col == cell2.col)
            );
        }
        private _isDragMultiEnableCells(cell1 , cell2):boolean{
            if(! cell1 || ! cell2){
                return false;
            }
            return (
                (cell1.row == cell2.row) && (cell1.col == cell2.col-1)
                || (cell1.row == cell2.row) && (cell1.col == cell2.col+1)
                || (cell1.row == cell2.row-1) && (cell1.col == cell2.col)
                || (cell1.row == cell2.row+1) && (cell1.col == cell2.col)
            );
        }
        private isCellExistsInArray(cell , list){
            for(let i=0; i<list.length; i++){
                if(this._isSameCells(cell , list[i])){
                    return true;
                }
            }
            return false;
        }

        private _getPuzzleNodePosition(event:any){
            //console.log(event);
            let interact:PIXI.interaction.InteractionData = event.data;
            //console.log(interact.getLocalPosition(event.target));
            let point:PIXI.Point = interact.getLocalPosition(event.target);
            return point;

        }

        private _onTouchEndPuzzleHandler(e:any){
            if(! this._enableAttack){
                return;
            }
            this._enableAttack = false;

            console.log('touch end');
            let cell;
            let dragCellList = [];
            if(this._isDragging){
                cell = this._mouseDownCell;
                dragCellList = this._dragCellList;
                //this._clearDrag();
                //this._clearDrag()はもうちょっと後のタイミングでやったほうが見た目がいいので　_enableAttack　のtrue戻しと同タイミングで行う
                this._isDragging = false;
                //でもisDraggingだけは戻しておく
            }else{
                cell = this.getCell(this._getPuzzleNodePosition(e));
            }


            if(cell){
                console.log('attack select target row=' + cell.row + ' ,col=' + cell.col);
                let attackResult = this._logic.attack(cell.row , cell.col , dragCellList);
                console.log(attackResult);

                this._attackResult = attackResult;
                this._playedChainCount = 0;

                let i;
                let panelView:PanelView;
                for(i=0; i<attackResult.reverseList.length; i++){
                    panelView = this._getPanelView(attackResult.reverseList[i].row , attackResult.reverseList[i].col);
                    panelView.reverse();
                }

                let chainList=attackResult.chainList;
                let chainDelay = 150;
                for(i=0; i<chainList.length; i++){
                    let r = chainList[i].row;
                    let c = chainList[i].col;
                    panelView = this._getPanelView(r , c);
                    let chainCallback = (function(_func ,a,b){
                        return function(){_func(a,b);}
                    })( (row,col)=>this._callbackChainPanelTween(row,col) , r , c);
                    panelView.chain( chainCallback , chainDelay);

                    this._effectExplosionsView.play( this.getEffectPoint(chainList[i]) , chainDelay , i);

                    chainDelay += 100;
                }

                //this._nowChainCount = chainList.length;
                //this._nowShiftList = attackResult.shiftList;

                this._effectCircleView.play(this.getEffectPoint(cell) );

            }else{
                console.log('場所不明');
            }
        }

        private _getPanelView(row , col):PanelView{
            return this._panelViews[ this._getPanelViewIndex(row , col)].view;
        }
        private _getPanelViewIndex(row , col){
            for(let i=0; i<this._panelViews.length; i++){
                if(this._panelViews[i].row == row && this._panelViews[i].col == col ){
                    return i;
                }
            }
            return null;

        }

        private _callbackChainPanelTween(row,col){
            console.log('chain tween complete callback');
            let panelIndex = this._getPanelViewIndex(row , col);

            if(! this._panelViews[panelIndex]){
                console.log('既にnullになっちゃってる!!!');
                return;
            }
            let panelView:PanelView = this._panelViews[panelIndex].view;
            this._puzzleNode.removeChild(panelView.getNode());
            this._panelViews[panelIndex].view = null;
            this._panelViews[panelIndex] = null;
            this._panelViews.splice(panelIndex , 1);

            this._playedChainCount ++;

            if(this._playedChainCount >= this._attackResult.chainList.length) {
                this._fightView.playFight(this._attackResult.fightResult, ()=>this._callbackPlayFight());
                this._playShiftPanel();

                //敵がまだ残っていたら&敵が攻撃してなかったらパズル可能に
                if (!this._attackResult.fightResult.isDestroy && !this._attackResult.fightResult.enemyAttacks.length) {
                    this._enableAttack = true;
                    console.log('enable Attack On');
                }
            }
        }

        private _playShiftPanel(){
            let shiftList = this._attackResult.shiftList;
            let panelView:PanelView;
            let panelSprite:PIXI.Container;
            let panelIndex:number;
            for(let i=0; i<shiftList.length; i++){
                if(shiftList[i].type == 'move'){
                    panelIndex = this._getPanelViewIndex(shiftList[i].fromRow , shiftList[i].fromCol);
                    panelView = this._panelViews[panelIndex].view;
                    panelSprite =panelView.getNode();
                }
                if(shiftList[i].type == 'create'){
                    panelIndex = this._panelViews.length;
                    panelView = new PanelView(shiftList[i].panelData );
                    panelSprite =panelView.getNode();

                    panelSprite.x = (shiftList[i].col + shiftList[i].shiftCount) * this.PANEL_HEIGHT;
                    panelSprite.y = shiftList[i].row * this.PANEL_HEIGHT;
                    this._puzzleNode.addChild(panelSprite);
                    this._panelViews.push({
                        view:panelView
                    });


                }


                this._panelViews[panelIndex].row = shiftList[i].row;
                this._panelViews[panelIndex].col = shiftList[i].col;

                let fromX = panelSprite.x;
                let fromY = panelSprite.y;
                let toX = this._panelViews[panelIndex].col * this.PANEL_WIDTH;
                let toY = this._panelViews[panelIndex].row * this.PANEL_HEIGHT;
                let tween:TWEEN.Tween = new TWEEN.Tween({x:fromX , y:fromY , target:panelSprite})
                        .to({x:toX , y:toY} , 200)
                        .onUpdate(function(){
                            this.target.x = this.x;
                            this.target.y = this.y;
                        })
                        .easing(TWEEN.Easing.Quadratic.Out)
                    ;
                tween.start();
//                console.log(shiftList[i]);
            }

        }


        private _callbackPlayFight():void{
            console.log('fight play callback');

            this._clearDrag();

            if(this._attackResult.isClear){
                alert('クリアしました！！！');
                location.href = 'index.html';
            }else if(this._attackResult.isNextBattle){
                this._fightView.setEnemies(this._logic.getNowBattleEnemies());
                this._fightView.showEnemies( ()=>this._onCompleteShowEnemy() );

            }else if(this._attackResult.isLose){
                alert('負けちゃいました...');
            }else{
                if(this._attackResult.fightResult.enemyAttacks.length){
                    let attackList = this._attackResult.fightResult.enemyAttacks;
                    let playerDamage = 0;
                    let playerHp = 0;
                    for(let i=0; i<attackList.length; i++){
                        playerDamage += attackList[i].damage;
                        playerHp = attackList[i].restHp;
                    }
                    this._deckView.playDamage(playerDamage , playerHp);

                }

                //次のターンへ
                this._enableAttack = true;
                console.log('enable Attack On');

            }
        }


        private _showSkillPopup(charaIdx):void
        {
            if(! this._popupSkillView){
                this._popupSkillView = new game.PopupSkillView();
                this._popupLayer.addChild(this._popupSkillView);
            }

            this._popupSkillView.setExecCallback(
                (function(_func ,a){
                    return function(){_func(a);}
                })( (charaIdx)=>this._invokeSkill(charaIdx) , charaIdx)
            );


            let skillData = this._logic.getSkillData(charaIdx);
            this._popupSkillView.showSkill(skillData.name, skillData.detail);
        }
        private _invokeSkill(charaIdx):void
        {
            let skillResult = this._logic.executeSkill(charaIdx);

            let convertList = skillResult.convertPanels;
            for(let i=0; i<convertList.length; i++){
                let panelView = this._getPanelView(convertList[i].row , convertList[i].col);
                panelView.change();
            }

        }



        private getEffectPoint(cell):PIXI.Point{
            let pt:PIXI.Point = this.getPoint(cell);
            pt.x += this._puzzleNode.x;
            pt.y += this._puzzleNode.y;
            return pt;
        }
        private getPoint(cell):PIXI.Point{
            let x = (cell.col + 0.5) * this.PANEL_WIDTH;
            let y = (cell.row + 0.5) * this.PANEL_HEIGHT;
            return new PIXI.Point(x , y);
        }

        private getCell(point:PIXI.Point){
            let row = 0;
            let col = 0;
            if(point.y >= 0 && point.y < this.PANEL_HEIGHT * this._logic.ROW_CNT){
                row = Math.floor(point.y /this.PANEL_HEIGHT );
            }else{
                return null;
            }
            if(point.x >= 0 && point.x < this.PANEL_WIDTH * this._logic.COL_CNT){
                col = Math.floor(point.x  /this.PANEL_WIDTH );
            }else{
                return null;
            }
            return {row:row , col:col};

        }

        public getNode(){
            return this._rootNode;
        }

    }

}