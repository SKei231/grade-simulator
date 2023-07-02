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
    Mode: "Bad" | "Normal" | "Good" | "Perfect",
    Ratio: number,
    Buff: {
        Vo: number,
        Da: number,
        Vi: number,
        Passive: {
            pVo: number,
            pDa: number,
            pVi: number
        }
    },
    AppealUp: number,
    isMemory: boolean
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
        // バフのみ起動
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
        
        // アピール
        let value = liveSkillAppeal[ID].value(Value, Ratio);
        if(Attribute == 'Vo') {
            let basicFactor = calcBasicFactor(basicStatus.Vo, buffs.Vo);
            if(ID == 10) {
                basicFactor = calcBasicFactor(basicStatus.Vo, buffs.Vo - buffs.Passive.pVo);
            }
            return pushResult(Math.floor(basicFactor * value) * 2, Math.floor(basicFactor * value), Math.floor(basicFactor * value));
        }else if(Attribute == 'Da') {
            let basicFactor = calcBasicFactor(basicStatus.Da, buffs.Da);
            if(ID == 10) {
                basicFactor = calcBasicFactor(basicStatus.Da, buffs.Da - buffs.Passive.pDa);
            }
            return pushResult(Math.floor(basicFactor * value), Math.floor(basicFactor * value) * 2, Math.floor(basicFactor * value));
        }else if(Attribute == 'Vi') {
            let basicFactor = calcBasicFactor(basicStatus.Vi, buffs.Vi);
            if(ID == 10) {
                basicFactor = calcBasicFactor(basicStatus.Vi, buffs.Vi - buffs.Passive.pVi);
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
        // for(let i = 0; i < vault.fesIdols[appealIdol.value].LiveSkill[liveSkillIndex.value].Appeal.length; i++) {
        //     let value = liveSkillAppeal[findByAppealID(vault.fesIdols[appealIdol.value].LiveSkill[liveSkillIndex.value].Appeal[i].aID)].value(vault.fesIdols[appealIdol.value].LiveSkill[liveSkillIndex.value].Appeal[i].aValue, Ratio);
        //     if(vault.fesIdols[appealIdol.value].LiveSkill[liveSkillIndex.value].Appeal[i].aAttribute == 'Vo') {
        //         const basicStatus = vault.fesIdols[appealIdol.value].Status.VoValue * 1.5 + vault.staticStatus.Vo * 0.5;
        //         let basicFactor = calcBasicFactor(basicStatus, buffs.Vo);
        //         if(vault.fesIdols[appealIdol.value].LiveSkill[liveSkillIndex.value].Appeal[i].aID == 10) {
        //         basicFactor = calcBasicFactor(basicStatus, buffs.Vo - buffs.Passive.Vo);
        //         }
        //         VoAppeal.value += Math.floor(basicFactor * value) * 2;
        //         DaAppeal.value += Math.floor(basicFactor * value);
        //         ViAppeal.value += Math.floor(basicFactor * value);
        //     }else if(vault.fesIdols[appealIdol.value].LiveSkill[liveSkillIndex.value].Appeal[i].aAttribute == 'Da') {
        //         const basicStatus = vault.fesIdols[appealIdol.value].Status.DaValue * 1.5 + vault.staticStatus.Da * 0.5;
        //         let basicFactor = calcBasicFactor(basicStatus, buffs.Da);
        //         if(vault.fesIdols[appealIdol.value].LiveSkill[liveSkillIndex.value].Appeal[i].aID == 10) {
        //         basicFactor = calcBasicFactor(basicStatus, buffs.Da - buffs.Passive.Da);
        //         }
        //         VoAppeal.value += Math.floor(basicFactor * value);
        //         DaAppeal.value += Math.floor(basicFactor * value) * 2;
        //         ViAppeal.value += Math.floor(basicFactor * value);
        //     }else if(vault.fesIdols[appealIdol.value].LiveSkill[liveSkillIndex.value].Appeal[i].aAttribute == 'Vi') {
        //         const basicStatus = vault.fesIdols[appealIdol.value].Status.ViValue * 1.5 + vault.staticStatus.Vi * 0.5;
        //         let basicFactor = calcBasicFactor(basicStatus, buffs.Vi);
        //         if(vault.fesIdols[appealIdol.value].LiveSkill[liveSkillIndex.value].Appeal[i].aID == 10) {
        //         basicFactor = calcBasicFactor(basicStatus, buffs.Vi - buffs.Passive.Vi);
        //         }
        //         VoAppeal.value += Math.floor(basicFactor * value);
        //         DaAppeal.value += Math.floor(basicFactor * value);
        //         ViAppeal.value += Math.floor(basicFactor * value) * 2;
        //     }else if(vault.fesIdols[appealIdol.value].LiveSkill[liveSkillIndex.value].Appeal[i].aAttribute == 'Excellent') {
        //         let basicStatus = vault.fesIdols[appealIdol.value].Status.VoValue * 1.5 + vault.staticStatus.Vo * 0.5;
        //         let basicFactor = calcBasicFactor(basicStatus, buffs.Vo);
        //         VoAppeal.value += Math.floor(basicFactor * value) * 2;
        //         basicStatus = vault.fesIdols[appealIdol.value].Status.DaValue * 1.5 + vault.staticStatus.Da * 0.5;
        //         basicFactor = calcBasicFactor(basicStatus, buffs.Da);
        //         DaAppeal.value += Math.floor(basicFactor * value) * 2;
        //         basicStatus = vault.fesIdols[appealIdol.value].Status.ViValue * 1.5 + vault.staticStatus.Vi * 0.5;
        //         basicFactor = calcBasicFactor(basicStatus, buffs.Vi);
        //         ViAppeal.value += Math.floor(basicFactor * value) * 2;
        //     }
        // }
        // for(let i = 0; i < vault.fesIdols[appealIdol.value].LiveSkill[liveSkillIndex.value].Link.lAppeal.length; i++) {
        //     let value = liveSkillAppeal[findByAppealID(vault.fesIdols[appealIdol.value].LiveSkill[liveSkillIndex.value].Link.lAppeal[i].laID)].value(vault.fesIdols[appealIdol.value].LiveSkill[liveSkillIndex.value].Link.lAppeal[i].laValue, Ratio);
        //     if(vault.fesIdols[appealIdol.value].LiveSkill[liveSkillIndex.value].Link.lAppeal[i].laAttribute == 'Vo') {
        //         const basicStatus = vault.fesIdols[appealIdol.value].Status.VoValue * 1.5 + vault.staticStatus.Vo * 0.5;
        //         let basicFactor = calcBasicFactor(basicStatus, buffs.Vo);
        //         if(vault.fesIdols[appealIdol.value].LiveSkill[liveSkillIndex.value].Appeal[i].aID == 10) {
        //         basicFactor = calcBasicFactor(basicStatus, buffs.Vo - buffs.Passive.Vo);
        //         }
        //         VoAppeal.value += Math.floor(basicFactor * value) * 2;
        //         DaAppeal.value += Math.floor(basicFactor * value);
        //         ViAppeal.value += Math.floor(basicFactor * value);
        //     }else if(vault.fesIdols[appealIdol.value].LiveSkill[liveSkillIndex.value].Link.lAppeal[i].laAttribute == 'Da') {
        //         const basicStatus = vault.fesIdols[appealIdol.value].Status.DaValue * 1.5 + vault.staticStatus.Da * 0.5;
        //         let basicFactor = calcBasicFactor(basicStatus, buffs.Da);
        //         if(vault.fesIdols[appealIdol.value].LiveSkill[liveSkillIndex.value].Appeal[i].aID == 10) {
        //         basicFactor = calcBasicFactor(basicStatus, buffs.Da - buffs.Passive.Da);
        //         }
        //         VoAppeal.value += Math.floor(basicFactor * value);
        //         DaAppeal.value += Math.floor(basicFactor * value) * 2;
        //         ViAppeal.value += Math.floor(basicFactor * value);
        //     }else if(vault.fesIdols[appealIdol.value].LiveSkill[liveSkillIndex.value].Link.lAppeal[i].laAttribute == 'Vi') {
        //         const basicStatus = vault.fesIdols[appealIdol.value].Status.ViValue * 1.5 + vault.staticStatus.Vi * 0.5;
        //         let basicFactor = calcBasicFactor(basicStatus, buffs.Vi);
        //         if(vault.fesIdols[appealIdol.value].LiveSkill[liveSkillIndex.value].Appeal[i].aID == 10) {
        //         basicFactor = calcBasicFactor(basicStatus, buffs.Vi - buffs.Passive.Vi);
        //         }
        //         VoAppeal.value += Math.floor(basicFactor * value);
        //         DaAppeal.value += Math.floor(basicFactor * value);
        //         ViAppeal.value += Math.floor(basicFactor * value) * 2;
        //     }else if(vault.fesIdols[appealIdol.value].LiveSkill[liveSkillIndex.value].Link.lAppeal[i].laAttribute == 'Excellent') {
        //         let basicStatus = vault.fesIdols[appealIdol.value].Status.VoValue * 1.5 + vault.staticStatus.Vo * 0.5;
        //         let basicFactor = calcBasicFactor(basicStatus, buffs.Vo);
        //         VoAppeal.value += Math.floor(basicFactor * value) * 2;
        //         basicStatus = vault.fesIdols[appealIdol.value].Status.DaValue * 1.5 + vault.staticStatus.Da * 0.5;
        //         basicFactor = calcBasicFactor(basicStatus, buffs.Da);
        //         DaAppeal.value += Math.floor(basicFactor * value) * 2;
        //         basicStatus = vault.fesIdols[appealIdol.value].Status.ViValue * 1.5 + vault.staticStatus.Vi * 0.5;
        //         basicFactor = calcBasicFactor(basicStatus, buffs.Vi);
        //         ViAppeal.value += Math.floor(basicFactor * value) * 2;
        //     }
        // }
    }
}