// スキルの効果を設定したファイル
// 注目度、メンタルダメージ、回避など（予定）

import { pEffect, sEffect, sAppeal } from "./type";
import { status, defaultStatus, pushVisibleBuff, run } from "../event/simulate";
import * as visivleBuff from './visibleBuff'
import { duetList, idolList } from './idolList'
import { fesIdols } from "../event/vault";

visivleBuff.buffListCheck()

export const findByPassiveID = (id: number): number => {
    let seaechIndex = 0;
    while (true) {
        if (passiveEffect[seaechIndex].ID == id) {
            return seaechIndex;
        } else if (seaechIndex == passiveEffect.length) {
            console.log("No such passiveEffect ID:" + id)
            return 99
        }
        seaechIndex++;
    }
}

export const findByLiveEffectID = (id: number): number => {
    let seaechIndex = 0;
    while (true) {
        if (liveSkillEffect[seaechIndex].ID == id) {
            return seaechIndex;
        } else if (seaechIndex == liveSkillEffect.length) {
            console.log("No such liveEffect ID:" + id)
            return 99
        }
        seaechIndex++;
    }
}

export const findByAppealID = (id: number): number => {
    let seaechIndex = 0;
    while (true) {
        if (liveSkillAppeal[seaechIndex].ID == id) {
            return seaechIndex;
        } else if (seaechIndex == liveSkillAppeal.length) {
            console.log("No such liveAppeal ID:" + id)
            return 99
        }
        seaechIndex++;
    }
}

// パッシブの効果一覧
export const passiveEffect: pEffect[] = [
    {
        label: "なし",
        ID: 1,
        existN: false,
        value: function (value:number) {}
    },
    {
        label: "メンタル【N】％回復",
        ID: 2,
        existN: true,
        value: function (value:number) {
            status.MentalEffect += Math.floor(defaultStatus.Mental * value * 0.01);
        }
    },
    {
        label: "メンタルダメージ【N】％UP",
        ID: 3,
        existN: true,
        value: function (value:number) {
            status.DamageRatio *= (value * 0.01) + 1;
        }
    },
    {
        label: "メンタルダメージ【N】％CUT",
        ID: 4,
        existN: true,
        value: function (value:number) {
            status.DamageRatio *= 1 - (value * 0.01);
        }
    },
    {
        label: "思い出ゲージ【N】％UP",
        ID: 5,
        existN: true,
        value: function (value:number) {
            status.MemoryRize += value * 10;
        }
    },
    {
        label: "発動時に思い出ゲージ【N】％UP",
        ID: 8,
        existN: true,
        value: function (value:number) {
            status.MemoryGauge += Math.floor(value * 10 * status.MemoryRatio);
        }
    },
    {
        label: "注目度【N】％UP",
        ID: 6,
        existN: true,
        value: function (value:number) {
            status.Attention += value;
        }
    },
    {
        label: "注目度【N】％DOWN",
        ID: 7,
        existN: true,
        value: function (value:number) {
            status.Attention -= value;
        }
    },
    {
        label: "リアクション回避【N】％UP",
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
        ID: 1,
        variable: false,
        value: function () { }
    },
    {
        label: "アピール【N】倍",
        ID: 2,
        variable: false,
        value: function () { }
    },
    {
        label: "アピール(メンタルが多いほど)【N】倍",
        ID: 3,
        variable: true,
        value: function () { }
    },
    {
        label: "アピール(メンタルが少ないほど)【N】倍",
        ID: 4,
        variable: true,
        value: function () { }
    },
    {
        label: "アピール(思い出ゲージが多いほど)【N】倍",
        ID: 5,
        variable: true,
        value: function () { }
    },
    {
        label: "アピール(注目度が高いほど)【N】倍",
        ID: 6,
        variable: true,
        value: function () { }
    },
    {
        label: "アピール(注目度が低いほど)【N】倍",
        ID: 7,
        variable: true,
        value: function () { }
    },
    {
        label: "アピール(回復回数が多いほど)【N】倍",
        ID: 8,
        variable: true,
        value: function () { }
    },
]

export const buffLastID = 19;
// ライブスキルの効果一覧
export const liveSkillEffect: sEffect[] = [
    {
        label: "なし",
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
        ID: 2,
        existN: false,
        existM: false,
        existTurn: false,
        existTime: false,
        existNote: false,
        existAttribute: false,
        value: function (value:number, turn:number) {
            if(value > idolList.length - 1) {
                status.AppealLog.push(duetList[value].Unit[Math.floor(Math.random() * duetList[value].Unit.length)]);
            }else {
                status.AppealLog.push(value);
            }
        }
    },
    {
        label: "【N】%UP",
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
        label: "メンタル【M】%減らし最大【N】%UP",
        ID: 19,
        existN: true,
        existM: true,
        existTurn: true,
        existTime: false,
        existNote: false,
        existAttribute: true,
        value: function (value:number, turn:number, note:string, deleteMental:number) {
            // 未実装
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
        label: "メンタル【N】％回復",
        ID: 3,
        existN: true,
        existM: false,
        existTurn: false,
        existTime: false,
        existNote: false,
        existAttribute: false,
        value: function (value:number, turn:number) {
            status.MentalEffect += Math.floor(defaultStatus.Mental * (value * 0.01));
        }
    },
    {
        label: "メンタル【N】％回復[超過思い出変換]",
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
                console.log(Math.floor(((status.Mental + status.MentalEffect - defaultStatus.Mental)/defaultStatus.Mental) * 1000));
                status.MemoryRize += Math.floor(((status.Mental + status.MentalEffect - defaultStatus.Mental)/defaultStatus.Mental) * 1000);
            }
        }
    },
    {
        label: "メンタルダメージ【N】％UP",
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
        label: "メンタルダメージ【N】％CUT",
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
        label: "思い出ゲージ【N】％UP",
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
        label: "注目度【N】％UP",
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
        label: "注目度【N】％DOWN",
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
        label: "パッシブ発動率【N】％",
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
        label: "リザレクション効果【N】％付与",
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
        label: "影響力【N】％UP",
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
        label: "影響力【N】％DOWN",
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
        label: "リラックス効果【N】％付与",
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
        label: "リアクション回避【N】％UP",
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
        label: "【M】ターンの間 回避時【N】％UP",
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
        label: "【M】ターンの間 ダメージ時【N】％UP",
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

