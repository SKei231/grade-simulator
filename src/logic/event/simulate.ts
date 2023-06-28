// シミュレーション処理
import * as vault from './vault'
import * as types from '../data/type'
import { findByBuffID, buffList } from '../data/visibleBuff'
import { findByTriggerID, triggerList } from '../data/passiveTrigger'
import { findByLiveEffectID, findByPassiveID, passiveEffect, liveSkillEffect } from '../data/skillEffect'
import { findByIdolID, idolList } from '../data/idolList'

export const run = () => {
    statusUpdate()
    for(let Turn = 0; Turn < vault.maxTurn; Turn++) {
        // ターン開始時
        turnStart(Turn); // ステータス初期化、可視バフの消去
        if(Turn > 0) {
            memoryGaugeIncrease(); // 思い出ゲージ増加
        }
        visibleBuffActivate(beforePassive); // 可視バフの反映（ターン開始時発動）
        passiveSkillActivate(Turn); // パッシブの発動

        // ライブスキル発動時
        liveSkillAppeal(Turn); // ライブスキルの発動
        applyMentalDamageEffect(); // メンタル変動値の反映
        
        // 審査員攻撃時
        judgeDamage(3, 3); // 審査員ダメージ、回避、ダメージバフ

        // ターン終了時
        memoryMaxSave()
        vault.logPush(status, Turn);
    }
}

// 打たれ強い、弱い、影響力などを反映 最大Meの保存
export let defaultStatus = {
    Mental: 0,
    Damage: 0,
    DamageRatio: 1,
    MemoryRatio: 1,
    Attention: 100
}

export let status: types.status = {
    Mental: 0, // メンタル
    Damage: 0, // 影響力
    DamageRatio: 1, // ダメージ倍率
    MentalEffect: 0, // ライブスキル発動後のメンタル変動値
    Attention: 100, // 注目度 100％→100
    RecoveryTimes: 0, // 回復回数
    RecoveryTimesIncreases: 0, // 回復回数増加量
    MemoryGauge: 0, // 思い出ゲージ
    MemoryRatio: 1, // 思い出増加量
    MemoryRize: 0, // 思い出加速
    TriggerRateIncreases: 0, // パッシブ発動率上昇 20% -> 20
    AppealLog: [], // 履歴 
    AppealOrder: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // 選択可能なライブスキル
    AppealLIst: [], // 選択可能なライブスキル
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
    defaultStatus.Attention = 100;
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
    if (vault.detailSetting.centerOfAttention > 0) {
        defaultStatus.Attention += 10 * vault.detailSetting.centerOfAttention;
    }
    if (vault.detailSetting.noAttention > 0) {
        defaultStatus.Attention -= 3 * vault.detailSetting.noAttention + 1;
    }
    createPassiveActTimes()

    // ライブスキルのランダム選択
    if(vault.detailSetting.liveSkillRandom) {
        status.AppealOrder = arrayShuffle(status.AppealOrder)
    }

    // 選択可能なライブスキルの入手
    status.AppealLIst = [status.AppealOrder[0], status.AppealOrder[1], status.AppealOrder[2]]
}

const turnStart = (turn:number) => {
    // ステータス初期化
    status.Damage = defaultStatus.Damage;
    status.DamageRatio = defaultStatus.DamageRatio;
    status.MemoryRatio = defaultStatus.MemoryRatio;
    status.MentalEffect = 0;
    status.Attention = defaultStatus.Attention;
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

    // 選択可能なライブスキルの追加
    if(turn + 2 < vault.maxTurn && turn != 0) {
        status.AppealLIst.push(status.AppealOrder[turn + 2])
    }
}

/**
 * メンタルを参照した思い出ゲージの増加
 * ターン開始時の増加、status.MemoryRize を参照した増加
 * ここで status.MemoryRatio を適用する
 */
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
// 最大、最小値の調整
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
        return AvoidSuccses;
    } else if(effectType == AvoidanceSuccess) {
        for (let i = 0; i < status.VisibleBuffs.length; i++) {
            if (buffList[findByBuffID(status.VisibleBuffs[i].BuffID)].EffectType == effectType) {
                if (status.VisibleBuffs[i].BuffTimes > 0) {
                    buffList[findByBuffID(status.VisibleBuffs[i].BuffID)].Value(status.VisibleBuffs[i].BuffValue, status.VisibleBuffs[i].BuffNote)
                    status.VisibleBuffs[i].BuffTimes--
                }
            }
        }
    }else if(effectType == Damaged){
        for (let i = 0; i < status.VisibleBuffs.length; i++) {
            if (buffList[findByBuffID(status.VisibleBuffs[i].BuffID)].EffectType == effectType) {
                if (status.VisibleBuffs[i].BuffTimes > 0) {
                    if(buffList[findByBuffID(status.VisibleBuffs[i].BuffID)].Value(status.VisibleBuffs[i].BuffValue, status.VisibleBuffs[i].BuffNote)) {
                        status.VisibleBuffs[i].BuffTimes--
                    }
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
                return Math.floor(Math.random() * 100) < (vault.passiveSkills[index].Probability * 1.9 + status.TriggerRateIncreases)
            }else {
                return Math.floor(Math.random() * 100) < (vault.passiveSkills[index].Probability + status.TriggerRateIncreases)
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
                                if(vault.passiveSkills[vault.fesIdols[order[i]].PassiveIndex[j].index].Effect[n].eID == 10) {
                                    passiveEffect[findByPassiveID(vault.passiveSkills[vault.fesIdols[order[i]].PassiveIndex[j].index].Effect[n].eID)].value(vault.passiveSkills[vault.fesIdols[order[i]].PassiveIndex[j].index].Effect[n].eValue, vault.passiveSkills[vault.fesIdols[order[i]].PassiveIndex[j].index].Attribute);
                                }else {
                                    passiveEffect[findByPassiveID(vault.passiveSkills[vault.fesIdols[order[i]].PassiveIndex[j].index].Effect[n].eID)].value(vault.passiveSkills[vault.fesIdols[order[i]].PassiveIndex[j].index].Effect[n].eValue);
                                }
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
 * ライブスキルの発動/Linkの発動
 * @param turn 現在のターン
 */
const liveSkillAppeal = (turn:number) => {
    // 優先順位の検索
    const searchLiveSkill = (priority:number) => {
        for(let i = 0; i < 5; i++) {
            for(let j = 0; j < 2; j++) {
                if(priority == vault.fesIdols[i].LiveSkill[j].Priority) {
                    return [i, j];
                }
            }
        }
        console.log("not found index searched by liveskill priority")
    }
    // 選択可能なライブスキルの中から指定、status.AppealList からの削除
    const selectLiveSkill = () => {
        let select = {
            priority: status.AppealLIst[0],
            index: 0
        }
        for(let i = 1; i < status.AppealLIst.length; i++) {
            if(status.AppealLIst[i] < select.priority) {
                select.priority = status.AppealLIst[i]
                select.index = i
            }
        }
        status.AppealLIst.splice(select.index,1)
        return select.priority
    }
    // Linkの発動有無 
    // @ts-ignore
    const linkAct = (idolID:number, LinkTrigger:number[]):boolean => {
        let linkList = idolList[findByIdolID(idolID)].Unit;
        if(idolID >= 20 && idolID <= 23) {
            linkList = LinkTrigger;
        }
        let checker = true;
        let scanningIndex = 0;
        while(checker) {
            for(let i = 0; i < status.AppealLog.length; i++) {
                if(status.AppealLog[i] == linkList[scanningIndex]) {
                    scanningIndex++;
                    checker = false;
                }
            }
            if(checker) { // 履歴のヒットがなかった場合
                return false;
            }else if(scanningIndex == linkList.length){ // 履歴全てがヒットした場合
                return true;
            }else {
                checker = true;
            }
        }
    }

    const lin = searchLiveSkill(selectLiveSkill());

    if(lin) {
        // 履歴への挿入
        appealLogPush(vault.fesIdols[lin[0]].Idol)
        // スキル効果の発動
        for(let i = 0; i < vault.fesIdols[lin[0]].LiveSkill[lin[1]].Effect.length; i++) {
            if(liveSkillEffect[findByLiveEffectID(vault.fesIdols[lin[0]].LiveSkill[lin[1]].Effect[i].eID)].existAttribute) {
                if(liveSkillEffect[findByLiveEffectID(vault.fesIdols[lin[0]].LiveSkill[lin[1]].Effect[i].eID)].existM) {
                    if(liveSkillEffect[findByLiveEffectID(vault.fesIdols[lin[0]].LiveSkill[lin[1]].Effect[i].eID)].existTime) {
                        // value, turn, Mturn, time, note (回避時、ダメージ時バフ)
                        liveSkillEffect[findByLiveEffectID(vault.fesIdols[lin[0]].LiveSkill[lin[1]].Effect[i].eID)].value(vault.fesIdols[lin[0]].LiveSkill[lin[1]].Effect[i].eValue, vault.fesIdols[lin[0]].LiveSkill[lin[1]].Effect[i].eTurn[0], vault.fesIdols[lin[0]].LiveSkill[lin[1]].Effect[i].eTurn[1], vault.fesIdols[lin[0]].LiveSkill[lin[1]].Effect[i].eTime, vault.fesIdols[lin[0]].LiveSkill[lin[1]].Effect[i].eNote);
                    }else {
                        // value, turn, note, deleteMental (自傷バフ)
                        liveSkillEffect[findByLiveEffectID(vault.fesIdols[lin[0]].LiveSkill[lin[1]].Effect[i].eID)].value(vault.fesIdols[lin[0]].LiveSkill[lin[1]].Effect[i].eValue, vault.fesIdols[lin[0]].LiveSkill[lin[1]].Effect[i].eTurn[0], vault.fesIdols[lin[0]].LiveSkill[lin[1]].Effect[i].eNote, vault.fesIdols[lin[0]].LiveSkill[lin[1]].Effect[i].eTurn[1]);
                    }
                }else {
                    // value, turn, note (通常 VoDaVi バフ)
                    liveSkillEffect[findByLiveEffectID(vault.fesIdols[lin[0]].LiveSkill[lin[1]].Effect[i].eID)].value(vault.fesIdols[lin[0]].LiveSkill[lin[1]].Effect[i].eValue, vault.fesIdols[lin[0]].LiveSkill[lin[1]].Effect[i].eTurn[0], vault.fesIdols[lin[0]].LiveSkill[lin[1]].Effect[i].eNote);
                }

            }else if(liveSkillEffect[findByLiveEffectID(vault.fesIdols[lin[0]].LiveSkill[lin[1]].Effect[i].eID)].ID == 11) {
                // value, turn, time (リザレクション)
                liveSkillEffect[findByLiveEffectID(vault.fesIdols[lin[0]].LiveSkill[lin[1]].Effect[i].eID)].value(vault.fesIdols[lin[0]].LiveSkill[lin[1]].Effect[i].eValue, vault.fesIdols[lin[0]].LiveSkill[lin[1]].Effect[i].eTurn[0], vault.fesIdols[lin[0]].LiveSkill[lin[1]].Effect[i].eTime);
            }else {
                // value, turn
                liveSkillEffect[findByLiveEffectID(vault.fesIdols[lin[0]].LiveSkill[lin[1]].Effect[i].eID)].value(vault.fesIdols[lin[0]].LiveSkill[lin[1]].Effect[i].eValue, vault.fesIdols[lin[0]].LiveSkill[lin[1]].Effect[i].eTurn[0]);
            }
        }
        // Linkの発動
        if(linkAct(vault.fesIdols[lin[0]].Idol, vault.fesIdols[lin[0]].LiveSkill[lin[1]].LinkTrigger)) {
            for(let i = 0; i < vault.fesIdols[lin[0]].LiveSkill[lin[1]].Link.lEffect.length; i++) {
                if(liveSkillEffect[findByLiveEffectID(vault.fesIdols[lin[0]].LiveSkill[lin[1]].Link.lEffect[i].leID)].existAttribute) {
                    if(liveSkillEffect[findByLiveEffectID(vault.fesIdols[lin[0]].LiveSkill[lin[1]].Link.lEffect[i].leID)].existM) {
                        if(liveSkillEffect[findByLiveEffectID(vault.fesIdols[lin[0]].LiveSkill[lin[1]].Link.lEffect[i].leID)].existTime) {
                            // value, turn, Mturn, time, note (回避時、ダメージ時バフ)
                            liveSkillEffect[findByLiveEffectID(vault.fesIdols[lin[0]].LiveSkill[lin[1]].Link.lEffect[i].leID)].value(vault.fesIdols[lin[0]].LiveSkill[lin[1]].Link.lEffect[i].leValue, vault.fesIdols[lin[0]].LiveSkill[lin[1]].Link.lEffect[i].leTurn[0], vault.fesIdols[lin[0]].LiveSkill[lin[1]].Link.lEffect[i].leTurn[1], vault.fesIdols[lin[0]].LiveSkill[lin[1]].Link.lEffect[i].leTime, vault.fesIdols[lin[0]].LiveSkill[lin[1]].Link.lEffect[i].leNote);
                        }else {
                            // value, turn, note, deleteMental (自傷バフ)
                            liveSkillEffect[findByLiveEffectID(vault.fesIdols[lin[0]].LiveSkill[lin[1]].Link.lEffect[i].leID)].value(vault.fesIdols[lin[0]].LiveSkill[lin[1]].Link.lEffect[i].leValue, vault.fesIdols[lin[0]].LiveSkill[lin[1]].Link.lEffect[i].leTurn[0], vault.fesIdols[lin[0]].LiveSkill[lin[1]].Link.lEffect[i].leNote, vault.fesIdols[lin[0]].LiveSkill[lin[1]].Link.lEffect[i].leTurn[1]);
                        }
                    }else {
                        // value, turn, note (通常 VoDaVi バフ)
                        liveSkillEffect[findByLiveEffectID(vault.fesIdols[lin[0]].LiveSkill[lin[1]].Link.lEffect[i].leID)].value(vault.fesIdols[lin[0]].LiveSkill[lin[1]].Link.lEffect[i].leValue, vault.fesIdols[lin[0]].LiveSkill[lin[1]].Link.lEffect[i].leTurn[0], vault.fesIdols[lin[0]].LiveSkill[lin[1]].Link.lEffect[i].leNote);
                    }
    
                }else if(liveSkillEffect[findByLiveEffectID(vault.fesIdols[lin[0]].LiveSkill[lin[1]].Link.lEffect[i].leID)].ID == 11) {
                    // value, turn, time (リザレクション)
                    liveSkillEffect[findByLiveEffectID(vault.fesIdols[lin[0]].LiveSkill[lin[1]].Link.lEffect[i].leID)].value(vault.fesIdols[lin[0]].LiveSkill[lin[1]].Link.lEffect[i].leValue, vault.fesIdols[lin[0]].LiveSkill[lin[1]].Link.lEffect[i].leTurn[0], vault.fesIdols[lin[0]].LiveSkill[lin[1]].Link.lEffect[i].leTime);
                }else {
                    // value, turn
                    liveSkillEffect[findByLiveEffectID(vault.fesIdols[lin[0]].LiveSkill[lin[1]].Link.lEffect[i].leID)].value(vault.fesIdols[lin[0]].LiveSkill[lin[1]].Link.lEffect[i].leValue, vault.fesIdols[lin[0]].LiveSkill[lin[1]].Link.lEffect[i].leTurn[0]);
                }
            }
        }
    }
} 

export const appealLogPush = (idolID:number) => {
    if(status.AppealLog.length <= 4) {
        status.AppealLog.push(idolID);
    }else {
        status.AppealLog.shift();
        status.AppealLog.push(idolID);
    }
}

/**
 * 可視バフ、パッシブ、ライブスキルの効果によるメンタル変動の適用
 */
const applyMentalDamageEffect = () => {
    if(status.Mental + status.MentalEffect > defaultStatus.Mental) {
        status.Mental = defaultStatus.Mental;
    }else {
        status.Mental += status.MentalEffect;
    }
    if(status.Mental < 0) {
        status.Mental = 0;
    }
    status.MentalEffect = 0;

    // 回復回数増加
    status.RecoveryTimes += status.RecoveryTimesIncreases;
    status.RecoveryTimesIncreases = 0;
}

/**
 * 審査員ダメージ（メンタルダメージ）の算出
 * @param member 審査員の数
 * @param target 攻撃対象の数
 */
const judgeDamage = (member:number, target:number) => {
    let attention = status.Attention
    if(attention < 0) {
        attention = 0
    }
    const x = attention / (500 + attention)
    const damageCheck = (target:number) => {
        if(target == 2) {
            const twoWay = 1-4*(1-x)**2/(4+x)
            return Math.random() < twoWay
        }
        if(target == 3) {
            const threeWay = 1-12*(1-x)**3/((4+x)*(3+2*x))
            return Math.random() < threeWay
        }
        if(target == 4) {
            const fourWay = 1-24*(1-x)**4/((4+x)*(3+2*x)*(2+3*x))
            return Math.random() < fourWay
        }
    }

    // 回避の発動
    let avoid = false;
    if(visibleBuffActivate(DamageAvoidance)) {
        avoid = true;
    }
    // 審査員ダメージチェク
    for(let i = 0; i < member; i++) {
        if(damageCheck(target)) {
            if(avoid) {
                visibleBuffActivate(AvoidanceSuccess)
            }else {
                status.Mental -= Math.floor(status.Damage * status.DamageRatio);
                visibleBuffActivate(Damaged);
            }
        }
    }
}

/**
 * 可視バフの追加
 * @param id 'src\logic\data\visibleBuff.ts' より適切なID
 * @param turn 効果ターン
 * @param value 効果量
 * @param times 被弾時、回避時バフ等の回数
 * @param note 二次バフ(回避時バフのターン数等)の要素
 */
export const pushVisibleBuff = (id: number, turn: number, value: number, times: number, nextTurn: number) => {
    status.VisibleBuffs.push({
        BuffID: id, // 可視バフID
        BuffTurn: turn, // 可視バフターン
        BuffValue: value, // 可視バフ倍率
        BuffTimes: times, // 可視バフ回数
        BuffNote: nextTurn // 二次バフの要素
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