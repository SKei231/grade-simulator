// スキルの効果を設定したファイル
// 注目度、メンタルダメージ、回避など（予定）

import { pEffect, sEffect, sAppeal } from "./type";
import { status, defaultStatus, pushVisibleBuff, appealLogPush } from "../event/simulate";
import * as visivleBuff from './visibleBuff'
import { duetList, getUnitMember, idolList } from './idolList'
import * as vault from '../event/vault'

visivleBuff.buffListCheck()

export const findByPassiveID = (id: number): number => {
    let seaechIndex = 0;
    while (true) {
        if (seaechIndex == passiveEffect.length) {
            console.log("No such passiveEffect ID:" + id)
            return 99
        }else if (passiveEffect[seaechIndex].ID == id) {
            return seaechIndex;
        }
        seaechIndex++;
    }
}

export const findByLiveEffectID = (id: number): number => {
    let seaechIndex = 0;
    while (true) {
        if (seaechIndex == liveSkillEffect.length) {
            console.log("No such liveEffect ID:" + id)
            return 99
        }else if (liveSkillEffect[seaechIndex].ID == id) {
            return seaechIndex;
        }
        seaechIndex++;
    }
}

export const findByAppealID = (id: number): number => {
    let seaechIndex = 0;
    while (true) {
        if (seaechIndex == liveSkillAppeal.length) {
            console.log("No such liveAppeal ID:" + id)
            return 1
        }else if (liveSkillAppeal[seaechIndex].ID == id) {
            return seaechIndex;
        }
        seaechIndex++;
    }
}

// パッシブの効果一覧
export const passiveEffect: pEffect[] = [
    {
        label: "なし",
        parsedLabel: ["なし"],
        ID: 1,
        existN: false,
        value: function (value:number) {}
    },
    {
        label: "(その他の属性)〇%UP",
        parsedLabel: ["その他の属性","%UP"],
        ID: 10,
        existN: true,
        value: function (value:number, attribute:string) {
            if(attribute == 'Vo') {
                status.Buff.Passive.pDa += value;
                status.Buff.Passive.pVi += value;
            }else if(attribute == 'Da') {
                status.Buff.Passive.pVo += value;
                status.Buff.Passive.pVi += value;
            }else if(attribute == 'Vi') {
                status.Buff.Passive.pDa += value;
                status.Buff.Passive.pVo += value;
            }
        }
    },
    {
        label: "メンタル〇%回復",
        parsedLabel: ["メンタル","%回復"],
        ID: 2,
        existN: true,
        value: function (value:number) {
            status.MentalEffect += Math.floor(defaultStatus.Mental * value * 0.01);
            status.RecoveryTimesIncreases++;
        }
    },
    {
        label: "メンタルダメージ〇%UP",
        parsedLabel: ["メンタルダメージ","%UP"],
        ID: 3,
        existN: true,
        value: function (value:number) {
            status.DamageRatio *= (value * 0.01) + 1;
        }
    },
    {
        label: "メンタルダメージ〇%CUT",
        parsedLabel: ["メンタルダメージ","%CUT"],
        ID: 4,
        existN: true,
        value: function (value:number) {
            status.DamageRatio *= 1 - (value * 0.01);
        }
    },
    {
        label: "思い出ゲージ〇%UP",
        parsedLabel: ["思い出ゲージ","%UP"],
        ID: 5,
        existN: true,
        value: function (value:number) {
            status.MemoryRize += value * 10;
        }
    },
    {
        label: "発動時に思い出ゲージ〇%UP",
        parsedLabel: ["発動時に思い出ゲージ","%UP"],
        ID: 8,
        existN: true,
        value: function (value:number) {
            status.MemoryGauge += Math.floor(value * 10 * status.MemoryRatio);
        }
    },
    {
        label: "注目度〇%UP",
        parsedLabel: ["注目度","%UP"],
        ID: 6,
        existN: true,
        value: function (value:number) {
            status.Attention += value;
        }
    },
    {
        label: "注目度〇%DOWN",
        parsedLabel: ["注目度","%DOWN"],
        ID: 7,
        existN: true,
        value: function (value:number) {
            status.Attention -= value;
        }
    },
    {
        label: "リアクション回避〇%UP",
        parsedLabel: ["リアクション回避","%UP"],
        ID: 9,
        existN: true,
        value: function (value:number) {
            pushVisibleBuff(20, 1, value, 0, 0);
        }
    }
]

// ライブスキルのアピール一覧
export const liveSkillAppeal: sAppeal[] = [
    {
        label: "なし",
        parsedLabel: [""],
        ID: 1,
        variable: false,
        ratioLabel: "",
        init: 0,
        value: function (value:number, ratio:number) {
            return 0;
        }
    },
    {
        label: "〇倍アピール",
        parsedLabel: ["倍アピール"],
        ID: 2,
        variable: false,
        ratioLabel: "",
        init: 0,
        value: function (value:number, ratio:number) {
            return value;
        }
    },
    {
        label: "〇倍アピール[スキル履歴が多いほど]",
        parsedLabel: ["倍アピール","[スキル履歴が多いほど]"],
        ID: 13,
        variable: true,
        ratioLabel: "履歴人数(人)",
        init: 5,
        value: function (value:number, ratio:number) {
            let returnValue = value * (0.2 * (ratio - 1) + 0.2);
            if(returnValue > value) {
                returnValue = value;
            }else if(returnValue < value * 0.2) {
                returnValue = value * 0.2;
            }
            return returnValue;
        }
    },
    {
        label: "〇倍アピール[メンタルが多いほど]",
        parsedLabel: ["倍アピール","[メンタルが多いほど]"],
        ID: 3,
        variable: true,
        ratioLabel: "Me(実数)",
        init: 1000,
        value: function (value:number, ratio:number) {
            let returnValue = value * (1.6 * (ratio / vault.staticStatus.Me) - 0.6);
            if(returnValue < value * 0.2) {
                returnValue = value * 0.2;
            }else if(returnValue < value * 0.2) {
                returnValue = value * 0.2;
            }
            return returnValue;
        }
    },
    {
        label: "〇倍アピール[メンタルが少ないほど]",
        parsedLabel: ["倍アピール","[メンタルが少ないほど]"],
        ID: 4,
        variable: true,
        ratioLabel: "Me(実数)",
        init: 1,
        value: function (value:number, ratio:number) {
            let returnValue = value * (-0.8 * (ratio / vault.staticStatus.Me) + 1);
            if(ratio == 1) {
                returnValue = value;
            }else if(returnValue < value * 0.2) {
                returnValue = value * 0.2;
            }
            return returnValue;
        }
    },
    {
        label: "〇倍アピール[思い出ゲージが多いほど]",
        parsedLabel: ["倍アピール","[思い出ゲージが多いほど]"],
        ID: 5,
        variable: true,
        ratioLabel: "思い出ゲージ(%)",
        init: 100,
        value: function (value:number, ratio:number) {
            let returnValue = value * (0.8 * (ratio / 100) + 0.2);
            if(returnValue > value) {
                returnValue = value;
            }else if(returnValue < value * 0.2) {
                returnValue = value * 0.2;
            }
            return returnValue;
        }
    },
    {
        label: "〇倍アピール[注目度が高いほど]",
        parsedLabel: ["倍アピール","[注目度が高いほど]"],
        ID: 6,
        variable: true,
        ratioLabel: "注目度(%)",
        init: 200,
        value: function (value:number, ratio:number) {
            let returnValue = value * (0.4 * (ratio / 100) + 0.2);
            if(returnValue > value) {
                returnValue = value;
            }else if(returnValue < value * 0.2) {
                returnValue = value * 0.2;
            }
            return returnValue;
        }
    },
    {
        label: "〇倍アピール[注目度が低いほど]",
        parsedLabel: ["倍アピール","[注目度が低いほど]"],
        ID: 7,
        variable: true,
        ratioLabel: "注目度(%)",
        init: -50,
        value: function (value:number, ratio:number) {
            let returnValue = value * (-0.8 * (ratio / 100) + 0.2);
            if(returnValue > value) {
                returnValue = value;
            }else if(returnValue < value * 0.2) {
                returnValue = value * 0.2;
            }
            return returnValue;
        }
    },
    {
        label: "〇倍アピール[回復回数が多いほど]",
        parsedLabel: ["倍アピール","[回復回数が多いほど]"],
        ID: 8,
        variable: true,
        ratioLabel: "回復回数(回)",
        init: 8,
        value: function (value:number, ratio:number) {
            let returnValue = value * 0.2 * (1 + ratio);
            if(returnValue > value) {
                returnValue = value;
            }else if(returnValue < value * 0.2) {
                returnValue = value * 0.2;
            }
            return returnValue;
        }
    },
    {
        label: "〇倍アピール[属性UP消去]",
        parsedLabel: ["倍アピール","[属性UP消去]"],
        ID: 9,
        variable: true,
        ratioLabel: "アピールUP(個)",
        init: 4,
        value: function (value:number, ratio:number) {
            let returnValue = value * (0.2 * ratio + 0.2);
            if(returnValue > value) {
                returnValue = value;
            }else if(returnValue < value * 0.2) {
                returnValue = value * 0.2;
            }
            return returnValue;
        }
    },
    {
        label: "〇倍アピール[属性DOWN消去]",
        parsedLabel: ["倍アピール","[属性DOWN消去]"],
        ID: 11,
        variable: true,
        ratioLabel: "アピールDOWN(個)",
        init: 4,
        value: function (value:number, ratio:number) {
            let returnValue = value * (0.2 * ratio + 0.2);
            if(returnValue > value) {
                returnValue = value;
            }else if(returnValue < value * 0.2) {
                returnValue = value * 0.2;
            }
            return returnValue;
        }
    },
    {
        label: "〇倍アピール[属性強化]",
        parsedLabel: ["倍アピール","[属性強化]"],
        ID: 10,
        variable: false,
        ratioLabel: "",
        init: 0,
        value: function (value:number, ratio:number) {
            return value;
        }
    },
    {
        label: "〇倍アピール[回避率が高いほど]",
        parsedLabel: ["倍アピール","[回避率が高いほど]"],
        ID: 12,
        variable: true,
        ratioLabel: "回避率(%)",
        init: 0,
        value: function (value:number, ratio:number) {
            let returnValue = value * (0.8 * (ratio / 100) + 0.2);
            if(returnValue > value) {
                returnValue = value;
            }else if(returnValue < value * 0.2) {
                returnValue = value * 0.2;
            }
            return returnValue;
        }
    },
]

export const buffLastID = 19;
// ライブスキルの効果一覧
export const liveSkillEffect: sEffect[] = [
    {
        label: "なし",
        parsedLabel: ["なし"],
        ID: 1,
        existN: false,
        existM: false,
        existTurn: false,
        existTime: false,
        existNote: false,
        existAttribute: false,
        value: function (value:number, turn:number) {}
    },
    {
        label: "デュエット",
        parsedLabel: ["デュエット"],
        ID: 2,
        existN: false,
        existM: false,
        existTurn: false,
        existTime: false,
        existNote: false,
        existAttribute: false,
        value: function (value:number, turn:number) {
            if(value < 26 || value == 33) {
                appealLogPush(value);
            }else {
                let unitList:number[];
                if(value == 38) { // コメティック専用
                    unitList = getUnitMember(9);
                }else {
                    unitList = getUnitMember(value - 24);
                }
                appealLogPush(unitList[Math.floor(Math.random() * unitList.length)]);
            }
        }
    },
    {
        label: "属性〇%UP",
        parsedLabel: ["", "%UP"],
        ID: 18,
        existN: true,
        existM: false,
        existTurn: true,
        existTime: false,
        existNote: false,
        existAttribute: true,
        value: function (value:number, turn:number, note:string, ) {
            let attribute = 0;
            if(note == "Vo") {
                attribute = 1;
            }else if(note == "Da") {
                attribute = 2;
            }else if(note == "Vi") {
                attribute = 3;
            }
            if(attribute != 0) {
                pushVisibleBuff(attribute, turn, value, 0 ,0);
            }
        }
    },
    {
        label: "属性〇%DOWN",
        parsedLabel: ["", "%DOWN"],
        ID: 20,
        existN: true,
        existM: false,
        existTurn: true,
        existTime: false,
        existNote: false,
        existAttribute: true,
        value: function (value:number, turn:number, note:string, ) {
            let attribute = 0;
            if(note == "Vo") {
                attribute = 22;
            }else if(note == "Da") {
                attribute = 23;
            }else if(note == "Vi") {
                attribute = 24;
            }
            if(attribute != 0) {
                pushVisibleBuff(attribute, turn, value, 0 ,0);
            }
        }
    },
    {
        label: "メンタル〇%減らし最大△%UP",
        parsedLabel: ["メンタル", "%減らし最大","%UP"],
        ID: 19,
        existN: true,
        existM: true,
        existTurn: true,
        existTime: false,
        existNote: false,
        existAttribute: true,
        value: function (value:number, turn:number, note:string, deleteMental:number) {
            let buffValue = 0;
            const dMental = Math.floor(status.Mental * deleteMental * 0.01);
            if(dMental <= 500) {
                buffValue = Math.floor(value * 0.02);
            }else if(dMental < 1000) {
                buffValue = Math.floor(value * (0.00196 * dMental - 0.96));
            }else {
                buffValue = value;
            }
            let attribute = 0;
            if(note == "Vo") {
                attribute = 1;
            }else if(note == "Da") {
                attribute = 2;
            }else if(note == "Vi") {
                attribute = 3;
            }
            if(attribute != 0) {
                console.log(buffValue)
                pushVisibleBuff(attribute, turn, buffValue, 0 ,0);
            }
        }
    },
    {
        label: "メンタル〇%回復",
        parsedLabel: ["メンタル", "%回復"],
        ID: 3,
        existN: true,
        existM: false,
        existTurn: false,
        existTime: false,
        existNote: false,
        existAttribute: false,
        value: function (value:number, turn:number) {
            status.MentalEffect += Math.floor(defaultStatus.Mental * (value * 0.01));
            status.RecoveryTimesIncreases++;
        }
    },
    {
        label: "メンタル〇%回復[超過思い出変換]",
        parsedLabel: ["メンタル", "%回復[超過思い出変換]"],
        ID: 4,
        existN: true,
        existM: false,
        existTurn: false,
        existTime: false,
        existNote: false,
        existAttribute: false,
        value: function (value:number, turn:number) {
            status.MentalEffect += Math.floor(defaultStatus.Mental * (value * 0.01));
            if(status.Mental + status.MentalEffect - defaultStatus.Mental > 0) {
                status.MemoryRize += Math.ceil(((status.Mental + status.MentalEffect - defaultStatus.Mental)/defaultStatus.Mental) * 100) * 10; // 小数点以下切り上げ
                status.RecoveryTimesIncreases++;
            }
        }
    },
    {
        label: "メンタルダメージ〇%UP",
        parsedLabel: ["メンタルダメージ", "%UP"],
        ID: 5,
        existN: true,
        existM: false,
        existTurn: true,
        existTime: false,
        existNote: false,
        existAttribute: false,
        value: function (value:number, turn:number) {
            pushVisibleBuff(5, turn, value, 0, 0);
        }
    },
    {
        label: "メンタルダメージ〇%CUT",
        parsedLabel: ["メンタルダメージ", "%CUT"],
        ID: 6,
        existN: true,
        existM: false,
        existTurn: true,
        existTime: false,
        existNote: false,
        existAttribute: false,
        value: function (value:number, turn:number) {
            pushVisibleBuff(4, turn, value, 0, 0);
        }
    },
    {
        label: "思い出ゲージ〇%UP",
        parsedLabel: ["思い出ゲージ", "%UP"],
        ID: 7,
        existN: true,
        existM: false,
        existTurn: false,
        existTime: false,
        existNote: false,
        existAttribute: false,
        value: function (value:number, turn:number) {
            status.MemoryRize += value * 10;
        }
    },
    {
        label: "注目度〇%UP",
        parsedLabel: ["注目度", "%UP"],
        ID: 8,
        existN: true,
        existM: false,
        existTurn: true,
        existTime: false,
        existNote: false,
        existAttribute: false,
        value: function (value:number, turn:number) {
            pushVisibleBuff(6, turn, value, 0, 0);
        }
    },
    {
        label: "注目度〇%DOWN",
        parsedLabel: ["注目度", "%DOWN"],
        ID: 9,
        existN: true,
        existM: false,
        existTurn: true,
        existTime: false,
        existNote: false,
        existAttribute: false,
        value: function (value:number, turn:number) {
            pushVisibleBuff(7, turn, value, 0, 0);
        }
    },
    {
        label: "パッシブスキル発動率〇%UP",
        parsedLabel: ["パッシブスキル発動率", "%UP"],
        ID: 10,
        existN: true,
        existM: false,
        existTurn: true,
        existTime: false,
        existNote: false,
        existAttribute: false,
        value: function (value:number, turn:number) {
            pushVisibleBuff(8, turn, value, 0, 0);
        }
    },
    {
        label: "リザレクション効果〇%付与",
        parsedLabel: ["リザレクション効果", "%付与"],
        ID: 11,
        existN: true,
        existM: false,
        existTurn: true,
        existTime: true,
        existNote: false,
        existAttribute: false,
        value: function (value:number, turn:number, time:number) {
            pushVisibleBuff(21, turn, value, time, 0);
        }
    },
    {
        label: "影響力〇%UP",
        parsedLabel: ["影響力", "%UP"],
        ID: 12,
        existN: true,
        existM: false,
        existTurn: true,
        existTime: false,
        existNote: false,
        existAttribute: false,
        value: function (value:number, turn:number) {
            pushVisibleBuff(18, turn, value, 0, 0);
        }
    },
    {
        label: "影響力〇%DOWN",
        parsedLabel: ["影響力", "%DOWN"],
        ID: 13,
        existN: true,
        existM: false,
        existTurn: true,
        existTime: false,
        existNote: false,
        existAttribute: false,
        value: function (value:number, turn:number) {
            pushVisibleBuff(19, turn, value, 0, 0);
        }
    },
    {
        label: "リラックス効果〇%付与",
        parsedLabel: ["リラックス効果", "%付与"],
        ID: 14,
        existN: true,
        existM: false,
        existTurn: true,
        existTime: false,
        existNote: false,
        existAttribute: false,
        value: function (value:number, turn:number) {
            pushVisibleBuff(10, turn, value, 0, 0);
        }
    },
    {
        label: "リアクション回避〇%UP",
        parsedLabel: ["リアクション回避", "%UP"],
        ID: 15,
        existN: true,
        existM: false,
        existTurn: true,
        existTime: false,
        existNote: false,
        existAttribute: false,
        value: function (value:number, turn:number) {
            pushVisibleBuff(11, turn, value, 0, 0);
        }
    },
    {
        label: "属性〇%UP[ダメージを受けるまで]",
        parsedLabel: ["", "%UP[ダメージを受けるまで]"],
        ID: 21,
        existN: true,
        existM: false,
        existTurn: false,
        existTime: false,
        existNote: false,
        existAttribute: true,
        value: function (value:number, turn:number, note:string, ) {
            let attribute = 0;
            if(note == "Vo") {
                attribute = 25;
            }else if(note == "Da") {
                attribute = 26;
            }else if(note == "Vi") {
                attribute = 27;
            }
            if(attribute != 0) {
                pushVisibleBuff(attribute, 10, value, 0 ,0);
                pushVisibleBuff(28, 10, value, 1, 0)
            }
        }
    },
    {
        label: "〇ターンの間 回避時△%UP",
        parsedLabel: ["","ターンの間 回避時", "%UP"],
        ID: 16,
        existN: true,
        existM: true,
        existTurn: true,
        existTime: true,
        existNote: true,
        existAttribute: true,
        value: function (value:number, turn:number, Mturn:number, time:number, note:string) {
            let attribute = 0;
            if(note == "Vo") {
                attribute = 12;
            }else if(note == "Da") {
                attribute = 13;
            }else if(note == "Vi") {
                attribute = 14;
            }
            if(attribute != 0) {
                pushVisibleBuff(attribute, Mturn, value, time, turn);
            }
        }
    },
    {
        label: "〇ターンの間 ダメージ時△%UP",
        parsedLabel: ["","ターンの間 ダメージ時", "%UP"],
        ID: 17,
        existN: true,
        existM: true,
        existTurn: true,
        existTime: true,
        existNote: true,
        existAttribute: true,
        value: function (value:number, turn:number, Mturn:number, time:number, note:string) {
            let attribute = 0;
            if(note == "Vo") {
                attribute = 15;
            }else if(note == "Da") {
                attribute = 16;
            }else if(note == "Vi") {
                attribute = 17;
            }
            if(attribute != 0) {
                pushVisibleBuff(attribute, Mturn, value, time, turn);
            }
        }
    },
]

// IDの重複、未登録のチェック
const pasEffectListCheck = () => {
    const holder: pEffect[] = []
    let holderIndex = 0;
    let holderCheck = false;
    let pasEffectListIndex = 0;
    let checkNumber: number = 1;
    let pasEffectCheck = true;
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
                    holder.push(passiveEffect[pasEffectListIndex]);
                    pasEffectListIndex++;
                    holderIndex = 0;
                    holderCheck = false;
                }
            }
        }
    }
    while (pasEffectCheck) {
        if (passiveEffect[pasEffectListIndex].ID == checkNumber) {
            // IDとcheckNumberが合っている場合。
            checkNumber++;
            pasEffectListIndex++;
        } else if (holder.length > 0) {
            searchInHolder();
        } else if (pasEffectListIndex < passiveEffect.length) {
            holder.push(passiveEffect[pasEffectListIndex]);
            pasEffectListIndex++;
        }
        // 終了動作
        if (pasEffectListIndex == passiveEffect.length) {
            if (holder.length > 0) {
                while (pasEffectListIndex == passiveEffect.length && checkNumber <= passiveEffect.length) {
                    searchInHolder()
                }
            }
            if (checkNumber > passiveEffect.length) {
                console.log("passiveEffectListID complete")
                pasEffectCheck = false;
            } else {
                console.log('errer [pasiveEffectListID]')
                console.log("pEID Next:" + checkNumber)
                pasEffectCheck = false;
            }

        }
    }
}
pasEffectListCheck();

// IDの重複、未登録のチェック
const liveSkillAppealListCheck = () => {
    const holder: sAppeal[] = []
    let holderIndex = 0;
    let holderCheck = false;
    let liveSkillAppealListIndex = 0;
    let checkNumber: number = 1;
    let liveSkillAppealCheck = true;
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
                    holder.push(liveSkillAppeal[liveSkillAppealListIndex]);
                    liveSkillAppealListIndex++;
                    holderIndex = 0;
                    holderCheck = false;
                }
            }
        }
    }
    while (liveSkillAppealCheck) {
        if (liveSkillAppeal[liveSkillAppealListIndex].ID == checkNumber) {
            // IDとcheckNumberが合っている場合。
            checkNumber++;
            liveSkillAppealListIndex++;
        } else if (holder.length > 0) {
            searchInHolder();
        } else if (liveSkillAppealListIndex < liveSkillAppeal.length) {
            holder.push(liveSkillAppeal[liveSkillAppealListIndex]);
            liveSkillAppealListIndex++;
        }
        // 終了動作
        if (liveSkillAppealListIndex == liveSkillAppeal.length) {
            if (holder.length > 0) {
                while (liveSkillAppealListIndex == liveSkillAppeal.length && checkNumber <= liveSkillAppeal.length) {
                    searchInHolder()
                }
            }
            if (checkNumber > liveSkillAppeal.length) {
                console.log("liveSkillAppealListID complete")
                liveSkillAppealCheck = false;
            } else {
                console.log('errer [liveSkillAppealListID]')
                console.log("pEID Next:" + checkNumber)
                liveSkillAppealCheck = false;
            }

        }
    }
}
liveSkillAppealListCheck();

// IDの重複、未登録のチェック
const liveSkillEffectListCheck = () => {
    const holder: sEffect[] = []
    let holderIndex = 0;
    let holderCheck = false;
    let liveSkillEffectListIndex = 0;
    let checkNumber: number = 1;
    let liveSkillEffectCheck = true;
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
                    holder.push(liveSkillEffect[liveSkillEffectListIndex]);
                    liveSkillEffectListIndex++;
                    holderIndex = 0;
                    holderCheck = false;
                }
            }
        }
    }
    while (liveSkillEffectCheck) {
        if (liveSkillEffect[liveSkillEffectListIndex].ID == checkNumber) {
            // IDとcheckNumberが合っている場合。
            checkNumber++;
            liveSkillEffectListIndex++;
        } else if (holder.length > 0) {
            searchInHolder();
        } else if (liveSkillEffectListIndex < liveSkillEffect.length) {
            holder.push(liveSkillEffect[liveSkillEffectListIndex]);
            liveSkillEffectListIndex++;
        }
        // 終了動作
        if (liveSkillEffectListIndex == liveSkillEffect.length) {
            if (holder.length > 0) {
                while (liveSkillEffectListIndex == liveSkillEffect.length && checkNumber <= liveSkillEffect.length) {
                    searchInHolder()
                }
            }
            if (checkNumber > liveSkillEffect.length) {
                console.log("liveSkillEffectListID complete")
                liveSkillEffectCheck = false;
            } else {
                console.log('errer [liveSkillEffectListID]')
                console.log("pEID Next:" + checkNumber)
                liveSkillEffectCheck = false;
            }

        }
    }
}
liveSkillEffectListCheck();

