/// <reference path="../libs/stats.d.ts"/>
/// <reference path="../libs/pixi_3.0/dts/pixi.js.d.ts"/>
/// <reference path="../libs/tween.js.d.ts"/>
/// <reference path="./game/GameMain.ts"/>
var Main = (function () {
    function Main(windowWidth, resourceDir) {
        var _this = this;
        this.STAGE_WIDTH = 640;
        this.STAGE_HEIGHT = 920;
        this.STAGE_ZOOM = 1;
        console.log(windowWidth);
        this.STAGE_ZOOM = windowWidth / this.STAGE_WIDTH;
        //this.STAGE_ZOOM = 1;
        //document.getElementById('main').style.zoom = (windowWidth / this.STAGE_WIDTH).toString();
        this.initStats();
        this.initPixi();
        var imageList = [
            resourceDir + 'seng.json',
            resourceDir + 'effect.json'
        ];
        var loader = new PIXI.loaders.Loader();
        loader.add(imageList);
        loader.once('complete', function () { return _this._onLoadAsset(); });
        loader.load();
    }
    Main.prototype.initStats = function () {
        this._stats = new Stats();
        document.getElementById('stats').appendChild(this._stats.domElement);
    };
    Main.prototype.initPixi = function () {
        this._stage = new PIXI.Container();
        //this._renderer = new PIXI.WebGLRenderer(this.STAGE_WIDTH * this.STAGE_ZOOM , this.STAGE_HEIGHT * this.STAGE_ZOOM);
        this._renderer = PIXI.autoDetectRenderer(this.STAGE_WIDTH * this.STAGE_ZOOM, this.STAGE_HEIGHT * this.STAGE_ZOOM);
        this._renderer.view.style.display = "block";
        document.getElementById('main').appendChild(this._renderer.view);
    };
    Main.prototype._onLoadAsset = function () {
        console.log('image loaded');
        this._gameMain = new game.GameMain();
        var mainNode = this._gameMain.getNode();
        mainNode.scale.x = this.STAGE_ZOOM;
        mainNode.scale.y = this.STAGE_ZOOM;
        this._stage.addChild(mainNode);
        this._tick();
    };
    Main.prototype._tick = function () {
        var _this = this;
        requestAnimationFrame(function () { return _this._tick(); });
        this._stats.update();
        TWEEN.update();
        this._renderer.render(this._stage);
    };
    return Main;
}());
