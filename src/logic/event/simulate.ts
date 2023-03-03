// シミュレーション処理
import * as vault from './vault'
import * as types from '../data/type'
import { findByBuffID, buffList } from '../data/visibleBuff'
import { findByTriggerID, triggerList } from '../data/passiveTrigger'
import { findByLiveEffectID, findByPassiveID, passiveEffect, liveSkillEffect } from '../data/skillEffect'

export const run = () => {
    statusUpdate()
    for(let Turn = 0; Turn < vault.maxTurn; Turn++) {
        turnStart(); // ステータス初期化、可視バフの消去
        if(Turn > 0) {
            memoryGaugeIncrease(); // 思い出ゲージ増加
        }
        visibleBuffActivate(beforePassive);
        passiveSkillActivate(Turn);

        // 自由ーーーーーーーーーーーーーーーーーーーーーーーーーーー
        if(Turn == 0) {
            pushVisibleBuff(13, 3, 50, 3, 3)
        }
        status.Mental -= Math.floor(Math.random() * 1000)
        visibleBuffActivate(DamageAvoidance)


        // 自由ここまでーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー

        memoryMaxSave()
        vault.logPush(status, Turn);
        console.log(status.MemoryGauge)
    }
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
    MemoryRize: 0, // 思い出加速
    TriggerRateIncreases: 0, // パッシブ発動率上昇 20% -> 20
    AppealLog: [], // 履歴 
    PassiveActTimes: [], // パッシブ発動回数
    VisibleBuffs: [{
        BuffID: 1, // 可視バフID
        BuffTurn: 0, // 可視バフターン
        BuffValue: 0, // 可視バフ倍率
        BuffTimes: 0, // 可視バフ回数
        BuffNote: 0 // 二次バフの要素
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
const createPassiveActTimes = () => {
    status.PassiveActTimes.length = 0
    for(let i = 0; i < 5; i++) {
        status.PassiveActTimes[i] = []
        for(let j = 0; j < vault.fesIdols[i].PassiveIndex.length; j++) {
            status.PassiveActTimes[i].push(
                vault.fesIdols[i].PassiveIndex[j].times
            )
        }
    }
}

const statusUpdate = () => {
    defaultStatus.Mental = vault.staticStatus.Me;
    defaultStatus.Damage = vault.detailSetting.damage;
    defaultStatus.MemoryRatio = 1;
    status.Mental = vault.staticStatus.Me;
    status.RecoveryTimes = 0;
    status.MemoryGauge = 0;
    status.AppealLog.length = 0;
    status.VisibleBuffs = [{
        BuffID: 1, // 可視バフID
        BuffTurn: 0, // 可視バフターン
        BuffValue: 0, // 可視バフ倍率
        BuffTimes: 0, // 可視バフ回数
        BuffNote: 0 // 二次バフの要素
    }];
    if (vault.detailSetting.damageStrong > 0) {
        defaultStatus.DamageRatio = Math.pow(0.95, vault.detailSetting.damageStrong);
    }
    if (vault.detailSetting.damageWeak > 0) {
        defaultStatus.DamageRatio = Math.pow(1.1, vault.detailSetting.damageWeak);
    }
    if (vault.detailSetting.omonouDPlus > 0) {
        defaultStatus.MemoryRatio *= 0.05 * vault.detailSetting.omonouDPlus + 1;
    }
    if (vault.detailSetting.omonouPlus > 0) {
        defaultStatus.MemoryRatio *= 0.03 * vault.detailSetting.omonouPlus + 1;
    }
    if (vault.detailSetting.omonoukakin > 0) {
        defaultStatus.MemoryRatio *= 0.02 * vault.detailSetting.omonoukakin + 1;
    }
    createPassiveActTimes()
}

const turnStart = () => {
    // ステータス初期化
    status.Damage = defaultStatus.Damage;
    status.DamageRatio = defaultStatus.DamageRatio;
    status.MemoryRatio = defaultStatus.MemoryRatio;
    status.MentalEffect = 0;
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
            i--;
        }
    }
}

// 思い出ゲージ増加
const memoryGaugeIncrease = () => {
    // メンタルによる増加
    const mentalRatio = Math.floor((status.Mental / defaultStatus.Mental) * 100)
    if(mentalRatio == 100) {
        status.MemoryGauge += Math.floor(100 * status.MemoryRatio)
    }else if(mentalRatio >= 75) {
        status.MemoryGauge += Math.floor(150 * status.MemoryRatio)
    }else if(mentalRatio >= 50) {
        status.MemoryGauge += Math.floor(175 * status.MemoryRatio)
    }else if(mentalRatio >= 25) {
        status.MemoryGauge += Math.floor(200 * status.MemoryRatio)
    }else if(mentalRatio >= 5) {
        status.MemoryGauge += Math.floor(225 * status.MemoryRatio)
    }else if(status.Mental > 0) {
        status.MemoryGauge += Math.floor(10000 * status.MemoryRatio)
    }else {
        console.log("mental 0")
    }

    // スキルによる増加
    status.MemoryGauge += Math.floor(status.MemoryRize * status.MemoryRatio);
    status.MemoryRize = 0;
}
// 最大値の調整
const memoryMaxSave = () => {
    if(status.MemoryGauge > 1000) {
        status.MemoryGauge = 1000
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
                    buffList[findByBuffID(status.VisibleBuffs[i].BuffID)].Value(status.VisibleBuffs[i].BuffValue, status.VisibleBuffs[i].BuffTurn)
                    status.VisibleBuffs[i].BuffTimes--
                }
            }
        }
    }else if(effectType == Damaged){
        for (let i = 0; i < status.VisibleBuffs.length; i++) {
            if (buffList[findByBuffID(status.VisibleBuffs[i].BuffID)].EffectType == effectType) {
                if (status.VisibleBuffs[i].BuffTimes > 0) {
                    buffList[findByBuffID(status.VisibleBuffs[i].BuffID)].Value(status.VisibleBuffs[i].BuffValue, status.VisibleBuffs[i].BuffNote)
                    status.VisibleBuffs[i].BuffTimes--
                }
            }
        }
    }
}

/**
 * パッシブスキルの発動
 */
const passiveSkillActivate = (turn:number) => {
    let passiveActTime = 0 // max -> 6
    let order = [1, 2, 3]

    // パッシブ発動順番の作成
    order = arrayShuffle(order)
    order.unshift(0)
    order.push(4)

    /**
     * パッシブの発動
     * @param index パッシブのindex
     * @param position Leaderかどうか Le:0
     * @returns true: 発動
     */
    const passiveAct = (index:number, position:number):boolean => {
        if(triggerList[findByTriggerID(vault.passiveSkills[index].Trigger.tID)].value(turn, index)) { // 発動可能かどうか
            // 発動するかどうか
            if(position == 0) { // Le
                return Math.floor(Math.random() * 100) < (vault.passiveSkills[index].Probability * 1.9)
            }else {
                return Math.floor(Math.random() * 100) < vault.passiveSkills[index].Probability
            }
        }
        return false
    }

    /**
     * パッシブの発動
     * @param rainbowMode true: 虹パッシブ false: 虹以外
     */
    const passiveActivate = (rainbowMode:boolean) => {
        for(let i = 0; i < 5; i++) {
            for(let j = 0; j < vault.fesIdols[order[i]].PassiveIndex.length; j++) {
                const passiveClass = (vault.passiveSkills[vault.fesIdols[order[i]].PassiveIndex[j].index].Color == "rainbow")
                if(rainbowMode == passiveClass){
                    if(status.PassiveActTimes[order[i]][j] > 0 && passiveActTime < 6) {
                        if(passiveAct(vault.fesIdols[order[i]].PassiveIndex[j].index, i)) {
                            if(vault.passiveSkills[vault.fesIdols[order[i]].PassiveIndex[j].index].Attribute == "Vo") {
                                status.Buff.Passive.pVo += vault.passiveSkills[vault.fesIdols[order[i]].PassiveIndex[j].index].Value;
                            }else if(vault.passiveSkills[vault.fesIdols[order[i]].PassiveIndex[j].index].Attribute == "Da") {
                                status.Buff.Passive.pDa += vault.passiveSkills[vault.fesIdols[order[i]].PassiveIndex[j].index].Value;
                            }else if(vault.passiveSkills[vault.fesIdols[order[i]].PassiveIndex[j].index].Attribute == "Vi") {
                                status.Buff.Passive.pVi += vault.passiveSkills[vault.fesIdols[order[i]].PassiveIndex[j].index].Value;
                            }else if(vault.passiveSkills[vault.fesIdols[order[i]].PassiveIndex[j].index].Attribute == "VoDa") {
                                status.Buff.Passive.pVo += vault.passiveSkills[vault.fesIdols[order[i]].PassiveIndex[j].index].Value;
                                status.Buff.Passive.pDa += vault.passiveSkills[vault.fesIdols[order[i]].PassiveIndex[j].index].Value;
                            }else if(vault.passiveSkills[vault.fesIdols[order[i]].PassiveIndex[j].index].Attribute == "DaVi") {
                                status.Buff.Passive.pDa += vault.passiveSkills[vault.fesIdols[order[i]].PassiveIndex[j].index].Value;
                                status.Buff.Passive.pVi += vault.passiveSkills[vault.fesIdols[order[i]].PassiveIndex[j].index].Value;
                            }else if(vault.passiveSkills[vault.fesIdols[order[i]].PassiveIndex[j].index].Attribute == "ViVo") {
                                status.Buff.Passive.pVo += vault.passiveSkills[vault.fesIdols[order[i]].PassiveIndex[j].index].Value;
                                status.Buff.Passive.pVi += vault.passiveSkills[vault.fesIdols[order[i]].PassiveIndex[j].index].Value;
                            }else if(vault.passiveSkills[vault.fesIdols[order[i]].PassiveIndex[j].index].Attribute == "All") {
                                status.Buff.Passive.pVo += vault.passiveSkills[vault.fesIdols[order[i]].PassiveIndex[j].index].Value;
                                status.Buff.Passive.pDa += vault.passiveSkills[vault.fesIdols[order[i]].PassiveIndex[j].index].Value;
                                status.Buff.Passive.pVi += vault.passiveSkills[vault.fesIdols[order[i]].PassiveIndex[j].index].Value;
                            }
                            for(let n = 0; n < vault.passiveSkills[vault.fesIdols[order[i]].PassiveIndex[j].index].Effect.length; n++ ) {
                                passiveEffect[findByPassiveID(vault.passiveSkills[vault.fesIdols[order[i]].PassiveIndex[j].index].Effect[n].eID)].value(vault.passiveSkills[vault.fesIdols[order[i]].PassiveIndex[j].index].Effect[n].eValue);
                            }
                            vault.countPassiveAct(turn, vault.fesIdols[order[i]].PassiveIndex[j].index);
                            status.PassiveActTimes[order[i]][j]--;
                            passiveActTime++;
                            if(rainbowMode) {
                                passiveActTime = 6;
                            }
                        }
                    }
                }
            }
        }
        if(rainbowMode) {
            passiveActTime = 1;
        }
    }
    passiveActivate(true)  // 虹パッシブの発動
    passiveActivate(false) // その他パッシブの発動
}

/**
 * 可視バフの追加
 * @param id 'src\logic\data\visibleBuff.ts' より適切なID
 * @param turn 効果ターン
 * @param value 効果量
 * @param times 被弾時、回避時バフ等の回数
 * @param note 二次バフ(回避時バフのターン数等)の要素
 */
export const pushVisibleBuff = (id: number, turn: number, value: number, times: number, note: number) => {
    status.VisibleBuffs.push({
        BuffID: id, // 可視バフID
        BuffTurn: turn, // 可視バフターン
        BuffValue: value, // 可視バフ倍率
        BuffTimes: times, // 可視バフ回数
        BuffNote: note // 二次バフの要素
    })
}

const arrayShuffle = (array:number[]) => {
    for(let i = (array.length - 1); 0 < i; i--) {
        let r = Math.floor(Math.random() * (i + 1));
        let tmp = array[i];
        array[i] = array[r];
        array[r] = tmp;
    }
    return array
}