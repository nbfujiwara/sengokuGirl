/// <reference path="../libs/stats.d.ts"/>
/// <reference path="../libs/pixi/dts/pixi.js.d.ts"/>
/// <reference path="../libs/tween.js.d.ts"/>
/// <reference path="./game/GameMain.ts"/>


class Main {
    private _stats:Stats;
    private _stage:PIXI.Container;
    private _renderer:PIXI.SystemRenderer;
    private STAGE_WIDTH:number = 640;
    private STAGE_HEIGHT:number = 920;
    private STAGE_ZOOM:number = 1;
    private _gameMain:game.GameMain;

    constructor(windowWidth:number,resourceDir:string){
        console.log(windowWidth);
        this.STAGE_ZOOM = windowWidth / this.STAGE_WIDTH;
        //this.STAGE_ZOOM = 1;
        //document.getElementById('main').style.zoom = (windowWidth / this.STAGE_WIDTH).toString();

        this.initStats();
        this.initPixi();

        let imageList = [
            resourceDir+'seng.json'
            ,resourceDir+'effect.json'
        ];
        let loader:PIXI.loaders.Loader = new PIXI.loaders.Loader();
        loader.add(imageList);
        loader.once('complete' , ()=>this._onLoadAsset());
        loader.load();
    }

    private initStats():void
    {
        this._stats = new Stats();
        document.getElementById('stats').appendChild( this._stats.domElement);


    }
    private initPixi():void
    {
        this._stage = new PIXI.Container();
        //this._renderer = new PIXI.WebGLRenderer(this.STAGE_WIDTH * this.STAGE_ZOOM , this.STAGE_HEIGHT * this.STAGE_ZOOM);
        this._renderer = PIXI.autoDetectRenderer(this.STAGE_WIDTH * this.STAGE_ZOOM , this.STAGE_HEIGHT * this.STAGE_ZOOM);
        this._renderer.view.style.display = "block";
        document.getElementById('main').appendChild(this._renderer.view);
    }
    private _onLoadAsset():void
    {
        console.log('image loaded');
        this._gameMain = new game.GameMain();
        let mainNode = this._gameMain.getNode();

        mainNode.scale.x =this.STAGE_ZOOM;
        mainNode.scale.y =this.STAGE_ZOOM;

        this._stage.addChild(mainNode);
        this._tick();
    }
    private _tick():void
    {
        requestAnimationFrame( ()=>this._tick());
        this._stats.update();
        TWEEN.update();
        this._renderer.render(this._stage);
    }
}

