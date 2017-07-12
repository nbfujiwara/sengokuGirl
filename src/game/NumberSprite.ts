/// <reference path="../../libs/pixi/dts/pixi.js.d.ts"/>

module game
{
    export class NumberSprite extends PIXI.Container{

        private _alignLeft = false;
        private _alignCenter = false;
        private _alignRight = false;

        private _container:PIXI.Container;

        private _charImageList;
        constructor(num , align='left')
        {
            super();

            this._container = new PIXI.Container();
            this.addChild(this._container);

            if(align == 'center'){
                this._alignCenter = true;
            }else if(align == 'right'){
                this._alignRight = true;
            }else{
                this._alignLeft = true;
            }

            this._charImageList = [];
            this.setNumber(num);



        }

        public setNumber(num:number):void{

            this._clearNumber();
            let numStr = num.toString();

            let charList = [];
            let totalWidth = 0;
            for(let i=0; i<numStr.length; i++){
                charList.push(numStr.substr(i,1));

                let char = numStr.substr(i,1);
                let charImg = PIXI.Sprite.fromFrame('num/num_' + char + '.png');
                charImg.x = totalWidth;
                this._container.addChild(charImg);
                this._charImageList.push(charImg);
                totalWidth += charImg.width;
            }

            if(this._alignCenter){
                this._container.x = -totalWidth/2;
            }
            if(this._alignRight){
                this._container.x = -totalWidth;
            }

        }

        private _clearNumber():void{
            for(let i=0; i<this._charImageList.length; i++){
                this._container.removeChild( this._charImageList[i] );
                this._charImageList[i] = null;
            }
            this._charImageList = [];

        }


    }
}