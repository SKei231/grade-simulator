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
        Effect: [{
            eID: number,
            eValue: number,
            eTurn: number,
            eTime: number,
            eNote: number | string
        }],
        Link: [{
            lID: number,
            lValue: number,
            lTurn: number,
            lTime: number,
            lNote: number | string
        }]
    }, {
        Priority: number,
        Effect: [{
            eID: number,
            eValue: number,
            eTurn: number,
            eTime: number,
            eNote: number | string
        }],
        Link: [{
            lID: number,
            lValue: number,
            lTurn: number,
            lTime: number,
            lNote: number | string
        }]
    }],
    PassiveIndex: number[]
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
    // ライブスキルのランダム選択
    liveSkillRandom: boolean
}

// パッシブの発動条件
export type trigger = {
    label: String,
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

// ライブスキル効果
export type sEffect = {
    label: string,
    ID: number,
    existN: boolean,
    existTurn: boolean,
    value: Function
}

// アイドル
export type idol = {
    Name: String,
    Number: number,
    Unit: number
}

// シュミレーション実行中ステータス
export type status = {
    Mental: number, // メンタル
    Damage: number, // 影響力
    DamageRatio: number, // ダメージ倍率
    MentalEffect: number, // ライブスキル発動後のメンタル変動値
    Attention: number, // 注目度 100％→100
    RecoveryTimes: number, // 回復回数
    MemoryGauge: number, // 思い出ゲージ
    MemoryRatio: number, // 思い出増加量
    TriggerRateIncreases: number, // パッシブ発動率上昇
    AppealLog: number[], // 履歴
    VisibleBuffs: [{
        BuffID: number, // 可視バフID
        BuffTurn: number, // 可視バフターン
        BuffValue: number, // 可視バフ倍率
        BuffTimes: number // 可視バフ回数
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