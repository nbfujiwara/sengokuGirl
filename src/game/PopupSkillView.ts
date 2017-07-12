/// <reference path="../../libs/pixi/dts/pixi.js.d.ts"/>
/// <reference path="./PopupViewCore.ts"/>
/// <reference path="./ButtonView.ts"/>
/// <reference path="./MyInteractionManager.ts"/>
module game {
    export class PopupSkillView extends PopupViewCore{
        private _execCallback;
        private _interactiveList;

        private _textTitle:PIXI.Text;
        private _textDetail:PIXI.Text;

        constructor()
        {
            super();

            let background = new PIXI.Graphics();
            background.lineStyle(10,0x9999ff,1);
            background.beginFill(0xcccccc);
            background.drawRoundedRect(50, 200, 540, 520 ,20);
            background.endFill();
            this.mainNode.addChild( background);




            this._textTitle = new PIXI.Text('', {
                font:'bold 40px "ヒラギノ角ゴ Pro W3",Meiryo'
                ,fill:'#ffffff'
                ,align:'center'
                ,stroke:'#000044'
                ,strokeThickness:10
            });

            this._textDetail = new PIXI.Text('', {
                font:'bold 32px "ヒラギノ角ゴ Pro W3",Meiryo'
                ,fill:'#ffffff'
                ,align:'center'
                ,stroke:'#000044'
                ,strokeThickness:10
                ,wordWrap:true
                ,wordWrapWidth:460
            });

            this._textTitle.anchor.x = 0.5;
            this._textTitle.x = 320;
            this._textTitle.y = 240;

            this._textDetail.anchor.x = 0.5;
            this._textDetail.anchor.y = 0.5;
            this._textDetail.x = 320;
            this._textDetail.y = 430;


            this.mainNode.addChild(this._textTitle);
            this.mainNode.addChild(this._textDetail);

            let execButton = new ButtonView('発動' , ()=>this.onExecute());
            let cancelButton = new ButtonView('キャンセル' , ()=>this.onCancel());

            execButton.x = 70;
            execButton.y = 600;

            cancelButton.x = 330;
            cancelButton.y = 600;

            this.mainNode.addChild(execButton);
            this.mainNode.addChild(cancelButton);

            this._interactiveList = [execButton , cancelButton];
        }


        public setExecCallback(func){
            this._execCallback = func;
        }

        public showSkill(skillTitle:string,skillDetail:string){
            MyInteractionManager.add(this._interactiveList);
            super.show();

            this._textDetail.text = skillDetail;
            this._textTitle.text = skillTitle;
        }
        public hide(){
            console.log('release interact');
            MyInteractionManager.release();
            super.hide();
        }

        private onExecute(){
            this.hide();
            if(this._execCallback){
                this._execCallback();
            }
            return false;
        }

        private onCancel(){
            this.hide();
            return false;
        }


    }
}