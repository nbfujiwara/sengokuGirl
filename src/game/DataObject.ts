module game
{
    class DtoCore{
        constructor(dt=null){
            if(dt){
                for(var key in dt){
                    this[key] = dt[key];
                }
            }
        }
    }

    export class DtoBattleCard extends DtoCore{
        public id:number;
        public assetId:string;
        public skill:DtoSkill;
        public attributes:number[];
        public maxHp:number;
        public attack:number;
    }

    export class DtoBattleEnemy extends DtoCore{
        public static SIZE_SMALL:number = 1;
        public static SIZE_MIDDLE:number = 2;
        public static SIZE_LARGE:number = 3;

        public id:number;
        public assetId:string;
        public hp:number;
        public maxHp:number;
        public attribute:number;
        public attack:number;
        public defense:number;

        public posX:number;
        public posY:number;
        public size:number;
        public turn:number;
        public maxTurn:number;
        constructor(dt=null){
            this.posX = 0;
            this.posY = 0;
            super(dt);
        }

    }

    export class DtoSkill extends DtoCore{
        public id;
        public name;
        public detail;
    }



    export class DtoAttackResult extends DtoCore{
        public reverseList;
        public chainList;
        public shiftList;
        public fightResult:DtoAttackFightResult;
        public isNextBattle:boolean;
        public isClear:boolean;
        public isLose:boolean;

        constructor(dt=null){
            this.isNextBattle = false;
            this.isClear = false;
            this.isLose = false;
            super(dt);
        }
    }

    export class DtoAttackFightResult extends DtoCore{
        public damageList:DtoAttackFightDamageRow[];
        public isDestroy:boolean;
        public enemyAttacks:DtoAttackFightEnemyAttackRow[];
        public effectType:number;
        constructor(dt=null){
            this.damageList = [];
            this.isDestroy = false;
            this.enemyAttacks = [];
            super(dt);
        }
    }
    export class DtoAttackFightDamageRow extends DtoCore{
        public damage:number;
        public enemyIndex:number;
        public restHp:number;
    }
    export class DtoAttackFightEnemyAttackRow extends DtoCore{
        public damage:number;
        public enemyIndex:number;
        public restHp:number;
        public nextTurn:number;
    }


}

