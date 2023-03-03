// スキルの効果を設定したファイル
// 注目度、メンタルダメージ、回避など（予定）

import { pEffect, sEffect, sAppeal } from "./type";
import { status, defaultStatus, pushVisibleBuff } from "../event/simulate";


export const findByPassiveID = (id: number): number => {
    let seaechIndex = 0;
    while (true) {
        if (passiveEffect[seaechIndex].ID == id) {
            return seaechIndex;
        } else if (seaechIndex == passiveEffect.length) {
            return 99
        }
        seaechIndex++;
    }
}

export const findBySkillID = (id: number): number => {
    let seaechIndex = 0;
    while (true) {
        if (liveSkillEffect[seaechIndex].ID == id) {
            return seaechIndex;
        } else if (seaechIndex == liveSkillEffect.length) {
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
        value: function () {}
    },
    {
        label: "メンタル【N】％回復",
        ID: 2,
        existN: true,
        value: function () {}
    },
    {
        label: "メンタルダメージ【N】％UP",
        ID: 3,
        existN: true,
        value: function () { }
    },
    {
        label: "メンタルダメージ【N】％CUT",
        ID: 4,
        existN: true,
        value: function () { }
    },
    {
        label: "思い出ゲージ【N】％UP",
        ID: 5,
        existN: true,
        value: function () { }
    },
    {
        label: "発動時に思い出ゲージ【N】％UP",
        ID: 8,
        existN: true,
        value: function () { }
    },
    {
        label: "注目度【N】％UP",
        ID: 6,
        existN: true,
        value: function () { }
    },
    {
        label: "注目度【N】％DOWN",
        ID: 7,
        existN: true,
        value: function () { }
    },
    {
        label: "リアクション回避【N】％UP",
        ID: 9,
        existN: true,
        value: function () { }
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

// ライブスキルの効果一覧
export const liveSkillEffect: sEffect[] = [
    {
        label: "なし",
        ID: 1,
        existN: false,
        existTurn: false,
        value: function () { }
    },
    {
        label: "デュエット",
        ID: 2,
        existN: false,
        existTurn: false,
        value: function () { }
    },
    {
        label: "【N】%UP",
        ID: 19,
        existN: true,
        existTurn: true,
        value: function () { }
    },
    {
        label: "メンタル【N】％回復",
        ID: 3,
        existN: true,
        existTurn: false,
        value: function () { }
    },
    {
        label: "メンタル【N】％回復[超過思い出変換]",
        ID: 4,
        existN: true,
        existTurn: false,
        value: function () { }
    },
    {
        label: "メンタルダメージ【N】％UP",
        ID: 5,
        existN: true,
        existTurn: true,
        value: function () { }
    },
    {
        label: "メンタルダメージ【N】％CUT",
        ID: 6,
        existN: true,
        existTurn: true,
        value: function () { }
    },
    {
        label: "思い出ゲージ【N】％UP",
        ID: 7,
        existN: true,
        existTurn: false,
        value: function () { }
    },
    {
        label: "注目度【N】％UP",
        ID: 8,
        existN: true,
        existTurn: true,
        value: function () { }
    },
    {
        label: "注目度【N】％DOWN",
        ID: 9,
        existN: true,
        existTurn: true,
        value: function () { }
    },
    {
        label: "注目度【N】％DOWN",
        ID: 10,
        existN: true,
        existTurn: true,
        value: function () { }
    },
    {
        label: "パッシブ発動率【N】％",
        ID: 11,
        existN: true,
        existTurn: true,
        value: function () { }
    },
    {
        label: "リザレクション効果【N】％付与",
        ID: 12,
        existN: true,
        existTurn: true,
        value: function () { }
    },
    {
        label: "影響力【N】％UP",
        ID: 13,
        existN: true,
        existTurn: true,
        value: function () { }
    },
    {
        label: "影響力【N】％DOWN",
        ID: 14,
        existN: true,
        existTurn: true,
        value: function () { }
    },
    {
        label: "リラックス効果【N】％付与",
        ID: 15,
        existN: true,
        existTurn: true,
        value: function () { }
    },
    {
        label: "リアクション回避【N】％UP",
        ID: 16,
        existN: true,
        existTurn: true,
        value: function () { }
    },
    {
        label: "【M】ターンの間 回避時【N】％UP",
        ID: 17,
        existN: true,
        existTurn: true,
        value: function () { }
    },
    {
        label: "【M】ターンの間 ダメージ時【N】％UP",
        ID: 18,
        existN: true,
        existTurn: true,
        value: function () { }
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
                console.log("passiveEffectListID is all correct")
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
                console.log("liveSkillAppealListID is all correct")
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
                console.log("liveSkillEffectListID is all correct")
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