// パッシブ発動条件を設定したファイル
import { trigger } from "./type"
import { status, defaultStatus } from "../event/simulate"
import { passiveSkills } from "../event/vault"

export const triggerCheck = (ID: number) => {
    return triggerList[findByTriggerID(ID)].value()
}

export const findByTriggerID = (ID: number): number => {
    let seaechIndex = 0;
    while (true) {
        if (triggerList[seaechIndex].ID == ID) {
            return seaechIndex;
        } else if (seaechIndex == triggerList.length) {
            return 0
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
        label: "なし・達成済",
        ID: 1,
        existX: false,
        value: function (turn:number, index:number) {
            return turnCheck(turn, index);
        }
    },
    {
        label: "履歴〇〇がある場合",
        ID: 2,
        existX: false,
        value: function (turn:number ,index:number) {
            if(status.AppealLog.length == 0) {
                console.log("0");
                return false;
            }else {
                let checker = true;
                let scanningIndex = 0;
                while(checker) {
                    for(let i = 0; i < status.AppealLog.length; i++) {
                        if(status.AppealLog[i] == passiveSkills[index].Trigger.tHis[scanningIndex]) {
                            scanningIndex++;
                            checker = false;
                        }
                    }
                    if(checker) { // 履歴のヒットがなかった場合
                        return false;
                    }else if(scanningIndex == passiveSkills[index].Trigger.tHis.length){ // 履歴全てがヒットした場合
                        return turnCheck(turn, index);
                    }else {
                        checker = true;
                    }
                }
            }
        }
    },
    {
        label: "履歴〇〇または【X】ターン以降",
        ID: 3,
        existX: true,
        value: function (turn:number, index:number) {
            if(turn + 1 >= passiveSkills[index].Trigger.tX) {
                return turnCheck(turn, index);
            }else {
                return triggerList[findByTriggerID(2)].value(turn, index);
            }
        }
    },
    {
        label: "メンタル【X】％以上",
        ID: 4,
        existX: true,
        value: function (turn:number, index:number) {// 小数点第二位の四捨五入（以上のみ）
            return Math.round((status.Mental / defaultStatus.Mental) * 1000) / 10 >= passiveSkills[index].Trigger.tX && turnCheck(turn, index);
        }
    },
    {
        label: "メンタル【X】％以下",
        ID: 5,
        existX: true,
        value: function (turn:number, index:number) {
            return ((status.Mental / defaultStatus.Mental) * 100 <= passiveSkills[index].Trigger.tX) && turnCheck(turn, index);
        }
    },
    {
        label: "回復回数【X】回以上",
        ID: 6,
        existX: true,
        value: function (turn:number, index:number) {
            return status.RecoveryTimes >= passiveSkills[index].Trigger.tX && turnCheck(turn, index);
        }
    },
    {
        label: "Vocal UP【X】個以上付与時",
        ID: 7,
        existX: true,
        value: function (turn:number, index:number) {
            let numberOfBuff = 0;
            for(let i = 0; i < status.VisibleBuffs.length; i++) {
                if(status.VisibleBuffs[i].BuffID == 1) {
                    numberOfBuff++;
                }
            }
            return numberOfBuff >= passiveSkills[index].Trigger.tX && turnCheck(turn, index);
        }
    },
    {
        label: "Dance UP【X】個以上付与時",
        ID: 8,
        existX: true,
        value: function (turn:number, index:number) {
            let numberOfBuff = 0;
            for(let i = 0; i < status.VisibleBuffs.length; i++) {
                if(status.VisibleBuffs[i].BuffID == 2) {
                    numberOfBuff++;
                }
            }
            return numberOfBuff >= passiveSkills[index].Trigger.tX && turnCheck(turn, index);
        }
    },
    {
        label: "Visual UP【X】個以上付与時",
        ID: 9,
        existX: true,
        value: function (turn:number, index:number) {
            let numberOfBuff = 0;
            for(let i = 0; i < status.VisibleBuffs.length; i++) {
                if(status.VisibleBuffs[i].BuffID == 3) {
                    numberOfBuff++;
                }
            }
            return numberOfBuff >= passiveSkills[index].Trigger.tX && turnCheck(turn, index);
        }
    },
    {
        label: "VoDaVi 全て付与時",
        ID: 10,
        existX: false,
        value: function (turn:number, index:number) {
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
                return turnCheck(turn, index);
            }else {
                return false
            }
        }
    },
    {
        label: "メンタルダメージカット付与時",
        ID: 11,
        existX: false,
        value: function (turn:number, index:number) {
            for(let i = 0; i < status.VisibleBuffs.length; i++) {
                if(status.VisibleBuffs[i].BuffID == 4) {
                    return turnCheck(turn, index);
                }
            }
            return false;
        }
    },
    {
        label: "パッシブスキル発動率UP付与時",
        ID: 17,
        existX: false,
        value: function (turn:number, index:number) {
            for(let i = 0; i < status.VisibleBuffs.length; i++) {
                if(status.VisibleBuffs[i].BuffID == 8) {
                    return turnCheck(turn, index);
                }
            }
            return false;
        }
    },
    {
        label: "メランコリー付与時",
        ID: 12,
        existX: false,
        value: function (turn:number, index:number) {
            for(let i = 0; i < status.VisibleBuffs.length; i++) {
                if(status.VisibleBuffs[i].BuffID == 9) {
                    return turnCheck(turn, index);
                }
            }
            return false;
        }
    },
    {
        label: "リラックス付与時",
        ID: 13,
        existX: false,
        value: function (turn:number, index:number) {
            for(let i = 0; i < status.VisibleBuffs.length; i++) {
                if(status.VisibleBuffs[i].BuffID == 10) {
                    return turnCheck(turn, index);
                }
            }
            return false;
        }
    },
    {
        label: "注目度 UP【X】個以上付与時",
        ID: 14,
        existX: true,
        value: function (turn:number, index:number) {
            let numberOfBuff = 0;
            for(let i = 0; i < status.VisibleBuffs.length; i++) {
                if(status.VisibleBuffs[i].BuffID == 6) {
                    numberOfBuff++;
                }
            }
            return numberOfBuff >= passiveSkills[index].Trigger.tX && turnCheck(turn, index);
        }
    },
    {
        label: "注目度 DOWN【X】個以上付与時",
        ID: 15,
        existX: true,
        value: function (turn:number, index:number) {
            let numberOfBuff = 0;
            for(let i = 0; i < status.VisibleBuffs.length; i++) {
                if(status.VisibleBuffs[i].BuffID == 7) {
                    numberOfBuff++;
                }
            }
            return numberOfBuff >= passiveSkills[index].Trigger.tX && turnCheck(turn, index);
        }
    },
    {
        label: "リアクション回避【X】個以上付与時",
        ID: 16,
        existX: true,
        value: function (turn:number, index:number) {
            let numberOfBuff = 0;
            for(let i = 0; i < status.VisibleBuffs.length; i++) {
                if(status.VisibleBuffs[i].BuffID == 11) {
                    numberOfBuff++;
                }
            }
            return numberOfBuff >= passiveSkills[index].Trigger.tX && turnCheck(turn, index);
        }
    }
]

// ターンの確認
const turnCheck = (turn:number, index:number):boolean => {
    const Turn = turn + 1
    return passiveSkills[index].ActiveTurn.after <= Turn && passiveSkills[index].ActiveTurn.before >= Turn
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
                console.log("triggerListID is all correct")
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