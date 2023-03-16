// 可視バフのリスト
import { visibleBuff } from '../data/type'
import { status, defaultStatus, pushVisibleBuff } from '../event/simulate'

export const findByBuffID = (ID: number): number => {
    let seaechIndex = 0;
    while (true) {
        if (buffList[seaechIndex].ID == ID) {
            return seaechIndex;
        } else if (seaechIndex == buffList.length) {
            return 999 // errer
        }
        seaechIndex++;
    }
}

const beforePassive = 1;
const DamageAvoidance = 2;
const AvoidanceSuccess = 3;
const Damaged = 4;
// EffectType = 2 || 4 の場合、return boolean
export const buffList: visibleBuff[] = [
    {
        Name: 'Voバフ',
        ID: 1,
        EffectType: beforePassive,
        Value: function (value: number) {
            status.Buff.Visible.vVo += value;
        }
    },
    {
        Name: 'Daバフ',
        ID: 2,
        EffectType: beforePassive,
        Value: function (value: number) {
            status.Buff.Visible.vDa += value;
        }
    },
    {
        Name: 'Viバフ',
        ID: 3,
        EffectType: beforePassive,
        Value: function (value: number) {
            status.Buff.Visible.vVi += value;
        }
    },
    {
        Name: 'Voデバフ',
        ID: 22,
        EffectType: beforePassive,
        Value: function (value: number) {
            status.Buff.Visible.vVo -= value;
        }
    },
    {
        Name: 'Daデバフ',
        ID: 23,
        EffectType: beforePassive,
        Value: function (value: number) {
            status.Buff.Visible.vDa -= value;
        }
    },
    {
        Name: 'Viデバフ',
        ID: 24,
        EffectType: beforePassive,
        Value: function (value: number) {
            status.Buff.Visible.vVi -= value;
        }
    },
    {
        Name: 'メンタルダメージカット',
        ID: 4,
        EffectType: beforePassive,
        Value: function (value: number) {
            status.DamageRatio *= 1 - (value * 0.01);
        }
    },
    {
        Name: 'メンタルダメージアップ',
        ID: 5,
        EffectType: beforePassive,
        Value: function (value: number) {
            status.DamageRatio *= 1 + (value * 0.01);
        }
    },
    {
        Name: '注目度アップ',
        ID: 6,
        EffectType: beforePassive,
        Value: function (value: number) {
            status.Attention += value;
        }
    },
    {
        Name: '注目度ダウン',
        ID: 7,
        EffectType: beforePassive,
        Value: function (value: number) {
            status.Attention -= value;
        }
    },
    {
        Name: 'パッシブ発動率上昇',
        ID: 8,
        EffectType: beforePassive,
        Value: function (value: number) {
            status.TriggerRateIncreases += value;
        }
    },
    {
        Name: 'メランコリ',
        ID: 9,
        EffectType: beforePassive,
        Value: function (value: number) {
            status.MentalEffect += - Math.floor(status.Mental * value * 0.01);
        }
    },
    {
        Name: 'リザレクション',
        ID: 21,
        EffectType: Damaged,
        Value: function (value: number):boolean {
            if(status.Mental <= 0) {
                console.log("rez");
                status.Mental = Math.floor(defaultStatus.Mental * value * 0.01);
                return true;
            }else {
                return false;
            }
        }
    },
    {
        Name: '影響力アップ',
        ID: 18,
        EffectType: beforePassive,
        Value: function (value: number) {
            status.Damage += Math.floor(status.Damage * (1 + (value * 0.01))) - status.Damage;
        }
    },
    {
        Name: '影響力ダウン',
        ID: 19,
        EffectType: beforePassive,
        Value: function (value: number) {
            status.Damage -= status.Damage - Math.floor(status.Damage * (1 - (value * 0.01)));
        }
    },
    {
        Name: 'リラックス',
        ID: 10,
        EffectType: beforePassive,
        Value: function (value: number) {
            status.MentalEffect += Math.floor(defaultStatus.Mental * value * 0.01);
        }
    },
    {
        Name: 'リアクション回避',
        ID: 11,
        EffectType: DamageAvoidance,
        Value: function (value: number): boolean {
            if (Math.floor(Math.random() * 100) < value) {
                return true
            } else {
                return false
            }
        }
    },
    {
        Name: 'リアクション回避(システム)',
        ID: 20,
        EffectType: DamageAvoidance,
        Value: function (value: number): boolean {
            if (Math.floor(Math.random() * 100) < value) {
                return true
            } else {
                return false
            }
        }
    },
    {
        Name: 'Voバフ',
        ID: 25,
        EffectType: beforePassive,
        Value: function (value: number) {
            status.Buff.Visible.vVo += value;
        }
    },
    {
        Name: 'Daバフ',
        ID: 26,
        EffectType: beforePassive,
        Value: function (value: number) {
            status.Buff.Visible.vDa += value;
        }
    },
    {
        Name: 'Viバフ',
        ID: 27,
        EffectType: beforePassive,
        Value: function (value: number) {
            status.Buff.Visible.vVi += value;
        }
    },
    {
        Name: 'ダメージ受けるまで類全消去(システム)',
        ID: 28,
        EffectType: Damaged,
        Value: function (value: number, turn:number) {
            for(let i = 0; i < status.VisibleBuffs.length; i++) {
                if(status.VisibleBuffs[i].BuffID == 25 || status.VisibleBuffs[i].BuffID == 26 || status.VisibleBuffs[i].BuffID == 27) {
                    status.VisibleBuffs[i].BuffTurn = 0;
                }
            }
            return true;
        }
    },
    {
        Name: '回避時Voバフ',
        ID: 12,
        EffectType: AvoidanceSuccess,
        Value: function (value: number, turn:number) {
            pushVisibleBuff(1,turn,value, 0, 0);
        }
    },
    {
        Name: '回避時Daバフ',
        ID: 13,
        EffectType: AvoidanceSuccess,
        Value: function (value: number, turn:number) {
            pushVisibleBuff(2,turn,value, 0, 0);
        }
    },
    {
        Name: '回避時Viバフ',
        ID: 14,
        EffectType: AvoidanceSuccess,
        Value: function (value: number, turn:number) {
            pushVisibleBuff(3,turn,value, 0, 0);
        }
    },
    {
        Name: '被弾時Voバフ',
        ID: 15,
        EffectType: Damaged,
        Value: function (value: number, turn:number) {
            pushVisibleBuff(1,turn,value, 0, 0);
            return true;
        }
    },
    {
        Name: '被弾時Daバフ',
        ID: 16,
        EffectType: Damaged,
        Value: function (value: number, turn:number) {
            pushVisibleBuff(2,turn,value, 0, 0);
            return true;
        }
    },
    {
        Name: '被弾時Viバフ',
        ID: 17,
        EffectType: Damaged,
        Value: function (value: number, turn:number) {
            pushVisibleBuff(3,turn,value, 0, 0);
            return true;
        }
    },

]


// IDの重複、未登録のチェック
export const buffListCheck = () => {
    const holder: visibleBuff[] = []
    let holderIndex = 0;
    let holderCheck = false;
    let buffListIndex = 0;
    let checkNumber: number = 1;
    let buffCheck = true;
    const searchInHolder = () => {
        // holderに配列が入っている場合
        holderCheck = true;
        // holder内の検索
        while (holderCheck) {
            if (holder[holderIndex].ID == checkNumber) {
                // holder内IDとcheckNumberが合っている場合。
                checkNumber++;
                holder.splice(holderIndex, 1);
                holderIndex = 0;
                holderCheck = false;
            } else {
                holderIndex++;
                if (holderIndex == holder.length) {
                    // holderにもcheckNumberと一致するIDがなかった場合
                    holder.push(buffList[buffListIndex]);
                    buffListIndex++;
                    holderIndex = 0;
                    holderCheck = false;
                }
            }
        }
    }
    while (buffCheck) {
        if (buffList[buffListIndex].ID == checkNumber) {
            // IDとcheckNumberが合っている場合。
            checkNumber++;
            buffListIndex++;
        } else if (holder.length > 0) {
            searchInHolder();
        } else if (buffListIndex < buffList.length) {
            holder.push(buffList[buffListIndex]);
            buffListIndex++;
        }
        // 終了動作
        if (buffListIndex == buffList.length) {
            if (holder.length > 0) {
                while (buffListIndex == buffList.length && checkNumber <= buffList.length) {
                    searchInHolder()
                }
            }
            if (checkNumber > buffList.length) {
                console.log("buffListID complete")
                buffCheck = false;
            } else {
                console.log('errer [buffListID]')
                console.log("vBID Next:" + checkNumber)
                buffCheck = false;
            }

        }
    }
}
// buffListCheck();