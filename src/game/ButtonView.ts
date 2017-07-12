/// <reference path="../../libs/pixi/dts/pixi.js.d.ts"/>
/// <reference path="../../libs/tween.js.d.ts"/>

module game {
    export class ButtonView extends PIXI.Container{
        constructor(label:string , onClickHandler)
        {
            super();


            let background = PIXI.Sprite.fromFrame('button.png');
            this.addChild( background);



            let textStyle = {
                font:'bold 32px "ヒラギノ角ゴ Pro W3",Meiryo'
                ,fill:'#ffffff'
                ,align:'center'
                ,stroke:'#000044'
                ,strokeThickness:10
            };
            let labelText = new PIXI.Text(label, textStyle);

            labelText.x = background.width/2 - labelText.width/2;
            labelText.y = background.height/2 - labelText.height/2;
            this.addChild(labelText);

            //this.click  = onClickHandler;
            //this.on('click' , onClickHandler);
            //this.on('click' , (e)=>{onClickHandler(e); return false;});
            this.on('mouseup' , (e)=>{console.log(e);  e.stopPropagation(); onClickHandler(e); return false;})
            .on('touchend' , (e)=>{ e.stopPropagation(); onClickHandler(e); return false;});
        }





    }
}