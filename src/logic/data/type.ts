// データの型をまとめたtsファイル

// パッシブ
export type passive = {
    Name: string,
    Attribute: string,
    Value: number,
    Color: "white" | "gold" | "rainbow",
    Gold: boolean,
    Trigger: {
        tID: number,
        tX: number,
        tHis: number[]
    },
    ActiveTurn: {
        after: number,
        before: number
    },
    Probability: number,
    Times: number,
    Effect: passiveEffect[]
}

export type passiveEffect = {
    eID: number,
    eValue: number
}

// 編成
export type fesIdol = {
    Idol: number,
    Position: string,
    MemorieLevel: number,
    Status: {
        VoValue: number,
        DaValue: number,
        ViValue: number,
        MeValue: number
    },
    LiveSkill: [{
        Priority: number,
        Appeal: [{
            aID: number,
            aValue: number,
            aAttribute: "Vo" | "Da" | "Vi" | "Excellent"
        }],
        Effect: [{
            eID: number,
            eValue: number,
            eTurn: number[],
            eTime: number,
            eNote: string
        }],
        Link: {
            lType: "Link" | "Plus" | "Change",
            lTrigger: {
                ltBefore: number,
                ltAfter: number,
                ltList: [{
                    ltID: number,
                    ltX: number,
                    ltHis: number[]
                }]
            },
            lAppeal: [{
                laID: number,
                laValue: number,
                laAttribute: "Vo" | "Da" | "Vi" | "Excellent"
            }],
            lEffect: [{
                leID: number,
                leValue: number,
                leTurn: number[],
                leTime: number,
                leNote: string
            }]
        },
        LinkTrigger: number[]
    }, {
        Priority: number,
        Appeal: [{
            aID: number,
            aValue: number,
            aAttribute: "Vo" | "Da" | "Vi" | "Excellent"
        }],
        Effect: [{
            eID: number,
            eValue: number,
            eTurn: number[],
            eTime: number,
            eNote: string
        }],
        Link: {
            lType: "link" | "plus" | "change",
            lTrigger: {
                ltBefore: number,
                ltAfter: number,
                ltList: [{
                    ltID: number,
                    ltX: number,
                    ltHis: number[]
                }]
            },
            lAppeal: [{
                laID: number,
                laValue: number,
                laAttribute: "Vo" | "Da" | "Vi" | "Excellent"
            }],
            lEffect: [{
                leID: number,
                leValue: number,
                leTurn: number[],
                leTime: number,
                leNote: string
            }]
        },
        LinkTrigger: number[]
    }],
    PassiveIndex: [{
        index: number,
        times: number,
        fesIdolIndex: number
    }],
    MemoryAppeal: {
        mAppeal: [{
            maID: number,
            maValue: number,
            maAttribute: "Vo" | "Da" | "Vi" | "Excellent"
        }],
        mEffect: [{
            meID: number,
            meValue: number,
            meTurn: number[],
            meTime: number,
            meNote: string
        }]
        mLink: {
            mlAppeal: [{
                mlaID: number,
                mlaValue: number,
                mlaAttribute: "Vo" | "Da" | "Vi" | "Excellent"
            }]
        }
    }
}

// 詳細設定
export type detail = {
    // 審査員ダメージ
    damage: number,
    // 打たれ強い
    damageStrong: number,
    // 打たれ弱い
    damageWeak: number,
    // 試行回数
    count: number,
    // 思い出++
    omonouDPlus: number,
    // 思い出+
    omonouPlus: number,
    // 思い出増加+2%
    omonoukakin: number,
    // その他思い出加速
    omonouElse: number,
    // 注目の的
    centerOfAttention: number,
    // ひかえめ
    noAttention: number,
    // ライブスキルのランダム選択
    liveSkillRandom: boolean
}

// パッシブの発動条件
export type trigger = {
    label: string,
    ID: number,
    existX: boolean,
    value: Function
}

// パッシブスキル効果
export type pEffect = {
    label: string,
    ID: number,
    existN: boolean,
    value: Function
}

// ライブスキルアピール
export type sAppeal = {
    label: string,
    ID: number,
    variable: boolean,
    ratioLabel: string,
    init: number,
    value: Function
}

// ライブスキル効果
export type sEffect = {
    label: string,
    ID: number,
    existN: boolean,
    existM: boolean,
    existTurn: boolean,
    existTime: boolean,
    existNote: boolean,
    existAttribute: boolean,
    value: Function
}

// アイドル
export type idol = {
    Name: String,
    ID: number,
    Unit: number[]
}

// シュミレーション実行中ステータス
export type status = {
    Mental: number, // メンタル
    Damage: number, // 影響力
    DamageRatio: number, // ダメージ倍率
    MentalEffect: number, // ライブスキル発動後のメンタル変動値
    Attention: number, // 注目度 100％→100
    RecoveryTimes: number, // 回復回数
    RecoveryTimesIncreases: number, // 回復回数の増加量
    MemoryGauge: number, // 思い出ゲージ
    MemoryRatio: number, // 思い出増加量
    MemoryRize: number, // 思い出加速
    TriggerRateIncreases: number, // パッシブ発動率上昇
    AppealLog: number[], // 履歴
    AppealOrder: number[], // ライブスキルの入手順
    AppealLIst: number[], // 選択可能なライブスキル
    PassiveActTimes: number[][], // パッシブ発動回数
    VisibleBuffs: [{
        BuffID: number, // 可視バフID
        BuffTurn: number, // 可視バフターン
        BuffValue: number, // 可視バフ倍率
        BuffTimes: number, // 可視バフ回数
        BuffNote: number // 二次バフの要素
    }],
    Buff: {
        Visible: {
            // 可視バフ
            vVo: number, // Voバフ倍率
            vDa: number, // Daバフ倍率
            vVi: number // Viバフ倍率
        },
        Passive: {
            // パッシブ
            pVo: number, // Voバフ倍率
            pDa: number, // Daバフ倍率
            pVi: number // Viバフ倍率
        }
    }
}

// 可視バフ
export type visibleBuff = {
    Name: string,
    ID: number,
    EffectType: number, // 1:ターン開始時 2:リアクション回避 3:回避時 4:ダメージ時
    Value: Function
}

// シュミレートログ（結果）
export type log = {
    Turn: number, // ターン
    Mental: number[], // メンタル
    Attention: number[], // 注目度 100％→100
    RecoveryTimes: number[], // 回復回数
    MemoryGauge: number[], // 思い出ゲージ
    Buff: {
        Total: {
            // 可視 + パッシブバフ
            tVo: number[], // Voバフ倍率
            tDa: number[], // Daバフ倍率
            tVi: number[] // Viバフ倍率
        },
        Passive: {
            // パッシブ
            pVo: number[], // Voバフ倍率
            pDa: number[], // Daバフ倍率
            pVi: number[] // Viバフ倍率
        }
    },
    PassiveActTime:number[] // パッシブ発動回数
}