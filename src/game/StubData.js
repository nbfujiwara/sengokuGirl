/// <reference path="./DataObject.ts"/>
var game;
(function (game) {
    var StubData = (function () {
        function StubData() {
        }
        StubData.getBattleCards = function () {
            var list = [];
            list.push(new game.DtoBattleCard({
                id: 1,
                attack: 92
            }));
            list.push(new game.DtoBattleCard({
                id: 2,
                attack: 105
            }));
            list.push(new game.DtoBattleCard({
                id: 3,
                attack: 32
            }));
            list.push(new game.DtoBattleCard({
                id: 4,
                attack: 86
            }));
            list.push(new game.DtoBattleCard({
                id: 5,
                attack: 121
            }));
            for (var i = 0; i < list.length; i++) {
                list[i].assetId = 'card' + list[i].id + '.png';
                list[i].maxHp = 200;
                list[i].attributes = [1, 2, 3, 4];
                list[i].skill = StubData.getDummySkill(list[i].id);
            }
            return list;
        };
        StubData.getBattleAllEnemies = function () {
            var list = [];
            list.push([
                new game.DtoBattleEnemy({ id: 1, maxTurn: 2, size: 1, maxHp: 4532, attack: 18, defense: 0, attribute: 1, posX: 320 })
            ]);
            list.push([
                new game.DtoBattleEnemy({ id: 2, maxTurn: 300, size: 1, maxHp: 10234, attack: 25, defense: 0, attribute: 2, posX: 220 }),
                new game.DtoBattleEnemy({ id: 3, maxTurn: 500, size: 1, maxHp: 22211, attack: 93, defense: 0, attribute: 3, posX: 420 })
            ]);
            list.push([
                new game.DtoBattleEnemy({ id: 4, maxTurn: 200, size: 2, maxHp: 51234, attack: 343, defense: 0, attribute: 4, posX: 320 })
            ]);
            for (var i = 0; i < list.length; i++) {
                for (var k = 0; k < list[i].length; k++) {
                    list[i][k].assetId = 'enemy' + list[i][k].id + '.png';
                    list[i][k].turn = list[i][k].maxTurn;
                    list[i][k].hp = list[i][k].maxHp;
                }
            }
            return list;
        };
        StubData.getDummySkill = function (cardId) {
            switch (cardId) {
                case 1:
                    return new game.DtoSkill({ id: 1, name: 'オリンポスの炎', detail: "青パネルを赤パネルに\n変換する" });
                case 2:
                    return new game.DtoSkill({ id: 2, name: 'チェンジ・ザ・ワールド', detail: "ドラッグで複数のパネルを\nターゲットパネルに\n指定できるようにする\n(攻撃起点は最初のパネル)" });
                case 3:
                    return new game.DtoSkill({ id: 3, name: '天下無双の崩撃', detail: "ターゲットパネルの\n縦1列横1列を反転対象にする" });
                case 4:
                    return new game.DtoSkill({ id: 4, name: 'ペガサス流星拳', detail: "ターゲットパネルの周囲を\n反転させずに攻撃を開始する" });
                case 5:
                    return new game.DtoSkill({ id: 5, name: '天上大花火の術', detail: "全てのパネルを変換し\n炎の全力攻撃を可能にする" });
                default:
                    return new game.DtoSkill({ id: 6, name: 'けろけろアターック！', detail: "考え中。効果無し" });
            }
        };
        return StubData;
    }());
    game.StubData = StubData;
})(game || (game = {}));
