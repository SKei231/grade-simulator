// シミュレーション処理
import * as vault from './vault'
import * as types from '../data/type'
import { findByBuffID, buffList } from '../data/visibleBuff'

export const run = () => {
    statusUpdate()
    for(let Turn = 0; Turn < vault.maxTurn; Turn++) {
        turnStart() // ステータス初期化、可視バフの消去
        visibleBuffActivate(beforePassive)
        passiveSkillActivate()
        // if(Turn == 0) {
        //     pushVisibleBuff(12, 3, 50, 3)
        //     pushVisibleBuff(13, 3, 60, 3)
        //     pushVisibleBuff(14, 3, 70, 3)
        // }
        // pushVisibleBuff(11, 1, 100, 0)
        visibleBuffActivate(DamageAvoidance)
        vault.logPush(status, Turn)
    }
    console.log(vault.log)
}

// 打たれ強い、弱い、影響力などを反映　最大Meの保存
export let defaultStatus = {
    Mental: 0,
    Damage: 0,
    DamageRatio: 1,
    MemoryRatio: 1
}

export let status: types.status = {
    Mental: 0, // メンタル
    Damage: 0, // 影響力
    DamageRatio: 1, // ダメージ倍率
    MentalEffect: 0, // ライブスキル発動後のメンタル変動値
    Attention: 100, // 注目度 100％→100
    RecoveryTimes: 0, // 回復回数
    MemoryGauge: 0, // 思い出ゲージ
    MemoryRatio: 1, // 思い出増加量
    TriggerRateIncreases: 0, // パッシブ発動率上昇 20% -> 20
    AppealLog: [], // 履歴
    VisibleBuffs: [{
        BuffID: 1, // 可視バフID
        BuffTurn: 0, // 可視バフターン
        BuffValue: 0, // 可視バフ倍率
        BuffTimes: 0, // 可視バフ回数
    }],
    Buff: {
        Visible: {
            vVo: 0,
            vDa: 0,
            vVi: 0
        },
        Passive: {
            pVo: 0,
            pDa: 0,
            pVi: 0
        }
    }
}

const statusUpdate = () => {
    defaultStatus.Mental = vault.staticStatus.Me
    status.Mental = vault.staticStatus.Me
    defaultStatus.Damage = vault.detailSetting.damage
    status.VisibleBuffs = [{
        BuffID: 1, // 可視バフID
        BuffTurn: 0, // 可視バフターン
        BuffValue: 0, // 可視バフ倍率
        BuffTimes: 0, // 可視バフ回数
    }]
    if (vault.detailSetting.damageStrong > 0) {
        defaultStatus.DamageRatio = Math.pow(0.95, vault.detailSetting.damageStrong)
    }
    if (vault.detailSetting.damageWeak > 0) {
        defaultStatus.DamageRatio = Math.pow(1.1, vault.detailSetting.damageWeak)
    }
    if (vault.detailSetting.omonouDPlus > 0) {
        defaultStatus.MemoryRatio *= 0.05 * vault.detailSetting.omonouDPlus + 1
    }
    if (vault.detailSetting.omonouPlus > 0) {
        defaultStatus.MemoryRatio *= 0.03 * vault.detailSetting.omonouPlus + 1
    }
    if (vault.detailSetting.omonoukakin > 0) {
        defaultStatus.MemoryRatio *= 0.02 * vault.detailSetting.omonoukakin + 1
    }
}

const turnStart = () => {
    // ステータス初期化
    status.Damage = defaultStatus.Damage
    status.DamageRatio = defaultStatus.DamageRatio;
    status.MemoryRatio = defaultStatus.MemoryRatio;
    status.Attention = 100;
    status.TriggerRateIncreases = 0;
    status.Buff.Visible.vVo = 0;
    status.Buff.Visible.vDa = 0;
    status.Buff.Visible.vVi = 0;
    status.Buff.Passive.pVo = 0;
    status.Buff.Passive.pDa = 0;
    status.Buff.Passive.pVi = 0;

    // 可視バフのターン減少/削除
    for (let i = 0; i < status.VisibleBuffs.length; i++) {
        status.VisibleBuffs[i].BuffTurn--;
        if (status.VisibleBuffs[i].BuffTurn <= 0) {
            status.VisibleBuffs.splice(i, 1);
            i--
        }
    }
}

const beforePassive = 1;
const DamageAvoidance = 2;
const AvoidanceSuccess = 3;
const Damaged = 4;
/**
 * 可視バフの発動
 * @param effectType パッシブ前: beforePassive (1) 回避: DamageAvoidance (2) ダメージ時: Damaged (4)
 */
const visibleBuffActivate = (effectType: number) => {
    if (effectType == beforePassive) {
        for (let i = 0; i < status.VisibleBuffs.length; i++) {
            if (buffList[findByBuffID(status.VisibleBuffs[i].BuffID)].EffectType == effectType) {
                buffList[findByBuffID(status.VisibleBuffs[i].BuffID)].Value(status.VisibleBuffs[i].BuffValue)
            }
        }
    }else if (effectType == DamageAvoidance) {
        let AvoidSuccses = false;
        for (let i = 0; i < status.VisibleBuffs.length; i++) {
            if (buffList[findByBuffID(status.VisibleBuffs[i].BuffID)].EffectType == effectType) {
                if (buffList[findByBuffID(status.VisibleBuffs[i].BuffID)].Value(status.VisibleBuffs[i].BuffValue)) {
                    AvoidSuccses = true;
                }
            }
        }
        if (AvoidSuccses) {
            visibleBuffActivate(AvoidanceSuccess)
        }
    } else if(effectType == AvoidanceSuccess) {
        for (let i = 0; i < status.VisibleBuffs.length; i++) {
            if (buffList[findByBuffID(status.VisibleBuffs[i].BuffID)].EffectType == effectType) {
                if (status.VisibleBuffs[i].BuffTimes > 0) {
                    buffList[findByBuffID(status.VisibleBuffs[i].BuffID)].Value(status.VisibleBuffs[i].BuffValue, 3)
                    status.VisibleBuffs[i].BuffTimes--
                }
            }
        }
    }else if(effectType == Damaged){
        for (let i = 0; i < status.VisibleBuffs.length; i++) {
            if (buffList[findByBuffID(status.VisibleBuffs[i].BuffID)].EffectType == effectType) {
                if (status.VisibleBuffs[i].BuffTimes > 0) {
                    buffList[findByBuffID(status.VisibleBuffs[i].BuffID)].Value(status.VisibleBuffs[i].BuffValue, 3)
                    status.VisibleBuffs[i].BuffTimes--
                }
            }
        }
    }
}

/**
 * パッシブスキルの発動
 */
const passiveSkillActivate = () => {
    let passiveActTime = 0
    const passiveAct = (index:number) => {
// 
    }

}

/**
 * 可視バフの追加
 * @param id 'src\logic\data\visibleBuff.ts' より適切なID
 * @param turn 効果ターン
 * @param value 効果量
 * @param times 被弾時、回避時バフ等の回数
 */
export const pushVisibleBuff = (id: number, turn: number, value: number, times: number) => {
    status.VisibleBuffs.push({
        BuffID: id, // 可視バフID
        BuffTurn: turn, // 可視バフターン
        BuffValue: value, // 可視バフ倍率
        BuffTimes: times // 可視バフ回数
    })
}