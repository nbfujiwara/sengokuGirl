var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var game;
(function (game) {
    var DtoCore = (function () {
        function DtoCore(dt) {
            if (dt === void 0) { dt = null; }
            if (dt) {
                for (var key in dt) {
                    this[key] = dt[key];
                }
            }
        }
        return DtoCore;
    }());
    var DtoBattleCard = (function (_super) {
        __extends(DtoBattleCard, _super);
        function DtoBattleCard() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return DtoBattleCard;
    }(DtoCore));
    game.DtoBattleCard = DtoBattleCard;
    var DtoBattleEnemy = (function (_super) {
        __extends(DtoBattleEnemy, _super);
        function DtoBattleEnemy(dt) {
            if (dt === void 0) { dt = null; }
            var _this = this;
            _this.posX = 0;
            _this.posY = 0;
            _this = _super.call(this, dt) || this;
            return _this;
        }
        return DtoBattleEnemy;
    }(DtoCore));
    DtoBattleEnemy.SIZE_SMALL = 1;
    DtoBattleEnemy.SIZE_MIDDLE = 2;
    DtoBattleEnemy.SIZE_LARGE = 3;
    game.DtoBattleEnemy = DtoBattleEnemy;
    var DtoSkill = (function (_super) {
        __extends(DtoSkill, _super);
        function DtoSkill() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return DtoSkill;
    }(DtoCore));
    game.DtoSkill = DtoSkill;
    var DtoAttackResult = (function (_super) {
        __extends(DtoAttackResult, _super);
        function DtoAttackResult(dt) {
            if (dt === void 0) { dt = null; }
            var _this = this;
            _this.isNextBattle = false;
            _this.isClear = false;
            _this.isLose = false;
            _this = _super.call(this, dt) || this;
            return _this;
        }
        return DtoAttackResult;
    }(DtoCore));
    game.DtoAttackResult = DtoAttackResult;
    var DtoAttackFightResult = (function (_super) {
        __extends(DtoAttackFightResult, _super);
        function DtoAttackFightResult(dt) {
            if (dt === void 0) { dt = null; }
            var _this = this;
            _this.damageList = [];
            _this.isDestroy = false;
            _this.enemyAttacks = [];
            _this = _super.call(this, dt) || this;
            return _this;
        }
        return DtoAttackFightResult;
    }(DtoCore));
    game.DtoAttackFightResult = DtoAttackFightResult;
    var DtoAttackFightDamageRow = (function (_super) {
        __extends(DtoAttackFightDamageRow, _super);
        function DtoAttackFightDamageRow() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return DtoAttackFightDamageRow;
    }(DtoCore));
    game.DtoAttackFightDamageRow = DtoAttackFightDamageRow;
    var DtoAttackFightEnemyAttackRow = (function (_super) {
        __extends(DtoAttackFightEnemyAttackRow, _super);
        function DtoAttackFightEnemyAttackRow() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return DtoAttackFightEnemyAttackRow;
    }(DtoCore));
    game.DtoAttackFightEnemyAttackRow = DtoAttackFightEnemyAttackRow;
})(game || (game = {}));
