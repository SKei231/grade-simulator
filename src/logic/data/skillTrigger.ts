// パッシブ発動条件を設定したファイル
import { trigger } from "./type"
import { status, defaultStatus } from "../event/simulate"
import { passiveSkills } from "../event/vault"
import { getUnitMember } from "./idolList"

export const triggerCheck = (ID: number) => {
    return triggerList[findByTriggerID(ID)].value()
}

export const findByTriggerID = (id: number): number => {
    let seaechIndex = 0;
    while (true) {
        if(seaechIndex == triggerList.length) {
            console.log("No such passiveTrigger ID:" + id)
            return 0
        }else if (triggerList[seaechIndex].ID == id) {
            return seaechIndex;
        }
        seaechIndex++;
    }
}

/* 除外
    アイドル編成時系
    ユニット編成時系

    スターN個系
    観客系
    順位系
    最大メンタル系
*/
/**条件リスト
 * @param label 条件名
 * @param ID 条件ID
 * @param existX 条件に変数があるかどうか
 * @param value 条件の実行文 発動可:ture, 不可:false turnは0~Max
 */
export const triggerList: trigger[] = [
    {
        label: "ターンのみ・達成済",
        parsedLabel: ["ターンのみ・達成済"],
        ID: 1,
        existX: false,
        existY: false,
        value: function (turn:number, tx:number[], before:number, after:number) {
            return turnCheck(turn, before, after);
        }
    },
    {
        label: "履歴に〇〇がある場合",
        parsedLabel: ["履歴に","がある場合"],
        ID: 2,
        existX: false,
        existY: false,
        value: function (turn:number, tx:number[], before:number, after:number, tHis:number[]) {
            if(status.AppealLog.length == 0) {
                console.log("0");
                return false;
            }else {
                let checker = true;
                let scanningIndex = 0;
                while(checker) {
                    for(let i = 0; i < status.AppealLog.length; i++) {
                        if(status.AppealLog[i] == tHis[scanningIndex]) {
                            scanningIndex++;
                            checker = false;
                        }
                    }
                    if(checker) { // 履歴のヒットがなかった場合
                        return false;
                    }else if(scanningIndex == tHis.length){ // 履歴全てがヒットした場合
                        return turnCheck(turn, before, after);
                    }else {
                        checker = true;
                    }
                }
            }
        }
    },
    {
        label: "履歴に〇〇又は〇ターン以降",
        parsedLabel: ["履歴に","又は","ターン以降"],
        ID: 3,
        existX: true,
        existY: false,
        value: function (turn:number, tx:number[], before:number, after:number, tHis:number[]) {
            if(status.AppealLog.length < tx[0]) {
                return false;
            }else {
                return triggerList[findByTriggerID(2)].value(turn, tx, before, after, tHis);
            }
        }
    },
    {
        label: "履歴に(ユニット)が〇人以上ある場合",
        parsedLabel: ["履歴に","が","人以上ある場合"],
        ID: 18,
        existX: true,
        existY: false,
        value: function (turn:number, tx:number[], before:number, after:number, tHis:number[]) {
            if(status.AppealLog.length < tx[0]) {
                return false;
            }else if(tHis[0] == 1 && tx[0] <= status.AppealLog.length) {
                return turnCheck(turn, before, after);
            }else {
                let unit:number[] = getUnitMember(tHis[0]);
                let hitTimes = 0;
                for(let i = 0; i < status.AppealLog.length; i ++) {
                    for(let j = 0; j < unit.length; j++) {
                        if(status.AppealLog[i] == unit[j]) {
                            hitTimes++;
                        }
                    }
                }
                if(hitTimes >= tx[0]) {
                    return turnCheck(turn, before, after);
                }else {
                    return false;
                }
            }
        }
    },
    {
        label: "メンタル〇%以上",
        parsedLabel: ["メンタル","%以上"],
        ID: 4,
        existX: true,
        existY: false,
        value: function (turn:number, tx:number[], before:number, after:number) {// 小数点第二位の四捨五入（以上のみ）
            return Math.round((status.Mental / defaultStatus.Mental) * 1000) / 10 >= tx[0] && turnCheck(turn, before, after);;
        }
    },
    {
        label: "メンタル〇%以下",
        parsedLabel: ["メンタル","%以下"],
        ID: 5,
        existX: true,
        existY: false,
        value: function (turn:number, tx:number[], before:number, after:number) {
            return ((status.Mental / defaultStatus.Mental) * 100 <= tx[0]) && turnCheck(turn, before, after);;
        }
    },
    {
        label: "メンタル〇%以上△%以下",
        parsedLabel: ["メンタル","%以上","%以下"],
        ID: 19,
        existX: true,
        existY: true,
        value: function (turn:number, tx:number[], before:number, after:number) {
            return (triggerList[findByTriggerID(4)].value(turn, tx, before, after)) && (triggerList[findByTriggerID(5)].value(turn, [tx[1], 0], before, after)) && turnCheck(turn, before, after);;
        }
    },
    {
        label: "回復回数〇回以上",
        parsedLabel: ["回復回数","回以上"],
        ID: 6,
        existX: true,
        existY: false,
        value: function (turn:number, tx:number[], before:number, after:number) {
            return status.RecoveryTimes >= tx[0] && turnCheck(turn, before, after);;
        }
    },
    {
        label: "Vocal UP〇個以上付与時",
        parsedLabel: ["Vocal UP","個以上付与時"],
        ID: 7,
        existX: true,
        existY: false,
        value: function (turn:number, tx:number[], before:number, after:number) {
            let numberOfBuff = 0;
            for(let i = 0; i < status.VisibleBuffs.length; i++) {
                if(status.VisibleBuffs[i].BuffID == 1) {
                    numberOfBuff++;
                }
            }
            return numberOfBuff >= tx[0] && turnCheck(turn, before, after);;
        }
    },
    {
        label: "Dance UP〇個以上付与時",
        parsedLabel: ["Dance UP","個以上付与時"],
        ID: 8,
        existX: true,
        existY: false,
        value: function (turn:number, tx:number[], before:number, after:number) {
            let numberOfBuff = 0;
            for(let i = 0; i < status.VisibleBuffs.length; i++) {
                if(status.VisibleBuffs[i].BuffID == 2) {
                    numberOfBuff++;
                }
            }
            return numberOfBuff >= tx[0] && turnCheck(turn, before, after);;
        }
    },
    {
        label: "Visual UP〇個以上付与時",
        parsedLabel: ["Visual UP","個以上付与時"],
        ID: 9,
        existX: true,
        existY: false,
        value: function (turn:number, tx:number[], before:number, after:number) {
            let numberOfBuff = 0;
            for(let i = 0; i < status.VisibleBuffs.length; i++) {
                if(status.VisibleBuffs[i].BuffID == 3) {
                    numberOfBuff++;
                }
            }
            return numberOfBuff >= tx[0] && turnCheck(turn, before, after);;
        }
    },
    {
        label: "VoDaViUP 全て付与時",
        parsedLabel: ["VoDaViUP 全て付与時"],
        ID: 10,
        existX: false,
        existY: false,
        value: function (turn:number, tx:number[], before:number, after:number) {
            let existVoBuff = false;
            let existDaBuff = false;
            let existViBuff = false;
            for(let i = 0; i < status.VisibleBuffs.length; i++) {
                if(status.VisibleBuffs[i].BuffID == 1) {
                    existVoBuff = true;
                }
                if(status.VisibleBuffs[i].BuffID == 2) {
                    existDaBuff = true;
                }
                if(status.VisibleBuffs[i].BuffID == 3) {
                    existViBuff = true;
                }
            }
            if(existVoBuff && existDaBuff && existViBuff) {
                return turnCheck(turn, before, after);;
            }else {
                return false
            }
        }
    },
    {
        label: "メンタルダメージカット付与時",
        parsedLabel: ["メンタルダメージカット付与時"],
        ID: 11,
        existX: false,
        existY: false,
        value: function (turn:number, tx:number[], before:number, after:number) {
            for(let i = 0; i < status.VisibleBuffs.length; i++) {
                if(status.VisibleBuffs[i].BuffID == 4) {
                    return turnCheck(turn, before, after);;
                }
            }
            return false;
        }
    },
    {
        label: "パッシブスキル発動率UP付与時",
        parsedLabel: ["パッシブスキル発動率UP付与時"],
        ID: 17,
        existX: false,
        existY: false,
        value: function (turn:number, tx:number[], before:number, after:number) {
            for(let i = 0; i < status.VisibleBuffs.length; i++) {
                if(status.VisibleBuffs[i].BuffID == 8) {
                    return turnCheck(turn, before, after);;
                }
            }
            return false;
        }
    },
    {
        label: "メランコリー付与時",
        parsedLabel: ["メランコリー付与時"],
        ID: 12,
        existX: false,
        existY: false,
        value: function (turn:number, tx:number[], before:number, after:number) {
            for(let i = 0; i < status.VisibleBuffs.length; i++) {
                if(status.VisibleBuffs[i].BuffID == 9) {
                    return turnCheck(turn, before, after);;
                }
            }
            return false;
        }
    },
    {
        label: "リラックス付与時",
        parsedLabel: ["リラックス付与時"],
        ID: 13,
        existX: false,
        existY: false,
        value: function (turn:number, tx:number[], before:number, after:number) {
            for(let i = 0; i < status.VisibleBuffs.length; i++) {
                if(status.VisibleBuffs[i].BuffID == 10) {
                    return turnCheck(turn, before, after);;
                }
            }
            return false;
        }
    },
    {
        label: "注目度 UP〇個以上付与時",
        parsedLabel: ["注目度 UP","個以上付与時"],
        ID: 14,
        existX: true,
        existY: false,
        value: function (turn:number, tx:number[], before:number, after:number) {
            let numberOfBuff = 0;
            for(let i = 0; i < status.VisibleBuffs.length; i++) {
                if(status.VisibleBuffs[i].BuffID == 6) {
                    numberOfBuff++;
                }
            }
            return numberOfBuff >= tx[0] && turnCheck(turn, before, after);;
        }
    },
    {
        label: "注目度 DOWN〇個以上付与時",
        parsedLabel: ["注目度 DOWN","個以上付与時"],
        ID: 15,
        existX: true,
        existY: false,
        value: function (turn:number, tx:number[], before:number, after:number) {
            let numberOfBuff = 0;
            for(let i = 0; i < status.VisibleBuffs.length; i++) {
                if(status.VisibleBuffs[i].BuffID == 7) {
                    numberOfBuff++;
                }
            }
            return numberOfBuff >= tx[0] && turnCheck(turn, before, after);;
        }
    },
    {
        label: "リアクション回避〇個以上付与時",
        parsedLabel: ["リアクション回避","個以上付与時"],
        ID: 16,
        existX: true,
        existY: false,
        value: function (turn:number, tx:number[], before:number, after:number) {
            let numberOfBuff = 0;
            for(let i = 0; i < status.VisibleBuffs.length; i++) {
                if(status.VisibleBuffs[i].BuffID == 11) {
                    numberOfBuff++;
                }
            }
            return numberOfBuff >= tx[0] && turnCheck(turn, before, after);;
        }
    }
]

// ターンの確認
const turnCheck = (turn:number, before:number, after:number):boolean => {
    const Turn = turn + 1
    return after <= Turn && before >= Turn
}

// IDの重複、未登録のチェック
const triggerListCheck = () => {
    const holder: trigger[] = []
    let holderIndex = 0;
    let holderCheck = false;
    let triggerListIndex = 0;
    let checkNumber: number = 1;
    let triggerCheck = true;
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
                    holder.push(triggerList[triggerListIndex]);
                    triggerListIndex++;
                    holderIndex = 0;
                    holderCheck = false;
                }
            }
        }
    }
    while (triggerCheck) {
        if (triggerList[triggerListIndex].ID == checkNumber) {
            // IDとcheckNumberが合っている場合。
            checkNumber++;
            triggerListIndex++;
        } else if (holder.length > 0) {
            searchInHolder();
        } else if (triggerListIndex < triggerList.length) {
            holder.push(triggerList[triggerListIndex]);
            triggerListIndex++;
        }
        // 終了動作
        if (triggerListIndex == triggerList.length) {
            if (holder.length > 0) {
                while (triggerListIndex == triggerList.length && checkNumber <= triggerList.length) {
                    searchInHolder()
                }
            }
            if (checkNumber > triggerList.length) {
                console.log("triggerListID complete")
                triggerCheck = false;
            } else {
                console.log("Next:" + checkNumber)
                console.log('errer [triggerListID]')
                triggerCheck = false;
            }

        }
    }
}
triggerListCheck();