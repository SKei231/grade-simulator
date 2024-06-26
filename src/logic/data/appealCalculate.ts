import * as vault from "../event/vault"
import { liveSkillAppeal } from './skillEffect';


/**
 * @param AppealIdolIndex アピールアイドルのIndex
 * @param ID アピールID
 * @param Value アピールValue
 * @param Attribute アピール属性
 * @param Buff 総合バフ
 * @param AppealUp アピールUP合計
 * @param isMemory true:思い出 false:ライブスキル
 */
export const appealCalculation = (
    AppealIdolIndex: number,
    ID: number,
    Value: number,
    Attribute: "Vo" | "Da" | "Vi" | "Excellent",
    Mode: 'Bad' | 'Normal' | 'Good' | 'Perfect',
    Ratio: number,
    Buff: {
        Vo: number,
        Da: number,
        Vi: number,
        Passive: {
            Vo: number,
            Da: number,
            Vi: number
        }
    },
    AppealUp: number,
    isMemory: boolean,
    isExtra: boolean
    ): {Vo:number, Da:number, Vi:number} => {
    let buffs = Buff
    let result: [{ Vo: number, Da: number, Vi: number }];
    const modeNumber = () => {
        if(Mode == "Bad") {
            return 0.5;
        }else if(Mode == "Normal") {
            return 1.0;
        }else if(Mode == "Good") {
            return 1.1;
        }else {
            return 1.5;
        }
    }
    /**
     * アピール判定係数
     */
    let mode = modeNumber();
    const calcBasicFactor = (status: number, buff: number) => {
        return Math.floor(status * (1 + ((buff + AppealUp) / 100)) * mode);
    }
    const pushResult = (Vo: number, Da: number, Vi: number) => {
        return {Vo,Da,Vi};
        // result.push({Vo,Da,Vi});
    }
    const basicStatus = {
        Vo: vault.fesIdols[AppealIdolIndex].Status.VoValue * 1.5 + vault.staticStatus.Vo * 0.5,
        Da: vault.fesIdols[AppealIdolIndex].Status.DaValue * 1.5 + vault.staticStatus.Da * 0.5,
        Vi: vault.fesIdols[AppealIdolIndex].Status.ViValue * 1.5 + vault.staticStatus.Vi * 0.5
    }
    if(isMemory) {
        let basicRatio = 0;
        if(vault.fesIdols[4].MemorieLevel == 5) {
            basicRatio = 2;
        }else if(vault.fesIdols[4].MemorieLevel == 4) {
            basicRatio = 1.4;
        }else if(vault.fesIdols[4].MemorieLevel == 3) {
            basicRatio = 1.2;
        }else if(vault.fesIdols[4].MemorieLevel == 2) {
            basicRatio = 1;
        }else if(vault.fesIdols[4].MemorieLevel == 1) {
            basicRatio = 0.8;
        }
        let othersMLevelRatio = 0;
        for(let i = 0; i < 4; i++) {
            if(vault.fesIdols[i].MemorieLevel == 5) {
                othersMLevelRatio += 0.075;
            }else if(vault.fesIdols[i].MemorieLevel == 4) {
                othersMLevelRatio += 0.05;
            }else if(vault.fesIdols[i].MemorieLevel == 3) {
                othersMLevelRatio += 0.03;
            }else if(vault.fesIdols[i].MemorieLevel == 2) {
                othersMLevelRatio += 0.02;
            }
        }

        // 本体アピール
        let memoryVo = Math.floor(Math.floor(Math.floor(basicStatus.Vo * (1 + (buffs.Vo + AppealUp) / 100) * mode) * basicRatio) * othersMLevelRatio);
        let memoryDa = Math.floor(Math.floor(Math.floor(basicStatus.Da * (1 + (buffs.Da + AppealUp) / 100) * mode) * basicRatio) * othersMLevelRatio);
        let memoryVi = Math.floor(Math.floor(Math.floor(basicStatus.Vi * (1 + (buffs.Vi + AppealUp) / 100) * mode) * basicRatio) * othersMLevelRatio);
        return pushResult((memoryVo * 2) + memoryDa + memoryVi, memoryVo + (memoryDa * 2) + memoryVi, memoryVo + memoryDa + (memoryVi * 2));
    }else {
        if(isExtra) {
            // バフのみ仮起動
            for(let i = 0; i < vault.fesIdols[4].MemoryAppeal.mEffect.length; i++) {
                if(vault.fesIdols[4].MemoryAppeal.mEffect[i].meID == 18 || vault.fesIdols[4].MemoryAppeal.mEffect[i].meID == 19 || vault.fesIdols[4].MemoryAppeal.mEffect[i].meID == 21) {
                    if(vault.fesIdols[4].MemoryAppeal.mEffect[i].meNote == 'Vo') {
                        buffs.Vo += vault.fesIdols[4].MemoryAppeal.mEffect[i].meValue;
                    }
                    if(vault.fesIdols[4].MemoryAppeal.mEffect[i].meNote == 'Da') {
                        buffs.Da += vault.fesIdols[4].MemoryAppeal.mEffect[i].meValue;
                    }
                    if(vault.fesIdols[4].MemoryAppeal.mEffect[i].meNote == 'Vi') {
                        buffs.Vi += vault.fesIdols[4].MemoryAppeal.mEffect[i].meValue;
                    }
                }else if(vault.fesIdols[4].MemoryAppeal.mEffect[i].meID == 20) {
                    if(vault.fesIdols[4].MemoryAppeal.mEffect[i].meNote == 'Vo') {
                        buffs.Vo -= vault.fesIdols[4].MemoryAppeal.mEffect[i].meValue;
                    }
                    if(vault.fesIdols[4].MemoryAppeal.mEffect[i].meNote == 'Da') {
                        buffs.Da -= vault.fesIdols[4].MemoryAppeal.mEffect[i].meValue;
                    }
                    if(vault.fesIdols[4].MemoryAppeal.mEffect[i].meNote == 'Vi') {
                        buffs.Vi -= vault.fesIdols[4].MemoryAppeal.mEffect[i].meValue;
                    }
                }
            }
        }
        
        // アピール
        let value = liveSkillAppeal[ID].value(Value, Ratio);
        if(Attribute == 'Vo') {
            let basicFactor = calcBasicFactor(basicStatus.Vo, buffs.Vo);
            if(ID == 10) {
                basicFactor = calcBasicFactor(basicStatus.Vo, buffs.Vo - buffs.Passive.Vo);
            }
            return pushResult(Math.floor(basicFactor * value) * 2, Math.floor(basicFactor * value), Math.floor(basicFactor * value));
        }else if(Attribute == 'Da') {
            let basicFactor = calcBasicFactor(basicStatus.Da, buffs.Da);
            if(ID == 10) {
                basicFactor = calcBasicFactor(basicStatus.Da, buffs.Da - buffs.Passive.Da);
            }
            return pushResult(Math.floor(basicFactor * value), Math.floor(basicFactor * value) * 2, Math.floor(basicFactor * value));
        }else if(Attribute == 'Vi') {
            let basicFactor = calcBasicFactor(basicStatus.Vi, buffs.Vi);
            if(ID == 10) {
                basicFactor = calcBasicFactor(basicStatus.Vi, buffs.Vi - buffs.Passive.Vi);
            }
            return pushResult(Math.floor(basicFactor * value), Math.floor(basicFactor * value), Math.floor(basicFactor * value) * 2);
        }else if(Attribute == 'Excellent') {
            let basicFactor = Math.floor(basicStatus.Vo * (1 + ((buffs.Vo + AppealUp) / 100)) * mode);
            const ExResultVo = Math.floor(basicFactor * value) * 2;
            basicFactor = Math.floor(basicStatus.Da * (1 + ((buffs.Da + AppealUp) / 100)) * mode);
            const ExResultDa = Math.floor(basicFactor * value) * 2;
            basicFactor = Math.floor(basicStatus.Vi * (1 + ((buffs.Vi + AppealUp) / 100)) * mode);
            const ExResultVi = Math.floor(basicFactor * value) * 2;
            return pushResult(ExResultVo, ExResultDa, ExResultVi);
        }else {
            console.log("appeal calc error");
            return pushResult(0,0,0);
        }
    }
}