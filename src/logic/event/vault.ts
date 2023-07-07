// 設定、ログの保管
import * as types from '../data/type'
import { defaultStatus } from './simulate';

// 最大ターン
export let maxTurn = 10;

// 総合ステータス
export let staticStatus = {
    Vo: 0,
    Da: 0,
    Vi: 0,
    Me: 0
}

// シュミレートログ
export let log: types.log[] = []

// ログの初期化
export const createLog = () => {
    log.length = 0 // 配列の初期化
    for (let i = 1; i <= maxTurn; i++) {
        const defaultLog: types.log = {
            Turn: i, // ターン
            Mental: [], // メンタル
            Attention: [], // 注目度 100％→100
            RecoveryTimes: [], // 回復回数
            MemoryGauge: [], // 思い出ゲージ
            Buff: {
                Total: {
                    // 可視 + パッシブバフ
                    tVo: [], // Voバフ倍率
                    tDa: [], // Daバフ倍率
                    tVi: [] // Viバフ倍率
                },
                Passive: {
                    // パッシブ
                    pVo: [], // Voバフ倍率
                    pDa: [], // Daバフ倍率
                    pVi: [] // Viバフ倍率
                }
            },
            PassiveActTime: createPassiveCount() // パッシブ発動回数
        }
        defaultLog.Mental.length = 0;
        defaultLog.Attention.length = 0;
        defaultLog.RecoveryTimes.length = 0;
        defaultLog.MemoryGauge.length = 0;
        defaultLog.Buff.Total.tVo.length = 0;
        defaultLog.Buff.Total.tDa.length = 0;
        defaultLog.Buff.Total.tVi.length = 0;
        defaultLog.Buff.Passive.pVo.length = 0;
        defaultLog.Buff.Passive.pDa.length = 0;
        defaultLog.Buff.Passive.pVi.length = 0;
        log.push(defaultLog)
    }
}
const createPassiveCount = ():number[] => {
    const returnArray = []
    returnArray.length = 0
    for(let i = 0; i < passiveSkills.length; i++) {
        returnArray.push(0)
    }
    return returnArray
}

// パッシブ発動回数の挿入
export const countPassiveAct = (turn:number ,index:number) => {
    log[turn].PassiveActTime[index]++
}

// シュミレート結果の挿入
export const logPush = (status:types.status, turn:number) => {
    // メンタル
    (function() {
        if(turn == 0) {
            log[0].Mental.push(defaultStatus.Mental)
        }
        if(turn != 9) {
            const mentalIndex = indexSeaech(status.Mental, log[turn + 1].Mental)
            if(mentalIndex == "push") {
                log[turn + 1].Mental.push(status.Mental)
            }else if(typeof mentalIndex === "number"){
                log[turn + 1].Mental.splice(mentalIndex, 0, status.Mental)
            }else {
                console.log("mental insert errer")
            }
        }
    }());
    // 注目度 100％→100
    (function() {
        const attention = status.Attention - 100;
        const attentionIndex = indexSeaech(attention, log[turn].Attention)
        if(attentionIndex == "push") {
            log[turn].Attention.push(attention)
        }else if(typeof attentionIndex === "number"){
            log[turn].Attention.splice(attentionIndex, 0, attention)
        }else {
            console.log("attention insert errer")
        }
    }());
    // 回復回数
    (function() {
        const recTimesIndex = indexSeaech(status.RecoveryTimes, log[turn].RecoveryTimes)
        if(recTimesIndex == "push") {
            log[turn].RecoveryTimes.push(status.RecoveryTimes)
        }else if(typeof recTimesIndex === "number"){
            log[turn].RecoveryTimes.splice(recTimesIndex, 0, status.RecoveryTimes)
        }else {
            console.log("recoveryTimes insert errer")
        }
    }());
    // 思い出ゲージ
    (function() {
        const memoryIndex = indexSeaech(status.MemoryGauge, log[turn].MemoryGauge)
        if(memoryIndex == "push") {
            log[turn].MemoryGauge.push(status.MemoryGauge)
        }else if(typeof memoryIndex === "number"){
            log[turn].MemoryGauge.splice(memoryIndex, 0, status.MemoryGauge)
        }else {
            console.log("memoryGauge insert errer")
        }
    }());
    // 可視 + パッシブバフ
    // Voバフ倍率
    (function() {
        const tVo = status.Buff.Visible.vVo + status.Buff.Passive.pVo
        const tVoIndex = indexSeaech(tVo, log[turn].Buff.Total.tVo)
        if(tVoIndex == "push") {
            log[turn].Buff.Total.tVo.push(tVo)
        }else if(typeof tVoIndex === "number"){
            log[turn].Buff.Total.tVo.splice(tVoIndex, 0, tVo)
        }else {
            console.log("totalVo insert errer")
        }
    }());
    // Daバフ倍率
    (function() {
        const tDa = status.Buff.Visible.vDa + status.Buff.Passive.pDa
        const tDaIndex = indexSeaech(tDa, log[turn].Buff.Total.tDa)
        if(tDaIndex == "push") {
            log[turn].Buff.Total.tDa.push(tDa)
        }else if(typeof tDaIndex === "number"){
            log[turn].Buff.Total.tDa.splice(tDaIndex, 0, tDa)
        }else {
            console.log("totalDa insert errer")
        }
    }());
    // Viバフ倍率
    (function() {
        const tVi = status.Buff.Visible.vVi + status.Buff.Passive.pVi
        const tViIndex = indexSeaech(tVi, log[turn].Buff.Total.tVi)
        if(tViIndex == "push") {
            log[turn].Buff.Total.tVi.push(tVi)
        }else if(typeof tViIndex === "number"){
            log[turn].Buff.Total.tVi.splice(tViIndex, 0, tVi)
        }else {
            console.log("totalDa insert errer")
        }
    }());
    // パッシブ
    // Voバフ倍率
    (function() {
        const tVoIndex = indexSeaech(status.Buff.Passive.pVo, log[turn].Buff.Passive.pVo)
        if(tVoIndex == "push") {
            log[turn].Buff.Passive.pVo.push(status.Buff.Passive.pVo)
        }else if(typeof tVoIndex === "number"){
            log[turn].Buff.Passive.pVo.splice(tVoIndex, 0, status.Buff.Passive.pVo)
        }else {
            console.log("totalVo insert errer")
        }
    }());
    // Daバフ倍率
    (function() {
        const tDaIndex = indexSeaech(status.Buff.Passive.pDa, log[turn].Buff.Passive.pDa)
        if(tDaIndex == "push") {
            log[turn].Buff.Passive.pDa.push(status.Buff.Passive.pDa)
        }else if(typeof tDaIndex === "number"){
            log[turn].Buff.Passive.pDa.splice(tDaIndex, 0, status.Buff.Passive.pDa)
        }else {
            console.log("totalDa insert errer")
        }
    }());
    // Viバフ倍率
    (function() {
        const tViIndex = indexSeaech(status.Buff.Passive.pVi, log[turn].Buff.Passive.pVi)
        if(tViIndex == "push") {
            log[turn].Buff.Passive.pVi.push(status.Buff.Passive.pVi)
        }else if(typeof tViIndex === "number"){
            log[turn].Buff.Passive.pVi.splice(tViIndex, 0, status.Buff.Passive.pVi)
        }else {
            console.log("totalDa insert errer")
        }
    }());
}

const indexSeaech = (data:number, array:number[]):number | string => {
    for(let i = 0; i < array.length; i++) {
        if(array[i] <= data) {
            return i
        }
    }
    return "push";
}

// データのセット
export let passiveSkills: types.passive[] = [];
export let fesIdols: types.fesIdol[] = [];
export let detailSetting: types.detail;
export const setData = (passive: types.passive[], fesIdol: types.fesIdol[], detail: types.detail) => {
    passiveSkills = passive;
    fesIdols = fesIdol;
    detailSetting = detail;
    staticStatus.Vo = 0;
    staticStatus.Da = 0;
    staticStatus.Vi = 0;
    staticStatus.Me = 0;
    for (let i = 0; i < fesIdol.length; i++) {
        staticStatus.Vo += fesIdols[i].Status.VoValue;
        staticStatus.Da += fesIdols[i].Status.DaValue;
        staticStatus.Vi += fesIdols[i].Status.ViValue;
        staticStatus.Me += fesIdols[i].Status.MeValue;
    }
}
