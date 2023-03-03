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

export const buffList: visibleBuff[] = [
    {
        Name: 'Voバフ',
        ID: 1,
        EffectType: 1,
        Value: function (value: number) {
            status.Buff.Visible.vVo += value;
        }
    },
    {
        Name: 'Daバフ',
        ID: 2,
        EffectType: 1,
        Value: function (value: number) {
            status.Buff.Visible.vDa += value;
        }
    },
    {
        Name: 'Viバフ',
        ID: 3,
        EffectType: 1,
        Value: function (value: number) {
            status.Buff.Visible.vVi += value;
        }
    },
    {
        Name: 'メンタルダメージカット',
        ID: 4,
        EffectType: 1,
        Value: function (value: number) {
            status.DamageRatio *= 1 - (value * 0.01);
        }
    },
    {
        Name: 'メンタルダメージアップ',
        ID: 5,
        EffectType: 1,
        Value: function (value: number) {
            status.DamageRatio *= 1 + (value * 0.01);
        }
    },
    {
        Name: '注目度アップ',
        ID: 6,
        EffectType: 1,
        Value: function (value: number) {
            status.Attention += value;
        }
    },
    {
        Name: '注目度ダウン',
        ID: 7,
        EffectType: 1,
        Value: function (value: number) {
            status.Attention -= value;
        }
    },
    {
        Name: 'パッシブ発動率上昇',
        ID: 8,
        EffectType: 1,
        Value: function (value: number) {
            status.TriggerRateIncreases += value;
        }
    },
    {
        Name: 'メランコリ',
        ID: 9,
        EffectType: 1,
        Value: function (value: number) {
            status.MentalEffect += - Math.floor(status.Mental * value * 0.01);
        }
    },
    {
        Name: '影響力アップ',
        ID: 18,
        EffectType: 4,
        Value: function (value: number) {
            status.Damage *= Math.floor(status.Damage * (1 + (value * 0.01)));
        }
    },
    {
        Name: '影響力ダウン',
        ID: 19,
        EffectType: 4,
        Value: function (value: number) {
            let ratio = value * 0.01;
            ratio = 1 - ratio;
            status.Damage *= Math.floor(status.Damage * ratio);
        }
    },
    {
        Name: 'リラックス',
        ID: 10,
        EffectType: 1,
        Value: function (value: number) {
            status.MentalEffect += Math.floor(defaultStatus.Mental * value * 0.01);
        }
    },
    {
        Name: 'リアクション回避',
        ID: 11,
        EffectType: 2,
        Value: function (value: number): boolean {
            if (Math.floor(Math.random() * 100) < value) {
                return true
            } else {
                return false
            }
        }
    },
    {
        Name: 'リアクション回避(パッシブ)',
        ID: 20,
        EffectType: 2,
        Value: function (value: number): boolean {
            if (Math.floor(Math.random() * 100) < value) {
                return true
            } else {
                return false
            }
        }
    },
    {
        Name: '回避時Voバフ',
        ID: 12,
        EffectType: 3,
        Value: function (value: number, turn:number) {
            pushVisibleBuff(1,turn,value, 0, 0)
        }
    },
    {
        Name: '回避時Daバフ',
        ID: 13,
        EffectType: 3,
        Value: function (value: number, turn:number) {
            pushVisibleBuff(2,turn,value, 0, 0)
        }
    },
    {
        Name: '回避時Viバフ',
        ID: 14,
        EffectType: 3,
        Value: function (value: number, turn:number) {
            pushVisibleBuff(3,turn,value, 0, 0)
        }
    },
    {
        Name: '被弾時Voバフ',
        ID: 15,
        EffectType: 4,
        Value: function (value: number, turn:number) {
            pushVisibleBuff(1,turn,value, 0, 0)
        }
    },
    {
        Name: '被弾時Daバフ',
        ID: 16,
        EffectType: 4,
        Value: function (value: number, turn:number) {
            pushVisibleBuff(2,turn,value, 0, 0)
        }
    },
    {
        Name: '被弾時Viバフ',
        ID: 17,
        EffectType: 4,
        Value: function (value: number, turn:number) {
            pushVisibleBuff(3,turn,value, 0, 0)
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
                console.log("buffListID is all correct")
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